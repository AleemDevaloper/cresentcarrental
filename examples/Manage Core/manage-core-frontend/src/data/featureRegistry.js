const feature = (id, label, description, icon = 'cubes', category = 'Operations') => ({ id, label, description, icon, category });

export const FEATURE_REGISTRY = {
  pms: [
    {
      label: 'Planning & Calendar',
      icon: 'calendar',
      features: [
        feature('pms_calendar', 'Calendar', 'Plan project events, delivery dates, reviews, and reminders.', 'calendar', 'Planning'),
        feature('pms_project_reports', 'Project Reports', 'Create structured project status and executive reports.', 'chart', 'Reporting'),
        feature('pms_documentation', 'Project Documentation', 'Maintain project documents, reference notes, approvals, and attachments.', 'file', 'Documentation'),
      ],
    },
    {
      label: 'Cost, Budget & Progress',
      icon: 'chart',
      features: [
        feature('pms_cost_tracking', 'Project Cost Tracking', 'Track estimated, committed, and actual project cost.', 'chart', 'Financial Control'),
        feature('pms_budget_tracking', 'Project Budget Tracking', 'Monitor budget utilization, remaining allowance, and variance.', 'database', 'Financial Control'),
        feature('pms_progress_tracking', 'Project Progress Tracking', 'Capture planned progress, actual progress, blockers, and actions.', 'tasks', 'Delivery Control'),
        feature('pms_resource_allocation', 'Resource Allocation', 'Assign team capacity, workload, responsibility, and dates.', 'users', 'Resources'),
      ],
    },
    {
      label: 'Agile Workspace',
      icon: 'tasks',
      features: [
        feature('pms_sprint_management', 'Sprint Management', 'Plan sprints, sprint goals, committed work, and completion status.', 'clock', 'Agile'),
        feature('pms_agile_scrum', 'Agile & Scrum Support', 'Track ceremonies, scrum notes, velocity, and impediments.', 'cubes', 'Agile'),
        feature('pms_backlog_management', 'Backlog Management', 'Prioritize backlog items, owners, acceptance notes, and releases.', 'clipboard', 'Agile'),
        feature('pms_risk_tracking', 'Risk Tracking', 'Record risk severity, mitigation plan, owner, and due date.', 'risk', 'Governance'),
      ],
    },
    {
      label: 'Recovery & Controls',
      icon: 'database',
      features: [
        feature('pms_data_backup', 'Data Backup & Recovery', 'Export, restore, and protect PMS operational records.', 'database', 'Controls'),
      ],
    },
  ],
  hrms: [
    {
      label: 'Employee Records',
      icon: 'users',
      features: [
        feature('employee-profile', 'Employee Profile', 'Manage detailed employee records, education, and experience.', 'id', 'Employee Records'),
        feature('hrms_bank', 'Bank Details', 'Maintain employee bank, account, and payroll payment information.', 'building', 'Employee Records'),
        feature('hrms_emergency', 'Emergency Contacts', 'Record emergency contacts, relationship, mobile, and notes.', 'id', 'Employee Records'),
        feature('hrms_hierarchy', 'Reporting Hierarchy', 'Define reporting managers, escalation chain, and approvals.', 'network', 'Employee Records'),
        feature('hrms_import', 'CSV Import', 'Stage CSV import batches and import validation results.', 'csv', 'Data Management'),
      ],
    },
    {
      label: 'Attendance Management',
      icon: 'calendar',
      features: [
        feature('hrms_gps_attendance', 'GPS Attendance', 'Track GPS verified attendance requests and coordinates.', 'location', 'Attendance'),
        feature('hrms_selfie_attendance', 'Selfie Attendance', 'Capture selfie verification, review status, and approval notes.', 'camera', 'Attendance'),
        feature('hrms_qr_attendance', 'QR Attendance', 'Manage QR based attendance scans and site verification.', 'qr', 'Attendance'),
        feature('hrms_site_attendance', 'Site Attendance', 'Manage site-based check-in/check-out records.', 'building', 'Attendance'),
        feature('hrms_supervisor_attendance', 'Supervisor Attendance', 'Review supervisor attendance approvals and corrections.', 'check', 'Attendance'),
        feature('hrms_manual_attendance', 'Manual Attendance Request', 'Submit and approve manual attendance adjustment requests.', 'signature', 'Attendance'),
        feature('hrms_punch_correction', 'Missing Punch Correction', 'Correct missing punch entries with reason and workflow status.', 'edit', 'Attendance'),
        feature('hrms_red_zone', 'Red Zone Attendance Reports', 'Track missing entries, late punches, and red-zone attendance risks.', 'risk', 'Attendance'),
      ],
    },
    {
      label: 'Sites, Branches & Shifts',
      icon: 'location',
      features: [
        feature('hrms_sites', 'Sites / Branches / Locations', 'Maintain site, branch, address, and responsible person data.', 'location', 'Site Management'),
        feature('hrms_site_radius', 'Site GPS Radius', 'Configure site radius, allowed distance, and GPS rules.', 'circle', 'Site Management'),
        feature('hrms_geofencing', 'Geo-fencing', 'Maintain virtual boundaries and geofence compliance records.', 'network', 'Site Management'),
        feature('hrms_site_assignment', 'Site Assignment', 'Assign employees to locations, projects, and duty periods.', 'userPlus', 'Site Management'),
        feature('hrms_outdoor_duty', 'Client / Outdoor Duty Location', 'Record client visits, outdoor duty locations, and approvals.', 'walk', 'Site Management'),
        feature('hrms_site_qr', 'QR Code per Site', 'Create and control QR codes linked with each site.', 'qr', 'Site Management'),
        feature('hrms_sites_mgmt', 'Sites Management', 'Manage enterprise locations, geofencing, and site data.', 'location', 'Configuration'),
        feature('hrms_shifts_mgmt', 'Shifts Management', 'Configure work schedules, grace periods, and break rules.', 'clock', 'Configuration'),
        feature('hrms_payroll_setup', 'Payroll Configuration', 'Define salary components, structures, and tax rules.', 'wallet', 'Configuration'),
        feature('hrms_payroll_dashboard', 'Payroll Management', 'Process monthly payroll, generate payslips, and LWP.', 'fileInvoiceDollar', 'Operations'),
        feature('hrms_assets', 'Asset Issuance', 'Track company equipment (Laptops, SIMs) issued to staff.', 'laptop', 'Operations'),
        feature('hrms_shifts', 'Shift Management', 'Create shift schedules, rosters, tolerance, and break rules.', 'clock', 'Scheduling'),
      ],
    },
    {
      label: 'Performance & Talent',
      icon: 'star',
      features: [
        feature('hrms_performance', 'Performance Portal', 'Track goals, OKRs, and professional growth.', 'star', 'Performance'),
        feature('hrms_onboarding', 'Onboarding Portal', 'Manage new hire checklists and integration.', 'user-plus', 'Performance'),
        feature('hrms_kpis', 'KPI Monitoring', 'Manage Key Performance Indicators and targets.', 'chart', 'Performance'),
        feature('hrms_reviews', 'Performance Reviews', 'Manage employee appraisals and feedback cycles.', 'check', 'Performance'),
        feature('hrms_goals', 'Goal & OKR Tracking', 'Set and monitor individual and team goals.', 'bullseye', 'Performance'),
      ],
    },
    {
      label: 'Leave & Communications',
      icon: 'umbrella',
      features: [
        feature('hrms_my_leave_balance', 'My Leave Balance', 'Review annual leave entitlements, utilized leaves, and allocation rules.', 'umbrella', 'Leaves'),
        feature('hrms_notification_inbox', 'Notification Inbox', 'View system notifications, approval workflows, alerts, and settings.', 'bell', 'Communications'),
      ],
    },
  ],
  fms: [
    {
      label: 'Expenses & Claims',
      icon: 'file',
      features: [
        feature('fms_expense_reimbursement', 'Expense Reimbursement', 'Submit, review, and approve expense reimbursement claims.', 'file', 'Expenses'),
        feature('fms_receipt_upload', 'Receipt Upload', 'Upload receipt references and reimbursement proof records.', 'file', 'Expenses'),
        feature('fms_expense_categories', 'Expense Categories', 'Maintain expense categories, limits, and accounting mapping.', 'cubes', 'Expenses'),
        feature('fms_employee_reimbursements', 'Employee Reimbursements', 'Track employee payable claims and settlement status.', 'users', 'Expenses'),
        feature('fms_expense_claims', 'Expense Claims', 'Manage expense claim workflow, attachments, and approvals.', 'signature', 'Expenses'),
      ],
    },
    {
      label: 'Core Accounting',
      icon: 'building',
      features: [
        feature('erp_settings', 'Accounting Settings', 'Configure base currencies, fiscal years, tax methods, journal rules, and compliance parameters.', 'cog', 'Configuration'),
        feature('erp_fiscal_years', 'Fiscal Years & Periods', 'Manage fiscal year definitions, accounting periods, open/close status, and lock rules.', 'calendar', 'Configuration'),
        feature('erp_account_types', 'Account Types', 'Define asset, liability, equity, revenue, expense, and COGS account classifications.', 'tags', 'Configuration'),
        feature('erp_account_groups', 'Account Groups', 'Organize accounts into parent-child group hierarchies for structured financial reporting.', 'sitemap', 'Configuration'),
        feature('erp_chart_of_accounts', 'Chart of Accounts', 'Manage the full GL account registry with codes, names, types, currencies, and opening balances.', 'calculator', 'Configuration'),
        feature('erp_opening_balances', 'Opening Balances', 'Set and manage opening balance entries for all GL accounts at fiscal year start.', 'coins', 'Configuration'),
      ],
    },
    {
      label: 'Sales, Billing & Invoicing',
      icon: 'chart',
      features: [
        feature('fms_invoice_management', 'Invoice Management', 'Create invoice records, due dates, status, and payment follow-up.', 'file', 'Billing'),
        feature('fms_recurring_invoices', 'Recurring Invoices', 'Plan recurring invoice schedules and billing cycles.', 'clock', 'Billing'),
        feature('fms_quotation_management', 'Quotation Management', 'Prepare quotations, validity, approvals, and conversion status.', 'clipboard', 'Billing'),
        feature('fms_purchase_orders', 'Purchase Orders', 'Track PO records, suppliers, amounts, and delivery status.', 'file', 'Procurement'),
        feature('fms_sales_orders', 'Sales Orders', 'Track sales order records, customers, amount, and status.', 'chart', 'Sales'),
        feature('fms_credit_notes', 'Credit Notes', 'Issue and track credit notes with linked invoices.', 'file', 'Billing'),
        feature('fms_debit_notes', 'Debit Notes', 'Issue and track debit notes with reason and amount.', 'file', 'Billing'),
        feature('fms_online_payments', 'Online Payments', 'Record payment links, providers, transaction status, and reconciliation.', 'database', 'Billing'),
        feature('fms_subscription_billing', 'Subscription Billing', 'Manage subscription plans, renewals, billing cycles, and status.', 'clock', 'Billing'),
        feature('fms_recurring_billing', 'Recurring Billing', 'Maintain recurring billing rules and reminders.', 'clock', 'Billing'),
        feature('fms_client_billing_portal', 'Client Billing Portal', 'Manage client-facing billing records and portal status.', 'users', 'Client Portal'),
      ],
    },
    {
      label: 'Parties & Portal',
      icon: 'users',
      features: [
        feature('fms_vendor_management', 'Vendor Management', 'Maintain vendor records, contracts, balances, and notes.', 'users', 'Parties'),
        feature('fms_supplier_management', 'Supplier Management', 'Track suppliers, terms, orders, and payable status.', 'users', 'Parties'),
        feature('fms_customer_management', 'Customer Management', 'Maintain customer records, balances, and communication notes.', 'users', 'Parties'),
        feature('fms_client_portal', 'Client Portal', 'Control client portal records, access status, and documentation.', 'users', 'Portal'),
      ],
    },
    {
      label: 'Purchases & AP',
      icon: 'receipt',
      features: [
        feature('erp_vendors', 'Vendors Management', 'Enlist and manage centralized vendor directory, profile tabs, and AI analytics.', 'users', 'AP'),
        feature('erp_vendor_bills', 'Vendor Bills', 'Track, review, and match purchase vendor bills and approvals.', 'file-invoice', 'AP'),
        feature('erp_vendor_payments', 'Vendor Payments', 'Process maker-checker settlements, bank releases, and payment register logs.', 'coins', 'AP'),
      ],
    },
    {
      label: 'Budgeting & Cost Centers',
      icon: 'scale-balanced',
      features: [
        feature('erp_cost_centers', 'Cost Centers', 'Allocate, monitor, and control expenses and budgets across profit centers.', 'sitemap', 'Budgeting'),
        feature('erp_analytic_accounts', 'Analytic Accounts', 'Independent dimension tracking for projects, departments, and activities.', 'calculator', 'Budgeting'),
        feature('erp_budget_plans', 'Budget Plans', 'Define quarterly and annual OPEX/CAPEX budget scenarios and revisions.', 'file-invoice-dollar', 'Budgeting'),
        feature('erp_budget_vs_actual', 'Budget vs Actual', 'Compare planned targets with actual GL postings in real-time.', 'chart-line', 'Budgeting'),
        feature('erp_budget_alerts', 'Budget Alerts', 'Trigger warnings and Slack/Teams webhooks on budget thresholds.', 'bell', 'Budgeting'),
      ],
    },
    {
      label: 'Fixed Assets',
      icon: 'building',
      features: [
        feature('erp_fixed_assets', 'Fixed Asset Register', 'Manage acquisition, capitalization, depreciation, and audits.', 'building', 'Fixed Assets'),
        feature('erp_asset_categories', 'Asset Categories', 'Classify assets with predefined depreciation and GL templates.', 'folder', 'Fixed Assets'),
        feature('erp_asset_locations', 'Asset Locations', 'Physical tracking directory, warehouse plants, and capacity limits.', 'location-dot', 'Fixed Assets'),
        feature('erp_asset_depreciation', 'Asset Depreciation', 'Process period-close depreciation rules and GL posting entries.', 'percent', 'Fixed Assets'),
        feature('erp_asset_disposals', 'Asset Disposals', 'Manage write-offs, scrapping, and disposal sales gain/loss.', 'trash-can', 'Fixed Assets'),
        feature('erp_asset_book_value_report', 'Book Value Report', 'Analyze NBV calculations, salvage projections, and IFRS reports.', 'file-invoice-dollar', 'Fixed Assets'),
      ],
    },
    {
      label: 'Payroll & Tax',
      icon: 'database',
      features: [
        feature('fms_payroll_management', 'Payroll Management', 'Control payroll periods, review status, and payroll totals.', 'users', 'Payroll'),
        feature('fms_salary_processing', 'Salary Processing', 'Process salary batches, approvals, and payment readiness.', 'check', 'Payroll'),
        feature('fms_payslip_generation', 'Payslip Generation', 'Generate payslip records and export readiness status.', 'file', 'Payroll'),
        feature('fms_tax_calculations', 'Tax Calculations', 'Track tax basis, rates, and calculation notes.', 'database', 'Tax'),
        feature('fms_tax_management', 'Tax Management', 'Manage tax filing records, status, and compliance notes.', 'shield', 'Tax'),
        feature('fms_vat_gst_support', 'VAT/GST Support', 'Maintain VAT/GST records, return cycles, and tax status.', 'database', 'Tax'),
        feature('fms_withholding_tax', 'Withholding Tax', 'Track withholding tax certificates, rates, and payment status.', 'shield', 'Tax'),
        feature('fms_overtime_calculations', 'Overtime Calculations', 'Track overtime hours, rates, approvals, and calculated values.', 'clock', 'Payroll'),
        feature('fms_commission_management', 'Commission Management', 'Manage commission schemes, amounts, and approvals.', 'chart', 'Payroll'),
      ],
    },
    {
      label: 'Approvals & Workflow',
      icon: 'check',
      features: [
        feature('fms_scheduled_payments', 'Scheduled Payments', 'Plan payment dates, amounts, reminders, and status.', 'calendar', 'Payments'),
        feature('fms_financial_approval_workflow', 'Financial Approval Workflow', 'Control financial approvals, chains, and audit decisions.', 'check', 'Workflow'),
        feature('fms_budget_approval_workflow', 'Budget Approval Workflow', 'Approve budgets, revisions, and department requests.', 'check', 'Workflow'),
        feature('fms_approval_chains', 'Approval Chains', 'Define multi-step approval routing and responsible users.', 'network', 'Workflow'),
        feature('fms_workflow_automation', 'Workflow Automation', 'Configure automation records and workflow execution notes.', 'cubes', 'Workflow'),
        feature('fms_smart_notifications', 'Smart Notifications', 'Control financial reminders, alerts, and notification status.', 'bell', 'Workflow'),
        feature('fms_reminder_system', 'Reminder System', 'Create financial reminders with due dates and ownership.', 'calendar', 'Workflow'),
      ],
    },
    {
      label: 'Budgeting, Cost & Projects',
      icon: 'chart',
      features: [
        feature('fms_budget_tracking', 'Budget Tracking', 'Track budget allocation, utilization, and variance.', 'database', 'Budget'),
        feature('fms_department_budgeting', 'Department Wise Budgeting', 'Maintain department-level budgets and approvals.', 'sitemap', 'Budget'),
        feature('fms_cost_center_management', 'Cost Center Management', 'Maintain cost centers, budgets, and allocations.', 'sitemap', 'Budget'),
        feature('fms_profit_center_management', 'Profit Center Management', 'Maintain profit centers, targets, and performance records.', 'chart', 'Budget'),
        feature('fms_project_cost_tracking', 'Project Cost Tracking', 'Track project costs, commitments, and actuals.', 'chart', 'Project Finance'),
        feature('fms_project_budget_tracking', 'Project Budget Tracking', 'Track project budgets, variance, and approvals.', 'database', 'Project Finance'),
        feature('fms_time_billing', 'Time Billing', 'Track billable time, rates, and client invoicing readiness.', 'clock', 'Project Finance'),
        feature('fms_resource_cost_management', 'Resource Cost Management', 'Control resource rates, allocation, and cost impact.', 'users', 'Project Finance'),
        feature('fms_contractor_payments', 'Contractor Payments', 'Track contractor invoices, approvals, and payment status.', 'users', 'Project Finance'),
      ],
    },
    {
      label: 'Inventory, Assets & Funding',
      icon: 'building',
      features: [
        feature('fms_inventory_accounting', 'Inventory Accounting', 'Track inventory accounting records and valuation status.', 'cubes', 'Inventory'),
        feature('fms_stock_valuation', 'Stock Valuation', 'Track stock valuation records and costing basis.', 'database', 'Inventory'),
        feature('fms_inventory_cost_tracking', 'Inventory Cost Tracking', 'Track inventory-related cost entries and variance.', 'chart', 'Inventory'),
        feature('fms_warehouse_financial_tracking', 'Warehouse Financial Tracking', 'Maintain warehouse cost and financial performance records.', 'building', 'Inventory'),
        feature('fms_asset_tracking', 'Asset Tracking', 'Track asset financial records, value, and status.', 'building', 'Assets'),
        feature('fms_investment_tracking', 'Investment Tracking', 'Track investment records, maturity, returns, and risk notes.', 'chart', 'Funding'),
        feature('fms_loan_management', 'Loan Management', 'Track loans, balances, repayment plans, and status.', 'database', 'Funding'),
        feature('fms_emi_tracking', 'EMI Tracking', 'Track EMI schedules, paid amount, due dates, and remaining balance.', 'clock', 'Funding'),
        feature('fms_treasury_management', 'Treasury Management', 'Track treasury positions, reserves, and cash planning.', 'database', 'Treasury'),
        feature('fms_cash_reserve_tracking', 'Cash Reserve Tracking', 'Track reserve balances, thresholds, and movement notes.', 'database', 'Treasury'),
      ],
    },
    {
      label: 'Reports, Exports & Intelligence',
      icon: 'chart',
      features: [
        feature('fms_excel_import_export', 'Excel Import/Export', 'Stage Excel import/export batches and validation status.', 'csv', 'Exports'),
        feature('fms_csv_import_export', 'CSV Import/Export', 'Stage CSV import/export batches and mapping notes.', 'csv', 'Exports'),
        feature('fms_pdf_export', 'PDF Export', 'Prepare printable PDF export registers and status.', 'file', 'Exports'),
        feature('fms_automated_reports', 'Automated Reports', 'Schedule reports, recipients, and delivery status.', 'calendar', 'Reporting'),
        feature('fms_custom_report_builder', 'Custom Report Builder', 'Build custom reports with filters, metrics, and output format.', 'chart', 'Reporting'),
        feature('fms_drill_down_reports', 'Drill-Down Reports', 'Track drill-down report definitions and review status.', 'chart', 'Reporting'),
        feature('fms_business_intelligence_reports', 'Business Intelligence Reports', 'Maintain BI report definitions, KPIs, and insights.', 'chart', 'Reporting'),
        feature('fms_executive_summary_reports', 'Executive Summary Reports', 'Prepare executive summary report records and delivery status.', 'chart', 'Reporting'),
        feature('fms_forecast_vs_actual_reports', 'Forecast vs Actual Reports', 'Track forecast vs actual analysis records and variance notes.', 'chart', 'Reporting'),
        feature('fms_kpi_monitoring', 'KPI Monitoring', 'Monitor finance KPIs, thresholds, owners, and actions.', 'chart', 'Analytics'),
        feature('fms_financial_goal_tracking', 'Financial Goal Tracking', 'Track financial goals, targets, actuals, and progress.', 'chart', 'Analytics'),
        feature('fms_dashboard_customization', 'Dashboard Customization', 'Configure dashboard cards, chart preferences, and layouts.', 'cubes', 'Analytics'),
        feature('fms_data_visualization_charts', 'Data Visualization Charts', 'Maintain finance visualization definitions and source notes.', 'chart', 'Analytics'),
        feature('fms_usage_analytics', 'Usage Analytics', 'Track usage metrics, module activity, and adoption insights.', 'chart', 'Analytics'),
      ],
    },
    {
      label: 'Compliance, Security & Admin',
      icon: 'shield',
      features: [
        feature('fms_data_backup', 'Data Backup', 'Export and protect finance data records.', 'database', 'Data Control'),
        feature('fms_file_attachments', 'File Attachments', 'Track linked files, references, and attachment notes.', 'file', 'Data Control'),
        feature('fms_e_signature', 'E-signature Support', 'Record signature requests, signers, and completion status.', 'signature', 'Data Control'),
        feature('fms_saas_subscription_management', 'SaaS Subscription Management', 'Manage tenant subscriptions, plans, and billing status.', 'clock', 'SaaS'),
        feature('fms_tenant_management', 'Tenant Management', 'Control tenant finance settings and access status.', 'building', 'SaaS'),
        feature('fms_security_encryption', 'Security & Encryption', 'Track encryption settings, checks, and security actions.', 'shield', 'Security'),
        feature('fms_two_factor_authentication', 'Two-Factor Authentication', 'Control 2FA rollout, status, and exception notes.', 'shield', 'Security'),
        feature('fms_session_management', 'Session Management', 'Review user sessions, risk status, and expiry settings.', 'clock', 'Security'),
        feature('fms_ip_restrictions', 'IP Restrictions', 'Maintain allowed IP ranges and access control status.', 'shield', 'Security'),
        feature('fms_internal_notes', 'Internal Notes', 'Maintain secure finance notes and follow-up actions.', 'clipboard', 'Collaboration'),
        feature('fms_compliance_management', 'Compliance Management', 'Track compliance tasks, owners, evidence, and status.', 'shield', 'Compliance'),
        feature('fms_audit_compliance_reports', 'Audit Compliance Reports', 'Prepare audit compliance report records and evidence.', 'file', 'Compliance'),
        feature('fms_data_recovery_system', 'Data Recovery System', 'Track backup restore checks and recovery status.', 'database', 'Data Control'),
        feature('fms_financial_calendar', 'Financial Calendar', 'Track finance calendar events, deadlines, and status.', 'calendar', 'Calendar'),
        feature('fms_calendar_integration', 'Calendar Integration', 'Manage calendar sync records and reminders.', 'calendar', 'Calendar'),
        feature('fms_currency_exchange_tracking', 'Currency Exchange Tracking', 'Track currency exchange rates, dates, and impact notes.', 'chart', 'Treasury'),
        feature('fms_regional_accounting_standards', 'Regional Accounting Standards', 'Maintain regional standard mappings and compliance notes.', 'shield', 'Compliance'),
        feature('fms_risk_management', 'Risk Management', 'Track financial risks, likelihood, impact, and mitigation actions.', 'risk', 'Risk'),
        feature('fms_white_labeling', 'White Labeling', 'Control branded finance portal settings and status.', 'palette', 'Branding'),
        feature('fms_branding_customization', 'Branding Customization', 'Maintain branding, logo, theme, and tenant identity records.', 'palette', 'Branding'),
        feature('fms_mobile_responsive_design', 'Mobile Responsive Design', 'Track mobile UX checks and responsive improvements.', 'cubes', 'UX'),
        feature('fms_advanced_search', 'Advanced Search', 'Configure finance search filters and searchable fields.', 'clipboard', 'UX'),
        feature('fms_real_time_collaboration', 'Real-Time Collaboration', 'Track collaboration sessions, shared notes, and owners.', 'users', 'Collaboration'),
        feature('fms_refund_management', 'Refund Management', 'Manage refund requests, approvals, and settlement status.', 'file', 'Refunds'),
        feature('fms_refund_tracking', 'Refund Tracking', 'Track refund progress, customer, date, and amount.', 'chart', 'Refunds'),
        feature('fms_income_categories', 'Income Categories', 'Maintain income categories and chart-of-account mapping.', 'cubes', 'Configuration'),
        feature('fms_recurring_transactions', 'Recurring Transactions', 'Schedule recurring finance transactions and review dates.', 'clock', 'Automation'),
      ],
    },
    {
      label: 'Banking & Cash',
      icon: 'building-columns',
      features: [
        feature('erp_bank_cash_accounts', 'Bank / Cash Accounts', 'Manage enterprise bank accounts, cash accounts, petty cash, treasury accounts, and financial institutions.', 'building-columns', 'Banking'),
        feature('erp_bank_cash_vouchers', 'Bank / Cash Vouchers', 'Manage enterprise cash receipts, bank receipts, payments, contra entries, adjustments, and financial vouchers.', 'file-lines', 'Banking'),
        feature('erp_bank_transfers', 'Transfers', 'Manage enterprise internal fund transfers across banks, cash accounts, branches, companies, and treasury.', 'arrow-right-arrow-left', 'Banking'),
        feature('erp_bank_reconciliation', 'Reconciliation', 'Automatically reconcile bank statements with ERP transactions using intelligent matching.', 'scale-balanced', 'Banking')
      ]
    },
    {
      label: 'Transactions',
      icon: 'file-lines',
      features: [
        feature('erp_journal_entries', 'Journal Entries', 'Record, approve, post, reverse, and audit enterprise financial transactions with General Ledger integration.', 'file-lines', 'Transactions')
      ]
    },
    {
      label: 'Tax & Compliance',
      icon: 'scale-balanced',
      features: [
        feature('erp_tax_categories', 'Tax Categories', 'Configure enterprise tax classifications used throughout Accounting, Sales, Purchases, Inventory, Payroll, and Manufacturing.', 'folder', 'Tax'),
        feature('erp_tax_rates', 'Tax Rates', 'Configure and manage enterprise tax rates with effective date control and compliance validation.', 'percent', 'Tax'),
        feature('erp_tax_profiles', 'Tax Profiles', 'Configure enterprise tax identities, compliance settings, registrations, and exemptions across the ERP.', 'users', 'Tax'),
        feature('erp_sales_tax_report', 'Sales Tax Report', 'Prepare, analyze, reconcile and file enterprise Sales Tax Returns with complete Pakistan FBR compliance.', 'file-invoice-dollar', 'Tax'),
        feature('erp_withholding_tax_report', 'Withholding Report', 'Monitor, calculate, reconcile and file enterprise withholding taxes with complete Pakistan FBR compliance.', 'file-contract', 'Tax')
      ]
    },
  ],
  ams: [
    {
      label: 'Core Accounting',
      icon: 'building',
      features: [
        feature('ams_settings', 'Accounting Settings', 'Configure base currencies, fiscal years, tax methods, journal rules, and compliance parameters.', 'cog', 'Configuration'),
        feature('ams_fiscal_years', 'Fiscal Years & Periods', 'Manage fiscal year definitions, accounting periods, open/close status, and lock rules.', 'calendar', 'Configuration'),
        feature('ams_account_types', 'Account Types', 'Define asset, liability, equity, revenue, expense, and COGS account classifications.', 'tags', 'Configuration'),
        feature('ams_account_groups', 'Account Groups', 'Organize accounts into parent-child group hierarchies for structured financial reporting.', 'sitemap', 'Configuration'),
        feature('ams_chart_of_accounts', 'Chart of Accounts', 'Manage the full GL account registry with codes, names, types, currencies, and opening balances.', 'calculator', 'Configuration'),
        feature('ams_opening_balances', 'Opening Balances', 'Set and manage opening balance entries for all GL accounts at fiscal year start.', 'coins', 'Configuration'),
      ],
    },
    {
      label: 'Sales & Accounts Receivable',
      icon: 'chart',
      features: [
        feature('ams_customers', 'Customers', 'Maintain customer records, balances, credit limits, and communication notes.', 'users', 'AR'),
        feature('ams_quotations', 'Quotations', 'Prepare quotations, validity, approvals, and conversion status.', 'clipboard', 'Sales'),
        feature('ams_sales_orders', 'Sales Orders', 'Track sales order records, customers, amount, and status.', 'chart', 'Sales'),
        feature('ams_delivery_challans', 'Delivery Challans', 'Manage delivery challans, shipment tracking, and proof of delivery.', 'truck', 'Logistics'),
        feature('ams_sales_invoices', 'Sales Invoices', 'Create invoice records, due dates, status, and payment follow-up.', 'file-invoice', 'Billing'),
        feature('ams_credit_notes', 'Credit Notes', 'Issue and track credit notes with linked invoices.', 'file', 'Billing'),
        feature('ams_sales_returns', 'Sales Returns', 'Process sales returns with reason tracking and inventory updates.', 'rotate-left', 'Returns'),
        feature('ams_customer_receipts', 'Customer Receipts', 'Record customer payments, receipts, and apply against invoices.', 'coins', 'AR'),
      ],
    },
    {
      label: 'Purchases & Accounts Payable',
      icon: 'receipt',
      features: [
        feature('ams_vendors', 'Vendors', 'Maintain vendor records, contracts, balances, and notes.', 'users', 'AP'),
        feature('ams_purchase_requisitions', 'Purchase Requisitions', 'Submit and track internal purchase requests for approval.', 'file', 'Procurement'),
        feature('ams_rfps', 'RFQs', 'Create and manage requests for quotations from vendors.', 'clipboard', 'Procurement'),
        feature('ams_purchase_orders', 'Purchase Orders', 'Track PO records, suppliers, amounts, and delivery status.', 'file', 'Procurement'),
        feature('ams_goods_receipts', 'Goods Receipt Notes', 'Log goods received, quality inspection, and GRN matching.', 'box', 'Logistics'),
        feature('ams_vendor_bills', 'Vendor Bills', 'Track, review, and match purchase vendor bills and approvals.', 'file-invoice', 'AP'),
        feature('ams_purchase_returns', 'Purchase Returns', 'Process purchase returns with vendor coordination.', 'rotate-left', 'Returns'),
        feature('ams_vendor_payments', 'Vendor Payments', 'Process maker-checker settlements, bank releases, and payment register logs.', 'coins', 'AP'),
      ],
    },
    {
      label: 'Fixed Assets',
      icon: 'building',
      features: [
        feature('ams_fixed_assets', 'Fixed Asset Register', 'Track complete asset lifecycle: acquisition, depreciation, revaluation, and disposal.', 'database', 'Assets'),
        feature('ams_asset_categories', 'Asset Categories', 'Classify assets into categories with default useful life and depreciation methods.', 'folder', 'Assets'),
        feature('ams_asset_locations', 'Asset Locations', 'Define physical and logical asset locations for tracking and audits.', 'location-dot', 'Assets'),
        feature('ams_depreciation', 'Depreciation', 'Calculate and post scheduled depreciation entries for fixed assets.', 'chart-line', 'Assets'),
        feature('ams_disposals', 'Asset Disposals', 'Record asset disposals, write-offs, and gain/loss calculations.', 'trash', 'Assets'),
        feature('ams_asset_book_value', 'Book Value Report', 'Generate current book value reports for all fixed assets.', 'chart', 'Reporting'),
      ],
    },
    {
      label: 'Inventory',
      icon: 'box',
      features: [
        feature('ams_inventory_dashboard', 'Inventory Dashboard', 'Monitor stock health, availability, expiry, reorder alerts, and inventory value.', 'chart-line', 'Inventory'),
        feature('ams_products', 'Products', 'Manage product catalog with categories, UOM, pricing, and stock levels.', 'box', 'Inventory'),
        feature('ams_product_categories', 'Product Categories', 'Define product classification hierarchies and taxonomy.', 'folder', 'Inventory'),
        feature('ams_uoms', 'Units of Measure', 'Maintain UOM master data with conversion factors.', 'ruler', 'Inventory'),
        feature('ams_warehouses', 'Warehouses', 'Manage warehouse locations, capacity, and inventory zones.', 'warehouse', 'Inventory'),
        feature('ams_stock_movements', 'Stock Movements', 'Track stock in/out movements, adjustments, and reasons.', 'arrows-left-right', 'Inventory'),
        feature('ams_stock_transfers', 'Stock Transfers', 'Process inter-warehouse stock transfers with approval workflow.', 'right-left', 'Inventory'),
        feature('ams_inventory_valuation', 'Inventory Valuation', 'Calculate inventory value using FIFO, LIFO, or weighted average methods.', 'calculator', 'Inventory'),
      ],
    },
    {
      label: 'Budgeting & Cost Centers',
      icon: 'scale-balanced',
      features: [
        feature('ams_cost_centers', 'Cost Centers', 'Allocate, monitor, and control expenses and budgets across profit centers.', 'sitemap', 'Budgeting'),
        feature('ams_analytic_accounts', 'Analytic Accounts', 'Independent dimension tracking for projects, departments, and activities.', 'calculator', 'Budgeting'),
        feature('ams_budget_plans', 'Budget Plans', 'Define quarterly and annual OPEX/CAPEX budget scenarios and revisions.', 'file-invoice-dollar', 'Budgeting'),
        feature('ams_budget_vs_actual', 'Budget vs Actual', 'Compare planned targets with actual GL postings in real-time.', 'chart-line', 'Budgeting'),
        feature('ams_budget_alerts', 'Budget Alerts', 'Trigger warnings and Slack/Teams webhooks on budget thresholds.', 'bell', 'Budgeting'),
      ],
    },
    {
      label: 'Banking & Cash',
      icon: 'landmark',
      features: [
        feature('ams_bank_accounts', 'Bank / Cash Accounts', 'Manage bank accounts, cash vaults, and account balances.', 'building', 'Banking'),
        feature('ams_vouchers', 'Vouchers', 'Record bank and cash vouchers for receipts and payments.', 'file-invoice-dollar', 'Banking'),
        feature('ams_transfers', 'Transfers', 'Process inter-account fund transfers with reconciliation.', 'right-left', 'Banking'),
        feature('ams_reconciliation', 'Bank Reconciliation', 'Match bank statements with ledger entries for reconciliation.', 'check-double', 'Banking'),
      ],
    },
    {
      label: 'Tax & Compliance',
      icon: 'percent',
      features: [
        feature('ams_tax_categories', 'Tax Categories', 'Configure enterprise tax classifications used across the accounting system.', 'folder', 'Tax'),
        feature('ams_tax_rates', 'Tax Rates', 'Configure and manage tax rates with effective date control.', 'percent', 'Tax'),
        feature('ams_tax_profiles', 'Tax Profiles', 'Configure tax identities, compliance settings, and exemptions.', 'users', 'Tax'),
        feature('ams_sales_tax_report', 'Sales Tax Report', 'Prepare, analyze, and reconcile sales tax returns.', 'file-invoice-dollar', 'Tax'),
        feature('ams_withholding_tax_report', 'Withholding Report', 'Monitor and calculate withholding taxes for compliance.', 'file-contract', 'Tax'),
      ],
    },
    {
      label: 'Reports & Analytics',
      icon: 'chart',
      features: [
        feature('ams_general_ledger', 'General Ledger', 'View complete GL transaction history with AI-powered insights.', 'book', 'Reporting'),
        feature('ams_trial_balance', 'Trial Balance', 'Generate trial balance with drill-down and variance analysis.', 'scale-balanced', 'Reporting'),
        feature('ams_profit_loss', 'Profit & Loss', 'Generate P&L statements with period comparison and trends.', 'chart-line', 'Reporting'),
        feature('ams_balance_sheet', 'Balance Sheet', 'Generate balance sheet with asset, liability, and equity breakdown.', 'chart-pie', 'Reporting'),
        feature('ams_cash_flow', 'Cash Flow', 'Track cash inflows, outflows, and net position over time.', 'water', 'Reporting'),
        feature('ams_day_book', 'Day Book', 'View daily transaction summaries with validation rules.', 'book-open', 'Reporting'),
        feature('ams_receivables_aging', 'Receivables Aging', 'Analyze customer receivables by aging buckets.', 'clock', 'Reporting'),
        feature('ams_payables_aging', 'Payables Aging', 'Analyze vendor payables by aging buckets.', 'clock', 'Reporting'),
      ],
    },
    {
      label: 'Approvals & Controls',
      icon: 'shield',
      features: [
        feature('ams_approval_dashboard', 'Approval Dashboard', 'Monitor pending approvals across all accounting workflows.', 'gauge', 'Controls'),
        feature('ams_approval_requests', 'Approval Requests', 'Review and process approval requests with comments.', 'check-circle', 'Controls'),
        feature('ams_approval_workflows', 'Approval Workflows', 'Configure multi-level approval chains and escalation rules.', 'sitemap', 'Controls'),
        feature('ams_audit_trail', 'Audit Trail', 'Track all system changes with user, timestamp, and diff.', 'history', 'Controls'),
        feature('ams_drafts', 'Drafts', 'Manage saved draft documents before final submission.', 'file', 'Controls'),
        feature('ams_trash', 'Accounting Trash', 'Restore or permanently deleted accounting records.', 'trash', 'Controls'),
      ],
    },
  ],
  tms: [
    {
      label: 'Reports & Analytics',
      icon: 'chart',
      features: [
        feature('tms_productivity_reports', 'Productivity Reports', 'Analyze productivity records, owners, and improvement notes.', 'chart', 'Analytics'),
        feature('tms_task_completion_reports', 'Task Completion Reports', 'Track task completion summaries and reporting status.', 'check', 'Analytics'),
        feature('tms_team_performance_reports', 'Team Performance Reports', 'Analyze team output, performance, and blockers.', 'users', 'Analytics'),
        feature('tms_time_usage_analytics', 'Time Usage Analytics', 'Track time usage patterns, focus time, and allocation.', 'clock', 'Analytics'),
        feature('tms_custom_reports_builder', 'Custom Reports Builder', 'Create TMS reports with filters, fields, and export options.', 'chart', 'Reporting'),
        feature('tms_export_reports', 'Export Reports (PDF/Excel/CSV)', 'Prepare report exports and delivery status.', 'csv', 'Reporting'),
        feature('tms_productivity_insights', 'Productivity Insights', 'Capture productivity insights, recommended action, and owner.', 'chart', 'Analytics'),
        feature('tms_burndown_charts', 'Burndown Charts', 'Track burndown chart records, sprint scope, and remaining work.', 'chart', 'Agile'),
        feature('tms_forecasting_analytics', 'Forecasting Analytics', 'Track future workload forecasts, confidence, and notes.', 'chart', 'Analytics'),
        feature('tms_kpi_dashboards', 'KPI Dashboards', 'Monitor key performance indicators, targets, and actual performance.', 'chart', 'Analytics'),
        feature('tms_attendance_productivity_insights', 'Attendance vs Productivity Insights', 'Analyze correlation between attendance patterns and productivity output.', 'users', 'Analytics'),
      ],
    },
    {
      label: 'Productivity Workspace',
      icon: 'tasks',
      features: [
        feature('tms_smart_dashboard', 'Smart Dashboard', 'Configure smart dashboard records and productivity highlights.', 'cubes', 'Workspace'),
        feature('tms_personal_productivity_analytics', 'Personal Productivity Analytics', 'Track individual productivity metrics and insights.', 'chart', 'Workspace'),
        feature('tms_daily_planner', 'Daily Planner', 'Plan daily tasks, priorities, time blocks, and completion status.', 'calendar', 'Workspace'),
        feature('tms_focus_mode', 'Focus Mode', 'Create focus sessions, blockers, and completion notes.', 'clock', 'Workspace'),
        feature('tms_pomodoro_timer', 'Pomodoro Timer', 'Track pomodoro sessions, duration, and result status.', 'clock', 'Workspace'),
        feature('tms_workload_management', 'Workload Management', 'Balance workload, capacity, assignments, and overload risks.', 'users', 'Management'),
        feature('tms_employee_performance_tracking', 'Employee Performance Tracking', 'Track employee performance tasks, score, and coaching notes.', 'users', 'Management'),
        feature('tms_goal_okr_tracking', 'Goal & OKR Tracking', 'Maintain goals, OKRs, owners, and progress.', 'check', 'Management'),
        feature('tms_habit_tracking', 'Habit Tracking', 'Track habits, streaks, goals, and accountability notes.', 'check', 'Workspace'),
        feature('tms_quick_add_tasks', 'Quick Add Tasks', 'Quickly capture tasks, owners, priority, and due date.', 'plus', 'Workspace'),
        feature('tms_data_backup', 'Data Backup & Recovery', 'Export, restore, and protect TMS data records.', 'database', 'Controls'),
      ],
    },
    {
      label: 'Collaboration & Management',
      icon: 'users',
      features: [
        feature('tms_team_workspaces', 'Team Workspaces', 'Create and manage dedicated workspaces for different teams.', 'users', 'Collaboration'),
        feature('tms_team_mentions', 'Team Mentions (@mentions)', 'Collaborate using @mentions in tasks and comments.', 'at', 'Collaboration'),
        feature('tms_shared_task_boards', 'Shared Task Boards', 'Visualize work on shared boards with team-wide visibility.', 'tasks', 'Collaboration'),
        feature('tms_dept_task_mgmt', 'Department-wise Task Management', 'Organize and track tasks across different departments.', 'building', 'Management'),
        feature('tms_multi_user_assignment', 'Multi-user Task Assignment', 'Assign multiple team members to complex tasks.', 'users', 'Management'),
        feature('tms_approval_workflow', 'Approval Workflow System', 'Streamline task and milestone approvals with custom workflows.', 'check', 'Management'),
        feature('tms_client_collaboration', 'Client Collaboration Portal', 'Securely collaborate with external clients on project tasks.', 'user-shield', 'Collaboration'),
      ],
    },
  ],
  dms: [
    {
      label: 'Document Repository',
      icon: 'file',
      features: [
        feature('dms_overview', 'DMS Overview', 'Monitor document archival, storage limits, and recent activity.', 'chart', 'Management'),
        feature('dms_documents', 'All Documents', 'Manage enterprise document library, versioning, and folders.', 'file', 'Documentation'),
        feature('dms_archival', 'Archival System', 'Configure document retention policies and archival rules.', 'database', 'Controls'),
      ],
    },
    {
      label: 'Document Analytics',
      icon: 'chart',
      features: [
        feature('dms_analytics', 'Analytics Dashboard', 'Comprehensive analytics on documents, approvals, signatures, and user activity.', 'chart', 'Analytics'),
        feature('dms_storage_analytics', 'Storage Analytics', 'Detailed storage usage, growth trends, file type distribution, and forecasts.', 'database', 'Analytics'),
      ],
    },
    {
      label: 'AI & Intelligence',
      icon: 'robot',
      features: [
        feature('dms_ai_intelligence', 'AI Document Intelligence', 'AI-powered document classification, OCR, metadata extraction, contract analysis, and summaries.', 'robot', 'Intelligence'),
        feature('dms_ai_assistant', 'AI Assistant Chat', 'Conversational AI assistant for document queries, recommendations, and insights.', 'comments', 'Intelligence'),
      ],
    },
    {
      label: 'Collaboration',
      icon: 'users',
      features: [
        feature('dms_collaboration', 'Collaboration Center', 'Comments, mentions, discussions, approvals, tasks, reviews, and team collaboration.', 'users', 'Collaboration'),
        feature('dms_approval_workflow', 'Approval Workflow', 'Multi-stage document approval pipeline with review cycles and analytics.', 'check', 'Workflow'),
        feature('dms_signature_center', 'Signature Center', 'Digital signature management with e-signature, multi-signer, and audit trails.', 'pen', 'Workflow'),
      ],
    },
    {
      label: 'Security & Compliance',
      icon: 'shield',
      features: [
        feature('dms_security_center', 'Security Center', 'Access control, role permissions, watermark protection, encryption, and IP restrictions.', 'shield', 'Security'),
        feature('dms_audit_logs', 'Audit Logs', 'Complete audit trail of all document activities with detailed tracking.', 'history', 'Compliance'),
        feature('dms_templates', 'Document Templates', 'Reusable document templates with customizable fields and categories.', 'file', 'Documentation'),
      ],
    },
    {
      label: 'Document Tools',
      icon: 'cubes',
      features: [
        feature('dms_document_viewer', 'Document Viewer', 'Built-in viewer for PDF, DOCX, XLSX, PPTX, images, and more with annotations.', 'eye', 'Tools'),
        feature('dms_document_scanner', 'Document Scanner', 'Scan physical documents directly into the DMS with OCR processing.', 'camera', 'Tools'),
      ],
    },
  ],
  mfg: [
    {
      label: 'Manufacturing Control Center',
      icon: 'chart',
      features: [
        feature('mfg_overview', 'MRP Dashboard', 'Monitor production, material availability, work order execution, and machine monitoring.', 'chart', 'Management'),
        feature('mfg_bill_of_materials', 'Bill of Materials', 'Manage product structures, component lists, and manufacturing recipes.', 'clipboard', 'Production'),
        feature('mfg_production_orders', 'Production Orders', 'Plan, schedule, and manage manufacturing production orders.', 'industry', 'Production'),
        feature('mfg_work_orders', 'Work Orders', 'Manage shop floor execution, machine assignments, and work order tracking.', 'tools', 'Production'),
      ],
    },
    {
      label: 'Production Planning',
      icon: 'calendar',
      features: [
        feature('mfg_production_planning', 'Production Planning', 'Create and manage production schedules and capacity plans.', 'calendar', 'Planning'),
        feature('mfg_capacity_planning', 'Capacity Planning', 'Analyze machine and labor capacity for production planning.', 'chart', 'Planning'),
        feature('mfg_material_planning', 'Material Requirement Planning', 'Calculate material requirements based on production schedules.', 'cubes', 'Planning'),
      ],
    },
    {
      label: 'Quality & Compliance',
      icon: 'check',
      features: [
        feature('mfg_quality_inspection', 'Quality Inspection', 'Manage quality checks, inspection plans, and defect tracking.', 'check', 'Quality'),
        feature('mfg_quality_control', 'Quality Control', 'Track quality metrics, CPK, and compliance standards.', 'shield', 'Quality'),
      ],
    },
  ],
  fx: [
    {
      label: 'Multi-Currency Control Center',
      icon: 'chart',
      features: [
        feature('fx_overview', 'FX Dashboard', 'Monitor exchange rates, currency exposure, FX transactions, and treasury performance.', 'chart', 'Management'),
        feature('fx_currencies', 'Currencies', 'Manage global currencies, symbols, precision, and exchange rate configurations.', 'globe', 'Treasury'),
        feature('fx_exchange_rates', 'Exchange Rates', 'Track and manage currency exchange rates with automatic updates and history.', 'exchange', 'Treasury'),
      ],
    },
    {
      label: 'Treasury Operations',
      icon: 'dollar',
      features: [
        feature('fx_transactions', 'FX Transactions', 'Process foreign exchange transactions, currency conversions, and international payments.', 'money', 'Treasury'),
        feature('fx_revaluations', 'Revaluations', 'Run currency revaluations, calculate exchange gains/losses, and post journal entries.', 'calculator', 'Treasury'),
        feature('fx_exposure_analytics', 'FX Exposure Analytics', 'Analyze currency exposure across companies, branches, and departments.', 'chart', 'Analytics'),
      ],
    },
    {
      label: 'Reporting & Compliance',
      icon: 'file',
      features: [
        feature('fx_gain_loss_report', 'Exchange Gain/Loss Report', 'Generate realized and unrealized exchange gain/loss reports for accounting.', 'chart', 'Reports'),
        feature('fx_treasury_report', 'Treasury Report', 'Comprehensive treasury reports including cash holdings, bank accounts, and FX contracts.', 'file', 'Reports'),
        feature('fx_audit_trail', 'Audit Trail', 'Track all currency and exchange rate changes with complete audit logs.', 'shield', 'Compliance'),
      ],
    },
  ],
  crm: [
    {
      label: 'Relationship Management',
      icon: 'users',
      features: [
        feature('crm_overview', 'CRM Dashboard', 'Command center for sales pipeline, leads, deals, and customer insights.', 'chart', 'Management'),
        feature('crm_customers', 'Customer Directory', 'Maintain detailed customer profiles, history, and contact logs.', 'users', 'Parties'),
        feature('crm_leads', 'Sales Leads', 'Manage sales leads, qualification, conversion, and follow-up.', 'user-plus', 'Sales'),
        feature('crm_contacts', 'Contact Directory', 'Centralized contact book linked to customers, leads, and deals.', 'address-book', 'Parties'),
        feature('crm_deals', 'Deals Pipeline', 'Track deals through pipeline stages from lead to close.', 'handshake', 'Sales'),
      ],
    },
    {
      label: 'Engagement',
      icon: 'calendar-check',
      features: [
        feature('crm_activities', 'Activities', 'Log calls, emails, meetings, and tasks against CRM records.', 'calendar-check', 'Engagement'),
        feature('crm_campaigns', 'Campaigns', 'Plan and track marketing campaigns, budgets, and ROI.', 'bullhorn', 'Marketing'),
        feature('crm_tasks', 'Tasks', 'Assign and track CRM-related tasks and reminders.', 'tasks', 'Engagement'),
      ],
    },
    {
      label: 'Intelligence',
      icon: 'chart-bar',
      features: [
        feature('crm_reports', 'Reports & Analytics', 'Pipeline funnel, conversion rates, activity stats, and revenue reports.', 'chart-bar', 'Reporting'),
      ],
    },
  ],
  drawing: [
    {
      label: 'Drawing Overview',
      icon: 'gauge',
      features: [
        feature('drawing_overview', 'Dashboard', 'Overview of drawing assets, storage, templates, and active collaborations.', 'gauge', 'Overview'),
        feature('drawing_my_drawings', 'My Drawings', 'Create and edit private vector sketches and illustrations.', 'palette', 'Drawings'),
        feature('drawing_shared', 'Shared Drawings', 'Collaborate on design workspaces shared with your team.', 'users', 'Drawings'),
      ],
    },
    {
      label: 'Drawing Modes',
      icon: 'layer-group',
      features: [
        feature('drawing_whiteboards', 'Whiteboards', 'Infinite digital brainstorming canvas with sticky notes and freehand tools.', 'circle', 'Modes'),
        feature('drawing_flowcharts', 'Flowcharts', 'Build system process flows, connections, and custom arrow shapes.', 'route', 'Modes'),
        feature('drawing_wireframes', 'Wireframes', 'Create low-fidelity UI mockups and client landing pages.', 'crop', 'Modes'),
        feature('drawing_network', 'Network Diagrams', 'Design server infrastructure topologies and firewall networks.', 'network-wired', 'Modes'),
        feature('drawing_ui_mockups', 'UI Mockups', 'High-fidelity component variants, auto layouts, and design prototypes.', 'window-maximize', 'Modes'),
      ],
    },
    {
      label: 'Assets & Admin',
      icon: 'folder-open',
      features: [
        feature('drawing_assets', 'Assets Manager', 'Upload and organize PNG, JPG, custom SVG vectors, and typography.', 'folder-open', 'Assets'),
        feature('drawing_brand_kit', 'Brand Kit', 'Store company logos, primary theme color tokens, and style guidelines.', 'id-card', 'Assets'),
        feature('drawing_archive', 'Archive Center', 'Archived drawings database and version control restores.', 'archive', 'Maintenance'),
      ],
    },
  ],
  ems: [
    {
      label: 'Education Dashboard',
      icon: 'gauge',
      features: [
        feature('ems_overview', 'EMS Dashboard', 'Central education management command center with KPIs, analytics, and AI insights.', 'gauge', 'Dashboard'),
        feature('ems_analytics', 'Analytics', 'Advanced education analytics with charts, trends, and performance metrics.', 'chart', 'Analytics'),
        feature('ems_ai_assistant', 'AI Education Assistant', 'AI-powered insights for student performance, attendance risk, and academic recommendations.', 'robot', 'Intelligence'),
        feature('ems_reports', 'Reports', 'Generate comprehensive education reports, transcripts, and analytics.', 'file', 'Reporting'),
        feature('ems_settings', 'EMS Settings', 'Configure education system preferences, grading, attendance rules, and academic policies.', 'cog', 'Configuration'),
      ],
    },
    {
      label: 'Institution Management',
      icon: 'building',
      features: [
        feature('ems_institution_dashboard', 'Institution Dashboard', 'Overview of all institutions, campuses, departments and academic structure.', 'gauge', 'Management'),
        feature('ems_institutions', 'Institutions', 'Manage multi-institution, multi-campus educational organizations.', 'building', 'Management'),
        feature('ems_campuses', 'Campuses', 'Manage unlimited campuses, branches, and facilities.', 'location', 'Management'),
        feature('ems_departments', 'Departments', 'Organize academic and administrative departments.', 'sitemap', 'Management'),
        feature('ems_programs', 'Programs', 'Manage academic programs, degrees, and certifications.', 'book', 'Management'),
        feature('ems_academic_years', 'Academic Years', 'Configure academic years, semesters, and terms.', 'calendar', 'Management'),
        feature('ems_semesters', 'Semesters', 'Manage semester schedules, registration periods, and sessions.', 'calendar', 'Management'),
        feature('ems_buildings', 'Buildings', 'Manage campus buildings, classrooms, laboratories, and facilities.', 'building', 'Management'),
        feature('ems_rooms', 'Rooms', 'Manage rooms, seating capacity, and resource allocation.', 'door', 'Management'),
      ],
    },
    {
      label: 'Student Information System',
      icon: 'users',
      features: [
        feature('ems_student_dashboard', 'Student Dashboard', 'Complete student lifecycle management from admission to alumni.', 'gauge', 'SIS'),
        feature('ems_students', 'All Students', 'Manage student records, profiles, and academic history.', 'users', 'SIS'),
        feature('ems_student_profile', 'Student Profile', '360-degree student view with academics, attendance, fees, and more.', 'user', 'SIS'),
        feature('ems_parents', 'Parents & Guardians', 'Manage parent/guardian information and portal access.', 'users', 'SIS'),
        feature('ems_communication', 'Communication', 'Send emails, SMS, and notifications to students and parents.', 'comments', 'SIS'),
      ],
    },
    {
      label: 'Admissions Management',
      icon: 'clipboard',
      features: [
        feature('ems_admission_dashboard', 'Admission Dashboard', 'Track applications, enrollment, and admission lifecycle.', 'gauge', 'Admissions'),
        feature('ems_admissions', 'Admissions', 'Manage applications, document verification, and enrollment workflow.', 'clipboard', 'Admissions'),
      ],
    },
    {
      label: 'Staff & Faculty',
      icon: 'user-tie',
      features: [
        feature('ems_staff_dashboard', 'Staff Dashboard', 'Manage teachers, employees, and workforce analytics.', 'gauge', 'Staff'),
        feature('ems_teachers', 'Teachers', 'Manage teacher profiles, assignments, workload, and performance.', 'chalkboard', 'Staff'),
        feature('ems_employees', 'Employees', 'Manage non-teaching staff, contracts, and attendance.', 'users', 'Staff'),
      ],
    },
    {
      label: 'Academic Structure',
      icon: 'layer-group',
      features: [
        feature('ems_academic_dashboard', 'Academic Dashboard', 'Academic hierarchy, curriculum, and course management.', 'gauge', 'Academic'),
        feature('ems_classes', 'Classes & Sections', 'Manage classes, sections, batches, and student enrollment.', 'layer-group', 'Academic'),
        feature('ems_subjects', 'Subjects', 'Manage subjects, course mapping, and teacher assignments.', 'book', 'Academic'),
        feature('ems_courses', 'Courses', 'Manage courses, curriculum, syllabus, and learning outcomes.', 'book-open', 'Academic'),
      ],
    },
    {
      label: 'Attendance',
      icon: 'check-circle',
      features: [
        feature('ems_attendance_dashboard', 'Attendance Dashboard', 'Real-time attendance tracking and analytics.', 'gauge', 'Attendance'),
        feature('ems_attendance', 'Attendance Records', 'Mark and manage student, teacher, and employee attendance.', 'check-circle', 'Attendance'),
      ],
    },
    {
      label: 'Timetable & Scheduling',
      icon: 'calendar-alt',
      features: [
        feature('ems_timetable_dashboard', 'Timetable Dashboard', 'Class scheduling, resource booking, and conflict management.', 'gauge', 'Timetable'),
        feature('ems_timetables', 'Timetables', 'Create and manage master timetables, teacher schedules, and room bookings.', 'calendar-alt', 'Timetable'),
        feature('ems_events', 'Events', 'Manage academic events, holidays, and important dates.', 'calendar', 'Timetable'),
      ],
    },
    {
      label: 'Assignments & Coursework',
      icon: 'tasks',
      features: [
        feature('ems_assignment_dashboard', 'Assignment Dashboard', 'Track assignments, submissions, grading, and deadlines.', 'gauge', 'Assignments'),
        feature('ems_assignments', 'Assignments', 'Create, distribute, and grade assignments with rubrics and AI assistance.', 'tasks', 'Assignments'),
      ],
    },
    {
      label: 'Examinations',
      icon: 'file-alt',
      features: [
        feature('ems_exam_dashboard', 'Exam Dashboard', 'Manage examinations, question banks, and result processing.', 'gauge', 'Exams'),
        feature('ems_examinations', 'Examinations', 'Create exams, manage question papers, conduct online/offline exams.', 'file-alt', 'Exams'),
        feature('ems_grades', 'Grades & Results', 'Grade management, report cards, transcripts, and certificates.', 'chart', 'Exams'),
        feature('ems_certificates', 'Certificates', 'Generate and manage certificates, diplomas, and transcripts.', 'certificate', 'Exams'),
      ],
    },
    {
      label: 'Learning Management (LMS)',
      icon: 'graduation-cap',
      features: [
        feature('ems_lms_dashboard', 'LMS Dashboard', 'Digital learning platform with courses, lessons, and assessments.', 'gauge', 'LMS'),
        feature('ems_courses_lms', 'Courses & Lessons', 'Create and manage online courses, lessons, quizzes, and learning paths.', 'graduation-cap', 'LMS'),
      ],
    },
    {
      label: 'Library',
      icon: 'book',
      features: [
        feature('ems_library_dashboard', 'Library Dashboard', 'Manage physical and digital library resources.', 'gauge', 'Library'),
        feature('ems_library', 'Library Catalog', 'Book catalog, issue/return, reservations, and digital resources.', 'book', 'Library'),
      ],
    },
    {
      label: 'Transport',
      icon: 'bus',
      features: [
        feature('ems_transport_dashboard', 'Transport Dashboard', 'Fleet management, route planning, and GPS tracking.', 'gauge', 'Transport'),
        feature('ems_transport', 'Transport Management', 'Manage vehicles, drivers, routes, and student transport.', 'bus', 'Transport'),
      ],
    },
    {
      label: 'Hostel & Accommodation',
      icon: 'bed',
      features: [
        feature('ems_hostel_dashboard', 'Hostel Dashboard', 'Residential management with room allocation and occupancy tracking.', 'gauge', 'Hostel'),
        feature('ems_hostel', 'Hostel Management', 'Manage hostels, rooms, beds, check-in/check-out, and visitor logs.', 'bed', 'Hostel'),
      ],
    },
    {
      label: 'Medical & Health',
      icon: 'heartbeat',
      features: [
        feature('ems_medical_dashboard', 'Medical Dashboard', 'Campus health center with patient records and appointments.', 'gauge', 'Medical'),
        feature('ems_medical', 'Medical Center', 'Manage patients, appointments, pharmacy, and health records.', 'heartbeat', 'Medical'),
      ],
    },
    {
      label: 'Alumni & Career Services',
      icon: 'user-graduate',
      features: [
        feature('ems_alumni_dashboard', 'Alumni Dashboard', 'Alumni engagement, mentorship, and career services.', 'gauge', 'Alumni'),
        feature('ems_alumni', 'Alumni Directory', 'Manage alumni records, networking, jobs, and donations.', 'user-graduate', 'Alumni'),
      ],
    },
    {
      label: 'Research & Innovation',
      icon: 'flask',
      features: [
        feature('ems_research_dashboard', 'Research Dashboard', 'Research projects, publications, patents, and grants.', 'gauge', 'Research'),
        feature('ems_research', 'Research Management', 'Manage research projects, publications, patents, and collaborations.', 'flask', 'Research'),
      ],
    },
    {
      label: 'Campus & Facilities',
      icon: 'building',
      features: [
        feature('ems_campus_dashboard', 'Campus Dashboard', 'Smart campus management with facility booking and IoT.', 'gauge', 'Campus'),
        feature('ems_campus_facilities', 'Facilities', 'Manage facilities, room booking, maintenance, and assets.', 'building', 'Campus'),
      ],
    },
    {
      label: 'Security & Safety',
      icon: 'shield-alt',
      features: [
        feature('ems_security_dashboard', 'Security Dashboard', 'Campus security, incident management, and compliance.', 'gauge', 'Security'),
        feature('ems_security', 'Security Center', 'Manage security personnel, incidents, access control, and emergencies.', 'shield-alt', 'Security'),
      ],
    },
    {
      label: 'Fees & Finance',
      icon: 'wallet',
      features: [
        feature('ems_fees_dashboard', 'Fees Dashboard', 'Fee collection, scholarships, and financial analytics.', 'gauge', 'Finance'),
        feature('ems_fees', 'Fee Management', 'Manage fee structures, collections, installments, and scholarships.', 'wallet', 'Finance'),
      ],
    },
  ],
};

export const flattenFeatures = (system) => (FEATURE_REGISTRY[system] || []).flatMap((group) => group.features);

export const getFeatureById = (system, id) => flattenFeatures(system).find((item) => item.id === id) || null;

export const getFeatureGroups = (system) => FEATURE_REGISTRY[system] || [];

export const getAllFeatures = () => Object.entries(FEATURE_REGISTRY).flatMap(([system, groups]) =>
  groups.flatMap((group) => group.features.map((item) => ({ ...item, system, group: group.label })))
);
