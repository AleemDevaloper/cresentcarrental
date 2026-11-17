import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiArrowUpRight, FiMonitor, FiPlayCircle, FiUsers, FiSliders, FiLink, FiCheckCircle, FiX } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, DashFrame } from "@/components/SitePrimitives";
import { aiAgents, integrations } from "@/data/siteData";
import { coreProducts } from "@/data/productsData";

const erpShot = "/images/company/screens/erp-dashboard.png";

export default function Products() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Products", to: "/products" }]}
        title={<>Intelligent products, <span className="mc-grad-text">engineered to act.</span></>}
        lede="Eleven productized AI agents built to own high-impact enterprise workflows, from procurement and logistics to clinical documentation, hiring and growth. Deploy a ready-made engine or commission a bespoke build around your data and approval rules."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Enterprise-ready</span>
          <span className="mc-kicker">Productized agents</span>
          <span className="mc-kicker">Private deployments</span>
          <span className="mc-kicker">Bespoke builds</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-2">
            {coreProducts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <Link to={`/products/${p.slug}`} className="mc-card mc-card-hover mc-product" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="mc-thumb">
                    <span className="mc-pill-abs">{p.category}</span>
                    <img src={p.image} alt={`${p.title} interface`} />
                  </div>
                  <div className="mc-p-body">
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <div className="mc-hash">
                      {p.features.slice(0, 4).map((f) => <span key={f}>{f}</span>)}
                    </div>
                    <span className="mc-cat-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14 }}>
                      Explore product <FiArrowRight />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- AI AGENTS SUITE (Xovo) ---------- */}
      <section className="mc-slab mc-slab-alt mc-eng-grid" style={{ paddingTop: 80 }}>
        <div className="mc-container" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <SectionHeader
              center
              eyebrow="The Product Suite"
              title={<>Eleven AI agents, <span className="mc-underline">one platform</span></>}
              text="Productized AI agents built to own high-impact workflows — from procurement and logistics to clinical documentation, hiring and growth. Deploy a ready-made engine or commission a bespoke build around your data and approval rules."
            />
          </Reveal>
          <div className="mc-grid-2" style={{ marginTop: 44, gap: 26 }}>
            {aiAgents.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 2) * 80}>
                <div className="mc-xo-card">
                  <div className="mc-xo-media">
                    <span className="mc-xo-icon"><a.icon /></span>
                    <img src={a.image || coreProducts[0].image} alt={a.title} />
                  </div>
                  <div className="mc-xo-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <span className="mc-xo-overline">{a.category}</span>
                    <h3>
                      <Link to={`/products/${a.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {a.title}
                      </Link>
                    </h3>
                    <p>{a.text}</p>
                    <div className="mc-xo-stats" style={{ marginBottom: 16 }}>
                      {a.metrics.map(([v, l]) => (
                        <div className="mc-xo-stat" key={l}>
                          <b>{v}</b>
                          <span>{l}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                      <Link to={`/products/${a.slug}`} className="mc-btn mc-btn-primary mc-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Learn More <FiArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- INTEGRATIONS (standalone section) ---------- */}
      <section className="mc-slab mc-slab-alt mc-eng-grid">
        <div className="mc-container" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 44 }}>
              <div className="mc-xo-eyebrow" style={{ marginBottom: 14 }}>
                <i /> // Connects with
              </div>
              <h2>Built to play well with <span className="mc-underline">your stack</span></h2>
              <p>50+ connectors, clean APIs and webhooks — so each agent and product slots straight into the tools you already run.</p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="mc-marquee mc-marquee-pause">
              <div className="mc-marquee-track">
                {[...integrations, ...integrations].map((t, i) => (
                  <span className="mc-marquee-item" key={`${t}-${i}`}>
                    <FiLink /> {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- WHY XOVO (comparison) ---------- */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Why Manage Core"
              title={<>Built the way enterprise <span className="mc-grad-text">AI should be.</span></>}
              text="Productized agents plus custom builds, private by default, and human-in-the-loop review — compared honestly against other vendors."
            />
          </Reveal>
          <Reveal delay={80} style={{ marginTop: 44 }}>
            <div className="mc-compare">
              {[
                {
                  title: "Other vendors",
                  win: false,
                  items: ["Generic off-the-shelf models, one-size-fits-all", "Your data leaves your environment for training", "Locked into a proprietary black box you cannot export", "Bolted-on connectors and brittle integrations", "Full autonomy with no human oversight", "Hand-off at launch, limited follow-up"],
                },
                {
                  title: "Manage Core",
                  win: true,
                  items: ["Productized agents + custom builds", "Private & air-gapped deployments — data stays with you", "You own the source, model weights and workflows", "Connects to your stack — 50+ integrations", "Human-in-the-loop review gates by default", "Managed MLOps, monitoring & 24/7 support"],
                },
              ].map((col) => (
                <div key={col.title} className={`mc-compare-col ${col.win ? "mc-compare-win" : ""}`}>
                  <div className="mc-compare-head">
                    <h3>{col.title}</h3>
                    {col.win && <i aria-hidden="true" />}
                  </div>
                  <ul className="mc-compare-list">
                    {col.items.map((item) => (
                      <li key={item}>
                        {col.win
                          ? <FiCheckCircle style={{ color: "var(--brand-3)" }} />
                          : <FiX style={{ color: "var(--danger)" }} />}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt" style={{ paddingTop: 64 }}>
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Built on our own stack" title="Products you can buy, customize or build upon" text="Every product can be configured, integrated or extended — or serve as the foundation for a fully custom build." />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {[
              ["Purchase & subscribe", "Get started with a product as-is, with implementation support."],
              ["Customize & integrate", "Configure workflows, roles and reports; connect your existing tools."],
              ["Build on top", "Extend a product as a foundation for your own SaaS or internal platform."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-tl-card">
                  <h3>{t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.65 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/case-studies" className="mc-pill-btn">See product outcomes <span className="mc-pill-chip"><FiArrowRight /></span></Link>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-demo-section">
        <div className="mc-container">
          <div className="mc-demo-band">
            <div className="mc-demo-glow" aria-hidden="true" />
            <Reveal>
              <div className="mc-demo-copy">
                <span className="mc-demo-kicker">
                  <FiMonitor /> See it working
                </span>
                <h2>See a product demo before you decide</h2>
                <p>
                  Review key dashboards, workflows and reports on a guided call — or explore the
                  interface at your own pace and then ask us anything.
                </p>
                <div className="mc-demo-actions">
                  <Link to="/contact" className="mc-btn mc-btn-primary">
                    <FiPlayCircle /> Book a Demo <FiArrowRight />
                  </Link>
                  <Link to="/solutions" className="mc-btn mc-btn-ghost">
                    Explore Solutions
                  </Link>
                </div>
                <div className="mc-demo-points">
                  <span><FiUsers /> Your workflows, live</span>
                  <span><FiSliders /> Real modules, not mockups</span>
                  <span><FiMonitor /> 30–45 minutes</span>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="mc-demo-visual">
                <DashFrame
                  image={erpShot}
                  label="Connected ERP — live preview"
                  alt="Manage Core ERP dashboard preview"
                />
                <Link to="/contact" className="mc-demo-float">
                  <FiArrowUpRight />
                  <span>Talk to a consultant</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

