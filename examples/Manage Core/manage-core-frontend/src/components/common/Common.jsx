import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faUsers,
  faSignOutAlt,
  faClipboard,
  faPalette,
  faTasks,
  faSitemap,
  faClock,
  faChevronDown,
  faChevronRight,
  faShieldHalved,
  faBuildingColumns,
  faLayerGroup,
  faArrowLeft,
  faDatabase,
  faBox,
  faQuestionCircle,
  faHome,
  faChartBar,
  faUserShield,
  faCheckCircle,
  faTimesCircle,
  faBuilding,
  faFileAlt,
  faUserTag,
  faBrush,
  faPlusCircle,
  faChartLine,
  faChartPie,
  faHistory,
  faPeopleGroup,
  faBriefcase,
  faFolderOpen,
  faHandshake,
  faIdBadge,
  faPaperPlane,
  faUserTie,
  faFileInvoiceDollar,
  faCloudArrowUp,
  faScaleBalanced,
  faCogs,
  faNetworkWired,
  faSliders,
  faHeadset,
  faBell,
  faBullhorn,
  faUniversity,
  faIdCard,
  faCodeBranch,
  faBolt,
  faExclamationTriangle,
  faKey,
  faLink,
  faList,
  faArrowRight,
  faSearch,
  faTimes,
  faBrain,
  faIndustry,
  faDollarSign,
  faTrash,
  faGraduationCap,
  faTable,
  faFlask,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from 'react-router-dom';
import { getHomeRouteForRole, normalizeRole } from '../../utils/roles';
import { useTranslation } from '../../hooks/useTranslation';
// Import modular tabs configurations
import { getPmsModuleTabs } from './PMS/PmsModuleTabs';
import { getHrmsModuleTabs } from './HRMS/HrmsModuleTabs';
import { getFmsModuleTabs } from './FMS/FmsModuleTabs';
import { getAmsModuleTabs } from './AMS/AmsModuleTabs';
import { getPosModuleTabs } from './POS/PosModuleTabs';
import { getTmsModuleTabs } from './TMS/TmsModuleTabs';
import { getDmsModuleTabs } from './DMS/DmsModuleTabs';
import { getMfgModuleTabs } from './MFG/MfgModuleTabs';
import { getFxModuleTabs } from './FX/FxModuleTabs';
import { getAiModuleTabs } from './AI/AiModuleTabs';

import { getDrawingModuleTabs } from './Drawing/DrawingModuleTabs';
import { getEmsModuleTabs } from './EMS/EmsModuleTabs';
import { getCrmModuleTabs } from './CRM/CrmModuleTabs';
import SidebarTree from './SidebarTree';
const Common = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    setActiveModule,
    systemContext,
    setSystemContext,
    logout,
    theme,
    frontTabFlyoverEnabled,
    frontFlyoverStack,
    pushFrontFlyover,
    replaceFrontFlyover,
    popFrontFlyover,
    clearFrontFlyovers,
  } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [openSystems, setOpenSystems] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState('');
  const role = normalizeRole(currentUser?.role);
  const systemHoverTimerRef = React.useRef(null);
  const scheduleSystemHover = (callback, delay) => {
    if (systemHoverTimerRef.current) clearTimeout(systemHoverTimerRef.current);
    systemHoverTimerRef.current = setTimeout(() => {
      systemHoverTimerRef.current = null;
      callback();
    }, delay);
  };
  const cancelSystemHover = () => {
    if (systemHoverTimerRef.current) {
      clearTimeout(systemHoverTimerRef.current);
      systemHoverTimerRef.current = null;
    }
  };

  // Expanded state persisted locally for accordion/expand behavior
  const [expandedMap, setExpandedMap] = React.useState(() => {
    try {
      const v = localStorage.getItem('sidebar_expanded_map');
      return v ? JSON.parse(v) : {};
    } catch (e) {
      return {};
    }
  });

  React.useEffect(() => {
    setOpenSystems({});
  }, [systemContext]);

  const toggleSystem = (system) => {
    setOpenSystems(prev => ({ ...prev, [system]: !prev[system] }));
  };

  // expansion helpers for recursive renderer
  const toggleExpand = (id) => {
    setExpandedMap(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('sidebar_expanded_map', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };
  const setExpanded = (obj) => {
    try { localStorage.setItem('sidebar_expanded_map', JSON.stringify(obj)); } catch (e) {}
    setExpandedMap(obj);
  };

  const makeSubContent = (subTabs) => (
    <div>
      <div className="nav flex-column nav-pills">
        {subTabs.filter(canViewTab).map(sub => (
          <button
            key={sub.id}
            className={`nav-link w-100 text-start mb-1 transition ${activeTab === sub.id ? 'active' : ''}`}
            onClick={(ev) => {
              ev.stopPropagation();
              // If this sub has further nested subTabs, push another flyover in front
              if (sub.subTabs && sub.subTabs.length) {
                const rect = ev.currentTarget ? ev.currentTarget.getBoundingClientRect() : null;
                pushFrontFlyover(sub.label, makeSubContent(sub.subTabs), { anchorRect: rect });
                return;
              }

              // Final selection: navigate and clear all flyovers
              if (systemContext) {
                handleSystemClick(systemContext, sub.id);
              } else {
                setActiveModule('dashboard');
                setActiveTab(sub.id);
                const homeRoute = getHomeRouteForRole(currentUser?.role);
                if (location.pathname !== homeRoute) navigate(homeRoute);
              }
              clearFrontFlyovers();
            }}
            title={sub.label}
          >
            <div className="d-flex align-items-center gap-2">
              <span className="side-icon-wrapper" style={{ fontSize: 'var(--sidebar-font-size)' }}>{sub.icon}</span>
              <div className="navlable fw-medium" style={{ fontSize: 'var(--sidebar-font-size)' }}>{sub.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const handleGroupClick = (tab, e) => {
    // If front-flyover is enabled and tab has subTabs, open the overlay (push stack)
    if (frontTabFlyoverEnabled && tab.subTabs && tab.subTabs.length) {
      const topFlyover = frontFlyoverStack[frontFlyoverStack.length - 1];
      if (topFlyover && topFlyover._id === tab.id) return true;

      const rect = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
      if (topFlyover && topFlyover.hover) {
        // Clicking another group while a hover preview is open pins it in place
        replaceFrontFlyover(tab.label, makeSubContent(tab.subTabs), { anchorRect: rect, _id: tab.id });
      } else {
        pushFrontFlyover(tab.label, makeSubContent(tab.subTabs), { anchorRect: rect, _id: tab.id });
      }
      return true;
    }
    // fallback to normal expand/collapse
    if (systemContext) {
      toggleSystem(tab.id);
    } else {
      toggleExpand(tab.id);
    }
    return true;
  };

  const handleGroupHover = (tab, rect) => {
    if (!frontTabFlyoverEnabled) return;

    const hasChildren = Array.isArray(tab.subTabs) && tab.subTabs.length > 0;
    const topFlyover = frontFlyoverStack[frontFlyoverStack.length - 1];

    if (!hasChildren) {
      // Hovering a leaf dismisses an active hover preview
      if (topFlyover && topFlyover.hover) clearFrontFlyovers();
      return;
    }

    if (topFlyover && topFlyover._id === tab.id) return;

    replaceFrontFlyover(tab.label, makeSubContent(tab.subTabs), { anchorRect: rect || null, hover: true, _id: tab.id });
  };

  const handleLogout = () => {
    logout();
  };

  const handleSystemClick = (system, tabId) => {
    setSystemContext(system);
    setActiveModule(system || 'dashboard');
    setActiveTab(tabId);
    const homeRoute = getHomeRouteForRole(currentUser?.role);
    if (location.pathname !== homeRoute) {
      navigate(homeRoute);
    }
  };

  useEffect(() => {
    if (systemContext && role !== 'Admin' && role !== 'SuperAdmin') {
      const userPerms = (currentUser?.permissions?.length ? currentUser.permissions : currentUser?.all_permissions) || [];
      const requiredPerm = `system_${systemContext}`;
      if (!userPerms.includes(requiredPerm)) {
        setSystemContext(null);
        setActiveModule('dashboard');
        setActiveTab('overview');
      }
    }
  }, [systemContext, currentUser, role, setSystemContext, setActiveModule, setActiveTab]);

  const generalTabs = [
    { id: 'dashboard', label: t('dashboard'), icon: <FontAwesomeIcon icon={faHome} />, permission: 'sidebar_dashboard' },
  ];

  const dashboardTabs = [
    { id: 'admin_dashboard', label: t('admin_dashboard'), icon: <FontAwesomeIcon icon={faUserShield} />, permission: 'sidebar_admin_dashboard' },
   ];

  const commonTabs = [
    { id: 'chat', label: t('team_chat'), icon: <FontAwesomeIcon icon={faUsers} />, permission: 'sidebar_chat' },
    { id: 'announcements', label: 'Announcements', icon: <FontAwesomeIcon icon={faBullhorn} />, permission: 'sidebar_notifications' },
    { id: 'notifications', label: t('notifications'), icon: <FontAwesomeIcon icon={faClipboard} />, permission: 'sidebar_notifications' },
  ];

  const supportTabs = [
    { id: 'support', label: t('support_tickets'), icon: <FontAwesomeIcon icon={faHeadset} />, permission: 'sidebar_support_tickets' },
    { id: 'faq', label: t('faq'), icon: <FontAwesomeIcon icon={faQuestionCircle} />, permission: 'sidebar_faq' },
    { id: 'product-services', label: t('products_services'), icon: <FontAwesomeIcon icon={faBox} />, permission: 'sidebar_product_services' },
  ];

  const userRequestsTabs = [
    { id: 'user-requests', label: t('requests'), icon: <FontAwesomeIcon icon={faPaperPlane} /> },
  ];

  const adminTabs = [
    { id: 'data-backup', label: t('data_backup'), icon: <FontAwesomeIcon icon={faDatabase} />, permission: 'sidebar_data_backup' },
    { id: 'data-limits', label: t('data_limits'), icon: <FontAwesomeIcon icon={faShieldHalved} />, permission: 'sidebar_data_limits' },
  ];

  const organizationTabs = [
    { id: 'dept-management', label: t('department_management'), icon: <FontAwesomeIcon icon={faBuilding} />, permission: 'sidebar_departments' },
    { id: 'designation-management', label: t('designation_management'), icon: <FontAwesomeIcon icon={faIdBadge} />, permission: 'sidebar_designations' },
    { id: 'teams', label: t('teams'), icon: <FontAwesomeIcon icon={faPeopleGroup} />, permission: 'sidebar_teams' },
    { id: 'team-management', label: t('team_management'), icon: <FontAwesomeIcon icon={faBriefcase} />, permission: 'sidebar_teams' },
    { id: 'teams-productivity', label: t('teams_productivity'), icon: <FontAwesomeIcon icon={faChartLine} />, permission: 'sidebar_teams' },
  ];

  const userManagementTabs = [
    { id: 'role-dashboard', label: t('role_dashboard'), icon: <FontAwesomeIcon icon={faChartPie} />, permission: 'sidebar_roles' },
    { id: 'users', label: t('users'), icon: <FontAwesomeIcon icon={faUsers} />, permission: 'sidebar_users' },
    { id: 'roles', label: t('roles'), icon: <FontAwesomeIcon icon={faUserShield} />, permission: 'sidebar_roles' },
    { id: 'approvals', label: t('approval_center'), icon: <FontAwesomeIcon icon={faCheckCircle} />, permission: 'sidebar_approvals' },
    { id: 'audit-logs', label: t('audit_logs'), icon: <FontAwesomeIcon icon={faHistory} />, permission: 'sidebar_audit_logs' },
    { id: 'access-requests', label: t('access_requests'), icon: <FontAwesomeIcon icon={faPlusCircle} />, permission: 'sidebar_access_requests' },
  ];

  const modulesTabs = [
    { id: 'modules', label: t('modules'), icon: <FontAwesomeIcon icon={faLayerGroup} />, permission: 'sidebar_modules' },
    { id: 'permissions', label: t('permissions'), icon: <FontAwesomeIcon icon={faCog} />, permission: 'sidebar_permissions' },
  ];

  const themeTabs = [
    { id: 'theme', label: t('theme_settings'), icon: <FontAwesomeIcon icon={faBrush} />, permission: 'sidebar_theme' },
    { id: 'sidebartheme', label: t('sidebar_theme'), icon: <FontAwesomeIcon icon={faPalette} />, permission: 'sidebar_sidebartheme' },
    { id: 'theme-assignment', label: t('theme_assignment_center'), icon: <FontAwesomeIcon icon={faSitemap} />, permission: 'sidebar_theme_assignment' },
    { id: 'topnavbar-settings', label: t('topnavbar_config'), icon: <FontAwesomeIcon icon={faLayerGroup} />, permission: 'sidebar_theme' },
    { id: 'components', label: t('components') || 'Components', icon: <FontAwesomeIcon icon={faTable} />, permission: 'sidebar_theme' },
    { id: 'admin-settings', label: t('system_settings'), icon: <FontAwesomeIcon icon={faCog} />, permission: 'sidebar_admin_settings' },
  ];

  const allcommonTabs = [
    { id: 'hrms_attendance', label: t('attendance'), icon: <FontAwesomeIcon icon={faCheckCircle} />, permission: 'sidebar_hrms_attendance' },
    { id: 'hrms_leaves', label: t('leaves'), icon: <FontAwesomeIcon icon={faTimesCircle} />, permission: 'sidebar_hrms_leaves' },
  ];

  const workforceTabs = [
    { id: 'workforce_clients', label: t('clients'), icon: <FontAwesomeIcon icon={faUserTie} />, permission: 'sidebar_workforce_clients' },
    {
      id: 'workforce_activity',
      label: t('activity'),
      icon: <FontAwesomeIcon icon={faClock} />,
      subTabs: [
        { id: 'workforce_activity_logs', label: t('activity_logs'), icon: <FontAwesomeIcon icon={faHistory} />, permission: 'sidebar_workforce_activity_logs' },
      ],
    },
  ];


  // Reference modularized HRMS tabs configuration
  const hrmsModuleTabs = getHrmsModuleTabs(t);

  // Reference modularized PMS tabs configuration
  const pmsModuleTabs = getPmsModuleTabs(t);

  // Reference modularized FMS tabs configuration
  const fmsModuleTabs = getFmsModuleTabs(t);

  // const dmsModuleTabs = [
  //   { id: 'dms_overview', label: t('overview'), icon: <FontAwesomeIcon icon={faHome} /> },
  //   {
  //     id: 'dms_repo_mgmt',
  //     label: t('document_management'),
  //     icon: <FontAwesomeIcon icon={faFolderOpen} />,
  //     subTabs: [
  //       { id: 'dms_documents', label: t('all_documents'), icon: <FontAwesomeIcon icon={faFolderOpen} /> },
  //       { id: 'dms_document_viewer', label: t('document_viewer'), icon: <FontAwesomeIcon icon={faEye} /> },
  //       { id: 'dms_templates', label: t('document_templates'), icon: <FontAwesomeIcon icon={faFileAlt} /> },
  //       { id: 'dms_archival', label: t('archive_center'), icon: <FontAwesomeIcon icon={faArchive} /> },
  //     ]
  //   },
  //   {
  //     id: 'dms_analytics_mgmt',
  //     label: t('analytics'),
  //     icon: <FontAwesomeIcon icon={faChartBar} />,
  //     subTabs: [
  //       { id: 'dms_analytics', label: t('analytics_dashboard'), icon: <FontAwesomeIcon icon={faChartLine} /> },
  //       { id: 'dms_storage_analytics', label: t('storage_analytics'), icon: <FontAwesomeIcon icon={faDatabase} /> },
  //     ]
  //   },
  //   {
  //     id: 'dms_ai_mgmt',
  //     label: t('ai_intelligence'),
  //     icon: <FontAwesomeIcon icon={faRobot} />,
  //     subTabs: [
  //       { id: 'dms_ai_intelligence', label: t('ai_document_intelligence'), icon: <FontAwesomeIcon icon={faBrain} /> },
  //     ]
  //   },
  //   {
  //     id: 'dms_collab_mgmt',
  //     label: t('collaboration'),
  //     icon: <FontAwesomeIcon icon={faUsers} />,
  //     subTabs: [
  //       { id: 'dms_collaboration', label: t('collaboration_center'), icon: <FontAwesomeIcon icon={faComments} /> },
  //       { id: 'dms_approval_workflow', label: t('approval_workflow'), icon: <FontAwesomeIcon icon={faCheckCircle} /> },
  //       { id: 'dms_signature_center', label: t('signature_center'), icon: <FontAwesomeIcon icon={faFileSignature} /> },
  //     ]
  //   },
  //   {
  //     id: 'dms_security_mgmt',
  //     label: t('security_compliance'),
  //     icon: <FontAwesomeIcon icon={faShieldHalved} />,
  //     subTabs: [
  //       { id: 'dms_security_center', label: t('security_center'), icon: <FontAwesomeIcon icon={faShieldHalved} /> },
  //       { id: 'dms_audit_logs', label: t('audit_logs'), icon: <FontAwesomeIcon icon={faHistory} /> },
  //     ]
  //   },
  // ];

   const dmsModuleTabs = getDmsModuleTabs(t); 

  const crmModuleTabs = getCrmModuleTabs(t);

  const tmsModuleTabs = getTmsModuleTabs(t);

  const amsModuleTabs = getAmsModuleTabs(t);

  const posModuleTabs = getPosModuleTabs(t);

  const mfgModuleTabs = getMfgModuleTabs(t);

  const fxModuleTabs = getFxModuleTabs(t);

  const aiModuleTabs = getAiModuleTabs(t);

  const drawingModuleTabs = getDrawingModuleTabs(t);

  const emsModuleTabs = getEmsModuleTabs(t);

  const activeSystemTabs = systemContext === 'pms' ? pmsModuleTabs :
    systemContext === 'hrms' ? hrmsModuleTabs :
      systemContext === 'fms' ? fmsModuleTabs :
        systemContext === 'ams' ? amsModuleTabs :
        systemContext === 'inv' ? amsModuleTabs.filter(tab => ['fms_inventory_service_group'].includes(tab.id)) :
          systemContext === 'pos' ? posModuleTabs :
          systemContext === 'dms' ? dmsModuleTabs :
            systemContext === 'crm' ? crmModuleTabs :
              systemContext === 'mfg' ? mfgModuleTabs :
                systemContext === 'fx' ? fxModuleTabs :
                  systemContext === 'ai' ? aiModuleTabs :
                    systemContext === 'drawing' ? drawingModuleTabs.filter(tab => tab.id === 'drawing_overview') :
                      systemContext === 'ems' ? emsModuleTabs :
                        tmsModuleTabs;

  const activeSystemLabel = systemContext === 'pms' ? t('project_mgmt') :
    systemContext === 'hrms' ? t('human_resource') :
      systemContext === 'fms' ? t('finance_mgmt') :
        systemContext === 'ams' ? 'Accounting System' :
          systemContext === 'inv' ? 'Inventory Management' :
            systemContext === 'pos' ? 'Point of Sale System' :
          systemContext === 'dms' ? t('document_management') :
            systemContext === 'crm' ? t('customer_relationship') :
              systemContext === 'mfg' ? 'Manufacturing / MRP' :
                systemContext === 'fx' ? 'Multi-Currency / FX' :
                  systemContext === 'ai' ? 'AI Workspace' :
                    systemContext === 'drawing' ? 'Drawing Studio' :
                      systemContext === 'ems' ? 'Education Management System' :
                        t('task_mgmt');

  const systemSuites = {
    pms: { eyebrow: 'Portfolio OS', status: 'Executive ready', tone: 'teal' },
    hrms: { eyebrow: 'People OS', status: 'Workforce ready', tone: 'rose' },
    fms: { eyebrow: 'Finance OS', status: 'Control ready', tone: 'amber' },
    ams: { eyebrow: 'Ledger OS', status: 'Audit ready', tone: 'indigo' },
    inv: { eyebrow: 'Inventory OS', status: 'Operations ready', tone: 'orange' },
    pos: { eyebrow: 'Commerce OS', status: 'Checkout ready', tone: 'rose' },
    dms: { eyebrow: 'Document OS', status: 'Repository ready', tone: 'sky' },
    crm: { eyebrow: 'Relationship OS', status: 'Pipeline ready', tone: 'emerald' },
    mfg: { eyebrow: 'Manufacturing OS', status: 'Shopfloor ready', tone: 'orange' },
    fx: { eyebrow: 'Treasury OS', status: 'Market ready', tone: 'cyan' },
    ai: { eyebrow: 'Intelligence OS', status: 'Model ready', tone: 'violet' },
    drawing: { eyebrow: 'Design OS', status: 'Canvas ready', tone: 'pink' },
    ems: { eyebrow: 'Campus OS', status: 'Academic ready', tone: 'blue' },
    tms: { eyebrow: 'Task OS', status: 'Execution ready', tone: 'lime' },
  };

  const activeSystemSuite = systemSuites[systemContext] || systemSuites.tms;
  const getTabMetric = (tab) => tab.metric || (tab.subTabs?.length ? tab.subTabs.length : 'Go');
  const getTabAccent = (tab) => tab.accent || (tab.subTabs?.length ? 'Suite' : 'Tool');
  const getTabDesc = (tab) => tab.desc || (tab.subTabs?.length ? `${tab.subTabs.length} connected workspaces` : 'Open workspace');

  const superAdminTabs = [
    { id: 'dashboard', label: t('control_tower'), icon: <FontAwesomeIcon icon={faNetworkWired} /> },
    { id: 'provisioner', label: t('tenant_provisioning'), icon: <FontAwesomeIcon icon={faBuilding} /> },
    { id: 'licensing', label: t('plans_licensing'), icon: <FontAwesomeIcon icon={faSliders} /> },
    { id: 'security', label: t('security_access'), icon: <FontAwesomeIcon icon={faShieldHalved} /> },
    { id: 'quotas', label: t('resource_quotas'), icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
    { id: 'modules', label: t('module_control'), icon: <FontAwesomeIcon icon={faCogs} /> },
    { id: 'announcements', label: 'Announcements', icon: <FontAwesomeIcon icon={faBullhorn} /> },
    { id: 'ai-knowledge-center', label: 'AI Knowledge Center', icon: <FontAwesomeIcon icon={faBrain} /> },
    { id: 'ai-provider-settings', label: 'AI Provider Settings', icon: <FontAwesomeIcon icon={faCog} /> },
    { id: 'ai-quotas', label: 'AI Quota Management', icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
    { id: 'error-pages', label: 'Error Pages', icon: <FontAwesomeIcon icon={faExclamationTriangle} /> },
    { id: 'demo-requests', label: 'Demo Requests', icon: <FontAwesomeIcon icon={faFlask} /> },
    { id: 'contact-messages', label: 'Contact Messages', icon: <FontAwesomeIcon icon={faEnvelopeOpenText} /> },
    { id: 'billing', label: t('billing_intelligence'), icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> },
    { id: 'audit', label: t('audit_compliance'), icon: <FontAwesomeIcon icon={faHistory} /> },
    { id: 'configs', label: t('system_configs'), icon: <FontAwesomeIcon icon={faDatabase} /> },
    { id: 'deployment', label: t('deployment_flags'), icon: <FontAwesomeIcon icon={faCloudArrowUp} /> },
    { id: 'companies', label: 'Companies', icon: <FontAwesomeIcon icon={faBuildingColumns} /> },
    { id: 'companies-trash', label: 'Company Trash', icon: <FontAwesomeIcon icon={faTrash} /> },
    // { id: 'support', label: t('support_operations'), icon: <FontAwesomeIcon icon={faHeadset} /> },
  ];

  const adminSecurityTabs = [
    { id: 'admin_notification_settings', label: 'Notification Settings', icon: <FontAwesomeIcon icon={faBell} /> },
    { id: 'admin_bank_exports', label: 'Bank Exports', icon: <FontAwesomeIcon icon={faUniversity} /> },
    { id: 'admin_biometric_devices', label: 'Biometric Devices', icon: <FontAwesomeIcon icon={faIdCard} /> },
    { id: 'admin_biometric_mapping', label: 'Biometric Mapping', icon: <FontAwesomeIcon icon={faCodeBranch} /> },
    { id: 'admin_raw_punches', label: 'Raw Punches', icon: <FontAwesomeIcon icon={faBolt} /> },
    { id: 'admin_unmatched_punches', label: 'Unmatched Punches', icon: <FontAwesomeIcon icon={faExclamationTriangle} /> },
    { id: 'admin_api_keys', label: 'API Keys', icon: <FontAwesomeIcon icon={faKey} /> },
    { id: 'admin_webhooks', label: 'Webhooks', icon: <FontAwesomeIcon icon={faLink} /> },
    { id: 'admin_webhook_logs', label: 'Webhook Logs', icon: <FontAwesomeIcon icon={faList} /> },
    { id: 'admin_security_audit', label: 'Security Audit', icon: <FontAwesomeIcon icon={faShieldHalved} /> },
  ];

  const canViewTab = (tab) => {
    // Super/Admin should always be able to access the Theme/System configuration UI
    // regardless of stored permission strings.
   if (role === 'SuperAdmin' || role === 'Admin') {
      return (
        tab.id === 'theme' ||
        tab.id === 'sidebartheme' ||
        tab.id === 'theme-assignment' ||
        tab.id === 'topnavbar-settings' ||
        tab.id === 'admin-settings' ||
        true
      );
    }

    if (!tab.permission) return true;
    const userPerms = (currentUser?.permissions?.length ? currentUser.permissions : currentUser?.all_permissions) || [];
    return userPerms.includes(tab.permission);
  };

  const renderTabGroup = (label, tabs) => {
    const visibleTabs = tabs.filter((tab) => {
      if (tab.subTabs) {
        return tab.subTabs.some(canViewTab);
      }
      return canViewTab(tab);
    });
    if (!visibleTabs || visibleTabs.length === 0) return null;
    return (
      <div className="fade-in">
        {isSidebarOpen && <p className='ms-1 mb-1 mt-3 text-uppercase fw-bold sidebar-label-heading' style={{ color: 'var(--sidebar-label-color)', fontSize: 'var(--sidebar-label-font-size)', letterSpacing: '0.5px' }}>{label}</p>}
        <nav className="navbar navbar-expand-lg w-100 p-0 m-0 rounded navbar-light">
          <div className="d-flex justify-content-start flex-grow-1">
            <SidebarTree
              items={visibleTabs}
              level={1}
              isSidebarOpen={isSidebarOpen}
              activeTab={activeTab}
              canViewTab={canViewTab}
              expandedMap={expandedMap}
              toggleExpand={toggleExpand}
              onItemSelect={(tab) => {
                // ensure parent path expanded for visibility
                expandParentsFor(tab.id);
                if (frontFlyoverStack[frontFlyoverStack.length - 1]?.hover) clearFrontFlyovers();
                if (tab.path) {
                  navigate(tab.path);
                  setActiveTab(tab.id);
                  return;
                }
                if (systemContext) {
                  handleSystemClick(systemContext, tab.id);
                } else {
                  setActiveModule('dashboard');
                  setActiveTab(tab.id);
                  const homeRoute = getHomeRouteForRole(currentUser?.role);
                  if (location.pathname !== homeRoute) {
                    navigate(homeRoute);
                  }
                }
              }}
              onGroupClick={handleGroupClick}
              onHoverGroup={handleGroupHover}
              onHoverLeaf={handleGroupHover}
              theme={theme}
            />
          </div>
        </nav>
      </div>
    );
  };

  // Build parent map for tabs to support auto-expanding parent chain for any selected tab
  const buildParentMap = () => {
    const map = {};
    const visit = (tabs, parent = null) => {
      tabs.forEach(tab => {
        map[tab.id] = parent;
        if (tab.subTabs && tab.subTabs.length) visit(tab.subTabs, tab.id);
      });
    };

    const addGroup = (tabs) => { if (tabs && tabs.length) visit(tabs, null); };

    addGroup(generalTabs);
    addGroup([{ id: 'systems-hub', label: t('systems'), icon: <FontAwesomeIcon icon={faLayerGroup} />, permission: 'sidebar_systems_hub' }]);
    if (role === 'SuperAdmin') addGroup(superAdminTabs);
    if (role === 'Admin') addGroup(adminSecurityTabs);
    addGroup(dashboardTabs);
    addGroup(adminTabs);
    if (role !== 'SuperAdmin') addGroup(allcommonTabs);
    addGroup(commonTabs);
    addGroup(supportTabs);
    if (role !== 'Admin') addGroup(userRequestsTabs);
    if (role !== 'SuperAdmin') addGroup(organizationTabs);
    if (role !== 'SuperAdmin') addGroup(userManagementTabs);
    addGroup(workforceTabs);
    addGroup(modulesTabs);
    addGroup(themeTabs);

    const userPerms = (currentUser?.permissions?.length ? currentUser.permissions : currentUser?.all_permissions) || [];
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_pms')) addGroup(pmsModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_hrms')) addGroup(hrmsModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_fms')) addGroup(fmsModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_ams')) addGroup(amsModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_inv')) {
      addGroup(amsModuleTabs.filter(tab => ['fms_inventory_service_group'].includes(tab.id)));
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_pos')) {
      addGroup(amsModuleTabs.filter(tab => tab.id === 'fms_pos_retail_group' || ['erp_pos_sales_screen', 'erp_cashier_sessions', 'erp_pos_invoices_receipts', 'erp_z_reports'].includes(tab.id)));
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_dms')) addGroup(dmsModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_crm')) addGroup(crmModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_tms')) addGroup(tmsModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_mfg')) addGroup(mfgModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_fx')) addGroup(fxModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_ai')) addGroup(aiModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_drawing')) addGroup(drawingModuleTabs);
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_ems')) addGroup(emsModuleTabs);

    return map;
  };

  const expandParentsFor = (tabId) => {
    if (!tabId) return;
    const map = buildParentMap();
    const toOpen = {};
    let p = map[tabId];
    while (p) {
      toOpen[p] = true;
      p = map[p];
    }
    if (Object.keys(toOpen).length) {
      setExpandedMap(prev => {
        const next = { ...prev, ...toOpen };
        try { localStorage.setItem('sidebar_expanded_map', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    }
  };

  const getSearchableTabs = () => {
    const list = [];

    // Helper to add tabs recursively (handling subTabs)
    const addTabs = (tabsArray, systemKey = null) => {
      tabsArray.forEach(tab => {
        if (tab.subTabs) {
          tab.subTabs.forEach(sub => {
            if (canViewTab(sub)) {
              list.push({
                ...sub,
                parentLabel: tab.label,
                systemKey: systemKey
              });
            }
          });
        } else {
          if (canViewTab(tab)) {
            list.push({
              ...tab,
              systemKey: systemKey
            });
          }
        }
      });
    };

    // Add main layout tabs
    addTabs(generalTabs);
    addTabs([{ id: 'systems-hub', label: t('systems'), icon: <FontAwesomeIcon icon={faLayerGroup} />, permission: 'sidebar_systems_hub' }]);
    if (role === 'SuperAdmin') addTabs(superAdminTabs);
    if (role === 'Admin') addTabs(adminSecurityTabs);
    addTabs(dashboardTabs);
    addTabs(adminTabs);
    if (role !== 'SuperAdmin') addTabs(allcommonTabs);
    addTabs(commonTabs);
    addTabs(supportTabs);
    if (role !== 'Admin') addTabs(userRequestsTabs);
    if (role !== 'SuperAdmin') addTabs(organizationTabs);
    if (role !== 'SuperAdmin') addTabs(userManagementTabs);
    addTabs(workforceTabs);
    addTabs(modulesTabs);
    addTabs(themeTabs);

    // Add system-specific tabs if user has access to those systems
    const userPerms = (currentUser?.permissions?.length ? currentUser.permissions : currentUser?.all_permissions) || [];
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_pms')) {
      addTabs(pmsModuleTabs, 'pms');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_hrms')) {
      addTabs(hrmsModuleTabs, 'hrms');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_fms')) {
      addTabs(fmsModuleTabs, 'fms');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_ams')) {
      addTabs(amsModuleTabs, 'ams');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_pos')) {
      addTabs(posModuleTabs, 'pos');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_dms')) {
      addTabs(dmsModuleTabs, 'dms');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_crm')) {
      addTabs(crmModuleTabs, 'crm');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_tms')) {
      addTabs(tmsModuleTabs, 'tms');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_mfg')) {
      addTabs(mfgModuleTabs, 'mfg');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_fx')) {
      addTabs(fxModuleTabs, 'fx');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_ai')) {
      addTabs(aiModuleTabs, 'ai');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_drawing')) {
      addTabs(drawingModuleTabs, 'drawing');
    }
    if (role === 'Admin' || role === 'SuperAdmin' || userPerms.includes('system_ems')) {
      addTabs(emsModuleTabs, 'ems');
    }

    return list;
  };

  const allTabs = React.useMemo(() => getSearchableTabs(), [role, currentUser, pmsModuleTabs, hrmsModuleTabs, fmsModuleTabs, amsModuleTabs, posModuleTabs, dmsModuleTabs, crmModuleTabs, tmsModuleTabs, mfgModuleTabs, fxModuleTabs, aiModuleTabs, drawingModuleTabs, emsModuleTabs]);

  const filteredTabs = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return allTabs.filter(tab => {
      const labelMatch = tab.label && tab.label.toLowerCase().includes(query);
      const parentLabelMatch = tab.parentLabel && tab.parentLabel.toLowerCase().includes(query);
      const systemMatch = tab.systemKey && tab.systemKey.toLowerCase().includes(query);
      return labelMatch || parentLabelMatch || systemMatch;
    });
  }, [searchQuery, allTabs]);

  // Auto-expand parents when activeTab changes or on initial mount
  React.useEffect(() => {
    if (activeTab) expandParentsFor(activeTab);
  }, [activeTab]);

  const renderSearchResults = () => {
    if (filteredTabs.length === 0) {
      return (
        <div className="text-center py-4 text-muted fade-in" style={{ fontSize: 'var(--sidebar-font-size)' }}>
          <FontAwesomeIcon icon={faExclamationTriangle} className="mb-2 fs-5" />
          <div>{t('no_results_found') || 'No tabs found'}</div>
        </div>
      );
    }

    return (
      <div className="fade-in nav flex-column w-100 nav-pills mt-2">
        <p className="ms-1 mb-2 text-uppercase fw-bold sidebar-label-heading" style={{ color: 'var(--sidebar-label-color)', fontSize: 'calc(var(--sidebar-font-size) * 0.85)', letterSpacing: '0.5px' }}>
          {t('search_results') || 'Search Results'} ({filteredTabs.length})
        </p>
        {filteredTabs.map(tab => (
          <button
            key={`${tab.systemKey || 'main'}-${tab.id}`}
            className={`nav-link w-100 text-start mb-1 transition d-flex align-items-center justify-content-between ${activeTab === tab.id ? 'active' : ''}`}
             onClick={() => {
               // expand parent path for visibility
               expandParentsFor(tab.id);
               if (tab.path) {
                 navigate(tab.path);
                 setActiveTab(tab.id);
                 setSearchQuery('');
                 return;
               }
               if (tab.systemKey) {
                 handleSystemClick(tab.systemKey, tab.id);
               } else {
                 setSystemContext(null);
                 setActiveModule('dashboard');
                 setActiveTab(tab.id);
                 const homeRoute = getHomeRouteForRole(currentUser?.role);
                 if (location.pathname !== homeRoute) {
                   navigate(homeRoute);
                 }
               }
               setSearchQuery(''); // clear query on selection
             }}
          >
            <div className="d-flex align-items-center gap-2 min-w-0">
              <span className="side-icon-wrapper" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.icon}</span>
              <div className="text-start min-w-0">
                <div className="navlable fw-medium" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.label}</div>
                 {tab.parentLabel && (
                  <div 
                    className="text-truncate" 
                    style={{ 
                      fontSize: '10px', 
                      color: theme === 'dark' ? '#adb5bd' : '#9e9e9e',
                      opacity: 0.85
                    }}
                  >
                    {tab.parentLabel}
                  </div>
                )}
              </div>
            </div>
            {tab.systemKey && (
              <span 
                className="badge text-uppercase border" 
                style={{ 
                  fontSize: '8px',
                  color: theme === 'dark' ? '#adb5bd' : '#1e293b',
                  backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#1f1f1f25',
                  borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.89)' : '#cbd5e1',
                  fontWeight: '600'
                }}
              >
                {tab.systemKey}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{ display: 'none' }}
      />
      <div
        className={`sidebar-container sidebarcol border-end vh-100 position-sticky top-0 align-self-start ${isSidebarOpen ? 'expanded' : 'collapsed'}`}
        style={{
          overflowY: 'auto',
          width: isSidebarOpen ? 'var(--sidebar-width, 16.666667%)' : '80px',
          flex: isSidebarOpen ? '0 0 var(--sidebar-width, 16.666667%)' : '0 0 80px',
          maxWidth: isSidebarOpen ? 'var(--sidebar-width, 16.666667%)' : '80px',
          position: 'relative',
        }}
      >
      <div className="p-3 ps-2">
        <div className="d-flex flex-column mb-2">
          <div className={`d-flex align-items-center gap-2 mb-2 ${!isSidebarOpen ? 'justify-content-center' : ''}`}>
            <div className="rounded bg-primary d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 35, height: 35 }}>
              <FontAwesomeIcon icon={faLayerGroup} className="text-white small" />
            </div>
            {isSidebarOpen && (
              <div className="d-flex align-items-center justify-content-between flex-grow-1 min-w-0">
                <span className="fw-bold fs-5 brand-text text-truncate">ManageCore</span>
                <button
                  type="button"
                  className="sidebar-close-btn btn btn-sm p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: 28, height: 28, borderRadius: '8px', color: 'var(--sidebar-text)', transition: 'all 0.2s' }}
                  onClick={() => setIsSidebarOpen(false)}
                  title="Close sidebar"
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--sidebar-button-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.85rem' }} />
                </button>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <div className="user-role-badge d-flex align-items-center gap-2 px-2 py-1 rounded border shadow-sm" style={{ width: 'fit-content', background: 'var(--sidebar-button-bg)' }}>
              <FontAwesomeIcon icon={faUserTag} className="text-primary small" />
              <span className="text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px', color: 'var(--sidebar-text)' }}>{t(role.toLowerCase())}</span>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="sidebar-search-container mb-3">
          {isSidebarOpen ? (
            <div className="position-relative">
              <span className="sidebar-search-icon" style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--sidebar-text, #666)',
                opacity: 0.6,
                fontSize: '12px',
                pointerEvents: 'none',
              }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className={`sidebar-search-input ${theme !== 'dark' ? 'sidebar-search-input' : ''}`}
                placeholder={t('search_tabs') || 'Search tabs...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 32px',
                  fontSize: '13px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border, rgba(0, 0, 0, 0.1))',
                  borderRadius: '8px',
                  color: 'var(--sidebar-text, #333)',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="sidebar-search-clear"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--sidebar-text, #666)',
                    opacity: 0.6,
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: '12px',
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-link p-2 text-decoration-none sidebar-search-collapsed-btn"
                onClick={() => setIsSidebarOpen(true)}
                title={t('search_tabs') || 'Search tabs...'}
                style={{
                  color: 'var(--sidebar-text, #666)',
                  opacity: 0.8,
                  backgroundColor: 'transparent',
                  borderRadius: '8px',
                  width: '35px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          )}
        </div>

        {searchQuery.trim() ? (
          renderSearchResults()
        ) : systemContext ? (
          <div className={`fade-in system-nav-suite system-nav-${activeSystemSuite.tone} ${systemContext === 'pms' ? 'pms-nav-suite' : ''}`}>
            <div className="nav flex-column w-100 nav-pills mb-1">
              <button
                className={`nav-link w-100 text-start transition d-flex align-items-center ${!isSidebarOpen ? 'justify-content-center px-0' : 'justify-content-start gap-2'}`}
                onClick={() => {
                  setSystemContext(null);
                  setActiveModule('dashboard');
                  setActiveTab('systems-hub');
                }}
                title={!isSidebarOpen ? t('back_to_main') : ""}
              >
                <span className="side-icon-wrapper" style={{ fontSize: 'var(--sidebar-font-size)' }}><FontAwesomeIcon icon={faArrowLeft} /></span>
                {isSidebarOpen && <div className="navlable fw-bold" style={{ fontSize: 'var(--sidebar-font-size)' }}>{t('back_to_main')}</div>}
              </button>
            </div>

            {isSidebarOpen && (
              <div className="system-heading-card premium-system-heading">
              <p className='ms-1 mb-3 text-uppercase fw-bold d-flex align-items-center gap-2 navlable system-h sidebar-label-heading' style={{ color: 'var(--sidebar-label-color)', fontSize: 'var(--sidebar-label-font-size)', letterSpacing: '0.5px' }}>
                <FontAwesomeIcon icon={
                  systemContext === 'pms' ? faFileAlt :
                    systemContext === 'hrms' ? faUsers :
                      systemContext === 'fms' ? faBuildingColumns :
                        systemContext === 'ams' ? faBuildingColumns :
                          systemContext === 'dms' ? faFolderOpen :
                            systemContext === 'crm' ? faHandshake :
                              systemContext === 'mfg' ? faIndustry :
                                systemContext === 'fx' ? faDollarSign :
                                  systemContext === 'ai' ? faBrain :
                                    systemContext === 'drawing' ? faPalette :
                                      systemContext === 'ems' ? faGraduationCap :
                                        faTasks
                } />
                {activeSystemLabel}
              </p>
              <div className="system-suite-pulse">
                <span>{activeSystemSuite.eyebrow}</span>
                <strong>{activeSystemSuite.status}</strong>
              </div>
              </div>
            )}

            <div className="nav flex-column w-100 nav-pills mt-2">
              {activeSystemTabs.map(tab => (
                <div key={tab.id} className="w-100">
                   {tab.subTabs ? (
                     <>
                       <button
                          className={`nav-link w-100 text-start mb-1 transition system-tab-link ${activeTab === tab.id || tab.subTabs.some(s => s.id === activeTab) ? 'active' : ''} ${!isSidebarOpen ? 'px-0 justify-content-center' : ''}`}
                          onClick={(event) => handleGroupClick(tab, event)}
                          onMouseEnter={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            scheduleSystemHover(() => handleGroupHover(tab, rect), 90);
                          }}
                          onMouseLeave={() => cancelSystemHover()}
                          title={!isSidebarOpen ? tab.label : ''}
                        >
                         <div className={`d-flex align-items-center ${!isSidebarOpen ? 'justify-content-center' : 'justify-content-start gap-2'}`}>
                           <span className="side-icon-wrapper" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.icon}</span>
                           {isSidebarOpen && <div className="navlable fw-medium" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.label}</div>}
                           {isSidebarOpen && <span className="system-tab-metric">{getTabMetric(tab)}</span>}
                           {isSidebarOpen && <FontAwesomeIcon icon={openSystems[tab.id] ? faChevronDown : faChevronRight} className="small ms-auto" style={{ fontSize: '10px' }} />}
                         </div>
                         {isSidebarOpen && (
                           <div className="system-tab-meta">
                             <span>{getTabAccent(tab)}</span>
                             <small>{getTabDesc(tab)}</small>
                           </div>
                         )}
                       </button>
                       <div className={`nav-sub-container ${openSystems[tab.id] ? 'open' : ''}`}>
                         <div className={`nav-sub-content ${!isSidebarOpen ? 'ps-0' : ''}`}>
                           {tab.subTabs.map(sub => (
                              <button
                                key={sub.id}
                                className={`nav-link w-100 text-start mb-1 transition system-subtab-link ${activeTab === sub.id ? 'active' : ''} ${!isSidebarOpen ? 'px-0 justify-content-center' : ''}`}
                                onClick={() => handleSystemClick(systemContext, sub.id)}
                                onMouseEnter={(event) => {
                                  const rect = event.currentTarget.getBoundingClientRect();
                                  scheduleSystemHover(() => handleGroupHover(sub, rect), 60);
                                }}
                                onMouseLeave={() => cancelSystemHover()}
                                title={!isSidebarOpen ? sub.label : ''}
                              >
                               <div className={`d-flex align-items-center ${!isSidebarOpen ? 'justify-content-center' : 'justify-content-start gap-2'}`}>
                                 <span className="side-icon-wrapper" style={{ fontSize: 'var(--sidebar-font-size)' }}>{sub.icon}</span>
                                 {isSidebarOpen && <div className="navlable fw-medium" style={{ fontSize: 'var(--sidebar-font-size)' }}>{sub.label}</div>}
                               </div>
                               {isSidebarOpen && <small className="system-subtab-desc">{sub.desc || 'Workspace view'}</small>}
                             </button>
                           ))}
                         </div>
                       </div>
                     </>
                   ) : (
                    <button
                      className={`nav-link w-100 text-start mb-1 transition system-tab-link ${activeTab === tab.id ? 'active' : ''} ${!isSidebarOpen ? 'px-0 justify-content-center' : ''}`}
                      onClick={() => handleSystemClick(systemContext, tab.id)}
                      onMouseEnter={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        scheduleSystemHover(() => handleGroupHover(tab, rect), 60);
                      }}
                      onMouseLeave={() => cancelSystemHover()}
                      title={!isSidebarOpen ? tab.label : ''}
                    >
                      <div className={`d-flex align-items-center ${!isSidebarOpen ? 'justify-content-center' : 'justify-content-start gap-2'}`}>
                        <span className="side-icon-wrapper" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.icon}</span>
                        {isSidebarOpen && <div className="navlable fw-medium" style={{ fontSize: 'var(--sidebar-font-size)' }}>{tab.label}</div>}
                        {isSidebarOpen && <span className="system-tab-metric ms-auto">{getTabMetric(tab)}</span>}
                      </div>
                      {isSidebarOpen && (
                        <div className="system-tab-meta">
                          <span>{getTabAccent(tab)}</span>
                          <small>{getTabDesc(tab)}</small>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (<>
          {renderTabGroup(t('core'), [
            ...generalTabs,
            { id: 'systems-hub', label: t('systems'), icon: <FontAwesomeIcon icon={faLayerGroup} />, permission: 'sidebar_systems_hub' }
          ])}
          {role === 'SuperAdmin' && renderTabGroup(t('super_admin_console'), superAdminTabs)}
          {role === 'Admin' && renderTabGroup('Admin & Security', adminSecurityTabs)}
          {renderTabGroup(`${t(role.toLowerCase())} ${t('dashboard')}`, dashboardTabs)}
          {renderTabGroup(t('administration'), adminTabs)}
          {role !== 'SuperAdmin' && renderTabGroup(t('common'), allcommonTabs)}
          {renderTabGroup(t('communication'), commonTabs)}
          {renderTabGroup(t('support'), supportTabs)}
          {role !== 'Admin' && renderTabGroup(t('common'), userRequestsTabs)}
          {role !== 'SuperAdmin' && renderTabGroup(t('organization'), organizationTabs)}
          {role !== 'SuperAdmin' && renderTabGroup(t('users_roles'), userManagementTabs)}
          {/* {role === 'SuperAdmin' && renderTabGroup(t('super_admin_console'), superAdminTabs)} */}
          {renderTabGroup(t('workforce'), workforceTabs)}
          {renderTabGroup(t('modules_permissions'), modulesTabs)}
          {renderTabGroup(t('personalization'), themeTabs)}
        </>
        )}

        <div className="mt-4 pb-3">
          {isSidebarOpen && <p className='ms-1 text-uppercase fw-bold' style={{ color: 'var(--sidebar-label-color)', fontSize: 'calc(var(--sidebar-font-size) * 0.9)', letterSpacing: '0.5px' }}>{t('session')}</p>}
          <button className={`btn w-100 text-start fs-6 logoutbtn text-danger ${!isSidebarOpen ? 'px-0 d-flex justify-content-center' : ''}`} onClick={handleLogout} title={!isSidebarOpen ? t('logout') : ""}>
            <FontAwesomeIcon icon={faSignOutAlt} className={isSidebarOpen ? "me-2" : ""} />
            {isSidebarOpen && <span className='lbtn-t' style={{ fontSize: 'var(--sidebar-font-size)' }}>{t('logout')}</span>}
          </button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .sidebar-search-input:focus {
          border-color: var(--primary, #0d6efd) !important;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15);
        }
        .sidebar-search-light {
          background-color: #00000000 !important;
          border-color: #dee2e6 !important;
          color: #212529 !important;
        }
        .sidebar-search-light:focus {
          background-color: #00000000 !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.15) !important;
        }
        .nav-sub-container {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .nav-sub-container.open {
          grid-template-rows: 1fr;
        }
        .nav-sub-content {
          min-height: 0;
          padding-left: 4px;
        }
        .navlable {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .brand-text {
          color: var(--sidebar-text) !important;
          transition: all 0.3s ease;
        }

        .sidebar-container {
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), flex 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 70px;
          overflow-x: hidden;
          scrollbar-width: none;
        }
        
        .sidebar-container::-webkit-scrollbar {
          display: none;
        }
        
        .sidebar-container.sw {
          width: 70px !important;
          flex: 0 0 70px !important;
        }
      `}} />
      </div>
    </>
  );
};

export default Common;
