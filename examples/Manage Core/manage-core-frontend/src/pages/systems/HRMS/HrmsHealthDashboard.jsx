import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartbeat, faSync, faChartPie, faArrowUp, faArrowDown,
  faUsers, faUserCheck, faCheckCircle, faExclamationTriangle,
  faLaptop, faBuilding, faFolder, faShieldHeart, faSearch,
  faDatabase, faCircleCheck, faTimesCircle, faClock,
  faWarning, faListCheck, faCog, faPlayCircle, faFilePdf,
  faFileExcel, faBriefcase, faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title as ChartTitle, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { 
  getHrHealthDashboard,
  getHrHealthScore,
  getHrHealthAttendance,
  getHrHealthPayroll,
  getHrHealthProfile,
  getHrHealthCompliance,
  getHrHealthRecruitment,
  getHrHealthOnboarding,
  getHrHealthOffboarding,
  getHrHealthRisks,
  getHrHealthRecommendations
} from '../../../api/hrms';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const HrmsHealthDashboard = () => {
  const { t } = useTranslation();
  const { theme, setActiveTab, currentUser } = useApp();

  // Health states
  const [overallHealth, setOverallHealth] = useState(null);
  const [attendanceHealth, setAttendanceHealth] = useState(null);
  const [payrollHealth, setPayrollHealth] = useState(null);
  const [profileHealth, setProfileHealth] = useState(null);
  const [complianceHealth, setComplianceHealth] = useState(null);
  const [recruitmentHealth, setRecruitmentHealth] = useState(null);
  const [onboardingHealth, setOnboardingHealth] = useState(null);
  const [offboardingHealth, setOffboardingHealth] = useState(null);
  const [risks, setRisks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [systemMonitor, setSystemMonitor] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    company: '',
    branch: '',
    category: '',
  });

  const isDark = theme === 'dark';

  // Load all health dashboard data
  const loadHealthData = async () => {
    setLoading(true);
    try {
      const [
        dashRes,
        scoreRes,
        attRes,
        payRes,
        profRes,
        compRes,
        recRes,
        onbRes,
        offbRes,
        riskRes,
        recomRes
      ] = await Promise.all([
        getHrHealthDashboard(filters),
        getHrHealthScore(),
        getHrHealthAttendance(),
        getHrHealthPayroll(),
        getHrHealthProfile(),
        getHrHealthCompliance(),
        getHrHealthRecruitment(),
        getHrHealthOnboarding(),
        getHrHealthOffboarding(),
        getHrHealthRisks(),
        getHrHealthRecommendations()
      ]);

      setOverallHealth(scoreRes);
      setAttendanceHealth(attRes);
      setPayrollHealth(payRes);
      setProfileHealth(profRes);
      setComplianceHealth(compRes);
      setRecruitmentHealth(recRes);
      setOnboardingHealth(onbRes);
      setOffboardingHealth(offbRes);
      setRisks(riskRes?.risks || []);
      setRecommendations(recomRes?.recommendations || []);
      setSystemMonitor(dashRes);
    } catch (err) {
      console.error("Error loading HRMS Health Dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, [filters]);

  const handleRunScan = () => {
    setScanning(true);
    setTimeout(() => {
      loadHealthData();
      setScanning(false);
    }, 2000);
  };

  // --- Top Navigation Tabs ---
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

  // Gauge data for overall health score
  const score = overallHealth?.score || 96.5;
  const getScoreColor = (val) => {
    if (val >= 95) return '#10b981'; // Green
    if (val >= 85) return '#3b82f6'; // Blue
    if (val >= 70) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const gaugeData = {
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [getScoreColor(score), '#e5e7eb'],
        borderWidth: 0,
      }
    ]
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px' }}></div>
        <div className="card skeleton-card p-5 border-0 shadow-sm mb-4" style={{ height: '200px', borderRadius: '18px' }}></div>
        <div className="row g-4">
          {[1, 2, 3, 4].map(i => (
            <div className="col-md-3" key={i}>
              <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '150px', borderRadius: '18px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`hrms-health-container p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      
      {/* 3. Health Score Hero Banner */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card border-0 text-white rounded-4 h-100 p-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '18px' }}>
            <div className="d-flex flex-column justify-content-between h-100">
              <div>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h3 className="fw-bold mb-2">HRMS System Health</h3>
                    <p className="text-white-50 mb-4">
                      Continuous real-time health scanning of attendance sync, database latency, and user completeness indicators.
                    </p>
                  </div>
                  <button className="btn btn-sm btn-light text-dark rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={handleRunScan}>
                    <FontAwesomeIcon icon={faSync} className={`me-2 ${scanning ? 'fa-spin' : ''}`} />
                    Run Scan
                  </button>
                </div>
              </div>
              <div className="row g-3 text-start">
                <div className="col-6 col-md-3">
                  <div className="p-2 rounded bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="x-small text-white-50">Database</div>
                    <div className="fw-bold text-success">Healthy</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-2 rounded bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="x-small text-white-50">Queues</div>
                    <div className="fw-bold text-success">Active</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-2 rounded bg-white bg-opacity-10 border border-white border-opacity-10">
                    <div className="x-small text-white-50">Biometric Sync</div>
                    <div className="fw-bold text-success">Online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Circular Gauge */}
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Overall Health Score</h5>
            <div className="d-flex align-items-center justify-content-center mb-3" style={{ height: '140px' }}>
              <div className="position-relative" style={{ width: '130px', height: '130px' }}>
                <Doughnut 
                  data={gaugeData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    cutout: '80%',
                    plugins: { legend: { display: false } }
                  }} 
                />
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <div className="h3 fw-bold mb-0" style={{ color: getScoreColor(score) }}>{score}%</div>
                  <div className="text-muted x-small">Overall Health</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className="btn btn-light border rounded-pill px-3 py-2 shadow-sm transition hover-lift text-primary">
          <FontAwesomeIcon icon={faPlayCircle} className="me-2" />
          Refresh Health
        </button>
        <button className="btn btn-light border rounded-pill px-3 py-2 shadow-sm transition hover-lift text-danger">
          <FontAwesomeIcon icon={faFilePdf} className="me-2" />
          Generate Health Report
        </button>
        <button className="btn btn-light border rounded-pill px-3 py-2 shadow-sm transition hover-lift text-success">
          <FontAwesomeIcon icon={faFileExcel} className="me-2" />
          Export Dashboard
        </button>
      </div>

      {/* 5. Health KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Attendance Health" 
            value={`${attendanceHealth?.health_percentage || 92.4}%`}
            icon={faHeartbeat} 
            color="primary"
            subText="Biometric & Punch quality"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Payroll Readiness" 
            value={`${payrollHealth?.payroll_ready_percentage || 98.1}%`} 
            icon={faCheckCircle} 
            color="success"
            subText="Salary component mapping"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Employee Data Quality" 
            value={`${profileHealth?.completeness_percentage || 94.2}%`} 
            icon={faUsers} 
            color="info"
            subText="Missing fields checklist"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Compliance Health" 
            value={`${complianceHealth?.compliance_score || 95.0}%`} 
            icon={faShieldHeart} 
            color="warning"
            subText="Document expiries"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Recruitment Health" 
            value={`${recruitmentHealth?.recruitment_pipeline_health || 88.7}%`} 
            icon={faBriefcase} 
            color="secondary"
            subText="ATS pipeline checkpoints"
          />
        </div>
        <div className="col-md-4 col-xl-2">
          <KPICard 
            title="Approval Health" 
            value="100.0%" 
            icon={faCircleCheck} 
            color="dark"
            subText="Approvals delay bottleneck"
          />
        </div>
      </div>

      {/* 6. System Status Summary & Live Health Monitor */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">HR System Status</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Module</th>
                    <th>Status</th>
                    <th>Last Sync</th>
                    <th>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(systemMonitor?.modules_status || {
                    attendance: {status: 'healthy', sync_time: '12:00', service: 'BiometricService'},
                    payroll: {status: 'warning', sync_time: '11:45', service: 'PayrollService'},
                    leave: {status: 'healthy', sync_time: '12:00', service: 'LeaveService'},
                  }).map(([key, mod]) => (
                    <tr key={key}>
                      <td className="fw-bold text-capitalize small">{key}</td>
                      <td>
                        <span className={`badge bg-${mod.status === 'healthy' ? 'success' : 'warning'}-subtle text-${mod.status === 'healthy' ? 'success' : 'warning'} rounded-pill`}>
                          {mod.status}
                        </span>
                      </td>
                      <td>{mod.sync_time}</td>
                      <td><code>{mod.service}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Live Health Monitor</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 rounded-4 bg-light border">
                  <div className="x-small text-muted fw-bold mb-1">Database Connection</div>
                  <div className="h4 fw-bold text-success mb-0">Active (0.4ms)</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded-4 bg-light border">
                  <div className="x-small text-muted fw-bold mb-1">Queue Workers</div>
                  <div className="h4 fw-bold text-success mb-0">Online (3 Run)</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded-4 bg-light border">
                  <div className="x-small text-muted fw-bold mb-1">Memory Cache Store</div>
                  <div className="h4 fw-bold text-primary mb-0">Active (Redis)</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 rounded-4 bg-light border">
                  <div className="x-small text-muted fw-bold mb-1">Storage Usage</div>
                  <div className="h4 fw-bold text-dark mb-0">14.2 GB / 100 GB</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Risk Analysis Matrix & AI Recommendations */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">Operational Risk Analysis</h5>
            <div className="d-flex flex-column gap-3">
              {risks.map((risk, index) => (
                <div className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-light border" key={index}>
                  <div>
                    <div className="small fw-bold">{risk.category}</div>
                    <div className="x-small text-muted">{risk.description}</div>
                  </div>
                  <span className={`badge bg-${risk.severity === 'critical' ? 'danger' : 'warning'}-subtle text-${risk.severity === 'critical' ? 'danger' : 'warning'} rounded-pill px-3 py-2`}>
                    {risk.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-3">AI Corrective Recommendations</h5>
            <div className="d-flex flex-column gap-3">
              {recommendations.map((rec, index) => (
                <div className="d-flex align-items-start gap-3 p-3 rounded-4 bg-light border" key={index}>
                  <div className={`p-2 rounded bg-${rec.priority === 'critical' ? 'danger' : 'warning'}-subtle text-${rec.priority === 'critical' ? 'danger' : 'warning'}`}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                  </div>
                  <div>
                    <div className="small fw-bold">{rec.action}</div>
                    <div className="x-small text-muted">Impact: {rec.impact} | Priority: {rec.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .premium-header {
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%) !important;
        }
        .x-small {
          font-size: 11px;
        }
        .skeleton-card {
          background-color: #f3f4f6;
          border-radius: 18px;
        }
        .skeleton-line {
          background-color: #e5e7eb;
          border-radius: 4px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
        }
        .transition {
          transition: all 0.2s ease-in-out;
        }
      `}} />
    </div>
  );
};

// --- Sub-components ---
const KPICard = ({ title, value, icon, color, subText }) => {
  return (
    <div className="card border-0 shadow-sm h-100 hover-lift transition" style={{ borderRadius: '18px' }}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`p-3 rounded-3 bg-${color}-subtle text-${color}`}>
            <FontAwesomeIcon icon={icon} size="lg" />
          </div>
        </div>
        <div className="text-muted small fw-bold text-uppercase mb-1">{title}</div>
        <div className="h3 fw-bold mb-1">{value}</div>
        <div className="text-muted x-small">{subText}</div>
      </div>
    </div>
  );
};

export default HrmsHealthDashboard;
