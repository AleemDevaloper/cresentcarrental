import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiBriefcase, FiMapPin, FiCheck, FiHeart, FiGlobe, FiClock, FiDollarSign } from "react-icons/fi";
import { Reveal, PageHero, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { careers } from "@/data/siteData";

const workflowShot = "/images/company/screens/workflow-dashboard.png";

const benefits = [
  [FiGlobe, "Remote-first", "Work from anywhere across our hubs and beyond — async and documented."],
  [FiHeart, "Equity for everyone", "Competitive salary plus meaningful equity in what we build."],
  [FiClock, "Flexible PTO", "Trust-based, flexible time off."],
  [FiDollarSign, "Learning budget", "Dedicated budget for courses, conferences and certifications."],
];

export default function CareerDetail() {
  const slug = routeParam(useParams().slug);
  const job = careers.find((c) => c.slug === slug);

  if (!job) return <Navigate to="/careers" replace />;

  const others = careers.filter((c) => c.slug !== job.slug).slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Careers", to: "/careers" }, { label: job.role, to: `#` }]}
        title={<>{job.role} <span className="mc-grad-text">@ Manage Core</span></>}
        lede={job.tagline}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiBriefcase /> {job.type}</span>
          <span className="mc-kicker"><FiMapPin /> {job.location}</span>
          {(job.tags || []).map((t) => <span className="mc-kicker" key={t}>{t}</span>)}
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-band" style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between", marginBottom: 34 }}>
              <div>
                <div className="mc-eyebrow">Compensation</div>
                <b style={{ fontSize: 20 }}>{job.compensation}</b>
              </div>
              <Link to="/contact" className="mc-btn mc-btn-primary">
                Apply for this role <FiArrowRight />
              </Link>
            </div>
          </Reveal>

          <div className="mc-split mc-split-job">
            <div style={{ display: "grid", gap: 30 }}>
              <Reveal>
                <div className="mc-card mc-job-section" style={{ padding: 30 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16 }}>What you’ll do</h3>
                  <ul className="mc-check-list">
                    {(job.responsibilities || []).map((r) => (
                      <li key={r}><span className="mc-tick"><FiCheck /></span><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <div className="mc-card mc-job-section" style={{ padding: 30 }}>
                  <h3 style={{ fontSize: 20, marginBottom: 16 }}>What we’re looking for</h3>
                  <ul className="mc-check-list">
                    {(job.requirements || []).map((r) => (
                      <li key={r}><span className="mc-tick"><FiCheck /></span><span>{r}</span></li>
                    ))}
                  </ul>
                  {(job.niceToHave || []).length > 0 && (
                    <>
                      <h3 style={{ fontSize: 17, margin: "22px 0 12px" }}>Nice to have</h3>
                      <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {job.niceToHave.map((n) => (
                          <span key={n} style={{ padding: "6px 12px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontWeight: 600, fontSize: 13 }}>{n}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            </div>

            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              {(job.benefits || []).length > 0 && (
                <Reveal delay={40}>
                  <div className="mc-band" style={{ padding: 26 }}>
                    <div className="mc-eyebrow" style={{ marginBottom: 16 }}>Benefits</div>
                    <div style={{ display: "grid", gap: 14 }}>
                      {benefits.map(([Icon, t, d]) => (
                        <div key={t} style={{ display: "flex", gap: 12 }}>
                          <Icon style={{ color: "var(--brand)", marginTop: 2, flex: "none" }} />
                          <div>
                            <b style={{ fontSize: 14 }}>{t}</b>
                            <div className="mc-muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
              <Reveal delay={80}>
                <div className="mc-card mc-tl-card" style={{ padding: 26 }}>
                  <h4 style={{ marginBottom: 10 }}>How to apply</h4>
                  <p className="mc-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
                    Send your profile and a short note on what you’ve shipped to hello@managecore.test. We reply to everyone within a week.
                  </p>
                  <a to="mailto:hello@managecore.test" className="mc-btn mc-btn-ghost mc-btn-sm" style={{ marginTop: 14 }}>Email us <FiArrowRight /></a>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <DashFrame image={workflowShot} label="What we build" alt="Manage Core delivery workflow dashboard" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header" style={{ marginBottom: 30 }}>
              <div className="mc-eyebrow">More roles</div>
              <h2>Other open positions</h2>
            </div>
          </Reveal>
          <div className="mc-jobs" style={{ display: "grid", gap: 14 }}>
            {others.map((o, i) => (
              <Reveal key={o.role} delay={i * 40}>
                <Link to={`/careers/${o.slug}`} className="mc-card mc-card-hover mc-job">
                  <div>
                    <h3>{o.role}</h3>
                    <div className="mc-job-meta">
                      <span><FiBriefcase size={14} /> {o.type}</span>
                      <span><FiMapPin size={14} /> {o.location}</span>
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
        secondary="About Us"
        secondaryTo="/about"
      />
    </>
  );
}

