import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faBriefcase,
  faCoffee,
  faHeadphones,
  faVideo,
  faHourglassHalf,
  faHistory,
  faMicrochip,
  faSpinner,
  faList,
  faUser,
  faCalendarDay,
  faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { getTmsStats, listAllTimeLogs, getTimeLogsWeeklySummary, getRecentTimeLogs } from '../../../../api/tms';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: '#f1f5f9' }, border: { display: false }, beginAtZero: true },
    x: { grid: { display: false }, border: { display: false } },
  },
};

const CATEGORY_KEYWORDS = [
  { key: 'meeting', label: 'Meetings', color: '#3B82F6' },
  { key: 'research', label: 'Research', color: '#64748B' },
  { key: 'admin', label: 'Admin', color: '#94A3B8' },
  { key: 'break', label: 'Breaks', color: '#F1F5F9' },
  { key: 'review', label: 'Code Review', color: '#F59E0B' },
  { key: 'design', label: 'Design', color: '#8B5CF6' },
];

const categorizeNote = (note) => {
  if (!note) return null;
  const lower = note.toLowerCase();
  for (const cat of CATEGORY_KEYWORDS) {
    if (lower.includes(cat.key)) return cat;
  }
  return null;
};

const TmsTimeUsageAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeLogs, setTimeLogs] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [tmsStats, setTmsStats] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [logs, weekly, recent, stats] = await Promise.all([
          listAllTimeLogs().catch(() => []),
          getTimeLogsWeeklySummary().catch(() => null),
          getRecentTimeLogs().catch(() => []),
          getTmsStats().catch(() => null),
        ]);
        setTimeLogs(Array.isArray(logs) ? logs : []);
        setWeeklySummary(weekly);
        setRecentLogs(Array.isArray(recent) ? recent : []);
        setTmsStats(stats);
      } catch { /* data unavailable */ }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const totalHours = useMemo(() => {
    if (timeLogs.length === 0) return 0;
    return timeLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / 3600;
  }, [timeLogs]);

  const avgDailyHours = useMemo(() => {
    if (timeLogs.length === 0) return 0;
    const days = new Set(timeLogs.map(l => l.start_time?.slice(0, 10)).filter(Boolean));
    return days.size > 0 ? totalHours / days.size : 0;
  }, [timeLogs, totalHours]);

  const activityBreakdown = useMemo(() => {
    const categorized = {};
    let uncategorized = 0;
    timeLogs.forEach(log => {
      const cat = categorizeNote(log.note);
      const label = cat ? cat.label : 'General Work';
      const color = cat ? cat.color : '#2828e2';
      const dur = (log.duration || 0) / 3600;
      if (!categorized[label]) categorized[label] = { hours: 0, color };
      categorized[label].hours += dur;
    });
    const total = Object.values(categorized).reduce((s, c) => s + c.hours, 0);
    if (total === 0) return [];
    return Object.entries(categorized).map(([label, data]) => ({
      label,
      hours: Math.round(data.hours * 10) / 10,
      pct: Math.round((data.hours / total) * 100),
      color: data.color,
    })).sort((a, b) => b.hours - a.hours);
  }, [timeLogs]);

  const doughnutData = useMemo(() => ({
    labels: activityBreakdown.map(a => a.label),
    datasets: [{
      data: activityBreakdown.map(a => a.hours),
      backgroundColor: activityBreakdown.map(a => a.color),
      borderWidth: 0,
    }],
  }), [activityBreakdown]);

  const weeklyTrendData = useMemo(() => {
    if (weeklySummary?.labels && weeklySummary?.data) {
      return {
        labels: weeklySummary.labels,
        datasets: [{
          label: 'Hours Tracked',
          data: weeklySummary.data,
          borderColor: '#2828e2',
          backgroundColor: 'rgba(40, 40, 226, 0.1)',
          fill: true, tension: 0.4,
        }],
      };
    }
    const dayTotals = {};
    timeLogs.forEach(log => {
      if (!log.start_time) return;
      const day = new Date(log.start_time).toLocaleDateString('en', { weekday: 'short' });
      dayTotals[day] = (dayTotals[day] || 0) + (log.duration || 0) / 3600;
    });
    const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const labels = order.filter(d => dayTotals[d]);
    const data = labels.map(d => Math.round(dayTotals[d] * 10) / 10);
    return {
      labels: labels.length > 0 ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Hours Tracked',
        data: data.length > 0 ? data : [0, 0, 0, 0, 0],
        borderColor: '#2828e2',
        backgroundColor: 'rgba(40, 40, 226, 0.1)',
        fill: true, tension: 0.4,
      }],
    };
  }, [timeLogs, weeklySummary]);

  const deepWorkPct = useMemo(() => {
    if (timeLogs.length === 0) return '0%';
    const long = timeLogs.filter(l => (l.duration || 0) >= 7200);
    const total = timeLogs.reduce((s, l) => s + (l.duration || 0), 0);
    if (total === 0) return '0%';
    const longDur = long.reduce((s, l) => s + (l.duration || 0), 0);
    return Math.round((longDur / total) * 100) + '%';
  }, [timeLogs]);

  const meetingHours = useMemo(() => {
    return timeLogs
      .filter(l => l.note?.toLowerCase().includes('meeting'))
      .reduce((s, l) => s + (l.duration || 0), 0) / 3600;
  }, [timeLogs]);

  const insightTip = useMemo(() => {
    if (timeLogs.length === 0) return 'Start tracking time on tasks to see personalized optimization insights.';
    if (meetingHours > totalHours * 0.3) {
      return 'Meeting time exceeds 30% of total tracked hours. Consider blocking focus hours in your calendar.';
    }
    if (avgDailyHours < 4) {
      return 'Average daily tracked time is below 4 hours. Ensure team members are consistently logging their work.';
    }
    const pct = parseInt(deepWorkPct);
    if (pct < 40) {
      return 'Deep work sessions (>2h) are below 40% of tracked time. Encourage longer uninterrupted focus blocks.';
    }
    return 'Great balance between focused work and collaborative time. Keep up the productive rhythm!';
  }, [timeLogs, totalHours, meetingHours, avgDailyHours, deepWorkPct]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 p-5">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-primary fs-1 mb-3" />
          <p className="text-muted">Loading time analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Time Distribution Intelligence</h2>
          <p className="text-muted small mb-0">
            {timeLogs.length > 0
              ? `Across ${timeLogs.length} time entries from ${new Set(timeLogs.map(l => l.start_time?.slice(0, 10)).filter(Boolean)).size} days`
              : 'Deep dive into workforce utilization and cognitive load.'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <span className="badge rounded-pill bg-light text-dark px-4 py-2 border fw-bold">
            <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" />{timeLogs.length} entries
          </span>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white h-100 position-relative overflow-hidden">
             <div className="position-relative" style={{ zIndex: 1 }}>
                <div className="bg-white bg-opacity-20 p-2 rounded-3 d-inline-block mb-3">
                    <FontAwesomeIcon icon={faBriefcase} className="fs-5" />
                </div>
                <h6 className="text-white text-opacity-75 small mb-1">Total Tracked Hours</h6>
                <h2 className="fw-bold mb-0 display-6">{Math.round(totalHours * 10) / 10}h</h2>
                <div className="mt-3 small text-white text-opacity-75">
                    <FontAwesomeIcon icon={faCalendarDay} className="me-1" /> Avg {Math.round(avgDailyHours * 10) / 10}h/day
                </div>
             </div>
             <FontAwesomeIcon icon={faClock} className="position-absolute bottom-0 end-0 fs-1 text-white opacity-10 m-3" style={{ fontSize: '120px' }} />
          </div>
        </div>

        <div className="col-lg-9">
          <div className="row g-4">
            {[
              { label: 'Deep Work', value: deepWorkPct, icon: faHeadphones, color: 'primary', help: 'Sessions > 2h' },
              { label: 'Meetings', value: Math.round(meetingHours * 10) / 10 + 'h', icon: faVideo, color: 'info', help: 'Meeting tagged entries' },
              { label: 'Idle Time', value: timeLogs.length > 0 ? Math.round((1 - timeLogs.reduce((s, l) => s + (l.duration || 0), 0) / Math.max(...timeLogs.map(l => l.duration || 0) || [1])) * 100) + '%' : '—', icon: faCoffee, color: 'secondary', help: 'vs max session' },
            ].map((item, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                  <div className={`text-${item.color} mb-2`}>
                    <FontAwesomeIcon icon={item.icon} className="fs-5" />
                  </div>
                  <h4 className="fw-bold mb-1">{item.value}</h4>
                  <p className="text-muted small mb-0 fw-bold text-uppercase letter-spacing-1">{item.label}</p>
                  <div className="mt-2 x-small text-muted">{item.help}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Activity Breakdown</h5>
            <div style={{ height: '220px' }} className="mb-4">
              {activityBreakdown.length > 0 ? (
                <Doughnut data={doughnutData} options={{ ...chartOptions, cutout: '70%' }} />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted small">
                  No time entry data to display
                </div>
              )}
            </div>
            <div className="d-grid gap-2">
              {activityBreakdown.length > 0 ? activityBreakdown.map((a, i) => (
                <div key={i} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light bg-opacity-50">
                  <div className="d-flex align-items-center gap-2">
                     <div className="rounded-circle" style={{ width: 8, height: 8, background: a.color }} />
                     <span className="small fw-semibold">{a.label}</span>
                  </div>
                  <span className="small text-muted fw-bold">{a.pct}% ({a.hours}h)</span>
                </div>
              )) : (
                <p className="text-muted small text-center py-3">Add time logs to tasks to see activity breakdown</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
             <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-primary">Weekly Time Velocity</h5>
                <div className="d-flex gap-2">
                   <div className="badge rounded-pill bg-light text-dark px-3 py-2 border">
                     Avg: {Math.round(avgDailyHours * 10) / 10}h/day
                   </div>
                </div>
             </div>
             <div style={{ height: '280px' }}>
                <Line data={weeklyTrendData} options={chartOptions} />
             </div>
             <div className="row g-3 mt-4">
               <div className="col-md-6">
                 <div className="p-3 bg-info bg-opacity-10 border-0 rounded-4 h-100">
                    <div className="d-flex align-items-center gap-3 text-info">
                       <FontAwesomeIcon icon={faMicrochip} className="fs-4" />
                       <div>
                          <h6 className="fw-bold mb-0">AI Optimization Tip</h6>
                          <p className="small mb-0 opacity-75">{insightTip}</p>
                       </div>
                    </div>
                 </div>
               </div>
               <div className="col-md-6">
                 <div className="p-3 bg-light rounded-4 h-100">
                   <h6 className="fw-bold mb-2 d-flex align-items-center gap-2 small text-uppercase letter-spacing-1">
                     <FontAwesomeIcon icon={faList} className="text-primary" /> Recent Entries
                   </h6>
                   {recentLogs.length > 0 ? (
                     <div className="d-grid gap-1">
                       {recentLogs.slice(0, 4).map((log, i) => (
                         <div key={i} className="d-flex justify-content-between align-items-center x-small text-muted py-1">
                           <span className="text-truncate">{log.note || log.task?.title || `Task #${log.task_id}`}</span>
                           <span className="fw-bold ms-2">{Math.round((log.duration || 0) / 60)}m</span>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="x-small text-muted mb-0">No recent time entries</p>
                   )}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .letter-spacing-1 { letter-spacing: 1px; }
        .x-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default TmsTimeUsageAnalytics;
