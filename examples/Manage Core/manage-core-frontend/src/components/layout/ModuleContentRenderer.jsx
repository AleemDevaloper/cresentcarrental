import React, { useState, useEffect, Suspense } from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dashmainheading from '../common/Dashmainheading';
import HrmsHeader from '../common/HRMS/HrmsHeader';
import { getHrmsModuleTabs } from '../common/HRMS/HrmsModuleTabs';
import EmsHeader from '../common/EMS/EmsHeader';
import { getEmsModuleTabs } from '../common/EMS/EmsModuleTabs';
import { listProjects } from '../../api/projects';
import { getFeatureById } from '../../data/featureRegistry';
import { 
  faChartLine, 
  faUsers,  
  faChartPie,
  faProjectDiagram,
  faChartBar,
  faGear,
  faComments,
  faBrain,
  faBell,
  faBullhorn,
  faShieldHalved,
  faLayerGroup,
  faUserGear,
  faPalette,
  faSliders,
  faTable,
  faDatabase,
  faCircleQuestion,
  faBoxOpen,
  faClockRotateLeft,
  faBuilding,
  faCalendarDays,
  faFileLines,
  faWallet,
  faScaleBalanced,
  faBookOpen,
  faListCheck,
  faTriangleExclamation,
  faCloudArrowUp,
  faPlus,
  faSync,
  faTimeline,
  faLink,
  faTags,
  faPaperclip,
  faClock,
  faUserShield,
  faCheckCircle,
  faSitemap,
  faPeopleGroup,
  faBriefcase,
  faIdBadge,
  faPaperPlane,
  faFileInvoiceDollar,
  faFileAlt,
  faGaugeHigh,
  faBullseye,
  faMapLocationDot,
  faCoins,
  faRobot,
  faStickyNote,
  faDiagramNext,
  faBuildingColumns,
  faCalendarCheck,
  faGlobe,
  faShieldHeart,
  faFileSignature,
  faHourglassHalf,
  faHistory,
  faCalendarAlt,
  faBrush,
  faMagnifyingGlassChart,
  faUserTie,
  faVault,
  faArrowRightFromBracket,
  faLaptop,
  faUser,
  faUserPlus,
  faStar,
  faReceipt,
  faFingerprint,
  faCreditCard,
  faDollarSign,
  faCalculator,
  faHeadset,
  faArchive,
  faEye,
  faFile,
  faUniversity,
  faKey,
  faBolt,
  faCodeBranch,
  faList,
  faIdCard,
  faHandHoldingDollar,
  faMoneyBillWave,
  faFileContract,
  faRotateLeft,
  faIdCard as faIdCard2,
  faUserCheck,
  faLock, faPhone, faTree, faUpload, faLocationDot,
  faCamera, faQrcode, faHardHat, faUserClock, faPenToSquare,
  faDrawPolygon, faArrowsRotate, faCalendarDay, faMugSaucer,
  faSun, faMoon, faArrowRightArrowLeft, faCalendarWeek, faGauge,
  faUmbrella, faBucket, faChartSimple, faFileImport, faFileExport,
   faLandmark, faPhoneFlip,
   faPeopleArrows,
  faClockRotateLeft as faClockRotateLeft2,
  faTrashCan,
  faFilePen,
  faIndustry,
  faClipboardList,
  faTools,
  faFileInvoice,
  faArrowRotateLeft,
  /* START OF NEW ADDITION: Inventory Service Icon Imports */
  faBoxesStacked,
  faWarehouse,
  faTruck,
  faTruckRampBox
  /* END OF NEW ADDITION: Inventory Service Icon Imports */
  /* START OF NEW ADDITION: POS Retail Icon Imports */,
  faStore,
  /* START OF NEW ADDITION: Fixed Assets Icon Imports */
  faFolder, faPercent, faBook, faGraduationCap,
  faAddressBook,
  faHandshake
  /* END OF NEW ADDITION: Fixed Assets Icon Imports */
} from '@fortawesome/free-solid-svg-icons';

import * as P from '../../data/pageRegistry';

const PageFallback = () => <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>;



const ModuleContentRenderer = () => {
  const { activeTab, activeModule, theme, addNotification } = useApp();
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (activeTab === 'projectentry' || activeTab === 'reports') {
      listProjects({}, { skipAuthRedirect: true }).then(setProjects).catch(console.error);
    }
  }, [activeTab]);

  const renderContent = () => {
    if (activeTab && (activeTab.startsWith('drawing_') || activeTab === 'drawing_overview')) {
      if (activeTab === 'drawing_enterprise_admin') {
        return <><Dashmainheading main="drawing" children="Enterprise Administration" icon={faBuilding} description="Multi-tenant administration, security, governance, compliance, licensing, and monitoring for the Drawing Studio platform." badge="admin" /><P.DrawingEnterpriseAdmin /></>;
      }
      return <><Dashmainheading main="drawing" children="Drawing Studio" icon={faPalette} description="Enterprise Drawing Studio and Visual Workspace for ManageCore" badge="drawing" /><P.DrawingWorkspace /></>;
    }

    if (activeTab && (activeTab.startsWith('hrms_') || activeTab === 'hrms_overview')) {
      const getHrmsComponent = () => {
        switch (activeTab) {
          case 'hrms_command_center': return <P.CommandCenter />;
          case 'hrms_manager_portal': return <P.ManagerPortal />;
          case 'hrms_employee_portal': return <P.EmployeePortal />;
          case 'hrms_portal_provisioning': return <P.PortalProvisioning />;
          case 'hrms_leave_approval': return <P.LeaveApprovalCenter />;
          case 'hrms_attendance_correction': return <P.AttendanceCorrectionPortal />;
          case 'hrms_overtime_management': return <P.OvertimeManagementPortal />;
          case 'hrms_expense_management': return <P.ExpenseManagementPortal />;
          case 'hrms_loan_management': return <P.LoanManagementPortal />;
          case 'hrms_payroll_management': return <P.PayrollManagementPortal />;
          case 'hrms_resignation': return <P.ResignationManagementPortal />;
          case 'hrms_recruitment_management': return <P.RecruitmentManagementPortal />;
          case 'hrms_asset_clearance': return <P.AssetClearancePortal />;
          case 'hrms_employee_database': return <P.EmployeeDatabase />;
          case 'hrms_employee_profile_full': return <P.EmployeeProfileFull />;
          case 'hrms_employee_code': return <P.EmployeeCodeManagement />;
          case 'hrms_rehire': return <P.RehireFlowPortal />;
          case 'hrms_documents': return <P.DocumentsManagement />;
          case 'hrms_bank_details': return <P.BankDetailsManagement />;
          case 'hrms_emergency_contacts': return <P.EmergencyContactsManagement />;
          case 'hrms_reporting_hierarchy': return <P.ReportingHierarchy />;
          case 'hrms_csv_import': return <P.CsvImportCenter />;
          case 'hrms_checkin_checkout': return <P.CheckInOut />;
          case 'hrms_gps_attendance': return <P.GpsAttendance />;
          case 'hrms_selfie_attendance': return <P.SelfieAttendance />;
          case 'hrms_qr_attendance': return <P.QrAttendance />;
          case 'hrms_site_attendance': return <P.SiteAttendanceDashboard />;
          case 'hrms_supervisor_attendance': return <P.SupervisorAttendance />;
          case 'hrms_manual_attendance': return <P.ManualAttendanceRequest />;
          case 'hrms_missing_punch': return <P.MissingPunchCorrection />;
          case 'hrms_red_zone': return <P.RedZoneAttendance />;
          case 'hrms_site_locations': return <P.SiteLocations />;
          case 'hrms_site_gps_radius': return <P.SiteGpsRadius />;
          case 'hrms_geo_fencing': return <P.GeoFencing />;
          case 'hrms_site_assignment': return <P.SiteAssignment />;
          case 'hrms_outdoor_duty': return <P.OutdoorDutyLocation />;
          case 'hrms_physical_leave_entry': return <P.HrmsPhysicalLeaveEntry />;
          case 'hrms_attendance': return <P.HrmsAttendance />;
          case 'hrms_attendance_records': return <P.HrmsAttendanceRecords />;
          case 'hrms_attendance_corrections': return <P.HrmsAttendanceCorrections />;
          case 'hrms_leaves': return <P.HrmsLeaves />;
          case 'hrms_my_leave_balance': return <P.HrmsMyLeaveBalance />;
          case 'hrms_notification_inbox': return <P.HrmsNotificationInbox />;
          case 'hrms_biometric': return <P.BiometricDevices />;
          case 'hrms_biometric_mapping': return <P.BiometricMappingHrms />;
          case 'hrms_raw_punches': return <P.RawPunchesHrms />;
          case 'hrms_unmatched_punches': return <P.UnmatchedPunchesHrms />;
          case 'hrms_overview':
          default:
            return <P.HrmsOverview />;
        }

      };

      const allTabs = getHrmsModuleTabs(t);
      let currentTab = null;
      let activeGroup = null;
      for (const group of allTabs) {
        if (group.id === activeTab) {
          currentTab = group;
          activeGroup = group;
          break;
        }
        if (group.subTabs) {
          const foundSub = group.subTabs.find(st => st.id === activeTab);
          if (foundSub) {
            currentTab = foundSub;
            activeGroup = group;
            break;
          }
        }
      }
      if (!currentTab) {
        currentTab = { id: activeTab, label: activeTab.replace('hrms_', '').replace(/_/g, ' ') };
        activeGroup = currentTab;
      }

      const dashmainIcon = React.isValidElement(currentTab.icon) && currentTab.icon.type === FontAwesomeIcon
        ? currentTab.icon.props.icon
        : faBuilding;

      const getTabKey = (id) => id.replace(/^hrms_/, '').replace(/_group$/, '');

      const getHrmsDesc = () => {
        const g = activeGroup?.id || '';
        if (g === 'hrms_overview' || g === 'hrms_health_dashboard') return 'hrms_overview_desc';
        if (g.includes('attendance') || g.includes('correction') || g.includes('sites') || g.includes('shifts')) return 'hrms_attendance_desc';
        if (g.includes('leave') || g.includes('workflow')) return 'hrms_leaves_desc';
        if (g.includes('payroll') || g.includes('database') || g.includes('records')) return 'hrms_org_desc';
        if (g.includes('biometric')) return 'biometric_devices_desc';
        return 'hrms_overview_desc';
      };

      return (
        <>
          <Dashmainheading
            main="hrms"
            children={currentTab.label || getTabKey(currentTab.id)}
            icon={dashmainIcon}
            description={getHrmsDesc()}
            badge={activeGroup.id !== currentTab.id ? getTabKey(activeGroup.id) : undefined}
          />
          <HrmsHeader activeTab={activeTab}>
            {getHrmsComponent()}
          </HrmsHeader>
        </>
      );
    }

    if (activeTab && activeTab.startsWith('inv_')) {
      const inventoryPages = {
        inv_products: ['Products', P.ErpProducts],
        inv_product_categories: ['Product Categories', P.ErpProductCategories],
        inv_uoms: ['Units of Measure', P.ErpUoms],
        inv_warehouses: ['Warehouses', P.ErpWarehouses],
        inv_stock_movements: ['Stock Movements', P.ErpStockMovements],
        inv_stock_transfers: ['Stock Transfers', P.ErpStockTransfers],
        inv_inventory_valuation: ['Inventory Valuation', P.ErpInventoryValuation],
      };
      const [title, Page] = inventoryPages[activeTab] || [];
      if (Page) {
        return <><Dashmainheading main="inv" children={title} icon={faBoxesStacked} description="Products, warehouses, stock movements, transfers, and valuation." badge="inventory" /><Page /></>;
      }
    }

    if (activeTab && (activeTab.startsWith('ems_') || activeTab === 'ems_overview')) {
      const getEmsComponent = () => {
        switch (activeTab) {
          case 'ems_overview': return <P.EmsDashboard />;
          case 'ems_institution_dashboard': return <P.EmsInstitutionDashboard />;
          case 'ems_institutions': return <P.EmsInstitutions />;
          case 'ems_campuses': return <P.EmsCampuses />;
          case 'ems_departments': return <P.EmsDepartments />;
          case 'ems_programs': return <P.EmsPrograms />;
          case 'ems_academic_years': return <P.EmsAcademicYears />;
          case 'ems_semesters': return <P.EmsSemesters />;
          case 'ems_buildings': return <P.EmsBuildings />;
          case 'ems_rooms': return <P.EmsRooms />;
          case 'ems_student_dashboard': return <P.EmsStudentDashboard />;
          case 'ems_students': return <P.EmsStudents />;
          case 'ems_student_profile': return <P.EmsStudentProfile />;
          case 'ems_parents': return <P.EmsParents />;
          case 'ems_communication': return <P.EmsCommunication />;
          case 'ems_admission_dashboard': return <P.EmsAdmissionDashboard />;
          case 'ems_admissions': return <P.EmsAdmissions />;
          case 'ems_staff_dashboard': return <P.EmsStaffDashboard />;
          case 'ems_teachers': return <P.EmsTeachers />;
          case 'ems_employees': return <P.EmsEmployees />;
          case 'ems_academic_dashboard': return <P.EmsAcademicDashboard />;
          case 'ems_classes': return <P.EmsClasses />;
          case 'ems_subjects': return <P.EmsSubjects />;
          case 'ems_courses': return <P.EmsCourses />;
          case 'ems_attendance_dashboard': return <P.EmsAttendanceDashboard />;
          case 'ems_attendance': return <P.EmsAttendance />;
          case 'ems_timetable_dashboard': return <P.EmsTimetableDashboard />;
          case 'ems_timetables': return <P.EmsTimetables />;
          case 'ems_events': return <P.EmsEvents />;
          case 'ems_assignment_dashboard': return <P.EmsAssignmentDashboard />;
          case 'ems_assignments': return <P.EmsAssignments />;
          case 'ems_exam_dashboard': return <P.EmsExamDashboard />;
          case 'ems_examinations': return <P.EmsExaminations />;
          case 'ems_grades': return <P.EmsGrades />;
          case 'ems_certificates': return <P.EmsCertificates />;
          case 'ems_lms_dashboard': return <P.EmsLmsDashboard />;
          case 'ems_courses_lms': return <P.EmsCoursesLms />;
          case 'ems_library_dashboard': return <P.EmsLibraryDashboard />;
          case 'ems_library': return <P.EmsLibrary />;
          case 'ems_transport_dashboard': return <P.EmsTransportDashboard />;
          case 'ems_transport': return <P.EmsTransport />;
          case 'ems_hostel_dashboard': return <P.EmsHostelDashboard />;
          case 'ems_hostel': return <P.EmsHostel />;
          case 'ems_medical_dashboard': return <P.EmsMedicalDashboard />;
          case 'ems_medical': return <P.EmsMedical />;
          case 'ems_alumni_dashboard': return <P.EmsAlumniDashboard />;
          case 'ems_alumni': return <P.EmsAlumni />;
          case 'ems_research_dashboard': return <P.EmsResearchDashboard />;
          case 'ems_research': return <P.EmsResearch />;
          case 'ems_campus_dashboard': return <P.EmsCampusDashboard />;
          case 'ems_campus_facilities': return <P.EmsCampusFacilities />;
          case 'ems_security_dashboard': return <P.EmsSecurityDashboard />;
          case 'ems_security': return <P.EmsSecurity />;
          case 'ems_fees_dashboard': return <P.EmsFeesDashboard />;
          case 'ems_fees': return <P.EmsFees />;
          case 'ems_analytics': return <P.EmsAnalytics />;
          case 'ems_ai_assistant': return <P.EmsAiAssistant />;
          case 'ems_reports': return <P.EmsReports />;
          case 'ems_settings': return <P.EmsSettings />;
          default: return <P.EmsDashboard />;
        }
      };

      const allTabs = getEmsModuleTabs(t);
      let currentTab = null;
      let activeGroup = null;
      for (const group of allTabs) {
        if (group.id === activeTab) { currentTab = group; activeGroup = group; break; }
        if (group.subTabs) {
          const foundSub = group.subTabs.find(st => st.id === activeTab);
          if (foundSub) { currentTab = foundSub; activeGroup = group; break; }
        }
      }
      if (!currentTab) {
        currentTab = { id: activeTab, label: activeTab.replace('ems_', '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };
        activeGroup = currentTab;
      }

      const dashmainIcon = React.isValidElement(currentTab.icon) && currentTab.icon.type === FontAwesomeIcon
        ? currentTab.icon.props.icon
        : faGraduationCap;

      const getEmsDesc = () => {
        const g = activeGroup?.id || '';
        if (g === 'ems_overview') return 'Central command center for the entire Education Management System';
        if (g.includes('institution')) return 'Manage multi-institution educational organizations';
        if (g.includes('student')) return 'Complete student lifecycle management';
        if (g.includes('admission')) return 'Manage the complete admission lifecycle';
        if (g.includes('staff') || g.includes('teacher') || g.includes('employee')) return 'Manage teachers, faculty, and employees';
        if (g.includes('academic') || g.includes('class') || g.includes('subject') || g.includes('course')) return 'Manage academic structure and curriculum';
        if (g.includes('attendance')) return 'Real-time attendance tracking for students and staff';
        if (g.includes('timetable')) return 'Class scheduling and resource management';
        if (g.includes('assignment')) return 'Create, distribute, and grade assignments';
        if (g.includes('exam') || g.includes('grade') || g.includes('certificate')) return 'Manage examinations, grades, and certifications';
        if (g.includes('lms') || g.includes('course_lms')) return 'Digital learning management platform';
        if (g.includes('library')) return 'Manage library resources and circulation';
        if (g.includes('transport')) return 'Fleet and route management';
        if (g.includes('hostel')) return 'Residential and accommodation management';
        if (g.includes('medical')) return 'Campus health and wellness center';
        if (g.includes('alumni')) return 'Alumni engagement and career services';
        if (g.includes('research')) return 'Research and innovation management';
        if (g.includes('campus')) return 'Smart campus and facility management';
        if (g.includes('security')) return 'Security, safety, and compliance';
        if (g.includes('fee')) return 'Fee collection and financial management';
        return 'Education Management System overview';
      };

      return (
        <div className="ems-root">
          <Dashmainheading
            main="ems"
            children={currentTab.label || activeTab.replace('ems_', '')}
            icon={dashmainIcon}
            description={getEmsDesc()}
            badge={activeGroup.id !== currentTab.id ? activeGroup.label : undefined}
          />
          <EmsHeader activeTab={activeTab}>
            {getEmsComponent()}
          </EmsHeader>
        </div>
      );
    }

    if (activeTab && (activeTab.startsWith('pos_') || activeTab === 'erp_pos_sales_screen' || activeTab === 'erp_cashier_sessions' || activeTab === 'erp_pos_invoices_receipts' || activeTab === 'erp_z_reports')) {
      if (activeTab.startsWith('pos_')) {
        return <><Dashmainheading main="pos" children={activeTab === 'pos_overview' ? 'POS Dashboard' : activeTab.replace('pos_', '').replaceAll('_', ' ')} icon={faStore} description="Independent checkout, catalog, inventory operations, and retail controls." badge="pos" /><P.PosWorkspace /></>;
      }
      const posTabMap = {
        erp_pos_sales_screen: { label: 'POS Sales Screen', icon: faStore, description: 'Operational POS catalog, barcode workflow, cart building, checkout, and transaction processing.', component: P.ErpPosSalesScreen },
        erp_cashier_sessions: { label: 'Cashier Sessions', icon: faUserCheck, description: 'Manage cashier sessions, register, terminal, session, cash, and reconciliation controls.', component: P.ErpCashierSessions },
        erp_pos_invoices_receipts: { label: 'POS Invoices & Receipts', icon: faReceipt, description: 'Manage invoices, receipts, returns, refunds, and payment records with audit history.', component: P.ErpPosInvoicesReceipts },
        erp_z_reports: { label: 'Z-Reports', icon: faChartLine, description: 'View Z-Reports, receipts, exports, settings, permissions, and audit operations.', component: P.ErpZReports },
        pos_overview: { label: 'POS Terminal', icon: faStore, description: 'Independent checkout, payments, receipts, and cashier operations.', component: P.ErpPosSalesScreen },
      };
      const posConfig = posTabMap[activeTab];
      if (posConfig) {
        const PosComponent = posConfig.component;
        return <><Dashmainheading main="pos" children={posConfig.label} icon={posConfig.icon} description={posConfig.description} badge="pos" /><PosComponent /></>;
      }
    }

    switch (activeTab) {
    case 'dashboard':
    case 'overview':
      return <P.AdminOverview />;
    case 'admin_dashboard':
      return <P.AdminDashboardPage />;
    case 'projectentry':
      return <><Dashmainheading main="pms" children="projects" icon={faProjectDiagram} description="project_entry_desc" badge="core" /><P.Projectentry projects={projects} setProjects={setProjects} /></>;
    case 'reports':
      return <><Dashmainheading main="pms" children="project_reports" icon={faChartBar} description="project_reports_desc" badge="analytics" /><P.Report projects={projects} /></>;
    case 'admin-settings':
      return <><Dashmainheading main="system_settings" children="admin" icon={faGear} description="admin_settings_desc" badge="admin" /><P.AdminSettings /></>;
    case 'chat':
      return <><Dashmainheading main="communication" children="messenger" icon={faComments} description="messenger_desc" badge="social" /><P.Chat /></>;
    case 'notifications':
      return <><Dashmainheading main="activity" children="notifications" icon={faBell} description="notifications_desc" badge="updates" /><P.Notification /></>;
    case 'admin_notification_settings':
      return <><Dashmainheading main="settings" children="notification_settings" icon={faBell} description="Configure system-wide notification preferences, webhooks, and DND schedules." badge="admin" /><P.AdminNotificationSettings /></>;
    case 'announcements':
      return <><Dashmainheading main="communication" children="Announcements" icon={faBullhorn} description="Targeted company announcements and policy notices." badge="enterprise" /><P.AnnouncementInbox /></>;
    case 'user-requests':
      return <><Dashmainheading main="common" children="requests" icon={faPaperPlane} description="user_requests" badge="support" /><P.UserRequests /></>;
    case 'role-dashboard':
      return <><Dashmainheading main="security" children="role_dashboard" icon={faChartPie} description="roles_desc" badge="analytics" /><P.RoleDashboard isDark={isDark} addNotification={addNotification} /></>;
    case 'permissions':
      return <><Dashmainheading main="security" children="permissions" icon={faShieldHalved} description="permissions_desc" badge="security" /><P.Permissions /></>;
    case 'modules':
      return <><Dashmainheading main="security" children="modules" icon={faLayerGroup} description="modules_desc" badge="core" /><P.Modules /></>;
    case 'roles':
      return <><Dashmainheading main="security" children="role_management" icon={faUserGear} description="roles_desc" badge="security" /><P.CreateRole /></>;
    case 'add-role':
      return <><Dashmainheading main="security" children="roles_list" icon={faListCheck} description="roles_list_desc" badge="security" /><P.RolesList /></>;
    case 'approvals':
      return <><Dashmainheading main="governance" children="approval_center" icon={faCheckCircle} description="approval_center_desc" badge="admin" /><P.ApprovalCenter /></>;
    case 'audit-logs':
      return <><Dashmainheading main="governance" children="audit_logs" icon={faClockRotateLeft} description="audit_logs_desc" badge="security" /><P.AuditLogs /></>;
    case 'access-requests':
      return <><Dashmainheading main="governance" children="access_requests" icon={faUserShield} description="access_requests_desc" badge="security" /><P.AccessRequests /></>;
    case 'teams':
      return <><Dashmainheading main="users_roles" children="teams" icon={faPeopleGroup} description="teams_productivity_desc" badge="analytics" /><P.TeamsPage /></>;
    case 'teams-productivity':
      return <><Dashmainheading main="users_roles" children="teams_productivity" icon={faChartLine} description="teams_productivity_desc" badge="operational_ai" /><P.TeamsProductivityDashboard /></>;
    case 'team-management':
      return <><Dashmainheading main="users_roles" children="team_management" icon={faBriefcase} description="teams_productivity_desc" badge="management" /><P.TeamManagement /></>;
    case 'dept-management':
      return <><Dashmainheading main="organization" children="department_management" icon={faBuilding} description="dept_mgmt_desc_long" badge="corporate" /><P.DepartmentManagement /></>;
    case 'designation-management':
      return <><Dashmainheading main="organization" children="designation_management" icon={faIdBadge} description="designation_mgmt_desc" badge="corporate" /><P.DesignationManagement /></>;
    case 'users':
      return <><Dashmainheading main="user_mgmt" children="all_users" icon={faUsers} description="users_desc" badge="management" /><P.User /></>;
    case 'add-user':
      return <><Dashmainheading main="user_mgmt" children="register_user" icon={faPlus} description="register_user_desc" badge="management" /><P.AddUser /></>;
    case 'theme':
      return <><Dashmainheading main="appearance" children="global_theme" icon={faPalette} description="theme_desc" badge="ux" /><P.Theme /></>;
    case 'sidebartheme':
      return <><Dashmainheading main="appearance" children="sidebar_config" icon={faSliders} description="sidebar_desc" badge="ux" /><P.Sidebartheme /></>;
    case 'theme-assignment':
      return <><Dashmainheading main="personalization" children="theme_assignment_center" icon={faSitemap} description="theme_assignment_desc" badge="admin" /><P.ThemeAssignmentCenter /></>;
    case 'topnavbar-settings':
      return <><Dashmainheading main="appearance" children="navbar_config" icon={faSliders} description="navbar_desc" badge="ux" /><P.NavbarSettings /></>;
    case 'components':
      return <><Dashmainheading main="personalization" children="components" icon={faTable} description="Global UI components, data table presets, and premium table theming." badge="ux" /><P.TableComponents /></>;
    case 'data-limits':
      return <><Dashmainheading main="admin" children="data_controls" icon={faDatabase} description="data_limits_desc" badge="governance" /><P.DataLimit /></>;
    case 'systems-hub':
      return <><Dashmainheading main="core" children="systems_hub" icon={faLayerGroup} description="systems_hub_desc" badge="core" /><P.SystemsHub /></>;
    case 'ai_overview':
    case 'ai_dashboard':
    case 'ai_new_chat':
    case 'ai_recent_chats':
    case 'ai_projects':
    case 'ai_prompt_library':
    case 'ai_knowledge_base':
    case 'ai_tools':
    case 'ai_files':
    case 'ai_shared_chats':
    case 'ai_analytics':
    case 'ai_automations':
    case 'ai_settings':
    case 'ai_archive':
    case 'ai_trash':
    case 'ai_training_center':
      return <><Dashmainheading main="ai_name" children="ai_workspace" icon={faBrain} description="Enterprise AI Workspace for ManageCore" badge="intelligence" /><P.AiWorkspace /></>;
    case 'faq':
      return <><Dashmainheading main="support" children="faq" icon={faCircleQuestion} description="faq_desc" badge="support" /><P.Faq /></>;
    case 'product-services':
      return <><Dashmainheading main="support" children="products" icon={faBoxOpen} description="products_desc" badge="support" /><P.ProductServices /></>;
    case 'support':
      return <><Dashmainheading main="support" children="support_tickets" icon={faHeadset} description="support_tickets_desc" badge="support" /><P.SupportPage /></>;
    case 'data-backup':
      return <><Dashmainheading main="admin" children="backup_center" icon={faCloudArrowUp} description="backup_center_desc" badge="security" /><P.DataBackupCenter /></>;
    case 'employee-profile':
      return <><Dashmainheading main="hrms" children="employee_profile" icon={faUser} description="manage_employee_profile" badge="hrms" /><P.EmployeeProfile /></>;


    // HRMS Common
    case 'hrms_overview':
      return <><Dashmainheading main="hrms" children="overview" icon={faChartPie} description="hrms_overview_desc" badge="hrms" /><P.HrmsOverview /></>;
    case 'hrms_health_dashboard':
      return <><Dashmainheading main="hrms" children="health_dashboard" icon={faShieldHeart} description="hrms_health_dashboard_desc" badge="operational" /><P.HrmsHealthDashboard /></>;
    case 'hrms_attendance_records':
      return <><Dashmainheading main="hrms" children="attendance_records" icon={faClockRotateLeft} description="hrms_attendance_records_desc" badge="operational" /><P.HrmsAttendanceRecords /></>;
    case 'hrms_attendance_correction':
      return <><Dashmainheading main="hrms" children="attendance_corrections" icon={faClockRotateLeft} description="hrms_attendance_correction_desc" badge="operational" /><P.HrmsAttendanceCorrections /></>;
    case 'hrms_outdoor_duty':
      return <><Dashmainheading main="hrms" children="outdoor_duty" icon={faClockRotateLeft} description="hrms_outdoor_duty_desc" badge="operational" /><P.HrmsOutdoorDuty /></>;
    case 'hrms_physical_leave_entry':
      return <><Dashmainheading main="hrms" children="physical_leave_entry" icon={faCalendarDays} description="hrms_physical_leave_entry_desc" badge="operational" /><P.HrmsPhysicalLeaveEntry /></>;
    case 'hrms_attendance':
      return <><Dashmainheading main="hrms" children="attendance" icon={faClockRotateLeft} description="hrms_attendance_desc" badge="operational" /><P.HrmsAttendance /></>;
    case 'hrms_biometric':
      return <><Dashmainheading main="hrms" children="biometric_devices" icon={faFingerprint} description="biometric_devices_desc" badge="integration" /><P.BiometricDevices /></>;
    case 'hrms_biometric_mapping':
      return <><Dashmainheading main="hrms" children="Biometric Mapping" icon={faCodeBranch} description="biometric_devices_desc" badge="integration" /><P.BiometricMappingHrms /></>;
    case 'hrms_raw_punches':
      return <><Dashmainheading main="hrms" children="Raw Punches" icon={faBolt} description="biometric_devices_desc" badge="processing" /><P.RawPunchesHrms /></>;
    case 'hrms_unmatched_punches':
      return <><Dashmainheading main="hrms" children="Unmatched Punches" icon={faTriangleExclamation} description="biometric_devices_desc" badge="exceptions" /><P.UnmatchedPunchesHrms /></>;
    case 'hrms_leaves':
      return <><Dashmainheading main="hrms" children="leaves" icon={faCalendarDays} description="hrms_leaves_desc" badge="hrms" /><P.HrmsLeaves /></>;
    case 'hrms_org':
      return <><Dashmainheading main="hrms" children="organization" icon={faBuilding} description="hrms_org_desc" badge="corporate" /><P.HrmsOrg /></>;
    case 'hrms_sites_mgmt':
      return <><Dashmainheading main="hrms" children="sites_management" icon={faMapLocationDot} description="manage_sites_desc" badge="config" /><P.SiteManagement /></>;
    case 'hrms_shifts_mgmt':
      return <><Dashmainheading main="hrms" children="shifts_management" icon={faClock} description="manage_shifts_desc" badge="config" /><P.ShiftManagement /></>;
    case 'hrms_payroll_setup':
      return <><Dashmainheading main="hrms" children="payroll_configuration" icon={faWallet} description="manage_payroll_desc" badge="config" /><P.PayrollSetup /></>;
    case 'hrms_payroll_dashboard':
      return <><Dashmainheading main="hrms" children="payroll_management" icon={faFileInvoiceDollar} description="manage_payroll_desc" badge="operational" /><P.PayrollDashboard /></>;
    case 'hrms_assets':
      return <><Dashmainheading main="hrms" children="asset_issuance" icon={faLaptop} description="manage_assets_desc" badge="operational" /><P.HrmsAssetManagement /></>;
    case 'hrms_recruitment':
      return <><Dashmainheading main="hrms" children="recruitment_ats" icon={faBriefcase} description="manage_recruitment_desc" badge="recruitment" /><P.RecruitmentDashboard /></>;
    case 'hrms_onboarding':
      return <><Dashmainheading main="hrms" children="onboarding" icon={faUserPlus} description="manage_onboarding_desc" badge="hrms" /><P.OnboardingPortal /></>;
    case 'hrms_exit':
      return <><Dashmainheading main="hrms" children="exit_management" icon={faArrowRightFromBracket} description="manage_exit_desc" badge="hrms" /><P.ExitManagement /></>;
    case 'hrms_performance':
      return <><Dashmainheading main="hrms" children="performance_reviews" icon={faStar} description="performance_portal_desc" badge="hrms" /><P.PerformancePortal /></>;
    case 'hrms_expenses':
      return <><Dashmainheading main="hrms" children="expense_claims" icon={faReceipt} description="manage_expenses_desc" badge="hrms" /><P.ExpensePortal /></>;
    case 'hrms_overtime':
      return <><Dashmainheading main="hrms" children="overtime" icon={faClock} description="manage_overtime_desc" badge="hrms" /><P.OvertimePortal /></>;

    // PMS Common
    case 'pms_overview':
      return <><Dashmainheading main="pms" children="overview" icon={faChartPie} description="pms_overview_desc" badge="pms" /><P.PmsDashboard /></>;
    case 'pms_tasks':
      return <><Dashmainheading main="pms" children="tasks" icon={faListCheck} description="pms_tasks_desc" badge="operational" /><P.PmsTasks /></>;
    case 'pms_milestones':
      return <><Dashmainheading main="pms" children="milestones" icon={faTimeline} description="pms_milestones_desc" badge="planning" /><P.PmsMilestones /></>;
    case 'pms_calendar':
      return <><Dashmainheading main="pms" children="calendar" icon={faCalendarDays} description="pms_calendar_desc" badge="planning" /><P.PmsCalendar /></>;
    case 'pms_documentation':
      return <><Dashmainheading main="pms" children="documentation" icon={faFileLines} description="pms_docs_desc" badge="core" /><P.PmsDocumentation /></>;
    case 'pms_cost_tracking':
      return <><Dashmainheading main="pms" children="cost_tracking" icon={faWallet} description="pms_cost_desc" badge="financial" /><P.PmsCostTracking /></>;
    case 'pms_budget_tracking':
      return <><Dashmainheading main="pms" children="budget_tracking" icon={faScaleBalanced} description="pms_budget_desc" badge="financial" /><P.PmsBudgetTracking /></>;
    case 'pms_progress_tracking':
      return <><Dashmainheading main="pms" children="progress_tracking" icon={faChartLine} description="pms_progress_desc" badge="analytics" /><P.PmsProgressTracking /></>;
    case 'pms_resource_allocation':
      return <><Dashmainheading main="pms" children="resource_allocation" icon={faUsers} description="pms_resource_desc" badge="management" /><P.PmsResourceAllocation /></>;
    case 'pms_sprint_management':
      return <><Dashmainheading main="pms" children="sprint_management" icon={faClockRotateLeft} description="pms_sprint_desc" badge="agile" /><P.PmsSprintManagement /></>;
    case 'pms_agile_scrum':
      return <><Dashmainheading main="pms" children="agile_scrum" icon={faLayerGroup} description="pms_agile_desc" badge="agile" /><P.PmsAgileScrum /></>;
    case 'pms_backlog_management':
      return <><Dashmainheading main="pms" children="backlog_management" icon={faListCheck} description="pms_backlog_desc" badge="agile" /><P.PmsBacklogManagement /></>;
    case 'pms_risk_tracking':
      return <><Dashmainheading main="pms" children="risk_tracking" icon={faTriangleExclamation} description="pms_risk_desc" badge="governance" /><P.PmsRiskTracking /></>;
    case 'pms_data_backup':
      return <><Dashmainheading main="pms" children="data_backup" icon={faCloudArrowUp} description="pms_backup_desc" badge="security" /><P.PmsDataBackup /></>;

    // FMS ERP / Accounting Modules
    case 'inv_overview':
      return <><Dashmainheading main="inv" children="Inventory Dashboard" icon={faBoxesStacked} description="Live warehouse stock health, availability, expiry, and inventory value." badge="inventory" /><P.InventoryOverview /></>;
    case 'pos_overview':
      return <><Dashmainheading main="pos" children="POS Dashboard" icon={faStore} description="Independent checkout, catalog, inventory operations, and retail controls." badge="pos" /><P.PosWorkspace /></>;
    case 'erp_pos_sales_screen':
      return <><Dashmainheading main="pos" children="POS Sales Screen" icon={faStore} description="Operational POS catalog, barcode workflow, cart building, checkout, and transaction processing." badge="pos" /><P.ErpPosSalesScreen /></>;
    case 'erp_cashier_sessions':
      return <><Dashmainheading main="pos" children="Cashier Sessions" icon={faUserCheck} description="Manage cashier sessions, register, terminal, session, cash, and reconciliation controls." badge="pos" /><P.ErpCashierSessions /></>;
    case 'erp_pos_invoices_receipts':
      return <><Dashmainheading main="pos" children="POS Invoices & Receipts" icon={faReceipt} description="Manage invoices, receipts, returns, refunds, and payment records with audit history." badge="pos" /><P.ErpPosInvoicesReceipts /></>;
    case 'erp_z_reports':
      return <><Dashmainheading main="pos" children="Z-Reports" icon={faChartLine} description="View Z-Reports, receipts, exports, settings, permissions, and audit operations." badge="pos" /><P.ErpZReports /></>;
    case 'erp_dashboard':
      return <><Dashmainheading main="fms" children="Accounting Dashboard" icon={faChartLine} description="Real-time financial status, revenue vs expense, and general ledger indicators." badge="erp" /><P.ErpDashboard /></>;
    case 'erp_payroll_accounting_hub':
      return <><Dashmainheading main="fms" children="Payroll Accounting Hub" icon={faChartLine} description="Integration hub for HRMS payroll, general ledger mappings, and financial validation." badge="payroll" /><P.ErpPayrollHrIntegration initialTab="hub" /></>;
    case 'erp_payroll_journal_postings':
      return <><Dashmainheading main="fms" children="Payroll Journal Postings" icon={faFileInvoice} description="View and manage payroll voucher journal entries posted to General Ledger." badge="payroll" /><P.ErpPayrollHrIntegration initialTab="journals" /></>;
    case 'erp_employee_advances':
      return <><Dashmainheading main="fms" children="Employee Advances Ledger" icon={faCoins} description="Record approved employee advances, disburse loans, and track recovery schedules." badge="payroll" /><P.ErpPayrollHrIntegration initialTab="advances" /></>;
    case 'erp_expense_reimbursements':
      return <><Dashmainheading main="fms" children="Expense Reimbursements" icon={faReceipt} description="Approve employee expense claims, calculate taxes, and post payments to bank." badge="payroll" /><P.ErpPayrollHrIntegration initialTab="reimbursements" /></>;
    case 'erp_settings':
      return <><Dashmainheading main="fms" children="Accounting Settings" icon={faGear} description="Configure base currencies, digital signatures, invoice templates, and tax rates." badge="config" /><P.ErpSettings /></>;
    case 'erp_fiscal_years':
      return <><Dashmainheading main="fms" children="Fiscal Years & Periods" icon={faCalendarDays} description="Lock financial periods, close quarters, and manage accounting calendars." badge="config" /><P.ErpFiscalYears /></>;
    case 'erp_account_types':
      return <><Dashmainheading main="fms" children="Account Types" icon={faTags} description="Define asset, liability, equity, revenue, and expense type tags." badge="config" /><P.ErpAccountTypes /></>;
    case 'erp_account_groups':
      return <><Dashmainheading main="fms" children="Account Groups" icon={faSitemap} description="Define nested, parent-child general ledger account categories." badge="config" /><P.ErpAccountGroups /></>;
    case 'erp_chart_of_accounts':
      return <><Dashmainheading main="fms" children="Chart of Accounts" icon={faCalculator} description="Create and lock ledger accounts mapped across business branches." badge="ledger" /><P.ErpChartOfAccounts /></>;
    case 'erp_opening_balances':
      return <><Dashmainheading main="fms" children="Opening Balances" icon={faCoins} description="Verify ledger debit-credit consistency and import opening balances." badge="ledger" /><P.ErpOpeningBalances /></>;
    case 'erp_customers':
      return <><Dashmainheading main="fms" children="Customers Master" icon={faUsers} description="Central customer database for corporate clients, billing details, and collection rules." badge="sales" /><P.ErpCustomers /></>;
    case 'erp_customer_receipts':
      return <><Dashmainheading main="fms" children="Customer Receipts" icon={faCoins} description="Record customer payments, post collections, and auto-reconcile ledgers." badge="sales" /><P.ErpCustomerReceipts /></>;
    case 'erp_quotations':
      return <><Dashmainheading main="fms" children="Quotations" icon={faFileAlt} description="Issue, track, and convert client quotations to Sales Orders." badge="sales" /><P.ErpQuotations /></>;
    case 'erp_sales_orders':
      return <><Dashmainheading main="fms" children="Sales Orders" icon={faFileSignature} description="Manage order lifecycle, processing warehouses, and dispatches." badge="sales" /><P.ErpSalesOrders /></>;
    case 'erp_delivery_challans':
      return <><Dashmainheading main="fms" children="Delivery Challans" icon={faTimeline} description="Track warehouse dispatch vehicle details, drivers, and receiver approvals." badge="sales" /><P.ErpDeliveryChallans /></>;
    case 'erp_sales_invoices':
      return <><Dashmainheading main="fms" children="Sales Invoices" icon={faFileInvoice} description="Generate client invoices, QR code linkages, and digital signatures." badge="sales" /><P.ErpSalesInvoices /></>;
    case 'erp_create_sales_invoice':
      return <P.ErpCreateSalesInvoice />;
    case 'erp_create_customer':
      return <P.ErpCreateCustomer />;
    case 'erp_create_receipt':
      return <P.ErpCreateReceipt />;
    case 'erp_create_fiscal_year':
      return <P.ErpCreateFiscalYear />;
    case 'erp_define_account_type':
      return <P.ErpDefineAccountType />;
    case 'erp_create_account_group':
      return <P.ErpCreateAccountGroup />;
    case 'erp_add_account':
      return <P.ErpAddAccount />;
    case 'erp_add_balance':
      return <P.ErpAddBalance />;
    case 'erp_create_requisition':
      return <P.ErpCreateRequisition />;
    case 'erp_create_rfq':
      return <P.ErpCreateRfq />;
    case 'erp_create_purchase_order':
      return <P.ErpCreatePurchaseOrder />;
    case 'erp_log_grn_intake':
      return <P.ErpLogGrnIntake />;
    case 'erp_log_vendor_bill':
      return <P.ErpLogVendorBill />;
    case 'erp_log_return_voucher':
      return <P.ErpLogReturnVoucher />;
    case 'erp_create_quotation':
      return <P.ErpCreateDocument documentType="quotation" />;
    case 'erp_create_sales_order':
      return <P.ErpCreateDocument documentType="sales_order" />;
    case 'erp_create_delivery_challan':
      return <P.ErpCreateDocument documentType="delivery_challan" />;
    case 'erp_create_credit_note':
      return <P.ErpCreateDocument documentType="credit_note" />;
    case 'erp_create_sales_return':
      return <P.ErpCreateDocument documentType="sales_return" />;
    case 'erp_credit_notes':
      return <><Dashmainheading main="fms" children="Credit Notes" icon={faStickyNote} description="offset customer ledger invoice lines for returned items or discounts." badge="sales" /><P.ErpCreditNotes /></>;
    case 'erp_sales_returns':
      return <><Dashmainheading main="fms" children="Sales Returns" icon={faHistory} description="Verify quality inspection of returned goods and issue ledger offsets." badge="sales" /><P.ErpSalesReturns /></>;
    case 'erp_purchase_requisitions':
      return <><Dashmainheading main="fms" children="Purchase Requisitions" icon={faClipboardList} description="Department budget requisition requests and procurement approvals." badge="purchase" /><P.ErpPurchaseRequisitions /></>;
    case 'erp_rfqs':
      return <><Dashmainheading main="fms" children="Requests for Quotation (RFQs)" icon={faFileContract} description="Request quotations, vendor bids, and price offers." badge="purchase" /><P.ErpRfqs /></>;
    case 'erp_purchase_orders':
      return <><Dashmainheading main="fms" children="Purchase Orders (POs)" icon={faFileSignature} description="Official procurement orders, terms assignment, and supplier logs." badge="purchase" /><P.ErpPurchaseOrders /></>;
    case 'erp_goods_receipts':
      return <><Dashmainheading main="fms" children="Goods Receipt Notes" icon={faTruckRampBox} description="Inventory dispatch validation, quality audits, and PO matches." badge="purchase" /><P.ErpGoodsReceipts /></>;
    case 'erp_vendor_bills':
      return <><Dashmainheading main="fms" children="Vendor Bills" icon={faReceipt} description="Manage incoming vendor invoices, bills payable, and cash ledgers." badge="purchase" /><P.ErpVendorBills /></>;
        case 'erp_purchase_returns':
      return <><Dashmainheading main="fms" children="Purchase Returns" icon={faArrowRotateLeft} description="Process returned inventory goods, debit notes, and credit memos." badge="purchase" /><P.ErpPurchaseReturns /></>;
    /* START OF NEW ADDITION: Purchases & AP & Budgeting Rendering Cases */
    case 'erp_vendors':
      return <><Dashmainheading main="fms" children="Vendors Master" icon={faUsers} description="Centralized vendor database, supplier categories, e-sign bank setups, and risk checkups." badge="purchase" /><P.ErpVendors /></>;
    case 'erp_vendor_payments':
      return <><Dashmainheading main="fms" children="Vendor Payments" icon={faCoins} description="Track Accounts Payable settlements, match vendor invoices, record cheque runs, and approve transfers." badge="purchase" /><P.ErpVendorPayments /></>;
    case 'erp_cost_centers':
      return <><Dashmainheading main="fms" children="Cost Centers Master" icon={faSitemap} description="SAP CO Cost Center structure, headcount direct allocations, and budget ceilings." badge="budget" /><P.ErpCostCenters /></>;
    case 'erp_analytic_accounts':
      return <><Dashmainheading main="fms" children="Analytic Accounts" icon={faCalculator} description="Cross-dimensional analytic journals, project margin metrics, and customized formulas." badge="budget" /><P.ErpAnalyticAccounts /></>;
    case 'erp_budget_plans':
      return <><Dashmainheading main="fms" children="Budget Plans" icon={faFileInvoiceDollar} description="Annual/Quarterly CAPEX & OPEX budget wizard, version compare, and AI scenario forecasting." badge="budget" /><P.ErpBudgetPlans /></>;
    case 'erp_budget_vs_actual':
      return <><Dashmainheading main="fms" children="Budget vs Actual Variance" icon={faChartLine} description="Real-time variance reconciliation, Favorable/Unfavorable indicators, and AI savings recommendations." badge="budget" /><P.ErpBudgetVsActual /></>;
    case 'erp_budget_alerts':
      return <><Dashmainheading main="fms" children="Budget Alert Center" icon={faBell} description="Trigger rules config, Slack/Teams webhooks, and auto-escalation risk queues." badge="budget" /><P.ErpBudgetAlerts /></>;
    /* END OF NEW ADDITION: Purchases & AP & Budgeting Rendering Cases */
    /* START OF NEW ADDITION: Fixed Assets Rendering Cases */
    case 'erp_fixed_assets':
      return <><Dashmainheading main="fms" children="Fixed Asset Register" icon={faBuilding} description="Manage the complete lifecycle of company assets including acquisition, depreciation, maintenance, transfers, insurance, audits, and disposals." badge="fixed-assets" /><P.ErpFixedAssets /></>;
    case 'erp_asset_categories':
      return <><Dashmainheading main="fms" children="Asset Categories" icon={faFolder} description="Organize and classify company assets into structured categories with predefined accounting rules, depreciation methods, financial mappings, and lifecycle settings." badge="fixed-assets" /><P.ErpAssetCategories /></>;
    case 'erp_asset_locations':
      return <><Dashmainheading main="fms" children="Asset Locations" icon={faLocationDot} description="Manage physical locations, branches, buildings, floors, rooms, warehouses, and sites where company assets are stored or assigned." badge="fixed-assets" /><P.ErpAssetLocations /></>;
    case 'erp_asset_depreciation':
      return <><Dashmainheading main="fms" children="Fixed Asset Depreciation" icon={faPercent} description="Manage automated asset depreciation, accounting entries, fiscal postings, depreciation schedules, and financial compliance." badge="fixed-assets" /><P.ErpAssetDepreciation /></>;
    case 'erp_asset_disposals':
      return <><Dashmainheading main="fms" children="Fixed Asset Disposals" icon={faTrashCan} description="Manage asset retirement, disposal, sales, write-offs, transfers, scrapping, donations, and gain/loss accounting." badge="fixed-assets" /><P.ErpAssetDisposals /></>;
    case 'erp_asset_book_value_report':
      return <><Dashmainheading main="fms" children="Book Value Report" icon={faFileInvoiceDollar} description="Analyze acquisition cost, accumulated depreciation, net book value, asset performance, replacement planning, and executive financial insights across the organization." badge="fixed-assets" /><P.ErpAssetBookValueReport /></>;
    /* END OF NEW ADDITION: Fixed Assets Rendering Cases */
    /* START OF NEW ADDITION: Inventory Service Rendering Cases */
    case 'erp_products':
      return <><Dashmainheading main="fms" children="Products Master" icon={faBoxesStacked} description="Centralized product master database, SKU mappings, and inventory controls." badge="purchase" /><P.ErpProducts /></>;
    case 'erp_product_categories':
      return <><Dashmainheading main="fms" children="Product Categories" icon={faTags} description="Manage hierarchical parent-child product classifications." badge="purchase" /><P.ErpProductCategories /></>;
    case 'erp_uoms':
      return <><Dashmainheading main="fms" children="Units of Measure" icon={faScaleBalanced} description="Set unit measurement codes and stock conversion packaging rules." badge="purchase" /><P.ErpUoms /></>;
    case 'erp_warehouses':
      return <><Dashmainheading main="fms" children="Warehouses" icon={faWarehouse} description="Track storage capacity, aisle zones, and material bins." badge="purchase" /><P.ErpWarehouses /></>;
    case 'erp_stock_movements':
      return <><Dashmainheading main="fms" children="Stock Movements" icon={faHistory} description="Audit trail of receipts, transfers, and adjustments ledger." badge="purchase" /><P.ErpStockMovements /></>;
    case 'erp_stock_transfers':
      return <><Dashmainheading main="fms" children="Stock Transfers" icon={faTruck} description="Create and approve transfer orders between warehouses." badge="purchase" /><P.ErpStockTransfers /></>;
    case 'erp_inventory_valuation':
      return <><Dashmainheading main="fms" children="Inventory Valuation" icon={faCoins} description="Audit material costing values (FIFO, LIFO, WAC) and revaluation adjustments." badge="purchase" /><P.ErpInventoryValuation /></>;
    /* END OF NEW ADDITION: Inventory Service Rendering Cases */
    /* START OF NEW ADDITION: Banking, Transactions & Tax Rendering Cases */
    case 'erp_bank_cash_accounts':
      return <><Dashmainheading main="fms" children="Bank / Cash Accounts" icon={faBuildingColumns} description="Manage enterprise bank accounts, cash accounts, petty cash, treasury accounts, and financial institutions with complete accounting integration." badge="banking" /><P.ErpBankCashAccounts /></>;
    case 'erp_bank_cash_vouchers':
      return <><Dashmainheading main="fms" children="Bank / Cash Vouchers" icon={faReceipt} description="Manage enterprise cash receipts, bank receipts, payments, contra entries, adjustments, and financial vouchers with complete accounting and audit integration." badge="banking" /><P.ErpBankCashVouchers /></>;
    case 'erp_bank_transfers':
      return <><Dashmainheading main="fms" children="Transfers Management" icon={faHistory} description="Manage enterprise internal fund transfers across banks, cash accounts, branches, companies, and treasury with complete accounting and audit integration." badge="banking" /><P.ErpBankTransfers /></>;
    case 'erp_bank_reconciliation':
      return <><Dashmainheading main="fms" children="Bank Reconciliation" icon={faScaleBalanced} description="Automatically reconcile bank statements with ERP transactions using intelligent matching, approval workflows, and complete audit trails." badge="banking" /><P.ErpBankReconciliation /></>;
    case 'erp_journal_entries':
      return <><Dashmainheading main="fms" children="Journal Entries" icon={faFileInvoice} description="Record, approve, post, reverse, and audit enterprise financial transactions with complete General Ledger integration." badge="transactions" /><P.ErpJournalEntries /></>;
    case 'erp_tax_categories':
      return <><Dashmainheading main="fms" children="Tax Categories Configuration" icon={faFolder} description="Configure enterprise tax classifications used throughout Accounting, Sales, Purchases, Inventory, Payroll, Manufacturing, Treasury, and Financial Reporting." badge="tax" /><P.ErpTaxCategories /></>;
    case 'erp_tax_rates':
      return <><Dashmainheading main="fms" children="Tax Rates Manager" icon={faPercent} description="Configure and manage enterprise tax rates with effective date control, compliance validation, and automatic ERP-wide tax calculations." badge="tax" /><P.ErpTaxRates /></>;
    case 'erp_tax_profiles':
      return <><Dashmainheading main="fms" children="Tax Profiles Database" icon={faUsers} description="Configure enterprise tax identities, compliance settings, registration information, exemptions, and taxation behavior across the ERP." badge="tax" /><P.ErpTaxProfiles /></>;
    case 'erp_sales_tax_report':
      return <><Dashmainheading main="fms" children="Sales Tax Report (FBR Compliance)" icon={faFileInvoiceDollar} description="Prepare, analyze, reconcile and file enterprise Sales Tax Returns with complete Pakistan FBR compliance." badge="tax" /><P.ErpSalesTaxReport /></>;
    case 'erp_withholding_tax_report':
      return <><Dashmainheading main="fms" children="Withholding Tax Report (FBR Compliance)" icon={faFileContract} description="Monitor, calculate, reconcile and file enterprise withholding taxes with complete Pakistan FBR compliance." badge="tax" /><P.ErpWithholdingTaxReport /></>;
    /* END OF NEW ADDITION: Banking, Transactions & Tax Rendering Cases */
    /* START OF NEW ADDITION: Approvals & Controls Rendering Cases */
    case 'erp_approval_dashboard':
      return <><Dashmainheading main="fms" children="Approval Dashboard" icon={faChartLine} description="Monitor pending approvals queue, SLA timelines, and historical signatures." badge="approvals" /><P.ErpApprovalDashboard /></>;
    case 'erp_approval_requests':
      return <><Dashmainheading main="fms" children="Approval Requests" icon={faFileSignature} description="Track and file authorization requests for ledger postings and budget transactions." badge="approvals" /><P.ErpApprovalRequests /></>;
    case 'erp_approval_workflows':
      return <><Dashmainheading main="fms" children="Approval Workflows" icon={faSitemap} description="Design budget spend thresholds and multi-level signature routing steps." badge="approvals" /><P.ErpApprovalWorkflows /></>;
    case 'erp_audit_trail':
      return <><Dashmainheading main="fms" children="Audit Trail Logs" icon={faHistory} description="Audit database changes, modified transaction values, and structural updates." badge="audit" /><P.ErpAuditTrail /></>;
    case 'erp_drafts':
      return <><Dashmainheading main="fms" children="Draft Documents" icon={faFilePen} description="Review and manage all draft accounting documents before they are finalized and posted to the general ledger." badge="drafts" /><P.ErpDrafts /></>;
    case 'erp_accounting_trash':
      return <><Dashmainheading main="fms" children="Accounting Trash Bin" icon={faTrashCan} description="Verify soft-deleted invoices, archived purchase orders, and deleted vendors before purge." badge="maintenance" /><P.ErpAccountingTrash /></>;
    case 'erp_import_export':
      return <><Dashmainheading main="fms" children="CSV / Excel Import & Export" icon={faScaleBalanced} description="Perform bulk imports via schema templates and download ledger tables." badge="imports" /><P.ErpImportExport /></>;
    case 'erp_automation_center':
      return <><Dashmainheading main="fms" children="Robotic Automation Center" icon={faBolt} description="Configure recurring general ledger vouchers and automatic invoice matching." badge="automation" /><P.ErpAutomationCenter /></>;
    /* END OF NEW ADDITION: Approvals & Controls Rendering Cases */
    /* START OF NEW ADDITION: Reports & Executive Pack Rendering Cases */
    case 'erp_report_center':
      return <><Dashmainheading main="fms" children="Accounting Report Center" icon={faFileAlt} description="Company-scoped financial reports with posted double-entry accounting data, executive summaries, print-ready statements, compliance reports and financial control monitoring." badge="reports" /><P.ErpReportCenter /></>;
    case 'erp_executive_summary':
      return <><Dashmainheading main="fms" children="Executive Finance Summary" icon={faChartLine} description="Board-level snapshot for selected company using posted accounting transactions, financial reports, and real-time ERP analytics." badge="reports" /><P.ErpExecutiveSummary /></>;
    case 'erp_control_center':
      return <><Dashmainheading main="fms" children="Finance Control Center" icon={faSliders} description="Monitor accounting operations, financial performance, approvals, journals, banking activities, compliance status, and ERP system health from one centralized dashboard." badge="reports" /><P.ErpControlCenter /></>;
    case 'erp_quality_assurance':
      return <><Dashmainheading main="fms" children="Finance Quality Assurance" icon={faShieldHalved} description="Validate configuration, accounting integrity, security, workflows, compliance, performance, and ERP readiness before production deployment." badge="reports" /><P.ErpQualityAssurance /></>;
    case 'erp_day_book':
      return <><Dashmainheading main="fms" children="Day Book Report" icon={faBookOpen} description="Display all posted accounting journal entries in chronological order." badge="reports" /><P.ErpDayBook /></>;
    case 'erp_general_ledger':
      return <><Dashmainheading main="fms" children="General Ledger Report" icon={faCalculator} description="View detailed account-wise ledger transactions with running balance." badge="reports" /><P.ErpGeneralLedger /></>;
    case 'erp_trial_balance':
      return <><Dashmainheading main="fms" children="Trial Balance Report" icon={faScaleBalanced} description="Review every ledger account and validate accounting accuracy." badge="reports" /><P.ErpTrialBalance /></>;
    case 'erp_profit_loss':
      return <><Dashmainheading main="fms" children="Profit & Loss Statement" icon={faChartLine} description="Analyze business profitability by reviewing revenue, cost of goods sold, and expenses." badge="reports" /><P.ErpProfitLoss /></>;
    case 'erp_balance_sheet':
      return <><Dashmainheading main="fms" children="Balance Sheet Statement" icon={faFileInvoice} description="Display company financial position by presenting Assets, Liabilities, Equity, and Current Year Profit/Loss." badge="reports" /><P.ErpBalanceSheet /></>;
    case 'erp_cash_flow':
      return <><Dashmainheading main="fms" children="Cash Flow Statement" icon={faCoins} description="Operating, investing and financing cash movement with opening and closing balances." badge="reports" /><P.ErpCashFlow /></>;
    case 'erp_customer_ledger_summary':
      return <><Dashmainheading main="fms" children="Customer Ledger Summary" icon={faUsers} description="Customer-wise opening balances, posted invoices, receipts, unapplied receipts and outstanding balances." badge="reports" /><P.ErpCustomerLedgerSummary /></>;
    case 'erp_vendor_ledger_summary':
      return <><Dashmainheading main="fms" children="Vendor Ledger Summary" icon={faUsers} description="Vendor-wise posted bills, payments, unapplied payments and outstanding payable balances." badge="reports" /><P.ErpVendorLedgerSummary /></>;
    case 'erp_receivables_aging':
      return <><Dashmainheading main="fms" children="Receivables Aging" icon={faClock} description="Open posted invoices plus customer opening balances grouped by overdue age buckets for AR collection follow-up." badge="reports" /><P.ErpReceivablesAging /></>;
    case 'erp_payables_aging':
      return <><Dashmainheading main="fms" children="Payables Aging" icon={faClock} description="Open posted purchase bills and vendor opening balances grouped by overdue age buckets for Accounts Payable management and payment planning." badge="reports" /><P.ErpPayablesAging /></>;

    /* START OF NEW ADDITION: ERP Add/Create Tab Cases (Phase C, 2026-07-19) */
    case 'erp_add_vendor':
      return <P.ErpAddVendor />;
    case 'erp_create_payment_run':
      return <P.ErpCreatePaymentRun />;
    case 'erp_create_cost_center':
      return <P.ErpCreateCostCenter />;
    case 'erp_create_analytic_account':
      return <P.ErpCreateAnalyticAccount />;
    case 'erp_create_alert_rule':
      return <P.ErpCreateAlertRule />;
    case 'erp_add_asset':
      return <P.ErpAddAsset />;
    case 'erp_add_asset_category':
      return <P.ErpAddAssetCategory />;
    case 'erp_add_asset_location':
      return <P.ErpAddAssetLocation />;
    case 'erp_run_depreciation':
      return <P.ErpRunDepreciation />;
    case 'erp_dispose_asset':
      return <P.ErpDisposeAsset />;
    case 'erp_add_product':
      return <P.ErpAddProduct />;
    case 'erp_add_product_category':
      return <P.ErpAddProductCategory />;
    case 'erp_add_uom':
      return <P.ErpAddUom />;
    case 'erp_add_warehouse':
      return <P.ErpAddWarehouse />;
    case 'erp_add_stock_movement':
      return <P.ErpAddStockMovement />;
    case 'erp_request_stock_transfer':
      return <P.ErpRequestStockTransfer />;
    case 'erp_open_shift_session':
      return <P.ErpOpenShiftSession />;
    case 'erp_create_voucher':
      return <P.ErpCreateVoucher />;
    case 'erp_create_transfer':
      return <P.ErpCreateTransfer />;
    case 'erp_import_bank_statement':
      return <P.ErpImportBankStatement />;
    case 'erp_create_journal_entry':
      return <P.ErpCreateJournalEntry />;
    case 'erp_create_tax_category':
      return <P.ErpCreateTaxCategory />;
    case 'erp_create_tax_rate':
      return <P.ErpCreateTaxRate />;
    case 'erp_create_tax_profile':
      return <P.ErpCreateTaxProfile />;
    /* END OF NEW ADDITION: ERP Add/Create Tab Cases */

    /* END OF NEW ADDITION: Reports & Executive Pack Rendering Cases */

    // FMS Common
    case 'fms_overview':
      return <><Dashmainheading main="fms" children="overview" icon={faChartPie} description="fms_overview_desc" badge="fms" /><P.FmsDashboard /></>;
    case 'fms_invoice_management':
      return <><Dashmainheading main="fms" children="invoice_management" icon={faFileInvoiceDollar} description="Create, approve, send, track, and print customer invoices." badge="billing" /><P.InvoiceGenerationCenter isDark={isDark} mode="manage" /></>;
    case 'fms_invoice_dashboard':
      return <><Dashmainheading main="fms" children="Invoice Dashboard" icon={faGaugeHigh} description="Dashboard overview of the full invoice management workflow." badge="billing" /><P.InvoiceGenerationCenter isDark={isDark} mode="manage" /></>;
    case 'fms_generate_invoice':
      return <><Dashmainheading main="fms" children="Generate Invoice" icon={faPlus} description="Create new customer invoices with line items, taxes, approvals, and payment terms." badge="billing" /><P.InvoiceGenerationCenter isDark={isDark} mode="generate" /></>;
    case 'fms_import_invoice':
      return <><Dashmainheading main="fms" children="Import Invoice" icon={faFileImport} description="Import invoice records from CSV, Excel, or external billing systems." badge="import" /><P.InvoiceGenerationCenter isDark={isDark} mode="import" /></>;
    case 'fms_export_invoice':
      return <><Dashmainheading main="fms" children="Export Invoice" icon={faFileExport} description="Export invoice registers, filtered billing records, and audit-ready invoice reports." badge="export" /><P.InvoiceGenerationCenter isDark={isDark} mode="export" /></>;
    case 'fms_expense_reimbursement':
      return <><Dashmainheading main="fms" children="fms_expense_reimbursement" icon={faFileInvoiceDollar} description="fms_expense_reimbursement" badge="expenses" /><P.ExpenseReimbursement isDark={isDark} /></>;
    case 'fms_receipt_upload':
      return <><Dashmainheading main="fms" children="receipt_upload" icon={faCloudArrowUp} description="receipt_upload" badge="expenses" /><P.ReceiptUpload isDark={isDark} /></>;
    case 'fms_scheduled_payments':
      return <><Dashmainheading main="fms" children="scheduled_payments" icon={faCalendarDays} description="scheduled_payments" badge="payments" /><P.ScheduledPayments isDark={isDark} /></>;
    case 'fms_financial_approval_workflow':
      return <><Dashmainheading main="fms" children="financial_approval_workflow" icon={faProjectDiagram} description="financial_approval_workflow" badge="governance" /><P.FinancialApprovalWorkflow isDark={isDark} /></>;
    case 'fms_expense_categories':
      return <><Dashmainheading main="fms" children="expense_categories" icon={faTags} description="expense_categories" badge="taxonomy" /><P.ExpenseCategories isDark={isDark} /></>;
    case 'fms_income_categories':
      return <><Dashmainheading main="fms" children="income_categories" icon={faChartLine} description="income_categories" badge="revenue" /><P.IncomeCategories isDark={isDark} /></>;
    case 'fms_overtime_calculations':
      return <><Dashmainheading main="fms" children="overtime_calculations" icon={faClock} description="overtime_calculations" badge="payroll" /><P.OvertimeCalculations isDark={isDark} /></>;
    case 'fms_commission_management':
      return <><Dashmainheading main="fms" children="commission_management" icon={faChartPie} description="commission_management" badge="payroll" /><P.CommissionManagement isDark={isDark} /></>;
    case 'fms_budget_approval_workflow':
      return <><Dashmainheading main="fms" children="budget_approval_workflow" icon={faSitemap} description="budget_approval_workflow" badge="governance" /><P.BudgetApprovalWorkflow isDark={isDark} /></>;
    case 'fms_employee_reimbursements':
      return <><Dashmainheading main="fms" children="employee_reimbursements" icon={faWallet} description="employee_reimbursements" badge="expenses" /><P.EmployeeReimbursements isDark={isDark} /></>;
    case 'fms_vat_gst_support':
      return <><Dashmainheading main="fms" children="vat_gst_support" icon={faScaleBalanced} description="vat_gst_support" badge="compliance" /><P.VatGstSupport isDark={isDark} /></>;
    case 'fms_withholding_tax':
      return <><Dashmainheading main="fms" children="withholding_tax" icon={faFileInvoiceDollar} description="withholding_tax" badge="compliance" /><P.WithholdingTax isDark={isDark} /></>;
    case 'fms_recurring_transactions':
      return <><Dashmainheading main="fms" children="recurring_transactions" icon={faSync} description="recurring_transactions" badge="automation" /><P.RecurringTransactions isDark={isDark} /></>;
    case 'fms_refund_management':
      return <><Dashmainheading main="fms" children="refund_management" icon={faScaleBalanced} description="refund_management" badge="finance" /><P.RefundManagement isDark={isDark} /></>;
    case 'fms_refund_tracking':
      return <><Dashmainheading main="fms" children="refund_tracking" icon={faTimeline} description="refund_tracking" badge="logistics" /><P.RefundTracking isDark={isDark} /></>;
    case 'fms_inventory_accounting':
      return <><Dashmainheading main="fms" children="inventory_accounting" icon={faBoxOpen} description="inventory_accounting" badge="assets" /><P.InventoryAccounting isDark={isDark} /></>;
    case 'fms_stock_valuation':
      return <><Dashmainheading main="fms" children="stock_valuation" icon={faChartPie} description="stock_valuation" badge="assets" /><P.StockValuation isDark={isDark} /></>;
    case 'fms_inventory_cost_tracking':
      return <><Dashmainheading main="fms" children="inventory_cost_tracking" icon={faChartLine} description="inventory_accounting" badge="assets" /><P.InventoryCostTracking isDark={isDark} /></>;
    case 'fms_warehouse_financial_tracking':
      return <><Dashmainheading main="fms" children="warehouse_financial_tracking" icon={faBuilding} description="warehouse_financial_tracking" badge="assets" /><P.WarehouseFinancialTracking isDark={isDark} /></>;
    case 'fms_asset_tracking':
      return <><Dashmainheading main="fms" children="asset_tracking" icon={faBuilding} description="asset_tracking" badge="assets" /><P.AssetTracking isDark={isDark} /></>;
    case 'fms_investment_tracking':
      return <><Dashmainheading main="fms" children="investment_tracking" icon={faChartPie} description="investment_tracking" badge="funding" /><P.InvestmentTracking isDark={isDark} /></>;
    case 'fms_loan_management':
      return <><Dashmainheading main="fms" children="loan_management" icon={faDatabase} description="loan_management" badge="funding" /><P.LoanManagement isDark={isDark} /></>;
    case 'fms_emi_tracking':
      return <><Dashmainheading main="fms" children="emi_tracking" icon={faClock} description="emi_tracking" badge="funding" /><P.EmiTracking isDark={isDark} /></>;
    case 'fms_export_reports':
      return <><Dashmainheading main="fms" children="export_reports" icon={faChartBar} description="export_reports" badge="exports" /><P.ExportReports isDark={isDark} /></>;
    case 'fms_automated_reports':
      return <><Dashmainheading main="fms" children="automated_reports" icon={faCalendarDays} description="automated_reports" badge="exports" /><P.AutomatedReports isDark={isDark} /></>;
    case 'fms_data_backup':
      return <><Dashmainheading main="fms" children="data_backup" icon={faCloudArrowUp} description="data_backup" badge="compliance" /><P.DataBackup isDark={isDark} /></>;
    case 'fms_file_attachments':
      return <><Dashmainheading main="fms" children="file_attachments" icon={faPaperclip} description="file_attachments" badge="compliance" /><P.FileAttachments isDark={isDark} /></>;
    case 'fms_e_signature':
      return <><Dashmainheading main="fms" children="e_signature" icon={faShieldHalved} description="e_signature" badge="compliance" /><P.ESignatureSupport isDark={isDark} /></>;
    case 'fms_kpi_monitoring':
      return <><Dashmainheading main="fms" children="kpi_monitoring" icon={faGaugeHigh} description="kpi_monitoring_desc" badge="performance" /><P.KpiMonitoring isDark={isDark} /></>;
    case 'fms_financial_goal_tracking':
      return <><Dashmainheading main="fms" children="financial_goal_tracking" icon={faBullseye} description="financial_goal_tracking_desc" badge="strategy" /><P.FinancialGoalTracking isDark={isDark} /></>;
    case 'fms_department_budgeting':
      return <><Dashmainheading main="fms" children="department_budgeting" icon={faBuildingColumns} description="department_budgeting_desc" badge="budgeting" /><P.DepartmentBudgeting isDark={isDark} /></>;
    case 'fms_cost_center_management':
      return <><Dashmainheading main="fms" children="cost_center_management" icon={faMapLocationDot} description="cost_center_management_desc" badge="budgeting" /><P.CostCenterManagement isDark={isDark} /></>;
    case 'fms_profit_center_management':
      return <><Dashmainheading main="fms" children="profit_center_management" icon={faCoins} description="profit_center_management_desc" badge="budgeting" /><P.ProfitCenterManagement isDark={isDark} /></>;
    case 'fms_custom_report_builder':
      return <><Dashmainheading main="fms" children="custom_report_builder" icon={faRobot} description="custom_report_builder_desc" badge="intelligence" /><P.CustomReportBuilder isDark={isDark} /></>;
    // case 'fms_tenant_management': 
      // return <><Dashmainheading main="superadmin" children="tenant_management" icon={faBuildingShield} description="tenant_management_desc" badge="admin" /><P.TenantManagement isDark={isDark} /></>;
    case 'fms_session_management':
      return <><Dashmainheading main="fms" children="session_management" icon={faUserShield} description="session_management_desc" badge="security" /><P.SessionManagement isDark={isDark} /></>;
    case 'fms_internal_notes':
      return <><Dashmainheading main="fms" children="internal_notes" icon={faStickyNote} description="internal_notes_desc" badge="knowledge" /><P.InternalNotes isDark={isDark} /></>;
    case 'fms_approval_chains':
      return <><Dashmainheading main="fms" children="approval_chains" icon={faLink} description="approval_chains_desc" badge="governance" /><P.ApprovalChains isDark={isDark} /></>;
    case 'fms_workflow_automation':
      return <><Dashmainheading main="fms" children="workflow_automation" icon={faDiagramNext} description="workflow_automation_desc" badge="automation" /><P.WorkflowAutomation isDark={isDark} /></>;
    case 'fms_calendar_integration':
      return <><Dashmainheading main="fms" children="calendar_integration" icon={faCalendarCheck} description="calendar_integration_desc" badge="planning" /><P.CalendarIntegration isDark={isDark} /></>;
    case 'fms_compliance_management':
      return <><Dashmainheading main="fms" children="compliance_management" icon={faShieldHeart} description="compliance_management_desc" badge="compliance" /><P.ComplianceManagement isDark={isDark} /></>;
    case 'fms_audit_compliance_reports':
      return <><Dashmainheading main="fms" children="audit_compliance_reports" icon={faFileSignature} description="audit_compliance_reports_desc" badge="audit" /><P.AuditComplianceReports isDark={isDark} /></>;
    case 'fms_data_recovery_system':
      return <><Dashmainheading main="fms" children="data_recovery_system" icon={faHistory} description="data_recovery_system_desc" badge="security" /><P.DataRecoverySystem isDark={isDark} /></>;
    case 'fms_financial_calendar':
      return <><Dashmainheading main="fms" children="financial_calendar" icon={faCalendarAlt} description="financial_calendar_desc" badge="planning" /><P.FinancialCalendar isDark={isDark} /></>;
    case 'fms_reminder_system':
      return <><Dashmainheading main="fms" children="reminder_system" icon={faBell} description="reminder_system_desc" badge="automation" /><P.ReminderSystem isDark={isDark} /></>;
    case 'fms_currency_exchange_tracking':
      return <><Dashmainheading main="fms" children="currency_exchange_tracking" icon={faGlobe} description="currency_exchange_tracking_desc" badge="revenue" /><P.CurrencyExchangeTracking isDark={isDark} /></>;
    case 'fms_ip_restrictions':
      return <><Dashmainheading main="fms" children="ip_restrictions" icon={faUserShield} description="ip_restrictions_desc" badge="security" /><P.IpRestrictions isDark={isDark} /></>;
    case 'fms_real_time_collaboration':
      return <><Dashmainheading main="fms" children="real_time_collaboration" icon={faComments} description="real_time_collaboration_desc" badge="collaboration" /><P.RealTimeCollaboration isDark={isDark} /></>;
    case 'fms_regional_accounting_standards':
      return <><Dashmainheading main="fms" children="regional_accounting_standards" icon={faGlobe} description="regional_accounting_standards_desc" badge="compliance" /><P.RegionalAccountingStandards isDark={isDark} /></>;
    case 'fms_project_cost_tracking':
      return <><Dashmainheading main="fms" children="project_cost_tracking" icon={faChartLine} description="project_cost_tracking_desc" badge="budgeting" /><P.ProjectCostTracking isDark={isDark} /></>;
    case 'fms_project_budget_tracking':
      return <><Dashmainheading main="fms" children="project_budget_tracking" icon={faDatabase} description="project_budget_tracking_desc" badge="budgeting" /><P.ProjectBudgetTracking isDark={isDark} /></>;
    case 'fms_time_billing':
      return <><Dashmainheading main="fms" children="time_billing" icon={faHourglassHalf} description="time_billing_desc" badge="budgeting" /><P.TimeBilling isDark={isDark} /></>;
    case 'fms_resource_cost_management':
      return <><Dashmainheading main="fms" children="resource_cost_management" icon={faUsers} description="resource_cost_management_desc" badge="budgeting" /><P.ResourceCostManagement isDark={isDark} /></>;
    case 'fms_contractor_payments':
      return <><Dashmainheading main="fms" children="contractor_payments" icon={faIdBadge} description="contractor_payments_desc" badge="payments" /><P.ContractorPayments isDark={isDark} /></>;
    case 'fms_expense_claims':
      return <><Dashmainheading main="fms" children="expense_claims" icon={faFileInvoiceDollar} description="expense_claims_desc" badge="expenses" /><P.ExpenseClaims isDark={isDark} /></>;
    case 'fms_white_labeling':
      return <><Dashmainheading main="fms" children="white_labeling" icon={faPalette} description="white_labeling_desc" badge="branding" /><P.WhiteLabeling isDark={isDark} /></>;
    case 'fms_branding_customization':
      return <><Dashmainheading main="fms" children="branding_customization" icon={faBrush} description="branding_customization_desc" badge="branding" /><P.BrandingCustomization isDark={isDark} /></>;
    case 'fms_client_billing_portal':
      return <><Dashmainheading main="fms" children="client_billing_portal" icon={faGlobe} description="client_billing_portal_desc" badge="portal" /><P.ClientBillingPortal isDark={isDark} /></>;
    case 'fms_treasury_management':
      return <><Dashmainheading main="fms" children="treasury_management" icon={faBuildingColumns} description="treasury_management_desc" badge="treasury" /><P.TreasuryManagement isDark={isDark} /></>;
    case 'fms_risk_management':
      return <><Dashmainheading main="fms" children="risk_management" icon={faShieldHalved} description="risk_management_desc" badge="governance" /><P.RiskManagement isDark={isDark} /></>;
    case 'fms_data_visualization_charts':
      return <><Dashmainheading main="fms" children="data_visualization_charts" icon={faChartLine} description="data_visualization_charts_desc" badge="analytics" /><P.DataVisualizationCharts isDark={isDark} /></>;
    case 'fms_drill_down_reports':
      return <><Dashmainheading main="fms" children="drill_down_reports" icon={faMagnifyingGlassChart} description="drill_down_reports_desc" badge="analytics" /><P.DrillDownReports isDark={isDark} /></>;
    case 'fms_business_intelligence_reports':
      return <><Dashmainheading main="fms" children="business_intelligence_reports" icon={faRobot} description="business_intelligence_reports_desc" badge="intelligence" /><P.BusinessIntelligenceReports isDark={isDark} /></>;
    case 'fms_executive_summary_reports':
      return <><Dashmainheading main="fms" children="executive_summary_reports" icon={faUserTie} description="executive_summary_reports_desc" badge="strategic" /><P.ExecutiveSummaryReports isDark={isDark} /></>;
    case 'fms_forecast_vs_actual_reports':
      return <><Dashmainheading main="fms" children="forecast_vs_actual_reports" icon={faChartBar} description="forecast_vs_actual_reports_desc" badge="strategic" /><P.ForecastVsActualReports isDark={isDark} /></>;
    case 'fms_cash_reserve_tracking':
      return <><Dashmainheading main="fms" children="cash_reserve_tracking" icon={faVault} description="cash_reserve_tracking_desc" badge="treasury" /><P.CashReserveTracking isDark={isDark} /></>;
    case 'fms_usage_analytics':
      return <><Dashmainheading main="fms" children="usage_analytics" icon={faChartLine} description="usage_analytics_desc" badge="intelligence" /><P.UsageAnalytics isDark={isDark} /></>;
    case 'fms_client_portal':
      return <><Dashmainheading main="fms" children="client_portal" icon={faGlobe} description="client_portal_desc" badge="portal" /><P.ClientPortalCenter isDark={isDark} /></>;
    case 'fms_online_payments':
      return <><Dashmainheading main="fms" children="online_payments" icon={faCreditCard} description="online_payments_desc" badge="payments" /><P.OnlinePayments isDark={isDark} /></>;
    case 'fms_subscription_billing':
      return <><Dashmainheading main="fms" children="subscription_billing" icon={faDollarSign} description="subscription_billing_desc" badge="billing" /><P.SubscriptionBilling isDark={isDark} /></>;
    case 'fms_recurring_billing':
      return <><Dashmainheading main="fms" children="recurring_billing" icon={faSync} description="recurring_billing_desc" badge="billing" /><P.RecurringBilling isDark={isDark} /></>;
    case 'fms_payroll_management':
      return <><Dashmainheading main="fms" children="payroll_management" icon={faUsers} description="payroll_management_desc" badge="payroll" /><P.PayrollManagement isDark={isDark} /></>;
    case 'fms_salary_processing':
      return <><Dashmainheading main="fms" children="salary_processing" icon={faDollarSign} description="salary_processing_desc" badge="payroll" /><P.SalaryProcessing isDark={isDark} /></>;
    case 'fms_payslip_generation':
      return <><Dashmainheading main="fms" children="payslip_generation" icon={faFileAlt} description="payslip_generation_desc" badge="payroll" /><P.PayslipGeneration isDark={isDark} /></>;
    case 'fms_tax_calculations':
      return <><Dashmainheading main="fms" children="tax_calculations" icon={faCalculator} description="tax_calculations_desc" badge="tax" /><P.TaxCalculations isDark={isDark} /></>;
    case 'fms_tax_management':
      return <><Dashmainheading main="fms" children="tax_management" icon={faShieldHalved} description="tax_management_desc" badge="tax" /><P.TaxManagement isDark={isDark} /></>;

    // DMS Common
    case 'dms_overview':
      return <><Dashmainheading main="dms_name" children="overview" icon={faChartPie} description="dms_short_desc" badge="dms_name" /><P.DmsDashboard /></>;
    case 'dms_documents':
      return <><Dashmainheading main="dms_name" children="all_documents" icon={faFile} description="dms_documents_desc" badge="dms_name" /><P.DmsDocumentsPage /></>;
    case 'dms_analytics':
      return <><Dashmainheading main="dms_name" children="analytics_dashboard" icon={faChartLine} description="dms_analytics_desc" badge="analytics" /><P.DmsAnalyticsDashboard /></>;
    case 'dms_storage_analytics':
      return <><Dashmainheading main="dms_name" children="storage_analytics" icon={faDatabase} description="dms_storage_desc" badge="analytics" /><P.DmsStorageAnalytics /></>;
    case 'dms_ai_intelligence':
      return <><Dashmainheading main="dms_name" children="ai_document_intelligence" icon={faRobot} description="dms_ai_desc" badge="ai" /><P.DmsAiIntelligence /></>;
    case 'dms_collaboration':
      return <><Dashmainheading main="dms_name" children="collaboration_center" icon={faUsers} description="dms_collaboration_desc" badge="collaboration" /><P.DmsCollaborationCenter /></>;
    case 'dms_approval_workflow':
      return <><Dashmainheading main="dms_name" children="approval_workflow" icon={faCheckCircle} description="dms_approval_desc" badge="workflow" /><P.DmsApprovalWorkflowPage /></>;
    case 'dms_signature_center':
      return <><Dashmainheading main="dms_name" children="signature_center" icon={faFileSignature} description="dms_signature_desc" badge="esignature" /><P.DmsSignatureCenterPage /></>;
    case 'dms_security_center':
      return <><Dashmainheading main="dms_name" children="security_center" icon={faShieldHalved} description="dms_security_desc" badge="security" /><P.DmsSecurityCenterPage /></>;
    case 'dms_audit_logs':
      return <><Dashmainheading main="dms_name" children="audit_logs" icon={faHistory} description="dms_audit_desc" badge="audit" /><P.DmsAuditLogsPage /></>;
    case 'dms_templates':
      return <><Dashmainheading main="dms_name" children="document_templates" icon={faFileAlt} description="dms_templates_desc" badge="templates" /><P.DmsTemplatesPage /></>;
    case 'dms_archival':
      return <><Dashmainheading main="dms_name" children="archive_center" icon={faArchive} description="dms_archive_desc" badge="archive" /><P.DmsArchiveCenter /></>;
    case 'dms_document_viewer':
      return <><Dashmainheading main="dms_name" children="document_viewer" icon={faEye} description="dms_viewer_desc" badge="tools" /><P.DmsDocumentViewer /></>;
    case 'dms_document_scanner':
      return <P.EnterpriseFeatureWorkspace feature={{ id: 'dms_document_scanner', label: 'Document Scanner', icon: 'camera' }} system="dms" />;

    // CRM Common
    case 'crm_overview':
      return <><Dashmainheading main="crm_name" children="overview" icon={faChartPie} description="crm_short_desc" badge="crm_name" /><P.CrmDashboard /></>;
    case 'crm_customers':
      return <><Dashmainheading main="crm_name" children="customers" icon={faUsers} description="crm_short_desc" badge="crm_name" /><P.CrmCustomers /></>;
    case 'crm_leads':
      return <><Dashmainheading main="crm_name" children="sales_leads" icon={faUserPlus} description="crm_short_desc" badge="crm_name" /><P.CrmLeads /></>;
    case 'crm_contacts':
      return <><Dashmainheading main="crm_name" children="contacts" icon={faAddressBook} description="crm_short_desc" badge="crm_name" /><P.CrmContacts /></>;
    case 'crm_deals':
      return <><Dashmainheading main="crm_name" children="deals_pipeline" icon={faHandshake} description="crm_short_desc" badge="crm_name" /><P.CrmDeals /></>;
    case 'crm_activities':
      return <><Dashmainheading main="crm_name" children="activities" icon={faCalendarCheck} description="crm_short_desc" badge="crm_name" /><P.CrmActivities /></>;
    case 'crm_campaigns':
      return <><Dashmainheading main="crm_name" children="campaigns" icon={faBullhorn} description="crm_short_desc" badge="crm_name" /><P.CrmCampaigns /></>;
    case 'crm_reports':
      return <><Dashmainheading main="crm_name" children="reports_analytics" icon={faChartBar} description="crm_short_desc" badge="crm_name" /><P.CrmReports /></>;
    case 'crm_tasks':
      return <><Dashmainheading main="crm_name" children="tasks" icon={faListCheck} description="crm_short_desc" badge="crm_name" /><P.CrmTasks /></>;
    case 'crm_pipelines':
      return <><Dashmainheading main="crm_name" children="pipelines" icon={faStream} description="crm_short_desc" badge="crm_name" /><P.CrmPipelines /></>;
    case 'crm_emails':
      return <><Dashmainheading main="crm_name" children="emails" icon={faEnvelope} description="crm_short_desc" badge="crm_name" /><P.CrmEmails /></>;
    case 'crm_email_accounts':
      return <><Dashmainheading main="crm_name" children="email_accounts" icon={faEnvelope} description="crm_short_desc" badge="crm_name" /><P.CrmEmailAccounts /></>;
    case 'crm_email_templates':
      return <><Dashmainheading main="crm_name" children="email_templates" icon={faFileAlt} description="crm_short_desc" badge="crm_name" /><P.CrmEmailTemplates /></>;
    case 'crm_followups':
      return <><Dashmainheading main="crm_name" children="follow_ups" icon={faClock} description="crm_short_desc" badge="crm_name" /><P.CrmFollowUps /></>;
    case 'crm_sequences':
      return <><Dashmainheading main="crm_name" children="sequences" icon={faStream} description="crm_short_desc" badge="crm_name" /><P.CrmSequences /></>;
    case 'crm_automations':
      return <><Dashmainheading main="crm_name" children="automations" icon={faBolt} description="crm_short_desc" badge="crm_name" /><P.CrmAutomations /></>;
    case 'crm_calendar':
      return <><Dashmainheading main="crm_name" children="calendar" icon={faCalendar} description="crm_short_desc" badge="crm_name" /><P.CrmCalendar /></>;
    case 'crm_documents':
      return <><Dashmainheading main="crm_name" children="documents" icon={faFileAlt} description="crm_short_desc" badge="crm_name" /><P.CrmDocuments /></>;
    case 'crm_tags':
      return <><Dashmainheading main="crm_name" children="tags" icon={faTags} description="crm_short_desc" badge="crm_name" /><P.CrmTags /></>;
    case 'crm_lead_score':
      return <><Dashmainheading main="crm_name" children="lead_score" icon={faBullseye} description="crm_short_desc" badge="crm_name" /><P.CrmLeadScore /></>;
    case 'crm_custom_fields':
      return <><Dashmainheading main="crm_name" children="custom_fields" icon={faListAlt} description="crm_short_desc" badge="crm_name" /><P.CrmCustomFields /></>;
    case 'crm_notifications':
      return <><Dashmainheading main="crm_name" children="notifications" icon={faBell} description="crm_short_desc" badge="crm_name" /><P.CrmNotifications /></>;
    case 'crm_duplicates':
      return <><Dashmainheading main="crm_name" children="duplicates" icon={faCopy} description="crm_short_desc" badge="crm_name" /><P.CrmDuplicates /></>;
    case 'crm_imports':
      return <><Dashmainheading main="crm_name" children="import_export" icon={faFileExport} description="crm_short_desc" badge="crm_name" /><P.CrmImportExport /></>;
    case 'crm_audit':
      return <><Dashmainheading main="crm_name" children="audit" icon={faHistory} description="crm_short_desc" badge="crm_name" /><P.CrmAudit /></>;
    case 'crm_analytics':
      return <><Dashmainheading main="crm_name" children="analytics" icon={faChartLine} description="crm_short_desc" badge="crm_name" /><P.CrmAnalytics /></>;
    case 'crm_settings':
      return <><Dashmainheading main="crm_name" children="settings" icon={faCogs} description="crm_short_desc" badge="crm_name" /><P.CrmSettings /></>;

    // TMS Common
    case 'tms_overview':
      return <><Dashmainheading main="tms" children="overview" icon={faChartPie} description="tms_overview_desc" badge="tms" /><P.TmsDashboard /></>;
    case 'tms_tasks':
      return <><Dashmainheading main="tms" children="tasks" icon={faListCheck} description="tms_tasks_desc" badge="operational" /><P.TmsTasks /></>;
    case 'tms_trash':
      return <><Dashmainheading main="tms" children="trash" icon={faTrashCan} description="tms_trash_desc" badge="maintenance" /><P.TmsTasks initialTrash={true} /></>;
    case 'tms_add_task':
      return <><Dashmainheading main="tms" children="create_task" icon={faPlus} description="tms_add_task_desc" badge="operational" /><P.TmsAddTask /></>;
    case 'tms_milestones':
      return <><Dashmainheading main="tms" children="milestones" icon={faTimeline} description="tms_milestones_desc" badge="planning" /><P.TmsMilestones /></>;
    case 'tms_bulk':
      return <><Dashmainheading main="tms" children="bulk_actions" icon={faLayerGroup} description="tms_bulk_desc" badge="efficiency" /><P.TmsBulkActions /></>;
    case 'tms_calendar':
      return <><Dashmainheading main="tms" children="calendar_view" icon={faCalendarDays} description="tms_calendar_desc" badge="planning" /><P.TmsCalendar /></>;
    case 'tms_timeline':
      return <><Dashmainheading main="tms" children="timeline_view" icon={faTimeline} description="tms_timeline_desc" badge="planning" /><P.TmsTimeline /></>;
    case 'tms_dependencies':
      return <><Dashmainheading main="tms" children="dependencies" icon={faLink} description="tms_dependencies_desc" badge="core" /><P.TmsDependencies /></>;
    case 'tms_time_tracking':
      return <><Dashmainheading main="tms" children="time_tracking" icon={faClock} description="tms_time_desc" badge="productivity" /><P.TmsTimeTracking /></>;
    case 'tms_tags':
      return <><Dashmainheading main="tms" children="tags_labels" icon={faTags} description="tms_tags_desc" badge="core" /><P.TmsTags /></>;
    case 'tms_attachments':
      return <><Dashmainheading main="tms" children="attachments" icon={faPaperclip} description="tms_attachments_desc" badge="core" /><P.TmsAttachments /></>;
    case 'tms_editor':
      return <><Dashmainheading main="tms" children="documentation" icon={faFileLines} description="tms_editor_desc" badge="core" /><P.TmsEditor /></>;
    case 'tms_history':
      return <><Dashmainheading main="tms" children="activity_logs" icon={faClockRotateLeft} description="tms_history_desc" badge="audit" /><P.TmsActivityLogs /></>;
    case 'tms_productivity':
      return <><Dashmainheading main="tms" children="productivity_insights" icon={faChartLine} description="tms_productivity_desc" badge="operational_ai" /><P.TmsProductivityInsights /></>;
    case 'tms_task_completion_reports':
      return <><Dashmainheading main="tms" children="tms_task_completion_reports" icon={faChartBar} description="tms_completion_reports_desc" badge="reporting" /><P.TmsTaskCompletionReports /></>;
    case 'tms_team_performance_reports':
      return <><Dashmainheading main="tms" children="tms_team_performance_reports" icon={faUsers} description="tms_performance_reports_desc" badge="reporting" /><P.TmsTeamPerformanceReports /></>;
    case 'tms_time_usage_analytics':
      return <><Dashmainheading main="tms" children="tms_time_usage_analytics" icon={faChartLine} description="tms_time_analytics_desc" badge="analytics" /><P.TmsTimeUsageAnalytics /></>;
    case 'tms_custom_reports_builder':
      return <><Dashmainheading main="tms" children="tms_custom_reports_builder" icon={faSliders} description="tms_custom_reports_desc" badge="reporting" /><P.TmsCustomReportsBuilder /></>;
    case 'tms_export_reports':
      return <><Dashmainheading main="tms" children="tms_export_reports" icon={faCloudArrowUp} description="tms_export_reports_desc" badge="reporting" /><P.TmsExportReports /></>;
    case 'tms_kpi_dashboards':
      return <><Dashmainheading main="tms" children="tms_kpi_dashboards" icon={faChartPie} description="tms_kpi_dashboards_desc" badge="analytics" /><P.TmsKpiDashboards /></>;
    case 'tms_attendance_productivity_insights':
      return <><Dashmainheading main="tms" children="tms_attendance_productivity_insights" icon={faUsers} description="tms_attendance_productivity_desc" badge="analytics" /><P.TmsAttendanceProductivityInsights /></>;
    case 'tms_burndown_charts':
      return <><Dashmainheading main="tms" children="tms_burndown_charts" icon={faChartLine} description="tms_burndown_desc" badge="agile" /><P.TmsBurndownCharts /></>;
    case 'tms_forecasting_analytics':
      return <><Dashmainheading main="tms" children="tms_forecasting_analytics" icon={faChartLine} description="tms_forecasting_desc" badge="analytics" /><P.TmsForecastingAnalytics /></>;
    
    // TMS Collaboration & Management
    case 'tms_team_workspaces':
      return <><Dashmainheading main="tms" children="tms_team_workspaces" icon={faUsers} description="tms_workspaces_desc" badge="collaboration" /><P.TmsTeamWorkspaces /></>;
    case 'tms_team_mentions':
      return <><Dashmainheading main="tms" children="tms_team_mentions" icon={faComments} description="tms_mentions_desc" badge="collaboration" /><P.TmsTeamMentions /></>;
    case 'tms_shared_task_boards':
      return <><Dashmainheading main="tms" children="tms_shared_task_boards" icon={faLayerGroup} description="tms_boards_desc" badge="collaboration" /><P.TmsSharedTaskBoards /></>;
    case 'tms_dept_task_mgmt':
      return <><Dashmainheading main="tms" children="tms_dept_task_mgmt" icon={faChartPie} description="tms_dept_mgmt_desc" badge="operational" /><P.TmsDeptTaskMgmt /></>;
    case 'tms_multi_user_assignment':
      return <><Dashmainheading main="tms" children="tms_multi_user_assignment" icon={faUsers} description="tms_multi_assignment_desc" badge="management" /><P.TmsMultiUserAssignment /></>;
    case 'tms_approval_workflow':
      return <><Dashmainheading main="tms" children="tms_approval_workflow" icon={faShieldHalved} description="tms_approval_desc" badge="governance" /><P.TmsApprovalWorkflow /></>;
    case 'tms_client_collaboration':
      return <><Dashmainheading main="tms" children="tms_client_collaboration" icon={faUserShield} description="tms_client_portal_desc" badge="external" /><P.TmsClientCollaboration /></>;
    case 'tms_add_record':
      return <><Dashmainheading main="tms" children="tms_add_record" icon={faPlus} description="tms_add_record_desc" badge="core" /><P.TmsAddRecord /></>;

    // Workforce
    case 'workforce_clients':
      return <><Dashmainheading main="workforce" children="clients" icon={faBriefcase} description="manage_customers_leads" badge="enterprise" /><P.ClientsPage /></>;
    case 'workforce_activity_logs':
      return <><Dashmainheading main="workforce" children="activity_logs" icon={faClockRotateLeft} description="workforce_activity_logs_desc" badge="activity" /><P.ActivityLogsPage /></>;

    // HRMS Enterprise Portals
    case 'hrms_command_center':
      return <><Dashmainheading main="hrms" children="command_center" icon={faGaugeHigh} description="hrms_command_center_desc" badge="hrms" /><P.CommandCenter /></>;
    case 'hrms_manager_portal':
      return <><Dashmainheading main="hrms" children="manager_portal" icon={faUserTie} description="hrms_manager_desc" badge="hrms" /><P.ManagerPortal /></>;
    case 'hrms_employee_portal':
      return <><Dashmainheading main="hrms" children="employee_portal" icon={faUser} description="hrms_employee_desc" badge="hrms" /><P.EmployeePortal /></>;
    case 'hrms_portal_provisioning':
      return <><Dashmainheading main="hrms" children="portal_provisioning" icon={faGlobe} description="portal_provisioning_desc" badge="hrms" /><P.PortalProvisioning /></>;
    case 'hrms_leave_approval':
      return <><Dashmainheading main="hrms" children="leave_approval" icon={faCalendarCheck} description="leave_approval_desc" badge="hrms" /><P.LeaveApprovalCenter /></>;
    case 'hrms_attendance_correction':
      return <><Dashmainheading main="hrms" children="attendance_correction" icon={faClockRotateLeft} description="attendance_correction_desc" badge="hrms" /><P.AttendanceCorrectionPortal /></>;
    case 'hrms_overtime_management':
      return <><Dashmainheading main="hrms" children="overtime_management" icon={faClock} description="overtime_management_desc" badge="hrms" /><P.OvertimeManagementPortal /></>;
    case 'hrms_expense_management':
      return <><Dashmainheading main="hrms" children="expense_management" icon={faReceipt} description="expense_management_desc" badge="hrms" /><P.ExpenseManagementPortal /></>;
    case 'hrms_loan_management':
      return <><Dashmainheading main="hrms" children="loan_management" icon={faHandHoldingDollar} description="loan_management_desc" badge="hrms" /><P.LoanManagementPortal /></>;
    case 'hrms_payroll_management':
      return <><Dashmainheading main="hrms" children="payroll_management" icon={faMoneyBillWave} description="payroll_management_desc" badge="hrms" /><P.PayrollManagementPortal /></>;
    case 'hrms_resignation':
      return <><Dashmainheading main="hrms" children="resignation_management" icon={faFileContract} description="resignation_management_desc" badge="hrms" /><P.ResignationManagementPortal /></>;
    case 'hrms_recruitment_management':
      return <><Dashmainheading main="hrms" children="recruitment_management" icon={faBriefcase} description="recruitment_management_desc" badge="hrms" /><P.RecruitmentManagementPortal /></>;
    case 'hrms_asset_clearance':
      return <><Dashmainheading main="hrms" children="asset_clearance" icon={faLaptop} description="asset_clearance_desc" badge="hrms" /><P.AssetClearancePortal /></>;
    case 'hrms_employee_database':
      return <><Dashmainheading main="hrms" children="employee_database" icon={faBuilding} description="employee_database_desc" badge="hrms" /><P.EmployeeDatabase /></>;
    case 'hrms_employee_profile_full':
      return <><Dashmainheading main="hrms" children="employee_profile_full" icon={faUserCheck} description="employee_profile_full_desc" badge="hrms" /><P.EmployeeProfileFull /></>;
    case 'hrms_employee_code':
      return <><Dashmainheading main="hrms" children="employee_code" icon={faIdCard} description="employee_code_desc" badge="hrms" /><P.EmployeeCodeManagement /></>;
    case 'hrms_rehire':
      return <><Dashmainheading main="hrms" children="rehire_flow" icon={faRotateLeft} description="rehire_flow_desc" badge="hrms" /><P.RehireFlowPortal /></>;

    // HRMS Employee Records
    case 'hrms_documents':
      return <><Dashmainheading main="hrms" children="documents_management" icon={faFile} description="documents_mgmt_desc" badge="hrms" /><P.DocumentsManagement /></>;
    case 'hrms_bank_details':
      return <><Dashmainheading main="hrms" children="bank_details" icon={faLandmark} description="bank_details_desc" badge="hrms" /><P.BankDetailsManagement /></>;
    case 'hrms_emergency_contacts':
      return <><Dashmainheading main="hrms" children="emergency_contacts" icon={faPhoneFlip} description="emergency_contacts_desc" badge="hrms" /><P.EmergencyContactsManagement /></>;
    case 'hrms_reporting_hierarchy':
      return <><Dashmainheading main="hrms" children="reporting_hierarchy" icon={faPeopleArrows} description="reporting_hierarchy_desc" badge="hrms" /><P.ReportingHierarchy /></>;
    case 'hrms_csv_import':
      return <><Dashmainheading main="hrms" children="csv_import_center" icon={faFileImport} description="csv_import_desc" badge="hrms" /><P.CsvImportCenter /></>;

    // HRMS Attendance Management
    case 'hrms_checkin_checkout':
      return <><Dashmainheading main="hrms" children="check_in_out" icon={faUserCheck} description="check_in_out_desc" badge="hrms" /><P.CheckInOut /></>;
    case 'hrms_gps_attendance':
      return <><Dashmainheading main="hrms" children="gps_attendance" icon={faLocationDot} description="gps_attendance_desc" badge="hrms" /><P.GpsAttendance /></>;
    case 'hrms_selfie_attendance':
      return <><Dashmainheading main="hrms" children="selfie_attendance" icon={faCamera} description="selfie_attendance_desc" badge="hrms" /><P.SelfieAttendance /></>;
    case 'hrms_qr_attendance':
      return <><Dashmainheading main="hrms" children="qr_attendance" icon={faQrcode} description="qr_attendance_desc" badge="hrms" /><P.QrAttendance /></>;
    case 'hrms_site_attendance':
      return <><Dashmainheading main="hrms" children="site_attendance" icon={faHardHat} description="site_attendance_desc" badge="hrms" /><P.SiteAttendanceDashboard /></>;
    case 'hrms_supervisor_attendance':
      return <><Dashmainheading main="hrms" children="supervisor_attendance" icon={faUserClock} description="supervisor_attendance_desc" badge="hrms" /><P.SupervisorAttendance /></>;

    // HRMS Attendance Corrections
    case 'hrms_manual_attendance':
      return <><Dashmainheading main="hrms" children="manual_attendance_request" icon={faPenToSquare} description="manual_attendance_desc" badge="hrms" /><P.ManualAttendanceRequest /></>;
    case 'hrms_missing_punch':
      return <><Dashmainheading main="hrms" children="missing_punch_correction" icon={faClockRotateLeft} description="missing_punch_desc" badge="hrms" /><P.MissingPunchCorrection /></>;
    case 'hrms_red_zone':
      return <><Dashmainheading main="hrms" children="red_zone_reports" icon={faTriangleExclamation} description="red_zone_desc" badge="hrms" /><P.RedZoneAttendance /></>;

    // HRMS Sites & Locations
    case 'hrms_site_locations':
      return <><Dashmainheading main="hrms" children="site_locations" icon={faBuilding} description="site_locations_desc" badge="hrms" /><P.SiteLocations /></>;
    case 'hrms_site_gps_radius':
      return <><Dashmainheading main="hrms" children="site_gps_radius" icon={faLocationDot} description="site_gps_radius_desc" badge="hrms" /><P.SiteGpsRadius /></>;
    case 'hrms_geo_fencing':
      return <><Dashmainheading main="hrms" children="geo_fencing" icon={faDrawPolygon} description="geo_fencing_desc" badge="hrms" /><P.GeoFencing /></>;
    case 'hrms_site_assignment':
      return <><Dashmainheading main="hrms" children="site_assignment" icon={faArrowsRotate} description="site_assignment_desc" badge="hrms" /><P.SiteAssignment /></>;
    case 'hrms_outdoor_duty':
      return <><Dashmainheading main="hrms" children="outdoor_duty" icon={faBriefcase} description="outdoor_duty_desc" badge="hrms" /><P.OutdoorDutyLocation /></>;
    case 'hrms_qr_per_site':
      return <><Dashmainheading main="hrms" children="qr_per_site" icon={faQrcode} description="qr_per_site_desc" badge="hrms" /><P.QrCodePerSite /></>;

    // HRMS Shift Management
    case 'hrms_shift_management':
      return <><Dashmainheading main="hrms" children="shift_management" icon={faCalendarDay} description="shift_mgmt_desc" badge="hrms" /><P.ShiftManagementEnhanced /></>;
    case 'hrms_rotational_shifts':
      return <><Dashmainheading main="hrms" children="rotational_shifts" icon={faArrowRightArrowLeft} description="rotational_shifts_desc" badge="hrms" /><P.RotationalShifts /></>;
    case 'hrms_weekly_off':
      return <><Dashmainheading main="hrms" children="weekly_off_management" icon={faCalendarWeek} description="weekly_off_desc" badge="hrms" /><P.WeeklyOffManagement /></>;
    case 'hrms_grace_time':
      return <><Dashmainheading main="hrms" children="grace_time_management" icon={faClock} description="grace_time_desc" badge="hrms" /><P.GraceTimeManagement /></>;
    case 'hrms_break_time':
      return <><Dashmainheading main="hrms" children="break_time_management" icon={faMugSaucer} description="break_time_desc" badge="hrms" /><P.BreakTimeManagement /></>;
    case 'hrms_half_day_rules':
      return <><Dashmainheading main="hrms" children="half_full_day_rules" icon={faGauge} description="half_day_rules_desc" badge="hrms" /><P.HalfDayFullDayRules /></>;

    // HRMS Overtime & Leave Enhanced
    case 'hrms_overtime_rules':
      return <><Dashmainheading main="hrms" children="overtime_rules_engine" icon={faGauge} description="overtime_rules_desc" badge="hrms" /><P.OvertimeRulesEngine /></>;
    case 'hrms_leave_quota':
      return <><Dashmainheading main="hrms" children="leave_quota_management" icon={faBucket} description="leave_quota_desc" badge="hrms" /><P.LeaveQuotaManagement /></>;
    case 'hrms_leave_accrual':
      return <><Dashmainheading main="hrms" children="leave_accrual_management" icon={faChartSimple} description="leave_accrual_desc" badge="hrms" /><P.LeaveAccrualManagement /></>;

    // Admin & Security
    case 'admin_notification_settings':
      return <><Dashmainheading main="admin" children="notification_settings" icon={faBell} description="notification_settings_desc" badge="admin" /><P.NotificationSettings isDark={isDark} /></>;
    case 'admin_bank_exports':
      return <><Dashmainheading main="admin" children="bank_exports" icon={faUniversity} description="bank_exports_desc" badge="admin" /><P.BankExports isDark={isDark} /></>;
    case 'admin_biometric_devices':
      return <><Dashmainheading main="admin" children="biometric_devices" icon={faIdCard} description="biometric_devices_desc" badge="admin" /><P.SuperBiometricDevices isDark={isDark} /></>;
    case 'admin_biometric_mapping':
      return <><Dashmainheading main="admin" children="biometric_mapping" icon={faCodeBranch} description="biometric_mapping_desc" badge="admin" /><P.BiometricMapping isDark={isDark} /></>;
    case 'admin_raw_punches':
      return <><Dashmainheading main="admin" children="raw_punches" icon={faBolt} description="raw_punches_desc" badge="admin" /><P.RawPunches isDark={isDark} /></>;
    case 'admin_unmatched_punches':
      return <><Dashmainheading main="admin" children="unmatched_punches" icon={faTriangleExclamation} description="unmatched_punches_desc" badge="admin" /><P.UnmatchedPunches isDark={isDark} /></>;
    case 'admin_api_keys':
      return <><Dashmainheading main="admin" children="api_keys" icon={faKey} description="api_keys_desc" badge="admin" /><P.ApiKeys isDark={isDark} /></>;
    case 'admin_webhooks':
      return <><Dashmainheading main="admin" children="webhooks" icon={faLink} description="webhooks_desc" badge="admin" /><P.Webhooks isDark={isDark} /></>;
    case 'admin_webhook_logs':
      return <><Dashmainheading main="admin" children="webhook_logs" icon={faList} description="webhook_logs_desc" badge="admin" /><P.WebhookLogs isDark={isDark} /></>;
    case 'admin_security_audit':
      return <><Dashmainheading main="admin" children="security_audit" icon={faShieldHalved} description="security_audit_desc" badge="admin" /><P.SecurityAudit isDark={isDark} /></>;

    // MFG Manufacturing
    case 'mfg_overview':
      return <><Dashmainheading main="mfg_name" children="mrp_dashboard" icon={faIndustry} description="mfg_short_desc" badge="mfg_name" /><P.MfgDashboard isDark={isDark} /></>;
    case 'mfg_bill_of_materials':
      return <><Dashmainheading main="mfg_name" children="bill_of_materials" icon={faClipboardList} description="mfg_bom_desc" badge="mfg_name" /><P.MfgBillOfMaterials isDark={isDark} /></>;
    case 'mfg_production_orders':
      return <><Dashmainheading main="mfg_name" children="production_orders" icon={faIndustry} description="mfg_production_orders_desc" badge="mfg_name" /><P.MfgProductionOrders isDark={isDark} /></>;
    case 'mfg_work_orders':
      return <><Dashmainheading main="mfg_name" children="work_orders" icon={faTools} description="mfg_work_orders_desc" badge="mfg_name" /><P.MfgWorkOrders isDark={isDark} /></>;
    case 'mfg_trash':
      return <><Dashmainheading main="mfg_name" children="trash" icon={faTrashCan} description="mfg_trash_desc" badge="mfg_name" /><P.MfgTrash isDark={isDark} /></>;

    // FX Multi-Currency
    case 'fx_overview':
      return <><Dashmainheading main="fx_name" children="fx_dashboard" icon={faGlobe} description="fx_short_desc" badge="fx_name" /><P.FxDashboard isDark={isDark} /></>;
    case 'fx_currencies':
      return <><Dashmainheading main="fx_name" children="fx_currencies" icon={faDollarSign} description="fx_currencies_desc" badge="fx_name" /><P.FxCurrencies isDark={isDark} /></>;
    case 'fx_exchange_rates':
      return <><Dashmainheading main="fx_name" children="fx_exchange_rates" icon={faArrowRightArrowLeft} description="fx_exchange_rates_desc" badge="fx_name" /><P.FxExchangeRates isDark={isDark} /></>;
    case 'fx_transactions':
      return <><Dashmainheading main="fx_name" children="fx_transactions" icon={faMoneyBillWave} description="fx_transactions_desc" badge="fx_name" /><P.FxTransactions isDark={isDark} /></>;
    case 'fx_revaluations':
      return <><Dashmainheading main="fx_name" children="fx_revaluations" icon={faCalculator} description="fx_revaluations_desc" badge="fx_name" /><P.FxRevaluations isDark={isDark} /></>;
    case 'fx_trash':
      return <><Dashmainheading main="fx_name" children="trash" icon={faTrashCan} description="fx_trash_desc" badge="fx_name" /><P.FxTrash isDark={isDark} /></>;

    }

    if (activeTab.startsWith('inv_') || activeTab.startsWith('pos_')) {
      const system = activeTab.startsWith('inv_') ? 'inv' : 'pos';
      return <P.EnterpriseFeatureWorkspace
        system={system}
        feature={{
          id: activeTab,
          label: activeTab.replace(/^(inv|pos)_/, '').replace(/_/g, ' '),
          description: `Manage ${activeTab.replace(/^(inv|pos)_/, '').replace(/_/g, ' ')} with status-aware actions, permissions, audit history, and bulk operations.`,
        }}
      />;
    }

    if (activeModule && activeModule !== 'dashboard') {
      const feature = getFeatureById(activeModule, activeTab);
      if (feature) {
        return <P.EnterpriseFeatureWorkspace feature={feature} system={activeModule} />;
      }
    }

    return <P.AdminOverview />;
  };

  return (
    <Suspense fallback={<PageFallback />}>
      {renderContent()}
    </Suspense>
  );
};

export default ModuleContentRenderer;
