import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../../hooks/useApp';
import { getDmsStats, getDmsAnalytics } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile, faFileAlt, faClock, faCheckCircle, faFileSignature,
  faHardDrive, faShareAlt, faFileExport, faFolderOpen,
  faChartBar, faChartLine, faChartPie, faDatabase,
  faUpload, faSearch, faPlus, faEllipsisV, faDownload,
  faEye, faTrash, faEdit, faArchive, faExclamationTriangle,
  faFilePdf, faFileWord, faFileExcel, faFileImage, faFileArchive,
  faUsers, faHistory, faArrowUp, faArrowDown, faCircle,
  faRocket, faLayerGroup, faArrowRight, faRobot, faCamera,
  faCog, faBolt, faFileInvoice, faFolderPlus, faChevronRight,
  faCloudUploadAlt, faFileContract, faStamp, faPaperclip,
  faExpandArrowsAlt, faBoxes, faChartSimple, faTriangleExclamation,
  faCircleCheck, faSpinner,   faTimes, faCalendarAlt, faInfoCircle,
  faLightbulb, faStar, faUser
} from "@fortawesome/free-solid-svg-icons";
import { Line, Doughnut } from 'react-chartjs-2';
import ChartWrapper, { chartDefaults, getChartColors } from '../../../components/common/UI/Charts/ChartWrapper';

const THEME = {
  light: {
    bodyBg: '#f0f2f5',
    cardBg: '#ffffff',
    cardBorder: '#e8ecf1',
    text: '#0b1a33',
    textSecondary: '#5b677b',
    muted: '#8892a6',
    divider: '#e8ecf1',
    hover: '#f5f7fa',
    accent: '#f8f9fe',
    chartGrid: '#eef0f4',
    shadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    shadowHover: '0 8px 30px rgba(0,0,0,0.08)',
    primary: '#4f46e5',
    success: '#0f973d',
    warning: '#e98a1c',
    danger: '#dc2626',
    info: '#0891b2',
    purple: '#7c3aed',
    pink: '#db2777',
    teal: '#0d9488',
    indigo: '#4f46e5',
  },
  dark: {
    bodyBg: '#0b1120',
    cardBg: '#131b2e',
    cardBorder: '#1e293b',
    text: '#e2e8f0',
    textSecondary: '#94a3b8',
    muted: '#64748b',
    divider: '#1e293b',
    hover: '#1a2332',
    accent: '#151e30',
    chartGrid: '#1e293b',
    shadow: '0 1px 3px rgba(0,0,0,0.2)',
    shadowHover: '0 8px 30px rgba(0,0,0,0.4)',
    primary: '#6366f1',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
    indigo: '#6366f1',
  }
};

const FILE_TYPE_CONFIG = {
  pdf: { icon: faFilePdf, color: '#ef4444', bg: '#fef2f2', label: 'PDF' },
  doc: { icon: faFileWord, color: '#2563eb', bg: '#eff6ff', label: 'Word' },
  docx: { icon: faFileWord, color: '#2563eb', bg: '#eff6ff', label: 'Word' },
  xls: { icon: faFileExcel, color: '#16a34a', bg: '#f0fdf4', label: 'Excel' },
  xlsx: { icon: faFileExcel, color: '#16a34a', bg: '#f0fdf4', label: 'Excel' },
  png: { icon: faFileImage, color: '#d946ef', bg: '#fdf4ff', label: 'Image' },
  jpg: { icon: faFileImage, color: '#d946ef', bg: '#fdf4ff', label: 'Image' },
  jpeg: { icon: faFileImage, color: '#d946ef', bg: '#fdf4ff', label: 'Image' },
  gif: { icon: faFileImage, color: '#d946ef', bg: '#fdf4ff', label: 'Image' },
  svg: { icon: faFileImage, color: '#d946ef', bg: '#fdf4ff', label: 'Image' },
  zip: { icon: faFileArchive, color: '#f59e0b', bg: '#fffbeb', label: 'Archive' },
  rar: { icon: faFileArchive, color: '#f59e0b', bg: '#fffbeb', label: 'Archive' },
};

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6', '#ef4444'];

const STORAGE_TYPES = [
  { key: 'pdf', label: 'PDF Documents', icon: faFilePdf, color: '#ef4444' },
  { key: 'images', label: 'Images', icon: faFileImage, color: '#d946ef' },
  { key: 'documents', label: 'Word Documents', icon: faFileWord, color: '#2563eb' },
  { key: 'spreadsheets', label: 'Spreadsheets', icon: faFileExcel, color: '#16a34a' },
  { key: 'archives', label: 'Archives', icon: faFileArchive, color: '#f59e0b' },
  { key: 'other', label: 'Other', icon: faFile, color: '#94a3b8' },
];

const DmsDashboard = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const t = isDark ? THEME.dark : THEME.light;

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendRange, setTrendRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [statsData, analyticsData] = await Promise.all([
          getDmsStats(),
          getDmsAnalytics()
        ]);
        setStats(statsData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFileConfig = (name) => {
    if (!name) return FILE_TYPE_CONFIG.other || { icon: faFile, color: t.muted, bg: t.hover, label: 'File' };
    const ext = name.split('.').pop()?.toLowerCase();
    return FILE_TYPE_CONFIG[ext] || { icon: faFile, color: t.muted, bg: t.hover, label: 'File' };
  };

  const trendData = useMemo(() => {
    const raw = stats?.trend || analytics?.documentGrowth || [];
    if (Array.isArray(raw) && raw.length > 0 && raw[0].day !== undefined) return raw;
    if (Array.isArray(raw) && raw.length > 0 && raw[0].month !== undefined) {
      return raw.map(r => ({ day: r.month, count: r.count }));
    }
    return [
      { day: 'Mon', count: 0 }, { day: 'Tue', count: 0 }, { day: 'Wed', count: 0 },
      { day: 'Thu', count: 0 }, { day: 'Fri', count: 0 }, { day: 'Sat', count: 0 }, { day: 'Sun', count: 0 }
    ];
  }, [stats, analytics]);

  const storageByType = useMemo(() => {
    const raw = stats?.storageByType || analytics?.fileTypeDistribution || {};
    if (Array.isArray(raw)) {
      const obj = {};
      raw.forEach(item => {
        const key = item.type || item.file_type || 'other';
        obj[key] = parseInt(item.total_size || item.count || item.size_bytes || 0);
      });
      return Object.keys(obj).length > 0 ? obj : {};
    }
    return raw;
  }, [stats, analytics]);

  const departmentStorage = useMemo(() => {
    const raw = analytics?.storageByDepartment || [];
    if (Array.isArray(raw)) {
      return raw.map(d => ({
        department: d.department || 'Unknown',
        usage: d.size_bytes ? d.size_bytes / (1024 * 1024 * 1024) : parseFloat(d.size_formatted || 0),
      }));
    }
    return [];
  }, [analytics]);

  const statusDist = useMemo(() => {
    const raw = analytics?.approvalStats || { pending: 0, approved: 0, rejected: 0, escalated: 0 };
    return {
      Pending: raw.pending || 0,
      Approved: raw.approved || 0,
      Rejected: raw.rejected || 0,
      Escalated: raw.escalated || 0,
    };
  }, [analytics]);

  const mostAccessed = useMemo(() => {
    const raw = analytics?.mostAccessed || [];
    return Array.isArray(raw) ? raw.map(d => ({
      id: d.id, name: d.name, view_count: d.view_count || 0,
      download_count: d.download_count || 0, last_accessed: d.updated_at || null,
    })) : [];
  }, [analytics]);

  const recentActivity = useMemo(() => {
    const raw = stats?.recentDocuments || analytics?.recentActivity || [];
    if (Array.isArray(raw) && raw.length > 0 && raw[0].action !== undefined) return raw;
    if (Array.isArray(raw) && raw[0]?.name !== undefined) {
      return raw.map(d => ({
        id: d.id, document_name: d.name, action: 'upload',
        user_name: d.owner?.name || d.creator?.name || 'System',
        created_at: d.created_at,
      }));
    }
    return [];
  }, [stats, analytics]);

  const totalStorage = useMemo(() => {
    const vals = Object.values(storageByType);
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) : 0;
  }, [storageByType]);

  const statusKeys = Object.keys(statusDist);
  const statusValues = Object.values(statusDist);
  const totalDocs = statusValues.reduce((a, b) => a + b, 0);

  const growthRate = useMemo(() => {
    if (trendData.length < 2) return 0;
    const first = trendData[0].count;
    const last = trendData[trendData.length - 1].count;
    if (first === 0) return last > 0 ? 100 : 0;
    return ((last - first) / first) * 100;
  }, [trendData]);

  const palette = useMemo(() => {
    return statusKeys.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  }, [statusKeys]);

  const getActivityIcon = useCallback((action) => {
    switch (action?.toLowerCase()) {
      case 'upload': return faUpload;
      case 'download': return faDownload;
      case 'view': case 'viewed': return faEye;
      case 'edit': case 'updated': return faEdit;
      case 'delete': return faTrash;
      case 'share': return faShareAlt;
      case 'archive': return faArchive;
      case 'sign': case 'signed': return faFileSignature;
      case 'approve': case 'approved': return faCheckCircle;
      default: return faFile;
    }
  }, []);

  if (loading) {
    return (
      <div style={{ background: t.bodyBg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div className="position-relative d-inline-flex mb-4">
            <div className="spinner-border" style={{ width: '3rem', height: '3rem', borderWidth: '3px', color: t.primary, opacity: 0.4 }} role="status" />
            <div className="position-absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <FontAwesomeIcon icon={faFile} style={{ color: t.primary, fontSize: '1rem', opacity: 0.8 }} />
            </div>
          </div>
          <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: 500 }}>Loading DMS Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: t.bodyBg, minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '440px', margin: '80px auto' }}>
          <div style={{ background: t.cardBg, borderRadius: '20px', padding: '3rem 2rem', textAlign: 'center', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `${t.danger}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: t.danger, fontSize: '1.6rem' }} />
            </div>
            <h5 style={{ color: t.text, fontWeight: 700, marginBottom: '0.5rem' }}>Failed to Load Dashboard</h5>
            <p style={{ color: t.textSecondary, fontSize: '0.85rem', marginBottom: '1.5rem' }}>{error}</p>
            <button onClick={() => { setLoading(true); setError(null); }}
              style={{ background: t.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '0.65rem 2rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faChartLine} className="me-2" />Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: t.bodyBg, minHeight: '100vh', padding: '1.25rem' }}>

      {/* ─── Header Card ─── */}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden mb-4" style={{ border: 'none' }}>
        <div className="position-relative overflow-hidden" style={{
          background: isDark
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1a1a2e 100%)'
        }}>
          <div className="position-absolute top-0 end-0 p-5 opacity-5" style={{ transform: 'rotate(15deg) translate(20%, -30%)' }}>
            <FontAwesomeIcon icon={faFolderOpen} style={{ fontSize: '20rem' }} />
          </div>
          <div className="position-absolute top-50 start-25 opacity-[0.03]" style={{ width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, #6366f1, transparent)', transform: 'translate(-30%, -50%)', filter: 'blur(60px)' }} />
          <div className="position-absolute bottom-0 end-0 opacity-[0.04]" style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, #a855f7, transparent)', transform: 'translate(20%, 30%)', filter: 'blur(60px)' }} />

          <div className="p-4 p-xl-5 position-relative z-2">
            <div className="row g-4 align-items-center">
              <div className="col-xl-7">
                <div className="d-flex align-items-start gap-4">
                  <div className="d-none d-md-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '72px', height: '72px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <FontAwesomeIcon icon={faRocket} className="text-white" style={{ fontSize: '1.8rem' }} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge rounded-pill px-3 py-1.5 fw-semibold text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))', color: '#e0e7ff', border: '1px solid rgba(99,102,241,0.3)' }}>
                        <FontAwesomeIcon icon={faBolt} className="me-1" style={{ fontSize: '0.55rem' }} />Enterprise DMS v2
                      </span>
                      <span className="badge rounded-pill px-3 py-1.5 fw-semibold" style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.2)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <span className="pulse-dot-sm bg-success d-inline-block me-1" style={{ width: '6px', height: '6px', borderRadius: '50%', verticalAlign: 'middle' }} />
                        {stats?.activeDocuments || 0} Active
                      </span>
                    </div>
                    <h1 className="fw-bold mb-1 text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      Document Management System
                    </h1>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '580px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                      Manage, organize, secure, approve, collaborate, and analyze all company documents from one centralized workspace.
                    </p>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  {[
                    { label: 'Upload', icon: faUpload, grad: 'linear-gradient(135deg, #6366f1, #4f46e5)', hint: 'Upload a new document' },
                    { label: 'New Folder', icon: faFolderPlus, outline: true, hint: 'Create a new folder' },
                    { label: 'Search', icon: faSearch, outline: true, hint: 'Advanced search' },
                    { label: 'AI', icon: faRobot, grad: 'linear-gradient(135deg, #a855f7, #7c3aed)', hint: 'AI-powered assistant' },
                  ].map(btn => (
                    <button key={btn.label}
                      className="btn btn-sm rounded-pill px-3 py-2 fw-semibold border-0 d-flex align-items-center gap-2"
                      style={{
                        fontSize: '0.78rem',
                        background: btn.grad || 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        backdropFilter: btn.outline ? 'blur(4px)' : 'none',
                        border: btn.outline ? '1px solid rgba(255,255,255,0.12)' : 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = btn.outline ? 'rgba(255,255,255,0.15)' : btn.grad; }}
                      onMouseLeave={e => { e.currentTarget.style.background = btn.grad || 'rgba(255,255,255,0.08)'; }}
                      onClick={() => addNotification(btn.label, 'info')}
                      title={btn.hint}
                    >
                      <FontAwesomeIcon icon={btn.icon} style={{ fontSize: '0.7rem' }} />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-xl-5">
                <div className="row g-3">
                  {[
                    { icon: faHardDrive, label: 'Storage Used', value: stats?.storageUsed || '0 B', sub: 'of 5 TB', color: '#06b6d4', progress: stats?.storageBytes ? Math.min((stats.storageBytes / (5 * 1073741824)) * 100, 100) : 0 },
                    { icon: faFileAlt, label: 'Active Docs', value: formatNumber(stats?.activeDocuments || 0), sub: '+12% from last month', color: '#10b981' },
                    { icon: faClock, label: 'Pending Approval', value: formatNumber(stats?.pendingApprovals || 0), color: '#f59e0b' },
                    { icon: faFileSignature, label: 'Signed', value: formatNumber(stats?.signedDocuments || 0), color: '#a78bfa' },
                  ].map((item, idx) => (
                    <div key={item.label} className="col-6">
                      <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={item.icon} style={{ color: item.color, fontSize: '0.7rem' }} />
                          <span className="text-uppercase fw-semibold" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>{item.label}</span>
                        </div>
                        <div className="h3 fw-bold text-white mb-0" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>{item.value}</div>
                        {item.sub && (
                          <div className="d-flex align-items-center gap-1 mt-1">
                            <FontAwesomeIcon icon={faArrowUp} className="text-success" style={{ fontSize: '0.55rem' }} />
                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</span>
                          </div>
                        )}
                        {item.progress !== undefined && (
                          <div className="progress mt-2 rounded-pill" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                            <div className="progress-bar rounded-pill" style={{ width: `${item.progress}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPI Cards ─── */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="p-1 rounded-3" style={{ background: `linear-gradient(135deg, ${t.primary}22, ${t.purple}22)` }}>
              <FontAwesomeIcon icon={faChartSimple} className="p-2" style={{ color: t.primary, fontSize: '0.85rem' }} />
            </div>
            <h5 className="fw-bold mb-0" style={{ color: t.text, fontSize: '1rem' }}>Key Metrics</h5>
            <span className="small text-muted ms-1">Real-time overview of your document ecosystem</span>
          </div>
        </div>
        {[
          { key: 'totalDocuments', label: 'Total Documents', icon: faFile, color: t.primary, gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
          { key: 'activeDocuments', label: 'Active Documents', icon: faFileAlt, color: t.success, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
          { key: 'pendingApprovals', label: 'Pending Approvals', icon: faClock, color: t.warning, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
          { key: 'signedDocuments', label: 'Signed Documents', icon: faFileSignature, color: t.purple, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
          { key: 'storageUsed', label: 'Storage Used', icon: faHardDrive, color: t.info, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
          { key: 'sharedDocuments', label: 'Shared Documents', icon: faShareAlt, color: t.teal, gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)' },
          { key: 'expiredDocuments', label: 'Expired Documents', icon: faTriangleExclamation, color: t.danger, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
          { key: 'documentRequests', label: 'Document Requests', icon: faFileExport, color: t.pink, gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
        ].map(kpi => {
          const value = kpi.key === 'storageUsed' ? (stats?.storageUsed || '0 B') : formatNumber(stats?.[kpi.key]);
          return (
            <div key={kpi.key} className="col-xl-3 col-lg-4 col-md-6">
              <div className="kpi-card card border-0 rounded-4 h-100 position-relative overflow-hidden" style={{
                background: isDark ? t.cardBg : kpi.gradient,
                borderColor: isDark ? t.cardBorder : 'transparent',
                boxShadow: isDark ? t.shadow : '0 4px 15px rgba(0,0,0,0.1)',
              }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="kpi-icon-wrapper d-flex align-items-center justify-content-center rounded-3" style={{
                      width: '44px', height: '44px',
                      background: isDark ? `${kpi.color}20` : 'rgba(255,255,255,0.2)',
                      color: isDark ? kpi.color : '#fff',
                      fontSize: '1rem',
                    }}>
                      <FontAwesomeIcon icon={kpi.icon} />
                    </div>
                    <FontAwesomeIcon icon={kpi.icon} className="kpi-card-bg-icon" style={{ color: isDark ? `${kpi.color}10` : 'rgba(255,255,255,0.1)' }} />
                  </div>
                  <p className="mb-1 fw-semibold" style={{ color: isDark ? t.textSecondary : 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{kpi.label}</p>
                  <h4 className="fw-bold mb-0" style={{ color: isDark ? t.text : '#fff', fontSize: '1.6rem', letterSpacing: '-0.02em' }}>{value}</h4>
                  <div className="kpi-shine position-absolute top-0 start-0 w-100 h-100 pointer-events-none" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Row 1: Document Growth Trend + Storage by Type ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Document Growth Trend */}
        <div style={{ background: t.cardBg, borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faChartLine} style={{ color: t.primary, fontSize: '0.8rem' }} />
              </div>
              <div>
                <h5 style={{ color: t.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Document Growth Trend</h5>
                <span style={{ color: t.textSecondary, fontSize: '0.75rem' }}>Last {trendRange === '7d' ? '7 days' : '30 days'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', background: isDark ? '#1a2332' : '#f1f4f9', borderRadius: '8px', padding: '2px' }}>
                {['7d', '30d'].map(r => (
                  <button key={r} onClick={() => setTrendRange(r)}
                    style={{
                      background: trendRange === r ? t.primary : 'transparent', color: trendRange === r ? '#fff' : t.textSecondary,
                      border: 'none', borderRadius: '6px', padding: '0.3rem 0.7rem', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.75rem', borderRadius: '8px', background: growthRate >= 0 ? `${t.success}10` : `${t.danger}10` }}>
                <FontAwesomeIcon icon={growthRate >= 0 ? faArrowUp : faArrowDown} style={{ color: growthRate >= 0 ? t.success : t.danger, fontSize: '0.6rem' }} />
                <span style={{ color: growthRate >= 0 ? t.success : t.danger, fontSize: '0.78rem', fontWeight: 600 }}>{Math.abs(growthRate).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1.5rem 1.25rem' }}>
            <ChartWrapper height={220} loading={false}>
              <Line data={{
                labels: trendData.map(t => t.day),
                datasets: [{
                  label: 'Documents',
                  data: trendData.map(t => t.count),
                  borderColor: t.primary,
                  backgroundColor: (ctx) => {
                    if (!ctx.chart?.ctx) return `${t.primary}10`;
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
                    g.addColorStop(0, `${t.primary}35`);
                    g.addColorStop(0.5, `${t.primary}10`);
                    g.addColorStop(1, `${t.primary}02`);
                    return g;
                  },
                  fill: true, tension: 0.4, borderWidth: 2.5,
                  pointBackgroundColor: t.cardBg, pointBorderColor: t.primary,
                  pointBorderWidth: 2.5, pointRadius: 3, pointHoverRadius: 6,
                  pointHoverBackgroundColor: t.primary,
                }]
              }} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: t.muted, font: { size: 10 } } },
                  y: { grid: { color: t.chartGrid, drawBorder: false }, ticks: { color: t.muted, font: { size: 10 }, maxTicksLimit: 5 } }
                },
                interaction: { intersect: false, mode: 'index' },
              }} />
            </ChartWrapper>
          </div>
        </div>

        {/* Storage by Type */}
        <div style={{ background: t.cardBg, borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.purple}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faChartPie} style={{ color: t.purple, fontSize: '0.8rem' }} />
              </div>
              <div>
                <h5 style={{ color: t.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Storage by Type</h5>
                <span style={{ color: t.textSecondary, fontSize: '0.75rem' }}>{formatNumber(totalStorage)} total files</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                  <ChartWrapper height={160} loading={false}>
                    <Doughnut data={{
                      labels: Object.keys(storageByType),
                      datasets: [{
                        data: Object.values(storageByType),
                        backgroundColor: [t.primary, t.success, t.warning, t.pink, t.purple],
                        borderWidth: 0, hoverOffset: 12,
                      }]
                    }} options={{
                      responsive: true, maintainAspectRatio: false, cutout: '75%',
                      plugins: { legend: { display: false } },
                    }} />
                  </ChartWrapper>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
                {Object.entries(storageByType).slice(0, 5).map(([key, value], i) => {
                  const pct = totalStorage > 0 ? ((value / totalStorage) * 100).toFixed(1) : 0;
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: [t.primary, t.success, t.warning, t.pink, t.purple][i % 5], flexShrink: 0 }} />
                      <span style={{ color: t.textSecondary, fontSize: '0.72rem', fontWeight: 500, textTransform: 'capitalize', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{key}</span>
                      <span style={{ color: t.text, fontSize: '0.75rem', fontWeight: 600 }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Row 2: Status Distribution + Department Storage ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Status Distribution */}
        <div style={{ background: t.cardBg, borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.success}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faLayerGroup} style={{ color: t.success, fontSize: '0.8rem' }} />
              </div>
              <div>
                <h5 style={{ color: t.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Status Distribution</h5>
                <span style={{ color: t.textSecondary, fontSize: '0.75rem' }}>{totalDocs} total documents</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {statusKeys.map((key, i) => {
                const val = statusValues[i] || 0;
                const pct = totalDocs > 0 ? (val / totalDocs) * 100 : 0;
                return (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: palette[i] }} />
                        <span style={{ color: t.text, fontSize: '0.8rem', fontWeight: 500 }}>{key}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: t.text, fontSize: '0.8rem', fontWeight: 600 }}>{formatNumber(val)}</span>
                        <span style={{ color: t.muted, fontSize: '0.7rem' }}>({pct.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div style={{ background: isDark ? '#1a2332' : '#f1f4f9', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '6px', background: `linear-gradient(90deg, ${palette[i]}, ${palette[i]}cc)`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Department Storage */}
        <div style={{ background: t.cardBg, borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.info}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faUsers} style={{ color: t.info, fontSize: '0.8rem' }} />
              </div>
              <div>
                <h5 style={{ color: t.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Department Storage</h5>
                <span style={{ color: t.textSecondary, fontSize: '0.75rem' }}>{departmentStorage.length} departments</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            {departmentStorage.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {departmentStorage.map((d, i) => {
                  const maxVal = Math.max(...departmentStorage.map(x => x.usage), 1);
                  const pct = (d.usage / maxVal) * 100;
                  const color = CHART_COLORS[i % CHART_COLORS.length];
                  return (
                    <div key={d.department || i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '100px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: t.text, fontSize: '0.78rem', fontWeight: 500 }}>{d.department || 'Unknown'}</span>
                      </div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={{ background: isDark ? '#1a2332' : '#f1f4f9', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', borderRadius: '8px', background: `linear-gradient(90deg, ${color}, ${color}bb)`, transition: 'width 0.5s ease' }} />
                        </div>
                        {pct > 60 && (
                          <div style={{ position: 'absolute', right: '0', top: '-1px', fontSize: '0.55rem', color: t.warning }}><FontAwesomeIcon icon={faExclamationTriangle} /></div>
                        )}
                      </div>
                      <div style={{ width: '70px', textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ color: t.text, fontSize: '0.78rem', fontWeight: 600 }}>{(d.usage).toFixed(1)} GB</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <FontAwesomeIcon icon={faDatabase} style={{ color: t.muted, fontSize: '1.1rem' }} />
                </div>
                <p style={{ color: t.textSecondary, fontSize: '0.85rem', margin: 0 }}>No department data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Row 3: Most Accessed + Recent Activity ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Most Accessed */}
        <div style={{ background: t.cardBg, borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.warning}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faStar} style={{ color: t.warning, fontSize: '0.8rem' }} />
              </div>
              <div>
                <h5 style={{ color: t.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Most Accessed</h5>
                <span style={{ color: t.textSecondary, fontSize: '0.75rem' }}>Top documents by views</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem' }}>
            {mostAccessed.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {mostAccessed.slice(0, 6).map((doc, idx) => {
                  const fc = getFileConfig(doc.name);
                  return (
                    <div key={doc.id || idx} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.5rem',
                      borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = t.hover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '24px', textAlign: 'center', flexShrink: 0 }}>
                        {idx < 3 ? (
                          <div style={{
                            width: '22px', height: '22px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#b45309', color: '#fff', fontSize: '0.6rem', fontWeight: 700, margin: '0 auto',
                          }}>{idx + 1}</div>
                        ) : (
                          <span style={{ color: t.muted, fontSize: '0.7rem', fontWeight: 600 }}>{idx + 1}</span>
                        )}
                      </div>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: fc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FontAwesomeIcon icon={fc.icon} style={{ color: fc.color, fontSize: '0.8rem' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: t.text, fontSize: '0.82rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.1rem' }}>
                          <FontAwesomeIcon icon={faEye} style={{ color: t.muted, fontSize: '0.55rem' }} />
                          <span style={{ color: t.muted, fontSize: '0.68rem' }}>{doc.view_count} views</span>
                          {doc.last_accessed && (
                            <>
                              <span style={{ color: t.divider, fontSize: '0.3rem' }}>●</span>
                              <FontAwesomeIcon icon={faClock} style={{ color: t.muted, fontSize: '0.55rem' }} />
                              <span style={{ color: t.muted, fontSize: '0.68rem' }}>{formatDate(doc.last_accessed)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faChevronRight} style={{ color: t.muted, fontSize: '0.6rem', opacity: 0.3, flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <FontAwesomeIcon icon={faEye} style={{ color: t.muted, fontSize: '1.2rem' }} />
                </div>
                <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>No access data yet</p>
                <p style={{ color: t.muted, fontSize: '0.75rem', margin: 0 }}>Document views will appear as users interact with documents</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: t.cardBg, borderRadius: '20px', border: `1px solid ${t.cardBorder}`, boxShadow: t.shadow, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: `1px solid ${t.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${t.teal}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faHistory} style={{ color: t.teal, fontSize: '0.8rem' }} />
              </div>
              <div>
                <h5 style={{ color: t.text, fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Recent Activity</h5>
                <span style={{ color: t.textSecondary, fontSize: '0.75rem' }}>Latest document actions</span>
              </div>
            </div>
          </div>
          <div style={{ padding: '0.75rem 1rem' }}>
            {recentActivity.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recentActivity.slice(0, 7).map((activity, idx) => {
                  const action = activity.action?.toLowerCase() || '';
                  const colorMap = {
                    upload: t.primary, download: t.success, view: t.info, viewed: t.info,
                    edit: t.warning, updated: t.warning, delete: t.danger, share: t.teal,
                    archive: t.purple, sign: t.purple, signed: t.purple,
                    approve: t.success, approved: t.success,
                  };
                  const actionColor = colorMap[action] || t.muted;
                  return (
                    <div key={activity.id || idx} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.65rem 0.5rem',
                      borderRadius: '10px', transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = t.hover}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${actionColor}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FontAwesomeIcon icon={getActivityIcon(activity.action)} style={{ color: actionColor, fontSize: '0.75rem' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
                          <p style={{ color: t.text, fontSize: '0.82rem', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {activity.document_name || 'Document'}
                          </p>
                          <span style={{ background: `${actionColor}12`, color: actionColor, borderRadius: '6px', padding: '0.1rem 0.5rem', fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                            {activity.action}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FontAwesomeIcon icon={faUser} style={{ color: t.muted, fontSize: '0.5rem' }} />
                          <span style={{ color: t.textSecondary, fontSize: '0.7rem' }}>{activity.user_name || 'System'}</span>
                          <span style={{ color: t.divider, fontSize: '0.3rem' }}>●</span>
                          <FontAwesomeIcon icon={faClock} style={{ color: t.muted, fontSize: '0.5rem' }} />
                          <span style={{ color: t.muted, fontSize: '0.7rem' }}>{formatDate(activity.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: t.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <FontAwesomeIcon icon={faHistory} style={{ color: t.muted, fontSize: '1.2rem' }} />
                </div>
                <p style={{ color: t.textSecondary, fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.25rem' }}>No recent activity</p>
                <p style={{ color: t.muted, fontSize: '0.75rem', margin: 0 }}>Document actions will be logged here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .kpi-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
      `}</style>
    </div>
  );
};

export default DmsDashboard;
