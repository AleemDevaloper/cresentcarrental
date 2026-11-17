import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../hooks/useApp';
import { EnableDisableButton } from '../../components/common';
import { updateUser } from '../../api/users';
import client, { clearCache } from '../../api/client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faSliders, 
  faCircleCheck,
  faBell,
  faGlobe,
  faPalette,
  faBuildingColumns,
  faCloudUploadAlt,
  faClock,
  faShieldAlt,
  faLanguage,
  faTriangleExclamation,
  faTrash,
  faBan,
  faUserCheck
} from "@fortawesome/free-solid-svg-icons";

const Settings = () => {
  const { currentUser, settings, updateUserProfile, updateSettings, theme, settingtheme, addNotification } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

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
    first_name: '',
    last_name: '',
    organization: '',
    email: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({ theme: 'light', notifications: true, language: 'English' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  // Sync profile data when currentUser or settings load
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        organization: currentUser.organization || '',
        email: currentUser.email || '',
        avatar: currentUser.avatar || '',
      });
      setPreviewAvatar(currentUser.avatar || null);
    }
    if (settings) {
      setPreferences(settings);
    }
  }, [currentUser, settings]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!currentUser?.id) return;
    
    setLoading(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('first_name', profileData.first_name);
      fd.append('last_name', profileData.last_name);
      fd.append('organization', profileData.organization);
      fd.append('email', profileData.email);
      if (avatarFile) {
        fd.append('avatar', avatarFile);
      }

      const updated = await updateUser(currentUser.id, fd);
      updateUserProfile(updated);
      setSuccess('Profile synchronized successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile context');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Password divergence detected. Please match inputs.');
      return;
    }
    setLoading(true);
    try {
      setSuccess('Security credentials updated');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Security update failed');
    } finally {
      setLoading(false);
    }
  };

  const userRole = (currentUser?.role || '').toLowerCase();
  const isAdmin = userRole === 'admin' || userRole === 'company admin' || userRole === 'company_admin' || userRole === 'super admin' || userRole === 'superadmin';

  const menuItems = [
    { id: 'profile', label: 'Identity', icon: faUser, color: '#6366f1', desc: 'Core profile & presence' },
    { id: 'security', label: 'Security', icon: faShieldAlt, color: '#f59e0b', desc: 'Access & authentication' },
    { id: 'preferences', label: 'Interface', icon: faPalette, color: '#10b981', desc: 'Display & localization' },
    { id: 'deletion', label: isAdmin ? 'Deletion Requests' : 'Delete Account', icon: faTrash, color: '#f43f5e', desc: isAdmin ? 'Review account closures' : 'Request account deletion' }
  ];

  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const mutedText = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="settings-premium-container fade-in p-2 p-md-4">
      <div className="settings-header mb-5 mx-2">
        <h2 className="fw-900 tracking-tight" style={{ color: textColor }}>Platform Configuration</h2>
        <p style={{ color: mutedText }}>Manage your professional identity and security parameters.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Modern Sidebar */}
        <div className="col-xl-3 col-lg-4">
          <div className="glass-sidebar rounded-4 overflow-hidden shadow-sm" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="sidebar-items py-2">
              {menuItems.map(item => (
                <div 
                  key={item.id} 
                  className={`sidebar-item d-flex align-items-center gap-3 px-4 py-3 cursor-pointer transition-all ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <div className="item-icon rounded-3 d-flex align-items-center justify-content-center" style={{ background: item.color + '15', color: item.color, width: 36, height: 36 }}>
                    <FontAwesomeIcon icon={item.icon} size="sm" />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-800 small" style={{ color: activeTab === item.id ? item.color : textColor }}>{item.label}</div>
                  </div>
                  {activeTab === item.id && <div className="active-dot" style={{ background: item.color }}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area with Apple-style Cards */}
        <div className="col-xl-7 col-lg-8">
          <div className="settings-main-content">
            {success && <div className="toast-premium success animate-slide-in shadow-lg"><FontAwesomeIcon icon={faCircleCheck} className="me-2" /> {success}</div>}
            {error && <div className="toast-premium error animate-slide-in shadow-lg"><FontAwesomeIcon icon={faTriangleExclamation} className="me-2" /> {error}</div>}

            {activeTab === 'profile' && (
              <div className="tab-section animate-fade-in">
                {/* Profile Card */}
                <div className="premium-card mb-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                    <h5 className="mb-0 fw-800" style={{ color: textColor }}>Identity Overview</h5>
                    <p className="small mb-0" style={{ color: mutedText }}>Your public-facing details across the platform.</p>
                  </div>
                  <div className="card-body-pro p-4">
                    <div className="d-flex align-items-center gap-4 mb-5 p-3 rounded-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                      <div className="avatar-upload-position relative">
                        <div className="avatar-premium-ring shadow-lg">
                          <img src={previewAvatar || 'https://via.placeholder.com/150'} alt="Profile" className="avatar-img-pro" />
                        </div>
                        <button className="upload-btn-floating shadow-md" onClick={() => fileInputRef.current.click()}>
                          <FontAwesomeIcon icon={faCloudUploadAlt} />
                        </button>
                        <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={handleAvatarChange} />
                      </div>
                      <div>
                        <h4 className="fw-900 mb-1" style={{ color: textColor }}>{profileData.first_name} {profileData.last_name}</h4>
                        <span className="badge-pro" style={{ background: '#6366f115', color: '#6366f1' }}>{currentUser?.role || 'User'}</span>
                        <div className="d-flex align-items-center gap-2 mt-2 extra-small" style={{ color: mutedText }}>
                          <FontAwesomeIcon icon={faClock} /> Joined May 2026
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>Given Name</label>
                            <input value={profileData.first_name} onChange={(e) => setProfileData({...profileData, first_name: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor }} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>Family Name</label>
                            <input value={profileData.last_name} onChange={(e) => setProfileData({...profileData, last_name: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor }} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>Corporate Email</label>
                            <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor }} />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>Organization</label>
                            <div className="relative">
                              <FontAwesomeIcon icon={faBuildingColumns} className="input-icon" />
                              <input value={profileData.organization} onChange={(e) => setProfileData({...profileData, organization: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor, paddingLeft: '2.8rem' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 d-flex justify-content-end">
                        <button type="submit" className="btn-pro-action shadow-sm" disabled={loading}>
                          {loading ? 'Processing...' : 'Synchronize Profile'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Additional Card: Localization */}
                <div className="premium-card" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                   <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                    <h6 className="mb-0 fw-800 d-flex align-items-center gap-2" style={{ color: textColor }}>
                      <FontAwesomeIcon icon={faLanguage} className="text-primary" /> Regional Protocol
                    </h6>
                  </div>
                  <div className="p-4">
                    <div className="row g-3">
                       <div className="col-md-6">
                          <label className="extra-small fw-bold mb-2 d-block" style={{ color: mutedText }}>SYSTEM LANGUAGE</label>
                          <select className="form-select-pro" style={{ background: isDark ? '#0f172a' : '#f8fafc', color: textColor, borderColor }} value={preferences.language} onChange={(e) => setPreferences({...preferences, language: e.target.value})}>
                            <option value="en">English (International)</option>
                            <option value="es">Spanish (ES)</option>
                            <option value="fr">French (FR)</option>
                          </select>
                       </div>
                       <div className="col-md-6">
                          <label className="extra-small fw-bold mb-2 d-block" style={{ color: mutedText }}>TEMPORAL ZONE</label>
                          <select className="form-select-pro" style={{ background: isDark ? '#0f172a' : '#f8fafc', color: textColor, borderColor }}>
                            <option>UTC (Global Standard)</option>
                            <option>EST (New York)</option>
                            <option>IST (New Delhi)</option>
                          </select>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="tab-section animate-fade-in">
                <div className="premium-card mb-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                    <h5 className="mb-0 fw-800" style={{ color: textColor }}>Security Clearance</h5>
                    <p className="small mb-0" style={{ color: mutedText }}>Update your authentication credentials.</p>
                  </div>
                  <div className="p-4">
                    <form onSubmit={handlePasswordChange}>
                      <div className="row g-4">
                        <div className="col-12">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>Active Password</label>
                            <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor }} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>New Protocol Key</label>
                            <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor }} />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-group-pro">
                            <label style={{ color: mutedText }}>Confirm Protocol Key</label>
                            <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} style={{ color: textColor, background: isDark ? '#0f172a' : '#fff', borderColor }} />
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 d-flex justify-content-end">
                        <button type="submit" className="btn-pro-action shadow-sm" disabled={loading}>Update Credentials</button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="premium-card" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                    <h6 className="mb-0 fw-800" style={{ color: textColor }}>Recent Access Logs</h6>
                  </div>
                  <div className="p-2">
                    {[
                      { event: 'Platform Login', device: 'Chrome / Windows', time: 'Just now', ip: '192.168.1.1' },
                      { event: 'Profile Updated', device: 'Safari / iPhone', time: '2 hours ago', ip: '102.44.12.5' }
                    ].map((log, i) => (
                      <div key={i} className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-1 hover-bg" style={{ transition: '0.2s' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 rounded-circle bg-soft-primary text-primary small"><FontAwesomeIcon icon={faClock} /></div>
                          <div>
                            <div className="fw-bold extra-small" style={{ color: textColor }}>{log.event}</div>
                            <div className="extra-small text-muted">{log.device} • {log.ip}</div>
                          </div>
                        </div>
                        <div className="extra-small text-muted">{log.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="tab-section animate-fade-in">
                <div className="premium-card mb-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                  <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                    <h5 className="mb-0 fw-800" style={{ color: textColor }}>Interface Control</h5>
                  </div>
                  <div className="p-4">
                    <div className="mb-5">
                      <label className="fw-900 extra-small tracking-wider text-uppercase mb-3 d-block" style={{ color: mutedText }}>Visual Atmosphere</label>
                      <div className="row g-3">
                        {['light', 'dark', 'auto'].map(m => (
                          <div key={m} className="col-md-4">
                            <div 
                              className={`theme-selector-card p-4 rounded-4 text-center cursor-pointer transition-all ${preferences.theme === m ? 'selected' : ''}`}
                              style={{ 
                                background: isDark ? '#0f172a' : '#f8fafc', 
                                border: `2px solid ${preferences.theme === m ? '#6366f1' : borderColor}`,
                                color: textColor
                              }}
                              onClick={() => {
                                setPreferences({...preferences, theme: m});
                                settingtheme(m);
                              }}
                            >
                              <FontAwesomeIcon icon={m === 'light' ? faGlobe : m === 'dark' ? faPalette : faSliders} className="mb-2 h4" />
                              <div className="fw-800 small text-capitalize">{m} Mode</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-top" style={{ borderColor }}>
                       <label className="fw-900 extra-small tracking-wider text-uppercase mb-3 d-block" style={{ color: mutedText }}>Notification Protocol</label>
                       <div className="d-flex justify-content-between align-items-center p-4 rounded-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-circle bg-danger-subtle text-danger"><FontAwesomeIcon icon={faBell} /></div>
                            <div>
                               <div className="fw-800" style={{ color: textColor }}>Global Alerts</div>
                               <div className="extra-small" style={{ color: mutedText }}>Receive real-time push notifications.</div>
                            </div>
                          </div>
                          <EnableDisableButton
                            checked={preferences.notifications}
                            onClick={() => {
                              const newPrefs = {...preferences, notifications: !preferences.notifications};
                              setPreferences(newPrefs);
                              updateSettings(newPrefs);
                            }}
                            label="Global Alerts"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deletion' && (
              <div className="tab-section animate-fade-in">
                {isAdmin ? (
                  /* Admin view: Deletion Requests */
                  <div className="premium-card mb-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                      <h5 className="mb-0 fw-800" style={{ color: textColor }}>User Deletion Requests</h5>
                      <p className="small mb-0" style={{ color: mutedText }}>Review and act on account closure requests submitted by users.</p>
                    </div>
                    <div className="card-body-pro p-4">
                      {deletionLoading ? (
                        <div className="text-center py-5 text-muted">
                          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                          Loading requests...
                        </div>
                      ) : deletionRequests.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                          <FontAwesomeIcon icon={faCircleCheck} className="text-success h1 mb-3" />
                          <div className="fw-800">All caught up!</div>
                          <div className="small">No pending account deletion requests found.</div>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table align-middle text-start small">
                            <thead>
                              <tr>
                                <th style={{ color: textColor }}>User Details</th>
                                <th style={{ color: textColor }}>Reason</th>
                                <th style={{ color: textColor }}>Date</th>
                                <th style={{ color: textColor }}>Status</th>
                                <th className="text-end" style={{ color: textColor }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deletionRequests.map(req => (
                                <tr key={req.id} style={{ borderColor }}>
                                  <td>
                                    <div className="fw-bold" style={{ color: textColor }}>{req.requester?.name || 'Unknown'}</div>
                                    <div className="text-muted extra-small">{req.requester?.email || ''}</div>
                                  </td>
                                  <td style={{ color: mutedText, maxWidth: '200px', whiteSpace: 'normal' }}>{req.reason}</td>
                                  <td style={{ color: mutedText }}>{new Date(req.created_at).toLocaleDateString()}</td>
                                  <td>
                                    <span className={`badge bg-${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'secondary'} bg-opacity-10 text-${req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'secondary'} px-2.5 py-1 text-capitalize`}>{req.status}</span>
                                  </td>
                                  <td className="text-end">
                                    {req.status === 'pending' && (
                                      <div className="d-flex justify-content-end gap-1">
                                        <button 
                                          className="btn btn-sm btn-outline-success py-1 px-2.5"
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
                                          className="btn btn-sm btn-outline-danger py-1 px-2.5"
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
                  </div>
                ) : (
                  /* Standard User view: Request Account Deletion */
                  <div className="premium-card mb-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
                    <div className="card-header-pro p-4 border-bottom" style={{ borderColor: borderColor }}>
                      <h5 className="mb-0 fw-800" style={{ color: textColor }}>Request Account Deletion</h5>
                      <p className="small mb-0" style={{ color: mutedText }}>Standard users cannot delete their accounts directly. Submit a request to your company administrator below.</p>
                    </div>
                    <div className="card-body-pro p-4">
                      {userRequestSent ? (
                        <div className="text-center py-4">
                          <div className="badge bg-success bg-opacity-10 text-success p-3 rounded-circle mb-3">
                            <FontAwesomeIcon icon={faCircleCheck} size="2x" />
                          </div>
                          <h6 className="fw-bold" style={{ color: textColor }}>Deletion Request Sent Successfully</h6>
                          <p className="small text-muted mb-0">Your request has been forwarded to the Company Admin for review. You will be notified once a decision is made.</p>
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
                          <div className="alert alert-warning d-flex align-items-start gap-2.5 p-3 rounded-4 mb-4 border-0" style={{ backgroundColor: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb', color: '#b45309' }}>
                            <FontAwesomeIcon icon={faTriangleExclamation} className="mt-1" />
                            <div className="small">
                              <strong>Important Notice:</strong> Deleting your account will immediately disable your profile, void active authorization tokens, and queue all records for permanent deletion in compliance with data privacy regulations.
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="fw-900 extra-small tracking-wider text-uppercase mb-2 d-block" style={{ color: mutedText }}>Reason for Account Deletion</label>
                            <textarea 
                              className={`form-control rounded-3 ${isDark ? 'bg-dark text-white border-secondary' : ''}`}
                              rows="4" 
                              placeholder="Please describe why you wish to terminate your profile..."
                              value={userReason}
                              onChange={(e) => setUserReason(e.target.value)}
                              required
                            ></textarea>
                          </div>

                          <button type="submit" className="btn btn-pro-action w-100 bg-danger" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            Submit Deletion Request
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-premium-container { font-family: 'Inter', sans-serif; min-height: 100vh; }
        .fw-800 { font-weight: 800; }
        .fw-900 { font-weight: 900; }
        .extra-small { font-size: 0.75rem; }
        .tracking-tight { letter-spacing: -0.5px; }
        .tracking-wider { letter-spacing: 1px; }

        .glass-sidebar { position: sticky; top: 2rem; }
        .sidebar-item { position: relative; border-left: 3px solid transparent; }
        .sidebar-item.active { background: rgba(99, 102, 241, 0.05); }
        .sidebar-item .active-dot { width: 6px; height: 6px; border-radius: 50%; }

        .premium-card { border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }

        .avatar-premium-ring { width: 120px; height: 120px; border-radius: 40px; border: 4px solid #fff; overflow: hidden; }
        .avatar-img-pro { width: 100%; height: 100%; object-fit: cover; }
        .upload-btn-floating { position: absolute; bottom: -5px; right: -5px; width: 36px; height: 36px; background: #6366f1; color: #fff; border: none; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }

        .input-group-pro label { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; }
        .input-group-pro input { width: 100%; height: 3.25rem; border-radius: 14px; border: 1.5px solid transparent; padding: 0 1.25rem; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
        .input-group-pro input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .input-icon { position: absolute; left: 1.1rem; top: 1.1rem; color: #94a3b8; }

        .form-select-pro { width: 100%; height: 3.25rem; border-radius: 14px; border: 1.5px solid transparent; padding: 0 1.25rem; font-weight: 600; outline: none; cursor: pointer; }

        .btn-pro-action { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; border: none; padding: 0.85rem 2.5rem; border-radius: 14px; font-weight: 800; font-size: 0.85rem; transition: 0.3s; }
        .btn-pro-action:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3); }

        .theme-selector-card:hover { transform: scale(1.02); }
        .theme-selector-card.selected { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

        .custom-switch-pro .form-check-input { width: 3rem; height: 1.5rem; cursor: pointer; }
        .custom-switch-pro .form-check-input:checked { background-color: #6366f1; border-color: #6366f1; }

        .toast-premium { position: fixed; top: 2rem; right: 2rem; padding: 1.25rem 2.5rem; border-radius: 20px; color: #fff; font-weight: 800; z-index: 1000; display: flex; align-items: center; }
        .toast-premium.success { background: #0f172a; }
        .toast-premium.error { background: #ef4444; }

        .bg-soft-primary { background: rgba(99, 102, 241, 0.1); }
        .hover-bg:hover { background: rgba(99, 102, 241, 0.03); cursor: pointer; }
        .badge-pro { font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }

        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes slideIn { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Settings;