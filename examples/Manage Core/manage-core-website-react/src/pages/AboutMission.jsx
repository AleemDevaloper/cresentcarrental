import React from "react";
import { FiCheck } from "react-icons/fi";
import { PageHero, CtaBand, SectionHeader, Reveal } from "@/components/SitePrimitives";
import AboutSubNav from "@/components/AboutSubNav";
import { aboutSections } from "@/data/aboutData";

const section = aboutSections["mission-vision"];

function Cards({ list, render }) {
  return (
    <div className="mc-grid-3">
      {list.map((item, i) => (
        <Reveal key={item.title || item.label} delay={(i % 3) * 60}>
          {render(item, i)}
        </Reveal>
      ))}
    </div>
  );
}

export default function AboutMission() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: "/about/mission-vision" }]}
        title={<>{section.name} <span className="mc-grad-text">— why we build, and where we're going</span></>}
        lede={section.tagline}
      >
        <AboutSubNav active="mission-vision" />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-2">
            <Reveal>
              <article className="mc-card mc-card-hover" style={{ padding: 32 }}>
                <div className="mc-eyebrow">Mission</div>
                <h3 style={{ marginTop: 12, fontSize: 20 }}>{section.headline}</h3>
                <p className="mc-muted" style={{ lineHeight: 1.7, marginTop: 14 }}>{section.mission}</p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="mc-card mc-card-hover" style={{ padding: 32 }}>
                <div className="mc-eyebrow">Vision</div>
                <h3 style={{ marginTop: 12, fontSize: 20 }}>A world where software fits the organization</h3>
                <p className="mc-muted" style={{ lineHeight: 1.7, marginTop: 14 }}>{section.vision}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="What we stand for" title="Four commitments" />
          </Reveal>
          <Cards list={section.pillars} render={(p) => (
            <article className="mc-card mc-card-hover mc-feature">
              <div className="mc-f-icon"><p.icon /></div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          )} />
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="How we measure ourselves" title="The outcomes we hold ourselves to" />
          </Reveal>
          <ul className="mc-check-list" style={{ maxWidth: 720, display: "grid", gap: 10 }}>
            {section.goals.map((g) => (
              <li key={g}>
                <span className="mc-tick"><FiCheck /></span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Share your mission with us"
        text="Tell us what you're building towards — we'll help you scope the software that gets you there."
        primary="Start a Conversation"
        secondary="Why Choose Us"
        primaryTo="/contact"
        secondaryTo="/about/why-choose-us"
      />
    </>
  );
}