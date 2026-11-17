import React from "react";
import { FiCheck } from "react-icons/fi";
import { PageHero, CtaBand, DashFrame, SectionHeader, Reveal } from "@/components/SitePrimitives";
import AboutSubNav from "@/components/AboutSubNav";
import { aboutSections, aboutShots } from "@/data/aboutData";

const section = aboutSections["how-we-work"];

export default function AboutApproach() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: "/about/how-we-work" }]}
        title={<>{section.name} <span className="mc-grad-text">— the delivery model behind every engagement</span></>}
        lede={section.tagline}
      >
        <AboutSubNav active="how-we-work" />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="How we work" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
          </div>
          <Reveal delay={100}>
            <DashFrame image={aboutShots["how-we-work"]} label="Connected delivery" alt="Manage Core connected delivery model" />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="The stages" title="Our operating model" />
          </Reveal>
          <div className="mc-process" style={{ marginTop: 40 }}>
            {section.steps.map((s, i) => (
              <Reveal key={s.stage} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{s.stage} — {s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Our commitments" title="What you can expect" />
          </Reveal>
          <div className="mc-svc-cap-grid" style={{ marginTop: 32 }}>
            {section.commitments.map((c) => (
              <div className="mc-svc-cap-chip" key={c}><FiCheck /> {c}</div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Put the process to work for you"
        text="Book a discovery call and see the model in action on your own problem."
        primary="Book a Discovery Call"
        secondary="Why Choose Us"
        primaryTo="/contact"
        secondaryTo="/about/why-choose-us"
      />
    </>
  );
}