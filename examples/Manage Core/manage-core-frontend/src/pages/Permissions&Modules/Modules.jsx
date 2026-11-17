import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faLayerGroup, faCheckCircle, faChevronDown, faChevronRight,
  faProjectDiagram, faUsers, faFileInvoiceDollar, faTasks, faFolderOpen,
  faHandshake, faHeartbeat, faPlay, faCode, faCopy, faTerminal,
  faIndustry, faDollarSign
} from '@fortawesome/free-solid-svg-icons';
import { FEATURE_REGISTRY } from '../../data/featureRegistry';
import { useApp } from '../../hooks/useApp';

const systemMeta = {
  pms: { label: 'PMS', full: 'Project Management System', icon: faProjectDiagram, color: '#0d6efd', gradient: 'linear-gradient(135deg, #0d6efd, #0a58ca)' },
  hrms: { label: 'HRMS', full: 'Human Resource Management System', icon: faUsers, color: '#6f42c1', gradient: 'linear-gradient(135deg, #6f42c1, #59359a)' },
  fms: { label: 'FMS', full: 'Financial Management System', icon: faFileInvoiceDollar, color: '#198754', gradient: 'linear-gradient(135deg, #198754, #146c43)' },
  tms: { label: 'TMS', full: 'Task Management System', icon: faTasks, color: '#fd7e14', gradient: 'linear-gradient(135deg, #fd7e14, #ca6510)' },
  dms: { label: 'DMS', full: 'Document Management System', icon: faFolderOpen, color: '#0dcaf0', gradient: 'linear-gradient(135deg, #0dcaf0, #0bacbe)' },
  crm: { label: 'CRM', full: 'Customer Relationship Management', icon: faHandshake, color: '#d63384', gradient: 'linear-gradient(135deg, #d63384, #ab296a)' },
  mfg: { label: 'MFG', full: 'Manufacturing Management System', icon: faIndustry, color: '#059669', gradient: 'linear-gradient(135deg, #059669, #047857)' },
  fx: { label: 'FX', full: 'Multi-Currency & Exchange System', icon: faDollarSign, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
};

const defaultSystemMeta = (key) => ({
  label: key.toUpperCase(),
  full: `${key.toUpperCase()} System`,
  icon: faLayerGroup,
  color: '#64748b',
  gradient: 'linear-gradient(135deg, #64748b, #475569)',
});

const getSystemMeta = (key) => systemMeta[key] || defaultSystemMeta(key);

const Modules = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSystems, setExpandedSystems] = useState(Object.keys(FEATURE_REGISTRY).reduce((a, k) => ({ ...a, [k]: true }), {}));
  const [expandedGroups, setExpandedGroups] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [copiedType, setCopiedType] = useState(null); // 'react' or 'laravel'

  // Diagnostics States
  const [diagSystem, setDiagSystem] = useState(null);
  const [diagProgress, setDiagProgress] = useState(0);
  const [diagLogs, setDiagLogs] = useState([]);
  const [isDiagRunning, setIsDiagRunning] = useState(false);

  const toggleSystem = (key) => setExpandedSystems(p => ({ ...p, [key]: !p[key] }));
  const toggleGroup = (key) => setExpandedGroups(p => ({ ...p, [key]: !p[key] }));

  // Calculate dynamic stats
  const totalGroups = useMemo(() => {
    return Object.values(FEATURE_REGISTRY).reduce((acc, groups) => acc + groups.length, 0);
  }, []);

  const totalFeatures = useMemo(() => {
    return Object.values(FEATURE_REGISTRY).reduce((acc, groups) => {
      return acc + groups.reduce((sum, group) => sum + group.features.length, 0);
    }, 0);
  }, []);

  const systems = useMemo(() => {
    return Object.entries(FEATURE_REGISTRY).map(([key, groups]) => {
      const filteredGroups = groups.map(group => {
        const filteredFeatures = group.features.filter(f =>
          f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...group, features: filteredFeatures };
      }).filter(g => g.features.length > 0);

      const meta = getSystemMeta(key);
      const matchesSystem = key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.full.toLowerCase().includes(searchTerm.toLowerCase());

      return { key, meta, groups: filteredGroups, matchesSystem };
    }).filter(s => s.groups.length > 0 || s.matchesSystem);
  }, [searchTerm]);

  const c = {
    bg: isDark ? '#1e293b' : '#ffffff',
    bgAlt: isDark ? '#0f172a' : '#f8f9fa',
    bgHover: isDark ? '#1e293b' : '#f8fafc',
    border: isDark ? '#334155' : '#eef2f6',
    borderLight: isDark ? '#2d3a4e' : '#edf2f7',
    text: isDark ? '#f1f5f9' : '#0f172a',
    textSec: isDark ? '#94a3b8' : '#475569',
    textMuted: isDark ? '#64748b' : '#94a3b8',
    codeBg: isDark ? '#334155' : '#f1f5f9',
    badgeBg: isDark ? '#334155' : '#f1f5f9',
    cardBg: isDark ? '#111827' : '#ffffff',
    sectionBg: isDark ? '#0f172a' : '#fafbfc',
    caption: isDark ? '#475569' : '#94a3b8',
  };

  const handleCopyCode = (id, type) => {
    let snippet = '';
    if (type === 'react') {
      snippet = `const { hasPermission } = useAuth();\nif (hasPermission('${id}')) {\n  // Access granted\n}`;
    } else {
      snippet = `@can('${id}')\n  <!-- Access granted -->\n@endcan`;
    }

    navigator.clipboard.writeText(snippet).then(() => {
      setCopiedId(id);
      setCopiedType(type);
      addNotification(`Copied ${type === 'react' ? 'React' : 'Laravel'} snippet to clipboard`, 'success');
      setTimeout(() => {
        setCopiedId(null);
        setCopiedType(null);
      }, 2000);
    });
  };

  const runDiagnostics = (systemKey) => {
    const meta = getSystemMeta(systemKey);
    setDiagSystem(meta);
    setIsDiagRunning(true);
    setDiagProgress(0);
    setDiagLogs([]);

    const logSequence = [
      { prg: 10, log: `[SYSTEM] Initializing diagnostics check for modular cluster: ${meta.label}...` },
      { prg: 25, log: `[DATABASE] Connecting to isolation workspace... OK (Master Server local)` },
      { prg: 40, log: `[SCHEMA] Validating module table migrations and column indices... OK` },
      { prg: 65, log: `[RBAC] Scanning active permission keys mapping... Mapped successfully.` },
      { prg: 80, log: `[ROUTING] Checking controller bindings and middleware layers... Bindings OK.` },
      { prg: 100, log: `[COMPLIANCE] All module boundaries are intact. Core status: 100% operational.` }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logSequence.length) {
        const step = logSequence[currentStep];
        setDiagProgress(step.prg);
        setDiagLogs(prev => [...prev, step.log]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsDiagRunning(false);
      }
    }, 400);
  };

  return (
    <div className="fade-in pb-5">
      {/* Top Heading */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h4 className="fw-black mb-1">System Modules</h4>
          <p className="text-muted mb-0">Explore all available systems, feature groups, and module capabilities across the platform.</p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group rounded-pill overflow-hidden shadow-sm border bg-white" style={{ maxWidth: '320px' }}>
            <span className="input-group-text bg-transparent border-0 text-muted px-3"><FontAwesomeIcon icon={faSearch} /></span>
            <input type="text" className="form-control border-0 ps-0 shadow-none bg-transparent" placeholder="Search modules & features..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Active Core Systems', value: `${Object.keys(FEATURE_REGISTRY).length} / ${Object.keys(FEATURE_REGISTRY).length}`, subtitle: '100% Core coverage', gradient: 'linear-gradient(135deg, #0d6efd, #0284c7)', icon: faProjectDiagram },
          { label: 'Feature Groups', value: totalGroups, subtitle: 'Active taxonomies', gradient: 'linear-gradient(135deg, #6f42c1, #7c3aed)', icon: faLayerGroup },
          { label: 'Platform Features', value: totalFeatures, subtitle: 'RBAC permissions mapped', gradient: 'linear-gradient(135deg, #fd7e14, #ea580c)', icon: faTasks },
          { label: 'Overall Core Health', value: '99.8%', subtitle: 'Cluster status: Normal', gradient: 'linear-gradient(135deg, #198754, #10b981)', icon: faHeartbeat },
        ].map((stat, i) => (
          <div className="col-6 col-xl-3" key={i}>
            <div className="position-relative overflow-hidden rounded-3 h-100" style={{
              background: c.cardBg,
              border: `1px solid ${c.border}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div className="position-absolute" style={{ top: 0, left: 0, right: 0, height: '3px', background: stat.gradient }} />
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center justify-content-center rounded-2" style={{
                    width: '34px', height: '34px', background: `${stat.gradient.includes('0d6efd') ? '#0d6efd' : stat.gradient.includes('6f42c1') ? '#6f42c1' : stat.gradient.includes('fd7e14') ? '#fd7e14' : '#198754'}12`,
                    color: stat.gradient.includes('0d6efd') ? '#0d6efd' : stat.gradient.includes('6f42c1') ? '#6f42c1' : stat.gradient.includes('fd7e14') ? '#fd7e14' : '#198754',
                  }}>
                    <FontAwesomeIcon icon={stat.icon} style={{ fontSize: '15px' }} />
                  </div>
                  <span className="small text-uppercase" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.05em', color: c.caption }}>{stat.label}</span>
                </div>
                <div className="mt-3">
                  <span className="fw-black d-block" style={{ fontSize: '1.65rem', letterSpacing: '-0.03em', lineHeight: 1.1, color: c.text }}>{stat.value}</span>
                  <span className="small" style={{ color: c.textMuted, fontSize: '0.75rem' }}>{stat.subtitle}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Systems Registry */}
      {systems.map(system => {
        const meta = system.meta || getSystemMeta(system.key);
        return (
        <div key={system.key} className="mb-4">
          {/* System Panel Header */}
          <div className="d-flex align-items-center justify-content-between px-3 py-2 rounded-top" style={{
            background: `linear-gradient(135deg, ${meta.color}, ${meta.color}dd)`,
            cursor: 'pointer',
            userSelect: 'none',
          }} onClick={() => toggleSystem(system.key)}>
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center justify-content-center rounded-1" style={{
                width: '28px', height: '28px', background: 'rgba(255,255,255,0.18)',
              }}>
                <FontAwesomeIcon icon={meta.icon} className="text-white" style={{ fontSize: '14px' }} />
              </div>
              <span className="fw-semibold text-white" style={{ fontSize: '0.8125rem' }}>{meta.label} — {meta.full}</span>
              <span className="rounded-pill px-2" style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.9)' }}>
                {system.groups.reduce((s, g) => s + g.features.length, 0)} features
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm d-flex align-items-center gap-1.5 rounded-pill px-2.5 py-1 border-0"
                style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onClick={(e) => { e.stopPropagation(); runDiagnostics(system.key); }}
              >
                <FontAwesomeIcon icon={faPlay} style={{ fontSize: '9px' }} /> Diagnostics
              </button>
              <FontAwesomeIcon icon={expandedSystems[system.key] ? faChevronDown : faChevronRight} className="text-white" style={{ fontSize: '11px', opacity: 0.7 }} />
            </div>
          </div>

          {/* System Panel Body */}
          {expandedSystems[system.key] && (
            <div className="border-start border-end border-bottom rounded-bottom" style={{ borderColor: `${c.border} !important`, background: c.sectionBg }}>
              <div className="p-3">
                <div className="row g-2">
                  {system.groups.map(group => {
                    const groupKey = `${system.key}_${group.label.replace(/\s+/g, '_')}`;
                    const isGroupOpen = expandedGroups[groupKey] !== false;
                    return (
                      <div key={groupKey} className="col-12 col-xl-6">
                        <div className="rounded-2 overflow-hidden" style={{ border: `1px solid ${c.border}`, background: c.bg }}>
                          {/* Group Header */}
                          <div
                            className="d-flex align-items-center justify-content-between px-3 py-2"
                            style={{ cursor: 'pointer', borderBottom: isGroupOpen ? `1px solid ${c.border}` : 'none', background: c.bg }}
                            onClick={() => toggleGroup(groupKey)}
                          >
                            <div className="d-flex align-items-center gap-2">
                              <div className="d-flex align-items-center justify-content-center rounded-1" style={{ width: '24px', height: '24px', background: `${meta.color}10` }}>
                                <FontAwesomeIcon icon={faLayerGroup} style={{ color: meta.color, fontSize: '11px' }} />
                              </div>
                              <span className="fw-semibold" style={{ fontSize: '0.8125rem', color: c.text }}>{group.label}</span>
                              <span className="rounded-pill px-2" style={{ fontSize: '10px', fontWeight: 600, background: c.badgeBg, color: c.textSec }}>{group.features.length}</span>
                            </div>
                            <FontAwesomeIcon icon={isGroupOpen ? faChevronDown : faChevronRight} className="text-muted" style={{ fontSize: '10px' }} />
                          </div>

                          {/* Group Features */}
                          {isGroupOpen && (
                            <div className="p-2" style={{ background: c.bgAlt }}>
                              {group.features.map(f => (
                                <div key={f.id} className="d-flex align-items-center justify-content-between px-2.5 py-2 rounded-1 mb-1" style={{
                                  background: c.bg,
                                  borderLeft: `3px solid ${meta.color}`,
                                  transition: 'all 0.12s ease',
                                }}
                                  onMouseEnter={e => { e.currentTarget.style.background = c.bgHover; e.currentTarget.style.borderLeftColor = meta.color; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = c.bg; e.currentTarget.style.borderLeftColor = meta.color; }}
                                >
                                  <div className="min-w-0 flex-grow-1" style={{ paddingRight: '8px' }}>
                                    <div className="d-flex align-items-center gap-1.5">
                                      <span className="fw-semibold d-block text-truncate" style={{ fontSize: '0.8125rem', color: c.text }}>{f.label}</span>
                                      <code className="rounded px-1.5 flex-shrink-0" style={{
                                        fontSize: '9px', color: c.textMuted, background: c.codeBg,
                                        fontFamily: "'SF Mono', 'Fira Code', monospace", lineHeight: '18px',
                                      }}>{f.id}</code>
                                    </div>
                                    <small className="d-block text-truncate" style={{ fontSize: '0.6875rem', color: c.caption, marginTop: '1px' }}>{f.description}</small>
                                  </div>
                                  <div className="d-flex align-items-center gap-1 flex-shrink-0">
                                    <button
                                      className="btn btn-xs d-flex align-items-center gap-1 rounded-1 border-0 px-1.5"
                                      title="Copy React snippet"
                                      style={{ fontSize: '9px', background: c.badgeBg, color: c.textSec, lineHeight: '20px' }}
                                      onMouseEnter={e => { e.currentTarget.style.background = c.codeBg; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = c.badgeBg; }}
                                      onClick={() => handleCopyCode(f.id, 'react')}
                                    >
                                      <FontAwesomeIcon icon={faCode} style={{ fontSize: '8px', color: '#3b82f6' }} />
                                      {copiedId === f.id && copiedType === 'react' ? 'Copied!' : 'React'}
                                    </button>
                                    <button
                                      className="btn btn-xs d-flex align-items-center gap-1 rounded-1 border-0 px-1.5"
                                      title="Copy Laravel snippet"
                                      style={{ fontSize: '9px', background: c.badgeBg, color: c.textSec, lineHeight: '20px' }}
                                      onMouseEnter={e => { e.currentTarget.style.background = c.codeBg; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = c.badgeBg; }}
                                      onClick={() => handleCopyCode(f.id, 'laravel')}
                                    >
                                      <FontAwesomeIcon icon={faCopy} style={{ fontSize: '8px', color: '#10b981' }} />
                                      {copiedId === f.id && copiedType === 'laravel' ? 'Copied!' : 'Laravel'}
                                    </button>
                                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#22c55e', fontSize: '11px', opacity: 0.5, marginLeft: '2px' }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        );
      })}

      {systems.length === 0 && (
        <div className="text-center py-5 rounded-4 border" style={{ background: c.bg, borderColor: c.border }}>
          <FontAwesomeIcon icon={faLayerGroup} className="mb-3" style={{ color: c.caption, opacity: 0.25, fontSize: '3rem' }} />
          <p style={{ color: c.textMuted }}>No modules match your search query.</p>
        </div>
      )}

      {/* Diagnostics Simulator Modal Overlay */}
      {diagSystem && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3" style={{ zIndex: 2000, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)' }}>
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden w-100" style={{ maxWidth: '600px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="card-header bg-dark bg-opacity-50 p-4 d-flex justify-content-between align-items-center border-0 border-bottom border-secondary border-opacity-25">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2.5 rounded-3 text-white" style={{ background: diagSystem.gradient }}>
                  <FontAwesomeIcon icon={faTerminal} />
                </div>
                <div>
                  <h5 className="fw-black mb-0 text-white">Diagnostics: {diagSystem.label}</h5>
                  <p className="text-muted small mb-0 font-monospace">v{diagSystem.label === 'PMS' ? '3.1.0' : diagSystem.label === 'HRMS' ? '2.4.1' : '1.0.0'}-STABLE</p>
                </div>
              </div>
              <button className="btn btn-link text-muted" onClick={() => setDiagSystem(null)} disabled={isDiagRunning}>
                <span className="text-white fs-5">&times;</span>
              </button>
            </div>
            
            <div className="card-body p-4 bg-dark text-light font-monospace">
              {/* Terminal Logs Box */}
              <div className="p-3 bg-black rounded-3 mb-4 overflow-auto border border-secondary border-opacity-25" style={{ height: '240px', fontSize: '12px', color: '#10b981', textShadow: '0 0 4px rgba(16, 185, 129, 0.4)' }}>
                {diagLogs.map((log, idx) => (
                  <div key={idx} className="mb-2">
                    <span className="text-muted select-none">&gt;&nbsp;</span>{log}
                  </div>
                ))}
                {isDiagRunning && (
                  <div className="d-flex align-items-center gap-2 mt-2">
                    <span className="text-muted select-none">&gt;&nbsp;</span>
                    <span className="spinner-border spinner-border-sm text-success" role="status"></span>
                    <span className="animate-pulse">Checking records...</span>
                  </div>
                )}
              </div>

              {/* Progress Tracker */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1 text-muted small">
                  <span>Diagnostic Progress</span>
                  <span className="fw-bold text-white">{diagProgress}%</span>
                </div>
                <div className="progress" style={{ height: '6px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="progress-bar bg-success" style={{ width: `${diagProgress}%`, transition: 'width 0.3s ease', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
                </div>
              </div>

              <div className="mt-4 d-flex justify-content-end">
                <button
                  className="btn btn-light rounded-pill px-4 fw-bold py-2 shadow-sm font-monospace border-0"
                  style={{ fontSize: '13px' }}
                  onClick={() => setDiagSystem(null)}
                  disabled={isDiagRunning}
                >
                  {isDiagRunning ? 'Analyzing...' : 'Dismiss'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled tags */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .animate-pulse {
          animation: pulse-terminal 1.5s infinite;
        }
        @keyframes pulse-terminal {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default Modules;
