import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { getTmsStats } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faCheckCircle,
  faClock,
  faCalendarCheck,
  // faChartLine,
  // faUserGroup,
  faPlus,
  // faFilter,
  faCircle,
  faEllipsisVertical,
  faChartLine,
  faRocket,
  faLayerGroup,
  faArrowRight,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// New Widgets
import DashboardCalendar from './widgets/DashboardCalendar';
import UpcomingTasksTimeline from './widgets/UpcomingTasksTimeline';
import WorkProgressCards from './widgets/WorkProgressCards';
import WorkStatusChart from './widgets/WorkStatusChart';

const TmsDashboard = () => {
  const { theme, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const data = await getTmsStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch TMS stats", error);
        setError(error.message || 'Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = {
    primary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#0ea5e9',
    text: isDark ? '#f1f5f9' : '#1e293b',
    grid: isDark ? '#334155' : '#f1f5f9'
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4 fade-in">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '400px' }}>
          <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: textColor }}>Failed to Load Dashboard</h5>
          <p className="text-muted mb-3 text-center" style={{ maxWidth: '400px' }}>{error}</p>
          <button className="btn btn-primary rounded-pill px-4" onClick={() => { setLoading(true); setError(null); setStats(null); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusData = {
    labels: ['To Do', 'In Progress', 'Testing', 'Done'],
    datasets: [{
      data: [
        stats.statusDistribution['To Do'] || 0,
        stats.statusDistribution['In Progress'] || 0,
        stats.statusDistribution['Testing'] || 0,
        stats.statusDistribution['Done'] || 0
      ],
      backgroundColor: [colors.info, colors.warning, colors.primary, colors.success],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const taskTrendData = {
    labels: stats.trend.map(t => t.day),
    datasets: [{
      label: 'Tasks Completed',
      data: stats.trend.map(t => t.count),
      borderColor: colors.primary,
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="row g-4">
        {/* Main Content */}
        <div className="col-xl-12">
          {/* High-End Professional Hero Header */}
          <div className=" border-0 shadow-lg rounded-5 overflow-hidden mb-5 bg-white">
            <div 
              className="p-4 p-lg-5 text-white position-relative" 
              style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
            >
              {/* Abstract Background Elements */}
              <div className="position-absolute top-0 end-0 p-5 opacity-10" style={{ transform: 'rotate(15deg) translate(20%, -20%)' }}>
                <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '18rem' }} />
              </div>
              <div className="position-absolute bottom-0 start-0 opacity-10" style={{ transform: 'translate(-10%, 30%)' }}>
                <div style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'linear-gradient(45deg, #6366f1, #a855f7)', filter: 'blur(80px)' }}></div>
              </div>

              <div className="row align-items-center g-4 position-relative z-2">
                <div className="col-xl-7 col-lg-6">
                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div 
                      className="bg-white bg-opacity-10 d-flex align-items-center justify-content-center shadow-lg transition-all hover-lift" 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '24px',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <FontAwesomeIcon icon={faRocket} className="fs-1 text-primary" />
                    </div>
                    <div>
                      <div className="badge bg-primary bg-opacity-20 text-white rounded-pill px-3 py-2 fw-bold small mb-2 text-uppercase letter-spacing-wider">
                        <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
                        Operational Intelligence
                      </div>
                      <h1 className="fw-bold mb-1 display-5" style={{ letterSpacing: '-0.03em' }}>TMS Overview</h1>
                      <p className="mb-0 opacity-75 fs-5">Managing <span className="fw-bold text-white">{stats.stats.totalTasks} tasks</span> across <span className="fw-bold text-white">{stats.projectCount} active projects</span>.</p>
                    </div>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-3">
                    <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow transition hover-lift-lg border-0" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }} onClick={() => setActiveTab('tms_add_task')}>
                      <FontAwesomeIcon icon={faPlus} className="me-2" />
                      New Task
                    </button>
                    <button className="btn btn-white bg-white bg-opacity-10 text-white border-white border-opacity-25 rounded-pill px-4 py-2 fw-bold transition hover-bg-white" onClick={() => setActiveTab('tms_tasks')}>
                      Task Board <FontAwesomeIcon icon={faArrowRight} className="ms-2 small" />
                    </button>
                  </div>
                </div>

                <div className="col-xl-5 col-lg-6">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur shadow-sm">
                        <div className="x-small fw-bold text-uppercase text-white-50 mb-1">Productivity</div>
                        <div className="h2 fw-bold mb-0">84%</div>
                        <div className="progress mt-2" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                          <div className="progress-bar bg-success" style={{ width: '84%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-4 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 backdrop-blur shadow-sm">
                        <div className="x-small fw-bold text-uppercase text-white-50 mb-1">Active Projects</div>
                        <div className="h2 fw-bold mb-0">{stats.projectCount}</div>
                        <div className="d-flex align-items-center gap-2 mt-2">
                            <div className="pulse-dot bg-success"></div>
                            <span className="x-small fw-bold text-success text-uppercase">Synchronized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="row g-4 mb-4">
            {[
              { title: 'Total Tasks', value: stats.stats.totalTasks, subtitle: `Across ${stats.projectCount} projects`, icon: faTasks, color: '#8b5cf6' },
              { title: 'In Progress', value: stats.stats.inProgress, subtitle: 'Active tasks', icon: faClock, color: '#f59e0b' },
              { title: 'Completed', value: stats.stats.completed, subtitle: 'Fully done', icon: faCheckCircle, color: '#10b981' },
              { title: 'Due Today', value: stats.stats.dueToday, subtitle: 'Critical deadlines', icon: faCalendarCheck, color: '#ef4444' }
            ].map((stat, idx) => (
              <div key={idx} className="col-xl-3 col-md-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-3 rounded-4 shadow-sm" style={{ backgroundColor: `${stat.color}1a`, color: stat.color }}>
                        <FontAwesomeIcon icon={stat.icon} size="lg" />
                      </div>
                      <button className="btn btn-link text-muted p-0"><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                    </div>
                    <h6 className="text-muted small mb-1">{stat.title}</h6>
                    <h3 className="fw-bold mb-1">{stat.value}</h3>
                    <p className="text-muted x-small mb-0">{stat.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-xl-8">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Task Completion Trend</h5>
                        <div style={{ height: '300px' }}>
                            <Line 
                                data={taskTrendData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { grid: { color: colors.grid, drawBorder: false }, ticks: { color: colors.text } },
                                        x: { grid: { display: false }, ticks: { color: colors.text } }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Tasks by Status</h5>
                        <div style={{ height: '240px', position: 'relative' }}>
                            <Doughnut 
                                data={statusData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '75%',
                                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } } }
                                }}
                            />
                            <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <h3 className="fw-bold mb-0">{stats.stats.inProgress}</h3>
                                <p className="x-small text-muted mb-0">Active</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-top">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faCircle} className="x-small" style={{ color: colors.success }} />
                                    <span className="small">On Track</span>
                                </div>
                                <span className="small fw-bold">{Math.round((stats.stats.completed / (stats.stats.totalTasks || 1)) * 100)}%</span>
                            </div>
                            <div className="progress rounded-pill" style={{ height: '6px' }}>
                                <div className="progress-bar bg-success" style={{ width: `${(stats.stats.completed / (stats.stats.totalTasks || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-xl-6">
                <div className="card border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Priority Distribution</h5>
                        {[
                            { label: 'Critical', count: stats.priorityDistribution.Critical || 0, color: '#ef4444' },
                            { label: 'High', count: stats.priorityDistribution.High || 0, color: '#f59e0b' },
                            { label: 'Medium', count: stats.priorityDistribution.Medium || 0, color: '#8b5cf6' },
                            { label: 'Low', count: stats.priorityDistribution.Low || 0, color: '#10b981' }
                        ].map((prio, idx) => {
                            const total = stats.stats.totalTasks || 1;
                            const percent = Math.round((prio.count / total) * 100);
                            return (
                                <div key={idx} className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small fw-medium">{prio.label}</span>
                                        <span className="small text-muted">{prio.count} Tasks</span>
                                    </div>
                                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                                        <div className="progress-bar" style={{ width: `${percent}%`, backgroundColor: prio.color }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="col-xl-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-4">Upcoming Milestones</h5>
                        {stats.upcomingMilestones.map((ms, idx) => (
                            <div key={idx} className="p-3 rounded-3 border bg-light mb-3 transition hover-lift cursor-pointer">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 className="fw-bold text-dark mb-0 small">{ms.title}</h6>
                                        <span className="x-small text-muted">{ms.project}</span>
                                    </div>
                                    <span className="badge bg-white text-secondary border x-small">{ms.date}</span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="flex-grow-1">
                                        <div className="progress rounded-pill" style={{ height: '6px' }}>
                                            <div className="progress-bar" style={{ width: `${ms.progress}%`, backgroundColor: '#8b5cf6' }}></div>
                                        </div>
                                    </div>
                                    <span className="x-small fw-bold">{ms.progress}%</span>
                                </div>
                            </div>
                        ))}
                        {stats.upcomingMilestones.length === 0 && (
                            <div className="text-center py-4 text-muted small">No upcoming milestones</div>
                        )}
                    </div>
                </div>
            </div>
          </div>

          {/* New Productivity Widgets Section */}
          <div className="row g-4 mt-2">
            {/* Left Column */}
            <div className="col-xl-6">
              <div className="row g-4">
                <div className="col-12">
                  <DashboardCalendar taskDates={stats.taskDates || []} />
                </div>
                <div className="col-12">
                  <WorkProgressCards activeTasks={stats.activeTasks || []} />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-xl-6">
              <div className="row g-4">
                <div className="col-12">
                  <UpcomingTasksTimeline upcomingTasks={stats.upcomingTasks || []} />
                </div>
                <div className="col-12">
                  <WorkStatusChart statusDistribution={stats.statusDistribution || {}} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .backdrop-blur { backdrop-filter: blur(12px); }
        .x-small { font-size: 10px; }
        .letter-spacing-wider { letter-spacing: 0.1em; }
        .transition-all { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-3px); }
        .hover-lift-lg:hover { transform: translateY(-10px); shadow: 0 1.5rem 4rem rgba(0,0,0,0.15); }
        .btn-white:hover { background-color: rgba(255,255,255,0.2) !important; }
        
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse-green 2s infinite;
        }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
};

export default TmsDashboard;
