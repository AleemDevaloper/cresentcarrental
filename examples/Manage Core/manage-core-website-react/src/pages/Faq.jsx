import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiCheck, FiArrowRight } from "react-icons/fi";
import { Reveal, PageHero, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { faqs, pricingFactors } from "@/data/siteData";

const managementShot = "/images/company/screens/management-reporting.png";

const extraFaqs = [
  ["Do you offer a free audit?", "Yes — every engagement starts with a free AI audit where we map your workflows and identify the highest-ROI automation to build first."],
  ["How fast do you respond?", "We reply within 24 hours on business days, typically much faster for existing clients."],
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  const all = [...faqs, ...extraFaqs];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Company", to: "/about" }, { label: "FAQ", to: "/faq" }]}
        title={<>Straight answers for <span className="mc-grad-text">serious buyers</span></>}
        lede="Pricing, process, technology and support — answered honestly. If your question isn’t here, ask us directly."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Pricing</span>
          <span className="mc-kicker">Process</span>
          <span className="mc-kicker">Security</span>
          <span className="mc-kicker">Support</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container" style={{ maxWidth: 860 }}>
          <div className="mc-faq" style={{ display: "grid", gap: 12, marginTop: 20 }}>
            {all.map(([q, a], i) => (
              <Reveal key={q} delay={(i % 5) * 40}>
                <FAQItem q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">Pricing factors</div>
              <h2>What we review before issuing a proposal</h2>
              <p>So you always know what you’re paying for — and why.</p>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {pricingFactors.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 60}>
                <article className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><f.icon /></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80} style={{ marginTop: 44, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            <DashFrame image={managementShot} label="Management reporting — your proposed scope, visualized" alt="Manage Core management reporting dashboard" />
          </Reveal>
          <Reveal style={{ marginTop: 34, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">
              Ask us anything <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Still have a question?"
        text="Tell us your business problem — we’ll point you to the right solution, honestly."
        primary="Book a Consultation"
        secondary="Browse Services"
        secondaryTo="/services"
      />
    </>
  );
}

