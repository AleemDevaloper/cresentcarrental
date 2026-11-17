import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faPlus, faSave, faCalculator,
  faHistory, faCheckCircle, faClock, faPlay, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { getLeaveAccrualRules, createLeaveAccrualRule, runLeaveAccrual } from '../../../../api/hrms';
import { EnableDisableButton } from '../../../../components/common';

const LeaveAccrualManagement = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [runningAccrual, setRunningAccrual] = useState(false);
  const [runHistory, setRunHistory] = useState([]);

  const [formData, setFormData] = useState({
    leave_type: '', accrual_frequency: 'monthly', accrual_amount: 1.67,
    max_balance: 30, carry_forward: false, carry_forward_limit: 0,
    service_months_required: 0
  });

  const [simInput, setSimInput] = useState({ months: 12 });
  const [simResult, setSimResult] = useState(null);

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeaveAccrualRules();
      setRules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message || t('Failed to load accrual rules'), 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification, t]);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        carry_forward: Boolean(formData.carry_forward),
        accrual_amount: parseFloat(formData.accrual_amount),
        max_balance: parseInt(formData.max_balance, 10),
        carry_forward_limit: parseInt(formData.carry_forward_limit, 10),
        service_months_required: parseInt(formData.service_months_required, 10),
      };
      await createLeaveAccrualRule(payload);
      addNotification(editRule ? t('Rule updated') : t('Rule created'), 'success');
      setShowForm(false);
      setEditRule(null);
      setFormData({
        leave_type: '', accrual_frequency: 'monthly', accrual_amount: 1.67,
        max_balance: 30, carry_forward: false, carry_forward_limit: 0,
        service_months_required: 0
      });
      fetchRules();
    } catch (err) {
      addNotification(err.message || t('Error saving rule'), 'danger');
    }
  };

  const handleRunAccrual = async () => {
    setRunningAccrual(true);
    try {
      const result = await runLeaveAccrual();
      const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        details: result?.message || t('Accrual completed successfully')
      };
      setRunHistory(prev => [entry, ...prev]);
      addNotification(t('Accrual run completed'), 'success');
    } catch (err) {
      const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'failed',
        details: err.message || t('Accrual run failed')
      };
      setRunHistory(prev => [entry, ...prev]);
      addNotification(err.message || t('Accrual run failed'), 'danger');
    } finally {
      setRunningAccrual(false);
    }
  };

  const runSimulation = () => {
    const months = parseInt(simInput.months, 10) || 0;
    const amount = parseFloat(formData.accrual_amount) || 0;
    const maxBal = parseInt(formData.max_balance, 10) || 0;
    const cfLimit = parseInt(formData.carry_forward_limit, 10) || 0;

    let accrued = 0;
    if (formData.accrual_frequency === 'monthly') {
      accrued = months * amount;
    } else if (formData.accrual_frequency === 'quarterly') {
      accrued = Math.floor(months / 3) * amount;
    } else if (formData.accrual_frequency === 'yearly') {
      accrued = Math.floor(months / 12) * amount;
    }

    const capped = Math.min(accrued, maxBal);
    const carryEligible = formData.carry_forward ? Math.min(capped, cfLimit) : 0;

    setSimResult({
      accrued: accrued.toFixed(2),
      capped: capped.toFixed(2),
      carry_eligible: carryEligible.toFixed(2),
    });
  };

  const openCreateForm = () => {
    setEditRule(null);
    setFormData({
      leave_type: '', accrual_frequency: 'monthly', accrual_amount: 1.67,
      max_balance: 30, carry_forward: false, carry_forward_limit: 0,
      service_months_required: 0
    });
    setShowForm(true);
  };

  const openEditForm = (rule) => {
    setEditRule(rule);
    setFormData({
      leave_type: rule.leave_type || '',
      accrual_frequency: rule.accrual_frequency || 'monthly',
      accrual_amount: rule.accrual_amount || 0,
      max_balance: rule.max_balance || 0,
      carry_forward: Boolean(rule.carry_forward),
      carry_forward_limit: rule.carry_forward_limit || 0,
      service_months_required: rule.service_months_required || 0,
    });
    setShowForm(true);
  };

  if (loading && rules.length === 0) {
    return (
      <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  if (error && rules.length === 0) {
    return (
      <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
        <div className="text-center py-5">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchRules}>{t('Retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />{t('Leave Accrual Management')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Configure leave accrual rules and policies')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success rounded-3" onClick={handleRunAccrual} disabled={runningAccrual}>
            <FontAwesomeIcon icon={runningAccrual ? faSpinner : faPlay} className={`me-2 ${runningAccrual ? 'fa-spin' : ''}`} />
            {runningAccrual ? t('Running...') : t('Run Accrual')}
          </button>
          <button className="btn btn-primary rounded-3" onClick={openCreateForm}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Add Rule')}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          {rules.length === 0 ? (
            <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-4 text-center py-5">
                <FontAwesomeIcon icon={faChartLine} className="text-muted fs-1 mb-3" />
                <p className="text-muted mb-3">{t('No accrual rules configured yet')}</p>
                <button className="btn btn-primary rounded-3" onClick={openCreateForm}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />{t('Create First Rule')}
                </button>
              </div>
            </div>
          ) : (
            <div className="row g-3 mb-4">
              {rules.map(rule => (
                <div key={rule.id} className="col-md-6">
                  <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-subtle' : ''}`}>
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-0">{rule.leave_type || rule.name}</h6>
                          <span className="badge bg-info-subtle text-info x-small">{t(rule.accrual_frequency || 'monthly')}</span>
                        </div>
                        <button className="btn btn-sm btn-light rounded-3" onClick={() => openEditForm(rule)}>
                          <FontAwesomeIcon icon={faPlus} className="text-primary" />
                        </button>
                      </div>
                      <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                        <div className="row g-2">
                          <div className="col-6">
                            <p className="x-small text-muted mb-0">{t('Accrual Rate')}</p>
                            <p className="fw-bold small mb-0">{rule.accrual_amount}/{t(rule.accrual_frequency || 'month')}</p>
                          </div>
                          <div className="col-6">
                            <p className="x-small text-muted mb-0">{t('Max Balance')}</p>
                            <p className="fw-bold small mb-0">{rule.max_balance} {t('days')}</p>
                          </div>
                          <div className="col-6">
                            <p className="x-small text-muted mb-0">{t('Carry Forward')}</p>
                            <p className="fw-bold small mb-0">
                              {rule.carry_forward ? `${t('Up to')} ${rule.carry_forward_limit}d` : t('No')}
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="x-small text-muted mb-0">{t('Service Required')}</p>
                            <p className="fw-bold small mb-0">{rule.service_months_required || 0} {t('months')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faCalculator} className="me-2 text-success" />{t('Accrual Simulator')}</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="small fw-bold text-muted mb-2">{t('Number of Months')}</label>
                  <input type="number" className="form-control rounded-3" min="1" max="60" value={simInput.months}
                    onChange={e => setSimInput({ ...simInput, months: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <button className="btn btn-primary w-100 rounded-3" onClick={runSimulation}>
                    <FontAwesomeIcon icon={faCalculator} className="me-2" />{t('Simulate')}
                  </button>
                </div>
                <div className="col-md-4 d-flex align-items-end">
                  <select className="form-select rounded-3" value={formData.leave_type}
                    onChange={e => {
                      const r = rules.find(rule => rule.leave_type === e.target.value || rule.name === e.target.value);
                      if (r) {
                        setFormData({
                          leave_type: r.leave_type || r.name || '',
                          accrual_frequency: r.accrual_frequency || 'monthly',
                          accrual_amount: r.accrual_amount || 0,
                          max_balance: r.max_balance || 0,
                          carry_forward: Boolean(r.carry_forward),
                          carry_forward_limit: r.carry_forward_limit || 0,
                          service_months_required: r.service_months_required || 0,
                        });
                      }
                    }}>
                    <option value="">{t('Select Rule')}</option>
                    {rules.map(r => (
                      <option key={r.id} value={r.leave_type || r.name}>{r.leave_type || r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {simResult && (
                <div className="row g-3 mt-3">
                  <div className="col-4 text-center">
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                      <p className="x-small text-muted mb-0">{t('Total Accrued')}</p>
                      <p className="h4 fw-bold text-primary mb-0">{simResult.accrued}</p>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                      <p className="x-small text-muted mb-0">{t('Capped')}</p>
                      <p className="h4 fw-bold text-warning mb-0">{simResult.capped}</p>
                    </div>
                  </div>
                  <div className="col-4 text-center">
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark' : 'bg-light'}`}>
                      <p className="x-small text-muted mb-0">{t('Carry Eligible')}</p>
                      <p className="h4 fw-bold text-success mb-0">{simResult.carry_eligible}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className={`card-header bg-transparent border-0 py-3`}>
              <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Accrual Run History')}</h6>
            </div>
            <div className="table-responsive">
              <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr>
                    <th className="ps-4">{t('Date')}</th>
                    <th>{t('Details')}</th>
                    <th className="pe-4">{t('Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {runHistory.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-4 text-muted">{t('No runs yet. Click "Run Accrual" to start.')}</td></tr>
                  ) : runHistory.map(entry => (
                    <tr key={entry.id}>
                      <td className="ps-4">{entry.date}</td>
                      <td className="small text-muted">{entry.details}</td>
                      <td className="pe-4">
                        <span className={`badge rounded-pill ${entry.status === 'completed' ? 'bg-success' : 'bg-danger'}`}>
                          <FontAwesomeIcon icon={entry.status === 'completed' ? faCheckCircle : faClock} className="me-1" />
                          {t(entry.status === 'completed' ? 'Completed' : 'Failed')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />{t('Rule Summary')}</h6>
              <div className="h2 fw-bold text-primary mb-1">{rules.length}</div>
              <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('Active accrual rules configured')}</p>
              <hr />
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">{t('Monthly')}</span>
                <span className="fw-bold">{rules.filter(r => (r.accrual_frequency || '').toLowerCase() === 'monthly').length}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">{t('Quarterly')}</span>
                <span className="fw-bold">{rules.filter(r => (r.accrual_frequency || '').toLowerCase() === 'quarterly').length}</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">{t('Yearly')}</span>
                <span className="fw-bold">{rules.filter(r => (r.accrual_frequency || '').toLowerCase() === 'yearly').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editRule ? t('Edit Accrual Rule') : t('New Accrual Rule')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Leave Type')}</label>
                      <input type="text" className="form-control rounded-3" required
                        placeholder="e.g. Annual, Sick"
                        value={formData.leave_type}
                        onChange={e => setFormData({ ...formData, leave_type: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Accrual Frequency')}</label>
                      <select className="form-select rounded-3" value={formData.accrual_frequency}
                        onChange={e => setFormData({ ...formData, accrual_frequency: e.target.value })}>
                        <option value="monthly">{t('Monthly')}</option>
                        <option value="quarterly">{t('Quarterly')}</option>
                        <option value="yearly">{t('Yearly')}</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Accrual Amount')}</label>
                      <input type="number" step="0.01" className="form-control rounded-3" required
                        value={formData.accrual_amount}
                        onChange={e => setFormData({ ...formData, accrual_amount: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">{t('Max Balance')}</label>
                      <input type="number" className="form-control rounded-3" required
                        value={formData.max_balance}
                        onChange={e => setFormData({ ...formData, max_balance: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <div className="mt-3">
                        <EnableDisableButton
                          checked={formData.carry_forward}
                          onClick={() => setFormData({ ...formData, carry_forward: !formData.carry_forward })}
                          label={t('Allow Carry Forward')}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Carry Forward Limit')}</label>
                      <input type="number" className="form-control rounded-3"
                        value={formData.carry_forward_limit}
                        disabled={!formData.carry_forward}
                        onChange={e => setFormData({ ...formData, carry_forward_limit: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Service Months Required')}</label>
                      <input type="number" className="form-control rounded-3"
                        value={formData.service_months_required}
                        onChange={e => setFormData({ ...formData, service_months_required: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" />{editRule ? t('Update') : t('Create Rule')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default LeaveAccrualManagement;
