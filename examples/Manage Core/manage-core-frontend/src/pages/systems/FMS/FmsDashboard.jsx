import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faArrowTrendUp, faArrowTrendDown,
  faWallet, faBuildingColumns, faFilter,
  faDownload, faFileExport, faRefresh, faBrain,
  faSpinner, faInfoCircle, faFileCsv, faFilePdf
} from "@fortawesome/free-solid-svg-icons";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { getFmsDashboard } from '../../../api/fms';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
};

const FmsDashboard = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('12m');

  const chartColors = {
    primary: '#0ea5e9', secondary: '#8b5cf6', success: '#10b981',
    danger: '#ef4444', warning: '#f59e0b',
    text: isDark ? '#f1f5f9' : '#1e293b',
    grid: isDark ? '#334155' : '#f1f5f9',
    bg: isDark ? '#1e293b' : '#ffffff'
  };

  const fetchDashboard = async () => {
    setLoading(true); setError(null);
    try {
      const res = await getFmsDashboard();
      setData(res.data || {});
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
      addNotification?.(err.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => {
    const onRefresh = () => fetchDashboard();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const handleExport = async () => {
    try {
      const blob = new Blob([JSON.stringify(data || {}, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `fms-dashboard-${new Date().toISOString().slice(0, 10)}.json`);
      addNotification?.('Dashboard data exported.', 'success');
    } catch (err) { addNotification?.(err.message, 'error'); }
  };

  const stats = data ? [
    { title: 'Total Balance', value: `$${(data.total_balance || 0).toLocaleString()}`, trend: 'Active', isUp: true, icon: faWallet, color: 'primary' },
    { title: 'Active Accounts', value: data.active_accounts || 0, trend: `of ${data.total_accounts || 0} total`, isUp: true, icon: faBuildingColumns, color: 'success' },
    { title: 'Open Fiscal Years', value: data.open_fiscal_years || 0, trend: `of ${data.total_fiscal_years || 0} total`, isUp: true, icon: faChartLine, color: 'info' },
    { title: 'Audit Health', value: `${data.audit_health || 0}%`, trend: data.audit_health >= 95 ? 'Excellent' : 'Needs Review', isUp: data.audit_health >= 80, icon: faFilter, color: data.audit_health >= 80 ? 'success' : 'warning' },
  ] : [];

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 79000, 85000, 92000, 105000],
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true, tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [32000, 35000, 31000, 42000, 38000, 45000, 48000, 44000, 52000, 55000, 58000, 62000],
        borderColor: chartColors.danger,
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        fill: true, tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: chartColors.text, boxWidth: 10, usePointStyle: true, pointStyle: 'circle' } },
      tooltip: { padding: 12, backgroundColor: chartColors.bg, titleColor: chartColors.text, bodyColor: chartColors.text, borderColor: chartColors.grid, borderWidth: 1 }
    },
    scales: {
      y: { grid: { color: chartColors.grid, drawBorder: false }, ticks: { color: chartColors.text, callback: (val) => '$' + val.toLocaleString() } },
      x: { grid: { display: false } }
    }
  };

  const expenseBreakdownData = {
    labels: ['Operations', 'Marketing', 'Salaries', 'Infrastructure', 'Other'],
    datasets: [{
      data: [35, 20, 30, 10, 5],
      backgroundColor: [chartColors.primary, chartColors.secondary, chartColors.success, chartColors.warning, '#94a3b8'],
      borderWidth: 0,
    }]
  };

  const recentTx = [
    { desc: 'AWS Cloud Services', cat: 'Infrastructure', date: 'May 12, 2026', amt: -1250.00 },
    { desc: 'Apple Inc. - Hardware', cat: 'Operations', date: 'May 11, 2026', amt: -3499.00 },
    { desc: 'Stripe Payout', cat: 'Revenue', date: 'May 10, 2026', amt: 12450.00 },
    { desc: 'Office Rent - May', cat: 'Operations', date: 'May 08, 2026', amt: -5000.00 },
    { desc: 'Client: TechFlow Pro', cat: 'Revenue', date: 'May 07, 2026', amt: 8200.00 },
  ];

  return (
    <ErpPageShell
      title="Financial Overview"
      subtitle="Real-time monitoring of your enterprise financial health"
      headerActions={
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm rounded-3 d-flex align-items-center gap-2"
            onClick={handleExport} title="Export Dashboard">
            <FontAwesomeIcon icon={faFileExport} /> Export
          </button>
        </div>
      }
    >
      {loading ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: '#6366f1' }} />
          <p className="mt-2 text-muted small">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchDashboard}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-4 mb-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-xl-3 col-md-6">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className={`p-3 rounded-4 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                        <FontAwesomeIcon icon={stat.icon} size="lg" />
                      </div>
                      <div className={`badge rounded-pill bg-${stat.isUp ? 'success' : 'danger'} bg-opacity-10 text-${stat.isUp ? 'success' : 'danger'} px-2 py-1`}>
                        <FontAwesomeIcon icon={stat.isUp ? faArrowTrendUp : faArrowTrendDown} className="me-1" />
                        {stat.trend}
                      </div>
                    </div>
                    <h6 className="text-muted small mb-1">{stat.title}</h6>
                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="row g-4 mb-4">
            <div className="col-xl-8">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Revenue vs Expenses</h5>
                    <select className="form-select form-select-sm border-0 bg-light" style={{ width: '130px' }}
                      value={period} onChange={e => setPeriod(e.target.value)}>
                      <option value="12m">Last 12 Months</option>
                      <option value="6m">Last 6 Months</option>
                      <option value="1y">This Year</option>
                    </select>
                  </div>
                  <div style={{ height: '350px' }}>
                    <Line data={revenueData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4 text-center">
                  <h5 className="fw-bold mb-4 text-start">Expense Allocation</h5>
                  <div style={{ height: '280px', position: 'relative' }}>
                    <Pie
                      data={expenseBreakdownData}
                      options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } }
                      }}
                    />
                  </div>
                  <div className="mt-4 pt-3 border-top text-start">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small text-muted">Most Spent</span>
                      <span className="small fw-bold text-dark">Operations ($295,820)</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '6px' }}>
                      <div className="progress-bar bg-primary" style={{ width: '35%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions & Multi-Currency Info */}
          <div className="row g-4">
            <div className="col-xl-7">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Recent Transactions</h5>
                    <button className="btn btn-link text-info text-decoration-none small p-0">View All</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light bg-opacity-50">
                        <tr>
                          <th className="border-0 small fw-bold text-muted py-3">DESCRIPTION</th>
                          <th className="border-0 small fw-bold text-muted py-3">CATEGORY</th>
                          <th className="border-0 small fw-bold text-muted py-3">DATE</th>
                          <th className="border-0 small fw-bold text-muted py-3 text-end">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTx.map((tx, idx) => (
                          <tr key={idx}>
                            <td className="py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className={`p-2 rounded-3 bg-${tx.amt > 0 ? 'success' : 'danger'} bg-opacity-10 text-${tx.amt > 0 ? 'success' : 'danger'}`}>
                                  <FontAwesomeIcon icon={tx.amt > 0 ? faArrowTrendUp : faArrowTrendDown} />
                                </div>
                                <span className="fw-medium text-dark">{tx.desc}</span>
                              </div>
                            </td>
                            <td className="py-3"><span className="badge bg-light text-secondary border px-2 py-1">{tx.cat}</span></td>
                            <td className="py-3 text-muted small">{tx.date}</td>
                            <td className={`py-3 text-end fw-bold ${tx.amt > 0 ? 'text-success' : 'text-dark'}`}>
                              {tx.amt > 0 ? '+' : ''}{tx.amt.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="card border-0 shadow-sm rounded-4 bg-primary text-white mb-4" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <p className="text-white text-opacity-75 small mb-1">Global Liquidity</p>
                      <h3 className="fw-bold mb-0">$2,450,800.00</h3>
                    </div>
                    <div className="bg-white bg-opacity-25 p-2 rounded-3">
                      <FontAwesomeIcon icon={faBuildingColumns} />
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <p className="text-white text-opacity-75 small mb-0">USD Account</p>
                      <p className="fw-bold mb-0">$1,840,200</p>
                    </div>
                    <div className="col-6">
                      <p className="text-white text-opacity-75 small mb-0">EUR Account</p>
                      <p className="fw-bold mb-0">€512,400</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Budget Progress</h5>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small fw-medium">Operations Budget</span>
                      <span className="small text-muted">75% Used</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small fw-medium">Marketing Budget</span>
                      <span className="small text-muted">42% Used</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div className="progress-bar bg-secondary" style={{ width: '42%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="small fw-medium">R&D Budget</span>
                      <span className="small text-muted">90% Used</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '8px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ErpPageShell>
  );
};

export default FmsDashboard;
