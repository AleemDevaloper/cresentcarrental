import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiMapPin, FiBriefcase, FiClock, FiHeart, FiUsers, FiGlobe } from "react-icons/fi";
import { Reveal, PageHero, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { careers } from "@/data/siteData";

const workflowShot = "/images/company/screens/workflow-dashboard.png";

export default function Careers() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers", to: "/careers" }]}
        title={<>Build the <span className="mc-grad-text">future of autonomous software</span></>}
        lede="Join a remote-first engineering and venture studio team building production AI systems. Work directly with founders and specialists. No busywork, no layers."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiGlobe /> Remote / Global</span>
          <span className="mc-kicker"><FiHeart /> Ship to production</span>
          <span className="mc-kicker"><FiUsers /> Senior-lean teams</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)", marginBottom: 8 }}>Why people join Manage Core</h2>
            <p className="mc-muted" style={{ marginBottom: 36, maxWidth: 680, lineHeight: 1.7 }}>
              A senior team, no layers, no busywork — plus equity in what we build together. Premium projects, real ownership, and teammates who expect honesty over hype.
            </p>
          </Reveal>
          <div className="mc-grid-3">
            {[
              [FiGlobe, "Remote-first culture", "Work from anywhere across our hubs and beyond, async and documented."],
              [FiHeart, "Equity for everyone", "Competitive salary plus meaningful equity so every hire shares in what we build."],
              [FiBriefcase, "Real ownership", "Ship features end to end with founders and specialists — no layers."],
              [FiUsers, "A senior team", "Work directly with people who have shipped AI systems at scale."],
              [FiClock, "Flexible PTO", "Take the time you need with a trust-based, flexible paid-time-off policy."],
              [FiGlobe, "Learning budget", "A dedicated budget for courses, conferences and certifications."],
            ].map(([Icon, t, d], i) => (
              <Reveal key={t} delay={i * 50}>
                <div className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><Icon /></div>
                  <h3 style={{ fontSize: 17 }}>{t}</h3>
                  <p style={{ fontSize: 13.5 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} style={{ marginTop: 44, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            <DashFrame image={workflowShot} label="What we ship together" alt="Manage Core delivery workflow dashboard" />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,44px)", marginBottom: 8 }}>Open roles</h2>
            <p className="mc-muted" style={{ marginBottom: 36, maxWidth: 620, lineHeight: 1.7 }}>
              Don’t see your role? We’re always glad to meet exceptional people — send your profile to hello@managecore.test.
            </p>
          </Reveal>
          <div className="mc-jobs" style={{ display: "grid", gap: 14 }}>
            {careers.map((job, i) => (
              <Reveal key={job.role} delay={i * 40}>
                <Link to={`/careers/${job.slug}`} className="mc-card mc-card-hover mc-job">
                  <div>
                    <h3>{job.role}</h3>
                    <div className="mc-job-meta">
                      <span><FiBriefcase size={14} /> {job.type}</span>
                      <span><FiMapPin size={14} /> {job.location}</span>
                      {job.tags.map((t) => <span key={t} style={{ background: "var(--surface-3)", padding: "3px 9px", borderRadius: 8 }}>{t}</span>)}
                    </div>
                  </div>
                  <span className="mc-btn mc-btn-ghost mc-btn-sm">View role <FiArrowRight /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want to build premium software with us?"
        text="Tell us who you are and what you love building. If there’s a fit, we’ll find a way to work together."
        primary="Get in Touch"
        secondary="Learn About Us"
        secondaryTo="/about"
      />
    </>
  );
}

