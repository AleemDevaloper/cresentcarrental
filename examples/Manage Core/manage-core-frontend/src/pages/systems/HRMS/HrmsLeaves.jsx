import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faCalendarXmark, faClock, faCircleCheck, 
  faCircleXmark, faPaperPlane, faEllipsisVertical, faArrowLeft,
  faUpload, faPrint, faFilePdf, faFileExcel, faSliders, faSearch,
  faUserSlash, faBuilding, faExclamationTriangle, faListCheck,
  faTrashCan, faHistory, faCheck, faTimes, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { listLeaves, createLeave } from '../../../api/hrms';
import { useApp } from '../../../hooks/useApp';

const HrmsLeaves = () => {
  const { theme, setActiveTab, addNotification, currentUser } = useApp();
  const [view, setView] = useState('dashboard'); // dashboard, apply, details
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  // Filters state
  const [filters, setFilters] = useState({
    user_id: '',
    type: '',
    status: '',
    start_date: '',
    end_date: '',
  });

  // Apply form state
  const [formData, setFormData] = useState({
    user_id: '',
    type: 'Annual',
    start_date: '',
    end_date: '',
    duration_type: 'Full Day',
    session: 'Morning',
    backup_user_id: '',
    contact_number: '',
    reason: '',
    handover_notes: '',
    proof: null
  });

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await listLeaves(filters);
      setLeaves(data || []);
    } catch (err) {
      addNotification("Failed to fetch leaves", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filters]);

  const handleApplyFilters = () => {
    fetchLeaves();
  };

  const handleResetFilters = () => {
    setFilters({
      user_id: '',
      type: '',
      status: '',
      start_date: '',
      end_date: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.start_date || !formData.end_date || !formData.reason) {
      addNotification("Please fill all required fields", "warning");
      return;
    }
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) submitData.append(key, val);
      });
      await createLeave(submitData);
      addNotification("Leave request submitted successfully", "success");
      setView('dashboard');
      fetchLeaves();
      setFormData({
        user_id: '',
        type: 'Annual',
        start_date: '',
        end_date: '',
        duration_type: 'Full Day',
        session: 'Morning',
        backup_user_id: '',
        contact_number: '',
        reason: '',
        handover_notes: '',
        proof: null
      });
    } catch (err) {
      addNotification("Error submitting request", "danger");
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e - s);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const handleCancelRequest = (id) => {
    addNotification("Leave request cancelled", "info");
    setView('dashboard');
    fetchLeaves();
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
    <div className={`leaves-container p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      

      {view === 'dashboard' ? (
        <>
          {/* KPI Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <KPICard title="Total Requests" value={leaves.length} color="blue" subText="Matching Current Filters" />
            </div>
            <div className="col-md-3">
              <KPICard title="Pending on Page" value={leaves.filter(l => l.status === 'Pending').length} color="yellow" subText="Awaiting Approval" />
            </div>
            <div className="col-md-3">
              <KPICard title="Approved on Page" value={leaves.filter(l => l.status === 'Approved').length} color="green" subText="Approved or Partially Approved" />
            </div>
            <div className="col-md-3">
              <KPICard title="Requested Days" value={leaves.reduce((acc, l) => acc + calculateDays(l.start_date, l.end_date), 0)} color="lightBlue" subText="Current Result Page" />
            </div>
          </div>

          {/* Smart Filters */}
          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">Find leave requests</h5>
            <p className="text-muted small mb-4">All filters use existing backend parameters</p>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-bold">Employee</label>
                <input type="text" className="form-control rounded-3" placeholder="Employee Name / ID" value={filters.user_id} onChange={e => setFilters({...filters, user_id: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Leave Type</label>
                <select className="form-select rounded-3" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="">All Types</option>
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">Status</label>
                <select className="form-select rounded-3" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">From Date</label>
                <input type="date" className="form-control rounded-3" value={filters.start_date} onChange={e => setFilters({...filters, start_date: e.target.value})} />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-bold">To Date</label>
                <input type="date" className="form-control rounded-3" value={filters.end_date} onChange={e => setFilters({...filters, end_date: e.target.value})} />
              </div>
            </div>
            <div className="d-flex justify-content-start gap-2 mt-4">
              <button className="btn btn-primary rounded-3 px-4" onClick={handleApplyFilters}>Apply Filters</button>
              <button className="btn btn-outline-secondary rounded-3 px-4" onClick={handleResetFilters}>Reset</button>
            </div>
          </div>

          {/* Leave Request Register */}
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">LEAVE QUEUE</h5>
                <p className="text-muted small mb-0">Request Register</p>
              </div>
              <button className="btn btn-sm btn-primary rounded-3" onClick={() => setView('apply')}>
                New Leave Request
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Request No</th>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Payroll</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <FontAwesomeIcon icon={faCalendarXmark} className="fs-1 text-muted opacity-50 mb-3" />
                        <h6 className="fw-bold">No leave requests found.</h6>
                        <p className="text-muted small">Create a new leave request or adjust filters.</p>
                      </td>
                    </tr>
                  ) : (
                    leaves.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td>LR-{row.id || 100 + idx}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                              {row.user?.name?.charAt(0) || 'E'}
                            </div>
                            <div>
                              <div className="small fw-bold">{row.user?.name || 'Employee'}</div>
                              <div className="x-small text-muted">ID: {row.user_id || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary-subtle text-primary border rounded-pill x-small">
                            {row.type}
                          </span>
                        </td>
                        <td>
                          <div className="small fw-semibold">{row.start_date}</div>
                          <div className="x-small text-muted">to {row.end_date}</div>
                        </td>
                        <td>
                          {calculateDays(row.start_date, row.end_date)} Days
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success x-small rounded-pill">Paid</span>
                        </td>
                        <td>
                          <span className={`badge rounded-pill bg-${row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'}-subtle text-${row.status === 'Approved' ? 'success' : row.status === 'Rejected' ? 'danger' : 'warning'} border`}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-light border" onClick={() => { setSelectedLeave(row); setView('details'); }}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : view === 'apply' ? (
        /* PAGE 2 — Apply Leave Form */
        <div className="row g-4">
          <div className="col-lg-8">
            <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
              <h5 className="fw-bold mb-1">REQUEST DETAILS</h5>
              <p className="text-muted small mb-4">Leave Information</p>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Employee</label>
                    <input type="text" className="form-control rounded-3" placeholder="Employee ID" required value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Leave Type</label>
                    <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Annual">Annual Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Casual">Casual Leave</option>
                      <option value="Unpaid">Unpaid Leave</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">From Date</label>
                    <input type="date" className="form-control rounded-3" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">To Date</label>
                    <input type="date" className="form-control rounded-3" required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Duration Type</label>
                    <select className="form-select rounded-3" value={formData.duration_type} onChange={e => setFormData({...formData, duration_type: e.target.value})}>
                      <option value="Full Day">Full Day</option>
                      <option value="Half Day">Half Day</option>
                      <option value="Short Leave">Short Leave</option>
                    </select>
                  </div>
                  {formData.duration_type === 'Half Day' && (
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Half-Day Session</label>
                      <select className="form-select rounded-3" value={formData.session} onChange={e => setFormData({...formData, session: e.target.value})}>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                      </select>
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Backup Employee / Handover To</label>
                    <input type="text" className="form-control rounded-3" placeholder="Backup Employee ID" value={formData.backup_user_id} onChange={e => setFormData({...formData, backup_user_id: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Contact During Leave</label>
                    <input type="text" className="form-control rounded-3" placeholder="Phone Number" value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Attachment</label>
                    <input type="file" className="form-control rounded-3" onChange={e => setFormData({...formData, proof: e.target.files[0]})} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Reason</label>
                    <textarea className="form-control rounded-3" rows="3" placeholder="Reason for time off..." required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Handover Notes</label>
                    <textarea className="form-control rounded-3" rows="3" placeholder="Tasks to delegate..." value={formData.handover_notes} onChange={e => setFormData({...formData, handover_notes: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary rounded-3 px-4">Submit Leave Request</button>
                  <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setView('dashboard')}>Cancel</button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sticky Preview Panel */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px', borderRadius: '18px' }}>
              <h5 className="fw-bold mb-1">PREVIEW</h5>
              <p className="text-muted small mb-4">Request Summary</p>
              <div className="p-3 bg-light border rounded-3 mb-3">
                <div className="small fw-bold">Estimated Days: {calculateDays(formData.start_date, formData.end_date)} Days</div>
                <div className="x-small text-muted">Type: {formData.duration_type}</div>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3 small mb-4">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Final leave calculation and balance validation remain handled by existing backend service.
              </div>
              <h6 className="fw-bold mb-3">Workflow Timeline</h6>
              <div className="d-flex flex-column gap-3">
                <TimelineStep step="1" title="Draft" desc="Drafted by applicant" color="success" />
                <TimelineStep step="2" title="Submit" desc="Pending review in manager queue" color="warning" />
                <TimelineStep step="3" title="Review" desc="HR/Manager check limits and details" color="secondary" />
                <TimelineStep step="4" title="Payroll Impact" desc="Processed in monthly payroll runs" color="primary" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* PAGE 3 — Leave Request Details View */
        <div className="card border-0 shadow-sm rounded-4 p-4" style={{ borderRadius: '18px' }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Leave Request Details</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light border" onClick={() => setView('dashboard')}>
                <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
              </button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => window.print()}>
                <FontAwesomeIcon icon={faPrint} className="me-1" /> Print
              </button>
              {selectedLeave?.status === 'Pending' && (
                <button className="btn btn-sm btn-danger" onClick={() => handleCancelRequest(selectedLeave.id)}>
                  Cancel Request
                </button>
              )}
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <h6 className="fw-bold text-muted uppercase">Employee Details</h6>
              <p className="mb-1"><strong>Name:</strong> {selectedLeave?.user?.name || 'N/A'}</p>
              <p className="mb-1"><strong>ID:</strong> {selectedLeave?.user_id}</p>
              <p className="mb-0"><strong>Department:</strong> {selectedLeave?.user?.department?.name || 'Operations'}</p>
            </div>
            <div className="col-md-6">
              <h6 className="fw-bold text-muted uppercase">Leave Duration</h6>
              <p className="mb-1"><strong>Type:</strong> {selectedLeave?.type}</p>
              <p className="mb-1"><strong>Date:</strong> {selectedLeave?.start_date} to {selectedLeave?.end_date}</p>
              <p className="mb-0"><strong>Status:</strong> {selectedLeave?.status}</p>
            </div>
            <div className="col-12 border-top pt-3">
              <h6 className="fw-bold text-muted uppercase">Reason</h6>
              <p className="mb-0 bg-light p-3 rounded-3">{selectedLeave?.reason || 'No description provided'}</p>
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
    lightBlue: 'info'
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

export default HrmsLeaves;
