import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faCheckCircle, faClock, faBookmark, faExclamationTriangle,
  faTimesCircle, faBookOpen, faUsers, faEye, faMoneyBillWave,
  faChartBar, faChartLine, faChartPie, faArrowRight, faPlus,
  faUserGraduate, faArrowUp, faArrowDown, faHistory
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const LibraryDashboard = () => {
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
          totalBooks: 12500,
          available: 8200,
          issued: 3500,
          reserved: 400,
          overdue: 280,
          lost: 120,
          digitalBooks: 2400,
          members: 5600,
          activeReaders: 3200,
          fineCollected: 45800,
          bookCategories: [
            { name: 'Science', count: 2800 },
            { name: 'Literature', count: 2200 },
            { name: 'Technology', count: 1900 },
            { name: 'History', count: 1500 },
            { name: 'Arts', count: 1200 },
            { name: 'Mathematics', count: 1100 },
            { name: 'Philosophy', count: 800 },
            { name: 'Other', count: 1000 },
          ],
          monthlyCirculation: [420, 560, 480, 620, 580, 490, 530, 680, 590, 510, 640, 720],
          mostBorrowed: [
            { name: 'Introduction to AI', count: 145 },
            { name: 'Calculus Made Easy', count: 128 },
            { name: 'The Great Gatsby', count: 112 },
            { name: 'Clean Code', count: 98 },
            { name: 'Atomic Habits', count: 85 },
          ],
          recentTransactions: [
            { id: 1, member: 'Ali Ahmed', book: 'Introduction to AI', type: 'Issued', date: '5 min ago' },
            { id: 2, member: 'Sara Khan', book: 'Calculus Made Easy', type: 'Returned', date: '15 min ago' },
            { id: 3, member: 'Usman Ali', book: 'The Great Gatsby', type: 'Issued', date: '30 min ago' },
            { id: 4, member: 'Fatima Noor', book: 'Clean Code', type: 'Overdue', date: '1 hour ago' },
            { id: 5, member: 'Hassan Raza', book: 'Atomic Habits', type: 'Returned', date: '2 hours ago' },
          ],
        });
      } catch (err) {
        setError(err.message || 'Failed to load library dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const colors = {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
  };

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

  const categoryData = {
    labels: stats.bookCategories.map(c => c.name),
    datasets: [{
      data: stats.bookCategories.map(c => c.count),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#f97316', '#94a3b8'],
      borderWidth: 0,
      hoverOffset: 10,
    }],
  };

  const circulationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Books Circulated',
      data: stats.monthlyCirculation,
      borderColor: colors.primary,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const borrowedData = {
    labels: stats.mostBorrowed.map(b => b.name),
    datasets: [{
      label: 'Times Borrowed',
      data: stats.mostBorrowed.map(b => b.count),
      backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'],
      borderRadius: 6,
    }],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: isDark ? '#1e293b' : '#fff', titleColor: textColor, bodyColor: mutedColor, borderColor: borderColor, borderWidth: 1, cornerRadius: 10, padding: 10 } },
    scales: {
      y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }, ticks: { color: mutedColor, font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { color: mutedColor, font: { size: 10 } } },
    },
  };

  return (
    <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`} style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.1)', color: colors.primary }}>
            <FontAwesomeIcon icon={faBook} size="xl" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: textColor }}>Library Dashboard</h4>
            <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Track books, members, and circulation</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('library')}>
            <FontAwesomeIcon icon={faPlus} /> Issue Book
          </button>
          <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2" onClick={() => setActiveTab?.('library')}>
            <FontAwesomeIcon icon={faPlus} /> Add Book
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {[
          { title: 'Total Books', value: stats.totalBooks.toLocaleString(), icon: faBook, color: colors.primary },
          { title: 'Available', value: stats.available.toLocaleString(), icon: faCheckCircle, color: colors.success },
          { title: 'Issued', value: stats.issued.toLocaleString(), icon: faBookmark, color: colors.info },
          { title: 'Reserved', value: stats.reserved, icon: faClock, color: colors.warning },
          { title: 'Overdue', value: stats.overdue, icon: faExclamationTriangle, color: colors.danger },
          { title: 'Lost', value: stats.lost, icon: faTimesCircle, color: colors.danger },
          { title: 'Digital Books', value: stats.digitalBooks.toLocaleString(), icon: faBookOpen, color: colors.purple },
          { title: 'Members', value: stats.members.toLocaleString(), icon: faUsers, color: colors.primary },
          { title: 'Active Readers', value: stats.activeReaders.toLocaleString(), icon: faEye, color: colors.success },
          { title: 'Fine Collected', value: `Rs.${(stats.fineCollected / 1000).toFixed(1)}K`, icon: faMoneyBillWave, color: colors.warning },
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
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Book Categories</h6>
              <div style={{ height: '220px' }}>
                <Doughnut data={categoryData}
                  options={{ responsive: true, maintainAspectRatio: false, cutout: '65%',
                    plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 10 }, color: mutedColor } } } }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Monthly Circulation</h6>
              <div style={{ height: '220px' }}>
                <Line data={circulationData} options={chartOpts} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>Most Borrowed</h6>
              <div style={{ height: '220px' }}>
                <Bar data={borrowedData} options={{ ...chartOpts, indexAxis: 'y', scales: { ...chartOpts.scales, x: { ...chartOpts.scales.y, beginAtZero: true }, y: { ...chartOpts.scales.x } } }} />
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
                <h6 className="fw-bold mb-0" style={{ color: textColor }}>Recent Transactions</h6>
                <button className="btn btn-sm btn-link text-decoration-none" style={{ color: colors.primary }}>View All <FontAwesomeIcon icon={faArrowRight} size="xs" /></button>
              </div>
              {stats.recentTransactions.map((txn, idx) => (
                <div key={txn.id} className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{
                    width: '38px', height: '38px',
                    background: txn.type === 'Returned' ? `${colors.success}15` : txn.type === 'Overdue' ? `${colors.danger}15` : `${colors.info}15`
                  }}>
                    <FontAwesomeIcon icon={txn.type === 'Returned' ? faCheckCircle : txn.type === 'Overdue' ? faExclamationTriangle : faBookmark}
                      style={{ color: txn.type === 'Returned' ? colors.success : txn.type === 'Overdue' ? colors.danger : colors.info, fontSize: '14px' }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-bold" style={{ color: textColor }}>{txn.member}</div>
                    <div className="x-small" style={{ color: mutedColor }}>{txn.book}</div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className={`badge rounded-pill x-small fw-semibold ${txn.type === 'Returned' ? 'bg-success-subtle text-success' : txn.type === 'Overdue' ? 'bg-danger-subtle text-danger' : 'bg-info-subtle text-info'}`}>
                      {txn.type}
                    </span>
                    <div className="x-small text-muted mt-1">{txn.date}</div>
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
                { label: 'Issue Book', icon: faBookmark, color: colors.success, desc: 'Issue to member' },
                { label: 'Return Book', icon: faCheckCircle, color: colors.info, desc: 'Process return' },
                { label: 'Add New Book', icon: faPlus, color: colors.primary, desc: 'Catalog a book' },
                { label: 'Add Member', icon: faUsers, color: colors.purple, desc: 'Register member' },
                { label: 'Collect Fine', icon: faMoneyBillWave, color: colors.warning, desc: 'Overdue fines' },
              ].map((act, idx) => (
                <button key={idx}
                  className="btn w-100 text-start p-3 mb-2 rounded-3 d-flex align-items-center gap-3 transition"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
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

export default LibraryDashboard;
