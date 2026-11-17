import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase, faPlus, faCheckCircle, faTimes, faEye, faFileAlt,
  faCalendarAlt, faStar, faEnvelope, faPhone, faUpload, faDownload,
  faChartBar, faUsers, faSearch, faFilter, faChevronRight,
  faUserPlus, faClipboardList, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getRecruitmentStats, listJobs, createJob, listApplications, updateApplicationStatus } from '../../../../api/hrms';
import { MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const RecruitmentManagementPortal = () => {
  const { t } = useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [view, setView] = useState('jobs');

  const [jobForm, setJobForm] = useState({
    title: '', department: '', location: '', type: 'Full-time', min_salary: '', max_salary: '', description: '', requirements: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [j, a, s] = await Promise.all([listJobs(), listApplications(), getRecruitmentStats()]);
      setJobs(Array.isArray(j) ? j : []);
      setApplications(Array.isArray(a) ? a : []);
      setStats(s);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(jobForm);
      addNotification(t('job_created'), 'success');
      setShowJobModal(false);
      setJobForm({ title: '', department: '', location: '', type: 'Full-time', min_salary: '', max_salary: '', description: '', requirements: '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_creating_job'), 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateApplicationStatus(id, status);
      addNotification(t('status_updated'), 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || t('error_updating'), 'error');
    }
  };

  const getStatusBadge = (s) => {
    switch (s?.toLowerCase()) {
      case 'hired': return 'bg-success-subtle text-success border-success';
      case 'rejected': return 'bg-danger-subtle text-danger border-danger';
      case 'interview': case 'interviewing': return 'bg-info-subtle text-info border-info';
      case 'offer': case 'offered': return 'bg-warning-subtle text-warning border-warning';
      default: return 'bg-primary-subtle text-primary border-primary';
    }
  };

  const pipelineStages = [
    { label: t('applied'), count: stats?.applied || applications.length, color: '#4f46e5', pct: 100 },
    { label: t('screened'), count: stats?.screened || Math.round(applications.length * 0.6), color: '#6366f1', pct: 80 },
    { label: t('interview'), count: stats?.interview || Math.round(applications.length * 0.3), color: '#818cf8', pct: 60 },
    { label: t('offer'), count: stats?.offer || Math.round(applications.length * 0.15), color: '#a5b4fc', pct: 40 },
    { label: t('hired'), count: stats?.hired || Math.round(applications.length * 0.1), color: '#10b981', pct: 30 },
  ];

  const statsCards = [
    { label: t('open_positions'), value: jobs.length, icon: faBriefcase, color: '#4f46e5' },
    { label: t('total_applicants'), value: applications.length, icon: faUsers, color: '#10b981' },
    { label: t('interviews_scheduled'), value: applications.filter(a => a.status === 'interview').length, icon: faCalendarAlt, color: '#f59e0b' },
    { label: t('offers_extended'), value: applications.filter(a => a.status === 'offer').length, icon: faStar, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div><h4 className="fw-bold mb-1">{t('recruitment_management')}</h4><p className="text-muted small mb-0">{t('ats_management')}</p></div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && jobs.length === 0 && applications.length === 0) {
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
          <h4 className="fw-bold mb-1">{t('recruitment_management')}</h4>
          <p className="text-muted small mb-0">{t('ats_management')}</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4" onClick={() => setShowJobModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="me-2" /> {t('new_job')}
        </button>
      </div>

      <div className="d-flex gap-2 mb-4">
        {['jobs', 'candidates', 'analytics'].map(v => (
          <button key={v} className={`btn btn-sm rounded-pill px-3 ${view === v ? 'btn-primary' : isDark ? 'btn-outline-secondary' : 'btn-outline-secondary'}`} onClick={() => setView(v)}>
            <FontAwesomeIcon icon={v === 'jobs' ? faBriefcase : v === 'candidates' ? faUsers : faChartBar} className="me-1" /> {t(v === 'jobs' ? 'job_requisitions' : v === 'candidates' ? 'candidates' : 'analytics')}
          </button>
        ))}
      </div>

      <div className="row g-3 mb-4">
        {statsCards.map((s, i) => (
          <div key={i} className="col-md-3">
            <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
          </div>
        ))}
      </div>

      {view === 'jobs' && (
        <div className="row g-4">
          {jobs.length > 0 ? jobs.map(job => (
            <div key={job.id} className="col-md-6 col-xl-4">
              <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className={`badge rounded-pill ${job.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>{job.status || 'Active'}</span>
                    <FontAwesomeIcon icon={faEye} className="text-muted" style={{ cursor: 'pointer' }} />
                  </div>
                  <h5 className="fw-bold mb-1">{job.title}</h5>
                  <div className="small text-muted mb-3">{job.department} | {job.location}</div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="x-small text-muted">{t('applicants')}: {job.applicant_count || 0}</span>
                    <span className="x-small text-muted">{job.type}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-4 text-muted small">{t('no_jobs')}</div>
          )}
        </div>
      )}

      {view === 'candidates' && (
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-secondary' : ''}`}>
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">{t('candidate_database')}</h5>
            {applications.length > 0 ? (
              <div className="table-responsive">
                <table className="table align-middle table-hover mb-0">
                  <thead><tr className="small text-muted"><th>{t('name')}</th><th>{t('position')}</th><th>{t('email')}</th><th>{t('phone')}</th><th>{t('status')}</th><th>{t('actions')}</th></tr></thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td><div className="d-flex align-items-center gap-2"><div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: 32, height: 32, fontSize: 10 }}>{app.name?.charAt(0) || '?'}</div><span className="small fw-bold">{app.name || 'N/A'}</span></div></td>
                        <td className="small">{app.position || app.job?.title || '-'}</td>
                        <td className="small text-muted">{app.email || '-'}</td>
                        <td className="small">{app.phone || '-'}</td>
                        <td><span className={`badge border rounded-pill px-3 py-1 ${getStatusBadge(app.status)}`}>{app.status}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary rounded-3" onClick={() => handleStatusChange(app.id, 'interview')}><FontAwesomeIcon icon={faCalendarAlt} /></button>
                            <button className="btn btn-sm btn-outline-success rounded-3" onClick={() => handleStatusChange(app.id, 'offer')}><FontAwesomeIcon icon={faStar} /></button>
                            <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faEye} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-muted small">{t('no_applications')}</div>
            )}
          </div>
        </div>
      )}

      {view === 'analytics' && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">{t('hiring_funnel')}</h5>
                <div style={{ height: '300px' }}>
                  <Bar data={{
                    labels: pipelineStages.map(s => s.label),
                    datasets: [{ label: t('candidates'), data: pipelineStages.map(s => s.count), backgroundColor: pipelineStages.map(s => s.color), borderRadius: 6 }]
                  }} options={{ responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { y: { grid: { display: false } }, x: { grid: { display: false } } } }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">{t('pipeline_status')}</h5>
                {pipelineStages.map((s, i) => (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-bold">{s.label}</span>
                      <span className="small text-muted">{s.count} {t('candidates')}</span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div className="progress-bar shadow-sm" style={{ width: `${s.pct}%`, backgroundColor: s.color, borderRadius: 10 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showJobModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className={`modal-content border-0 shadow rounded-4 ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">{t('create_job')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowJobModal(false)}></button>
              </div>
              <form onSubmit={handleCreateJob}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('job_title')}</label>
                      <input type="text" className="form-control rounded-3" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">{t('department')}</label>
                      <select className="form-select rounded-3" value={jobForm.department} onChange={e => setJobForm({ ...jobForm, department: e.target.value })}>
                        {['Engineering', 'Marketing', 'Sales', 'HR', 'Operations'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">{t('location')}</label>
                      <input type="text" className="form-control rounded-3" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">{t('type')}</label>
                      <select className="form-select rounded-3" value={jobForm.type} onChange={e => setJobForm({ ...jobForm, type: e.target.value })}>
                        {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">{t('salary_range')}</label>
                      <div className="d-flex gap-2">
                        <input type="number" className="form-control rounded-3" placeholder="Min" value={jobForm.min_salary} onChange={e => setJobForm({ ...jobForm, min_salary: e.target.value })} />
                        <input type="number" className="form-control rounded-3" placeholder="Max" value={jobForm.max_salary} onChange={e => setJobForm({ ...jobForm, max_salary: e.target.value })} />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('description')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">{t('requirements')}</label>
                      <textarea className="form-control rounded-3" rows="3" value={jobForm.requirements} onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={() => setShowJobModal(false)}>{t('cancel')}</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">{t('create')}</button>
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
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-secondary-subtle { background-color: #f1f5f9 !important; }
      `}} />
    </div>
  );
};

export default RecruitmentManagementPortal;
