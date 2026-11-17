import React, { useState, useEffect, useMemo, useRef } from 'react';
import { listPermissionsFlat } from '../../api/permissions';
import { listRoles, updateRole } from '../../api/roles';
import { listUsers, updateUserPermissions } from '../../api/users';
import { useApp } from '../../hooks/useApp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSave, faRotateLeft, faShield, faChevronDown, faChevronRight, faProjectDiagram, faUsers, faFileInvoiceDollar, faTasks, faFolderOpen, faHandshake, faLayerGroup, faUserCheck, faInfoCircle, faList, faThLarge, faCheck, faBars } from '@fortawesome/free-solid-svg-icons';
import { FEATURE_REGISTRY } from '../../data/featureRegistry';

const systemMeta = {
  pms: { label: 'PMS', icon: faProjectDiagram, color: '#0d6efd' },
  hrms: { label: 'HRMS', icon: faUsers, color: '#6f42c1' },
  fms: { label: 'FMS', icon: faFileInvoiceDollar, color: '#198754' },
  tms: { label: 'TMS', icon: faTasks, color: '#fd7e14' },
  dms: { label: 'DMS', icon: faFolderOpen, color: '#0dcaf0' },
  crm: { label: 'CRM', icon: faHandshake, color: '#d63384' },
  systems: { label: 'Systems', icon: faLayerGroup, color: '#0f172a' },
  sidebar: { label: 'Sidebar', icon: faBars, color: '#6c757d' },
};

const buildStructuredPermissions = (permissionsData = []) => {
  const result = [];
  Object.entries(FEATURE_REGISTRY).forEach(([systemKey, groups]) => {
    const meta = systemMeta[systemKey] || { label: systemKey.toUpperCase(), icon: faLayerGroup, color: '#6c757d' };
    groups.forEach(group => {
      group.features.forEach(f => {
        result.push({
          id: f.id,
          name: f.label,
          system: systemKey,
          systemLabel: meta.label,
          systemIcon: meta.icon,
          systemColor: meta.color,
          groupLabel: group.label,
          description: f.description,
        });
      });
    });
  });

  const systemAccessPermissions = permissionsData
    .filter(perm => perm.slug?.startsWith('system_'))
    .map(perm => ({
      id: perm.slug,
      name: perm.name,
      system: 'systems',
      systemLabel: 'Systems',
      systemIcon: systemMeta.systems.icon,
      systemColor: systemMeta.systems.color,
      groupLabel: 'System Access',
      description: perm.name,
    }));

  const sidebarPermissions = permissionsData
    .filter(perm => perm.module?.toLowerCase() === 'sidebar' || perm.slug?.startsWith('sidebar_'))
    .map(perm => ({
      id: perm.slug,
      name: perm.name,
      system: 'sidebar',
      systemLabel: 'Sidebar',
      systemIcon: systemMeta.sidebar.icon,
      systemColor: systemMeta.sidebar.color,
      groupLabel: 'Sidebar Navigation',
      description: perm.name,
    }));

  if (systemAccessPermissions.length > 0) {
    result.push(...systemAccessPermissions);
  }
  if (sidebarPermissions.length > 0) {
    result.push(...sidebarPermissions);
  }

  return result;
};

const Permissions = () => {
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedSystems, setCollapsedSystems] = useState({});
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [viewMode, setViewMode] = useState('list');
  const [targetMode, setTargetMode] = useState('roles');
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [activeSystemFilter, setActiveSystemFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const [structuredPerms, setStructuredPerms] = useState(() => buildStructuredPermissions());

  const [matrixState, setMatrixState] = useState({});
  const [initialMatrixState, setInitialMatrixState] = useState({});
  const [userOverrides, setUserOverrides] = useState({});
  const [initialUserOverrides, setInitialUserOverrides] = useState({});
  const [permissionIdMap, setPermissionIdMap] = useState({});

  // Helper function to highlight matching search term
  const highlightText = (text, search) => {
    if (!search || !text) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <mark key={i} className="p-0 bg-warning text-dark rounded px-1 fw-bold">{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [permissionsData, rolesData, usersData] = await Promise.all([
        listPermissionsFlat(),
        listRoles(),
        listUsers()
      ]);
      const slugMap = {};
      permissionsData.forEach((perm) => {
        if (perm.slug) slugMap[perm.slug] = perm.id;
      });
      setPermissionIdMap(slugMap);
      setStructuredPerms(buildStructuredPermissions(permissionsData));
      setRoles(rolesData);
      setUsers(usersData);
      if (rolesData.length > 0) setActiveRoleId(rolesData[0].id);
      if (usersData.length > 0) setActiveUserId(usersData[0].id);

      const allPermIds = buildStructuredPermissions(permissionsData).map(p => slugMap[p.id] ?? p.id);
      const initialRoleState = {};
      rolesData.forEach(role => {
        const apiIds = role.permissions?.map(p => p.id) || [];
        initialRoleState[role.id] = [...new Set([...apiIds.filter(id => allPermIds.includes(id))])];
      });
      setMatrixState(initialRoleState);
      setInitialMatrixState(JSON.parse(JSON.stringify(initialRoleState)));

      const initialOverrides = {};
      usersData.forEach(user => {
        initialOverrides[user.id] = user.directPermissions?.filter(id => allPermIds.includes(id)) || [];
      });
      setUserOverrides(initialOverrides);
      setInitialUserOverrides(JSON.parse(JSON.stringify(initialOverrides)));

      const initCollapsed = {};
      Object.keys(FEATURE_REGISTRY).forEach(k => { initCollapsed[k] = false; });
      setCollapsedSystems(initCollapsed);
    } catch {
      addNotification('Failed to fetch permissions data', 'danger');
    } finally {
      setLoading(false);
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDirty = useMemo(() => {
    if (targetMode === 'roles') return JSON.stringify(matrixState) !== JSON.stringify(initialMatrixState);
    return JSON.stringify(userOverrides) !== JSON.stringify(initialUserOverrides);
  }, [matrixState, initialMatrixState, userOverrides, initialUserOverrides, targetMode]);

  const resolvePermissionId = (permissionIdOrSlug) => {
    if (typeof permissionIdOrSlug === 'number') return permissionIdOrSlug;
    return permissionIdMap[permissionIdOrSlug] ?? permissionIdOrSlug;
  };

  const togglePermission = (targetId, permId) => {
    const resolvedId = resolvePermissionId(permId);
    if (targetMode === 'roles') {
      setMatrixState(prev => {
        const current = prev[targetId] || [];
        const updated = current.includes(resolvedId) ? current.filter(p => p !== resolvedId) : [...current, resolvedId];
        return { ...prev, [targetId]: updated };
      });
    } else {
      setUserOverrides(prev => {
        const current = prev[targetId] || [];
        const updated = current.includes(resolvedId) ? current.filter(p => p !== resolvedId) : [...current, resolvedId];
        return { ...prev, [targetId]: updated };
      });
    }
  };

  const toggleSystemForTarget = (targetId, systemPerms, shouldEnable) => {
    const ids = systemPerms.map(p => resolvePermissionId(p.id));
    if (targetMode === 'roles') {
      setMatrixState(prev => {
        const current = prev[targetId] || [];
        const updated = shouldEnable ? [...new Set([...current, ...ids])] : current.filter(p => !ids.includes(p));
        return { ...prev, [targetId]: updated };
      });
    } else {
      setUserOverrides(prev => {
        const current = prev[targetId] || [];
        const updated = shouldEnable ? [...new Set([...current, ...ids])] : current.filter(p => !ids.includes(p));
        return { ...prev, [targetId]: updated };
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (targetMode === 'roles') {
        const promises = [];
        Object.keys(matrixState).forEach(roleId => {
          if (JSON.stringify(matrixState[roleId]) !== JSON.stringify(initialMatrixState[roleId])) {
            const role = roles.find(r => r.id === parseInt(roleId));
            promises.push(updateRole(roleId, { ...role, permissions: matrixState[roleId] }));
          }
        });
        await Promise.all(promises);
        setInitialMatrixState(JSON.parse(JSON.stringify(matrixState)));
      } else {
        const promises = [];
        Object.keys(userOverrides).forEach(userId => {
          if (JSON.stringify(userOverrides[userId]) !== JSON.stringify(initialUserOverrides[userId])) {
            promises.push(updateUserPermissions(userId, userOverrides[userId]));
          }
        });
        await Promise.all(promises);
        setInitialUserOverrides(JSON.parse(JSON.stringify(userOverrides)));
      }
      addNotification('Permissions updated successfully', 'success');
    } catch {
      addNotification('Failed to save changes', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (targetMode === 'roles') setMatrixState(JSON.parse(JSON.stringify(initialMatrixState)));
    else setUserOverrides(JSON.parse(JSON.stringify(initialUserOverrides)));
  };

  const toggleCollapseSystem = (key) => setCollapsedSystems(p => ({ ...p, [key]: !p[key] }));
  const toggleCollapseGroup = (key) => setCollapsedGroups(p => ({ ...p, [key]: !p[key] }));

  const filteredPerms = useMemo(() => {
    return structuredPerms.filter(p => {
      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.systemLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.groupLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSystem = activeSystemFilter === 'all' || p.system === activeSystemFilter;
      return matchesSearch && matchesSystem;
    });
  }, [structuredPerms, searchTerm, activeSystemFilter]);

  const groupedBySystem = useMemo(() => {
    const map = {};
    filteredPerms.forEach(p => {
      if (!map[p.system]) {
        map[p.system] = { meta: systemMeta[p.system] || { label: p.systemLabel, icon: faLayerGroup, color: '#6c757d' }, groups: {} };
      }
      if (!map[p.system].groups[p.groupLabel]) map[p.system].groups[p.groupLabel] = [];
      map[p.system].groups[p.groupLabel].push(p);
    });
    return map;
  }, [filteredPerms]);

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return users;
    return users.filter(u => u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()));
  }, [users, userSearchTerm]);

  const activeUser = users.find(u => u.id === activeUserId);
  const activeUserRole = roles.find(r => r.id === activeUser?.roleId);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Enterprise-grade permissions header */}
      <div className="position-relative overflow-hidden rounded-4 p-4 mb-4" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Decorative background elements */}
        <div className="position-absolute" style={{
          top: '-40%', right: '-8%', width: '380px', height: '380px',
          background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="position-absolute" style={{
          bottom: '-30%', left: '-5%', width: '280px', height: '280px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="position-relative d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-start gap-3">
            <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
            }}>
              <FontAwesomeIcon icon={faShield} className="text-white" style={{ fontSize: '20px' }} />
            </div>
            <div>
              <h4 className="fw-bold text-white mb-1" style={{ letterSpacing: '-0.02em' }}>Permissions Control Center</h4>
              <p className="mb-0" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8125rem' }}>
                Manage granular access across <span className="fw-semibold text-white">{structuredPerms.length}</span> features in <span className="fw-semibold text-white">{Object.keys(FEATURE_REGISTRY).length}</span> systems
              </p>
            </div>
          </div>
          <div className="d-flex gap-2">
            {isDirty && (
              <>
                <button className="btn rounded-pill px-4 d-flex align-items-center gap-2 border-0" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)' }} onClick={handleReset} disabled={saving}>
                  <FontAwesomeIcon icon={faRotateLeft} /> Reset
                </button>
                <button className="btn rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm border-0" style={{
                  background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                  color: 'white',
                }} onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner-border spinner-border-sm"></span> : <><FontAwesomeIcon icon={faSave} /> Save Changes</>}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Metrics bar */}
        <div className="position-relative d-flex flex-wrap gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { label: 'FEATURES', value: structuredPerms.length, color: '#4F46E5' },
            { label: 'SYSTEMS', value: new Set([...Object.keys(FEATURE_REGISTRY), 'sidebar', 'systems']).size, color: '#06b6d4' },
            { label: 'ROLES', value: roles.length, color: '#10b981' },
            { label: 'USERS', value: users.length, color: '#f59e0b' },
          ].map(metric => (
            <div key={metric.label} className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.04em' }}>{metric.label}</span>
              <span className="fw-bold" style={{ color: metric.color, fontSize: '0.875rem' }}>{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4 no-hover">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-2">
              <div className="bg-light p-1 rounded-pill border d-flex">
                <button className={`btn btn-sm rounded-pill flex-grow-1 px-3 d-flex align-items-center justify-content-center gap-2 ${targetMode === 'roles' ? 'btn-dark shadow-sm' : 'btn-light border-0'}`} onClick={() => { setTargetMode('roles'); setViewMode('list'); }}>
                  <FontAwesomeIcon icon={faShield} /> Roles
                </button>
                <button className={`btn btn-sm rounded-pill flex-grow-1 px-3 d-flex align-items-center justify-content-center gap-2 ${targetMode === 'users' ? 'btn-dark shadow-sm' : 'btn-light border-0'}`} onClick={() => { setTargetMode('users'); setViewMode('card'); }}>
                  <FontAwesomeIcon icon={faUsers} /> Users
                </button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="input-group rounded-pill overflow-hidden bg-light border">
                <span className="input-group-text bg-transparent border-0 text-muted px-3"><FontAwesomeIcon icon={faSearch} /></span>
                <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search features..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="position-relative" ref={filterDropdownRef}>
                <button
                  className="btn btn-sm d-flex align-items-center gap-2 w-100 rounded-pill border bg-light px-3 py-2"
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                  style={{ transition: 'all 0.2s ease' }}
                >
                  {activeSystemFilter === 'all' ? (
                    <FontAwesomeIcon icon={faLayerGroup} className="text-muted" size="sm" />
                  ) : (
                    <FontAwesomeIcon icon={systemMeta[activeSystemFilter]?.icon || faLayerGroup} size="sm" style={{ color: systemMeta[activeSystemFilter]?.color }} />
                  )}
                  <span className="flex-grow-1 text-start small fw-medium">
                    {activeSystemFilter === 'all' ? 'All Systems' : (systemMeta[activeSystemFilter]?.label || activeSystemFilter)}
                  </span>
                  <FontAwesomeIcon icon={faChevronDown} size="xs" className="text-muted" style={{ transform: filterDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </button>
                {filterDropdownOpen && (
                  <div className="position-absolute w-100 mt-1 rounded-3 shadow-lg border bg-white overflow-hidden" style={{ zIndex: 1080, minWidth: '180px' }}>
                    {[
                      { key: 'all', label: 'All Systems', icon: faLayerGroup, color: '#6c757d' },
                      ...Object.entries(systemMeta).map(([k, m]) => ({ key: k, label: m.label, icon: m.icon, color: m.color })),
                    ].map((item, idx) => (
                      <React.Fragment key={item.key}>
                        {idx > 0 && <div style={{ borderTop: '1px solid #f1f5f9' }} />}
                        <button
                          className={`d-flex align-items-center gap-2 w-100 px-3 py-2 border-0 bg-transparent`}
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: activeSystemFilter === item.key ? 600 : 400,
                            color: activeSystemFilter === item.key ? '#0f172a' : '#475569',
                            background: activeSystemFilter === item.key ? '#f8fafc' : 'transparent',
                            transition: 'all 0.12s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = activeSystemFilter === item.key ? '#f8fafc' : 'transparent'; }}
                          onClick={() => { setActiveSystemFilter(item.key); setFilterDropdownOpen(false); }}
                        >
                          <FontAwesomeIcon icon={item.icon} size="sm" style={{ color: item.color, opacity: activeSystemFilter === item.key ? 1 : 0.7 }} />
                          <span className="flex-grow-1 text-start">{item.label}</span>
                          {activeSystemFilter === item.key && <FontAwesomeIcon icon={faCheck} size="xs" className="text-primary" />}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex justify-content-end align-items-center gap-2">
                {targetMode === 'roles' && (
                  <div className="bg-light p-1 rounded-pill border d-flex">
                    <button className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${viewMode === 'list' ? 'btn-dark shadow-sm' : 'btn-light border-0'}`} onClick={() => setViewMode('list')}>
                      <FontAwesomeIcon icon={faList} /> Matrix
                    </button>
                    <button className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${viewMode === 'card' ? 'btn-dark shadow-sm' : 'btn-light border-0'}`} onClick={() => setViewMode('card')}>
                      <FontAwesomeIcon icon={faThLarge} /> Cards
                    </button>
                  </div>
                )}
                {targetMode === 'users' && (
                  <div className="input-group input-group-sm rounded-pill overflow-hidden bg-light border" style={{ width: '200px' }}>
                    <span className="input-group-text bg-transparent border-0 text-muted px-2"><FontAwesomeIcon icon={faSearch} size="sm" /></span>
                    <input type="text" className="form-control bg-transparent border-0 shadow-none" placeholder="Search user..." value={userSearchTerm} onChange={e => setUserSearchTerm(e.target.value)} />
                  </div>
                )}
                <span className="badge bg-light text-dark border rounded-pill px-3 py-2 d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faInfoCircle} size="sm" /> {targetMode === 'roles' ? `${roles.length} roles` : `${users.length} users`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="d-flex align-items-center gap-3 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {targetMode === 'roles' ? (
            viewMode === 'card' && roles.map(role => (
              <button key={role.id} className={`btn rounded-4 px-4 py-3 d-flex flex-column align-items-center gap-2 border-2 ${activeRoleId === role.id ? 'bg-dark text-white border-dark shadow' : 'bg-white text-dark border-light shadow-sm'}`} style={{ minWidth: '140px' }} onClick={() => setActiveRoleId(role.id)}>
                <div className={`p-2 rounded-circle ${activeRoleId === role.id ? 'bg-white text-dark' : ''}`} style={{ backgroundColor: activeRoleId !== role.id ? `${role.color || '#0d6efd'}15` : '', color: activeRoleId !== role.id ? (role.color || '#0d6efd') : '' }}>
                  <FontAwesomeIcon icon={faShield} size="lg" />
                </div>
                <span className="fw-bold small text-uppercase">{role.name}</span>
                <span className="small" style={{ fontSize: '10px', color: activeRoleId === role.id ? 'rgba(255,255,255,0.7)' : '#6c757d' }}>
                  {matrixState[role.id]?.length || 0} / {structuredPerms.length}
                </span>
              </button>
            ))
          ) : (
            filteredUsers.map(user => (
              <button key={user.id} className={`btn rounded-4 px-3 py-3 d-flex align-items-center gap-3 border-2 ${activeUserId === user.id ? 'bg-dark text-white border-dark shadow' : 'bg-white text-dark border-light shadow-sm'}`} style={{ minWidth: '220px' }} onClick={() => setActiveUserId(user.id)}>
                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '40px', height: '40px', backgroundColor: activeUserId === user.id ? 'white' : `${systemMeta[user.role?.toLowerCase()]?.color || '#0d6efd'}15`, color: activeUserId === user.id ? '#000' : (systemMeta[user.role?.toLowerCase()]?.color || '#0d6efd') }}>
                  {user.name?.charAt(0) || '?'}
                </div>
                <div className="text-start">
                  <h6 className="mb-0 fw-bold small text-truncate" style={{ maxWidth: '120px' }}>{user.name}</h6>
                  <p className="mb-0 small" style={{ fontSize: '10px', color: activeUserId === user.id ? 'rgba(255,255,255,0.7)' : '#6c757d' }}>{user.role || 'N/A'}</p>
                </div>
                <div className="ms-auto">
                  <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: user.isOnline ? '#198754' : '#adb5bd' }}></div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {viewMode === 'list' && targetMode === 'roles' ? (
        <div className={`card border-0 shadow-sm overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
          <div className="table-responsive" style={{ maxHeight: '70vh' }}>
            <table className="table table-hover align-middle mb-0">
              <thead className={`sticky-top shadow-sm ${isDark ? 'bg-dark-header' : 'bg-white'}`}>
                <tr>
                  <th className={`ps-4 py-4 ${isDark ? 'bg-dark-header' : 'bg-white'}`} style={{ minWidth: '320px', borderBottom: isDark ? '2px solid #1e293b' : '2px solid #f1f5f9' }}>
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faShield} className="text-primary" />
                      <span className={`fw-bold ${isDark ? 'text-light' : ''}`}>System / Feature</span>
                    </div>
                  </th>
                  {roles.map(role => {
                    const isColHovered = hoveredCol === role.id;
                    return (
                      <th
                        key={role.id}
                        className={`text-center py-4 transition-all ${isDark ? 'bg-dark-header' : 'bg-white'} ${isColHovered ? 'matrix-col-header-hovered' : ''}`}
                        style={{
                          minWidth: '110px',
                          borderBottom: isDark ? '2px solid #1e293b' : '2px solid #f1f5f9',
                          transition: 'all 0.2s ease',
                          transform: isColHovered ? 'scale(1.05) translateY(-2px)' : 'none',
                        }}
                        onMouseEnter={() => setHoveredCol(role.id)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        <div className="d-flex flex-column align-items-center gap-1">
                          <div className="p-2 rounded-circle mb-1" style={{ backgroundColor: `${role.color || '#4F46E5'}15`, color: role.color || '#4F46E5', boxShadow: isColHovered ? `0 0 10px ${(role.color || '#4F46E5')}40` : 'none' }}>
                            <FontAwesomeIcon icon={faShield} />
                          </div>
                          <span className="small fw-bold text-uppercase" style={{ letterSpacing: '0.05em' }}>{role.name}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedBySystem).map(([systemKey, system]) => {
                  const isCollapsed = collapsedSystems[systemKey];
                  const allGroupPerms = Object.values(system.groups).flat();
                  return (
                    <React.Fragment key={systemKey}>
                      <tr className={isDark ? 'bg-dark' : 'bg-light-subtle'}>
                        <td colSpan={roles.length + 1} className="p-0 border-0">
                          <div className={`d-flex align-items-center justify-content-between px-4 py-3 border-bottom cursor-pointer ${isDark ? 'bg-dark' : 'bg-light-subtle'}`} onClick={() => toggleCollapseSystem(systemKey)}>
                            <div className="d-flex align-items-center gap-3">
                              <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronDown} className="text-muted" size="sm" />
                              <div className="d-flex align-items-center justify-content-center rounded" style={{ width: '32px', height: '32px', backgroundColor: `${system.meta.color}15`, color: system.meta.color }}>
                                <FontAwesomeIcon icon={system.meta.icon} size="sm" />
                              </div>
                              <h6 className={`mb-0 fw-bold ${isDark ? 'text-light' : ''}`}>{system.meta.label}</h6>
                              <span className={`badge rounded-pill small px-2 ${isDark ? 'bg-dark text-light border border-secondary' : 'bg-white text-dark border'}`}>{allGroupPerms.length} features</span>
                            </div>
                            <div className="d-flex gap-2">
                              <button className={`btn btn-sm rounded-pill px-3 ${isDark ? 'btn-outline-light' : 'btn-white border'}`} onClick={(e) => { e.stopPropagation(); toggleSystemForTarget(activeRoleId, allGroupPerms, true); }}>Enable All</button>
                              <button className={`btn btn-sm rounded-pill px-3 ${isDark ? 'btn-outline-light' : 'btn-white border'}`} onClick={(e) => { e.stopPropagation(); toggleSystemForTarget(activeRoleId, allGroupPerms, false); }}>Disable All</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      {!isCollapsed && Object.entries(system.groups).map(([groupLabel, perms]) => {
                        const groupKey = `${systemKey}_${groupLabel}`;
                        const isGroupCollapsed = collapsedGroups[groupKey];
                        return (
                          <React.Fragment key={groupKey}>
                            <tr>
                              <td colSpan={roles.length + 1} className="p-0 border-0">
                                <div className={`d-flex align-items-center justify-content-between px-5 py-2 border-bottom cursor-pointer ${isDark ? 'bg-dark-card' : 'bg-white'}`} onClick={() => toggleCollapseGroup(groupKey)} style={{ cursor: 'pointer' }}>
                                  <div className="d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={isGroupCollapsed ? faChevronRight : faChevronDown} className="text-muted" size="xs" />
                                    <FontAwesomeIcon icon={faLayerGroup} className="text-muted" size="sm" />
                                    <span className={`small fw-semibold ${isDark ? 'text-light' : ''}`}>{groupLabel}</span>
                                    <span className={`badge rounded-pill ${isDark ? 'bg-dark text-light border border-secondary' : 'bg-light text-dark'}`} style={{ fontSize: '10px' }}>{perms.length}</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                            {!isGroupCollapsed && perms.map(p => {
                              const permNumericId = resolvePermissionId(p.id);
                              const isRowHovered = hoveredRow === p.id;
                              return (
                                <tr
                                  key={p.id}
                                  className={`border-bottom transition-all ${isRowHovered ? 'matrix-row-hovered' : ''}`}
                                  onMouseEnter={() => setHoveredRow(p.id)}
                                  onMouseLeave={() => setHoveredRow(null)}
                                  style={{ transition: 'all 0.2s ease' }}
                                >
                                  <td className="ps-5 py-3 border-0" style={{ paddingLeft: '4rem !important' }}>
                                    <div>
                                      <span className="small fw-semibold d-block">{highlightText(p.name, searchTerm)}</span>
                                      <span className="text-muted d-block" style={{ fontSize: '11px' }}>{highlightText(p.description, searchTerm)}</span>
                                    </div>
                                  </td>
                                  {roles.map(role => {
                                    const isChecked = matrixState[role.id]?.includes(permNumericId);
                                    const isColHovered = hoveredCol === role.id;
                                    const isCellHovered = isRowHovered && isColHovered;
                                    return (
                                      <td
                                        key={role.id}
                                        className={`text-center py-3 border-0 transition-all ${isColHovered ? 'matrix-col-hovered' : ''} ${isCellHovered ? 'matrix-cell-hovered' : ''}`}
                                        onMouseEnter={() => setHoveredCol(role.id)}
                                        onMouseLeave={() => setHoveredCol(null)}
                                        style={{
                                          transition: 'all 0.2s ease',
                                          backgroundColor: isCellHovered ? 'rgba(79, 70, 229, 0.08)' : isColHovered ? 'rgba(79, 70, 229, 0.03)' : 'transparent'
                                        }}
                                      >
                                        <div className="form-check form-check-inline m-0">
                                          <input
                                            className="form-check-input cursor-pointer custom-matrix-checkbox"
                                            type="checkbox"
                                            checked={isChecked || false}
                                            onChange={() => togglePermission(role.id, p.id)}
                                            style={{
                                              width: '1.4rem',
                                              height: '1.4rem',
                                              borderColor: isChecked ? (role.color || '#4f46e5') : '#cbd5e1',
                                              backgroundColor: isChecked ? (role.color || '#4f46e5') : 'transparent',
                                              borderRadius: '6px',
                                              cursor: 'pointer',
                                              boxShadow: isChecked ? `0 0 8px ${(role.color || '#4f46e5')}40` : 'none',
                                              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            }}
                                          />
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {targetMode === 'users' && activeUser && (
            <div className="col-12 mb-2">
              <div className={`alert border-0 rounded-4 shadow-sm d-flex align-items-center gap-3 p-4 ${isDark ? 'bg-dark-card border-secondary' : 'alert-info'}`}>
                <div className="p-3 bg-info bg-opacity-10 rounded-circle text-info">
                  <FontAwesomeIcon icon={faUserCheck} size="lg" />
                </div>
                <div>
                  <h6 className="mb-1 fw-bold">Individual Overrides for {activeUser.name}</h6>
                  <p className="mb-0 small text-muted">
                    Permissions toggled here grant access to <strong>{activeUser.name}</strong> regardless of their role (<em>{activeUser.role}</em>).
                    {activeUser.role === 'Admin' && <span className="text-danger ms-2"><FontAwesomeIcon icon={faInfoCircle} /> Admin users already have all permissions.</span>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {Object.entries(groupedBySystem).map(([systemKey, system]) => (
            <div key={systemKey} className="col-12">
              <div className={`card border-0 shadow-sm mb-3 ${isDark ? 'bg-dark-card' : ''}`}>
                <div className={`card-header d-flex align-items-center justify-content-between px-4 py-3 ${isDark ? 'bg-dark border-secondary text-light' : 'bg-transparent border-bottom'}`}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-center rounded" style={{ width: '36px', height: '36px', backgroundColor: `${system.meta.color}15`, color: system.meta.color }}>
                      <FontAwesomeIcon icon={system.meta.icon} />
                    </div>
                    <h6 className={`fw-bold mb-0 ${isDark ? 'text-light' : ''}`}>{system.meta.label}</h6>
                  </div>
                  <div className="dropdown">
                    <button className={`btn btn-sm rounded-pill px-3 dropdown-toggle ${isDark ? 'btn-outline-light' : 'btn-light'}`} type="button" data-bs-toggle="dropdown">Bulk</button>
                    <ul className="dropdown-menu shadow border-0 rounded-3">
                      <li><button className="dropdown-item small" onClick={() => toggleSystemForTarget(targetMode === 'roles' ? activeRoleId : activeUserId, Object.values(system.groups).flat(), true)}>Enable All</button></li>
                      <li><button className="dropdown-item small text-danger" onClick={() => toggleSystemForTarget(targetMode === 'roles' ? activeRoleId : activeUserId, Object.values(system.groups).flat(), false)}>Disable All</button></li>
                    </ul>
                  </div>
                </div>
                <div className="card-body p-3">
                  <div className="row g-3">
                    {Object.entries(system.groups).map(([groupLabel, perms]) => (
                      <div key={groupLabel} className="col-xl-4 col-lg-6">
                        <div className={`card h-100 ${isDark ? 'bg-dark-card border-secondary' : 'border'}`}>
                          <div className={`card-header px-3 py-2 ${isDark ? 'bg-dark border-secondary' : 'bg-transparent border-bottom'}`}>
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faLayerGroup} className="text-muted" size="sm" />
                              <span className={`small fw-semibold ${isDark ? 'text-light' : ''}`}>{groupLabel}</span>
                              <span className={`badge rounded-pill ms-auto ${isDark ? 'bg-dark text-light border border-secondary' : 'bg-light text-dark'}`} style={{ fontSize: '10px' }}>{perms.length}</span>
                            </div>
                          </div>
                          <div className="card-body p-2">
                            {perms.map(p => {
                              const permNumericId = resolvePermissionId(p.id);
                              const isChecked = targetMode === 'roles' ? matrixState[activeRoleId]?.includes(permNumericId) : userOverrides[activeUserId]?.includes(permNumericId);
                              const isInherited = targetMode === 'users' && activeUserRole?.permissions?.some(rp => rp.id === permNumericId);
                              
                              // Visual status configuration
                              let cardBgClass = isDark ? 'bg-dark border-secondary' : 'bg-light border';
                              let borderStyle = isDark ? '1px solid #334155' : '1px solid #e2e8f0';
                              if (isInherited) {
                                cardBgClass = 'bg-success bg-opacity-10 border-success border-opacity-20';
                                borderStyle = '1px solid rgba(25, 135, 84, 0.15)';
                              } else if (isChecked) {
                                cardBgClass = 'bg-primary bg-opacity-10 border-primary border-opacity-20';
                                borderStyle = '1px solid rgba(13, 110, 253, 0.15)';
                              }

                              return (
                                <div
                                  key={p.id}
                                  className={`d-flex align-items-center justify-content-between px-3 py-2.5 rounded-3 mb-2 cursor-pointer transition-all hover-scale ${cardBgClass}`}
                                  style={{
                                    cursor: isInherited ? 'default' : 'pointer',
                                    border: borderStyle,
                                    boxShadow: isChecked && !isInherited ? '0 4px 12px rgba(13, 110, 253, 0.08)' : 'none',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onClick={() => !isInherited && togglePermission(targetMode === 'roles' ? activeRoleId : activeUserId, p.id)}
                                >
                                  <div className="min-w-0 me-2">
                                    <span className="small fw-semibold d-block text-dark-emphasis">
                                      {highlightText(p.name, searchTerm)}
                                      {isInherited && (
                                        <span className="badge bg-success bg-opacity-75 text-white ms-1 fw-bold align-middle" style={{ fontSize: '8px', letterSpacing: '0.04em' }}>Inherited</span>
                                      )}
                                      {isChecked && !isInherited && targetMode === 'users' && (
                                        <span className="badge bg-primary bg-opacity-75 text-white ms-1 fw-bold align-middle" style={{ fontSize: '8px', letterSpacing: '0.04em' }}>Override</span>
                                      )}
                                    </span>
                                    <small className="text-muted d-block text-truncate mt-0.5" style={{ maxWidth: '280px', fontSize: '10px' }}>
                                      {highlightText(p.description, searchTerm)}
                                    </small>
                                    <code className="text-muted mt-1 d-inline-block font-monospace" style={{ fontSize: '9px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', padding: '1px 4px', borderRadius: '3px' }}>{p.id}</code>
                                  </div>
                                  <div className="form-check form-switch m-0 flex-shrink-0">
                                    <input
                                      className="form-check-input cursor-pointer"
                                      type="checkbox"
                                      checked={isChecked || isInherited || false}
                                      disabled={isInherited}
                                      readOnly
                                      style={{
                                        cursor: isInherited ? 'default' : 'pointer',
                                        width: '1.8em',
                                        height: '0.9em',
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(groupedBySystem).length === 0 && (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faShield} className="text-muted opacity-25 mb-3" style={{ fontSize: '3rem' }} />
          <p className="text-muted">No features match your search.</p>
        </div>
      )}

      {/* Floating Unsaved Changes Toast Banner */}
      {isDirty && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 shadow-lg border rounded-4 p-3 d-flex align-items-center justify-content-between gap-4 animate-slide-up"
          style={{
            zIndex: 1050,
            width: '450px',
            maxWidth: '90vw',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.15)',
            background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-warning bg-opacity-10 text-warning p-2.5 d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={faInfoCircle} className="animate-pulse" size="sm" />
            </div>
            <div>
              <span className={`fw-bold d-block ${isDark ? 'text-light' : 'text-dark'}`} style={{ fontSize: '13px' }}>Unsaved Changes</span>
              <span className="text-muted small" style={{ fontSize: '11px' }}>Permissions have been modified. Commit your updates now.</span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${isDark ? 'btn-outline-light' : 'btn-outline-secondary'}`} style={{ fontSize: '12px' }} onClick={handleReset} disabled={saving}>Discard</button>
            <button className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold shadow-sm ${isDark ? 'btn-light text-dark' : 'btn-dark'}`} style={{ fontSize: '12px' }} onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm"></span> : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .bg-light-subtle { background-color: #f8fafc !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-success-subtle { background-color: #f0fdf4 !important; }
        .cursor-pointer { cursor: pointer; }
        .btn-white { background: white; color: #64748b; }
        .btn-white:hover { background: #f1f5f9; color: #0d6efd; border-color: #0d6efd !important; }
        .sticky-top { top: 0; }
        
        /* Grid matrix highlights */
        .matrix-row-hovered {
          background-color: rgba(79, 70, 229, 0.02) !important;
        }
        .matrix-col-hovered {
          background-color: rgba(79, 70, 229, 0.015) !important;
        }
        .matrix-col-header-hovered {
          background-color: rgba(79, 70, 229, 0.04) !important;
        }
        .matrix-cell-hovered {
          background-color: rgba(79, 70, 229, 0.06) !important;
        }
        
        /* Scale hover effects */
        .hover-scale {
          transition: all 0.2s ease;
        }
        .hover-scale:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .no-hover:hover { transform: none !important; box-shadow: var(--bs-card-box-shadow, inherit) !important; }

        /* Animations */
        @keyframes slideUp {
          from { transform: translate(-50%, 40px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pulse {
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        ${isDark ? `
          .bg-light-subtle { background-color: #1e293b !important; }
          .bg-dark-header { background-color: #0f172a !important; }
          .bg-dark-card { background-color: #1e293b !important; }
          .table { color: #cbd5e1; }
          .table-hover tbody tr:hover { color: #e2e8f0; background-color: rgba(255,255,255,0.02); }
          .table td, .table th { border-color: #334155; }
          .table > :not(caption) > * > * { border-bottom-color: #334155; }
          .btn-white { background: #1e293b; color: #94a3b8; border-color: #334155; }
          .btn-white:hover { background: #334155; color: #e2e8f0; border-color: #6366f1 !important; }
          .form-check-input { background-color: #334155; border-color: #475569; }
          .form-check-input:checked { background-color: #6366f1; border-color: #6366f1; }
          .hover-scale:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
          .dropdown-menu { background-color: #1e293b; border-color: #334155; }
          .dropdown-item { color: #cbd5e1; }
          .dropdown-item:hover { background-color: #334155; color: #f1f5f9; }
        ` : ''}
      `}</style>
    </div>
  );
};

export default Permissions;
