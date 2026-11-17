import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiMonitor, FiZap, FiLock, FiUsers, FiLayers, FiGrid, FiSliders } from "react-icons/fi";
import { Reveal, PageHero, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { solutions, integrations } from "@/data/siteData";

const hrmsShot = "/images/company/screens/hrms-dashboard.png";
const accountingShot = "/images/company/screens/accounting-dashboard.png";
const posShot = "/images/company/screens/pos-dashboard.png";
const schoolShot = "/images/company/screens/school-dashboard.png";
const workflowShot = "/images/company/screens/workflow-dashboard.png";
const webShot = "/images/company/screens/homepage-design.png";
const projectShot = "/images/company/screens/approval-workflow.png";
const aiShot = "/images/company/screens/ai-insights-dashboard.png";
const documentShot = "/images/company/screens/document-processing.png";

const solutionShots = {
  "ai-automation": aiShot,
  "hrms-payroll": hrmsShot,
  "accounting-erp": accountingShot,
  "retail-pos": posShot,
  "school-management": schoolShot,
  "custom-software": workflowShot,
  "custom-websites": webShot,
  "project-systems": projectShot,
  "startup-mvp": documentShot,
};

const solutionLabels = {
  "ai-automation": "AI command center",
  "hrms-payroll": "People Cloud HRMS",
  "accounting-erp": "Accounting ERP",
  "retail-pos": "Retail POS",
  "school-management": "School management",
  "custom-software": "Custom workflow OS",
  "custom-websites": "Website & product design",
  "project-systems": "Approvals & project systems",
  "startup-mvp": "MVP build — live preview",
};

const solutionDetail = {
  "ai-automation": {
    tagline: "Practical AI assistance, document processing and workflow automation on the systems you already use.",
    outcome: "Less repetitive work, faster insight, and AI that behaves like a controlled assistant — not an experiment.",
    features: [
      { icon: <FiZap />, title: "AI chatbot & assistance", text: "Guide users, answer approved questions and support structured lead or service journeys." },
      { icon: <FiLayers />, title: "Ask-your-data experience", text: "Explore authorized business information through a controlled conversational interface." },
      { icon: <FiGrid />, title: "Management summaries", text: "Readable operational, financial or HR summaries prepared from approved data sources." },
      { icon: <FiMonitor />, title: "Document & invoice processing", text: "Extract and route defined information from business documents where the workflow supports it." },
      { icon: <FiZap />, title: "Smart alerts & insights", text: "Highlight exceptions, trends or required reviews using configured business rules and data." },
      { icon: <FiSliders />, title: "Existing-system integration", text: "Connect AI functions through secure APIs and project-specific integration planning." },
    ],
    workflow: ["Scope-first implementation", "Data access & privacy review", "Configure or integrate", "Test against real workflows", "Launch guided", "Refine with monitoring"],
  },
  "hrms-payroll": {
    tagline: "Connect employee records, attendance, leave, overtime, performance and payroll in one controlled workflow.",
    outcome: "Cleaner attendance-to-payroll, traceable approvals and HR reporting your management can trust.",
    features: [
      { icon: <FiUsers />, title: "Employee records", text: "Central profiles with roles, departments, documents and controlled access." },
      { icon: <FiZap />, title: "Attendance & shifts", text: "Clock-in models, shift rules and overtime capture connected to leave." },
      { icon: <FiLayers />, title: "Leave management", text: "Policy-compliant leave requests with approval chains and balances." },
      { icon: <FiGrid />, title: "Payroll & benefits", text: "Reviewed payroll calculations, payslips and statutory reporting." },
      { icon: <FiMonitor />, title: "Performance", text: "Objectives, reviews and development tracking for people decisions." },
      { icon: <FiLock />, title: "Role-based access", text: "Screens and actions limited by responsibility and approval rights." },
    ],
    workflow: ["Map people & payroll workflow", "Translate leave & overtime rules", "Configure modules", "Validate with payroll", "Train administrators", "Operate & support"],
  },
  "accounting-erp": {
    tagline: "Structured records, connected stock movement and management reporting for clearer financial control.",
    outcome: "A finance and inventory workflow that removes the month-end reconciliation scramble.",
    features: [
      { icon: <FiGrid />, title: "Chart of accounts", text: "A structured ledger that keeps financial records consistent." },
      { icon: <FiZap />, title: "Sales & purchase invoices", text: "Invoices, approvals and payments flowing through controlled steps." },
      { icon: <FiLayers />, title: "Receivables & payables", text: "Open balances, aging and settlement tracked against each partner." },
      { icon: <FiMonitor />, title: "Cash & bank", text: "Bank reconciliation and cash position visibility across accounts." },
      { icon: <FiSliders />, title: "Inventory control", text: "Stock movement connected to purchases, sales and adjustments." },
      { icon: <FiLock />, title: "P&L, balance sheet & dashboards", text: "Management reporting built from structured, current records." },
    ],
    workflow: ["Map the finance & stock flow", "Set up chart of accounts", "Configure approvals", "Migrate opening data", "Train & go-live", "Monitor reporting health"],
  },
  "retail-pos": {
    tagline: "Speed up billing, keep cashier controls and connect sales to live inventory across branches.",
    outcome: "Faster checkout, current stock and cleaner daily closings across your stores.",
    features: [
      { icon: <FiZap />, title: "Fast billing", text: "Barcode and touch-friendly checkout built for queue speed." },
      { icon: <FiUsers />, title: "Cashier controls", text: "Per-cashier permissions, discounts, voids and session tracking." },
      { icon: <FiLayers />, title: "Live inventory", text: "Sales, receipts and transfers adjust stock in real time." },
      { icon: <FiGrid />, title: "Branches & returns", text: "Multi-branch operations with return handling and stock corrections." },
      { icon: <FiMonitor />, title: "Closing & sales reports", text: "Daily closing and branch performance reporting without spreadsheets." },
      { icon: <FiLock />, title: "Role-based access", text: "Controls on who can price, discount, void or review sales." },
    ],
    workflow: ["Map store & cashier flow", "Configure products & price lists", "Set branch rules", "Wire inventory", "Train staff", "Operate & support"],
  },
  "school-management": {
    tagline: "Centralize students, admissions, fees, attendance, academics and administration in one platform.",
    outcome: "Consistent student records, clearer fee tracking and centralized administration.",
    features: [
      { icon: <FiUsers />, title: "Students & admissions", text: "Profiles, admissions pipeline and family records in one place." },
      { icon: <FiGrid />, title: "Fees & payments", text: "Fee structures, invoicing, receipts and dues tracking." },
      { icon: <FiZap />, title: "Attendance", text: "Class and daily attendance recorded against students and staff." },
      { icon: <FiLayers />, title: "Academics", text: "Classes, sections, exams and report cards for the academic year." },
      { icon: <FiMonitor />, title: "Examinations", text: "Marks entry, grading and results publishing." },
      { icon: <FiLock />, title: "Administration & reporting", text: "Controlled access and management views for leadership." },
    ],
    workflow: ["Map school operations", "Set fee structures", "Configure classes & terms", "Migrate registers", "Train staff", "Operate academies"],
  },
  "custom-software": {
    tagline: "Build workflows, approvals, dashboards and internal tools around the way your business works.",
    outcome: "Software that fits your exact process — with full ownership of code, data and infrastructure.",
    features: [
      { icon: <FiLayers />, title: "Workflow engines", text: "Approvals, routing and statuses modeled around your process." },
      { icon: <FiGrid />, title: "Domain modules", text: "Records and rules that match your business language." },
      { icon: <FiMonitor />, title: "Dashboards & reporting", text: "Operational and management views built for decisions." },
      { icon: <FiSliders />, title: "Integrations & APIs", text: "Secure connections to the tools and platforms you already use." },
      { icon: <FiZap />, title: "Internal tools", text: "Portals, trackers and utilities your teams actually enjoy." },
      { icon: <FiLock />, title: "Security & audit", text: "Roles, company isolation and audit records by design." },
    ],
    workflow: ["Discover the process", "Architect the modules", "Prototype & validate", "Build in sprints", "Migrate & train", "Support long-term"],
  },
  "custom-websites": {
    tagline: "Fast, conversion-focused corporate, product and SaaS websites that build trust and generate leads.",
    outcome: "A premium digital presence with strong performance, SEO and a clear lead journey.",
    features: [
      { icon: <FiGrid />, title: "Design systems", text: "Reusable components and tokens for a consistent brand." },
      { icon: <FiZap />, title: "Performance-first", text: "Core Web Vitals and speed built in, not bolted on." },
      { icon: <FiMonitor />, title: "Conversion focus", text: "Layouts and flows designed to turn visitors into leads." },
      { icon: <FiLayers />, title: "SaaS product sites", text: "Docs, changelogs and marketing pages that fit your product." },
      { icon: <FiSliders />, title: "CMS & content", text: "Easy content ownership by your marketing team." },
      { icon: <FiLock />, title: "Analytics & SEO", text: "Structured data, sitemaps and measurement from day one." },
    ],
    workflow: ["Discover brand & goals", "Design system & sitemap", "Design & prototype", "Build & optimize", "Launch", "Measure & iterate"],
  },
  "project-systems": {
    tagline: "Project management, document management and workflow systems that keep teams aligned and audit-ready.",
    outcome: "Projects, documents and approvals in one controlled platform with full traceability.",
    features: [
      { icon: <FiLayers />, title: "Project management", text: "Plans, tasks, budgets and status tracking under control." },
      { icon: <FiGrid />, title: "Document management", text: "Versioned documents, metadata and retention rules." },
      { icon: <FiMonitor />, title: "Approval workflows", text: "Sign-offs with clear owners, deadlines and audit trails." },
      { icon: <FiSliders />, title: "Site & job tracking", text: "Field reports tied to projects, cost codes and contracts." },
      { icon: <FiZap />, title: "Notifications", text: "Alerts that keep the right people informed in time." },
      { icon: <FiLock />, title: "Audit-ready records", text: "A history you can defend, export and hand over." },
    ],
    workflow: ["Map projects & documents", "Configure workflows", "Model approvals", "Migrate existing records", "Train teams", "Operate with audit"],
  },
  "startup-mvp": {
    tagline: "Move from idea to a validated, investor-ready MVP with lean product, design and engineering.",
    outcome: "A shippable MVP with real users, clear scope and a roadmap for what comes next.",
    features: [
      { icon: <FiZap />, title: "Lean validation", text: "Test the assumption before building the full product." },
      { icon: <FiGrid />, title: "Product design", text: "Interfaces and flows that feel polished from day one." },
      { icon: <FiLayers />, title: "Core build", text: "The smallest version that solves the core problem." },
      { icon: <FiMonitor />, title: "Metrics wiring", text: "Analytics and feedback loops to learn from users." },
      { icon: <FiSliders />, title: "Iteration", text: "Fast releases driven by evidence, not opinions." },
      { icon: <FiLock />, title: "Foundation for scale", text: "Architecture that doesn't box you in later." },
    ],
    workflow: ["Validate the idea", "Scope the MVP", "Design the experience", "Build & test", "Launch & learn", "Iterate rapidly"],
  },
};

export default function SolutionDetail() {
  const slug = routeParam(useParams().slug);
  const sol = solutions.find((s) => s.slug === slug);
  const detail = solutionDetail[slug];
  const [active, setActive] = useState(0);

  if (!sol || !detail) return <Navigate to="/solutions" replace />;

  const steps = detail.workflow;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Solutions", to: "/solutions" }, { label: sol.title, to: `#` }]}
        title={<>{sol.title.replace(/ & .*/, "")} <span className="mc-grad-text">that fits your operations</span></>}
        lede={detail.tagline}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">{sol.title}</span>
          <span className="mc-kicker">{sol.markets[0]}</span>
          <span className="mc-kicker">Custom scope</span>
        </div>
      </PageHero>

      {/* Outcome ribbon */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-band" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
              <div className="mc-eyebrow">{sol.icon && <sol.icon style={{ verticalAlign: -2, marginRight: 6 }} />} What it delivers</div>
              <p style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 720 }}>{detail.outcome}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 44 }}>
              <div className="mc-eyebrow">Capabilities</div>
              <h2>Everything wired around one connected workflow</h2>
              <p>Each capability is configured or built to the way your teams actually operate.</p>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {detail.features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 60}>
                <article className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow steps */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">Deployment</div>
              <h2>A structured path from discovery to support</h2>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {steps.map((s, i) => (
              <Reveal key={s} delay={(i % 3) * 60}>
                <div className="mc-card mc-card-hover mc-num-card">
                  <span className="mc-n">0{i + 1}</span>
                  <h3 style={{ fontSize: 17 }}>{s}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 36 }}>
              <div className="mc-eyebrow">Connects with</div>
              <h2>Integrations and delivery options</h2>
            </div>
          </Reveal>
          <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 720, margin: "0 auto" }}>
            {(integrations || []).slice(0, 14).map((name) => (
              <span key={name} style={{ padding: "8px 14px", borderRadius: 999, background: "var(--surface)", border: "1px solid var(--line)", color: "var(--muted)", fontSize: 13, fontWeight: 600 }}>{name}</span>
            ))}
          </div>
          <Reveal style={{ marginTop: 34, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">
              Discuss this solution <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Live preview mock */}
      <section className="mc-slab">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <div className="mc-section-header" style={{ marginBottom: 26 }}>
                <div className="mc-eyebrow">Live preview</div>
                <h2>See the workflow before you decide</h2>
                <p>Review screens, watch focused walkthroughs or book a guided session around your own requirements.</p>
              </div>
            </Reveal>
            <div className="mc-demo-split" style={{ gridTemplateColumns: "1fr", gap: 14 }}>
              {["Product screenshots", "Short demo videos", "Guided product demonstration"].map((opt, i) => (
                <Reveal key={opt} delay={i * 60}>
                  <button type="button" className={`mc-card mc-card-hover ${active === i ? "featured" : ""}`} style={{ textAlign: "left", padding: 18, borderColor: active === i ? "var(--brand)" : undefined }} onClick={() => setActive(i)}>
                    <b style={{ fontSize: 15 }}>{opt}</b>
                  </button>
                </Reveal>
              ))}
            </div>
            <Reveal style={{ marginTop: 22 }}>
              <Link to="/demo" className="mc-btn mc-btn-primary">Book a Demo <FiArrowRight /></Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <DashFrame
              image={solutionShots[slug] || workflowShot}
              label={solutionLabels[slug] || "Live preview"}
              alt={`${sol.title} interface preview`}
            />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title={`Ready to explore ${sol.title}?`}
        text="Tell us the workflow you want to fix and we’ll show you — honestly — how this solution fits."
        primary="Book a Consultation"
        secondary="All Solutions"
        secondaryTo="/solutions"
      />
    </>
  );
}

