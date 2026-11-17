import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt, faPlay, faChalkboardTeacher,
  faFlask, faGlobe, faDoorOpen, faLock,
  faUsers, faClock, faChartBar, faClipboardList,
  faArrowUp, faArrowRight, faGraduationCap,
  faPenFancy, faStar, faHandshake,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const TimetableDashboard = () => {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const mockData = {
    totalTimetables: 45,
    todayClasses: 28,
    lectures: 95,
    labs: 24,
    onlineClasses: 12,
    occupiedRooms: 18,
    availableRooms: 12,
    teachersScheduled: 48,
    todaySchedule: [
      { period: '08:00-09:00', subject: 'Data Structures', teacher: 'Dr. Usman', room: 'Lab 1', class: 'CS-3A' },
      { period: '09:00-10:00', subject: 'Calculus I', teacher: 'Prof. Sara', room: 'Room 201', class: 'BBA-2B' },
      { period: '10:00-11:00', subject: 'Physics Lab', teacher: 'Dr. Ali', room: 'Lab 3', class: 'ENG-1A' },
      { period: '11:00-12:00', subject: 'English Comp.', teacher: 'Ms. Fatima', room: 'Room 105', class: 'CS-3A' },
      { period: '12:00-13:00', subject: 'Break', teacher: '-', room: '-', class: '-' },
      { period: '13:00-14:00', subject: 'Database Systems', teacher: 'Dr. Usman', room: 'Lab 2', class: 'CS-3A' },
      { period: '14:00-15:00', subject: 'Linear Algebra', teacher: 'Prof. Sara', room: 'Room 203', class: 'BBA-2B' },
    ],
    roomUtilization: [
      { room: 'Lab 1', used: 6, total: 8 },
      { room: 'Lab 2', used: 5, total: 8 },
      { room: 'Lab 3', used: 7, total: 8 },
      { room: 'Room 101', used: 4, total: 8 },
      { room: 'Room 105', used: 6, total: 8 },
      { room: 'Room 201', used: 3, total: 8 },
    ],
    teacherWorkload: [
      { teacher: 'Dr. Usman', hours: 18 },
      { teacher: 'Prof. Sara', hours: 15 },
      { teacher: 'Dr. Ali', hours: 20 },
      { teacher: 'Ms. Fatima', hours: 12 },
      { teacher: 'Dr. Khan', hours: 16 },
    ],
    upcomingExams: [
      { name: 'Mid-Term Exams', date: 'Aug 15-30', type: 'Exam', color: '#ef4444' },
      { name: 'Faculty Meeting', date: 'Aug 10', type: 'Meeting', color: '#3b82f6' },
      { name: 'Sports Gala', date: 'Aug 25', type: 'Event', color: '#10b981' },
      { name: 'Workshop: AI in Edu', date: 'Sep 5', type: 'Workshop', color: '#8b5cf6' },
    ],
  };

  const d = mockData;

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error('Error loading Timetable Dashboard', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const roomUtilData = {
    labels: d.roomUtilization.map(x => x.room),
    datasets: [
      { label: 'Used Periods', data: d.roomUtilization.map(x => x.used), backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 },
      { label: 'Available', data: d.roomUtilization.map(x => x.total - x.used), backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 6 },
    ],
  };

  const workloadData = {
    labels: d.teacherWorkload.map(x => x.teacher),
    datasets: [{
      label: 'Hours/Week',
      data: d.teacherWorkload.map(x => x.hours),
      backgroundColor: ['rgba(99,102,241,0.7)', 'rgba(16,185,129,0.7)', 'rgba(245,158,11,0.7)', 'rgba(239,68,68,0.7)', 'rgba(139,92,246,0.7)'],
      borderRadius: 6,
    }],
  };

  const stackedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { boxWidth: 12, padding: 8, color: mutedColor, font: { size: 10 } } },
      tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: isDark ? '#f1f5f9' : '#1e293b', bodyColor: isDark ? '#94a3b8' : '#64748b', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderWidth: 1, cornerRadius: 10, padding: 10 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
      y: { stacked: true, beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: isDark ? '#f1f5f9' : '#1e293b', bodyColor: isDark ? '#94a3b8' : '#64748b', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderWidth: 1, cornerRadius: 10, padding: 10 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
      y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
    },
  };

  if (loading) {
    return (
      <div className="p-3">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div className="col-xl col-lg-4 col-md-6" key={i}>
              <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '130px', borderRadius: '18px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6' }}>
                <div className="skeleton-line w-50 mb-3" style={{ height: '15px' }}></div>
                <div className="skeleton-line w-75 mb-2" style={{ height: '25px' }}></div>
                <div className="skeleton-line w-25" style={{ height: '10px' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4 g-4">
          <div className="col-lg-8">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div>
          </div>
          <div className="col-lg-4">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2 ${isDark ? 'text-white' : ''}`} style={{ background: isDark ? '#0b0f1a' : '#f8f9fc', minHeight: '100vh' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Timetable Dashboard</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Schedule management, room utilization, and teacher workload</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <KPICard title="Total Timetables" value={d.totalTimetables} icon={faCalendarAlt} color="#6366f1" subText="Active schedules" trend="up" trendValue="3" />
        <KPICard title="Today's Classes" value={d.todayClasses} icon={faPlay} color="#10b981" subText="Scheduled today" />
        <KPICard title="Lectures" value={d.lectures} icon={faChalkboardTeacher} color="#3b82f6" subText="Theory sessions" />
        <KPICard title="Labs" value={d.labs} icon={faFlask} color="#f59e0b" subText="Practical sessions" />
        <KPICard title="Online Classes" value={d.onlineClasses} icon={faGlobe} color="#8b5cf6" subText="Virtual sessions" />
        <KPICard title="Occupied Rooms" value={d.occupiedRooms} icon={faDoorOpen} color="#ef4444" subText={`${d.availableRooms} available`} />
        <KPICard title="Teachers Scheduled" value={d.teachersScheduled} icon={faUsers} color="#ec4899" subText="Active faculty" />
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Today's Schedule</h5>
              <FontAwesomeIcon icon={faClock} style={{ color: mutedColor }} />
            </div>
            <div className="table-responsive" style={{ maxHeight: '340px' }}>
              <table className="table table-hover align-middle mb-0">
                <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                  <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                    <th>Period</th>
                    <th>Subject</th>
                    <th>Teacher</th>
                    <th>Room</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {d.todaySchedule.map((s, idx) => (
                    <tr key={idx} className={s.subject === 'Break' ? 'opacity-50' : ''}>
                      <td className="small fw-semibold">{s.period}</td>
                      <td className="small">
                        {s.subject === 'Break' ? <span className="badge bg-warning-subtle text-warning rounded-pill">Break</span> : s.subject}
                      </td>
                      <td className="small">{s.teacher}</td>
                      <td className="small">{s.room}</td>
                      <td className="small">{s.class}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Room Utilization</h5>
              <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Daily</span>
            </div>
            <div style={{ height: '250px' }}>
              <Bar data={roomUtilData} options={stackedOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-5">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Teacher Workload</h5>
              <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Hours/week</span>
            </div>
            <div style={{ height: '250px' }}>
              <Bar data={workloadData} options={{
                ...barOptions,
                indexAxis: 'y',
                scales: {
                  x: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
                  y: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
                },
              }} />
            </div>
          </div>
        </div>
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '15px', color: textColor }}>Upcoming Exams & Events</h5>
              <FontAwesomeIcon icon={faStar} style={{ color: mutedColor }} />
            </div>
            <div className="row g-3">
              {d.upcomingExams.map((evt, idx) => (
                <motion.div className="col-md-6" key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="p-3 rounded-4 d-flex align-items-start gap-3" style={{
                    background: `${evt.color}10`,
                    border: `1px solid ${evt.color}20`,
                  }}>
                    <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '40px', height: '40px', background: `${evt.color}15` }}>
                      <FontAwesomeIcon icon={evt.type === 'Exam' ? faPenFancy : evt.type === 'Meeting' ? faHandshake : faStar} style={{ color: evt.color, fontSize: '16px' }} />
                    </div>
                    <div>
                      <div className="fw-bold small" style={{ color: textColor }}>{evt.name}</div>
                      <div className="x-small" style={{ color: mutedColor }}>{evt.date}</div>
                      <span className="badge rounded-pill px-2 py-1 mt-1 x-small" style={{ background: `${evt.color}20`, color: evt.color }}>{evt.type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .x-small { font-size: 11px; }
        .skeleton-card { border-radius: 18px; }
        .skeleton-line { border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

const KPICard = ({ title, value, icon, color, subText, trend, trendValue }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <motion.div
      className="col-xl col-lg-4 col-md-6"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className={`card border-0 shadow-sm h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="p-3 rounded-3 d-flex align-items-center justify-content-center" style={{ background: `${color}15`, color }}>
              <FontAwesomeIcon icon={icon} size="lg" />
            </div>
            {trend && (
              <div className="badge rounded-pill bg-success-subtle text-success border-0 px-2 py-1" style={{ fontSize: '10px' }}>
                <FontAwesomeIcon icon={faArrowUp} className="me-1" style={{ fontSize: '8px' }} />
                {trendValue}
              </div>
            )}
          </div>
          <div className="small fw-bold text-uppercase mb-1" style={{ fontSize: '10.5px', letterSpacing: '0.3px', color: mutedColor }}>{title}</div>
          <div className="h3 fw-bold mb-1" style={{ fontSize: '22px', color: textColor }}>{value}</div>
          <div className="x-small" style={{ color: mutedColor, fontSize: '10.5px' }}>{subText}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TimetableDashboard;
