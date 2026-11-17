import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, $r as faFileWord, $t as faCheckCircle, Al as client, Ar as faFileAlt, Bs as faStar, Cn as faClock, Cr as faExclamationTriangle, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Fr as faFileCircleXmark, G as faArrowUp, Hc as faUserGear, I as faArrowRight, Il as BarElement, Jo as faRocket, M as faArrowDown, Mr as faFileArrowDown, Nr as faFileCircleCheck, Nt as faCalendarAlt, Ol as apiRequest, Pl as ArcElement, Pt as faCalendarCheck, Rc as faUserCheck, Rl as CategoryScale, Ul as LinearScale, Vr as faFileImage, W as faArrowTrendUp, Xt as faChartPie, Yo as faRotate, Yt as faChartLine, Zn as faDatabase, Zr as faFileUpload, _c as faTrash, _l as faXmark, ao as faPause, bl as useApp, bn as faClipboard, ci as faFolder, cn as faCircleDollarToSlot, da as faLayerGroup, f as Bar, fr as faEdit, gi as faGaugeHigh, gs as faShieldHalved, h as Pie, ht as faBox, ii as faFlag, in as faChevronRight, ir as faDollarSign, jo as faProjectDiagram, kn as faCloudArrowUp, lc as faTimeline, li as faFolderOpen, ll as faWallet, nc as faTasks, os as faSearch, rn as faChevronLeft, ru as require_react, sn as faCircleCheck, ti as faFilter, tl as faUsers, tu as plugin_tooltip, vl as FontAwesomeIcon, wo as faPlay, xc as faTriangleExclamation, zc as faUserClock, zl as Chart, zr as faFileExcel } from "./ai-BHgPkVLC.js";
import { Cr as StatCard, G as getIcon, Xr as readFeatureRecords, wr as StatusBadge } from "./fms-BQz62Xux.js";
//#region src/data/featureRegistry.js
var feature = (id, label, description, icon = "cubes", category = "Operations") => ({
	id,
	label,
	description,
	icon,
	category
});
var FEATURE_REGISTRY = {
	pms: [
		{
			label: "Planning & Calendar",
			icon: "calendar",
			features: [
				feature("pms_calendar", "Calendar", "Plan project events, delivery dates, reviews, and reminders.", "calendar", "Planning"),
				feature("pms_project_reports", "Project Reports", "Create structured project status and executive reports.", "chart", "Reporting"),
				feature("pms_documentation", "Project Documentation", "Maintain project documents, reference notes, approvals, and attachments.", "file", "Documentation")
			]
		},
		{
			label: "Cost, Budget & Progress",
			icon: "chart",
			features: [
				feature("pms_cost_tracking", "Project Cost Tracking", "Track estimated, committed, and actual project cost.", "chart", "Financial Control"),
				feature("pms_budget_tracking", "Project Budget Tracking", "Monitor budget utilization, remaining allowance, and variance.", "database", "Financial Control"),
				feature("pms_progress_tracking", "Project Progress Tracking", "Capture planned progress, actual progress, blockers, and actions.", "tasks", "Delivery Control"),
				feature("pms_resource_allocation", "Resource Allocation", "Assign team capacity, workload, responsibility, and dates.", "users", "Resources")
			]
		},
		{
			label: "Agile Workspace",
			icon: "tasks",
			features: [
				feature("pms_sprint_management", "Sprint Management", "Plan sprints, sprint goals, committed work, and completion status.", "clock", "Agile"),
				feature("pms_agile_scrum", "Agile & Scrum Support", "Track ceremonies, scrum notes, velocity, and impediments.", "cubes", "Agile"),
				feature("pms_backlog_management", "Backlog Management", "Prioritize backlog items, owners, acceptance notes, and releases.", "clipboard", "Agile"),
				feature("pms_risk_tracking", "Risk Tracking", "Record risk severity, mitigation plan, owner, and due date.", "risk", "Governance")
			]
		},
		{
			label: "Recovery & Controls",
			icon: "database",
			features: [feature("pms_data_backup", "Data Backup & Recovery", "Export, restore, and protect PMS operational records.", "database", "Controls")]
		}
	],
	hrms: [
		{
			label: "Employee Records",
			icon: "users",
			features: [
				feature("employee-profile", "Employee Profile", "Manage detailed employee records, education, and experience.", "id", "Employee Records"),
				feature("hrms_bank", "Bank Details", "Maintain employee bank, account, and payroll payment information.", "building", "Employee Records"),
				feature("hrms_emergency", "Emergency Contacts", "Record emergency contacts, relationship, mobile, and notes.", "id", "Employee Records"),
				feature("hrms_hierarchy", "Reporting Hierarchy", "Define reporting managers, escalation chain, and approvals.", "network", "Employee Records"),
				feature("hrms_import", "CSV Import", "Stage CSV import batches and import validation results.", "csv", "Data Management")
			]
		},
		{
			label: "Attendance Management",
			icon: "calendar",
			features: [
				feature("hrms_gps_attendance", "GPS Attendance", "Track GPS verified attendance requests and coordinates.", "location", "Attendance"),
				feature("hrms_selfie_attendance", "Selfie Attendance", "Capture selfie verification, review status, and approval notes.", "camera", "Attendance"),
				feature("hrms_qr_attendance", "QR Attendance", "Manage QR based attendance scans and site verification.", "qr", "Attendance"),
				feature("hrms_site_attendance", "Site Attendance", "Manage site-based check-in/check-out records.", "building", "Attendance"),
				feature("hrms_supervisor_attendance", "Supervisor Attendance", "Review supervisor attendance approvals and corrections.", "check", "Attendance"),
				feature("hrms_manual_attendance", "Manual Attendance Request", "Submit and approve manual attendance adjustment requests.", "signature", "Attendance"),
				feature("hrms_punch_correction", "Missing Punch Correction", "Correct missing punch entries with reason and workflow status.", "edit", "Attendance"),
				feature("hrms_red_zone", "Red Zone Attendance Reports", "Track missing entries, late punches, and red-zone attendance risks.", "risk", "Attendance")
			]
		},
		{
			label: "Sites, Branches & Shifts",
			icon: "location",
			features: [
				feature("hrms_sites", "Sites / Branches / Locations", "Maintain site, branch, address, and responsible person data.", "location", "Site Management"),
				feature("hrms_site_radius", "Site GPS Radius", "Configure site radius, allowed distance, and GPS rules.", "circle", "Site Management"),
				feature("hrms_geofencing", "Geo-fencing", "Maintain virtual boundaries and geofence compliance records.", "network", "Site Management"),
				feature("hrms_site_assignment", "Site Assignment", "Assign employees to locations, projects, and duty periods.", "userPlus", "Site Management"),
				feature("hrms_outdoor_duty", "Client / Outdoor Duty Location", "Record client visits, outdoor duty locations, and approvals.", "walk", "Site Management"),
				feature("hrms_site_qr", "QR Code per Site", "Create and control QR codes linked with each site.", "qr", "Site Management"),
				feature("hrms_sites_mgmt", "Sites Management", "Manage enterprise locations, geofencing, and site data.", "location", "Configuration"),
				feature("hrms_shifts_mgmt", "Shifts Management", "Configure work schedules, grace periods, and break rules.", "clock", "Configuration"),
				feature("hrms_payroll_setup", "Payroll Configuration", "Define salary components, structures, and tax rules.", "wallet", "Configuration"),
				feature("hrms_payroll_dashboard", "Payroll Management", "Process monthly payroll, generate payslips, and LWP.", "fileInvoiceDollar", "Operations"),
				feature("hrms_assets", "Asset Issuance", "Track company equipment (Laptops, SIMs) issued to staff.", "laptop", "Operations"),
				feature("hrms_shifts", "Shift Management", "Create shift schedules, rosters, tolerance, and break rules.", "clock", "Scheduling")
			]
		},
		{
			label: "Performance & Talent",
			icon: "star",
			features: [
				feature("hrms_performance", "Performance Portal", "Track goals, OKRs, and professional growth.", "star", "Performance"),
				feature("hrms_onboarding", "Onboarding Portal", "Manage new hire checklists and integration.", "user-plus", "Performance"),
				feature("hrms_kpis", "KPI Monitoring", "Manage Key Performance Indicators and targets.", "chart", "Performance"),
				feature("hrms_reviews", "Performance Reviews", "Manage employee appraisals and feedback cycles.", "check", "Performance"),
				feature("hrms_goals", "Goal & OKR Tracking", "Set and monitor individual and team goals.", "bullseye", "Performance")
			]
		},
		{
			label: "Leave & Communications",
			icon: "umbrella",
			features: [feature("hrms_my_leave_balance", "My Leave Balance", "Review annual leave entitlements, utilized leaves, and allocation rules.", "umbrella", "Leaves"), feature("hrms_notification_inbox", "Notification Inbox", "View system notifications, approval workflows, alerts, and settings.", "bell", "Communications")]
		}
	],
	fms: [
		{
			label: "Expenses & Claims",
			icon: "file",
			features: [
				feature("fms_expense_reimbursement", "Expense Reimbursement", "Submit, review, and approve expense reimbursement claims.", "file", "Expenses"),
				feature("fms_receipt_upload", "Receipt Upload", "Upload receipt references and reimbursement proof records.", "file", "Expenses"),
				feature("fms_expense_categories", "Expense Categories", "Maintain expense categories, limits, and accounting mapping.", "cubes", "Expenses"),
				feature("fms_employee_reimbursements", "Employee Reimbursements", "Track employee payable claims and settlement status.", "users", "Expenses"),
				feature("fms_expense_claims", "Expense Claims", "Manage expense claim workflow, attachments, and approvals.", "signature", "Expenses")
			]
		},
		{
			label: "Core Accounting",
			icon: "building",
			features: [
				feature("erp_settings", "Accounting Settings", "Configure base currencies, fiscal years, tax methods, journal rules, and compliance parameters.", "cog", "Configuration"),
				feature("erp_fiscal_years", "Fiscal Years & Periods", "Manage fiscal year definitions, accounting periods, open/close status, and lock rules.", "calendar", "Configuration"),
				feature("erp_account_types", "Account Types", "Define asset, liability, equity, revenue, expense, and COGS account classifications.", "tags", "Configuration"),
				feature("erp_account_groups", "Account Groups", "Organize accounts into parent-child group hierarchies for structured financial reporting.", "sitemap", "Configuration"),
				feature("erp_chart_of_accounts", "Chart of Accounts", "Manage the full GL account registry with codes, names, types, currencies, and opening balances.", "calculator", "Configuration"),
				feature("erp_opening_balances", "Opening Balances", "Set and manage opening balance entries for all GL accounts at fiscal year start.", "coins", "Configuration")
			]
		},
		{
			label: "Sales, Billing & Invoicing",
			icon: "chart",
			features: [
				feature("fms_invoice_management", "Invoice Management", "Create invoice records, due dates, status, and payment follow-up.", "file", "Billing"),
				feature("fms_recurring_invoices", "Recurring Invoices", "Plan recurring invoice schedules and billing cycles.", "clock", "Billing"),
				feature("fms_quotation_management", "Quotation Management", "Prepare quotations, validity, approvals, and conversion status.", "clipboard", "Billing"),
				feature("fms_purchase_orders", "Purchase Orders", "Track PO records, suppliers, amounts, and delivery status.", "file", "Procurement"),
				feature("fms_sales_orders", "Sales Orders", "Track sales order records, customers, amount, and status.", "chart", "Sales"),
				feature("fms_credit_notes", "Credit Notes", "Issue and track credit notes with linked invoices.", "file", "Billing"),
				feature("fms_debit_notes", "Debit Notes", "Issue and track debit notes with reason and amount.", "file", "Billing"),
				feature("fms_online_payments", "Online Payments", "Record payment links, providers, transaction status, and reconciliation.", "database", "Billing"),
				feature("fms_subscription_billing", "Subscription Billing", "Manage subscription plans, renewals, billing cycles, and status.", "clock", "Billing"),
				feature("fms_recurring_billing", "Recurring Billing", "Maintain recurring billing rules and reminders.", "clock", "Billing"),
				feature("fms_client_billing_portal", "Client Billing Portal", "Manage client-facing billing records and portal status.", "users", "Client Portal")
			]
		},
		{
			label: "Parties & Portal",
			icon: "users",
			features: [
				feature("fms_vendor_management", "Vendor Management", "Maintain vendor records, contracts, balances, and notes.", "users", "Parties"),
				feature("fms_supplier_management", "Supplier Management", "Track suppliers, terms, orders, and payable status.", "users", "Parties"),
				feature("fms_customer_management", "Customer Management", "Maintain customer records, balances, and communication notes.", "users", "Parties"),
				feature("fms_client_portal", "Client Portal", "Control client portal records, access status, and documentation.", "users", "Portal")
			]
		},
		{
			label: "Purchases & AP",
			icon: "receipt",
			features: [
				feature("erp_vendors", "Vendors Management", "Enlist and manage centralized vendor directory, profile tabs, and AI analytics.", "users", "AP"),
				feature("erp_vendor_bills", "Vendor Bills", "Track, review, and match purchase vendor bills and approvals.", "file-invoice", "AP"),
				feature("erp_vendor_payments", "Vendor Payments", "Process maker-checker settlements, bank releases, and payment register logs.", "coins", "AP")
			]
		},
		{
			label: "Budgeting & Cost Centers",
			icon: "scale-balanced",
			features: [
				feature("erp_cost_centers", "Cost Centers", "Allocate, monitor, and control expenses and budgets across profit centers.", "sitemap", "Budgeting"),
				feature("erp_analytic_accounts", "Analytic Accounts", "Independent dimension tracking for projects, departments, and activities.", "calculator", "Budgeting"),
				feature("erp_budget_plans", "Budget Plans", "Define quarterly and annual OPEX/CAPEX budget scenarios and revisions.", "file-invoice-dollar", "Budgeting"),
				feature("erp_budget_vs_actual", "Budget vs Actual", "Compare planned targets with actual GL postings in real-time.", "chart-line", "Budgeting"),
				feature("erp_budget_alerts", "Budget Alerts", "Trigger warnings and Slack/Teams webhooks on budget thresholds.", "bell", "Budgeting")
			]
		},
		{
			label: "Fixed Assets",
			icon: "building",
			features: [
				feature("erp_fixed_assets", "Fixed Asset Register", "Manage acquisition, capitalization, depreciation, and audits.", "building", "Fixed Assets"),
				feature("erp_asset_categories", "Asset Categories", "Classify assets with predefined depreciation and GL templates.", "folder", "Fixed Assets"),
				feature("erp_asset_locations", "Asset Locations", "Physical tracking directory, warehouse plants, and capacity limits.", "location-dot", "Fixed Assets"),
				feature("erp_asset_depreciation", "Asset Depreciation", "Process period-close depreciation rules and GL posting entries.", "percent", "Fixed Assets"),
				feature("erp_asset_disposals", "Asset Disposals", "Manage write-offs, scrapping, and disposal sales gain/loss.", "trash-can", "Fixed Assets"),
				feature("erp_asset_book_value_report", "Book Value Report", "Analyze NBV calculations, salvage projections, and IFRS reports.", "file-invoice-dollar", "Fixed Assets")
			]
		},
		{
			label: "Payroll & Tax",
			icon: "database",
			features: [
				feature("fms_payroll_management", "Payroll Management", "Control payroll periods, review status, and payroll totals.", "users", "Payroll"),
				feature("fms_salary_processing", "Salary Processing", "Process salary batches, approvals, and payment readiness.", "check", "Payroll"),
				feature("fms_payslip_generation", "Payslip Generation", "Generate payslip records and export readiness status.", "file", "Payroll"),
				feature("fms_tax_calculations", "Tax Calculations", "Track tax basis, rates, and calculation notes.", "database", "Tax"),
				feature("fms_tax_management", "Tax Management", "Manage tax filing records, status, and compliance notes.", "shield", "Tax"),
				feature("fms_vat_gst_support", "VAT/GST Support", "Maintain VAT/GST records, return cycles, and tax status.", "database", "Tax"),
				feature("fms_withholding_tax", "Withholding Tax", "Track withholding tax certificates, rates, and payment status.", "shield", "Tax"),
				feature("fms_overtime_calculations", "Overtime Calculations", "Track overtime hours, rates, approvals, and calculated values.", "clock", "Payroll"),
				feature("fms_commission_management", "Commission Management", "Manage commission schemes, amounts, and approvals.", "chart", "Payroll")
			]
		},
		{
			label: "Approvals & Workflow",
			icon: "check",
			features: [
				feature("fms_scheduled_payments", "Scheduled Payments", "Plan payment dates, amounts, reminders, and status.", "calendar", "Payments"),
				feature("fms_financial_approval_workflow", "Financial Approval Workflow", "Control financial approvals, chains, and audit decisions.", "check", "Workflow"),
				feature("fms_budget_approval_workflow", "Budget Approval Workflow", "Approve budgets, revisions, and department requests.", "check", "Workflow"),
				feature("fms_approval_chains", "Approval Chains", "Define multi-step approval routing and responsible users.", "network", "Workflow"),
				feature("fms_workflow_automation", "Workflow Automation", "Configure automation records and workflow execution notes.", "cubes", "Workflow"),
				feature("fms_smart_notifications", "Smart Notifications", "Control financial reminders, alerts, and notification status.", "bell", "Workflow"),
				feature("fms_reminder_system", "Reminder System", "Create financial reminders with due dates and ownership.", "calendar", "Workflow")
			]
		},
		{
			label: "Budgeting, Cost & Projects",
			icon: "chart",
			features: [
				feature("fms_budget_tracking", "Budget Tracking", "Track budget allocation, utilization, and variance.", "database", "Budget"),
				feature("fms_department_budgeting", "Department Wise Budgeting", "Maintain department-level budgets and approvals.", "sitemap", "Budget"),
				feature("fms_cost_center_management", "Cost Center Management", "Maintain cost centers, budgets, and allocations.", "sitemap", "Budget"),
				feature("fms_profit_center_management", "Profit Center Management", "Maintain profit centers, targets, and performance records.", "chart", "Budget"),
				feature("fms_project_cost_tracking", "Project Cost Tracking", "Track project costs, commitments, and actuals.", "chart", "Project Finance"),
				feature("fms_project_budget_tracking", "Project Budget Tracking", "Track project budgets, variance, and approvals.", "database", "Project Finance"),
				feature("fms_time_billing", "Time Billing", "Track billable time, rates, and client invoicing readiness.", "clock", "Project Finance"),
				feature("fms_resource_cost_management", "Resource Cost Management", "Control resource rates, allocation, and cost impact.", "users", "Project Finance"),
				feature("fms_contractor_payments", "Contractor Payments", "Track contractor invoices, approvals, and payment status.", "users", "Project Finance")
			]
		},
		{
			label: "Inventory, Assets & Funding",
			icon: "building",
			features: [
				feature("fms_inventory_accounting", "Inventory Accounting", "Track inventory accounting records and valuation status.", "cubes", "Inventory"),
				feature("fms_stock_valuation", "Stock Valuation", "Track stock valuation records and costing basis.", "database", "Inventory"),
				feature("fms_inventory_cost_tracking", "Inventory Cost Tracking", "Track inventory-related cost entries and variance.", "chart", "Inventory"),
				feature("fms_warehouse_financial_tracking", "Warehouse Financial Tracking", "Maintain warehouse cost and financial performance records.", "building", "Inventory"),
				feature("fms_asset_tracking", "Asset Tracking", "Track asset financial records, value, and status.", "building", "Assets"),
				feature("fms_investment_tracking", "Investment Tracking", "Track investment records, maturity, returns, and risk notes.", "chart", "Funding"),
				feature("fms_loan_management", "Loan Management", "Track loans, balances, repayment plans, and status.", "database", "Funding"),
				feature("fms_emi_tracking", "EMI Tracking", "Track EMI schedules, paid amount, due dates, and remaining balance.", "clock", "Funding"),
				feature("fms_treasury_management", "Treasury Management", "Track treasury positions, reserves, and cash planning.", "database", "Treasury"),
				feature("fms_cash_reserve_tracking", "Cash Reserve Tracking", "Track reserve balances, thresholds, and movement notes.", "database", "Treasury")
			]
		},
		{
			label: "Reports, Exports & Intelligence",
			icon: "chart",
			features: [
				feature("fms_excel_import_export", "Excel Import/Export", "Stage Excel import/export batches and validation status.", "csv", "Exports"),
				feature("fms_csv_import_export", "CSV Import/Export", "Stage CSV import/export batches and mapping notes.", "csv", "Exports"),
				feature("fms_pdf_export", "PDF Export", "Prepare printable PDF export registers and status.", "file", "Exports"),
				feature("fms_automated_reports", "Automated Reports", "Schedule reports, recipients, and delivery status.", "calendar", "Reporting"),
				feature("fms_custom_report_builder", "Custom Report Builder", "Build custom reports with filters, metrics, and output format.", "chart", "Reporting"),
				feature("fms_drill_down_reports", "Drill-Down Reports", "Track drill-down report definitions and review status.", "chart", "Reporting"),
				feature("fms_business_intelligence_reports", "Business Intelligence Reports", "Maintain BI report definitions, KPIs, and insights.", "chart", "Reporting"),
				feature("fms_executive_summary_reports", "Executive Summary Reports", "Prepare executive summary report records and delivery status.", "chart", "Reporting"),
				feature("fms_forecast_vs_actual_reports", "Forecast vs Actual Reports", "Track forecast vs actual analysis records and variance notes.", "chart", "Reporting"),
				feature("fms_kpi_monitoring", "KPI Monitoring", "Monitor finance KPIs, thresholds, owners, and actions.", "chart", "Analytics"),
				feature("fms_financial_goal_tracking", "Financial Goal Tracking", "Track financial goals, targets, actuals, and progress.", "chart", "Analytics"),
				feature("fms_dashboard_customization", "Dashboard Customization", "Configure dashboard cards, chart preferences, and layouts.", "cubes", "Analytics"),
				feature("fms_data_visualization_charts", "Data Visualization Charts", "Maintain finance visualization definitions and source notes.", "chart", "Analytics"),
				feature("fms_usage_analytics", "Usage Analytics", "Track usage metrics, module activity, and adoption insights.", "chart", "Analytics")
			]
		},
		{
			label: "Compliance, Security & Admin",
			icon: "shield",
			features: [
				feature("fms_data_backup", "Data Backup", "Export and protect finance data records.", "database", "Data Control"),
				feature("fms_file_attachments", "File Attachments", "Track linked files, references, and attachment notes.", "file", "Data Control"),
				feature("fms_e_signature", "E-signature Support", "Record signature requests, signers, and completion status.", "signature", "Data Control"),
				feature("fms_saas_subscription_management", "SaaS Subscription Management", "Manage tenant subscriptions, plans, and billing status.", "clock", "SaaS"),
				feature("fms_tenant_management", "Tenant Management", "Control tenant finance settings and access status.", "building", "SaaS"),
				feature("fms_security_encryption", "Security & Encryption", "Track encryption settings, checks, and security actions.", "shield", "Security"),
				feature("fms_two_factor_authentication", "Two-Factor Authentication", "Control 2FA rollout, status, and exception notes.", "shield", "Security"),
				feature("fms_session_management", "Session Management", "Review user sessions, risk status, and expiry settings.", "clock", "Security"),
				feature("fms_ip_restrictions", "IP Restrictions", "Maintain allowed IP ranges and access control status.", "shield", "Security"),
				feature("fms_internal_notes", "Internal Notes", "Maintain secure finance notes and follow-up actions.", "clipboard", "Collaboration"),
				feature("fms_compliance_management", "Compliance Management", "Track compliance tasks, owners, evidence, and status.", "shield", "Compliance"),
				feature("fms_audit_compliance_reports", "Audit Compliance Reports", "Prepare audit compliance report records and evidence.", "file", "Compliance"),
				feature("fms_data_recovery_system", "Data Recovery System", "Track backup restore checks and recovery status.", "database", "Data Control"),
				feature("fms_financial_calendar", "Financial Calendar", "Track finance calendar events, deadlines, and status.", "calendar", "Calendar"),
				feature("fms_calendar_integration", "Calendar Integration", "Manage calendar sync records and reminders.", "calendar", "Calendar"),
				feature("fms_currency_exchange_tracking", "Currency Exchange Tracking", "Track currency exchange rates, dates, and impact notes.", "chart", "Treasury"),
				feature("fms_regional_accounting_standards", "Regional Accounting Standards", "Maintain regional standard mappings and compliance notes.", "shield", "Compliance"),
				feature("fms_risk_management", "Risk Management", "Track financial risks, likelihood, impact, and mitigation actions.", "risk", "Risk"),
				feature("fms_white_labeling", "White Labeling", "Control branded finance portal settings and status.", "palette", "Branding"),
				feature("fms_branding_customization", "Branding Customization", "Maintain branding, logo, theme, and tenant identity records.", "palette", "Branding"),
				feature("fms_mobile_responsive_design", "Mobile Responsive Design", "Track mobile UX checks and responsive improvements.", "cubes", "UX"),
				feature("fms_advanced_search", "Advanced Search", "Configure finance search filters and searchable fields.", "clipboard", "UX"),
				feature("fms_real_time_collaboration", "Real-Time Collaboration", "Track collaboration sessions, shared notes, and owners.", "users", "Collaboration"),
				feature("fms_refund_management", "Refund Management", "Manage refund requests, approvals, and settlement status.", "file", "Refunds"),
				feature("fms_refund_tracking", "Refund Tracking", "Track refund progress, customer, date, and amount.", "chart", "Refunds"),
				feature("fms_income_categories", "Income Categories", "Maintain income categories and chart-of-account mapping.", "cubes", "Configuration"),
				feature("fms_recurring_transactions", "Recurring Transactions", "Schedule recurring finance transactions and review dates.", "clock", "Automation")
			]
		},
		{
			label: "Banking & Cash",
			icon: "building-columns",
			features: [
				feature("erp_bank_cash_accounts", "Bank / Cash Accounts", "Manage enterprise bank accounts, cash accounts, petty cash, treasury accounts, and financial institutions.", "building-columns", "Banking"),
				feature("erp_bank_cash_vouchers", "Bank / Cash Vouchers", "Manage enterprise cash receipts, bank receipts, payments, contra entries, adjustments, and financial vouchers.", "file-lines", "Banking"),
				feature("erp_bank_transfers", "Transfers", "Manage enterprise internal fund transfers across banks, cash accounts, branches, companies, and treasury.", "arrow-right-arrow-left", "Banking"),
				feature("erp_bank_reconciliation", "Reconciliation", "Automatically reconcile bank statements with ERP transactions using intelligent matching.", "scale-balanced", "Banking")
			]
		},
		{
			label: "Transactions",
			icon: "file-lines",
			features: [feature("erp_journal_entries", "Journal Entries", "Record, approve, post, reverse, and audit enterprise financial transactions with General Ledger integration.", "file-lines", "Transactions")]
		},
		{
			label: "Tax & Compliance",
			icon: "scale-balanced",
			features: [
				feature("erp_tax_categories", "Tax Categories", "Configure enterprise tax classifications used throughout Accounting, Sales, Purchases, Inventory, Payroll, and Manufacturing.", "folder", "Tax"),
				feature("erp_tax_rates", "Tax Rates", "Configure and manage enterprise tax rates with effective date control and compliance validation.", "percent", "Tax"),
				feature("erp_tax_profiles", "Tax Profiles", "Configure enterprise tax identities, compliance settings, registrations, and exemptions across the ERP.", "users", "Tax"),
				feature("erp_sales_tax_report", "Sales Tax Report", "Prepare, analyze, reconcile and file enterprise Sales Tax Returns with complete Pakistan FBR compliance.", "file-invoice-dollar", "Tax"),
				feature("erp_withholding_tax_report", "Withholding Report", "Monitor, calculate, reconcile and file enterprise withholding taxes with complete Pakistan FBR compliance.", "file-contract", "Tax")
			]
		}
	],
	tms: [
		{
			label: "Reports & Analytics",
			icon: "chart",
			features: [
				feature("tms_productivity_reports", "Productivity Reports", "Analyze productivity records, owners, and improvement notes.", "chart", "Analytics"),
				feature("tms_task_completion_reports", "Task Completion Reports", "Track task completion summaries and reporting status.", "check", "Analytics"),
				feature("tms_team_performance_reports", "Team Performance Reports", "Analyze team output, performance, and blockers.", "users", "Analytics"),
				feature("tms_time_usage_analytics", "Time Usage Analytics", "Track time usage patterns, focus time, and allocation.", "clock", "Analytics"),
				feature("tms_custom_reports_builder", "Custom Reports Builder", "Create TMS reports with filters, fields, and export options.", "chart", "Reporting"),
				feature("tms_export_reports", "Export Reports (PDF/Excel/CSV)", "Prepare report exports and delivery status.", "csv", "Reporting"),
				feature("tms_productivity_insights", "Productivity Insights", "Capture productivity insights, recommended action, and owner.", "chart", "Analytics"),
				feature("tms_burndown_charts", "Burndown Charts", "Track burndown chart records, sprint scope, and remaining work.", "chart", "Agile"),
				feature("tms_forecasting_analytics", "Forecasting Analytics", "Track future workload forecasts, confidence, and notes.", "chart", "Analytics"),
				feature("tms_kpi_dashboards", "KPI Dashboards", "Monitor key performance indicators, targets, and actual performance.", "chart", "Analytics"),
				feature("tms_attendance_productivity_insights", "Attendance vs Productivity Insights", "Analyze correlation between attendance patterns and productivity output.", "users", "Analytics")
			]
		},
		{
			label: "Productivity Workspace",
			icon: "tasks",
			features: [
				feature("tms_smart_dashboard", "Smart Dashboard", "Configure smart dashboard records and productivity highlights.", "cubes", "Workspace"),
				feature("tms_personal_productivity_analytics", "Personal Productivity Analytics", "Track individual productivity metrics and insights.", "chart", "Workspace"),
				feature("tms_daily_planner", "Daily Planner", "Plan daily tasks, priorities, time blocks, and completion status.", "calendar", "Workspace"),
				feature("tms_focus_mode", "Focus Mode", "Create focus sessions, blockers, and completion notes.", "clock", "Workspace"),
				feature("tms_pomodoro_timer", "Pomodoro Timer", "Track pomodoro sessions, duration, and result status.", "clock", "Workspace"),
				feature("tms_workload_management", "Workload Management", "Balance workload, capacity, assignments, and overload risks.", "users", "Management"),
				feature("tms_employee_performance_tracking", "Employee Performance Tracking", "Track employee performance tasks, score, and coaching notes.", "users", "Management"),
				feature("tms_goal_okr_tracking", "Goal & OKR Tracking", "Maintain goals, OKRs, owners, and progress.", "check", "Management"),
				feature("tms_habit_tracking", "Habit Tracking", "Track habits, streaks, goals, and accountability notes.", "check", "Workspace"),
				feature("tms_quick_add_tasks", "Quick Add Tasks", "Quickly capture tasks, owners, priority, and due date.", "plus", "Workspace"),
				feature("tms_data_backup", "Data Backup & Recovery", "Export, restore, and protect TMS data records.", "database", "Controls")
			]
		},
		{
			label: "Collaboration & Management",
			icon: "users",
			features: [
				feature("tms_team_workspaces", "Team Workspaces", "Create and manage dedicated workspaces for different teams.", "users", "Collaboration"),
				feature("tms_team_mentions", "Team Mentions (@mentions)", "Collaborate using @mentions in tasks and comments.", "at", "Collaboration"),
				feature("tms_shared_task_boards", "Shared Task Boards", "Visualize work on shared boards with team-wide visibility.", "tasks", "Collaboration"),
				feature("tms_dept_task_mgmt", "Department-wise Task Management", "Organize and track tasks across different departments.", "building", "Management"),
				feature("tms_multi_user_assignment", "Multi-user Task Assignment", "Assign multiple team members to complex tasks.", "users", "Management"),
				feature("tms_approval_workflow", "Approval Workflow System", "Streamline task and milestone approvals with custom workflows.", "check", "Management"),
				feature("tms_client_collaboration", "Client Collaboration Portal", "Securely collaborate with external clients on project tasks.", "user-shield", "Collaboration")
			]
		}
	],
	dms: [
		{
			label: "Document Repository",
			icon: "file",
			features: [
				feature("dms_overview", "DMS Overview", "Monitor document archival, storage limits, and recent activity.", "chart", "Management"),
				feature("dms_documents", "All Documents", "Manage enterprise document library, versioning, and folders.", "file", "Documentation"),
				feature("dms_archival", "Archival System", "Configure document retention policies and archival rules.", "database", "Controls")
			]
		},
		{
			label: "Document Analytics",
			icon: "chart",
			features: [feature("dms_analytics", "Analytics Dashboard", "Comprehensive analytics on documents, approvals, signatures, and user activity.", "chart", "Analytics"), feature("dms_storage_analytics", "Storage Analytics", "Detailed storage usage, growth trends, file type distribution, and forecasts.", "database", "Analytics")]
		},
		{
			label: "AI & Intelligence",
			icon: "robot",
			features: [feature("dms_ai_intelligence", "AI Document Intelligence", "AI-powered document classification, OCR, metadata extraction, contract analysis, and summaries.", "robot", "Intelligence"), feature("dms_ai_assistant", "AI Assistant Chat", "Conversational AI assistant for document queries, recommendations, and insights.", "comments", "Intelligence")]
		},
		{
			label: "Collaboration",
			icon: "users",
			features: [
				feature("dms_collaboration", "Collaboration Center", "Comments, mentions, discussions, approvals, tasks, reviews, and team collaboration.", "users", "Collaboration"),
				feature("dms_approval_workflow", "Approval Workflow", "Multi-stage document approval pipeline with review cycles and analytics.", "check", "Workflow"),
				feature("dms_signature_center", "Signature Center", "Digital signature management with e-signature, multi-signer, and audit trails.", "pen", "Workflow")
			]
		},
		{
			label: "Security & Compliance",
			icon: "shield",
			features: [
				feature("dms_security_center", "Security Center", "Access control, role permissions, watermark protection, encryption, and IP restrictions.", "shield", "Security"),
				feature("dms_audit_logs", "Audit Logs", "Complete audit trail of all document activities with detailed tracking.", "history", "Compliance"),
				feature("dms_templates", "Document Templates", "Reusable document templates with customizable fields and categories.", "file", "Documentation")
			]
		},
		{
			label: "Document Tools",
			icon: "cubes",
			features: [feature("dms_document_viewer", "Document Viewer", "Built-in viewer for PDF, DOCX, XLSX, PPTX, images, and more with annotations.", "eye", "Tools"), feature("dms_document_scanner", "Document Scanner", "Scan physical documents directly into the DMS with OCR processing.", "camera", "Tools")]
		}
	],
	mfg: [
		{
			label: "Manufacturing Control Center",
			icon: "chart",
			features: [
				feature("mfg_overview", "MRP Dashboard", "Monitor production, material availability, work order execution, and machine monitoring.", "chart", "Management"),
				feature("mfg_bill_of_materials", "Bill of Materials", "Manage product structures, component lists, and manufacturing recipes.", "clipboard", "Production"),
				feature("mfg_production_orders", "Production Orders", "Plan, schedule, and manage manufacturing production orders.", "industry", "Production"),
				feature("mfg_work_orders", "Work Orders", "Manage shop floor execution, machine assignments, and work order tracking.", "tools", "Production")
			]
		},
		{
			label: "Production Planning",
			icon: "calendar",
			features: [
				feature("mfg_production_planning", "Production Planning", "Create and manage production schedules and capacity plans.", "calendar", "Planning"),
				feature("mfg_capacity_planning", "Capacity Planning", "Analyze machine and labor capacity for production planning.", "chart", "Planning"),
				feature("mfg_material_planning", "Material Requirement Planning", "Calculate material requirements based on production schedules.", "cubes", "Planning")
			]
		},
		{
			label: "Quality & Compliance",
			icon: "check",
			features: [feature("mfg_quality_inspection", "Quality Inspection", "Manage quality checks, inspection plans, and defect tracking.", "check", "Quality"), feature("mfg_quality_control", "Quality Control", "Track quality metrics, CPK, and compliance standards.", "shield", "Quality")]
		}
	],
	fx: [
		{
			label: "Multi-Currency Control Center",
			icon: "chart",
			features: [
				feature("fx_overview", "FX Dashboard", "Monitor exchange rates, currency exposure, FX transactions, and treasury performance.", "chart", "Management"),
				feature("fx_currencies", "Currencies", "Manage global currencies, symbols, precision, and exchange rate configurations.", "globe", "Treasury"),
				feature("fx_exchange_rates", "Exchange Rates", "Track and manage currency exchange rates with automatic updates and history.", "exchange", "Treasury")
			]
		},
		{
			label: "Treasury Operations",
			icon: "dollar",
			features: [
				feature("fx_transactions", "FX Transactions", "Process foreign exchange transactions, currency conversions, and international payments.", "money", "Treasury"),
				feature("fx_revaluations", "Revaluations", "Run currency revaluations, calculate exchange gains/losses, and post journal entries.", "calculator", "Treasury"),
				feature("fx_exposure_analytics", "FX Exposure Analytics", "Analyze currency exposure across companies, branches, and departments.", "chart", "Analytics")
			]
		},
		{
			label: "Reporting & Compliance",
			icon: "file",
			features: [
				feature("fx_gain_loss_report", "Exchange Gain/Loss Report", "Generate realized and unrealized exchange gain/loss reports for accounting.", "chart", "Reports"),
				feature("fx_treasury_report", "Treasury Report", "Comprehensive treasury reports including cash holdings, bank accounts, and FX contracts.", "file", "Reports"),
				feature("fx_audit_trail", "Audit Trail", "Track all currency and exchange rate changes with complete audit logs.", "shield", "Compliance")
			]
		}
	],
	crm: [{
		label: "Relationship Management",
		icon: "users",
		features: [
			feature("crm_overview", "CRM Overview", "Track sales pipeline, lead conversion, and customer health.", "chart", "Management"),
			feature("crm_customers", "Customer Directory", "Maintain detailed customer profiles, history, and contact logs.", "users", "Parties"),
			feature("crm_leads", "Lead Tracking", "Manage sales leads, opportunities, and follow-up activities.", "chart", "Sales")
		]
	}],
	drawing: [
		{
			label: "Drawing Overview",
			icon: "gauge",
			features: [
				feature("drawing_overview", "Dashboard", "Overview of drawing assets, storage, templates, and active collaborations.", "gauge", "Overview"),
				feature("drawing_my_drawings", "My Drawings", "Create and edit private vector sketches and illustrations.", "palette", "Drawings"),
				feature("drawing_shared", "Shared Drawings", "Collaborate on design workspaces shared with your team.", "users", "Drawings")
			]
		},
		{
			label: "Drawing Modes",
			icon: "layer-group",
			features: [
				feature("drawing_whiteboards", "Whiteboards", "Infinite digital brainstorming canvas with sticky notes and freehand tools.", "circle", "Modes"),
				feature("drawing_flowcharts", "Flowcharts", "Build system process flows, connections, and custom arrow shapes.", "route", "Modes"),
				feature("drawing_wireframes", "Wireframes", "Create low-fidelity UI mockups and client landing pages.", "crop", "Modes"),
				feature("drawing_network", "Network Diagrams", "Design server infrastructure topologies and firewall networks.", "network-wired", "Modes"),
				feature("drawing_ui_mockups", "UI Mockups", "High-fidelity component variants, auto layouts, and design prototypes.", "window-maximize", "Modes")
			]
		},
		{
			label: "Assets & Admin",
			icon: "folder-open",
			features: [
				feature("drawing_assets", "Assets Manager", "Upload and organize PNG, JPG, custom SVG vectors, and typography.", "folder-open", "Assets"),
				feature("drawing_brand_kit", "Brand Kit", "Store company logos, primary theme color tokens, and style guidelines.", "id-card", "Assets"),
				feature("drawing_archive", "Archive Center", "Archived drawings database and version control restores.", "archive", "Maintenance")
			]
		}
	],
	ems: [
		{
			label: "Education Dashboard",
			icon: "gauge",
			features: [
				feature("ems_overview", "EMS Dashboard", "Central education management command center with KPIs, analytics, and AI insights.", "gauge", "Dashboard"),
				feature("ems_analytics", "Analytics", "Advanced education analytics with charts, trends, and performance metrics.", "chart", "Analytics"),
				feature("ems_ai_assistant", "AI Education Assistant", "AI-powered insights for student performance, attendance risk, and academic recommendations.", "robot", "Intelligence"),
				feature("ems_reports", "Reports", "Generate comprehensive education reports, transcripts, and analytics.", "file", "Reporting"),
				feature("ems_settings", "EMS Settings", "Configure education system preferences, grading, attendance rules, and academic policies.", "cog", "Configuration")
			]
		},
		{
			label: "Institution Management",
			icon: "building",
			features: [
				feature("ems_institution_dashboard", "Institution Dashboard", "Overview of all institutions, campuses, departments and academic structure.", "gauge", "Management"),
				feature("ems_institutions", "Institutions", "Manage multi-institution, multi-campus educational organizations.", "building", "Management"),
				feature("ems_campuses", "Campuses", "Manage unlimited campuses, branches, and facilities.", "location", "Management"),
				feature("ems_departments", "Departments", "Organize academic and administrative departments.", "sitemap", "Management"),
				feature("ems_programs", "Programs", "Manage academic programs, degrees, and certifications.", "book", "Management"),
				feature("ems_academic_years", "Academic Years", "Configure academic years, semesters, and terms.", "calendar", "Management"),
				feature("ems_semesters", "Semesters", "Manage semester schedules, registration periods, and sessions.", "calendar", "Management"),
				feature("ems_buildings", "Buildings", "Manage campus buildings, classrooms, laboratories, and facilities.", "building", "Management"),
				feature("ems_rooms", "Rooms", "Manage rooms, seating capacity, and resource allocation.", "door", "Management")
			]
		},
		{
			label: "Student Information System",
			icon: "users",
			features: [
				feature("ems_student_dashboard", "Student Dashboard", "Complete student lifecycle management from admission to alumni.", "gauge", "SIS"),
				feature("ems_students", "All Students", "Manage student records, profiles, and academic history.", "users", "SIS"),
				feature("ems_student_profile", "Student Profile", "360-degree student view with academics, attendance, fees, and more.", "user", "SIS"),
				feature("ems_parents", "Parents & Guardians", "Manage parent/guardian information and portal access.", "users", "SIS"),
				feature("ems_communication", "Communication", "Send emails, SMS, and notifications to students and parents.", "comments", "SIS")
			]
		},
		{
			label: "Admissions Management",
			icon: "clipboard",
			features: [feature("ems_admission_dashboard", "Admission Dashboard", "Track applications, enrollment, and admission lifecycle.", "gauge", "Admissions"), feature("ems_admissions", "Admissions", "Manage applications, document verification, and enrollment workflow.", "clipboard", "Admissions")]
		},
		{
			label: "Staff & Faculty",
			icon: "user-tie",
			features: [
				feature("ems_staff_dashboard", "Staff Dashboard", "Manage teachers, employees, and workforce analytics.", "gauge", "Staff"),
				feature("ems_teachers", "Teachers", "Manage teacher profiles, assignments, workload, and performance.", "chalkboard", "Staff"),
				feature("ems_employees", "Employees", "Manage non-teaching staff, contracts, and attendance.", "users", "Staff")
			]
		},
		{
			label: "Academic Structure",
			icon: "layer-group",
			features: [
				feature("ems_academic_dashboard", "Academic Dashboard", "Academic hierarchy, curriculum, and course management.", "gauge", "Academic"),
				feature("ems_classes", "Classes & Sections", "Manage classes, sections, batches, and student enrollment.", "layer-group", "Academic"),
				feature("ems_subjects", "Subjects", "Manage subjects, course mapping, and teacher assignments.", "book", "Academic"),
				feature("ems_courses", "Courses", "Manage courses, curriculum, syllabus, and learning outcomes.", "book-open", "Academic")
			]
		},
		{
			label: "Attendance",
			icon: "check-circle",
			features: [feature("ems_attendance_dashboard", "Attendance Dashboard", "Real-time attendance tracking and analytics.", "gauge", "Attendance"), feature("ems_attendance", "Attendance Records", "Mark and manage student, teacher, and employee attendance.", "check-circle", "Attendance")]
		},
		{
			label: "Timetable & Scheduling",
			icon: "calendar-alt",
			features: [
				feature("ems_timetable_dashboard", "Timetable Dashboard", "Class scheduling, resource booking, and conflict management.", "gauge", "Timetable"),
				feature("ems_timetables", "Timetables", "Create and manage master timetables, teacher schedules, and room bookings.", "calendar-alt", "Timetable"),
				feature("ems_events", "Events", "Manage academic events, holidays, and important dates.", "calendar", "Timetable")
			]
		},
		{
			label: "Assignments & Coursework",
			icon: "tasks",
			features: [feature("ems_assignment_dashboard", "Assignment Dashboard", "Track assignments, submissions, grading, and deadlines.", "gauge", "Assignments"), feature("ems_assignments", "Assignments", "Create, distribute, and grade assignments with rubrics and AI assistance.", "tasks", "Assignments")]
		},
		{
			label: "Examinations",
			icon: "file-alt",
			features: [
				feature("ems_exam_dashboard", "Exam Dashboard", "Manage examinations, question banks, and result processing.", "gauge", "Exams"),
				feature("ems_examinations", "Examinations", "Create exams, manage question papers, conduct online/offline exams.", "file-alt", "Exams"),
				feature("ems_grades", "Grades & Results", "Grade management, report cards, transcripts, and certificates.", "chart", "Exams"),
				feature("ems_certificates", "Certificates", "Generate and manage certificates, diplomas, and transcripts.", "certificate", "Exams")
			]
		},
		{
			label: "Learning Management (LMS)",
			icon: "graduation-cap",
			features: [feature("ems_lms_dashboard", "LMS Dashboard", "Digital learning platform with courses, lessons, and assessments.", "gauge", "LMS"), feature("ems_courses_lms", "Courses & Lessons", "Create and manage online courses, lessons, quizzes, and learning paths.", "graduation-cap", "LMS")]
		},
		{
			label: "Library",
			icon: "book",
			features: [feature("ems_library_dashboard", "Library Dashboard", "Manage physical and digital library resources.", "gauge", "Library"), feature("ems_library", "Library Catalog", "Book catalog, issue/return, reservations, and digital resources.", "book", "Library")]
		},
		{
			label: "Transport",
			icon: "bus",
			features: [feature("ems_transport_dashboard", "Transport Dashboard", "Fleet management, route planning, and GPS tracking.", "gauge", "Transport"), feature("ems_transport", "Transport Management", "Manage vehicles, drivers, routes, and student transport.", "bus", "Transport")]
		},
		{
			label: "Hostel & Accommodation",
			icon: "bed",
			features: [feature("ems_hostel_dashboard", "Hostel Dashboard", "Residential management with room allocation and occupancy tracking.", "gauge", "Hostel"), feature("ems_hostel", "Hostel Management", "Manage hostels, rooms, beds, check-in/check-out, and visitor logs.", "bed", "Hostel")]
		},
		{
			label: "Medical & Health",
			icon: "heartbeat",
			features: [feature("ems_medical_dashboard", "Medical Dashboard", "Campus health center with patient records and appointments.", "gauge", "Medical"), feature("ems_medical", "Medical Center", "Manage patients, appointments, pharmacy, and health records.", "heartbeat", "Medical")]
		},
		{
			label: "Alumni & Career Services",
			icon: "user-graduate",
			features: [feature("ems_alumni_dashboard", "Alumni Dashboard", "Alumni engagement, mentorship, and career services.", "gauge", "Alumni"), feature("ems_alumni", "Alumni Directory", "Manage alumni records, networking, jobs, and donations.", "user-graduate", "Alumni")]
		},
		{
			label: "Research & Innovation",
			icon: "flask",
			features: [feature("ems_research_dashboard", "Research Dashboard", "Research projects, publications, patents, and grants.", "gauge", "Research"), feature("ems_research", "Research Management", "Manage research projects, publications, patents, and collaborations.", "flask", "Research")]
		},
		{
			label: "Campus & Facilities",
			icon: "building",
			features: [feature("ems_campus_dashboard", "Campus Dashboard", "Smart campus management with facility booking and IoT.", "gauge", "Campus"), feature("ems_campus_facilities", "Facilities", "Manage facilities, room booking, maintenance, and assets.", "building", "Campus")]
		},
		{
			label: "Security & Safety",
			icon: "shield-alt",
			features: [feature("ems_security_dashboard", "Security Dashboard", "Campus security, incident management, and compliance.", "gauge", "Security"), feature("ems_security", "Security Center", "Manage security personnel, incidents, access control, and emergencies.", "shield-alt", "Security")]
		},
		{
			label: "Fees & Finance",
			icon: "wallet",
			features: [feature("ems_fees_dashboard", "Fees Dashboard", "Fee collection, scholarships, and financial analytics.", "gauge", "Finance"), feature("ems_fees", "Fee Management", "Manage fee structures, collections, installments, and scholarships.", "wallet", "Finance")]
		}
	]
};
var flattenFeatures = (system) => (FEATURE_REGISTRY[system] || []).flatMap((group) => group.features);
var getFeatureById = (system, id) => flattenFeatures(system).find((item) => item.id === id) || null;
var getFeatureGroups = (system) => FEATURE_REGISTRY[system] || [];
var getAllFeatures = () => Object.entries(FEATURE_REGISTRY).flatMap(([system, groups]) => groups.flatMap((group) => group.features.map((item) => ({
	...item,
	system,
	group: group.label
}))));
//#endregion
//#region src/api/projects.js
function appendIfPresent(formData, key, value) {
	if (value === void 0) return;
	if (value === null || value === "") {
		formData.append(key, "");
		return;
	}
	formData.append(key, value);
}
function toProjectFormData(data = {}) {
	const formData = new FormData();
	appendIfPresent(formData, "name", data.name);
	appendIfPresent(formData, "srNo", data.srNo);
	appendIfPresent(formData, "client", data.client);
	appendIfPresent(formData, "description", data.description);
	appendIfPresent(formData, "submissionTime", data.submissionTime);
	appendIfPresent(formData, "status", data.status);
	appendIfPresent(formData, "teamSize", data.teamSize);
	if (data.removeFile) formData.append("removeFile", "1");
	if (data.file instanceof File) formData.append("file", data.file);
	return formData;
}
async function listProjects(params = {}, options = {}) {
	const query = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== void 0 && value !== null && value !== "") query.set(key, value);
	});
	return (await apiRequest(`/api/v1/projects${query.toString() ? `?${query.toString()}` : ""}`, options)).data || [];
}
async function getProjectSummary() {
	return (await apiRequest("/api/v1/projects/summary")).data || null;
}
async function createProject(data) {
	return (await apiRequest("/api/v1/projects", {
		method: "POST",
		body: toProjectFormData(data)
	})).data;
}
async function updateProject(id, data) {
	const formData = toProjectFormData(data);
	formData.append("_method", "PATCH");
	return (await apiRequest(`/api/v1/projects/${id}`, {
		method: "POST",
		body: formData
	})).data;
}
function getDownloadFilenameFromHeaders(headers, fallback = "project-file") {
	const disposition = headers.get("content-disposition") || "";
	const utfMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);
	if (utfMatch?.[1]) return decodeURIComponent(utfMatch[1]);
	return disposition.match(/filename="?([^";]+)"?/i)?.[1] || fallback;
}
async function downloadFile(id, fallbackName = "project-file") {
	const { blob, headers } = await apiRequest(`/api/v1/projects/download/${id}`, { responseType: "blob" });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = getDownloadFilenameFromHeaders(headers, fallbackName);
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.URL.revokeObjectURL(url);
}
async function deleteProject(id) {
	await apiRequest(`/api/v1/projects/${id}`, { method: "DELETE" });
}
//#endregion
//#region src/pages/systems/PMS/Agile_Workspace/PmsAgileScrum.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var PmsAgileScrum = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [columns] = (0, import_react.useState)([
		"To Do",
		"In Progress",
		"Review",
		"Done"
	]);
	const columnColors = [
		"#4f46e5",
		"#f59e0b",
		"#06b6d4",
		"#10b981"
	];
	const [tasks, setTasks] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_scrum_tasks") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		column: "To Do",
		assignee: "",
		priority: "Medium",
		storyPoints: "1",
		tags: ""
	});
	const save = (data) => {
		setTasks(data);
		localStorage.setItem("pms_scrum_tasks", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: tasks.length,
			done: tasks.filter((t) => t.column === "Done").length,
			inProgress: tasks.filter((t) => t.column === "In Progress").length,
			todo: tasks.filter((t) => t.column === "To Do").length,
			totalPoints: tasks.reduce((s, t) => s + (Number(t.storyPoints) || 0), 0),
			donePoints: tasks.filter((t) => t.column === "Done").reduce((s, t) => s + (Number(t.storyPoints) || 0), 0)
		};
	}, [tasks]);
	const filteredTasks = (0, import_react.useMemo)(() => {
		if (!search) return tasks;
		return tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || (t.assignee || "").toLowerCase().includes(search.toLowerCase()));
	}, [tasks, search]);
	const columnTasks = (0, import_react.useMemo)(() => {
		const map = {};
		columns.forEach((c) => {
			map[c] = [];
		});
		filteredTasks.forEach((t) => {
			if (map[t.column]) map[t.column].push(t);
			else map["To Do"].push(t);
		});
		return map;
	}, [filteredTasks, columns]);
	const moveTask = (id, direction) => {
		setTasks((prev) => prev.map((t) => {
			if (t.id !== id) return t;
			const idx = columns.indexOf(t.column);
			const nextIdx = Math.max(0, Math.min(columns.length - 1, idx + direction));
			return {
				...t,
				column: columns[nextIdx]
			};
		}));
	};
	const openAdd = () => {
		setEditId(null);
		setForm({
			title: "",
			description: "",
			column: "To Do",
			assignee: "",
			priority: "Medium",
			storyPoints: "1",
			tags: ""
		});
		setShowModal(true);
	};
	const openEdit = (t) => {
		setEditId(t.id);
		setForm({
			title: t.title,
			description: t.description || "",
			column: t.column,
			assignee: t.assignee || "",
			priority: t.priority || "Medium",
			storyPoints: String(t.storyPoints || 1),
			tags: t.tags || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title) return;
		const payload = {
			...form,
			storyPoints: Number(form.storyPoints) || 1
		};
		if (editId) save(tasks.map((t) => t.id === editId ? {
			...t,
			...payload
		} : t));
		else save([...tasks, {
			...payload,
			id: `scrum-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this task?")) save(tasks.filter((t) => t.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Tasks",
						value: stats.total,
						color: "#4f46e5",
						icon: faLayerGroup
					},
					{
						label: "To Do",
						value: stats.todo,
						color: "#f59e0b",
						icon: faClock
					},
					{
						label: "In Progress",
						value: stats.inProgress,
						color: "#06b6d4",
						icon: faBox
					},
					{
						label: "Done",
						value: stats.done,
						color: "#10b981",
						icon: faCheckCircle
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
					className: "fw-bold mb-1",
					children: "Scrum Board"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "small mb-0",
					style: { color: mutedColor },
					children: "Drag tasks across the board to track sprint progress."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "input-group",
						style: {
							borderColor,
							maxWidth: 260
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "input-group-text",
							style: {
								background: isDark ? "#262a3a" : "#f8f9fa",
								borderColor,
								color: mutedColor
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "form-control",
							placeholder: "Search tasks...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							style: {
								background: isDark ? "#1a1d29" : "#fff",
								borderColor,
								color: textColor,
								fontSize: 13
							}
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary btn-sm rounded-pill px-3",
						onClick: openAdd,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faPlus,
							className: "me-1"
						}), " Add Task"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3",
				style: { minHeight: 400 },
				children: columns.map((col, ci) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "12px",
							background: isDark ? "#1a1d29" : "#fff"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-header bg-transparent border-0 pt-3 px-3 pb-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
										width: 10,
										height: 10,
										borderRadius: 3,
										background: columnColors[ci]
									} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold small",
										children: col
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge rounded-pill",
									style: {
										background: `${columnColors[ci]}22`,
										color: columnColors[ci]
									},
									children: (columnTasks[col] || []).length
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-3 d-flex flex-column gap-2",
							children: (columnTasks[col] || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-4",
								style: { color: mutedColor },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "No tasks" })
							}) : (columnTasks[col] || []).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3 p-3",
								style: {
									background: isDark ? "#262a3a" : "#f8f9fa",
									border: `1px solid ${borderColor}`
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between align-items-start mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold small",
											style: { lineHeight: 1.3 },
											children: t.title
										}), t.priority === "High" || t.priority === "Critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-danger rounded-pill",
											style: { fontSize: 9 },
											children: t.priority
										}) : t.priority === "Low" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-secondary rounded-pill",
											style: { fontSize: 9 },
											children: t.priority
										}) : null]
									}),
									t.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small mb-2",
										style: { color: mutedColor },
										children: t.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2 mb-2 flex-wrap",
										children: [
											t.assignee && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge bg-light text-dark rounded-pill",
												style: { fontSize: 9 },
												children: t.assignee
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "badge bg-light text-dark rounded-pill",
												style: { fontSize: 9 },
												children: [t.storyPoints, " pts"]
											}),
											t.tags && t.tags.split(",").map((tag, ti) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge rounded-pill",
												style: {
													fontSize: 9,
													background: `${columnColors[ci]}22`,
													color: columnColors[ci]
												},
												children: tag.trim()
											}, ti))
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex gap-1 justify-content-end",
										children: [
											ci > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm p-1",
												style: { color: mutedColor },
												onClick: () => moveTask(t.id, -1),
												title: "Move left",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faArrowRight,
													style: { transform: "rotate(180deg)" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm p-1 text-primary",
												onClick: () => openEdit(t),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
											}),
											ci < columns.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm p-1",
												style: { color: mutedColor },
												onClick: () => moveTask(t.id, 1),
												title: "Move right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowRight })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm p-1 text-danger",
												onClick: () => handleDelete(t.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})
										]
									})
								]
							}, t.id))
						})]
					})
				}, col))
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Task" : "New Task"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "Task title"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.description,
											onChange: (e) => setForm({
												...form,
												description: e.target.value
											}),
											placeholder: "Optional description"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Column"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select",
													value: form.column,
													onChange: (e) => setForm({
														...form,
														column: e.target.value
													}),
													children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Priority"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.priority,
													onChange: (e) => setForm({
														...form,
														priority: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Critical" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Story Points"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													className: "form-control",
													value: form.storyPoints,
													onChange: (e) => setForm({
														...form,
														storyPoints: e.target.value
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Assignee"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												value: form.assignee,
												onChange: (e) => setForm({
													...form,
													assignee: e.target.value
												}),
												placeholder: "Team member"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Tags (comma)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												value: form.tags,
												onChange: (e) => setForm({
													...form,
													tags: e.target.value
												}),
												placeholder: "frontend, bug"
											})]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Task"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Agile_Workspace/PmsBacklogManagement.jsx
var PmsBacklogManagement = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [items, setItems] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_backlog") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [priorityFilter, setPriorityFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		priority: "Medium",
		category: "Feature",
		storyPoints: "3",
		notes: ""
	});
	const save = (data) => {
		setItems(data);
		localStorage.setItem("pms_backlog", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: items.length,
			high: items.filter((i) => i.priority === "High" || i.priority === "Critical").length,
			medium: items.filter((i) => i.priority === "Medium").length,
			low: items.filter((i) => i.priority === "Low").length,
			totalPoints: items.reduce((s, i) => s + (Number(i.storyPoints) || 0), 0)
		};
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		return items.filter((i) => {
			const match = !search || i.title.toLowerCase().includes(search.toLowerCase()) || (i.category || "").toLowerCase().includes(search.toLowerCase());
			const pri = priorityFilter === "All" || i.priority === priorityFilter;
			return match && pri;
		}).sort((a, b) => {
			const order = {
				Critical: 0,
				High: 1,
				Medium: 2,
				Low: 3
			};
			return (order[a.priority] || 99) - (order[b.priority] || 99);
		});
	}, [
		items,
		search,
		priorityFilter
	]);
	const getPriorityColor = (p) => {
		return {
			Critical: "#ef4444",
			High: "#f59e0b",
			Medium: "#4f46e5",
			Low: "#10b981"
		}[p] || "#64748b";
	};
	const openAdd = () => {
		setEditId(null);
		setForm({
			title: "",
			description: "",
			priority: "Medium",
			category: "Feature",
			storyPoints: "3",
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (i) => {
		setEditId(i.id);
		setForm({
			title: i.title,
			description: i.description || "",
			priority: i.priority,
			category: i.category || "Feature",
			storyPoints: String(i.storyPoints || 3),
			notes: i.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title) return;
		const payload = {
			...form,
			storyPoints: Number(form.storyPoints) || 0
		};
		if (editId) save(items.map((i) => i.id === editId ? {
			...i,
			...payload
		} : i));
		else save([...items, {
			...payload,
			id: `bl-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Remove this backlog item?")) save(items.filter((i) => i.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Items",
						value: stats.total,
						color: "#4f46e5",
						icon: faClipboard
					},
					{
						label: "High Priority",
						value: stats.high,
						color: "#ef4444",
						icon: faArrowUp
					},
					{
						label: "Medium",
						value: stats.medium,
						color: "#f59e0b",
						icon: faFlag
					},
					{
						label: "Story Points",
						value: stats.totalPoints,
						color: "#8b5cf6",
						icon: faStar
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Backlog"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Prioritized list of features, improvements, and bug fixes."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Item"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search backlog...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: priorityFilter,
										onChange: (e) => setPriorityFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Priorities"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Critical",
												children: "Critical"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "High",
												children: "High"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Medium",
												children: "Medium"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Low",
												children: "Low"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#8b5cf6",
											lineHeight: "38px"
										},
										children: [stats.totalPoints, " pts"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { width: 40 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Item" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Priority" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Story Pts" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Description" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "Backlog is empty. Start adding items."
								}) }) : filtered.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
										width: 6,
										height: 6,
										borderRadius: "50%",
										background: getPriorityColor(i.priority)
									} }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										children: i.title
									}), i.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small",
										style: { color: mutedColor },
										children: i.notes
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill bg-light text-dark",
										children: i.category
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill",
										style: {
											background: `${getPriorityColor(i.priority)}22`,
											color: getPriorityColor(i.priority)
										},
										children: i.priority
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-bold",
										children: i.storyPoints || 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										style: { maxWidth: 200 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-truncate",
											children: i.description || "-"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-primary me-1",
											onClick: () => openEdit(i),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-danger",
											onClick: () => handleDelete(i.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
										})]
									})
								] }, i.id)) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Item" : "Add Backlog Item"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "e.g. User profile page"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.description,
											onChange: (e) => setForm({
												...form,
												description: e.target.value
											}),
											placeholder: "Brief description"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Priority"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.priority,
													onChange: (e) => setForm({
														...form,
														priority: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Critical" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Category"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.category,
													onChange: (e) => setForm({
														...form,
														category: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Feature" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Improvement" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Bug Fix" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Tech Debt" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Research" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Story Points"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													className: "form-control",
													value: form.storyPoints,
													onChange: (e) => setForm({
														...form,
														storyPoints: e.target.value
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Optional notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Item"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Agile_Workspace/PmsRiskTracking.jsx
var PmsRiskTracking = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [risks, setRisks] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_risks") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [severityFilter, setSeverityFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		severity: "Medium",
		category: "Technical",
		status: "Open",
		impact: "",
		mitigation: "",
		owner: ""
	});
	const save = (data) => {
		setRisks(data);
		localStorage.setItem("pms_risks", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: risks.length,
			critical: risks.filter((r) => r.severity === "Critical").length,
			high: risks.filter((r) => r.severity === "High").length,
			open: risks.filter((r) => r.status === "Open").length,
			mitigated: risks.filter((r) => r.status === "Mitigated" || r.status === "Closed").length
		};
	}, [risks]);
	const filtered = (0, import_react.useMemo)(() => {
		return risks.filter((r) => {
			const match = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.category || "").toLowerCase().includes(search.toLowerCase());
			const sev = severityFilter === "All" || r.severity === severityFilter;
			return match && sev;
		}).sort((a, b) => {
			const order = {
				Critical: 0,
				High: 1,
				Medium: 2,
				Low: 3
			};
			return (order[a.severity] || 99) - (order[b.severity] || 99);
		});
	}, [
		risks,
		search,
		severityFilter
	]);
	const getSeverityColor = (s) => {
		return {
			Critical: "#ef4444",
			High: "#f59e0b",
			Medium: "#4f46e5",
			Low: "#10b981"
		}[s] || "#64748b";
	};
	const getStatusBadge = (s) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge bg-${{
				Open: "danger",
				"In Review": "warning",
				Mitigated: "info",
				Closed: "success"
			}[s] || "secondary"} rounded-pill`,
			children: s
		});
	};
	const openAdd = () => {
		setEditId(null);
		setForm({
			title: "",
			severity: "Medium",
			category: "Technical",
			status: "Open",
			impact: "",
			mitigation: "",
			owner: ""
		});
		setShowModal(true);
	};
	const openEdit = (r) => {
		setEditId(r.id);
		setForm({
			title: r.title,
			severity: r.severity,
			category: r.category || "Technical",
			status: r.status,
			impact: r.impact || "",
			mitigation: r.mitigation || "",
			owner: r.owner || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title) return;
		if (editId) save(risks.map((r) => r.id === editId ? {
			...r,
			...form
		} : r));
		else save([...risks, {
			...form,
			id: `risk-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this risk?")) save(risks.filter((r) => r.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Risks",
						value: stats.total,
						color: "#4f46e5",
						icon: faShieldHalved
					},
					{
						label: "Critical",
						value: stats.critical,
						color: "#ef4444",
						icon: faTriangleExclamation
					},
					{
						label: "High",
						value: stats.high,
						color: "#f59e0b",
						icon: faFlag
					},
					{
						label: "Open",
						value: stats.open,
						color: "#06b6d4",
						icon: faClock
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Risk Register"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Identify, assess, and track project risks and mitigations."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Risk"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search risks...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: severityFilter,
										onChange: (e) => setSeverityFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Severities"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Critical" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: stats.open > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#ef4444",
											lineHeight: "38px"
										},
										children: [stats.open, " open risks"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Risk" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Severity" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Owner" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Impact" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No risks recorded. Add your first risk."
								}) }) : filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										children: r.title
									}), r.mitigation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "extra-small",
										style: { color: mutedColor },
										children: ["Mitigation: ", r.mitigation]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill bg-light text-dark",
										children: r.category
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
											width: 10,
											height: 10,
											borderRadius: "50%",
											background: getSeverityColor(r.severity)
										} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold small",
											style: { color: getSeverityColor(r.severity) },
											children: r.severity
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(r.status) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.owner || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										style: { maxWidth: 200 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-truncate",
											children: r.impact || "-"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-primary me-1",
											onClick: () => openEdit(r),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-danger",
											onClick: () => handleDelete(r.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
										})]
									})
								] }, r.id)) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Risk" : "Add Risk"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Risk Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "e.g. Server downtime risk"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Severity"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.severity,
													onChange: (e) => setForm({
														...form,
														severity: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Critical" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Category"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.category,
													onChange: (e) => setForm({
														...form,
														category: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Technical" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Financial" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Schedule" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Resource" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Legal" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.status,
													onChange: (e) => setForm({
														...form,
														status: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Open" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In Review" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mitigated" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Closed" })
													]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Impact Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.impact,
											onChange: (e) => setForm({
												...form,
												impact: e.target.value
											}),
											placeholder: "What is the potential impact?"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Mitigation Plan"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "form-control",
												rows: "2",
												value: form.mitigation,
												onChange: (e) => setForm({
													...form,
													mitigation: e.target.value
												}),
												placeholder: "How to mitigate?"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Owner"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												value: form.owner,
												onChange: (e) => setForm({
													...form,
													owner: e.target.value
												}),
												placeholder: "Responsible person"
											})]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Risk"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Agile_Workspace/PmsSprintManagement.jsx
var sprintStatuses = [
	"Planning",
	"Active",
	"Review",
	"Completed",
	"Cancelled"
];
var PmsSprintManagement = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [sprints, setSprints] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_sprints") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		goal: "",
		status: "Planning",
		startDate: "",
		endDate: "",
		totalTasks: "0",
		completedTasks: "0",
		notes: ""
	});
	const save = (data) => {
		setSprints(data);
		localStorage.setItem("pms_sprints", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		const total = sprints.length;
		const active = sprints.filter((s) => s.status === "Active").length;
		const completed = sprints.filter((s) => s.status === "Completed").length;
		const totalTasks = sprints.reduce((s, sp) => s + (Number(sp.totalTasks) || 0), 0);
		const doneTasks = sprints.reduce((s, sp) => s + (Number(sp.completedTasks) || 0), 0);
		return {
			total,
			active,
			completed,
			velocity: totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0,
			sprints
		};
	}, [sprints]);
	const filtered = (0, import_react.useMemo)(() => {
		return sprints.filter((s) => {
			const match = !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.goal || "").toLowerCase().includes(search.toLowerCase());
			const stat = statusFilter === "All" || s.status === statusFilter;
			return match && stat;
		});
	}, [
		sprints,
		search,
		statusFilter
	]);
	const getStatusColor = (s) => {
		return {
			Planning: "#f59e0b",
			Active: "#10b981",
			Review: "#06b6d4",
			Completed: "#8b5cf6",
			Cancelled: "#ef4444"
		}[s] || "#64748b";
	};
	const openAdd = () => {
		setEditId(null);
		setForm({
			name: "",
			goal: "",
			status: "Planning",
			startDate: "",
			endDate: "",
			totalTasks: "0",
			completedTasks: "0",
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (s) => {
		setEditId(s.id);
		setForm({
			name: s.name,
			goal: s.goal || "",
			status: s.status,
			startDate: s.startDate?.slice(0, 10) || "",
			endDate: s.endDate?.slice(0, 10) || "",
			totalTasks: String(s.totalTasks || 0),
			completedTasks: String(s.completedTasks || 0),
			notes: s.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name) return;
		const payload = {
			...form,
			totalTasks: Number(form.totalTasks) || 0,
			completedTasks: Number(form.completedTasks) || 0
		};
		if (editId) save(sprints.map((s) => s.id === editId ? {
			...s,
			...payload
		} : s));
		else save([...sprints, {
			...payload,
			id: `sprint-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this sprint?")) save(sprints.filter((s) => s.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Sprints",
						value: stats.total,
						color: "#4f46e5",
						icon: faClock
					},
					{
						label: "Active",
						value: stats.active,
						color: "#10b981",
						icon: faPlay
					},
					{
						label: "Completed",
						value: stats.completed,
						color: "#8b5cf6",
						icon: faFlag
					},
					{
						label: "Velocity",
						value: `${stats.velocity}%`,
						color: stats.velocity > 70 ? "#10b981" : "#f59e0b",
						icon: faRocket
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Sprint List"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Plan and manage development sprints."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " New Sprint"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search sprints...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: statusFilter,
										onChange: (e) => setStatusFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "All",
											children: "All Statuses"
										}), sprintStatuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#10b981",
											lineHeight: "38px"
										},
										children: [
											"Velocity: ",
											stats.velocity,
											"%"
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Sprint" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Goal" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Duration" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Tasks" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No sprints yet. Create your first sprint."
								}) }) : filtered.map((s) => {
									const total = Number(s.totalTasks) || 0;
									const done = Number(s.completedTasks) || 0;
									const pct = total > 0 ? Math.round(done / total * 100) : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-bold small",
											children: s.name
										}), s.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small",
											style: { color: mutedColor },
											children: s.notes
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											style: { maxWidth: 200 },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-truncate",
												children: s.goal || "-"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill",
											style: { background: getStatusColor(s.status) },
											children: s.status
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "small",
											children: [
												s.startDate?.slice(0, 10) || "?",
												" - ",
												s.endDate?.slice(0, 10) || "?"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "small",
											children: [
												done,
												"/",
												total
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: { minWidth: 120 },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "progress flex-grow-1",
													style: {
														height: 7,
														background: isDark ? "#2d3248" : "#e2e8f0"
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "progress-bar",
														style: {
															width: `${pct}%`,
															background: pct >= 100 ? "#8b5cf6" : pct >= 50 ? "#10b981" : "#f59e0b"
														}
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "small fw-bold",
													children: [pct, "%"]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-end",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-primary me-1",
												onClick: () => openEdit(s),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-danger",
												onClick: () => handleDelete(s.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})]
										})
									] }, s.id);
								}) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Sprint" : "New Sprint"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Sprint Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											}),
											placeholder: "e.g. Sprint 5"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Goal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											value: form.goal,
											onChange: (e) => setForm({
												...form,
												goal: e.target.value
											}),
											placeholder: "Sprint goal"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
													className: "form-select",
													value: form.status,
													onChange: (e) => setForm({
														...form,
														status: e.target.value
													}),
													children: sprintStatuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Start Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													className: "form-control",
													value: form.startDate,
													onChange: (e) => setForm({
														...form,
														startDate: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "End Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													className: "form-control",
													value: form.endDate,
													onChange: (e) => setForm({
														...form,
														endDate: e.target.value
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Total Tasks"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												className: "form-control",
												value: form.totalTasks,
												onChange: (e) => setForm({
													...form,
													totalTasks: e.target.value
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Completed Tasks"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												className: "form-control",
												value: form.completedTasks,
												onChange: (e) => setForm({
													...form,
													completedTasks: e.target.value
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Optional notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Create Sprint"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Controls_Recovery/PmsDataBackup.jsx
var PmsDataBackup = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [backups, setBackups] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_backups") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		type: "Full",
		status: "Pending",
		size: "",
		notes: ""
	});
	const save = (data) => {
		setBackups(data);
		localStorage.setItem("pms_backups", JSON.stringify(data));
	};
	const createBackup = () => {
		const now = (/* @__PURE__ */ new Date()).toISOString();
		save([{
			id: `bk-${Date.now()}`,
			name: `Backup ${now.slice(0, 10)} ${now.slice(11, 16)}`,
			type: "Full",
			status: "Completed",
			size: `${(Math.random() * 500 + 50).toFixed(1)} MB`,
			createdAt: now,
			notes: "Auto-generated backup"
		}, ...backups]);
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: backups.length,
			completed: backups.filter((b) => b.status === "Completed").length,
			pending: backups.filter((b) => b.status === "Pending" || b.status === "In Progress").length,
			latest: backups.length > 0 ? backups[0].createdAt?.slice(0, 10) : "N/A"
		};
	}, [backups]);
	const filtered = (0, import_react.useMemo)(() => {
		return backups.filter((b) => {
			const match = !search || b.name.toLowerCase().includes(search.toLowerCase());
			const stat = statusFilter === "All" || b.status === statusFilter;
			return match && stat;
		});
	}, [
		backups,
		search,
		statusFilter
	]);
	const openAdd = () => {
		setEditId(null);
		setForm({
			name: "",
			type: "Full",
			status: "Pending",
			size: "",
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (b) => {
		setEditId(b.id);
		setForm({
			name: b.name,
			type: b.type,
			status: b.status,
			size: b.size || "",
			notes: b.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name) return;
		if (editId) save(backups.map((b) => b.id === editId ? {
			...b,
			...form
		} : b));
		else save([...backups, {
			...form,
			id: `bk-${Date.now()}`,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this backup record?")) save(backups.filter((b) => b.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Backups",
						value: stats.total,
						color: "#4f46e5",
						icon: faDatabase
					},
					{
						label: "Completed",
						value: stats.completed,
						color: "#10b981",
						icon: faCheckCircle
					},
					{
						label: "Pending",
						value: stats.pending,
						color: "#f59e0b",
						icon: faClock
					},
					{
						label: "Latest",
						value: stats.latest,
						color: "#06b6d4",
						icon: faCloudArrowUp
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Backup & Recovery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Manage project data backups, restore points, and recovery logs."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-success btn-sm rounded-pill px-3",
									onClick: createBackup,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faRotate,
										className: "me-1"
									}), " Run Backup"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-primary btn-sm rounded-pill px-3",
									onClick: openAdd,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPlus,
										className: "me-1"
									}), " Add Record"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search backups...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: statusFilter,
										onChange: (e) => setStatusFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Statuses"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Completed" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In Progress" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Pending" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Failed" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#10b981",
											lineHeight: "38px"
										},
										children: [
											stats.completed,
											"/",
											stats.total,
											" successful"
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Backup Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Size" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Notes" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No backups recorded. Run your first backup."
								}) }) : filtered.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-bold small",
										children: b.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill",
										style: { background: b.type === "Full" ? "#4f46e5" : b.type === "Incremental" ? "#10b981" : "#f59e0b" },
										children: b.type
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `badge rounded-pill bg-${b.status === "Completed" ? "success" : b.status === "Failed" ? "danger" : b.status === "In Progress" ? "info" : "warning"}`,
										children: b.status
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: b.size || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: b.createdAt?.slice(0, 16).replace("T", " ") || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										style: { maxWidth: 150 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-truncate",
											children: b.notes || "-"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-primary me-1",
											onClick: () => openEdit(b),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-danger",
											onClick: () => handleDelete(b.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
										})]
									})
								] }, b.id)) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Backup" : "Add Backup Record"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Backup Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											}),
											placeholder: "e.g. Pre-deployment backup"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.type,
													onChange: (e) => setForm({
														...form,
														type: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Full" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Incremental" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Differential" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.status,
													onChange: (e) => setForm({
														...form,
														status: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Pending" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In Progress" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Completed" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Failed" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Size"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-control",
													value: form.size,
													onChange: (e) => setForm({
														...form,
														size: e.target.value
													}),
													placeholder: "e.g. 250 MB"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Backup notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Record"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Financial_Progress/PmsBudgetTracking.jsx
var PmsBudgetTracking = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [budgets, setBudgets] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_budget_tracking") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		category: "Development",
		allocated: "",
		spent: "",
		fiscalYear: (/* @__PURE__ */ new Date()).getFullYear().toString(),
		notes: ""
	});
	const save = (data) => {
		setBudgets(data);
		localStorage.setItem("pms_budget_tracking", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		const totalAllocated = budgets.reduce((s, b) => s + (Number(b.allocated) || 0), 0);
		const totalSpent = budgets.reduce((s, b) => s + (Number(b.spent) || 0), 0);
		return {
			totalAllocated,
			totalSpent,
			remaining: totalAllocated - totalSpent,
			utilization: totalAllocated > 0 ? Math.round(totalSpent / totalAllocated * 100) : 0,
			overBudget: budgets.filter((b) => (Number(b.spent) || 0) > (Number(b.allocated) || 0)).length,
			count: budgets.length
		};
	}, [budgets]);
	const filtered = (0, import_react.useMemo)(() => {
		return budgets.filter((b) => {
			const match = !search || b.name.toLowerCase().includes(search.toLowerCase());
			const cat = filter === "All" || b.category === filter;
			return match && cat;
		});
	}, [
		budgets,
		search,
		filter
	]);
	const openAdd = () => {
		setEditId(null);
		setForm({
			name: "",
			category: "Development",
			allocated: "",
			spent: "",
			fiscalYear: (/* @__PURE__ */ new Date()).getFullYear().toString(),
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (b) => {
		setEditId(b.id);
		setForm({
			name: b.name,
			category: b.category,
			allocated: String(b.allocated || ""),
			spent: String(b.spent || ""),
			fiscalYear: b.fiscalYear || "",
			notes: b.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name || !form.allocated) return;
		const payload = {
			...form,
			allocated: Number(form.allocated),
			spent: Number(form.spent) || 0
		};
		if (editId) save(budgets.map((b) => b.id === editId ? {
			...b,
			...payload
		} : b));
		else save([...budgets, {
			...payload,
			id: `budget-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this budget line?")) save(budgets.filter((b) => b.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Allocated",
						value: `$${stats.totalAllocated.toLocaleString()}`,
						color: "#4f46e5",
						icon: faCircleDollarToSlot
					},
					{
						label: "Total Spent",
						value: `$${stats.totalSpent.toLocaleString()}`,
						color: "#ef4444",
						icon: faArrowUp
					},
					{
						label: "Remaining",
						value: `$${stats.remaining.toLocaleString()}`,
						color: stats.remaining >= 0 ? "#10b981" : "#ef4444",
						icon: faArrowDown
					},
					{
						label: "Utilization",
						value: `${stats.utilization}%`,
						color: stats.utilization > 80 ? "#f59e0b" : "#10b981",
						icon: faChartPie
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Budget Lines"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Allocate and track project budgets by category."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Budget"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search budgets...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: filter,
										onChange: (e) => setFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Categories"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Development",
												children: "Development"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Infrastructure",
												children: "Infrastructure"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Operations",
												children: "Operations"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Marketing",
												children: "Marketing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Contingency",
												children: "Contingency"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: stats.overBudget > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2 text-danger justify-content-end",
										style: { lineHeight: "38px" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowUp }),
											" ",
											stats.overBudget,
											" over budget"
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Budget Item" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fiscal Year" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Allocated"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Spent"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Remaining"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No budget entries yet."
								}) }) : filtered.map((b) => {
									const alloc = Number(b.allocated) || 0;
									const spent = Number(b.spent) || 0;
									const remaining = alloc - spent;
									const pct = alloc > 0 ? Math.round(spent / alloc * 100) : 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-bold small",
											children: b.name
										}), b.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "extra-small",
											style: { color: mutedColor },
											children: b.notes
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill",
											style: { background: b.category === "Development" ? "#4f46e5" : b.category === "Infrastructure" ? "#10b981" : b.category === "Operations" ? "#f59e0b" : b.category === "Marketing" ? "#ec4899" : "#8b5cf6" },
											children: b.category
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "small",
											children: b.fiscalYear || "-"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-end fw-medium",
											children: ["$", alloc.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-end fw-medium",
											style: { color: spent > alloc ? "#ef4444" : textColor },
											children: ["$", spent.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "text-end fw-bold",
											style: { color: remaining < 0 ? "#ef4444" : "#10b981" },
											children: ["$", remaining.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "text-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2 justify-content-end",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "progress flex-grow-1",
														style: {
															height: 6,
															maxWidth: 80,
															background: isDark ? "#2d3248" : "#e2e8f0"
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "progress-bar",
															style: {
																width: `${Math.min(pct, 100)}%`,
																background: pct > 90 ? "#ef4444" : pct > 75 ? "#f59e0b" : "#10b981"
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-sm btn-outline-primary",
														onClick: () => openEdit(b),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "btn btn-sm btn-outline-danger",
														onClick: () => handleDelete(b.id),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
													})
												]
											})
										})
									] }, b.id);
								}) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Budget" : "New Budget Line"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Budget Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.name,
											onChange: (e) => setForm({
												...form,
												name: e.target.value
											}),
											placeholder: "e.g. Phase 1 Development"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Category"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select",
												value: form.category,
												onChange: (e) => setForm({
													...form,
													category: e.target.value
												}),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Development" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Infrastructure" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Operations" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Marketing" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Contingency" })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Fiscal Year"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control",
												value: form.fiscalYear,
												onChange: (e) => setForm({
													...form,
													fiscalYear: e.target.value
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Allocated ($)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												step: "0.01",
												className: "form-control",
												required: true,
												value: form.allocated,
												onChange: (e) => setForm({
													...form,
													allocated: e.target.value
												}),
												placeholder: "0.00"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Spent to Date ($)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												step: "0.01",
												className: "form-control",
												value: form.spent,
												onChange: (e) => setForm({
													...form,
													spent: e.target.value
												}),
												placeholder: "0.00"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Optional notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Create Budget"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Financial_Progress/PmsCostTracking.jsx
var PmsCostTracking = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [records, setRecords] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_cost_tracking") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		category: "Labor",
		amount: "",
		vendor: "",
		date: "",
		notes: ""
	});
	const saveRecords = (data) => {
		setRecords(data);
		localStorage.setItem("pms_cost_tracking", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: records.reduce((s, r) => s + (Number(r.amount) || 0), 0),
			count: records.length,
			labor: records.filter((r) => r.category === "Labor").reduce((s, r) => s + (Number(r.amount) || 0), 0),
			material: records.filter((r) => r.category === "Material").reduce((s, r) => s + (Number(r.amount) || 0), 0)
		};
	}, [records]);
	const filtered = (0, import_react.useMemo)(() => {
		return records.filter((r) => {
			const match = !search || r.title.toLowerCase().includes(search.toLowerCase()) || (r.vendor || "").toLowerCase().includes(search.toLowerCase());
			const cat = categoryFilter === "All" || r.category === categoryFilter;
			return match && cat;
		}).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
	}, [
		records,
		search,
		categoryFilter
	]);
	const openAdd = () => {
		setEditId(null);
		setForm({
			title: "",
			category: "Labor",
			amount: "",
			vendor: "",
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (r) => {
		setEditId(r.id);
		setForm({
			title: r.title,
			category: r.category,
			amount: String(r.amount || ""),
			vendor: r.vendor || "",
			date: r.date?.slice(0, 10) || "",
			notes: r.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title || !form.amount) return;
		const payload = {
			...form,
			amount: Number(form.amount)
		};
		if (editId) saveRecords(records.map((r) => r.id === editId ? {
			...r,
			...payload
		} : r));
		else saveRecords([...records, {
			...payload,
			id: `cost-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this cost entry?")) saveRecords(records.filter((r) => r.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Cost",
						value: `$${stats.total.toLocaleString()}`,
						color: "#ef4444",
						icon: faDollarSign
					},
					{
						label: "Entries",
						value: stats.count,
						color: "#4f46e5",
						icon: faWallet
					},
					{
						label: "Labor Cost",
						value: `$${stats.labor.toLocaleString()}`,
						color: "#f59e0b",
						icon: faArrowUp
					},
					{
						label: "Material Cost",
						value: `$${stats.material.toLocaleString()}`,
						color: "#10b981",
						icon: faArrowDown
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Cost Register"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Track project labor, material, and miscellaneous costs."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Cost"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search by title or vendor...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: categoryFilter,
										onChange: (e) => setCategoryFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Categories"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Labor",
												children: "Labor"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Material",
												children: "Material"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Equipment",
												children: "Equipment"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Travel",
												children: "Travel"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Other",
												children: "Other"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold fs-5 text-end",
										style: {
											color: "#ef4444",
											lineHeight: "38px"
										},
										children: ["$", stats.total.toLocaleString()]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Item" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Category" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Vendor" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Amount"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "6",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No cost entries found. Add your first cost item."
								}) }) : filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										children: r.title
									}), r.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small",
										style: { color: mutedColor },
										children: r.notes
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill",
										style: { background: r.category === "Labor" ? "#f59e0b" : r.category === "Material" ? "#10b981" : r.category === "Equipment" ? "#8b5cf6" : "#06b6d4" },
										children: r.category
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.vendor || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.date?.slice(0, 10) || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end fw-bold",
										style: { color: "#ef4444" },
										children: ["$", (Number(r.amount) || 0).toLocaleString()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-primary me-1",
											onClick: () => openEdit(r),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-danger",
											onClick: () => handleDelete(r.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
										})]
									})
								] }, r.id)) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Cost" : "Add Cost Entry"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Item / Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "e.g. Concrete pour labor"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Category"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select",
												value: form.category,
												onChange: (e) => setForm({
													...form,
													category: e.target.value
												}),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Labor" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Material" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Equipment" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Travel" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Amount ($)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												step: "0.01",
												className: "form-control",
												required: true,
												value: form.amount,
												onChange: (e) => setForm({
													...form,
													amount: e.target.value
												}),
												placeholder: "0.00"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Vendor / Payee"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												value: form.vendor,
												onChange: (e) => setForm({
													...form,
													vendor: e.target.value
												}),
												placeholder: "Vendor name"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "form-control",
												value: form.date,
												onChange: (e) => setForm({
													...form,
													date: e.target.value
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Optional notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Cost"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Financial_Progress/PmsProgressTracking.jsx
var PmsProgressTracking = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [items, setItems] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_progress_tracking") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		phase: "Planning",
		progress: "0",
		status: "Not Started",
		targetDate: "",
		owner: "",
		notes: ""
	});
	const save = (data) => {
		setItems(data);
		localStorage.setItem("pms_progress_tracking", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		const total = items.length;
		return {
			total,
			completed: items.filter((i) => i.status === "Completed").length,
			inProgress: items.filter((i) => i.status === "In Progress").length,
			notStarted: items.filter((i) => i.status === "Not Started").length,
			avgProgress: total ? Math.round(items.reduce((s, i) => s + (Number(i.progress) || 0), 0) / total) : 0
		};
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		return items.filter((i) => {
			const match = !search || i.title.toLowerCase().includes(search.toLowerCase());
			const stat = statusFilter === "All" || i.status === statusFilter;
			return match && stat;
		});
	}, [
		items,
		search,
		statusFilter
	]);
	const getStatusBadge = (status) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `badge bg-${{
				"Not Started": "secondary",
				"In Progress": "info",
				"Completed": "success",
				"On Hold": "warning",
				"Cancelled": "danger"
			}[status] || "secondary"} rounded-pill`,
			children: status
		});
	};
	const openAdd = () => {
		setEditId(null);
		setForm({
			title: "",
			phase: "Planning",
			progress: "0",
			status: "Not Started",
			targetDate: "",
			owner: "",
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (i) => {
		setEditId(i.id);
		setForm({
			title: i.title,
			phase: i.phase,
			progress: String(i.progress || 0),
			status: i.status,
			targetDate: i.targetDate?.slice(0, 10) || "",
			owner: i.owner || "",
			notes: i.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title) return;
		const payload = {
			...form,
			progress: Math.min(100, Math.max(0, Number(form.progress) || 0))
		};
		if (editId) save(items.map((i) => i.id === editId ? {
			...i,
			...payload
		} : i));
		else save([...items, {
			...payload,
			id: `prog-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this progress item?")) save(items.filter((i) => i.id !== id));
	};
	const toggleStatus = (id) => {
		save(items.map((i) => {
			if (i.id !== id) return i;
			const next = i.status === "Not Started" ? "In Progress" : i.status === "In Progress" ? "Completed" : "Not Started";
			return {
				...i,
				status: next,
				progress: next === "Completed" ? 100 : i.progress
			};
		}));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Items",
						value: stats.total,
						color: "#4f46e5",
						icon: faTasks
					},
					{
						label: "Completed",
						value: stats.completed,
						color: "#10b981",
						icon: faCheckCircle
					},
					{
						label: "In Progress",
						value: stats.inProgress,
						color: "#06b6d4",
						icon: faPlay
					},
					{
						label: "Avg Progress",
						value: `${stats.avgProgress}%`,
						color: "#8b5cf6",
						icon: faChartLine
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Progress Tracker"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Track project phases, milestones, and task completion."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Item"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search items...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: statusFilter,
										onChange: (e) => setStatusFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Statuses"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Not Started",
												children: "Not Started"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "In Progress",
												children: "In Progress"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Completed",
												children: "Completed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "On Hold",
												children: "On Hold"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#10b981",
											lineHeight: "38px"
										},
										children: [
											stats.completed,
											"/",
											stats.total,
											" done"
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Item" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phase" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Owner" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Target" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No progress items yet."
								}) }) : filtered.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										children: i.title
									}), i.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small",
										style: { color: mutedColor },
										children: i.notes
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill bg-light text-dark",
										children: i.phase
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: i.owner || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: getStatusBadge(i.status) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: i.targetDate?.slice(0, 10) || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										style: { minWidth: 140 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress flex-grow-1",
												style: {
													height: 7,
													background: isDark ? "#2d3248" : "#e2e8f0"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "progress-bar",
													style: {
														width: `${i.progress || 0}%`,
														background: (i.progress || 0) >= 100 ? "#10b981" : (i.progress || 0) >= 50 ? "#f59e0b" : "#4f46e5"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "small fw-bold",
												style: { minWidth: 32 },
												children: [i.progress || 0, "%"]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-success me-1",
												onClick: () => toggleStatus(i.id),
												title: "Toggle status",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: i.status === "Completed" ? faPause : faPlay })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-primary me-1",
												onClick: () => openEdit(i),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-danger",
												onClick: () => handleDelete(i.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})
										]
									})
								] }, i.id)) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Item" : "Add Progress Item"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "e.g. Foundation phase"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Phase"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.phase,
													onChange: (e) => setForm({
														...form,
														phase: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Planning" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Design" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Development" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Testing" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Deployment" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Maintenance" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Status"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.status,
													onChange: (e) => setForm({
														...form,
														status: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Not Started" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In Progress" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Completed" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "On Hold" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Progress %"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													max: "100",
													className: "form-control",
													value: form.progress,
													onChange: (e) => setForm({
														...form,
														progress: e.target.value
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Owner"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												value: form.owner,
												onChange: (e) => setForm({
													...form,
													owner: e.target.value
												}),
												placeholder: "Assignee"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Target Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "form-control",
												value: form.targetDate,
												onChange: (e) => setForm({
													...form,
													targetDate: e.target.value
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Optional notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Item"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Financial_Progress/PmsResourceAllocation.jsx
var PmsResourceAllocation = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [resources, setResources] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_resource_allocation") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		role: "Developer",
		allocation: "100",
		project: "",
		startDate: "",
		email: "",
		notes: ""
	});
	const save = (data) => {
		setResources(data);
		localStorage.setItem("pms_resource_allocation", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: resources.length,
			fullTime: resources.filter((r) => Number(r.allocation) >= 100).length,
			partTime: resources.filter((r) => Number(r.allocation) < 100 && Number(r.allocation) > 0).length,
			totalFte: resources.reduce((s, r) => s + (Number(r.allocation) || 0) / 100, 0).toFixed(1)
		};
	}, [resources]);
	const filtered = (0, import_react.useMemo)(() => {
		return resources.filter((r) => {
			const match = !search || r.name.toLowerCase().includes(search.toLowerCase()) || (r.project || "").toLowerCase().includes(search.toLowerCase());
			const role = roleFilter === "All" || r.role === roleFilter;
			return match && role;
		});
	}, [
		resources,
		search,
		roleFilter
	]);
	const openAdd = () => {
		setEditId(null);
		setForm({
			name: "",
			role: "Developer",
			allocation: "100",
			project: "",
			startDate: "",
			email: "",
			notes: ""
		});
		setShowModal(true);
	};
	const openEdit = (r) => {
		setEditId(r.id);
		setForm({
			name: r.name,
			role: r.role,
			allocation: String(r.allocation || 100),
			project: r.project || "",
			startDate: r.startDate?.slice(0, 10) || "",
			email: r.email || "",
			notes: r.notes || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.name || !form.role) return;
		const payload = {
			...form,
			allocation: Math.min(100, Math.max(0, Number(form.allocation) || 0))
		};
		if (editId) save(resources.map((r) => r.id === editId ? {
			...r,
			...payload
		} : r));
		else save([...resources, {
			...payload,
			id: `res-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Remove this resource allocation?")) save(resources.filter((r) => r.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Resources",
						value: stats.total,
						color: "#4f46e5",
						icon: faUsers
					},
					{
						label: "Full Time",
						value: stats.fullTime,
						color: "#10b981",
						icon: faUserCheck
					},
					{
						label: "Part Time",
						value: stats.partTime,
						color: "#f59e0b",
						icon: faUserClock
					},
					{
						label: "Total FTE",
						value: stats.totalFte,
						color: "#8b5cf6",
						icon: faUserGear
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Resource Allocation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Assign team members and track allocation percentages."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Resource"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search by name or project...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: roleFilter,
										onChange: (e) => setRoleFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Roles"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Developer",
												children: "Developer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Designer",
												children: "Designer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Project Manager",
												children: "Project Manager"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "QA",
												children: "QA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "DevOps",
												children: "DevOps"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Business Analyst",
												children: "Business Analyst"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#4f46e5",
											lineHeight: "38px"
										},
										children: [stats.total, " resources"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Role" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Project" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Allocation" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Start Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Contact" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: "7",
									className: "text-center py-5",
									style: { color: mutedColor },
									children: "No resources allocated yet."
								}) }) : filtered.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-bold small",
										children: r.name
									}), r.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "extra-small",
										style: { color: mutedColor },
										children: r.notes
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill",
										style: { background: r.role === "Developer" ? "#4f46e5" : r.role === "Designer" ? "#ec4899" : r.role === "Project Manager" ? "#10b981" : r.role === "QA" ? "#f59e0b" : r.role === "DevOps" ? "#06b6d4" : "#8b5cf6" },
										children: r.role
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.project || "Unassigned"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress flex-grow-1",
											style: {
												height: 7,
												maxWidth: 80,
												background: isDark ? "#2d3248" : "#e2e8f0"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress-bar",
												style: {
													width: `${r.allocation || 0}%`,
													background: (r.allocation || 0) >= 100 ? "#ef4444" : (r.allocation || 0) >= 75 ? "#f59e0b" : "#10b981"
												}
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "small fw-bold",
											children: [r.allocation || 0, "%"]
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.startDate?.slice(0, 10) || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "small",
										children: r.email || "-"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-primary me-1",
											onClick: () => openEdit(r),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-sm btn-outline-danger",
											onClick: () => handleDelete(r.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
										})]
									})
								] }, r.id)) })]
							})
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Resource" : "Add Resource"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												required: true,
												value: form.name,
												onChange: (e) => setForm({
													...form,
													name: e.target.value
												}),
												placeholder: "Team member name"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												className: "form-control",
												value: form.email,
												onChange: (e) => setForm({
													...form,
													email: e.target.value
												}),
												placeholder: "Email"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Role"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.role,
													onChange: (e) => setForm({
														...form,
														role: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Developer" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Designer" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Project Manager" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "QA" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "DevOps" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Business Analyst" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Allocation %"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													max: "100",
													className: "form-control",
													value: form.allocation,
													onChange: (e) => setForm({
														...form,
														allocation: e.target.value
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Start Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													className: "form-control",
													value: form.startDate,
													onChange: (e) => setForm({
														...form,
														startDate: e.target.value
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Project"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											value: form.project,
											onChange: (e) => setForm({
												...form,
												project: e.target.value
											}),
											placeholder: "Assigned project"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.notes,
											onChange: (e) => setForm({
												...form,
												notes: e.target.value
											}),
											placeholder: "Optional notes"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Resource"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Planning_Analytics/PmsCalendar.jsx
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var DAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
var EVENT_COLORS = [
	"#4f46e5",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#8b5cf6",
	"#06b6d4"
];
var PmsCalendar = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const today = /* @__PURE__ */ new Date();
	const [currentMonth, setCurrentMonth] = (0, import_react.useState)(today.getMonth());
	const [currentYear, setCurrentYear] = (0, import_react.useState)(today.getFullYear());
	const [events, setEvents] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_calendar_events") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editEvent, setEditEvent] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterType, setFilterType] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		date: today.toISOString().slice(0, 10),
		type: "Meeting",
		description: ""
	});
	const saveEvents = (evts) => {
		setEvents(evts);
		localStorage.setItem("pms_calendar_events", JSON.stringify(evts));
	};
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const filteredEvents = (0, import_react.useMemo)(() => {
		return events.filter((e) => {
			const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase());
			const matchType = filterType === "All" || e.type === filterType;
			return matchSearch && matchType;
		});
	}, [
		events,
		search,
		filterType
	]);
	const monthEvents = (0, import_react.useMemo)(() => {
		const map = {};
		filteredEvents.forEach((e) => {
			const d = e.date?.slice(0, 10);
			if (d) {
				if (!map[d]) map[d] = [];
				map[d].push(e);
			}
		});
		return map;
	}, [filteredEvents]);
	const upcomingEvents = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		return filteredEvents.filter((e) => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
	}, [filteredEvents]);
	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear((y) => y - 1);
		} else setCurrentMonth((m) => m - 1);
	};
	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear((y) => y + 1);
		} else setCurrentMonth((m) => m + 1);
	};
	const openAdd = (dateStr) => {
		setEditEvent(null);
		setForm({
			title: "",
			date: dateStr || today.toISOString().slice(0, 10),
			type: "Meeting",
			description: ""
		});
		setShowModal(true);
	};
	const openEdit = (evt) => {
		setEditEvent(evt);
		setForm({
			title: evt.title,
			date: evt.date?.slice(0, 10),
			type: evt.type,
			description: evt.description || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title || !form.date) return;
		if (editEvent) saveEvents(events.map((ev) => ev.id === editEvent.id ? {
			...ev,
			...form,
			id: ev.id
		} : ev));
		else saveEvents([...events, {
			...form,
			id: `evt-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this event?")) saveEvents(events.filter((e) => e.id !== id));
	};
	const handleMarkDone = (id) => {
		saveEvents(events.map((e) => e.id === id ? {
			...e,
			done: !e.done
		} : e));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: events.length,
			done: events.filter((e) => e.done).length,
			upcoming: events.filter((e) => new Date(e.date) >= /* @__PURE__ */ new Date()).length,
			thisMonth: events.filter((e) => e.date?.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`)).length
		};
	}, [
		events,
		currentMonth,
		currentYear
	]);
	const calendarCells = [];
	for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
	for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Events",
						value: stats.total,
						color: "#4f46e5"
					},
					{
						label: "Completed",
						value: stats.done,
						color: "#10b981"
					},
					{
						label: "Upcoming",
						value: stats.upcoming,
						color: "#f59e0b"
					},
					{
						label: "This Month",
						value: stats.thisMonth,
						color: "#06b6d4"
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: [
									faCalendarAlt,
									faCheckCircle,
									faClock,
									faFilter
								][i] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center justify-content-between mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-light btn-sm rounded-circle",
												onClick: handlePrevMonth,
												style: {
													width: 36,
													height: 36
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronLeft })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
												className: "fw-bold mb-0",
												children: [
													MONTHS[currentMonth],
													" ",
													currentYear
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-light btn-sm rounded-circle",
												onClick: handleNextMonth,
												style: {
													width: 36,
													height: 36
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronRight })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-primary btn-sm rounded-pill px-3",
										onClick: () => openAdd(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPlus,
											className: "me-1"
										}), " Add Event"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-2 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-7",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group",
											style: { borderColor },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text",
												style: {
													background: isDark ? "#262a3a" : "#f8f9fa",
													borderColor,
													color: mutedColor
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control",
												placeholder: "Search events...",
												value: search,
												onChange: (e) => setSearch(e.target.value),
												style: {
													background: isDark ? "#1a1d29" : "#fff",
													borderColor,
													color: textColor
												}
											})]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select",
											value: filterType,
											onChange: (e) => setFilterType(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "All",
													children: "All Types"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Meeting",
													children: "Meeting"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Deadline",
													children: "Deadline"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Review",
													children: "Review"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Milestone",
													children: "Milestone"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Other",
													children: "Other"
												})
											]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-1",
									children: [DAYS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col text-center small fw-bold py-2",
										style: { color: mutedColor },
										children: d
									}, d)), calendarCells.map((day, i) => {
										const dateStr = day ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
										const dayEvents = monthEvents[dateStr] || [];
										const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col p-1",
											style: { minHeight: 80 },
											children: day && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `rounded-3 p-1 h-100 d-flex flex-column ${isToday ? "border border-primary" : ""}`,
												style: {
													background: isDark ? "#262a3a" : "#f8f9fa",
													cursor: "pointer",
													borderColor: isToday ? "#4f46e5" : "transparent"
												},
												onClick: () => openAdd(dateStr),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `small fw-bold ${isToday ? "text-primary" : ""}`,
														style: { fontSize: 11 },
														children: day
													}), dayEvents.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "badge bg-primary rounded-pill",
														style: { fontSize: 9 },
														children: dayEvents.length
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "d-flex flex-column gap-1 overflow-hidden",
													style: { flex: 1 },
													children: dayEvents.slice(0, 2).map((ev, ei) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "rounded-1 px-1 text-truncate",
														style: {
															fontSize: 10,
															background: `${EVENT_COLORS[EVENT_COLORS.length % (ei + 1)]}22`,
															color: EVENT_COLORS[ei % EVENT_COLORS.length],
															borderLeft: `2px solid ${EVENT_COLORS[ei % EVENT_COLORS.length]}`
														},
														title: ev.title,
														onClick: (e) => {
															e.stopPropagation();
															openEdit(ev);
														},
														children: ev.title
													}, ei))
												})]
											})
										}, i);
									})]
								})
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-lg-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-3",
								children: "Upcoming Events"
							}), upcomingEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-4",
								style: { color: mutedColor },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCalendarAlt,
									className: "fs-2 mb-2 opacity-50"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "small mb-0",
									children: "No upcoming events"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-column gap-2",
								children: upcomingEvents.map((ev, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-start gap-3 p-3 rounded-3",
									style: { background: isDark ? "#262a3a" : "#f8f9fa" },
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
											style: {
												width: 40,
												height: 40,
												background: `${EVENT_COLORS[i % EVENT_COLORS.length]}18`,
												color: EVENT_COLORS[i % EVENT_COLORS.length]
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarAlt })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-grow-1",
											style: { minWidth: 0 },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `fw-bold small text-truncate ${ev.done ? "text-decoration-line-through" : ""}`,
												children: ev.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "extra-small",
												style: { color: mutedColor },
												children: [
													ev.date?.slice(0, 10),
													" • ",
													ev.type
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1 flex-shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm p-1 text-success",
												onClick: () => handleMarkDone(ev.id),
												title: "Toggle done",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm p-1 text-danger",
												onClick: () => handleDelete(ev.id),
												title: "Delete",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})]
										})
									]
								}, ev.id))
							})]
						})
					})
				})]
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editEvent ? "Edit Event" : "New Event"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "Event title"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												className: "form-control",
												required: true,
												value: form.date,
												onChange: (e) => setForm({
													...form,
													date: e.target.value
												})
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label fw-semibold small",
												children: "Type"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select",
												value: form.type,
												onChange: (e) => setForm({
													...form,
													type: e.target.value
												}),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Meeting" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Deadline" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Review" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Milestone" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "3",
											value: form.description,
											onChange: (e) => setForm({
												...form,
												description: e.target.value
											}),
											placeholder: "Optional details"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editEvent ? "Update" : "Add Event"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Planning_Analytics/PmsDocumentation.jsx
var PmsDocumentation = () => {
	const { theme } = useApp();
	const isDark = theme === "dark";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const cardBg = isDark ? "#1a1d29" : "#fff";
	const [docs, setDocs] = (0, import_react.useState)(() => {
		try {
			return JSON.parse(localStorage.getItem("pms_documentation") || "[]");
		} catch {
			return [];
		}
	});
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("All");
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		type: "Document",
		project: "",
		version: "1.0",
		description: "",
		tags: ""
	});
	const save = (data) => {
		setDocs(data);
		localStorage.setItem("pms_documentation", JSON.stringify(data));
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: docs.length,
			docsCount: docs.filter((d) => d.type === "Document").length,
			specs: docs.filter((d) => d.type === "Specification").length,
			reports: docs.filter((d) => d.type === "Report").length
		};
	}, [docs]);
	const filtered = (0, import_react.useMemo)(() => {
		return docs.filter((d) => {
			const match = !search || d.title.toLowerCase().includes(search.toLowerCase()) || (d.project || "").toLowerCase().includes(search.toLowerCase());
			const type = typeFilter === "All" || d.type === typeFilter;
			return match && type;
		});
	}, [
		docs,
		search,
		typeFilter
	]);
	const getIcon = (type) => {
		return {
			Document: faFileAlt,
			Specification: faFileWord,
			Report: faFileExcel,
			Drawing: faFileImage,
			"Meeting Notes": faFileAlt
		}[type] || faFileAlt;
	};
	const getColor = (type) => {
		return {
			Document: "#4f46e5",
			Specification: "#10b981",
			Report: "#f59e0b",
			Drawing: "#06b6d4",
			"Meeting Notes": "#8b5cf6"
		}[type] || "#64748b";
	};
	const openAdd = () => {
		setEditId(null);
		setForm({
			title: "",
			type: "Document",
			project: "",
			version: "1.0",
			description: "",
			tags: ""
		});
		setShowModal(true);
	};
	const openEdit = (d) => {
		setEditId(d.id);
		setForm({
			title: d.title,
			type: d.type,
			project: d.project || "",
			version: d.version || "1.0",
			description: d.description || "",
			tags: d.tags || ""
		});
		setShowModal(true);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!form.title) return;
		if (editId) save(docs.map((d) => d.id === editId ? {
			...d,
			...form
		} : d));
		else save([...docs, {
			...form,
			id: `doc-${Date.now()}`
		}]);
		setShowModal(false);
	};
	const handleDelete = (id) => {
		if (window.confirm("Delete this document?")) save(docs.filter((d) => d.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 px-lg-4 py-4",
		style: { color: textColor },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: [
					{
						label: "Total Documents",
						value: stats.total,
						color: "#4f46e5",
						icon: faFolder
					},
					{
						label: "Documents",
						value: stats.docsCount,
						color: "#4f46e5",
						icon: faFileAlt
					},
					{
						label: "Specifications",
						value: stats.specs,
						color: "#10b981",
						icon: faFileWord
					},
					{
						label: "Reports",
						value: stats.reports,
						color: "#f59e0b",
						icon: faFileExcel
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm h-100",
						style: {
							borderRadius: "16px",
							background: cardBg
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4 d-flex align-items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-3 d-flex align-items-center justify-content-center",
								style: {
									width: 48,
									height: 48,
									background: `${s.color}18`,
									color: s.color,
									fontSize: 20
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: s.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold fs-4",
								style: {
									color: s.color,
									lineHeight: 1.2
								},
								children: s.value
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "small",
								style: {
									color: mutedColor,
									lineHeight: 1.2
								},
								children: s.label
							})] })]
						})
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				style: {
					borderRadius: "16px",
					background: cardBg
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-bold mb-1",
								children: "Document Repository"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0",
								style: { color: mutedColor },
								children: "Manage project documentation, specifications, and reports."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3",
								onClick: openAdd,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), " Add Document"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										style: { borderColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												background: isDark ? "#262a3a" : "#f8f9fa",
												borderColor,
												color: mutedColor
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											placeholder: "Search documents...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											style: {
												background: isDark ? "#1a1d29" : "#fff",
												borderColor,
												color: textColor
											}
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select",
										value: typeFilter,
										onChange: (e) => setTypeFilter(e.target.value),
										style: {
											background: isDark ? "#1a1d29" : "#fff",
											borderColor,
											color: textColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "All",
												children: "All Types"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Document" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Specification" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Report" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Drawing" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Meeting Notes" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "fw-bold",
										style: {
											color: "#4f46e5",
											lineHeight: "38px"
										},
										children: [stats.total, " files"]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "row g-3",
							children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-5",
								style: { color: mutedColor },
								children: "No documents yet. Add your first document."
							}) : filtered.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-6 col-lg-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "card border rounded-3 h-100",
									style: {
										background: isDark ? "#262a3a" : "#f8f9fa",
										borderColor
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "card-body p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-3 d-flex align-items-center justify-content-center flex-shrink-0",
												style: {
													width: 44,
													height: 44,
													background: `${getColor(d.type)}18`,
													color: getColor(d.type),
													fontSize: 18
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: getIcon(d.type) })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: { minWidth: 0 },
												className: "flex-grow-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "fw-bold small text-truncate",
														children: d.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "extra-small",
														style: { color: mutedColor },
														children: [
															d.type,
															" v",
															d.version || "1.0"
														]
													}),
													d.project && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "badge bg-light text-dark rounded-pill mt-1",
														style: { fontSize: 9 },
														children: d.project
													}),
													d.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "extra-small mt-1",
														style: { color: mutedColor },
														children: d.description
													}),
													d.tags && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "d-flex gap-1 mt-1 flex-wrap",
														children: d.tags.split(",").map((t, ti) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "badge rounded-pill",
															style: {
																fontSize: 8,
																background: `${getColor(d.type)}18`,
																color: getColor(d.type)
															},
															children: t.trim()
														}, ti))
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1 justify-content-end mt-2 pt-2",
											style: { borderTop: `1px solid ${borderColor}` },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-primary",
												onClick: () => openEdit(d),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-danger",
												onClick: () => handleDelete(d.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})]
										})]
									})
								})
							}, d.id))
						})
					]
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { background: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog modal-dialog-centered",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						style: {
							background: cardBg,
							borderRadius: "16px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header border-0 pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								children: editId ? "Edit Document" : "Add Document"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											required: true,
											value: form.title,
											onChange: (e) => setForm({
												...form,
												title: e.target.value
											}),
											placeholder: "e.g. Architecture Overview"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "row g-3 mb-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Type"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select",
													value: form.type,
													onChange: (e) => setForm({
														...form,
														type: e.target.value
													}),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Document" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Specification" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Report" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Drawing" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Meeting Notes" })
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Project"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-control",
													value: form.project,
													onChange: (e) => setForm({
														...form,
														project: e.target.value
													}),
													placeholder: "Project name"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-md-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-label fw-semibold small",
													children: "Version"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-control",
													value: form.version,
													onChange: (e) => setForm({
														...form,
														version: e.target.value
													}),
													placeholder: "1.0"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											rows: "2",
											value: form.description,
											onChange: (e) => setForm({
												...form,
												description: e.target.value
											}),
											placeholder: "Brief description"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold small",
											children: "Tags (comma separated)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											className: "form-control",
											value: form.tags,
											onChange: (e) => setForm({
												...form,
												tags: e.target.value
											}),
											placeholder: "architecture, design, v2"
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer border-0 pt-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-light",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary px-4",
									children: editId ? "Update" : "Add Document"
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `.extra-small { font-size: 10px; }` })
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Planning_Analytics/Projectentry.jsx
var EMPTY_FORM = {
	name: "",
	srNo: "",
	client: "",
	description: "",
	submissionTime: "",
	status: "In Progress",
	teamSize: "",
	file: null,
	removeFile: false
};
var formatDateTime = (value) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
};
var Projectentry = ({ projects, setProjects }) => {
	const { addNotification } = useApp();
	const [formData, setFormData] = (0, import_react.useState)(EMPTY_FORM);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [summary, setSummary] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let ignore = false;
		async function loadSummary() {
			try {
				const data = await getProjectSummary();
				if (!ignore) setSummary(data);
			} catch {
				if (!ignore) setSummary(null);
			}
		}
		loadSummary();
		return () => {
			ignore = true;
		};
	}, [projects]);
	const filteredProjects = (0, import_react.useMemo)(() => {
		return (projects || []).filter((project) => {
			const term = search.trim().toLowerCase();
			const matchesSearch = !term || [
				project.name,
				project.srNo,
				project.client,
				project.description
			].filter(Boolean).some((item) => item.toLowerCase().includes(term));
			const matchesStatus = statusFilter === "all" || project.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [
		projects,
		search,
		statusFilter
	]);
	const resetForm = () => {
		setFormData(EMPTY_FORM);
		setEditId(null);
	};
	const refreshProjects = async () => {
		setProjects(await listProjects());
	};
	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const handleFileChange = (event) => {
		const nextFile = event.target.files?.[0] || null;
		setFormData((prev) => ({
			...prev,
			file: nextFile,
			removeFile: false
		}));
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!formData.name || !formData.srNo || !formData.client) {
			addNotification("Project name, serial number, and client are required.", "error");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				name: formData.name.trim(),
				srNo: formData.srNo.trim(),
				client: formData.client.trim(),
				description: formData.description?.trim() || null,
				submissionTime: formData.submissionTime || null,
				status: formData.status || "In Progress",
				teamSize: formData.teamSize === "" ? null : Number(formData.teamSize),
				file: formData.file,
				removeFile: formData.removeFile
			};
			if (editId) {
				await updateProject(editId, payload);
				addNotification("Project updated successfully.", "success");
			} else {
				await createProject(payload);
				addNotification("Project created successfully.", "success");
			}
			await refreshProjects();
			resetForm();
		} catch (err) {
			addNotification(err?.message || "Failed to save project.", "error");
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (project) => {
		if (!project?.id) return;
		if (!window.confirm(`Delete project "${project.name}"?`)) return;
		try {
			await deleteProject(project.id);
			await refreshProjects();
			addNotification("Project removed successfully.", "success");
		} catch (err) {
			addNotification(err?.message || "Failed to delete project.", "error");
		}
	};
	const handleEdit = (project) => {
		setFormData({
			name: project?.name || "",
			srNo: project?.srNo || "",
			client: project?.client || "",
			description: project?.description || "",
			submissionTime: project?.submissionTime ? project.submissionTime.slice(0, 16) : "",
			status: project?.status || "In Progress",
			teamSize: project?.teamSize ?? "",
			file: null,
			removeFile: false
		});
		setEditId(project?.id || null);
	};
	const handleDownload = async (project) => {
		try {
			await downloadFile(project.id, project.fileName || `${project.name}.file`);
		} catch (err) {
			addNotification(err?.message || "Unable to download the file.", "error");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container ",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6 col-xl-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total Projects",
							value: summary?.total ?? projects.length,
							helper: "All tracked records",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faProjectDiagram })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6 col-xl-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "In Progress",
							value: summary?.inProgress ?? projects.filter((item) => item.status === "In Progress").length,
							helper: "Active pipeline",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTasks })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6 col-xl-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Winning Bids",
							value: summary?.win ?? projects.filter((item) => item.status === "Win").length,
							helper: "Successful submissions",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileCircleCheck })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-6 col-xl-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Files Attached",
							value: summary?.withFiles ?? projects.filter((item) => item.hasFile).length,
							helper: "Records with documents",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFolderOpen })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-1 fw-bold",
							children: editId ? "Update project" : "Add new project"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-secondary mb-0",
							children: "Manage projects with document uploads, deadlines, and status tracking."
						})] }), editId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-outline-secondary",
							onClick: resetForm,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faXmark,
								className: "me-2"
							}), "Cancel edit"]
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Project name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faProjectDiagram })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "name",
											className: "form-control",
											value: formData.name,
											onChange: handleChange,
											placeholder: "Enter project title"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Serial number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										name: "srNo",
										className: "form-control",
										value: formData.srNo,
										onChange: handleChange,
										placeholder: "SR-001"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Client"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBuilding })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											name: "client",
											className: "form-control",
											value: formData.client,
											onChange: handleChange,
											placeholder: "Client name"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-xl-12",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										name: "description",
										className: "form-control",
										rows: "3",
										value: formData.description,
										onChange: handleChange,
										placeholder: "Write a concise project overview"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Team size"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faUsers })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											min: "0",
											name: "teamSize",
											className: "form-control",
											value: formData.teamSize,
											onChange: handleChange,
											placeholder: "0"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Submission time"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarAlt })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "datetime-local",
											name: "submissionTime",
											className: "form-control",
											value: formData.submissionTime,
											onChange: handleChange
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label fw-semibold",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										name: "status",
										className: "form-select",
										value: formData.status,
										onChange: handleChange,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "In Progress",
												children: "In Progress"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Win",
												children: "Win"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Lose",
												children: "Lose"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-6 col-xl-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label fw-semibold",
											children: "Attach file"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileUpload })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												className: "form-control",
												onChange: handleFileChange
											})]
										}),
										formData.file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-text",
											children: ["Selected: ", formData.file.name]
										}) : null,
										editId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-check mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "removeFile",
												type: "checkbox",
												className: "form-check-input",
												checked: formData.removeFile,
												onChange: (e) => setFormData((prev) => ({
													...prev,
													removeFile: e.target.checked,
													file: null
												}))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "removeFile",
												className: "form-check-label",
												children: "Remove existing file on save"
											})]
										}) : null
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-end gap-2 mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn btn-outline-secondary",
								onClick: resetForm,
								children: "Reset"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary",
								disabled: saving,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: editId ? faEdit : faPlus,
									className: "me-2"
								}), saving ? "Saving..." : editId ? "Update project" : "Create project"]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mb-1 fw-bold",
							children: "Project register"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-secondary mb-0",
							children: "Search, filter, review, and manage uploaded records from one workspace."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "input-group project-filter-control",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "input-group-text",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: "form-control",
									value: search,
									onChange: (event) => setSearch(event.target.value),
									placeholder: "Search name, client, sr no"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "form-select project-filter-control",
								value: statusFilter,
								onChange: (event) => setStatusFilter(event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All statuses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "In Progress",
										children: "In Progress"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Win",
										children: "Win"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Lose",
										children: "Lose"
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle project-table mb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "SR No" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Project" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Client" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Team" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Submission" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "File" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredProjects.length > 0 ? filteredProjects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									className: "fw-semibold",
									children: project.srNo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-semibold",
										children: project.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-secondary small",
										children: project.description || "No description added"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: project.client
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: project.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: project.teamSize ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: formatDateTime(project.submissionTime)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: project.hasFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-success small fw-semibold",
										children: project.fileName || "Attached"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-secondary small",
										children: "No file"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "var(--text-primary)",
										backgroundColor: "var(--card-bg)",
										borderColor: "var(--border)"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-end gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-outline-primary btn-sm",
												onClick: () => handleEdit(project),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-outline-danger btn-sm",
												onClick: () => handleDelete(project),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "btn btn-outline-success btn-sm",
												onClick: () => handleDownload(project),
												disabled: !project.hasFile,
												title: project.hasFile ? "Download file" : "No file attached",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: project.hasFile ? faFileArrowDown : faFileCircleXmark })
											})
										]
									})
								})
							] }, project.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: "8",
								className: "text-center py-5 text-secondary",
								children: "No matching projects found."
							}) }) })]
						})
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/Planning_Analytics/Report.jsx
Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, plugin_tooltip, plugin_legend);
var Report = ({ projects }) => {
	const total = projects.length;
	const won = projects.filter((p) => p.status === "Win").length;
	const lost = projects.filter((p) => p.status === "Lose").length;
	const progress = projects.filter((p) => p.status === "In Progress").length;
	const barData = {
		labels: [
			"Total",
			"Won",
			"Lost",
			"In Progress"
		],
		datasets: [{
			label: "Projects",
			data: [
				total,
				won,
				lost,
				progress
			],
			backgroundColor: [
				"#4F46E5",
				"#198754",
				"#dc3545",
				"#ffc107"
			]
		}]
	};
	const pieData = {
		labels: [
			"Won",
			"Lost",
			"In Progress"
		],
		datasets: [{
			data: [
				won,
				lost,
				progress
			],
			backgroundColor: [
				"#198754",
				"#dc3545",
				"#ffc107"
			]
		}]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container pe-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Projects",
						value: projects.length,
						helper: "All tracked records",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faProjectDiagram })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In Progress",
						value: projects.filter((item) => item.status === "In Progress").length,
						helper: "Active pipeline",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTasks })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Winning Bids",
						value: projects.filter((item) => item.status === "Win").length,
						helper: "Successful submissions",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileCircleCheck })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-6 col-xl-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Files Attached",
						value: projects.filter((item) => item.hasFile).length,
						helper: "Records with documents",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFolderOpen })
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card p-3 shadow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { data: barData })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-md-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card p-3 shadow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: pieData,
						className: "h-50 w-50 m-auto"
					})
				})
			})]
		})]
	});
};
//#endregion
//#region src/pages/systems/PMS/PmsDashboard.jsx
var PMS_GRADIENT = "linear-gradient(135deg, #4f46e5 0%, #8b5cf6 48%, #06b6d4 100%)";
var domainColor = (label) => {
	const l = String(label || "").toLowerCase();
	if (l.includes("cost") || l.includes("budget") || l.includes("progress")) return "#f59e0b";
	if (l.includes("agile")) return "#8b5cf6";
	if (l.includes("recovery") || l.includes("control")) return "#10b981";
	return "#06b6d4";
};
var domainIcon = (label) => {
	const l = String(label || "").toLowerCase();
	if (l.includes("cost") || l.includes("budget") || l.includes("progress")) return faWallet;
	if (l.includes("agile")) return faLayerGroup;
	if (l.includes("recovery") || l.includes("control")) return faShieldHalved;
	return faCalendarCheck;
};
var MetricCard = ({ icon, label, value, help, accent }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "card border-0 rounded-4 h-100 system-metric-card",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-body p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "system-metric-icon",
					style: {
						background: `${accent}1a`,
						color: accent,
						fontSize: "1.1rem"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "badge bg-success-subtle text-success rounded-pill",
					children: "Live"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "fw-bold mb-1",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				className: "fw-bold text-muted mb-1",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted small mb-0",
				children: help
			})
		]
	})
});
var PmsDashboard = ({ projects = [] }) => {
	const { setActiveTab, theme } = useApp();
	const isDark = theme === "dark";
	const features = flattenFeatures("pms");
	const groups = getFeatureGroups("pms");
	const stats = (0, import_react.useMemo)(() => {
		const records = features.flatMap((feature) => readFeatureRecords("pms", feature.id));
		return {
			total: records.length,
			completed: records.filter((record) => ["Completed", "Approved"].includes(record.status)).length,
			overdue: records.filter((record) => record.dueDate && !["Completed", "Approved"].includes(record.status)).length,
			due: records.filter((record) => record.dueDate).length,
			amount: records.reduce((sum, record) => sum + (Number(record.amount) || 0), 0)
		};
	}, [features]);
	const groupStats = (0, import_react.useMemo)(() => groups.map((group) => {
		const records = group.features.flatMap((feature) => readFeatureRecords("pms", feature.id));
		const completed = records.filter((record) => ["Completed", "Approved"].includes(record.status)).length;
		return {
			...group,
			total: records.length,
			completed,
			progress: records.length ? Math.round(completed / records.length * 100) : 0
		};
	}), [groups]);
	const heroProgress = stats.total ? Math.round(stats.completed / stats.total * 100) : 72;
	const openCount = stats.total - stats.completed;
	const quickActions = [
		{
			id: "projectentry",
			label: "Projects",
			icon: faProjectDiagram
		},
		{
			id: "pms_milestones",
			label: "Milestones",
			icon: faTimeline
		},
		{
			id: "pms_tasks",
			label: "Tasks",
			icon: faTasks
		},
		{
			id: "pms_sprint_management",
			label: "Sprints",
			icon: faRocket
		},
		{
			id: "pms_calendar",
			label: "Calendar",
			icon: faCalendarCheck
		}
	];
	const ringBackground = `conic-gradient(#ffffff ${heroProgress * 3.6}deg, rgba(255,255,255,0.22) 0deg)`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "system-dashboard px-3 px-lg-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "system-dashboard-hero rounded-5 p-4 p-xl-5 mb-4 position-relative",
				style: {
					background: PMS_GRADIENT,
					overflow: "hidden"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row align-items-center g-4 position-relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-xl-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge bg-white text-primary rounded-pill px-3 py-2 fw-bold",
									children: "PROJECT MANAGEMENT SYSTEM"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "badge rounded-pill px-3 py-2 fw-bold",
									style: {
										background: "rgba(255,255,255,0.18)",
										color: "#fff"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faPlay,
										className: "me-1",
										size: "xs"
									}), " Live Portfolio"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-white fw-bold mb-2",
								style: { fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)" },
								children: "Project Delivery Command Center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-white-50 mb-4 fs-6",
								style: { maxWidth: 560 },
								children: "Plan sprints, track cost, budget, progress, resources, risks, and delivery health — all from one cockpit."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-wrap gap-2",
								children: quickActions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-light rounded-pill px-3 fw-semibold",
									onClick: () => setActiveTab(action.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: action.icon,
										className: "me-2"
									}), action.label]
								}, action.id))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "system-hero-glass rounded-4 p-4 h-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 92,
										height: 92,
										borderRadius: "50%",
										background: ringBackground,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										flexShrink: 0
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											width: 64,
											height: 64,
											borderRadius: "50%",
											background: "rgba(15,23,42,0.28)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											flexDirection: "column"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "glass-number",
											style: {
												fontSize: "1rem",
												lineHeight: 1
											},
											children: [heroProgress, "%"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "glass-label",
											style: { fontSize: "0.55rem" },
											children: "health"
										})]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-grow-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between text-white-50 small mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery health" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "fw-bold text-white",
												children: [heroProgress, "%"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between text-white-50 small mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open work items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "fw-bold text-white",
												children: openCount
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between text-white-50 small",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Closed items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "fw-bold text-white",
												children: stats.completed
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row g-3 text-center mt-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "glass-number",
											children: features.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "glass-label",
											children: "Features"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "glass-number",
											children: groups.length
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "glass-label",
											children: "Domains"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "glass-number",
											children: stats.total
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "glass-label",
											children: "Records"
										})]
									})
								]
							})]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faDatabase,
							label: "Working Records",
							value: stats.total,
							help: "Records saved in this browser.",
							accent: "#6366f1"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faCircleCheck,
							label: "Closed Items",
							value: stats.completed,
							help: "Completed or approved workflow items.",
							accent: "#10b981"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faTriangleExclamation,
							label: "Overdue & Open",
							value: stats.overdue,
							help: "Dated items still not closed.",
							accent: "#f43f5e"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
							icon: faWallet,
							label: "Tracked Budget",
							value: stats.amount.toLocaleString(),
							help: "Total amount across feature records.",
							accent: "#06b6d4"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 h-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-between mb-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-1",
									children: "Workspace Launchpad"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted small mb-0",
									children: "Every card opens a working register with CRUD, filters, exports, and recovery."
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-3 mt-1",
								children: features.slice(0, 12).map((feature) => {
									const domain = groupStats.find((g) => g.features.some((f) => f.id === feature.id));
									const color = domain ? domainColor(domain.label) : "#6366f1";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "col-md-6",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "feature-launch-card w-100 text-start",
											onClick: () => setActiveTab(feature.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-start gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "feature-launch-icon",
													style: {
														background: `${color}1a`,
														color
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: getIcon(feature.icon) })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-grow-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "d-flex justify-content-between gap-2 align-items-start",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
																className: "fw-bold mb-1",
																children: feature.label
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faArrowRight,
																className: "mt-1",
																style: { color }
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-muted small mb-1",
															children: feature.description
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "badge rounded-pill",
															style: {
																background: `${color}1a`,
																color,
																fontSize: "0.58rem",
																fontWeight: 700
															},
															children: feature.category
														})
													]
												})]
											})
										})
									}, feature.id);
								})
							})]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-xl-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "feature-launch-icon",
										style: {
											background: "rgba(139,92,246,0.12)",
											color: "#8b5cf6"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faArrowTrendUp })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "fw-bold mb-0",
										children: "Delivery Snapshot"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted small mb-0",
										children: "Progress by domain."
									})] })]
								}), groupStats.map((group) => {
									const color = domainColor(group.label);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "w-100 text-start border-0 bg-transparent mb-3",
										onClick: () => group.features[0] && setActiveTab(group.features[0].id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between align-items-center mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "small fw-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: domainIcon(group.label),
													className: "me-2",
													style: { color }
												}), group.label]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "small text-muted",
												children: [
													group.completed,
													"/",
													group.total,
													" · ",
													group.progress,
													"%"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "progress rounded-pill",
											style: {
												height: 6,
												background: isDark ? "#1e293b" : "#e2e8f0"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "progress-bar rounded-pill",
												style: {
													width: `${group.progress}%`,
													background: color
												}
											})
										})]
									}, group.id);
								})]
							})
						}),
						projects?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4 mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-3",
									children: "Existing Projects"
								}), projects.slice(0, 5).map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between align-items-center small mb-2 p-2 rounded-3",
									style: { background: isDark ? "#1a1d29" : "#f8fafc" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold",
										children: project.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge rounded-pill",
										style: {
											background: "rgba(99,102,241,0.12)",
											color: "#6366f1"
										},
										children: project.status || "Active"
									})]
								}, project.id || project.name))]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "feature-launch-icon",
											style: {
												background: "rgba(16,185,129,0.12)",
												color: "#10b981"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faShieldHalved })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
											className: "fw-bold mb-0",
											children: "System Controls"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted small mb-0",
											children: "Readiness checklist."
										})] })]
									}),
									[
										"Dark mode compatible cards",
										"Mobile responsive layout",
										"CRUD working registers",
										"CSV/JSON/SQL exports",
										"PDF print view",
										"Backup and restore workflow"
									].map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3 p-3 rounded-4 border mb-2",
										style: { borderColor: isDark ? "#2d3248" : "#e2e8f0" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-primary rounded-pill",
											children: index + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-semibold small",
											children: item
										})]
									}, item)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-sm w-100 mt-3",
										style: {
											borderRadius: "10px",
											background: isDark ? "#1e293b" : "#f1f5f9",
											color: "#6366f1",
											fontWeight: 700
										},
										onClick: () => setActiveTab("pms_data_backup"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faGaugeHigh,
											className: "me-2"
										}), "Open Backup & Recovery"]
									})
								]
							})
						})
					]
				})]
			})
		]
	});
};
//#endregion
//#region src/api/pms.js
var listTasks = async (projectId) => {
	return (await client.get(`/projects/${projectId}/tasks`)).data.data;
};
var createTask = async (projectId, data) => {
	const url = projectId ? `/projects/${projectId}/tasks` : "/tasks";
	return (await client.post(url, data)).data.data;
};
var updateTask = async (id, data, options = {}) => {
	return (await client.patch(`/tasks/${id}`, data, options)).data.data;
};
var listMilestones = async (projectId) => {
	return (await client.get(`/projects/${projectId}/milestones`)).data.data;
};
var createMilestone = async (projectId, data) => {
	return (await client.post(`/projects/${projectId}/milestones`, data)).data.data;
};
var updateMilestone = async (id, data) => {
	return (await client.patch(`/milestones/${id}`, data)).data.data;
};
var deleteMilestone = async (id) => {
	return (await client.delete(`/milestones/${id}`)).data;
};
//#endregion
//#region src/pages/systems/PMS/PmsMilestones.jsx
var PmsMilestones = () => {
	const [projects, setProjects] = (0, import_react.useState)([]);
	const [selectedProject, setSelectedProject] = (0, import_react.useState)(null);
	const [milestones, setMilestones] = (0, import_react.useState)([]);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [newMilestone, setNewMilestone] = (0, import_react.useState)({
		title: "",
		due_date: ""
	});
	(0, import_react.useEffect)(() => {
		const fetchProjects = async () => {
			const data = await listProjects();
			setProjects(data);
			if (data.length > 0) setSelectedProject(data[0].id);
		};
		fetchProjects();
	}, []);
	(0, import_react.useEffect)(() => {
		if (selectedProject) {
			const fetchMilestones = async () => {
				setMilestones(await listMilestones(selectedProject));
			};
			fetchMilestones();
		}
	}, [selectedProject]);
	const handleCreate = async (e) => {
		e.preventDefault();
		await createMilestone(selectedProject, newMilestone);
		setMilestones(await listMilestones(selectedProject));
		setShowModal(false);
		setNewMilestone({
			title: "",
			due_date: ""
		});
	};
	const handleStatusChange = async (id, status) => {
		await updateMilestone(id, { status });
		setMilestones(await listMilestones(selectedProject));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "form-select w-auto fw-bold shadow-sm",
					value: selectedProject || "",
					onChange: (e) => setSelectedProject(e.target.value),
					children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.id,
						children: p.name
					}, p.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary shadow-sm",
					onClick: () => setShowModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "New Milestone"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card shadow-sm border-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table table-hover mb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-light",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "Milestone"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Due Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "text-end pe-4",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [milestones.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "ps-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faFlag,
											className: "me-3 text-warning"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-semibold",
											children: m.title
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: m.due_date || "No date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `badge ${m.status === "Completed" ? "bg-success" : "bg-info"}`,
									children: m.status
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end pe-4",
									children: m.status !== "Completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-sm btn-outline-success",
										onClick: () => handleStatusChange(m.id, "Completed"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheckCircle,
											className: "me-1"
										}), "Mark Done"]
									})
								})
							] }, m.id)), milestones.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: "4",
								className: "text-center py-5 text-secondary",
								children: "No milestones found for this project."
							}) })] })]
						})
					})
				})
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "modal-title fw-bold",
								children: "Add Project Milestone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label",
										children: "Milestone Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control",
										required: true,
										value: newMilestone.title,
										onChange: (e) => setNewMilestone({
											...newMilestone,
											title: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "form-label",
										children: "Due Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control",
										value: newMilestone.due_date,
										onChange: (e) => setNewMilestone({
											...newMilestone,
											due_date: e.target.value
										})
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-secondary",
									onClick: () => setShowModal(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary",
									children: "Save Milestone"
								})]
							})]
						})]
					})
				})
			})
		]
	});
};
//#endregion
//#region src/pages/systems/PMS/PmsTasks.jsx
var PmsTasks = () => {
	const [projects, setProjects] = (0, import_react.useState)([]);
	const [selectedProject, setSelectedProject] = (0, import_react.useState)(null);
	const [tasks, setTasks] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [newTask, setNewTask] = (0, import_react.useState)({
		title: "",
		description: "",
		priority: "Medium"
	});
	(0, import_react.useEffect)(() => {
		const fetchProjects = async () => {
			try {
				const data = await listProjects();
				setProjects(data);
				if (data.length > 0) setSelectedProject(data[0].id);
			} catch (err) {
				console.error("Failed to fetch projects", err);
				setError("Failed to load projects. Please refresh the page.");
			}
		};
		fetchProjects();
	}, []);
	(0, import_react.useEffect)(() => {
		if (selectedProject) {
			const fetchTasks = async () => {
				setLoading(true);
				setError(null);
				try {
					setTasks(await listTasks(selectedProject));
				} catch (err) {
					console.error("Failed to fetch tasks", err);
					setError("Failed to load tasks for the selected project.");
				} finally {
					setLoading(false);
				}
			};
			fetchTasks();
		}
	}, [selectedProject]);
	const handleCreateTask = async (e) => {
		e.preventDefault();
		if (!selectedProject) {
			setError("Please select a project first.");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			await createTask(selectedProject, newTask);
			setTasks(await listTasks(selectedProject));
			setShowModal(false);
			setNewTask({
				title: "",
				description: "",
				priority: "Medium"
			});
			setSuccess("Task created successfully!");
			setTimeout(() => setSuccess(null), 3e3);
		} catch (err) {
			console.error("Failed to create task", err);
			setError(err.message || "Failed to create task. Please try again.");
		} finally {
			setSaving(false);
		}
	};
	const handleStatusChange = async (taskId, newStatus) => {
		try {
			await updateTask(taskId, { status: newStatus });
			setTasks(await listTasks(selectedProject));
		} catch (err) {
			console.error("Failed to update task", err);
			setError("Failed to update task status.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4",
		children: [
			success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-success alert-dismissible fade show shadow-sm border-0 rounded-4",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCheckCircle,
						className: "me-2"
					}),
					success,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-close",
						onClick: () => setSuccess(null)
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "alert alert-danger alert-dismissible fade show shadow-sm border-0 rounded-4",
				role: "alert",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faExclamationTriangle,
						className: "me-2"
					}),
					error,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-close",
						onClick: () => setError(null)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex justify-content-between align-items-center mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "fw-bold",
						children: "Project:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "form-select w-auto",
						value: selectedProject || "",
						onChange: (e) => setSelectedProject(e.target.value),
						children: projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p.id,
							children: p.name
						}, p.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary",
					onClick: () => setShowModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faPlus,
						className: "me-2"
					}), "Add Task"]
				})]
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center p-5",
				children: "Loading tasks..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row",
				children: [
					"To Do",
					"In Progress",
					"Done"
				].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-md-4 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card shadow-sm h-100 border-0 bg-light",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-header bg-white border-0 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "mb-0 fw-bold",
								children: status
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card-body p-2",
							children: tasks.filter((t) => t.status === status).map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card border-0 shadow-sm mb-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between align-items-start mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "mb-0 fw-bold text-primary",
											children: task.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `badge ${task.priority === "High" ? "bg-danger" : "bg-info"}`,
											children: task.priority
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "small text-secondary mb-3",
										children: task.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-end gap-2",
										children: [
											status !== "To Do" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-secondary",
												onClick: () => handleStatusChange(task.id, "To Do"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faClock })
											}),
											status !== "In Progress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-warning",
												onClick: () => handleStatusChange(task.id, "In Progress"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExclamationTriangle })
											}),
											status !== "Done" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-outline-success",
												onClick: () => handleStatusChange(task.id, "Done"),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle })
											})
										]
									})
								]
							}, task.id))
						})]
					})
				}, status))
			}),
			showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal show d-block",
				style: { backgroundColor: "rgba(0,0,0,0.5)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-dialog",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-content",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "modal-title",
								children: "Create New Task"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-close",
								onClick: () => setShowModal(false)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleCreateTask,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-body",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label",
											children: "Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control",
											required: true,
											value: newTask.title,
											onChange: (e) => setNewTask({
												...newTask,
												title: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control",
											value: newTask.description,
											onChange: (e) => setNewTask({
												...newTask,
												description: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label",
											children: "Priority"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select",
											value: newTask.priority,
											onChange: (e) => setNewTask({
												...newTask,
												priority: e.target.value
											}),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Low",
													children: "Low"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Medium",
													children: "Medium"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "High",
													children: "High"
												})
											]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "modal-footer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn btn-secondary",
									onClick: () => setShowModal(false),
									disabled: saving,
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary",
									disabled: saving,
									children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "spinner-border spinner-border-sm me-2",
										role: "status",
										"aria-hidden": "true"
									}), "Saving..."] }) : "Create Task"
								})]
							})]
						})]
					})
				})
			})
		]
	});
};
//#endregion
export { FEATURE_REGISTRY as C, getFeatureGroups as D, getFeatureById as E, listProjects as S, getAllFeatures as T, PmsDataBackup as _, deleteMilestone as a, PmsBacklogManagement as b, PmsDashboard as c, PmsDocumentation as d, PmsCalendar as f, PmsBudgetTracking as g, PmsCostTracking as h, createTask as i, Report as l, PmsProgressTracking as m, PmsMilestones as n, updateMilestone as o, PmsResourceAllocation as p, createMilestone as r, updateTask as s, PmsTasks as t, Projectentry as u, PmsSprintManagement as v, flattenFeatures as w, PmsAgileScrum as x, PmsRiskTracking as y };
