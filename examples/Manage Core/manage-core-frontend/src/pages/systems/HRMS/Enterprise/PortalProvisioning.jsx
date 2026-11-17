import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe, faPalette, faCog, faShieldAlt, faLanguage, faClock,
  faCheckCircle, faChevronRight, faChevronLeft, faUpload,
  faImage, faServer, faUsers, faEye, faPlus, faEdit, faTrash,
  faSave, faTimes, faBuilding, faFlag
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listPortals, createPortal, getPortal, updatePortal, deletePortal, uploadPortalBranding } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';
import { EnableDisableButton } from '../../../../components/common';

const PortalProvisioning = () => {
  const { t } = useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const [formData, setFormData] = useState({
    portal_name: '', domain: '', description: '',
    logo: null, favicon: null,
    primary_color: '#4f46e5', secondary_color: '#10b981',
    sidebar_theme: 'light', layout: 'default',
    default_language: 'English', timezone: 'UTC',
    modules: [],
    password_policy: 'standard', session_timeout: 30,
    mfa_required: false, ip_restriction: false,
    max_users: 100, storage_limit: 10
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await listPortals();
      setPortals(data);
    } catch (err) {
      console.error('Portals fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const availableModules = [
    { key: 'hrms', label: t('hrms'), icon: faUsers },
    { key: 'payroll', label: t('payroll'), icon: faCog },
    { key: 'attendance', label: t('attendance'), icon: faClock },
    { key: 'leave', label: t('leave_management'), icon: faCheckCircle },
    { key: 'expenses', label: t('expenses'), icon: faEye },
    { key: 'recruitment', label: t('recruitment'), icon: faUsers },
    { key: 'performance', label: t('performance'), icon: faCog },
    { key: 'assets', label: t('asset_management'), icon: faServer },
    { key: 'projects', label: t('projects'), icon: faGlobe },
    { key: 'documents', label: t('documents'), icon: faEye },
  ];

  const wizardSteps = [
    { title: t('portal_details'), icon: faGlobe },
    { title: t('branding'), icon: faPalette },
    { title: t('theme_settings'), icon: faCog },
    { title: t('language_timezone'), icon: faLanguage },
    { title: t('module_assignment'), icon: faServer },
    { title: t('security_policies'), icon: faShieldAlt },
    { title: t('review'), icon: faCheckCircle },
  ];

  const handleCreatePortal = async () => {
    try {
      await createPortal(formData);
      addNotification(t('portal_created'), 'success');
      setShowCreateModal(false);
      setWizardStep(0);
      setFormData({ portal_name: '', domain: '', description: '', logo: null, favicon: null, primary_color: '#4f46e5', secondary_color: '#10b981', sidebar_theme: 'light', layout: 'default', default_language: 'English', timezone: 'UTC', modules: [], password_policy: 'standard', session_timeout: 30, mfa_required: false, ip_restriction: false, max_users: 100, storage_limit: 10 });
      fetchData();
    } catch (err) {
      addNotification(t('error_creating_portal'), 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete_portal'))) return;
    try {
      await deletePortal(id);
      addNotification(t('portal_deleted'), 'success');
      fetchData();
    } catch (err) {
      addNotification(t('error_deleting'), 'danger');
    }
  };

  const toggleModule = (key) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(key)
        ? prev.modules.filter(m => m !== key)
        : [...prev.modules, key]
    }));
  };

  const statsCards = [
    { label: t('total_portals'), value: portals.length, icon: faGlobe, color: '#4f46e5' },
    { label: t('active'), value: portals.filter(p => p.status !== 'inactive').length, icon: faCheckCircle, color: '#10b981' },
    { label: t('total_users'), value: portals.reduce((sum, p) => sum + (p.user_count || 0), 0), icon: faUsers, color: '#8b5cf6' },
  ];

  const renderWizardStep = () => {
    switch (wizardStep) {
      case 0: return (
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small fw-bold">{t('portal_name')}</label>
            <input type="text" className="form-control rounded-3" value={formData.portal_name} onChange={e => setFormData({ ...formData, portal_name: e.target.value })} placeholder={t('enter_portal_name')} />
          </div>
          <div className="col-12">
            <label className="form-label small fw-bold">{t('domain')}</label>
            <div className="input-group">
              <input type="text" className="form-control rounded-3" value={formData.domain} onChange={e => setFormData({ ...formData, domain: e.target.value })} placeholder="myportal" />
              <span className="input-group-text bg-light border-0 rounded-3 ms-1 text-muted">.company.com</span>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label small fw-bold">{t('description')}</label>
            <textarea className="form-control rounded-3" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder={t('portal_description')} />
          </div>
        </div>
      );
      case 1: return (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('logo')}</label>
            <div className={`p-4 rounded-3 text-center border-2 border-dashed ${isDark ? 'border-secondary' : 'border-light'}`} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faImage} className="fs-1 text-muted mb-2" />
              <div className="small text-muted">{t('upload_logo')}</div>
              <input type="file" className="d-none" accept="image/*" onChange={e => setFormData({ ...formData, logo: e.target.files[0] })} />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('favicon')}</label>
            <div className={`p-4 rounded-3 text-center border-2 border-dashed ${isDark ? 'border-secondary' : 'border-light'}`} style={{ cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faImage} className="fs-1 text-muted mb-2" />
              <div className="small text-muted">{t('upload_favicon')}</div>
              <input type="file" className="d-none" accept="image/*" onChange={e => setFormData({ ...formData, favicon: e.target.files[0] })} />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('primary_color')}</label>
            <input type="color" className="form-control form-control-color rounded-3" value={formData.primary_color} onChange={e => setFormData({ ...formData, primary_color: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('secondary_color')}</label>
            <input type="color" className="form-control form-control-color rounded-3" value={formData.secondary_color} onChange={e => setFormData({ ...formData, secondary_color: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('sidebar_theme')}</label>
            <select className="form-select rounded-3" value={formData.sidebar_theme} onChange={e => setFormData({ ...formData, sidebar_theme: e.target.value })}>
              <option value="light">{t('light')}</option>
              <option value="dark">{t('dark')}</option>
              <option value="colored">{t('colored')}</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('layout')}</label>
            <select className="form-select rounded-3" value={formData.layout} onChange={e => setFormData({ ...formData, layout: e.target.value })}>
              <option value="default">{t('default')}</option>
              <option value="compact">{t('compact')}</option>
              <option value="expanded">{t('expanded')}</option>
            </select>
          </div>
          <div className="col-12">
            <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="rounded-circle" style={{ width: 16, height: 16, backgroundColor: formData.primary_color }}></div>
                <div className="rounded-circle" style={{ width: 16, height: 16, backgroundColor: formData.secondary_color }}></div>
                <span className="small text-muted">{t('preview_colors')}</span>
              </div>
              <div className="d-flex gap-2">
                <div className="flex-fill p-2 rounded-2 text-white text-center small fw-bold" style={{ backgroundColor: formData.primary_color }}>{t('primary')}</div>
                <div className="flex-fill p-2 rounded-2 text-white text-center small fw-bold" style={{ backgroundColor: formData.secondary_color }}>{t('secondary')}</div>
              </div>
            </div>
          </div>
        </div>
      );
      case 3: return (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('default_language')}</label>
            <select className="form-select rounded-3" value={formData.default_language} onChange={e => setFormData({ ...formData, default_language: e.target.value })}>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Chinese">Chinese</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('timezone')}</label>
            <select className="form-select rounded-3" value={formData.timezone} onChange={e => setFormData({ ...formData, timezone: e.target.value })}>
              <option value="UTC">UTC</option>
              <option value="US/Eastern">US/Eastern</option>
              <option value="US/Pacific">US/Pacific</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Asia/Dubai">Asia/Dubai</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('date_format')}</label>
            <select className="form-select rounded-3" defaultValue="MM/DD/YYYY">
              <option>MM/DD/YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('time_format')}</label>
            <select className="form-select rounded-3" defaultValue="12h">
              <option value="12h">{t('12_hour')}</option>
              <option value="24h">{t('24_hour')}</option>
            </select>
          </div>
        </div>
      );
      case 4: return (
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label small fw-bold">{t('select_modules')}</label>
            <div className="row g-2">
              {availableModules.map(mod => (
                <div key={mod.key} className="col-md-4">
                  <div className={`p-3 rounded-3 border d-flex align-items-center gap-2 ${formData.modules.includes(mod.key) ? 'border-primary bg-primary-subtle' : isDark ? 'border-secondary bg-dark' : 'border-light bg-light'}`} style={{ cursor: 'pointer' }} onClick={() => toggleModule(mod.key)}>
                    <FontAwesomeIcon icon={formData.modules.includes(mod.key) ? faCheckCircle : mod.icon} className={formData.modules.includes(mod.key) ? 'text-primary' : 'text-muted'} />
                    <span className="small">{mod.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12">
            <div className="small text-muted">{t('selected_modules')}: {formData.modules.length}</div>
          </div>
        </div>
      );
      case 5: return (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('password_policy')}</label>
            <select className="form-select rounded-3" value={formData.password_policy} onChange={e => setFormData({ ...formData, password_policy: e.target.value })}>
              <option value="standard">{t('standard')}</option>
              <option value="strong">{t('strong')}</option>
              <option value="custom">{t('custom')}</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('session_timeout')} ({t('minutes')})</label>
            <input type="number" className="form-control rounded-3" value={formData.session_timeout} onChange={e => setFormData({ ...formData, session_timeout: e.target.value })} />
          </div>
          <div className="col-md-6">
            <EnableDisableButton
              checked={formData.mfa_required}
              onClick={() => setFormData({ ...formData, mfa_required: !formData.mfa_required })}
              label={t('require_mfa')}
            />
          </div>
          <div className="col-md-6">
            <EnableDisableButton
              checked={formData.ip_restriction}
              onClick={() => setFormData({ ...formData, ip_restriction: !formData.ip_restriction })}
              label={t('ip_restriction')}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('max_users')}</label>
            <input type="number" className="form-control rounded-3" value={formData.max_users} onChange={e => setFormData({ ...formData, max_users: e.target.value })} />
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-bold">{t('storage_limit')} (GB)</label>
            <input type="number" className="form-control rounded-3" value={formData.storage_limit} onChange={e => setFormData({ ...formData, storage_limit: e.target.value })} />
          </div>
        </div>
      );
      case 6: return (
        <div>
          <h6 className="fw-bold mb-3">{t('review_configuration')}</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('portal_name')}</div>
                <div className="small fw-bold">{formData.portal_name || '-'}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('domain')}</div>
                <div className="small fw-bold">{formData.domain ? `${formData.domain}.company.com` : '-'}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('language')}</div>
                <div className="small fw-bold">{formData.default_language}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('timezone')}</div>
                <div className="small fw-bold">{formData.timezone}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('modules')}</div>
                <div className="small fw-bold">{formData.modules.length} {t('selected')}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('mfa')}</div>
                <div className="small fw-bold">{formData.mfa_required ? t('enabled') : t('disabled')}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                <div className="x-small text-muted">{t('max_users')}</div>
                <div className="small fw-bold">{formData.max_users}</div>
              </div>
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('portal_provisioning')}</h4>
          <p className="text-muted small mb-0">{t('create_and_manage_portals')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowCreateModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('create_portal')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {statsCards.map((s, i) => (
              <div key={i} className="col-md-4">
                <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
              </div>
            ))}
          </div>

          <div className="row g-4">
            {portals.map(p => (
              <div key={p.id} className="col-md-6 col-xl-4">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-3 d-flex align-items-center justify-content-center text-white" style={{ width: 48, height: 48, backgroundColor: p.primary_color || '#4f46e5' }}>
                          <FontAwesomeIcon icon={faGlobe} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-0 small">{p.portal_name || p.name}</h5>
                          <div className="x-small text-muted">{p.domain || p.name?.toLowerCase().replace(/\s+/g, '-')}.company.com</div>
                        </div>
                      </div>
                      <span className={`badge rounded-pill ${p.status !== 'inactive' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{p.status || 'active'}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="x-small text-muted"><FontAwesomeIcon icon={faUsers} className="me-1" />{p.user_count || 0} {t('users')}</span>
                      <span className="x-small text-muted"><FontAwesomeIcon icon={faServer} className="me-1" />{p.module_count || 0} {t('modules')}</span>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-sm btn-outline-primary rounded-3 flex-fill"><FontAwesomeIcon icon={faEye} /> {t('view')}</button>
                      <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleDelete(p.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {portals.length === 0 && !loading && (
              <div className="col-12 text-center py-5">
                <div className="d-inline-block p-4 rounded-circle mb-3" style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
                  <FontAwesomeIcon icon={faGlobe} className="fs-1 text-muted opacity-50" />
                </div>
                <p className="text-muted">{t('no_portals_created')}</p>
              </div>
            )}
          </div>
        </>
      )}

      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('create_new_portal')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
                  {wizardSteps.map((ws, i) => (
                    <div key={i} className="d-flex align-items-center gap-1 flex-shrink-0">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${i === wizardStep ? 'bg-primary text-white' : i < wizardStep ? 'bg-success text-white' : isDark ? 'bg-dark border border-secondary text-muted' : 'bg-light text-muted'}`} style={{ width: 28, height: 28, fontSize: 10 }}>
                        {i < wizardStep ? <FontAwesomeIcon icon={faCheckCircle} /> : i + 1}
                      </div>
                      <span className={`x-small ${i === wizardStep ? 'fw-bold' : ''}`}>{ws.title}</span>
                      {i < wizardSteps.length - 1 && <FontAwesomeIcon icon={faChevronRight} className="x-small text-muted mx-1" />}
                    </div>
                  ))}
                </div>

                {renderWizardStep()}
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button className="btn btn-light rounded-3" onClick={() => setShowCreateModal(false)}>{t('cancel')}</button>
                <div className="d-flex gap-2">
                  {wizardStep > 0 && (
                    <button className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setWizardStep(wizardStep - 1)}>
                      <FontAwesomeIcon icon={faChevronLeft} className="me-1" /> {t('previous')}
                    </button>
                  )}
                  {wizardStep < wizardSteps.length - 1 ? (
                    <button className="btn btn-primary rounded-3 px-4" onClick={() => setWizardStep(wizardStep + 1)}>
                      {t('next')} <FontAwesomeIcon icon={faChevronRight} className="ms-1" />
                    </button>
                  ) : (
                    <button className="btn btn-success rounded-3 px-4" onClick={handleCreatePortal}>
                      <FontAwesomeIcon icon={faSave} className="me-1" /> {t('create_portal')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-secondary-subtle { background-color: #f1f5f9 !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .border-dashed { border-style: dashed !important; }
      `}} />
    </div>
  );
};

export default PortalProvisioning;
