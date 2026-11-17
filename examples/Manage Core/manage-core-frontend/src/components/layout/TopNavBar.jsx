import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faBoxOpen,
  faChevronDown,
  faCircleCheck,
  faConciergeBell,
  faFileInvoiceDollar,
  faGlobe,
  faGrip,
  faMoon,
  faQuestionCircle,
  faShieldHalved,
  faSignOutAlt,
  faSun,
  faTasks,
  faUser,
  faFolderOpen,
  faHandshake,
  faUsers,
  faIndustry,
  faDollarSign,
  faSave,
  faGraduationCap
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../hooks/useApp";
import { useTranslation } from "../../hooks/useTranslation";
import { listNotifications, markAllAsRead, markAsRead } from "../../api/notifications";
import { getAuthToken } from "../../api/client";
import PWAInstallButton from "../common/PWAInstallButton";
import { normalizeRole } from "../../utils/roles";

const TopNavBar = ({ heading, isSidebarOpen = true, onToggleSidebar }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    activeModule,
    setActiveModule,
    systemContext,
    setSystemContext,
    theme,
    toggleTheme,
    addNotification,
    navbarSettings,
    themeStyle,
    logout,
    navbarBehavior,
    language = 'English',
    setLanguage
  } = useApp();
  const { t } = useTranslation();

  const currentNavbarSettings = navbarSettings || {
    showTime: true,
    showThemeToggle: true,
    showNotifications: true,
    showSystems: true,
    showLanguage: true,
    showPWAInstall: true
  };

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSystems, setShowSystems] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [serverNotifications, setServerNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const systemsRef = useRef(null);
  const languageRef = useRef(null);
  const userRole = normalizeRole(currentUser?.role);

  const languages = [
    { name: 'English', code: 'en', flag: '🇺🇸' },
    { name: 'Spanish', code: 'es', flag: '🇪🇸' },
    { name: 'French', code: 'fr', flag: '🇫🇷' },
    { name: 'German', code: 'de', flag: '🇩🇪' },
    { name: 'Arabic', code: 'ar', flag: '🇦🇪' },
  ];

  const systems = useMemo(() => [
    { id: 'pms', name: t('project_management'), icon: faBoxOpen, color: '#8b5cf6', bg: '#f5f3ff', tab: 'pms_overview', description: t('track_projects_milestones'), permission: 'system_pms' },
    { id: 'hrms', name: t('human_resources'), icon: faUsers, color: '#10b981', bg: '#ecfdf5', tab: 'hrms_overview', description: t('manage_team_attendance'), permission: 'system_hrms' },
    { id: 'fms', name: t('finance_system'), icon: faFileInvoiceDollar, color: '#f59e0b', bg: '#fff7ed', tab: 'fms_overview', description: t('financial_tracking_reports'), permission: 'system_fms' },
    { id: 'ams', name: 'Accounting System', icon: faFileInvoiceDollar, color: '#4f46e5', bg: '#f5f3ff', tab: 'erp_dashboard', description: 'Enterprise accounting, dashboard & sales modules', permission: 'system_ams' },
    { id: 'tms', name: t('task_management'), icon: faTasks, color: '#ef4444', bg: '#fef2f2', tab: 'tms_overview', description: t('personal_team_assignments'), permission: 'system_tms' },
    { id: 'dms', name: t('document_management'), icon: faFolderOpen, color: '#ec4899', bg: '#fdf2f8', tab: 'dms_overview', description: t('manage_documents_files'), permission: 'system_dms' },
    { id: 'crm', name: t('customer_relationship'), icon: faHandshake, color: '#06b6d4', bg: '#ecfeff', tab: 'crm_overview', description: t('manage_customers_leads'), permission: 'system_crm' },
    { id: 'mfg', name: 'Manufacturing', icon: faIndustry, color: '#059669', bg: '#ecfdf5', tab: 'mfg_overview', description: 'Production planning, BOM, & shop floor control', permission: 'system_mfg' },
    { id: 'fx', name: 'Multi-Currency', icon: faDollarSign, color: '#8b5cf6', bg: '#f5f3ff', tab: 'fx_overview', description: 'Currencies, exchange rates, FX transactions & revaluations', permission: 'system_fx' },
    { id: 'ems', name: 'Education', icon: faGraduationCap, color: '#0ea5e9', bg: '#ecfeff', tab: 'ems_overview', description: 'Institutions, Students, Academics & LMS', permission: 'system_ems' },
  ], [t]);

  const allowedSystems = useMemo(() => {
    if (userRole === 'Admin' || userRole === 'SuperAdmin') return systems;
    const userPerms = (currentUser?.permissions?.length ? currentUser.permissions : currentUser?.all_permissions) || [];
    return systems.filter(sys => !sys.permission || userPerms.includes(sys.permission));
  }, [currentUser, userRole, systems]);

  const fetchNotifications = async (silent = false) => {
    if (!userRole || !currentUser || !getAuthToken()) {
      setServerNotifications([]);
      return;
    }
    if (!silent) setNotifLoading(true);
    try {
      const data = await listNotifications(userRole);
      setServerNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.status === 401) {
        setServerNotifications([]);
        return;
      }
      if (!silent) console.error("Notification error:", err);
    } finally {
      if (!silent) setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = window.setInterval(() => fetchNotifications(true), 30000);
    return () => window.clearInterval(intervalId);
  }, [userRole, currentUser]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setServerNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      addNotification("Failed to mark as read", "danger");
      console.error("Mark as read error:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await markAllAsRead();
      setServerNotifications([]);
      setShowNotifications(false);
    } catch (err) {
      addNotification("Failed to clear notifications", "danger");
      console.error("Clear notifications error:", err);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return t('just_now');
    if (diff < 3600) return `${Math.floor(diff / 60)}${t('m_ago')}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}${t('h_ago')}`;
    return date.toLocaleDateString();
  };

  const getNotifIcon = (title = "") => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("project")) return { icon: faBoxOpen, color: "#4f46e5", bg: "#eef2ff" };
    if (titleLower.includes("task")) return { icon: faBell, color: "#f59e0b", bg: "#fff7ed" };
    if (titleLower.includes("milestone")) return { icon: faCircleCheck, color: "#10b981", bg: "#ecfdf5" };
    return { icon: faBell, color: "#6366f1", bg: "#f5f3ff" };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (systemsRef.current && !systemsRef.current.contains(event.target)) setShowSystems(false);
      if (languageRef.current && !languageRef.current.contains(event.target)) setShowLanguage(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
        setShowNotifications(false);
        setShowSystems(false);
        setShowLanguage(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = useMemo(
    () => currentTime.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    [currentTime]
  );

  const goDashboardTab = (tab, module = "dashboard") => {
    setActiveModule(module);
    setActiveTab(tab);
    if (module === "dashboard") {
      setSystemContext(null);
    } else {
      setSystemContext(module);
    }
    setShowDropdown(false);
    setShowNotifications(false);
    setShowSystems(false);
  };

  const handleAccountClick = () => goDashboardTab("admin-settings");

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setShowDropdown(false);
      navigate("/login");
    }
  };

  const unreadCount = serverNotifications.length;

  const stickyStyles = navbarBehavior === 'sticky' ? {
    left: isSidebarOpen ? 'var(--sidebar-width, 16.666667%)' : '80px',
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), all 0.3s ease'
  } : navbarBehavior === 'hidden' ? {
    transform: 'translateY(-100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  } : {};

  return (
    <>
      <nav
        className={`project-topbar z-3 navbar border-bottom px-3 px-lg-4 py-2 ${navbarBehavior === 'sticky' ? 'navbar-sticky' : ''} ${themeStyle === 'view-style' ? 'navbar-view-style' : ''} ${themeStyle === 'simple' ? 'navbar-simple-style' : ''}`}
        style={{ zIndex: 1050, ...stickyStyles }}
      >
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between gap-3 flex-nowrap">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <button
              type="button"
              className="topbar-action-btn rounded"
              title={isSidebarOpen ? t('hide_sidebar') : t('show_sidebar')}
              aria-label={isSidebarOpen ? t('hide_sidebar') : t('show_sidebar')}
              onClick={onToggleSidebar}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>

            <div className="min-w-0 d-flex align-items-center gap-3">
              <div
                className="d-none d-md-flex align-items-center justify-content-center rounded-4 flex-shrink-0 shadow-sm"
                style={{
                  width: 46,
                  height: 46,
                  background: 'linear-gradient(135deg, #4055cf, #007ce2)',
                  color: '#fff',
                  fontSize: 18,
                }}
              >
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="min-w-0">
                <nav aria-label="breadcrumb" className="d-none d-sm-block">
                  <ol className="breadcrumb mb-1 topbar-breadcrumb">
                    <li className="breadcrumb-item">{t('workspace')}</li>
                    <li className="breadcrumb-item active" aria-current="page">{heading}</li>
                  </ol>
                </nav>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h5 className="mb-0 fw-bold text-truncate topbar-title" style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>{heading}</h5>
                  <span
                    className="badge rounded-pill d-none d-lg-inline-flex align-items-center gap-1 px-2 py-1"
                    style={{ fontSize: '10px', background: 'rgba(16,185,129,0.12)', color: '#102fb9', fontWeight: 600 }}
                  >
                    <span className="rounded-circle" style={{ width: 6, height: 6, background: '#102fb9', display: 'inline-block' }} />
                    {currentUser?.role || t('member')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-end gap-2 gap-md-3 flex-shrink-0">
            {currentNavbarSettings.showTime && (
              <div className="topbar-session d-none d-xl-block text-end">
                <div className="small text-muted">{t('current_session')}</div>
                <div className="fw-semibold small">{formatted}</div>
              </div>
            )}

            {currentNavbarSettings.showSystems && (
              <div className="position-relative" ref={systemsRef}>
                <button
                  type="button"
                  className={`topbar-action-btn transition rounded ${showSystems ? 'active shadow-sm scale-up' : ''}`}
                  onClick={() => setShowSystems((prev) => !prev)}
                  title={t('switch_systems')}
                  aria-expanded={showSystems}
                  aria-label={t('switch_systems')}
                >
                  <FontAwesomeIcon icon={faGrip} />
                </button>

                {showSystems && (
                  <div className="topbar-dropdown dropdown-menu dropdown-menu-end show p-0 overflow-hidden shadow-lg border-0 rounded-4 animate-slide-down" style={{ width: '320px', height: '350px' }}>
                    <div className="topbar-dropdown-header p-3" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#ffffff' }}>
                      <h6 className="mb-0 fw-bold" style={{ color: '#ffffff' }}>{t('available_systems')}</h6>
                      <small style={{ color: 'rgba(255,255,255,0.7)' }}>{t('switch_workspace')}</small>
                    </div>
                    <div className="p-2 custom-work-queue-scroll" style={{ maxHeight: 'calc(100% - 80px)', overflowX: 'hidden', overflowY: 'auto' }}>
                      {allowedSystems.map((sys) => (
                        <button
                          key={sys.id}
                          type="button"
                          className={`dropdown-item topbar-menu-item rounded-3 py-2 mb-1 ${sys.disabled ? 'opacity-50' : ''}`}
                          onClick={sys.disabled ? undefined : () => goDashboardTab(sys.tab, sys.id)}
                          style={sys.disabled ? { cursor: 'not-allowed' } : {}}
                        >
                          <div
                            className="menu-icon-bg rounded-2 d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: sys.bg, color: sys.color, width: '40px', height: '40px' }}
                          >
                            <FontAwesomeIcon icon={sys.icon} />
                          </div>
                          <div className="ms-3 flex-grow-1">
                            <div className={`fw-bold small ${sys.disabled ? 'text-muted' : 'text-dark'}`}>{sys.name}</div>
                            <div className="x-small text-muted">{sys.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentNavbarSettings.showPWAInstall !== false && (
              <PWAInstallButton className="me-2 d-none d-lg-flex" />
            )}

            {currentNavbarSettings.showLanguage && (
              <div className="position-relative" ref={languageRef}>
                <button
                  type="button"
                  className={`topbar-action-btn transition rounded d-flex align-items-center gap-2 ${showLanguage ? 'active shadow-sm bg-light' : ''}`}
                  onClick={() => setShowLanguage((prev) => !prev)}
                  title={t('select_language')}
                  aria-expanded={showLanguage}
                  aria-label={t('select_language')}
                  style={{ padding: '0.4rem 0.8rem' }}
                >
                  <FontAwesomeIcon icon={faGlobe} className="text-primary" />
                  <span className="small fw-bold d-none d-lg-inline">
                    {languages.find(l => l.name === language)?.flag || '🇺🇸'}
                  </span>
                </button>

                {showLanguage && (
                  <div className="topbar-dropdown dropdown-menu dropdown-menu-end show p-2 border-0 shadow-lg rounded-4 animate-slide-down" style={{ width: '220px', right: '0' }}>
                    <div className="dropdown-header px-3 py-2 small fw-bold text-muted text-uppercase letter-spacing-1">{t('select_language')}</div>
                    <div className="py-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          className={`dropdown-item topbar-menu-item rounded-3 py-2 mb-1 d-flex align-items-center gap-3 ${language === lang.name ? 'active bg-primary bg-opacity-10 text-primary' : ''}`}
                          onClick={() => {
                            setLanguage(lang.name);
                            setShowLanguage(false);
                            addNotification(`${t('language_switched_to')} ${lang.name}`, "success");
                          }}
                        >
                          <span className="fs-5">{lang.flag}</span>
                          <div className="flex-grow-1">
                            <div className="fw-bold small">{lang.name}</div>
                            <div className="x-small text-muted opacity-75">{lang.code.toUpperCase()}</div>
                          </div>
                          {language === lang.name && <FontAwesomeIcon icon={faCircleCheck} className="text-primary small" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentNavbarSettings.showThemeToggle && (
              <button
                type="button"
                className={`topbar-theme-toggle ${theme === "dark" ? "is-dark" : "is-light"}`}
                onClick={toggleTheme}
                title={t('switch_light_dark')}
                aria-label={t('switch_light_dark')}
                aria-pressed={theme === "dark"}
              >
                <span className="theme-toggle-track" aria-hidden="true">
                  <span className="theme-toggle-thumb" aria-hidden="true">
                    <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} />
                  </span>

                  <span className="track-label-right d-none d-lg-inline" aria-hidden="true">
                    {theme === "dark" ? t('dark') || "Dark" : t('light') || "Light"}
                  </span>
                </span>
              </button>
            )}

            {currentNavbarSettings.showNotifications && (
              <div className="position-relative" ref={notificationRef}>
                <button
                  type="button"
                  className={`topbar-action-btn position-relative transition rounded ${showNotifications ? 'active shadow-sm scale-up' : ''}`}
                  onClick={() => setShowNotifications((prev) => !prev)}
                  title={t('notifications')}
                  aria-expanded={showNotifications}
                  aria-label={t('notifications')}
                >
                  <FontAwesomeIcon icon={faBell} className={unreadCount > 0 ? 'animate-swing' : ''} />
                  {unreadCount > 0 && <span className="topbar-badge pulse-animation">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="topbar-dropdown topbar-notification-menu dropdown-menu dropdown-menu-end show p-0 overflow-hidden shadow-lg border-0 rounded-4 animate-slide-down" style={{ width: '340px' }}>
                    <div className="topbar-dropdown-header d-flex justify-content-between align-items-center bg-primary text-white p-3">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faBell} />
                        <div>
                          <h6 className="mb-0 fw-bold">{t('notifications')}</h6>
                          <small className="opacity-75">{unreadCount} {t('unread_alerts')}</small>
                        </div>
                      </div>
                      <span className="badge bg-white text-primary rounded-pill px-2">{unreadCount} {t('new')}</span>
                    </div>

                    <div className="overflow-auto custom-scrollbar pt-2" style={{ maxHeight: 400 }}>
                      {notifLoading && serverNotifications.length === 0 ? (
                        <div className="p-5 text-center">
                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                      ) : serverNotifications.length === 0 ? (
                        <div className="p-5 text-center fade-in">
                          <div className="empty-notification-icon mx-auto mb-3 shadow-sm" style={{ background: '#f8fafc', color: '#cbd5e1' }}><FontAwesomeIcon icon={faCircleCheck} size="2x" /></div>
                          <p className="fw-bold text-dark mb-1">{t('all_caught_up')}</p>
                          <p className="text-muted small mb-0">{t('no_new_notifications')}</p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {serverNotifications.map((notification, index) => {
                            const style = getNotifIcon(notification.title);
                            return (
                              <div key={notification.id || index} className="notification-item-container fade-in position-relative">
                                <button
                                  type="button"
                                  className="notification-row w-100 text-start d-flex gap-3 p-3 pe-5 border-0 bg-transparent transition"
                                  onClick={() => {
                                    handleMarkAsRead(notification.id);
                                    goDashboardTab("notifications");
                                  }}
                                >
                                  <div className="notification-icon-wrapper rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{ width: 42, height: 42, backgroundColor: style.bg, color: style.color, border: `1px solid ${style.color}22` }}>
                                    <FontAwesomeIcon icon={style.icon} />
                                  </div>
                                  <div className="flex-grow-1 min-w-0">
                                    <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                                      <div className="fw-bold small text-dark text-truncate">{notification.title || t('alert')}</div>
                                      <span className="x-small text-muted whitespace-nowrap">{getTimeAgo(notification.created_at)}</span>
                                    </div>
                                    <div className="text-muted x-small line-clamp-2" style={{ lineHeight: '1.4' }}>{notification.message || t('click_see_details')}</div>
                                  </div>
                                </button>
                                <button
                                  type="button"
                                  className="position-absolute btn btn-link text-muted p-1 transition"
                                  style={{ top: 8, right: 8, fontSize: '0.65rem', lineHeight: 1, textDecoration: 'none' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  title={t('dismiss')}
                                >
                                  <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '0.8rem' }} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-3 border-top bg-light d-flex gap-2">
                      <button type="button" className="btn btn-primary btn-sm rounded-3 flex-fill fw-bold shadow-sm py-2" onClick={() => goDashboardTab("notifications")}>{t('view_all_activity')}</button>
                      {unreadCount > 0 && (
                        <button type="button" className="btn btn-outline-secondary btn-sm rounded-3 px-3 py-2" onClick={handleClearAll} title={t('clear')}>
                          {t('clear')}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser && (
              <div className="position-relative" ref={dropdownRef}>
                <button
                  type="button"
                  className={`topbar-user-btn transition rounded d-flex align-items-center gap-2 ${showDropdown ? 'active shadow-sm' : ''}`}
                  onClick={() => setShowDropdown((prev) => !prev)}
                  aria-expanded={showDropdown}
                  aria-label={t('user_menu')}
                  style={{ padding: '0.4rem 1rem 0.4rem 0.4rem' }}
                >
                  <div className="project-avatar topbar-avatar shadow-sm border border-2 border-white flex-shrink-0">
                    {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="d-none d-md-flex flex-column text-start min-w-0 flex-grow-1">
                    <div className="fw-bold small text-truncate" style={{ lineHeight: '1.2', color: 'inherit' }}>
                      {currentUser.name || t('anonymous_user')}
                    </div>
                    <div className="x-small text-truncate d-flex align-items-center gap-1" style={{ lineHeight: '1.2', color: 'inherit', opacity: 0.8 }}>
                      <span className="rounded-circle bg-success" style={{ width: 6, height: 6, flexShrink: 0 }}></span>
                      <span className="text-truncate">{currentUser.role || t('member')}</span>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`small text-muted ms-auto transition flex-shrink-0 ${showDropdown ? 'rotate-180' : ''}`}
                    style={{ fontSize: '0.75rem' }}
                  />
                </button>

                {showDropdown && (
                  <div className="topbar-dropdown dropdown-menu dropdown-menu-end show p-2 border-0 shadow-lg rounded-4 animate-slide-down" style={{ width: '300px', right: '0' }}>
                    <div className="px-3 py-2 rounded-4 shadow-sm d-flex align-items-center gap-3 position-relative overflow-hidden" style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
                      <div className="position-absolute" style={{ right: '-10%', top: '-20%', opacity: 0.08 }}>
                        <FontAwesomeIcon icon={faUser} style={{ fontSize: '6rem', color: '#64748b' }} />
                      </div>

                      <div className="project-avatar bg-white text-primary fw-bold shadow-sm" style={{ width: 52, height: 52, fontSize: '1.4rem', zIndex: 1, color: '#0f172a', background: '#e2e8f0' }}>
                        {currentUser.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0" style={{ zIndex: 1 }}>
                        <div className="fw-bold text-truncate fs-5" style={{ color: '#0f172a' }}>{currentUser.name || "User"}</div>
                        <div className="x-small text-truncate d-flex align-items-center gap-1" style={{ color: '#475569' }}>
                          <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: '0.65rem' }} />
                          {currentUser.role || "Member"}
                        </div>
                      </div>
                    </div>

                    <div className="pb-1">
                      <div className="menu-section-label">{t('administration')}</div>
                      <button className="dropdown-item topbar-menu-item rounded-3 py-1" onClick={() => goDashboardTab("faq")}>
                        <div className="menu-icon-bg bg-warning-subtle text-warning rounded-2"><FontAwesomeIcon icon={faQuestionCircle} /></div>
                        <span>{t('help_support')}</span>
                      </button>

                      <div className="menu-section-label">{t('services_hub')}</div>
                      <button className="dropdown-item topbar-menu-item rounded-3 py-1" onClick={() => goDashboardTab("systems-hub")}>
                        <div className="menu-icon-bg bg-success-subtle text-success rounded-2"><FontAwesomeIcon icon={faConciergeBell} /></div>
                        <span>{t('services_hub')}</span>
                      </button>
                      <button className="dropdown-item topbar-menu-item rounded-3 py-1" onClick={() => goDashboardTab("permissions")}>
                        <div className="menu-icon-bg bg-primary-subtle text-primary rounded-2"><FontAwesomeIcon icon={faShieldHalved} /></div>
                        <span>{t('access_control')}</span>
                      </button>
                    </div>

                    <div className="dropdown-divider opacity-50 my-1" />

                    <button className="dropdown-item topbar-menu-item logout-item rounded-3 py-2 text-danger" onClick={handleLogout}>
                      <div className="menu-icon-bg bg-danger-subtle text-danger rounded-2"><FontAwesomeIcon icon={faSignOutAlt} /></div>
                      <span className="fw-bold">{t('logout_session')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default TopNavBar;
