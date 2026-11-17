import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiShuffle } from "react-icons/fi";
import { Reveal, PageHero, CtaBand } from "@/components/SitePrimitives";
import comparisons from "@/data/comparisonData";

export default function Compare() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Compare", to: "/compare" }]}
        kicker="Decision guides"
        title={<>The honest <span className="mc-grad-text">build vs buy</span> comparisons</>}
        lede="Every major software decision comes down to a few trade-offs. These guides lay out both sides, the costs that hide, and the framework we use to decide with clients — no filler, no bias toward building."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Build vs buy</span>
          <span className="mc-kicker">Buyer-focused</span>
          <span className="mc-kicker">Evidence over opinion</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-2">
            {comparisons.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 2) * 70}>
                <Link to={`/compare/${c.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="mc-compare-badge">
                    <FiShuffle /> {c.left.name} <span>vs</span> {c.right.name}
                  </div>
                  <h3 style={{ fontSize: 22, lineHeight: 1.25, margin: "14px 0 8px" }}>{c.title}</h3>
                  <p className="mc-muted" style={{ fontSize: 14.5, marginBottom: 12 }}>{c.focus}</p>
                  <p style={{ fontSize: 14.5, flex: 1 }}>{c.lede}</p>
                  <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                    {(c.relatedServices || []).slice(0, 4).map((s) => (
                      <span key={s} className="mc-kicker" style={{ padding: "5px 10px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>{s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}</span>
                    ))}
                  </div>
                  <span className="mc-res-link" style={{ marginTop: 20, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)" }}>
                    Read the comparison <FiArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure which path fits your situation?"
        text="Bring us the decision — we'll walk through the trade-offs with you and recommend the honest answer, even when it isn't a build."
        primary="Talk It Through"
        secondary="See All Services"
        secondaryTo="/services"
      />
    </>
  );
}
