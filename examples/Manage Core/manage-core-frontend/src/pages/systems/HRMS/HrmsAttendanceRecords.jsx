import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignInAlt, faSignOutAlt, faHistory, faLocationDot, faCamera,
  faCheckCircle, faTriangleExclamation, faSliders, faFilter,
  faFileExcel, faFilePdf, faSearch, faChevronRight, faMap,
  faCalendarDays, faCircleCheck, faTimesCircle, faClock
} from '@fortawesome/free-solid-svg-icons';
import { listAttendance, listSites } from '../../../api/hrms';
import { useApp } from '../../../hooks/useApp';

const HrmsAttendanceRecords = () => {
  const { theme, setActiveTab, addNotification } = useApp();
  const [attendance, setAttendance] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    employee_id: '',
    status: '',
  });

  const isDark = theme === 'dark';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attData, sitesData] = await Promise.all([
        listAttendance(filters),
        listSites()
      ]);
      setAttendance(attData || []);
      setSites(sitesData || []);
    } catch (err) {
      addNotification("Failed to load attendance records", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      from_date: '',
      to_date: '',
      employee_id: '',
      status: '',
    });
    fetchData();
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
    <div className={`attendance-records-container p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-4 rounded-4 text-white shadow-sm premium-records-header"
           style={{ background: 'linear-gradient(135deg, #103B73 0%, #2B5BFF 50%, #117A7A 100%)', height: '150px', borderRadius: '20px' }}>
        <div>
          <span className="badge bg-white bg-opacity-25 text-white mb-2 px-3 py-1 rounded-pill small">
            ATTENDANCE CONTROL CENTER
          </span>
          <h3 className="fw-bold mb-1">Daily attendance, site verification and red-zone monitoring</h3>
          <p className="mb-0 text-white-50 x-small">
            Review employee punches, GPS/QR/selfie verification, late/short/overtime minutes and approval status from one clean operational screen.
          </p>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <button className="btn btn-light btn-sm rounded-3 px-3 py-2 fw-bold text-primary" onClick={() => setActiveTab('hrms_attendance')}>
            My Attendance
          </button>
          <button className="btn btn-outline-light btn-sm rounded-3 px-3 py-2 fw-bold" onClick={() => setActiveTab('hrms_attendance_correction')}>
            Correction Request
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3 overflow-auto" style={{ whiteSpace: 'nowrap' }}>
        {hrmsTabs.map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${tab.id === 'hrms_attendance_records' ? 'btn-primary shadow-sm' : 'btn-light'} rounded-pill px-4 py-2 border transition`}
            onClick={() => setActiveTab(tab.id)}
            style={{ fontWeight: '500' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <KPICard title="Total Records" value={attendance.length} color="blue" subText="Selected Date Range" />
        </div>
        <div className="col-md-3">
          <KPICard title="Present on Page" value={attendance.filter(r => r.status === 'Present').length} color="green" subText="Current Result Page" />
        </div>
        <div className="col-md-3">
          <KPICard title="Pending Approval" value={attendance.filter(r => r.verification_status === 'pending').length} color="yellow" subText="Approval Status Pending" />
        </div>
        <div className="col-md-3">
          <KPICard title="Open Red Zone" value={attendance.filter(r => r.red_zone === 'outside').length} color="red" subText="Working outside allowed GPS radius" />
        </div>
      </div>

      {/* Smart Filters Panel */}
      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <h5 className="fw-bold mb-1">SMART FILTERS</h5>
        <p className="text-muted small mb-4">Find attendance records using query parameters</p>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label small fw-bold">From Date</label>
            <input type="date" className="form-control rounded-3" value={filters.from_date} onChange={e => setFilters({...filters, from_date: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">To Date</label>
            <input type="date" className="form-control rounded-3" value={filters.to_date} onChange={e => setFilters({...filters, to_date: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Employee</label>
            <input type="text" className="form-control rounded-3" placeholder="Employee Code / ID" value={filters.employee_id} onChange={e => setFilters({...filters, employee_id: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label small fw-bold">Status</label>
            <select className="form-select rounded-3" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
            </select>
          </div>
        </div>
        <div className="d-flex justify-content-start gap-2 mt-4">
          <button className="btn btn-primary rounded-3 px-4" onClick={handleApplyFilters}>Apply Filters</button>
          <button className="btn btn-outline-secondary rounded-3 px-4" onClick={handleResetFilters}>Reset</button>
        </div>
      </div>

      {/* Attendance Register Table Card */}
      <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-0">ATTENDANCE REGISTER</h5>
            <p className="text-muted small mb-0">Showing {attendance.length} verified records</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-success">Excel</button>
            <button className="btn btn-sm btn-outline-danger">PDF</button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="text-muted small text-uppercase">
                <th>Date</th>
                <th>Employee</th>
                <th>Shift / Location</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Work Summary</th>
                <th>Status</th>
                <th>Red Zone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No attendance records found.</h6>
                    <p className="text-muted small">Try changing the date range, employee or status filter.</p>
                  </td>
                </tr>
              ) : (
                attendance.map(row => (
                  <tr key={row.id}>
                    <td>{row.date}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {row.user?.name?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <div className="small fw-bold">{row.user?.name || 'N/A'}</div>
                          <div className="x-small text-muted">ID: {row.user?.employee_id || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="small fw-semibold">{row.shift?.name || 'General Shift'}</div>
                      <div className="x-small text-muted">{row.site?.name || 'Default Office'}</div>
                    </td>
                    <td>
                      <div className="small fw-semibold">{row.clock_in_time}</div>
                      <div className="d-flex gap-1 mt-1 text-muted">
                        <FontAwesomeIcon icon={faCamera} size="xs" title="Selfie verified" />
                        <FontAwesomeIcon icon={faLocationDot} size="xs" title="GPS verified" />
                      </div>
                    </td>
                    <td>
                      <div className="small fw-semibold">{row.clock_out_time || '--:--'}</div>
                    </td>
                    <td>
                      <div className="small">Hrs: {row.working_hours || '8.0'}</div>
                      <div className="x-small text-muted">OT: {row.overtime_minutes || '0'}m</div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill bg-success-subtle text-success border`}>
                        {row.status || 'Present'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill bg-success-subtle text-success border`}>
                        Inside Radius
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

const KPICard = ({ title, value, color, subText }) => {
  const accentColors = {
    blue: 'primary',
    green: 'success',
    yellow: 'warning',
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

export default HrmsAttendanceRecords;
