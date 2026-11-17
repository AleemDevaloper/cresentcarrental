import React, { useState, useEffect } from 'react';
import { listProjects } from '../../../api/projects';
import { listTasks, createTask, updateTask } from '../../../api/pms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheckCircle, faClock, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const PmsTasks = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'Medium' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await listProjects();
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0].id);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        setError("Failed to load projects. Please refresh the page.");
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchTasks = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await listTasks(selectedProject);
          setTasks(Array.isArray(data) ? data : (data?.data || []));
        } catch (err) {
          console.error("Failed to fetch tasks", err);
          setError("Failed to load tasks for the selected project.");
        } finally {
          setLoading(false);
        }
      };
      fetchTasks();
    }
  }, [selectedProject]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedProject) {
      setError("Please select a project first.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createTask(selectedProject, newTask);
      const data = await listTasks(selectedProject);
      setTasks(Array.isArray(data) ? data : (data?.data || []));
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium' });
      setSuccess("Task created successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to create task", err);
      setError(err.message || "Failed to create task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      const data = await listTasks(selectedProject);
      setTasks(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error("Failed to update task", err);
      setError("Failed to update task status.");
    }
  };

  return (
    <div className="p-4">
      {success && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm border-0 rounded-4" role="alert">
          <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm border-0 rounded-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <label className="fw-bold">Project:</label>
          <select 
            className="form-select w-auto" 
            value={selectedProject || ''} 
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Task
        </button>
      </div>

      {loading ? (
        <div className="text-center p-5">Loading tasks...</div>
      ) : (
        <div className="row">
          {['To Do', 'In Progress', 'Done'].map(status => (
            <div key={status} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100 border-0 bg-light">
                <div className="card-header bg-white border-0 py-3">
                  <h6 className="mb-0 fw-bold">{status}</h6>
                </div>
                <div className="card-body p-2">
                  {tasks.filter(t => t.status === status).map(task => (
                    <div key={task.id} className="card border-0 shadow-sm mb-2 p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0 fw-bold text-primary">{task.title}</h6>
                        <span className={`badge ${task.priority === 'High' ? 'bg-danger' : 'bg-info'}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="small text-secondary mb-3">{task.description}</p>
                      <div className="d-flex justify-content-end gap-2">
                        {status !== 'To Do' && (
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => handleStatusChange(task.id, 'To Do')}>
                            <FontAwesomeIcon icon={faClock} />
                          </button>
                        )}
                        {status !== 'In Progress' && (
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatusChange(task.id, 'In Progress')}>
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                          </button>
                        )}
                        {status !== 'Done' && (
                          <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(task.id, 'Done')}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTask}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                    ) : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsTasks;
