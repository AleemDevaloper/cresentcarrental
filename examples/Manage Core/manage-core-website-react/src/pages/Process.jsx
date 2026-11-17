import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiCalendar, FiUsers, FiSettings } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { processDetail, faqs } from "@/data/siteData";

const workflowShot = "/images/company/screens/workflow-dashboard.png";

export default function Process() {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Process", to: "/process" }]}
        title={<>A structured path <span className="mc-grad-text">from discovery to support</span></>}
        lede="Each engagement is organized around clear requirements, controlled delivery, user validation and a practical transition into live operations."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiUsers /> People-first delivery</span>
          <span className="mc-kicker"><FiCalendar /> Milestone-driven</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-timeline">
            {processDetail.map((p, i) => (
              <Reveal key={p.stage} delay={i * 50}>
                <div className="mc-tl-item">
                  <div className="mc-tl-stage">0{i + 1} · {p.stage}</div>
                  <div className="mc-card mc-card-hover mc-tl-card">
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Delivery principles" title="Clear scope. Controlled delivery. Accountable hand-off." text="Process is not overhead — it’s how we keep business risk visible and outcomes measurable." />
            </Reveal>
            <Reveal delay={80}>
              <ul className="mc-check-list">
                <li><span className="mc-tick"><FiCheck /></span><span><b>Documented scope.</b> Modules, responsibilities, assumptions and exclusions confirmed before build.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Visible progress.</b> Dashboards, demos and weekly reviews keep you in control.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Adoption built in.</b> Training and go-live support are part of delivery, not an upsell.</span></li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <DashFrame
              image={workflowShot}
              label="Programme health — live"
              alt="Delivery programme dashboard with progress tracking"
            />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <SectionHeader center eyebrow="Process FAQ" title="How delivery works, in plain language" />
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
        title="Discuss your implementation path"
        text="Tell us where you are today and where you want to be — we’ll map the fastest, safest route."
        primary="Book a Consultation"
        secondary="See Pricing"
        secondaryTo="/pricing"
      />
    </>
  );
}

