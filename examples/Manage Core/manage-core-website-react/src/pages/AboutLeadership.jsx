import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { PageHero, CtaBand, SectionHeader, Reveal } from "@/components/SitePrimitives";
import AboutSubNav from "@/components/AboutSubNav";
import { aboutSections } from "@/data/aboutData";

const section = aboutSections["leadership"];

export default function AboutLeadership() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: "/about/leadership" }]}
        title={<>{section.name} <span className="mc-grad-text">— led by engineers who still ship</span></>}
        lede={section.tagline}
      >
        <AboutSubNav active="leadership" />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="The team" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
          </div>
          <Reveal delay={80}>
            <div className="mc-band" style={{ padding: 28 }}>
              <div className="mc-eyebrow">How we lead</div>
              <ul className="mc-check-list" style={{ marginTop: 14, display: "grid", gap: 8 }}>
                {section.principles.map((p) => (
                  <li key={p}>
                    <span className="mc-tick"><FiCheck /></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Leadership" title="The people shaping delivery" />
          </Reveal>
          <div className="mc-grid-3">
            {section.leaders.map((l, i) => (
              <Reveal key={l.title} delay={i * 60}>
                <article className="mc-card mc-card-hover" style={{ padding: 26 }}>
                  <div className="mc-avatar">{l.initials}</div>
                  <div className="mc-eyebrow" style={{ marginTop: 16 }}>{l.role}</div>
                  <h3 style={{ marginTop: 6, fontSize: 19 }}>{l.title}</h3>
                  <p className="mc-muted" style={{ lineHeight: 1.6, marginTop: 10 }}>{l.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/careers" className="mc-btn mc-btn-primary">{section.hiring} <FiArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Want to work with this team?"
        text="We're hiring — or we'd love to build something with you."
        primary="Start a Project"
        secondary="See Open Roles"
        primaryTo="/contact"
        secondaryTo="/careers"
      />
    </>
  );
}