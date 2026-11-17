import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiShield, FiCheckCircle, FiStar, FiUser, FiBriefcase, FiCode, FiCpu, FiSettings, FiZap, FiAward, FiCommand, FiGlobe, FiKey, FiInfo, FiActivity, FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';
import { useApp } from '../../hooks/useApp';
import { createRole, updateRole, listRoles } from '../../api/roles';
import Common from '../../components/common/Common';
import TopNavBar from '../../components/layout/TopNavBar';

const AddRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification, setActiveTab } = useApp();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4F46E5',
    icon: 'FiShield',
    level: 1,
    status: true
  });

  const colors = [
    '#4F46E5', '#6366F1', '#EC4899', '#EF4444', 
    '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#06B6D4', '#64748B', '#F43F5E', '#14B8A6'
  ];

  const availableIcons = [
    { name: 'FiShield', icon: <FiShield /> },
    { name: 'FiUser', icon: <FiUser /> },
    { name: 'FiStar', icon: <FiStar /> },
    { name: 'FiBriefcase', icon: <FiBriefcase /> },
    { name: 'FiCode', icon: <FiCode /> },
    { name: 'FiCpu', icon: <FiCpu /> },
    { name: 'FiSettings', icon: <FiSettings /> },
    { name: 'FiZap', icon: <FiZap /> },
    { name: 'FiAward', icon: <FiAward /> },
    { name: 'FiCommand', icon: <FiCommand /> },
    { name: 'FiGlobe', icon: <FiGlobe /> },
    { name: 'FiKey', icon: <FiKey /> },
    { name: 'FiPhone', icon: <FiPhone /> },
    { name: 'FiMail', icon: <FiMail /> },
    { name: 'FiMessageCircle', icon: <FiMessageCircle /> },
  ];

  const getIconComponent = (iconName) => {
    const found = availableIcons.find(i => i.name === iconName);
    return found ? found.icon : <FiShield />;
  };

  useEffect(() => {
    if (id) {
      loadRole();
    }
  }, [id]);

  const loadRole = async () => {
    try {
      const roles = await listRoles();
      const role = roles.find(r => r.id === parseInt(id));
      if (role) {
        setFormData({
          name: role.name,
          description: role.description || '',
          color: role.color || '#4F46E5',
          icon: role.icon || 'FiShield',
          level: role.level || 1,
          status: role.status === 1 || role.status === true
        });
        setSelectedPermissions(role.permissions?.map(p => p.id) || []);
      }
    } catch {
      addNotification('Failed to load role details', 'danger');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      addNotification('Role name is required', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, permissions: selectedPermissions };
      if (id) {
        await updateRole(id, payload);
        addNotification('Role updated successfully', 'success');
      } else {
        await createRole(payload);
        addNotification('Role created successfully', 'success');
      }
      setActiveTab('createroles');
      navigate('/admin-dashboard'); 
    } catch (err) {
      addNotification(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setActiveTab('createroles');
    navigate('/admin-dashboard');
  };

  return (
    <div className="container-fluid vh-100 px-0 overflow-hidden">
      <div className="row h-100 g-0">
        <Common isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-grow-1 min-w-0 ps-0 position-relative d-flex flex-column" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', minHeight: 0 }}>
          <TopNavBar
            heading={id ? "Edit Role" : "Create Role"}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
          
          <div className="role-form-scroll p-4 flex-grow-1 overflow-y-auto">
            <div className="row justify-content-center">
              <div className="col-xl-11">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-3">
                    <button 
                      className="btn btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 transition" 
                      onClick={handleBack}
                    >
                      <FiArrowLeft /> Back
                    </button>
                    <div className="vr mx-2"></div>
                    <h5 className="mb-0 fw-bold">{id ? 'Edit Role Details' : 'Configure New Role'}</h5>
                  </div>

                  <div className="card-body p-4 p-md-5 pt-0">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-5">
                        {/* LEFT COLUMN: Inputs */}
                        <div className="col-lg-7">
                          <div className="mb-5">
                            <label className="form-label fw-bold text-dark small mb-3 d-flex align-items-center gap-2">
                              <FiInfo className="text-primary" /> ROLE IDENTITY
                            </label>
                            <div className="input-group input-group-lg shadow-sm rounded-4 overflow-hidden border">
                              <span className="input-group-text bg-white border-0 text-muted ps-4">
                                {getIconComponent(formData.icon)}
                              </span>
                              <input 
                                type="text" 
                                className="form-control border-0 py-3 ps-2 shadow-none" 
                                placeholder="e.g. Lead Architect"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-5">
                            <label className="form-label fw-bold text-dark small mb-3 d-flex align-items-center gap-2">
                              <FiActivity className="text-primary" /> DESCRIPTION & STATUS
                            </label>
                            <textarea 
                              className="form-control border shadow-sm rounded-4 p-4 shadow-none mb-3" 
                              rows="3" 
                              placeholder="Access levels and responsibilities for this role..."
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                            
                            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-4 border">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`p-2 rounded-circle ${formData.status ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                                        <FiActivity size={18} />
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">Role Status</h6>
                                        <p className="text-muted small mb-0">{formData.status ? 'Active and available' : 'Temporarily disabled'}</p>
                                    </div>
                                </div>
                                <div className="form-check form-switch form-switch-lg">
                                    <input 
                                        className="form-check-input cursor-pointer" 
                                        type="checkbox" 
                                        checked={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                                    />
                                </div>
                            </div>
                          </div>

                          <div className="mb-5">
                            <label className="form-label fw-bold text-dark small mb-3 d-flex align-items-center gap-2">
                              <FiShield className="text-primary" /> ACCESS LEVEL
                            </label>
                            <div className="p-4 bg-light rounded-4 border">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-bold text-muted">Base Access</span>
                                    <span className="small fw-bold text-primary">Level {formData.level}</span>
                                    <span className="small fw-bold text-muted">Full Control</span>
                                </div>
                                <input 
                                    type="range" 
                                    className="form-range custom-range" 
                                    min="1" 
                                    max="10" 
                                    step="1"
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                                />
                                <div className="d-flex justify-content-between mt-2">
                                    {[1,2,3,4,5,6,7,8,9,10].map(l => (
                                        <span key={l} className={`small ${formData.level === l ? 'fw-bold text-primary' : 'text-muted'}`} style={{ fontSize: '10px' }}>{l}</span>
                                    ))}
                                </div>
                            </div>
                          </div>

                          <div className="row g-4 mb-5">
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-dark small mb-3">BRAND COLOR</label>
                                <div className="p-4 rounded-4 bg-light border">
                                    <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                        {colors.map(c => (
                                            <button
                                            key={c}
                                            type="button"
                                            className={`rounded-circle border-0 transition-all ${formData.color === c ? 'ring-primary' : 'hover-scale'}`}
                                            style={{ 
                                                backgroundColor: c, 
                                                width: '32px', 
                                                height: '32px',
                                                boxShadow: formData.color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : 'none'
                                            }}
                                            onClick={() => setFormData({ ...formData, color: c })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold text-dark small mb-3">ROLE ICON</label>
                                <div className="p-4 rounded-4 bg-light border overflow-auto" style={{ maxHeight: '140px' }}>
                                    <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                        {availableIcons.map(item => (
                                            <button
                                            key={item.name}
                                            type="button"
                                            className={`btn btn-sm rounded-3 transition-all ${formData.icon === item.name ? 'btn-primary shadow' : 'btn-white border'}`}
                                            style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => setFormData({ ...formData, icon: item.name })}
                                            >
                                                {item.icon}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Preview & Tips */}
                        <div className="col-lg-5 ps-lg-5 border-start">
                            <div className="sticky-top" style={{ top: '20px', zIndex: 1 }}>
                                <label className="form-label fw-bold text-dark small mb-4 text-uppercase tracking-wider">Live Preview</label>
                                
                                <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-5 transition-all">
                                    <div className="card-body p-0">
                                        <div className="p-4" style={{ backgroundColor: formData.color }}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="p-3 bg-white bg-opacity-25 rounded-4 text-white">
                                                    {React.cloneElement(getIconComponent(formData.icon), { size: 32 })}
                                                </div>
                                                <div className="badge bg-white text-dark rounded-pill px-3 py-2 fw-bold shadow-sm">
                                                    LVL {formData.level}
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-white fw-bold mb-1">{formData.name || 'Role Name'}</h3>
                                                <p className="text-white text-opacity-75 small mb-0">System Authority Level</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white">
                                            <p className="text-muted small mb-4">{formData.description || 'Provide a description to see it here...'}</p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className={`rounded-circle ${formData.status ? 'bg-success' : 'bg-secondary'}`} style={{ width: '10px', height: '10px' }}></div>
                                                    <span className="small fw-bold">{formData.status ? 'Active Role' : 'Inactive'}</span>
                                                </div>
                                                <FiShield className="text-light" size={24} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-4 bg-primary-subtle border-0">
                                    <h6 className="fw-bold text-primary mb-3">Pro Tips</h6>
                                    <ul className="list-unstyled small text-primary d-flex flex-column gap-3 mb-0">
                                        <li className="d-flex gap-2">
                                            <FiCheckCircle className="mt-1 flex-shrink-0" />
                                            <span>Use colors to group similar departments (e.g., Blue for Tech, Pink for HR).</span>
                                        </li>
                                        <li className="d-flex gap-2">
                                            <FiCheckCircle className="mt-1 flex-shrink-0" />
                                            <span>Access level 10 gives full administrative privileges across all modules.</span>
                                        </li>
                                        <li className="d-flex gap-2">
                                            <FiCheckCircle className="mt-1 flex-shrink-0" />
                                            <span>Icons help users identify roles quickly in member lists and chat sessions.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                      </div>

                      <hr className="my-5 opacity-10" />

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2 text-muted small">
                            <FiActivity /> 
                            <span>Last updated: {new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="d-flex gap-3">
                          <button 
                            type="submit" 
                            className="btn btn-primary px-5 py-3 rounded-pill shadow-lg d-flex align-items-center gap-2 fw-bold transition-all hover-scale"
                            disabled={loading}
                          >
                            {loading ? <span className="spinner-border spinner-border-sm"></span> : <><FiSave /> {id ? 'Update Role Settings' : 'Initialize New Role'}</>}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .cursor-pointer { cursor: pointer; }
        .transition { transition: all 0.2s; }
        .transition-all { transition: all 0.3s ease-in-out; }
        .hover-scale:hover { transform: scale(1.1); }
        .ring-primary { box-shadow: 0 0 0 2px white, 0 0 0 4px #4F46E5 !important; transform: scale(1.2); }
        
        .custom-range::-webkit-slider-thumb {
            background: #4F46E5;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .custom-range::-moz-range-thumb {
            background: #4F46E5;
            border: 2px solid white;
        }
        
        .form-switch-lg .form-check-input {
            width: 3.5rem;
            height: 1.75rem;
        }
        
        .tracking-wider { letter-spacing: 0.1em; }
        .btn-white { background: white; color: #64748b; }
        .btn-white:hover { background: #f8fafc; color: #4F46E5; }
      `}} />
    </div>
  );
};

export default AddRole;
