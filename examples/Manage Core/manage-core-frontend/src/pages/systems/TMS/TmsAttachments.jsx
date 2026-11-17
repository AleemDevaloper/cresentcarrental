import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, listTaskAttachments, uploadTaskAttachment, deleteTaskAttachment, getTaskAttachmentDownloadUrl } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPaperclip, 
  faCloudUploadAlt, 
  faFileAlt, 
  faFilePdf, 
  faFileImage,
  faFileArchive,
  faTrash,
  faDownload,
  faExternalLinkAlt,
  // faTasks
} from "@fortawesome/free-solid-svg-icons";

const TmsAttachments = () => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedTaskForUpload, setSelectedTaskForUpload] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
      } catch (err) {
        addNotification("Failed to load projects.", "danger");
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasksAndAttachments = async () => {
      setLoading(true);
      try {
        const taskData = selectedProject
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        setTasks(taskData);
        if (taskData.length > 0) {
            const allAttachments = await Promise.all(taskData.map(t => listTaskAttachments(t.id)));
            setAttachments(allAttachments.flat());
        } else {
            setAttachments([]);
        }
      } catch (err) {
        console.error("Failed to load tasks/attachments", err);
        addNotification("Failed to load data.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchTasksAndAttachments();
  }, [selectedProject]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedTaskForUpload) {
        addNotification("Please select a task and a file.", "warning");
        return;
    }

    setUploading(true);
    try {
      const created = await uploadTaskAttachment(selectedTaskForUpload, file);
      setAttachments(prev => [created, ...prev]);
      addNotification("File uploaded successfully.", "success");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Upload failed.";
      addNotification(message, "danger");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this attachment?")) {
      try {
        await deleteTaskAttachment(id);
        setAttachments(prev => prev.filter(a => a.id !== id));
        addNotification("File deleted.", "success");
      } catch (err) {
        addNotification("Delete failed.", "danger");
      }
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return faFilePdf;
    if (type?.includes('image')) return faFileImage;
    if (type?.includes('zip') || type?.includes('rar')) return faFileArchive;
    return faFileAlt;
  };

  const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="card-header p-0 border-0">
          <div className="p-4 p-lg-5 text-white rounded" style={{ background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div className="d-flex align-items-center gap-4">
                <div className="bg-white bg-opacity-20 p-3 rounded-4 shadow-sm">
                  <FontAwesomeIcon icon={faPaperclip} className="fs-3" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1">File Attachments</h3>
                  <p className="mb-0 opacity-75">Centralized digital asset management for project documentation.</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                  <select 
                    className="form-select border-0 rounded-pill px-4 shadow-sm small"
                    style={{ width: '200px' }}
                    value={selectedTaskForUpload}
                    onChange={(e) => setSelectedTaskForUpload(e.target.value)}
                  >
                      <option value="">Select task to upload</option>
                      {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                  <label className={`btn btn-white rounded-pill px-5 py-3 fw-bold shadow-lg transition hover-lift ${!selectedTaskForUpload || uploading ? 'disabled opacity-50' : ''}`}>
                    <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" />
                    {uploading ? 'Uploading...' : 'Upload Asset'}
                    <input type="file" className="d-none" onChange={handleFileUpload} disabled={!selectedTaskForUpload || uploading} />
                  </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-lg-5">
          <div className="row g-4">
              {/* Asset Explorer */}
              <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold text-dark mb-0">Central Project Assets</h6>
                      <select 
                        className="form-select border shadow-none rounded-pill px-4 bg-light fw-medium small" 
                        style={{ width: '220px' }}
                        value={selectedProject || ''} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                      >
                        <option value="">All Tasks</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                  </div>

                  {loading ? (
                      <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
                  ) : (
                      <div className="row g-4">
                          {attachments.map(file => (
                              <div key={file.id} className="col-xl-4 col-md-6">
                                  <div className="card border-2 border-light shadow-none rounded-4 p-4 transition hover-lift bg-light bg-opacity-30">
                                      <div className="d-flex align-items-center gap-4">
                                          <div className="bg-white p-3 rounded-4 shadow-sm">
                                              <FontAwesomeIcon icon={getFileIcon(file.file_type)} className="fs-2 text-primary opacity-50" />
                                          </div>
                                          <div className="flex-grow-1 overflow-hidden">
                                              <div className="fw-bold text-dark text-truncate mb-1">{file.file_name}</div>
                                              <div className="x-small text-muted fw-bold text-uppercase">{formatSize(file.file_size)} • {file.file_type?.split('/')[1] || 'FILE'}</div>
                                          </div>
                                      </div>
                                      <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-light">
                                          <div className="x-small text-muted fw-bold text-truncate" style={{ maxWidth: '150px' }}>By {file.user?.name || 'System'}</div>
                                          <div className="d-flex gap-2">
                                              <a href={getTaskAttachmentDownloadUrl(file.id)} className="btn btn-icon btn-white rounded-circle shadow-sm x-small" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faDownload} /></a>
                                              <button className="btn btn-icon btn-white rounded-circle shadow-sm x-small text-danger" onClick={() => handleDelete(file.id)}><FontAwesomeIcon icon={faTrash} /></button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                          {attachments.length === 0 && <div className="col-12 text-center py-5 text-muted">No attachments found.</div>}
                      </div>
                  )}
              </div>
          </div>
        </div>
      </div>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 10px; }
        .btn-white { background: white; border: none; }
        .btn-icon { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
        .transition { transition: all 0.2s; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; }
      `}</style>
    </div>
  );
};

export default TmsAttachments;
