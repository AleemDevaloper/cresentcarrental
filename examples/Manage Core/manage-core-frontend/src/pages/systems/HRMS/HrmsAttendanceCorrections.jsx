import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, faClock, faExclamationTriangle, faTimesCircle,
  faSliders, faFilter, faFileExcel, faFilePdf, faSearch,
  faCalendarDays, faArrowLeft, faUpload, faCircleCheck,
  faTrashCan, faHistory, faCheck, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
  listAttendanceCorrections, 
  createAttendanceCorrection, 
  updateAttendanceCorrectionStatus, 
  deleteAttendanceCorrection,
  listSites
} from '../../../api/hrms';
import { useApp } from '../../../hooks/useApp';

const HrmsAttendanceCorrections = () => {
  const { theme, setActiveTab, addNotification, currentUser } = useApp();
  const [view, setView] = useState('list'); // list or new_request
  const [requests, setRequests] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  // Filters state
  const [filters, setFilters] = useState({
    employee_id: '',
    type: '',
    status: '',
    from_date: '',
    to_date: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    employee_id: '',
    type: 'Missing Check-In',
    work_date: '',
    requested_check_in: '',
    requested_check_out: '',
    site_id: '',
    reason: '',
    proof: null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqData, sitesData] = await Promise.all([
        listAttendanceCorrections(filters),
        listSites()
      ]);
      setRequests(reqData || []);
      setSites(sitesData || []);
    } catch (err) {
      addNotification("Failed to load corrections", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      employee_id: '',
      type: '',
      status: '',
      from_date: '',
      to_date: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.reason) {
      addNotification("Reason is required", "warning");
      return;
    }
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) submitData.append(key, val);
      });
      await createAttendanceCorrection(submitData);
      addNotification("Request submitted successfully", "success");
      setView('list');
      fetchData();
    } catch (err) {
      addNotification("Failed to submit request", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateAttendanceCorrectionStatus(id, 'approved');
      addNotification("Request approved", "success");
      fetchData();
    } catch (err) {
      addNotification("Failed to update status", "danger");
    }
  };

  const handleReject = async (id) => {
    try {
      await updateAttendanceCorrectionStatus(id, 'rejected');
      addNotification("Request rejected", "success");
      fetchData();
    } catch (err) {
      addNotification("Failed to update status", "danger");
    }
  };

  const hrmsTabs = [
    { id: 'hrms_overview', label: 'HR Dashboard' },
    { id: 'hrms_health_dashboard', label: 'HRMS Health Dashboard' },
    { id: 'hrms_attendance', label: 'My Attendance' },
    { id: 'hrms_attendance_records', label: 'Attendance Records' },
    { id: 'hrms_attendance_correction', label: 'Attendance Corrections' },
    { id: 'hrms_outdoor_duty', label: 'Outdoor Duty' },
    { id: 'hrms_supervisor_attendance', label: 'Supervisor Attendance' },
    { id: 'hrms_leave_approval', label: 'Leave Requests' },
    { id: 'hrms_physical_leave_entry', label: 'Physical Approved Leave Entry' },
    { id: 'hrms_leave_quota', label: 'My Leave Balance' },
    { id: 'notifications', label: 'Notification Inbox' },
  ];

  return (
    <div className={`attendance-corrections p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      
      {/* 1. Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-4 rounded-4 text-white shadow-sm"
           style={{ background: 'linear-gradient(135deg, #103B73 0%, #2B5BFF 50%, #117A7A 100%)', height: '150px', borderRadius: '20px' }}>
        <div>
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-1 rounded-pill small">
            APPROVAL WORKFLOW
          </span>
          <h3 className="fw-bold mb-1">{view === 'list' ? 'Correction & manual attendance requests' : 'Submit attendance correction'}</h3>
          <p className="mb-0 text-white-50 x-small">
            {view === 'list' 
              ? 'Review missing punch, manual attendance and attendance edit requests through a cleaner approval-focused interface.'
              : 'Request missing check-in, missing check-out, manual attendance or attendance edit without changing backend functionality.'}
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          {view === 'list' ? (
            <>
              <button className="btn btn-light btn-sm rounded-3 px-3 py-2 fw-bold text-primary" onClick={() => setView('new_request')}>
                New Request
              </button>
              <button className="btn btn-outline-light btn-sm rounded-3 px-3 py-2 fw-bold" onClick={() => setActiveTab('hrms_attendance_records')}>
                Attendance Register
              </button>
            </>
          ) : (
            <button className="btn btn-light btn-sm rounded-3 px-3 py-2 fw-bold text-primary" onClick={() => setView('list')}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Requests
            </button>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3 overflow-auto" style={{ whiteSpace: 'nowrap' }}>
        {hrmsTabs.map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${tab.id === 'hrms_attendance_correction' ? 'btn-primary shadow-sm' : 'btn-light'} rounded-pill px-4 py-2 border transition`}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontWeight: '500' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <>
          {/* Dashboard KPI Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <KPICard title="Total Requests" value={requests.length} color="blue" subText="Matching Current Filters" />
            </div>
            <div className="col-md-3">
              <KPICard title="Pending on Page" value={requests.filter(r => r.status === 'Pending' || r.status === 'pending').length} color="yellow" subText="Needs Review" />
            </div>
            <div className="col-md-3">
              <KPICard title="Approved on Page" value={requests.filter(r => r.status === 'Approved' || r.status === 'approved').length} color="green" subText="Applied Requests" />
            </div>
            <div className="col-md-3">
              <KPICard title="Rejected on Page" value={requests.filter(r => r.status === 'Rejected' || r.status === 'rejected').length} color="red" subText="Not Accepted" />
            </div>
          </div>

          {/* Filters Panel */}
          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">FILTERS</h5>
            <p className="text-muted small mb-4">Find correction requests using filters</p>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold">Employee</label>
                <input type="text" className="form-control rounded-3" placeholder="Employee Code / ID" value={filters.employee_id} onChange={e => setFilters({...filters, employee_id: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Correction Type</label>
                <select className="form-select rounded-3" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="">All Types</option>
                  <option value="Missing Check-In">Missing Check-In</option>
                  <option value="Missing Check-Out">Missing Check-Out</option>
                  <option value="Manual Attendance">Manual Attendance</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Status</label>
                <select className="form-select rounded-3" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="">All Statuses</option>
                   <option value="pending">Pending</option>
                   <option value="approved">Approved</option>
                   <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">From Date</label>
                <input type="date" className="form-control rounded-3" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
              </div>
            </div>
            <div className="d-flex justify-content-start gap-2 mt-4">
              <button className="btn btn-primary rounded-3 px-4" onClick={handleApplyFilters}>Apply Filters</button>
              <button className="btn btn-outline-secondary rounded-3 px-4" onClick={handleResetFilters}>Reset</button>
            </div>
          </div>

          {/* Request Queue Register */}
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">REQUEST QUEUE</h5>
                <p className="text-muted small mb-0">Attendance correction approval list</p>
              </div>
              <span className="badge bg-warning-subtle text-warning border px-3 py-2 small">
                Reviewer Access Enabled
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Requested Time</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="fs-1 text-muted opacity-50 mb-3" />
                        <h6 className="fw-bold">No attendance correction requests found.</h6>
                        <p className="text-muted small">Adjust filters or create a new correction request.</p>
                      </td>
                    </tr>
                  ) : (
                    requests.map(row => (
                      <tr key={row.id}>
                        <td>{row.work_date || row.date}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                              {row.user?.name?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <div className="small fw-bold">{row.user?.name || 'N/A'}</div>
                              <div className="x-small text-muted">ID: {row.user_id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border rounded-pill x-small">
                            {row.type}
                          </span>
                        </td>
                        <td>
                          <div className="small fw-bold">In: {row.requested_check_in || '--'}</div>
                          <div className="x-small text-muted">Out: {row.requested_check_out || '--'}</div>
                        </td>
                        <td>
                          <span className={`badge rounded-pill bg-${row.status === 'Approved' || row.status === 'approved' ? 'success' : row.status === 'Rejected' || row.status === 'rejected' ? 'danger' : 'warning'}-subtle text-${row.status === 'Approved' || row.status === 'approved' ? 'success' : row.status === 'Rejected' || row.status === 'rejected' ? 'danger' : 'warning'} border`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="small">{row.requested_by_name || 'Self'}</td>
                        <td>
                          {(row.status === 'Pending' || row.status === 'pending') && (
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-success-subtle text-success border" onClick={() => handleApprove(row.id)}>
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                              <button className="btn btn-sm btn-danger-subtle text-danger border" onClick={() => handleReject(row.id)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* PAGE 2 — New Request Form Layout */
        <div className="row g-4">
          <div className="col-lg-8">
            <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
              <h5 className="fw-bold mb-1">REQUEST DETAILS</h5>
              <p className="text-muted small mb-4">Correction Information</p>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Employee</label>
                    <input type="text" className="form-control rounded-3" placeholder="Employee ID" required value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Request Type</label>
                    <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Missing Check-In">Missing Check-In</option>
                      <option value="Missing Check-Out">Missing Check-Out</option>
                      <option value="Manual Attendance">Manual Attendance</option>
                      <option value="Attendance Edit">Attendance Edit</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Work Date</label>
                    <input type="date" className="form-control rounded-3" required value={formData.work_date} onChange={e => setFormData({...formData, work_date: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Requested Check-In</label>
                    <input type="time" className="form-control rounded-3" value={formData.requested_check_in} onChange={e => setFormData({...formData, requested_check_in: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Requested Check-Out</label>
                    <input type="time" className="form-control rounded-3" value={formData.requested_check_out} onChange={e => setFormData({...formData, requested_check_out: e.target.value})} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Proof Attachment</label>
                    <div className="border border-dashed p-3 text-center rounded-3">
                      <FontAwesomeIcon icon={faUpload} className="text-muted mb-2 fs-4" />
                      <div className="small text-muted">Upload scan or screenshot (PDF, JPG, PNG)</div>
                      <input type="file" className="form-control form-control-sm mt-2" onChange={e => setFormData({...formData, proof: e.target.files[0]})} />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Reason</label>
                    <textarea className="form-control rounded-3" rows="4" placeholder="Explain the discrepancy..." required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary rounded-3 px-4">Submit Request</button>
                  <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setView('list')}>Cancel</button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Workflow Panel */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px', borderRadius: '18px' }}>
              <h5 className="fw-bold mb-1">WORKFLOW</h5>
              <p className="text-muted small mb-4">What happens next?</p>
              <div className="d-flex flex-column gap-3">
                <TimelineStep step="1" title="Draft" desc="Fill required details" color="success" />
                <TimelineStep step="2" title="Submit" desc="Request goes into approval queue" color="warning" />
                <TimelineStep step="3" title="Review" desc="Authorized reviewer approves or rejects" color="secondary" />
                <TimelineStep step="4" title="Apply" desc="Approved request updates attendance automatically" color="primary" />
              </div>
              <div className="p-3 bg-primary-subtle text-primary rounded-3 mt-4 small">
                No backend workflow logic is changed in this UI phase.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({ title, value, color, subText }) => {
  const accentColors = {
    blue: 'primary',
    yellow: 'warning',
    green: 'success',
    red: 'danger'
  };
  return (
    <div className="card border-0 shadow-sm h-100 p-4" style={{ borderRadius: '18px' }}>
      <div className="text-muted small fw-bold text-uppercase mb-1">{title}</div>
      <div className={`h2 fw-bold mb-1 text-${accentColors[color]}`}>{value}</div>
      <div className="text-muted x-small">{subText}</div>
    </div>
  );
};

const TimelineStep = ({ step, title, desc, color }) => {
  return (
    <div className="d-flex gap-3 align-items-start">
      <div className={`rounded-circle bg-${color} text-white d-flex align-items-center justify-content-center fw-bold`} style={{ width: '28px', height: '28px', flexShrink: 0 }}>
        {step}
      </div>
      <div>
        <div className="small fw-bold">{title}</div>
        <div className="x-small text-muted">{desc}</div>
      </div>
    </div>
  );
};

export default HrmsAttendanceCorrections;
