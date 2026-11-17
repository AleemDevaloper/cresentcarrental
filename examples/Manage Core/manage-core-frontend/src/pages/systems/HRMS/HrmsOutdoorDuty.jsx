import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, faClock, faExclamationTriangle, faTimesCircle,
  faSliders, faFilter, faFileExcel, faFilePdf, faSearch,
  faCalendarDays, faArrowLeft, faUpload, faCircleCheck,
  faTrashCan, faHistory, faCheck, faTimes, faMapLocationDot,
  faUserSlash, faSlidersH, faChevronRight, faBuilding
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../hooks/useApp';
import {
  listOutdoorDuties,
  createOutdoorDuty,
  updateOutdoorDuty,
  deleteOutdoorDuty
} from '../../../api/hrms';

const HrmsOutdoorDuty = () => {
  const { theme, setActiveTab, addNotification, currentUser } = useApp();
  const [view, setView] = useState('list');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const isDark = theme === 'dark';

  const [filters, setFilters] = useState({
    employee_id: '',
    type: '',
    status: '',
  });

  const [formData, setFormData] = useState({
    employee_id: '',
    type: 'Outdoor Duty',
    visit_date: '',
    check_in: '',
    check_out: '',
    saved_site: '',
    one_time_location: '',
    address: '',
    latitude: '',
    longitude: '',
    allowed_radius: '100',
    count_travel: false,
    emergency_visit: false,
    purpose: '',
    description: ''
  });

  const fetchRequests = async (filterParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterParams.employee_id) params.employee_id = filterParams.employee_id;
      if (filterParams.type) params.type = filterParams.type;
      if (filterParams.status) params.status = filterParams.status;
      const data = await listOutdoorDuties(params);
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load outdoor duties:', err);
      setError(err.message || 'Failed to load outdoor duty requests');
      setRequests([]);
      addNotification(err.message || 'Failed to load outdoor duty requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApplyFilters = () => {
    fetchRequests(filters);
  };

  const handleResetFilters = () => {
    const reset = { employee_id: '', type: '', status: '' };
    setFilters(reset);
    fetchRequests();
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      type: 'Outdoor Duty',
      visit_date: '',
      check_in: '',
      check_out: '',
      saved_site: '',
      one_time_location: '',
      address: '',
      latitude: '',
      longitude: '',
      allowed_radius: '100',
      count_travel: false,
      emergency_visit: false,
      purpose: '',
      description: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id || !formData.visit_date || !formData.purpose) {
      addNotification("Please fill required fields", "warning");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const userId = currentUser?.id || currentUser?.user_id || null;
      const location = formData.one_time_location || formData.saved_site || formData.address || 'Client Site';
      const startTime = formData.visit_date && formData.check_in
        ? `${formData.visit_date}T${formData.check_in}`
        : formData.visit_date || null;
      const endTime = formData.visit_date && formData.check_out
        ? `${formData.visit_date}T${formData.check_out}`
        : null;

      const payload = {
        user_id: userId,
        date: formData.visit_date,
        purpose: formData.purpose,
        location: location,
        address: formData.address || null,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        radius: formData.allowed_radius ? String(formData.allowed_radius) : null,
        start_time: startTime,
        end_time: endTime,
        type: formData.type,
        description: formData.description || null,
        count_travel: formData.count_travel,
        emergency_visit: formData.emergency_visit,
        status: formData.emergency_visit ? 'approved' : 'pending'
      };

      await createOutdoorDuty(payload);
      addNotification("Outdoor duty request submitted successfully", "success");
      setView('list');
      resetForm();
      fetchRequests();
    } catch (err) {
      console.error('Failed to submit outdoor duty:', err);
      setError(err.message || 'Failed to submit outdoor duty request');
      addNotification(err.message || 'Failed to submit outdoor duty request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateOutdoorDuty(id, { status: 'approved' });
      addNotification("Outdoor duty request approved", "success");
      fetchRequests(filters);
    } catch (err) {
      console.error('Failed to approve outdoor duty:', err);
      addNotification(err.message || 'Failed to approve request', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await updateOutdoorDuty(id, { status: 'rejected' });
      addNotification("Outdoor duty request rejected", "success");
      fetchRequests(filters);
    } catch (err) {
      console.error('Failed to reject outdoor duty:', err);
      addNotification(err.message || 'Failed to reject request', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this outdoor duty request?')) return;
    try {
      await deleteOutdoorDuty(id);
      addNotification("Outdoor duty request deleted", "success");
      fetchRequests(filters);
    } catch (err) {
      console.error('Failed to delete outdoor duty:', err);
      addNotification(err.message || 'Failed to delete request', 'error');
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

  const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toISOString().slice(0, 10);
  };

  const formatTime = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return typeof value === 'string' ? value.substring(11, 16) : value;
    }
    return d.toISOString().substring(11, 16);
  };

  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    const s = String(status).toLowerCase();
    if (s === 'approved') return 'Approved';
    if (s === 'rejected') return 'Rejected';
    return 'Pending';
  };

  return (
    <div className={`outdoor-duty-container p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-4 rounded-4 text-white shadow-sm"
           style={{ background: 'linear-gradient(135deg, #103B73 0%, #2B5BFF 50%, #117A7A 100%)', height: '170px', borderRadius: '20px' }}>
        <div>
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-1 rounded-pill small">
            ATTENDANCE REQUESTS
          </span>
          <h3 className="fw-bold mb-1">{view === 'list' ? 'Outdoor duty / site visit approvals' : 'Request site visit permission'}</h3>
          <p className="mb-2 text-white-50 x-small">
            {view === 'list' 
              ? 'Approve client visits and outdoor duty requests that create temporary site attendance permission through the existing backend service.'
              : 'Submit saved-site or one-time client location attendance permission with expected check-in/check-out timing and optional proof.'}
          </p>
          {view === 'list' && (
            <div className="d-flex gap-2">
              <span className="badge bg-white bg-opacity-10 small">• Site Attendance Permission</span>
              <span className="badge bg-white bg-opacity-10 small">• Temporary Locations</span>
              <span className="badge bg-white bg-opacity-10 small">• Emergency Visit Support</span>
            </div>
          )}
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          {view === 'list' ? (
            <button className="btn btn-light btn-sm rounded-3 px-3 py-2 fw-bold text-primary" onClick={() => setView('new_request')}>
              New Request
            </button>
          ) : (
            <button className="btn btn-light btn-sm rounded-3 px-3 py-2 fw-bold text-primary" onClick={() => setView('list')}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
              Back to Outdoor Duty
            </button>
          )}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3 overflow-auto" style={{ whiteSpace: 'nowrap' }}>
        {hrmsTabs.map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${tab.id === 'hrms_outdoor_duty' ? 'btn-primary shadow-sm' : 'btn-light'} rounded-pill px-4 py-2 border transition`}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontWeight: '500' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <KPICard title="Total Requests" value={requests.length} color="blue" subText="Matching Filters" />
            </div>
            <div className="col-md-3">
              <KPICard title="Pending" value={requests.filter(r => normalizeStatus(r.status) === 'Pending').length} color="orange" subText="Current Page" />
            </div>
            <div className="col-md-3">
              <KPICard title="Approved" value={requests.filter(r => normalizeStatus(r.status) === 'Approved').length} color="green" subText="Current Page" />
            </div>
            <div className="col-md-3">
              <KPICard title="Emergency" value={requests.filter(r => r.type === 'Emergency Visit').length} color="red" subText="After-the-fact Visits" />
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">Filter outdoor duty requests</h5>
            <p className="text-muted small mb-4">Search by employee, visit type and approval status</p>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-bold">Employee</label>
                <input type="text" className="form-control rounded-3" placeholder="Employee Name / ID" value={filters.employee_id} onChange={e => setFilters({...filters, employee_id: e.target.value})} />
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Type</label>
                <select className="form-select rounded-3" value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="">All Types</option>
                  <option value="Outdoor Duty">Outdoor Duty</option>
                  <option value="Client Visit">Client Visit</option>
                  <option value="Vendor Visit">Vendor Visit</option>
                  <option value="Official Meeting">Official Meeting</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label small fw-bold">Status</label>
                <select className="form-select rounded-3" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-start gap-2 mt-4">
              <button className="btn btn-primary rounded-3 px-4" onClick={handleApplyFilters} disabled={loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Loading...</>
                ) : (
                  'Apply Filter'
                )}
              </button>
              <button className="btn btn-outline-secondary rounded-3 px-4" onClick={handleResetFilters} disabled={loading}>
                Reset
              </button>
            </div>
          </div>

          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-0">OUTDOOR DUTY QUEUE</h5>
                <p className="text-muted small mb-0">Current filtered outdoor duty requests</p>
              </div>
              <span className="badge bg-primary-subtle text-primary border px-3 py-2 small">
                Attendance Permission
              </span>
            </div>

            {error && (
              <div className="alert alert-danger rounded-3" role="alert">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                {error}
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Visit Date</th>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="spinner-border text-primary mb-3" role="status" />
                        <h6 className="fw-bold">Loading outdoor duty requests...</h6>
                      </td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="fs-1 text-muted opacity-50 mb-3" />
                        <h6 className="fw-bold">No outdoor duty requests found.</h6>
                        <p className="text-muted small">Create a new request or adjust filters.</p>
                      </td>
                    </tr>
                  ) : (
                    requests.map(row => {
                      const status = normalizeStatus(row.status);
                      const employeeName = row.user?.name || row.employee_name || `Employee #${row.user_id}`;
                      const department = row.user?.department || 'Operations';
                      const employeeId = row.user?.employee_id || row.employee_id || row.user_id;
                      return (
                        <tr key={row.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faCalendarDays} className="text-muted" />
                              <span className="small fw-semibold">{formatDate(row.date)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                {employeeName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="small fw-bold">{employeeName}</div>
                                <div className="x-small text-muted">{department} | {employeeId}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border rounded-pill x-small">
                              {row.type || 'Outdoor Duty'}
                            </span>
                          </td>
                          <td>
                            <div className="small fw-bold">{row.location || '-'}</div>
                            <div className="x-small text-muted">
                              {row.address ? `${row.address} | ` : ''}
                              {row.start_time ? `Start: ${formatTime(row.start_time)}` : ''}
                              {row.end_time ? ` • End: ${formatTime(row.end_time)}` : ''}
                              {!row.address && !row.start_time && !row.end_time && (row.purpose || '')}
                            </div>
                          </td>
                          <td>
                            <span className={`badge rounded-pill bg-${status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'}-subtle text-${status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'} border`}>
                              {status}
                            </span>
                          </td>
                          <td>
                            {status === 'Pending' && (
                              <div className="d-flex gap-1">
                                <button className="btn btn-sm btn-success border" onClick={() => handleApprove(row.id)} title="Approve">
                                  <FontAwesomeIcon icon={faCheck} />
                                </button>
                                <button className="btn btn-sm btn-danger border" onClick={() => handleReject(row.id)} title="Reject">
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>
                              </div>
                            )}
                            <button className="btn btn-sm btn-outline-secondary border ms-1" onClick={() => handleDelete(row.id)} title="Delete">
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
              <h5 className="fw-bold mb-1">Visit Information</h5>
              <p className="text-muted small mb-4">Approval creates temporary site attendance permission using existing backend behavior.</p>
              {error && (
                <div className="alert alert-danger rounded-3" role="alert">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Employee</label>
                    <input type="text" className="form-control rounded-3" placeholder="Employee ID" required value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Request Type</label>
                    <select className="form-select rounded-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Outdoor Duty">Outdoor Duty</option>
                      <option value="Client Visit">Client Visit</option>
                      <option value="Vendor Visit">Vendor Visit</option>
                      <option value="Emergency Visit">Emergency Visit</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Visit Date</label>
                    <input type="date" className="form-control rounded-3" required value={formData.visit_date} onChange={e => setFormData({...formData, visit_date: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Expected Check-In</label>
                    <input type="time" className="form-control rounded-3" value={formData.check_in} onChange={e => setFormData({...formData, check_in: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Expected Check-Out</label>
                    <input type="time" className="form-control rounded-3" value={formData.check_out} onChange={e => setFormData({...formData, check_out: e.target.value})} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">One-Time Location Name</label>
                    <input type="text" className="form-control rounded-3" placeholder="Client Office / Meeting Place" value={formData.one_time_location} onChange={e => setFormData({...formData, one_time_location: e.target.value})} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">One-Time Location Address</label>
                    <input type="text" className="form-control rounded-3" placeholder="Full Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Latitude</label>
                    <input type="text" className="form-control rounded-3" placeholder="e.g. 33.6844" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Longitude</label>
                    <input type="text" className="form-control rounded-3" placeholder="e.g. 73.0479" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Allowed Radius (Meters)</label>
                    <input type="number" className="form-control rounded-3" value={formData.allowed_radius} onChange={e => setFormData({...formData, allowed_radius: e.target.value})} />
                  </div>
                  <div className="col-12 mt-2">
                    <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="countTravel" checked={formData.count_travel} onChange={e => setFormData({...formData, count_travel: e.target.checked})} />
                      <label className="form-check-label small" htmlFor="countTravel">Count travel time if company policy allows</label>
                    </div>
                    <div className="form-check mt-1">
                      <input type="checkbox" className="form-check-input" id="emergencyVisit" checked={formData.emergency_visit} onChange={e => setFormData({...formData, emergency_visit: e.target.checked})} />
                      <label className="form-check-label small text-danger fw-bold" htmlFor="emergencyVisit">Emergency visit / After-the-fact approval</label>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Purpose</label>
                    <input type="text" className="form-control rounded-3" placeholder="Meeting purpose..." required value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea className="form-control rounded-3" rows="3" placeholder="Detailed remarks..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary rounded-3 px-4" disabled={submitting}>
                    {submitting ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Submitting...</>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                  <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={() => setView('list')} disabled={submitting}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '80px', borderRadius: '18px' }}>
              <h5 className="fw-bold mb-1">Approval Path</h5>
              <p className="text-muted small mb-4">Outdoor attendance permission</p>
              <div className="d-flex flex-column gap-3">
                <TimelineStep step="1" title="Visit Request" desc="Employee enters site/client context." color="success" />
                <TimelineStep step="2" title="Manager / HR Review" desc="Approve or reject with remarks." color="warning" />
                <TimelineStep step="3" title="Temporary Permission" desc="Created automatically using existing attendance service." color="primary" />
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
    orange: 'warning',
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

export default HrmsOutdoorDuty;
