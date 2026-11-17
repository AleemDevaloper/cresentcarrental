import React from "react";
import { PageHero, CtaBand, SectionHeader, Reveal } from "@/components/SitePrimitives";
import AboutSubNav from "@/components/AboutSubNav";
import { aboutSections } from "@/data/aboutData";

const section = aboutSections["values"];

export default function AboutValues() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: "/about/values" }]}
        title={<>{section.name} <span className="mc-grad-text">— principles that shape every engagement</span></>}
        lede={section.tagline}
      >
        <AboutSubNav active="values" />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Values" title={section.headline} />
          </Reveal>
          <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
        </div>
        <div className="mc-container" style={{ marginTop: 36 }}>
          <div className="mc-grid-3">
            {section.values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 60}>
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

      <CtaBand
        title="Work with a team that shares these values"
        text="We build software the way we'd want it built for ourselves — owned, honest and supported."
        primary="Start a Project"
        secondary="About Our Story"
        primaryTo="/contact"
        secondaryTo="/about/our-story"
      />
    </>
  );
}