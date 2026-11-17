import {
  FiLayers, FiDollarSign, FiBook, FiFileText, FiUsers, FiGrid, FiZap, FiShield,
} from "react-icons/fi";


const erpShot = "/images/company/screens/erp-dashboard.png";
const accountingShot = "/images/company/screens/accounting-dashboard.png";
const schoolShot = "/images/company/screens/school-dashboard.png";
const documentShot = "/images/company/screens/document-processing.png";
const hrmsShot = "/images/company/screens/hrms-dashboard.png";

export const coreProducts = [
  {
    slug: "managecore",
    category: "Core Platform",
    icon: FiLayers,
    title: "ManageCore Platform",
    tagline: "The connected operating system that unifies finance, people, documents, projects and approvals on one controlled layer.",
    image: erpShot,
    text: "ManageCore is our flagship operating platform — a modular core that connects finance, HR, documents, projects, approvals and reporting into a single source of truth. Start with one module and expand without rewriting.",
    metrics: [["12+", "modules on one platform"], ["1", "source of truth"], ["50+", "platform integrations"]],
    outcome: "One controlled platform that replaces disconnected spreadsheets, files and tools with connected, audit-ready operations.",
    features: ["Finance & GL", "People & HR", "Documents", "Projects", "Approvals", "Reporting", "Role-based access", "Audit trails"],
    useCases: ["Executive command center", "Multi-branch consolidation", "Connected approvals", "Live management reporting"],
    pricing: [
      { name: "Starter", audience: "One department or workflow connected into the platform.", price: "From $8,000", priceNote: "single deployment", features: ["2–3 core modules", "Core workflows & roles", "Role-based access", "Dashboards & reporting", "Launch support"], cta: "Get Custom Quote" },
      { name: "Growth", audience: "Growing, multi-department operations on one source of truth.", price: "From $15,000", priceNote: "single deployment", features: ["Everything in Starter", "Additional modules & approvals", "Integrations & APIs", "Audit trails", "Data migration", "Training & documentation"], cta: "Book a Demo", featured: true },
      { name: "Enterprise", audience: "Complex, multi-branch platforms with governance.", price: "Custom Quote", priceNote: "after scoping scope", features: ["Full architecture & branded console", "Multi-company consolidation", "Custom security model", "SLA-backed support", "Roadmap & optimization"], cta: "Talk to a Consultant" },
    ],
    workflow: ["Map your operations", "Select first modules", "Configure & integrate", "Migrate data", "Train your team", "Operate & expand"],
    stack: ["React", "Next.js", "Laravel", "Node.js", "PostgreSQL", "Docker", "AWS"],
    related: ["ams", "edus", "dms", "hrms"],
  },
  {
    slug: "ams",
    category: "Finance",
    icon: FiDollarSign,
    title: "AMS — Accounting Management",
    tagline: "Accounting, invoicing, expenses, receivables and management reporting connected into one controlled ledger.",
    image: accountingShot,
    text: "AMS brings your finance workflow under control: a structured chart of accounts, invoicing and billing, expense management, receivables, approvals and live management reports — replacing the month-end reconciliation scramble.",
    metrics: [["100%", "approval control"], ["62%", "less manual reporting"], ["4.8x", "faster approvals"]],
    outcome: "Controlled, audit-ready financial records with management reporting built from live data instead of manual consolidation.",
    features: ["Chart of accounts", "Invoicing & billing", "Expense management", "Receivables & payables", "Approvals & controls", "Budget vs actual", "Management reporting", "Audit trails"],
    useCases: ["Month-end close without scramble", "Controlled procurement approval", "Cash position visibility", "Budget variance reporting"],
    pricing: [
      { name: "Starter", audience: "A single-entity ledger with invoicing and core reports.", price: "From $6,000", priceNote: "single deployment", features: ["Chart of accounts", "Invoicing & billing", "Cash & bank entries", "Core management reports", "Role-based access"], cta: "Get Custom Quote" },
      { name: "Growth", audience: "Controlled financials with approvals and live reporting.", price: "From $12,000", priceNote: "single deployment", features: ["Everything in Starter", "Approvals & controls", "Expense management", "Receivables & payables", "Budget vs actual", "Management reporting"], cta: "Book a Demo", featured: true },
      { name: "Enterprise", audience: "Multi-branch finance with audit readiness.", price: "Custom Quote", priceNote: "after scoping scope", features: ["Multi-company consolidation", "Complex integrations & migration", "Custom security & audit model", "SLA-backed support", "Roadmap & optimization"], cta: "Talk to a Consultant" },
    ],
    workflow: ["Map the financial flow", "Set up chart of accounts", "Configure approvals", "Migrate opening data", "Train & go-live", "Monitor reporting health"],
    stack: ["React", "Next.js", "Laravel", "Node.js", "PostgreSQL", "AWS"],
    related: ["managecore", "dms", "inventory-management-software"],
  },
  {
    slug: "edus",
    category: "Education",
    icon: FiBook,
    title: "EDUS — Education Management",
    tagline: "Students, admissions, fees, attendance, academics and reporting on one platform for schools and academies.",
    image: schoolShot,
    text: "EDUS centralizes student operations — profiles, admissions, attendance, fee tracking, academics, exams and parent/staff portals — so administration moves from duplicated effort to one controlled view.",
    metrics: [["1", "student record of truth"], ["0", "duplicate data entry"], ["4.8x", "faster reporting"]],
    outcome: "Cleaner student and fee operations with consistent records, clearer fees and centralized administration.",
    features: ["Student profiles", "Admissions", "Attendance", "Fees & receipts", "Academics & exams", "Class & timetable", "Parent & staff portals", "Reports"],
    useCases: ["Admission pipeline tracking", "Fee invoicing & receipts", "Attendance capture", "Report cards & results"],
    pricing: [
      { name: "Starter", audience: "One campus with core student records and attendance.", price: "From $7,000", priceNote: "single deployment", features: ["Student profiles", "Admissions", "Attendance", "Class lists", "Core reports"], cta: "Get Custom Quote" },
      { name: "Growth", audience: "Full fee, academic and timetable operations.", price: "From $14,000", priceNote: "single deployment", features: ["Everything in Starter", "Fees & receipts", "Academics & exams", "Class & timetable", "Parent & staff portals", "Reports & analytics"], cta: "Book a Demo", featured: true },
      { name: "Enterprise", audience: "Multi-campus platforms with custom workflows.", price: "Custom Quote", priceNote: "after scoping scope", features: ["Multi-campus consolidation", "Exam & results workflows", "Custom integrations", "Advanced security & audit", "SLA-backed support"], cta: "Talk to a Consultant" },
    ],
    workflow: ["Map campus operations", "Set fee structures & terms", "Configure academics", "Migrate registers", "Train staff & parents", "Operate academies"],
    stack: ["React", "Next.js", "Laravel PHP", "Node.js", "PostgreSQL", "AWS"],
    related: ["managecore", "dms", "crm-development"],
  },
  {
    slug: "dms",
    category: "Documents",
    icon: FiFileText,
    title: "DMS — Document Management",
    tagline: "Versioned, searchable, permission-controlled documents with approval flows and audit history.",
    image: documentShot,
    text: "DMS gives every document a controlled home: storage and metadata, version control, full-text search, permissions, approval flows and complete audit history — so no one works from an old copy or an email attachment with no record.",
    metrics: [["100%", "version control"], ["0", "lost documents"], ["100%", "audit trail coverage"]],
    outcome: "Findable, controlled, auditable documents across the organization — with approvals built in.",
    features: ["Storage & metadata", "Version control", "Full-text search", "Permission-based access", "Approval flows", "Audit trails", "Document processing", "Integrations"],
    useCases: ["Contract management", "Policy & procedure libraries", "Procurement document flows", "Compliance archives"],
    pricing: [
      { name: "Starter", audience: "A controlled document library with version control.", price: "From $5,000", priceNote: "single deployment", features: ["Storage & metadata", "Version control", "Full-text search", "Permission-based access", "Launch support"], cta: "Get Custom Quote" },
      { name: "Growth", audience: "Documents, approvals and audit across teams.", price: "From $10,000", priceNote: "single deployment", features: ["Everything in Starter", "Approval flows", "Audit trails", "Document processing", "Integrations", "Training & documentation"], cta: "Book a Demo", featured: true },
      { name: "Enterprise", audience: "High-volume, governed document operations.", price: "Custom Quote", priceNote: "after scoping scope", features: ["Custom policies & retention", "High-volume ingestion", "Advanced security & compliance", "Dedicated support", "Roadmap & optimization"], cta: "Talk to a Consultant" },
    ],
    workflow: ["Map document flows", "Configure folders & metadata", "Set permissions", "Build approval flows", "Migrate records", "Operate with audit"],
    stack: ["React", "Next.js", "Node.js", "PostgreSQL", "Elasticsearch", "S3", "AWS"],
    related: ["managecore", "ams", "document-management-software"],
  },
  {
    slug: "hrms",
    category: "People",
    icon: FiUsers,
    title: "HRMS — People & Payroll",
    tagline: "Employee records, attendance, leave, overtime, performance and payroll in one controlled workflow.",
    image: hrmsShot,
    text: "HRMS replaces paper, spreadsheets and disconnected HR tools with one controlled flow — employee records, attendance, leave, overtime, payroll inputs and performance — so payroll is prepared from approved data, not late manual corrections.",
    metrics: [["1", "people data flow"], ["0", "duplicate entries"], ["100%", "traceable approvals"]],
    outcome: "Controlled, audit-ready people data and a payroll process you can trust, end to end.",
    features: ["Employee records", "Attendance & leave", "Overtime & approvals", "Payroll preparation", "Performance & reviews", "Self-service portal", "Reports & analytics", "Role-based access"],
    useCases: ["Attendance-to-payroll flow", "Leave & overtime approvals", "Employee self-service", "HR reporting"],
    pricing: [
      { name: "Starter", audience: "Employee records, attendance and leave for one company.", price: "From $8,000", priceNote: "single deployment", features: ["Employee records", "Attendance", "Leave tracking", "Approvals", "Core HR reports"], cta: "Get Custom Quote" },
      { name: "Growth", audience: "Controlled people data feeding payroll preparation.", price: "From $16,000", priceNote: "single deployment", features: ["Everything in Starter", "Overtime & approvals", "Payroll preparation", "Performance & reviews", "Self-service portal", "Reports & analytics"], cta: "Book a Demo", featured: true },
      { name: "Enterprise", audience: "Multi-company payroll and governance.", price: "Custom Quote", priceNote: "after scoping scope", features: ["Multi-company payroll flow", "Custom rules engine", "Advanced security & audit", "Integrations", "SLA-backed support"], cta: "Talk to a Consultant" },
    ],
    workflow: ["Map people & payroll flow", "Translate leave & overtime rules", "Configure modules", "Validate with payroll", "Train administrators", "Operate & support"],
    stack: ["React", "Next.js", "Laravel PHP", "Node.js", "PostgreSQL", "AWS"],
    related: ["managecore", "dms", "erp-development"],
  },
];

export function coreProductOf(slug) {
  return coreProducts.find((p) => p.slug === slug) || null;
}

export default coreProducts;