import {
  FiZap, FiBriefcase, FiLayers, FiShield, FiBook, FiHeart, FiTool,
  FiBox, FiHome, FiTruck, FiShoppingBag, FiDollarSign,
} from "react-icons/fi";


const startupShot = "/images/company/screens/homepage-design.png";
const smeShot = "/images/company/screens/workflow-dashboard.png";
const enterpriseShot = "/images/company/screens/erp-dashboard.png";
const governmentShot = "/images/company/screens/cms-dashboard.png";
const educationShot = "/images/company/screens/school-dashboard.png";
const healthcareShot = "/images/company/screens/student-management.png";
const constructionShot = "/images/company/screens/approval-workflow.png";
const manufacturingShot = "/images/company/screens/inventory-dashboard.png";
const realEstateShot = "/images/company/screens/product-page.png";
const logisticsShot = "/images/company/screens/inventory-dashboard.png";
const ecommerceShot = "/images/company/screens/pos-dashboard.png";
const financialShot = "/images/company/screens/financial-reports.png";

export const industryShots = {
  startups: startupShot,
  smes: smeShot,
  enterprise: enterpriseShot,
  government: governmentShot,
  education: educationShot,
  healthcare: healthcareShot,
  construction: constructionShot,
  manufacturing: manufacturingShot,
  "real-estate": realEstateShot,
  logistics: logisticsShot,
  ecommerce: ecommerceShot,
  "financial-services": financialShot,
};

export const industryIcons = {
  startups: FiZap,
  smes: FiBriefcase,
  enterprise: FiLayers,
  government: FiShield,
  education: FiBook,
  healthcare: FiHeart,
  construction: FiTool,
  manufacturing: FiBox,
  "real-estate": FiHome,
  logistics: FiTruck,
  ecommerce: FiShoppingBag,
  "financial-services": FiDollarSign,
};

export function industryDetailOf(slug) {
  return industryDetails[slug] || null;
}

export const industryDetails = {
  startups: {
    name: "Startups",
    headline: "From validated idea to a shippable product your market pays for",
    tagline: "Lean MVPs, product design and engineering built to test demand, gather feedback and create momentum.",
    overview:
      "Startups win by shipping fast and learning faster. We help founders define the right MVP, build it with architecture that can grow, and wire in the measurement and iteration loops that turn early usage into product-market fit. You keep full ownership of the code and data.",
    problems: [
      "Building too much before proving demand",
      "MVP scope that balloons beyond the core value",
      "Design and engineering teams that don't speak the same language",
      "No feedback loop from early customers",
    ],
    whoNeeds: "Founders and pre-seed teams ready to test a product idea quickly with real users, without over-investing.",
    capabilities: [
      "MVP definition & validation",
      "Product design & branding",
      "Rapid full-stack builds",
      "Landing pages & waitlists",
      "Analytics & feedback wiring",
      "Investor-ready demos",
      "Iteration roadmaps",
      "Launch support",
    ],
    services: ["mvp-development", "product-development", "saas-development", "ui-ux-design", "web-development", "digital-marketing"],
    workflow: ["Validate the assumption", "Scope the sharp MVP", "Design the experience", "Build & test", "Launch & learn", "Iterate on real usage"],
    stats: [
      { value: 8, suffix: " wks", label: "Typical MVP timeline" },
      { value: 100, suffix: "%", label: "Source code ownership" },
      { value: 60, suffix: "%", label: "Faster validation with our loop" },
      { value: 3, suffix: "+", label: "Launch partners per product" },
    ],
    faqs: [
      ["How quickly can we get an MVP built?", "Focused MVPs can ship in 6–10 weeks depending on scope. We confirm a realistic timeline at scoping and phase the build so you see something working early."],
      ["Do we own the product and code?", "Yes. Source code, data and infrastructure are owned by you after handover. We build for portability, not lock-in."],
      ["Can you help after the MVP launches?", "Yes — iteration is the point. We set up analytics, review real usage with you and plan the next release cycle around evidence."],
    ],
  },
  smes: {
    name: "SMEs",
    headline: "Replace spreadsheets, files and manual work with one connected system",
    tagline: "ERP, CRM, HRMS, inventory and automation built around how your business already operates.",
    overview:
      "Most SME friction lives in disconnected tools: finance in one spreadsheet, stock in another, approvals in email. We consolidate your operation onto controlled, connected systems that fit your workflows — so reporting is live, approvals are traceable and your team stops re-entering the same data.",
    problems: [
      "Disconnected spreadsheets with no source of truth",
      "Approvals and follow-ups lost in email",
      "Late, manual month-end reporting",
      "No live view of sales, stock or cash",
    ],
    whoNeeds: "Growing SMEs whose operations run on manual records and disconnected tools, and whose reporting never quite answers management questions.",
    capabilities: [
      "Accounting & finance systems",
      "Inventory & procurement",
      "CRM & sales pipelines",
      "HR & payroll workflows",
      "Approval & audit controls",
      "Management dashboards",
      "Integrations with existing tools",
      "Training & adoption",
    ],
    services: ["erp-development", "crm-development", "finance-management-systems", "inventory-management-software", "hrms-development", "business-automation-consulting", "business-process-automation"],
    workflow: ["Map your operations", "Find the highest-friction flows", "Scope connected modules", "Build & migrate data", "Train your team", "Operate & improve"],
    stats: [
      { value: 62, suffix: "%", label: "Less manual reporting" },
      { value: 4.8, suffix: "x", label: "Faster approvals" },
      { value: 1, suffix: "", label: "Source of truth" },
      { value: 18, suffix: "", label: "Workflows automated" },
    ],
    faqs: [
      ["We can't afford a full ERP — can we start with one module?", "Yes. A modular rollout can begin with the highest-priority workflow — finance, inventory or CRM — and expand as dependencies and the roadmap allow."],
      ["Can our existing Excel data be imported?", "Suitable spreadsheets can be mapped, cleaned and imported after format, quality and validation are reviewed."],
      ["Do you provide training for our team?", "Yes. Administrator and end-user training is planned for the selected modules and roles."],
    ],
  },
  enterprise: {
    name: "Enterprise",
    headline: "Enterprise platforms engineered for scale, security and control",
    tagline: "Architecture, integrations, governance and auditability built from day one — not bolted on later.",
    overview:
      "Enterprise software carries higher stakes: more users, more departments, compliance and audit requirements, and long lifecycles. We build platforms that start with the right architecture — single source of truth, role-based access, an integration layer and observability — so they scale and stay maintainable for years.",
    problems: [
      "Departments working on disconnected tools",
      "Compliance, audit and access-control requirements",
      "Systems that can't scale with the business",
      "Long-term maintenance of fragile platforms",
    ],
    whoNeeds: "Enterprise and large SME organizations running complex operations across finance, sales, HR, operations and management reporting.",
    capabilities: [
      "Enterprise architecture",
      "Multi-tenant platforms",
      "SSO & role-based access",
      "Workflow & approval engines",
      "Integration hub & APIs",
      "Data governance",
      "Executive reporting & BI",
      "Audit readiness",
    ],
    services: ["enterprise-software-development", "erp-development", "cybersecurity", "security-compliance", "cloud-solutions", "api-development"],
    workflow: ["Assess the landscape", "Architect the target state", "Plan phased rollout", "Integrate & secure", "Migrate & govern", "Operate with SLA"],
    stats: [
      { value: 99.9, suffix: "%", label: "Target availability" },
      { value: 50, suffix: "+", label: "Platform integrations" },
      { value: 100, suffix: "%", label: "Source code ownership" },
      { value: 24, suffix: "/7", label: "Monitoring mindset" },
    ],
    faqs: [
      ["How do you handle multiple departments and permissions?", "Every platform we build uses a role- and permission-based access model, so each department sees exactly the records and actions its responsibilities allow."],
      ["What about compliance and audit requirements?", "Audit trails, access controls and documented governance are part of the standard delivery model. We map controls to your target frameworks (SOC 2, ISO 27001, GDPR and sector requirements)."],
      ["Can you integrate with our existing enterprise systems?", "Yes. An integration layer is part of the architecture, connecting ERP, CRM, HR, finance and communication tools with clean APIs and webhooks."],
    ],
  },
  government: {
    name: "Government",
    headline: "Transparent, audit-ready and controlled digital public services",
    tagline: "Systems with clear access control, complete audit trails and reporting your public can trust.",
    overview:
      "Public sector systems demand transparency, privacy and auditability above all. We build controlled platforms for citizen services, internal administration, record management and reporting — designed with role-based access, complete audit trails and the documentation standards public bodies require.",
    problems: [
      "Legacy systems with unclear ownership",
      "Manual record-keeping and reporting",
      "Access control and audit gaps",
      "Citizen services that are slow or opaque",
    ],
    whoNeeds: "Public bodies and agencies that need transparent, controlled and audit-ready digital systems.",
    capabilities: [
      "Citizen & internal portals",
      "Record & document systems",
      "Approval & workflow controls",
      "Role-based access",
      "Complete audit trails",
      "Transparent reporting",
      "Data protection & privacy",
      "Migration from legacy systems",
    ],
    services: ["software-development", "document-management-software", "cybersecurity", "security-compliance", "custom-business-software"],
    workflow: ["Understand the mandate", "Design for transparency", "Configure controls & audit", "Migrate records safely", "Train administrators", "Operate with accountability"],
    stats: [
      { value: 100, suffix: "%", label: "Audit trail coverage" },
      { value: 0, suffix: "", label: "Records lost in transition" },
      { value: 24, suffix: "/7", label: "Availability mindset" },
      { value: 3, suffix: "+", label: "Privacy frameworks supported" },
    ],
    faqs: [
      ["How do you ensure data privacy and protection?", "Privacy is built into the design: role-based access, encryption, documented data-handling controls and auditable activity across the system."],
      ["Can you migrate our legacy records?", "Yes. We follow a tested migration plan that prepares, validates and transfers suitable records with full rollback options."],
      ["Do you document systems for official use?", "Yes. Architecture, APIs, processes and controls are documented to the standard public administration teams require."],
    ],
  },
  education: {
    name: "Education",
    headline: "One platform for students, admissions, fees and academics",
    tagline: "Schools, colleges and academies running students, attendance, fees and academics on one controlled system.",
    overview:
      "Schools run on records and fees, yet often manage them in separate files and receipts. We build education management platforms that centralize student profiles, admissions, attendance, fee tracking, academics and reporting — so administration moves from duplicated effort to one controlled view.",
    problems: [
      "Student records not centralized",
      "Fees tracked in notes and spreadsheets",
      "Attendance and academics unconnected",
      "No clear reporting for leaders and parents",
    ],
    whoNeeds: "Schools, colleges, academies and universities that need cleaner student, fee and academic operations.",
    capabilities: [
      "Student profiles & admissions",
      "Fee management & receipts",
      "Attendance tracking",
      "Academics, exams & report cards",
      "Class & timetable",
      "Parent & staff portals",
      "Reports & analytics",
      "Online payments",
    ],
    services: ["education-management-software", "crm-development", "web-development", "document-management-software", "business-automation-consulting"],
    workflow: ["Map campus operations", "Set fee structures & terms", "Configure academics", "Migrate registers", "Train staff & parents", "Operate academies"],
    stats: [
      { value: 1, suffix: "", label: "Student record of truth" },
      { value: 0, suffix: "", label: "Duplicate data entry" },
      { value: 4.8, suffix: "x", label: "Faster reporting" },
      { value: 100, suffix: "%", label: "Fee traceability" },
    ],
    faqs: [
      ["Can multiple campuses use one system?", "Yes. Multi-campus platforms support separate schools or branches with controlled access and consolidated reporting for leadership."],
      ["Can parents check attendance and fees?", "Yes. Parent portals provide controlled self-service views of attendance, fees, notices and academic progress."],
      ["Do you handle exam and report card workflows?", "Yes — marks entry, grading, report cards and result publishing are supported."],
    ],
  },
  healthcare: {
    name: "Healthcare",
    headline: "Healthcare systems designed for patients, clinics and privacy",
    tagline: "Patient records, appointments, billing and compliance in one controlled, secure platform.",
    overview:
      "Healthcare needs secure, controlled systems more than any other industry. We build management platforms for patient records, appointments, billing, prescriptions and compliance — designed with access controls, audit trails and the sensitivity your environment requires.",
    problems: [
      "Patient records scattered and insecure",
      "Appointments and billing disconnected",
      "Compliance and access-control concerns",
      "Manual admin consuming clinical time",
    ],
    whoNeeds: "Clinics, hospitals, labs and healthcare services that need organized patient operations without compromising privacy.",
    capabilities: [
      "Patient records & profiles",
      "Appointments & scheduling",
      "Billing & payments",
      "Prescriptions & notes",
      "Role-based access",
      "Audit trails",
      "Reports & analytics",
      "Integration readiness",
    ],
    services: ["healthcare-management-systems", "ai-development", "ai-automation", "cybersecurity", "document-management-software"],
    workflow: ["Review privacy scope", "Configure roles & records", "Wire appointments & billing", "Set compliance controls", "Migrate patient data", "Operate securely"],
    stats: [
      { value: 100, suffix: "%", label: "Access controlled" },
      { value: 0, suffix: "", label: "Private data leaks" },
      { value: 24, suffix: "/7", label: "System availability" },
      { value: 100, suffix: "%", label: "Audit trail coverage" },
    ],
    faqs: [
      ["How do you protect sensitive patient data?", "Access controls, audit trails and documented handling are built in. Deployment can be configured for private or on-premises environments where required."],
      ["Can the system integrate with existing practice tools?", "Yes. Integration readiness is part of the design, connecting to the scheduling, billing and documentation tools you already use."],
      ["Do you support role-based permissions for staff?", "Yes — doctors, nurses, admin and management see exactly the records and actions their roles allow."],
    ],
  },
  construction: {
    name: "Construction",
    headline: "Construction systems for projects, sites, costs and compliance",
    tagline: "Projects, site work, materials, costs and documentation connected and audit-ready.",
    overview:
      "Construction runs on coordination across sites, materials, budgets and documents. We build construction management systems that connect projects, site tasks, material requests, costs, approvals and documents — so every site and every approver works from the same record.",
    problems: [
      "Projects and sites run on scattered sheets and chats",
      "Material requests lost in the field",
      "Actual costs unclear against budgets",
      "Documentation and sign-offs not centralized",
    ],
    whoNeeds: "Construction and engineering firms managing multiple sites, workers, materials and client documentation.",
    capabilities: [
      "Projects & sites",
      "Material & equipment requests",
      "Daily reports",
      "Cost tracking",
      "Approvals & sign-offs",
      "Documents & drawings",
      "Worker & task management",
      "Compliance records",
    ],
    services: ["construction-management-software", "project-management-software", "document-management-software", "mobile-app-development", "inventory-management-software"],
    workflow: ["Map sites & workflows", "Set cost codes & budgets", "Configure requests & approvals", "Wire field reporting", "Migrate documents", "Operate with audit"],
    stats: [
      { value: 100, suffix: "%", label: "Request traceability" },
      { value: 0, suffix: "", label: "Lost paperwork on site" },
      { value: 4.6, suffix: "x", label: "Faster approvals" },
      { value: 24, suffix: "/7", label: "Field availability" },
    ],
    faqs: [
      ["Can field teams request materials from mobile?", "Yes. Mobile-first request flows let site teams raise material, equipment and task requests that route straight into the approval process."],
      ["How do you track actual costs against budget?", "Cost tracking connects requests, purchases and site reports to budget codes, giving project leaders a live view of committed versus actual spend."],
      ["Is documentation audit-ready?", "Yes — drawings, sign-offs, daily reports and compliance records are centralized with version control and audit trails."],
    ],
  },
  manufacturing: {
    name: "Manufacturing",
    headline: "Production, inventory and quality systems that keep the plant visible",
    tagline: "From raw materials to finished goods — one view of production, stock and quality.",
    overview:
      "Manufacturing profitability lives in the flow of materials, production and quality. We build systems that connect purchase, inventory, production movement, quality checks and management reporting — so plant and office work from the same live record, and quality issues are caught early.",
    problems: [
      "Stock counts that never match reality",
      "Production movement tracked on paper",
      "Quality checks invisible until too late",
      "No live view of costs and waste",
    ],
    whoNeeds: "Manufacturers who need their materials, production, quality and reporting connected into one controlled operating layer.",
    capabilities: [
      "Raw materials & finished goods",
      "Bill of materials",
      "Production movement tracking",
      "Quality checks & holds",
      "Purchase & supplier flows",
      "Reordering & alerts",
      "Batch & expiry tracking",
      "Production reporting",
    ],
    services: ["inventory-management-software", "erp-development", "machine-learning", "computer-vision", "software-development"],
    workflow: ["Map the production flow", "Configure materials & BOMs", "Set quality gates", "Wire stock movement", "Train operators", "Optimize with data"],
    stats: [
      { value: 0, suffix: "", label: "Reconciled inventories" },
      { value: 40, suffix: "%", label: "Less manual tracking" },
      { value: 99, suffix: "%", label: "Stock accuracy target" },
      { value: 100, suffix: "%", label: "Quality gate coverage" },
    ],
    faqs: [
      ["Can you track work-in-progress?", "Yes. Production movement tracking connects raw materials, work-in-progress and finished goods so stock is current at every stage."],
      ["How do quality checks work?", "Quality gates with holds and approvals let you control and document each inspection point, with non-conformances flagged to the right owner."],
      ["Can AI help with forecasting and inspection?", "Yes — machine learning for demand forecasting and computer vision for automated quality inspection are part of our AI practice for manufacturers."],
    ],
  },
  "real-estate": {
    name: "Real Estate",
    headline: "Leads, properties, contracts and finance on one growth platform",
    tagline: "Property portals, CRM, contract workflows and financial tracking built for brokers, developers and managers.",
    overview:
      "Real estate moves on leads, listings and documents. We build platforms that connect property marketing with a CRM, track inquiries through viewing and contract, and manage the finance behind each deal — so brokers spend time closing, not re-keying data.",
    problems: [
      "Leads and viewings not tracked",
      "Property listings managed in scattered sheets",
      "Contracts and documents without control",
      "Finance for each deal unclear",
    ],
    whoNeeds: "Agencies, brokers, developers and property managers who need their pipeline, documents and deal finance operating as one system.",
    capabilities: [
      "Property listings & portals",
      "Lead & inquiry management",
      "Viewing scheduling",
      "Contract & document workflows",
      "Commission tracking",
      "Customer & owner portals",
      "Marketing integrations",
      "Deal reporting",
    ],
    services: ["crm-development", "web-development", "document-management-software", "digital-marketing", "finance-management-systems"],
    workflow: ["Map the deal flow", "Configure listings & CRM", "Set contract workflows", "Wire owner & client portals", "Migrate listings", "Grow the pipeline"],
    stats: [
      { value: 100, suffix: "%", label: "Deal traceability" },
      { value: 3, suffix: "x", label: "Faster follow-ups" },
      { value: 0, suffix: "", label: "Lost leads" },
      { value: 1, suffix: "", label: "Source of truth" },
    ],
    faqs: [
      ["Can we publish listings to multiple portals?", "Yes. Listings managed in one system can feed your website and external portals through integrations and clean data export."],
      ["How do you handle commissions and deal finance?", "Commission tracking and per-deal finance connect each sale to its costs, fees and payouts for clear reporting."],
      ["Do clients get self-service access?", "Yes — controlled owner and client portals provide document access, payment status and agreed information without extra admin work."],
    ],
  },
  logistics: {
    name: "Logistics",
    headline: "Tracking, dispatch and fulfillment systems that keep goods moving",
    tagline: "Orders, inventory, dispatch and delivery visibility connected end to end.",
    overview:
      "Logistics businesses live on visibility: where the stock is, what's dispatched, what's on the road and what's arriving. We build systems that connect order intake, inventory, dispatch, tracking and delivery reporting — so dispatchers, drivers and customers all see the same live state.",
    problems: [
      "Orders and dispatch tracked in spreadsheets",
      "No live delivery visibility",
      "Stock and shipments out of sync",
      "Exception handling that's slow and manual",
    ],
    whoNeeds: "Distribution, freight, courier and fulfillment teams that need live visibility across inventory, dispatch and delivery.",
    capabilities: [
      "Order & dispatch management",
      "Inventory & warehouse control",
      "Driver & vehicle assignment",
      "Delivery tracking",
      "Proof of delivery",
      "Exception & delay alerts",
      "Customer notifications",
      "Operational dashboards",
    ],
    services: ["inventory-management-software", "erp-development", "mobile-app-development", "ai-development", "cloud-solutions"],
    workflow: ["Map the fulfillment flow", "Configure orders & stock", "Wire dispatch & drivers", "Add tracking & proof", "Train operations", "Optimize routes with data"],
    stats: [
      { value: 95, suffix: "%", label: "On-time delivery target" },
      { value: 40, suffix: "%", label: "Less manual coordination" },
      { value: 24, suffix: "/7", label: "Live visibility" },
      { value: 0, suffix: "", label: "Lost consignments" },
    ],
    faqs: [
      ["Can drivers update delivery status from the field?", "Yes. Mobile-first flows let drivers update status, capture proof of delivery and receive assignments without paperwork."],
      ["How do customers get tracking updates?", "Automated notifications keep customers informed of dispatch and delivery milestones from the same data your team sees."],
      ["Can AI help with route optimization and forecasting?", "Yes — AI supply-chain tools predict demand and optimize routes, reducing cost and improving on-time delivery."],
    ],
  },
  ecommerce: {
    name: "E-commerce",
    headline: "Stores, orders, inventory and growth running as one engine",
    tagline: "Web stores, order management, stock and marketing connected into a system that compounds.",
    overview:
      "E-commerce grows when store, orders, inventory and marketing share one source of truth. We build online stores and the connected back office — order management, stock sync, payment flows and the analytics that show what's working — so growth is a system, not a scramble.",
    problems: [
      "Store and stock out of sync",
      "Orders managed manually",
      "No clear view of what's profitable",
      "Marketing without attribution to revenue",
    ],
    whoNeeds: "Retail and D2C brands, marketplaces and stores that want their storefront, operations and growth working from one operating layer.",
    capabilities: [
      "Web store & product pages",
      "Cart & payment flows",
      "Order management",
      "Inventory sync",
      "Customer accounts",
      "Marketing & SEO",
      "Analytics & attribution",
      "Fraud & access controls",
    ],
    services: ["web-development", "inventory-management-software", "digital-marketing", "mobile-app-development", "custom-business-software", "crm-development"],
    workflow: ["Map the customer journey", "Configure store & payments", "Wire inventory sync", "Set order workflows", "Launch & optimize", "Scale with data"],
    stats: [
      { value: 100, suffix: "%", label: "Stock in sync" },
      { value: 3, suffix: "x", label: "Faster order processing" },
      { value: 100, suffix: "%", label: "Payment traceability" },
      { value: 24, suffix: "/7", label: "Store availability" },
    ],
    faqs: [
      ["Can you build a store on our existing platform?", "Yes — or we can build a custom storefront. We integrate with your payment, shipping, accounting and marketing tools either way."],
      ["How do you keep inventory in sync with the store?", "Order and inventory management share one source of truth, so every sale adjusts live stock and triggers reordering alerts automatically."],
      ["Do you handle digital marketing and SEO?", "Yes. Digital growth services span SEO, paid ads, content and email — measured against the revenue they generate."],
    ],
  },
  "financial-services": {
    name: "Financial Services",
    headline: "Control, reporting and compliance for financial operations",
    tagline: "Finance systems with approvals, audit trails and live management reporting.",
    overview:
      "Finance is where control matters most. We build finance systems that connect invoicing, expenses, receivables, payments and reporting — with approvals, audit trails and live management reports replacing the month-end scramble.",
    problems: [
      "Invoices and expenses tracked loosely",
      "Cash position unclear until month-end",
      "No approval control on spend",
      "Management reports built by hand",
    ],
    whoNeeds: "Finance teams, accountants, SMEs and financial institutions that need controlled, audit-ready financial records and faster, dependable reporting.",
    capabilities: [
      "Invoicing & billing",
      "Expense management",
      "Receivables & payments",
      "Approvals & controls",
      "Budget versus actual",
      "Management reporting",
      "Audit trails",
      "Integrations",
    ],
    services: ["finance-management-systems", "erp-development", "software-development", "cybersecurity", "backup-disaster-recovery"],
    workflow: ["Map the financial flow", "Set the chart of accounts", "Configure approvals", "Migrate opening data", "Train & go-live", "Monitor reporting health"],
    stats: [
      { value: 100, suffix: "%", label: "Approval control" },
      { value: 62, suffix: "%", label: "Less manual reporting" },
      { value: 4.8, suffix: "x", label: "Faster approvals" },
      { value: 100, suffix: "%", label: "Audit trail coverage" },
    ],
    faqs: [
      ["How do you ensure spend is controlled?", "Approval workflows and role-based access ensure every significant transaction follows documented authorization, with a complete audit trail."],
      ["Can we get live management reporting?", "Yes. Dashboards and reports are built from current, controlled records — replacing month-end consolidation with live answers."],
      ["Do you support multi-company or multi-branch accounts?", "Yes. Multi-company and multi-branch requirements are handled with controlled access, consolidation and reporting."],
    ],
  },
};

export default { industryDetails, industryShots, industryIcons };