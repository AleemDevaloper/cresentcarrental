import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, FiUsers, FiShield, FiSearch, FiCheckCircle, 
  FiFilter, FiRefreshCw, FiArrowRight, FiMail, FiCalendar,
  FiActivity, FiMoreVertical, FiExternalLink, FiUserCheck,
  FiGrid, FiList, FiGlobe, FiBriefcase, FiClock, FiPhone, FiMessageSquare
} from 'react-icons/fi';
import { useApp } from '../../hooks/useApp';
import { listRoles, bulkUpdateUserRoles } from '../../api/roles';
import { listUsers } from '../../api/users';

const CreateRole = () => {
  const navigate = useNavigate();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkRole, setBulkRole] = useState('');
  const [updatingBulk, setUpdatingBulk] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // Default to grid for better visual impact

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rolesData, usersData] = await Promise.all([listRoles(), listUsers()]);
      setRoles(rolesData || []);
      setUsers(usersData || []);
    } catch (err) {
      addNotification('Failed to synchronize personnel repository', 'danger');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => navigate('/admin-dashboard/roles/add');

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkRole) {
      addNotification('Target protocol specification mandatory', 'warning');
      return;
    }
    setUpdatingBulk(true);
    try {
      await bulkUpdateUserRoles(selectedUsers, bulkRole);
      addNotification(`Access protocols updated for ${selectedUsers.length} personnel`, 'success');
      setSelectedUsers([]);
      setBulkRole('');
      loadData();
    } catch (err) {
      addNotification(err.message || 'Update failed', 'danger');
    } finally {
      setUpdatingBulk(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.empId || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const cardBg = isDark ? '#111827' : '#ffffff';
  const subBg = isDark ? '#1f2937' : '#f9fafb';
  const borderColor = isDark ? '#374151' : '#f1f5f9';

  const PersonnelCard = ({ user }) => {
    const userRole = roles.find(r => r.name === user.role);
    const roleColor = userRole?.color || '#4F46E5';
    const isSelected = selectedUsers.includes(user.id);
    const performance = 85; // Standard base performance

    return (
      <div className="col-xl-4 col-lg-6">
        <div 
          className={`card border-0 shadow-sm h-100 personnel-premium-card transition-all ${isSelected ? 'card-selected-pro' : ''}`}
          style={{ borderRadius: '28px', background: cardBg, cursor: 'pointer' }}
          onClick={() => toggleUserSelection(user.id)}
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar-wrapper position-relative">
                  <div className="avatar-pro-lg rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                    style={{ width: '64px', height: '64px', background: `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`, fontSize: '1.2rem' }}>
                    {user.avatar ? <img src={user.avatar} className="rounded-circle w-100 h-100 object-fit-cover" alt="" /> : (user.name || "U").charAt(0)}
                  </div>
                  {user.isOnline && <div className="status-indicator-pro online position-absolute border-3" style={{ width: 18, height: 18 }}></div>}
                </div>
                <div>
                  <h6 className="fw-bold mb-0" style={{ color: textColor }}>{user.name}</h6>
                  <div className="extra-small text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>{user.role}</div>
                  <div className="extra-small text-muted mt-1">{user.empId || 'SYSTEM-001'}</div>
                </div>
              </div>
              <div className="form-check custom-checkbox-pro" onClick={e => e.stopPropagation()}>
                <input 
                  className="form-check-input shadow-none" 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => toggleUserSelection(user.id)}
                />
              </div>
            </div>

            <div className="row g-2 mb-4">
               <div className="col-6">
                  <div className="p-3 rounded-4" style={{ background: subBg }}>
                     <div className="extra-small text-muted mb-1 fw-bold text-uppercase"><FiBriefcase size={10} className="me-1" /> Dept</div>
                     <div className="small fw-bold text-truncate" style={{ color: textColor }}>{user.organization || 'Corporate'}</div>
                  </div>
               </div>
               <div className="col-6">
                  <div className="p-3 rounded-4" style={{ background: subBg }}>
                     <div className="extra-small text-muted mb-1 fw-bold text-uppercase"><FiGlobe size={10} className="me-1" /> Locale</div>
                     <div className="small fw-bold" style={{ color: textColor }}>{user.city || 'Global'}</div>
                  </div>
               </div>
            </div>

            <div className="performance-track mb-4">
               <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="extra-small fw-bold text-muted text-uppercase">Performance Capacity</span>
                  <span className="extra-small fw-bold" style={{ color: roleColor }}>{performance}%</span>
               </div>
               <div className="progress rounded-pill" style={{ height: '6px', background: isDark ? '#334155' : '#f1f5f9' }}>
                  <div className="progress-bar rounded-pill" style={{ width: `${performance}%`, backgroundColor: roleColor }}></div>
               </div>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
               <div className="d-flex gap-2">
                  <button className="btn btn-icon-pro btn-sm rounded-circle" title="Email Personnel"><FiMail size={14} /></button>
                  <button className="btn btn-icon-pro btn-sm rounded-circle" title="Chat Interface"><FiMessageSquare size={14} /></button>
                  <button className="btn btn-icon-pro btn-sm rounded-circle" title="Telephony"><FiPhone size={14} /></button>
               </div>
               <button className="btn btn-link text-primary text-decoration-none extra-small fw-bold d-flex align-items-center gap-1">
                  VIEW PROFILE <FiArrowRight size={12} />
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '500px' }}>
        <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="mt-4 text-muted extra-small fw-bold text-uppercase tracking-widest">Initialising Personnel Directory...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 animate-fade-in">
      {/* Dynamic Management Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: textColor, letterSpacing: '-0.5px' }}>Access Control & Personnel Management</h4>
          <p className="text-muted small mb-0 fw-medium">Global directory for security provisioning and organizational role assignment.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
            <div className="view-toggle-pro p-1 rounded-pill border d-flex gap-1" style={{ background: isDark ? '#111827' : '#fff', borderColor }}>
                <button 
                    className={`btn btn-sm rounded-pill px-3 transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
                    onClick={() => setViewMode('list')}
                >
                    <FiList size={16} />
                </button>
                <button 
                    className={`btn btn-sm rounded-pill px-3 transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
                    onClick={() => setViewMode('grid')}
                >
                    <FiGrid size={16} />
                </button>
            </div>
            <button 
                className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4 fw-bold shadow-sm hover-lift"
                style={{ height: '46px' }}
                onClick={handleAddRole}
            >
                <FiPlus size={20} /> <span>Define New Role</span>
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card border-0 shadow-lg-soft overflow-hidden" style={{ borderRadius: '32px', background: cardBg }}>
        {/* Table Toolbar */}
        <div className="p-4 border-bottom" style={{ borderColor }}>
            <div className="row g-3 align-items-center">
                <div className="col-md-6">
                    <div className="search-container position-relative">
                        <FiSearch className="position-absolute text-muted" style={{ top: '50%', left: '1.25rem', transform: 'translateY(-50%)', zIndex: 1 }} />
                        <input 
                            type="text" 
                            className="form-control ps-5 border-0 rounded-4 shadow-none" 
                            style={{ background: subBg, height: '52px', color: textColor, fontSize: '0.95rem' }}
                            placeholder="Search by name, identity, email or role..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6 text-md-end">
                    <div className="d-flex gap-2 justify-content-md-end">
                        <button className="btn btn-light rounded-4 px-3 d-flex align-items-center gap-2 border" style={{ height: '52px' }} onClick={loadData}>
                            <FiRefreshCw className={loading ? 'spin' : ''} /> <span className="small fw-bold">Sync</span>
                        </button>
                        <button className="btn btn-light rounded-4 px-3 d-flex align-items-center gap-2 border" style={{ height: '52px' }}>
                            <FiFilter /> <span className="small fw-bold">Filter</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedUsers.length > 0 && (
            <div className="p-3 bg-primary bg-opacity-10 border-bottom border-primary border-opacity-25 animate-slide-down">
                <div className="container-fluid">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 px-2">
                        <div className="d-flex align-items-center gap-3">
                            <div className="selection-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: 32, height: 32, fontSize: '13px' }}>
                                {selectedUsers.length}
                            </div>
                            <div>
                                <div className="fw-bold small" style={{ color: textColor }}>Personnel Selected</div>
                                <div className="extra-small text-muted fw-medium text-uppercase">Mass Security Protocol Update</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <select 
                                className="form-select border-0 rounded-3 shadow-sm px-4"
                                style={{ width: '220px', height: '42px', fontSize: '13px', background: isDark ? '#1f2937' : '#fff' }}
                                value={bulkRole}
                                onChange={(e) => setBulkRole(e.target.value)}
                            >
                                <option value="">Select Target Protocol...</option>
                                <option value="Admin">Admin</option>
                                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                            <button 
                                className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
                                style={{ height: '42px', fontSize: '13px' }}
                                onClick={handleBulkUpdate}
                                disabled={updatingBulk}
                            >
                                {updatingBulk ? 'Processing...' : 'Assign Role'}
                            </button>
                            <button className="btn btn-link text-muted text-decoration-none small fw-bold px-3" onClick={() => setSelectedUsers([])}>Dismiss</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="main-view-container" style={{ background: viewMode === 'grid' ? subBg : 'transparent' }}>
          {viewMode === 'list' ? (
            /* Professional Personnel Table */
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr className="text-muted extra-small text-uppercase fw-bold border-bottom" style={{ background: subBg }}>
                            <th style={{ width: '60px' }} className="ps-4 py-4">
                                <div className="form-check custom-checkbox-pro">
                                    <input 
                                        className="form-check-input shadow-none" 
                                        type="checkbox" 
                                        onChange={handleSelectAll}
                                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                    />
                                </div>
                            </th>
                            <th className="py-4">Personnel Identity</th>
                            <th className="py-4">Security Protocol</th>
                            <th className="py-4">Contact Gateway</th>
                            <th className="py-4">System Status</th>
                            <th className="py-4 pe-4 text-end">Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-5">
                                    <div className="py-5">
                                        <div className="mb-3 opacity-20"><FiUsers size={64} /></div>
                                        <h5 className="fw-bold" style={{ color: textColor }}>No personnel found</h5>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className={`${selectedUsers.includes(user.id) ? 'row-selected' : ''}`} onClick={() => toggleUserSelection(user.id)} style={{ cursor: 'pointer' }}>
                                    <td className="ps-4 py-3">
                                        <div className="form-check custom-checkbox-pro" onClick={e => e.stopPropagation()}>
                                            <input 
                                                className="form-check-input shadow-none" 
                                                type="checkbox" 
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUserSelection(user.id)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="avatar-wrapper position-relative">
                                                <div className="avatar-pro rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" style={{ width: '48px', height: '48px', background: `linear-gradient(135deg, ${roles.find(r => r.name === user.role)?.color || '#4F46E5'}, #4F46E5dd)` }}>
                                                    {user.avatar ? <img src={user.avatar} className="rounded-circle w-100 h-100 object-fit-cover" alt="" /> : (user.name || "U").charAt(0)}
                                                </div>
                                                {user.isOnline && <div className="status-indicator-pro online position-absolute"></div>}
                                            </div>
                                            <div>
                                                <div className="fw-bold small mb-0" style={{ color: textColor }}>{user.name}</div>
                                                <div className="extra-small text-muted fw-medium d-flex align-items-center gap-1">
                                                    <FiActivity size={10} /> {user.empId || 'SYS-USR'} • {user.city || 'Global'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ backgroundColor: `${roles.find(r => r.name === user.role)?.color || '#4F46E5'}15`, color: roles.find(r => r.name === user.role)?.color || '#4F46E5', fontSize: '10px' }}>
                                            {(user.role || "MEMBER").toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="extra-small fw-bold" style={{ color: textColor }}>{user.email}</div>
                                    </td>
                                    <td>
                                        {user.isOnline ? (
                                            <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 extra-small fw-bold d-inline-flex align-items-center gap-2">
                                                <div className="pulse-dot"></div> ACTIVE
                                            </div>
                                        ) : (
                                            <div className="badge bg-secondary bg-opacity-10 text-muted rounded-pill px-3 py-2 extra-small fw-bold">OFFLINE</div>
                                        )}
                                    </td>
                                    <td className="pe-4 text-end">
                                        <button className="btn btn-icon-pro rounded-circle"><FiMoreVertical size={14} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          ) : (
            /* Premium Grid View */
            <div className="p-4">
              <div className="row g-4">
                {filteredUsers.length === 0 ? (
                   <div className="col-12 text-center py-5">
                      <div className="mb-3 opacity-20"><FiUsers size={64} /></div>
                      <h5 className="fw-bold" style={{ color: textColor }}>No personnel found</h5>
                   </div>
                ) : (
                   filteredUsers.map(user => <PersonnelCard key={user.id} user={user} />)
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Table Footer */}
        <div className="p-4 bg-light bg-opacity-50 border-top d-flex justify-content-between align-items-center" style={{ borderColor }}>
            <div className="extra-small text-muted fw-bold">Showing {filteredUsers.length} of {users.length} total entries</div>
            <div className="d-flex gap-2">
                <button className="btn btn-light btn-sm rounded-3 border px-3 extra-small fw-bold" disabled>Previous</button>
                <button className="btn btn-light btn-sm rounded-3 border px-3 extra-small fw-bold" disabled>Next</button>
            </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .extra-small { font-size: 11px; }
        .rounded-4 { border-radius: 1rem !important; }
        .shadow-lg-soft { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05) !important; }
        
        .personnel-premium-card:hover { transform: translateY(-8px); box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1) !important; }
        .card-selected-pro { border: 2.5px solid #4f46e5 !important; background: rgba(79, 70, 229, 0.02) !important; }
        
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        
        .status-indicator-pro { width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; bottom: 0; right: 0; z-index: 2; }
        .status-indicator-pro.online { background-color: #10b981; }
        
        .pulse-dot { width: 6px; height: 6px; background-color: #10b981; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            70% { transform: scale(1.2); opacity: 0; box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(1); opacity: 0; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        .custom-checkbox-pro .form-check-input { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #e2e8f0; cursor: pointer; transition: all 0.2s ease; }
        .custom-checkbox-pro .form-check-input:checked { background-color: #4f46e5; border-color: #4f46e5; }
        
        .btn-icon-pro { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #94a3b8; transition: all 0.2s ease; }
        .btn-icon-pro:hover { background: rgba(0,0,0,0.05); color: #4f46e5; }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2) !important; }
      `}} />
    </div>
  );
};

export default CreateRole;
