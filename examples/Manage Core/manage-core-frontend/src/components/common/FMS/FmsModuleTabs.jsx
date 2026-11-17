import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCogs,
  faIdBadge,
  faFileInvoiceDollar,
  faPalette,
  faGlobe,
  faBrush,
  faHandshake,
  faBuildingColumns,
  faShieldHeart,
  faWallet,
  faRobot,
  faUserTie,
  faChartBar,
  faChartLine,
  faMagnifyingGlassChart,
  faChartArea,
  faCloudArrowUp,
  faTags,
  faSync,
  faScaleBalanced,
  faChartPie,
  faClock,
  faBoxOpen,
  faBuilding,
  faDatabase,
  faFileAlt,
  faCalendarDays,
  faShieldHalved,
  faPaperclip,
  faFileSignature,
  faHistory,
  faUserShield,
  faProjectDiagram,
  faSitemap,
  faTimeline,
  faGaugeHigh,
  faBullseye,
  faCalendarCheck,
  faCalendarAlt,
  faBell,
  faComments,
  faMapLocationDot,
  faCoins,
  faHourglassHalf,
  faUsers,
  faUsersGear,
  faStickyNote,
  faLink,
  faDiagramNext,
  faCreditCard,
  faDollarSign,
  faCalculator,
  faFileInvoice,
  faFileImport,
  faFileExport,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the module tabs configuration for FMS (Financial Management System).
 * This has been shifted from Common.jsx to make the codebase more modular and manageable.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getFmsModuleTabs = (t) => [
  { id: 'fms_overview', label: t('overview'), icon: <FontAwesomeIcon icon={faHome} /> },
  {
    id: 'fms_invoice_management',
    label: 'Invoice Management',
    icon: <FontAwesomeIcon icon={faFileInvoice} />,
    subTabs: [
      { id: 'fms_invoice_dashboard', label: 'Invoice Dashboard', icon: <FontAwesomeIcon icon={faGaugeHigh} /> },
      { id: 'fms_generate_invoice', label: 'Generate Invoice', icon: <FontAwesomeIcon icon={faPlus} /> },
      { id: 'fms_import_invoice', label: 'Import Invoice', icon: <FontAwesomeIcon icon={faFileImport} /> },
      { id: 'fms_export_invoice', label: 'Export Invoice', icon: <FontAwesomeIcon icon={faFileExport} /> },
    ],
  },
  
  {
    id: 'fms_operations_mgmt',
    label: 'Operations Center',
    icon: <FontAwesomeIcon icon={faCogs} />,
    subTabs: [
      { id: 'fms_contractor_payments', label: t('contractor_payments'), icon: <FontAwesomeIcon icon={faIdBadge} /> },
      { id: 'fms_expense_claims', label: t('expense_claims'), icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> },
    ]
  },

  {
    id: 'fms_branding_portals',
    label: 'Portals & Branding',
    icon: <FontAwesomeIcon icon={faPalette} />,
    subTabs: [
      { id: 'fms_white_labeling', label: t('white_labeling'), icon: <FontAwesomeIcon icon={faGlobe} /> },
      { id: 'fms_branding_customization', label: t('branding_customization'), icon: <FontAwesomeIcon icon={faBrush} /> },
      { id: 'fms_client_billing_portal', label: t('client_billing_portal'), icon: <FontAwesomeIcon icon={faHandshake} /> },
    ]
  },

  {
    id: 'fms_client_portal_billing',
    label: 'Client Portal & Billing',
    icon: <FontAwesomeIcon icon={faGlobe} />,
    subTabs: [
      { id: 'fms_client_portal', label: t('client_portal'), icon: <FontAwesomeIcon icon={faGlobe} /> },
      { id: 'fms_online_payments', label: t('online_payments'), icon: <FontAwesomeIcon icon={faCreditCard} /> },
      { id: 'fms_subscription_billing', label: t('subscription_billing'), icon: <FontAwesomeIcon icon={faDollarSign} /> },
    ]
  },

  {
    id: 'fms_corporate_finance',
    label: 'Corporate Finance',
    icon: <FontAwesomeIcon icon={faBuildingColumns} />,
    subTabs: [
      { id: 'fms_treasury_management', label: t('treasury_management'), icon: <FontAwesomeIcon icon={faBuildingColumns} /> },
      { id: 'fms_risk_management', label: t('risk_management'), icon: <FontAwesomeIcon icon={faShieldHeart} /> },
      { id: 'fms_cash_reserve_tracking', label: t('cash_reserve_tracking'), icon: <FontAwesomeIcon icon={faWallet} /> },
    ]
  },

  {
    id: 'fms_strategic_bi',
    label: 'Strategic BI & Reporting',
    icon: <FontAwesomeIcon icon={faRobot} />,
    subTabs: [
      { id: 'fms_business_intelligence_reports', label: t('business_intelligence_reports'), icon: <FontAwesomeIcon icon={faRobot} /> },
      { id: 'fms_executive_summary_reports', label: t('executive_summary_reports'), icon: <FontAwesomeIcon icon={faUserTie} /> },
      { id: 'fms_forecast_vs_actual_reports', label: t('forecast_vs_actual_reports'), icon: <FontAwesomeIcon icon={faChartBar} /> },
      { id: 'fms_data_visualization_charts', label: t('data_visualization_charts'), icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'fms_drill_down_reports', label: t('drill_down_reports'), icon: <FontAwesomeIcon icon={faMagnifyingGlassChart} /> },
      { id: 'fms_usage_analytics', label: t('usage_analytics'), icon: <FontAwesomeIcon icon={faChartArea} /> },
    ]
  },

  {
    id: 'fms_reimbursement_mgmt',
    label: t('reimbursement_mgmt'),
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    subTabs: [
      { id: 'fms_expense_reimbursement', label: t('expense_reimbursement'), icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> },
      { id: 'fms_employee_reimbursements', label: t('employee_reimbursements'), icon: <FontAwesomeIcon icon={faWallet} /> },
    ]
  },
  {
    id: 'fms_expenditure_receipts',
    label: t('expenditure_receipts'),
    icon: <FontAwesomeIcon icon={faCloudArrowUp} />,
    subTabs: [
      { id: 'fms_receipt_upload', label: t('receipt_upload'), icon: <FontAwesomeIcon icon={faCloudArrowUp} /> },
      { id: 'fms_expense_categories', label: t('expense_categories'), icon: <FontAwesomeIcon icon={faTags} /> },
      { id: 'fms_recurring_transactions', label: t('recurring_transactions'), icon: <FontAwesomeIcon icon={faSync} /> },
    ]
  },
  {
    id: 'fms_revenue_tax',
    label: t('revenue_tax'),
    icon: <FontAwesomeIcon icon={faChartLine} />,
    subTabs: [
      { id: 'fms_income_categories', label: t('income_categories'), icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'fms_vat_gst_support', label: t('vat_gst_support'), icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
      { id: 'fms_withholding_tax', label: t('withholding_tax'), icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> },
      { id: 'fms_currency_exchange_tracking', label: t('currency_exchange_tracking'), icon: <FontAwesomeIcon icon={faGlobe} /> },
    ]
  },
  {
    id: 'fms_payroll_analytics',
    label: t('payroll_analytics'),
    icon: <FontAwesomeIcon icon={faChartPie} />,
    subTabs: [
      { id: 'fms_overtime_calculations', label: t('overtime_calculations'), icon: <FontAwesomeIcon icon={faClock} /> },
      { id: 'fms_commission_management', label: t('commission_management'), icon: <FontAwesomeIcon icon={faChartPie} /> },
    ]
  },
  {
    id: 'fms_asset_inventory',
    label: t('asset_inventory'),
    icon: <FontAwesomeIcon icon={faBoxOpen} />,
    subTabs: [
      { id: 'fms_inventory_accounting', label: t('inventory_accounting'), icon: <FontAwesomeIcon icon={faBoxOpen} /> },
      { id: 'fms_stock_valuation', label: t('stock_valuation'), icon: <FontAwesomeIcon icon={faChartPie} /> },
      { id: 'fms_inventory_cost_tracking', label: t('inventory_cost_tracking'), icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'fms_warehouse_financial_tracking', label: t('warehouse_financial_tracking'), icon: <FontAwesomeIcon icon={faBuilding} /> },
      { id: 'fms_asset_tracking', label: t('asset_tracking'), icon: <FontAwesomeIcon icon={faBuilding} /> },
    ]
  },
  {
    id: 'fms_funding_investments',
    label: t('funding_investments'),
    icon: <FontAwesomeIcon icon={faWallet} />,
    subTabs: [
      { id: 'fms_investment_tracking', label: t('investment_tracking'), icon: <FontAwesomeIcon icon={faChartPie} /> },
      { id: 'fms_loan_management', label: t('loan_management'), icon: <FontAwesomeIcon icon={faDatabase} /> },
      { id: 'fms_emi_tracking', label: t('emi_tracking'), icon: <FontAwesomeIcon icon={faClock} /> },
    ]
  },
  {
    id: 'fms_reports_exports',
    label: t('reports_exports'),
    icon: <FontAwesomeIcon icon={faChartBar} />,
    subTabs: [
      { id: 'fms_export_reports', label: t('export_reports'), icon: <FontAwesomeIcon icon={faChartBar} /> },
      { id: 'fms_automated_reports', label: t('automated_reports'), icon: <FontAwesomeIcon icon={faCalendarDays} /> },
    ]
  },
  {
    id: 'fms_compliance_security',
    label: t('compliance_security'),
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
    subTabs: [
      { id: 'fms_data_backup', label: t('data_backup'), icon: <FontAwesomeIcon icon={faCloudArrowUp} /> },
      { id: 'fms_file_attachments', label: t('file_attachments'), icon: <FontAwesomeIcon icon={faPaperclip} /> },
      { id: 'fms_e_signature', label: t('e_signature'), icon: <FontAwesomeIcon icon={faShieldHalved} /> },
      { id: 'fms_compliance_management', label: t('compliance_management'), icon: <FontAwesomeIcon icon={faShieldHeart} /> },
      { id: 'fms_audit_compliance_reports', label: t('audit_compliance_reports'), icon: <FontAwesomeIcon icon={faFileSignature} /> },
      { id: 'fms_data_recovery_system', label: t('data_recovery_system'), icon: <FontAwesomeIcon icon={faHistory} /> },
      { id: 'fms_ip_restrictions', label: t('ip_restrictions'), icon: <FontAwesomeIcon icon={faUserShield} /> },
      { id: 'fms_regional_accounting_standards', label: t('regional_accounting_standards'), icon: <FontAwesomeIcon icon={faGlobe} /> },
    ]
  },
  {
    id: 'fms_governance_ops',
    label: t('governance_ops'),
    icon: <FontAwesomeIcon icon={faProjectDiagram} />,
    subTabs: [
      { id: 'fms_financial_approval_workflow', label: t('financial_approval_workflow'), icon: <FontAwesomeIcon icon={faProjectDiagram} /> },
      { id: 'fms_budget_approval_workflow', label: t('budget_approval_workflow'), icon: <FontAwesomeIcon icon={faSitemap} /> },
      { id: 'fms_scheduled_payments', label: t('scheduled_payments'), icon: <FontAwesomeIcon icon={faCalendarDays} /> },
      { id: 'fms_refund_management', label: t('refund_management'), icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
      { id: 'fms_refund_tracking', label: t('refund_tracking'), icon: <FontAwesomeIcon icon={faTimeline} /> },
    ]
  },
  {
    id: 'fms_performance_strategy',
    label: t('performance_strategy'),
    icon: <FontAwesomeIcon icon={faGaugeHigh} />,
    subTabs: [
      { id: 'fms_kpi_monitoring', label: t('kpi_monitoring'), icon: <FontAwesomeIcon icon={faGaugeHigh} /> },
      { id: 'fms_financial_goal_tracking', label: t('financial_goal_tracking'), icon: <FontAwesomeIcon icon={faBullseye} /> },
    ]
  },
  {
    id: 'fms_planning_scheduling',
    label: t('planning_scheduling'),
    icon: <FontAwesomeIcon icon={faCalendarAlt} />,
    subTabs: [
      { id: 'fms_calendar_integration', label: t('calendar_integration'), icon: <FontAwesomeIcon icon={faCalendarCheck} /> },
      { id: 'fms_financial_calendar', label: t('financial_calendar'), icon: <FontAwesomeIcon icon={faCalendarAlt} /> },
      { id: 'fms_reminder_system', label: t('reminder_system'), icon: <FontAwesomeIcon icon={faBell} /> },
    ]
  },
  {
    id: 'fms_collaboration',
    label: t('collaboration'),
    icon: <FontAwesomeIcon icon={faComments} />,
    subTabs: [
      { id: 'fms_real_time_collaboration', label: t('real_time_collaboration'), icon: <FontAwesomeIcon icon={faComments} /> },
    ]
  },
  {
    id: 'fms_budgeting_cost_centers',
    label: t('budgeting_cost_centers'),
    icon: <FontAwesomeIcon icon={faBuildingColumns} />,
    subTabs: [
      { id: 'fms_department_budgeting', label: t('department_budgeting'), icon: <FontAwesomeIcon icon={faBuildingColumns} /> },
      { id: 'fms_cost_center_management', label: t('cost_center_management'), icon: <FontAwesomeIcon icon={faMapLocationDot} /> },
      { id: 'fms_profit_center_management', label: t('profit_center_management'), icon: <FontAwesomeIcon icon={faCoins} /> },
      { id: 'fms_project_cost_tracking', label: t('project_cost_tracking'), icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'fms_project_budget_tracking', label: t('project_budget_tracking'), icon: <FontAwesomeIcon icon={faDatabase} /> },
      { id: 'fms_time_billing', label: t('time_billing'), icon: <FontAwesomeIcon icon={faHourglassHalf} /> },
      { id: 'fms_resource_cost_management', label: t('resource_cost_management'), icon: <FontAwesomeIcon icon={faUsers} /> },
    ]
  },
  {
    id: 'fms_billing_revenue',
    label: 'Billing & Revenue',
    icon: <FontAwesomeIcon icon={faDollarSign} />,
    subTabs: [
      { id: 'fms_recurring_billing', label: t('recurring_billing'), icon: <FontAwesomeIcon icon={faSync} /> },
    ]
  },
  {
    id: 'fms_payroll_management_group',
    label: 'Payroll Management',
    icon: <FontAwesomeIcon icon={faUsers} />,
    subTabs: [
      { id: 'fms_payroll_management', label: t('payroll_management'), icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'fms_salary_processing', label: t('salary_processing'), icon: <FontAwesomeIcon icon={faDollarSign} /> },
      { id: 'fms_payslip_generation', label: t('payslip_generation'), icon: <FontAwesomeIcon icon={faFileAlt} /> },
    ]
  },
  {
    id: 'fms_tax_management_group',
    label: 'Tax Management',
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
    subTabs: [
      { id: 'fms_tax_calculations', label: t('tax_calculations'), icon: <FontAwesomeIcon icon={faCalculator} /> },
      { id: 'fms_tax_management', label: t('tax_management'), icon: <FontAwesomeIcon icon={faShieldHalved} /> },
    ]
  },
  {
    id: 'fms_business_intelligence',
    label: t('business_intelligence'),
    icon: <FontAwesomeIcon icon={faRobot} />,
    subTabs: [
      { id: 'fms_custom_report_builder', label: t('custom_report_builder'), icon: <FontAwesomeIcon icon={faRobot} /> },
    ]
  },
  {
    id: 'fms_enterprise_admin',
    label: t('enterprise_admin'),
    icon: <FontAwesomeIcon icon={faUsersGear} />,
    subTabs: [
      // { id: 'fms_tenant_management', label: t('tenant_management'), icon: <FontAwesomeIcon icon={faUsersGear} /> },
      { id: 'fms_session_management', label: t('session_management'), icon: <FontAwesomeIcon icon={faUserShield} /> },
      { id: 'fms_internal_notes', label: t('internal_notes'), icon: <FontAwesomeIcon icon={faStickyNote} /> },
      { id: 'fms_approval_chains', label: t('approval_chains'), icon: <FontAwesomeIcon icon={faLink} /> },
      { id: 'fms_workflow_automation', label: t('workflow_automation'), icon: <FontAwesomeIcon icon={faDiagramNext} /> },
    ]
  },
];
