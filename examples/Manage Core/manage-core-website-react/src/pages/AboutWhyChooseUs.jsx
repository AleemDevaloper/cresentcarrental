import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCpu, FiLock } from "react-icons/fi";
import { PageHero, CtaBand, DashFrame, SectionHeader, Reveal } from "@/components/SitePrimitives";
import AboutSubNav from "@/components/AboutSubNav";
import { aboutSections, aboutShots } from "@/data/aboutData";

const section = aboutSections["why-choose-us"];

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

export default function AboutWhyChooseUs() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: "/about/why-choose-us" }]}
        title={<>{section.name} — <span className="mc-grad-text">built the way serious work should be</span></>}
        lede={section.tagline}
      >
        <AboutSubNav active="why-choose-us" />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-xo-statsrow" style={{ marginTop: 0 }}>
            {section.stats.map((st) => (
              <div className="mc-xo-stat-item" key={st.label}>
                <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>{st.value}{st.suffix}</b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Why Manage Core" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
            <Reveal delay={80} style={{ marginTop: 26 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary">Book a Free Consultation <FiArrowRight /></Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <DashFrame image={aboutShots["why-choose-us"]} label="Unified delivery model" alt="Manage Core delivery platform" />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Why Manage Core" title="Honest comparison against the typical agency model" />
          </Reveal>
          <Reveal delay={80} style={{ marginTop: 44 }}>
            <div className="mc-compare">
              <div className="mc-compare-col mc-compare-win">
                <div className="mc-compare-head"><h3>Manage Core</h3><i aria-hidden="true" /></div>
                <ul className="mc-compare-list">
                  {section.compare.map((r) => (
                    <li key={r.title}>
                      <FiCpu style={{ color: "var(--brand-3)" }} />
                      <span><b>{r.title}.</b> {r.us}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mc-compare-col">
                <div className="mc-compare-head"><h3>Typical agency</h3></div>
                <ul className="mc-compare-list">
                  {section.compare.map((r) => (
                    <li key={r.title}>
                      <FiLock style={{ color: "var(--danger)" }} />
                      <span>{r.other}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Six reasons" title="Why teams choose us" />
          </Reveal>
          <Cards list={section.reasons} render={(r, i) => (
            <article className="mc-card mc-card-hover mc-reason">
              <div className="mc-reason-top">
                <div className="mc-f-icon"><r.icon /></div>
                <span className="mc-reason-num">0{i + 1}</span>
              </div>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              <span className="mc-reason-line" aria-hidden="true" />
            </article>
          )} />
        </div>
      </section>

      <CtaBand
        title="See the difference for yourself"
        text="Start with a free consultation. We'll show you honestly how we'd scope your project."
        primary="Book a Consultation"
        secondary="How We Work"
        primaryTo="/contact"
        secondaryTo="/about/how-we-work"
      />
    </>
  );
}