import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectMilestones } from '../../../api/tms';
import { createMilestone, updateMilestone, deleteMilestone } from '../../../api/pms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faFlag, 
  faCheckCircle, 
  faCalendarAlt,
  // faCircle,
  faEllipsisVertical,
  // faTrash2,
  faEdit,
  faBell,
  faTasks,
  // faChevronRight,
  faRocket,
  faTrash,
  faCircle
} from "@fortawesome/free-solid-svg-icons";

const TmsMilestones = () => {
  const { addNotification, setActiveTab } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [newMilestone, setNewMilestone] = useState({ title: '', due_date: '', status: 'Pending' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        addNotification("Failed to load projects.", "danger");
      }
    };
    fetchProjects();

    // Close dropdown on click outside
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchMilestones = async () => {
        setLoading(true);
        try {
          const data = await listProjectMilestones(selectedProject);
          setMilestones(data);
        } catch (err) {
          console.error("Failed to fetch milestones", err);
          addNotification("Failed to load milestones.", "danger");
        } finally {
          setLoading(false);
        }
      };
      fetchMilestones();
    }
  }, [selectedProject]);

  const handleOpenCreate = () => {
    setEditingMilestone(null);
    setNewMilestone({ title: '', due_date: '', status: 'Pending' });
    setShowModal(true);
  };

  const handleOpenEdit = (milestone) => {
    setEditingMilestone(milestone.id);
    setNewMilestone({ 
      title: milestone.title, 
      due_date: milestone.due_date ? milestone.due_date.split('T')[0] : '', 
      status: milestone.status || 'Pending' 
    });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      addNotification("Please select a project first.", "warning");
      return;
    }

    setSaving(true);
    try {
      const milestoneData = { ...newMilestone };
      if (milestoneData.due_date === '') milestoneData.due_date = null;

      if (editingMilestone) {
        await updateMilestone(editingMilestone, milestoneData);
        addNotification("Milestone updated successfully!", "success");
      } else {
        await createMilestone(selectedProject, milestoneData);
        addNotification("Milestone added successfully!", "success");
      }
      
      const data = await listProjectMilestones(selectedProject);
      setMilestones(data);
      setShowModal(false);
      setEditingMilestone(null);
      setNewMilestone({ title: '', due_date: '', status: 'Pending' });
    } catch (err) {
      console.error("Failed to save milestone", err);
      addNotification(err.message || "Failed to save milestone.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateMilestone(id, { status });
      setMilestones(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      addNotification(`Milestone marked as ${status}`, "success");
    } catch (err) {
      console.error("Failed to update milestone", err);
      addNotification("Failed to update milestone status.", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
      try {
        await deleteMilestone(id);
        setMilestones(prev => prev.filter(m => m.id !== id));
        addNotification("Milestone deleted successfully", "success");
      } catch (err) {
        addNotification("Failed to delete milestone.", "danger");
      }
    }
  };

  const handleSendReminder = (title) => {
    addNotification(`Reminder sent for milestone: ${title}`, "info");
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Completed':
        return { color: 'success', icon: faCheckCircle, label: 'Completed', pulse: 'bg-success' };
      case 'Working':
        return { color: 'warning', icon: faRocket, label: 'In Progress', pulse: 'bg-warning' };
      default:
        return { color: 'info', icon: faCircle, label: 'Pending', pulse: 'bg-info' };
    }
  };

  return (
    <div className="container-fluid py-4 fade-in">
      {/* Header Area */}
      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-white">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-warning bg-opacity-10 p-3 rounded-4">
                <FontAwesomeIcon icon={faFlag} className="text-warning fs-4" />
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">Milestone Tracker</h4>
                <p className="text-muted small mb-0">Project: <span className="fw-bold text-primary">{projects.find(p => String(p.id) === String(selectedProject))?.name || 'Loading...'}</span></p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
                <select 
                  className="form-select border shadow-none rounded-pill px-4 bg-light fw-medium" 
                  style={{ width: '220px' }}
                  value={selectedProject || ''} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">All Tasks</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm transition hover-lift" onClick={handleOpenCreate}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Milestone
              </button>
            </div>
            </div>
            </div>
            </div>

            {/* Main Table Card */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5 vh-100">
            <div className="card-body p-0 vh-100">
            <div className="table-responsive vh-100">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 border-0 small text-uppercase text-muted fw-bold">Strategic Milestone</th>
                  <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Target Date</th>
                  <th className="py-3 border-0 small text-uppercase text-muted fw-bold">Health Status</th>
                  <th className="pe-4 py-3 border-0 small text-uppercase text-muted fw-bold text-end">Management</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map(m => {
                  const config = getStatusConfig(m.status);
                  return (
                    <tr key={m.id} className="transition">
                      <td className="ps-4 py-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm bg-${config.color} text-white`} style={{ width: '42px', height: '42px', transition: 'all 0.3s' }}>
                              <FontAwesomeIcon icon={config.icon} />
                          </div>
                          <div>
                              <span className={`fw-bold d-block ${m.status === 'Completed' ? 'text-muted text-decoration-line-through' : 'text-dark'}`}>{m.title}</span>
                              <span className="x-small text-muted text-uppercase fw-bold letter-spacing-wider">Strategic Goal</span>
                          </div>
                        </div>
                      </td>                      <td>
                          <div className="d-flex align-items-center gap-2 text-muted fw-medium">
                              <FontAwesomeIcon icon={faCalendarAlt} className="small" />
                              <span>{m.due_date ? new Date(m.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}</span>
                          </div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-2 bg-${config.color}-subtle text-${config.color}`}>
                          <div className={`pulse-dot ${config.pulse}`}></div>
                          {config.label}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <div className="dropdown position-relative">
                          <button 
                            className={`btn btn-icon rounded-circle border-0 shadow-sm ${activeDropdown === m.id ? 'btn-primary' : 'btn-white text-muted'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === m.id ? null : m.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                          </button>

                          {activeDropdown === m.id && (
                            <div className="dropdown-menu show dropdown-menu-end shadow-lg border-0 rounded-4 p-2 transition-all" style={{ right: '0', top: '100%', zIndex: 1000, minWidth: '180px' }}>
                              <li className="dropdown-header x-small text-uppercase fw-bold text-muted px-3">Quick Actions</li>

                              {m.status !== 'Completed' && (
                                <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2 text-success fw-bold" onClick={() => handleStatusChange(m.id, 'Completed')}>
                                  <FontAwesomeIcon icon={faCheckCircle} className="x-small" />
                                  Mark Completed
                                </button>
                              )}

                              {m.status === 'Pending' && (
                                <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2 text-warning fw-bold" onClick={() => handleStatusChange(m.id, 'Working')}>
                                  <FontAwesomeIcon icon={faRocket} className="x-small" />
                                  Start Working
                                </button>
                              )}

                              <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2" onClick={() => setActiveTab('tms_tasks')}>
                                <FontAwesomeIcon icon={faTasks} className="x-small text-primary" />
                                View Tasks
                              </button>

                              <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2" onClick={() => handleSendReminder(m.title)}>
                                <FontAwesomeIcon icon={faBell} className="x-small text-warning" />
                                Send Reminder
                              </button>

                              <div className="dropdown-divider opacity-50"></div>

                              <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2" onClick={() => handleOpenEdit(m)}>
                                <FontAwesomeIcon icon={faEdit} className="x-small text-muted" />
                                Edit Details
                              </button>

                              <button className="dropdown-item rounded-3 small d-flex align-items-center gap-2 py-2 text-danger fw-bold" onClick={() => handleDelete(m.id)}>
                                <FontAwesomeIcon icon={faTrash} className="x-small" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {milestones.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                        <div className="py-5">
                            <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '84px' }}>
                                <FontAwesomeIcon icon={faFlag} size="2x" className="text-muted opacity-30" />
                            </div>
                            <h5 className="text-dark fw-bold">No Strategic Milestones</h5>
                            <p className="text-muted small mb-4">You haven't defined any milestones for this project yet.</p>
                            <button className="btn btn-primary rounded-pill px-4" onClick={handleOpenCreate}>
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> Create First Milestone
                            </button>
                        </div>
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
            </div>
            </div>

            <DialogBox
              show={showModal}
              onClose={() => setShowModal(false)}
              title={editingMilestone ? 'Edit Milestone' : 'Define Milestone'}
              size="lg"
              footer={
                <div className="d-flex justify-content-end gap-3 w-100">
                  <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-bold" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                  <button type="submit" form="milestone-form" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow" disabled={saving}>
                    {saving ? 'Processing...' : (editingMilestone ? 'Update Milestone' : 'Initialize Milestone')}
                  </button>
                </div>
              }
            >
              <form id="milestone-form" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-wider">Strategic Goal Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 border-2 rounded-start-4"><FontAwesomeIcon icon={faRocket} className="text-primary opacity-50" /></span>
                    <input 
                      type="text" 
                      className="form-control border-start-0 border-2 rounded-end-4 shadow-none py-3" 
                      required 
                      placeholder="e.g. Q3 System Integration"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-4 mb-md-0">
                      <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-wider">Target Date</label>
                      <div className="input-group">
                          <span className="input-group-text bg-white border-end-0 border-2 rounded-start-4"><FontAwesomeIcon icon={faCalendarAlt} className="text-primary opacity-50" /></span>
                          <input 
                              type="date" 
                              className="form-control border-start-0 border-2 rounded-end-4 shadow-none py-3" 
                              value={newMilestone.due_date}
                              onChange={(e) => setNewMilestone({...newMilestone, due_date: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase letter-spacing-wider">Progress Status</label>
                      <select 
                          className="form-select border-2 rounded-4 shadow-none py-3 fw-bold"
                          value={newMilestone.status}
                          onChange={(e) => setNewMilestone({...newMilestone, status: e.target.value})}
                      >
                          <option value="Pending">Pending Action</option>
                          <option value="Completed">Completed Goal</option>
                      </select>
                  </div>
                </div>
              </form>
            </DialogBox>
      <style>{`
        .btn-icon { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
        .btn-white { background: white; border: 1px solid #f1f5f9; }
        .x-small { font-size: 10px; }
        .transition { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); }
        .rounded-5 { border-radius: 2rem !important; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .bg-success-subtle { background-color: #dcfce7 !important; }
        .bg-info-subtle { background-color: #e0f2fe !important; }
        
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(var(--bs-primary-rgb), 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(var(--bs-primary-rgb), 0); }
          100% { box-shadow: 0 0 0 0 rgba(var(--bs-primary-rgb), 0); }
        }

        .dropdown-item { transition: all 0.2s; cursor: pointer; }
        .dropdown-item:active { background-color: var(--bs-primary); }
      `}</style>
    </div>
  );
};

export default TmsMilestones;
