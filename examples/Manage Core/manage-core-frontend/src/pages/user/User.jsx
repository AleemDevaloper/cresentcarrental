import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faPen,
  faTrash,
  faCircleExclamation,
  faSearch,
  faCircle,
  faUserPlus,
  faMapMarkerAlt,
  faGlobe,
  faBuilding,
  faThLarge,
  faList,
  faEllipsisV,
  faBriefcase,
  faClock,
  faEnvelope,
  faPhone,
  faMessage,
  faArrowRight,
  faProjectDiagram,
  faBolt,
  faStar,
  faCheckCircle,
  faShieldAlt,
  faUserCheck,
  faUserSlash,
  faMessage as faChat,
} from "@fortawesome/free-solid-svg-icons";
import { deleteUser, listUsers } from "../../api/users";
import { useApp } from "../../context/AppContext";

const User = () => {
  const { theme, setActiveTab, setEditUser, addNotification, confirmDialog } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'list' or 'grid'

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listUsers();
        if (!cancelled) {
          setUsers(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading users", err);
        addNotification(err?.message || "Unable to load users. Please try again.", "error", 5000, { title: "Users Unavailable" });
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Yes, Delete',
    });
    if (!confirmed) return;
    try {
      await deleteUser(id);
      setUsers(await listUsers());
      addNotification('User deleted successfully', 'success', 4000, { title: 'User Deleted' });
    } catch (err) {
      addNotification(err?.message || 'Failed to delete user', 'error', 5000, { title: 'Delete Failed' });
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setActiveTab('add-user');
  };

  const handleAddUser = () => {
    setEditUser(null);
    setActiveTab('add-user');
  };

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (u.empId?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (u.city?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (u.country?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#111827';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const subBg = isDark ? '#0f172a' : '#f8fafc';

  const UserCard = ({ u }) => {
    // Random / Mock metrics since they might not be in DB yet
    const performance = Math.floor(Math.random() * 40) + 60;
    const attendance = Math.floor(Math.random() * 20) + 80;
    const productivity = Math.floor(Math.random() * 30) + 70;
    const taskCount = Math.floor(Math.random() * 15);
    const projCount = Math.floor(Math.random() * 5);
    const experience = (Math.random() * 10).toFixed(1);
    
    const getWorkloadLabel = (count) => {
      if (count > 12) return { label: 'Overloaded', color: 'danger' };
      if (count > 8) return { label: 'High', color: 'warning' };
      if (count > 4) return { label: 'Medium', color: 'primary' };
      return { label: 'Low', color: 'success' };
    };
    
    const workload = getWorkloadLabel(taskCount);

    return (
      <div className="col-xl-4 col-lg-6 mb-4">
        <div className="card border-0 shadow-sm user-premium-card h-100 transition-all" style={{ background: cardBg, borderRadius: '24px' }}>
          <div className="card-body p-4">
            {/* Card Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold overflow-hidden border border-2 border-white shadow-sm" style={{ width: '64px', height: '64px' }}>
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (u.name || "?").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: textColor }}>{u.name}</h6>
                  <div className="text-muted extra-small">{u.role}</div>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <FontAwesomeIcon icon={faCircle} className={`small ${u.isOnline ? 'text-success' : 'text-secondary opacity-25'}`} style={{ fontSize: '0.5rem' }} />
                    <span className="extra-small text-muted">{u.isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <div className="dropdown">
                <button className="btn btn-icon btn-light rounded-circle shadow-none" data-bs-toggle="dropdown">
                  <FontAwesomeIcon icon={faEllipsisV} className="text-muted small" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4">
                  <li><button className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2" onClick={() => handleEdit(u)}><FontAwesomeIcon icon={faPen} size="xs" /> Edit Profile</button></li>
                  <li><button className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faShieldAlt} size="xs" /> Change Role</button></li>
                  <li><button className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faBriefcase} size="xs" /> Assign Project</button></li>
                  <li><hr className="dropdown-divider opacity-50" /></li>
                  <li><button className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2 text-danger" onClick={() => handleDelete(u.id)}><FontAwesomeIcon icon={faTrash} size="xs" /> Delete User</button></li>
                </ul>
              </div>
            </div>

            {/* Info Grid */}
            <div className="row g-2 mb-4">
              <div className="col-6">
                <div className="p-3 rounded-4" style={{ background: subBg }}>
                  <div className="extra-small text-muted mb-1 text-uppercase fw-bold"><FontAwesomeIcon icon={faBuilding} className="me-1" /> Dept</div>
                  <div className="small fw-bold text-truncate" style={{ color: textColor }}>{u.organization || 'Corporate'}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 rounded-4" style={{ background: subBg }}>
                  <div className="extra-small text-muted mb-1 text-uppercase fw-bold"><FontAwesomeIcon icon={faClock} className="me-1" /> Exp</div>
                  <div className="small fw-bold" style={{ color: textColor }}>{experience} Years</div>
                </div>
              </div>
              <div className="col-12">
                <div className="p-3 rounded-4" style={{ background: subBg }}>
                  <div className="extra-small text-muted mb-1 text-uppercase fw-bold"><FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" /> Location</div>
                  <div className="small fw-bold" style={{ color: textColor }}>{u.city || 'Not Set'}{u.country ? `, ${u.country}` : ''}</div>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill small fw-bold">Active</span>
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill small fw-bold">Full Time</span>
              <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill small fw-bold">Remote</span>
              {u.role === 'Admin' && <span className="badge bg-purple-subtle text-purple px-3 py-2 rounded-pill small fw-bold">Team Lead</span>}
            </div>

            {/* Performance */}
            <div className="performance-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="extra-small fw-bold text-muted text-uppercase">Performance Index</span>
                <span className="extra-small fw-bold text-primary">{performance}%</span>
              </div>
              <div className="progress rounded-pill mb-3" style={{ height: '6px', background: isDark ? '#334155' : '#e2e8f0' }}>
                <div className="progress-bar bg-primary rounded-pill" style={{ width: `${performance}%` }}></div>
              </div>
              
              <div className="row g-3 mt-1">
                <div className="col-6">
                   <div className="extra-small text-muted mb-1">Attendance</div>
                   <div className="progress rounded-pill" style={{ height: '4px', background: isDark ? '#334155' : '#e2e8f0' }}>
                    <div className="progress-bar bg-success rounded-pill" style={{ width: `${attendance}%` }}></div>
                  </div>
                </div>
                <div className="col-6">
                   <div className="extra-small text-muted mb-1">Productivity</div>
                   <div className="progress rounded-pill" style={{ height: '4px', background: isDark ? '#334155' : '#e2e8f0' }}>
                    <div className="progress-bar bg-info rounded-pill" style={{ width: `${productivity}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workload & Skills */}
            <div className="p-3 rounded-4 mb-4 border border-dashed border-2" style={{ borderColor }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="extra-small text-muted mb-1 fw-bold">WORKLOAD</div>
                  <div className="small fw-bold" style={{ color: textColor }}>{taskCount} Tasks • {projCount} Projects</div>
                </div>
                <span className={`badge bg-${workload.color} px-3 py-1 rounded-pill small`}>{workload.label}</span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {['React', 'Node.js', 'UI/UX'].map(s => <span key={s} className="badge bg-light text-dark extra-small rounded-3 border">{s}</span>)}
                <span className="extra-small text-muted ms-1">+4 more</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="d-flex align-items-center justify-content-between mt-auto pt-2">
              <div className="d-flex gap-2">
                <button className="btn btn-icon btn-light rounded-circle shadow-sm" title="Send Email"><FontAwesomeIcon icon={faEnvelope} size="xs" /></button>
                <button className="btn btn-icon btn-light rounded-circle shadow-sm" title="Chat Message"><FontAwesomeIcon icon={faChat} size="xs" /></button>
                <button className="btn btn-icon btn-light rounded-circle shadow-sm" title="Call User"><FontAwesomeIcon icon={faPhone} size="xs" /></button>
              </div>
              <button className="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2" onClick={() => handleEdit(u)}>
                View Profile <FontAwesomeIcon icon={faArrowRight} size="xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4" style={{ minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: textColor }}>User Management</h3>
          <p className="text-muted small mb-0">System-wide directory of administrators and team members</p>
        </div>
        <div className="d-flex gap-3">
            <div className="view-mode-toggle p-1 rounded-4 d-flex" style={{ background: subBg, border: `1px solid ${borderColor}` }}>
                <button 
                    className={`btn btn-sm px-3 rounded-3 border-0 transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary fw-bold' : 'text-muted'}`}
                    onClick={() => setViewMode('grid')}
                >
                    <FontAwesomeIcon icon={faThLarge} className="me-2" /> Grid
                </button>
                <button 
                    className={`btn btn-sm px-3 rounded-3 border-0 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary fw-bold' : 'text-muted'}`}
                    onClick={() => setViewMode('list')}
                >
                    <FontAwesomeIcon icon={faList} className="me-2" /> List
                </button>
            </div>
            <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-bold shadow-sm rounded-4"
            onClick={handleAddUser}
            >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Provision User</span>
            </button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {/* Table Toolbar */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUsers} className="text-primary me-2" />
              <h5 className="mb-0 fw-bold" style={{ color: textColor }}>User Directory</h5>
              <span className="badge bg-light text-primary ms-3 px-3 py-2 rounded-pill">{filteredUsers.length} Users Found</span>
            </div>
            <div className="position-relative" style={{ width: '400px' }}>
              <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ top: '50%', left: '1.25rem', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                className="form-control ps-5 border-0 shadow-sm rounded-4" 
                style={{ height: '3rem', background: cardBg, color: textColor }}
                placeholder="Filter by name, email, employee ID or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted small">Synchronizing directory protocols...</p>
            </div>
          ) : filteredUsers.length === 0 && users.length === 0 ? (
            <div className="text-center py-5 card border-0 shadow-sm rounded-5" style={{ background: cardBg }}>
              <div className="mb-3">
                <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '80px', height: '80px', background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(79,70,229,0.08)' }}>
                  <FontAwesomeIcon icon={faUserPlus} style={{ fontSize: '2rem', color: '#6366f1' }} />
                </div>
              </div>
              <h5 className="fw-bold mb-2" style={{ color: textColor }}>No Users Yet</h5>
              <p className="small text-muted mb-4 mx-auto" style={{ maxWidth: '360px' }}>Your team directory is empty. Add your first user to get started with user management.</p>
              <button className="btn btn-primary px-4 py-2 fw-bold shadow-sm rounded-4 d-inline-flex align-items-center gap-2" onClick={handleAddUser}>
                <FontAwesomeIcon icon={faUserPlus} /> Add First User
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5 card border-0 shadow-sm rounded-5" style={{ background: cardBg }}>
              <div className="mb-3">
                <div className="mx-auto d-flex align-items-center justify-content-center rounded-circle" style={{ width: '80px', height: '80px', background: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ fontSize: '2rem', color: '#f59e0b' }} />
                </div>
              </div>
              <h5 className="fw-bold mb-2" style={{ color: textColor }}>No Matching Users</h5>
              <p className="small text-muted mb-3 mx-auto" style={{ maxWidth: '360px' }}>
                No users match "<strong>{searchTerm}</strong>". Try adjusting your search or clear filters to see all {users.length} users.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-pill fw-bold" onClick={() => setSearchTerm('')}>
                  Clear Search
                </button>
                <button className="btn btn-primary btn-sm px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2" onClick={handleAddUser}>
                  <FontAwesomeIcon icon={faUserPlus} size="xs" /> Add User
                </button>
              </div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="card border-0 shadow-sm rounded-5 overflow-hidden" style={{ background: cardBg }}>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead style={{ background: subBg }}>
                      <tr className="text-muted extra-small text-uppercase">
                        <th className="border-0 ps-4 py-3">Identity Detail</th>
                        <th className="border-0 py-3">Organizational Matrix</th>
                        <th className="border-0 py-3">Security Level</th>
                        <th className="border-0 py-3">Connectivity</th>
                        <th className="border-0 pe-4 py-3 text-end">Administrative Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} style={{ borderColor: borderColor }}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <div className="avatar me-3 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold overflow-hidden" style={{ width: '40px', height: '40px' }}>
                                {u.avatar ? (
                                  <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  (u.name || "?").charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <div className="fw-bold mb-0 small" style={{ color: textColor }}>{u.name}</div>
                                <div className="text-muted extra-small">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="fw-semibold extra-small" style={{ color: textColor }}>{u.organization || "—"}</div>
                            <div className="text-muted extra-small d-flex align-items-center gap-1 mt-1">
                              {u.city && <span><FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />{u.city}</span>}
                              {u.country && <span><FontAwesomeIcon icon={faGlobe} className="me-1 ms-1" />{u.country}</span>}
                            </div>
                          </td>
                          <td>
                            <div className="badge bg-soft-primary text-primary rounded-pill fw-bold" style={{ fontSize: '0.65rem' }}>{u.role}</div>
                            <div className="extra-small text-muted mt-1 fw-bold">{u.empId}</div>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon 
                                icon={faCircle} 
                                className={`me-2 ${u.isOnline ? 'text-success' : 'text-secondary opacity-25'}`} 
                                style={{ fontSize: '0.5rem' }} 
                              />
                              <span className="extra-small text-muted">{u.isOnline ? 'Online' : 'Offline'}</span>
                            </div>
                          </td>
                          <td className="py-3 pe-4 text-end">
                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-icon btn-light rounded-circle shadow-none btn-sm" onClick={() => handleEdit(u)} title="Edit">
                                    <FontAwesomeIcon icon={faPen} className="text-muted" size="xs" />
                                </button>
                                <button className="btn btn-icon btn-light rounded-circle shadow-none btn-sm" onClick={() => handleDelete(u.id)} title="Delete">
                                    <FontAwesomeIcon icon={faTrash} className="text-danger" size="xs" />
                                </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="row">
              {filteredUsers.map(u => <UserCard key={u.id} u={u} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .extra-small { font-size: 0.7rem; }
        .bg-soft-primary { background: rgba(79, 70, 229, 0.1); }
        .bg-success-subtle { background: rgba(16, 185, 129, 0.1); }
        .bg-info-subtle { background: rgba(6, 182, 212, 0.1); }
        .bg-warning-subtle { background: rgba(245, 158, 11, 0.1); }
        .bg-danger-subtle { background: rgba(239, 68, 68, 0.1); }
        .bg-purple-subtle { background: rgba(139, 92, 246, 0.1); }
        .text-purple { color: #8b5cf6; }
        
        .user-premium-card:hover { transform: translateY(-8px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1) !important; }
        .btn-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; }
        .transition-all { transition: all 0.3s ease; }
        .border-dashed { border-style: dashed !important; }
        
        .dropdown-item:active { background-color: var(--bs-primary); }
        .nav-link.active { background: white !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default User;