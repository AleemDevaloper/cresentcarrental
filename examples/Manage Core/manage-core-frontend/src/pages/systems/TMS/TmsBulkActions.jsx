import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, deleteTask } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faLayerGroup, 
  faCheckSquare, 
  faSquare, 
  faUser, 
  faSearch,
  faBolt,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";

const TmsBulkActions = () => {
  const { addNotification, confirmDialog } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
        setSelectedProject(null);
      } catch {
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
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        setTasks(data);
        setSelectedTasks([]);
      } catch {
        addNotification("Failed to load tasks.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  const toggleTask = (id) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(t => t.id));
    }
  };

  const handleBulkTrash = async () => {
    if (selectedTasks.length === 0) return;
    const confirmed = await confirmDialog({
      title: 'Move to Trash',
      message: `Move ${selectedTasks.length} selected task(s) to trash? They can be restored later from the Trash tab.`,
      variant: 'danger',
      confirmLabel: 'Yes, Move to Trash',
    });
    if (!confirmed) return;
    setTrashLoading(true);
    let successCount = 0;
    for (const id of selectedTasks) {
      try {
        await deleteTask(id);
        successCount++;
      } catch {
        // Continue with remaining tasks
      }
    }
    setTasks(prev => prev.filter(t => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);
    setTrashLoading(false);
    addNotification(`${successCount} task(s) moved to trash`, successCount === selectedTasks.length ? 'success' : 'warning');
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white">
        <div className="card-header p-0 border-0 rounded-5">
          <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div className="d-flex align-items-center gap-4">
                <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
                  <FontAwesomeIcon icon={faLayerGroup} className="fs-3" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1">Bulk Task Actions</h3>
                  <p className="mb-0 opacity-75">Manage large volumes of work with high-efficiency controls.</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <select 
                  className="form-select border-0 shadow-none rounded-pill px-4 bg-white bg-opacity-10 text-white fw-bold" 
                  style={{ width: '220px' }}
                  value={selectedProject || ''} 
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">All Tasks</option>
                  {projects.map(p => <option key={p.id} value={p.id} className="text-dark">{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5 p-4 rounded-4 bg-light border border-light">
            <div className="d-flex align-items-center gap-3">
                <button className="btn btn-white rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={toggleAll}>
                    <FontAwesomeIcon icon={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 ? faCheckSquare : faSquare} className="me-2 text-primary" />
                    {selectedTasks.length === filteredTasks.length && filteredTasks.length > 0 ? 'Deselect All' : 'Select All'}
                </button>
                <div className="vr opacity-20 mx-2"></div>
                <div className="text-muted small fw-bold text-uppercase letter-spacing-wider">
                    {selectedTasks.length} Tasks Selected
                </div>
            </div>

            <div className="d-flex align-items-center gap-2">
                <div className="position-relative me-2">
                    <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      className="form-control border-0 shadow-sm rounded-pill ps-5 bg-white" 
                      placeholder="Search for tasks..." 
                      style={{ width: '250px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="btn btn-danger rounded-pill px-4 py-2 fw-bold transition shadow" disabled={selectedTasks.length === 0 || trashLoading} onClick={handleBulkTrash}>
                    {trashLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : (
                      <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                    )}
                    {trashLoading ? 'Moving...' : 'Move to Trash'}
                </button>
                <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold transition shadow" disabled={selectedTasks.length === 0} style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', border: 'none' }}>
                    <FontAwesomeIcon icon={faBolt} className="me-2" />
                    Quick Process
                </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-grow text-primary" role="status"></div>
            </div>
          ) : (
            <div className="row g-4">
              {filteredTasks.map(task => (
                <div key={task.id} className="col-xl-4 col-md-6">
                  <div 
                    className={`card border-2 rounded-4 transition-all cursor-pointer h-100 ${selectedTasks.includes(task.id) ? 'border-primary bg-primary bg-opacity-5' : 'border-light shadow-sm'}`}
                    onClick={() => toggleTask(task.id)}
                  >
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className={`rounded-circle p-2 ${selectedTasks.includes(task.id) ? 'bg-primary text-white' : 'bg-light text-muted'}`}>
                          <FontAwesomeIcon icon={selectedTasks.includes(task.id) ? faCheckSquare : faSquare} />
                        </div>
                        <span className="badge rounded-pill bg-light text-dark border px-3 py-2 small fw-bold text-uppercase">{task.priority}</span>
                      </div>
                      <h6 className="fw-bold mb-2 text-dark">{task.title}</h6>
                      <p className="text-muted small mb-4 line-clamp-2">{task.description || 'No description available.'}</p>
                      <div className="d-flex align-items-center gap-3 pt-3 border-top border-light mt-auto">
                        <div className="d-flex align-items-center gap-2">
                          <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center small" style={{ width: '24px', height: '24px' }}>
                            <FontAwesomeIcon icon={faUser} style={{ fontSize: '10px' }} />
                          </div>
                          <span className="x-small fw-bold text-muted">{task.assignee?.name || 'Unassigned'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredTasks.length === 0 && (
                <div className="col-12 text-center py-5 opacity-50">
                  <FontAwesomeIcon icon={faSearch} size="3x" className="mb-3" />
                  <h5>No tasks matching your search</h5>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .rounded-5 { border-radius: 2.5rem !important; }
        .btn-white { background: white; border: 1px solid #f1f5f9; }
        .transition-all { transition: all 0.2s ease-in-out; }
        .cursor-pointer { cursor: pointer; }
        .x-small { font-size: 10px; }
      `}</style>
    </div>
  );
};

export default TmsBulkActions;
