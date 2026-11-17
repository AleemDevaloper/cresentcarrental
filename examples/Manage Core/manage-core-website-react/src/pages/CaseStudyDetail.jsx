import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiCheck, FiShield, FiTarget } from "react-icons/fi";
import { Reveal, PageHero, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { caseStudies } from "@/data/siteData";

function normalizeMetrics(cs) {
  if (cs.metrics?.length) {
    return cs.metrics.map((m) =>
      Array.isArray(m) ? { value: m[0], label: m[1] } : m
    );
  }
  return (cs.results || []).slice(0, 3).map((r) => ({
    value: "✓",
    label: typeof r === "string" ? r : String(r),
  }));
}

export default function CaseStudyDetail() {
  const slug = routeParam(useParams().slug);
  const cs = caseStudies.find((c) => c.slug === slug);

  if (!cs) return <Navigate to="/case-studies" replace />;

  const related = caseStudies.filter((c) => c.slug !== cs.slug).slice(0, 3);
  const metrics = normalizeMetrics(cs);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Case Studies", to: "/case-studies" }, { label: cs.industry, to: `/case-studies` }]}
        title={<>{cs.title.split(" — ")[0]}.<span className="mc-grad-text">Measured results.</span></>}
        lede={cs.tagline}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">{cs.industry}</span>
          <span className="mc-kicker">Live deployment</span>
          {(cs.modules || []).slice(0, 3).map((m) => <span className="mc-kicker" key={m}>{m}</span>)}
        </div>
      </PageHero>

      {/* Stats band */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-stats mc-stats-metrics">
              {metrics.map((m) => (
                <div className="mc-stat" key={m.label}>
                  <b><span className="mc-grad-text" style={{ fontSize: 40 }}>{m.value}</span></b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container mc-split">
          <div className="mc-news-body" style={{ display: "grid", gap: 20 }}>
            <Reveal>
              <div className="mc-ai-hero-side" style={{ marginBottom: 6 }}>
                <span className="mc-kicker"><FiTarget /> The engagement</span>
              </div>
            </Reveal>
            {(cs.story || []).map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--ink)" }}>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80}>
            <DashFrame
              image={cs.image}
              label={cs.industry}
              alt={`${cs.title} interface preview`}
            />
          </Reveal>
        </div>
      </section>

      {/* Challenge / workflow / impact */}
      <section className="mc-slab">
        <div className="mc-container mc-split" style={{ alignItems: "stretch" }}>
          <Reveal>
            <div className="mc-card mc-tl-card" style={{ padding: 30, height: "100%" }}>
              <div className="mc-eyebrow" style={{ marginBottom: 12 }}>Operational challenge</div>
              <p style={{ lineHeight: 1.7, color: "var(--muted)" }}>{cs.challenge}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mc-card mc-tl-card" style={{ padding: 30, height: "100%" }}>
              <div className="mc-eyebrow" style={{ marginBottom: 12 }}>Connected workflow</div>
              <p style={{ lineHeight: 1.7, color: "var(--muted)" }}>{cs.workflow || cs.solution}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Takeaways */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">What moved</div>
              <h2>The measured outcomes</h2>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {(cs.takeaways || cs.results || []).map((t, i) => (
              <Reveal key={i} delay={(i % 3) * 60}>
                <article className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><FiCheck /></div>
                  <h3>{typeof t === "string" ? t : t.title}</h3>
                  <p>{typeof t === "string" ? cs.solution : t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Modules used */}
      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 760, textAlign: "center" }}>
          <Reveal>
            <div className="mc-eyebrow" style={{ justifyContent: "center", marginBottom: 14 }}>Solutions deployed</div>
            <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {(cs.modules || []).map((m) => (
                <span key={m} style={{ padding: "8px 14px", borderRadius: 999, background: "color-mix(in srgb, var(--brand) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--brand) 22%, transparent)", color: "var(--brand-3)", fontWeight: 700, fontSize: 13.5 }}>{m}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header" style={{ marginBottom: 36 }}>
              <div className="mc-eyebrow">More case studies</div>
              <h2>Related deployments</h2>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {related.map((r, i) => (
              <Reveal key={r.slug} delay={i * 60}>
                <Link to={`/case-studies/${r.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "block", padding: 0, overflow: "hidden" }}>
                  <img src={r.image} alt={r.title} style={{ width: "100%", height: 150, objectFit: "cover" }} />
                  <div style={{ padding: 20 }}>
                    <span className="mc-kicker">{r.industry}</span>
                    <h3 style={{ fontSize: 16.5, lineHeight: 1.3, marginTop: 8 }}>{r.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want results documented like this?"
        text="Let’s map your priority workflow and define a measured implementation path."
        primary="Book a Consultation"
        secondary="See Solutions"
        secondaryTo="/solutions"
      />
    </>
  );
}