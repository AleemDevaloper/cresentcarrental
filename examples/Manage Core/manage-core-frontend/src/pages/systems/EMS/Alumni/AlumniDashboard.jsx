import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate, faCheckCircle, faBuilding, faBriefcase,
  faChartBar, faChartLine, faChartPie, faArrowRight, faPlus,
  faStar, faHandshake, faTrophy, faDonate, faUsers,
  faGraduationCap, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const AlumniDashboard = () => {
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
          totalAlumni: 5800, active: 3200, employers: 450, jobOpenings: 120,
          placements: 2800, placementRate: 78, mentors: 85, donations: 450000,
          gradYears: { labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'], data: [320, 380, 410, 450, 520, 580, 620, 680, 720, 780] },
          employmentSectors: { labels: ['IT', 'Finance', 'Education', 'Healthcare', 'Manufacturing', 'Other'], data: [1200, 850, 650, 420, 380, 300] },
          placementsTrend: [180, 220, 260, 310, 350, 400, 420, 450, 480, 520],
          successStories: [
            { id: 1, name: 'Ali Ahmed', batch: '2019', company: 'Google', role: 'Software Engineer', story: 'From campus to Silicon Valley' },
            { id: 2, name: 'Sara Khan', batch: '2020', company: 'Microsoft', role: 'Data Scientist', story: 'Leading AI research team' },
            { id: 3, name: 'Usman Ali', batch: '2018', company: 'McKinsey', role: 'Consultant', story: 'Top strategy consultant' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load alumni dashboard');
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

  const gradData = {
    labels: stats.gradYears.labels,
    datasets: [{ label: 'Graduates', data: stats.gradYears.data, backgroundColor: '#6366f1', borderRadius: 6 }],
  };

  const sectorData = {
    labels: stats.employmentSectors.labels,
    datasets: [{ data: stats.employmentSectors.data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'], borderWidth: 0 }],
  };

  const placementData = {
    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{ label: 'Placements', data: stats.placementsTrend, borderColor: colors.success, backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 }],
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
            <FontAwesomeIcon icon={faGraduationCap} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Alumni Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Track alumni engagement and career outcomes</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faBriefcase} /> Post Job</button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('alumni')}><FontAwesomeIcon icon={faPlus} /> Add Alumni</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Alumni', value: stats.totalAlumni.toLocaleString(), icon: faUserGraduate, color: colors.primary },
          { title: 'Active', value: stats.active.toLocaleString(), icon: faCheckCircle, color: colors.success },
          { title: 'Employers', value: stats.employers, icon: faBuilding, color: colors.info },
          { title: 'Job Openings', value: stats.jobOpenings, icon: faBriefcase, color: colors.warning },
          { title: 'Placements', value: stats.placements.toLocaleString(), icon: faTrophy, color: colors.success },
          { title: 'Placement Rate', value: `${stats.placementRate}%`, icon: faChartPie, color: colors.primary },
          { title: 'Mentors', value: stats.mentors, icon: faHandshake, color: colors.purple },
          { title: 'Donations', value: `Rs.${(stats.donations / 1000).toFixed(0)}K`, icon: faDonate, color: colors.pink },
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
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Graduation Year Distribution</h6>
              <div style={{ height: '220px' }}><Bar data={gradData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Employment Sectors</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={sectorData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Placements Trend</h6>
              <div style={{ height: '220px' }}><Line data={placementData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Success Stories</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.successStories.map((story, idx) => (
                <div key={story.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: `${colors.warning}15` }}>
                    <FontAwesomeIcon icon={faStar} style={{ color: colors.warning, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{story.name} - {story.company}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{story.role} | Batch {story.batch}</div>
                    <div className="x-small text-muted">{story.story}</div>
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
                { label: 'Add Alumni', icon: faPlus, color: colors.primary, desc: 'Register new alumni' },
                { label: 'Post Job', icon: faBriefcase, color: colors.success, desc: 'New job opening' },
                { label: 'Create Event', icon: faStar, color: colors.warning, desc: 'Organize alumni event' },
                { label: 'Record Donation', icon: faDonate, color: colors.purple, desc: 'Log contribution' },
                { label: 'Find Mentor', icon: faHandshake, color: colors.info, desc: 'Connect alumni' },
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

export default AlumniDashboard;
