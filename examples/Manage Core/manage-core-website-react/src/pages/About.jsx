import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCheck, FiLock, FiCpu, FiBriefcase, FiZap, FiLink } from "react-icons/fi";
import { Reveal, SectionHeader, CtaBand, Counter, PageHero } from "@/components/SitePrimitives";
import { valuesXovo, compareXovo } from "@/data/siteData";
import { allServices } from "@/data/servicesData";

const logoMark = "/images/logo1.png";
const aboutImg = "/images/company/aivent/misc/c1.webp";

const facts = [
  { value: 120, suffix: "+", label: "Solutions delivered", icon: FiBriefcase },
  { value: allServices.length, suffix: "", label: "Specialized services", icon: FiCpu },
  { value: 11, suffix: "", label: "Productized AI agents", icon: FiZap },
  { value: 50, suffix: "+", label: "Platform integrations", icon: FiLink },
];

export default function About() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }]}
        title={<>We build AI systems and connected software that create <span className="mc-grad-text">measurable impact</span></>}
        lede="We transform legacy workflows into intelligent, AI-powered systems through disciplined engineering. Every system ships with full ownership handed to you — the code, the trained models, and the infrastructure remain entirely yours."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Hybrid venture studio</span>
          <span className="mc-kicker">Private &amp; secure</span>
          <span className="mc-kicker">You own the IP</span>
        </div>
      </PageHero>

      {/* Company subpage nav */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-about-nav">
              {[
                { to: "/about/our-story", label: "Our Story" },
                { to: "/about/mission-vision", label: "Mission & Vision" },
                { to: "/about/leadership", label: "Leadership" },
                { to: "/about/why-choose-us", label: "Why Choose Us" },
                { to: "/about/values", label: "Values" },
                { to: "/about/how-we-work", label: "How We Work" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="mc-kicker" style={{ textDecoration: "none", cursor: "pointer" }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* By the numbers — upgraded stat cards */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-stats-about-head">
              <div className="mc-eyebrow"><i /> By the numbers</div>
              <p>Proven outcomes across every engagement — private, measurable and owned by you.</p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="mc-stats-about">
              {facts.map((f) => (
                <div className="mc-stat-about" key={f.label}>
                  <span className="mc-stat-about-icon"><f.icon /></span>
                  <b><Counter value={f.value} suffix={f.suffix} /></b>
                  <span className="mc-stat-about-label">{f.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Avent-style about split: subtitle + image + checklist */}
      <section className="mc-slab mc-ai-about-section">
        <div className="mc-container mc-ai-about-split">
          <Reveal>
            <div className="mc-ai-about-copy">
              <div className="mc-eyebrow">About the company</div>
              <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)", marginTop: 16, lineHeight: 1.15 }}>
                We engineer intelligent systems that move from prototype to production
              </h2>
              <p className="mc-muted" style={{ marginTop: 18, lineHeight: 1.7, fontSize: 17 }}>
                From the first whiteboard sketch to a deployed AI agent with monitoring and support,
                our team turns real business problems into measurable outcomes — private by default,
                transparent by design.
              </p>
              <ul className="mc-ai-check-list">
                {["Private & air-gapped deployments", "Monthly product releases, not quarterly promises", "Productized agents + custom builds", "Reviews with the engineers, not sales scripts"].map((c) => (
                  <li key={c}><span className="mc-ai-check"><FiCheck /></span> {c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mc-ai-about-media">
              <img src={aboutImg} alt="Manage Core — connected software team" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Values" title="Principles that shape every engagement" />
          </Reveal>
          <div className="mc-grid-3">
            {valuesXovo.map((v, i) => (
              <Reveal key={v.title} delay={i * 60}>
                <article className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><v.icon /></div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Why Manage Core" title="The agency-model vs. a true AI engineering partner" />
          </Reveal>
          <Reveal>
            <div className="mc-compare">
              {compareXovo.map((col) => (
                <div className={`mc-compare-col ${col.win ? "mc-compare-win" : ""}`} key={col.title}>
                  <div className="mc-compare-head">
                    {col.win ? <FiCpu /> : <FiLock />}
                    <h3>{col.title}</h3>
                  </div>
                  <ul className="mc-compare-items">
                    {col.items.map((it) => (
                      <li key={it}>{col.win ? <FiCheck /> : <span className="mc-x">✕</span>} <span>{it}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container mc-split">
          <Reveal>
            <div className="mc-band" style={{ maxWidth: 440 }}>
              <img src={logoMark} alt="Manage Core logo" style={{ width: 64, marginBottom: 18 }} />
              <div className="mc-eyebrow">One partner, strategy to support</div>
              <h3 style={{ fontSize: 24, lineHeight: 1.25, marginTop: 12 }}>
                Thinking like the engineering team behind the best software companies in the world.
              </h3>
              <p className="mc-muted" style={{ marginTop: 16, lineHeight: 1.65 }}>
                Premium design language. Practical architecture. Honest scope. Long-term support. That’s the Manage Core standard.
              </p>
            </div>
          </Reveal>
          <div>
            <SectionTitle eyebrow="How we work" title="Clear scope, modular delivery, accountable implementation" text="Every engagement connects a defined business problem to the appropriate product, workflow, integration or custom-development path." />
            <Reveal delay={80}>
              <div className="mc-tl-card-wrap" style={{ display: "grid", gap: 14 }}>
                {[
                  ["Business-first discovery", "Requirements start with people, approvals, data and pain points — not a preselected stack."],
                  ["Modular implementation", "Begin with the highest-value module and expand after responsibilities and adoption are established."],
                  ["Truthful capability boundaries", "Standard features, config, integration and custom dev are described separately so expectations stay realistic."],
                  ["Data and access control", "Roles, company boundaries, auditability, deployment and migration are considered in solution design."],
                ].map(([t, d]) => (
                  <div className="mc-card mc-card-hover mc-tl-card" key={t}>
                    <h3>{t}</h3>
                    <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>{d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={140} style={{ marginTop: 30 }}>
              <Link to="/services" className="mc-btn mc-btn-primary">Explore how we help <FiArrowRight /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Avent-style marquee band */}
      <section className="mc-ai-marquee-section" aria-hidden="true">
        <div className="mc-ai-marquee">
          {["Software", "AI Automation", "Real-Time Data", "Connected Systems", "One Platform"].map((w, i) => (
            <span key={w}>
              {i > 0 && <i>/</i>} {w}
            </span>
          ))}
        </div>
      </section>

      <CtaBand
        title="Want to learn more about our approach?"
        text="Talk to the Manage Core team about your business requirements and how we could help."
        primary="Book a Consultation"
        secondary="Meet the Process"
        primaryTo="/contact"
        secondaryTo="/process"
      />
    </>
  );
}

function SectionTitle({ eyebrow, title, text, center }) {
  return (
    <div className={`mc-section-header ${center ? "center" : ""}`} style={{ marginBottom: 30 }}>
      {eyebrow && <div className="mc-eyebrow">{eyebrow}</div>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

