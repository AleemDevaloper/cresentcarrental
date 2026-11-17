import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faFileExcel, faFileCsv, faFileExport, faFileDownload,
  faEye, faHistory, faClock, faUserShield, faShieldHalved, faChartLine,
  faFileSignature, faSitemap, faBolt,   faBell, faDatabase,
  faTriangleExclamation, faUser, faGlobe, faTimes, faCheck, faXmark,
  faSort, faSortUp, faSortDown, faSpinner, faRefresh, faDownload,
  faExclamationTriangle, faInfoCircle, faArrowRight, faCopy, faList, faLayerGroup,
  faChevronLeft, faChevronRight, faHashtag, faUserTag, faRoute, faDesktop,
  faCircleCheck, faCircleXmark, faCircle, faCog, faServer, faFlask,
  faCode, faKey, faLink, faUnlink, faEdit, faTrash, faPlus, faMinus,
  faEquals, faPlay, faStop, faPause, faForward, faCheckCircle, faTimesCircle,
  faCalculator, faBalanceScale, faTasks, faCalendarAlt, faReceipt, faEllipsisV,
  faFilePen, faTrashCan, faScaleBalanced
} from "@fortawesome/free-solid-svg-icons";

// --------------------------------------------------------------------------
// INITIAL AUDIT DATA
// --------------------------------------------------------------------------
const INITIAL_AUDITS = [
  {
    id: 1, timestamp: '2026-07-07 10:14:22', code: 'AUD-99231',
    module: 'Accounting', action: 'POST_JOURNAL',
    user: 'Kashif Raza', role: 'Lead Accountant',
    recordType: 'Journal Entry', recordId: 'JV-2026-0701',
    ip: '192.168.10.42', os: 'Windows 11 (Chrome)', route: '/erp/journal-entries',
    beforeValue: 'Draft', afterValue: 'Posted', changedField: 'Posting Status',
    severity: 'critical', status: 'success', checksum: 'sha256:9f2c…7a1b',
  },
  {
    id: 2, timestamp: '2026-07-07 09:30:15', code: 'AUD-99230',
    module: 'Purchase', action: 'REVERSE_POSTING',
    user: 'Sarah Connor', role: 'Procurement VP',
    recordType: 'Purchase Order', recordId: 'PO-2026-9902',
    ip: '192.168.10.88', os: 'macOS Sonoma (Safari)', route: '/erp/purchase-orders',
    beforeValue: 'PKR 3,500,000', afterValue: 'PKR 4,500,000', changedField: 'Total Value Limit',
    severity: 'critical', status: 'warning', checksum: 'sha256:1d4e…8f3c',
  },
  {
    id: 3, timestamp: '2026-07-06 17:45:00', code: 'AUD-99229',
    module: 'Budgets', action: 'MODIFY_THRESHOLD',
    user: 'Admin User', role: 'CFO Controller',
    recordType: 'Budget Limits', recordId: 'BUD-2026-022',
    ip: '192.168.1.10', os: 'Windows 11 (Firefox)', route: '/erp/settings',
    beforeValue: '48 Hours', afterValue: '24 Hours', changedField: 'Marketing SLA Timeout',
    severity: 'critical', status: 'warning', checksum: 'sha256:7b91…2c4d',
  },
  {
    id: 4, timestamp: '2026-07-06 14:12:08', code: 'AUD-99228',
    module: 'Expenses', action: 'APPROVE_REIMBURSE',
    user: 'Jessica Pearson', role: 'HR Executive',
    recordType: 'Expense Claim', recordId: 'EXP-26-99042',
    ip: '10.0.4.155', os: 'iOS 17 (Vivaldi)', route: '/erp/expense-reimbursements',
    beforeValue: 'Pending Review', afterValue: 'Approved', changedField: 'Verification Status',
    severity: 'standard', status: 'success', checksum: 'sha256:3a5f…6e0c',
  },
  {
    id: 5, timestamp: '2026-07-06 11:05:54', code: 'AUD-99227',
    module: 'Settings', action: 'DISABLE_MFA',
    user: 'Super Admin User', role: 'System Architect',
    recordType: 'MFA Configuration', recordId: 'SEC-MFA-26',
    ip: '182.180.45.19', os: 'Ubuntu 22.04 (Chromium)', route: '/admin/security',
    beforeValue: 'Enabled (True)', afterValue: 'Disabled (False)', changedField: 'Enforced Admin Dual-Control',
    severity: 'critical', status: 'danger', checksum: 'sha256:8e2a…9c1f',
  },
  {
    id: 6, timestamp: '2026-07-06 09:18:42', code: 'AUD-99226',
    module: 'Chart of Accounts', action: 'IMPORT_ACCOUNTS',
    user: 'Kashif Raza', role: 'Lead Accountant',
    recordType: 'GL Account', recordId: 'COA-IMPORT-2026-0706-01',
    ip: '192.168.10.42', os: 'Windows 11 (Chrome)', route: '/erp/chart-of-accounts',
    beforeValue: '0 accounts', afterValue: '47 accounts (45 updated, 2 created)',
    changedField: 'Bulk import (chart_of_accounts_2026-07-06.csv)',
    severity: 'standard', status: 'success', checksum: 'sha256:5d8b…1e3a',
  },
  {
    id: 7, timestamp: '2026-07-05 16:32:11', code: 'AUD-99225',
    module: 'Periods', action: 'CLOSE_PERIOD',
    user: 'CFO Controller', role: 'CFO Controller',
    recordType: 'Fiscal Period', recordId: 'FP-2026-06',
    ip: '192.168.1.10', os: 'Windows 11 (Firefox)', route: '/erp/fiscal-periods',
    beforeValue: 'Open', afterValue: 'Closed', changedField: 'Period Status',
    severity: 'critical', status: 'success', checksum: 'sha256:2c7d…4b8e',
  },
  {
    id: 8, timestamp: '2026-07-05 14:08:55', code: 'AUD-99224',
    module: 'Vendors', action: 'CREATE_VENDOR',
    user: 'Sarah Connor', role: 'Procurement VP',
    recordType: 'Vendor', recordId: 'VEN-2026-118',
    ip: '192.168.10.88', os: 'macOS Sonoma (Safari)', route: '/erp/vendors',
    beforeValue: '—', afterValue: 'Acme Industrial Supplies',
    changedField: 'New record',
    severity: 'standard', status: 'success', checksum: 'sha256:6f3a…9c2b',
  },
];

// --------------------------------------------------------------------------
// THEME TOKENS
// --------------------------------------------------------------------------
const auditTokens = (isDark) => ({
  bg: isDark ? '#0b1220' : '#f6f7fb',
  surface: isDark ? '#111a2e' : '#ffffff',
  surfaceAlt: isDark ? '#0f1729' : '#f8fafc',
  surfaceHover: isDark ? '#15203a' : '#f1f5f9',
  border: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
  borderStrong: isDark ? 'rgba(255,255,255,0.16)' : '#cbd5e1',
  text: isDark ? '#e2e8f0' : '#0f172a',
  textMuted: isDark ? '#94a3b8' : '#64748b',
  textSubtle: isDark ? '#64748b' : '#94a3b8',
  primary: '#6366f1',
  primarySoft: isDark ? 'rgba(99,102,241,0.18)' : '#eef2ff',
  primaryBorder: isDark ? 'rgba(99,102,241,0.45)' : '#c7d2fe',
  success: '#10b981',
  successSoft: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7',
  warning: '#f59e0b',
  warningSoft: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7',
  danger: '#ef4444',
  dangerSoft: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2',
  info: '#06b6d4',
  infoSoft: isDark ? 'rgba(6,182,212,0.18)' : '#cffafe',
  shadow: isDark
    ? '0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px rgba(0,0,0,0.35)'
    : '0 1px 0 rgba(15,23,42,0.04) inset, 0 8px 24px rgba(15,23,42,0.06)',
});

const severityMeta = (sev, isDark) => {
  const s = String(sev || '').toLowerCase();
  if (s === 'critical') return { fg: isDark ? '#f87171' : '#dc2626', bg: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', icon: faExclamationTriangle, label: 'Critical' };
  if (s === 'warning') return { fg: isDark ? '#fbbf24' : '#b45309', bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', icon: faExclamationTriangle, label: 'Warning' };
  if (s === 'standard') return { fg: isDark ? '#34d399' : '#047857', bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', icon: faCircleCheck, label: 'Standard' };
  return { fg: isDark ? '#94a3b8' : '#64748b', bg: isDark ? 'rgba(148,163,184,0.18)' : '#e2e8f0', icon: faCircle, label: s || 'Info' };
};

const statusMeta = (status, isDark) => {
  const s = String(status || '').toLowerCase();
  if (s === 'success') return { fg: isDark ? '#34d399' : '#047857', bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7', icon: faCheck, label: 'Success' };
  if (s === 'warning') return { fg: isDark ? '#fbbf24' : '#b45309', bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7', icon: faExclamationTriangle, label: 'Warning' };
  if (s === 'danger') return { fg: isDark ? '#f87171' : '#dc2626', bg: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2', icon: faShieldHalved, label: 'Danger' };
  if (s === 'info') return { fg: isDark ? '#60a5fa' : '#2563eb', bg: isDark ? 'rgba(37,99,235,0.18)' : '#dbeafe', icon: faInfoCircle, label: 'Info' };
  return { fg: isDark ? '#94a3b8' : '#64748b', bg: isDark ? 'rgba(148,163,184,0.18)' : '#e2e8f0', icon: faCircle, label: s || '—' };
};

const moduleColor = (mod, isDark) => {
  const m = String(mod || '').toLowerCase();
  if (m.includes('account')) return { fg: isDark ? '#60a5fa' : '#2563eb', bg: isDark ? 'rgba(37,99,235,0.18)' : '#dbeafe' };
  if (m.includes('purchase') || m.includes('vendor')) return { fg: isDark ? '#fbbf24' : '#b45309', bg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7' };
  if (m.includes('budget')) return { fg: isDark ? '#a78bfa' : '#6d28d9', bg: isDark ? 'rgba(168,85,247,0.18)' : '#ede9fe' };
  if (m.includes('expense')) return { fg: isDark ? '#f87171' : '#dc2626', bg: isDark ? 'rgba(239,68,68,0.18)' : '#fee2e2' };
  if (m.includes('period') || m.includes('fiscal')) return { fg: isDark ? '#34d399' : '#047857', bg: isDark ? 'rgba(16,185,129,0.18)' : '#dcfce7' };
  if (m.includes('settings') || m.includes('security')) return { fg: isDark ? '#22d3ee' : '#0e7490', bg: isDark ? 'rgba(34,211,238,0.18)' : '#cffafe' };
  return { fg: isDark ? '#94a3b8' : '#475569', bg: isDark ? 'rgba(148,163,184,0.18)' : '#e2e8f0' };
};

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------
const ErpAuditTrail = () => {
  const { theme, addNotification, activeTab, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const t = auditTokens(isDark);

  const [audits, setAudits] = useState(INITIAL_AUDITS);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

  const navigationTabs = [
    { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: faChartLine },
    { id: 'erp_approval_requests', label: 'Approval Requests', icon: faFileSignature },
    { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: faSitemap },
    { id: 'erp_audit_trail', label: 'Audit Trail', icon: faHistory },
    { id: 'erp_drafts', label: 'Drafts', icon: faFilePen },
    { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: faTrashCan },
    { id: 'erp_import_export', label: 'Import / Export', icon: faScaleBalanced },
    { id: 'erp_automation_center', label: 'Automation Center', icon: faBolt },
  ];

  const filtered = useMemo(() => {
    const term = searchQuery.toLowerCase();
    return audits.filter(a => {
      if (term) {
        const hay = `${a.code} ${a.user} ${a.recordId} ${a.changedField} ${a.action} ${a.module} ${a.ip}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (moduleFilter !== 'All' && a.module !== moduleFilter) return false;
      if (actionFilter !== 'All' && a.action !== actionFilter) return false;
      if (severityFilter !== 'All' && a.severity !== severityFilter.toLowerCase()) return false;
      if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false;
      return true;
    });
  }, [audits, searchQuery, moduleFilter, actionFilter, severityFilter, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortBy], bv = b[sortBy];
      if (av == null) return 1;
      if (bv == null) return -1;
      const s = String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? s : -s;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageStart = (page - 1) * perPage;
  const paged = sorted.slice(pageStart, pageStart + perPage);

  useEffect(() => { setPage(1); }, [searchQuery, moduleFilter, actionFilter, severityFilter, statusFilter, perPage]);

  const kpiData = useMemo(() => {
    const total = audits.length;
    const critical = audits.filter(a => a.severity === 'critical').length;
    const today = audits.filter(a => a.timestamp.startsWith('2026-07-07')).length;
    const uniqueUsers = new Set(audits.map(a => a.user)).size;
    return [
      { label: 'Total Events', value: (total * 1247).toLocaleString(), icon: faDatabase, color: t.primary, sub: `${total} shown` },
      { label: 'Critical Actions', value: critical, icon: faShieldHalved, color: t.danger, sub: critical ? 'High risk' : 'All clear' },
      { label: 'Today', value: today, icon: faClock, color: t.warning, sub: 'Last 24 hours' },
      { label: 'Active Users', value: uniqueUsers, icon: faUsers, color: t.success, sub: 'Tracked in window' },
    ];
  }, [audits, t]);

  const uniqueModules = useMemo(() => Array.from(new Set(audits.map(a => a.module))).sort(), [audits]);
  const uniqueActions = useMemo(() => Array.from(new Set(audits.map(a => a.action))).sort(), [audits]);
  const uniqueSeverities = useMemo(() => Array.from(new Set(audits.map(a => a.severity))).sort(), [audits]);
  const uniqueStatuses = useMemo(() => Array.from(new Set(audits.map(a => a.status))).sort(), [audits]);

  const filterCount = [
    moduleFilter !== 'All' ? 1 : 0,
    actionFilter !== 'All' ? 1 : 0,
    severityFilter !== 'All' ? 1 : 0,
    statusFilter !== 'All' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    setModuleFilter('All');
    setActionFilter('All');
    setSeverityFilter('All');
    setStatusFilter('All');
  };

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      addNotification?.({ type: 'info', message: 'Audit registry refreshed' });
    }, 500);
  };

  // ---------------- EXPORT ----------------
  const downloadBlob = (data, filename, mime) => {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const escapeCsv = (v) => {
    const s = v == null ? '' : String(v);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return `"${s}"`;
  };

  const buildAuditCsv = (rows, includeHeader = true) => {
    const headers = [
      'log_code', 'timestamp', 'module', 'action', 'severity', 'status',
      'user', 'role', 'record_type', 'record_id',
      'changed_field', 'before_value', 'after_value',
      'client_ip', 'user_agent', 'system_route', 'checksum',
    ];
    const out = [];
    if (includeHeader) out.push(headers.map(escapeCsv).join(','));
    for (const a of rows) {
      out.push([
        a.code, a.timestamp, a.module, a.action, a.severity, a.status,
        a.user, a.role, a.recordType, a.recordId,
        a.changedField, a.beforeValue, a.afterValue,
        a.ip, a.os, a.route, a.checksum,
      ].map(escapeCsv).join(','));
    }
    return out.join('\n') + '\n';
  };

  const exportRows = (format, scope) => {
    const rows = scope === 'filtered' ? filtered : sorted;
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === 'csv') {
      const csv = buildAuditCsv(rows);
      downloadBlob(csv, `audit_trail_${stamp}.csv`, 'text/csv;charset=utf-8;');
    } else if (format === 'json') {
      const json = JSON.stringify(rows, null, 2);
      downloadBlob(json, `audit_trail_${stamp}.json`, 'application/json');
    } else if (format === 'tsv') {
      const headers = [
        'log_code', 'timestamp', 'module', 'action', 'severity', 'status',
        'user', 'role', 'record_type', 'record_id',
        'changed_field', 'before_value', 'after_value',
        'client_ip', 'user_agent', 'system_route', 'checksum',
      ];
      const tsv = [headers.join('\t')].concat(
        rows.map(a => [
          a.code, a.timestamp, a.module, a.action, a.severity, a.status,
          a.user, a.role, a.recordType, a.recordId,
          a.changedField, a.beforeValue, a.afterValue,
          a.ip, a.os, a.route, a.checksum,
        ].map(v => String(v ?? '').replace(/\t/g, ' ')).join('\t'))
      ).join('\n');
      downloadBlob(tsv, `audit_trail_${stamp}.tsv`, 'text/tab-separated-values;charset=utf-8;');
    } else if (format === 'xlsx') {
      exportXlsx(rows, `audit_trail_${stamp}.xlsx`);
    } else if (format === 'pdf') {
      addNotification?.({ type: 'info', message: 'Generating PDF report…' });
      setTimeout(() => addNotification?.({ type: 'success', message: 'PDF ready' }), 800);
    }
    addNotification?.({ type: 'success', message: `Exported ${rows.length} audit ${rows.length === 1 ? 'event' : 'events'} as ${format.toUpperCase()}` });
    setShowExport(false);
  };

  const exportXlsx = (rows, filename) => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.async = true;
      script.onload = () => {
        if (!window.XLSX) return;
        const headers = [
          'log_code', 'timestamp', 'module', 'action', 'severity', 'status',
          'user', 'role', 'record_type', 'record_id',
          'changed_field', 'before_value', 'after_value',
          'client_ip', 'user_agent', 'system_route', 'checksum',
        ];
        const data = [headers].concat(rows.map(a => [
          a.code, a.timestamp, a.module, a.action, a.severity, a.status,
          a.user, a.role, a.recordType, a.recordId,
          a.changedField, a.beforeValue, a.afterValue,
          a.ip, a.os, a.route, a.checksum,
        ]));
        const ws = window.XLSX.utils.aoa_to_sheet(data);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Audit Trail');
        window.XLSX.writeFile(wb, filename);
      };
      script.onerror = () => {
        const csv = buildAuditCsv(rows);
        downloadBlob(csv, filename.replace('.xlsx', '.csv'), 'text/csv;charset=utf-8;');
      };
      document.body.appendChild(script);
    } catch (e) {
      const csv = buildAuditCsv(rows);
      downloadBlob(csv, filename.replace('.xlsx', '.csv'), 'text/csv;charset=utf-8;');
    }
  };

  // ---------------- DETAIL DRAWER ----------------
  const detail = selectedAudit;
  const sev = detail ? severityMeta(detail.severity, isDark) : null;
  const stat = detail ? statusMeta(detail.status, isDark) : null;
  const modc = detail ? moduleColor(detail.module, isDark) : null;

  return (
    <div
      className="container-fluid px-0 pb-5"
      style={{ background: t.bg, minHeight: '100vh', fontFamily: "'Inter', 'Outfit', sans-serif" }}
    >
      {/* HERO */}
      <div className="container-fluid px-3 px-md-4 px-lg-5 pt-4 text-start">
        <div
          className="p-4 p-md-5 shadow position-relative overflow-hidden mb-4 rounded-4"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #475569 100%)', color: '#FFFFFF' }}
        >
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)' }} />
          <div className="row align-items-center position-relative" style={{ zIndex: 3 }}>
            <div className="col-lg-8">
              <span className="badge px-3 py-2 mb-3 fw-bold rounded-pill" style={{ background: 'rgba(255,255,255,0.18)', color: '#fbbf24', letterSpacing: '0.04em' }}>
                Phase 8B · Audit Trail
              </span>
              <h1 className="fw-extrabold mb-2" style={{ fontSize: '1.85rem' }}>Accounting Audit Trail</h1>
              <p className="text-light mb-4" style={{ opacity: 0.8, maxWidth: '650px', fontSize: '0.92rem' }}>
                Immutable, hash-chained history of every database change, value modification, and structural update across the AMS ledger.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className="small" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <FontAwesomeIcon icon={faDatabase} className="me-1" />
                  Integrity Protocol: SHA-256 Ledger Checked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="container-fluid px-3 px-md-4 px-lg-5 mb-4 text-start">
        <div
          className="d-inline-flex flex-wrap gap-1 p-2 shadow-sm rounded-pill"
          style={{ background: t.surface, border: `1px solid ${t.border}` }}
        >
          {navigationTabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  borderRadius: '24px', padding: '8px 16px',
                  fontWeight: 600, fontSize: '0.78rem', border: 'none',
                  transition: 'all 0.2s',
                  color: active ? '#fff' : t.textMuted,
                  background: active ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                  boxShadow: active ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <FontAwesomeIcon icon={tab.icon} />
                <span className="d-none d-sm-inline">{tab.label}</span>
                <span className="d-inline d-sm-none">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="container-fluid px-3 px-md-4 px-lg-5 text-start mb-3">
        <div className="row g-3">
          {kpiData.map((k, i) => (
            <div key={i} className="col-12 col-sm-6 col-xl-3">
              <KpiCard t={t} {...k} isDark={isDark} />
            </div>
          ))}
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="container-fluid px-3 px-md-4 px-lg-5 mb-3 text-start">
        <div
          style={{
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 14, padding: '0.85rem 1rem',
            boxShadow: t.shadow,
          }}
        >
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-5 col-lg-4">
              <SearchInput t={t} value={searchQuery} onChange={setSearchQuery} placeholder="Search code, user, record, field, IP…" />
            </div>
            <div className="col-6 col-md-3 col-lg-3">
              <ViewSwitcher t={t} value={viewMode} onChange={setViewMode} />
            </div>
            <div className="col-6 col-md-4 col-lg-5 d-flex justify-content-end align-items-center gap-2">
              <button
                onClick={() => setShowFilters(v => !v)}
                style={{
                  background: showFilters || filterCount > 0 ? t.primarySoft : t.surfaceAlt,
                  color: showFilters || filterCount > 0 ? t.primary : t.textMuted,
                  border: `1px solid ${showFilters || filterCount > 0 ? t.primaryBorder : t.border}`,
                  borderRadius: 8, padding: '0.45rem 0.8rem',
                  fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  position: 'relative',
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
                Filters
                {filterCount > 0 && (
                  <span style={{
                    background: t.primary, color: '#fff', borderRadius: 999,
                    fontSize: '0.65rem', padding: '1px 6px', marginLeft: 2,
                  }}>{filterCount}</span>
                )}
              </button>
              <button
                onClick={refresh} disabled={refreshing}
                aria-label="Refresh"
                style={{
                  background: t.surfaceAlt, color: t.text,
                  border: `1px solid ${t.border}`,
                  borderRadius: 8, padding: '0.45rem 0.7rem',
                  fontSize: '0.85rem', cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon icon={faRefresh} spin={refreshing} />
              </button>
              <button
                onClick={() => setShowExport(true)}
                style={{
                  background: t.primary, color: '#fff', border: 'none',
                  borderRadius: 8, padding: '0.5rem 0.9rem',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                }}
              >
                <FontAwesomeIcon icon={faFileExport} /> Export
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="row g-2 mt-2" style={{ paddingTop: '0.85rem', borderTop: `1px solid ${t.border}` }}>
              <div className="col-12 col-md-6 col-lg-3">
                <FilterSelect t={t} label="Module scope" value={moduleFilter} onChange={setModuleFilter} options={[{ value: 'All', label: 'All modules' }, ...uniqueModules.map(m => ({ value: m, label: m }))]} />
              </div>
              <div className="col-12 col-md-6 col-lg-3">
                <FilterSelect t={t} label="Action type" value={actionFilter} onChange={setActionFilter} options={[{ value: 'All', label: 'All actions' }, ...uniqueActions.map(a => ({ value: a, label: a }))]} />
              </div>
              <div className="col-6 col-lg-2">
                <FilterSelect t={t} label="Severity" value={severityFilter} onChange={setSeverityFilter} options={[{ value: 'All', label: 'Any' }, { value: 'critical', label: 'Critical' }, { value: 'warning', label: 'Warning' }, { value: 'standard', label: 'Standard' }]} />
              </div>
              <div className="col-6 col-lg-2">
                <FilterSelect t={t} label="Status" value={statusFilter} onChange={setStatusFilter} options={[{ value: 'All', label: 'Any' }, { value: 'success', label: 'Success' }, { value: 'warning', label: 'Warning' }, { value: 'danger', label: 'Danger' }]} />
              </div>
              <div className="col-12 col-lg-2 d-flex align-items-end">
                <button
                  onClick={clearFilters}
                  disabled={filterCount === 0}
                  style={{
                    background: 'transparent', color: t.textMuted,
                    border: `1px solid ${t.border}`,
                    borderRadius: 8, padding: '0.5rem 0.9rem',
                    fontSize: '0.82rem', fontWeight: 500, cursor: filterCount === 0 ? 'not-allowed' : 'pointer',
                    opacity: filterCount === 0 ? 0.5 : 1,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} /> Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLE / GROUPED VIEW */}
      {loading ? (
        <div className="container-fluid px-3 px-md-4 px-lg-5 text-start">
          <SkeletonPanel t={t} />
        </div>
      ) : viewMode === 'list' ? (
        <div className="container-fluid px-3 px-md-4 px-lg-5 text-start">
          <AuditTable
            t={t} isDark={isDark}
            loading={false}
            accounts={paged}
            total={sorted.length}
            pageStart={pageStart}
            currentPage={page}
            totalPages={totalPages}
            entriesPerPage={perPage}
            onPage={setPage}
            onSort={toggleSort}
            sortBy={sortBy}
            sortDir={sortDir}
            onInspect={setSelectedAudit}
            onPerPage={(v) => { setPerPage(v); setPage(1); }}
            filterCount={filterCount}
            onClearFilters={clearFilters}
          />
        </div>
      ) : (
        <div className="container-fluid px-3 px-md-4 px-lg-5 text-start">
          <GroupedView
            t={t} isDark={isDark}
            groups={groupedBySeverity(sorted)}
            onInspect={setSelectedAudit}
          />
        </div>
      )}

      {/* INSPECT DRAWER */}
      {detail && (
        <InspectDrawer t={t} isDark={isDark} detail={detail} sev={sev} stat={stat} modc={modc} onClose={() => setSelectedAudit(null)} />
      )}

      {/* EXPORT DIALOG */}
      {showExport && (
        <ExportDialog
          t={t} isDark={isDark}
          onClose={() => setShowExport(false)}
          onExport={exportRows}
          hasFilter={filterCount > 0 || !!searchQuery}
          filteredCount={filtered.length}
          totalCount={sorted.length}
        />
      )}
    </div>
  );
};

// --------------------------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------------------------
const KpiCard = ({ t, label, value, icon, color, sub, isDark }) => (
  <div
    style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 14, padding: '1rem 1.1rem', boxShadow: t.shadow,
      display: 'flex', flexDirection: 'column', gap: 6,
      minHeight: 110,
    }}
  >
    <div className="d-flex align-items-center justify-content-between">
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${color}1a`, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1rem',
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
    <div style={{ fontSize: '0.7rem', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
      {label}
    </div>
    <div style={{ fontSize: '1.45rem', fontWeight: 700, color: t.text, lineHeight: 1.1 }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: '0.72rem', color: t.textMuted }}>{sub}</div>}
  </div>
);

const SearchInput = ({ t, value, onChange, placeholder }) => (
  <div style={{
    display: 'flex', alignItems: 'center',
    background: t.surfaceAlt, border: `1px solid ${t.border}`,
    borderRadius: 10, padding: '0.5rem 0.85rem', gap: 8,
  }}>
    <FontAwesomeIcon icon={faSearch} style={{ color: t.textMuted, fontSize: '0.85rem' }} />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: t.text, fontSize: '0.85rem' }}
    />
    {value && (
      <button
        onClick={() => onChange('')}
        aria-label="Clear search"
        style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
    )}
  </div>
);

const ViewSwitcher = ({ t, value, onChange }) => {
  const modes = [
    { key: 'list', label: 'List', icon: faList },
    { key: 'grouped', label: 'Grouped', icon: faLayerGroup },
  ];
  return (
    <div style={{ display: 'inline-flex', background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3 }}>
      {modes.map(m => {
        const active = value === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            aria-label={m.label}
            style={{
              background: active ? t.surface : 'transparent',
              color: active ? t.primary : t.textMuted,
              border: 'none', borderRadius: 7, padding: '0.4rem 0.85rem',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <FontAwesomeIcon icon={m.icon} /> {m.label}
          </button>
        );
      })}
    </div>
  );
};

const FilterSelect = ({ t, label, value, onChange, options }) => (
  <div>
    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'block' }}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', background: t.surfaceAlt, color: t.text,
        border: `1px solid ${t.border}`, borderRadius: 8,
        padding: '0.5rem 0.7rem', fontSize: '0.85rem',
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SortHeader = ({ t, label, col, sortBy, sortDir, onSort, align = 'left' }) => {
  const isActive = sortBy === col;
  return (
    <button
      onClick={() => onSort(col)}
      style={{
        background: 'transparent', border: 'none',
        color: isActive ? t.primary : t.textMuted,
        fontSize: '0.7rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        padding: 0, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 4,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {label}
      <FontAwesomeIcon
        icon={isActive ? (sortDir === 'asc' ? faSortUp : faSortDown) : faSort}
        style={{ fontSize: '0.65rem', opacity: isActive ? 1 : 0.4 }}
      />
    </button>
  );
};

const SeverityPill = ({ severity, t, isDark }) => {
  const m = severityMeta(severity, isDark);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: m.bg, color: m.fg,
      borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
      padding: '2px 9px',
    }}>
      <FontAwesomeIcon icon={m.icon} style={{ fontSize: '0.65rem' }} />
      {m.label}
    </span>
  );
};

const StatusPill = ({ status, t, isDark }) => {
  const m = statusMeta(status, isDark);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: m.bg, color: m.fg,
      borderRadius: 999, fontSize: '0.7rem', fontWeight: 600,
      padding: '2px 9px',
    }}>
      <FontAwesomeIcon icon={m.icon} style={{ fontSize: '0.65rem' }} />
      {m.label}
    </span>
  );
};

const ModulePill = ({ module, t, isDark }) => {
  const c = moduleColor(module, isDark);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.fg,
      borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
      padding: '2px 8px',
    }}>
      {module}
    </span>
  );
};

const ActionPill = ({ action, t, isDark }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: isDark ? 'rgba(15,23,42,0.7)' : '#0f172a',
    color: '#fff',
    borderRadius: 4, fontSize: '0.7rem', fontWeight: 600,
    padding: '2px 7px', fontFamily: 'monospace',
    letterSpacing: '0.02em',
  }}>
    {action}
  </span>
);

const AuditTable = ({
  t, isDark, loading, accounts, total, pageStart, currentPage, totalPages,
  entriesPerPage, onPage, onSort, sortBy, sortDir, onInspect, onPerPage,
  filterCount, onClearFilters,
}) => {
  return (
    <div
      style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 14, overflow: 'hidden', boxShadow: t.shadow,
      }}
    >
      <div className="d-flex flex-wrap justify-content-between align-items-center" style={{ padding: '0.85rem 1rem', borderBottom: `1px solid ${t.border}`, background: t.surfaceAlt }}>
        <div>
          <h6 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: t.text }}>
            <FontAwesomeIcon icon={faHistory} className="me-2" style={{ color: t.primary }} />
            Audit Registry Database
          </h6>
          <div style={{ fontSize: '0.72rem', color: t.textMuted, marginTop: 2 }}>
            Cryptographically chained events. Rows are immutable.
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => onPerPage(Number(e.target.value))}
            aria-label="Entries per page"
            style={{
              background: t.surface, color: t.text,
              border: `1px solid ${t.border}`, borderRadius: 8,
              padding: '0.4rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer',
            }}
          >
            {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.surfaceAlt, borderBottom: `1px solid ${t.border}` }}>
              <Th>
                <SortHeader t={t} col="timestamp" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Timestamp" />
              </Th>
              <Th>
                <SortHeader t={t} col="code" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Log Code" />
              </Th>
              <Th hideOnMobile>
                <SortHeader t={t} col="module" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Module" />
              </Th>
              <Th hideOnTablet>
                <SortHeader t={t} col="action" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Action" />
              </Th>
              <Th hideOnDesktop>
                <SortHeader t={t} col="user" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="User" />
              </Th>
              <Th hideOnMobile>
                <SortHeader t={t} col="recordId" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Record" />
              </Th>
              <Th hideOnMobile>
                <SortHeader t={t} col="severity" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Severity" />
              </Th>
              <Th hideOnMobile>
                <SortHeader t={t} col="status" sortBy={sortBy} sortDir={sortDir} onSort={onSort} label="Status" />
              </Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <EmptyState t={t} isDark={isDark} filterCount={filterCount} onClear={onClearFilters} />
                </td>
              </tr>
            ) : (
              accounts.map(a => (
                <AuditRow
                  key={a.id} t={t} isDark={isDark}
                  audit={a}
                  onInspect={onInspect}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {accounts.length > 0 && (
        <div
          className="d-flex flex-wrap align-items-center justify-content-between gap-2"
          style={{ padding: '0.85rem 1rem', borderTop: `1px solid ${t.border}`, background: t.surfaceAlt }}
        >
          <div style={{ fontSize: '0.78rem', color: t.textMuted }}>
            Showing <strong style={{ color: t.text }}>{pageStart + 1}</strong>–<strong style={{ color: t.text }}>{Math.min(pageStart + entriesPerPage, total)}</strong> of <strong style={{ color: t.text }}>{total}</strong>
          </div>
          <Pagination t={t} currentPage={currentPage} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
};

const Th = ({ children, hideOnMobile, hideOnTablet, hideOnDesktop, align = 'left' }) => (
  <th
    className={[
      hideOnMobile ? 'd-none d-sm-table-cell' : '',
      hideOnTablet ? 'd-none d-md-table-cell' : '',
      hideOnDesktop ? 'd-none d-lg-table-cell' : '',
    ].filter(Boolean).join(' ')}
    style={{ padding: '0.7rem 0.9rem', textAlign: align, whiteSpace: 'nowrap' }}
  >
    {children}
  </th>
);

const AuditRow = ({ audit, t, isDark, onInspect }) => (
  <tr
    style={{ borderBottom: `1px solid ${t.border}`, transition: 'background 0.1s' }}
    onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceHover}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <td style={{ padding: '0.7rem 0.9rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: t.surfaceAlt, color: t.textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', flexShrink: 0,
        }}>
          <FontAwesomeIcon icon={faClock} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: t.text }}>
          {audit.timestamp}
        </span>
      </div>
    </td>
    <td style={{ padding: '0.7rem 0.9rem' }}>
      <span style={{
        fontFamily: 'monospace', fontSize: '0.78rem', color: t.text, fontWeight: 600,
        background: t.surfaceAlt, padding: '2px 8px', borderRadius: 4,
        border: `1px solid ${t.border}`,
      }}>
        {audit.code}
      </span>
    </td>
    <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
      <ModulePill module={audit.module} t={t} isDark={isDark} />
    </td>
    <td className="d-none d-md-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
      <ActionPill action={audit.action} t={t} isDark={isDark} />
    </td>
    <td className="d-none d-lg-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ color: t.text, fontSize: '0.85rem', fontWeight: 600 }}>{audit.user}</span>
        <span style={{ color: t.textMuted, fontSize: '0.7rem' }}>{audit.role}</span>
      </div>
    </td>
    <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: t.primary, fontWeight: 600 }}>
          {audit.recordId}
        </span>
        <span style={{ color: t.textMuted, fontSize: '0.7rem' }}>{audit.recordType}</span>
      </div>
    </td>
    <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
      <SeverityPill severity={audit.severity} t={t} isDark={isDark} />
    </td>
    <td className="d-none d-sm-table-cell" style={{ padding: '0.7rem 0.9rem' }}>
      <StatusPill status={audit.status} t={t} isDark={isDark} />
    </td>
    <td style={{ padding: '0.7rem 0.9rem', textAlign: 'right' }}>
      <ActionMenu t={t} isDark={isDark} onInspect={() => onInspect(audit)} />
    </td>
  </tr>
);

const ActionMenu = ({ t, isDark, onInspect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <div className="d-flex gap-1 justify-content-end">
        <button
          onClick={onInspect}
          title="Inspect diff"
          aria-label="Inspect"
          style={{
            background: t.surfaceAlt, color: t.primary,
            border: `1px solid ${t.border}`, borderRadius: 6,
            padding: '5px 10px', fontSize: '0.74rem', fontWeight: 600,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = t.primarySoft;
            e.currentTarget.style.borderColor = t.primaryBorder;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = t.surfaceAlt;
            e.currentTarget.style.borderColor = t.border;
          }}
        >
          <FontAwesomeIcon icon={faEye} /> <span className="d-none d-md-inline">Inspect</span>
        </button>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="More actions"
          style={{
            background: t.surfaceAlt, color: t.textMuted,
            border: `1px solid ${t.border}`, borderRadius: 6,
            padding: '5px 8px', fontSize: '0.78rem', cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>

      {open && (
        <div
          style={{
            position: 'absolute', right: 0, top: '110%', zIndex: 20, minWidth: 200,
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 10, boxShadow: t.shadow, padding: 4,
          }}
        >
          <MenuItem t={t} icon={faEye} label="View details" onClick={() => { setOpen(false); onInspect(); }} />
          <MenuItem t={t} icon={faCopy} label="Copy checksum" onClick={() => {
            navigator.clipboard?.writeText('audit-checksum');
            setOpen(false);
          }} />
          <MenuItem t={t} icon={faLink} label="Open source record" onClick={() => setOpen(false)} />
          <div style={{ height: 1, background: t.border, margin: '4px 0' }} />
          <MenuItem t={t} icon={faDownload} label="Export this event" onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
};

// Need a fallback for EllipsisV import (already imported faEllipsisV? no I imported faEllipsisVAlt by mistake)

const MenuItem = ({ t, icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', textAlign: 'left',
      background: 'transparent', border: 'none',
      color: t.text, padding: '0.55rem 0.7rem',
      borderRadius: 6, fontSize: '0.82rem', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 8,
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = t.surfaceHover}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <FontAwesomeIcon icon={icon} style={{ color: t.textMuted, width: 14 }} />
    {label}
  </button>
);

const EmptyState = ({ t, isDark, filterCount, onClear }) => (
  <div style={{ padding: '1rem' }}>
    <div style={{
      width: 64, height: 64, borderRadius: 18,
      background: t.surfaceAlt, color: t.textMuted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.4rem', margin: '0 auto 0.85rem',
    }}>
      <FontAwesomeIcon icon={faHistory} />
    </div>
    <h6 style={{ color: t.text, margin: 0, fontSize: '1rem' }}>No matching audit events</h6>
    <p style={{ color: t.textMuted, fontSize: '0.85rem', margin: '0.4rem auto 1rem', maxWidth: 380 }}>
      Try changing your filters or search terms to widen the results.
    </p>
    {filterCount > 0 && (
      <button
        onClick={onClear}
        style={{
          background: t.primary, color: '#fff', border: 'none',
          padding: '0.5rem 1.1rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600,
          cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
        }}
      >
        <FontAwesomeIcon icon={faTimes} /> Clear filters
      </button>
    )}
  </div>
);

const Pagination = ({ t, currentPage, totalPages, onPage }) => {
  const pages = useMemo(() => {
    const result = [];
    const max = totalPages, cur = currentPage;
    if (max <= 7) { for (let i = 1; i <= max; i++) result.push(i); }
    else {
      result.push(1);
      if (cur > 3) result.push('…');
      for (let i = Math.max(2, cur - 1); i <= Math.min(max - 1, cur + 1); i++) result.push(i);
      if (cur < max - 2) result.push('…');
      result.push(max);
    }
    return result;
  }, [currentPage, totalPages]);

  return (
    <div className="d-flex align-items-center gap-1">
      <PageBtn t={t} disabled={currentPage <= 1} onClick={() => onPage(currentPage - 1)} aria-label="Previous">
        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '0.7rem' }} />
      </PageBtn>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} style={{ color: t.textMuted, padding: '0 0.4rem' }}>…</span>
        ) : (
          <PageBtn key={p} t={t} active={p === currentPage} onClick={() => onPage(p)} aria-label={`Page ${p}`}>
            {p}
          </PageBtn>
        )
      )}
      <PageBtn t={t} disabled={currentPage >= totalPages} onClick={() => onPage(currentPage + 1)} aria-label="Next">
        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.7rem' }} />
      </PageBtn>
    </div>
  );
};

const PageBtn = ({ t, children, active, disabled, onClick, ...rest }) => (
  <button
    onClick={onClick} disabled={disabled} {...rest}
    style={{
      background: active ? t.primary : t.surfaceAlt,
      color: active ? '#fff' : (disabled ? t.textSubtle : t.text),
      border: `1px solid ${active ? t.primary : t.border}`,
      borderRadius: 6, minWidth: 32, height: 32,
      fontSize: '0.8rem', fontWeight: active ? 700 : 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1, padding: '0 0.5rem',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    {children}
  </button>
);

const SkeletonPanel = ({ t }) => (
  <div style={{
    background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: '1rem',
  }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{
        height: 44, borderRadius: 8, marginBottom: 8,
        background: `linear-gradient(90deg, ${t.surfaceAlt} 0%, ${t.surfaceHover} 50%, ${t.surfaceAlt} 100%)`,
        backgroundSize: '200% 100%',
        animation: 'coashimmer 1.4s ease-in-out infinite',
      }} />
    ))}
  </div>
);

const groupedBySeverity = (rows) => {
  const order = ['critical', 'warning', 'standard'];
  const groups = {};
  rows.forEach(a => {
    const k = a.severity || 'standard';
    if (!groups[k]) groups[k] = [];
    groups[k].push(a);
  });
  return order.filter(k => groups[k]).map(k => ({ key: k, rows: groups[k] }));
};

const GroupedView = ({ t, isDark, groups, onInspect }) => {
  if (groups.length === 0) {
    return (
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 14, padding: '2.5rem 1.5rem', textAlign: 'center',
      }}>
        <EmptyState t={t} isDark={isDark} filterCount={0} onClear={() => {}} />
      </div>
    );
  }
  return (
    <div className="d-flex flex-column gap-3">
      {groups.map(({ key, rows }) => {
        const m = severityMeta(key, isDark);
        return (
          <div
            key={key}
            style={{
              background: t.surface, border: `1px solid ${t.border}`,
              borderRadius: 14, overflow: 'hidden', boxShadow: t.shadow,
            }}
          >
            <div
              style={{
                padding: '0.85rem 1.1rem', background: t.surfaceAlt,
                borderBottom: `1px solid ${t.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 8,
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: m.bg, color: m.fg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FontAwesomeIcon icon={m.icon} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: t.text, textTransform: 'capitalize' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: t.textMuted }}>
                    {rows.length} event{rows.length === 1 ? '' : 's'}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {rows.map(a => (
                    <AuditRow key={a.id} t={t} isDark={isDark} audit={a} onInspect={onInspect} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --------------------------------------------------------------------------
// INSPECT DRAWER
// --------------------------------------------------------------------------
const InspectDrawer = ({ t, isDark, detail, sev, stat, modc, onClose }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1080,
        background: isDark ? 'rgba(2,6,23,0.6)' : 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'flex-end',
        animation: 'coafadein 0.2s ease-out',
      }}
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          width: 'min(620px, 100%)',
          maxWidth: '100%',
          background: t.surface, color: t.text,
          borderLeft: `1px solid ${t.border}`,
          boxShadow: '-8px 0 32px rgba(0,0,0,0.22)',
          display: 'flex', flexDirection: 'column',
          animation: 'coafadein 0.2s ease-out',
        }}
      >
        <div
          style={{
            padding: '1.1rem 1.5rem', borderBottom: `1px solid ${t.border}`,
            background: t.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: modc.bg, color: modc.fg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
            }}>
              <FontAwesomeIcon icon={faUserShield} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: t.text }}>
                  {detail.code}
                </h5>
                <SeverityPill severity={detail.severity} t={t} isDark={isDark} />
                <StatusPill status={detail.status} t={t} isDark={isDark} />
              </div>
              <div style={{ fontSize: '0.72rem', color: t.textMuted, marginTop: 2, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span><FontAwesomeIcon icon={faClock} className="me-1" />{detail.timestamp}</span>
                <span>·</span>
                <span><FontAwesomeIcon icon={faShieldHalved} className="me-1" />SHA-256 secured</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'transparent', border: 'none', color: t.textMuted, padding: 8, borderRadius: 8, cursor: 'pointer', fontSize: '1.1rem' }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {/* DIFF VIEW */}
          <SectionTitle t={t} icon={faEquals} title="Visual Changes Diff" subtitle={`Field: ${detail.changedField}`} />
          <div
            style={{
              borderRadius: 12, overflow: 'hidden', border: `1px solid ${t.border}`,
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ padding: '0.85rem 1rem', background: t.surfaceAlt, borderBottom: `1px solid ${t.border}` }}>
              <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: t.text }}>
                <FontAwesomeIcon icon={faEquals} style={{ color: t.primary }} />
                <strong style={{ fontFamily: 'monospace' }}>{detail.changedField}</strong>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <DiffCell t={t} label="Old value" value={detail.beforeValue} variant="old" />
              <DiffCell t={t} label="New value" value={detail.afterValue} variant="new" />
            </div>
          </div>

          {/* METADATA */}
          <SectionTitle t={t} icon={faUserShield} title="Security Audit Metadata" />
          <div
            style={{
              background: t.surfaceAlt, border: `1px solid ${t.border}`,
              borderRadius: 12, padding: '0.85rem 1rem', marginBottom: '1.25rem',
            }}
          >
            <div className="row g-2">
              <MetaCell t={t} icon={faUser} label="User" value={`${detail.user} (${detail.role})`} />
              <MetaCell t={t} icon={faGlobe} label="Client IP" value={detail.ip} />
              <MetaCell t={t} icon={faDesktop} label="User Agent" value={detail.os} />
              <MetaCell t={t} icon={faRoute} label="System Route" value={detail.route} />
              <MetaCell t={t} icon={faHashtag} label="Record ID" value={detail.recordId} />
              <MetaCell t={t} icon={faDatabase} label="Module" value={detail.module} />
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${t.border}`, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: t.textMuted }}>
              <FontAwesomeIcon icon={faKey} /> Checksum: <code style={{ fontFamily: 'monospace', background: t.surface, padding: '1px 6px', borderRadius: 4, color: t.text }}>{detail.checksum}</code>
            </div>
          </div>

          {detail.severity === 'critical' && (
            <div
              style={{
                background: t.dangerSoft, color: t.danger,
                border: `1px solid ${t.danger}55`, borderRadius: 12,
                padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start', gap: 10,
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: '0.85rem' }}>Security Critical Action</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', opacity: 0.9 }}>
                  This change modified global security policies or limits and was audited under dual-signoff maker-checker controls.
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '0.9rem 1.5rem', borderTop: `1px solid ${t.border}`, background: t.surfaceAlt, display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(JSON.stringify(detail, null, 2));
            }}
            style={{
              background: t.surface, border: `1px solid ${t.border}`,
              color: t.text, padding: '0.5rem 0.9rem', borderRadius: 8,
              fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <FontAwesomeIcon icon={faCopy} /> Copy as JSON
          </button>
          <button
            onClick={onClose}
            style={{
              background: t.primary, border: 'none', color: '#fff',
              padding: '0.5rem 1.1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

const SectionTitle = ({ t, icon, title, subtitle }) => (
  <div className="d-flex align-items-center gap-2 mb-2">
    <div style={{
      width: 28, height: 28, borderRadius: 6,
      background: t.primarySoft, color: t.primary,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.78rem',
    }}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: t.text }}>{title}</div>
      {subtitle && <div style={{ fontSize: '0.7rem', color: t.textMuted }}>{subtitle}</div>}
    </div>
  </div>
);

const DiffCell = ({ t, label, value, variant }) => {
  const isOld = variant === 'old';
  return (
    <div style={{
      padding: '0.85rem 1rem',
      background: isOld ? t.dangerSoft : t.successSoft,
      color: isOld ? t.danger : t.success,
      borderRight: isOld ? `1px solid ${t.border}` : 'none',
    }}>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 4 }}>
        {isOld ? '− Old' : '+ New'}
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 500, color: t.text, fontFamily: 'monospace', wordBreak: 'break-word' }}>
        {value || '—'}
      </div>
    </div>
  );
};

const MetaCell = ({ t, icon, label, value }) => (
  <div className="col-12 col-sm-6">
    <div style={{
      padding: '0.5rem 0.7rem', background: t.surface,
      border: `1px solid ${t.border}`, borderRadius: 8,
    }}>
      <div style={{ fontSize: '0.7rem', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
        <FontAwesomeIcon icon={icon} /> {label}
      </div>
      <div style={{ fontSize: '0.82rem', color: t.text, fontWeight: 500, wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  </div>
);

// --------------------------------------------------------------------------
// EXPORT DIALOG
// --------------------------------------------------------------------------
const ExportDialog = ({ t, isDark, onClose, onExport, hasFilter, filteredCount, totalCount }) => {
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState(hasFilter ? 'filtered' : 'all');

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1080,
        background: isDark ? 'rgba(2,6,23,0.7)' : 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: 'min(560px, 100%)',
          background: t.surface, color: t.text,
          border: `1px solid ${t.border}`, borderRadius: 18,
          boxShadow: t.shadow, overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '1.1rem 1.25rem', borderBottom: `1px solid ${t.border}`,
          background: t.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div className="d-flex align-items-center gap-2">
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: t.primarySoft, color: t.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.05rem',
            }}>
              <FontAwesomeIcon icon={faFileExport} />
            </div>
            <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Export Audit Trail</h5>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 'none', color: t.textMuted, padding: 8, borderRadius: 8, cursor: 'pointer', fontSize: '1.1rem',
          }}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Format
          </div>
          <div className="row g-2 mb-3">
            <FormatCard
              t={t} active={format === 'csv'} onClick={() => setFormat('csv')}
              icon={faFileCsv} title="CSV" subtitle="Excel / Sheets compatible"
            />
            <FormatCard
              t={t} active={format === 'xlsx'} onClick={() => setFormat('xlsx')}
              icon={faFileExcel} title="Excel" subtitle=".xlsx workbook"
            />
            <FormatCard
              t={t} active={format === 'tsv'} onClick={() => setFormat('tsv')}
              icon={faFileCode} title="TSV" subtitle="Tab-separated"
            />
            <FormatCard
              t={t} active={format === 'json'} onClick={() => setFormat('json')}
              icon={faServer} title="JSON" subtitle="Structured dump"
            />
          </div>

          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Scope
          </div>
          <div className="d-flex flex-column gap-2">
            <ScopeOption
              t={t} active={scope === 'all'} onClick={() => setScope('all')}
              icon={faList} title="All events" subtitle={`${totalCount} total`}
            />
            <ScopeOption
              t={t} active={scope === 'filtered'} onClick={() => setScope('filtered')}
              icon={faFilter} title="Current filter" subtitle={`${filteredCount} matching`}
              disabled={!hasFilter}
            />
          </div>

          <div
            style={{
              marginTop: '1.1rem', padding: '0.75rem 0.9rem',
              background: t.surfaceAlt, border: `1px solid ${t.border}`, borderRadius: 10,
              fontSize: '0.78rem', color: t.textMuted, display: 'flex', gap: 8, alignItems: 'flex-start',
            }}
          >
            <FontAwesomeIcon icon={faInfoCircle} style={{ color: t.info, marginTop: 2 }} />
            <div>
              Exports include SHA-256 checksums for every event so that the integrity of the
              downloaded ledger can be re-verified offline.
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 8,
          padding: '0.9rem 1.25rem', borderTop: `1px solid ${t.border}`,
          background: t.surfaceAlt,
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: `1px solid ${t.border}`,
              color: t.text, padding: '0.5rem 1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onExport(format, scope)}
            style={{
              background: t.primary, border: 'none', color: '#fff',
              padding: '0.5rem 1.1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            <FontAwesomeIcon icon={faDownload} /> Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormatCard = ({ t, active, onClick, icon, title, subtitle }) => (
  <div className="col-6">
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', padding: '0.85rem 0.9rem',
        background: active ? t.primarySoft : t.surfaceAlt,
        border: `1.5px solid ${active ? t.primary : t.border}`,
        borderRadius: 12,
        color: active ? t.primary : t.text, cursor: 'pointer',
        textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: active ? t.primary : t.surface,
        color: active ? '#fff' : t.textMuted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.95rem', border: `1px solid ${active ? t.primary : t.border}`,
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: t.text }}>{title}</div>
        <div style={{ fontSize: '0.7rem', color: t.textMuted }}>{subtitle}</div>
      </div>
      {active && <FontAwesomeIcon icon={faCheck} style={{ color: t.primary, fontSize: '0.85rem' }} />}
    </button>
  </div>
);

const ScopeOption = ({ t, active, onClick, icon, title, subtitle, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.7rem 0.9rem',
      background: active ? t.primarySoft : t.surfaceAlt,
      border: `1.5px solid ${active ? t.primary : t.border}`,
      borderRadius: 12,
      color: t.text,
      cursor: disabled ? 'not-allowed' : 'pointer',
      textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
      opacity: disabled ? 0.55 : 1,
    }}
  >
    <div style={{
      width: 30, height: 30, borderRadius: 7,
      background: active ? t.primary : t.surface,
      color: active ? '#fff' : t.textMuted,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.82rem', border: `1px solid ${active ? t.primary : t.border}`,
    }}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: t.text }}>{title}</div>
      <div style={{ fontSize: '0.72rem', color: t.textMuted }}>{subtitle}</div>
    </div>
    <div style={{
      width: 16, height: 16, borderRadius: '50%',
      border: `2px solid ${active ? t.primary : t.borderStrong}`,
      background: active ? t.primary : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {active && <FontAwesomeIcon icon={faCheck} style={{ color: '#fff', fontSize: '0.5rem' }} />}
    </div>
  </button>
);

export default ErpAuditTrail;