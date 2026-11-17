import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUserTie, faHandshake, faTrophy, faSackDollar, faPercent,
  faCalendarCheck, faTriangleExclamation, faArrowUp,
  faChartLine, faRocket, faStar, faBuilding, faIndustry,
  faCircleCheck, faClockRotateLeft, faPhone, faEnvelope, faLocationDot,
  faFileExport, faRefresh, faSpinner, faInfoCircle, faBullseye,
  faListCheck, faFire, faCircleUser, faBolt
} from '@fortawesome/free-solid-svg-icons';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { getCrmDashboard } from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';

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

const formatNumber = (v) => {
  const n = Number(v) || 0;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const activityTypeIcon = (type) => {
  const t = String(type || '').toLowerCase();
  if (t.includes('call')) return faPhone;
  if (t.includes('email') || t.includes('mail')) return faEnvelope;
  if (t.includes('meet')) return faUsers;
  if (t.includes('visit') || t.includes('location')) return faLocationDot;
  if (t.includes('task') || t.includes('todo')) return faListCheck;
  return faCircleCheck;
};

const activityTypeColor = (type, isDark) => {
  const t = String(type || '').toLowerCase();
  if (t.includes('call')) return { bg: isDark ? '#1e3a5f' : '#dbeafe', fg: isDark ? '#60a5fa' : '#2563eb' };
  if (t.includes('email')) return { bg: isDark ? '#312e81' : '#e0e7ff', fg: isDark ? '#a5b4fc' : '#4f46e5' };
  if (t.includes('meet')) return { bg: isDark ? '#064e3b' : '#dcfce7', fg: isDark ? '#4ade80' : '#16a34a' };
  if (t.includes('visit')) return { bg: isDark ? '#7c2d12' : '#ffedd5', fg: isDark ? '#fb923c' : '#ea580c' };
  if (t.includes('task')) return { bg: isDark ? '#713f12' : '#fef3c7', fg: isDark ? '#fbbf24' : '#d97706' };
  return { bg: isDark ? '#334155' : '#f1f5f9', fg: isDark ? '#cbd5e1' : '#64748b' };
};

const CrmDashboard = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = useMemo(() => ({
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
  }), []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCrmDashboard();
      const payload = res?.data?.data ?? res?.data ?? null;
      setData(payload);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load CRM dashboard';
      setError(msg);
      addNotification?.(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const onRefresh = () => fetchDashboard();
    window.addEventListener('erp:refresh', onRefresh);
    return () => window.removeEventListener('erp:refresh', onRefresh);
  }, []);

  const stats = data?.stats || {};
  const leadsByStatus = Array.isArray(data?.leads_by_status) ? data.leads_by_status : [];
  const dealsByStage = Array.isArray(data?.deals_by_stage) ? data.deals_by_stage : [];
  const customersByType = Array.isArray(data?.customers_by_type) ? data.customers_by_type : [];
  const customersByRating = Array.isArray(data?.customers_by_rating) ? data.customers_by_rating : [];
  const recentActivities = Array.isArray(data?.recent_activities) ? data.recent_activities : [];
  const topPerformers = Array.isArray(data?.top_performers) ? data.top_performers : [];
  const monthlyTrend = Array.isArray(data?.monthly_trend) ? data.monthly_trend : [];

  const totalCustomers = Number(stats.total_customers ?? 0);
  const activeLeads = Number(stats.active_leads ?? 0);
  const openDeals = Number(stats.open_deals ?? 0);
  const wonValueMtd = Number(stats.won_value_mtd ?? stats.won_value ?? 0);
  const pipelineValue = Number(stats.pipeline_value ?? 0);
  const conversionRate = Number(stats.conversion_rate ?? 0);
  const activitiesToday = Number(stats.activities_today ?? 0);
  const overdueActivities = Number(stats.overdue_activities ?? 0);

  const chartPalette = {
    primary: '#6366f1',
    success: '#10b981',
    danger: '#f43f5e',
    warning: '#f59e0b',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
  };

  const chartText = isDark ? '#cbd5e1' : '#475569';
  const chartGrid = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  // ---------- Pipeline funnel (leads by status + deals by stage) ----------
  const pipelineLabels = useMemo(() => {
    const labels = [];
    leadsByStatus.forEach((row) => {
      if (row?.status && !labels.includes(row.status)) labels.push(row.status);
    });
    dealsByStage.forEach((row) => {
      if (row?.stage && !labels.includes(row.stage)) labels.push(row.stage);
    });
    return labels.length ? labels : ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'];
  }, [leadsByStatus, dealsByStage]);

  const leadsData = pipelineLabels.map((label) => {
    const row = leadsByStatus.find((r) => (r?.status || '').toLowerCase() === label.toLowerCase());
    return Number(row?.count ?? 0);
  });

  const dealsData = pipelineLabels.map((label) => {
    const row = dealsByStage.find((r) => (r?.stage || '').toLowerCase() === label.toLowerCase());
    return Number(row?.count ?? 0);
  });

  const maxPipelineValue = Math.max(1, ...leadsData, ...dealsData);

  const pipelineFunnelChart = {
    labels: pipelineLabels,
    datasets: [
      {
        label: 'Leads',
        data: leadsData,
        backgroundColor: 'rgba(99,102,241,0.85)',
        borderColor: 'rgba(99,102,241,1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 14,
      },
      {
        label: 'Deals',
        data: dealsData,
        backgroundColor: 'rgba(139,92,246,0.85)',
        borderColor: 'rgba(139,92,246,1)',
        borderWidth: 1,
        borderRadius: 6,
        barThickness: 14,
      },
    ],
  };

  const pipelineChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: chartText, boxWidth: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 10 } } },
      tooltip: {
        padding: 10, backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: chartText, bodyColor: chartText,
        borderColor: chartGrid, borderWidth: 1,
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { color: chartGrid, drawBorder: false }, ticks: { color: chartText, font: { size: 10 } } },
      y: { grid: { display: false }, ticks: { color: chartText, font: { size: 11, weight: '600' } } },
    },
  };

  // ---------- Customer breakdown (donut by type) ----------
  const typeDonutData = {
    labels: customersByType.length
      ? customersByType.map((r) => r?.type || r?.label || 'Unknown')
      : ['No data'],
    datasets: [
      {
        data: customersByType.length ? customersByType.map((r) => Number(r?.count ?? 0)) : [1],
        backgroundColor: customersByType.length
          ? customersByType.map((_, i) => Object.values(chartPalette)[i % Object.values(chartPalette).length])
          : [isDark ? '#334155' : '#e2e8f0'],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { position: 'bottom', labels: { color: chartText, boxWidth: 8, usePointStyle: true, font: { size: 10 }, padding: 10 } },
      tooltip: {
        padding: 10, backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: chartText, bodyColor: chartText,
        borderColor: chartGrid, borderWidth: 1,
      },
    },
  };

  // ---------- Customer by rating (bar) ----------
  const ratingBarData = {
    labels: customersByRating.length
      ? customersByRating.map((r) => `${r?.rating ?? 0}★`)
      : ['0★', '1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        label: 'Customers',
        data: customersByRating.length
          ? customersByRating.map((r) => Number(r?.count ?? 0))
          : [0, 0, 0, 0, 0, 0],
        backgroundColor: (ctx) => {
          const ch = ctx.chart;
          const { ctx: c, chartArea } = ch;
          if (!chartArea) return '#f59e0b';
          const grad = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          grad.addColorStop(0, 'rgba(245,158,11,0.35)');
          grad.addColorStop(1, 'rgba(245,158,11,0.95)');
          return grad;
        },
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const ratingBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { padding: 10, backgroundColor: isDark ? '#0f172a' : '#ffffff', titleColor: chartText, bodyColor: chartText, borderColor: chartGrid, borderWidth: 1 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartText, font: { size: 10 } } },
      y: { beginAtZero: true, grid: { color: chartGrid, drawBorder: false }, ticks: { color: chartText, font: { size: 10 } } },
    },
  };

  // ---------- Monthly trend (6 months) ----------
  const trendLabels = monthlyTrend.length
    ? monthlyTrend.map((m) => m?.label || m?.month || m?.name || '')
    : [];

  const trendLineData = {
    labels: trendLabels.length ? trendLabels : ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'],
    datasets: [
      {
        label: 'Leads',
        data: monthlyTrend.length ? monthlyTrend.map((m) => Number(m?.leads ?? 0)) : [0, 0, 0, 0, 0, 0],
        borderColor: chartPalette.primary,
        backgroundColor: 'rgba(99,102,241,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: chartPalette.primary,
        borderWidth: 2.5,
      },
      {
        label: 'Deals Won',
        data: monthlyTrend.length ? monthlyTrend.map((m) => Number(m?.deals_won ?? m?.deals ?? 0)) : [0, 0, 0, 0, 0, 0],
        borderColor: chartPalette.success,
        backgroundColor: 'rgba(16,185,129,0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: chartPalette.success,
        borderWidth: 2.5,
      },
      {
        label: 'Revenue',
        data: monthlyTrend.length ? monthlyTrend.map((m) => Number(m?.revenue ?? 0)) : [0, 0, 0, 0, 0, 0],
        borderColor: chartPalette.warning,
        backgroundColor: 'rgba(245,158,11,0.10)',
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: chartPalette.warning,
        borderWidth: 2.5,
        yAxisID: 'y1',
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', align: 'end', labels: { color: chartText, boxWidth: 10, usePointStyle: true, pointStyle: 'circle', font: { size: 10 } } },
      tooltip: { padding: 10, backgroundColor: isDark ? '#0f172a' : '#ffffff', titleColor: chartText, bodyColor: chartText, borderColor: chartGrid, borderWidth: 1 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: chartText, font: { size: 10 } } },
      y: { beginAtZero: true, grid: { color: chartGrid, drawBorder: false }, ticks: { color: chartText, font: { size: 10 } }, position: 'left' },
      y1: { beginAtZero: true, grid: { display: false }, ticks: { color: chartPalette.warning, font: { size: 10 }, callback: (v) => formatMoney(v) }, position: 'right' },
    },
  };

  const handleExport = () => {
    try {
      const payload = {
        generated_at: new Date().toISOString(),
        stats,
        leads_by_status: leadsByStatus,
        deals_by_stage: dealsByStage,
        customers_by_type: customersByType,
        customers_by_rating: customersByRating,
        recent_activities: recentActivities,
        top_performers: topPerformers,
        monthly_trend: monthlyTrend,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crm-dashboard-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      addNotification?.('CRM dashboard data exported.', 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Export failed', 'error');
    }
  };

  // ---------- Loading state ----------
  if (loading) {
    return (
      <ErpPageShell
        icon={faRocket}
        title="Customer Relationship Command Center"
        description="Real-time pipeline, lead activity, and revenue intelligence across your customer base."
      >
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: colors.primary }} />
          <p className="mt-3 small" style={{ color: mutedColor }}>Loading CRM intelligence…</p>
        </div>
      </ErpPageShell>
    );
  }

  // ---------- Error state ----------
  if (error) {
    return (
      <ErpPageShell
        icon={faRocket}
        title="Customer Relationship Command Center"
        description="Real-time pipeline, lead activity, and revenue intelligence across your customer base."
        action={
          <button
            onClick={fetchDashboard}
            className="btn btn-sm text-white border-0 d-flex align-items-center gap-1 px-3"
            style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 14px rgba(99,102,241,0.35)', fontSize: '0.8rem' }}
          >
            <FontAwesomeIcon icon={faRefresh} /> Retry
          </button>
        }
      >
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-4" role="alert">
          <FontAwesomeIcon icon={faInfoCircle} />
          <span className="small">{error}</span>
          <button className="btn btn-sm btn-outline-danger ms-auto rounded-pill" onClick={fetchDashboard}>
            <FontAwesomeIcon icon={faRefresh} className="me-1" />Retry
          </button>
        </div>
      </ErpPageShell>
    );
  }

  const hasData = totalCustomers > 0 || activeLeads > 0 || openDeals > 0 || recentActivities.length > 0;
  const heroGradient = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';

  return (
    <ErpPageShell
      icon={faRocket}
      title="Customer Relationship Command Center"
      description="Real-time pipeline, lead activity, and revenue intelligence across your customer base."
      badge="Live"
      action={
        <div className="d-flex gap-2">
          <button
            onClick={handleExport}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
            style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.8rem' }}
            title="Export dashboard data"
          >
            <FontAwesomeIcon icon={faFileExport} /> Export
          </button>
          <button
            onClick={fetchDashboard}
            className="btn btn-sm border-0 d-flex align-items-center gap-1 px-3 premium-btn"
            style={{ borderRadius: '10px', background: isDark ? '#334155' : '#f1f5f9', color: textColor, fontSize: '0.8rem' }}
            title="Refresh"
          >
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
        </div>
      }
    >
      {/* ============ HERO ============ */}
      <div
        className="glass-card mb-4 enter-anim"
        style={{
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          background: heroGradient,
          color: '#fff',
          boxShadow: '0 18px 48px rgba(99,102,241,0.35)',
        }}
      >
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -40, width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)', pointerEvents: 'none',
        }} />
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '4px 10px' }}>
                <span className="live-dot me-1" style={{ background: '#fff' }} /> LIVE INSIGHTS
              </span>
              <span className="badge rounded-pill" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '0.65rem', fontWeight: 600, padding: '4px 10px' }}>
                <FontAwesomeIcon icon={faBolt} className="me-1" /> Real-time
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.4px', background: 'linear-gradient(90deg, #ffffff, #e0e7ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Customer Relationship Command Center
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: '0.95rem', opacity: 0.9, maxWidth: 720 }}>
              Monitor leads, deals, pipeline velocity and customer lifetime value from one premium glass dashboard. Built for revenue teams that need signal, not noise.
            </p>
          </div>
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="row g-2">
              <div className="col-6">
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: '12px', padding: '10px 12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Pipeline</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{formatMoney(pipelineValue)}</div>
                </div>
              </div>
              <div className="col-6">
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: '12px', padding: '10px 12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Won MTD</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{formatMoney(wonValueMtd)}</div>
                </div>
              </div>
              <div className="col-6">
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: '12px', padding: '10px 12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Conversion</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{conversionRate.toFixed(1)}%</div>
                </div>
              </div>
              <div className="col-6">
                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: '12px', padding: '10px 12px', backdropFilter: 'blur(8px)' }}>
                  <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85 }}>Activities</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>{formatNumber(activitiesToday)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hasData && (
        <div className="glass-card text-center py-5 mb-4" style={{ borderRadius: '16px' }}>
          <FontAwesomeIcon icon={faInfoCircle} size="2x" style={{ color: mutedColor, opacity: 0.5 }} />
          <h6 className="mt-3 mb-1" style={{ color: textColor }}>No CRM data yet</h6>
          <p className="small mb-0" style={{ color: mutedColor }}>
            Once leads, deals and customers are added, your command center will populate here.
          </p>
        </div>
      )}

      {/* ============ PRIMARY KPI CARDS ============ */}
      <div className="row g-3 mb-3">
        <ErpKpiCard
          label="Total Customers"
          value={totalCustomers}
          icon={faUsers}
          color={colors.primary}
          trend={totalCustomers > 0 ? 'up' : 'up'}
          trendVal={totalCustomers > 0 ? `${totalCustomers} active` : 'No data'}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
        <ErpKpiCard
          label="Active Leads"
          value={activeLeads}
          icon={faUserTie}
          color={colors.info}
          trend="up"
          trendVal={`${activeLeads} open`}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
        <ErpKpiCard
          label="Open Deals"
          value={openDeals}
          icon={faHandshake}
          color={colors.purple}
          trend="up"
          trendVal={`${openDeals} in flight`}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
        <ErpKpiCard
          label="Won Value MTD"
          value={wonValueMtd}
          icon={faTrophy}
          color={colors.success}
          trend="up"
          trendVal={formatMoney(wonValueMtd)}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
      </div>

      {/* ============ SECONDARY KPI CARDS ============ */}
      <div className="row g-3 mb-4">
        <ErpKpiCard
          label="Pipeline Value"
          value={pipelineValue}
          icon={faSackDollar}
          color={colors.warning}
          trend="up"
          trendVal={formatMoney(pipelineValue)}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
        <ErpKpiCard
          label="Conversion Rate"
          value={Number(conversionRate.toFixed(1))}
          icon={faPercent}
          color={colors.success}
          trend={conversionRate >= 50 ? 'up' : 'down'}
          trendVal={`${conversionRate.toFixed(1)}% closed-won`}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
        <ErpKpiCard
          label="Activities Today"
          value={activitiesToday}
          icon={faCalendarCheck}
          color={colors.info}
          trend="up"
          trendVal={`${activitiesToday} scheduled`}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
        <ErpKpiCard
          label="Overdue Activities"
          value={overdueActivities}
          icon={faTriangleExclamation}
          color={overdueActivities > 0 ? colors.danger : colors.success}
          trend={overdueActivities > 0 ? 'down' : 'up'}
          trendVal={overdueActivities > 0 ? 'Needs attention' : 'All clear'}
          isDark={isDark}
          colClass="col-xl-3 col-md-6"
        />
      </div>

      {/* ============ PIPELINE FUNNEL ============ */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1.25rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="section-header mb-0">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
            <h6 style={{ color: textColor, margin: 0 }}>
              <FontAwesomeIcon icon={faBullseye} className="me-2" style={{ color: colors.primary }} />
              Pipeline Funnel — Leads vs Deals
            </h6>
          </div>
          <div className="d-flex gap-3 align-items-center" style={{ fontSize: '0.7rem', color: mutedColor }}>
            <span><span className="badge-dot me-1" style={{ background: colors.primary, display: 'inline-block', width: 8, height: 8, borderRadius: '50%' }} /> Leads</span>
            <span><span className="badge-dot me-1" style={{ background: colors.purple, display: 'inline-block', width: 8, height: 8, borderRadius: '50%' }} /> Deals</span>
          </div>
        </div>

        {(leadsByStatus.length === 0 && dealsByStage.length === 0) ? (
          <div className="text-center py-4" style={{ color: mutedColor }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ opacity: 0.4, fontSize: '1.5rem' }} />
            <p className="small mt-2 mb-0">No pipeline data available yet. Add leads and deals to see your funnel.</p>
          </div>
        ) : (
          <>
            <div style={{ height: 280 }}>
              <Bar data={pipelineFunnelChart} options={pipelineChartOptions} />
            </div>

            {/* Funnel bar summary */}
            <div className="mt-4">
              {pipelineLabels.map((label, idx) => {
                const lc = leadsData[idx] || 0;
                const dc = dealsData[idx] || 0;
                const lcPct = (lc / maxPipelineValue) * 100;
                const dcPct = (dc / maxPipelineValue) * 100;
                return (
                  <div key={`${label}-${idx}`} className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.7rem' }}>
                      <span style={{ color: textColor, fontWeight: 600 }}>{label}</span>
                      <span style={{ color: mutedColor }}>
                        <span className="me-3"><strong style={{ color: colors.primary }}>{lc}</strong> leads</span>
                        <span><strong style={{ color: colors.purple }}>{dc}</strong> deals</span>
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, height: 8 }}>
                      <div style={{ width: `${lcPct}%`, background: colors.primary, borderRadius: 4, transition: 'width 0.5s ease' }} />
                      <div style={{ width: `${dcPct}%`, background: colors.purple, borderRadius: 4, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ============ CUSTOMER BREAKDOWN ROW ============ */}
      <div className="row g-3 mb-4">
        {/* By Type (Donut) */}
        <div className="col-xl-6">
          <div className="glass-card h-100" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="section-header mb-3">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }} />
              <h6 style={{ color: textColor, margin: 0 }}>
                <FontAwesomeIcon icon={faBuilding} className="me-2" style={{ color: colors.purple }} />
                Customers by Type
              </h6>
            </div>
            {customersByType.length === 0 ? (
              <div className="text-center py-4" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ opacity: 0.4, fontSize: '1.5rem' }} />
                <p className="small mt-2 mb-0">No customer type breakdown yet.</p>
              </div>
            ) : (
              <>
                <div style={{ height: 240 }}>
                  <Doughnut data={typeDonutData} options={donutOptions} />
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  {customersByType.map((row, idx) => {
                    const total = customersByType.reduce((acc, r) => acc + Number(r?.count || 0), 0) || 1;
                    const pct = ((Number(row?.count || 0) / total) * 100).toFixed(1);
                    return (
                      <div key={`${row?.type || idx}`} className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: '0.75rem' }}>
                        <span className="d-flex align-items-center gap-2" style={{ color: textColor }}>
                          <span style={{ width: 10, height: 10, borderRadius: 3, background: Object.values(chartPalette)[idx % Object.values(chartPalette).length] }} />
                          {row?.type || 'Unknown'}
                        </span>
                        <span style={{ color: mutedColor }}>
                          <strong style={{ color: textColor }}>{row?.count ?? 0}</strong> ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* By Rating (Bar) */}
        <div className="col-xl-6">
          <div className="glass-card h-100" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="section-header mb-3">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #fbbf24)' }} />
              <h6 style={{ color: textColor, margin: 0 }}>
                <FontAwesomeIcon icon={faStar} className="me-2" style={{ color: colors.warning }} />
                Customers by Rating
              </h6>
            </div>
            {customersByRating.length === 0 ? (
              <div className="text-center py-4" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ opacity: 0.4, fontSize: '1.5rem' }} />
                <p className="small mt-2 mb-0">No rating data available yet.</p>
              </div>
            ) : (
              <>
                <div style={{ height: 240 }}>
                  <Bar data={ratingBarData} options={ratingBarOptions} />
                </div>
                <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: mutedColor }}>Average Rating</span>
                    <span style={{ color: colors.warning, fontWeight: 700, letterSpacing: '0.05em' }}>
                      {(() => {
                        const total = customersByRating.reduce((acc, r) => acc + Number(r?.count || 0), 0);
                        if (total === 0) return '—';
                        const weighted = customersByRating.reduce((acc, r) => acc + Number(r?.rating || 0) * Number(r?.count || 0), 0);
                        return `${(weighted / total).toFixed(2)} ★`;
                      })()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============ TIMELINE + LEADERBOARD ============ */}
      <div className="row g-3 mb-4">
        {/* Recent activities timeline */}
        <div className="col-xl-7">
          <div className="glass-card h-100" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="section-header mb-0">
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #06b6d4, #0ea5e9)' }} />
                <h6 style={{ color: textColor, margin: 0 }}>
                  <FontAwesomeIcon icon={faClockRotateLeft} className="me-2" style={{ color: colors.info }} />
                  Recent Activities
                </h6>
              </div>
              <span className="badge rounded-pill" style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: mutedColor, fontSize: '0.65rem', padding: '4px 10px' }}>
                Last {recentActivities.slice(0, 10).length}
              </span>
            </div>

            {recentActivities.length === 0 ? (
              <div className="text-center py-4" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faListCheck} style={{ opacity: 0.4, fontSize: '1.5rem' }} />
                <p className="small mt-2 mb-0">No recent activity yet. Log calls, emails and meetings to populate the timeline.</p>
              </div>
            ) : (
              <div style={{ position: 'relative', maxHeight: 420, overflowY: 'auto', paddingRight: 6 }}>
                <div style={{
                  position: 'absolute', left: 18, top: 8, bottom: 8, width: 2,
                  background: isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0', borderRadius: 2,
                }} />
                {recentActivities.slice(0, 10).map((act, idx) => {
                  const ic = activityTypeIcon(act?.type);
                  const col = activityTypeColor(act?.type, isDark);
                  return (
                    <div key={act?.id || idx} className="d-flex gap-3 mb-3 position-relative" style={{ zIndex: 1 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 12, background: col.bg, color: col.fg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.06)',
                      }}>
                        <FontAwesomeIcon icon={ic} style={{ fontSize: '0.8rem' }} />
                      </div>
                      <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-start gap-2">
                          <div style={{ color: textColor, fontSize: '0.8rem', fontWeight: 600 }} className="text-truncate">
                            {act?.subject || act?.title || act?.description || 'Activity'}
                          </div>
                          <span style={{ color: mutedColor, fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                            {formatDate(act?.created_at || act?.date || act?.timestamp)}
                          </span>
                        </div>
                        <div className="d-flex gap-2 mt-1" style={{ fontSize: '0.7rem', color: mutedColor, flexWrap: 'wrap' }}>
                          {act?.type && (
                            <span className="premium-badge" style={{ background: col.bg, color: col.fg }}>
                              {act.type}
                            </span>
                          )}
                          {act?.customer && (
                            <span><FontAwesomeIcon icon={faCircleUser} className="me-1" />{act.customer}</span>
                          )}
                          {act?.user && (
                            <span>• {act.user}</span>
                          )}
                        </div>
                        {act?.status && (
                          <div className="mt-1" style={{ fontSize: '0.7rem' }}>
                            <span className="premium-badge" style={{
                              background: act.status === 'Completed' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#713f12' : '#fef3c7'),
                              color: act.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#fbbf24' : '#d97706'),
                            }}>
                              {act.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top performers */}
        <div className="col-xl-5">
          <div className="glass-card h-100" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="section-header mb-0">
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #ef4444)' }} />
                <h6 style={{ color: textColor, margin: 0 }}>
                  <FontAwesomeIcon icon={faFire} className="me-2" style={{ color: colors.warning }} />
                  Top Performers
                </h6>
              </div>
            </div>

            {topPerformers.length === 0 ? (
              <div className="text-center py-4" style={{ color: mutedColor }}>
                <FontAwesomeIcon icon={faTrophy} style={{ opacity: 0.4, fontSize: '1.5rem' }} />
                <p className="small mt-2 mb-0">No performer data available yet.</p>
              </div>
            ) : (
              <div>
                {topPerformers.slice(0, 5).map((p, idx) => {
                  const medals = ['#fbbf24', '#cbd5e1', '#fb923c'];
                  const medalColor = medals[idx] || (isDark ? '#475569' : '#cbd5e1');
                  const maxValue = Math.max(...topPerformers.slice(0, 5).map((x) => Number(x?.value ?? x?.deals_won ?? x?.won_value ?? 0)), 1);
                  const perfValue = Number(p?.value ?? p?.deals_won ?? p?.won_value ?? 0);
                  const pct = Math.min(100, (perfValue / maxValue) * 100);
                  return (
                    <div key={p?.id || p?.user_id || idx} className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', background: medalColor, color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0,
                        }}>
                          {idx + 1}
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="d-flex justify-content-between align-items-center" style={{ fontSize: '0.78rem' }}>
                            <span className="text-truncate" style={{ color: textColor, fontWeight: 600 }}>
                              {p?.name || p?.user_name || p?.full_name || 'Unassigned'}
                            </span>
                            <span style={{ color: mutedColor }}>
                              {p?.value !== undefined
                                ? (typeof p.value === 'number' && p.value > 1000 ? formatMoney(p.value) : p.value)
                                : p?.deals_won !== undefined
                                  ? `${p.deals_won} won`
                                  : '—'}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between" style={{ fontSize: '0.65rem', color: mutedColor }}>
                            <span>{p?.role || p?.team || 'Sales'}</span>
                            {p?.won_value !== undefined && (
                              <span>{formatMoney(p.won_value)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', overflow: 'hidden', marginLeft: 36 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${colors.primary}, ${colors.purple})`, borderRadius: 3, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============ MONTHLY TREND ============ */}
      <div className="glass-card mb-4" style={{ borderRadius: '16px', padding: '1.25rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="section-header mb-0">
            <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #06b6d4)' }} />
            <h6 style={{ color: textColor, margin: 0 }}>
              <FontAwesomeIcon icon={faChartLine} className="me-2" style={{ color: colors.success }} />
              6-Month Performance Trend
            </h6>
          </div>
          <div className="d-flex gap-2" style={{ fontSize: '0.7rem' }}>
            <span className="premium-badge" style={{ background: isDark ? 'rgba(99,102,241,0.18)' : '#e0e7ff', color: colors.primary }}>
              <FontAwesomeIcon icon={faUserTie} className="me-1" /> Leads
            </span>
            <span className="premium-badge" style={{ background: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', color: colors.success }}>
              <FontAwesomeIcon icon={faHandshake} className="me-1" /> Deals Won
            </span>
            <span className="premium-badge" style={{ background: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', color: colors.warning }}>
              <FontAwesomeIcon icon={faSackDollar} className="me-1" /> Revenue
            </span>
          </div>
        </div>
        {monthlyTrend.length === 0 ? (
          <div className="text-center py-4" style={{ color: mutedColor }}>
            <FontAwesomeIcon icon={faChartLine} style={{ opacity: 0.4, fontSize: '1.5rem' }} />
            <p className="small mt-2 mb-0">No trend data available yet.</p>
          </div>
        ) : (
          <div style={{ height: 320 }}>
            <Line data={trendLineData} options={trendOptions} />
          </div>
        )}
      </div>

      {/* ============ FOOTER STRIP ============ */}
      <div className="glass-card" style={{ borderRadius: '16px', padding: '0.85rem 1.25rem' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2" style={{ fontSize: '0.7rem', color: mutedColor }}>
          <div>
            <FontAwesomeIcon icon={faIndustry} className="me-2" />
            Customer Relationship Command Center • Last refreshed {new Date().toLocaleTimeString()}
          </div>
          <div className="d-flex gap-3">
            <span><FontAwesomeIcon icon={faArrowUp} style={{ color: colors.success }} className="me-1" /> Real-time metrics</span>
            <span><FontAwesomeIcon icon={faIndustry} className="me-1" /> {totalCustomers + activeLeads + openDeals} total entities</span>
          </div>
        </div>
      </div>
    </ErpPageShell>
  );
};

export default CrmDashboard;
