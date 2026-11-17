import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserInjured, faCalendarCheck, faUserMd, faAmbulance,
  faHospital, faFlask, faExclamationTriangle, faPills,
  faChartLine, faChartBar, faChartPie, faArrowRight, faPlus,
  faHeartbeat, faSyringe, faStethoscope, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const MedicalDashboard = () => {
  const { theme, setActiveTab } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await new Promise(r => setTimeout(r, 600));
        setStats({
          totalPatients: 4520, todayAppointments: 48, doctorsOnDuty: 24, emergencyCases: 6,
          admissions: 32, labTests: 156, pharmacyAlerts: 3, ambulancesAvailable: 4,
          patientVisits: [320, 380, 410, 360, 390, 420, 380, 450, 430, 410, 440, 460],
          departmentCases: [180, 145, 120, 98, 75, 110],
          deptLabels: ['General', 'Cardiology', 'Orthopedic', 'Pediatrics', 'Dermatology', 'ENT'],
          commonDiagnoses: ['Flu/Cold', 'Hypertension', 'Diabetes', 'Allergies', 'Injury'],
          diagnosisCounts: [120, 85, 65, 55, 40],
          recentAppointments: [
            { id: 1, patient: 'Ali Ahmed', doctor: 'Dr. Usman Malik', department: 'Cardiology', time: '10:00 AM', status: 'In Progress' },
            { id: 2, patient: 'Sara Khan', doctor: 'Dr. Fatima Noor', department: 'General', time: '10:30 AM', status: 'Waiting' },
            { id: 3, patient: 'Usman Ali', doctor: 'Dr. Hassan Raza', department: 'Orthopedic', time: '11:00 AM', status: 'Completed' },
            { id: 4, patient: 'Fatima Noor', doctor: 'Dr. Ayesha Malik', department: 'Pediatrics', time: '11:30 AM', status: 'Cancelled' },
            { id: 5, patient: 'Hassan Shah', doctor: 'Dr. Bilal Ahmed', department: 'ENT', time: '12:00 PM', status: 'Waiting' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load medical dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4', purple: '#8b5cf6', pink: '#ec4899' };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
          <div className="text-danger mb-3" style={{ fontSize: '3rem' }}><FontAwesomeIcon icon={faExclamationTriangle} /></div>
          <h5 className="fw-bold mb-2" style={{ color: textColor }}>Failed to Load Dashboard</h5>
          <p className="text-muted mb-3 text-center">{error}</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => { setLoading(true); setError(null); setStats(null); }}>Retry</button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const visitsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Patient Visits', data: stats.patientVisits, borderColor: colors.primary, backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }],
  };

  const deptData = {
    labels: stats.deptLabels,
    datasets: [{ label: 'Cases', data: stats.departmentCases, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'], borderRadius: 6 }],
  };

  const diagnosesData = {
    labels: stats.commonDiagnoses,
    datasets: [{ data: stats.diagnosisCounts, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'], borderWidth: 0, hoverOffset: 10 }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: { y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } } },
  };

  return (
    <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.1)', color: colors.primary }}>
            <FontAwesomeIcon icon={faHeartbeat} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Medical Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Monitor healthcare services and patient care</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-danger rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faAmbulance} /> Emergency</button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('medical')}><FontAwesomeIcon icon={faPlus} /> New Appointment</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: faUserInjured, color: colors.primary },
          { title: "Today's Appointments", value: stats.todayAppointments, icon: faCalendarCheck, color: colors.info },
          { title: 'Doctors On Duty', value: stats.doctorsOnDuty, icon: faUserMd, color: colors.success },
          { title: 'Emergency Cases', value: stats.emergencyCases, icon: faExclamationTriangle, color: colors.danger },
          { title: 'Admissions', value: stats.admissions, icon: faHospital, color: colors.purple },
          { title: 'Lab Tests', value: stats.labTests, icon: faFlask, color: colors.warning },
          { title: 'Pharmacy Alerts', value: stats.pharmacyAlerts, icon: faPills, color: colors.danger },
          { title: 'Ambulances Available', value: stats.ambulancesAvailable, icon: faAmbulance, color: colors.success },
        ].map((stat, idx) => (
          <div key={idx} className="col-xl col-lg-3 col-md-4 col-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${stat.color}1a` }}>
                    <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: '14px' }} />
                  </div>
                </div>
                <h5 className="fw-bold mb-0" style={{ color: textColor, fontSize: '20px' }}>{stat.value}</h5>
                <span className="x-small fw-semibold" style={{ color: stat.color }}>{stat.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Patient Visits</h6>
              <div style={{ height: '220px' }}><Line data={visitsData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Department Cases</h6>
              <div style={{ height: '220px' }}><Bar data={deptData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Common Diagnoses</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={diagnosesData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Today's Appointments</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentAppointments.map((app, idx) => (
                <div key={app.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: app.status === 'In Progress' ? `${colors.info}15` : app.status === 'Completed' ? `${colors.success}15` : app.status === 'Cancelled' ? `${colors.danger}15` : `${colors.warning}15` }}>
                    <FontAwesomeIcon icon={app.status === 'In Progress' ? faStethoscope : app.status === 'Completed' ? faCheckCircle : app.status === 'Cancelled' ? faExclamationTriangle : faClock} style={{ color: app.status === 'In Progress' ? colors.info : app.status === 'Completed' ? colors.success : app.status === 'Cancelled' ? colors.danger : colors.warning, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{app.patient}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{app.doctor} - {app.department}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className={`badge rounded-pill x-small fw-semibold ${app.status === 'In Progress' ? 'bg-info-subtle text-info' : app.status === 'Completed' ? 'bg-success-subtle text-success' : app.status === 'Cancelled' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}`}>{app.status}</span>
                    <div className="x-small text-muted mt-1">{app.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Quick Actions</h6>
              {[
                { label: 'New Appointment', icon: faCalendarCheck, color: colors.primary, desc: 'Schedule appointment' },
                { label: 'Register Patient', icon: faUserInjured, color: colors.success, desc: 'New patient registration' },
                { label: 'Emergency', icon: faAmbulance, color: colors.danger, desc: 'Emergency case' },
                { label: 'Lab Test', icon: faFlask, color: colors.info, desc: 'Order lab test' },
                { label: 'Pharmacy', icon: faPills, color: colors.warning, desc: 'Manage pharmacy' },
              ].map((act, idx) => (
                <button key={idx} className="btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px', background: `${act.color}15` }}>
                    <FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{act.label}</div>
                    <div className="x-small text-muted">{act.desc}</div>
                  </div>
                  <FontAwesomeIcon icon={faArrowRight} className="text-muted" style={{ fontSize: '11px', opacity: 0.5 }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; } .transition { transition: all 0.25s ease; }`}</style>
    </div>
  );
};

export default MedicalDashboard;
