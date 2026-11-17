import { Link } from "react-router-dom";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useMemo } from "react";
import { FiArrowRight, FiArrowUpRight, FiCheckCircle, FiX, FiZap, FiTarget, FiMessageSquare, FiLayers, FiGrid, FiShield, FiClock } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, DashFrame, FAQItem } from "@/components/SitePrimitives";
import { serviceCategories, allServices, SHARED_PROCESS } from "@/data/servicesData";

const workflowShot = "/images/company/screens/workflow-dashboard.png";

const compareRows = [
  {
    title: "How we operate",
    us: "Design, build and run together — one team that owns the whole stack and outcome.",
    other: "Agency hands off deliverables and disappears after launch.",
  },
  {
    title: "Pricing",
    us: "Clear packages with prices confirmed after discovery — scope, not menu.",
    other: "Vague day-rates and surprise change orders.",
  },
  {
    title: "Support",
    us: "Warranty, monitoring and aggregated support after every launch.",
    other: "You hope nothing breaks after handover.",
  },
  {
    title: "Ownership",
    us: "You own the source code, data and architecture — always.",
    other: "You rent a locked-in, hosted black box.",
  },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [openFaq, setOpenFaq] = useState(0);

  const catParam = searchParams.get("cat");
  const filter = catParam && serviceCategories.some((c) => c.slug === catParam) ? catParam : "all";
  const setFilter = (slug) => {
    setSearchParams(slug === "all" ? {} : { cat: slug }, { replace: true });
  };

  const cats = useMemo(() => [{ slug: "all", name: "All Services" }, ...serviceCategories], []);
  const visible = useMemo(
    () =>
      filter === "all"
        ? allServices
        : allServices.filter((s) => s.category === filter),
    [filter]
  );

  const stats = [
    { icon: FiLayers, value: allServices.length, suffix: "+", label: "Specialized services", note: "across 8 delivery categories" },
    { icon: FiGrid, value: serviceCategories.length, suffix: "", label: "Delivery categories", note: "one connected team, end to end" },
    { icon: FiShield, value: 100, suffix: "%", label: "Source code ownership", note: "yours, always — no vendor lock-in" },
    { icon: FiClock, value: 24, suffix: "h", label: "Response time", note: "when you reach out to us" },
  ];

  const faqs = [
    ["How do I know which service I need?", "Start with the free consultation. We map your problem, point you to the right service — or the right combination — and scope it with you before anything is built."],
    ["Can you handle a whole system, not just one service?", "Yes. Most clients come for one entry point — a CRM, an ERP, automation — and we connect an end-to-end platform across software, AI, security, design and growth."],
    ["Do you work with existing tools?", "Almost always. We integrate with and extend what you already use, and only replace something when it makes sense after we see how it works."],
    ["How are packages priced?", "Every package is scoped from your requirements. Prices are confirmed after discovery — no unclear day-rates, no surprise change orders."],
    ["What happens after launch?", "Every delivery includes a warranty window, and we offer ongoing support, monitoring and optimization plans."],
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", to: "/services" }]}
        title={<>Software, AI & automation — <span className="mc-grad-text">the way your business works</span></>}
        lede={`${allServices.length} specialized services across 8 categories, delivered by one team that owns the whole stack — from first discovery call to supported operation.`}
      >
        <div className="mc-page-tags">
          {serviceCategories.map((c) => (
            <span className="mc-kicker" key={c.slug}>{c.name}</span>
          ))}
        </div>
      </PageHero>

      {/* Stats strip */}
      <section className="mc-slab mc-slab-tight mc-pt-0">
        <div className="mc-container">
          <div className="mc-stats-strip">
            {stats.map((st, i) => (
              <Reveal as="div" delay={i * 60} key={st.label}>
                <div className="mc-stat-card">
                  <div className="mc-stat-card-icon"><st.icon /></div>
                  <b className="mc-grad-text">{st.value}{st.suffix}</b>
                  <span className="mc-stat-card-label">{st.label}</span>
                  <span className="mc-stat-card-note">{st.note}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-filterbar mc-filterbar-center">
            {cats.map((c) => (
              <button
                type="button"
                key={c.slug}
                className={`mc-filter-btn ${filter === c.slug ? "active" : ""}`}
                onClick={() => setFilter(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 34 }}>
            <div className="mc-svc-grid">
              {visible.map((s, i) => (
                <Reveal key={s.slug} delay={(i % 3) * 70}>
                  <article className="mc-svc-card">
                    <span className="mc-svc-top">
                      <span className="mc-svc-icon"><s.icon /></span>
                      <span className="mc-svc-pill">{serviceCategories.find((c) => c.slug === s.category)?.name}</span>
                    </span>
                    <span className="mc-svc-body">
                      <span className="mc-svc-title">{s.name}</span>
                      <span className="mc-svc-text">{s.description}</span>
                      <span className="mc-svc-tags">
                        {(s.capabilities || []).slice(0, 3).map((f) => (
                          <span key={f}>{f}</span>
                        ))}
                      </span>
                    </span>
                    <span className="mc-svc-foot">
                      <Link to={`/services/${s.slug}`}>Explore service <FiArrowUpRight /></Link>
                    </span>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories deep-dive */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="By category"
              title={<>Eight ways we help you <span className="mc-grad-text">build & grow</span></>}
              text="Each category is a connected practice — not a menu. Most engagements blend two or more."
            />
          </Reveal>
          <div className="mc-cat-grid" style={{ marginTop: 40 }}>
            {serviceCategories.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 4) * 60}>
                <article className="mc-cat-card">
                  <span className="mc-cat-icon"><c.icon /></span>
                  <h3>{c.name}</h3>
                  <p>{c.short}</p>
                  <span className="mc-cat-count">{c.links.length} services</span>
                  <Link to={`/services/categories/${c.slug}`} className="mc-cat-link">
                    View category <FiArrowRight />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Build vs buy comparisons */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <div className="mc-cta" style={{ background: "linear-gradient(135deg,#14124a,#241a6e)", textAlign: "left" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "space-between" }}>
                <div style={{ maxWidth: 720 }}>
                  <span className="mc-kicker" style={{ marginBottom: 12, color: "#9be8ff" }}>Decision guides</span>
                  <h2 style={{ fontSize: "clamp(24px,3vw,34px)", marginBottom: 10 }}>Not sure whether to build, buy or automate?</h2>
                  <p style={{ fontSize: 15, margin: 0, maxWidth: 640, color: "rgba(255,255,255,0.75)" }}>
                    Honest side-by-side guides — custom vs SaaS, web vs mobile, SEO vs Google Ads, in-house vs outsourcing — with a framework for deciding.
                  </p>
                </div>
                <div className="mc-hero-actions" style={{ marginTop: 8 }}>
                  <Link to="/compare" className="mc-btn mc-btn-ink">Browse all comparisons <FiArrowRight /></Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Process"
              title={<>How we ship <span className="mc-grad-text">every engagement</span></>}
              text="A single delivery model across all eight categories, from discovery to a supported system your team owns."
            />
          </Reveal>
          <div className="mc-process" style={{ marginTop: 40 }}>
            {SHARED_PROCESS.map((p, i) => (
              <Reveal key={p.stage} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{p.stage}</h3>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120} style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-pill">Book a Free Consultation <FiArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      {/* Why us / compare */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Why Manage Core"
              title={<>Built the way serious work <span className="mc-grad-text">should be.</span></>}
              text="Ownership, transparency and support — compared honestly against the typical agency model."
            />
          </Reveal>
          <Reveal delay={80} style={{ marginTop: 44 }}>
            <div className="mc-compare">
              {[
                { title: "Manage Core", items: compareRows.map((r) => r.us), win: true },
                { title: "Typical agency", items: compareRows.map((r) => r.other), win: false },
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
          <Reveal delay={120} style={{ marginTop: 44, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            <DashFrame image={workflowShot} label="Unified delivery dashboard" alt="Manage Core delivery workflow dashboard" />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 880 }}>
          <Reveal>
            <SectionHeader center eyebrow="FAQ" title={<>How services <span className="mc-grad-text">actually work</span></>} />
          </Reveal>
          <div className="mc-faq-list" style={{ marginTop: 32 }}>
            {faqs.map((f, i) => (
              <Reveal key={f[0]} delay={i * 40}>
                <FAQItem
                  q={f[0]}
                  a={f[1]}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mc-slab mc-slab-tight">
        <div className="mc-container">
          <Reveal>
            <div className="mc-cta" style={{ background: "linear-gradient(135deg,var(--brand-ink),#0d246e)" }}>
              <h2>Not sure where to start?</h2>
              <p>Tell us the business problem. We’ll map the right services around it — free, no obligation.</p>
              <div className="mc-hero-actions" style={{ marginTop: 26 }}>
                <Link to="/contact" className="mc-btn mc-btn-ink">Book a Consultation <FiArrowRight /></Link>
                <Link to="/process" className="mc-btn mc-btn-ghost">See the Process</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

