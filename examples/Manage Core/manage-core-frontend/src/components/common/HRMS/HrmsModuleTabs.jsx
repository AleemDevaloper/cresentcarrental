import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faUsers, faCheckCircle, faTimesCircle, faFileInvoiceDollar,
  faBriefcase, faSignOutAlt, faSitemap, faReceipt, faClock, faFingerprint,
  faGaugeHigh, faUserTie, faUser, faCalendarCheck, faClipboardList,
  faMoneyBillWave, faFileContract, faLaptop, faIdCard,
  faRotateLeft, faGlobe, faBuilding,
  faHandHoldingDollar, faCheckDouble, faClockRotateLeft, faUserCheck,
  faFileLines, faFile,
  faLocationDot, faCamera, faQrcode, faHardHat,
  faUserClock, faPenToSquare, faTriangleExclamation, faMapLocationDot,
  faDrawPolygon, faArrowsRotate, faCalendarDay, faMugSaucer,
  faArrowRightArrowLeft, faCalendarWeek, faGauge,
  faUmbrella, faBucket, faChartSimple,
  faFileImport,
  faLandmark, faPhoneFlip, faPeopleArrows, faHeartbeat,
  faScaleBalanced, faBell, faCodeBranch, faBolt
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the module tabs configuration for HRMS with all original tabs
 * restored, while using the exact names for the requested tabs.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getHrmsModuleTabs = (t) => [
  { id: 'hrms_overview', label: 'HR Dashboard', icon: <FontAwesomeIcon icon={faHome} /> },
  { id: 'hrms_health_dashboard', label: 'HRMS Health Dashboard', icon: <FontAwesomeIcon icon={faHeartbeat} /> },

  // Employee Records Group
  {
    id: 'hrms_records_group',
    label: t('employee_records'),
    icon: <FontAwesomeIcon icon={faFileLines} />,
    subTabs: [
      { id: 'hrms_documents', label: t('documents_management'), icon: <FontAwesomeIcon icon={faFile} /> },
      { id: 'hrms_bank_details', label: t('bank_details'), icon: <FontAwesomeIcon icon={faLandmark} /> },
      { id: 'hrms_emergency_contacts', label: t('emergency_contacts'), icon: <FontAwesomeIcon icon={faPhoneFlip} /> },
      { id: 'hrms_reporting_hierarchy', label: t('reporting_hierarchy'), icon: <FontAwesomeIcon icon={faPeopleArrows} /> },
      { id: 'hrms_csv_import', label: t('csv_import_center'), icon: <FontAwesomeIcon icon={faFileImport} /> },
    ]
  },

  // Enterprise Portals Group
  {
    id: 'hrms_enterprise_group',
    label: t('enterprise_portals'),
    icon: <FontAwesomeIcon icon={faGaugeHigh} />,
    subTabs: [
      { id: 'hrms_command_center', label: t('command_center'), icon: <FontAwesomeIcon icon={faGaugeHigh} /> },
      { id: 'hrms_manager_portal', label: t('manager_portal'), icon: <FontAwesomeIcon icon={faUserTie} /> },
      { id: 'hrms_employee_portal', label: t('employee_portal'), icon: <FontAwesomeIcon icon={faUser} /> },
      { id: 'hrms_portal_provisioning', label: t('portal_provisioning'), icon: <FontAwesomeIcon icon={faGlobe} /> },
    ]
  },

  // Attendance Management Group
  {
    id: 'hrms_attendance_group',
    label: t('attendance_management'),
    icon: <FontAwesomeIcon icon={faCheckCircle} />,
    subTabs: [
      { id: 'hrms_attendance', label: 'My Attendance', icon: <FontAwesomeIcon icon={faCheckCircle} /> },
      { id: 'hrms_attendance_records', label: 'Attendance Records', icon: <FontAwesomeIcon icon={faClipboardList} /> },
      { id: 'hrms_checkin_checkout', label: t('check_in_out'), icon: <FontAwesomeIcon icon={faUserCheck} /> },
      { id: 'hrms_gps_attendance', label: t('gps_attendance'), icon: <FontAwesomeIcon icon={faLocationDot} /> },
      { id: 'hrms_selfie_attendance', label: t('selfie_attendance'), icon: <FontAwesomeIcon icon={faCamera} /> },
      { id: 'hrms_qr_attendance', label: t('qr_attendance'), icon: <FontAwesomeIcon icon={faQrcode} /> },
      { id: 'hrms_site_attendance', label: t('site_attendance'), icon: <FontAwesomeIcon icon={faHardHat} /> },
      { id: 'hrms_supervisor_attendance', label: 'Supervisor Attendance', icon: <FontAwesomeIcon icon={faUserClock} /> },
      { id: 'hrms_biometric', label: t('biometric_devices'), icon: <FontAwesomeIcon icon={faFingerprint} /> },
    ]
  },

  // Biometric Operations Group
  {
    id: 'hrms_biometric_ops_group',
    label: 'Biometric Operations',
    icon: <FontAwesomeIcon icon={faFingerprint} />,
    subTabs: [
      { id: 'hrms_biometric_mapping', label: 'Biometric Mapping', icon: <FontAwesomeIcon icon={faCodeBranch} /> },
      { id: 'hrms_raw_punches', label: 'Raw Punches', icon: <FontAwesomeIcon icon={faBolt} /> },
      { id: 'hrms_unmatched_punches', label: 'Unmatched Punches', icon: <FontAwesomeIcon icon={faTriangleExclamation} /> },
    ]
  },

  // Attendance Corrections Group
  {
    id: 'hrms_corrections_group',
    label: t('attendance_corrections'),
    icon: <FontAwesomeIcon icon={faPenToSquare} />,
    subTabs: [
      { id: 'hrms_manual_attendance', label: t('manual_attendance_request'), icon: <FontAwesomeIcon icon={faPenToSquare} /> },
      { id: 'hrms_missing_punch', label: t('missing_punch_correction'), icon: <FontAwesomeIcon icon={faClockRotateLeft} /> },
      { id: 'hrms_red_zone', label: t('red_zone_reports'), icon: <FontAwesomeIcon icon={faTriangleExclamation} /> },
      { id: 'hrms_attendance_correction', label: t('attendance_correction_portal'), icon: <FontAwesomeIcon icon={faClipboardList} /> },
      { id: 'hrms_attendance_corrections', label: 'Attendance Corrections', icon: <FontAwesomeIcon icon={faClipboardList} /> },
    ]
  },

  // Sites & Locations Group
  {
    id: 'hrms_sites_group',
    label: t('sites_locations'),
    icon: <FontAwesomeIcon icon={faMapLocationDot} />,
    subTabs: [
      { id: 'hrms_site_locations', label: t('site_locations'), icon: <FontAwesomeIcon icon={faBuilding} /> },
      { id: 'hrms_site_gps_radius', label: t('site_gps_radius'), icon: <FontAwesomeIcon icon={faLocationDot} /> },
      { id: 'hrms_geo_fencing', label: t('geo_fencing'), icon: <FontAwesomeIcon icon={faDrawPolygon} /> },
      { id: 'hrms_site_assignment', label: t('site_assignment'), icon: <FontAwesomeIcon icon={faArrowsRotate} /> },
      { id: 'hrms_outdoor_duty', label: 'Outdoor Duty', icon: <FontAwesomeIcon icon={faBriefcase} /> },
      { id: 'hrms_qr_per_site', label: t('qr_per_site'), icon: <FontAwesomeIcon icon={faQrcode} /> },
    ]
  },

  // Shift Management Group
  {
    id: 'hrms_shifts_group',
    label: t('shift_management'),
    icon: <FontAwesomeIcon icon={faClock} />,
    subTabs: [
      { id: 'hrms_shift_management', label: t('shift_management'), icon: <FontAwesomeIcon icon={faCalendarDay} /> },
      { id: 'hrms_rotational_shifts', label: t('rotational_shifts'), icon: <FontAwesomeIcon icon={faArrowRightArrowLeft} /> },
      { id: 'hrms_weekly_off', label: t('weekly_off_management'), icon: <FontAwesomeIcon icon={faCalendarWeek} /> },
      { id: 'hrms_grace_time', label: t('grace_time_management'), icon: <FontAwesomeIcon icon={faClock} /> },
      { id: 'hrms_break_time', label: t('break_time_management'), icon: <FontAwesomeIcon icon={faMugSaucer} /> },
      { id: 'hrms_half_day_rules', label: t('half_full_day_rules'), icon: <FontAwesomeIcon icon={faGauge} /> },
    ]
  },

  // Workflow & Approvals Group
  {
    id: 'hrms_workflow_group',
    label: t('approvals_workflow'),
    icon: <FontAwesomeIcon icon={faCheckDouble} />,
    subTabs: [
      { id: 'hrms_leave_approval', label: t('leave_approval'), icon: <FontAwesomeIcon icon={faCalendarCheck} /> },
      { id: 'hrms_overtime_management', label: t('overtime_management'), icon: <FontAwesomeIcon icon={faClock} /> },
      { id: 'hrms_expense_management', label: t('expense_management'), icon: <FontAwesomeIcon icon={faReceipt} /> },
      { id: 'hrms_loan_management', label: t('loan_management'), icon: <FontAwesomeIcon icon={faHandHoldingDollar} /> },
    ]
  },

  // Leave Management Group
  {
    id: 'hrms_leaves_group',
    label: t('leave_management'),
    icon: <FontAwesomeIcon icon={faUmbrella} />,
    subTabs: [
      { id: 'hrms_leaves', label: 'Leave Requests', icon: <FontAwesomeIcon icon={faUmbrella} /> },
      { id: 'hrms_physical_leave_entry', label: 'Physical Approved Leave Entry', icon: <FontAwesomeIcon icon={faTimesCircle} /> },
      { id: 'hrms_my_leave_balance', label: 'My Leave Balance', icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
      { id: 'hrms_leave_quota', label: t('leave_quota_management'), icon: <FontAwesomeIcon icon={faBucket} /> },
      { id: 'hrms_leave_accrual', label: t('leave_accrual_management'), icon: <FontAwesomeIcon icon={faChartSimple} /> },
    ]
  },

  // Payroll & HR Group
  {
    id: 'hrms_payroll_group',
    label: t('payroll_hr'),
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    subTabs: [
      { id: 'hrms_payroll_dashboard', label: t('payroll_management'), icon: <FontAwesomeIcon icon={faMoneyBillWave} /> },
      { id: 'hrms_overtime_rules', label: t('overtime_rules_engine'), icon: <FontAwesomeIcon icon={faGauge} /> },
      { id: 'hrms_resignation', label: t('resignation_management'), icon: <FontAwesomeIcon icon={faFileContract} /> },
      { id: 'hrms_recruitment', label: t('recruitment'), icon: <FontAwesomeIcon icon={faBriefcase} /> },
      { id: 'hrms_asset_clearance', label: t('asset_clearance'), icon: <FontAwesomeIcon icon={faLaptop} /> },
    ]
  },

  // Employee Database Group
  {
    id: 'hrms_database_group',
    label: t('employee_data'),
    icon: <FontAwesomeIcon icon={faUsers} />,
    subTabs: [
      { id: 'hrms_employee_database', label: t('employee_database'), icon: <FontAwesomeIcon icon={faBuilding} /> },
      { id: 'hrms_employee_profile_full', label: t('employee_profile'), icon: <FontAwesomeIcon icon={faUserCheck} /> },
      { id: 'hrms_employee_code', label: t('employee_code'), icon: <FontAwesomeIcon icon={faIdCard} /> },
      { id: 'hrms_rehire', label: t('rehire_flow'), icon: <FontAwesomeIcon icon={faRotateLeft} /> },
    ]
  },

  { id: 'hrms_onboarding', label: t('onboarding'), icon: <FontAwesomeIcon icon={faUsers} /> },
  { id: 'hrms_exit', label: t('exit_management'), icon: <FontAwesomeIcon icon={faSignOutAlt} /> },
  { id: 'hrms_org', label: t('organization'), icon: <FontAwesomeIcon icon={faSitemap} /> },
  { id: 'hrms_notification_inbox', label: 'Notification Inbox', icon: <FontAwesomeIcon icon={faBell} /> },
];
