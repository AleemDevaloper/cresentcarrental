import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faCalendarXmark, faClock, faCircleCheck, 
  faCircleXmark, faUpload, faPrint, faFilePdf, faFileExcel, 
  faSliders, faSearch, faInfoCircle, faArrowLeft, faUserSlash,
  faBuilding, faCheck, faTimes, faFolder, faPeopleArrows
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import { listLeaves, createLeave } from '../../../api/hrms';

const HrmsPhysicalLeaveEntry = () => {
  const { theme, setActiveTab, addNotification, currentUser } = useApp();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isDark = theme === 'dark';

  // Filters state
  const [filters, setFilters] = useState({
    employee_id: '',
    type: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    employee_id: '',
    type: 'Annual Leave',
    start_date: '',
    end_date: '',
    duration_type: 'Full Day',
    session: 'Morning',
    check_in: '',
    check_out: '',
    approved_by: '',
    designation: '',
    paper_date: '',
    ref_no: '',
    backup_employee: '',
    contact: '',
    reason: '',
    handover_notes: '',
    remarks: '',
    file: null
  });

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      const data = await listLeaves(params);
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load leave entries');
      addNotification('Failed to load leave entries', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleApplyFilters = () => {
    fetchEntries();
  };

  const handleResetFilters = () => {
    setFilters({ employee_id: '', type: '' });
    fetchEntries();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.start_date || !formData.approved_by || !formData.reason) {
      addNotification("Please fill all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      const endDate = formData.end_date || formData.start_date;
      const submitData = new FormData();
      submitData.append('user_id', formData.employee_id);
      submitData.append('type', formData.type);
      submitData.append('start_date', formData.start_date);
      submitData.append('end_date', endDate);
      submitData.append('reason', formData.reason);
      submitData.append('priority', 'medium');
      submitData.append('duration_type', formData.duration_type);
      submitData.append('session', formData.session);
      submitData.append('approved_by', `${formData.approved_by} (${formData.designation || 'Manager'})`);
      submitData.append('paper_date', formData.paper_date || '');
      submitData.append('ref_no', formData.ref_no || '');
      submitData.append('backup_employee', formData.backup_employee || '');
      submitData.append('contact', formData.contact || '');
      submitData.append('handover_notes', formData.handover_notes || '');
      submitData.append('remarks', formData.remarks || '');
      if (formData.check_in) submitData.append('check_in', formData.check_in);
      if (formData.check_out) submitData.append('check_out', formData.check_out);
      if (formData.file) submitData.append('document', formData.file);

      await createLeave(submitData);
      addNotification("Physical Approved Leave submitted to backend", "success");
      setFormData({
        employee_id: '',
        type: 'Annual Leave',
        start_date: '',
        end_date: '',
        duration_type: 'Full Day',
        session: 'Morning',
        check_in: '',
        check_out: '',
        approved_by: '',
        designation: '',
        paper_date: '',
        ref_no: '',
        backup_employee: '',
        contact: '',
        reason: '',
        handover_notes: '',
        remarks: '',
        file: null
      });
      fetchEntries();
    } catch (err) {
      addNotification(err.message || 'Failed to submit leave entry', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return '1 Day';
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.abs(e - s);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return `${days} Days`;
  };

  const filteredEntries = entries.filter(row => {
    if (filters.employee_id) {
      const q = filters.employee_id.toLowerCase();
      const id = String(row.user_id || '').toLowerCase();
      const name = (row.user?.name || '').toLowerCase();
      if (!id.includes(q) && !name.includes(q)) return false;
    }
    return true;
  });

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
    <div className={`physical-leave-entry p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      
      {/* 1. Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-4 rounded-4 text-white shadow-sm"
           style={{ background: 'linear-gradient(135deg, #0B7A5A 0%, #11806A 50%, #2F6BFF 100%)', height: '170px', borderRadius: '20px' }}>
        <div>
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-1 rounded-pill small">
            RECEPTION DESK
          </span>
          <h3 className="fw-bold mb-1">Physical approved leave entry</h3>
          <p className="mb-0 text-white-50 x-small">
            Enter already-approved paper leaves safely. The request is saved directly as approved, balance is recalculated and payroll-ready status is set through existing leave logic.
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <button className="btn btn-outline-light btn-sm rounded-3 px-3 py-2 fw-bold" onClick={() => setActiveTab('hrms_leave_approval')}>
            Leave Requests
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3 overflow-auto" style={{ whiteSpace: 'nowrap' }}>
        {hrmsTabs.map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${tab.id === 'hrms_physical_leave_entry' ? 'btn-primary shadow-sm' : 'btn-light'} rounded-pill px-4 py-2 border transition`}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontWeight: '500' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Main Layout Form + Rules */}
      <div className="row g-4 mb-4">
        {/* Left Column Form */}
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <span className="badge bg-primary bg-opacity-10 text-primary mb-2 align-self-start px-2 py-1 rounded small">
              PAPER APPROVAL DETAILS
            </span>
            <h5 className="fw-bold mb-1">Create approved leave from physical paper</h5>
            <p className="text-muted small mb-4">This flow is only for leaves already approved outside the system. It does not create pending requests.</p>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Employee</label>
                  <input type="text" className="form-control rounded-3" placeholder="Active Employee ID / Code" required value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Leave Type</label>
                  <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">From Date</label>
                  <input type="date" className="form-control rounded-3" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">To Date</label>
                  <input type="date" className="form-control rounded-3" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Duration Type</label>
                  <select className="form-select rounded-3" value={formData.duration_type} onChange={e => setFormData({...formData, duration_type: e.target.value})}>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Short Leave">Short Leave</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Approved By Name</label>
                  <input type="text" className="form-control rounded-3" placeholder="Approver Name" required value={formData.approved_by} onChange={e => setFormData({...formData, approved_by: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Approver Department</label>
                  <input type="text" className="form-control rounded-3" placeholder="Department / Designation" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Paper Approval Date</label>
                  <input type="date" className="form-control rounded-3" value={formData.paper_date} onChange={e => setFormData({...formData, paper_date: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Paper Reference No.</label>
                  <input type="text" className="form-control rounded-3" placeholder="Optional Ref No" value={formData.ref_no} onChange={e => setFormData({...formData, ref_no: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Attachment / Scan</label>
                  <input type="file" className="form-control rounded-3" onChange={e => setFormData({...formData, file: e.target.files[0]})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Backup Employee / Handover To</label>
                  <input type="text" className="form-control rounded-3" placeholder="Delegation Employee ID" value={formData.backup_employee} onChange={e => setFormData({...formData, backup_employee: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Contact During Leave</label>
                  <input type="text" className="form-control rounded-3" placeholder="Emergency Phone" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Reason</label>
                  <textarea className="form-control rounded-3" rows="3" placeholder="State the reason as written on paper..." required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Reception Remarks</label>
                  <textarea className="form-control rounded-3" rows="2" placeholder="Reception verification notes, filing cabinets details..." value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})}></textarea>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary rounded-3 px-4 mt-4 w-100 py-3 shadow-sm fw-bold">
                {loading ? 'Saving...' : 'Save as Approved Physical Leave'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column Sticky Panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px', borderRadius: '18px' }}>
            <span className="badge bg-secondary bg-opacity-10 text-secondary mb-2 align-self-start px-2 py-1 rounded small">
              SAFETY RULES
            </span>
            <h5 className="fw-bold mb-1">What happens on save?</h5>
            <p className="text-muted small mb-4">Paper approval verification constraints</p>
            <div className="d-flex flex-column gap-3">
              <RuleItem label="Status" value="Pending Review" color="warning" />
              <RuleItem label="Approval Source" value="Physical Paper" color="primary" />
              <RuleItem label="Payroll Status" value="Ready" color="success" />
              <RuleItem label="Leave Balance" value="Recalculated" color="warning" />
              <RuleItem label="Overlap Check" value="Backend Validated" color="danger" />
              <RuleItem label="Finalized Payroll" value="Backend Validated" color="danger" />
            </div>
            <div className="p-3 bg-success-subtle text-success rounded-3 mt-4 small">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              Paid leave follows existing leave balance rules. Unpaid leave flows into existing payroll deduction logic.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Physical Entry Register Table */}
      <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0">PHYSICAL ENTRY REGISTER</h5>
            <p className="text-muted small mb-0">All physical leave entries entered into system</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-success">Excel</button>
            <button className="btn btn-sm btn-outline-danger">PDF</button>
          </div>
        </div>

        {/* Local Filter */}
        <div className="row g-2 align-items-center mb-4">
          <div className="col-md-4">
            <input type="text" className="form-control form-control-sm rounded-3" placeholder="Search Employee..." value={filters.employee_id} onChange={e => setFilters({...filters, employee_id: e.target.value})} />
          </div>
          <div className="col-md-4">
            <select className="form-select form-select-sm rounded-3" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
              <option value="">All Leave Types</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
            </select>
          </div>
          <div className="col-md-4 d-flex gap-1">
            <button className="btn btn-sm btn-primary flex-grow-1" onClick={handleApplyFilters} disabled={loading}>Apply</button>
            <button className="btn btn-sm btn-light border" onClick={handleResetFilters}>Reset</button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger rounded-3 small mb-3">{error}</div>
        )}

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted small text-uppercase">
                <th>Request No</th>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Paper Approval</th>
                <th>Entered By</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <FontAwesomeIcon icon={faCalendarXmark} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No physical leave entries found.</h6>
                    <p className="text-muted small">Create a new physical approved leave record to begin.</p>
                  </td>
                </tr>
              ) : (
                filteredEntries.map(row => (
                  <tr key={row.id}>
                    <td>PL-{row.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {(row.user?.name || 'E').charAt(0)}
                        </div>
                        <div>
                          <div className="small fw-bold">{row.user?.name || `Employee (${row.user_id || 'N/A'})`}</div>
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
                      <div className="small fw-bold">{row.start_date} to {row.end_date}</div>
                      <div className="x-small text-muted">{calculateDays(row.start_date, row.end_date)}</div>
                    </td>
                    <td>
                      <div className="small fw-bold">By: {row.approved_by || 'N/A'}</div>
                      <div className="x-small text-muted">Ref: {row.ref_no || 'N/A'}</div>
                    </td>
                    <td className="small text-muted">{currentUser?.name || 'System'}</td>
                    <td>
                      <span className={`badge border rounded-pill x-small ${
                        row.status === 'Approved' ? 'bg-success-subtle text-success' :
                        row.status === 'Rejected' ? 'bg-danger-subtle text-danger' :
                        'bg-warning-subtle text-warning'
                      }`}>
                        {row.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-light border">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const RuleItem = ({ label, value, color }) => {
  return (
    <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light border">
      <span className="small text-muted fw-bold">{label}</span>
      <span className={`badge bg-${color}-subtle text-${color} border rounded-pill small`}>{value}</span>
    </div>
  );
};

export default HrmsPhysicalLeaveEntry;
