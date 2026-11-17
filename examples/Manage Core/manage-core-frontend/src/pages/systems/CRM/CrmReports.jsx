import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine, faFilter, faFunnelDollar, faPeopleGroup,
  faBullseye, faTrophy, faSackDollar, faArrowUpRightFromSquare,
  faUserTie, faCheckCircle, faCircleNotch, faHandshake, faMoneyBillTrendUp,
  faSitemap, faSpinner, faInfoCircle, faCalendarDays, faBriefcase,
  faClipboardCheck, faEnvelope, faPhone, faComments, faExclamationTriangle,
  faArrowRight, faPercent, faCoins, faArrowTrendUp, faArrowTrendDown,
  faStar, faMedal, faCrown, faDiamond, faRocket,
} from '@fortawesome/free-solid-svg-icons';
import {
  getPipelineReport, getConversionReport, getActivityReport,
  getTopPerformers, getRevenueBySource,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import { erpCss, erpColors } from '../../../components/ui/ux/ErpTheme';

const STAGE_COLORS = [
  '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
  '#ef4444', '#f43f5e', '#ec4899', '#14b8a6', '#3b82f6',
];

const formatCurrency = (val) => {
  const n = parseFloat(val || 0);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatCurrencyFull = (val) => {
  const n = parseFloat(val || 0);
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatNumber = (val) => {
  const n = parseInt(val || 0, 10);
  return n.toLocaleString('en-US');
};

const formatPercent = (val) => {
  const n = parseFloat(val || 0);
  return `${n.toFixed(1)}%`;
};

const pickStageColor = (idx, length) => {
  if (!length) return STAGE_COLORS[0];
  return STAGE_COLORS[idx % STAGE_COLORS.length];
};

const initials = (name) => {
  if (!name) return '??';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || '')).toUpperCase();
};

const TABS = [
  { key: 'pipeline', label: 'Pipeline', icon: faChartLine, color: '#6366f1' },
  { key: 'conversion', label: 'Conversion Funnel', icon: faFunnelDollar, color: '#06b6d4' },
  { key: 'activity', label: 'Activity', icon: faClipboardCheck, color: '#8b5cf6' },
  { key: 'performers', label: 'Top Performers', icon: faTrophy, color: '#f59e0b' },
  { key: 'revenue', label: 'Revenue by Source', icon: faSackDollar, color: '#10b981' },
];

const CrmReports = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const cardBg = isDark ? '#0f172a' : '#ffffff';
  const subtleBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  const [activeTab, setActiveTab] = useState('pipeline');
  const [loading, setLoading] = useState({ pipeline: true, conversion: true, activity: true, performers: true, revenue: true });
  const [error, setError] = useState({ pipeline: null, conversion: null, activity: null, performers: null, revenue: null });

  const [pipeline, setPipeline] = useState([]);
  const [conversion, setConversion] = useState({ data: [], total_leads: 0 });
  const [activity, setActivity] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [revenue, setRevenue] = useState([]);

  const safeFetch = async (key, fn, setter, fallback) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(prev => ({ ...prev, [key]: null }));
    try {
      const res = await fn();
      const data = setter === 'conversion' ? res : (Array.isArray(res) ? res : []);
      if (setter === 'conversion') {
        setConversion({
          data: Array.isArray(res?.data) ? res.data : [],
          total_leads: parseInt(res?.total_leads || 0, 10),
        });
      } else if (setter === 'pipeline') setPipeline(data);
      else if (setter === 'activity') setActivity(data);
      else if (setter === 'performers') setPerformers(data);
      else if (setter === 'revenue') setRevenue(data);
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || `Failed to load ${key} report`;
      setError(prev => ({ ...prev, [key]: msg }));
      addNotification?.(msg, 'error');
      if (setter === 'conversion') setConversion(fallback || { data: [], total_leads: 0 });
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  useEffect(() => { safeFetch('pipeline', getPipelineReport, 'pipeline', []); }, []);
  useEffect(() => { safeFetch('conversion', getConversionReport, 'conversion', { data: [], total_leads: 0 }); }, []);
  useEffect(() => { safeFetch('activity', getActivityReport, 'activity', []); }, []);
  useEffect(() => { safeFetch('performers', getTopPerformers, 'performers', []); }, []);
  useEffect(() => { safeFetch('revenue', getRevenueBySource, 'revenue', []); }, []);

  const refreshAll = () => {
    safeFetch('pipeline', getPipelineReport, 'pipeline', []);
    safeFetch('conversion', getConversionReport, 'conversion', { data: [], total_leads: 0 });
    safeFetch('activity', getActivityReport, 'activity', []);
    safeFetch('performers', getTopPerformers, 'performers', []);
    safeFetch('revenue', getRevenueBySource, 'revenue', []);
    addNotification?.('Reports refreshed.', 'success');
  };

  const pipelineKpis = useMemo(() => {
    const totalDeals = pipeline.reduce((s, p) => s + parseInt(p.count || 0, 10), 0);
    const totalAmount = pipeline.reduce((s, p) => s + parseFloat(p.total_amount || 0), 0);
    const weighted = pipeline.reduce((s, p) => s + parseFloat(p.weighted_amount || 0), 0);
    const topStage = [...pipeline].sort((a, b) => parseInt(b.count || 0) - parseInt(a.count || 0))[0];
    return [
      { label: 'Total Deals', val: totalDeals, icon: faHandshake, color: '#6366f1', trend: 'up', trendVal: `${pipeline.length} Stages` },
      { label: 'Pipeline Value', val: totalAmount, icon: faCoins, color: '#10b981', trend: 'up', trendVal: 'Gross' },
      { label: 'Weighted Forecast', val: weighted, icon: faArrowTrendUp, color: '#06b6d4', trend: 'up', trendVal: 'Adjusted' },
      { label: 'Top Stage', val: topStage?.stage || '—', icon: faBullseye, color: '#f59e0b', trend: 'up', trendVal: topStage ? `${topStage.count} deals` : 'No data' },
    ];
  }, [pipeline]);

  const conversionKpis = useMemo(() => {
    const total = conversion.total_leads || 0;
    const converted = conversion.data?.[conversion.data.length - 1]?.count || 0;
    const overallRate = total > 0 ? (converted / total) * 100 : 0;
    return [
      { label: 'Total Leads', val: total, icon: faPeopleGroup, color: '#6366f1', trend: 'up', trendVal: 'In Funnel' },
      { label: 'Converted', val: converted, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Closed Won' },
      { label: 'Overall Rate', val: `${overallRate.toFixed(1)}%`, icon: faPercent, color: '#06b6d4', trend: overallRate >= 20 ? 'up' : 'down', trendVal: 'Lead → Won' },
      { label: 'Stages', val: conversion.data?.length || 0, icon: faSitemap, color: '#f59e0b', trend: 'up', trendVal: 'Tracked' },
    ];
  }, [conversion]);

  const activityKpis = useMemo(() => {
    const total = activity.reduce((s, a) => s + parseInt(a.total || 0, 10), 0);
    const done = activity.reduce((s, a) => s + parseInt(a.completed || 0, 10), 0);
    const rate = total > 0 ? (done / total) * 100 : 0;
    return [
      { label: 'Total Activities', val: total, icon: faClipboardCheck, color: '#6366f1', trend: 'up', trendVal: `${activity.length} types` },
      { label: 'Completed', val: done, icon: faCheckCircle, color: '#10b981', trend: 'up', trendVal: 'Finished' },
      { label: 'Completion Rate', val: `${rate.toFixed(1)}%`, icon: faArrowTrendUp, color: '#06b6d4', trend: rate >= 50 ? 'up' : 'down', trendVal: 'Overall' },
      { label: 'Activity Types', val: activity.length, icon: faSitemap, color: '#f59e0b', trend: 'up', trendVal: 'Tracked' },
    ];
  }, [activity]);

  const performersKpis = useMemo(() => {
    const totalRevenue = performers.reduce((s, p) => s + parseFloat(p.total_revenue || 0), 0);
    const totalDeals = performers.reduce((s, p) => s + parseInt(p.total_deals || 0, 10), 0);
    const totalWon = performers.reduce((s, p) => s + parseInt(p.won_deals || 0, 10), 0);
    return [
      { label: 'Total Revenue', val: totalRevenue, icon: faSackDollar, color: '#10b981', trend: 'up', trendVal: 'Closed Won' },
      { label: 'Active Reps', val: performers.length, icon: faUserTie, color: '#6366f1', trend: 'up', trendVal: 'Performers' },
      { label: 'Deals Won', val: totalWon, icon: faTrophy, color: '#f59e0b', trend: 'up', trendVal: `of ${totalDeals} total` },
      { label: 'Win Rate', val: totalDeals > 0 ? `${((totalWon / totalDeals) * 100).toFixed(1)}%` : '0%', icon: faPercent, color: '#06b6d4', trend: 'up', trendVal: 'Overall' },
    ];
  }, [performers]);

  const revenueKpis = useMemo(() => {
    const totalRevenue = revenue.reduce((s, r) => s + parseFloat(r.revenue || 0), 0);
    const totalPipeline = revenue.reduce((s, r) => s + parseFloat(r.pipeline_value || 0), 0);
    const totalDeals = revenue.reduce((s, r) => s + parseInt(r.deal_count || 0, 10), 0);
    const top = [...revenue].sort((a, b) => parseFloat(b.revenue || 0) - parseFloat(a.revenue || 0))[0];
    return [
      { label: 'Won Revenue', val: totalRevenue, icon: faSackDollar, color: '#10b981', trend: 'up', trendVal: 'Closed' },
      { label: 'Open Pipeline', val: totalPipeline, icon: faCoins, color: '#6366f1', trend: 'up', trendVal: 'In Progress' },
      { label: 'Total Deals', val: totalDeals, icon: faHandshake, color: '#f59e0b', trend: 'up', trendVal: 'Across sources' },
      { label: 'Top Source', val: top?.source || '—', icon: faBullseye, color: '#06b6d4', trend: 'up', trendVal: top ? formatCurrency(top.revenue) : 'No data' },
    ];
  }, [revenue]);

  const renderKpis = (kpis) => (
    <div className="row g-3 mb-4">
      {kpis.map((k, i) => (
        <ErpKpiCard
          key={`${activeTab}-${i}`}
          label={k.label}
          value={k.val}
          icon={k.icon}
          color={k.color}
          trend={k.trend}
          trendVal={k.trendVal}
          isDark={isDark}
        />
      ))}
    </div>
  );

  const EmptyState = ({ message = 'No data available for this report.' }) => (
    <div className="text-center py-5" style={{ color: mutedColor }}>
      <FontAwesomeIcon icon={faInfoCircle} style={{ fontSize: '2.5rem', opacity: 0.3, marginBottom: '0.5rem' }} />
      <p className="mb-0" style={{ fontSize: '0.9rem' }}>{message}</p>
    </div>
  );

  const LoadingBlock = () => (
    <div className="text-center py-5" style={{ color: mutedColor }}>
      <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color: erpColors.primary, marginBottom: '0.75rem' }} />
      <p className="mb-0" style={{ fontSize: '0.85rem' }}>Loading report...</p>
    </div>
  );

  const ErrorBlock = ({ msg }) => (
    <div className="alert alert-danger mx-0" role="alert" style={{ borderRadius: '12px', fontSize: '0.85rem' }}>
      <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />{msg}
    </div>
  );

  const PipelineReport = () => {
    if (loading.pipeline) return <LoadingBlock />;
    if (error.pipeline) return <ErrorBlock msg={error.pipeline} />;
    if (!pipeline.length) return <EmptyState message="No pipeline data. Start tracking deals to see this report." />;
    const maxAmount = Math.max(...pipeline.map(p => parseFloat(p.total_amount || 0)), 1);
    const maxCount = Math.max(...pipeline.map(p => parseInt(p.count || 0, 10)), 1);
    const totalAmount = pipeline.reduce((s, p) => s + parseFloat(p.total_amount || 0), 0);
    const totalDeals = pipeline.reduce((s, p) => s + parseInt(p.count || 0, 10), 0);
    return (
      <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <div className="section-header mb-0">
            <div className="accent-bar" style={{ background: `linear-gradient(to bottom, #6366f1, #8b5cf6)` }} />
            <h6 style={{ color: textColor, margin: 0 }}>Deals by Pipeline Stage</h6>
          </div>
          <div className="d-flex gap-3 flex-wrap" style={{ fontSize: '0.78rem' }}>
            <span style={{ color: mutedColor }}><strong style={{ color: textColor }}>{formatNumber(totalDeals)}</strong> total deals</span>
            <span style={{ color: mutedColor }}><strong style={{ color: textColor }}>{formatCurrencyFull(totalAmount)}</strong> total value</span>
          </div>
        </div>
        <div className="d-flex flex-column gap-3">
          {pipeline.map((p, i) => {
            const amount = parseFloat(p.total_amount || 0);
            const count = parseInt(p.count || 0, 10);
            const weighted = parseFloat(p.weighted_amount || 0);
            const color = pickStageColor(i, pipeline.length);
            const amountPct = (amount / maxAmount) * 100;
            const countPct = (count / maxCount) * 100;
            const sharePct = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
            return (
              <div key={`${p.stage}-${i}`} className="enter-anim">
                <div className="d-flex justify-content-between align-items-end mb-1 flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>{p.stage}</span>
                    <span className="premium-badge" style={{ background: `${color}15`, color }}>
                      <span className="badge-dot" style={{ background: color }} />
                      {count} {count === 1 ? 'deal' : 'deals'}
                    </span>
                  </div>
                  <div className="d-flex gap-3 align-items-center" style={{ fontSize: '0.78rem' }}>
                    <span style={{ color: mutedColor }}>Weighted: <strong style={{ color: textColor }}>{formatCurrency(weighted)}</strong></span>
                    <span className="fw-bold" style={{ color }}>{formatCurrencyFull(amount)}</span>
                  </div>
                </div>
                <div style={{ height: 28, background: subtleBg, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${amountPct}%`, height: '100%',
                    background: `linear-gradient(90deg, ${color}cc, ${color}88)`,
                    borderRadius: 8, transition: 'width 0.6s ease',
                    boxShadow: `0 0 0 1px ${color}30 inset`,
                  }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '0.7rem', color: textColor, fontWeight: 600 }}>
                    {amountPct > 12 ? `${formatPercent(sharePct)} of total` : ''}
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.7rem' }}>
                  <span style={{ color: mutedColor }}>Volume intensity</span>
                  <span style={{ color: mutedColor }}>{countPct.toFixed(0)}% of peak</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ConversionReport = () => {
    if (loading.conversion) return <LoadingBlock />;
    if (error.conversion) return <ErrorBlock msg={error.conversion} />;
    if (!conversion.data?.length) return <EmptyState message="No conversion data. Add leads to see the funnel." />;
    const data = conversion.data;
    const maxCount = Math.max(...data.map(d => parseInt(d.count || 0, 10)), 1);
    const totalLeads = conversion.total_leads || data[0]?.count || 0;
    return (
      <div className="row g-3">
        <div className="col-lg-5">
          <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: `linear-gradient(to bottom, #06b6d4, #10b981)` }} />
              <h6 style={{ color: textColor, margin: 0 }}>Funnel Visual</h6>
            </div>
            <div className="d-flex flex-column align-items-stretch" style={{ gap: 6 }}>
              {data.map((d, i) => {
                const count = parseInt(d.count || 0, 10);
                const widthPct = (count / maxCount) * 100;
                const color = pickStageColor(i, data.length);
                return (
                  <div key={`${d.stage}-${i}`} className="d-flex flex-column align-items-center">
                    <div style={{
                      width: `${Math.max(widthPct, 12)}%`,
                      minWidth: 140,
                      maxWidth: '100%',
                      background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                      color: '#fff',
                      padding: '14px 18px',
                      borderRadius: 12,
                      textAlign: 'center',
                      boxShadow: `0 4px 14px ${color}40`,
                      transition: 'all 0.3s ease',
                    }}>
                      <div className="fw-bold" style={{ fontSize: '0.85rem' }}>{d.label || d.stage}</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 2 }}>{formatNumber(count)}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>{formatPercent(d.percentage)} of leads</div>
                    </div>
                    {i < data.length - 1 && (
                      <FontAwesomeIcon icon={faArrowRight} rotation={90} style={{ color: mutedColor, margin: '4px 0', fontSize: '0.85rem' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: `linear-gradient(to bottom, #8b5cf6, #06b6d4)` }} />
              <h6 style={{ color: textColor, margin: 0 }}>Stage Breakdown</h6>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leads</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Share</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage Rate</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, i) => {
                    const count = parseInt(d.count || 0, 10);
                    const color = pickStageColor(i, data.length);
                    return (
                      <tr key={`row-${d.stage}-${i}`}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                            <span className="fw-bold" style={{ color: textColor }}>{d.label || d.stage}</span>
                          </div>
                        </td>
                        <td className="fw-bold" style={{ color: textColor }}>{formatNumber(count)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 60, height: 6, background: subtleBg, borderRadius: 100, overflow: 'hidden' }}>
                              <div style={{ width: `${parseFloat(d.percentage || 0)}%`, height: '100%', background: color, borderRadius: 100 }} />
                            </div>
                            <span style={{ color: mutedColor, fontSize: '0.75rem' }}>{formatPercent(d.percentage)}</span>
                          </div>
                        </td>
                        <td><span className="premium-badge" style={{ background: `${color}15`, color }}>{formatPercent(d.percentage)}</span></td>
                        <td>
                          <div className="d-flex align-items-center gap-1" style={{ color: parseFloat(d.conversion_rate || 0) >= 30 ? '#10b981' : parseFloat(d.conversion_rate || 0) >= 10 ? '#f59e0b' : '#ef4444' }}>
                            {parseFloat(d.conversion_rate || 0) >= 10 ? <FontAwesomeIcon icon={faArrowTrendUp} /> : <FontAwesomeIcon icon={faArrowTrendDown} />}
                            <span className="fw-bold">{formatPercent(d.conversion_rate)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${borderColor}`, fontSize: '0.78rem', color: mutedColor }}>
              Total leads in funnel: <strong style={{ color: textColor }}>{formatNumber(totalLeads)}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ACTIVITY_ICONS = {
    call: faPhone, email: faEnvelope, meeting: faPeopleGroup,
    task: faClipboardCheck, note: faComments, demo: faBriefcase,
    follow_up: faArrowRight, visit: faArrowUpRightFromSquare,
  };

  const ActivityReport = () => {
    if (loading.activity) return <LoadingBlock />;
    if (error.activity) return <ErrorBlock msg={error.activity} />;
    if (!activity.length) return <EmptyState message="No activity data yet." />;
    return (
      <div className="row g-3">
        {activity.map((a, i) => {
          const total = parseInt(a.total || 0, 10);
          const done = parseInt(a.completed || 0, 10);
          const rate = parseFloat(a.completion_rate || (total > 0 ? (done / total) * 100 : 0));
          const remaining = Math.max(total - done, 0);
          const color = pickStageColor(i, activity.length);
          const typeKey = String(a.type || '').toLowerCase().replace(/\s+/g, '_');
          const icon = ACTIVITY_ICONS[typeKey] || faClipboardCheck;
          return (
            <div key={`${a.type}-${i}`} className="col-xl-3 col-lg-4 col-md-6 col-12">
              <div className="enter-anim">
                <div className="premium-card" style={{
                  borderRadius: 16, padding: '1.25rem', background: cardBg,
                  border: `1px solid ${borderColor}`,
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.04)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${color}, ${color}88, ${color})`, opacity: 0.7,
                  }} />
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: `linear-gradient(135deg, ${color}25, ${color}10)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FontAwesomeIcon icon={icon} style={{ color, fontSize: '0.95rem' }} />
                    </div>
                    <span className="premium-badge" style={{ background: `${color}15`, color }}>
                      {String(a.type || 'Activity').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <div>
                      <div style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Total</div>
                      <div className="fw-bold" style={{ color: textColor, fontSize: '1.5rem', lineHeight: 1 }}>{formatNumber(total)}</div>
                    </div>
                    <div className="text-end">
                      <div style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Completed</div>
                      <div className="fw-bold" style={{ color: '#10b981', fontSize: '1.5rem', lineHeight: 1 }}>{formatNumber(done)}</div>
                    </div>
                  </div>
                  <div style={{ height: 8, background: subtleBg, borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(rate, 100)}%`, height: '100%',
                      background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                      borderRadius: 100, transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <div className="d-flex justify-content-between mt-2" style={{ fontSize: '0.72rem' }}>
                    <span style={{ color: mutedColor }}>{remaining} remaining</span>
                    <span className="fw-bold" style={{ color }}>{formatPercent(rate)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const rankBadge = (idx) => {
    if (idx === 0) return { icon: faCrown, color: '#f59e0b', label: '1st' };
    if (idx === 1) return { icon: faMedal, color: '#94a3b8', label: '2nd' };
    if (idx === 2) return { icon: faMedal, color: '#b45309', label: '3rd' };
    return { icon: faStar, color: mutedColor, label: `#${idx + 1}` };
  };

  const PerformersReport = () => {
    if (loading.performers) return <LoadingBlock />;
    if (error.performers) return <ErrorBlock msg={error.performers} />;
    if (!performers.length) return <EmptyState message="No performer data. Assign deals to users to track performance." />;
    const sorted = [...performers].sort((a, b) => parseFloat(b.total_revenue || 0) - parseFloat(a.total_revenue || 0));
    const maxRevenue = Math.max(...sorted.map(p => parseFloat(p.total_revenue || 0)), 1);
    return (
      <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem' }}>
        <div className="section-header">
          <div className="accent-bar" style={{ background: `linear-gradient(to bottom, #f59e0b, #ef4444)` }} />
          <h6 style={{ color: textColor, margin: 0 }}>Sales Leaderboard</h6>
        </div>
        <div className="d-flex flex-column gap-2">
          {sorted.map((p, i) => {
            const totalDeals = parseInt(p.total_deals || 0, 10);
            const wonDeals = parseInt(p.won_deals || 0, 10);
            const lostDeals = parseInt(p.lost_deals || 0, 10);
            const revenue = parseFloat(p.total_revenue || 0);
            const avg = parseFloat(p.avg_deal_size || 0);
            const winRate = totalDeals > 0 ? (wonDeals / totalDeals) * 100 : 0;
            const widthPct = (revenue / maxRevenue) * 100;
            const name = p.assignedUser?.name || p.assigned_to || 'Unassigned';
            const email = p.assignedUser?.email || '';
            const badge = rankBadge(i);
            return (
              <div key={`${p.assigned_to || 'x'}-${i}`} className="enter-anim" style={{
                background: i < 3 ? `${badge.color}10` : subtleBg,
                border: `1px solid ${i < 3 ? `${badge.color}40` : borderColor}`,
                borderRadius: 12, padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: i < 3 ? `linear-gradient(135deg, ${badge.color}, ${badge.color}aa)` : subtleBg,
                  border: i < 3 ? 'none' : `1px solid ${borderColor}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, position: 'relative',
                }}>
                  {i < 3 ? (
                    <FontAwesomeIcon icon={badge.icon} style={{ color: '#fff', fontSize: '1.05rem' }} />
                  ) : (
                    <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>{i + 1}</span>
                  )}
                </div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="fw-bold text-white" style={{ fontSize: '0.85rem' }}>{initials(name)}</span>
                </div>
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>{name}</span>
                    {i < 3 && (
                      <span className="premium-badge" style={{ background: `${badge.color}25`, color: badge.color }}>
                        <FontAwesomeIcon icon={badge.icon} style={{ fontSize: '0.65rem' }} />{badge.label}
                      </span>
                    )}
                    {email && <span style={{ color: mutedColor, fontSize: '0.72rem' }}>{email}</span>}
                  </div>
                  <div style={{ height: 8, background: subtleBg, borderRadius: 100, overflow: 'hidden', marginTop: 6 }}>
                    <div style={{ width: `${widthPct}%`, height: '100%', background: `linear-gradient(90deg, ${badge.color}, ${badge.color}aa)`, borderRadius: 100, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
                <div className="d-flex gap-3 flex-wrap" style={{ flexShrink: 0 }}>
                  <div className="text-center">
                    <div style={{ color: mutedColor, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Won</div>
                    <div className="fw-bold" style={{ color: '#10b981', fontSize: '0.95rem' }}>{formatNumber(wonDeals)}</div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: mutedColor, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Lost</div>
                    <div className="fw-bold" style={{ color: '#ef4444', fontSize: '0.95rem' }}>{formatNumber(lostDeals)}</div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: mutedColor, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Win Rate</div>
                    <div className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>{winRate.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: mutedColor, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Avg Deal</div>
                    <div className="fw-bold" style={{ color: textColor, fontSize: '0.95rem' }}>{formatCurrency(avg)}</div>
                  </div>
                  <div className="text-center" style={{ minWidth: 110 }}>
                    <div style={{ color: mutedColor, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Revenue</div>
                    <div className="fw-bold" style={{ color: '#10b981', fontSize: '1rem' }}>{formatCurrencyFull(revenue)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const RevenueReport = () => {
    if (loading.revenue) return <LoadingBlock />;
    if (error.revenue) return <ErrorBlock msg={error.revenue} />;
    if (!revenue.length) return <EmptyState message="No revenue source data. Tag deals with sources to see this report." />;
    const sorted = [...revenue].sort((a, b) => parseFloat(b.revenue || 0) - parseFloat(a.revenue || 0));
    const maxRev = Math.max(...sorted.map(r => parseFloat(r.revenue || 0)), 1);
    const totalRev = sorted.reduce((s, r) => s + parseFloat(r.revenue || 0), 0);
    const totalPipe = sorted.reduce((s, r) => s + parseFloat(r.pipeline_value || 0), 0);
    return (
      <div className="row g-3">
        <div className="col-lg-7">
          <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: `linear-gradient(to bottom, #10b981, #06b6d4)` }} />
              <h6 style={{ color: textColor, margin: 0 }}>Revenue Distribution</h6>
            </div>
            <div className="d-flex flex-column gap-3">
              {sorted.map((r, i) => {
                const rev = parseFloat(r.revenue || 0);
                const pipe = parseFloat(r.pipeline_value || 0);
                const count = parseInt(r.deal_count || 0, 10);
                const color = pickStageColor(i, sorted.length);
                const widthPct = (rev / maxRev) * 100;
                const sharePct = totalRev > 0 ? (rev / totalRev) * 100 : 0;
                return (
                  <div key={`${r.source}-${i}`} className="enter-anim">
                    <div className="d-flex justify-content-between align-items-end mb-1 flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                        <span className="fw-bold" style={{ color: textColor, fontSize: '0.9rem' }}>{r.source}</span>
                        <span className="premium-badge" style={{ background: `${color}15`, color }}>
                          <span className="badge-dot" style={{ background: color }} />
                          {count} {count === 1 ? 'deal' : 'deals'}
                        </span>
                      </div>
                      <div className="d-flex gap-3" style={{ fontSize: '0.78rem' }}>
                        <span style={{ color: mutedColor }}>Pipeline: <strong style={{ color: textColor }}>{formatCurrency(pipe)}</strong></span>
                        <span className="fw-bold" style={{ color }}>{formatCurrencyFull(rev)}</span>
                      </div>
                    </div>
                    <div style={{ height: 22, background: subtleBg, borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: `${widthPct}%`, height: '100%', background: `linear-gradient(90deg, ${color}cc, ${color}88)`, borderRadius: 8, transition: 'width 0.6s ease' }} />
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: '0.7rem', color: textColor, fontWeight: 600 }}>
                        {widthPct > 18 ? `${sharePct.toFixed(1)}% of revenue` : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="glass-card" style={{ borderRadius: '16px', padding: '1.5rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: `linear-gradient(to bottom, #6366f1, #10b981)` }} />
              <h6 style={{ color: textColor, margin: 0 }}>Source Ranking</h6>
            </div>
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deals</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Won</th>
                    <th style={{ color: mutedColor, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((r, i) => {
                    const color = pickStageColor(i, sorted.length);
                    const rev = parseFloat(r.revenue || 0);
                    const pipe = parseFloat(r.pipeline_value || 0);
                    const count = parseInt(r.deal_count || 0, 10);
                    return (
                      <tr key={`row-${r.source}-${i}`}>
                        <td>
                          <span style={{
                            width: 26, height: 26, borderRadius: 8,
                            background: i < 3 ? `${color}25` : subtleBg, color,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.75rem',
                          }}>{i + 1}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                            <span className="fw-bold" style={{ color: textColor }}>{r.source}</span>
                          </div>
                        </td>
                        <td style={{ color: textColor }}>{formatNumber(count)}</td>
                        <td className="fw-bold" style={{ color: '#10b981' }}>{formatCurrencyFull(rev)}</td>
                        <td style={{ color: mutedColor }}>{formatCurrency(pipe)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: `2px solid ${borderColor}` }}>
                    <td colSpan={3} className="fw-bold" style={{ color: mutedColor, fontSize: '0.7rem', textTransform: 'uppercase' }}>Total</td>
                    <td className="fw-bold" style={{ color: '#10b981' }}>{formatCurrencyFull(totalRev)}</td>
                    <td className="fw-bold" style={{ color: mutedColor }}>{formatCurrency(totalPipe)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    switch (activeTab) {
      case 'pipeline': return <>{renderKpis(pipelineKpis)}<PipelineReport /></>;
      case 'conversion': return <>{renderKpis(conversionKpis)}<ConversionReport /></>;
      case 'activity': return <>{renderKpis(activityKpis)}<ActivityReport /></>;
      case 'performers': return <>{renderKpis(performersKpis)}<PerformersReport /></>;
      case 'revenue': return <>{renderKpis(revenueKpis)}<RevenueReport /></>;
      default: return null;
    }
  };

  return (
    <ErpPageShell
      icon={faChartLine}
      title="CRM Reports & Analytics"
      description="Pipeline health, conversion funnels, activity performance, top performers, and revenue attribution across sources."
      badge="Insights"
      action={
        <button onClick={refreshAll} className="btn btn-sm text-white border-0 premium-gradient-btn d-flex align-items-center gap-1 px-3" style={{ fontSize: '0.8rem' }}>
          <FontAwesomeIcon icon={faCircleNotch} /> Refresh All
        </button>
      }
    >
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="erp-tab-container">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`erp-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <FontAwesomeIcon icon={tab.icon} style={{ color: activeTab === tab.key ? '#fff' : tab.color }} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {renderReport()}
    </ErpPageShell>
  );
};

export default CrmReports;
