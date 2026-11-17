import React, { useState, useEffect } from 'react';
import { listProjects } from '../../../api/projects';
import { listMilestones, createMilestone, updateMilestone } from '../../../api/pms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFlag, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const PmsMilestones = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: '', due_date: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await listProjects();
      setProjects(data);
      if (data.length > 0) setSelectedProject(data[0].id);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchMilestones = async () => {
        const data = await listMilestones(selectedProject);
        setMilestones(Array.isArray(data) ? data : (data?.data || []));
      };
      fetchMilestones();
    }
  }, [selectedProject]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createMilestone(selectedProject, newMilestone);
    const data = await listMilestones(selectedProject);
    setMilestones(Array.isArray(data) ? data : (data?.data || []));
    setShowModal(false);
    setNewMilestone({ title: '', due_date: '' });
  };

  const handleStatusChange = async (id, status) => {
    await updateMilestone(id, { status });
    const data = await listMilestones(selectedProject);
    setMilestones(Array.isArray(data) ? data : (data?.data || []));
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <select 
          className="form-select w-auto fw-bold shadow-sm" 
          value={selectedProject || ''} 
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button className="btn btn-primary shadow-sm" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          New Milestone
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Milestone</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map(m => (
                  <tr key={m.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faFlag} className="me-3 text-warning" />
                        <span className="fw-semibold">{m.title}</span>
                      </div>
                    </td>
                    <td>{m.due_date || 'No date'}</td>
                    <td>
                      <span className={`badge ${m.status === 'Completed' ? 'bg-success' : 'bg-info'}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {m.status !== 'Completed' && (
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(m.id, 'Completed')}>
                          <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                          Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {milestones.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-secondary">No milestones found for this project.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Project Milestone</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Milestone Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={newMilestone.due_date}
                      onChange={(e) => setNewMilestone({...newMilestone, due_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Milestone</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PmsMilestones;
