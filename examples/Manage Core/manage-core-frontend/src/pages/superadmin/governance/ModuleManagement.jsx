import React, { useState, useEffect, useMemo } from 'react';
import {
  FiSearch, FiFilter, FiMoreVertical, FiClock, FiUsers, FiGrid,
  FiLayers, FiDollarSign, FiActivity, FiCheckCircle, FiXCircle,
  FiTrash2, FiCopy, FiRotateCcw, FiArrowUp, FiShare2, FiBarChart2,
  FiToggleLeft, FiToggleRight, FiArchive, FiSliders, FiStar,
  FiAlertTriangle, FiBox, FiList, FiChevronDown, FiHeart,
  FiMonitor, FiDollarSign as FiDollar, FiTerminal, FiDatabase, FiCheck
} from 'react-icons/fi';

import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Tooltip, Legend 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

import { getGovernanceModules, updateModuleStatus, cloneModule } from '../../../api/governance';
import { useApp } from '../../../hooks/useApp';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Tooltip, Legend
);

const MODULES = [
  { id: 1, name: 'HRMS', fullName: 'Human Resource Management', version: 'v3.2.1', status: 'ACTIVE', deps: 8, users: 1240, tenants: 10, revenue: 84500, health: 94, updated: '2026-06-15' },
  { id: 2, name: 'PMS', fullName: 'Project Management System', version: 'v2.1.0', status: 'ACTIVE', deps: 5, users: 890, tenants: 8, revenue: 62000, health: 88, updated: '2026-06-14' },
  { id: 3, name: 'FMS', fullName: 'Financial Management System', version: 'v4.0.2', status: 'ACTIVE', deps: 6, users: 670, tenants: 7, revenue: 73000, health: 91, updated: '2026-06-13' },
  { id: 4, name: 'DMS', fullName: 'Document Management System', version: 'v1.8.3', status: 'ACTIVE', deps: 3, users: 450, tenants: 6, revenue: 31500, health: 85, updated: '2026-06-12' },
  { id: 5, name: 'CRM', fullName: 'Customer Relationship Management', version: 'v2.3.1', status: 'BETA', deps: 4, users: 210, tenants: 3, revenue: 18000, health: 72, updated: '2026-06-11' },
  { id: 6, name: 'Inventory', fullName: 'Inventory Management', version: 'v1.5.0', status: 'ACTIVE', deps: 4, users: 380, tenants: 5, revenue: 28000, health: 79, updated: '2026-06-10' },
  { id: 7, name: 'Procurement', fullName: 'Procurement Management', version: 'v1.2.0', status: 'SANDBOX', deps: 3, users: 45, tenants: 2, revenue: 5000, health: 55, updated: '2026-06-09' },
  { id: 8, name: 'Helpdesk', fullName: 'Helpdesk & Support', version: 'v2.0.1', status: 'ACTIVE', deps: 2, users: 520, tenants: 7, revenue: 22500, health: 90, updated: '2026-06-08' },
  { id: 9, name: 'KnowledgeBase', fullName: 'Knowledge Base', version: 'v1.0.5', status: 'MAINTENANCE', deps: 1, users: 180, tenants: 4, revenue: 8000, health: 45, updated: '2026-06-07' },
  { id: 10, name: 'BI', fullName: 'Business Intelligence', version: 'v3.0.0', status: 'DISABLED', deps: 5, users: 0, tenants: 0, revenue: 0, health: 0, updated: '2026-06-06' },
  { id: 11, name: 'Workflow', fullName: 'Workflow Engine', version: 'v2.4.2', status: 'ACTIVE', deps: 3, users: 320, tenants: 6, revenue: 15000, health: 83, updated: '2026-06-05' },
  { id: 12, name: 'AIAssistant', fullName: 'AI Assistant', version: 'v1.1.0', status: 'BETA', deps: 2, users: 95, tenants: 2, revenue: 3500, health: 60, updated: '2026-06-04' },
  { id: 13, name: 'DMS-vault', fullName: 'Document Vault', version: 'v2.0.0', status: 'ARCHIVED', deps: 1, users: 0, tenants: 0, revenue: 0, health: 0, updated: '2026-06-03' },
];

const STATUS_ICONS = {
  ACTIVE: FiCheckCircle,
  DISABLED: FiXCircle,
  SANDBOX: FiSliders,
  BETA: FiStar,
  MAINTENANCE: FiClock,
  ARCHIVED: FiArchive,
  DEPRECATED: FiAlertTriangle,
};

const STATUS_COLORS = {
  ACTIVE: '#059669',
  DISABLED: '#dc2626',
  SANDBOX: '#d97706',
  BETA: '#3b82f6',
  MAINTENANCE: '#8b5cf6',
  ARCHIVED: '#64748b',
  DEPRECATED: '#b91c1c',
};

const STATUS_BG = {
  ACTIVE: '#ecfdf5',
  DISABLED: '#fef2f2',
  SANDBOX: '#fffbeb',
  BETA: '#eff6ff',
  MAINTENANCE: '#f5f3ff',
  ARCHIVED: '#f1f5f9',
  DEPRECATED: '#fef2f2',
};

const ICON_BG = {
  ACTIVE: '#2563eb',
  BETA: '#9333ea',
  SANDBOX: '#d97706',
  MAINTENANCE: '#7c3aed',
  DISABLED: '#dc2626',
  ARCHIVED: '#64748b',
  DEPRECATED: '#b91c1c',
};

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

const getHealthColor = (score) => {
  if (score > 80) return '#059669';
  if (score > 50) return '#d97706';
  return '#dc2626';
};

const ModuleManagement = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const C = {
    card: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    pageText: isDark ? '#f1f5f9' : '#0f172a',
    text: isDark ? '#e2e8f0' : '#1e293b',
    muted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
    strongBorder: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    inputBg: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
    subtleBg: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    hoverBg: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    badgeFallback: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedModules, setSelectedModules] = useState(new Set());
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [modules, setModules] = useState(MODULES);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Modal Dialog States for upgrades, cloning, and analytical details
  const [activeModal, setActiveModal] = useState(null); // { type, module }
  const [actionProgress, setActionProgress] = useState(0);
  const [isActionRunning, setIsActionRunning] = useState(false);
  const [actionLogs, setActionLogs] = useState([]);
  
  // Clone Module Form State
  const [cloneForm, setCloneForm] = useState({ name: '', version: 'v1.0.0' });
  // Upgrade Module Form State
  const [upgradeVersionVal, setUpgradeVersionVal] = useState('');

  const triggerUpgradeSimulation = (mod) => {
    setIsActionRunning(true);
    setActionProgress(0);
    setActionLogs([]);
    const version = upgradeVersionVal || 'v3.3.0';

    const logs = [
      `[BACKUP] Initializing cluster database snapshot...`,
      `[BACKUP] Snapshot saved: /backups/modules/${mod.name}_pre_${mod.version}.sql`,
      `[MIGRATION] Running module schema adjustments for v${version}...`,
      `[MIGRATION] Table adjustments complete. Mapped 3 new system columns.`,
      `[ROUTE] Flushing route tables and clear cache...`,
      `[CACHE] Purging redis caches for active tenants...`,
      `[SUCCESS] Module ${mod.name} has been successfully upgraded to v${version}!`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setActionLogs(prev => [...prev, logs[step]]);
        setActionProgress(Math.round(((step + 1) / logs.length) * 100));
        step++;
      } else {
        clearInterval(interval);
        setIsActionRunning(false);
        // Apply version change
        setModules(prev => prev.map(m => m.id === mod.id ? { ...m, version: `v${version.replace(/^v/, '')}` } : m));
      }
    }, 500);
  };

  const triggerRollbackSimulation = (mod) => {
    setIsActionRunning(true);
    setActionProgress(0);
    setActionLogs([]);

    const logs = [
      `[RESTORE] Locating active rollback snapshots... Found v1.0.0-compat.`,
      `[RESTORE] Restoring database schema to compatible baseline...`,
      `[CACHE] Flushing active user sessions for module ${mod.name}...`,
      `[SUCCESS] Rollback complete. Module ${mod.name} is now operating on v1.0.0.`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setActionLogs(prev => [...prev, logs[step]]);
        setActionProgress(Math.round(((step + 1) / logs.length) * 100));
        step++;
      } else {
        clearInterval(interval);
        setIsActionRunning(false);
        setModules(prev => prev.map(m => m.id === mod.id ? { ...m, version: 'v1.0.0' } : m));
      }
    }, 600);
  };

  const triggerCloneSimulation = (mod) => {
    setIsActionRunning(true);
    setActionProgress(0);
    setActionLogs([]);
    const cloneName = cloneForm.name || `${mod.name}-clone`;
    const cloneVersion = cloneForm.version || 'v1.0.0';

    const logs = [
      `[CLONE] Copying module metadata rules for ${mod.name}...`,
      `[CLONE] Cloning schema mappings...`,
      `[CLONE] Creating new module registration with name "${cloneName}"...`,
      `[SUCCESS] Module "${cloneName}" successfully registered under version "${cloneVersion}".`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < logs.length) {
        setActionLogs(prev => [...prev, logs[step]]);
        setActionProgress(Math.round(((step + 1) / logs.length) * 100));
        step++;
      } else {
        clearInterval(interval);
        setIsActionRunning(false);
        
        // Add new cloned module
        const newMod = {
          id: modules.length + 1,
          name: cloneName.toUpperCase(),
          fullName: `${mod.fullName} (Copy)`,
          version: cloneVersion,
          status: 'ACTIVE',
          deps: mod.deps,
          users: 0,
          tenants: 0,
          revenue: 0,
          health: 100,
          updated: new Date().toISOString().slice(0, 10)
        };
        setModules(prev => [...prev, newMod]);
      }
    }, 550);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getGovernanceModules();
        if (cancelled) return;
        const moduleData = res?.data?.data || res?.data || [];
        const list = Array.isArray(moduleData) ? moduleData : Array.isArray(res) ? res : [];
        if (list.length > 0) {
          setModules(list.map(m => ({
            id: m.id,
            name: m.name,
            fullName: m.display_name || m.description || m.name,
            version: m.version || 'v1.0.0',
            status: (m.status || 'active').toUpperCase(),
            deps: m.dependencies?.length || 0,
            users: m.user_count || m.tenant_count * 100 || 0,
            tenants: m.tenant_count || 0,
            revenue: m.revenue || m.base_price || 0,
            health: Math.round(m.health_score || 80),
            updated: m.last_deployed ? m.last_deployed.slice(0, 10) : '2026-06-15',
          })));
        }
      } catch (e) {
        if (!cancelled) setApiError('API unavailable, showing local data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredModules = modules.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = m.name?.toLowerCase().includes(term) || m.fullName?.toLowerCase().includes(term) || m.version?.toLowerCase().includes(term);
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const allFilteredSelected = filteredModules.length > 0 && filteredModules.every(m => selectedModules.has(m.id));
  const isIndeterminate = selectedModules.size > 0 && !allFilteredSelected;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedModules(new Set([...selectedModules].filter(id => !filteredModules.some(m => m.id === id))));
    } else {
      const next = new Set(selectedModules);
      filteredModules.forEach(m => next.add(m.id));
      setSelectedModules(next);
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedModules);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedModules(next);
  };

  const handleStatusChange = async (id, newStatus) => {
    const previous = [...modules];
    setModules(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    try {
      await updateModuleStatus(id, newStatus);
    } catch (e) {
      setModules(previous);
    }
  };

  const handleClone = async (id) => {
    try {
      const res = await cloneModule(id);
      if (res?.data) {
        setModules(prev => [...prev, res.data]);
      }
    } catch (e) {
      // fallback: just log
    }
  };

  const totalUsers = modules.reduce((sum, m) => sum + (m.users || 0), 0);
  const totalRevenue = modules.reduce((sum, m) => sum + (m.revenue || 0), 0);
  const avgHealth = modules.length > 0 ? Math.round(modules.reduce((sum, m) => sum + (m.health || 0), 0) / modules.length) : 0;
  const activeCount = modules.filter(m => m.status === 'ACTIVE').length;

  const stats = [
    { label: 'Total Modules', value: String(modules.length), icon: FiBox, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Active Modules', value: String(activeCount), icon: FiCheckCircle, color: '#059669', bg: '#ecfdf5' },
    { label: 'Total Users', value: totalUsers.toLocaleString(), icon: FiUsers, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Total Revenue', value: '$' + (totalRevenue >= 1000 ? Math.round(totalRevenue / 1000) + 'K' : totalRevenue), icon: FiDollar, color: '#d97706', bg: '#fffbeb' },
    { label: 'Avg Health', value: avgHealth + '%', icon: FiHeart, color: avgHealth > 60 ? '#059669' : '#d97706', bg: '#ecfdf5' },
  ];

  const s = {
    container: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: C.pageText },

    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 },
    statCard: { background: C.card, borderRadius: 16, padding: '18px 20px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', cursor: 'default' },
    statIconWrap: (bg, color) => ({ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }),
    statValue: { fontSize: 22, fontWeight: 700, color: C.pageText, lineHeight: 1.1 },
    statLabel: { fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 4 },

    toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' },
    searchWrap: { display: 'flex', alignItems: 'center', background: C.inputBg, border: `1px solid ${C.strongBorder}`, borderRadius: 16, padding: '0 16px', width: 360, maxWidth: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' },
    searchInput: { border: 'none', background: 'transparent', padding: '10px 0 10px 12px', fontSize: 14, outline: 'none', color: C.pageText, width: '100%' },
    filterGroup: { display: 'flex', alignItems: 'center', gap: 10 },
    filterSelectWrap: { display: 'flex', alignItems: 'center', gap: 8, background: C.inputBg, border: `1px solid ${C.strongBorder}`, borderRadius: 16, padding: '0 14px' },
    filterSelect: { border: 'none', background: 'transparent', padding: '10px 4px 10px 8px', fontSize: 13, fontWeight: 500, color: C.text, outline: 'none', cursor: 'pointer', minWidth: 130 },
    viewToggle: (active) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 12, border: active ? `1px solid ${C.pageText}` : `1px solid ${C.strongBorder}`, background: active ? C.pageText : C.inputBg, color: active ? '#ffffff' : C.muted, cursor: 'pointer', transition: 'all 0.15s' }),

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
    card: { background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: 24, position: 'relative', overflow: 'visible', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default', display: 'flex', flexDirection: 'column', zIndex: 1 },

    cardElevated: { zIndex: 100 },

    iconBadge: (status) => ({ width: 40, height: 40, borderRadius: 12, background: ICON_BG[status] || '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }),
    moduleName: { fontSize: 16, fontWeight: 700, color: C.pageText, margin: 0, lineHeight: 1.2 },
    moduleFullName: { fontSize: 12, color: C.muted, margin: '2px 0 0 0' },
    moduleVersion: { fontSize: 11, color: C.muted, margin: '1px 0 0 0', fontFamily: 'monospace' },

    statusBadge: (status) => ({ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: STATUS_BG[status] || C.badgeFallback, color: STATUS_COLORS[status] || C.muted, border: `1px solid ${STATUS_COLORS[status]||'#e2e8f0'}20` }),

    statRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: 16 },
    statItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.muted },
    statIcon: { color: C.muted, flexShrink: 0 },

    healthSection: { marginTop: 16, padding: '12px 0 0', borderTop: `1px solid ${C.border}` },
    healthHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    healthLabel: { fontSize: 11, fontWeight: 600, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 },
    healthValue: (color) => ({ fontSize: 13, fontWeight: 700, color }),
    healthBar: { height: 6, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', overflow: 'hidden' },
    healthFill: (score) => ({ height: '100%', borderRadius: 10, background: getHealthColor(score), width: `${Math.max(score, 2)}%`, transition: 'width 0.6s ease' }),

    footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` },
    updated: { fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 },

    moreBtn: { background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, borderRadius: 8, display: 'flex', transition: 'all 0.15s', position: 'relative' },
    moreBtnHover: { background: C.hoverBg, color: C.text },

    dropdown: (isOpen) => ({ position: 'absolute', top: 32, right: 0, background: isDark ? '#1e293b' : '#ffffff', borderRadius: 14, border: `1px solid ${C.strongBorder}`, boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)', padding: 6, zIndex: 999, minWidth: 210, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transform: isOpen ? 'translateY(0)' : 'translateY(-4px)', transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)' }),
    dropdownItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, color: C.text, cursor: 'pointer', border: 'none', background: 'transparent', width: '100%', textAlign: 'left', transition: 'all 0.1s' },
    dropdownDivider: { height: 1, background: C.border, margin: '4px 8px' },

    bulkBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.strongBorder}` },
    bulkLeft: { display: 'flex', alignItems: 'center', gap: 16 },
    bulkRight: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
    checkbox: { width: 18, height: 18, borderRadius: 5, border: `2px solid ${isDark ? '#475569' : '#cbd5e1'}`, cursor: 'pointer', accentColor: C.pageText },
    selectLabel: { fontSize: 13, fontWeight: 600, color: C.text, cursor: 'pointer', userSelect: 'none' },
    selectedCount: { fontSize: 12, color: C.muted, fontWeight: 500 },
    bulkBtn: (bg, color, border) => ({ padding: '8px 16px', borderRadius: 12, fontSize: 12, fontWeight: 600, border: border || 'none', background: bg, color, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s' }),

    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: C.muted },
    emptyIcon: { width: 72, height: 72, borderRadius: '50%', background: C.badgeFallback, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: C.muted },
    emptyTitle: { fontSize: 18, fontWeight: 600, color: C.text, margin: '0 0 6px' },
    emptyText: { fontSize: 14, color: C.muted, margin: 0 },

    checkboxCard: { position: 'absolute', top: 14, left: 14, zIndex: 2 },
  };

  const STATUSES = ['All', 'ACTIVE', 'DISABLED', 'SANDBOX', 'BETA', 'MAINTENANCE', 'ARCHIVED', 'DEPRECATED'];

  const dropdownGroups = [
    { label: 'State Changes', items: [
      { text: 'Enable Module', icon: FiToggleLeft, color: '#059669' },
      { text: 'Disable Module', icon: FiToggleRight, color: '#dc2626' },
      { text: 'Move To Sandbox', icon: FiSliders, color: '#d97706' },
      { text: 'Move To Beta', icon: FiStar, color: '#3b82f6' },
      { text: 'Archive Module', icon: FiArchive, color: '#64748b' },
    ]},
    { label: 'Version', items: [
      { text: 'Clone Module', icon: FiCopy, color: '#6366f1' },
      { text: 'Rollback Version', icon: FiRotateCcw, color: '#8b5cf6' },
      { text: 'Upgrade Version', icon: FiArrowUp, color: '#14b8a6' },
    ]},
    { label: 'Information', items: [
      { text: 'View Usage', icon: FiBarChart2, color: '#3b82f6' },
      { text: 'View Dependencies', icon: FiShare2, color: '#06b6d4' },
      { text: 'View Analytics', icon: FiActivity, color: '#f97316' },
    ]},
  ];

  const handleDropdownClick = (e, id) => {
    e.stopPropagation();
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const renderCard = (mod) => {
    const statusIcon = STATUS_ICONS[mod.status] || FiCheckCircle;
    const StatusIcon = statusIcon;
    const isOpen = openDropdownId === mod.id;

    return (
        <div
          key={mod.id}
          style={{...s.card, ...(isOpen ? s.cardElevated : {})}}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = C.strongBorder; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = C.border; }}
        >
          <div style={s.checkboxCard}>
            <input
              type="checkbox"
              checked={selectedModules.has(mod.id)}
              onChange={() => toggleSelect(mod.id)}
              style={s.checkbox}
            />
          </div>

          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 100 }}>
          <button
            style={{...s.moreBtn, ...(isOpen ? s.moreBtnHover : {})}}
            onClick={(e) => handleDropdownClick(e, mod.id)}
            onMouseEnter={e => { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { if (!isOpen) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted; }}}
          >
            <FiMoreVertical size={17} />
          </button>
          <div style={s.dropdown(isOpen)} onClick={e => e.stopPropagation()}>
            {dropdownGroups.map((group, gi) => (
              <React.Fragment key={group.label}>
                {gi > 0 && <div style={s.dropdownDivider} />}
                {group.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <button 
                      key={item.text}
                      style={s.dropdownItem}
                      onMouseEnter={e => { e.currentTarget.style.background = C.hoverBg; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      onClick={() => {
                        setOpenDropdownId(null);
                        if (item.text === 'Enable Module') handleStatusChange(mod.id, 'ACTIVE');
                        else if (item.text === 'Disable Module') handleStatusChange(mod.id, 'DISABLED');
                        else if (item.text === 'Move To Sandbox') handleStatusChange(mod.id, 'SANDBOX');
                        else if (item.text === 'Move To Beta') handleStatusChange(mod.id, 'BETA');
                        else if (item.text === 'Archive Module') handleStatusChange(mod.id, 'ARCHIVED');
                        else if (item.text === 'Clone Module') {
                          setCloneForm({ name: `${mod.name}-copy`, version: 'v1.0.0' });
                          setActiveModal({ type: 'clone', module: mod });
                        }
                        else if (item.text === 'Upgrade Version') {
                          setUpgradeVersionVal('');
                          setActiveModal({ type: 'upgrade', module: mod });
                        }
                        else if (item.text === 'Rollback Version') {
                          setActiveModal({ type: 'rollback', module: mod });
                        }
                        else if (item.text === 'View Usage') {
                          setActiveModal({ type: 'usage', module: mod });
                        }
                        else if (item.text === 'View Dependencies') {
                          setActiveModal({ type: 'dependencies', module: mod });
                        }
                        else if (item.text === 'View Analytics') {
                          setActiveModal({ type: 'analytics', module: mod });
                        }
                      }}
                    >
                      <Icon size={15} style={{ color: item.color, flexShrink: 0 }} />
                      {item.text}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
          <div style={s.iconBadge(mod.status)}>{mod.name.charAt(0)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.moduleName}>{mod.name}</div>
            <div style={s.moduleFullName}>{mod.fullName}</div>
            <div style={s.moduleVersion}>{mod.version}</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={s.statusBadge(mod.status)}>
            <StatusIcon size={11} />
            {mod.status}
          </div>
        </div>

        <div style={s.statRow}>
          <div style={s.statItem}><FiLayers size={13} style={s.statIcon} />{mod.deps} deps</div>
          <div style={s.statItem}><FiUsers size={13} style={s.statIcon} />{mod.users.toLocaleString()} users</div>
          <div style={s.statItem}><FiMonitor size={13} style={s.statIcon} />{mod.tenants} tenants</div>
          <div style={s.statItem}><FiDollarSign size={13} style={s.statIcon} />{formatCurrency(mod.revenue)}</div>
        </div>

        <div style={s.healthSection}>
          <div style={s.healthHeader}>
            <div style={s.healthLabel}><FiActivity size={12} /> Health Score</div>
            <div style={s.healthValue(getHealthColor(mod.health))}>{mod.health}%</div>
          </div>
          <div style={s.healthBar}>
            <div style={s.healthFill(mod.health)} />
          </div>
        </div>

        <div style={s.footer}>
          <div style={s.updated}><FiClock size={11} /> Updated {mod.updated}</div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={s.container}
      onClick={() => setOpenDropdownId(null)}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: C.muted }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${C.strongBorder}`, borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <div style={{ fontWeight: 600 }}>Loading modules...</div>
          {apiError && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 12 }}>{apiError}</div>}
        </div>
      ) : (
        <>
          <div style={s.statsRow}>
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={s.statCard}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
            >
              <div style={s.statIconWrap(stat.bg, stat.color)}>
                <Icon size={20} />
              </div>
              <div>
                <div style={s.statValue}>{stat.value}</div>
                <div style={s.statLabel}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={s.toolbar}>
        <div
          style={s.searchWrap}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.strongBorder; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <FiSearch size={16} color="#94a3b8" />
          <input
            style={s.searchInput}
            placeholder="Search modules by name, code, or full name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={s.filterGroup}>
          <div style={s.filterSelectWrap}>
            <FiFilter size={14} color="#94a3b8" />
            <select
              style={s.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <FiChevronDown size={13} color="#94a3b8" />
          </div>

          <button
            style={s.viewToggle(viewMode === 'grid')}
            onClick={() => setViewMode('grid')}
            title="Grid view"
          >
            <FiGrid size={16} />
          </button>
          <button
            style={s.viewToggle(viewMode === 'list')}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {filteredModules.length === 0 ? (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>
            <FiSearch size={28} />
          </div>
          <p style={s.emptyTitle}>No modules found</p>
          <p style={s.emptyText}>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={s.grid}>
          {filteredModules.map(renderCard)}
        </div>
      ) : (
        <div style={{ background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.subtleBg, borderBottom: `1px solid ${C.border}` }}>
                <th style={{ padding: '14px 16px', width: 40 }}>
                  <input type="checkbox" checked={allFilteredSelected} ref={el => { if (el) el.indeterminate = isIndeterminate; }} onChange={toggleSelectAll} style={s.checkbox} />
                </th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Module</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Version</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Users</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Tenants</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Revenue</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: C.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Health</th>
                <th style={{ padding: '14px 16px', width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map(mod => {
                const StatusIcon = STATUS_ICONS[mod.status] || FiCheckCircle;
                const hColor = getHealthColor(mod.health);
                return (
                  <tr
                    key={mod.id}
                    style={{ borderBottom: `1px solid ${C.border}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.hoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <input type="checkbox" checked={selectedModules.has(mod.id)} onChange={() => toggleSelect(mod.id)} style={s.checkbox} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={s.iconBadge(mod.status)}>{mod.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: C.pageText, fontSize: 14 }}>{mod.name}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{mod.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={s.statusBadge(mod.status)}>
                        <StatusIcon size={10} />
                        {mod.status}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 12, color: C.muted }}>{mod.version}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: C.text, fontWeight: 500 }}>{mod.users.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', color: C.text, fontWeight: 500 }}>{mod.tenants}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: C.text, fontWeight: 600 }}>{formatCurrency(mod.revenue)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <div style={{ width: 50, height: 5, borderRadius: 10, background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 10, background: hColor, width: `${Math.max(mod.health, 2)}%` }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: hColor, minWidth: 30 }}>{mod.health}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', position: 'relative' }}>
                      <button
                        style={s.moreBtn}
                        onClick={(e) => handleDropdownClick(e, mod.id)}
                        onMouseEnter={e => { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.color = C.text; }}
                        onMouseLeave={e => { if (openDropdownId !== mod.id) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = C.muted; }}}
                      >
                        <FiMoreVertical size={15} />
                      </button>
                      <div style={s.dropdown(openDropdownId === mod.id)} onClick={e => e.stopPropagation()}>
                        {dropdownGroups.map((group, gi) => (
                          <React.Fragment key={group.label}>
                            {gi > 0 && <div style={s.dropdownDivider} />}
                            {group.items.map(item => {
                              const Icon = item.icon;
                              return (
                                <button 
                                  key={item.text}
                                  style={s.dropdownItem}
                                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    if (item.text === 'Enable Module') handleStatusChange(mod.id, 'ACTIVE');
                                    else if (item.text === 'Disable Module') handleStatusChange(mod.id, 'DISABLED');
                                    else if (item.text === 'Move To Sandbox') handleStatusChange(mod.id, 'SANDBOX');
                                    else if (item.text === 'Move To Beta') handleStatusChange(mod.id, 'BETA');
                                    else if (item.text === 'Archive Module') handleStatusChange(mod.id, 'ARCHIVED');
                                    else if (item.text === 'Clone Module') {
                                      setCloneForm({ name: `${mod.name}-copy`, version: 'v1.0.0' });
                                      setActiveModal({ type: 'clone', module: mod });
                                    }
                                    else if (item.text === 'Upgrade Version') {
                                      setUpgradeVersionVal('');
                                      setActiveModal({ type: 'upgrade', module: mod });
                                    }
                                    else if (item.text === 'Rollback Version') {
                                      setActiveModal({ type: 'rollback', module: mod });
                                    }
                                    else if (item.text === 'View Usage') {
                                      setActiveModal({ type: 'usage', module: mod });
                                    }
                                    else if (item.text === 'View Dependencies') {
                                      setActiveModal({ type: 'dependencies', module: mod });
                                    }
                                    else if (item.text === 'View Analytics') {
                                      setActiveModal({ type: 'analytics', module: mod });
                                    }
                                  }}
                                >
                                  <Icon size={15} style={{ color: item.color, flexShrink: 0 }} />
                                  {item.text}
                                </button>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filteredModules.length > 0 && (
        <div style={s.bulkBar}>
          <div style={s.bulkLeft}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={allFilteredSelected}
                ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                onChange={toggleSelectAll}
                style={s.checkbox}
              />
              <span style={s.selectLabel}>Select All</span>
            </label>
            {selectedModules.size > 0 && (
              <span style={s.selectedCount}>{selectedModules.size} module{selectedModules.size > 1 ? 's' : ''} selected</span>
            )}
          </div>
          <div style={s.bulkRight}>
            <button
              style={s.bulkBtn('#059669', 'white')}
              onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
            >
              <FiCheckCircle size={13} /> Enable Selected
            </button>
            <button
              style={s.bulkBtn('#dc2626', 'white')}
              onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#dc2626'; }}
            >
              <FiXCircle size={13} /> Disable Selected
            </button>
            <button
              style={s.bulkBtn('#64748b', 'white')}
              onMouseEnter={e => { e.currentTarget.style.background = '#475569'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#64748b'; }}
            >
              <FiArchive size={13} /> Archive Selected
            </button>
            <button
              style={s.bulkBtn(C.inputBg, '#dc2626', '1px solid #dc2626')}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(220,38,38,0.15)' : '#fef2f2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.inputBg; }}
            >
              <FiTrash2 size={13} /> Delete Selected
            </button>
          </div>
        </div>
      )}
        </>
      )}

      {/* Modern Interactive Modal System */}
      {activeModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3 animate-fade-in" style={{ zIndex: 2000, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden w-100 animate-slide-up" style={{ maxWidth: '640px', background: isDark ? '#1e293b' : '#ffffff', color: isDark ? '#f1f5f9' : undefined }}>
            <div className={`card-header p-4 d-flex justify-content-between align-items-center border-0 border-bottom ${isDark ? 'bg-dark-card' : 'bg-light'}`} style={isDark ? { backgroundColor: 'rgba(30,41,59,0.85)' } : undefined}>
              <div>
                <h5 className={`fw-bold mb-0 ${isDark ? 'text-light' : 'text-dark'}`}>{activeModal.module.name} &mdash; {activeModal.type.charAt(0).toUpperCase() + activeModal.type.slice(1)}</h5>
                <p className="text-muted small mb-0">{activeModal.module.fullName} ({activeModal.module.version})</p>
              </div>
              <button className="btn-close border-0 bg-transparent text-muted fs-4" onClick={() => { if (!isActionRunning) setActiveModal(null); }} style={{ cursor: 'pointer' }} disabled={isActionRunning}>&times;</button>
            </div>

            <div className="card-body p-4">
              
              {/* ANALYTICS MODAL */}
              {activeModal.type === 'analytics' && (
                <div>
                  <div className="row g-3 mb-4 text-center">
                    <div className="col-4">
                      <div className={`p-3 rounded-3 border ${isDark ? 'bg-dark-card' : 'bg-light'}`}>
                        <div className="text-muted small fw-semibold">API Hits (24h)</div>
                        <h4 className="fw-bold mb-0 mt-1 text-primary">{(activeModal.module.users * 12).toLocaleString()}</h4>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className={`p-3 rounded-3 border ${isDark ? 'bg-dark-card' : 'bg-light'}`}>
                        <div className="text-muted small fw-semibold">Average Latency</div>
                        <h4 className="fw-bold mb-0 mt-1 text-success">32ms</h4>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className={`p-3 rounded-3 border ${isDark ? 'bg-dark-card' : 'bg-light'}`}>
                        <div className="text-muted small fw-semibold">Error Rate</div>
                        <h4 className="fw-bold mb-0 mt-1 text-danger">0.03%</h4>
                      </div>
                    </div>
                  </div>

                  <h6 className={`fw-bold mb-3 ${isDark ? 'text-light-emphasis' : 'text-dark-emphasis'}`}>Traffic Volumetrics Trend</h6>
                  <div style={{ height: '220px' }}>
                    <Line
                      data={{
                        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                        datasets: [
                          {
                            label: 'Requests/min',
                            data: [65, 59, 80, 81, 56, 95],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            fill: true,
                            tension: 0.4,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* USAGE MODAL */}
              {activeModal.type === 'usage' && (
                <div>
                  <div className="row align-items-center mb-4">
                    <div className="col-md-5 text-center">
                      <div style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                        <Doughnut
                          data={{
                            labels: ['Enterprise', 'Standard', 'Trial'],
                            datasets: [{
                              data: [60, 25, 15],
                              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
                              borderWidth: 0,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <h6 className="fw-bold mb-2">License Split</h6>
                      <div className="d-flex align-items-center justify-content-between small py-1.5 border-bottom">
                        <span><span className="badge rounded-circle bg-success p-1.5 me-2"></span>Enterprise Tenants</span>
                        <span className="fw-bold">{Math.round(activeModal.module.tenants * 0.6)}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between small py-1.5 border-bottom">
                        <span><span className="badge rounded-circle bg-primary p-1.5 me-2"></span>Standard Tenants</span>
                        <span className="fw-bold">{Math.round(activeModal.module.tenants * 0.3) || 1}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between small py-1.5 border-bottom">
                        <span><span className="badge rounded-circle bg-warning p-1.5 me-2"></span>Trial Accounts</span>
                        <span className="fw-bold">{Math.round(activeModal.module.tenants * 0.1) || 0}</span>
                      </div>
                    </div>
                  </div>

                  <h6 className="fw-bold mb-2">Active Tenants List</h6>
                  <div className="list-group rounded-3 border overflow-auto" style={{ maxHeight: '150px', background: isDark ? '#1e293b' : undefined }}>
                    <div className="list-group-item d-flex justify-content-between align-items-center py-2">
                      <span className={`small fw-semibold ${isDark ? 'text-light' : 'text-dark-emphasis'}`}>Stark Industries</span>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Active</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center py-2">
                      <span className={`small fw-semibold ${isDark ? 'text-light' : 'text-dark-emphasis'}`}>Acme Corporation</span>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Active</span>
                    </div>
                    <div className="list-group-item d-flex justify-content-between align-items-center py-2">
                      <span className={`small fw-semibold ${isDark ? 'text-light' : 'text-dark-emphasis'}`}>Global Tech Solutions</span>
                      <span className="badge bg-success bg-opacity-10 text-success rounded-pill">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DEPENDENCIES MODAL */}
              {activeModal.type === 'dependencies' && (
                <div>
                  <h6 className="fw-bold mb-3">Module Infrastructure Pipeline</h6>
                  <div className={`d-flex align-items-center justify-content-center gap-2 py-4 rounded-4 border mb-4 flex-wrap ${isDark ? 'bg-dark-card' : 'bg-light'}`}>
                    <span className="badge bg-dark px-3 py-2 text-white border rounded">Global Core</span>
                    <span className="text-muted fw-bold">&rarr;</span>
                    <span className="badge bg-primary px-3 py-2 text-white border rounded">Auth Engine</span>
                    <span className="text-muted fw-bold">&rarr;</span>
                    <span className="badge bg-success px-3 py-2 text-white border rounded">{activeModal.module.name} Module</span>
                    {activeModal.module.deps > 4 && (
                      <>
                        <span className="text-muted fw-bold">&rarr;</span>
                        <span className="badge bg-secondary px-3 py-2 text-white border rounded">Analytics Gateway</span>
                      </>
                    )}
                  </div>

                  <h6 className="fw-bold mb-2">Dependencies Mapped ({activeModal.module.deps})</h6>
                  <div className="row g-2">
                    {['core_db_migration', 'role_access_rules', 'auth_sanctum_hooks', 'audit_logger'].map((dep, idx) => (
                      <div className="col-md-6" key={idx}>
                        <div className={`p-2 border rounded-3 d-flex align-items-center gap-2 ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                          <FiSliders className="text-muted flex-shrink-0" size={13} />
                          <code className="small text-muted text-truncate d-block">{dep}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* UPGRADE VERSION MODAL */}
              {activeModal.type === 'upgrade' && (
                <div>
                  {!isActionRunning && actionLogs.length === 0 ? (
                    <div>
                      <p className="text-muted small">You are about to launch a system-wide upgrade for module <strong>{activeModal.module.name}</strong>. This runs schema migrations, locks databases during execution, and clears cached settings.</p>
                      
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-muted uppercase">Target Version</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. 3.3.0"
                          style={isDark ? { background: C.inputBg, borderColor: C.strongBorder, color: C.pageText } : undefined}
                          value={upgradeVersionVal}
                          onChange={(e) => setUpgradeVersionVal(e.target.value)}
                        />
                        <span className="form-text text-muted x-small">Current version is {activeModal.module.version}</span>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button className={`btn ${isDark ? 'btn-secondary' : 'btn-light'} rounded-pill px-3 py-2 fw-semibold border`} onClick={() => setActiveModal(null)} style={{ fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                        <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold border-0 text-white" onClick={() => triggerUpgradeSimulation(activeModal.module)} style={{ fontSize: '13px', cursor: 'pointer' }}>Start Upgrade Sequence</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Interactive Upgrade Console */}
                      <div className="p-3 bg-dark rounded-3 font-monospace mb-3 overflow-auto border text-success" style={{ height: '200px', fontSize: '11px', background: '#090d16' }}>
                        {actionLogs.map((log, idx) => (
                          <div key={idx} className="mb-1.5">
                            <span className="text-muted select-none">&gt;&nbsp;</span>{log}
                          </div>
                        ))}
                        {isActionRunning && (
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <span className="spinner-border spinner-border-sm text-success" role="status"></span>
                            <span className="animate-pulse">Processing schema updates...</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1 text-muted small">
                          <span>Upgrade Process</span>
                          <span className={`fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>{actionProgress}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${actionProgress}%`, transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>

                      {!isActionRunning && (
                        <div className="d-flex justify-content-end mt-4">
                          <button className="btn btn-dark rounded-pill px-4 py-2 fw-bold text-white border-0" onClick={() => setActiveModal(null)} style={{ fontSize: '13px', cursor: 'pointer' }}>Finish</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ROLLBACK VERSION MODAL */}
              {activeModal.type === 'rollback' && (
                <div>
                  {!isActionRunning && actionLogs.length === 0 ? (
                    <div>
                      <p className="text-muted small">Are you sure you want to rollback <strong>{activeModal.module.name}</strong> to the default baseline version (<strong>v1.0.0</strong>)? This operation cannot be easily undone and active sessions might drop.</p>
                      
                      <div className="d-flex justify-content-end gap-2 mt-4">
                        <button className={`btn ${isDark ? 'btn-secondary' : 'btn-light'} rounded-pill px-3 py-2 fw-semibold border`} onClick={() => setActiveModal(null)} style={{ fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                        <button className="btn btn-danger rounded-pill px-4 py-2 fw-bold text-white border-0 bg-danger" onClick={() => triggerRollbackSimulation(activeModal.module)} style={{ fontSize: '13px', cursor: 'pointer' }}>Confirm Rollback</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Interactive Console */}
                      <div className="p-3 bg-dark rounded-3 font-monospace mb-3 overflow-auto border text-warning" style={{ height: '180px', fontSize: '11px', background: '#090d16' }}>
                        {actionLogs.map((log, idx) => (
                          <div key={idx} className="mb-1.5">
                            <span className="text-muted select-none">&gt;&nbsp;</span>{log}
                          </div>
                        ))}
                        {isActionRunning && (
                          <div className="d-flex align-items-center gap-2 mt-2">
                            <span className="spinner-border spinner-border-sm text-warning" role="status"></span>
                            <span className="animate-pulse">Restoring schema snapshot...</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1 text-muted small">
                          <span>Rollback Progress</span>
                          <span className={`fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>{actionProgress}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${actionProgress}%`, transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>

                      {!isActionRunning && (
                        <div className="d-flex justify-content-end mt-4">
                          <button className="btn btn-dark rounded-pill px-4 py-2 fw-bold text-white border-0" onClick={() => setActiveModal(null)} style={{ fontSize: '13px', cursor: 'pointer' }}>Finish</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CLONE MODULE MODAL */}
              {activeModal.type === 'clone' && (
                <div>
                  {!isActionRunning && actionLogs.length === 0 ? (
                    <div>
                      <p className="text-muted small">Clone the rules and permission architecture of <strong>{activeModal.module.name}</strong> to register a new isolated utility workspace.</p>
                      
                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted uppercase">Clone Module Name</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. PMS-BACKUP"
                          style={isDark ? { background: C.inputBg, borderColor: C.strongBorder, color: C.pageText } : undefined}
                          value={cloneForm.name}
                          onChange={(e) => setCloneForm({ ...cloneForm, name: e.target.value })}
                        />
                      </div>
                      <div className="mb-4">
                        <label className="form-label small fw-bold text-muted uppercase">Initial Version</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="v1.0.0"
                          style={isDark ? { background: C.inputBg, borderColor: C.strongBorder, color: C.pageText } : undefined}
                          value={cloneForm.version}
                          onChange={(e) => setCloneForm({ ...cloneForm, version: e.target.value })}
                        />
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        <button className={`btn ${isDark ? 'btn-secondary' : 'btn-light'} rounded-pill px-3 py-2 fw-semibold border`} onClick={() => setActiveModal(null)} style={{ fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                        <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-white border-0" onClick={() => triggerCloneSimulation(activeModal.module)} style={{ fontSize: '13px', cursor: 'pointer' }}>Start Cloning</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="p-3 bg-dark rounded-3 font-monospace mb-3 overflow-auto border text-info" style={{ height: '180px', fontSize: '11px', background: '#090d16' }}>
                        {actionLogs.map((log, idx) => (
                          <div key={idx} className="mb-1.5">
                            <span className="text-muted select-none">&gt;&nbsp;</span>{log}
                          </div>
                        ))}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1 text-muted small">
                          <span>Cloning Progress</span>
                          <span className={`fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>{actionProgress}%</span>
                        </div>
                        <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                          <div className="progress-bar bg-info" style={{ width: `${actionProgress}%`, transition: 'width 0.3s ease' }}></div>
                        </div>
                      </div>

                      {!isActionRunning && (
                        <div className="d-flex justify-content-end mt-4">
                          <button className="btn btn-dark rounded-pill px-4 py-2 fw-bold text-white border-0" onClick={() => setActiveModal(null)} style={{ fontSize: '13px', cursor: 'pointer' }}>Finish</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .animate-fade-in {
          animation: modal-fade-in 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: modal-slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse {
          animation: pulse-terminal 1.5s infinite;
        }
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-terminal {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .bg-dark-card {
          background-color: rgba(30,41,59,0.85);
          color: #f1f5f9;
        }
      `}} />
    </div>
  );
};

export default ModuleManagement;
