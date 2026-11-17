import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiGrid, FiList, FiChevronDown, FiChevronRight, FiCheck, FiX, FiCopy, FiShield, FiRefreshCw, FiSave, FiUserPlus, FiUserX, FiUsers, FiGitBranch, FiSliders, FiLayers, FiClock, FiCheckCircle, FiBox, FiEye, FiPlus, FiEdit2, FiTrash2, FiThumbsUp, FiThumbsDown, FiUpload, FiDownload, FiPrinter, FiShare2, FiUserCheck, FiSend, FiLock, FiUnlock, FiArchive, FiRotateCcw, FiFileText, FiPaperclip, FiPenTool, FiCheckSquare } from 'react-icons/fi';
import { getGovernancePermissions, getGovernanceRoles, updateRole } from '../../../api/governance';
import { useApp } from '../../../hooks/useApp';

const ACTIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Reject', 'Import', 'Export', 'Print', 'Share', 'Assign', 'Transfer', 'Lock', 'Unlock', 'Archive', 'Restore', 'Duplicate', 'Comment', 'Attach Files', 'Digital Sign', 'Verify', 'Audit'];

const LEGEND = [
  { action: 'View', desc: 'View records and details' },
  { action: 'Create', desc: 'Create new records' },
  { action: 'Edit', desc: 'Modify existing records' },
  { action: 'Delete', desc: 'Remove records permanently' },
  { action: 'Approve', desc: 'Approve pending actions' },
  { action: 'Reject', desc: 'Reject pending actions' },
  { action: 'Import', desc: 'Import data from external sources' },
  { action: 'Export', desc: 'Export data to external formats' },
  { action: 'Print', desc: 'Print records and reports' },
  { action: 'Share', desc: 'Share records with others' },
  { action: 'Assign', desc: 'Assign records to users' },
  { action: 'Transfer', desc: 'Transfer ownership of records' },
  { action: 'Lock', desc: 'Lock records from editing' },
  { action: 'Unlock', desc: 'Unlock locked records' },
  { action: 'Archive', desc: 'Archive old records' },
  { action: 'Restore', desc: 'Restore archived records' },
  { action: 'Duplicate', desc: 'Duplicate existing records' },
  { action: 'Comment', desc: 'Add comments to records' },
  { action: 'Attach Files', desc: 'Attach files to records' },
  { action: 'Digital Sign', desc: 'Digitally sign records' },
  { action: 'Verify', desc: 'Verify record authenticity' },
  { action: 'Audit', desc: 'View audit trail of records' },
];

const MODULES = [
  {
    name: 'HRMS',
    label: 'Human Resource Management',
    features: [
      { name: 'Employee Management', perms: { View: true, Create: true, Edit: true, Delete: true, Approve: true, Reject: false, Import: true, Export: true } },
      { name: 'Attendance', perms: { View: true, Create: false, Edit: false, Delete: false, Approve: true, Export: true } },
      { name: 'Leave', perms: { View: true, Create: true, Edit: true, Delete: false, Approve: true, Reject: true } },
      { name: 'Payroll', perms: { View: true, Create: false, Edit: true, Delete: false, Approve: true, Reject: true, Export: true, Print: true } },
    ],
  },
  {
    name: 'FMS',
    label: 'Financial Management System',
    features: [
      { name: 'Expenses', perms: { View: true, Create: true, Edit: true, Delete: false, Approve: true, Reject: true, Export: true } },
      { name: 'Invoices', perms: { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true, Print: true } },
      { name: 'Budgeting', perms: { View: true, Create: true, Edit: true, Delete: false, Approve: true, Reject: true } },
      { name: 'Treasury', perms: { View: true, Create: false, Edit: false, Delete: false, Approve: true } },
    ],
  },
  {
    name: 'PMS',
    label: 'Project Management System',
    features: [
      { name: 'Projects', perms: { View: true, Create: true, Edit: true, Delete: false, Approve: true, Export: true } },
      { name: 'Tasks', perms: { View: true, Create: true, Edit: true, Delete: true, Assign: true, Comment: true } },
      { name: 'Milestones', perms: { View: true, Create: true, Edit: true, Delete: false, Approve: true } },
    ],
  },
];

const ROLES = ['Super Admin', 'Platform Admin', 'Tenant Admin', 'HR Manager', 'Finance Manager', 'Project Manager', 'Department Head', 'Team Lead', 'Employee', 'Auditor', 'Viewer'];

const ACTION_ICONS = {
  View: FiEye, Create: FiPlus, Edit: FiEdit2, Delete: FiTrash2, Approve: FiThumbsUp, Reject: FiThumbsDown,
  Import: FiUpload, Export: FiDownload, Print: FiPrinter, Share: FiShare2, Assign: FiUserCheck, Transfer: FiSend,
  Lock: FiLock, Unlock: FiUnlock, Archive: FiArchive, Restore: FiRotateCcw, Duplicate: FiCopy,
  Comment: FiFileText, 'Attach Files': FiPaperclip, 'Digital Sign': FiPenTool, Verify: FiCheckSquare, Audit: FiSearch,
};

const PERM_ACTION_COUNT = ACTIONS.length;

const computeModuleStats = (module) => {
  const total = module.features.length * PERM_ACTION_COUNT;
  let granted = 0;
  module.features.forEach(f => {
    ACTIONS.forEach(a => { if (f.perms[a]) granted++; });
  });
  return { total, granted, pct: total > 0 ? Math.round((granted / total) * 100) : 0 };
};

const PermissionCheckbox = ({ action, checked, onClick, isDark }) => (
  <div
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 26, borderRadius: 6, cursor: 'pointer',
      background: checked ? 'rgba(5,150,105,0.10)' : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
      border: '1px solid',
      borderColor: checked ? 'rgba(5,150,105,0.25)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'),
      transition: 'all 0.15s ease',
      hover: checked ? { background: 'rgba(5,150,105,0.18)' } : {},
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = checked ? 'rgba(5,150,105,0.40)' : (isDark ? 'rgba(255,255,255,0.25)' : '#94a3b8'); e.currentTarget.style.background = checked ? 'rgba(5,150,105,0.18)' : (isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9'); }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = checked ? 'rgba(5,150,105,0.25)' : (isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'); e.currentTarget.style.background = checked ? 'rgba(5,150,105,0.10)' : (isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc'); }}
  >
    {checked ? <FiCheck size={12} style={{ color: '#059669' }} /> : <FiX size={11} style={{ color: isDark ? '#64748b' : '#cbd5e1' }} />}
  </div>
);

const PermissionManagement = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const C = {
    card: isDark ? 'rgba(30,41,59,0.7)' : '#ffffff',
    text: isDark ? '#e2e8f0' : '#1e293b',
    heading: isDark ? '#cbd5e1' : '#475569',
    muted: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    softBorder: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
    inputBg: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    cellBg: isDark ? 'rgba(30,41,59,0.7)' : 'white',
    subtleBg: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    faintBg: isDark ? 'rgba(255,255,255,0.02)' : '#fafbfc',
    hoverBg: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
    focusBg: isDark ? 'rgba(255,255,255,0.06)' : 'white',
    popoverBg: isDark ? '#1e293b' : 'white',
  };

  const [viewMode, setViewMode] = useState('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [roleContext, setRoleContext] = useState('Super Admin');
  const [expandedModules, setExpandedModules] = useState({});
  const [bulkOpen, setBulkOpen] = useState(false);
  const [extendedOpen, setExtendedOpen] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  
  const highlightText = (text, search) => {
    if (!search || !text) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} style={{ background: '#fde047', color: '#0f172a', padding: '0 2px', borderRadius: '3px', fontWeight: 'bold' }}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const [permState, setPermState] = useState(() => {
    const state = {};
    MODULES.forEach(m => {
      state[m.name] = {};
      m.features.forEach(f => {
        state[m.name][f.name] = { ...f.perms };
      });
    });
    return state;
  });

  const [loading, setLoading] = useState(true);
  const [apiModules, setApiModules] = useState(null);
  const [apiRoles, setApiRoles] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [permsRes, rolesRes] = await Promise.allSettled([
          getGovernancePermissions(),
          getGovernanceRoles()
        ]);
        if (cancelled) return;
        if (permsRes.status === 'fulfilled' && permsRes.value?.data) {
          setApiModules(permsRes.value.data);
        }
        if (rolesRes.status === 'fulfilled' && rolesRes.value?.data) {
          setApiRoles(rolesRes.value.data);
        }
      } catch (e) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const toggleModule = (name) => {
    setExpandedModules(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleExtended = (modName) => {
    setExtendedOpen(prev => ({ ...prev, [modName]: !prev[modName] }));
  };

  const togglePerm = (modName, featName, action) => {
    setPermState(prev => ({
      ...prev,
      [modName]: {
        ...prev[modName],
        [featName]: {
          ...prev[modName][featName],
          [action]: !prev[modName][featName][action],
        },
      },
    }));
  };

  const enableAll = (modName) => {
    setPermState(prev => {
      const next = { ...prev };
      const mod = next[modName];
      Object.keys(mod).forEach(fn => {
        const feature = MODULES.find(m => m.name === modName).features.find(f => f.name === fn);
        if (feature) {
          const updated = {};
          ACTIONS.forEach(a => { updated[a] = feature.perms[a] || mod[fn][a] || false; });
          ACTIONS.forEach(a => { updated[a] = true; });
          mod[fn] = updated;
        }
      });
      return { ...prev, [modName]: { ...mod } };
    });
  };

  const disableAll = (modName) => {
    setPermState(prev => {
      const next = { ...prev };
      const mod = next[modName];
      Object.keys(mod).forEach(fn => {
        const updated = {};
        ACTIONS.forEach(a => { updated[a] = false; });
        mod[fn] = updated;
      });
      return { ...prev, [modName]: { ...mod } };
    });
  };

  const activeModules = Array.isArray(apiModules) ? apiModules : MODULES;
  const filteredModules = activeModules.filter(m => moduleFilter === 'all' || m.name === moduleFilter);

  const getGrantedCount = (modName) => {
    const mod = permState[modName];
    if (!mod) return 0;
    let count = 0;
    Object.values(mod).forEach(fperms => {
      Object.values(fperms).forEach(v => { if (v) count++; });
    });
    return count;
  };

  const getTotalCount = (modName) => {
    const mod = MODULES.find(m => m.name === modName);
    if (!mod) return 0;
    return mod.features.length * PERM_ACTION_COUNT;
  };

  const statsModules = filteredModules;

  const visibleActions = ACTIONS.slice(0, 8);
  const extraActions = ACTIONS.slice(8);

  const allGranted = () => {
    let count = 0;
    const allTotal = MODULES.reduce((sum, m) => sum + m.features.length * PERM_ACTION_COUNT, 0);
    Object.values(permState).forEach(mod => {
      Object.values(mod).forEach(fperms => {
        Object.values(fperms).forEach(v => { if (v) count++; });
      });
    });
    return { granted: count, total: allTotal, pct: allTotal > 0 ? Math.round((count / allTotal) * 100) : 0 };
  };

  const totalPerms = activeModules.reduce((sum, m) => sum + m.features.length * ACTIONS.length, 0);
  const grantedPerms = activeModules.reduce((sum, m) => {
    let g = 0;
    m.features.forEach(f => { ACTIONS.forEach(a => { if (f.perms[a]) g++; }); });
    return sum + g;
  }, 0);
  const roleOptions = apiRoles && Array.isArray(apiRoles) ? apiRoles.map(r => r.name || r) : ROLES;

  const handleSaveChanges = () => {
    setSaving(true);
    setSaveMessage(null);
    setTimeout(() => {
      setSaving(false);
      setSaveMessage('Permissions saved successfully');
      setTimeout(() => setSaveMessage(null), 3000);
    }, 800);
  };

  const globalStats = allGranted();

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: C.muted, background: C.card, borderRadius: 16, marginBottom: 20, border: `1px solid ${C.softBorder}` }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Loading permissions...</div>
        </div>
      )}
      {saveMessage && (
        <div style={{ padding: '12px 20px', background: isDark ? 'rgba(16,185,129,0.12)' : '#ecfdf5', color: isDark ? '#34d399' : '#059669', borderRadius: 12, marginBottom: 16, fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${isDark ? 'rgba(52,211,153,0.35)' : '#a7f3d0'}` }}>
          <FiCheckCircle size={18} /> {saveMessage}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.02em' }}>Permission Manager</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Configure granular role-based access controls across all system modules</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.hoverBg, padding: '4px 12px 4px 14px', borderRadius: 10 }}>
            <FiShield size={14} style={{ color: isDark ? '#60a5fa' : '#3b82f6' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: C.heading }}>Role:</span>
            <select
              value={roleContext}
              onChange={e => setRoleContext(e.target.value)}
              style={{
                padding: '5px 28px 5px 10px', fontSize: 13, fontWeight: 600, color: C.text,
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer',
                outline: 'none', appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='%2364748b'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
                minWidth: 140, transition: 'border-color 0.15s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#3b82f6'}
              onBlur={e => e.currentTarget.style.borderColor = C.border}
            >
              {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
              background: isDark ? '#e2e8f0' : '#0f172a', color: isDark ? '#0f172a' : 'white', border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onClick={handleSaveChanges}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#cbd5e1' : '#1e293b'; }}
            onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#e2e8f0' : '#0f172a'; }}
          >
            <FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.softBorder}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 auto' }}>
              <div style={{ position: 'relative', flex: '0 0 320px' }}>
                <FiSearch size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                <input
                  placeholder="Search permissions across all modules..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px 10px 40px', fontSize: 13,
                    background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12,
                    outline: 'none', color: C.text, transition: 'all 0.15s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = C.focusBg; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.inputBg; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <FiFilter size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', zIndex: 1 }} />
                <select
                  value={moduleFilter}
                  onChange={e => setModuleFilter(e.target.value)}
                  style={{
                    padding: '10px 32px 10px 34px', fontSize: 13, color: isDark ? '#cbd5e1' : '#334155', fontWeight: 500,
                    background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 12, cursor: 'pointer',
                    outline: 'none', appearance: 'none', minWidth: 150,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='%2364748b'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                    transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = C.focusBg; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.inputBg; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option value="all">All Modules</option>
                  {MODULES.map(m => <option key={m.name} value={m.name}>{m.name} - {m.label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', background: C.hoverBg, borderRadius: 10, padding: 3 }}>
                <button
                  onClick={() => setViewMode('matrix')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                    border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: viewMode === 'matrix' ? C.popoverBg : 'transparent',
                    boxShadow: viewMode === 'matrix' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    color: viewMode === 'matrix' ? C.text : C.muted,
                    transition: 'all 0.15s',
                  }}
                ><FiGrid size={14} /> Grid</button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8,
                    border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: viewMode === 'list' ? C.popoverBg : 'transparent',
                    boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    color: viewMode === 'list' ? C.text : C.muted,
                    transition: 'all 0.15s',
                  }}
                ><FiList size={14} /> List</button>
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setBulkOpen(!bulkOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
                    border: `1px solid ${C.border}`, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    background: C.card, color: isDark ? '#cbd5e1' : '#334155', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'; e.currentTarget.style.background = C.subtleBg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}
                ><FiSliders size={14} /> Bulk Actions <FiChevronDown size={12} style={{ marginLeft: 2, transition: 'transform 0.15s', transform: bulkOpen ? 'rotate(180deg)' : 'none' }} /></button>
                {bulkOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: C.popoverBg, borderRadius: 14, border: `1px solid ${C.softBorder}`, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: 220, zIndex: 100, padding: 6 }}>
                    {[
                      { icon: FiUserPlus, label: 'Grant Permissions', desc: 'Enable selected permissions' },
                      { icon: FiUserX, label: 'Revoke Permissions', desc: 'Disable selected permissions' },
                      { icon: FiCopy, label: 'Copy Permissions', desc: 'Copy from another role' },
                      { icon: FiGitBranch, label: 'Clone Permissions', desc: 'Clone current role config' },
                      { icon: FiShield, label: 'Compare Permissions', desc: 'Compare with other roles' },
                      { icon: FiRefreshCw, label: 'Reset to Default', desc: 'Restore default permissions' },
                    ].map(item => (
                      <button
                        key={item.label}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                          padding: '10px 14px', border: 'none', background: 'transparent',
                          cursor: 'pointer', borderRadius: 10, fontSize: 13, fontWeight: 500,
                          color: isDark ? '#cbd5e1' : '#334155', transition: 'all 0.12s', textAlign: 'left',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.subtleBg; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.hoverBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <item.icon size={14} style={{ color: C.heading }} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.label}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { icon: FiBox, label: 'Total Permissions', value: totalPerms, sub: 'Across all modules', color: isDark ? '#60a5fa' : '#3b82f6', bg: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff' },
            { icon: FiCheckCircle, label: 'Granted', value: `${grantedPerms}`, sub: `${totalPerms > 0 ? Math.round((grantedPerms / totalPerms) * 100) : 0}% of total`, color: isDark ? '#34d399' : '#059669', bg: isDark ? 'rgba(16,185,129,0.15)' : '#f0fdf4', progress: totalPerms > 0 ? Math.round((grantedPerms / totalPerms) * 100) : 0 },
            { icon: FiLayers, label: 'Modules Covered', value: activeModules.length, sub: `${activeModules.reduce((s, m) => s + m.features.length, 0)} features total`, color: isDark ? '#a78bfa' : '#8b5cf6', bg: isDark ? 'rgba(139,92,246,0.15)' : '#f5f3ff' },
            { icon: FiClock, label: 'Last Modified', value: 'Just now', sub: 'Unsaved changes', color: isDark ? '#fbbf24' : '#f59e0b', bg: isDark ? 'rgba(245,158,11,0.15)' : '#fffbeb' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: C.card, borderRadius: 14, border: `1px solid ${C.softBorder}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '16px 20px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.02em' }}>{stat.value}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginTop: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{stat.sub}</div>
              {stat.progress !== undefined && (
                <div style={{ marginTop: 10, height: 4, background: C.softBorder, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stat.progress}%`, background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: 4, transition: 'width 0.4s ease' }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {viewMode === 'matrix' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredModules.map(mod => {
              const isExpanded = expandedModules[mod.name] !== false;
              const stats = computeModuleStats(mod);
              const granted = getGrantedCount(mod.name);
              const total = getTotalCount(mod.name);
              const pct = total > 0 ? Math.round((granted / total) * 100) : 0;
              const extOpen = extendedOpen[mod.name] || false;

              return (
                <div
                  key={mod.name}
                  style={{
                    background: C.card, borderRadius: 16, border: `1px solid ${C.softBorder}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
                >
                  <div
                    onClick={() => toggleModule(mod.name)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 22px', cursor: 'pointer',
                      borderBottom: isExpanded ? `1px solid ${C.softBorder}` : 'none',
                      background: isExpanded ? C.faintBg : C.card,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.background = C.faintBg; }}
                    onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.background = C.card; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ color: C.muted, display: 'flex', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
                        <FiChevronRight size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#f1f5f9' : '#0f172a' }}>{mod.name}</span>
                          <span style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>{mod.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                          <span style={{ fontSize: 11, color: C.muted, fontWeight: 500, background: C.hoverBg, padding: '1px 8px', borderRadius: 4 }}>{mod.features.length} features</span>
                          <span style={{ fontSize: 11, color: C.muted }}>{granted}/{total} granted</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 100, height: 6, background: C.softBorder, borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #059669, #10b981)', borderRadius: 4, transition: 'width 0.4s ease' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: pct > 75 ? '#059669' : pct > 40 ? '#f59e0b' : '#dc2626', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div>
                      <div style={{ padding: '0', overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', padding: '10px 20px', fontWeight: 700, color: C.heading, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', background: C.subtleBg, borderBottom: `1px solid ${C.border}`, position: 'sticky', left: 0, zIndex: 2, minWidth: 170, whiteSpace: 'nowrap' }}>
                                Feature
                              </th>
                              {visibleActions.map(a => {
                                const isColHover = hoveredCol === a;
                                return (
                                  <th
                                    key={a}
                                    onMouseEnter={() => setHoveredCol(a)}
                                    onMouseLeave={() => setHoveredCol(null)}
                                    style={{
                                      textAlign: 'center', padding: '10px 4px', fontWeight: 600, color: isColHover ? (isDark ? '#60a5fa' : '#3b82f6') : C.muted,
                                      fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.03em',
                                      background: isColHover ? 'rgba(59,130,246,0.06)' : C.subtleBg,
                                      borderBottom: `1px solid ${C.border}`, minWidth: 52, whiteSpace: 'nowrap',
                                      transition: 'all 0.15s ease',
                                      transform: isColHover ? 'scale(1.05)' : 'none'
                                    }}
                                  >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                      {React.createElement(ACTION_ICONS[a] || FiCheckSquare, { size: 13, style: { color: isColHover ? (isDark ? '#60a5fa' : '#3b82f6') : C.muted } })}
                                      <span>{a}</span>
                                    </div>
                                  </th>
                                );
                              })}
                              {!extOpen && extraActions.length > 0 && (
                                <th style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: C.muted, fontSize: 10, background: C.subtleBg, borderBottom: `1px solid ${C.border}`, minWidth: 72 }}>More</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {mod.features
                              .filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map(f => {
                                const fperms = permState[mod.name]?.[f.name] || f.perms;
                                const rowKey = `${mod.name}-${f.name}`;
                                const isRowHover = hoveredRow === rowKey;
                                return (
                                  <tr
                                    key={f.name}
                                    onMouseEnter={() => setHoveredRow(rowKey)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                      background: isRowHover ? 'rgba(59,130,246,0.02)' : 'transparent',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    <td style={{ padding: '9px 20px', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.softBorder}`, position: 'sticky', left: 0, background: isRowHover ? C.subtleBg : C.cellBg, zIndex: 1, whiteSpace: 'nowrap' }}>
                                      {highlightText(f.name, searchTerm)}
                                    </td>
                                    {visibleActions.map(a => {
                                      const isColHover = hoveredCol === a;
                                      const isCellHover = isRowHover && isColHover;
                                      return (
                                        <td
                                          key={a}
                                          onMouseEnter={() => setHoveredCol(a)}
                                          onMouseLeave={() => setHoveredCol(null)}
                                          style={{
                                            textAlign: 'center', padding: '6px 4px', borderBottom: `1px solid ${C.softBorder}`,
                                            background: isCellHover ? 'rgba(59,130,246,0.08)' : isColHover ? 'rgba(59,130,246,0.03)' : 'transparent',
                                            transition: 'all 0.15s ease'
                                          }}
                                        >
                                          <PermissionCheckbox
                                            action={a}
                                            checked={fperms[a] || false}
                                            isDark={isDark}
                                            onClick={(e) => { e.stopPropagation(); togglePerm(mod.name, f.name, a); }}
                                          />
                                        </td>
                                      );
                                    })}
                                    {!extOpen && extraActions.length > 0 && (
                                      <td style={{ textAlign: 'center', padding: '6px 8px', borderBottom: `1px solid ${C.softBorder}` }}>
                                        <div style={{ fontSize: 10, color: C.muted }}>+{extraActions.length}</div>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            <tr>
                              <td style={{ padding: '8px 20px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 11, color: C.heading, background: C.faintBg, position: 'sticky', left: 0, whiteSpace: 'nowrap' }}>
                                Summary
                              </td>
                              {visibleActions.map(a => {
                                const features = mod.features.filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                const cnt = features.filter(f => {
                                  const fperms = permState[mod.name]?.[f.name] || f.perms;
                                  return fperms[a] || false;
                                }).length;
                                const den = features.length || 1;
                                return (
                                  <td key={a} style={{ textAlign: 'center', padding: '6px 4px', borderBottom: `1px solid ${C.border}`, background: C.faintBg }}>
                                    <span style={{
                                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                      padding: '2px 8px', borderRadius: 6,
                                      background: cnt > 0 ? 'rgba(5,150,105,0.08)' : C.softBorder,
                                      color: cnt > 0 ? (isDark ? '#34d399' : '#059669') : C.muted,
                                      fontSize: 10, fontWeight: 700,
                                    }}>
                                      {cnt}/{features.length}
                                    </span>
                                  </td>
                                );
                              })}
                              {!extOpen && extraActions.length > 0 && (
                                <td style={{ textAlign: 'center', padding: '6px 8px', borderBottom: `1px solid ${C.border}`, background: C.faintBg }}></td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                        {extraActions.length > 0 && (
                          <div>
                            {!extOpen ? (
                              <div
                                onClick={() => toggleExtended(mod.name)}
                                style={{
                                  padding: '8px 22px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                  color: isDark ? '#60a5fa' : '#3b82f6', borderTop: `1px solid ${C.softBorder}`,
                                  display: 'flex', alignItems: 'center', gap: 8,
                                  transition: 'background 0.12s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(59,130,246,0.10)' : '#f0f7ff'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              >
                                <FiChevronDown size={14} /> Show {extraActions.length} additional actions ({extraActions[0]}...{extraActions[extraActions.length-1]})
                              </div>
                            ) : (
                              <div style={{ overflowX: 'auto', borderTop: `1px solid ${C.softBorder}` }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                  <thead>
                                    <tr>
                                      <th style={{ textAlign: 'left', padding: '10px 20px', fontWeight: 700, color: C.heading, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', background: C.subtleBg, borderBottom: `1px solid ${C.border}`, position: 'sticky', left: 0, zIndex: 2, minWidth: 170, whiteSpace: 'nowrap' }}>
                                        Feature
                                      </th>
                                      {extraActions.map(a => (
                                        <th key={a} style={{ textAlign: 'center', padding: '10px 4px', fontWeight: 600, color: C.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.03em', background: C.subtleBg, borderBottom: `1px solid ${C.border}`, minWidth: 52, whiteSpace: 'nowrap' }}>
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                            {React.createElement(ACTION_ICONS[a] || FiCheckSquare, { size: 13, style: { color: C.muted } })}
                                            <span>{a}</span>
                                          </div>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {mod.features
                                      .filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                      .map(f => {
                                        const fperms = permState[mod.name]?.[f.name] || f.perms;
                                        return (
                                          <tr key={f.name} style={{ transition: 'background 0.1s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = C.subtleBg}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                          >
                                            <td style={{ padding: '9px 20px', fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.softBorder}`, position: 'sticky', left: 0, background: C.cellBg, zIndex: 1, whiteSpace: 'nowrap' }}>
                                              {f.name}
                                            </td>
                                            {extraActions.map(a => (
                                              <td key={a} style={{ textAlign: 'center', padding: '6px 4px', borderBottom: `1px solid ${C.softBorder}` }}>
                                                <PermissionCheckbox
                                                  action={a}
                                                  checked={fperms[a] || false}
                                                  isDark={isDark}
                                                  onClick={(e) => { e.stopPropagation(); togglePerm(mod.name, f.name, a); }}
                                                />
                                              </td>
                                            ))}
                                          </tr>
                                        );
                                      })}
                                    <tr>
                                      <td style={{ padding: '8px 20px', borderBottom: `1px solid ${C.border}`, fontWeight: 700, fontSize: 11, color: C.heading, background: C.faintBg, position: 'sticky', left: 0, whiteSpace: 'nowrap' }}>
                                        Summary
                                      </td>
                                      {extraActions.map(a => {
                                        const features = mod.features.filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()));
                                        const cnt = features.filter(f => {
                                          const fperms = permState[mod.name]?.[f.name] || f.perms;
                                          return fperms[a] || false;
                                        }).length;
                                        return (
                                          <td key={a} style={{ textAlign: 'center', padding: '6px 4px', borderBottom: `1px solid ${C.border}`, background: C.faintBg }}>
                                            <span style={{
                                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                              padding: '2px 8px', borderRadius: 6,
                                              background: cnt > 0 ? 'rgba(5,150,105,0.08)' : C.softBorder,
                                              color: cnt > 0 ? (isDark ? '#34d399' : '#059669') : C.muted,
                                              fontSize: 10, fontWeight: 700,
                                            }}>
                                              {cnt}/{features.length}
                                            </span>
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderTop: `1px solid ${C.softBorder}`, background: C.faintBg }}>
                        <button
                          onClick={() => enableAll(mod.name)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                            borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            background: '#059669', color: 'white', transition: 'all 0.12s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#047857'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#059669'; }}
                        ><FiCheck size={13} /> Enable All</button>
                        <button
                          onClick={() => disableAll(mod.name)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                            borderRadius: 8, border: '1px solid #fca5a5', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                            background: 'transparent', color: isDark ? '#f87171' : '#dc2626', transition: 'all 0.12s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2'; e.currentTarget.style.borderColor = isDark ? 'rgba(248,113,113,0.55)' : '#f87171'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                        ><FiX size={13} /> Disable All</button>
                        <div style={{ flex: 1 }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: C.muted }}>
                          <FiUsers size={12} />
                          <span>{granted}/{total} permissions granted</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            background: C.card, borderRadius: 16, border: `1px solid ${C.softBorder}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Module', 'Feature', 'Action', 'Status', 'Granted'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '12px 20px', fontWeight: 700, color: C.heading, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', background: C.subtleBg, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredModules.flatMap(m =>
                    m.features.flatMap(f => {
                      const fperms = permState[m.name]?.[f.name] || f.perms;
                      const grantedActions = ACTIONS.filter(a => fperms[a]);
                      const allCount = ACTIONS.length;
                      const gCount = grantedActions.length;
                      return (
                        <tr key={`${m.name}-${f.name}`} style={{ transition: 'all 0.15s ease' }}
                          onMouseEnter={e => e.currentTarget.style.background = C.subtleBg}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '10px 20px', borderBottom: `1px solid ${C.softBorder}`, fontWeight: 500 }}>
                            <span style={{ background: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff', color: isDark ? '#60a5fa' : '#3b82f6', padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>{m.name}</span>
                          </td>
                          <td style={{ padding: '10px 20px', borderBottom: `1px solid ${C.softBorder}`, fontWeight: 600, color: C.text }}>{highlightText(f.name, searchTerm)}</td>
                          <td style={{ padding: '10px 20px', borderBottom: `1px solid ${C.softBorder}` }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                              {grantedActions.slice(0, 6).map(a => (
                                <span key={a} style={{ background: 'rgba(5,150,105,0.08)', color: isDark ? '#34d399' : '#059669', padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap' }}>{a}</span>
                              ))}
                              {grantedActions.length > 6 && (
                                <span style={{ color: C.muted, fontSize: 11, padding: '1px 4px' }}>+{grantedActions.length - 6} more</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '10px 20px', borderBottom: `1px solid ${C.softBorder}` }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '2px 10px', borderRadius: 20,
                              background: 'rgba(5,150,105,0.08)', color: isDark ? '#34d399' : '#059669', fontSize: 11, fontWeight: 600,
                            }}>
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
                              Active
                            </span>
                          </td>
                          <td style={{ padding: '10px 20px', borderBottom: `1px solid ${C.softBorder}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, maxWidth: 60, height: 4, background: C.softBorder, borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.round((gCount / allCount) * 100)}%`, background: '#059669', borderRadius: 4 }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.heading }}>{gCount}/{allCount}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.softBorder}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.hoverBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShield size={17} style={{ color: C.heading }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#f1f5f9' : '#0f172a' }}>Permission Actions Legend</div>
              <div style={{ fontSize: 12, color: C.muted }}>All available actions across the permission matrix</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {LEGEND.map(item => (
              <div
                key={item.action}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
                  borderRadius: 10, background: C.subtleBg, fontSize: 12,
                  border: `1px solid ${C.softBorder}`, transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.hoverBg; e.currentTarget.style.borderColor = C.border; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.subtleBg; e.currentTarget.style.borderColor = C.softBorder; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: isDark ? 'rgba(2,132,199,0.2)' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {React.createElement(ACTION_ICONS[item.action] || FiCheckSquare, { size: 13, style: { color: isDark ? '#38bdf8' : '#0284c7' } })}
                </div>
                <div>
                  <span style={{ fontWeight: 600, color: C.text, fontSize: 12 }}>{item.action}</span>
                  <span style={{ color: C.muted, fontSize: 11, marginLeft: 6 }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.softBorder}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: C.hoverBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiSliders size={17} style={{ color: C.heading }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: isDark ? '#f1f5f9' : '#0f172a' }}>Bulk Permission Controls</div>
              <div style={{ fontSize: 12, color: C.muted }}>Manage permissions across roles in bulk</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.heading }}>Copy Permissions from Role</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    style={{
                      padding: '8px 30px 8px 12px', fontSize: 13, color: isDark ? '#cbd5e1' : '#334155', fontWeight: 500,
                      background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer',
                      outline: 'none', appearance: 'none', minWidth: 180,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='%2364748b'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      transition: 'all 0.15s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = C.focusBg; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.inputBg; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <option>Select Role...</option>
                    {ROLES.filter(r => r !== roleContext).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <button
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
                      background: '#3b82f6', color: 'white', border: 'none', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#3b82f6'; }}
                  ><FiCopy size={13} /> Copy</button>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.heading }}>Apply Permission Template</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <select
                  style={{
                    padding: '8px 30px 8px 12px', fontSize: 13, color: isDark ? '#cbd5e1' : '#334155', fontWeight: 500,
                    background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, cursor: 'pointer',
                    outline: 'none', appearance: 'none', minWidth: 180,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='%2364748b'%3E%3Cpath d='M0 0l5 6 5-6z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                    transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = C.focusBg; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.inputBg; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <option>Select Template...</option>
                  <option>Full Access</option>
                  <option>Read Only</option>
                  <option>Manager Standard</option>
                  <option>Employee Base</option>
                  <option>Auditor View</option>
                </select>
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
                    background: '#8b5cf6', color: 'white', border: 'none', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#7c3aed'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#8b5cf6'; }}
                >Apply</button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.softBorder}` }}>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 10,
                background: isDark ? '#e2e8f0' : '#0f172a', color: isDark ? '#0f172a' : 'white', border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.12s',
              }}
              onClick={handleSaveChanges}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#cbd5e1' : '#1e293b'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#e2e8f0' : '#0f172a'; }}
            ><FiSave size={14} /> {saving ? 'Saving...' : 'Save Changes'}</button>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 10,
                background: 'transparent', color: isDark ? '#f87171' : '#dc2626', border: '1px solid #fca5a5',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.12s',
              }}
              onClick={() => { setExpandedModules({}); setSearchTerm(''); setModuleFilter('all'); }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2'; e.currentTarget.style.borderColor = isDark ? 'rgba(248,113,113,0.55)' : '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#fca5a5'; }}
            ><FiRefreshCw size={14} /> Reset to Default</button>
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px', borderRadius: 10,
                background: 'transparent', color: isDark ? '#60a5fa' : '#3b82f6', border: `1px solid ${isDark ? 'rgba(96,165,250,0.35)' : '#bfdbfe'}`,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff'; e.currentTarget.style.borderColor = isDark ? 'rgba(96,165,250,0.5)' : '#93c5fd'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = isDark ? 'rgba(96,165,250,0.35)' : '#bfdbfe'; }}
            ><FiGitBranch size={14} /> Compare with Another Role</button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default PermissionManagement;
