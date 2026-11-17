import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  getCrmAnalyticsDashboard, getLeadReport, getDealReport, getEmailReport,
  getConversionReport, getPerformersReport,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import {
  faChartLine, faUsers, faHandshake, faBullseye, faEnvelope, faDollarSign,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

const formatMoney = (v) => {
  const n = Number(v) || 0;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const CrmAnalytics = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [dashboard, setDashboard] = useState(null);
  const [leads, setLeads] = useState(null);
  const [deals, setDeals] = useState(null);
  const [emails, setEmails] = useState(null);
  const [conversion, setConversion] = useState(null);
  const [performers, setPerformers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCrmAnalyticsDashboard().catch(() => null),
      getLeadReport().catch(() => null),
      getDealReport().catch(() => null),
      getEmailReport().catch(() => null),
      getConversionReport().catch(() => null),
      getPerformersReport().catch(() => null),
    ]).then(([d, l, e2, em, c, p]) => {
      setDashboard(d);
      setLeads(l);
      setDeals(e2);
      setEmails(em);
      setConversion(c);
      setPerformers(p);
      setLoading(false);
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: isDark ? '#e2e8f0' : '#1e293b' } } },
    scales: {
      x: { ticks: { color: isDark ? '#94a3b8' : '#64748b' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' } },
      y: { ticks: { color: isDark ? '#94a3b8' : '#64748b' }, grid: { color: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0' } },
    },
  };

  return (
    <ErpPageShell
      icon={faChartLine}
      title="Analytics"
      description="Advanced analytics and reports across the entire CRM."
    >
      {loading ? (
        <p>Loading analytics...</p>
      ) : (
        <>
          {dashboard?.stats && (
            <div className="row g-2 mb-3">
              <div className="col-md-3"><ErpKpiCard title="Leads" value={dashboard.stats.total_leads} icon={faUsers} color="#6366f1" /></div>
              <div className="col-md-3"><ErpKpiCard title="Open Deals" value={dashboard.stats.open_deals} icon={faHandshake} color="#10b981" /></div>
              <div className="col-md-3"><ErpKpiCard title="Pipeline Value" value={formatMoney(dashboard.stats.pipeline_value)} icon={faDollarSign} color="#0ea5e9" /></div>
              <div className="col-md-3"><ErpKpiCard title="Forecast" value={formatMoney(dashboard.stats.forecast_value)} icon={faBullseye} color="#f59e0b" /></div>
            </div>
          )}

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="glass-card p-3" style={{ borderRadius: '14px', height: '300px' }}>
                <h6 className="mb-3">Leads by Source</h6>
                {dashboard?.leads_by_source && (
                  <Doughnut
                    data={{
                      labels: dashboard.leads_by_source.map(s => s.source || 'Unknown'),
                      datasets: [{
                        data: dashboard.leads_by_source.map(s => s.count),
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#8b5cf6', '#ec4899', '#14b8a6'],
                      }],
                    }}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="glass-card p-3" style={{ borderRadius: '14px', height: '300px' }}>
                <h6 className="mb-3">Leads by Status</h6>
                {dashboard?.leads_by_status && (
                  <Bar
                    data={{
                      labels: dashboard.leads_by_status.map(s => s.status),
                      datasets: [{
                        label: 'Leads',
                        data: dashboard.leads_by_status.map(s => s.count),
                        backgroundColor: '#6366f1',
                      }],
                    }}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-12">
              <div className="glass-card p-3" style={{ borderRadius: '14px', height: '300px' }}>
                <h6 className="mb-3">Revenue Trend (Last 6 Months)</h6>
                {dashboard?.revenue_trend && (
                  <Line
                    data={{
                      labels: dashboard.revenue_trend.map(r => r.month),
                      datasets: [{
                        label: 'Revenue',
                        data: dashboard.revenue_trend.map(r => r.revenue),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16,185,129,0.1)',
                        fill: true,
                        tension: 0.3,
                      }],
                    }}
                    options={chartOptions}
                  />
                )}
              </div>
            </div>
          </div>

          {deals && (
            <div className="row g-3 mb-3">
              <div className="col-md-3"><ErpKpiCard title="Total Deals" value={deals.total} icon={faHandshake} color="#6366f1" /></div>
              <div className="col-md-3"><ErpKpiCard title="Open Value" value={formatMoney(deals.open_value)} icon={faDollarSign} color="#0ea5e9" /></div>
              <div className="col-md-3"><ErpKpiCard title="Won" value={formatMoney(deals.won_value)} icon={faDollarSign} color="#10b981" /></div>
              <div className="col-md-3"><ErpKpiCard title="Win Rate" value={`${deals.win_rate}%`} icon={faBullseye} color="#f59e0b" /></div>
            </div>
          )}

          {emails && (
            <div className="row g-3 mb-3">
              <div className="col-md-12">
                <div className="glass-card p-3" style={{ borderRadius: '14px' }}>
                  <h6 className="mb-3">Email Performance</h6>
                  <div className="row g-2">
                    <div className="col-md-3"><ErpKpiCard title="Sent" value={emails.sent} icon={faEnvelope} color="#6366f1" /></div>
                    <div className="col-md-3"><ErpKpiCard title="Open Rate" value={`${emails.open_rate}%`} icon={faEnvelope} color="#10b981" /></div>
                    <div className="col-md-3"><ErpKpiCard title="Click Rate" value={`${emails.click_rate}%`} icon={faEnvelope} color="#0ea5e9" /></div>
                    <div className="col-md-3"><ErpKpiCard title="Reply Rate" value={`${emails.reply_rate}%`} icon={faEnvelope} color="#f59e0b" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {performers && (
            <div className="glass-card p-3" style={{ borderRadius: '14px' }}>
              <h6 className="mb-3">Top Performers</h6>
              <table className="table">
                <thead><tr><th>User</th><th>Deals</th><th>Won</th><th>Revenue</th><th>Avg Deal</th></tr></thead>
                <tbody>
                  {performers.reps?.slice(0, 10).map(p => (
                    <tr key={p.assigned_to}>
                      <td>{p.assigned_user?.name || `#${p.assigned_to}`}</td>
                      <td>{p.deals}</td>
                      <td>{p.won}</td>
                      <td>{formatMoney(p.revenue)}</td>
                      <td>{formatMoney(p.avg_deal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </ErpPageShell>
  );
};

export default CrmAnalytics;