import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../../hooks/useApp';
import { EnableDisableButton } from '../../components/common';
import { useTranslation } from '../../hooks/useTranslation';
import Input from '../../components/common/Input';
import AccountPic from './AccountPic';
import { updateUser } from '../../api/users';
import client, { clearCache } from '../../api/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faUserGear, 
  faSliders, 
  faChevronRight, 
  faShieldHalved,
  faCircleCheck,
  faBell,
  faGlobe,
  faPalette,
  faBuildingColumns,
  faTrash,
  faBan,
  faUserCheck,
  faTriangleExclamation,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const AdminSettings = () => {
  const { t } = useTranslation();
  const { currentUser, settings, updateUserProfile, updateSettings, settingtheme, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [deletionRequests, setDeletionRequests] = useState([]);
  const [deletionLoading, setDeletionLoading] = useState(false);
  const [userRequestSent, setUserRequestSent] = useState(false);
  const [userReason, setUserReason] = useState('');

  const fetchDeletionRequests = useCallback(async () => {
    setDeletionLoading(true);
    try {
      const res = await client.get('/approvals', { params: { type: 'deletion', view: 'admin' } });
      setDeletionRequests(res.data.data || []);
    } catch (err) {
      console.error('Error fetching deletion requests', err);
    } finally {
      setDeletionLoading(false);
    }
  }, []);

  useEffect(() => {
    const role = (currentUser?.role || '').toLowerCase();
    const admin = role === 'admin' || role === 'company admin' || role === 'company_admin' || role === 'super admin' || role === 'superadmin';
    if (admin) {
      fetchDeletionRequests();
    }
  }, [currentUser, fetchDeletionRequests]);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    organization: currentUser?.organization || '',
    email: currentUser?.email || '',
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        organization: currentUser.organization || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState(settings);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email) {
      setErrors({ profile: t('name_email_required') });
      return;
    }
    
    setLoading(true);
    try {
      const updated = await updateUser(currentUser.id, profileData);
      updateUserProfile(updated);
      setErrors({});
      setSuccess(t('profile_updated_success'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({ profile: err.message || t('failed_update_profile') });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrors({ password: t('all_password_fields_required') });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: t('passwords_do_not_match') });
      return;
    }
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
    setSuccess(t('password_changed_success'));
    setTimeout(() => setSuccess(''), 3000);
  };

  const handlePreferencesUpdate = (e) => {
    e.preventDefault();
    updateSettings(preferences);
    setSuccess(t('preferences_updated_success'));
    setTimeout(() => setSuccess(''), 3000);
  };

  const userRole = (currentUser?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'company admin' || userRole === 'company_admin' || userRole === 'super admin' || userRole === 'superadmin';

  const menuItems = [
    { id: 'profile', label: t('personal_profile'), icon: faUser, color: '#0ea5e9', desc: t('personal_profile_desc') },
    { id: 'account', label: t('security_access'), icon: faUserGear, color: '#f59e0b', desc: t('security_access_desc') },
    { id: 'preferences', label: t('platform_settings'), icon: faSliders, color: '#10b981', desc: t('platform_settings_desc') },
    { id: 'deletion', label: isAdmin ? 'Deletion Requests' : 'Delete Account', icon: faTrash, color: '#f43f5e', desc: isAdmin ? 'Review account closures' : 'Request account deletion' }
  ];

  return (
    <div className="settings-modern-workspace fade-in-up">
      <div className="row g-4">
        {/* Left Sidebar Menu */}
        <div className="col-xl-3 col-lg-4">
          <div className="settings-nav-card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="p-4 bg-light border-bottom">
              <h6 className="fw-800 text-uppercase letter-spacing-1 mb-1 text-primary">{t('system_config')}</h6>
              <p className="text-muted small mb-0">{t('centralized_platform_mgmt')}</p>
            </div>
            <div className="nav-menu-list">
              {menuItems.map(item => (
                <div 
                  key={item.id} 
                  className={`nav-menu-item d-flex align-items-center gap-3 p-3 cursor-pointer transition-all ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="item-icon-wrapper rounded-3 d-flex align-items-center justify-content-center shadow-sm" style={{ background: item.color, width: 40, height: 40 }}>
                    <FontAwesomeIcon icon={item.icon} className="text-white" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{item.label}</div>
                    <div className="extra-small text-muted">{item.desc}</div>
                  </div>
                  {activeTab === item.id && <FontAwesomeIcon icon={faChevronRight} className="text-primary small" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="col-xl-9 col-lg-8">
          <div className="settings-content-card shadow-sm border-0 rounded-4 p-4 p-md-5 h-100 bg-white position-relative">
            {success && (
              <div className="settings-toast animate-fade-in-down shadow-lg">
                <FontAwesomeIcon icon={faCircleCheck} className="me-2" /> {success}
              </div>
            )}

            <div className="content-header mb-5 border-bottom pb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <h3 className="fw-800 mb-0">{menuItems.find(m => m.id === activeTab)?.label}</h3>
                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">{t('pro_version')}</span>
              </div>
              <p className="text-muted mb-0">{menuItems.find(m => m.id === activeTab)?.desc}</p>
            </div>

            {activeTab === 'profile' && (
              <div className="tab-pane-content">
                <div className="row g-4 align-items-center mb-5 bg-light p-4 rounded-4">
                  <div className="col-auto">
                    <div className="settings-avatar-wrapper shadow-lg rounded-circle border border-4 border-white">
                      <AccountPic />
                    </div>
                  </div>
                  <div className="col">
                    <h5 className="fw-800 mb-1">{profileData.name || t('anonymous_user')}</h5>
                    <p className="text-muted small mb-0">{profileData.email}</p>
                    <div className="mt-2">
                      <span className="badge bg-white text-dark border rounded-pill px-3 py-2 fw-bold small">{t('user_id')}: {currentUser?.id}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <Input label={t('first_name')} value={profileData.first_name} onChange={(e) => setProfileData({...profileData, first_name: e.target.value})} placeholder="John" />
                    </div>
                    <div className="col-md-6">
                      <Input label={t('last_name')} value={profileData.last_name} onChange={(e) => setProfileData({...profileData, last_name: e.target.value})} placeholder="Doe" />
                    </div>
                    <div className="col-12">
                      <Input label={t('full_display_name')} value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <Input label={t('organization')} value={profileData.organization} onChange={(e) => setProfileData({...profileData, organization: e.target.value})} icon={faBuildingColumns} />
                    </div>
                    <div className="col-md-6">
                      <Input label={t('email_address')} type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} icon={faGlobe} required />
                    </div>
                  </div>

                  {errors.profile && <div className="text-danger small mt-3 fw-bold">{errors.profile}</div>}

                  <div className="pt-5 border-top mt-5">
                    <button type="submit" className="btn-pro-primary px-5 py-3 rounded-4" disabled={loading}>
                      {loading ? t('committing') : t('commit_profile_update')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="tab-pane-content">
                <div className="mb-5 d-flex align-items-center gap-3 p-4 rounded-4 border-start border-4 border-warning bg-warning-subtle">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-warning h4 mb-0" />
                  <div>
                    <h6 className="fw-bold mb-1 text-dark">{t('security_hardening')}</h6>
                    <p className="small text-muted mb-0">{t('security_hardening_desc')}</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange}>
                  <div className="row g-4">
                    <div className="col-12">
                      <Input label={t('current_system_password')} type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <Input label={t('new_password')} type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <Input label={t('confirm_credentials')} type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} required />
                    </div>
                  </div>
                  <div className="pt-5 border-top mt-5">
                    <button type="submit" className="btn-pro-primary px-5 py-3 rounded-4">{t('reauthenticate_save')}</button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="tab-pane-content">
                <form onSubmit={handlePreferencesUpdate}>
                  <div className="preference-section mb-5 p-4 rounded-4 border">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="p-2 rounded-3 bg-primary-subtle text-primary"><FontAwesomeIcon icon={faPalette} /></div>
                      <h6 className="fw-bold mb-0">{t('interface_personalization')}</h6>
                    </div>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="fw-bold small mb-2 text-muted">{t('platform_theme')}</label>
                        <select className="form-select pro-field-select" value={preferences.theme} onChange={(e) => setPreferences({...preferences, theme: e.target.value})}>
                          <option value="light">{t('daylight_standard')}</option>
                          <option value="dark">{t('nebula_dark')}</option>
                          <option value="auto">{t('system_sync')}</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="fw-bold small mb-2 text-muted">{t('system_language')}</label>
                        <select className="form-select pro-field-select" value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})}>
                          <option value="en">{t('english_universal')}</option>
                          <option value="es">{t('spanish_coming_soon')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="preference-section mb-5 p-4 rounded-4 border">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="p-2 rounded-3 bg-danger-subtle text-danger"><FontAwesomeIcon icon={faBell} /></div>
                      <h6 className="fw-bold mb-0">{t('alert_protocols')}</h6>
                    </div>
                    <EnableDisableButton
                      checked={preferences.notifications}
                      onClick={() => setPreferences({...preferences, notifications: !preferences.notifications})}
                      label={t('enable_multi_channel_notifications')}
                    />
                    <p className="text-muted small mt-1 ms-2">{t('receive_alerts_desc')}</p>
                  </div>

                  <div className="pt-2 border-top mt-5 pt-5">
                    <button type="submit" className="btn-pro-primary px-5 py-3 rounded-4 shadow-sm" onClick={() => settingtheme(preferences.theme)}>
                      {t('synchronize_preferences')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'deletion' && (
              <div className="tab-section animate-fade-in-up">
                {isAdmin ? (
                  /* Admin view: Deletion Requests */
                  <div>
                    <p className="text-muted mb-4">Review and act on account closure requests submitted by users.</p>
                    {deletionLoading ? (
                      <div className="text-center py-5 text-muted bg-light rounded-4">
                        <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                        Loading requests...
                      </div>
                    ) : deletionRequests.length === 0 ? (
                      <div className="text-center py-5 text-muted bg-light rounded-4">
                        <FontAwesomeIcon icon={faCircleCheck} className="text-success h1 mb-3" />
                        <div className="fw-800">All caught up!</div>
                        <div className="small">No pending account deletion requests found.</div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle text-start small">
                          <thead>
                            <tr className="bg-light">
                              <th>User Details</th>
                              <th>Reason</th>
                              <th>Date</th>
                              <th>Status</th>
                              <th className="text-end">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deletionRequests.map(req => (
                              <tr key={req.id}>
                                <td>
                                  <div className="fw-bold">{req.requester?.name || 'Unknown'}</div>
                                  <div className="text-muted extra-small">{req.requester?.email || ''}</div>
                                </td>
                                <td style={{ maxWidth: '200px', whiteSpace: 'normal' }}>{req.reason}</td>
                                <td className="text-muted">{new Date(req.created_at).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge bg-${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'secondary'} bg-opacity-10 text-${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'secondary'} px-2.5 py-1 text-capitalize`}>{req.status}</span>
                                </td>
                                <td className="text-end">
                                  {req.status === 'pending' && (
                                    <div className="d-flex justify-content-end gap-1">
                                      <button 
                                        className="btn btn-sm btn-outline-success py-1 px-2.5 fw-bold"
                                        onClick={async () => {
                                          try {
                                            await client.patch(`/approvals/${req.id}`, { status: 'approved', comment: 'Account deletion approved by administrator.' });
                                            clearCache('/approvals');
                                            addNotification(`Account for ${req.requester?.name} has been permanently deleted.`, 'success');
                                            fetchDeletionRequests();
                                          } catch (err) {
                                            addNotification(err.message || 'Failed to approve deletion.', 'error');
                                          }
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faUserCheck} className="me-1" /> Approve
                                      </button>
                                      <button 
                                        className="btn btn-sm btn-outline-danger py-1 px-2.5 fw-bold"
                                        onClick={async () => {
                                          try {
                                            await client.patch(`/approvals/${req.id}`, { status: 'rejected', comment: 'Account deletion request rejected by administrator.' });
                                            clearCache('/approvals');
                                            addNotification(`Request for ${req.requester?.name} has been rejected.`, 'info');
                                            fetchDeletionRequests();
                                          } catch (err) {
                                            addNotification(err.message || 'Failed to reject deletion.', 'error');
                                          }
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faBan} className="me-1" /> Reject
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard User view: Request Account Deletion */
                  <div>
                    <div className="alert alert-warning d-flex align-items-start gap-2.5 p-3 rounded-4 mb-4 border-0" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#b45309' }}>
                      <FontAwesomeIcon icon={faTriangleExclamation} className="mt-1" />
                      <div className="small">
                        <strong>Important Notice:</strong> Deleting your account will immediately disable your profile, void active authorization tokens, and queue all records for permanent deletion in compliance with data privacy regulations.
                      </div>
                    </div>

                    {userRequestSent ? (
                      <div className="text-center py-4 bg-light rounded-4">
                        <div className="badge bg-success bg-opacity-10 text-success p-3 rounded-circle mb-3">
                          <FontAwesomeIcon icon={faCircleCheck} size="2x" />
                        </div>
                        <h6 className="fw-bold">Deletion Request Sent Successfully</h6>
                        <p className="small text-muted mb-0">Your request has been forwarded to the Company Admin for review.</p>
                      </div>
                    ) : (
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (!userReason.trim()) {
                          addNotification('Please provide a reason for requesting deletion.', 'warning');
                          return;
                        }
                        if (!currentUser?.id) {
                          addNotification('User authentication required.', 'error');
                          return;
                        }
                        try {
                          await client.post('/approvals', {
                            type: 'deletion',
                            approvable_id: currentUser.id,
                            approvable_type: 'App\\Models\\User',
                            reason: userReason,
                            priority: 'medium'
                          });
                          clearCache('/approvals');
                          setUserRequestSent(true);
                          addNotification('Account deletion request submitted to company administrator.', 'success');
                          setUserReason('');
                        } catch (err) {
                          addNotification(err.message || 'Failed to submit deletion request.', 'error');
                        }
                      }}>
                        <div className="mb-4">
                          <label className="fw-bold small mb-2 text-muted">Reason for Account Deletion</label>
                          <textarea 
                            className="form-control rounded-3"
                            rows="4" 
                            placeholder="Please describe why you wish to terminate your profile..."
                            value={userReason}
                            onChange={(e) => setUserReason(e.target.value)}
                            required
                          ></textarea>
                        </div>

                        <button type="submit" className="btn btn-danger w-100 py-3 fw-bold rounded-3">
                          Submit Deletion Request
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-modern-workspace {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #1e293b;
        }
        .fw-800 { font-weight: 800; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .extra-small { font-size: 0.7rem; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.25s ease; }

        .nav-menu-list { background: #fff; }
        .nav-menu-item { border-left: 4px solid transparent; }
        .nav-menu-item:hover { background: #f8fafc; }
        .nav-menu-item.active { 
          background: #f1f5f9; 
          border-left-color: #4f46e5;
        }

        .settings-toast {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: #0f172a;
          color: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          z-index: 100;
          font-weight: 700;
        }

        .bg-primary-subtle { background: rgba(79, 70, 229, 0.1); }
        .bg-warning-subtle { background: rgba(245, 158, 11, 0.1); }
        .bg-danger-subtle { background: rgba(239, 68, 68, 0.1); }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .status-ready { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef9c3; color: #854d0e; }

        .pro-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .pro-input-group .input-icon {
          position: absolute;
          left: 1.25rem;
          color: #94a3b8;
          z-index: 5;
        }
        .pro-field {
          height: 3.5rem;
          padding-left: 3.25rem;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          font-weight: 600;
        }
        .pro-field:focus {
          background: #fff;
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .pro-field-select {
          height: 3.25rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          font-weight: 600;
          cursor: pointer;
        }

        .pro-switch .form-check-input {
          width: 3.5rem;
          height: 1.75rem;
          cursor: pointer;
        }
        .pro-switch .form-check-input:checked {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }

        .btn-pro-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
          color: white;
          border: none;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        .btn-pro-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
          filter: brightness(1.1);
        }

        .settings-avatar-wrapper {
          width: 100px;
          height: 100px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .fade-in-up { animation: fadeInUp 0.5s ease-out; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in-down { animation: fadeInDown 0.4s ease-out; }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;
