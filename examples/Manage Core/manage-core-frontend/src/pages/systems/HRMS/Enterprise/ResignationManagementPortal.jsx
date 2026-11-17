import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserSlash, faPlus, faCheckCircle, faTimes, faEye,
  faChartBar, faCalendarAlt, faClipboardList, faFileAlt,
  faCalculator, faExclamationTriangle, faArrowUp, faArrowDown,
  faFilter, faSearch, faUserCheck, faDoorOpen, faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { listResignations, createResignation, updateResignationStatus, updateClearanceStage, getExitStats } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const ResignationManagementPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [resignations, setResignations] = useState([]);
  const [exitStats, setExitStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showClearance, setShowClearance] = useState(false);
  const [selectedClearance, setSelectedClearance] = useState(null);

  const [formData, setFormData] = useState({
    employee_id: '', resignation_date: '', last_working_day: '', reason: '', remarks: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, es] = await Promise.all([listResignations(), getExitStats()]);
      setResignations(Array.isArray(r) ? r : []);
      setExitStats(es);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createResignation(formData);
      addNotification(t('resignation_submitted'), 'success');
      setShowModal(false);
      setFormData({ employee_id: '', resignation_date: '', last_working_day: '', reason: '', remarks: '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_submitting'), 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateResignationStatus(id, { status });
      addNotification(t('status_updated'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const handleClearanceStage = async (stageId, data) => {
    try {
      await updateClearanceStage(stageId, data);
      addNotification(t('clearance_updated'), 'success');
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved': return 'bg-success-subtle text-success border-success';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'clearance_pending': return 'bg-warning-subtle text-warning border-warning';
      default: return 'bg-info-subtle text-info border-info';
    }
  };

  const statsCards = [
    { label: t('total_resignations'), value: resignations.length, icon: faUserSlash, color: '#ef4444' },
    { label: t('pending_clearance'), value: resignations.filter(r => r.status === 'clearance_pending').length, icon: faClipboardList, color: '#f59e0b' },
    { label: t('exit_interviews'), value: resignations.filter(r => r.exit_interview_completed).length, icon: faFileAlt, color: '#4f46e5' },
    { label: t('turnover_rate'), value: exitStats?.turnover_rate || 'N/A', icon: faChartBar, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('resignation_management')}</h4><p className="text-muted small mb-0">{t('manage_exit_separation')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && resignations.length === 0) {
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
          <h4 className="fw-bold mb-1">{t('resignation_management')}</h4>
          <p className="text-muted small mb-0">{t('manage_exit_separation')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_resignation')}
          </button>
        </div>
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
              <h5 className="fw-bold mb-3">{t('resignations')}</h5>
              {resignations.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('resignation_date')}</th><th>{t('last_day')}</th><th>{t('reason')}</th><th>{t('notice_period')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                    <tbody>
                      {resignations.map(r => (
                        <tr key={r.id}>
                          <td><div className="small fw-bold">{r.user?.name || r.employee_name || 'N/A'}</div></td>
                          <td className="small">{r.resignation_date ? new Date(r.resignation_date).toLocaleDateString() : '-'}</td>
                          <td className="small">{r.last_working_day ? new Date(r.last_working_day).toLocaleDateString() : '-'}</td>
                          <td className="small text-muted">{r.reason || '-'}</td>
                          <td className="small fw-bold">{r.notice_period_days || '-'}d</td>
                          <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(r.status)}`}>{r.status}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              {r.status === 'pending' && (
                                <>
                                  <button className="btn btn-sm btn-success rounded-3" onClick={() => handleStatusChange(r.id, 'approved')}><FontAwesomeIcon icon={faCheckCircle} /></button>
                                  <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleStatusChange(r.id, 'rejected')}><FontAwesomeIcon icon={faTimes} /></button>
                                </>
                              )}
                              <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => { setSelectedClearance(r); setShowClearance(true); }}><FontAwesomeIcon icon={faEye} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_resignations')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('exit_reasons')}</h5>
              <div style={{ height: '180px' }}>
                <Doughnut data={{
                  labels: [t('career_growth'), t('compensation'), t('work_life'), t('relocation'), t('other')],
                  datasets: [{ data: [35, 25, 20, 12, 8], backgroundColor: ['#4f46e5', '#ef4444', '#f59e0b', '#10b981', '#64748b'], borderWidth: 0 }]
                }} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false } } }} />
              </div>
            </div>
          </div>
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('monthly_trend')}</h5>
              <div style={{ height: '150px' }}>
                <Line data={{
                  labels: [t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun')],
                  datasets: [{ label: t('resignations'), data: [5, 3, 7, 4, 6, 2], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 }]
                }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showClearance && selectedClearance && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('clearance_checklist')} - {selectedClearance.user?.name || selectedClearance.employee_name}</h5>
                <button type="button" className="btn-close" onClick={() => { setShowClearance(false); setSelectedClearance(null); }}></button>
              </div>
              <div className="modal-body p-4">
                {(selectedClearance.clearance_stages || []).length > 0 ? (selectedClearance.clearance_stages).map((c, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom border-opacity-10">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={c.status === 'completed' ? faCheckCircle : faClock} className={c.status === 'completed' ? 'text-success' : 'text-warning'} />
                      <div><div className="small">{c.stage_name || c.dept}</div><div className="x-small text-muted">{c.department || ''}</div></div>
                    </div>
                    <span className={`badge rounded-pill ${c.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>{c.status}</span>
                  </div>
                )) : (
                  <div className="text-center py-4 text-muted small">{t('no_clearance_stages')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('submit_resignation')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('employee')}</label>
                      <select className="form-select rounded-3" value={formData.employee_id} onChange={e => setFormData({ ...formData, employee_id: e.target.value })} required>
                        <option value="">{t('select_employee')}</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('resignation_date')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.resignation_date} onChange={e => setFormData({ ...formData, resignation_date: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('last_working_day')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.last_working_day} onChange={e => setFormData({ ...formData, last_working_day: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('reason')}</label>
                      <select className="form-select rounded-3" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}>
                        <option value="">{t('select_reason')}</option>
                        {['Career Growth', 'Compensation', 'Work Life Balance', 'Relocation', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('remarks')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('submit')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
        .bg-secondary-subtle { background-color: #f1f5f9 !important; }
      `}} />
    </div>
  );
};

export default ResignationManagementPortal;
