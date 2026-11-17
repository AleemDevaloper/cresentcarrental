import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave, faPlus, faCheckCircle, faEye,
  faChartBar, faCoins, faPercent, faCalendarAlt,
  faBank, faCheck, faSpinner, faCreditCard
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import client, { clearCache } from '../../../../api/client';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const DEFAULT_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b', '#06b6d4', '#f97316'];

const LoanManagementPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showEmis, setShowEmis] = useState(false);
  const [emis, setEmis] = useState([]);
  const [payingEmi, setPayingEmi] = useState(null);

  const [formData, setFormData] = useState({
    loan_type: 'Personal', amount: '', purpose: '', repayment_period: 12, employee_id: currentUser?.id || ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [loansRes, statsRes] = await Promise.allSettled([
        client.get('/loans'),
        client.get('/loans/stats'),
      ]);

      if (loansRes.status === 'fulfilled') {
        setLoans(Array.isArray(loansRes.value.data) ? loansRes.value.data : []);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data || null);
      }
    } catch (err) {
      setError(err.message);
      addNotification(err.message || t('Failed to load'), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/loans', formData);
      clearCache('/loans');
      addNotification(t('loan_applied'), 'success');
      setShowModal(false);
      setFormData({ loan_type: 'Personal', amount: '', purpose: '', repayment_period: 12, employee_id: currentUser?.id || '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_creating'), 'error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await client.patch('/loans/' + id, { status: 'approved' });
      clearCache('/loans');
      addNotification(t('loan_approved'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const handleViewEMI = async (loanId) => {
    try {
      const res = await client.get('/loans/' + loanId);
      const loan = res.data;
      if (loan && Array.isArray(loan.emis)) {
        setEmis(loan.emis);
      } else {
        setEmis([]);
      }
      setSelectedLoan(loanId);
      setShowEmis(true);
    } catch (err) {
      addNotification(err.message || t('Error fetching EMI details'), 'error');
    }
  };

  const handlePayEmi = async (emiId) => {
    setPayingEmi(emiId);
    try {
      await client.post('/loans/emi/' + emiId + '/pay');
      clearCache('/loans');
      addNotification(t('EMI paid successfully'), 'success');
      if (selectedLoan) handleViewEMI(selectedLoan);
      fetchData();
    } catch (err) {
      addNotification(err.message || t('Error paying EMI'), 'error');
    } finally {
      setPayingEmi(null);
    }
  };

  const getDistribution = () => {
    if (stats && stats.distribution) {
      if (Array.isArray(stats.distribution)) {
        return stats.distribution;
      }
      if (typeof stats.distribution === 'object') {
        return Object.entries(stats.distribution).map(([label, value]) => ({
          label,
          value: typeof value === 'object' ? (value.count || value.total || value.amount || 0) : value,
        }));
      }
    }
    return null;
  };

  const distribution = getDistribution();
  const loanTypeLabels = distribution ? distribution.map(d => d.label || d.type || d.name || '') : [];
  const loanTypeValues = distribution ? distribution.map(d => parseInt(d.value || d.count || d.total || d.amount || 0, 10)) : [];

  const getStatsValue = (path, fallback) => {
    if (!stats) return fallback;
    const parts = path.split('.');
    let val = stats;
    for (const p of parts) {
      if (val && typeof val === 'object' && p in val) val = val[p];
      else return fallback;
    }
    return val;
  };

  const activeLoans = loans.filter(l => l.status === 'active');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + parseFloat(l.remaining || l.balance || 0), 0);
  const totalDisbursed = loans.reduce((sum, l) => sum + parseFloat(l.amount || 0), 0);
  const recoveryRate = totalDisbursed > 0 ? Math.round(((totalDisbursed - totalOutstanding) / totalDisbursed) * 100) : 0;

  const statsCards = [
    { label: t('active_loans'), value: getStatsValue('active_loans_count', activeLoans.length), icon: faMoneyBillWave, color: '#4f46e5' },
    { label: t('total_outstanding'), value: `$${(getStatsValue('total_outstanding', totalOutstanding)).toLocaleString()}`, icon: faCoins, color: '#f59e0b' },
    { label: t('recovery_rate'), value: `${getStatsValue('recovery_rate', recoveryRate)}%`, icon: faPercent, color: '#10b981' },
    { label: t('total_disbursed'), value: `$${(getStatsValue('total_disbursed', totalDisbursed)).toLocaleString()}`, icon: faBank, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('loan_management')}</h4><p className="text-muted small mb-0">{t('manage_employee_loans')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && loans.length === 0) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('loan_management')}</h4>
          <p className="text-muted small mb-0">{t('manage_employee_loans')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_loan')}
        </button>
      </div>

      <div className="row g-3 mb-4">
        {statsCards.map((s, i) => (
          <div key={i} className="col-md-3">
            <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('loans')}</h5>
              {loans.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('type')}</th><th>{t('amount')}</th><th>{t('remaining')}</th><th>{t('emi')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                    <tbody>
                      {loans.map(l => (
                        <tr key={l.id}>
                          <td><div className="small fw-bold">{l.user?.name || l.employee_name || l.employee}</div></td>
                          <td><span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: `${l.loan_type === 'Personal' ? '#4f46e5' : l.loan_type === 'Home' ? '#10b981' : l.loan_type === 'Vehicle' ? '#f59e0b' : '#ec4899'}20`, color: l.loan_type === 'Personal' ? '#4f46e5' : l.loan_type === 'Home' ? '#10b981' : l.loan_type === 'Vehicle' ? '#f59e0b' : '#ec4899' }}>{l.loan_type || l.type}</span></td>
                          <td className="small fw-bold">${parseFloat(l.amount || 0).toLocaleString()}</td>
                          <td className="small text-warning fw-bold">${parseFloat(l.remaining || l.balance || 0).toLocaleString()}</td>
                          <td className="small">${l.emi || l.monthly_emi || 0}</td>
                          <td><span className={`badge rounded-pill ${l.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{l.status}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              {l.status === 'pending' && (
                                <button className="btn btn-sm btn-success rounded-3" onClick={() => handleApprove(l.id)}><FontAwesomeIcon icon={faCheck} /></button>
                              )}
                              <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => handleViewEMI(l.id)}><FontAwesomeIcon icon={faEye} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_loans')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('loan_distribution')}</h5>
              {loanTypeLabels.length > 0 ? (
                <>
                  <div style={{ height: '200px' }}>
                    <Doughnut data={{
                      labels: loanTypeLabels,
                      datasets: [{
                        data: loanTypeValues,
                        backgroundColor: DEFAULT_COLORS.slice(0, loanTypeLabels.length),
                        borderWidth: 0
                      }]
                    }} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false } } }} />
                  </div>
                  {loanTypeLabels.map((label, i) => (
                    <div key={label} className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} />
                        <span className="x-small text-muted">{label}</span>
                      </div>
                      <span className="x-small fw-bold">{Math.round((loanTypeValues[i] / loanTypeValues.reduce((a, b) => a + b, 0)) * 100)}%</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_distribution_data')}</div>
              )}
            </div>
          </div>
          {showEmis && emis.length > 0 && (
            <div className={`card border-0 shadow-sm rounded-4 mt-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">{t('emi_schedule')}</h5>
                  <button className="btn-close" onClick={() => { setShowEmis(false); setEmis([]); }} />
                </div>
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('month')}</th><th>{t('amount')}</th><th>{t('due_date')}</th><th>{t('status')}</th><th></th></tr></thead>
                    <tbody>
                      {emis.slice(0, 10).map((emi, i) => (
                        <tr key={emi.id || i}>
                          <td className="small">{emi.month || emi.installment_number || i + 1}</td>
                          <td className="small fw-bold">${parseFloat(emi.amount || 0).toFixed(2)}</td>
                          <td className="small">{emi.due_date || '-'}</td>
                          <td>
                            <span className={`badge rounded-pill ${emi.status === 'paid' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                              {emi.status === 'paid' ? t('paid') : t('pending')}
                            </span>
                          </td>
                          <td>
                            {emi.status !== 'paid' && (
                              <button className="btn btn-sm btn-success rounded-3"
                                onClick={() => handlePayEmi(emi.id)}
                                disabled={payingEmi === emi.id}>
                                {payingEmi === emi.id ? (
                                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
                                ) : (
                                  <FontAwesomeIcon icon={faCreditCard} />
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('installment_tracking')}</h5>
              {activeLoans.length > 0 ? (
                <div className="row g-3">
                  {activeLoans.slice(0, 4).map((l, i) => {
                    const paid = parseFloat(l.amount || 0) - parseFloat(l.remaining || l.balance || 0);
                    const pct = l.amount > 0 ? (paid / l.amount) * 100 : 0;
                    return (
                      <div key={i} className="col-md-6">
                        <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="small fw-bold">{l.user?.name || l.employee_name}</span>
                            <span className="x-small text-muted">{l.loan_type || l.type}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="small text-muted">{t('emi')}: ${l.emi || l.monthly_emi || 0}</span>
                            <span className="small fw-bold text-success">${paid.toLocaleString()} {t('paid')}</span>
                          </div>
                          <div className="progress mt-2" style={{ height: 4 }}>
                            <div className="progress-bar bg-primary" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_active_loans')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('loan_summary')}</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className={`p-3 rounded-3 text-center ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                    <div className="x-small text-muted">{t('average_loan_amount')}</div>
                    <div className="h4 fw-bold text-primary mb-0">
                      ${loans.length > 0 ? (loans.reduce((s, l) => s + parseFloat(l.amount || 0), 0) / loans.length).toFixed(0) : 0}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={`p-3 rounded-3 text-center ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                    <div className="x-small text-muted">{t('default_rate')}</div>
                    <div className="h4 fw-bold text-danger mb-0">
                      {loans.filter(l => l.status === 'defaulted').length > 0
                        ? `${Math.round((loans.filter(l => l.status === 'defaulted').length / loans.length) * 100)}%`
                        : '0%'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('apply_loan')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('loan_type')}</label>
                      <select className="form-select rounded-3" value={formData.loan_type}
                        onChange={e => setFormData({ ...formData, loan_type: e.target.value })}>
                        <option value="Personal">Personal</option>
                        <option value="Home">Home</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Education">Education</option>
                        <option value="Business">Business</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('amount')}</label>
                      <input type="number" className="form-control rounded-3" value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('repayment_period')} ({t('months')})</label>
                      <select className="form-select rounded-3" value={formData.repayment_period}
                        onChange={e => setFormData({ ...formData, repayment_period: parseInt(e.target.value) })}>
                        {[6, 12, 18, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} {t('months')}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('purpose')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.purpose}
                        onChange={e => setFormData({ ...formData, purpose: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                        <div className="d-flex justify-content-between">
                          <span className="small text-muted">{t('estimated_emi')}</span>
                          <span className="h5 fw-bold text-primary mb-0">
                            ${formData.amount ? Math.round(formData.amount / formData.repayment_period * 1.1) : 0}
                          </span>
                        </div>
                        <div className="x-small text-muted">{t('per_month_for')} {formData.repayment_period} {t('months')}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('apply')}</button>
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
        .bg-warning-subtle { background-color: #fffbeb !important; }
      `}} />
    </div>
  );
};

export default LoanManagementPortal;
