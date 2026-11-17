import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlask, faTrophy, faBookOpen, faLightbulb, faUsers,
  faGlobe, faRocket, faDollarSign, faChartLine, faChartBar, faChartPie,
  faArrowRight, faPlus, faExclamationTriangle, faMicroscope, faStar
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const ResearchDashboard = () => {
  const { theme } = useApp();
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
          projects: 85, grants: 120, publications: 340, patents: 28,
          researchers: 95, conferences: 45, activeProjects: 52, grantValue: 25000000,
          researchOutput: [28, 32, 25, 38, 42, 35, 40, 48, 45, 50, 55, 58],
          grantDistribution: { labels: ['Government', 'Private', 'International', 'Internal'], data: [45, 32, 28, 15] },
          deptResearch: { labels: ['CS', 'Engineering', 'Medicine', 'Sciences', 'Business', 'Arts'], data: [25, 22, 18, 15, 10, 8] },
          recentPublications: [
            { id: 1, title: 'AI in Education', authors: 'Ali Khan et al.', journal: 'Nature Education', year: 2026 },
            { id: 2, title: 'Quantum Computing Advances', authors: 'Sara Ali et al.', journal: 'Science', year: 2026 },
            { id: 3, title: 'Climate Change Models', authors: 'Usman Raza et al.', journal: 'Environmental Research', year: 2025 },
            { id: 4, title: 'Nanotechnology Breakthroughs', authors: 'Fatima Noor et al.', journal: 'Nano Letters', year: 2026 },
            { id: 5, title: 'Blockchain Security', authors: 'Hassan Shah et al.', journal: 'IEEE Security', year: 2025 },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load research dashboard');
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

  const outputData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Publications', data: stats.researchOutput, borderColor: colors.primary, backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }],
  };

  const grantData = {
    labels: stats.grantDistribution.labels,
    datasets: [{ data: stats.grantDistribution.data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4'], borderWidth: 0 }],
  };

  const deptData = {
    labels: stats.deptResearch.labels,
    datasets: [{ label: 'Projects', data: stats.deptResearch.data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'], borderRadius: 6 }],
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
            <FontAwesomeIcon icon={faMicroscope} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Research Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Monitor research projects, publications, and grants</p>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Projects', value: stats.projects, icon: faFlask, color: colors.primary },
          { title: 'Grants', value: stats.grants, icon: faDollarSign, color: colors.success },
          { title: 'Publications', value: stats.publications, icon: faBookOpen, color: colors.info },
          { title: 'Patents', value: stats.patents, icon: faLightbulb, color: colors.warning },
          { title: 'Researchers', value: stats.researchers, icon: faUsers, color: colors.purple },
          { title: 'Conferences', value: stats.conferences, icon: faGlobe, color: colors.pink },
          { title: 'Active Projects', value: stats.activeProjects, icon: faRocket, color: colors.success },
          { title: 'Grant Value', value: `Rs.${(stats.grantValue / 10000000).toFixed(1)}Cr`, icon: faTrophy, color: colors.primary },
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
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Research Output</h6>
              <div style={{ height: '220px' }}><Line data={outputData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Grant Distribution</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={grantData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Department Research</h6>
              <div style={{ height: '220px' }}><Bar data={deptData} options={chartOpts} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Publications</h6>
            <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
          </div>
          {stats.recentPublications.map((pub, idx) => (
            <div key={pub.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: `${colors.primary}15` }}>
                <FontAwesomeIcon icon={faStar} style={{ color: colors.primary, fontSize: '14px' }} />
              </div>
              <div className="flex-grow-1">
                <div className="small fw-bold" style={{ color: textColor }}>{pub.title}</div>
                <div className="x-small" style={{ color: mutedColor }}>{pub.authors} - {pub.journal} ({pub.year})</div>
              </div>
              <span className="badge rounded-pill bg-primary-subtle text-primary x-small">{pub.year}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default ResearchDashboard;
