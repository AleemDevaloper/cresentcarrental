import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, listTags, createTag, deleteTag, addTaskTag, removeTaskTag } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTags, 
  // faTag, 
  faPlus, 
  faSearch, 
  faCircle,
  // faEdit,
  faTrash,
  // faFilter
} from "@fortawesome/free-solid-svg-icons";

const TmsTags = () => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', color: '#6366f1' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, tagData] = await Promise.all([listProjects(), listTags()]);
        setProjects(projData);
        setAvailableTags(tagData);
      } catch (err) {
        addNotification("Failed to load data.", "danger");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = selectedProject
          ? await listProjectTasks(selectedProject)
          : await listAllTasks();
        setTasks(data);
      } catch (err) {
        addNotification("Failed to load tasks.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedProject]);

  const handleCreateTag = async () => {
    if (!newTag.name) return;
    try {
      const created = await createTag(newTag);
      setAvailableTags(prev => [...prev, created]);
      setNewTag({ name: '', color: '#6366f1' });
      addNotification("Tag created.", "success");
    } catch (err) {
      addNotification("Failed to create tag.", "danger");
    }
  };

  const handleDeleteTag = async (id) => {
    if (window.confirm("Delete this tag?")) {
      try {
        await deleteTag(id);
        setAvailableTags(prev => prev.filter(t => t.id !== id));
        addNotification("Tag deleted.", "success");
      } catch (err) {
        addNotification("Failed to delete tag.", "danger");
      }
    }
  };

  const handleAddTaskTag = async (taskId, tagId) => {
    try {
      const updatedTask = await addTaskTag(taskId, tagId);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      addNotification("Tag added to task.", "success");
    } catch (err) {
      addNotification("Failed to add tag.", "danger");
    }
  };

  const handleRemoveTaskTag = async (taskId, tagId) => {
    try {
      await removeTaskTag(taskId, tagId);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, tags: t.tags.filter(tag => tag.id !== tagId) } : t));
      addNotification("Tag removed.", "success");
    } catch (err) {
      addNotification("Failed to remove tag.", "danger");
    }
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="card-header p-0 border-0 ">
          <div className="p-4 p-lg-5 text-white rounded" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-white bg-opacity-20 p-3 rounded-4 shadow-sm">
                  <FontAwesomeIcon icon={faTags} className="fs-3" />
                </div>
                <div>
                  <h3 className="fw-bold mb-1">Tags & Labels</h3>
                  <p className="mb-0 opacity-75">Organize and categorize your tasks with a custom taxonomy.</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input 
                  type="text" 
                  className="form-control rounded-pill px-4 border-0 shadow-sm" 
                  placeholder="New tag name"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                />
                <input 
                  type="color" 
                  className="form-control form-control-color border-0 rounded-circle p-0" 
                  style={{ width: '70px', height: '30px' }}
                  value={newTag.color}
                  onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                />
                <button 
                  className="btn btn-white bg-white bg-opacity-10 border-white border-opacity-25 text-white rounded-pill px-0 py-2 fw-bold shadow-sm transition hover-bg-white w-100"
                  onClick={handleCreateTag}
                >
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Create Tag
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-lg-5">
          <div className="row g-5">
              {/* Tag Management */}
              <div className="col-lg-4 border-end">
                  <h6 className="fw-bold text-dark mb-4 text-uppercase letter-spacing-wider">Active Taxonomy</h6>
                  <div className="d-flex flex-column gap-2">
                      {availableTags.map(tag => (
                          <div key={tag.id} className="d-flex align-items-center justify-content-between p-3 rounded-4 border-2 border-light border transition hover-lift-sm bg-light bg-opacity-30">
                              <div className="d-flex align-items-center gap-3">
                                  <FontAwesomeIcon icon={faCircle} style={{ color: tag.color, fontSize: '10px' }} />
                                  <span className="fw-bold small text-dark">{tag.name}</span>
                              </div>
                              <div className="d-flex gap-2">
                                  <button className="btn btn-link text-danger p-0 x-small" onClick={() => handleDeleteTag(tag.id)}><FontAwesomeIcon icon={faTrash} /></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Task Mapping */}
              <div className="col-lg-8">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                      <h6 className="fw-bold text-dark mb-0 text-uppercase letter-spacing-wider">Categorize Tasks</h6>
                      <select 
                        className="form-select border-0 shadow-sm rounded-pill px-4 bg-light small" 
                        style={{ width: '200px' }}
                        value={selectedProject || ''} 
                        onChange={(e) => setSelectedProject(e.target.value)}
                      >
                        <option value="">All Tasks</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                  </div>

                  <div className="d-flex flex-column gap-3">
                      {tasks.map(task => (
                          <div key={task.id} className="p-4 rounded-4 border border-light shadow-sm bg-white transition hover-lift">
                              <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                      <div className="fw-bold text-dark mb-1">{task.title}</div>
                                      <div className="d-flex flex-wrap gap-2 mt-2">
                                          {task.tags?.map(tag => (
                                              <span key={tag.id} className="badge rounded-pill px-3 py-2 fw-bold x-small" style={{ backgroundColor: `${tag.color}15`, color: tag.color }}>
                                                  #{tag.name}
                                                  <FontAwesomeIcon icon={faPlus} className="ms-2 cursor-pointer" style={{ transform: 'rotate(45deg)', opacity: 0.5 }} onClick={() => handleRemoveTaskTag(task.id, tag.id)} />
                                              </span>
                                          ))}
                                          <div className="dropdown">
                                              <button className="btn btn-sm p-0 text-muted small ms-1" data-bs-toggle="dropdown"><FontAwesomeIcon icon={faPlus} /></button>
                                              <ul className="dropdown-menu shadow border-0 rounded-3">
                                                  {availableTags.filter(at => !task.tags?.some(tt => tt.id === at.id)).map(at => (
                                                      <li key={at.id}><button className="dropdown-item small" onClick={() => handleAddTaskTag(task.id, at.id)}>{at.name}</button></li>
                                                  ))}
                                                  {availableTags.length === 0 && <li className="dropdown-item disabled x-small">No tags created</li>}
                                              </ul>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        </div>
      </div>

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 10px; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        .hover-lift-sm:hover { transform: translateY(-1px); border-color: #e2e8f0 !important; }
        .btn-white { background: white; border: none; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default TmsTags;
