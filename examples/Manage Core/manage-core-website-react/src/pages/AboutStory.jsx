import React from "react";
import { PageHero, CtaBand, Counter, DashFrame, SectionHeader, Reveal } from "@/components/SitePrimitives";
import AboutSubNav from "@/components/AboutSubNav";
import { aboutSections, aboutShots } from "@/data/aboutData";

const section = aboutSections["our-story"];

export default function AboutStory() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: "/about/our-story" }]}
        title={<>{section.name} <span className="mc-grad-text">— from a software shop to an engineering partner</span></>}
        lede={section.tagline}
      >
        <AboutSubNav active="our-story" />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-stats-about" style={{ marginTop: 0 }}>
            {section.facts.map((f) => (
              <div className="mc-stat-about" key={f.label}>
                <b><Counter value={f.value} suffix={f.suffix} /></b>
                <span className="mc-stat-about-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="How we got here" title={section.headline} />
            </Reveal>
            {section.story.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="mc-muted" style={{ lineHeight: 1.7, marginTop: i === 0 ? 4 : 18 }}>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <DashFrame image={aboutShots["our-story"]} label={section.name} alt={`${section.name} — Manage Core`} />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Milestones" title="The path so far" />
          </Reveal>
          <div className="mc-process" style={{ marginTop: 40 }}>
            {section.milestones.map((m, i) => (
              <Reveal key={m.label} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{m.label}</h3>
                  <p>{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Interested in working with a team that fits?"
        text="Book a free consultation — we map your problem, scope the work and share a plan with no obligation."
        primary="Book a Consultation"
        secondary="Meet the Team"
        primaryTo="/contact"
        secondaryTo="/team"
      />
    </>
  );
}