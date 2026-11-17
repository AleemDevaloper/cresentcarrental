import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faChartLine, faCogs, faCalendarDays,
  faTags, faSitemap, faCalculator, faCoins,
  faFileAlt, faFileSignature, faTimeline, faFileInvoice,
  faStickyNote, faHistory, faGaugeHigh, faBuildingColumns,
  faFileInvoiceDollar, faUsers, faCartShopping, faFileContract,
  faClipboardList, faTruckRampBox, faReceipt, faArrowRotateLeft,
  /* START OF NEW ADDITION: Inventory Service Icon Imports */
  faBoxesStacked, faWarehouse, faScaleBalanced, faTruck,
  faBox, faListCheck, faRoute, faLayerGroup,
  /* END OF NEW ADDITION: Inventory Service Icon Imports */
  /* START OF NEW ADDITION: POS Retail Icon Imports */
  faStore, faUserCheck,
  /* START OF NEW ADDITION: Fixed Assets Icon Imports */
  faBuilding, faFolder, faLocationDot, faTrashCan, faPercent,
  /* END OF NEW ADDITION: Fixed Assets Icon Imports */
  faShieldHalved, faBolt, faBookOpen, faSliders, faClock, faFilePen
} from "@fortawesome/free-solid-svg-icons";

const makeWorkspaceTabs = (items, icon) => items.map(([id, label]) => ({
  id,
  label,
  icon: <FontAwesomeIcon icon={icon} />,
}));

/**
 * Returns the module tabs configuration for AMS (Accounting Management System).
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getAmsModuleTabs = (t) => [
  { id: 'erp_dashboard', label: 'Accounting Dashboard', icon: <FontAwesomeIcon icon={faChartLine} /> },
  {
    id: 'fms_core_accounting_group',
    label: 'Core Accounting',
    icon: <FontAwesomeIcon icon={faBuildingColumns} />,
    subTabs: [
      { id: 'erp_settings', label: 'Accounting Settings', icon: <FontAwesomeIcon icon={faCogs} /> },
      { id: 'erp_fiscal_years', label: 'Fiscal Years & Periods', icon: <FontAwesomeIcon icon={faCalendarDays} /> },
      { id: 'erp_account_types', label: 'Account Types', icon: <FontAwesomeIcon icon={faTags} /> },
      { id: 'erp_account_groups', label: 'Account Groups', icon: <FontAwesomeIcon icon={faSitemap} /> },
      { id: 'erp_chart_of_accounts', label: 'Chart of Accounts', icon: <FontAwesomeIcon icon={faCalculator} /> },
      { id: 'erp_opening_balances', label: 'Opening Balances', icon: <FontAwesomeIcon icon={faCoins} /> },
    ]
  },
  {
    id: 'fms_receivables_group',
    label: 'Accounts Receivable',
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    subTabs: [
      { id: 'erp_customers', label: 'Customers', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'erp_customer_receipts', label: 'Customer Receipts', icon: <FontAwesomeIcon icon={faCoins} /> },
    ]
  },
  {
    id: 'fms_sales_module_group',
    label: 'Sales Module',
    icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    subTabs: [
      { id: 'erp_quotations', label: 'Quotations', icon: <FontAwesomeIcon icon={faFileAlt} /> },
      { id: 'erp_sales_orders', label: 'Sales Orders', icon: <FontAwesomeIcon icon={faFileSignature} /> },
      { id: 'erp_delivery_challans', label: 'Delivery Challans', icon: <FontAwesomeIcon icon={faTimeline} /> },
      { id: 'erp_sales_invoices', label: 'Sales Invoices', icon: <FontAwesomeIcon icon={faFileInvoice} /> },
      { id: 'erp_credit_notes', label: 'Credit Notes', icon: <FontAwesomeIcon icon={faStickyNote} /> },
      { id: 'erp_sales_returns', label: 'Sales Returns', icon: <FontAwesomeIcon icon={faHistory} /> },
    ]
  },
  {
    id: 'fms_purchase_module_group',
    label: 'Purchase Module',
    icon: <FontAwesomeIcon icon={faCartShopping} />,
    subTabs: [
      { id: 'erp_purchase_requisitions', label: 'Purchase Requisitions', icon: <FontAwesomeIcon icon={faClipboardList} /> },
      { id: 'erp_rfqs', label: 'RFQs', icon: <FontAwesomeIcon icon={faFileContract} /> },
      { id: 'erp_purchase_orders', label: 'Purchase Orders', icon: <FontAwesomeIcon icon={faFileSignature} /> },
      { id: 'erp_goods_receipts', label: 'Goods Receipt Notes', icon: <FontAwesomeIcon icon={faTruckRampBox} /> },
      { id: 'erp_vendor_bills', label: 'Vendor Bills', icon: <FontAwesomeIcon icon={faReceipt} /> },
      { id: 'erp_purchase_returns', label: 'Purchase Returns', icon: <FontAwesomeIcon icon={faArrowRotateLeft} /> },
    ]
  },
  /* START OF NEW ADDITION: Purchases & AP Dropdown Group */
  {
    id: 'fms_purchases_ap_group',
    label: 'Purchases & AP',
    icon: <FontAwesomeIcon icon={faReceipt} />,
    subTabs: [
      { id: 'erp_vendors', label: 'Vendors', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'erp_vendor_payments', label: 'Vendor Payments', icon: <FontAwesomeIcon icon={faCoins} /> }
    ]
  },
  /* END OF NEW ADDITION: Purchases & AP Dropdown Group */
  /* START OF NEW ADDITION: Budgeting & Cost Centers Dropdown Group */
  {
    id: 'fms_budgeting_cost_centers_group',
    label: 'Budgeting & Cost Centers',
    icon: <FontAwesomeIcon icon={faScaleBalanced} />,
    subTabs: [
      { id: 'erp_cost_centers', label: 'Cost Centers', icon: <FontAwesomeIcon icon={faSitemap} /> },
      { id: 'erp_analytic_accounts', label: 'Analytic Accounts', icon: <FontAwesomeIcon icon={faCalculator} /> },
      { id: 'erp_budget_plans', label: 'Budget Plans', icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> },
      { id: 'erp_budget_vs_actual', label: 'Budget vs Actual', icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'erp_budget_alerts', label: 'Budget Alerts', icon: <FontAwesomeIcon icon={faHistory} /> }
    ]
  },
  /* END OF NEW ADDITION: Budgeting & Cost Centers Dropdown Group */
  /* START OF NEW ADDITION: Fixed Assets Dropdown Group */
  {
    id: 'fms_fixed_assets_group',
    label: 'Fixed Assets',
    icon: <FontAwesomeIcon icon={faBuilding} />,
    subTabs: [
      { id: 'erp_fixed_assets', label: 'Fixed Asset Register', icon: <FontAwesomeIcon icon={faBuilding} /> },
      { id: 'erp_asset_categories', label: 'Asset Categories', icon: <FontAwesomeIcon icon={faFolder} /> },
      { id: 'erp_asset_locations', label: 'Asset Locations', icon: <FontAwesomeIcon icon={faLocationDot} /> },
      { id: 'erp_asset_depreciation', label: 'Depreciation', icon: <FontAwesomeIcon icon={faPercent} /> },
      { id: 'erp_asset_disposals', label: 'Disposals', icon: <FontAwesomeIcon icon={faTrashCan} /> },
      { id: 'erp_asset_book_value_report', label: 'Book Value Report', icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> }
    ]
  },
  /* END OF NEW ADDITION: Fixed Assets Dropdown Group */
  /* START OF NEW ADDITION: Inventory Service Dropdown Group */
  {
    id: 'fms_inventory_service_group',
    label: 'Inventory Service',
    icon: <FontAwesomeIcon icon={faBoxesStacked} />,
    subTabs: [
      { id: 'erp_products', label: 'Products', icon: <FontAwesomeIcon icon={faBoxesStacked} /> },
      { id: 'erp_product_categories', label: 'Product Categories', icon: <FontAwesomeIcon icon={faTags} /> },
      { id: 'erp_uoms', label: 'Units of Measure', icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
      { id: 'erp_warehouses', label: 'Warehouses', icon: <FontAwesomeIcon icon={faWarehouse} /> },
      { id: 'erp_stock_movements', label: 'Stock Movements', icon: <FontAwesomeIcon icon={faHistory} /> },
      { id: 'erp_stock_transfers', label: 'Stock Transfers', icon: <FontAwesomeIcon icon={faTruck} /> },
      { id: 'erp_inventory_valuation', label: 'Inventory Valuation', icon: <FontAwesomeIcon icon={faCoins} /> }
    ]
  },
  /* END OF NEW ADDITION: Inventory Service Dropdown Group */
  /* START OF NEW ADDITION: POS Retail Dropdown Group */
  {
    id: 'fms_pos_retail_group',
    label: 'POS / Retail',
    icon: <FontAwesomeIcon icon={faStore} />,
    subTabs: [
      { id: 'erp_pos_sales_screen', label: 'POS Sales Screen', icon: <FontAwesomeIcon icon={faCartShopping} /> },
      { id: 'erp_cashier_sessions', label: 'Cashier Sessions', icon: <FontAwesomeIcon icon={faUserCheck} /> },
      { id: 'erp_pos_invoices_receipts', label: 'POS Invoices & Receipts', icon: <FontAwesomeIcon icon={faReceipt} /> },
      { id: 'erp_z_reports', label: 'Z-Reports', icon: <FontAwesomeIcon icon={faFileAlt} /> }
    ]
  },
  /* END OF NEW ADDITION: POS Retail Dropdown Group */
  /* START OF NEW ADDITION: Payroll / HR Integration Dropdown Group */
  {
    id: 'fms_payroll_hr_integration_group',
    label: 'Payroll / HR Integration',
    icon: <FontAwesomeIcon icon={faUsers} />,
    subTabs: [
      { id: 'erp_payroll_accounting_hub', label: 'Payroll Accounting Hub', icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'erp_payroll_journal_postings', label: 'Payroll Journal Postings', icon: <FontAwesomeIcon icon={faFileInvoice} /> },
      { id: 'erp_employee_advances', label: 'Employee Advances', icon: <FontAwesomeIcon icon={faCoins} /> },
      { id: 'erp_expense_reimbursements', label: 'Expense Reimbursements', icon: <FontAwesomeIcon icon={faReceipt} /> }
    ]
  },
  /* END OF NEW ADDITION: Payroll / HR Integration Dropdown Group */
  /* START OF NEW ADDITION: Banking & Cash Dropdown Group */
  {
    id: 'fms_banking_cash_group',
    label: 'Banking & Cash',
    icon: <FontAwesomeIcon icon={faBuildingColumns} />,
    subTabs: [
      { id: 'erp_bank_cash_accounts', label: 'Bank / Cash Accounts', icon: <FontAwesomeIcon icon={faBuildingColumns} /> },
      { id: 'erp_bank_cash_vouchers', label: 'Bank / Cash Vouchers', icon: <FontAwesomeIcon icon={faReceipt} /> },
      { id: 'erp_bank_transfers', label: 'Transfers', icon: <FontAwesomeIcon icon={faHistory} /> },
      { id: 'erp_bank_reconciliation', label: 'Reconciliation', icon: <FontAwesomeIcon icon={faScaleBalanced} /> }
    ]
  },
  /* END OF NEW ADDITION: Banking & Cash Dropdown Group */
  /* START OF NEW ADDITION: Transactions Dropdown Group */
  {
    id: 'fms_transactions_group',
    label: 'Transactions',
    icon: <FontAwesomeIcon icon={faFileAlt} />,
    subTabs: [
      { id: 'erp_journal_entries', label: 'Journal Entries', icon: <FontAwesomeIcon icon={faFileInvoice} /> }
    ]
  },
  /* END OF NEW ADDITION: Transactions Dropdown Group */
  /* START OF NEW ADDITION: Tax & Compliance Dropdown Group */
  {
    id: 'fms_tax_compliance_group',
    label: 'Tax & Compliance',
    icon: <FontAwesomeIcon icon={faScaleBalanced} />,
    subTabs: [
      { id: 'erp_tax_categories', label: 'Tax Categories', icon: <FontAwesomeIcon icon={faFolder} /> },
      { id: 'erp_tax_rates', label: 'Tax Rates', icon: <FontAwesomeIcon icon={faPercent} /> },
      { id: 'erp_tax_profiles', label: 'Tax Profiles', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'erp_sales_tax_report', label: 'Sales Tax Report', icon: <FontAwesomeIcon icon={faFileInvoiceDollar} /> },
      { id: 'erp_withholding_tax_report', label: 'Withholding Report', icon: <FontAwesomeIcon icon={faFileContract} /> }
    ]
  },
  /* END OF NEW ADDITION: Tax & Compliance Dropdown Group */
  /* START OF NEW ADDITION: Approvals & Controls Dropdown Group */
  {
    id: 'fms_approvals_controls_group',
    label: 'Approvals & Controls',
    icon: <FontAwesomeIcon icon={faShieldHalved} />,
    subTabs: [
      { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'erp_approval_requests', label: 'Approval Requests', icon: <FontAwesomeIcon icon={faFileSignature} /> },
      { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: <FontAwesomeIcon icon={faSitemap} /> },
      { id: 'erp_audit_trail', label: 'Audit Trail', icon: <FontAwesomeIcon icon={faHistory} /> },
      { id: 'erp_drafts', label: 'Drafts', icon: <FontAwesomeIcon icon={faFilePen} /> },
      { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: <FontAwesomeIcon icon={faTrashCan} /> },
      { id: 'erp_import_export', label: 'Import / Export', icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
      { id: 'erp_automation_center', label: 'Automation Center', icon: <FontAwesomeIcon icon={faBolt} /> }
    ]
  },
  /* END OF NEW ADDITION: Approvals & Controls Dropdown Group */
  /* START OF NEW ADDITION: Reports & Executive Pack Dropdown Group */
  {
    id: 'fms_reports_executive_group',
    label: 'Reports & Executive Pack',
    icon: <FontAwesomeIcon icon={faFileAlt} />,
    subTabs: [
      { id: 'erp_report_center', label: 'Report Center', icon: <FontAwesomeIcon icon={faFileAlt} /> },
      { id: 'erp_executive_summary', label: 'Executive Summary', icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'erp_control_center', label: 'Control Center', icon: <FontAwesomeIcon icon={faSliders} /> },
      { id: 'erp_quality_assurance', label: 'Quality Assurance', icon: <FontAwesomeIcon icon={faShieldHalved} /> },
      { id: 'erp_day_book', label: 'Day Book', icon: <FontAwesomeIcon icon={faBookOpen} /> },
      { id: 'erp_general_ledger', label: 'General Ledger', icon: <FontAwesomeIcon icon={faCalculator} /> },
      { id: 'erp_trial_balance', label: 'Trial Balancer', icon: <FontAwesomeIcon icon={faScaleBalanced} /> },
      { id: 'erp_profit_loss', label: 'Profit & Loss', icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'erp_balance_sheet', label: 'Balance Sheet', icon: <FontAwesomeIcon icon={faFileInvoice} /> },
      { id: 'erp_cash_flow', label: 'Cash Flow', icon: <FontAwesomeIcon icon={faCoins} /> },
      { id: 'erp_customer_ledger_summary', label: 'Customer Ledger Summary', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'erp_vendor_ledger_summary', label: 'Vendor Ledger Summary', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'erp_receivables_aging', label: 'Receivables Aging', icon: <FontAwesomeIcon icon={faClock} /> },
      { id: 'erp_payables_aging', label: 'Payables Aging', icon: <FontAwesomeIcon icon={faClock} /> }
    ]
  }
  /* END OF NEW ADDITION: Reports & Executive Pack Dropdown Group */
];
