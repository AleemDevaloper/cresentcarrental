import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock, faPlus, faEdit, faTrash, faToggleOn, faToggleOff,
  faCalculator, faChartBar, faChartLine, faUsers, faBuilding,
  faSave, faGavel
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getOvertimeRules, createOvertimeRule, updateOvertimeRule, deleteOvertimeRule } from '../../../../api/hrms';
import { EnableDisableButton } from '../../../../components/common';

const OT_TYPES = ['Daily', 'Weekly', 'Holiday', 'Weekend', 'Night', 'Double'];

const OvertimeRulesEngine = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: 'Daily', multiplier: 1.5, max_hours: 4, approval: true, active: true });

  const fetchRules = async () => {
    setLoading(true);
    try {
      const data = await getOvertimeRules();
      setRules(data);
    } catch { addNotification(t('Failed to load'), 'danger');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRule) {
        await updateOvertimeRule(editRule.id, formData);
        addNotification(t('Rule updated'), 'success');
      } else {
        await createOvertimeRule(formData);
        addNotification(t('Rule created'), 'success');
      }
      setShowForm(false); setEditRule(null);
      fetchRules();
    } catch { addNotification(t('Error saving'), 'danger'); }
  };

  const toggleActive = async (rule) => {
    try {
      await updateOvertimeRule(rule.id, { active: !rule.active });
      fetchRules();
    } catch { addNotification(t('Error toggling'), 'danger'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(t('Delete this rule?'))) return;
    try {
      await deleteOvertimeRule(id);
      addNotification(t('Rule deleted'), 'success');
      fetchRules();
    } catch { addNotification(t('Error deleting'), 'danger'); }
  };

  return (
    <div className={'animate-fade-in p-4' + (isDark ? ' bg-dark text-light' : '')}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faGavel} className="me-2 text-primary" />{t('Overtime Rules Engine')}</h4>
          <p className={'small mb-0' + (isDark ? ' text-light opacity-75' : ' text-muted')}>{t('Configure overtime policies and rates')}</p>
        </div>
        <button className="btn btn-primary rounded-3" onClick={() => { setEditRule(null); setFormData({ name: '', type: 'Daily', multiplier: 1.5, max_hours: 4, approval: true, active: true }); setShowForm(true); }}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Add Rule')}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
      <div className="row g-4">
        <div className="col-lg-8">
          {rules.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faGavel} className="fs-1 text-muted mb-3 opacity-50" />
              <p className="text-muted">{t('No overtime rules configured')}</p>
            </div>
          ) : (
          <div className="row g-3 mb-4">
            {rules.map(rule => (
              <div key={rule.id} className="col-md-6">
                <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '') + (!rule.active ? ' opacity-50' : '')}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={'p-3 rounded-4' + (rule.active ? ' bg-warning-subtle' : ' bg-light')}>
                          <FontAwesomeIcon icon={faClock} className={'fs-4' + (rule.active ? ' text-warning' : ' text-muted')} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">{rule.name}</h6>
                          <span className="badge bg-secondary-subtle text-secondary x-small">{t(rule.type)}</span>
                        </div>
                      </div>
                      <div className="d-flex gap-1">
                        <button className={'btn btn-sm rounded-3' + (rule.active ? ' btn-success' : ' btn-secondary')} onClick={() => toggleActive(rule)}>
                          <FontAwesomeIcon icon={rule.active ? faToggleOn : faToggleOff} />
                        </button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => { setEditRule(rule); setFormData(rule); setShowForm(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => handleDelete(rule.id)}><FontAwesomeIcon icon={faTrash} className="text-danger" /></button>
                      </div>
                    </div>
                    <div className={'p-3 rounded-3' + (isDark ? ' bg-dark' : ' bg-light')}>
                      <div className="row g-2">
                        <div className="col-4 text-center">
                          <p className="x-small text-muted mb-0">{t('Rate')}</p>
                          <p className="fw-bold small mb-0">{rule.multiplier}x</p>
                        </div>
                        <div className="col-4 text-center">
                          <p className="x-small text-muted mb-0">{t('Max Hrs')}</p>
                          <p className="fw-bold small mb-0">{rule.max_hours}h</p>
                        </div>
                        <div className="col-4 text-center">
                          <p className="x-small text-muted mb-0">{t('Approval')}</p>
                          <p className="fw-bold small mb-0">{rule.approval ? t('Yes') : t('No')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          <div className={'card border-0 shadow-sm rounded-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />{t('Department OT Trends')}</h6>
              <div className={'p-3 rounded-3 text-center' + (isDark ? ' bg-dark' : ' bg-light')}>
                <p className="small text-muted mb-0">{t('Trend data available after tracking')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={'card border-0 shadow-sm rounded-4 mb-4' + (isDark ? ' bg-dark-subtle' : '')}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faCalculator} className="me-2 text-success" />{t('OT Cost Calculator')}</h6>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">{t('OT Hours')}</label>
                <input type="number" className="form-control rounded-3" placeholder="10" />
              </div>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-2">{t('Rate Type')}</label>
                <select className="form-select rounded-3">
                  <option>Daily (1.5x)</option>
                  <option>Weekend (2.0x)</option>
                  <option>Holiday (2.0x)</option>
                  <option>Double (3.0x)</option>
                </select>
              </div>
              <div className={'p-3 rounded-3 text-center mb-3' + (isDark ? ' bg-dark' : ' bg-light')}>
                <p className="x-small text-muted mb-0">{t('Estimated Cost')}</p>
                <p className="h3 fw-bold text-success">$450.00</p>
              </div>
              <button className="btn btn-outline-primary w-100 rounded-3">{t('Calculate')}</button>
            </div>
          </div>
        </div>
      </div>
      )}

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editRule ? t('Edit Rule') : t('New Overtime Rule')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Rule Name')}</label>
                      <input type="text" className="form-control rounded-3" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('OT Type')}</label>
                      <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        {OT_TYPES.map(ot => <option key={ot} value={ot}>{t(ot)}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Rate Multiplier')}</label>
                      <input type="number" step="0.25" min="1" className="form-control rounded-3" value={formData.multiplier} onChange={e => setFormData({...formData, multiplier: parseFloat(e.target.value)})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Max Hours')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.max_hours} onChange={e => setFormData({...formData, max_hours: parseInt(e.target.value)})} />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <EnableDisableButton
                        checked={formData.approval}
                        onClick={() => setFormData({...formData, approval: !formData.approval})}
                        label={t('Approval Required')}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4"><FontAwesomeIcon icon={faSave} className="me-2" />{editRule ? t('Update') : t('Create Rule')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OvertimeRulesEngine;
