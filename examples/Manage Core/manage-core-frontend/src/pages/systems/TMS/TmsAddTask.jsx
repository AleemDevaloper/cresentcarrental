import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { createTask, updateTask } from '../../../api/pms';
import { listUsers } from '../../../api/users';
import { uploadTaskAttachment } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTasks, 
  faUser, 
  faCalendarAlt, 
  faFlag,
  faAlignLeft,
  faArrowLeft,
  faMagic,
  faRocket,
  faLayerGroup,
  faCircleCheck,
  faCloudUploadAlt,
  faFile,
  faFilePdf,
  faFileImage,
  faFileArchive,
  faFileAlt,
  faXmark,
  faPaperclip
} from "@fortawesome/free-solid-svg-icons";
import { EnableDisableButton } from '../../../components/common';

const TmsAddTask = () => {
  const { addNotification, setActiveTab, editTask, setEditTask, showErrorDialog, theme } = useApp();
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isProjectEnabled, setIsProjectEnabled] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    priority: 'Medium',
    status: 'To Do',
    due_date: ''
  });

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        description: editTask.description || '',
        project_id: editTask.project_id || '',
        assigned_to: editTask.assigned_to || '',
        priority: editTask.priority || 'Medium',
        status: editTask.status || 'To Do',
        due_date: editTask.due_date ? editTask.due_date.split('T')[0] : ''
      });
      setIsProjectEnabled(!!editTask.project_id);
    } else {
      setFormData({
        title: '',
        description: '',
        project_id: '',
        assigned_to: '',
        priority: 'Medium',
        status: 'To Do',
        due_date: ''
      });
      setIsProjectEnabled(true);
    }
  }, [editTask]);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return faFilePdf;
    if (type?.includes('image')) return faFileImage;
    if (type?.includes('zip') || type?.includes('rar')) return faFileArchive;
    return faFileAlt;
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#6366f1';
    e.currentTarget.style.background = isDark ? '#1e293b' : '#f8fafc';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0';
    e.currentTarget.style.background = isDark ? '#1e293b' : 'white';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0';
    e.currentTarget.style.background = isDark ? '#1e293b' : 'white';
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Reactive synchronization for project integration
  useEffect(() => {
    if (!editTask) {
      if (!isProjectEnabled) {
        setFormData(prev => ({ ...prev, project_id: '' }));
      } else if (projects.length > 0 && !formData.project_id) {
        setFormData(prev => ({ ...prev, project_id: projects[0].id }));
      }
    }
  }, [isProjectEnabled, projects, editTask]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projData, userData] = await Promise.all([listProjects(), listUsers()]);
        setProjects(projData);
        setUsers(userData);
      } catch (err) {
        console.error("Failed to fetch data", err);
        showErrorDialog("Data Load Error", "Failed to load required data. Please check your connection and try again.", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isProjectEnabled && !formData.project_id) {
      addNotification("Please select a project.", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.due_date) delete payload.due_date;
      if (!payload.assigned_to) delete payload.assigned_to;
      
      if (!isProjectEnabled) delete payload.project_id;

      if (editTask) {
        await updateTask(editTask.id, payload);

        if (selectedFiles.length > 0) {
          for (const file of selectedFiles) {
            try {
              await uploadTaskAttachment(editTask.id, file);
            } catch (err) {
              console.warn("Upload skipped for", file.name, "- server may not support file uploads");
            }
          }
        }

        addNotification("Task updated successfully!", "success");
      } else {
        const effectiveProjectId = isProjectEnabled ? formData.project_id : null;
        if (!isProjectEnabled) delete payload.project_id;
        
        const newTask = await createTask(effectiveProjectId, payload);

        if (selectedFiles.length > 0) {
          const localAttachments = JSON.parse(localStorage.getItem('tms_attachments') || '{}');
          localAttachments[newTask.id] = selectedFiles.map((f, i) => ({
            id: Date.now() + i,
            file_name: f.name,
            file_size: f.size,
            file_type: f.type,
            _local: true,
            _url: URL.createObjectURL(f)
          }));
          localStorage.setItem('tms_attachments', JSON.stringify(localAttachments));

          for (const file of selectedFiles) {
            try {
              await uploadTaskAttachment(newTask.id, file);
            } catch (err) {
              console.warn("Upload skipped for", file.name, "- server may not support file uploads");
            }
          }
        }

        addNotification("Task created successfully!", "success");
      }
      
      setFormData({
        title: '',
        description: '',
        project_id: projects.length > 0 && isProjectEnabled ? projects[0].id : '',
        assigned_to: '',
        priority: 'Medium',
        status: 'To Do',
        due_date: ''
      });
      setSelectedFiles([]);
      setEditTask(null);
      
      setTimeout(() => setActiveTab('tms_tasks'), 1000);
    } catch (err) {
      console.error("Failed to save task", err);
      const detailMsg = err.response?.data?.message || err.message || "Failed to save task.";
      const errDetails = err.response?.data?.errors ? JSON.stringify(err.response.data.errors, null, 2) : (err.response?.data?.error || '');
      showErrorDialog("Task Save Failed", detailMsg, errDetails);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`d-flex justify-content-center align-items-center ${isDark ? 'bg-dark' : ''}`} style={{ height: '400px', background: isDark ? '#0f172a' : 'transparent' }}>
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-fluid py-5 fade-in ${isDark ? 'dark-mode' : ''}`}>
      <div className="row justify-content-center">
        <div className="col-xl-12 col-lg-12">
          <div className={`card border-0 main-form-card overflow-hidden ${isDark ? 'bg-dark-card border-white border-opacity-10' : ''}`}>
            {/* Minimalist Premium Header */}
            <div className="hero-header p-4 p-md-5 d-flex flex-column gap-4 rounded-5">
                <div className="d-flex justify-content-between align-items-center">
                    <button 
                        type="button" 
                        className="back-btn"
                        onClick={() => { setEditTask(null); setActiveTab('tms_tasks'); }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Back to Board</span>
                    </button>
                    <div className="system-tag">
                        <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                        TMS V2.0
                    </div>
                </div>

                <div className="hero-content d-flex align-items-center gap-4">
                    <div className="hero-icon-box">
                        <FontAwesomeIcon icon={faRocket} />
                    </div>
                    <div>
                        <h2 className="hero-title">{editTask ? 'Edit Task' : 'Create New Task'}</h2>
                        <p className="hero-subtitle">{editTask ? 'Modify task details, update assignments, and refine objectives.' : 'Designate responsibilities and define objectives for your team.'}</p>
                    </div>
                </div>
            </div>

            {/* Unified Form Body */}
            <div className={`card-body p-4 p-md-5 ${isDark ? 'bg-dark-card' : ''}`}>
              <form onSubmit={handleSubmit} className="perfect-form">
                <div className="row g-5">
                  {/* Left Column: Primary Info */}
                  <div className="col-lg-7">
                    <div className="form-group mb-5">
                        <label className="perfect-label">What is the task name?</label>
                        <div className="input-wrapper">
                            <FontAwesomeIcon icon={faTasks} className="input-icon ps-2" />
                            <input 
                                type="text" 
                                className="perfect-input rounded-3" 
                                placeholder="e.g., Design System Update"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-0">
                        <label className="perfect-label">Detailed Description</label>
                        <div className="input-wrapper align-items-start">
                            <FontAwesomeIcon icon={faAlignLeft} className="input-icon mt-3 ms-2" />
                            <textarea 
                                className="perfect-input perfect-textarea " 
                                placeholder="Describe the scope and deliverables..."
                                rows="6"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            ></textarea>
                        </div>
                    </div>
                  </div>

                  {/* Right Column: Configuration */}
                  <div className="col-lg-5">
                    <div className="config-box p-4 rounded-4 h-100">
                        <div className="form-group mb-4">
                            <div className="mb-2 p-0 d-flex align-items-center justify-content-between">
                                <label className="perfect-label small mb-0" htmlFor="projectIntegrationSwitch">Project Integration</label>
                                <EnableDisableButton
                                    checked={isProjectEnabled}
                                    onClick={() => setIsProjectEnabled(!isProjectEnabled)}
                                    label="Project Integration"
                                    size="small"
                                />
                            </div>
                            <div className="mb-3">
                                <span className={`badge rounded-pill px-3 py-1 fw-bold ${isProjectEnabled ? 'bg-primary-subtle text-primary' : `${isDark ? 'bg-dark border-white border-opacity-10 text-muted' : 'bg-light text-muted border'}`}`} style={{ fontSize: '10px' }}>
                                    {isProjectEnabled ? 'ENABLED' : 'DISABLED'}
                                </span>
                            </div>
                            
                            {isProjectEnabled && (
                                <div className="input-wrapper-sml fade-in">
                                    <FontAwesomeIcon icon={faFlag} className="input-icon-sml" />
                                    <select 
                                        className="perfect-select" 
                                        required={isProjectEnabled}
                                        value={formData.project_id}
                                        onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                                    >
                                        <option value="">Select a project</option>
                                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {!isProjectEnabled && (
                                <div className={`p-3 rounded-3 ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'} border border-dashed text-center fade-in`}>
                                    <span className="text-muted small">Task will be created without project association.</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group mb-4">
                            <label className="perfect-label small">Assign Responsibility</label>
                            <div className="input-wrapper-sml">
                                <FontAwesomeIcon icon={faUser} className="input-icon-sml" />
                                <select 
                                    className="perfect-select" 
                                    value={formData.assigned_to}
                                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                                >
                                    <option value="">Choose an assignee</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="perfect-label small">Deadline</label>
                            <div className="input-wrapper-sml">
                                <FontAwesomeIcon icon={faCalendarAlt} className="input-icon-sml" />
                                <input 
                                    type="date" 
                                    className="perfect-input-sml" 
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group mb-0">
                            <label className="perfect-label small">Priority Level</label>
                            <div className="priority-grid mt-2">
                                {['Low', 'Medium', 'High', 'Critical'].map(prio => (
                                    <button
                                        key={prio}
                                        type="button"
                                        className={`prio-pill ${formData.priority === prio ? `prio-${prio.toLowerCase()} active` : ''}`}
                                        onClick={() => setFormData({...formData, priority: prio})}
                                    >
                                        {prio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group mt-4">
                            <label className="perfect-label small">Attachments</label>
                            <div className={`file-upload-zone rounded-4 p-3 text-center border border-dashed ${isDark ? 'bg-dark-card' : 'bg-white'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                <label className="d-flex flex-column align-items-center gap-2 cursor-pointer mb-0" style={{ cursor: 'pointer' }}>
                                    <div className="p-2 rounded-3 bg-primary bg-opacity-10">
                                        <FontAwesomeIcon icon={faCloudUploadAlt} className="text-primary fs-5" />
                                    </div>
                                    <span className="small fw-bold text-muted">Drop files here or click to browse</span>
                                    <span className="x-small text-muted">PDF, Images, Documents up to 10MB</span>
                                    <input type="file" className="d-none" multiple onChange={handleFileSelect} />
                                </label>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="d-flex flex-column gap-2 mt-3">
                                    {selectedFiles.map((file, idx) => (
                                        <div key={idx} className={`d-flex align-items-center gap-2 ${isDark ? 'bg-dark border-white border-opacity-10' : 'bg-light'} rounded-3 px-3 py-2`}>
                                            <FontAwesomeIcon icon={getFileIcon(file.type)} className="text-primary" style={{ fontSize: '0.85rem' }} />
                                            <div className="flex-grow-1 min-w-0">
                                                <div className="small fw-bold text-truncate">{file.name}</div>
                                                <div className="x-small text-muted">{formatSize(file.size)}</div>
                                            </div>
                                            <button type="button" className="btn btn-icon btn-light rounded-circle border-0" onClick={() => removeFile(idx)} style={{ width: '26px', height: '26px', padding: 0 }}>
                                                <FontAwesomeIcon icon={faXmark} className="text-danger" style={{ fontSize: '0.7rem' }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="col-12 mt-5 border-top pt-5 d-flex justify-content-end gap-3 align-items-center">
                    <span className="text-muted small me-auto d-none d-md-inline d-flex align-items-center gap-2">
                        {selectedFiles.length > 0 && (
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 fw-bold">
                                <FontAwesomeIcon icon={faPaperclip} className="me-1" />
                                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                            </span>
                        )}
                        <FontAwesomeIcon icon={faMagic} className="text-primary opacity-50" />
                        Smart Assignment logic will be applied.
                    </span>
                    <button 
                        type="button" 
                        className="btn-perfect-secondary" 
                        onClick={() => { setEditTask(null); setActiveTab('tms_tasks'); }}
                    >
                        Discard
                    </button>
                    <button 
                        type="submit" 
                        className="btn-perfect-primary" 
                        disabled={saving}
                    >
                        {saving ? 'Syncing...' : editTask ? 'Update Task' : 'Initialize Task'}
                        <FontAwesomeIcon icon={faCircleCheck} className="ms-2" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .${isDark ? 'dark-page-bg' : 'page-bg'} { background-color: ${isDark ? '#0f172a' : '#f8fafc'}; min-height: 100vh; }
        .main-form-card { 
            background: ${isDark ? '#1e293b' : 'white'}; 
            border-radius: 32px; 
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); 
            position: relative;
            z-index: 1;
        }

        .hero-header { 
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            position: relative;
            z-index: 2;
        }

        .hero-header::after {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
            z-index: -1;
            pointer-events: none;
        }

        .card-body {
            position: relative;
            z-index: 5;
            background: ${isDark ? '#1e293b' : 'white'};
        }

        .back-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: white;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s ease;
            z-index: 2;
        }
        .back-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateX(-3px); }

        .system-tag {
            background: #6366f1;
            padding: 6px 14px;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            z-index: 2;
        }

        .hero-icon-box {
            width: 72px;
            height: 72px;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border-radius: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            box-shadow: 0 15px 30px -5px rgba(79, 70, 229, 0.4);
            z-index: 2;
        }

        .hero-title { font-size: 2.25rem; font-weight: 800; margin-bottom: 4px; z-index: 2; letter-spacing: -0.02em; }
        .hero-subtitle { color: #94a3b8; margin-bottom: 0; font-size: 1.1rem; z-index: 2; }

        .perfect-label { 
            display: block; 
            font-weight: 700; 
            color: ${isDark ? '#e2e8f0' : '#1e293b'}; 
            margin-bottom: 12px; 
            font-size: 0.95rem; 
        }
        .perfect-label.small { font-size: 0.85rem; color: ${isDark ? '#94a3b8' : '#64748b'}; text-transform: uppercase; letter-spacing: 0.05em; }

        .input-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 0; color: #cbd5e1; font-size: 1.25rem; transition: color 0.2s ease; }
        
        .perfect-input {
            width: 100%;
            border: none;
            border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9'};
            padding: 12px 12px 12px 35px;
            font-size: 1.5rem;
            font-weight: 600;
            color: ${isDark ? '#f1f5f9' : '#1e293b'};
            transition: all 0.3s ease;
            outline: none;
            background: transparent;
        }
        .perfect-input::placeholder { color: #94a3b8; font-weight: 500; }
        .perfect-input:focus { border-color: #6366f1; }
        .perfect-input:focus ~ .input-icon { color: #6366f1; }

        .perfect-textarea { font-size: 1.1rem; border: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}; border-radius: 16px; padding: 15px 15px 15px 45px; background: ${isDark ? '#1e293b' : 'transparent'}; color: ${isDark ? '#f1f5f9' : '#1e293b'}; }
        .perfect-textarea:focus { border-color: #6366f1; background: ${isDark ? '#334155' : '#fff'}; }

        .config-box { background: ${isDark ? '#0f172a' : '#f8fafc'}; border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'}; }

        .input-wrapper-sml { position: relative; }
        .input-icon-sml { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: ${isDark ? '#64748b' : '#94a3b8'}; }
        
        .perfect-select, .perfect-input-sml {
            width: 100%;
            padding: 12px 12px 12px 40px;
            border-radius: 12px;
            border: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'};
            font-weight: 600;
            color: ${isDark ? '#e2e8f0' : '#334155'};
            outline: none;
            transition: all 0.2s ease;
            appearance: none;
            background: ${isDark ? '#1e293b' : 'white'};
        }
        .perfect-select:focus, .perfect-input-sml:focus { border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

        .priority-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .prio-pill {
            padding: 10px;
            border-radius: 10px;
            border: 2px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'};
            background: ${isDark ? '#1e293b' : 'white'};
            font-weight: 700;
            font-size: 0.85rem;
            color: ${isDark ? '#94a3b8' : '#64748b'};
            transition: all 0.2s ease;
        }
        .prio-pill:hover { border-color: ${isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}; color: ${isDark ? '#e2e8f0' : '#475569'}; }
        .prio-pill.active { color: white; border-color: transparent; }
        
        .prio-low.active { background: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .prio-medium.active { background: #8b5cf6; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); }
        .prio-high.active { background: #f59e0b; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
        .prio-critical.active { background: #ef4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }

        .btn-perfect-secondary {
            background: transparent;
            border: none;
            color: ${isDark ? '#94a3b8' : '#64748b'};
            font-weight: 700;
            padding: 14px 28px;
            transition: all 0.2s ease;
        }
        .btn-perfect-secondary:hover { color: ${isDark ? '#e2e8f0' : '#1e293b'}; transform: translateY(-1px); }

        .btn-perfect-primary {
            background: ${isDark ? '#6366f1' : '#1e293b'};
            color: white;
            border: none;
            padding: 14px 40px;
            border-radius: 14px;
            font-weight: 700;
            box-shadow: 0 10px 20px -5px rgba(30, 41, 59, 0.3);
            transition: all 0.3s ease;
        }
        .btn-perfect-primary:hover { background: ${isDark ? '#4f46e5' : '#0f172a'}; transform: translateY(-3px); box-shadow: 0 20px 30px -10px rgba(30, 41, 59, 0.4); }
        .btn-perfect-primary:disabled { opacity: 0.7; transform: none; }

        .file-upload-zone { border: 2px dashed ${isDark ? 'rgba(255,255,255,0.15)' : '#e2e8f0'}; transition: all 0.2s ease; }
        .file-upload-zone:hover { border-color: #6366f1; background: ${isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'}; }
        .cursor-pointer { cursor: pointer; }
        .btn-icon { width: 34px; height: 34px; padding: 0; display: inline-flex; align-items: center; justify-content: center; }

        @media (max-width: 991px) {
            .hero-title { font-size: 1.75rem; }
            .perfect-input { font-size: 1.25rem; }
        }
      `}</style>
    </div>
  );
};

export default TmsAddTask;
