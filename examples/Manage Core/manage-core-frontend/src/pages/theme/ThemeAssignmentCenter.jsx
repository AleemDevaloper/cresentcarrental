import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette, faSitemap, faUserShield, faUsers, faBuilding,
  faCogs, faLock, faLockOpen, faSave, faEye, faFileUpload,
  faHistory, faTrash, faUndo, faCheckCircle, faChartPie,
  faArrowRight, faInfoCircle, faExclamationTriangle, faFilter,
  faSearch, faPlus, faEdit, faTimes, faChevronDown, faChevronUp,
  faPaintBrush, faColumns, faDownload, faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { EnableDisableButton } from '../../components/common';
import client, { clearCache } from '../../api/client';

const DEFAULT_THEME_CONFIG = {
  name: 'Corporate Blue',
  mode: 'Light',
  primaryColor: '#2563eb',
  secondaryColor: '#6366f1',
  accentColor: '#38bdf8',
  sidebarType: 'Expanded',
  sidebarPosition: 'Left',
  themeStyle: 'simple',
  panelStyle: 'shadow',
  navbarBehavior: 'sticky',
  contentLayout: 'wide',
  sidebarMode: 'simple',
  sidebarBg: '#ffffff',
  sidebarText: '#1e293b',
  sidebarDarkBg: '#0F172A',
  sidebarDarkText: '#f8fafc',
  sidebarIconColor: '#4F46E5',
  sidebarLabelColor: '#6c757d',
  sidebarWidth: '260',
};

const SCOPE_ICONS = {
  organization: faBuilding,
  roles: faUserShield,
  departments: faUsers,
  teams: faSitemap,
  users: faUsers,
};

const ThemeAssignmentCenter = () => {
  const { t } = useTranslation();
  const { addNotification, themeStyle, globalPanelStyle, navbarBehavior, contentLayout } = useApp();

  const [activeScope, setActiveScope] = useState('organization');
  const [loading, setLoading] = useState(false);
  const [themeConfigs, setThemeConfigs] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [config, setConfig] = useState(DEFAULT_THEME_CONFIG);

  // Assignment Options
  const [assignmentOptions, setAssignmentOptions] = useState({
    applyTheme: true,
    applySidebar: true,
    applyDashboard: true,
    applyNavigation: true,
    lockSettings: false,
  });

  // User selection for bulk assign
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleSearch, setRoleSearch] = useState('');

  // Show saved configs dropdown
  const [showConfigDropdown, setShowConfigDropdown] = useState(false);

  // Refresh counter
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [configsRes, assignmentsRes, logsRes] = await Promise.all([
        client.get('/theme-configs'),
        client.get('/theme-assignments'),
        client.get('/theme-logs')
      ]);
      setThemeConfigs(configsRes.data || []);
      setAssignments(assignmentsRes.data || []);
      setActivityLogs(logsRes.data || []);
    } catch (error) {
      console.error("Error fetching theme data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchScopeData = useCallback(async () => {
    try {
      const [usersRes, rolesRes, departmentsRes, teamsRes] = await Promise.all([
        client.get('/theme-users'),
        client.get('/theme-roles'),
        client.get('/theme-departments'),
        client.get('/theme-teams')
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (error) {
      console.error("Error fetching scope data", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchScopeData();
  }, [refreshKey, fetchData, fetchScopeData]);

  const loadCurrentThemeSettings = () => {
    try {
      const storedTheme = JSON.parse(localStorage.getItem('admin_theme_settings') || '{}');
      const storedSidebar = JSON.parse(localStorage.getItem('admin_sidebar_theme_settings') || '{}');

      const newConfig = {
        ...config,
        primaryColor: storedTheme.primary || storedTheme.primaryColor || config.primaryColor,
        secondaryColor: storedTheme.secondary || storedTheme.secondaryColor || config.secondaryColor,
        themeStyle: storedTheme.mode || themeStyle || config.themeStyle,
        panelStyle: globalPanelStyle || config.panelStyle,
        navbarBehavior: navbarBehavior || config.navbarBehavior,
        contentLayout: contentLayout || config.contentLayout,
        sidebarBg: storedSidebar.sidebarBg || storedSidebar.customColor || config.sidebarBg,
        sidebarText: storedSidebar.sidebarText || config.sidebarText,
        sidebarDarkBg: storedSidebar.darkSidebarBg || storedSidebar.sidebarDarkBg || config.sidebarDarkBg,
        sidebarDarkText: storedSidebar.darkSidebarText || storedSidebar.sidebarDarkText || config.sidebarDarkText,
        sidebarIconColor: storedSidebar.sidebarIconColor || config.sidebarIconColor,
        sidebarLabelColor: storedSidebar.sidebarLabelColor || config.sidebarLabelColor,
        sidebarWidth: storedSidebar.sidebarWidth || storedSidebar.sidebarWidthEnabled === false ? '260' : String(storedSidebar.sidebarWidth || '260'),
        sidebarMode: storedSidebar.mode || 'simple',
      };
      if (storedTheme.gradientFrom) newConfig.accentColor = storedTheme.gradientFrom;
      if (storedTheme.gradientTo) newConfig.secondaryColor = storedTheme.gradientTo;

      setConfig(newConfig);
      addNotification("Current theme & sidebar settings loaded!", "success");
    } catch (e) {
      addNotification("Failed to load current theme settings", "danger");
    }
  };

  const loadConfig = (cfg) => {
    const s = cfg.settings || {};
    setConfig({
      ...DEFAULT_THEME_CONFIG,
      ...s,
      name: cfg.name || s.name || 'Untitled',
    });
    setSelectedConfigId(cfg.id);
    setShowConfigDropdown(false);
    addNotification(`Loaded config: ${cfg.name}`, "info");
  };

  const handleSaveConfig = async () => {
    if (!config.name.trim()) {
      addNotification("Please enter a theme name", "danger");
      return;
    }
    setSaving(true);
    try {
      if (selectedConfigId) {
        const res = await client.put(`/theme-configs/${selectedConfigId}`, {
          name: config.name,
          settings: config,
        });
        clearCache('/theme');
        setThemeConfigs(prev => prev.map(c => c.id === selectedConfigId ? res.data : c));
        addNotification("Theme configuration updated!", "success");
      } else {
        const res = await client.post('/theme-configs', {
          name: config.name,
          settings: config,
        });
        clearCache('/theme');
        setThemeConfigs(prev => [res.data, ...prev]);
        setSelectedConfigId(res.data.id);
        addNotification("Theme configuration saved!", "success");
      }
    } catch (error) {
      addNotification("Failed to save configuration", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfig = async (id) => {
    if (!window.confirm('Delete this theme configuration permanently?')) return;
    try {
      await client.delete(`/theme-configs/${id}`);
      setThemeConfigs(prev => prev.filter(c => c.id !== id));
      if (selectedConfigId === id) {
        setSelectedConfigId(null);
        setConfig(DEFAULT_THEME_CONFIG);
      }
      addNotification("Configuration deleted", "success");
    } catch (error) {
      addNotification("Failed to delete configuration", "danger");
    }
  };

  const handlePublish = async (scope, targetId = null, targetLabel = '') => {
    const configId = selectedConfigId || themeConfigs[0]?.id;
    if (!configId) {
      addNotification("Please save a theme configuration first", "warning");
      return;
    }
    if (scope === 'Organization' && !window.confirm('Apply this theme to the entire organization? This will affect all users.')) return;

    setSaving(true);
    try {
      await client.post('/theme-assignments', {
        theme_config_id: configId,
        assignable_type: scope,
        assignable_id: targetId,
        options: assignmentOptions,
        lock_settings: { lock_theme: assignmentOptions.lockSettings, lock_sidebar: assignmentOptions.lockSettings },
        priority: scope === 'User' ? 100 : scope === 'Role' ? 50 : scope === 'Team' ? 30 : scope === 'Department' ? 20 : 0,
      });
      clearCache('/theme');
      addNotification(`Theme published to ${scope}${targetLabel ? ': ' + targetLabel : ''}!`, "success");
      fetchData();
    } catch (error) {
      addNotification("Failed to publish theme", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm('Remove this theme assignment?')) return;
    try {
      await client.delete(`/theme-assignments/${id}`);
      setAssignments(prev => prev.filter(a => a.id !== id));
      addNotification("Assignment removed", "success");
    } catch (error) {
      addNotification("Failed to remove assignment", "danger");
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkAssign = async () => {
    if (selectedUserIds.length === 0) {
      addNotification("Select at least one user", "warning");
      return;
    }
    for (const userId of selectedUserIds) {
      await handlePublish('User', userId);
    }
    setSelectedUserIds([]);
    addNotification(`Theme assigned to ${selectedUserIds.length} users!`, "success");
  };

  // Preview colors
  const previewPrimary = config.primaryColor || '#2563eb';
  const previewSidebarBg = config.sidebarBg || '#ffffff';

  // KPI computations
  const kpiData = useMemo(() => ({
    totalThemes: themeConfigs.length,
    activeAssignments: assignments.length,
    usersAssigned: assignments.filter(a => a.assignable_type === 'User').length,
    roleAssignments: assignments.filter(a => a.assignable_type === 'Role').length,
    deptAssignments: assignments.filter(a => a.assignable_type === 'Department').length,
    orgCoverage: assignments.some(a => a.assignable_type === 'Organization') ? 'Active' : 'Inactive',
  }), [themeConfigs, assignments]);

  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const q = userSearch.toLowerCase();
    return users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const filteredRoles = useMemo(() => {
    if (!roleSearch) return roles;
    const q = roleSearch.toLowerCase();
    return roles.filter(r => r.name?.toLowerCase().includes(q));
  }, [roles, roleSearch]);

  const existingAssignmentForTarget = (type, id) => {
    return assignments.find(a => a.assignable_type === type && a.assignable_id === id);
  };

  const KpiCard = ({ title, value, icon, color }) => (
    <div className="col-xl-2 col-lg-4 col-md-6 mb-4">
      <div className="card border-0 shadow-sm h-100 transition hover-lift">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className={`rounded-circle bg-${color}-subtle p-3`}>
              <FontAwesomeIcon icon={icon} className={`text-${color}`} />
            </div>
            <span className="badge bg-light text-dark">Live</span>
          </div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );

  const selectedConfigName = selectedConfigId
    ? themeConfigs.find(c => c.id === selectedConfigId)?.name || 'Custom'
    : 'None selected';

  return (
    <div className="theme-assignment-center px-2">
      {/* Header Actions */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold mb-1">{t('theme_assignment_center')}</h4>
          <p className="text-muted small mb-0">{t('theme_assignment_desc')}</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-info btn-sm" onClick={loadCurrentThemeSettings} title="Load your current theme & sidebar settings">
            <FontAwesomeIcon icon={faDownload} className="me-2" /> Load My Theme
          </button>
          <div className="dropdown">
            <button className="btn btn-outline-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" onClick={() => setShowConfigDropdown(!showConfigDropdown)}>
              <FontAwesomeIcon icon={faColumns} className="me-2" /> Config: {selectedConfigName}
            </button>
            <ul className="dropdown-menu shadow border-0" style={{ maxHeight: '300px', overflow: 'auto' }}>
              <li><h6 className="dropdown-header">Saved Configurations</h6></li>
              {themeConfigs.length === 0 && <li><span className="dropdown-item text-muted">No saved configs</span></li>}
              {themeConfigs.map(cfg => (
                <li key={cfg.id} className="d-flex align-items-center">
                  <button className="dropdown-item small flex-grow-1" onClick={() => loadConfig(cfg)}>
                    <FontAwesomeIcon icon={faPalette} className="me-2 text-primary" />
                    {cfg.name}
                  </button>
                  <button className="btn btn-link btn-sm text-danger p-1 me-1" onClick={() => handleDeleteConfig(cfg.id)} title="Delete">
                    <FontAwesomeIcon icon={faTrash} size="xs" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSaveConfig} disabled={saving}>
            <FontAwesomeIcon icon={faSave} className="me-2" /> {selectedConfigId ? 'Update' : 'Save'} Config
          </button>
          <button className="btn btn-success btn-sm" onClick={() => handlePublish('Organization')} disabled={saving}>
            <FontAwesomeIcon icon={faFileUpload} className="me-2" /> Publish Org-Wide
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="row mb-2">
        <KpiCard title="Total Themes" value={kpiData.totalThemes} icon={faPalette} color="primary" />
        <KpiCard title="Active Assignments" value={kpiData.activeAssignments} icon={faCheckCircle} color="success" />
        <KpiCard title="Users Assigned" value={kpiData.usersAssigned} icon={faUsers} color="info" />
        <KpiCard title="Role Assignments" value={kpiData.roleAssignments} icon={faUserShield} color="warning" />
        <KpiCard title="Dept Assignments" value={kpiData.deptAssignments} icon={faBuilding} color="danger" />
        <KpiCard title="Org Coverage" value={kpiData.orgCoverage} icon={faChartPie} color="secondary" />
      </div>

      {/* System Stats Row */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ background: 'rgba(79,70,229,0.1)', width: 38, height: 38 }}>
              <FontAwesomeIcon icon={faChartPie} className="text-primary" style={{ fontSize: 16 }} />
            </div>
            <h5 className="fw-bold mb-0 text-muted">System Scope Overview</h5>
          </div>
        </div>
        <div className="col-md-4 col-lg-3 col-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition hover-lift-sm">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(79,70,229,0.12)' }}>
                <FontAwesomeIcon icon={faUsers} className="text-primary fs-5" />
              </div>
              <div>
                <div className="fw-bold fs-3 lh-1 mb-1">{users.length}</div>
                <div className="text-muted small fw-semibold">Total Users</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-3 col-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition hover-lift-sm">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(16,185,129,0.12)' }}>
                <FontAwesomeIcon icon={faUserShield} className="text-success fs-5" />
              </div>
              <div>
                <div className="fw-bold fs-3 lh-1 mb-1">{roles.length}</div>
                <div className="text-muted small fw-semibold">Total Roles</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-3 col-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition hover-lift-sm">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(245,158,11,0.12)' }}>
                <FontAwesomeIcon icon={faBuilding} className="text-warning fs-5" />
              </div>
              <div>
                <div className="fw-bold fs-3 lh-1 mb-1">1</div>
                <div className="text-muted small fw-semibold">Organizations</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-3 col-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition hover-lift-sm">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(6,182,212,0.12)' }}>
                <FontAwesomeIcon icon={faBuilding} className="text-info fs-5" />
              </div>
              <div>
                <div className="fw-bold fs-3 lh-1 mb-1">{departments.length}</div>
                <div className="text-muted small fw-semibold">Departments</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 col-lg-3 col-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 transition hover-lift-sm">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(239,68,68,0.12)' }}>
                <FontAwesomeIcon icon={faSitemap} className="text-danger fs-5" />
              </div>
              <div>
                <div className="fw-bold fs-3 lh-1 mb-1">{teams.length}</div>
                <div className="text-muted small fw-semibold">Teams</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Assignments Bar */}
      {assignments.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-2 px-3">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="small fw-bold text-muted me-2">
                <FontAwesomeIcon icon={faSitemap} className="me-1" />{assignments.length} Active:
              </span>
              {assignments.slice(0, 5).map(a => (
                <span key={a.id} className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 px-2 py-1">
                  {a.assignable_type} #{a.assignable_id || '*'}
                  <button className="btn btn-link btn-sm text-danger p-0 ms-1" style={{ fontSize: '10px', lineHeight: 1 }} onClick={() => handleDeleteAssignment(a.id)} title="Remove">
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              ))}
              {assignments.length > 5 && <span className="small text-muted">+{assignments.length - 5} more</span>}
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        {/* Left Side: Theme Configuration with Preview */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <FontAwesomeIcon icon={faCogs} className="me-2 text-primary" /> Theme Configuration
              </h5>
              <span className="badge bg-primary rounded-pill">
                <FontAwesomeIcon icon={faEye} className="me-1" />Live Preview
              </span>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase text-muted">Appearance Mode</label>
                  <div className="d-flex gap-2">
                    {['Light', 'Dark', 'Auto', 'Custom'].map(mode => (
                      <button key={mode}
                        className={`btn btn-sm ${config.mode === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setConfig({ ...config, mode })}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold small text-uppercase text-muted">Theme Name</label>
                  <input type="text" className="form-control form-control-sm"
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })} />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Primary Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="color" className="form-control form-control-color p-0 border-0"
                      style={{ width: 40, height: 40 }}
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} />
                    <input type="text" className="form-control form-control-sm"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Secondary Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="color" className="form-control form-control-color p-0 border-0"
                      style={{ width: 40, height: 40 }}
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} />
                    <input type="text" className="form-control form-control-sm"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Accent Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="color" className="form-control form-control-color p-0 border-0"
                      style={{ width: 40, height: 40 }}
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })} />
                    <input type="text" className="form-control form-control-sm"
                      value={config.accentColor}
                      onChange={(e) => setConfig({ ...config, accentColor: e.target.value })} />
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Sidebar Style</label>
                  <select className="form-select form-select-sm" value={config.sidebarType}
                    onChange={(e) => setConfig({ ...config, sidebarType: e.target.value })}>
                    <option>Expanded</option>
                    <option>Collapsed</option>
                    <option>Floating</option>
                    <option>Mini Sidebar</option>
                    <option>Horizontal Navigation</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Sidebar Position</label>
                  <select className="form-select form-select-sm" value={config.sidebarPosition}
                    onChange={(e) => setConfig({ ...config, sidebarPosition: e.target.value })}>
                    <option>Left</option>
                    <option>Right</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Sidebar Width (px)</label>
                  <input type="number" className="form-control form-control-sm"
                    value={parseInt(config.sidebarWidth) || 260}
                    onChange={(e) => setConfig({ ...config, sidebarWidth: e.target.value })} />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Sidebar Background</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="color" className="form-control form-control-color p-0 border-0"
                      style={{ width: 40, height: 40 }}
                      value={config.sidebarBg}
                      onChange={(e) => setConfig({ ...config, sidebarBg: e.target.value })} />
                    <input type="text" className="form-control form-control-sm"
                      value={config.sidebarBg}
                      onChange={(e) => setConfig({ ...config, sidebarBg: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Sidebar Text</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="color" className="form-control form-control-color p-0 border-0"
                      style={{ width: 40, height: 40 }}
                      value={config.sidebarText}
                      onChange={(e) => setConfig({ ...config, sidebarText: e.target.value })} />
                    <input type="text" className="form-control form-control-sm"
                      value={config.sidebarText}
                      onChange={(e) => setConfig({ ...config, sidebarText: e.target.value })} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Sidebar Icon Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input type="color" className="form-control form-control-color p-0 border-0"
                      style={{ width: 40, height: 40 }}
                      value={config.sidebarIconColor}
                      onChange={(e) => setConfig({ ...config, sidebarIconColor: e.target.value })} />
                    <input type="text" className="form-control form-control-sm"
                      value={config.sidebarIconColor}
                      onChange={(e) => setConfig({ ...config, sidebarIconColor: e.target.value })} />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="p-3 bg-light rounded-3 border">
                    <h6 className="fw-bold mb-3">
                      <FontAwesomeIcon icon={faEye} className="me-2" /> Live Theme Preview
                    </h6>
                    <div className="preview-window rounded border bg-white shadow-sm overflow-hidden" style={{ height: '220px' }}>
                      <div className="d-flex h-100">
                        {/* Preview Sidebar */}
                        <div className="sidebar-preview d-flex flex-column" style={{
                          width: '50px',
                          background: config.sidebarBg || '#f8fafc',
                          borderRight: `1px solid ${config.sidebarText}22`,
                          padding: '8px 4px',
                          flexShrink: 0,
                        }}>
                          <div style={{ width: 28, height: 28, background: previewPrimary, borderRadius: 8, margin: '0 auto 12px' }}></div>
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="d-flex align-items-center justify-content-center mb-2" style={{
                              width: 32, height: 32, borderRadius: 8,
                              background: i === 2 ? previewPrimary + '22' : 'transparent',
                              color: config.sidebarIconColor || '#6b7280',
                              fontSize: 12, fontWeight: 600,
                            }}>
                              <FontAwesomeIcon icon={faColumns} size="xs" />
                            </div>
                          ))}
                        </div>
                        {/* Preview Content */}
                        <div className="flex-grow-1 d-flex flex-column">
                          {/* Navbar */}
                          <div className="navbar-preview d-flex align-items-center px-3" style={{
                            height: '24px',
                            background: previewPrimary,
                            flexShrink: 0,
                          }}>
                            <div className="d-flex gap-1">
                              <div style={{ width: 20, height: 4, background: 'rgba(255,255,255,0.6)', borderRadius: 2 }}></div>
                              <div style={{ width: 30, height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }}></div>
                            </div>
                            <div className="ms-auto d-flex gap-1">
                              <div style={{ width: 16, height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: 2 }}></div>
                            </div>
                          </div>
                          {/* Content area */}
                          <div className="p-3 flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: previewPrimary }}></div>
                              <div style={{ width: 100, height: 8, background: '#e2e8f0', borderRadius: 4 }}></div>
                            </div>
                            <div className="row g-2">
                              <div className="col-4"><div style={{ height: 30, background: previewPrimary + '15', borderRadius: 6, border: `1px solid ${previewPrimary}30` }}></div></div>
                              <div className="col-4"><div style={{ height: 30, background: '#f1f5f9', borderRadius: 6 }}></div></div>
                              <div className="col-4"><div style={{ height: 30, background: '#f1f5f9', borderRadius: 6 }}></div></div>
                              <div className="col-6"><div style={{ height: 20, background: '#f8fafc', borderRadius: 4 }}></div></div>
                              <div className="col-6"><div style={{ height: 20, background: '#f8fafc', borderRadius: 4 }}></div></div>
                            </div>
                            {/* Button preview */}
                            <div className="mt-2 d-flex gap-2">
                              <div style={{ height: 14, width: 50, background: previewPrimary, borderRadius: 4 }}></div>
                              <div style={{ height: 14, width: 50, background: config.secondaryColor || '#6366f1', borderRadius: 4 }}></div>
                              <div style={{ height: 14, width: 50, background: '#e2e8f0', borderRadius: 4 }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-muted small mt-2 mb-0">
                      Preview updates in real-time. Shows primary, sidebar, and accent colors applied.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" /> Assignment Activity Feed
              </h5>
              <button className="btn btn-link btn-sm p-0" onClick={() => fetchData()}>
                <FontAwesomeIcon icon={faUndo} className="me-1" />Refresh
              </button>
            </div>
            <div className="card-body p-0" style={{ maxHeight: '320px', overflow: 'auto' }}>
              <div className="list-group list-group-flush">
                {activityLogs.length > 0 ? activityLogs.map((log, index) => (
                  <div key={index} className="list-group-item p-3 border-0 border-bottom">
                    <div className="d-flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="rounded-circle bg-primary-subtle p-2 text-primary d-flex align-items-center justify-content-center"
                          style={{ width: '35px', height: '35px' }}>
                          <FontAwesomeIcon icon={
                            log.action?.includes('config') ? faPalette :
                            log.action?.includes('assign') ? faSitemap :
                            log.action?.includes('delet') ? faTrash : faHistory
                          } size="sm" />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-0 small fw-bold">{log.description}</p>
                        <div className="d-flex gap-2 align-items-center">
                          <span className="text-muted" style={{ fontSize: '11px' }}>
                            {log.created_at ? new Date(log.created_at).toLocaleString() : ''}
                          </span>
                          {log.user && (
                            <span className="badge bg-light text-muted" style={{ fontSize: '10px' }}>{log.user.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-center text-muted">
                    <FontAwesomeIcon icon={faHistory} className="me-2 opacity-50" />
                    No recent activity logs.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Assignment Controls */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="mb-0 fw-bold">
                <FontAwesomeIcon icon={faSitemap} className="me-2 text-primary" /> Enterprise Assignment Builder
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="p-3 bg-light border-bottom">
                <div className="nav nav-pills nav-fill gap-2" id="assignment-tabs">
                  {['Organization', 'Roles', 'Departments', 'Teams', 'Users'].map(scope => (
                    <button key={scope}
                      className={`nav-link py-2 small fw-bold ${activeScope === scope.toLowerCase() ? 'active' : 'bg-white border text-dark'}`}
                      onClick={() => setActiveScope(scope.toLowerCase())}>
                      <FontAwesomeIcon icon={SCOPE_ICONS[scope.toLowerCase()] || faSitemap} className="me-1" />
                      {scope}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {activeScope === 'organization' && (
                  <div className="fade-in">
                    <div className="d-flex align-items-center justify-content-between p-3 bg-primary-subtle rounded-3 border border-primary mb-4">
                      <div>
                        <h6 className="fw-bold mb-1 text-primary">Apply to Entire Organization</h6>
                        <p className="small mb-0 text-primary opacity-75">Every user receives selected theme immediately.</p>
                      </div>
                        <EnableDisableButton
                          checked={assignmentOptions.applyTheme}
                          onClick={() => setAssignmentOptions({ ...assignmentOptions, applyTheme: !assignmentOptions.applyTheme })}
                          label="Apply Theme"
                          size="small" />
                    </div>
                    <div className="alert alert-warning border-0 small d-flex gap-3">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mt-1" />
                      <div>
                        <strong>Administrator Confirmation Required:</strong> Enabling organization-wide themes will override individual settings for all users unless specifically locked by other assignments.
                      </div>
                    </div>
                    <button className="btn btn-primary w-100 py-2 fw-bold"
                      onClick={() => handlePublish('Organization')} disabled={saving}>
                      <FontAwesomeIcon icon={faFileUpload} className="me-2" />
                      Publish to Organization
                    </button>
                    {assignments.filter(a => a.assignable_type === 'Organization').length > 0 && (
                      <div className="mt-3">
                        <span className="badge bg-success">Organization theme is active</span>
                      </div>
                    )}
                  </div>
                )}

                {activeScope === 'roles' && (
                  <div className="fade-in">
                    <div className="input-group input-group-sm mb-3">
                      <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faSearch} /></span>
                      <input type="text" className="form-control border-start-0" placeholder="Search roles..."
                        value={roleSearch} onChange={(e) => setRoleSearch(e.target.value)} />
                    </div>
                    <div className="table-responsive" style={{ maxHeight: '340px', overflow: 'auto' }}>
                      <table className="table table-hover align-middle border-top">
                        <thead>
                          <tr className="small text-muted text-uppercase">
                            <th>Role</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRoles.length > 0 ? filteredRoles.map(role => {
                            const existing = existingAssignmentForTarget('Role', role.id);
                            return (
                              <tr key={role.id}>
                                <td><span className="fw-bold small">{role.name}</span></td>
                                <td className="text-center">
                                  {existing ? <span className="badge bg-success-subtle text-success">Assigned</span> : <span className="badge bg-light text-muted">Unassigned</span>}
                                </td>
                                <td className="text-center">
                                  <button className="btn btn-primary btn-sm px-3"
                                    onClick={() => handlePublish('Role', role.id, role.name)} disabled={saving}>
                                    Assign
                                  </button>
                                </td>
                              </tr>
                            );
                          }) : (
                            <tr><td colSpan="3" className="text-center text-muted py-4">No roles found</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeScope === 'departments' && (
                  <div className="fade-in">
                    {departments.length > 0 ? (
                      <div className="row g-3" style={{ maxHeight: '380px', overflow: 'auto' }}>
                        {departments.map(dept => {
                          const existing = existingAssignmentForTarget('Department', dept.id);
                          return (
                            <div key={dept.id} className="col-md-6">
                              <div className="card border p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="fw-bold small">{dept.name}</span>
                                  {existing && <span className="badge bg-success-subtle text-success" style={{ fontSize: '10px' }}>Active</span>}
                                </div>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-primary btn-sm flex-grow-1"
                                    onClick={() => handlePublish('Department', dept.id, dept.name)} disabled={saving}>
                                    Assign
                                  </button>
                                  {existing && (
                                    <button className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteAssignment(existing.id)}>
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">No departments found</div>
                    )}
                  </div>
                )}

                {activeScope === 'teams' && (
                  <div className="fade-in">
                    {teams.length > 0 ? (
                      <div className="row g-3" style={{ maxHeight: '380px', overflow: 'auto' }}>
                        {teams.map(team => {
                          const existing = existingAssignmentForTarget('Team', team.id);
                          return (
                            <div key={team.id} className="col-md-12">
                              <div className="card border p-3 d-flex flex-row justify-content-between align-items-center">
                                <div>
                                  <span className="fw-bold small">{team.name}</span>
                                  {existing && (
                                    <p className="mb-0 text-muted" style={{ fontSize: '10px' }}>
                                      Theme: {existing.themeConfig?.name || 'Unknown'}
                                    </p>
                                  )}
                                </div>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-primary btn-sm"
                                    onClick={() => handlePublish('Team', team.id, team.name)} disabled={saving}>
                                    Assign
                                  </button>
                                  {existing ? (
                                    <button className="btn btn-outline-danger btn-sm"
                                      onClick={() => handleDeleteAssignment(existing.id)}>
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  ) : (
                                    <button className="btn btn-outline-secondary btn-sm" disabled>
                                      <FontAwesomeIcon icon={faLock} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-4">No teams found</div>
                    )}
                  </div>
                )}

                {activeScope === 'users' && (
                  <div className="fade-in">
                    <div className="input-group input-group-sm mb-3">
                      <span className="input-group-text bg-white border-end-0"><FontAwesomeIcon icon={faSearch} /></span>
                      <input type="text" className="form-control border-start-0" placeholder="Search by name, email or role..."
                        value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                      <button className="btn btn-outline-secondary border" title="Filter">
                        <FontAwesomeIcon icon={faFilter} />
                      </button>
                    </div>
                    <div className="user-selection-list rounded border overflow-auto" style={{ maxHeight: '260px' }}>
                      {filteredUsers.length > 0 ? filteredUsers.map(u => (
                        <div key={u.id}
                          className={`p-2 border-bottom d-flex align-items-center justify-content-between hover-bg-light ${selectedUserIds.includes(u.id) ? 'bg-primary-subtle' : ''}`}
                          onClick={() => toggleUserSelection(u.id)}
                          style={{ cursor: 'pointer' }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="form-check">
                              <input className="form-check-input" type="checkbox"
                                checked={selectedUserIds.includes(u.id)}
                                onChange={() => toggleUserSelection(u.id)}
                                onClick={(e) => e.stopPropagation()} />
                            </div>
                            <div className="rounded-circle bg-secondary text-white small d-flex align-items-center justify-content-center"
                              style={{ width: '30px', height: '30px', fontSize: '10px', fontWeight: 700 }}>
                              {u.name?.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="mb-0 small fw-bold">{u.name}</p>
                              <span className="text-muted" style={{ fontSize: '10px' }}>
                                {u.email} {u.role ? `• ${u.role}` : ''}
                              </span>
                            </div>
                          </div>
                          {existingAssignmentForTarget('User', u.id) && (
                            <span className="badge bg-success-subtle text-success" style={{ fontSize: '9px' }}>Assigned</span>
                          )}
                        </div>
                      )) : (
                        <div className="p-4 text-center text-muted">No users found</div>
                      )}
                    </div>
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                      <span className="small text-muted">{selectedUserIds.length} user(s) selected</span>
                      <div className="d-flex gap-2">
                        {selectedUserIds.length > 0 && (
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedUserIds([])}>
                            Clear
                          </button>
                        )}
                        <button className="btn btn-primary btn-sm px-4 shadow-sm"
                          disabled={selectedUserIds.length === 0 || saving}
                          onClick={handleBulkAssign}>
                          <FontAwesomeIcon icon={faArrowRight} className="me-2" />Bulk Assign ({selectedUserIds.length})
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shared Assignment Options */}
                <div className="mt-4 pt-4 border-top">
                  <h6 className="fw-bold mb-3 small text-uppercase text-muted">Deployment Options</h6>
                  <div className="row g-2">
                    <div className="col-6">
                      <EnableDisableButton
                          checked={assignmentOptions.applyTheme}
                          onClick={() => setAssignmentOptions({ ...assignmentOptions, applyTheme: !assignmentOptions.applyTheme })}
                          label="Apply Palette"
                          size="small" />
                    </div>
                    <div className="col-6">
                      <EnableDisableButton
                          checked={assignmentOptions.applySidebar}
                          onClick={() => setAssignmentOptions({ ...assignmentOptions, applySidebar: !assignmentOptions.applySidebar })}
                          label="Apply Sidebar"
                          size="small" />
                    </div>
                    <div className="col-6">
                      <EnableDisableButton
                          checked={assignmentOptions.applyDashboard}
                          onClick={() => setAssignmentOptions({ ...assignmentOptions, applyDashboard: !assignmentOptions.applyDashboard })}
                          label="Apply Dashboard"
                          size="small" />
                    </div>
                    <div className="col-6">
                      <EnableDisableButton
                          checked={assignmentOptions.lockSettings}
                          onClick={() => setAssignmentOptions({ ...assignmentOptions, lockSettings: !assignmentOptions.lockSettings })}
                          label="Lock Settings"
                          size="small" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm bg-dark text-white p-4 overflow-hidden position-relative">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <FontAwesomeIcon icon={faInfoCircle} size="4x" />
            </div>
            <h5 className="fw-bold mb-2">Enterprise Feature</h5>
            <p className="small opacity-75 mb-3">
              Administrator can enforce settings. When locked, users cannot change assigned settings until an admin modifies them.
            </p>
            <button className="btn btn-warning btn-sm fw-bold px-4">Learn More about Locking</button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift:hover { transform: translateY(-5px); }
        .hover-lift-sm:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important; }
        .transition { transition: all 0.3s ease; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-success-subtle { background-color: #f0fdf4 !important; }
        .bg-info-subtle { background-color: #f0f9ff !important; }
        .bg-warning-subtle { background-color: #fffbeb !important; }
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .hover-bg-light:hover { background-color: #f8fafc; }
        .preview-window { transition: all 0.3s ease; }
        .fade-in { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .user-selection-list::-webkit-scrollbar { width: 4px; }
        .user-selection-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}} />
    </div>
  );
};

export default ThemeAssignmentCenter;
