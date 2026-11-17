import React, { useState, useEffect } from 'react';
import { listDepartments, createDepartment } from '../../../api/hrms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSitemap, faBuilding } from "@fortawesome/free-solid-svg-icons";

const HrmsOrg = () => {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', description: '' });

  const fetchDepts = async () => {
    const data = await listDepartments();
    setDepartments(data);
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createDepartment(newDept);
    fetchDepts();
    setShowModal(false);
    setNewDept({ name: '', description: '' });
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Organizational Structure</h5>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Department
        </button>
      </div>

      <div className="row">
        {departments.map(dept => (
          <div key={dept.id} className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary-subtle p-3 rounded-circle me-3">
                    <FontAwesomeIcon icon={faBuilding} className="text-primary fs-4" />
                  </div>
                  <h6 className="fw-bold mb-0">{dept.name}</h6>
                </div>
                <p className="text-secondary small mb-3">{dept.description || 'No description provided.'}</p>
                <div className="border-top pt-3 mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small fw-bold text-secondary">Designations:</span>
                    <span className="badge bg-light text-primary border">{dept.designations?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-12 text-center py-5 text-secondary">
            <FontAwesomeIcon icon={faSitemap} className="fs-1 mb-3 opacity-25" />
            <p>No departments found. Start by adding one!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Department</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Department Name</label>
                    <input type="text" className="form-control" required value={newDept.name} onChange={e => setNewDept({...newDept, name: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" value={newDept.description} onChange={e => setNewDept({...newDept, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4">Save Department</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HrmsOrg;
