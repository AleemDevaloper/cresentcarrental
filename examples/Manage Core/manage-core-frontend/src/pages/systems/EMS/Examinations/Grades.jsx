import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar, faSearch, faFileExport, faPrint, faExclamationTriangle,
  faUserGraduate, faCheckCircle, faTimesCircle, faChartBar,
  faArrowUp, faArrowDown, faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';

const GRADES_SYSTEM = [
  { min: 90, grade: 'A+', gpa: 4.0 },
  { min: 85, grade: 'A', gpa: 3.7 },
  { min: 80, grade: 'B+', gpa: 3.3 },
  { min: 75, grade: 'B', gpa: 3.0 },
  { min: 70, grade: 'C+', gpa: 2.7 },
  { min: 65, grade: 'C', gpa: 2.3 },
  { min: 60, grade: 'D+', gpa: 2.0 },
  { min: 50, grade: 'D', gpa: 1.7 },
  { min: 0, grade: 'F', gpa: 0.0 },
];

const getGrade = (marks) => {
  const found = GRADES_SYSTEM.find(g => marks >= g.min);
  return found || GRADES_SYSTEM[GRADES_SYSTEM.length - 1];
};

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science'];

const Grades = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ class: '', subject: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReportCard, setShowReportCard] = useState(false);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData([
        { id: 1, student: 'Ali Ahmed', rollNo: 'S-001', class: 'Class 10', subject: 'Physics', marks: 85, status: 'Pass' },
        { id: 2, student: 'Sara Khan', rollNo: 'S-002', class: 'Class 10', subject: 'Physics', marks: 72, status: 'Pass' },
        { id: 3, student: 'Usman Ali', rollNo: 'S-003', class: 'Class 10', subject: 'Physics', marks: 45, status: 'Fail' },
        { id: 4, student: 'Fatima Noor', rollNo: 'S-004', class: 'Class 10', subject: 'Mathematics', marks: 91, status: 'Pass' },
        { id: 5, student: 'Hassan Raza', rollNo: 'S-005', class: 'Class 10', subject: 'Mathematics', marks: 63, status: 'Pass' },
        { id: 6, student: 'Ayesha Malik', rollNo: 'S-006', class: 'Class 10', subject: 'Chemistry', marks: 78, status: 'Pass' },
        { id: 7, student: 'Bilal Ahmed', rollNo: 'S-007', class: 'Class 10', subject: 'Chemistry', marks: 38, status: 'Fail' },
        { id: 8, student: 'Zainab Ali', rollNo: 'S-008', class: 'Class 10', subject: 'English', marks: 88, status: 'Pass' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  const gradeDistData = {
    labels: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    datasets: [{
      label: 'Students',
      data: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'].map(g =>
        data.filter(item => getGrade(item.marks).grade === g).length
      ),
      backgroundColor: ['#10b981', '#34d399', '#6366f1', '#8b5cf6', '#f59e0b', '#f97316', '#ef4444', '#dc2626'],
      borderRadius: 6,
    }],
  };

  const total = data.length;
  const passed = data.filter(d => d.status === 'Pass').length;
  const failed = data.filter(d => d.status === 'Fail').length;
  const passRate = total ? ((passed / total) * 100).toFixed(1) : 0;

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
    },
  };

  if (showReportCard && selectedStudent) {
    const subMarks = data.filter(d => d.student === selectedStudent.student);
    const avgMarks = subMarks.reduce((s, m) => s + m.marks, 0) / (subMarks.length || 1);
    const overallGrade = getGrade(avgMarks);

    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Report Card Preview</h5>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-outline-secondary rounded-3"><FontAwesomeIcon icon={faPrint} className="me-1" /> Print</button>
            <button className="btn btn-sm btn-primary rounded-3" onClick={() => setShowReportCard(false)}>Close</button>
          </div>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="card-body p-5 text-center">
            <div className="mb-4">
              <FontAwesomeIcon icon={faGraduationCap} className="fs-1 text-primary mb-2" />
              <h4 className="fw-bold">{selectedStudent.student}</h4>
              <p className="text-muted small mb-1">Roll No: {selectedStudent.rollNo} | Class: {selectedStudent.class}</p>
              <p className="text-muted small">Academic Year 2024-2025</p>
            </div>
            <div className="row g-3 mb-4">
              {subMarks.map(sub => {
                const g = getGrade(sub.marks);
                return (
                  <div className="col-md-4" key={sub.id}>
                    <div className="p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}>
                      <div className="small fw-bold">{sub.subject}</div>
                      <div className="h4 fw-bold mb-0" style={{ color: sub.status === 'Pass' ? '#10b981' : '#ef4444' }}>{sub.marks}</div>
                      <div className="x-small text-muted">Grade: {g.grade} (GPA: {g.gpa})</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 rounded-3" style={{ background: 'rgba(99,102,241,0.05)', border: `1px solid rgba(99,102,241,0.2)` }}>
              <div className="row">
                <div className="col">
                  <div className="x-small text-muted">Average Marks</div>
                  <div className="h3 fw-bold" style={{ color: textColor }}>{avgMarks.toFixed(1)}%</div>
                </div>
                <div className="col">
                  <div className="x-small text-muted">Overall Grade</div>
                  <div className="h3 fw-bold" style={{ color: '#6366f1' }}>{overallGrade.grade}</div>
                </div>
                <div className="col">
                  <div className="x-small text-muted">GPA</div>
                  <div className="h3 fw-bold" style={{ color: '#10b981' }}>{overallGrade.gpa.toFixed(1)}</div>
                </div>
                <div className="col">
                  <div className="x-small text-muted">Status</div>
                  <div className={`h3 fw-bold ${subMarks.some(s => s.status === 'Fail') ? 'text-danger' : 'text-success'}`}>
                    {subMarks.some(s => s.status === 'Fail') ? 'Fail' : 'Pass'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const updateMarksEntry = (id, marks) => {
    setData(prev => prev.map(d => {
      if (d.id !== id) return d;
      const m = Number(marks);
      const grade = getGrade(m);
      return { ...d, marks: m, status: m >= 50 ? 'Pass' : 'Fail' };
    }));
  };

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Grades</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage student grades, report cards, and analytics</p>
        </div>
        <button className="btn btn-primary rounded-3"><FontAwesomeIcon icon={faFileExport} className="me-2" />Export</button>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Records', value: total, icon: faStar, color: '#6366f1' },
          { title: 'Passed', value: passed, icon: faCheckCircle, color: '#10b981', trend: `${passRate}%` },
          { title: 'Failed', value: failed, icon: faTimesCircle, color: '#ef4444' },
          { title: 'Pass Rate', value: `${passRate}%`, icon: faArrowUp, color: '#10b981' },
        ].map((stat, idx) => (
          <div key={idx} className="col-xl-3 col-md-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="p-3 rounded-4" style={{ backgroundColor: `${stat.color}1a` }}>
                    <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color }} />
                  </div>
                </div>
                <h6 className="text-muted small mb-1">{stat.title}</h6>
                <h3 className="fw-bold mb-0" style={{ color: textColor }}>{stat.value}</h3>
                {stat.trend && <span className="x-small text-success fw-semibold">{stat.trend} Rate</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search by student name or roll no..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.class} onChange={e => setFilters({...filters, class: e.target.value})}>
              <option value="">All Classes</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.subject} onChange={e => setFilters({...filters, subject: e.target.value})}>
              <option value="">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setFilters({ class: '', subject: '' }); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th className="ps-4">Student Name</th>
                    <th>Roll No</th>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>GPA</th>
                    <th className="pe-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <FontAwesomeIcon icon={faStar} className="fs-1 text-muted opacity-50 mb-3" />
                        <h6 className="fw-bold">No grade records found</h6>
                      </td>
                    </tr>
                  ) : data.map(item => {
                    const grade = getGrade(item.marks);
                    return (
                      <tr key={item.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faUserGraduate} className="text-primary opacity-50" />
                            <span className="fw-semibold small cursor-pointer" style={{ color: textColor }}
                              onClick={() => { setSelectedStudent(item); setShowReportCard(true); }}>
                              {item.student}
                            </span>
                          </div>
                        </td>
                        <td><code>{item.rollNo}</code></td>
                        <td className="small">{item.subject}</td>
                        <td style={{ minWidth: '100px' }}>
                          <input type="number" className="form-control form-control-sm" style={{ width: '80px' }}
                            value={item.marks} onChange={e => updateMarksEntry(item.id, e.target.value)} />
                        </td>
                        <td><span className={`badge rounded-pill ${grade.grade === 'F' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>{grade.grade}</span></td>
                        <td className="small fw-bold">{grade.gpa.toFixed(1)}</td>
                        <td className="pe-4">
                          <span className={`badge rounded-pill ${item.status === 'Pass' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            <FontAwesomeIcon icon={item.status === 'Pass' ? faCheckCircle : faTimesCircle} className="me-1" />
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Grade Distribution</h6>
              <div style={{ height: '200px' }}>
                <Bar data={gradeDistData} options={chartOpts} />
              </div>
              <hr />
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Pass Percentage</h6>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="flex-grow-1">
                  <div className="progress rounded-pill" style={{ height: '12px' }}>
                    <div className="progress-bar bg-success" style={{ width: `${passRate}%` }}></div>
                  </div>
                </div>
                <span className="fw-bold h5 mb-0" style={{ color: textColor }}>{passRate}%</span>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span><span className="fw-bold text-success">{passed}</span> Passed</span>
                <span><span className="fw-bold text-danger">{failed}</span> Failed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default Grades;
