import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Reveal, PageHero, FAQItem, CtaBand } from "@/components/SitePrimitives";
import { caseStudies, faqs } from "@/data/siteData";

export default function CaseStudies() {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Case Studies", to: "/case-studies" }]}
        title={<>How our agents perform on <span className="mc-grad-text">real workloads</span></>}
        lede="The problem, the build, and the numbers our clients measured afterward — from procurement and HR automation to unified finance and operations."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiCheck /> Verified, measurable results</span>
          <span className="mc-kicker">Live deployments</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-2">
            {caseStudies.map((cs, i) => (
              <Reveal key={`${cs.slug || i}-${i}`} delay={i * 60}>
                <article className="mc-card mc-card-hover mc-tl-card" style={{ overflow: "hidden", padding: 0 }}>
                  <Link to={`/case-studies/${cs.slug}`} style={{ display: "block" }}>
                    <img src={cs.image} alt={cs.title} style={{ width: "100%", maxHeight: 220, objectFit: "cover" }} />
                    <div style={{ padding: 26 }}>
                      <span className="mc-kicker" style={{ marginBottom: 12 }}>{cs.industry}</span>
                      <h3 style={{ fontSize: 22, lineHeight: 1.25 }}>{cs.title}</h3>
                      <div className="mc-num" style={{ margin: "20px 0" }}>
                        <div>
                          <h4 style={{ fontSize: 15 }}>Operational challenge</h4>
                          <p style={{ fontSize: 14 }}>{cs.challenge}</p>
                        </div>
                      </div>
                      <div className="mc-num" style={{ marginBottom: 20 }}>
                        <div>
                          <h4 style={{ fontSize: 15 }}>Connected workflow</h4>
                          <p style={{ fontSize: 14 }}>{cs.workflow || cs.solution}</p>
                        </div>
                      </div>
                      <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {(cs.modules || cs.results || []).map((m) => (
                          <span key={m} style={{ padding: "5px 10px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>{m}</span>
                        ))}
                      </div>
                      {(cs.metrics || []).length > 0 && (
                        <div className="mc-stats mc-stats-tri" style={{ marginTop: 22, padding: 18 }}>
                          {cs.metrics.map((m) => (
                            <div className="mc-stat" key={m.label}>
                              <b style={{ fontSize: 26 }}>{m.value}</b>
                              <span style={{ fontSize: 12 }}>{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="mc-res-link" style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)" }}>
                        Read the full case study <FiArrowRight />
                      </span>
                    </div>
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-cta" style={{ background: "linear-gradient(135deg,var(--brand-ink),#0d246e)" }}>
              <h2>Want results like these?</h2>
              <p>Let’s map your priority workflow and define a practical implementation path.</p>
              <div className="mc-hero-actions" style={{ marginTop: 26 }}>
                <Link to="/contact" className="mc-btn mc-btn-ink">Book a Consultation <FiArrowRight /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)", marginBottom: 30 }}>Case study questions, answered</h2>
          </Reveal>
          <div style={{ display: "grid", gap: 12 }}>
            {faqs.slice(0, 5).map(([q, a], i) => (
              <Reveal key={q} delay={i * 40}>
                <FAQItem q={q} a={a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Move from manual work to clearer control"
        text="Discuss your priority workflows and define a practical implementation path with our team."
        primary="Book a Consultation"
        secondary="See Solutions"
        secondaryTo="/solutions"
      />
    </>
  );
}