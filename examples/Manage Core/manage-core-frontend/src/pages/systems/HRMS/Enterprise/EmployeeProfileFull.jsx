import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faPhone, faMapMarkerAlt, faBirthdayCake, faVenusMars,
  faBriefcase, faBuilding, faCalendarAlt, faClock, faPlaneDeparture,
  faMoneyBillWave, faCoins, faLaptop, faFileAlt, faGraduationCap,
  faStar, faHistory, faShieldAlt, faEdit, faDownload, faUserCheck,
  faChartBar, faCheckCircle, faTimes, faEye, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getEmployeeProfile, updateEmployeeProfile, getEmployeeTrainingRecords, listPayslips } from '../../../../api/hrms';
import client from '../../../../api/client';
import { MetricCard } from '../../../../components/common/UI/Cards';

const EmployeeProfileFull = () => {
  const { t } = useTranslation();
  const { theme, addNotification, currentUser } = useApp();
  const isDark = theme === 'dark';
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [training, setTraining] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const userId = currentUser?.id || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prof, att, lv, ps, tr] = await Promise.all([
          getEmployeeProfile(userId),
          client.get(`/attendance?user_id=${userId}`),
          client.get(`/leaves?user_id=${userId}`),
          listPayslips({ user_id: userId }),
          getEmployeeTrainingRecords(userId)
        ]);
        setProfile(prof);
        setAttendance(Array.isArray(att.data) ? att.data : []);
        setLeaves(Array.isArray(lv.data) ? lv.data : []);
        setPayslips(Array.isArray(ps) ? ps : []);
        setTraining(Array.isArray(tr) ? tr : []);
      } catch (err) {
        setError(err.message);
        addNotification(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleEdit = () => {
    setEditForm({ ...profile });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateEmployeeProfile(userId, editForm);
      setProfile(updated);
      addNotification(t('profile_updated'), 'success');
      setEditing(false);
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const formatValue = (val) => val || '-';

  const tabs = [
    { key: 'personal', label: t('personal_info'), icon: faUser },
    { key: 'employment', label: t('employment'), icon: faBriefcase },
    { key: 'attendance', label: t('attendance'), icon: faClock },
    { key: 'leave', label: t('leave'), icon: faPlaneDeparture },
    { key: 'payroll', label: t('payroll'), icon: faMoneyBillWave },
    { key: 'training', label: t('training'), icon: faGraduationCap },
    { key: 'timeline', label: t('timeline'), icon: faHistory },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <p className="text-muted">{t('failed_to_load')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 80, height: 80, fontSize: 32 }}>
                {profile?.name?.charAt(0) || '?'}
              </div>
            </div>
            <div className="col">
              <h4 className="fw-bold mb-1">{profile?.name || t('employee')}</h4>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <span className="small text-muted"><FontAwesomeIcon icon={faEnvelope} className="me-1" />{formatValue(profile?.email)}</span>
                <span className="small text-muted"><FontAwesomeIcon icon={faPhone} className="me-1" />{formatValue(profile?.phone)}</span>
                <span className="small text-muted"><FontAwesomeIcon icon={faBuilding} className="me-1" />{formatValue(profile?.department)}</span>
                <span className="small text-muted"><FontAwesomeIcon icon={faBriefcase} className="me-1" />{formatValue(profile?.designation)}</span>
              </div>
              <div>
                <span className={`badge rounded-pill ${profile?.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{profile?.status || 'active'}</span>
                <span className="badge bg-primary-subtle text-primary rounded-pill ms-2">{profile?.emp_id || '-'}</span>
              </div>
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary rounded-3" onClick={handleEdit}><FontAwesomeIcon icon={faEdit} className="me-1" />{t('edit')}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex overflow-auto gap-2 mb-4 pb-2">
        {tabs.map(tab => (
          <button key={tab.key} className={`btn btn-sm rounded-pill px-3 flex-shrink-0 ${activeTab === tab.key ? 'btn-primary' : isDark ? 'btn-outline-secondary' : 'btn-outline-secondary'}`} onClick={() => setActiveTab(tab.key)}>
            <FontAwesomeIcon icon={tab.icon} className="me-1" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'personal' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">{t('personal_information')}</h5>
            {editing ? (
              <form onSubmit={handleSave}>
                <div className="row g-4">
                  {['name', 'email', 'phone', 'address', 'dob', 'gender'].map(f => (
                    <div key={f} className="col-md-6">
                      <label className="form-label small fw-bold">{t(f)}</label>
                      <input type="text" className="form-control rounded-3" value={editForm[f] || ''} onChange={e => setEditForm({ ...editForm, [f]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('save')}</button>
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setEditing(false)}>{t('cancel')}</button>
                </div>
              </form>
            ) : (
              <div className="row g-4">
                {[
                  { label: t('full_name'), value: profile?.name, icon: faUser },
                  { label: t('email'), value: profile?.email, icon: faEnvelope },
                  { label: t('phone'), value: profile?.phone, icon: faPhone },
                  { label: t('address'), value: profile?.address, icon: faMapMarkerAlt },
                  { label: t('date_of_birth'), value: profile?.dob, icon: faBirthdayCake },
                  { label: t('gender'), value: profile?.gender, icon: faVenusMars },
                ].map((f, i) => (
                  <div key={i} className="col-md-6">
                    <div className={`p-3 rounded-3 d-flex align-items-center gap-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                      <FontAwesomeIcon icon={f.icon} className="text-primary" />
                      <div><div className="x-small text-muted">{f.label}</div><div className="small fw-bold">{formatValue(f.value)}</div></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'employment' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">{t('employment_information')}</h5>
            <div className="row g-4">
              {[
                { label: t('employee_code'), value: profile?.emp_id, icon: faUserCheck },
                { label: t('department'), value: profile?.department, icon: faBuilding },
                { label: t('designation'), value: profile?.designation, icon: faBriefcase },
                { label: t('joining_date'), value: profile?.joining_date, icon: faCalendarAlt },
                { label: t('employment_type'), value: profile?.employment_type, icon: faClock },
                { label: t('manager'), value: profile?.manager_name || profile?.manager, icon: faUser },
              ].map((f, i) => (
                <div key={i} className="col-md-6">
                  <div className={`p-3 rounded-3 d-flex align-items-center gap-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                    <FontAwesomeIcon icon={f.icon} className="text-primary" />
                    <div><div className="x-small text-muted">{f.label}</div><div className="small fw-bold">{formatValue(f.value)}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">{t('attendance_history')}</h5>
            {attendance.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead><tr className="small text-muted"><th>{t('date')}</th><th>{t('status')}</th><th>{t('check_in')}</th><th>{t('check_out')}</th><th>{t('hours')}</th></tr></thead>
                  <tbody>
                    {attendance.slice(0, 10).map((a, i) => (
                      <tr key={a.id || i}>
                        <td className="small">{a.date ? new Date(a.date).toLocaleDateString() : '-'}</td>
                        <td><span className={`badge rounded-pill ${a.status === 'present' ? 'bg-success-subtle text-success' : a.status === 'late' ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'}`}>{a.status || '-'}</span></td>
                        <td className="small">{a.clock_in || a.check_in || '-'}</td>
                        <td className="small">{a.clock_out || a.check_out || '-'}</td>
                        <td className="small fw-bold">{a.working_hours || a.hours || '-'}</td>
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
      )}

      {activeTab === 'leave' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">{t('leave_history')}</h5>
            {leaves.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead><tr className="small text-muted"><th>{t('type')}</th><th>{t('from')}</th><th>{t('to')}</th><th>{t('days')}</th><th>{t('status')}</th></tr></thead>
                  <tbody>
                    {leaves.slice(0, 10).map((l, i) => (
                      <tr key={l.id || i}>
                        <td><span className="small fw-bold">{l.leave_type}</span></td>
                        <td className="small">{l.start_date ? new Date(l.start_date).toLocaleDateString() : '-'}</td>
                        <td className="small">{l.end_date ? new Date(l.end_date).toLocaleDateString() : '-'}</td>
                        <td className="small fw-bold">{l.total_days || l.days || '-'}</td>
                        <td><span className={`badge rounded-pill ${l.status === 'approved' ? 'bg-success-subtle text-success' : l.status === 'rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}`}>{l.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">{t('no_leave_history')}</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payroll' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">{t('payroll_history')}</h5>
            {payslips.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead><tr className="small text-muted"><th>{t('month')}</th><th>{t('gross')}</th><th>{t('deductions')}</th><th>{t('net')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                  <tbody>
                    {payslips.slice(0, 6).map((ps, i) => (
                      <tr key={ps.id || i}>
                        <td className="small fw-bold">{ps.month} {ps.year}</td>
                        <td className="small">${ps.gross_salary || ps.gross || 0}</td>
                        <td className="small text-danger">${ps.total_deductions || ps.deductions || 0}</td>
                        <td className="small fw-bold text-success">${ps.net_salary || ps.net || 0}</td>
                        <td><span className="badge bg-success-subtle text-success rounded-pill">{ps.status || 'paid'}</span></td>
                        <td><button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faDownload} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">{t('no_payroll_data')}</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">{t('training_records')}</h5>
            {training.length > 0 ? (
              <div className="row g-3">
                {training.map((tr, i) => (
                  <div key={i} className="col-md-6">
                    <div className={`p-3 rounded-3 d-flex justify-content-between ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                      <div><div className="small fw-bold">{tr.name || tr.course_name}</div><div className="x-small text-muted">{tr.date || tr.completion_date}</div></div>
                      <div className="text-end">
                        <span className={`badge rounded-pill ${tr.status === 'completed' ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'}`}>{tr.status}</span>
                        {tr.score && <div className="x-small fw-bold mt-1">{tr.score}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">{t('no_training_records')}</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-4">{t('activity_timeline')}</h5>
            <div className="text-center py-4 text-muted small">{t('no_activity')}</div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-secondary-subtle { background-color: #f1f5f9 !important; }
      `}} />
    </div>
  );
};

export default EmployeeProfileFull;
