import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCheck, FiInfo, FiZap, FiTrendingUp, FiShield } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { pricing, pricingFactors } from "@/data/siteData";
import pricingPages, { serviceTierPricing } from "@/data/pricingData";
import { serviceCategories, allServices } from "@/data/servicesData";
import { coreProducts } from "@/data/productsData";

const reportingShot = "/images/company/screens/management-reporting.png";
const financialShot = "/images/company/screens/financial-reports.png";
const inventoryShot = "/images/company/screens/inventory-dashboard.png";

const compareTiers = [
  { name: "MVP Sprint", icon: <FiZap />, price: "From $3k", who: "First product or one painful workflow", cta: "Start Project", featured: false },
  { name: "Growth System", icon: <FiTrendingUp />, price: "From $8k", who: "Growing, connected operations", cta: "Book a Demo", featured: true },
  { name: "Enterprise Partner", icon: <FiShield />, price: "Custom", who: "Complex, multi-location platforms", cta: "Talk to Sales", featured: false },
];

const compareGroups = [
  {
    name: "Scope",
    rows: [
      { f: "Best for", vs: [
        { label: "Validating a product or automating one workflow" },
        { label: "Connected operations with measurable wins" },
        { label: "Complex platforms and long-term roadmaps" },
      ] },
      { f: "Delivery model", vs: [
        { label: "Focused build" },
        { label: "Connected system" },
        { label: "Dedicated program" },
      ] },
      { f: "Modules & interface", vs: [
        { label: "One core workflow" },
        { label: "Custom modules + admin dashboard" },
        { label: "Full platform architecture + branded console" },
      ] },
    ],
  },
  {
    name: "Build",
    rows: [
      { f: "Integrations", vs: [
        { label: "Best-effort during build" },
        { label: "Up to 3 systems" },
        { label: "Unlimited, custom-built" },
      ] },
      { f: "Analytics & reports", vs: [
        { label: "Launch reporting" },
        { label: "Connected BI dashboards" },
        { label: "Custom data warehouse & AI insights" },
      ] },
      { f: "Security & compliance", vs: [
        { label: "Security best practices" },
        { label: "Role-based access controls" },
        { label: "Enterprise controls & audit readiness" },
      ] },
    ],
  },
  {
    name: "Support",
    rows: [
      { f: "Support & response", vs: [
        { label: "Business-day launch support" },
        { label: "Next business-day support" },
        { label: "SLA-backed priority support" },
      ] },
      { f: "Training", vs: [
        { label: "Launch walkthrough" },
        { label: "Admin + user adoption plan" },
        { label: "Ongoing team enablement" },
      ] },
    ],
  },
  {
    name: "Commitment",
    rows: [
      { f: "Typical timeline", vs: [
        { label: "3–6 weeks" },
        { label: "6–12 weeks" },
        { label: "Milestone-based program" },
      ] },
      { f: "Starting price", vs: [
        { label: "From $3k", price: true },
        { label: "From $8k", price: true },
        { label: "Custom", price: true },
      ] },
    ],
  },
];

function ProductPricingBlock({ product }) {
  return (
    <div className="mc-product-price">
      <div className="mc-product-price-head">
        <span className="mc-product-price-icon"><product.icon /></span>
        <div className="mc-product-price-meta">
          <span className="mc-kicker" style={{ textTransform: "none", letterSpacing: 0 }}>{product.category} product</span>
          <h3>{product.title}</h3>
          <p>{product.tagline}</p>
        </div>
        <Link to={`/products/${product.slug}`} className="mc-res-link">
          Product details <FiArrowRight />
        </Link>
      </div>
      <div className="mc-grid-3" style={{ marginTop: 26, alignItems: "stretch" }}>
        {product.pricing.map((t, i) => (
          <Reveal key={t.name} delay={i * 60}>
            <div className={`mc-card mc-price mc-price-compact ${t.featured ? "featured" : ""}`}>
              {t.featured && <span className="mc-tag">Most popular</span>}
              <h3>{t.name}</h3>
              <div className="mc-who">{t.audience}</div>
              <div className="mc-cost">{t.price}</div>
              <div className="mc-muted" style={{ fontSize: 12.5, marginBottom: 14 }}>{t.priceNote}</div>
              <ul>
                {t.features.map((f) => (
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
    </div>
  );
}

function ServicePriceCard({ service }) {
  const tiers = serviceTierPricing(service);
  return (
    <div className="mc-svc-price">
      <div className="mc-svc-price-head">
        <span className="mc-svc-price-icon"><service.icon /></span>
        <div>
          <b>{service.name}</b>
          <p>{service.headline}</p>
        </div>
      </div>
      <div className="mc-svc-price-tiers">
        {tiers.map((t) => (
          <div key={t.name} className={`mc-svc-price-row ${t.featured ? "featured" : ""}`}>
            <span className="mc-svc-price-tier-name">{t.name}</span>
            <span className="mc-svc-price-amount">
              <b>{t.price}</b>
              <small>{t.priceNote}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="mc-svc-price-foot">
        <Link to={`/services/${service.slug}`} className="mc-res-link">
          Service details <FiArrowRight />
        </Link>
        <Link to="/contact" className="mc-btn mc-btn-sm mc-btn-soft">Get quote</Link>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Pricing", to: "/pricing" }]}
        title={<>Packages for <span className="mc-grad-text">every stage of growth</span></>}
        lede="Transparent starting points with custom scoping confirmed after discovery — so you always know what you’re paying for."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">No hidden fees</span>
          <span className="mc-kicker">Scope-first</span>
          <span className="mc-kicker">Fixed milestones</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-3">
            {pricing.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <div className={`mc-card mc-price ${p.featured ? "featured" : ""}`}>
                  {p.featured && <span className="mc-tag">Most chosen</span>}
                  <h3>{p.name}</h3>
                  <div className="mc-who">{p.who}</div>
                  <div className="mc-cost">{p.cost}</div>
                  <ul>
                    {p.items.map((item) => (
                      <li key={item}><FiCheck /> {item}</li>
                    ))}
                  </ul>
                  <div className="mc-muted" style={{ fontSize: 13.5, marginBottom: 18 }}>{p.note}</div>
                  <Link to="/contact" className={`mc-btn ${p.featured ? "mc-btn-primary" : "mc-btn-ink"} mc-btn-block`}>
                    {p.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80} style={{ marginTop: 30 }}>
            <div className="mc-alert">
              <FiInfo size={18} /> Final pricing is confirmed after we review modules, users, branches, integrations, migration, deployment and support requirements.
            </div>
          </Reveal>
          <Reveal delay={120} style={{ marginTop: 22 }}>
            <div className="mc-trustband">
              <div className="mc-trust-item"><b>Scope confirmed first</b><span>You approve the scope and price before any build commitment — no surprise invoices.</span></div>
              <div className="mc-trust-item"><b>One source of truth</b><span>Your dashboards and reports draw on connected, real-time data — not manual consolidation.</span></div>
              <div className="mc-trust-item"><b>Honest outcomes</b><span>Capabilities are described exactly. We report what shipped, measured against what was agreed.</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Products & platforms" title={<>Detailed pricing for <span className="mc-grad-text">every product</span></>} text="Our built products are quoted by implementation scope and confirmed after discovery. Choose a package or scope a custom deployment." />
          </Reveal>
          <div style={{ display: "grid", gap: 40, marginTop: 44 }}>
            {coreProducts.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 2) * 80}>
                <ProductPricingBlock product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Pricing factors" title="What we review before issuing a proposal" />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {pricingFactors.map((f, i) => (
              <Reveal key={f.title} delay={i * 50}>
                <div className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><f.icon /></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Pricing by service" title="Transparent starting points, per service" text="Dedicated pricing guides for the services we deliver — with tiers, what's included and the factors that shape a final quote." />
          </Reveal>
          <div className="mc-grid-4" style={{ marginTop: 40 }}>
            {pricingPages.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 60}>
                <Link to={`/pricing/${p.slug}`} className="mc-card mc-card-hover mc-tl-card" style={{ display: "block", height: "100%" }}>
                  <span className="mc-kicker" style={{ marginBottom: 10, textTransform: "none", letterSpacing: 0 }}>{p.service} Pricing</span>
                  <p className="mc-muted" style={{ fontSize: 13.5, margin: 0 }}>{p.headline}</p>
                  <div className="mc-cost" style={{ margin: "16px 0 4px", fontSize: 26 }}>{p.tiers[1] ? p.tiers[1].price : "Custom"}</div>
                  <span className="mc-muted" style={{ fontSize: 12.5 }}>{p.tiers[1] ? p.tiers[1].priceNote : "after scoping"}</span>
                  <span className="mc-res-link" style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "var(--brand-3)", fontSize: 13.5 }}>
                    View pricing <FiArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Compare packages" title="Choose the right engagement" text="A side-by-side view of how we scope, build, support and price each package." />
          </Reveal>
          <Reveal delay={80}>
            <div className="mc-compare" style={{ marginTop: 40 }}>
              <div className="mc-compare-swipe"><FiArrowRight /> Swipe to compare all packages</div>
              <div className="mc-compare-wrap">
                <table className="mc-compare-table">
                  <thead>
                    <tr>
                      <th className="mc-compare-label-head"><span className="mc-compare-label-dot" />Package</th>
                      {compareTiers.map((t) => (
                        <th key={t.name} className={`mc-compare-tier ${t.featured ? "featured" : ""}`}>
                          {t.featured && <span className="mc-compare-ribbon">Most chosen</span>}
                          <span className="mc-compare-tier-icon">{t.icon}</span>
                          <b className="mc-compare-tier-name">{t.name}</b>
                          <span className="mc-compare-tier-who">{t.who}</span>
                          <span className="mc-compare-tier-price">{t.price}</span>
                          <Link to="/contact" className={`mc-btn mc-btn-sm mc-compare-tier-cta ${t.featured ? "mc-btn-ink" : "mc-btn-soft"}`}>
                            {t.cta}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareGroups.map((group) => (
                      <React.Fragment key={group.name}>
                        <tr className="mc-compare-group">
                          <th colSpan={compareTiers.length + 1}>{group.name}</th>
                        </tr>
                        {group.rows.map((row) => (
                          <tr key={row.f}>
                            <th className="mc-compare-feature">{row.f}</th>
                            {row.vs.map((v, vi) => (
                              <td key={vi} className={vi === 1 ? "featured" : ""}>
                                {v.price ? (
                                  <b className="mc-compare-price">{v.label}</b>
                                ) : v.no ? (
                                  <span className="mc-compare-dash">—</span>
                                ) : (
                                  <span className="mc-compare-cell">
                                    <i className="mc-compare-tick"><FiCheck /></i>
                                    {v.label}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} style={{ marginTop: 18 }}>
            <div className="mc-alert" style={{ alignItems: "flex-start" }}>
              <FiInfo size={18} /> Prices are starting points — final scope, timeline and cost are confirmed after discovery. Every package includes a structured handover.
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Service price catalog" title={<>Detailed pricing for <span className="mc-grad-text">every service</span></>} text="Every service we deliver with its indicative three-package pricing. Full scope, features and deliverables live on each service page." />
          </Reveal>
          <div className="mc-cat-nav" style={{ marginTop: 34 }}>
            {serviceCategories.map((c) => (
              <a key={c.slug} to={`#price-${c.slug}`} className="mc-cat-chip">
                <c.icon /> {c.name}
              </a>
            ))}
          </div>
          {serviceCategories.map((cat) => {
            const list = allServices.filter((s) => s.category === cat.slug);
            if (!list.length) return null;
            return (
              <div key={cat.slug} id={`price-${cat.slug}`} className="mc-price-cat">
                <div className="mc-price-cat-head">
                  <span className="mc-f-icon"><cat.icon /></span>
                  <div>
                    <h3>{cat.name}</h3>
                    <p>{cat.short}</p>
                  </div>
                  <span className="mc-price-cat-count">{list.length} services</span>
                </div>
                <div className="mc-price-svc-grid">
                  {list.map((s) => (
                    <ServicePriceCard key={s.slug} service={s} />
                  ))}
                </div>
              </div>
            );
          })}
          <Reveal delay={80} style={{ marginTop: 30 }}>
            <div className="mc-alert">
              <FiInfo size={18} /> Prices are indicative starting points per package. Your final quote is confirmed after discovery — scope-first, no hidden fees.
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="What a build looks like" title="The connected interfaces your teams actually use" text="Dashboards, approvals and reports are scoped to the modules and workflows you select — never a generic template." />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 44, alignItems: "start" }}>
            {[
              { img: reportingShot, label: "Management reporting" },
              { img: financialShot, label: "Financial reports" },
              { img: inventoryShot, label: "Inventory control" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <DashFrame image={s.img} label={s.label} alt={`${s.label} interface preview`} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Plan the next step with confidence"
        text="Discuss your current process, users, modules, integrations, deployment and support requirements."
        primary="Request a Proposal"
        secondary="Book a Demo"
        secondaryTo="/contact"
      />
    </>
  );
}

