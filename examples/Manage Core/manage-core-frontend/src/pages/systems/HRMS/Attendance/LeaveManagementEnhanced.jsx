import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUmbrellaBeach, faPlus, faHistory, faChartBar,
  faChartLine, faBuilding, faPaperclip, faSave, faCalendarAlt,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import {
  getLeaveTypes, listLeaves, getLeaveBalances,
  getLeaveCalendarData, getLeaveAnalytics, createLeave
} from '../../../../api/hrms';

const LeaveManagementEnhanced = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: '', start_date: '', end_date: '', reason: ''
  });
  const [viewMode, setViewMode] = useState('list');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [typesRes, leavesRes, balancesRes, analyticsRes, calendarRes] = await Promise.allSettled([
        getLeaveTypes(),
        listLeaves(),
        getLeaveBalances(),
        getLeaveAnalytics(),
        getLeaveCalendarData(),
      ]);

      if (typesRes.status === 'fulfilled') {
        const types = typesRes.value;
        setLeaveTypes(Array.isArray(types) ? types : []);
      }
      if (leavesRes.status === 'fulfilled') {
        const leavesData = leavesRes.value;
        setLeaves(Array.isArray(leavesData) ? leavesData : []);
      }
      if (balancesRes.status === 'fulfilled') {
        const balData = balancesRes.value;
        setBalances(Array.isArray(balData) ? balData : []);
      }
      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value || null);
      }
      if (calendarRes.status === 'fulfilled') {
        const cal = calendarRes.value;
        setCalendarData(Array.isArray(cal) ? cal : []);
      }
    } catch (err) {
      setError(err.message);
      addNotification(err.message || t('Failed to load leave data'), 'danger');
    } finally {
      setLoading(false);
    }
  }, [addNotification, t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLeave({
        type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      });
      addNotification(t('Leave request submitted'), 'success');
      setShowForm(false);
      setFormData({ leave_type: '', start_date: '', end_date: '', reason: '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('Error submitting leave'), 'danger');
    }
  };

  const getBalanceMap = () => {
    const map = {};
    balances.forEach(b => {
      const key = b.leave_type || b.type || b.name || '';
      map[key] = { total: b.total || b.allocated || 0, used: b.used || 0 };
    });
    return map;
  };

  const balanceMap = getBalanceMap();

  const getAnalyticsUtilization = () => {
    if (!analytics) return [];
    const raw = analytics.utilization || analytics.breakdown || analytics.byType || [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') {
      return Object.entries(raw).map(([k, v]) => ({
        leave_type: k,
        used: v.used || v || 0,
        total: v.total || v.allocated || 100,
      }));
    }
    return [];
  };

  const getAnalyticsTrends = () => {
    if (!analytics) return [];
    return analytics.trends || analytics.monthly || analytics.monthlyTrends || [];
  };

  const getDepartmentComparison = () => {
    if (!analytics) return [];
    return analytics.departmentComparison || analytics.byDepartment || analytics.departments || [];
  };

  const utilizationData = getAnalyticsUtilization();
  const trendsData = getAnalyticsTrends();
  const deptComparison = getDepartmentComparison();

  const displayTypes = leaveTypes.length > 0
    ? leaveTypes.slice(0, 8)
    : [];

  if (loading && leaves.length === 0 && displayTypes.length === 0) {
    return (
      <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  if (error && leaves.length === 0 && displayTypes.length === 0) {
    return (
      <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
        <div className="text-center py-5">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('Retry')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faUmbrellaBeach} className="me-2 text-primary" />{t('Leave Management')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Complete leave platform')}</p>
        </div>
        <div className="d-flex gap-2">
          <button className={`btn btn-sm rounded-3 ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('list')}>
            <FontAwesomeIcon icon={faHistory} className="me-1" />{t('List')}
          </button>
          <button className={`btn btn-sm rounded-3 ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('calendar')}>
            <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />{t('Calendar')}
          </button>
          <button className="btn btn-primary rounded-3" onClick={() => {
            const lt = leaveTypes.length > 0
              ? (leaveTypes[0]?.name || leaveTypes[0]?.leave_type || leaveTypes[0]?.type || '')
              : '';
            setFormData(prev => ({ ...prev, leave_type: lt }));
            setShowForm(true);
          }}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />{t('New Leave Request')}
          </button>
        </div>
      </div>

      {displayTypes.length === 0 && balances.length === 0 ? (
        <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
          <div className="card-body p-4 text-center py-5">
            <FontAwesomeIcon icon={faUmbrellaBeach} className="text-muted fs-1 mb-3" />
            <p className="text-muted mb-0">{t('No leave types configured')}</p>
          </div>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {(displayTypes.length > 0 ? displayTypes : Object.keys(balanceMap)).slice(0, 8).map(lt => {
            const key = typeof lt === 'string' ? lt : (lt.name || lt.leave_type || lt.type || '');
            const bal = balanceMap[key] || { total: 0, used: 0 };
            const pct = bal.total > 0 ? (bal.used / bal.total) * 100 : 0;
            return (
              <div key={key} className="col-6 col-md-4 col-lg-3">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                  <div className="card-body p-3 text-center">
                    <FontAwesomeIcon icon={faUmbrellaBeach} className="text-primary fs-4 mb-2" />
                    <p className="fw-bold small mb-1">{t(key)}</p>
                    <p className="h5 fw-bold mb-1">{bal.total - bal.used}/{bal.total}</p>
                    <div className="progress rounded-3" style={{ height: 3 }}>
                      <div className="progress-bar bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-header bg-transparent border-0 py-3 d-flex justify-content-between">
              <h6 className="fw-bold mb-0">
                <FontAwesomeIcon icon={viewMode === 'calendar' ? faCalendarAlt : faHistory} className="me-2" />
                {viewMode === 'calendar' ? t('Leave Calendar') : t('Leave Requests')}
              </h6>
            </div>

            {viewMode === 'calendar' && calendarData.length > 0 ? (
              <div className="card-body p-4">
                <div className="row g-2">
                  {calendarData.slice(0, 35).map((day, i) => (
                    <div key={i} className="col" style={{ minWidth: '12%' }}>
                      <div className={`p-2 rounded-3 text-center small ${day.leaves > 0 ? 'bg-primary text-white' : isDark ? 'bg-dark' : 'bg-light'}`}>
                        <div className="fw-bold">{day.date || i + 1}</div>
                        <div className="x-small">{day.leaves > 0 ? `${day.leaves} leaves` : '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
                  <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                    <tr>
                      <th className="ps-4">{t('Type')}</th>
                      <th>{t('From')}</th>
                      <th>{t('To')}</th>
                      <th>{t('Days')}</th>
                      <th>{t('Status')}</th>
                      <th className="pe-4">{t('Attachments')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                    ) : leaves.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-4 text-muted">{t('No leave requests found')}</td></tr>
                    ) : leaves.map(l => (
                      <tr key={l.id}>
                        <td className="ps-4"><span className="badge bg-info-subtle text-info">{t(l.leave_type || l.type || '')}</span></td>
                        <td>{l.start_date}</td>
                        <td>{l.end_date}</td>
                        <td className="fw-bold">{l.days || '-'}</td>
                        <td>
                          <span className={`badge ${l.status === 'approved' ? 'bg-success' : l.status === 'rejected' || l.status === 'declined' ? 'bg-danger' : 'bg-warning'} rounded-pill`}>
                            {t(l.status || 'pending')}
                          </span>
                        </td>
                        <td className="pe-4">{l.attachment ? <FontAwesomeIcon icon={faPaperclip} className="text-muted" /> : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartBar} className="me-2 text-primary" />{t('Leave Utilization')}</h6>
                  {utilizationData.length === 0 ? (
                    <p className="text-muted small mb-0">{t('No utilization data')}</p>
                  ) : utilizationData.slice(0, 6).map((item, i) => {
                    const key = item.leave_type || item.type || item.name || `Type ${i + 1}`;
                    const used = item.used || 0;
                    const total = item.total || item.allocated || 100;
                    const pct = total > 0 ? (used / total) * 100 : 0;
                    return (
                      <div key={key} className="d-flex align-items-center gap-2 mb-2">
                        <span className="x-small flex-grow-1">{t(key)}</span>
                        <div className="progress flex-grow-1 rounded-3" style={{ height: 4 }}>
                          <div className="progress-bar bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="x-small fw-bold">{used}/{total}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />{t('Leave Trends')}</h6>
                  {trendsData.length === 0 ? (
                    <p className="text-muted small mb-0">{t('No trend data')}</p>
                  ) : (
                    <div className="d-flex align-items-end gap-2" style={{ height: 100 }}>
                      {trendsData.slice(0, 12).map((point, i) => {
                        const val = typeof point === 'number' ? point : (point.count || point.value || point.total || 0);
                        const label = typeof point === 'object' ? (point.month || point.label || `M${i + 1}`) : point.label || `M${i + 1}`;
                        const maxVal = Math.max(...trendsData.slice(0, 12).map(p => typeof p === 'number' ? p : (p.count || p.value || p.total || 0)), 1);
                        return (
                          <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                            <div className="w-100 rounded-3 bg-primary" style={{ height: `${(val / maxVal) * 100}%` }} />
                            <span className="x-small mt-1 text-muted">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faBuilding} className="me-2 text-info" />{t('Department Comparison')}</h6>
              {deptComparison.length === 0 ? (
                <p className="text-muted small mb-0">{t('No department data')}</p>
              ) : deptComparison.slice(0, 6).map((d, i) => (
                <div key={i} className="d-flex justify-content-between mb-2 p-2 rounded-3 bg-light">
                  <span className="x-small">{d.department || d.dept || d.name || `Dept ${i + 1}`}</span>
                  <span className="x-small text-primary">{d.count || d.total || d.days || 0} {t('days')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />{t('Leave Summary')}</h6>
              <div className="h2 fw-bold text-primary mb-1">{leaves.length}</div>
              <p className={`small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t('Total leave requests')}</p>
              <hr />
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">{t('Approved')}</span>
                <span className="fw-bold text-success">{leaves.filter(l => l.status === 'approved').length}</span>
              </div>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted">{t('Pending')}</span>
                <span className="fw-bold text-warning">{leaves.filter(l => l.status === 'pending' || !l.status).length}</span>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">{t('Rejected')}</span>
                <span className="fw-bold text-danger">{leaves.filter(l => l.status === 'rejected' || l.status === 'declined').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{t('New Leave Request')}</h5>
                <button className="btn-close" onClick={() => setShowForm(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Leave Type')}</label>
                      <select className="form-select rounded-3" required
                        value={formData.leave_type}
                        onChange={e => setFormData({ ...formData, leave_type: e.target.value })}>
                        <option value="">{t('Select Type')}</option>
                        {leaveTypes.map((lt, i) => {
                          const key = lt.name || lt.leave_type || lt.type || `type_${i}`;
                          return <option key={key} value={key}>{t(key)}</option>;
                        })}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('Start Date')}</label>
                      <input type="date" className="form-control rounded-3" required
                        value={formData.start_date}
                        onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">{t('End Date')}</label>
                      <input type="date" className="form-control rounded-3" required
                        value={formData.end_date}
                        onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">{t('Reason')}</label>
                      <textarea className="form-control rounded-3" rows="3" required
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowForm(false)}>{t('Cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faSave} className="me-2" />{t('Submit Request')}
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

export default LeaveManagementEnhanced;
