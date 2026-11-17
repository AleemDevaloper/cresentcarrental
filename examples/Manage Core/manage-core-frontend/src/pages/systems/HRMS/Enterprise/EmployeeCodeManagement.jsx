import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdBadge, faToggleOn, faToggleOff, faCog, faHistory, faLock,
  faUnlock, faCheckCircle, faExclamationTriangle, faPlus,
  faCopy, faSearch, faFilter, faSync, faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import {
  getEmployeeCodeConfig, updateEmployeeCodeConfig,
  generateEmployeeCode, validateEmployeeCode,
  lockEmployeeCode, getEmployeeCodeHistory
} from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';
import { EnableDisableButton } from '../../../../components/common';

const EmployeeCodeManagement = () => {
  const { t } = useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [config, setConfig] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const [configForm, setConfigForm] = useState({
    prefix: 'EMP', include_department: true, include_location: false,
    separator: '-', sequence_length: 4, next_sequence: 1
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [c, h] = await Promise.all([getEmployeeCodeConfig(), getEmployeeCodeHistory()]);
      setConfig(c);
      setHistory(h || []);
      if (c) {
        setConfigForm({
          prefix: c.prefix || 'EMP',
          include_department: c.include_department ?? true,
          include_location: c.include_location ?? false,
          separator: c.separator || '-',
          sequence_length: c.sequence_length || 4,
          next_sequence: c.next_sequence || 1
        });
        setAutoGenerate(c.auto_generate ?? true);
      }
    } catch (err) {
      console.error('EmployeeCode fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerateCode = async () => {
    try {
      const res = await generateEmployeeCode();
      setGeneratedCode(res.code);
      addNotification(t('code_generated'), 'success');
    } catch (err) {
      addNotification(t('error_generating'), 'danger');
    }
  };

  const handleValidateCode = async () => {
    if (!manualCode) return;
    try {
      const res = await validateEmployeeCode(manualCode);
      if (res.valid) addNotification(t('code_valid'), 'success');
      else addNotification(t('code_duplicate'), 'warning');
    } catch (err) {
      addNotification(t('error_validating'), 'danger');
    }
  };

  const handleLockCode = async (userId) => {
    try {
      await lockEmployeeCode(userId);
      addNotification(t('code_locked'), 'success');
      fetchData();
    } catch (err) {
      addNotification(t('error_locking'), 'danger');
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    try {
      await updateEmployeeCodeConfig({ ...configForm, auto_generate: autoGenerate });
      addNotification(t('config_saved'), 'success');
      setShowConfigModal(false);
      fetchData();
    } catch (err) {
      addNotification(t('error_saving'), 'danger');
    }
  };

  const statsCards = [
    { label: t('total_codes'), value: history.length, icon: faIdBadge, color: '#4f46e5' },
    { label: t('locked'), value: history.filter(h => h.locked).length, icon: faLock, color: '#ef4444' },
    { label: t('active'), value: history.filter(h => !h.locked).length, icon: faCheckCircle, color: '#10b981' },
    { label: t('duplicates_detected'), value: history.filter(h => h.duplicate).length || 0, icon: faExclamationTriangle, color: '#f59e0b' },
  ];

  const codePattern = `${configForm.prefix}${configForm.include_department ? '{DEPT}' : ''}${configForm.separator}${String(configForm.next_sequence).padStart(configForm.sequence_length, '0')}`;

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('employee_code_management')}</h4>
          <p className="text-muted small mb-0">{t('manage_employee_codes')}</p>
        </div>
        <button className="btn btn-outline-secondary rounded-3" onClick={() => setShowConfigModal(true)}>
          <FontAwesomeIcon icon={faCog} className="me-1" /> {t('configure')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      ) : (
        <>
          <div className="row g-3 mb-4">
            {statsCards.map((s, i) => (
              <div key={i} className="col-md-3">
                <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">{t('current_configuration')}</h5>
                  <div className="mb-4">
                    <div className="x-small text-muted mb-1">{t('code_pattern')}</div>
                    <div className="h4 fw-bold text-primary">{codePattern}</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">{t('auto_generation')}</span>
                    <button className={`btn btn-sm rounded-3 ${autoGenerate ? 'btn-success' : 'btn-light'}`} onClick={() => setAutoGenerate(!autoGenerate)}>
                      <FontAwesomeIcon icon={autoGenerate ? faToggleOn : faToggleOff} className="me-1" />
                      {autoGenerate ? t('on') : t('off')}
                    </button>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">{t('prefix')}</span>
                    <span className="small fw-bold">{configForm.prefix}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">{t('department_prefix')}</span>
                    <span className="small fw-bold">{configForm.include_department ? t('yes') : t('no')}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">{t('sequence_length')}</span>
                    <span className="small fw-bold">{configForm.sequence_length}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="small text-muted">{t('next_sequence')}</span>
                    <span className="small fw-bold">{configForm.next_sequence}</span>
                  </div>
                  <button className="btn btn-primary w-100 rounded-3 mt-3" onClick={handleGenerateCode}>
                    <FontAwesomeIcon icon={faSync} className="me-1" /> {t('generate_next_code')}
                  </button>
                  {generatedCode && (
                    <div className="mt-3 p-3 rounded-3 text-center" style={{ backgroundColor: '#10b98120' }}>
                      <div className="x-small text-muted">{t('generated_code')}</div>
                      <div className="h4 fw-bold text-success mb-0">{generatedCode}</div>
                      <button className="btn btn-sm btn-outline-secondary rounded-3 mt-1"><FontAwesomeIcon icon={faCopy} /> {t('copy')}</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">{t('code_history')}</h5>
                  <div className="d-flex gap-2 mb-3">
                    <div className="input-group" style={{ maxWidth: 250 }}>
                      <input type="text" className="form-control border-0 bg-light rounded-3" placeholder={t('manual_code_entry')} value={manualCode} onChange={e => setManualCode(e.target.value)} />
                    </div>
                    <button className="btn btn-outline-primary rounded-3 btn-sm" onClick={handleValidateCode}><FontAwesomeIcon icon={faSearch} className="me-1" />{t('validate')}</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table align-middle table-hover mb-0">
                      <thead><tr className="small text-muted"><th>{t('code')}</th><th>{t('employee')}</th><th>{t('department')}</th><th>{t('status')}</th><th>{t('locked')}</th><th>{t('actions')}</th></tr></thead>
                      <tbody>
                        {history.map((h, i) => (
                          <tr key={h.id || i}>
                            <td><span className="small fw-bold text-primary">{h.code || `EMP-${String(i + 1).padStart(4, '0')}`}</span></td>
                            <td className="small">{h.employee_name || h.user?.name || `Employee ${i + 1}`}</td>
                            <td className="small">{h.department || '-'}</td>
                            <td><span className={`badge rounded-pill ${h.status === 'active' || !h.status ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{h.status || 'active'}</span></td>
                            <td>
                              {h.locked ? (
                                <FontAwesomeIcon icon={faLock} className="text-danger" />
                              ) : (
                                <button className="btn btn-sm btn-outline-danger rounded-3" onClick={() => handleLockCode(h.user_id || h.id)}><FontAwesomeIcon icon={faUnlock} /></button>
                              )}
                            </td>
                            <td>
                              {h.duplicate && <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning me-1" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showConfigModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('code_configuration')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfigModal(false)}></button>
              </div>
              <form onSubmit={handleSaveConfig}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('prefix')}</label>
                      <input type="text" className="form-control rounded-3" value={configForm.prefix} onChange={e => setConfigForm({ ...configForm, prefix: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('separator')}</label>
                      <input type="text" className="form-control rounded-3" value={configForm.separator} onChange={e => setConfigForm({ ...configForm, separator: e.target.value })} maxLength="1" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('sequence_length')}</label>
                      <select className="form-select rounded-3" value={configForm.sequence_length} onChange={e => setConfigForm({ ...configForm, sequence_length: parseInt(e.target.value) })}>
                        {[3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('next_sequence')}</label>
                      <input type="number" className="form-control rounded-3" value={configForm.next_sequence} onChange={e => setConfigForm({ ...configForm, next_sequence: parseInt(e.target.value) })} />
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="includeDept" checked={configForm.include_department} onChange={e => setConfigForm({ ...configForm, include_department: e.target.checked })} />
                        <label className="form-check-label small" htmlFor="includeDept">{t('include_department_prefix')}</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="includeLoc" checked={configForm.include_location} onChange={e => setConfigForm({ ...configForm, include_location: e.target.checked })} />
                        <label className="form-check-label small" htmlFor="includeLoc">{t('include_location_prefix')}</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <EnableDisableButton
                        checked={autoGenerate}
                        onClick={() => setAutoGenerate(!autoGenerate)}
                        label={t('auto_generate_codes')}
                      />
                    </div>
                    <div className="col-12">
                      <div className={`p-3 rounded-3 text-center ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                        <div className="x-small text-muted">{t('preview')}</div>
                        <div className="h4 fw-bold text-primary mb-0">{codePattern}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowConfigModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('save')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-secondary-subtle { background-color: #f1f5f9 !important; }
      `}} />
    </div>
  );
};

export default EmployeeCodeManagement;
