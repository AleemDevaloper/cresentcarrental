import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiInfo, FiShuffle } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, FAQItem, CtaBand } from "@/components/SitePrimitives";
import pricingPages, { pricingPageOf } from "@/data/pricingData";
import { serviceOf, relatedServices } from "@/data/servicesData";
import { comparisonOf } from "@/data/comparisonData";

export default function PricingDetail() {
  const slug = routeParam(useParams().slug);
  const page = pricingPageOf(slug);
  const [openFaq, setOpenFaq] = useState(-1);

  if (!page) return <Navigate to="/pricing" replace />;

  const service = page.serviceSlug ? serviceOf(page.serviceSlug) : null;
  const serviceLinks = service ? relatedServices(service, 3) : [];
  const comparison = comparisonOf(page.comparisonSlug);
  const more = pricingPages.filter((p) => p.slug !== page.slug).slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Pricing", to: "/pricing" },
          { label: page.service, to: `/pricing/${page.slug}` },
        ]}
        kicker={page.eyebrow}
        title={page.headline}
        lede={page.lede}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Scope-first quotes</span>
          <span className="mc-kicker">No hidden fees</span>
          <span className="mc-kicker">Fixed milestones</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-3">
            {(page.tiers || []).map((t, i) => (
              <Reveal key={t.name} delay={i * 70}>
                <div className={`mc-card mc-price ${t.featured ? "featured" : ""}`}>
                  {t.featured && <span className="mc-tag">Most chosen</span>}
                  <h3>{t.name}</h3>
                  <div className="mc-who">{t.who}</div>
                  <div className="mc-cost">{t.price}</div>
                  <div className="mc-muted" style={{ fontSize: 12.5, marginBottom: 14 }}>{t.priceNote}</div>
                  <ul>
                    {(t.features || []).map((f) => (
                      <li key={f}><FiCheck /> {f}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`mc-btn ${t.featured ? "mc-btn-primary" : "mc-btn-ink"} mc-btn-block`}>
                    {t.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80} style={{ marginTop: 28 }}>
            <div className="mc-alert">
              <FiInfo size={18} /> {page.scopeNote}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Pricing factors" title="What shapes your quote" text="Every factor below is reviewed and priced explicitly at scoping — so the final figure matches the scope, nothing more." />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {(page.factors || []).map((f, i) => (
              <Reveal key={f.title} delay={i * 50}>
                <div className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><FiCheck /></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(26px,3.2vw,40px)", marginBottom: 30 }}>{page.service} pricing questions, answered</h2>
          </Reveal>
          <div style={{ display: "grid", gap: 12 }}>
            {(page.faq || []).map(([q, a], i) => (
              <Reveal key={q} delay={i * 40}>
                <FAQItem q={q} a={a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {comparison && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <Link to={`/compare/${comparison.slug}`} className="mc-card mc-card-hover" style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", minWidth: 0, flex: 1 }}>
                  <span className="mc-f-icon"><FiShuffle /></span>
                  <div>
                    <h3 style={{ fontSize: 20, marginBottom: 6 }}>Not sure it's worth building?</h3>
                    <p className="mc-muted" style={{ fontSize: 14.5, margin: 0 }}>{comparison.focus}</p>
                  </div>
                </div>
                <span className="mc-res-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)", whiteSpace: "nowrap" }}>
                  Read the comparison <FiArrowRight />
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {service && serviceLinks.length > 0 && (
        <section className="mc-slab">
          <div className="mc-container">
            <Reveal>
              <SectionHeader center eyebrow="Explore the service" title={`What's included in ${page.service}`} text="Read the full capability, process and deliverables that sit behind these price points." />
            </Reveal>
            <div className="mc-grid-3" style={{ marginTop: 40 }}>
              {[service, ...serviceLinks].filter(Boolean).slice(0, 3).map((s, i) => (
                <Reveal key={s.slug} delay={i * 60}>
                  <Link to={`/services/${s.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "block", height: "100%" }}>
                    <span className="mc-f-icon"><s.icon /></span>
                    <h3 style={{ fontSize: 18, margin: "12px 0 8px" }}>{s.name}</h3>
                    <p className="mc-muted" style={{ fontSize: 14 }}>{s.headline}</p>
                    <span className="mc-res-link" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)", fontSize: 13.5 }}>
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
              <h2 style={{ fontSize: "clamp(24px,3vw,36px)", marginBottom: 30 }}>Pricing guides for other services</h2>
            </Reveal>
            <div className="mc-grid-3">
              {more.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <Link to={`/pricing/${p.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "block", height: "100%" }}>
                    <span className="mc-kicker" style={{ marginBottom: 10 }}>{p.eyebrow}</span>
                    <h4 style={{ fontSize: 17, marginBottom: 6 }}>{p.service} Pricing</h4>
                    <p className="mc-muted" style={{ fontSize: 13.5 }}>{p.headline}</p>
                    <span className="mc-res-link" style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)", fontSize: 13.5 }}>
                      View pricing <FiArrowRight />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Ready for a quote that matches your scope?"
        text="Tell us the modules, users, integrations and support you need — we'll scope it and confirm the price before any commitment."
        primary="Request a Proposal"
        secondary="View All Services"
        secondaryTo="/services"
      />
    </>
  );
}