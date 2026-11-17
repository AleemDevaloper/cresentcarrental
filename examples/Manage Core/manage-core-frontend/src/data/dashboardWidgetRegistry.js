import {
  faChartLine,
  faCoins,
  faPeopleGroup,
  faProjectDiagram,
  faListCheck,
  faFolderTree,
  faAddressBook,
  faGraduationCap,
  faIndustry,
  faMoneyBillTrendUp,
  faRobot,
  faPenRuler,
} from '@fortawesome/free-solid-svg-icons';

export const DASHBOARD_WIDGET_PREFERENCES_KEY = 'dashboardWidgets';

export const dashboardWidgetRegistry = [
  {
    id: 'fms-dashboard',
    module: 'fms',
    label: 'FMS dashboard',
    description: 'Financial health, balances, revenue, expenses, and recent transactions.',
    icon: faCoins,
    color: 'success',
    tab: 'fms_overview',
    requiredPermission: 'system_fms',
    defaultVisible: true,
  },
  {
    id: 'ams-dashboard',
    module: 'ams',
    label: 'AMS dashboard',
    description: 'Accounting KPIs, receivables, cash flow, invoices, and close controls.',
    icon: faChartLine,
    color: 'primary',
    tab: 'erp_dashboard',
    requiredPermission: 'system_ams',
    defaultVisible: true,
  },
  {
    id: 'hrms-dashboard',
    module: 'hrms',
    label: 'HRMS dashboard',
    description: 'Workforce, attendance, compliance, departments, and employee activity.',
    icon: faPeopleGroup,
    color: 'info',
    tab: 'hrms_overview',
    requiredPermission: 'system_hrms',
    defaultVisible: true,
  },
  {
    id: 'pms-dashboard',
    module: 'pms',
    label: 'PMS dashboard',
    description: 'Project delivery health, open work, milestones, and portfolio activity.',
    icon: faProjectDiagram,
    color: 'warning',
    tab: 'pms_overview',
    requiredPermission: 'system_pms',
    defaultVisible: true,
  },
  {
    id: 'tms-dashboard',
    module: 'tms',
    label: 'TMS dashboard',
    description: 'Tasks, heatmaps, productivity, and team workload distribution.',
    icon: faListCheck,
    color: 'danger',
    tab: 'tms_overview',
    requiredPermission: 'system_tms',
    defaultVisible: false,
  },
  {
    id: 'dms-dashboard',
    module: 'dms',
    label: 'DMS dashboard',
    description: 'Document library, storage, recent files, and approval status.',
    icon: faFolderTree,
    color: 'secondary',
    tab: 'dms_overview',
    requiredPermission: 'system_dms',
    defaultVisible: false,
  },
  {
    id: 'crm-dashboard',
    module: 'crm',
    label: 'CRM dashboard',
    description: 'Customer pipeline, leads, deals, and relationship health.',
    icon: faAddressBook,
    color: 'primary',
    tab: 'crm_overview',
    requiredPermission: 'system_crm',
    defaultVisible: false,
  },
  {
    id: 'ems-dashboard',
    module: 'ems',
    label: 'EMS dashboard',
    description: 'Education metrics, attendance, exams, fees, and student progress.',
    icon: faGraduationCap,
    color: 'info',
    tab: 'ems_overview',
    requiredPermission: 'system_ems',
    defaultVisible: false,
  },
  {
    id: 'mfg-dashboard',
    module: 'mfg',
    label: 'MFG dashboard',
    description: 'Manufacturing orders, production lines, output, and shop floor status.',
    icon: faIndustry,
    color: 'warning',
    tab: 'mfg_overview',
    requiredPermission: 'system_mfg',
    defaultVisible: false,
  },
  {
    id: 'fx-dashboard',
    module: 'fx',
    label: 'FX dashboard',
    description: 'Currency exposure, exchange rates, conversion margins, and P&L.',
    icon: faMoneyBillTrendUp,
    color: 'success',
    tab: 'fx_overview',
    requiredPermission: 'system_fx',
    defaultVisible: false,
  },
  {
    id: 'ai-dashboard',
    module: 'ai',
    label: 'AI dashboard',
    description: 'AI usage, token spend, assistants, prompts, and model activity.',
    icon: faRobot,
    color: 'danger',
    tab: 'ai_overview',
    requiredPermission: 'system_ai',
    defaultVisible: false,
  },
  {
    id: 'drawing-dashboard',
    module: 'drawing',
    label: 'Drawing dashboard',
    description: 'Drawings library, revisions, approvals, and design throughput.',
    icon: faPenRuler,
    color: 'secondary',
    tab: 'drawing_overview',
    requiredPermission: 'system_drawing',
    defaultVisible: false,
  },
];

const ADMIN_ROLES = new Set(['Admin', 'SuperAdmin', 'admin', 'superadmin', 'Company Admin', 'company_admin']);

export const getDefaultDashboardWidgetIds = () =>
  dashboardWidgetRegistry.filter(widget => widget.defaultVisible).map(widget => widget.id);

const getUserRole = (user) => (user?.role || '').toString().trim();
const getUserPermissions = (user) => {
  if (Array.isArray(user?.permissions) && user.permissions.length) return user.permissions;
  if (Array.isArray(user?.all_permissions) && user.all_permissions.length) return user.all_permissions;
  return [];
};

export const isAdminUser = (user) => ADMIN_ROLES.has(getUserRole(user));

export const userCanSeeWidget = (user, widget) => {
  if (!widget) return false;
  if (isAdminUser(user)) return true;
  if (!widget.requiredPermission) return true;
  return getUserPermissions(user).includes(widget.requiredPermission);
};

export const getAccessibleDashboardWidgets = (user) =>
  dashboardWidgetRegistry.filter(widget => userCanSeeWidget(user, widget));
