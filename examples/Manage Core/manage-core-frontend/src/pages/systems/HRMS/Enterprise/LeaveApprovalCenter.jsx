import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter, faSearch, faCheckCircle, faTimes, faClock, faEye,
  faCalendarAlt, faExclamationTriangle, faUserCheck, faChartBar,
  faChevronLeft, faChevronRight, faFileInvoice, faUserSlash,
  faPlaneDeparture, faHeart, faBaby, faBriefcase, faAmbulance
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import client, { clearCache } from '../../../../api/client';
import { listLeaves, createLeave, getLeaveTrends, getLeaveTypes, getLeaveBalances, getLeaveCalendarData, getLeaveAnalytics } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const LeaveApprovalCenter = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [leaveTrends, setLeaveTrends] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(null);

  const [formData, setFormData] = useState({
    leave_type: 'Annual', start_date: '', end_date: '', reason: '', employee_id: currentUser?.id || ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [l, lt, lts, lb, cd, an] = await Promise.all([
        listLeaves(),
        getLeaveTrends(),
        getLeaveTypes(),
        getLeaveBalances(),
        getLeaveCalendarData(),
        getLeaveAnalytics()
      ]);
      setLeaves(Array.isArray(l) ? l : []);
      setLeaveTrends(lt);
      setLeaveTypes(Array.isArray(lts) ? lts : []);
      setLeaveBalances(Array.isArray(lb) ? lb : []);
      setCalendarData(Array.isArray(cd) ? cd : []);
      setAnalytics(an);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      await client.patch(`/leaves/${id}/status`, { status: 'approved' });
      clearCache('/leaves');
      addNotification(t('leave_approved_success'), 'success');
      setShowConfirmModal(null);
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_approving'), 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await client.patch(`/leaves/${id}/status`, { status: 'rejected' });
      clearCache('/leaves');
      addNotification(t('leave_rejected'), 'info');
      setShowConfirmModal(null);
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_rejecting'), 'error');
    }
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      await createLeave(formData);
      addNotification(t('leave_applied'), 'success');
      setShowModal(false);
      setFormData({ leave_type: 'Annual', start_date: '', end_date: '', reason: '', employee_id: currentUser?.id || '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_submitting'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'approved': return 'bg-success-subtle text-success border-success';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger';
      default: return 'bg-warning-subtle text-warning border-warning';
    }
  };

  const getLeaveIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'annual': return faPlaneDeparture;
      case 'sick': case 'medical': return faAmbulance;
      case 'casual': return faBriefcase;
      case 'maternity': return faBaby;
      case 'paternity': return faHeart;
      case 'emergency': return faExclamationTriangle;
      default: return faFileInvoice;
    }
  };

  const getLeaveColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'annual': return '#4f46e5';
      case 'sick': case 'medical': return '#ef4444';
      case 'casual': return '#f59e0b';
      case 'maternity': return '#ec4899';
      case 'paternity': return '#8b5cf6';
      case 'emergency': return '#dc2626';
      default: return '#64748b';
    }
  };

  const filteredLeaves = leaves.filter(l => filter === 'All' || l.status?.toLowerCase() === filter.toLowerCase());

  const analyticsData = analytics ? {
    labels: analytics.labels || [],
    datasets: [{ data: analytics.values || [], backgroundColor: ['#4f46e5', '#ef4444', '#f59e0b', '#ec4899', '#64748b'], borderWidth: 0 }]
  } : null;

  const trendData = leaveTrends ? {
    labels: leaveTrends.labels || [],
    datasets: [{ label: t('leaves'), data: leaveTrends.values || [], borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', fill: true, tension: 0.4 }]
  } : null;

  const statsCards = [
    { label: t('total_requests'), value: leaves.length, icon: faFileInvoice, color: '#4f46e5' },
    { label: t('approved'), value: leaves.filter(l => l.status === 'approved').length, icon: faCheckCircle, color: '#10b981' },
    { label: t('rejected'), value: leaves.filter(l => l.status === 'rejected').length, icon: faTimes, color: '#ef4444' },
    { label: t('pending'), value: leaves.filter(l => l.status === 'pending').length, icon: faClock, color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('leave_approval_center')}</h4><p className="text-muted small mb-0">{t('manage_leave_requests')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && leaves.length === 0) {
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
          <h4 className="fw-bold mb-1">{t('leave_approval_center')}</h4>
          <p className="text-muted small mb-0">{t('manage_leave_requests')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faFileInvoice} className="me-2" /> {t('apply_leave')}
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">{t('leave_requests')}</h5>
                <div className="d-flex gap-2">
                  {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                    <button key={f} className={`btn btn-sm rounded-pill px-3 ${filter === f ? 'btn-primary' : isDark ? 'btn-outline-secondary' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>{t(f.toLowerCase())}</button>
                  ))}
                </div>
              </div>
              {filteredLeaves.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('type')}</th><th>{t('from')}</th><th>{t('to')}</th><th>{t('days')}</th><th>{t('status')}</th><th>{t('action')}</th></tr></thead>
                    <tbody>
                      {filteredLeaves.map(l => (
                        <tr key={l.id}>
                          <td><div className="small fw-bold">{l.user?.name || 'N/A'}</div></td>
                          <td><span className="badge rounded-pill px-2 py-1" style={{ backgroundColor: `${getLeaveColor(l.leave_type)}20`, color: getLeaveColor(l.leave_type) }}>{l.leave_type}</span></td>
                          <td className="small">{l.start_date ? new Date(l.start_date).toLocaleDateString() : '-'}</td>
                          <td className="small">{l.end_date ? new Date(l.end_date).toLocaleDateString() : '-'}</td>
                          <td className="small fw-bold">{l.total_days || l.days || '-'}</td>
                          <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(l.status)}`}>{l.status}</span></td>
                          <td>
                            {l.status === 'pending' ? (
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-success rounded-3" onClick={() => setShowConfirmModal({ id: l.id, action: 'approve', name: l.user?.name })}><FontAwesomeIcon icon={faCheckCircle} /></button>
                                <button className="btn btn-sm btn-danger rounded-3" onClick={() => setShowConfirmModal({ id: l.id, action: 'reject', name: l.user?.name })}><FontAwesomeIcon icon={faTimes} /></button>
                              </div>
                            ) : (
                              <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_leave_requests')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('leave_analytics')}</h5>
              {analyticsData ? (
                <>
                  <div style={{ height: '200px' }}><Doughnut data={analyticsData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }} /></div>
                  {analyticsData.labels.map((l, i) => (
                    <div key={l} className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2"><div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: analyticsData.datasets[0].backgroundColor[i] }} /><span className="x-small text-muted">{l}</span></div>
                      <span className="x-small fw-bold">{analyticsData.datasets[0].data[i]}%</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_analytics')}</div>
              )}
              {trendData && (
                <div style={{ height: '120px' }} className="mt-2"><Line data={trendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { display: false } } }} /></div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('leave_balances')}</h5>
              {leaveBalances.length > 0 ? (
                <div className="row g-3">
                  {leaveBalances.map((lb, i) => (
                    <div key={i} className="col-md-4 col-6">
                      <div className={`p-3 rounded-3 text-center ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                        <FontAwesomeIcon icon={getLeaveIcon(lb.leave_type)} className="mb-1" style={{ color: getLeaveColor(lb.leave_type) }} />
                        <div className="h5 fw-bold mb-0">{lb.remaining || lb.balance || 0}</div>
                        <div className="x-small text-muted">{lb.leave_type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_balances')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('team_leave_calendar')}</h5>
              {calendarData.length > 0 ? calendarData.map((cd, i) => (
                <div key={i} className={`d-flex justify-content-between align-items-center p-2 rounded-3 mb-1 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                  <div>
                    <div className="small fw-bold">{cd.user?.name || cd.employee_name}</div>
                    <div className="x-small text-muted">{cd.start_date} - {cd.end_date}</div>
                  </div>
                  <span className="badge rounded-pill" style={{ backgroundColor: `${getLeaveColor(cd.leave_type)}20`, color: getLeaveColor(cd.leave_type) }}>{cd.leave_type}</span>
                </div>
              )) : (
                <div className="text-center py-4 text-muted small">{t('no_upcoming_leaves')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-body p-4 text-center">
                <FontAwesomeIcon icon={showConfirmModal.action === 'approve' ? faCheckCircle : faTimes} className={`fs-1 mb-3 ${showConfirmModal.action === 'approve' ? 'text-success' : 'text-danger'}`} />
                <h5 className="fw-bold mb-2">{showConfirmModal.action === 'approve' ? t('approve_leave') : t('reject_leave')}</h5>
                <p className="small text-muted mb-3">{t('confirm_leave_action', { name: showConfirmModal.name })}</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-light rounded-3 px-4" onClick={() => setShowConfirmModal(null)}>{t('cancel')}</button>
                  <button className={`btn rounded-3 px-4 ${showConfirmModal.action === 'approve' ? 'btn-success' : 'btn-danger'}`} onClick={() => showConfirmModal.action === 'approve' ? handleApprove(showConfirmModal.id) : handleReject(showConfirmModal.id)}>
                    {showConfirmModal.action === 'approve' ? t('approve') : t('reject')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('apply_leave')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitLeave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('leave_type')}</label>
                      <select className="form-select rounded-3" value={formData.leave_type} onChange={e => setFormData({ ...formData, leave_type: e.target.value })}>
                        {['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Emergency', 'Unpaid'].map(lt => <option key={lt} value={lt}>{lt}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('start_date')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('end_date')}</label>
                      <input type="date" className="form-control rounded-3" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
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
      `}} />
    </div>
  );
};

export default LeaveApprovalCenter;
