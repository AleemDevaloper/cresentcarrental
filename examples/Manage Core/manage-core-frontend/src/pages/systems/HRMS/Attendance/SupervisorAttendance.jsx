import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faUsers, faSignInAlt, faSignOutAlt, faCheckCircle,
  faTimesCircle, faFilter, faHistory, faClipboardCheck,
  faBell, faUserCheck, faUserClock
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listEmployees, supervisorClockIn, bulkAttendance, listAttendance } from '../../../../api/hrms';

const SupervisorAttendance = () => {
  const { t } = useTranslation();
  const { addNotification, theme, currentUser } = useApp();
  const isDark = theme === 'dark';

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [filter, setFilter] = useState('all');
  const [actionLog, setActionLog] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState([]);

  const currentUserId = currentUser?.id;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [employees, attendanceData] = await Promise.all([
        listEmployees({ reporting_manager_id: currentUserId }),
        listAttendance({ date: new Date().toISOString().split('T')[0] })
      ]);
      setTeamMembers(Array.isArray(employees) ? employees : employees?.data || []);
      setTodayAttendance(Array.isArray(attendanceData) ? attendanceData : attendanceData?.data || []);
    } catch {
      addNotification(t('Failed to load team'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [currentUserId]);

  const getMemberStatus = (memberId) => {
    return todayAttendance.find(a =>
      a.employee_id === memberId || a.user_id === memberId
    );
  };

  const isMemberCheckedIn = (memberId) => {
    const att = getMemberStatus(memberId);
    return att?.clock_in && !att?.clock_out;
  };

  const isMemberOnLeave = (memberId) => {
    const att = getMemberStatus(memberId);
    return att?.status === 'On Leave';
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedMembers);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedMembers(next);
  };

  const selectAll = () => {
    const filtered = getFilteredMembers();
    if (selectedMembers.size === filtered.length && filtered.length > 0) {
      setSelectedMembers(new Set());
    } else {
      setSelectedMembers(new Set(filtered.map(m => m.id)));
    }
  };

  const getFilteredMembers = () => {
    return teamMembers.filter(m => {
      if (filter === 'checked-in') return isMemberCheckedIn(m.id);
      if (filter === 'not-checked-in') return !isMemberCheckedIn(m.id) && !isMemberOnLeave(m.id);
      if (filter === 'on-leave') return isMemberOnLeave(m.id);
      return true;
    });
  };

  const handleBulkCheckIn = async () => {
    if (selectedMembers.size === 0) return;
    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await supervisorClockIn({
        user_ids: [...selectedMembers],
        date: today,
        status: 'Present'
      });
      addNotification(t('Bulk check-in completed'), 'success');
      setActionLog(prev => [{ action: 'Bulk Check-In', members: selectedMembers.size, time: new Date().toLocaleTimeString() }, ...prev]);
      setSelectedMembers(new Set());
      await fetchData();
    } catch (err) {
      addNotification(err?.message || t('Bulk check-in failed'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkCheckOut = async () => {
    if (selectedMembers.size === 0) return;
    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await supervisorClockIn({
        user_ids: [...selectedMembers],
        date: today,
        status: 'Checked Out'
      });
      addNotification(t('Bulk check-out completed'), 'success');
      setActionLog(prev => [{ action: 'Bulk Check-Out', members: selectedMembers.size, time: new Date().toLocaleTimeString() }, ...prev]);
      setSelectedMembers(new Set());
      await fetchData();
    } catch (err) {
      addNotification(err?.message || t('Bulk check-out failed'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIndividualCheckIn = async (userId) => {
    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await supervisorClockIn({
        user_ids: [userId],
        date: today,
        status: 'Present'
      });
      addNotification(t('Check-in completed'), 'success');
      await fetchData();
    } catch (err) {
      addNotification(err?.message || t('Check-in failed'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIndividualCheckOut = async (userId) => {
    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await supervisorClockIn({
        user_ids: [userId],
        date: today,
        status: 'Checked Out'
      });
      addNotification(t('Check-out completed'), 'success');
      await fetchData();
    } catch (err) {
      addNotification(err?.message || t('Check-out failed'), 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMembers = getFilteredMembers();
  const checkedInCount = teamMembers.filter(m => isMemberCheckedIn(m.id)).length;
  const notCheckedInCount = teamMembers.filter(m => !isMemberCheckedIn(m.id) && !isMemberOnLeave(m.id)).length;
  const onLeaveCount = teamMembers.filter(m => isMemberOnLeave(m.id)).length;

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />{t('Supervisor Attendance')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Manage team attendance')}</p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge bg-warning rounded-pill d-flex align-items-center gap-1 px-3 py-2">
            <FontAwesomeIcon icon={faBell} />{t('Not In')}: {notCheckedInCount}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Team', value: teamMembers.length, icon: faUsers, color: 'primary' },
          { label: 'Checked In', value: checkedInCount, icon: faUserCheck, color: 'success' },
          { label: 'Not Checked In', value: notCheckedInCount, icon: faUserClock, color: 'warning' },
          { label: 'On Leave', value: onLeaveCount, icon: faClipboardCheck, color: 'info' },
        ].map((stat, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-3 text-center">
                <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color} fs-4 mb-2`} />
                <p className="h4 fw-bold mb-0">{stat.value}</p>
                <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t(stat.label)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {['all', 'checked-in', 'not-checked-in', 'on-leave'].map(f => (
          <button key={f} className={`btn btn-sm rounded-3 ${filter === f ? 'btn-primary' : isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(f)}>
            {t(f === 'all' ? 'All' : f === 'checked-in' ? 'Checked In' : f === 'not-checked-in' ? 'Not Checked In' : 'On Leave')}
          </button>
        ))}
        <div className="ms-auto d-flex gap-2">
          <button className="btn btn-sm btn-outline-success rounded-3" onClick={selectAll}>
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            {selectedMembers.size === filteredMembers.length && filteredMembers.length > 0 ? t('Deselect All') : t('Select All')}
          </button>
          <button className="btn btn-sm btn-success rounded-3" disabled={selectedMembers.size === 0 || submitting} onClick={handleBulkCheckIn}>
            <FontAwesomeIcon icon={faSignInAlt} className="me-1" />{t('Bulk Check-In')}
          </button>
          <button className="btn btn-sm btn-danger rounded-3" disabled={selectedMembers.size === 0 || submitting} onClick={handleBulkCheckOut}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />{t('Bulk Check-Out')}
          </button>
        </div>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-3 mb-4">
          {filteredMembers.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">{t('No team members found')}</div>
          ) : filteredMembers.map(member => {
            const checkedIn = isMemberCheckedIn(member.id);
            const onLeave = isMemberOnLeave(member.id);
            const memberAtt = getMemberStatus(member.id);
            return (
              <div key={member.id} className="col-md-6 col-lg-4">
                <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''} ${selectedMembers.has(member.id) ? 'border border-primary' : ''}`}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center gap-3">
                      <input type="checkbox" className="form-check-input" checked={selectedMembers.has(member.id)}
                        onChange={() => toggleSelect(member.id)} style={{ width: 20, height: 20 }} />
                      <div className={`p-2 rounded-circle ${checkedIn ? 'bg-success-subtle' : 'bg-light'}`}>
                        <FontAwesomeIcon icon={faUser} className={checkedIn ? 'text-success' : 'text-muted'} />
                      </div>
                      <div className="flex-grow-1">
                        <p className="fw-bold small mb-0">{member.first_name} {member.last_name}</p>
                        <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{member.designation || member.job_title}</p>
                      </div>
                      <div>
                        {checkedIn ? (
                          <span className="badge bg-success-subtle text-success rounded-pill x-small">{t('In')}: {memberAtt?.clock_in}</span>
                        ) : onLeave ? (
                          <span className="badge bg-info-subtle text-info rounded-pill x-small">{t('On Leave')}</span>
                        ) : (
                          <span className="badge bg-warning-subtle text-warning rounded-pill x-small">{t('Not In')}</span>
                        )}
                      </div>
                    </div>
                    {/* Individual Actions */}
                    <div className="d-flex gap-1 mt-3">
                      <button className="btn btn-sm btn-outline-success flex-grow-1 rounded-3"
                        disabled={checkedIn || onLeave || submitting}
                        onClick={() => handleIndividualCheckIn(member.id)}>
                        <FontAwesomeIcon icon={faSignInAlt} className="me-1" />{t('Check In')}
                      </button>
                      <button className="btn btn-sm btn-outline-danger flex-grow-1 rounded-3"
                        disabled={!checkedIn || submitting}
                        onClick={() => handleIndividualCheckOut(member.id)}>
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />{t('Check Out')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Log */}
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
        <div className={`card-header bg-transparent border-0 py-3`}>
          <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-info" />{t('Supervisor Action Log')}</h6>
        </div>
        <div className="table-responsive">
          <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr>
                <th className="ps-4">{t('Time')}</th>
                <th>{t('Action')}</th>
                <th>{t('Members')}</th>
                <th className="pe-4">{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {actionLog.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-muted">{t('No actions recorded')}</td></tr>
              ) : actionLog.map((log, i) => (
                <tr key={i}>
                  <td className="ps-4">{log.time}</td>
                  <td>{log.action}</td>
                  <td>{log.members} {t('members')}</td>
                  <td className="pe-4"><FontAwesomeIcon icon={faCheckCircle} className="text-success" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupervisorAttendance;
