import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCheck, FiCpu, FiShield, FiZap, FiLayers, FiServer, FiSmartphone, FiTrendingUp } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { technologies } from "@/data/siteData";

const webShot = "/images/company/screens/cms-dashboard.png";

const icons = [FiLayers, FiServer, FiCpu, FiShield, FiSmartphone, FiTrendingUp];

export default function Technologies() {
  const entries = Object.entries(technologies);
  return (
    <>
      <PageHero
        crumbs={[{ label: "Technologies", to: "/technologies" }]}
        title={<>Modern stack, <span className="mc-grad-text">enterprise discipline</span></>}
        lede="A pragmatic technology set selected per project — never a forced stack, always maintainable, documented and scalable."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiZap /> Performance-first</span>
          <span className="mc-kicker"><FiShield /> Security-native</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-2">
            {entries.map(([group, items], i) => (
              <Reveal key={group} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-tl-card">
                  <div className="mc-f-icon" style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 14, background: "var(--brand-soft)", color: "var(--brand)", fontSize: 20, marginBottom: 18 }}>
                    {React.createElement(icons[i] || FiCpu)}
                  </div>
                  <h3>{group}</h3>
                  <div className="mc-tech-cloud" style={{ marginTop: 16 }}>
                    {items.map((t) => (
                      <span className="mc-tech-pill" key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Why it matters" title="Technology is a means, not the message" text="We choose tools that keep your system fast, secure, maintainable and easy to extend — and we document every decision." />
          </Reveal>
          <div className="mc-grid-4" style={{ marginTop: 40 }}>
            {[
              ["Right tool, right job", "Selected per project after discovery."],
              ["Maintainable code", "Reusable components and clear APIs."],
              ["Documented decisions", "Architecture explained to your team."],
              ["No lock-in", "Portable, standards-based systems."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 50}>
                <div className="mc-card mc-card-hover mc-num" style={{ padding: 24 }}>
                  <h4 style={{ fontSize: 16, lineHeight: 1.3 }}>{t}</h4>
                  <p className="mc-muted" style={{ fontSize: 13.5, marginTop: 8, lineHeight: 1.55 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">Discuss your stack <FiArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Built to perform" title="The interface is the product" text="Every dashboard, portal and screen is engineered for speed, security and clarity — whatever stack powers it." />
            </Reveal>
            <Reveal delay={80}>
              <div className="mc-check-list" style={{ marginTop: 24 }}>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Fast by default.</b> Optimized rendering, caching and asset delivery.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Accessible & responsive.</b> Works across devices and follows WCAG guidance.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Secure everywhere.</b> Auth, roles, audit trails and safe defaults baked in.</span></li>
              </div>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <DashFrame image={webShot} label="CMS & admin — live" alt="CMS dashboard preview" />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Let’s architect the right stack for your project"
        text="Share your goals and constraints, and we’ll recommend a pragmatic, maintainable technology set."
        primary="Start a Project"
        secondary="See the Process"
        secondaryTo="/process"
      />
    </>
  );
}

