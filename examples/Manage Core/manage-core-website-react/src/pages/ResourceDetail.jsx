import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheck, FiClock } from "react-icons/fi";
import { Reveal, PageHero, CtaBand } from "@/components/SitePrimitives";
import { resourceOf, relatedGuides } from "@/data/resourceData";

export default function ResourceDetail() {
  const slug = routeParam(useParams().slug);
  const guide = resourceOf(slug);
  const [copied, setCopied] = useState(false);

  if (!guide) return <Navigate to="/resources" replace />;

  const related = relatedGuides(guide);
  const IconComponent = guide.icon;

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Resources", to: "/resources" },
          { label: guide.category, to: "/resources" },
        ]}
        kicker={<>{IconComponent && <IconComponent size={18} />} {guide.category}</>}
        title={<>{guide.title}</>}
        lede={guide.excerpt}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiClock size={14} /> {guide.read}</span>
          <span className="mc-kicker">Updated {guide.updated}</span>
          <button type="button" className="mc-copy-link" onClick={copyLink}>
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-article">
            {(guide.body || []).map((p, i) => (
              <Reveal key={i} delay={i * 40}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="mc-band mc-takeaways" style={{ marginTop: 32 }}>
            <div className="mc-eyebrow">Key takeaways</div>
            <ul className="mc-check-list" style={{ marginTop: 16 }}>
              {(guide.takeaways || []).map((t) => (
                <li key={t}>
                  <span className="mc-tick"><FiCheck /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/resources" className="mc-btn mc-btn-ghost"><FiArrowLeft /> All Resources</Link>
            <Link to="/contact" className="mc-btn mc-btn-primary">Talk to Us About This <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <h2 style={{ fontSize: "clamp(28px,3.6vw,40px)" }}>Related guidance</h2>
            </Reveal>
            <div className="mc-guide-grid" style={{ marginTop: 28 }}>
              {related.map((g, i) => (
                <Reveal key={g.slug} delay={i * 70}>
                  <Link to={`/resources/${g.slug}`} className="mc-card mc-card-hover mc-guide-card">
                    <span className="mc-guide-top">
                      <span className="mc-guide-icon"><g.icon /></span>
                      <span className="mc-res-tag">{g.category}</span>
                    </span>
                    <h3>{g.title}</h3>
                    <p>{g.excerpt}</p>
                    <span className="mc-res-link">Read guide <FiArrowRight /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Have the questions this guide doesn’t answer?"
        text="Our team uses these frameworks daily — ask us directly and get a straight answer."
        primary="Ask a Question"
        secondary="All Resources"
        primaryTo="/contact"
        secondaryTo="/resources"
      />
    </>
  );
}