import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { solutions, faqs } from "@/data/siteData";

const hrmsShot = "/images/company/screens/hrms-dashboard.png";
const accountingShot = "/images/company/screens/accounting-dashboard.png";
const posShot = "/images/company/screens/pos-dashboard.png";
const schoolShot = "/images/company/screens/school-dashboard.png";
const workflowShot = "/images/company/screens/workflow-dashboard.png";
const webShot = "/images/company/screens/homepage-design.png";
const projectShot = "/images/company/screens/approval-workflow.png";
const aiShot = "/images/company/screens/ai-insights-dashboard.png";

const solutionShots = {
  "ai-automation": aiShot,
  "hrms-payroll": hrmsShot,
  "accounting-erp": accountingShot,
  "retail-pos": posShot,
  "school-management": schoolShot,
  "custom-software": workflowShot,
  "custom-websites": webShot,
  "project-systems": projectShot,
  "startup-mvp": workflowShot,
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

export default function Solutions() {
  const [active, setActive] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Solutions", to: "/solutions" }]}
        title={<>Choose a ready solution or <span className="mc-grad-text">commission a custom build</span></>}
        lede="From connected ERP, HRMS and retail to AI integration and custom builds — each solution focuses on real operational outcomes."
      />

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-3">
            {solutions.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <button
                  type="button"
                  className={`mc-card mc-card-hover mc-feature ${i === active ? "featured" : ""}`}
                  style={{ textAlign: "left", cursor: "pointer", width: "100%", borderColor: i === active ? "var(--brand)" : undefined }}
                  onClick={() => setActive(i)}
                >
                  <div className="mc-f-icon"><s.icon /></div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {(s.markets || []).slice(0, 3).map((m) => (
                      <span key={m} style={{ padding: "5px 10px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>{m}</span>
                    ))}
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Active solution highlight */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container mc-split">
          <div>
            <Reveal key={`a-${active}`}>
              <SectionHeader eyebrow="Selected solution" title={solutions[active].title} text={solutions[active].text} />
            </Reveal>
            <Reveal key={`b-${active}`} delay={60}>
              <div className="mc-check-list" style={{ marginTop: 24 }}>
                {(solutions[active].markets || []).map((m) => (
                  <li key={m}><span className="mc-tick"><FiCheck /></span><span><b>{m}.</b> Supported with connected workflows, controlled access and visible outcomes.</span></li>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120} style={{ marginTop: 28 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary">Discuss this solution <FiArrowRight /></Link>
            </Reveal>
          </div>
          <Reveal key={`d-${active}`} delay={80}>
            <DashFrame
              image={solutionShots[solutions[active].slug] || workflowShot}
              label={solutionLabels[solutions[active].slug] || "Live preview"}
              alt={`${solutions[active].title} interface preview`}
            />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <SectionHeader center eyebrow="FAQ" title="Solution questions, answered" />
          </Reveal>
          <div style={{ display: "grid", gap: 12, marginTop: 36 }}>
            {faqs.slice(0, 5).map(([q, a], i) => (
              <Reveal key={q} delay={i * 40}>
                <FAQItem q={q} a={a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure which solution fits?"
        text="We’ll map your priority workflow and recommend the right starting module."
        primary="Book a Consultation"
        secondary="Explore Products"
        primaryTo="/contact"
        secondaryTo="/products"
      />
    </>
  );
}

