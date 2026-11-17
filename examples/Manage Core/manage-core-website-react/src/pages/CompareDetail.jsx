import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiX, FiThumbsUp, FiShuffle } from "react-icons/fi";
import { Reveal, PageHero, FAQItem, CtaBand } from "@/components/SitePrimitives";
import { comparisonOf, relatedComparisons } from "@/data/comparisonData";
import { serviceOf } from "@/data/servicesData";

function Side({ side }) {
  return (
    <div className="mc-card mc-tl-card" style={{ height: "100%" }}>
      <span className="mc-compare-badge">{side.name}</span>
      <p className="mc-muted" style={{ fontSize: 14.5, marginTop: 8 }}>{side.tagline}</p>
      <p style={{ fontSize: 14.5, marginTop: 10 }}>{side.stance}</p>
      {side.metric && (
        <div className="mc-num" style={{ margin: "18px 0" }}>
          <div>
            <h4 style={{ fontSize: 26 }}>{side.metric.value}</h4>
            <p style={{ fontSize: 13 }}>{side.metric.label}</p>
          </div>
        </div>
      )}
      <h4 style={{ margin: "4px 0 12px", color: "var(--ink-hi)" }}>What it's good at</h4>
      <ul className="mc-pros">
        {(side.pros || []).map((p) => (
          <li key={p}><FiCheck /> {p}</li>
        ))}
      </ul>
      <h4 style={{ margin: "18px 0 12px", color: "var(--ink-hi)" }}>Where it costs you</h4>
      <ul className="mc-cons">
        {(side.cons || []).map((c) => (
          <li key={c}><FiX /> {c}</li>
        ))}
      </ul>
      <div className="mc-alert" style={{ marginTop: 18, fontSize: 14 }}>
        <b>Best for:</b> {side.best}
      </div>
    </div>
  );
}

export default function CompareDetail() {
  const slug = routeParam(useParams().slug);
  const comparison = comparisonOf(slug);
  const [openFaq, setOpenFaq] = useState(-1);

  if (!comparison) return <Navigate to="/compare" replace />;

  const more = relatedComparisons(comparison);
  const services = (comparison.relatedServices || [])
    .map((s) => serviceOf(s))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Compare", to: "/compare" },
          { label: comparison.title, to: `/compare/${comparison.slug}` },
        ]}
        kicker="Decision guide"
        title={comparison.title}
        lede={comparison.focus}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiShuffle /> {comparison.left.name} vs {comparison.right.name}</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container" style={{ maxWidth: 1000 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)", marginBottom: 14 }}>{comparison.headline}</h2>
            <p className="mc-muted" style={{ fontSize: 16, lineHeight: 1.7 }}>{comparison.lede}</p>
          </Reveal>
          <div className="mc-grid-2" style={{ marginTop: 40 }}>
            <Reveal><Side side={comparison.left} /></Reveal>
            <Reveal delay={80}><Side side={comparison.right} /></Reveal>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <div className="mc-cta" style={{ background: "linear-gradient(135deg,var(--brand-ink),#0d246e)", textAlign: "left" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <FiThumbsUp size={26} style={{ marginTop: 4, flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: 24, marginBottom: 10 }}>Our honest verdict</h3>
                  <p style={{ fontSize: 15, lineHeight: 1.75 }}>{comparison.verdict}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)", marginBottom: 8 }}>The questions that decide it</h2>
            <p className="mc-muted" style={{ fontSize: 15.5, marginBottom: 32 }}>Walk through these with your stakeholders — the answers usually settle the debate.</p>
          </Reveal>
          <div style={{ display: "grid", gap: 12 }}>
            {comparison.decision.map((d, i) => (
              <Reveal key={d.q} delay={i * 50}>
                <div className="mc-card mc-card-hover" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div className="mc-compare-step">{i + 1}</div>
                  <div>
                    <h4 style={{ marginBottom: 6 }}>{d.q}</h4>
                    <p className="mc-muted" style={{ fontSize: 14.5 }}>{d.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)", marginBottom: 30 }}>Common questions, straight answers</h2>
          </Reveal>
          <div style={{ display: "grid", gap: 12 }}>
            {comparison.faq.map(([q, a], i) => (
              <Reveal key={q} delay={i * 40}>
                <FAQItem q={q} a={a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="mc-slab">
          <div className="mc-container">
            <Reveal>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", marginBottom: 30 }}>How we can help with either path</h2>
            </Reveal>
            <div className="mc-grid-4">
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={i * 60}>
                  <Link to={`/services/${s.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "block", height: "100%" }}>
                    <span className="mc-f-icon"><s.icon /></span>
                    <h4 style={{ margin: "12px 0 8px", fontSize: 16 }}>{s.name}</h4>
                    <p className="mc-muted" style={{ fontSize: 13.5 }}>{s.headline}</p>
                    <span className="mc-res-link" style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)", fontSize: 13.5 }}>
                      View service <FiArrowRight />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", marginBottom: 30 }}>Related comparisons</h2>
            </Reveal>
            <div className="mc-grid-3">
              {more.map((c, i) => (
                <Reveal key={c.slug} delay={i * 60}>
                  <Link to={`/compare/${c.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "block", height: "100%" }}>
                    <span className="mc-compare-badge" style={{ marginBottom: 12 }}>{c.left.name} vs {c.right.name}</span>
                    <h4 style={{ fontSize: 16, marginBottom: 6 }}>{c.title}</h4>
                    <p className="mc-muted" style={{ fontSize: 13.5 }}>{c.focus}</p>
                    <span className="mc-res-link" style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)", fontSize: 13.5 }}>
                      Compare <FiArrowRight />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Stop guessing — get a straight answer"
        text="Tell us the decision you're weighing. We'll give you the trade-offs, the hidden costs and a recommendation you can act on."
        primary="Book a Consultation"
        secondary="See All Comparisons"
        secondaryTo="/compare"
      />
    </>
  );
}
