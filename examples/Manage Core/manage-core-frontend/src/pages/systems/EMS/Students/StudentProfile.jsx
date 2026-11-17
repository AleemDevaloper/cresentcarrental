import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate, faUser, faBookOpen, faCalendarCheck,
  faAward, faMoneyBillWave, faHeartbeat, faFileAlt, faClock,
  faEnvelope, faPhone, faMapMarkerAlt, faCalendar, faVenus,
  faDroplet, faExclamationTriangle, faCheckCircle, faTimesCircle,
  faGraduationCap, faChalkboardTeacher, faBuilding, faLayerGroup,
  faDownload, faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getStudentProfile } from '../../../../api/ems';

const TABS = ['Personal Information', 'Academic Information', 'Attendance', 'Results', 'Fees', 'Medical', 'Documents', 'Timeline'];

const StudentProfile = () => {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('Personal Information');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStudentProfile();
      setStudent(data || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const s = student || {};

  const personalInfo = s.personal_info || {
    name: 'John Doe', student_id: 'STU-2026-001', date_of_birth: '2005-06-15',
    gender: 'Male', blood_group: 'A+', nationality: 'American',
    mobile: '+1 (555) 123-4567', email: 'john.doe@example.com',
    address: '123 Main Street, New York, NY 10001',
  };

  const academicInfo = s.academic_info || {
    institution: 'Springfield University', program: 'Computer Science',
    class: 'Class 12', semester: 'Fall 2026', advisor: 'Dr. Smith',
    department: 'Computer Science', campus: 'Main Campus',
  };

  const attendance = s.attendance || {
    present: 85, absent: 5, late: 3, total: 93, percentage: 91.4,
    records: [
      { date: '2026-07-26', status: 'present', course: 'Mathematics' },
      { date: '2026-07-25', status: 'present', course: 'Physics' },
      { date: '2026-07-24', status: 'late', course: 'Computer Science' },
      { date: '2026-07-23', status: 'absent', course: 'English' },
      { date: '2026-07-22', status: 'present', course: 'Mathematics' },
    ]
  };

  const results = s.results || {
    gpa: 3.75, cgpa: 3.65,
    exams: [
      { name: 'Mid Term 2026', subject: 'Mathematics', score: 92, grade: 'A', status: 'passed' },
      { name: 'Mid Term 2026', subject: 'Physics', score: 85, grade: 'B+', status: 'passed' },
      { name: 'Mid Term 2026', subject: 'Computer Science', score: 95, grade: 'A+', status: 'passed' },
      { name: 'Mid Term 2026', subject: 'English', score: 78, grade: 'B', status: 'passed' },
    ]
  };

  const fees = s.fees || {
    total_fees: 15000, paid: 12000, pending: 3000, status: 'partial',
    history: [
      { date: '2026-01-15', amount: 5000, type: 'Tuition', status: 'paid' },
      { date: '2026-03-10', amount: 5000, type: 'Tuition', status: 'paid' },
      { date: '2026-05-20', amount: 2000, type: 'Lab Fee', status: 'paid' },
      { date: '2026-07-01', amount: 3000, type: 'Tuition', status: 'pending' },
    ]
  };

  const medical = s.medical || {
    blood_group: 'A+', allergies: 'Pollen, Dust', medical_conditions: 'Asthma',
    emergency_contact: '+1 (555) 987-6543',
  };

  const documents = s.documents || [
    { id: 1, name: 'Birth Certificate', type: 'PDF', uploaded: '2026-01-10', size: '2.3 MB' },
    { id: 2, name: 'Previous Report Card', type: 'PDF', uploaded: '2026-01-10', size: '1.1 MB' },
    { id: 3, name: 'Transfer Certificate', type: 'PDF', uploaded: '2026-02-15', size: '0.8 MB' },
  ];

  const timeline = s.timeline || [
    { date: '2026-07-26', event: 'Submitted Mathematics assignment', type: 'academic' },
    { date: '2026-07-25', event: 'Attended Physics lab session', type: 'attendance' },
    { date: '2026-07-24', event: 'Fee payment of $5,000 received', type: 'fee' },
    { date: '2026-07-20', event: 'Medical checkup completed', type: 'medical' },
    { date: '2026-07-15', event: 'Mid-term exam results published', type: 'result' },
  ];

  const typeColors = { academic: 'primary', attendance: 'success', fee: 'warning', medical: 'danger', result: 'info' };
  const typeIcons = { academic: faBookOpen, attendance: faCalendarCheck, fee: faMoneyBillWave, medical: faHeartbeat, result: faAward };

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          <div className="col-lg-4"><div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '400px', borderRadius: '18px' }}></div></div>
          <div className="col-lg-8"><div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '400px', borderRadius: '18px' }}></div></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${isDark ? 'text-white bg-dark' : ''}`}>
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal Information':
        return (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 p-4 text-center ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3" style={{ width: '100px', height: '100px', fontSize: '36px' }}>
                  {personalInfo.name?.charAt(0)}
                </div>
                <h5 className="fw-bold mb-1">{personalInfo.name}</h5>
                <code>{personalInfo.student_id}</code>
                <div className="mt-3">
                  <span className={`badge rounded-pill bg-success-subtle text-success`}>Active</span>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Personal Details</h5>
                <div className="row g-3">
                  {[
                    { label: 'Date of Birth', value: personalInfo.date_of_birth, icon: faCalendar },
                    { label: 'Gender', value: personalInfo.gender, icon: faVenus },
                    { label: 'Blood Group', value: personalInfo.blood_group, icon: faDroplet },
                    { label: 'Nationality', value: personalInfo.nationality, icon: faFlag },
                    { label: 'Mobile', value: personalInfo.mobile, icon: faPhone },
                    { label: 'Email', value: personalInfo.email, icon: faEnvelope },
                    { label: 'Address', value: personalInfo.address, icon: faMapMarkerAlt },
                  ].map(field => (
                    <div className="col-md-6" key={field.label}>
                      <div className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
                        <FontAwesomeIcon icon={field.icon} className="text-primary opacity-75" />
                        <div>
                          <div className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{field.label}</div>
                          <div className="small fw-semibold">{field.value}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'Academic Information':
        return (
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Academic Details</h5>
            <div className="row g-3">
              {[
                { label: 'Institution', value: academicInfo.institution, icon: faBuilding },
                { label: 'Campus', value: academicInfo.campus, icon: faBuilding },
                { label: 'Department', value: academicInfo.department, icon: faLayerGroup },
                { label: 'Program', value: academicInfo.program, icon: faBookOpen },
                { label: 'Class', value: academicInfo.class, icon: faUserGraduate },
                { label: 'Semester', value: academicInfo.semester, icon: faCalendar },
                { label: 'Advisor', value: academicInfo.advisor, icon: faChalkboardTeacher },
              ].map(field => (
                <div className="col-md-6" key={field.label}>
                  <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fa' }}>
                    <FontAwesomeIcon icon={field.icon} className="text-warning opacity-75" />
                    <div>
                      <div className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{field.label}</div>
                      <div className="small fw-semibold">{field.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Attendance':
        return (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Summary</h5>
                <div className="text-center mb-3">
                  <div className="h1 fw-bold text-primary">{attendance.percentage}%</div>
                  <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Overall Attendance</div>
                </div>
                <div className="d-flex justify-content-around">
                  {[
                    { label: 'Present', value: attendance.present, color: 'success' },
                    { label: 'Absent', value: attendance.absent, color: 'danger' },
                    { label: 'Late', value: attendance.late, color: 'warning' },
                  ].map(s => (
                    <div className="text-center" key={s.label}>
                      <div className={`h5 fw-bold mb-0 text-${s.color}`}>{s.value}</div>
                      <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Recent Records</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                        <th>Date</th>
                        <th>Course</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.records.map((r, i) => (
                        <tr key={i}>
                          <td className="small">{r.date}</td>
                          <td className="small">{r.course}</td>
                          <td>
                            <span className={`badge rounded-pill bg-${r.status === 'present' ? 'success' : r.status === 'late' ? 'warning' : 'danger'}-subtle text-${r.status === 'present' ? 'success' : r.status === 'late' ? 'warning' : 'danger'}`}>
                              <FontAwesomeIcon icon={r.status === 'present' ? faCheckCircle : faTimesCircle} className="me-1" />
                              {r.status}
                            </span>
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

      case 'Results':
        return (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Grade Summary</h5>
                <div className="text-center mb-3">
                  <div className="h1 fw-bold text-success">{results.gpa}</div>
                  <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Current GPA</div>
                </div>
                <div className="text-center">
                  <div className="h3 fw-bold text-info">{results.cgpa}</div>
                  <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>CGPA</div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Exam History</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                        <th>Exam</th>
                        <th>Subject</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.exams.map((e, i) => (
                        <tr key={i}>
                          <td className="small">{e.name}</td>
                          <td className="small fw-semibold">{e.subject}</td>
                          <td className="small">{e.score}</td>
                          <td><span className="badge bg-primary-subtle text-primary rounded-pill">{e.grade}</span></td>
                          <td>
                            <span className={`badge rounded-pill bg-${e.status === 'passed' ? 'success' : 'danger'}-subtle text-${e.status === 'passed' ? 'success' : 'danger'}`}>
                              {e.status}
                            </span>
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

      case 'Fees':
        return (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Fee Status</h5>
                <div className="text-center mb-3">
                  <div className={`h1 fw-bold ${fees.pending > 0 ? 'text-danger' : 'text-success'}`}>${fees.pending}</div>
                  <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Pending Amount</div>
                </div>
                <div className="mt-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="small">Total: ${fees.total_fees}</span>
                    <span className="small">Paid: ${fees.paid}</span>
                  </div>
                  <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${(fees.paid / fees.total_fees) * 100}%` }} />
                  </div>
                  <div className="text-center mt-2">
                    <span className={`badge rounded-pill bg-${fees.status === 'paid' ? 'success' : 'warning'}-subtle text-${fees.status === 'paid' ? 'success' : 'warning'}`}>
                      {fees.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8">
              <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
                <h5 className="fw-bold mb-3">Payment History</h5>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.history.map((f, i) => (
                        <tr key={i}>
                          <td className="small">{f.date}</td>
                          <td className="small fw-semibold">{f.type}</td>
                          <td className="small">${f.amount}</td>
                          <td>
                            <span className={`badge rounded-pill bg-${f.status === 'paid' ? 'success' : 'warning'}-subtle text-${f.status === 'paid' ? 'success' : 'warning'}`}>
                              {f.status}
                            </span>
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

      case 'Medical':
        return (
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Medical Information</h5>
            <div className="row g-3">
              {[
                { label: 'Blood Group', value: medical.blood_group, icon: faDroplet, color: 'danger' },
                { label: 'Allergies', value: medical.allergies || 'None', icon: faExclamationTriangle, color: 'warning' },
                { label: 'Medical Conditions', value: medical.medical_conditions || 'None', icon: faHeartbeat, color: 'info' },
                { label: 'Emergency Contact', value: medical.emergency_contact, icon: faPhone, color: 'success' },
              ].map(field => (
                <div className="col-md-6" key={field.label}>
                  <div className={`p-3 rounded-3 d-flex align-items-center gap-3 ${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                    <div className={`p-3 rounded-3 bg-${field.color}-subtle text-${field.color}`}>
                      <FontAwesomeIcon icon={field.icon} />
                    </div>
                    <div>
                      <div className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{field.label}</div>
                      <div className="fw-semibold">{field.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Documents':
        return (
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Uploaded Documents</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4 text-muted">No documents uploaded</td></tr>
                  ) : documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="fw-semibold small"><FontAwesomeIcon icon={faFileAlt} className="me-2 text-primary" />{doc.name}</td>
                      <td><span className="badge bg-light text-dark rounded-pill">{doc.type}</span></td>
                      <td className="small">{doc.size}</td>
                      <td className="small">{doc.uploaded}</td>
                      <td>
                        <button className="btn btn-sm btn-light border rounded-3 me-1"><FontAwesomeIcon icon={faEye} /></button>
                        <button className="btn btn-sm btn-light border rounded-3"><FontAwesomeIcon icon={faDownload} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Timeline':
        return (
          <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Activity Timeline</h5>
            <div className="position-relative" style={{ paddingLeft: '30px' }}>
              {timeline.length === 0 ? (
                <div className="text-center py-4 text-muted">No activity recorded</div>
              ) : (
                timeline.map((item, i) => (
                  <div key={i} className="position-relative mb-4" style={{ paddingLeft: '20px' }}>
                    <div className="position-absolute" style={{ left: '-26px', top: '4px' }}>
                      <div className={`rounded-circle bg-${typeColors[item.type] || 'secondary'}-subtle text-${typeColors[item.type] || 'secondary'} d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
                        <FontAwesomeIcon icon={typeIcons[item.type] || faClock} size="xs" />
                      </div>
                    </div>
                    <div className={`p-3 rounded-3 ${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                      <div className={`x-small fw-bold ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{item.date}</div>
                      <div className="small fw-semibold">{item.event}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Student Profile</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>360-degree student view</p>
        </div>
      </div>

      <div className="mb-4">
        <ul className="nav nav-tabs border-0 gap-2 flex-nowrap overflow-auto">
          {TABS.map(tab => (
            <li className="nav-item" key={tab}>
              <button className={`nav-link rounded-3 px-3 py-2 fw-semibold small ${activeTab === tab ? 'active bg-primary text-white border-0' : isDark ? 'text-light border-0' : 'text-muted border-0'}`}
                onClick={() => setActiveTab(tab)} style={{ whiteSpace: 'nowrap' }}>
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {renderTabContent()}

      <style>{`
        .x-small { font-size: 11px; }
        .skeleton-card { background-color: ${isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6'}; }
        .skeleton-line { background-color: ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .nav-tabs .nav-link.active { background: #6366f1 !important; color: white !important; }
        .nav-tabs .nav-link { transition: all 0.2s ease; }
        .nav-tabs .nav-link:hover { background: ${isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6'}; }
      `}</style>
    </div>
  );
};

export default StudentProfile;
