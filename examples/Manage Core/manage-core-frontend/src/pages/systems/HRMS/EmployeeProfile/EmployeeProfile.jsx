import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faBriefcase, 
  faGraduationCap, 
  faShieldHalved, 
  faBuildingColumns, 
  faUsers, 
  faFileLines,
  faEdit,
  faSave,
  faTimes,
  faPlus,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { getEmployeeProfile, updateEmployeeProfile } from "../../../../api/hrms";

const EmployeeProfile = ({ userId: propUserId }) => {
  const { currentUser, addNotification } = useApp();
  const userId = propUserId || currentUser?.id;
  
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState("personal");

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeProfile(userId);
      setEmployee(data);
      setFormData(data);
    } catch (err) {
      addNotification("Failed to fetch profile", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateEmployeeProfile(userId, formData);
      setIsEditing(false);
      fetchProfile();
      addNotification("Profile updated successfully", "success");
    } catch (err) {
      addNotification("Failed to update profile", "danger");
    }
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (!employee) return <div className="alert alert-warning">Employee not found.</div>;

  const sections = [
    { id: "personal", label: "Personal Info", icon: faUser },
    { id: "employment", label: "Employment", icon: faBriefcase },
    { id: "education", label: "Education", icon: faGraduationCap },
    { id: "experience", label: "Experience", icon: faHistory },
    { id: "banking", label: "Banking & Legal", icon: faBuildingColumns },
  ];

  return (
    <div className="employee-profile-container animate-fade-in">
      <div className="row g-4">
        {/* Sidebar Nav */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="p-4 text-center bg-primary text-white">
              <div className="avatar-xl rounded-circle bg-white text-primary mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold fs-2 shadow-sm" style={{ width: 80, height: 80 }}>
                {employee.name?.charAt(0)}
              </div>
              <h5 className="mb-1 fw-bold">{employee.name}</h5>
              <p className="small mb-0 opacity-75">{employee.role_ref?.name || "Employee"}</p>
            </div>
            <div className="list-group list-group-flush p-2">
              {sections.map(s => (
                <button 
                  key={s.id}
                  className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 d-flex align-items-center gap-3 py-2 ${activeSection === s.id ? 'active bg-primary bg-opacity-10 text-primary' : ''}`}
                  onClick={() => setActiveSection(s.id)}
                >
                  <FontAwesomeIcon icon={s.icon} className="small" />
                  <span className="small fw-semibold">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mb-0 fw-bold">{sections.find(s => s.id === activeSection).label}</h4>
              {!isEditing ? (
                <button className="btn btn-primary btn-sm rounded-3 px-3" onClick={() => setIsEditing(true)}>
                  <FontAwesomeIcon icon={faEdit} className="me-2" /> Edit
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary btn-sm rounded-3 px-3" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-success btn-sm rounded-3 px-3" onClick={handleSave}>
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="section-content">
              {activeSection === "personal" && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">First Name</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={formData.first_name || ""} 
                      disabled={!isEditing}
                      onChange={e => setFormData({...formData, first_name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Last Name</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={formData.last_name || ""} 
                      disabled={!isEditing}
                      onChange={e => setFormData({...formData, last_name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Email</label>
                    <input type="email" className="form-control rounded-3" value={employee.email} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Phone</label>
                    <input 
                      type="text" 
                      className="form-control rounded-3" 
                      value={formData.phone || ""} 
                      disabled={!isEditing}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeSection === "employment" && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Employee ID</label>
                    <input type="text" className="form-control rounded-3" value={employee.emp_id} disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Employee Type</label>
                    <select 
                      className="form-select rounded-3" 
                      value={formData.employee_type || ""} 
                      disabled={!isEditing}
                      onChange={e => setFormData({...formData, employee_type: e.target.value})}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Joining Date</label>
                    <input 
                      type="date" 
                      className="form-control rounded-3" 
                      value={formData.joining_date || ""} 
                      disabled={!isEditing}
                      onChange={e => setFormData({...formData, joining_date: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="small text-muted mb-1">Manager</label>
                    <input type="text" className="form-control rounded-3" value={employee.manager?.name || "N/A"} disabled />
                  </div>
                </div>
              )}
              
              {/* Add more sections as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
