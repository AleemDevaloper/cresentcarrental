import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiShield, FiStar, FiUser, FiBriefcase, FiCode, FiCpu, FiSettings, FiZap, FiAward, FiCommand, FiGlobe, FiKey, FiMoreVertical, FiPhone, FiMail, FiMessageCircle, FiEye } from 'react-icons/fi';
import { useApp } from '../../hooks/useApp';
import { listRoles, deleteRole } from '../../api/roles';
import { listUsers } from '../../api/users';

const RolesList = () => {
  const navigate = useNavigate();
  const { addNotification, confirmDialog } = useApp();
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const availableIcons = {
    FiShield: <FiShield />,
    FiUser: <FiUser />,
    FiStar: <FiStar />,
    FiBriefcase: <FiBriefcase />,
    FiCode: <FiCode />,
    FiCpu: <FiCpu />,
    FiSettings: <FiSettings />,
    FiZap: <FiZap />,
    FiAward: <FiAward />,
    FiCommand: <FiCommand />,
    FiGlobe: <FiGlobe />,
    FiKey: <FiKey />,
    FiPhone: <FiPhone />,
    FiPhoneCall: <FiPhone />,
    FiMail: <FiMail />,
    FiMessageCircle: <FiMessageCircle />,
    FiMessageSquare: <FiMessageCircle />,
  };

  const getIcon = (iconName) => {
    const normalizedName = {
      phone: 'FiPhone',
      call: 'FiPhone',
      mail: 'FiMail',
      email: 'FiMail',
      chat: 'FiMessageCircle',
      message: 'FiMessageCircle',
    }[String(iconName || '').toLowerCase()] || iconName;
    return availableIcons[normalizedName] || <FiShield />;
  };

  useEffect(() => {
    loadData();
    // Close dropdown on click outside
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, usersData] = await Promise.all([listRoles(), listUsers()]);
      setRoles(rolesData);
      setUsers(usersData);
    } catch (err) {
      addNotification('Failed to load data', 'danger');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const userCountByRole = useMemo(() => {
    const counts = {};
    users.forEach(user => {
      const key = user.roleId ? `id:${user.roleId}` : `name:${user.role}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [users]);

  const getUserCount = (role) => (
    userCountByRole[`id:${role.id}`] || userCountByRole[`name:${role.name}`] || 0
  );

  const handleAddRole = () => {
    navigate('/admin-dashboard/roles/add');
  };

  const handleEditRole = (id) => {
    navigate(`/admin-dashboard/roles/edit/${id}`);
  };

  const handleViewRole = (id) => {
    navigate(`/admin-dashboard/roles/edit/${id}`);
  };

  const handleDeleteRole = async (id) => {
    const confirmed = await confirmDialog({
      title: 'Delete Role',
      message: 'Are you sure you want to delete this role? This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Yes, Delete',
    });
    if (!confirmed) return;
    try {
      await deleteRole(id);
      addNotification('Role deleted successfully', 'success');
      loadData();
    } catch (err) {
      addNotification(err.message, 'danger');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-xl-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-4 px-4">
              <div>
                <h5 className="mb-0 fw-bold">Roles List</h5>
                <p className="text-muted small mb-0">Manage system roles and their descriptions.</p>
              </div>
              <button 
                className="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm"
                onClick={handleAddRole}
              >
                <FiPlus /> Add New Role
              </button>
            </div>
            <div className="card-body px-4 pb-4">
              <div className="row g-4 mt-1">
                {roles.length === 0 && (
                  <div className="col-12 text-center py-5">
                    <FiShield size={48} className="text-light mb-3" />
                    <h5 className="text-muted">No roles defined yet</h5>
                    <p className="text-muted small">Start by creating your first system role.</p>
                  </div>
                )}
                
                {roles.map(role => (
                  <div key={role.id} className="col-md-6 col-lg-4">
                    <div 
                      className="role-card p-4 border-0 rounded-4 transition h-100 position-relative overflow-hidden group shadow-sm" 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      {/* Color accent line */}
                      <div 
                        className="position-absolute top-0 start-0 w-100" 
                        style={{ height: '4px', background: role.color || '#4F46E5', opacity: 0.8 }}
                      ></div>

                      {!role.status && (
                        <div className="position-absolute top-0 end-0 bg-secondary text-white px-3 py-1 small fw-bold" style={{ fontSize: '10px', borderBottomLeftRadius: '12px', zIndex: 1 }}>INACTIVE</div>
                      )}

                      <div className="d-flex justify-content-between align-items-start mb-4 position-relative z-1">
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="role-icon-container rounded-4 shadow-sm transition-all group-hover-bounce" 
                            style={{ 
                              background: `linear-gradient(135deg, ${role.color || '#4F46E5'}15, ${role.color || '#4F46E5'}25)`,
                              color: role.color || '#4F46E5',
                              border: `1px solid ${role.color || '#4F46E5'}30`
                            }}
                          >
                            {React.cloneElement(getIcon(role.icon), { size: 40, strokeWidth: 2.2 })}
                          </div>
                          <div>
                              <h6 className="mb-0 fw-bold fs-5 text-dark">{role.name}</h6>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                <span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: `${role.color || '#4F46E5'}15`, color: role.color || '#4F46E5', fontSize: '10px', fontWeight: '800' }}>LEVEL {role.level || 1}</span>
                                {role.status && <span className="status-dot pulse" style={{ backgroundColor: '#10b981' }}></span>}
                              </div>
                          </div>
                        </div>
                        
                        {/* Three-dot Dropdown Menu */}
                        <div className="position-absolute" style={{ zIndex: 10, top: '1px', right: '1px' }}>
                          <button 
                            className="btn btn-icon btn-white hover-scale" style={{width: "20px", height: "20px", padding: "0"}}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === role.id ? null : role.id);
                            }}
                          >
                            <FiMoreVertical size={15} className="text-muted" />
                          </button>
                          
                          {activeDropdown === role.id && (
                            <div className="dropdown-menu show dropdown-menu-end border-0 shadow-lg p-2 mt-2 transition-all" style={{ right: '0', borderRadius: '12px', minWidth: '140px' }}>
                              <button 
                                className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2"
                                onClick={() => handleViewRole(role.id)}
                              >
                                <FiEye size={18} className="text-primary" />
                                <span className="small fw-bold">View Profile</span>
                              </button>
                              <button 
                                className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2"
                                onClick={() => handleEditRole(role.id)}
                              >
                                <FiEdit2 size={18} className="text-primary" />
                                <span className="small fw-bold">Edit Role</span>
                              </button>
                              <div className="dropdown-divider opacity-50"></div>
                              <button 
                                className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2 text-danger"
                                onClick={() => handleDeleteRole(role.id)}
                              >
                                <FiTrash2 size={18} />
                                <span className="small fw-bold">Delete Role</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-muted mb-4 line-clamp-3 fs-6" style={{ minHeight: '4.5em', lineHeight: '1.6' }}>
                        {role.description || 'No description provided for this role.'}
                      </p>
                      
                      <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between position-relative z-1">
                          <div className="d-flex align-items-center gap-3">
                              <div className="avatar-group d-flex align-items-center">
                                <div className="p-2 rounded-circle bg-light d-flex align-items-center justify-content-center border border-white" style={{ width: '32px', height: '32px' }}>
                                  <FiUsers size={14} className="text-muted" />
                                </div>
                              </div>
                              <span className="fw-bold small text-dark">{getUserCount(role)} Members</span>
                          </div>
                          <button 
                            className="btn btn-sm px-3 rounded-pill fw-bold transition-all group-hover-px" 
                            style={{ 
                              backgroundColor: `${role.color || '#4F46E5'}15`, 
                              color: role.color || '#4F46E5',
                              border: 'none'
                            }}
                            onClick={() => handleEditRole(role.id)}
                          >
                            Manage <FiKey className="ms-1 small" />
                          </button>
                      </div>

                      {/* Subtle background glow */}
                      <div 
                        className="position-absolute bottom-0 end-0 opacity-0 group-hover-opacity-10 transition-all" 
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          background: `radial-gradient(circle, ${role.color || '#4F46E5'} 0%, transparent 70%)`,
                          transform: 'translate(30%, 30%)',
                          zIndex: 0
                        }}
                      ></div>
                    </div>
                  </div>
                ))}

                {/* Default Admin role */}
                {!roles.some(r => r.name === 'Admin') && (
                  <div className="col-md-6 col-lg-4">
                    <div className="role-card p-4 border-0 rounded-4 bg-light position-relative h-100 shadow-sm overflow-hidden group">
                      <div className="position-absolute top-0 start-0 w-100 h-1" style={{ height: '4px', background: '#64748b' }}></div>
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-3 bg-white text-secondary rounded-4 shadow-sm group-hover-bounce transition-all">
                            <FiShield size={28} />
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold fs-5">Admin</h6>
                            <span className="badge rounded-pill px-2 py-1 mt-1" style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '10px', fontWeight: '800' }}>SYSTEM ROLE</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted mb-4 fs-6" style={{ lineHeight: '1.6' }}>Full access to all modules and system settings. This role is protected and cannot be modified.</p>
                      <div className="mt-auto pt-3 border-top d-flex align-items-center gap-2">
                        <div className="p-2 rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                          <FiUsers size={14} className="text-muted" />
                        </div>
                        <span className="fw-bold small">{userCountByRole['name:Admin'] || 0} Members</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .role-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        .group:hover .group-hover-actions {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .group-hover-actions {
          transform: translateY(-10px);
        }
        .group:hover .group-hover-bounce {
          transform: scale(1.1) translateY(-2px);
        }
        .group:hover .group-hover-px {
          padding-left: 1.5rem !important;
          padding-right: 1.5rem !important;
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
        .btn-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .pulse {
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .role-icon-container {
          width: 104px;
          height: 104px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 104px;
          transition: all 0.3s ease;
        }
        .role-icon-container svg {
          width: 56px !important;
          height: 56px !important;
          stroke-width: 2.5;
        }
      `}} />
    </div>
  );
};

export default RolesList;
