import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave, faClock, faCheckCircle, faGraduationCap,
  faExclamationTriangle, faUsers, faPercent, faChartLine,
  faChartPie, faChartBar, faArrowRight, faPlus,
  faFileInvoice, faHandHoldingUsd, faUniversity
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const FeesDashboard = () => {
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
          monthlyRevenue: 4500000, pendingFees: 850000, collectedFees: 3200000, scholarships: 450000,
          outstandingBalance: 1200000, paidStudents: 3200, defaulters: 180, collectionPercent: 85,
          collectionTrend: [2800000, 3100000, 2900000, 3400000, 3200000, 3600000, 3500000, 3800000, 4200000, 3900000, 4300000, 4500000],
          feeStatus: { labels: ['Paid', 'Pending', 'Overdue', 'Scholarship'], data: [65, 18, 10, 7] },
          deptCollection: { labels: ['CS', 'Engineering', 'Business', 'Medicine', 'Arts', 'Law'], data: [1200000, 980000, 850000, 720000, 450000, 380000] },
          recentPayments: [
            { id: 1, student: 'Ali Ahmed', amount: 45000, type: 'Tuition Fee', date: '5 min ago', status: 'Completed' },
            { id: 2, student: 'Sara Khan', amount: 45000, type: 'Tuition Fee', date: '15 min ago', status: 'Completed' },
            { id: 3, student: 'Usman Ali', amount: 12000, type: 'Lab Fee', date: '30 min ago', status: 'Pending' },
            { id: 4, student: 'Fatima Noor', amount: 25000, type: 'Hostel Fee', date: '1 hour ago', status: 'Completed' },
            { id: 5, student: 'Hassan Raza', amount: 45000, type: 'Tuition Fee', date: '2 hours ago', status: 'Failed' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load fees dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = { primary: '#6366f1', success: '#10b981', warning: '#f59e0b', danger: '#ef4444', info: '#06b6d4', purple: '#8b5cf6', pink: '#ec4899' };

  if (loading) {
    return <div className="container-fluid py-4"><div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}><div className="spinner-border text-primary" /></div></div>;
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

  const fmt = (v) => `Rs.${(v / 100000).toFixed(1)}L`;
  const trendData = { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], datasets: [{ label: 'Collection', data: stats.collectionTrend, borderColor: colors.success, backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 }] };
  const statusData = { labels: stats.feeStatus.labels, datasets: [{ data: stats.feeStatus.data, backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1'], borderWidth: 0 }] };
  const deptData = { labels: stats.deptCollection.labels, datasets: [{ label: 'Collection', data: stats.deptCollection.data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'], borderRadius: 6 }] };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: { y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 }, callback: v => `Rs.${(v/100000).toFixed(0)}L` } }, x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } } },
  };

  return (
    <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.1)', color: colors.primary }}><FontAwesomeIcon icon={faMoneyBillWave} size="xl" /></div>
          <div><h4 className="fw-bold mb-0" style={{ color: textColor }}>Fees Dashboard</h4><p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Track fee collections and financials</p></div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faPlus} /> Collect Fee</button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"><FontAwesomeIcon icon={faFileInvoice} /> Create Invoice</button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Monthly Revenue', value: fmt(stats.monthlyRevenue), icon: faMoneyBillWave, color: colors.primary },
          { title: 'Pending Fees', value: fmt(stats.pendingFees), icon: faClock, color: colors.warning },
          { title: 'Collected Fees', value: fmt(stats.collectedFees), icon: faCheckCircle, color: colors.success },
          { title: 'Scholarships', value: fmt(stats.scholarships), icon: faGraduationCap, color: colors.info },
          { title: 'Outstanding', value: fmt(stats.outstandingBalance), icon: faExclamationTriangle, color: colors.danger },
          { title: 'Paid Students', value: stats.paidStudents, icon: faUsers, color: colors.success },
          { title: 'Defaulters', value: stats.defaulters, icon: faUsers, color: colors.danger },
          { title: 'Collection %', value: `${stats.collectionPercent}%`, icon: faPercent, color: colors.purple },
        ].map((stat, idx) => (
          <div key={idx} className="col-xl col-lg-3 col-md-4 col-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${stat.color}1a` }}><FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: '14px' }} /></div>
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
            <div className="card-body p-4"><h6 className="fw-bold mb-3" style={{ color: textColor }}>Collection Trend</h6><div style={{ height: '220px' }}><Line data={trendData} options={chartOpts} /></div></div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4"><h6 className="fw-bold mb-3" style={{ color: textColor }}>Fee Status</h6><div style={{ height: '220px' }}><Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} /></div></div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4"><h6 className="fw-bold mb-3" style={{ color: textColor }}>Department Collection</h6><div style={{ height: '220px' }}><Bar data={deptData} options={chartOpts} /></div></div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3"><h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Payments</h6><button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button></div>
              {stats.recentPayments.map((p, idx) => (
                <div key={p.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '38px', height: '38px', background: p.status === 'Completed' ? `${colors.success}15` : p.status === 'Failed' ? `${colors.danger}15` : `${colors.warning}15` }}>
                    <FontAwesomeIcon icon={p.status === 'Completed' ? faCheckCircle : p.status === 'Failed' ? faExclamationTriangle : faClock} style={{ color: p.status === 'Completed' ? colors.success : p.status === 'Failed' ? colors.danger : colors.warning, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1"><div className="small fw-bold" style={{ color: textColor }}>{p.student}</div><div className="x-small" style={{ color: mutedColor }}>{p.type} - Rs.{p.amount.toLocaleString()}</div></div>
                  <div className="text-end flex-shrink-0"><span className={`badge rounded-pill x-small fw-semibold ${p.status === 'Completed' ? 'bg-success-subtle text-success' : p.status === 'Failed' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning'}`}>{p.status}</span><div className="x-small text-muted mt-1">{p.date}</div></div>
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
                { label: 'Collect Fee', icon: faMoneyBillWave, color: colors.success, desc: 'Process fee payment' },
                { label: 'Create Invoice', icon: faFileInvoice, color: colors.primary, desc: 'Generate invoice' },
                { label: 'Scholarship', icon: faGraduationCap, color: colors.info, desc: 'Award scholarship' },
                { label: 'Send Reminder', icon: faBell, color: colors.warning, desc: 'Fee due reminders' },
              ].map((act, idx) => (
                <button key={idx} className="btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px', background: `${act.color}15` }}><FontAwesomeIcon icon={act.icon} style={{ color: act.color, fontSize: '14px' }} /></div>
                  <div className="flex-grow-1"><div className="small fw-bold" style={{ color: textColor }}>{act.label}</div><div className="x-small text-muted">{act.desc}</div></div>
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

export default FeesDashboard;
