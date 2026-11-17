import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, listTaskAttachments, listTrashedTasks, restoreTask, deleteTask, forceDeleteTask, bulkTaskAttachments } from '../../../api/tms';
import { updateTask } from '../../../api/pms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faSearch, 
  faFilter, 
  faEllipsisVertical, 
  faClock, 
  faCheckCircle,
  faCircleExclamation,
  faCalendarAlt,
  faUser,
  faGripVertical,
  faTasks,
  faTrashCan,
  faPaperclip,
  faFileImage,
  faFilePdf,
  faFileArchive,
  faFileAlt,
  faPenToSquare,
  faEye,
  faRotateLeft
} from "@fortawesome/free-solid-svg-icons";
import TaskDetailModal from './TaskDetailModal';

const TmsTasks = ({ initialTrash = false }) => {
  const { addNotification, setActiveTab, setEditTask, showErrorDialog, confirmDialog } = useApp();
  const [detailTask, setDetailTask] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban');
  const [taskAttachments, setTaskAttachments] = useState({});
  const [showTrash, setShowTrash] = useState(initialTrash);
  const [trashedTasks, setTrashedTasks] = useState([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return faFilePdf;
    if (type?.includes('image')) return faFileImage;
    if (type?.includes('zip') || type?.includes('rar')) return faFileArchive;
    return faFileAlt;
  };

  const getAttachmentsForTask = (taskId) => {
    const atts = taskAttachments[taskId];
    return Array.isArray(atts) ? atts : [];
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects({}, { skipAuthRedirect: true });
        setProjects(data);
        setSelectedProject(null);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        addNotification("Failed to load projects.", "danger");
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = selectedProject
          ? await listProjectTasks(selectedProject, { skipAuthRedirect: true })
          : await listAllTasks(null, { skipAuthRedirect: true });
        setTasks(data);

        const localAll = JSON.parse(localStorage.getItem('tms_attachments') || '{}');
        try {
          const grouped = await bulkTaskAttachments(data.map(t => t.id));
          Object.keys(localAll).forEach(taskId => {
            if (!grouped[taskId]) grouped[taskId] = [];
            grouped[taskId] = [...(grouped[taskId] || []), ...(localAll[taskId] || [])];
          });
          setTaskAttachments(grouped);
        } catch {
          setTaskAttachments(localAll);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        showErrorDialog("Task Load Error", "Failed to load tasks. Please try again.", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus }, { skipAuthRedirect: true });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      addNotification(`Task moved to ${newStatus}`, "success");
    } catch (err) {
      console.error("Failed to update task", err);
      addNotification("Failed to update status.", "danger");
    }
  };

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e, newStatus) => {
    const taskId = e.dataTransfer.getData("taskId");
    handleStatusChange(Number(taskId), newStatus);
  };

  const fetchTrashedTasks = async () => {
    setTrashLoading(true);
    try {
      const data = await listTrashedTasks({ skipAuthRedirect: true });
      setTrashedTasks(data);
    } catch (err) {
      showErrorDialog("Trash Load Error", "Failed to load trashed tasks.", err.message);
    } finally {
      setTrashLoading(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      await restoreTask(id, { skipAuthRedirect: true });
      setTrashedTasks(prev => prev.filter(t => t.id !== id));
      addNotification("Task restored successfully", "success");
    } catch (err) {
      showErrorDialog("Task Restore Failed", "An error occurred while restoring the task.", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(true);
      await deleteTask(id, { skipAuthRedirect: true });
      setTasks(prev => prev.filter(t => t.id !== id));
      setTaskAttachments(prev => {
        const newAtts = { ...prev };
        delete newAtts[id];
        return newAtts;
      });
      addNotification("Task moved to trash", "success");
    } catch (err) {
      showErrorDialog("Task Delete Failed", "An error occurred while moving the task to trash.", err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleForceDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete Permanently',
      message: 'This task will be permanently deleted and cannot be recovered. Are you sure?',
      variant: 'danger',
      confirmLabel: 'Yes, Delete Forever',
    });
    if (!confirmed) return;
    try {
      await forceDeleteTask(id, { skipAuthRedirect: true });
      setTrashedTasks(prev => prev.filter(t => t.id !== id));
      addNotification("Task permanently deleted", "success");
    } catch (err) {
      showErrorDialog("Permanent Delete Failed", "An error occurred while deleting the task permanently.", err.message);
    }
  };

  useEffect(() => {
    if (showTrash) fetchTrashedTasks();
  }, [showTrash]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'Critical': return { color: '#ef4444', bg: '#fef2f2', label: 'Critical' };
      case 'High': return { color: '#f59e0b', bg: '#fffbeb', label: 'High' };
      case 'Medium': return { color: '#8b5cf6', bg: '#f5f3ff', label: 'Medium' };
      case 'Low': return { color: '#10b981', bg: '#f0fdf4', label: 'Low' };
      default: return { color: '#64748b', bg: '#f8fafc', label: 'None' };
    }
  };

  const columns = [
    { id: 'To Do', title: 'To Do', icon: faClock, color: '#0ea5e9' },
    { id: 'In Progress', title: 'In Progress', icon: faCircleExclamation, color: '#f59e0b' },
    { id: 'Testing', title: 'Testing', icon: faFilter, color: '#8b5cf6' },
    { id: 'Done', title: 'Completed', icon: faCheckCircle, color: '#10b981' }
  ];

  if (initialTrash) {
    return (
      <div className="container-fluid py-4 fade-in">
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mt-4">
          <div className="card-header bg-danger bg-opacity-10 border-0 p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-danger bg-opacity-20 p-2 rounded-3"><FontAwesomeIcon icon={faTrashCan} className="text-danger" /></div>
              <div>
                <h5 className="fw-bold mb-0">Trash</h5>
                <p className="text-muted small mb-0">Deleted tasks can be restored from here</p>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            {trashLoading ? (
              <div className="text-center py-4"><div className="spinner-border text-danger" role="status" /></div>
            ) : trashedTasks.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <FontAwesomeIcon icon={faTrashCan} className="fs-1 opacity-25 mb-3" />
                <p className="mb-0">Trash is empty</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="text-muted small text-uppercase letter-spacing-1">
                    <tr><th>Task</th><th>Project</th><th>Deleted</th><th className="text-end">Action</th></tr>
                  </thead>
                  <tbody>
                    {trashedTasks.map(t => (
                      <tr key={t.id}>
                        <td className="fw-semibold">{t.title}</td>
                        <td className="small text-muted">{t.project?.name || '—'}</td>
                        <td className="small text-muted">{t.deleted_at ? new Date(t.deleted_at).toLocaleDateString() : '—'}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold me-2" onClick={() => handleRestore(t.id)}>
                            <FontAwesomeIcon icon={faRotateLeft} className="me-1" /> Restore
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => handleForceDelete(t.id)}>
                            <FontAwesomeIcon icon={faTrashCan} className="me-1" /> Delete Forever
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-white">
        <div className="card-body p-4">
          <div className="row align-items-center g-4">
            <div className="col-xl-4 col-lg-5">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                    <FontAwesomeIcon icon={faTasks} className="text-primary fs-4" />
                </div>
                <div>
                    <h4 className="fw-bold text-dark mb-1">Task Workspace</h4>
                    <p className="text-muted small mb-0">Project: <span className="fw-bold text-primary">{selectedProject ? (projects.find(p => String(p.id) === String(selectedProject))?.name || 'Loading...') : 'All Projects'}</span></p>
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="d-flex flex-wrap align-items-center justify-content-lg-end gap-3">
                <div className="position-relative">
                    <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      className="form-control border shadow-none rounded-pill ps-5 bg-light" 
                      placeholder="Search tasks..." 
                      style={{ width: '220px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <select 
                  className="form-select border shadow-none rounded-pill px-4 bg-light fw-medium" 
                  style={{ width: '220px' }}
                  value={selectedProject || ''} 
                  onChange={(e) => setSelectedProject(e.target.value || null)}
                >
                  <option value="">All Projects</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>

                <div className="btn-group rounded-pill border p-1 bg-light shadow-sm">
                    <button className={`btn btn-sm rounded-pill px-3 border-0 transition ${viewMode === 'kanban' ? 'btn-white shadow-sm fw-bold' : 'text-muted'}`} onClick={() => setViewMode('kanban')}>Board</button>
                    <button className={`btn btn-sm rounded-pill px-3 border-0 transition ${viewMode === 'list' ? 'btn-white shadow-sm fw-bold' : 'text-muted'}`} onClick={() => setViewMode('list')}>List</button>
                </div>
                <button className="btn btn-primary rounded-pill px-4 py-2 shadow transition hover-lift-lg" onClick={() => { setEditTask(null); setActiveTab('tms_add_task'); }}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        <>
          {!initialTrash && (
            <>
          {viewMode === 'kanban' ? (
            <div className="row g-4 overflow-auto flex-nowrap pb-4 tms-board-row" style={{ minHeight: '750px' }}>
              {columns.map(col => (
                <div 
                  key={col.id} 
                  className="col-12 col-md-4 col-xl-3" 
                  style={{ minWidth: '360px' }}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, col.id)}
                >
                  <div className="h-100 p-4 rounded-4 bg-light border-0" style={{ background: 'rgba(248, 250, 252, 0.8)' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '38px', height: '38px', backgroundColor: col.color, color: '#fff' }}>
                          <FontAwesomeIcon icon={col.icon} />
                        </div>
                        <h6 className="fw-bold mb-0 ms-1" style={{ color: '#1e293b', fontSize: '0.95rem' }}>{col.title}</h6>
                        <span className="badge rounded-pill bg-white text-primary border shadow-sm ms-2 px-3 py-2 fw-bold">
                          {filteredTasks.filter(t => t.status === col.id).length}
                        </span>
                      </div>
                      <button className="btn btn-icon btn-white border-0 shadow-sm rounded-circle"><FontAwesomeIcon icon={faPlus} className="text-muted" onClick={() => { setEditTask(null); setActiveTab('tms_add_task'); }} /></button>
                    </div>
                    
                    <div className="d-flex flex-column gap-3">
                      {filteredTasks.filter(t => t.status === col.id).map(task => {
                        const atts = getAttachmentsForTask(task.id);
                        return (
                        <div 
                          key={task.id} 
                          className="card border-0 shadow-sm rounded-4 p-0 transition-all hover-lift-lg cursor-pointer task-card overflow-hidden group"
                          draggable={true}
                          onDragStart={(e) => onDragStart(e, task.id)}
                        >
                          <div className="position-absolute top-0 start-0 w-100" style={{ height: '4px', backgroundColor: getPriorityConfig(task.priority).color }}></div>
                          
                          <div className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span className="small fw-bold px-3 py-1 rounded-pill" style={{ backgroundColor: getPriorityConfig(task.priority).bg, color: getPriorityConfig(task.priority).color, fontSize: '0.75rem' }}>
                                {getPriorityConfig(task.priority).label}
                              </span>
                              
                              <div className="dropdown position-static">
                                  <button className="btn btn-icon btn-light rounded-circle border-0 shadow-none task-action-btn" data-bs-toggle="dropdown" style={{ width: '30px', height: '30px' }}>
                                      <FontAwesomeIcon icon={faEllipsisVertical} />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 m-1 transition-all overflow-y-scroll" style={{ zIndex: 9000, height: '200px', scrollbarWidth: '2px', }}>
                                       <li className="dropdown-header x-small text-uppercase fw-bold text-muted px-3">Actions</li>
                                       <li>
                                         <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2" onClick={() => setDetailTask(task)}>
                                           <FontAwesomeIcon icon={faEye} className="x-small text-info" />
                                           <span>View Details</span>
                                         </button>
                                       </li>
                                       <li>
                                         <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2" onClick={() => { setEditTask(task); setActiveTab('tms_add_task'); }}>
                                           <FontAwesomeIcon icon={faPenToSquare} className="x-small text-primary" />
                                           <span>Edit Task</span>
                                         </button>
                                       </li>
                                       <li>
                                         <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2 text-danger" onClick={() => handleDelete(task.id)} disabled={deleteLoading}>
                                           <FontAwesomeIcon icon={faTrashCan} className="x-small" />
                                           <span>Move to Trash</span>
                                         </button>
                                       </li>
                                       <li><hr className="dropdown-divider opacity-50" /></li>
                                       <li className="dropdown-header x-small text-uppercase fw-bold text-muted px-3">Move Status</li>
                                      {columns.filter(c => c.id !== task.status).map(c => (
                                          <li key={c.id}>
                                              <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2" onClick={() => handleStatusChange(task.id, c.id)}>
                                                  <FontAwesomeIcon icon={c.icon} className="x-small" style={{ color: c.color }} />
                                                  <span>{c.title}</span>
                                              </button>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                            </div>

                            <h6 className="fw-bold text-dark mb-2 group-hover-text-primary transition td-title-clickable" style={{ fontSize: '1rem' }} onClick={() => setDetailTask(task)}>{task.title}</h6>
                            {task.project && <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill mb-2" style={{ fontSize: '0.7rem' }}>{task.project.name}</span>}
                            <p className="text-muted mb-3 line-clamp-2" style={{ fontSize: '0.8rem', lineHeight: '1.5' }}>{task.description}</p>

                            {atts.length > 0 && (
                              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                                <FontAwesomeIcon icon={faPaperclip} className="text-muted" style={{ fontSize: '0.7rem' }} />
                                <span className="x-small text-muted fw-bold me-1">{atts.length} file{atts.length > 1 ? 's' : ''}</span>
                                {atts.slice(0, 3).map((att, i) => (
                                  <span key={att.id || i} className="d-inline-flex align-items-center gap-1 badge bg-light text-muted border rounded-pill px-2 py-1 fw-normal" style={{ fontSize: '0.6rem' }}>
                                    <FontAwesomeIcon icon={getFileIcon(att.file_type)} style={{ fontSize: '0.55rem' }} />
                                    <span className="text-truncate" style={{ maxWidth: '60px' }}>{att.file_name}</span>
                                  </span>
                                ))}
                                {atts.length > 3 && (
                                  <span className="x-small text-muted fw-bold">+{atts.length - 3} more</span>
                                )}
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light" style={{ marginTop: atts.length > 0 ? '0' : '0' }}>
                              <div className="d-flex align-items-center gap-2">
                                  <div className="rounded-circle border-2 border-white shadow-sm bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #e0e7ff, #f5f3ff)', fontSize: '0.75rem' }}>
                                      {task.assignee?.name?.[0] || <FontAwesomeIcon icon={faUser} size="xs" />}
                                  </div>
                                  <span className="small text-muted fw-medium">{task.assignee?.name?.split(' ')[0] || 'Unassigned'}</span>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {task.due_date && (
                                  <div className={`d-flex align-items-center gap-1 small fw-bold ${new Date(task.due_date) < new Date() && task.status !== 'Done' ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                                    <FontAwesomeIcon icon={faClock} style={{ fontSize: '0.7rem' }} />
                                    <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )})}
                      
                      {filteredTasks.filter(t => t.status === col.id).length === 0 && (
                        <div className="text-center py-5 text-muted small border-dashed rounded-4 bg-white bg-opacity-50">
                            <FontAwesomeIcon icon={faGripVertical} className="mb-2 opacity-30 fs-3 d-block mx-auto" />
                            Drop tasks here
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 border-0 x-small fw-bold text-uppercase text-muted">Task Details</th>
                                <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Assignee</th>
                                <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Priority</th>
                                <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Due Date</th>
                                <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Status</th>
                                <th className="px-4 py-3 border-0 text-end"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task.id} className="transition">
                                    <td className="px-4 py-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-2 rounded-3 bg-light text-primary"><FontAwesomeIcon icon={faTasks} /></div>
                                            <div>
                                                <h6 className="fw-bold mb-0 td-title-clickable" style={{ cursor: 'pointer' }} onClick={() => setDetailTask(task)}>{task.title}</h6>
                                                {task.project && <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill x-small mb-1">{task.project.name}</span>}
                                                <p className="text-muted x-small mb-0 text-truncate" style={{ maxWidth: '300px' }}>{task.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center x-small fw-bold" style={{ width: '28px', height: '28px' }}>
                                                {task.assignee?.name?.[0] || 'U'}
                                            </div>
                                            <span className="small fw-medium">{task.assignee?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: getPriorityConfig(task.priority).bg, color: getPriorityConfig(task.priority).color, fontSize: '10px' }}>
                                            {getPriorityConfig(task.priority).label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 text-muted small">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="x-small" />
                                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                                        </div>
                                    </td>
                                    <td>
                                        <select 
                                          className="form-select form-select-sm border shadow-none rounded-pill px-3 fw-bold" 
                                          style={{ width: '130px', fontSize: '11px', backgroundColor: `${columns.find(c => c.id === task.status)?.color}15`, color: columns.find(c => c.id === task.status)?.color, border: 'none' }}
                                          value={task.status}
                                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        >
                                          {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="d-flex align-items-center justify-content-end gap-2">
                                          <button className="btn btn-sm btn-outline-info rounded-pill px-3 fw-bold list-action-btn" onClick={() => setDetailTask(task)} title="View details">
                                            <FontAwesomeIcon icon={faEye} className="me-1" />
                                            View
                                          </button>
                                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold list-action-btn" onClick={() => { setEditTask(task); setActiveTab('tms_add_task'); }} title="Edit task">
                                            <FontAwesomeIcon icon={faPenToSquare} className="me-1" />
                                            Edit
                                          </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
            </>
          )}
        </>


      {showTrash && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mt-4">
          <div className="card-header bg-danger bg-opacity-10 border-0 p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-danger bg-opacity-20 p-2 rounded-3"><FontAwesomeIcon icon={faTrashCan} className="text-danger" /></div>
              <div>
                <h5 className="fw-bold mb-0">Trash</h5>
                <p className="text-muted small mb-0">Deleted tasks can be restored from here</p>
              </div>
              {/* <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 ms-auto" onClick={() => setShowTrash(false)}>
                <FontAwesomeIcon icon={faEye} className="me-1" /> Close
              </button> */}
            </div>
          </div>
          <div className="card-body p-4">
            {trashLoading ? (
              <div className="text-center py-4"><div className="spinner-border text-danger" role="status" /></div>
            ) : trashedTasks.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <FontAwesomeIcon icon={faTrashCan} className="fs-1 opacity-25 mb-3" />
                <p className="mb-0">Trash is empty</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="text-muted small text-uppercase letter-spacing-1">
                    <tr><th>Task</th><th>Project</th><th>Deleted</th><th className="text-end">Action</th></tr>
                  </thead>
                  <tbody>
                    {trashedTasks.map(t => (
                      <tr key={t.id}>
                        <td className="fw-semibold">{t.title}</td>
                        <td className="small text-muted">{t.project?.name || '—'}</td>
                        <td className="small text-muted">{t.deleted_at ? new Date(t.deleted_at).toLocaleDateString() : '—'}</td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold me-2" onClick={() => handleRestore(t.id)}>
                            <FontAwesomeIcon icon={faRotateLeft} className="me-1" /> Restore
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold" onClick={() => handleForceDelete(t.id)}>
                            <FontAwesomeIcon icon={faTrashCan} className="me-1" /> Delete Forever
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <TaskDetailModal
        task={detailTask}
        show={!!detailTask}
        onClose={() => setDetailTask(null)}
        onTaskUpdated={(updated) => {
          setTasks(prev => prev.map(t => t.id === updated.id ? { ...t, ...updated } : t));
        }}
      />

      <style>{`
        .task-card { background: white; border: 1px solid rgba(0,0,0,0.03); min-height: 300px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .task-card:hover { border-color: rgba(99,102,241,0.15); cursor: grab; }
        .hover-lift-lg:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important; }
        .btn-icon { width: 34px; height: 34px; padding: 0; display: inline-flex; align-items: center; justify-content: center; }
        .task-action-btn { transition: all 0.2s; }
        .task-action-btn:hover { background: #eef2ff !important; color: #6366f1 !important; }
        .list-action-btn { transition: all 0.2s; font-size: 0.7rem !important; letter-spacing: 0.02em; }
        .list-action-btn.btn-outline-primary:hover { background: #eef2ff !important; border-color: #6366f1 !important; color: #6366f1 !important; }
        .list-action-btn.btn-outline-danger:hover { background: #fef2f2 !important; border-color: #ef4444 !important; color: #ef4444 !important; }
        .x-small { font-size: 0.65rem; }
        .transition { transition: all 0.2s ease-in-out; }
        .group:hover .group-hover-text-primary { color: var(--bs-primary) !important; }
        .td-title-clickable { cursor: pointer; }
        .td-title-clickable:hover { color: #6366f1 !important; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .border-dashed { border: 2px dashed #e2e8f0; }
        .tms-board-row {
          scrollbar-width: thin;
          scrollbar-color: #a5b4fc #f1f5f9;
        }
        .tms-board-row::-webkit-scrollbar {
          height: 10px;
          width: 10px;
          background: transparent;
        }
        .tms-board-row::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 12px;
          margin: 4px 8px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .tms-board-row::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #c7d2fe 0%, #818cf8 50%, #6366f1 100%);
          border-radius: 12px;
          border: 2px solid #f1f5f9;
          min-width: 60px;
          transition: all 0.3s ease;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.2);
        }
        .tms-board-row::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #4f46e5 100%);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.35);
        }
        .tms-board-row::-webkit-scrollbar-thumb:active {
          background: linear-gradient(135deg, #818cf8 0%, #4f46e5 100%);
        }
        .tms-board-row::-webkit-scrollbar-button:single-button {
          display: block;
          width: 24px;
          height: 24px;
          background: #f8fafc;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          background-size: 10px;
          background-repeat: no-repeat;
          background-position: center;
          transition: all 0.2s ease;
          cursor: pointer;
          margin: 2px 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        }
        .tms-board-row::-webkit-scrollbar-button:single-button:hover {
          background-color: #eef2ff;
          border-color: #818cf8;
          box-shadow: 0 2px 10px rgba(99, 102, 241, 0.15);
          transform: scale(1.1);
        }
        .tms-board-row::-webkit-scrollbar-button:single-button:active {
          background-color: #c7d2fe;
          border-color: #6366f1;
          transform: scale(0.95);
        }
        .tms-board-row::-webkit-scrollbar-button:horizontal:decrement {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E");
        }
        .tms-board-row::-webkit-scrollbar-button:horizontal:increment {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E");
        }
        .tms-board-row::-webkit-scrollbar-button:single-button:vertical:decrement {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z'/%3E%3C/svg%3E");
        }
        .tms-board-row::-webkit-scrollbar-button:single-button:vertical:increment {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z'/%3E%3C/svg%3E");
        }
        .tms-board-row::-webkit-scrollbar-corner {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .tms-board-row .dropdown-menu::-webkit-scrollbar { width: 2px; }
        .tms-board-row .dropdown-menu::-webkit-scrollbar-track { background: transparent; }
        .tms-board-row .dropdown-menu::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        .tms-board-row .dropdown-menu::-webkit-scrollbar-thumb:hover {
          background: #a5b4fc;
        }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .letter-spacing-1 { letter-spacing: 1px; }
      `}</style>
    </div>
  );
};

export default TmsTasks;
