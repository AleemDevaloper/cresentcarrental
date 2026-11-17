import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { Reveal, PageHero, DashFrame, CtaBand, SectionHeader } from "@/components/SitePrimitives";
import { resources } from "@/data/siteData";
import { resourceGuides } from "@/data/resourceData";

const reportingShot = "/images/company/screens/management-reporting.png";

const resourceTargets = {
  "Demo Center": "/demo",
  "Training Academy": "/training",
  "Insights & Blog": "/blog",
  "Client Reviews": "/reviews",
  "Support Hub": "/support",
  "Security Practice": "/legal#security",
};

export default function Resources() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Resources", to: "/resources" }]}
        title={<>Tools, guidance &amp; support for <span className="mc-grad-text">better decisions</span></>}
        lede="Explore demos, training, insights and the practices we follow for security and support."
      />

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-res-grid">
            {resources.map((r, i) => (
              <Reveal key={r.title} delay={(i % 3) * 80}>
                <Link to={resourceTargets[r.title] || "/contact"} className="mc-card mc-card-hover mc-res-card">
                  <div className="mc-res-glow" aria-hidden="true" />
                  <div className="mc-res-top">
                    <span className="mc-res-icon"><r.icon /></span>
                    <span className="mc-res-tag">{r.tag}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                  <span className="mc-res-link">
                    Explore <FiArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Guides & templates"
              title={<>Honest guidance, <span className="mc-grad-text">no vendor fluff</span></>}
              text="Decision frameworks, templates and checklists we use with clients — free to read."
            />
          </Reveal>
          <div className="mc-guide-grid" style={{ marginTop: 36 }}>
            {resourceGuides.map((g, i) => (
              <Reveal key={g.slug} delay={(i % 3) * 70}>
                <Link to={`/resources/${g.slug}`} className="mc-card mc-card-hover mc-guide-card">
                  <span className="mc-guide-top">
                    <span className="mc-guide-icon"><g.icon /></span>
                    <span className="mc-res-tag">{g.category}</span>
                  </span>
                  <h3>{g.title}</h3>
                  <p>{g.excerpt}</p>
                  <span className="mc-guide-meta">{g.read} read · Updated {g.updated}</span>
                  <span className="mc-res-link">Read guide <FiArrowRight /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)" }}>Free practical guidance, no vendor fluff</h2>
              <p className="mc-muted" style={{ marginTop: 16, lineHeight: 1.7 }}>
                We publish honest material on evaluating software, planning automation and improving operations — the same frameworks we use with clients.
              </p>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div className="mc-band" style={{ padding: 40 }}>
              <div className="mc-eyebrow">What you’ll find</div>
              <ul className="mc-check-list" style={{ marginTop: 16 }}>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Guides.</b> Decision frameworks for software and AI.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Templates.</b> Scope, workflow and migration checklists.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span><b>Case logic.</b> How to evaluate build vs. buy honestly.</span></li>
              </ul>
              <DashFrame
                image={reportingShot}
                label="Management reporting — live"
                alt="Manage Core management reporting dashboard"
                style={{ marginTop: 24 }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Want a resource tailored to your situation?"
        text="Tell us what you’re evaluating and we’ll share the most useful guidance."
        primary="Ask Us Anything"
        secondary="Read the Blog"
        secondaryTo="/blog"
      />
    </>
  );
}

