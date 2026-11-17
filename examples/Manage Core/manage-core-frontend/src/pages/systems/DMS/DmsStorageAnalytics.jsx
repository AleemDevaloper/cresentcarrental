import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import { getDmsAnalytics } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHardDrive, faChartLine, faChartPie, faDatabase,
  faFile, faFilePdf, faFileWord, faFileExcel, faFileImage,
  faArrowUp, faArrowDown, faCalendar, faBuilding, faCloud,
  faArchive, faRocket, faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { MetricCard, HeaderCard } from '../../../components/common/UI/Cards';
import { AppLineChart, AppDoughnutChart, AppBarChart } from '../../../components/common/UI/Charts';

const DmsStorageAnalytics = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getDmsAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch storage analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    primary: '#3b82f6', success: '#10b981', warning: '#f59e0b', danger: '#ef4444',
    info: '#06b6d4', purple: '#8b5cf6', pink: '#ec4899', teal: '#14b8a6',
    text: isDark ? '#f1f5f9' : '#1e293b', grid: isDark ? '#334155' : '#e2e8f0',
  };

  const departmentStorage = analytics?.departmentStorage || [];
  const storageByType = analytics?.storageByType || {};
  const trendData = analytics?.trend || [];

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const storageSummary = [
    { label: 'Total Storage Used', value: '2.4 TB', icon: faHardDrive, color: colors.primary, detail: 'of 5 TB allocated' },
    { label: 'Average File Size', value: '2.3 MB', icon: faFile, color: colors.success, detail: 'across all documents' },
    { label: 'Documents per User', value: '47', icon: faUsers, color: colors.purple, detail: 'avg per active user' },
    { label: 'Monthly Growth Rate', value: '+5.2%', icon: faChartLine, color: colors.warning, detail: 'increasing trend' },
  ];

  const fileTypeBreakdown = Object.keys(storageByType).length > 0 ? Object.entries(storageByType).map(([type, size]) => ({
    type,
    size: formatBytes(size),
    percentage: Math.round((size / Object.values(storageByType).reduce((a, b) => a + b, 0)) * 100),
    color: type.toLowerCase().includes('pdf') ? colors.danger : type.toLowerCase().includes('doc') ? colors.primary : type.toLowerCase().includes('xls') ? colors.success : type.toLowerCase().includes('image') ? colors.pink : colors.purple,
    icon: type.toLowerCase().includes('pdf') ? faFilePdf : type.toLowerCase().includes('doc') ? faFileWord : type.toLowerCase().includes('xls') ? faFileExcel : faFileImage,
  })) : [];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
          <p className={`small ${isDark ? 'text-light' : 'text-muted'}`}>Loading storage analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 fade-in">
      <HeaderCard
        title="Storage Analytics"
        description="Monitor storage usage, growth trends, file distribution, and forecast capacity needs."
        icon={faHardDrive}
      />

      <div className="row g-3 mb-4">
        {storageSummary.map((s, idx) => (
          <div key={idx} className="col-xl-3 col-md-6">
            <MetricCard label={s.label} value={s.value} icon={s.icon} color={s.color} isDark={isDark} />
            {s.detail && <span className="x-small text-muted d-block mt-1 ps-1">{s.detail}</span>}
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <AppLineChart
            title="Document Growth Trend"
            labels={trendData.map(t => t.day || t.date || '')}
            datasets={[
              {
                label: 'Documents Added',
                data: trendData.map(t => t.count || 0),
                borderColor: colors.primary,
                backgroundColor: 'rgba(59,130,246,0.1)',
                fill: true, tension: 0.4, borderWidth: 3,
                pointBackgroundColor: colors.primary,
              },
              {
                label: 'Moving Avg (7d)',
                data: trendData.map((_, i, arr) => {
                  const slice = arr.slice(Math.max(0, i - 6), i + 1);
                  return Math.round(slice.reduce((s, d) => s + (d.count || 0), 0) / slice.length);
                }),
                borderColor: colors.teal,
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                fill: false,
              }
            ]}
            height={300}
            isDark={isDark}
          />
        </div>
        <div className="col-xl-4">
          <AppDoughnutChart
            title="File Type Distribution"
            labels={fileTypeBreakdown.map(f => f.type)}
            datasets={[{ data: fileTypeBreakdown.map(f => f.percentage), backgroundColor: fileTypeBreakdown.map(f => f.color), borderWidth: 0, hoverOffset: 15 }]}
            size={250}
            cutout="65%"
            isDark={isDark}
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-6">
          <AppBarChart
            title="Department Storage Usage"
            labels={departmentStorage.map(d => d.department)}
            datasets={[{
              label: 'Storage (GB)',
              data: departmentStorage.map(d => d.usage || d.count || 0),
              backgroundColor: [colors.primary, colors.success, colors.warning, colors.pink, colors.purple, colors.info, colors.teal, colors.danger],
              borderRadius: 6, borderSkipped: false,
            }]}
            horizontal
            height={280}
            isDark={isDark}
          />
        </div>
        <div className="col-xl-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                <FontAwesomeIcon icon={faDatabase} className="me-2" style={{ color: colors.warning }} />File Type Breakdown
              </h5>
              <div className="d-flex flex-column gap-3">
                {fileTypeBreakdown.map((ft, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={ft.icon} style={{ color: ft.color }} />
                        <span className="small fw-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{ft.type}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="small fw-bold" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{ft.size}</span>
                        <span className="x-small text-muted">({ft.percentage}%)</span>
                      </div>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: isDark ? '#334155' : '#e2e8f0' }}>
                      <div className="progress-bar rounded-pill" style={{ width: `${ft.percentage}%`, backgroundColor: ft.color }} />
                    </div>
                  </div>
                ))}
                {fileTypeBreakdown.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <FontAwesomeIcon icon={faDatabase} className="fs-2 mb-2 opacity-30" />
                    <p className="small mb-0">No storage data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : ''}`}>
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-xl-6">
              <h5 className="fw-bold mb-3" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                <FontAwesomeIcon icon={faCloud} className="me-2" style={{ color: colors.teal }} />Storage Forecast
              </h5>
              <div className={`p-4 rounded-4 ${isDark ? 'bg-dark border-secondary' : 'bg-light'}`}>
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '120px', height: '120px', border: `6px solid ${colors.primary}20` }}>
                      <div className="text-center">
                        <div className="h3 fw-bold mb-0" style={{ color: colors.primary }}>48%</div>
                        <span className="x-small text-muted">utilized</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1 small">
                      <span className="text-muted">Current: 2.4 TB</span>
                      <span className="text-muted">Limit: 5 TB</span>
                    </div>
                    <div className="progress rounded-pill" style={{ height: '10px', backgroundColor: isDark ? '#334155' : '#e2e8f0' }}>
                      <div className="progress-bar rounded-pill" style={{ width: '48%', background: `linear-gradient(90deg, ${colors.primary}, ${colors.purple})` }} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between p-3 rounded-3" style={{ backgroundColor: isDark ? '#0f172a' : '#ffffff' }}>
                    <div>
                      <p className="x-small text-muted fw-bold mb-1">Estimated Days Remaining</p>
                      <p className="h5 fw-bold mb-0" style={{ color: colors.primary }}>186 days</p>
                    </div>
                    <div className="text-end">
                      <p className="x-small text-muted fw-bold mb-1">Growth Rate</p>
                      <div className="d-flex align-items-center gap-1 justify-content-end">
                        <FontAwesomeIcon icon={faArrowUp} className="text-danger" style={{ fontSize: '0.7rem' }} />
                        <span className="small fw-bold text-danger">+5.2%/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <h5 className="fw-bold mb-3" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                <FontAwesomeIcon icon={faArchive} className="me-2" style={{ color: colors.warning }} />Archive Recommendations
              </h5>
              <div className="d-flex flex-column gap-3">
                {[
                  { reason: 'Not accessed in 90+ days', count: 234, size: '12.5 GB' },
                  { reason: 'Multiple versions available', count: 89, size: '4.2 GB' },
                  { reason: 'Expired documents', count: 128, size: '8.7 GB' },
                  { reason: 'Duplicate files detected', count: 45, size: '2.1 GB' },
                ].map((rec, idx) => (
                  <div key={idx} className={`p-3 rounded-4 border d-flex justify-content-between align-items-center ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3" style={{ backgroundColor: `${colors.warning}15`, color: colors.warning }}>
                        <FontAwesomeIcon icon={faArchive} />
                      </div>
                      <div>
                        <span className="small fw-medium" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{rec.reason}</span>
                        <div className="d-flex gap-2 mt-1">
                          <span className="x-small text-muted">{rec.count} documents</span>
                          <span className="x-small text-muted">{rec.size}</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-sm btn-outline-warning rounded-pill px-3 fw-bold" onClick={() => addNotification('Archive recommendation action coming soon.', 'info')}>
                      Archive
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ${isDark ? `.bg-light { background-color: #1e293b !important; } .text-muted { color: #94a3b8 !important; } .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; }` : ''}
      `}</style>
    </div>
  );
};

export default DmsStorageAnalytics;
