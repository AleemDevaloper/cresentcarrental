import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { getDmsStats, getDmsAnalytics } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faCheckCircle, faFileSignature, faUsers, faHardDrive,
  faClock, faRocket, faBuilding
} from "@fortawesome/free-solid-svg-icons";
import { StatCard } from '../../../components/common/UI/Cards';
import { AppLineChart, AppBarChart, AppDoughnutChart } from '../../../components/common/UI/Charts';

const DmsAnalyticsDashboard = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, analyticsData] = await Promise.all([getDmsStats(), getDmsAnalytics()]);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to fetch analytics data', err);
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    primary: '#3b82f6', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
    info: '#06b6d4', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6',
    text: isDark ? '#f1f5f9' : '#1e293b', grid: isDark ? '#334155' : '#e2e8f0',
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const trendData = analytics?.trend || [];
  const statusDist = analytics?.statusDistribution || {};
  const departmentStorage = analytics?.departmentStorage || [];
  const storageByType = analytics?.storageByType || {};

  const metricCards = [
    { label: 'Documents Created', value: formatNumber(stats?.totalDocuments), change: '+12.5%', icon: faRocket, color: colors.primary, up: true },
    { label: 'Approval Rate', value: stats?.totalDocuments ? Math.round((stats?.approvedDocuments || 0) / stats.totalDocuments * 100) + '%' : '0%', change: '+5.2%', icon: faCheckCircle, color: colors.success, up: true },
    { label: 'Signature Completion', value: stats?.signedDocuments ? Math.round((stats?.signedDocuments || 0) / (stats?.totalDocuments || 1) * 100) + '%' : '0%', change: '+8.1%', icon: faFileSignature, color: colors.purple, up: true },
    { label: 'Department Usage', value: departmentStorage.length, change: '0', icon: faBuilding, color: colors.info, up: true },
    { label: 'Storage Consumption', value: stats?.storageUsed || '0 B', change: '+2.3%', icon: faHardDrive, color: colors.warning, up: true },
    { label: 'Document Growth', value: trendData.reduce((s, d) => s + (d.count || 0), 0), change: '+15.3%', icon: faChartLine, color: colors.teal, up: true },
    { label: 'Top Contributors', value: '—', change: '—', icon: faUsers, color: colors.pink, up: true },
    { label: 'Avg Approval Time', value: analytics?.avgApprovalTime || '—', change: '-2.1h', icon: faClock, color: colors.danger, up: false },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
          <p className={`small ${isDark ? 'text-light' : 'text-muted'}`}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>Analytics Dashboard</h4>
          <p className="text-muted small mb-0">Documents, approvals, signatures, and user activity analytics.</p>
        </div>
        <div className="d-flex gap-2">
          {['7d', '30d', '90d', '1y'].map(r => (
            <button key={r} className={`btn btn-sm rounded-pill px-3 fw-bold border-0 ${timeRange === r ? 'btn-primary' : 'btn-light'}`} onClick={() => setTimeRange(r)}>
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-4">
        {metricCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-lg-4 col-md-6">
            <StatCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
              isDark={isDark}
              trend={card.change !== '—' ? { value: card.change, up: card.up } : undefined}
            />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <AppLineChart
            title="Document Lifecycle Analytics"
            labels={trendData.map(t => t.day || t.date)}
            datasets={[
              { label: 'Created', data: trendData.map(t => t.count || 0), borderColor: colors.primary, backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, borderWidth: 3 },
              { label: 'Approved', data: trendData.map(t => t.approved || 0), borderColor: colors.success, backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, borderWidth: 2 },
              { label: 'Signed', data: trendData.map(t => t.signed || 0), borderColor: colors.purple, backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4, borderWidth: 2 },
            ]}
            height={300}
            isDark={isDark}
          />
        </div>
        <div className="col-xl-4">
          <AppDoughnutChart
            title="Document Status"
            labels={Object.keys(statusDist)}
            datasets={[{ data: Object.values(statusDist), backgroundColor: [colors.warning, colors.info, colors.primary, colors.success, colors.danger, colors.purple], borderWidth: 0, hoverOffset: 15 }]}
            size={260}
            cutout="65%"
            isDark={isDark}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-6">
          <AppBarChart
            title="Department Usage"
            labels={departmentStorage.map(d => d.department)}
            datasets={[{
              label: 'Documents',
              data: departmentStorage.map(d => d.count || d.usage || 0),
              backgroundColor: [colors.primary, colors.success, colors.warning, colors.pink, colors.purple, colors.info, colors.teal, colors.danger],
              borderRadius: 6, borderSkipped: false,
            }]}
            horizontal
            height={280}
            isDark={isDark}
          />
        </div>
        <div className="col-xl-6">
          <AppDoughnutChart
            title="File Type Distribution"
            labels={Object.keys(storageByType)}
            datasets={[{ data: Object.values(storageByType), backgroundColor: [colors.danger, colors.primary, colors.success, colors.pink, colors.purple], borderWidth: 0, hoverOffset: 15 }]}
            size={260}
            cutout="60%"
            isDark={isDark}
          />
        </div>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DmsAnalyticsDashboard;
