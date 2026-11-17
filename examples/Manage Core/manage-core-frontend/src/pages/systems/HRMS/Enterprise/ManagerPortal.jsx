import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUserCheck, faUserSlash, faPlaneDeparture, faClipboardList,
  faCheckCircle, faTimes, faEye, faCalendarAlt, faStar, faChartBar,
  faRocket, faMoneyBillWave, faFileInvoice, faUserClock, faClock,
  faArrowUp, faArrowDown, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import {
  getManagerTeamStats, getManagerAttendance, getManagerLeaveCalendar,
  getManagerPendingApprovals, getPerformanceStats, listEmployees
} from '../../../../api/hrms';
import { MetricCard, StatCard } from '../../../../components/common/UI/Cards';

const ManagerPortal = () => {
  const { t } = useTranslation();
  const { theme, currentUser, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [teamStats, setTeamStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaveCalendar, setLeaveCalendar] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ts, att, lc, ap, perf, tm] = await Promise.all([
        getManagerTeamStats(currentUser?.id),
        getManagerAttendance(),
        getManagerLeaveCalendar(),
        getManagerPendingApprovals(),
        getPerformanceStats(),
        listEmployees()
      ]);
      setTeamStats(ts);
      setAttendance(Array.isArray(att) ? att : []);
      setLeaveCalendar(Array.isArray(lc) ? lc : []);
      setApprovals(Array.isArray(ap) ? ap : []);
      setPerformance(perf);
      setTeamMembers(Array.isArray(tm) ? tm : []);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">{t('manager_portal')}</h4>
            <p className="text-muted small mb-0">{t('team_management_dashboard')}</p>
          </div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && !teamStats) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  const teamOverviewItems = [
    { label: t('total_team'), value: teamStats?.total || 0, icon: faUsers, color: '#4f46e5' },
    { label: t('present'), value: teamStats?.present || 0, icon: faUserCheck, color: '#10b981' },
    { label: t('absent'), value: teamStats?.absent || 0, icon: faUserSlash, color: '#ef4444' },
    { label: t('on_leave'), value: teamStats?.on_leave || 0, icon: faPlaneDeparture, color: '#f59e0b' },
  ];

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-success-subtle text-success';
      case 'late': return 'bg-warning-subtle text-warning';
      case 'absent': return 'bg-danger-subtle text-danger';
      default: return 'bg-light text-muted';
    }
  };

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('manager_portal')}</h4>
          <p className="text-muted small mb-0">{t('team_management_dashboard')}</p>
        </div>
        <button className="btn btn-outline-secondary rounded-3 btn-sm" onClick={fetchData}>
          <FontAwesomeIcon icon={faSearch} className="me-1" /> {t('refresh')}
        </button>
      </div>

      <div className="row g-3 mb-4">
        {teamOverviewItems.map((item, i) => (
          <div key={i} className="col-md-3">
            <MetricCard label={item.label} value={item.value} icon={item.icon} color={item.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('team_attendance')}</h5>
              {attendance.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('employee')}</th><th>{t('status')}</th><th>{t('check_in')}</th><th>{t('check_out')}</th><th>{t('hours')}</th></tr></thead>
                    <tbody>
                      {attendance.map((emp) => (
                        <tr key={emp.id}>
                          <td><div className="small fw-bold">{emp.name || emp.user?.name}</div></td>
                          <td><span className={`badge rounded-pill ${getStatusBadge(emp.status)}`}>{t(emp.status)}</span></td>
                          <td className="small">{emp.check_in || emp.clock_in || '-'}</td>
                          <td className="small">{emp.check_out || emp.clock_out || '-'}</td>
                          <td className="small fw-bold">{emp.hours || emp.working_hours || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_attendance_data')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('leave_calendar')}</h5>
              {leaveCalendar.length > 0 ? leaveCalendar.map((ld, i) => (
                <div key={i} className={`d-flex justify-content-between align-items-center p-2 rounded-3 mb-1 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                  <div>
                    <div className="small fw-bold">{ld.name || ld.user?.name}</div>
                    <div className="x-small text-muted">{ld.start_date} - {ld.end_date}</div>
                  </div>
                  <span className="badge bg-warning-subtle text-warning rounded-pill">{ld.leave_type || ld.type}</span>
                </div>
              )) : (
                <div className="text-center py-4 text-muted small">{t('no_upcoming_leaves')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('pending_approvals')}</h5>
              {approvals.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('type')}</th><th>{t('employee')}</th><th>{t('date')}</th><th>{t('detail')}</th><th></th></tr></thead>
                    <tbody>
                      {approvals.map((a) => (
                        <tr key={a.id}>
                          <td><span className="small">{a.type}</span></td>
                          <td><span className="small fw-bold">{a.employee || a.user?.name}</span></td>
                          <td><span className="small text-muted">{a.date || a.created_at}</span></td>
                          <td><span className="small text-muted">{a.detail || a.amount || a.reason}</span></td>
                          <td>
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-success rounded-3"><FontAwesomeIcon icon={faCheckCircle} /></button>
                              <button className="btn btn-sm btn-danger rounded-3"><FontAwesomeIcon icon={faTimes} /></button>
                              <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_pending_approvals')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('team_performance')}</h5>
              {[
                { label: t('avg_productivity'), value: performance?.productivity ? `${performance.productivity}%` : 'N/A', icon: faChartBar, color: '#10b981' },
                { label: t('task_completion'), value: performance?.task_completion ? `${performance.task_completion}%` : 'N/A', icon: faClipboardList, color: '#4f46e5' },
                { label: t('attendance_rate'), value: performance?.attendance_rate ? `${performance.attendance_rate}%` : 'N/A', icon: faUserCheck, color: '#3b82f6' },
                { label: t('avg_rating'), value: performance?.avg_rating || 'N/A', icon: faStar, color: '#f59e0b' },
              ].map((p, i) => (
                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: 40, height: 40, backgroundColor: `${p.color}20`, color: p.color }}>
                    <FontAwesomeIcon icon={p.icon} />
                  </div>
                  <div>
                    <div className="h5 fw-bold mb-0">{p.value}</div>
                    <div className="x-small text-muted">{p.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('quick_actions')}</h5>
              {[
                { icon: faFileInvoice, label: t('approve_leave'), color: '#10b981' },
                { icon: faClock, label: t('approve_overtime'), color: '#f59e0b' },
                { icon: faRocket, label: t('conduct_review'), color: '#4f46e5' },
                { icon: faUsers, label: t('team_meeting'), color: '#8b5cf6' },
              ].map((a, i) => (
                <button key={i} className={`btn w-100 d-flex align-items-center gap-3 p-3 rounded-3 mb-2 ${isDark ? 'btn-dark border border-secondary' : 'btn-light'}`} style={{ color: a.color }}>
                  <FontAwesomeIcon icon={a.icon} />
                  <span className="small fw-bold">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
      `}} />
    </div>
  );
};

export default ManagerPortal;
