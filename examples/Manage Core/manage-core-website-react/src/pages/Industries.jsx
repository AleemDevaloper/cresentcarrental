import { Link } from "react-router-dom";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { industries } from "@/data/siteData";

const schoolShot = "/images/company/screens/school-dashboard.png";
const posShot = "/images/company/screens/pos-dashboard.png";
const erpShot = "/images/company/screens/erp-dashboard.png";

export default function Industries() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Industries", to: "/industries" }]}
        title={<>Solutions configured around <span className="mc-grad-text">the work you do</span></>}
        lede="Across every vertical, the principles stay the same: connected records, controlled access, faster reporting and software that adapts to approved workflows."
      />

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-svc-grid">
            {industries.map((ind, i) => (
              <Reveal key={ind.name} delay={(i % 3) * 70}>
                <Link to={`/industries/${ind.slug}`} className="mc-svc-card">
                  <span className="mc-svc-top">
                    <span className="mc-svc-icon"><ind.icon /></span>
                    <span className="mc-svc-num">0{i + 1}</span>
                  </span>
                  <span className="mc-svc-body">
                    <span className="mc-svc-title">{ind.name}</span>
                    <span className="mc-svc-text">{ind.text}</span>
                  </span>
                  <span className="mc-svc-foot">
                    Explore solutions
                    <FiArrowUpRight />
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
            <SectionHeader center eyebrow="Cross-industry" title="One operating model, many verticals" text="A premium design language with practical architecture for operations-heavy industries around the world." />
          </Reveal>
          <div className="mc-grid-4" style={{ marginTop: 40 }}>
            {["ERP", "HRMS", "AI Agents", "CRM", "Cloud", "Web", "Mobile", "SEO"].map((cap, i) => (
              <Reveal key={cap} delay={i * 40}>
                <div className="mc-card mc-card-hover mc-industry" style={{ justifyContent: "center", minHeight: 60 }}>
                  {cap}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Built for real verticals" title="Same platform, configured per industry" text="Every vertical gets connected records, controlled access and reporting built around how their teams actually work." />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 44, alignItems: "start" }}>
            {[
              { img: erpShot, label: "Finance & operations" },
              { img: posShot, label: "Retail & distribution" },
              { img: schoolShot, label: "Education" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <DashFrame image={s.img} label={s.label} alt={`${s.label} interface preview`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Need a system built for your industry?"
        text="Tell us your industry and pain points, and we’ll recommend the fastest, cleanest path forward."
        primary="Start a Project"
        secondary="See Solutions"
        primaryTo="/contact"
        secondaryTo="/solutions"
      />
    </>
  );
}

