import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faClock, faCheckCircle, faPlaneDeparture, faFileInvoice,
  faMoneyBillWave, faDownload, faFilePdf, faCalendarAlt, faHistory,
  faRocket, faPercent, faCoins, faUserCheck, faBullhorn, faGift,
  faCakeCandles, faBriefcase, faChartLine, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getEmployeeDashboard, getEmployeeAttendanceHistory, getEmployeePayslips, getEmployeeTaxDocuments, getEmployeeTrainingRecords, createLeave } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

const EmployeePortal = () => {
  const { t } = useTranslation();
  const { theme, currentUser, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [dashboard, setDashboard] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [taxDocs, setTaxDocs] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ leave_type: 'Annual', start_date: '', end_date: '', reason: '' });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [d, a, p, td, tr] = await Promise.all([
        getEmployeeDashboard(currentUser?.id),
        getEmployeeAttendanceHistory({ user_id: currentUser?.id }),
        getEmployeePayslips(currentUser?.id),
        getEmployeeTaxDocuments(currentUser?.id),
        getEmployeeTrainingRecords(currentUser?.id),
      ]);
      setDashboard(d);
      setAttendance(Array.isArray(a) ? a : []);
      setPayslips(Array.isArray(p) ? p : []);
      setTaxDocs(Array.isArray(td) ? td : []);
      setTraining(Array.isArray(tr) ? tr : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await createLeave({ ...leaveForm, employee_id: currentUser?.id });
      addNotification(t('leave_applied'), 'success');
      setShowLeaveModal(false);
      setLeaveForm({ leave_type: 'Annual', start_date: '', end_date: '', reason: '' });
    } catch (err) {
      addNotification(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">{t('employee_portal')}</h4>
            <p className="text-muted small mb-0">{t('welcome_back')}</p>
          </div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  const todayStatus = dashboard?.today_status || 'not_checked_in';
  const statusIcon = todayStatus === 'checked_in' ? faUserCheck : faClock;
  const statusColor = todayStatus === 'checked_in' ? '#10b981' : '#f59e0b';
  const statusText = todayStatus === 'checked_in' ? t('checked_in') : t('not_checked_in');

  const profileCompletion = dashboard?.profile_completion || 0;
  const balances = dashboard?.balances || [];

  const quickActions = [
    { icon: faPlaneDeparture, label: t('apply_leave'), color: '#4f46e5', action: () => setShowLeaveModal(true) },
    { icon: faMoneyBillWave, label: t('claim_expense'), color: '#10b981' },
    { icon: faClock, label: t('request_overtime'), color: '#f59e0b' },
    { icon: faFileInvoice, label: t('view_payslip'), color: '#8b5cf6' },
    { icon: faUser, label: t('update_profile'), color: '#3b82f6' },
    { icon: faCalendarAlt, label: t('my_schedule'), color: '#ec4899' },
  ];

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('employee_portal')}</h4>
          <p className="text-muted small mb-0">{t('welcome_back')}, {currentUser?.name || t('employee')}</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
            <FontAwesomeIcon icon={statusIcon} />
            <span className="small fw-bold">{statusText}</span>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('quick_actions')}</h5>
              <div className="row g-3">
                {quickActions.map((a, i) => (
                  <div key={i} className="col-md-4 col-6">
                    <button className={`btn w-100 p-3 rounded-3 border d-flex flex-column align-items-center gap-2 ${isDark ? 'btn-dark border-secondary' : 'btn-light'}`} style={{ color: a.color }} onClick={a.action}>
                      <FontAwesomeIcon icon={a.icon} size="lg" />
                      <span className="small fw-bold">{a.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('profile_completion')}</h5>
              <div className="text-center mb-3">
                <div className="position-relative d-inline-block">
                  <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 80, height: 80, border: `4px solid ${profileCompletion > 80 ? '#10b981' : '#f59e0b'}` }}>
                    <span className="h4 fw-bold mb-0">{profileCompletion}%</span>
                  </div>
                </div>
              </div>
              <div className="progress mb-2" style={{ height: 6 }}>
                <div className="progress-bar" style={{ width: `${profileCompletion}%`, backgroundColor: profileCompletion > 80 ? '#10b981' : '#f59e0b' }}></div>
              </div>
              <div className="small text-muted text-center">{t('complete_your_profile')}</div>
              <button className="btn btn-primary btn-sm w-100 rounded-3 mt-2">{t('update_profile')}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('my_balances')}</h5>
              {balances.length > 0 ? balances.map((b, i) => (
                <div key={i} className="d-flex align-items-center gap-3 p-3 rounded-3 mb-2" style={{ backgroundColor: `${b.color || '#4f46e5'}10` }}>
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 40, height: 40, backgroundColor: `${b.color || '#4f46e5'}20`, color: b.color || '#4f46e5' }}>
                    <FontAwesomeIcon icon={faCoins} />
                  </div>
                  <div>
                    <div className="h5 fw-bold mb-0">{b.remaining || b.balance || 0}<span className="small text-muted fw-normal"> {b.unit || 'days'}</span></div>
                    <div className="x-small text-muted">{b.leave_type || b.type || b.label}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-4 text-muted small">{t('no_balances')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('attendance_history')}</h5>
              {attendance.length > 0 ? (
                <>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {attendance.slice(0, 9).map((a, i) => (
                      <div key={i} className="text-center p-2 rounded-2" style={{ width: '31%', backgroundColor: a.status === 'present' ? '#10b98120' : a.status === 'late' ? '#f59e0b20' : '#ef444420' }}>
                        <div className="x-small fw-bold">{new Date(a.date).getDate()}</div>
                        <div className="x-small text-muted">{t(a.status)}</div>
                        <div className="x-small">{a.hours || a.working_hours || 0}h</div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-outline-primary btn-sm w-100 rounded-3">{t('view_full_history')}</button>
                </>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_attendance_data')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('training_records')}</h5>
              {training.length > 0 ? training.slice(0, 3).map((tr, i) => (
                <div key={i} className={`p-2 rounded-3 mb-2 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                  <div className="small fw-bold">{tr.name || tr.course_name}</div>
                  <div className="x-small text-muted">{tr.date || tr.completion_date}</div>
                  <span className={`badge rounded-pill ${tr.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'}`}>{tr.status}</span>
                </div>
              )) : (
                <div className="text-center py-4 text-muted small">{t('no_training')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('recent_payslips')}</h5>
              {payslips.length > 0 ? payslips.slice(0, 3).map((ps, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1" style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faFilePdf} className="text-danger" />
                    <div><div className="small fw-bold">{ps.month} {ps.year}</div><div className="x-small text-muted">${ps.net_salary}</div></div>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faDownload} /></button>
                </div>
              )) : (
                <div className="text-center py-4 text-muted small">{t('no_payslips')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('tax_documents')}</h5>
              {taxDocs.length > 0 ? taxDocs.slice(0, 2).map((td, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded-3 mb-1" style={{ backgroundColor: isDark ? '#1e293b' : '#f8f9fa' }}>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faFilePdf} className="text-danger" />
                    <div><div className="small fw-bold">{td.name}</div><div className="x-small text-muted">{td.year}</div></div>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faDownload} /></button>
                </div>
              )) : (
                <div className="text-center py-4 text-muted small">{t('no_tax_documents')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLeaveModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('apply_leave')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowLeaveModal(false)}></button>
              </div>
              <form onSubmit={handleApplyLeave}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('leave_type')}</label>
                      <select className="form-select rounded-3" value={leaveForm.leave_type} onChange={e => setLeaveForm({ ...leaveForm, leave_type: e.target.value })}>
                        {['Annual', 'Sick', 'Casual', 'Maternity', 'Paternity', 'Emergency', 'Unpaid'].map(lt => <option key={lt} value={lt}>{lt}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('start_date')}</label>
                      <input type="date" className="form-control rounded-3" value={leaveForm.start_date} onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('end_date')}</label>
                      <input type="date" className="form-control rounded-3" value={leaveForm.end_date} onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowLeaveModal(false)}>{t('cancel')}</button>
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

export default EmployeePortal;
