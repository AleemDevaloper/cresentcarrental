import React, { useState, useEffect } from 'react';
import { getRecruitmentStats, listJobs, listApplications } from '../../../../api/hrms';
import { useApp } from '../../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBriefcase, 
  faUserPlus, 
  faCalendarCheck, 
  faChartLine,
  faPlus,
  faEye,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

const RecruitmentDashboard = () => {
  const { addNotification } = useApp();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, j] = await Promise.all([
          getRecruitmentStats(),
          listJobs()
        ]);
        setStats(s);
        setJobs(j);
      } catch (err) {
        addNotification("Failed to fetch recruitment data", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="recruitment-dashboard p-3 p-lg-4 animate-fade-in">
      {/* Stats row */}
      <div className="row g-4 mb-4">
        {[
          { label: 'Active Jobs', value: stats?.active_jobs || 0, icon: faBriefcase, color: 'primary' },
          { label: 'Total Applications', value: stats?.total_applications || 0, icon: faUserPlus, color: 'success' },
          { label: 'Pending Interviews', value: stats?.pending_interviews || 0, icon: faCalendarCheck, color: 'warning' },
          { label: 'Total Jobs', value: stats?.total_jobs || 0, icon: faChartLine, color: 'info' },
        ].map((stat, i) => (
          <div className="col-md-3" key={i}>
            <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className={`p-3 rounded-4 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                  <FontAwesomeIcon icon={stat.icon} size="lg" />
                </div>
                <div>
                  <h6 className="text-muted small mb-1 fw-bold">{stat.label}</h6>
                  <h4 className="mb-0 fw-bold">{stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Active Job Postings</h5>
          <button className="btn btn-primary rounded-pill btn-sm">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Post New Job
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 small border-0">Job Title</th>
                  <th className="small border-0">Department</th>
                  <th className="small border-0">Applications</th>
                  <th className="small border-0">Status</th>
                  <th className="pe-4 small border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="ps-4">
                      <div className="fw-bold small">{job.title}</div>
                      <div className="x-small text-muted">{job.employment_type} • {job.location}</div>
                    </td>
                    <td><span className="small text-muted">{job.department?.name || 'N/A'}</span></td>
                    <td><span className="badge bg-primary-subtle text-primary rounded-pill">{job.applications_count}</span></td>
                    <td>
                      <span className={`badge rounded-pill x-small ${job.status === 'Open' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button className="btn btn-sm btn-light rounded-circle text-primary" title="View Applications"><FontAwesomeIcon icon={faEye} /></button>
                        <button className="btn btn-sm btn-light rounded-circle text-info" title="Edit Job"><FontAwesomeIcon icon={faEdit} /></button>
                        <button className="btn btn-sm btn-light rounded-circle text-danger" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentDashboard;
