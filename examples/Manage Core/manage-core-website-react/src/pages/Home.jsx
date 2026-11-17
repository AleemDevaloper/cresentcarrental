import { Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import {
  FiArrowRight, FiZap, FiTarget, FiCheck,
  FiTrendingUp, FiBriefcase, FiActivity, FiCpu, FiGlobe, FiSearch, FiCheckCircle, FiGrid,
  FiArrowUpRight, FiX, FiLink, FiShield, FiClock, FiMail, FiAward, FiArrowUp,
  FiUsers, FiDollarSign, FiBarChart2, FiServer, FiCloud, FiDatabase, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";
import {
  Reveal, Counter, SectionHeader, Stars, FAQItem, Tilt, Magnetic, Scrub,
  Marquee, MarqueeItem, ScrollReveal, GradientText, WordCycle, Typewriter,
  MorphBlob, GlowPulse, BeamSweep, DotGrid, OrbitRing, Sheen,
} from "@/components/SitePrimitives";
import {
  heroStats, logos, deliveryProcess, testimonials, pricing, faqs,
  products, industries, caseStudies, technologies, blog,
  aiAgentsFeatured, techMarquee, compareXovo, integrations, valuesXovo,
} from "@/data/siteData";
import { allServices as services } from "@/data/servicesData";

const aiInsights = "/images/company/ai-insights-dashboard.png";
const logoMark = "/images/logo1.png";
const portrait1 = "/images/company/aivent/team/1.webp";
const portrait2 = "/images/company/aivent/team/3.webp";
const portrait3 = "/images/company/aivent/team/5.webp";
const portrait4 = "/images/company/aivent/team/7.webp";
const portrait5 = "/images/company/aivent/team/9.webp";
const portrait6 = "/images/company/aivent/team/11.webp";
const portrait7 = "/images/company/aivent/team/13.webp";
const portrait8 = "/images/company/aivent/team/15.webp";
const portrait9 = "/images/company/aivent/team/17.webp";
const portrait10 = "/images/company/aivent/team/19.webp";
const testiMedia1 = "/images/company/aivent/misc/s3.webp";
const testiMedia2 = "/images/company/aivent/misc/s7.webp";
const testiMedia3 = "/images/company/aivent/misc/s9.webp";

const testiRows = [
  [
    { ...testimonials[0], img: portrait1 },                                                                                               
    testiMedia1,
    { ...testimonials[4], img: portrait7 },
  ],
  [
    testiMedia2,
    { ...testimonials[1], img: portrait2 },
    { ...testimonials[2], img: portrait3 },
    { ...testimonials[6], img: portrait9 },
  ],
  [
    { ...testimonials[3], img: portrait4 },
    testiMedia3,
    { ...testimonials[5], img: portrait8 },
    { ...testimonials[7], img: portrait10 },
  ],
];

function ProductsTabs({ products }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const p = products[active];

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % products.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, products.length]);

  const move = (direction) => {
    setActive((current) => (current + direction + products.length) % products.length);
  };

  return (
    <div className="mc-tabblock mc-product-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Reveal>
        <div className="mc-tabpills" role="tablist" aria-label="Product categories">
          {products.map((prod, i) => (
            <button
              key={prod.title}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`mc-tabpill ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
            >
              {prod.title}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal delay={60}>
        <div className="mc-tabpanel">
          <div className="mc-tabpanel-copy">
            <span className="mc-pill-tag">{p.tag}</span>
            <h3>{p.title}</h3>
            <p>{p.result}</p>
            <ul className="mc-tab-list">
              {p.features.map((f) => (
                <li key={f}>
                  <span className="mc-ai-check"><FiCheck /></span> {f}
                </li>
              ))}
            </ul>
            <Link to="/products" className="mc-btn mc-btn-primary">
              Explore product <FiArrowRight />
            </Link>
          </div>
          <div className="mc-tabpanel-media">
            <div className="mc-dash">
              <div className="mc-dash-top">
                <i /><i /><i />
                <span>{p.title} — live preview</span>
              </div>
              <img src={p.image} alt={`${p.title} interface`} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </Reveal>
      <div className="mc-carousel-controls mc-product-carousel-controls">
        <button type="button" aria-label="Previous product" onClick={() => move(-1)}><FiChevronLeft /></button>
        <span>{String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}</span>
        <button type="button" aria-label="Next product" onClick={() => move(1)}><FiChevronRight /></button>
      </div>
    </div>
  );
}


export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [activeResult, setActiveResult] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    if (carouselPaused) return undefined;
    const timer = window.setInterval(() => {
      setActiveCapability((current) => (current + 1) % 5);
      setActiveResult((current) => (current + 1) % 4);
      setActiveQuestion((current) => (current + 1) % 3);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [carouselPaused]);

  const moveCarousel = (setter, length, direction) => {
    setter((current) => (current + direction + length) % length);
  };

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="mc-hero" style={{ position: "relative", overflow: "hidden" }}>
        {/* Background effects */}
        <DotGrid spacing={32} style={{ position: "absolute", inset: 0, opacity: 0.4, zIndex: 0 }} />
        <MorphBlob size={400} color="brand" style={{ top: "-10%", right: "-5%", zIndex: 0 }} />
        <MorphBlob size={300} color="accent" style={{ bottom: "-8%", left: "-8%", zIndex: 0, animationDelay: "4s" }} />
        <BeamSweep style={{ zIndex: 0 }} />

        <div className="mc-container mc-hero-grid" style={{ position: "relative", zIndex: 1 }}>
          <div className="mc-hero-copy">
            <Reveal>
              <Link to="/products" className="mc-hero-badge">
                <span className="mc-hb-spark"><FiZap /></span>
                <b>New</b>
                <em>11 AI agents + the Operating Core platform</em>
                <FiArrowRight />
              </Link>
            </Reveal>
            <Reveal delay={60}>
              <span className="mc-eyebrow mb-3"><i /> AI-Driven Enterprises</span>
            </Reveal>
            <Reveal delay={80}>
              <h1>
                We build <GradientText><WordCycle words={["AI systems", "automation", "software", "connected platforms"]} interval={2800} /></GradientText> that help you{" "}
                <span className="mc-underline">scale smarter</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="py-3">
                We build AI agents, automation workflows and connected platforms that help
                businesses scale smarter and faster — with one real-time view of customers,
                projects, finance and operations.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mc-hero-actions">
                <Magnetic>
                  <a href="https://managecore.asiancon.com/app" className="mc-btn mc-btn-primary mc-btn-pill mc-btn-xl">
                    Book a Free Audit <FiArrowRight />
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link to="/services" className="mc-btn mc-btn-ghost mc-btn-pill mc-btn-xl">
                    Explore Services
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link to="/demo" className="mc-btn mc-btn-link mc-btn-xl mc-hero-call">
                    <FiClock /> Talk to an expert
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mc-trust-row">
                <div className="mc-trust-avatars">
                  <img src={portrait1} alt="" />
                  <img src={portrait2} alt="" />
                  <img src={portrait3} alt="" />
                  <img src={portrait4} alt="" />
                  <img src={portrait5} alt="" />
                  <img src={portrait6} alt="" />
                  <span>+114</span>
                </div>
                <div className="mc-trust-copy">
                  <span className="mc-trust-stars">★★★★★</span>
                  <b>Rated 4.9/5 by 120+ clients</b>
                  <small>Trusted globally — Lahore · Al Jubail · Remote</small>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100} variant="zoom" className="mt-4">
            <Scrub intensity={0.3}>
              <Tilt max={7}>
                <div className="mc-hero-visual" style={{ position: "relative" }}>
                  <OrbitRing size={420} style={{ position: "absolute", top: "-40px", left: "-40px", opacity: 0.3 }} />
                  <OrbitRing size={340} reverse speed="slow" style={{ position: "absolute", top: "0", left: "0", opacity: 0.2 }} />
                  <div className="mc-dash">
                    <div className="mc-dash-top">
                      <i /><i /><i />
                      <span>Manage Core — live command center</span>
                    </div>
                    <img src={aiInsights} alt="Manage Core analytics dashboard preview" fetchPriority="high" decoding="async" />
                  </div>
                  <div className="mc-float mc-float-fa">
                    <span className="mc-fl-icon"><FiCpu /></span>
                    <span>AI Agent<small>Autonomous</small></span>
                  </div>
                  <div className="mc-float mc-float-fb mc-float-delay-1">
                    <span className="mc-fl-icon"><FiTrendingUp /></span>
                    <span>ROI +38%<small>this cycle</small></span>
                  </div>
                  <div className="mc-float mc-float-fc mc-float-delay-2">
                    <span className="mc-fl-icon"><FiShield /></span>
                    <span>Private by default<small>Self-hosted options</small></span>
                  </div>
                  <GlowPulse color="var(--brand)" size={160} style={{ bottom: "-40px", right: "-40px", position: "absolute", zIndex: -1 }} />
                </div>
              </Tilt>
            </Scrub>
            <div className="mc-hero-visual-info mt-5 pt-5">
              <div className="mc-hero-meta" aria-label="Platform highlights">
                <span><FiTarget /><b>Real-time data</b></span>
                <span><FiGlobe /><b>Unified dashboard</b></span>
                <span><FiCheckCircle /><b>Private deployments</b></span>
                <span><FiActivity /><b>AI insights</b></span>
              </div>
              <div className="mc-hero-feature-cards">
                <Sheen>
                  <article className="mc-hero-feature-card mc-card-glow">
                    <span className="mc-hero-feature-icon"><FiLink /></span>
                    <div><b>One connected view</b><small>Customers, projects, finance and operations.</small></div>
                  </article>
                </Sheen>
                <Sheen>
                  <article className="mc-hero-feature-card mc-card-glow">
                    <span className="mc-hero-feature-icon"><FiCpu /></span>
                    <div><b>AI that keeps moving</b><small>Agents turn signals into useful next steps.</small></div>
                  </article>
                </Sheen>
                <Sheen>
                  <article className="mc-hero-feature-card mc-card-glow">
                    <span className="mc-hero-feature-icon"><FiShield /></span>
                    <div><b>Private by default</b><small>Deploy with control over your data and workflows.</small></div>
                  </article>
                </Sheen>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mc-scroll-cue" aria-hidden="true">
          <span className="mc-scroll-mouse" />
          Scroll to explore
        </div>

        <div className="mc-container" style={{ marginTop: 72 }}>
          <Reveal>
            <Marquee speed="slow">
              {["SaaS", "ERP", "CRM", "HRMS", "AI Agents", "Cloud", "Apps", "Digital Growth"].map((l) => (
                <MarqueeItem key={l} icon={FiGrid}>{l}</MarqueeItem>
              ))}
            </Marquee>
          </Reveal>
        </div>

        {heroStats.length > 0 && (
          <div className="mc-container" style={{ marginTop: 30 }}>
            <Reveal>
              <div className="mc-nums">
                <div className="mc-nums-head">
                  <div className="mc-stats-head"><i /> By the numbers</div>
                  <span className="mc-nums-note">Real data across every engagement</span>
                </div>
                <div className="mc-nums-grid mc-stagger">
                  {heroStats.map((s, i) => (
                    <div className="mc-num" key={s.label}>
                      <div className="mc-num-glow" aria-hidden="true" />
                      <div className="mc-num-top">
                        <span className="mc-num-idx">0{i + 1}</span>
                        <span className="mc-num-icon"><FiActivity /></span>
                      </div>
                      <b>
                        <Counter value={s.value} suffix={s.suffix} />
                      </b>
                      <span className="mc-num-label">{s.label}</span>
                      <span className="mc-num-bar" aria-hidden="true"><i /></span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        )}

        <div className="mc-container" style={{ marginTop: 44 }}>
          <ScrollReveal>
            <div className="mc-xo-eyebrow" style={{ marginBottom: 16 }}>
              <i /> // Stack we use
            </div>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <Marquee reverse speed="normal">
              {techMarquee.map((t) => (
                <MarqueeItem key={t} icon={FiZap}>{t}</MarqueeItem>
              ))}
            </Marquee>
          </ScrollReveal>
        </div>
      </section>

      <div className="mc-hero-divider" aria-hidden="true" />

      {/* ---------- SERVICES ---------- */}
      <section className="mc-slab mc-slab-alt" id="services" style={{ position: "relative", overflow: "hidden" }}>
        <MorphBlob size={300} color="brand" style={{ top: "10%", right: "-8%", opacity: 0.1 }} />
        <div className="mc-container">
          <ScrollReveal variant="up">
            <div className="mc-section-header center" style={{ marginBottom: 48 }}>
              <div className="mc-eyebrow">Services</div>
              <h2>A full-stack technology partner, not just an agency</h2>
              <p>Strategy, design, engineering, AI automation, cloud, security and digital growth under one execution model.</p>
            </div>
          </ScrollReveal>
          <div className="mc-bento mc-bento-3col">
            {services.slice(0, 6).map((s, i) => (
              <ScrollReveal key={s.slug} variant="up" delay={i * 80}>
                <Sheen>
                  <Link to={`/services/${s.slug}`} className="mc-svc-card mt-4 mc-card-glow" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <span className="mc-svc-top">
                      <span className="mc-svc-icon"><s.icon /></span>
                      <span className="mc-svc-num">0{i + 1}</span>
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
                      Learn more <FiArrowUpRight />
                    </span>
                  </Link>
                </Sheen>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/services" className="mc-btn mc-btn-ghost">
              View all services <FiArrowRight />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- HOW WE THINK / ORBIT (Xovo-style) ---------- */}
      <section className="mc-slab mc-orbit-section">
        <div className="mc-orbit-ambient" aria-hidden="true" />
        <div className="mc-container">
          <div className="mc-orbit-wrap">
            <div className="mc-orbit-head">
              <Reveal>
                <SectionHeader
                  eyebrow="Atomic Enterprise Design"
                  title={<>One operating core, <span className="mc-grad-text">everything connected</span></>}
                  text="We think of your business as an atomic system — a single core of customers, projects, finance and operations with every workflow, agent and report connected around it."
                />
              </Reveal>
            </div>
            <Reveal delay={80} className="mc-orbit-stage">
              <div className="mc-orbit" aria-hidden="true">
                <div className="mc-orbit-ring r1" />
                <div className="mc-orbit-ring r2" />
                <div className="mc-orbit-ring r3" />
                <div className="mc-orbit-core">
                  <span className="mc-orbit-core-dot" />
                  <b>Operating<br />Core</b>
                  <span className="mc-orbit-core-pulse" />
                </div>
                {[
                  { label: "CRM", icon: FiUsers, deg: 0 },
                  { label: "Projects", icon: FiBriefcase, deg: 51 },
                  { label: "Finance", icon: FiDollarSign, deg: 102 },
                  { label: "HRMS", icon: FiGrid, deg: 153 },
                  { label: "AI Agents", icon: FiCpu, deg: 204 },
                  { label: "Reports", icon: FiBarChart2, deg: 255 },
                ].map((n) => (
                  <span key={n.label} className="mc-orbit-node" style={{ "--deg": n.deg }}>
                    <i className="mc-orbit-node-ico"><n.icon /></i>
                    <b>{n.label}</b>
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="mc-orbit-strip">
                {[
                  ["Single source of truth", "No more scattered files or duplicate entries."],
                  ["Connected by design", "Every agent, report and workflow reads live data."],
                  ["Grows with you", "Add modules to the core without rebuilding."],
                ].map(([t, d]) => (
                  <div className="mc-orbit-chip" key={t}>
                    <span className="mc-orbit-chip-dot" aria-hidden="true" />
                    <span><b>{t}</b><small>{d}</small></span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- WHY / SOLUTIONS ---------- */}
      <section className="mc-slab">
        <div className="mc-container mc-split">
          <div>
            <Reveal variant="left">
              <SectionHeader
                eyebrow="Why Manage Core"
                title="One unified view of the customer, project and finance"
                text="Every engagement connects a defined business problem to the right product, workflow or integration — with connected data and real-time insight baked in from the start."
              />
            </Reveal>
            <Reveal delay={80} variant="left">
              <ul className="mc-check-list">
                {[
                  { title: "Business-first discovery", text: "We start with people, approvals, data and pain points — not a preselected stack." },
                  { title: "Modular implementation", text: "Begin with the highest-value workflow and expand through a controlled roadmap." },
                  { title: "Unified data view", text: "Link transactions, approvals and records so finance, sales and operations see the same live picture." },
                  { title: "Real-time insight", text: "Dashboards and alerts surface the signals that matter, when they matter." },
                ].map((item) => (
                  <li key={item.title}>
                    <span className="mc-tick"><FiCheck /></span>
                    <span><b>{item.title}.</b> {item.text}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160} variant="left" style={{ marginTop: 30 }}>
              <Link to="/solutions" className="mc-pill-btn">
                Explore solutions
                <span className="mc-pill-chip"><FiArrowRight /></span>
              </Link>
            </Reveal>
          </div>

          <Reveal delay={100} variant="right">
            <div className="mc-band">
              <div className="mc-eyebrow">Unified platform</div>
              <h3 style={{ fontSize: 24, marginTop: 12 }}>From leads to invoices, one live source of truth</h3>
              <div className="mc-num" style={{ marginTop: 26 }}>
                <div>
                  {[
                    ["Customers & CRM", "Generate, manage and convert leads into customers — automatically."],
                    ["Projects & Sales", "Automate workflows and monitor sales across your teams."],
                    ["Invoicing & Finance", "Easy invoicing with complete, real-time expense visibility."],
                    ["Live Analytics", "Business intelligence that turns data into decisions."],
                  ].map(([t, d]) => (
                    <div key={t} style={{ display: "flex", gap: 14, padding: "12px 0" }}>
                      <FiBriefcase style={{ color: "var(--brand)", marginTop: 2 }} />
                      <div>
                        <b>{t}</b>
                        <div className="mc-muted" style={{ fontSize: 14 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FLAGSHIP AI AGENTS (Xovo) ---------- */}
      <section className="mc-slab mc-slab-alt mc-eng-grid" id="agents">
        <div className="mc-container" style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <SectionHeader
              center
              eyebrow="Flagship AI Agents"
              title={<>Intelligent systems, engineered to <span className="mc-underline">act</span></>}
              text="Productized AI agents that own high-impact workflows — procurement, HR, sales, healthcare, customer experience and analytics. Deploy a ready-made engine or commission a bespoke build."
            />
          </Reveal>
          <div className="mc-agents-grid" style={{ marginTop: 44 }}>
            {aiAgentsFeatured.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) * 70}>
                <Link to={`/products/${a.slug}`} className="mc-agent-card">
                  <div className="mc-agent-top">
                    <span className="mc-agent-icon"><a.icon /></span>
                    <span className="mc-agent-cat">{a.category}</span>
                  </div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                  <div className="mc-agent-metrics">
                    {a.metrics.map(([v, l]) => (
                      <div key={l}>
                        <b>{v}</b>
                        <span>{l}</span>
                      </div>
                    ))}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/products" className="mc-pill-btn mc-pill-solid">
              Explore all 11 agents
              <span className="mc-pill-chip"><FiArrowRight /></span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- WHY CHOOSE US: COMPARISON (Xovo) ---------- */}
      <section className="mc-slab mc-compare-section">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Why teams build with Manage Core"
              title="Built the way enterprise software should be"
              text="Productized foundations, private deployments and full ownership of what we build — compared honestly against the typical agency model."
            />
          </Reveal>
          <Reveal delay={80} style={{ marginTop: 48 }}>
            <div className="mc-compare">
              {compareXovo.map((col) => (
                <div key={col.title} className={`mc-compare-col ${col.win ? "mc-compare-win" : ""}`}>
                  {col.win && (
                    <span className="mc-cmp-badge">
                      <FiZap /> Recommended
                    </span>
                  )}
                  <div className="mc-compare-head">
                    <span className={`mc-cmp-mark ${col.win ? "is-win" : "is-loss"}`} aria-hidden="true">
                      {col.win ? <FiCheck /> : <FiX />}
                    </span>
                    <div>
                      <h3>{col.title}</h3>
                      <span className="mc-cmp-sub">
                        {col.win ? "The Manage Core standard" : "The typical experience"}
                      </span>
                    </div>
                  </div>
                  <ul className="mc-compare-list">
                    {col.items.map((item) => (
                      <li key={item}>
                        <span className={`mc-cmp-tick ${col.win ? "is-win" : "is-loss"}`}>
                          {col.win ? <FiCheck /> : <FiX />}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {col.win ? (
                    <div className="mc-cmp-foot">
                      <Link to="/contact" className="mc-cmp-cta">
                        Start with Manage Core <FiArrowRight />
                      </Link>
                      <span className="mc-cmp-note">
                        <FiShield /> Private · Owned · Supported 24/7
                      </span>
                    </div>
                  ) : (
                    <div className="mc-cmp-foot mc-cmp-foot-loss">
                      <span className="mc-cmp-note">Good enough, until it isn't</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- INTEGRATIONS (enhanced marquee) ---------- */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container mt-5">
          <ScrollReveal>
            <div className="mc-xo-eyebrow" style={{ marginBottom: 16 }}>
              <i /> // Connects with
            </div>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <Marquee>
              {integrations.map((t) => (
                <MarqueeItem key={t} icon={FiLink}>{t}</MarqueeItem>
              ))}
            </Marquee>
          </ScrollReveal>
        </div>
      </section>

      {/* ---------- PRODUCTS (esoft-style pills) ---------- */}
      <section className="mc-slab mc-slab-alt" id="products">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Products"
              title={<>Own products and accelerators, <span className="mc-underline">customized as your team grows</span></>}
              text="Custom engineering combined with proven product foundations, so clients move faster without accepting generic software."
            />
          </Reveal>
          <ProductsTabs products={products} />
        </div>
      </section>

      {/* ---------- INDUSTRIES ---------- */}
      <section className="mc-slab" id="industries">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Industries"
              title="Built for complex, real-world teams"
              text="A premium design language with architecture practical enough for operations-heavy industries — anywhere in the world."
            />
          </Reveal>
          <div className="mc-ind-grid">
            {industries.slice(0, 12).map((ind, i) => (
              <Reveal key={ind.name} delay={(i % 4) * 60}>
                <Link to="/industries" className="mc-ind-chip">
                  <span className="mc-ind-icon"><ind.icon /></span>
                  {ind.name}
                  <FiArrowRight className="mc-ind-arrow" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CASE STUDIES (SDI-style proof cards) ---------- */}
      <section className="mc-slab mc-slab-alt" id="case-studies">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Case Studies"
              title="Unmatched technical and industry expertise"
              text="Real deployments with measured outcomes — from disconnected files to unified, real-time command centers."
            />
          </Reveal>

          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {caseStudies.slice(0, 3).map((cs, i) => (
              <Reveal key={cs.slug} delay={i * 70}>
                <Link to={`/case-studies/${cs.slug}`} className="mc-card mc-card-hover mc-cs-card">
                  <div className="mc-thumb" style={{ minHeight: 200, overflow: "hidden", position: "relative" }}>
                    {cs.image ? (
                      <img src={cs.image} alt={cs.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" decoding="async" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "linear-gradient(135deg, var(--brand-soft), var(--accent-soft))" }}>
                        <FiBriefcase size={34} style={{ color: "var(--brand)" }} />
                      </div>
                    )}
                    <span className="mc-cs-industry">{cs.industry}</span>
                  </div>
                  <div className="mc-body">
                    <h3>{cs.title.split(" — ")[0]}</h3>
                    <div className="mc-cs-metrics">
                      {(cs.metrics || []).slice(0, 3).map((m) => (
                        <div key={m.label}>
                          <b>{m.value}</b>
                          <span>{m.label}</span>
                        </div>
                      ))}
                    </div>
                    <span className="mc-read">
                      Read more <FiArrowRight />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/case-studies" className="mc-btn mc-btn-ghost">
              View all case studies <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Process"
              title="A clear path from idea to adoption"
              text="Every project moves through structured discovery, design, engineering, launch and improvement, so business risk stays visible."
            />
          </Reveal>
          <div className="mc-process">
            {deliveryProcess.map((step, i) => (
              <Reveal key={step.stage} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{step.stage}</h3>
                  <p>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- HOW WE START / AUDIT (Flowly-style named 3-step) ---------- */}
      <section className="mc-slab mc-audit-section">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="How we start"
              title={<>A named path from problem to <span className="mc-grad-text">measurable automation</span></>}
              text="No big engagement required up front. Start with a 30-minute workflow audit, then decide together what to automate first."
            />
          </Reveal>

          <div className="mc-audit-grid" style={{ marginTop: 44 }}>
            {[
              {
                n: "01",
                icon: FiTarget,
                title: "30-Minute Workflow Audit",
                tag: "Free",
                text: "We map the manual tasks, approvals and data handoffs that are silently costing you hours — on a short, no-pressure call.",
              },
              {
                n: "02",
                icon: FiCpu,
                title: "Custom Automation Engine",
                tag: "Scoped",
                text: "We build tailored workflows for the highest-ROI areas first: CRM routing, finance sync, support triage, reports and more.",
              },
              {
                n: "03",
                icon: FiTrendingUp,
                title: "Live Dashboard & Optimization",
                tag: "Ongoing",
                text: "Track every hour saved and every dollar generated on a real-time dashboard — then keep improving as your business moves.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <div className="mc-card mc-card-hover mc-audit-card">
                  <div className="mc-audit-top">
                    <span className="mc-audit-icon"><s.icon /></span>
                    <span className="mc-audit-tag">{s.tag}</span>
                  </div>
                  <div className="mc-audit-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {i < 2 && (
                    <span className="mc-audit-arrow" aria-hidden="true">
                      <FiArrowRight />
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-pill">
              Book your 30-minute audit <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- GUARANTEE / RISK REVERSAL (Flowly-style) ---------- */}
      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <div className="mc-guarantee">
              <span className="mc-guarantee-icon"><FiAward /></span>
              <div className="mc-guarantee-copy">
                <span className="mc-eyebrow">Our promise</span>
                <h3>
                  If we don't recover <em>10+ hours of manual work</em> per week in the first month,
                  we keep building for free until we do.
                </h3>
                <p>
                  Every engagement is scoped honestly against your workflows before any commitment. You only pay
                  for automation that measurably removes real, repeated work — not demo-ware.
                </p>
              </div>
              <div className="mc-guarantee-actions">
                <Link to="/contact" className="mc-btn mc-btn-ink mc-btn-pill">
                  Talk to an expert <FiArrowRight />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- TECHNOLOGIES ---------- */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Technology"
              title="Modern stack, enterprise discipline"
              text="A pragmatic technology set selected per project — never a forced stack, always maintainable."
            />
          </Reveal>
          <Reveal>
            <div className="mc-tech-cloud">
              {[...new Set(Object.values(technologies).flat())].map((t) => (
                <span className="mc-tech-pill" key={t}><FiCpu /> {t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- TESTIMONIALS / TRUST ---------- */}
      <section className="mc-slab mc-trust-section">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Trust"
              title="Designed to win confidence before the first call"
              text="Honest scope, clear milestones and outcomes clients can measure."
            />
          </Reveal>

          <Reveal delay={60}>
            <div className="mc-trust-bar">
              {[
                { icon: FiAward, value: 4.9, decimals: 1, suffix: "/5", label: "Client satisfaction" },
                { icon: FiBriefcase, value: 120, suffix: "+", label: "Solutions delivered" },
                { icon: FiCheckCircle, value: 98, suffix: "%", label: "On-time delivery" },
                { icon: FiGlobe, value: 80, suffix: "+", label: "Client types served" },
                { icon: FiClock, value: 24, suffix: "/7", label: "Support mindset" },
              ].map((m) => (
                <div className="mc-trust-metric" key={m.label}>
                  <span className="mc-trust-metric-icon"><m.icon /></span>
                  <b><Counter value={m.value} suffix={m.suffix} decimals={m.decimals || 0} /></b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mc-btesti">
            {testiRows.map((col, ci) => (
              <div className="mc-btesti-col" key={ci}>
                {col.map((cell, i) =>
                  typeof cell === "string" ? (
                    <Reveal key={i} delay={i * 60}>
                      <div className="mc-btesti-media">
                        <img src={cell} alt="Client result" loading="lazy" decoding="async" />
                      </div>
                    </Reveal>
                  ) : (
                    <Reveal key={i} delay={i * 60}>
                      <div className="mc-btesti-card">
                        <div className="mc-btesti-top">
                          <Stars />
                          <span className="mc-btesti-ver">Verified</span>
                        </div>
                        <blockquote>“{cell.quote}”</blockquote>
                        <footer>
                          <img src={cell.img} alt={cell.name} loading="lazy" decoding="async" />
                          <div>
                            <b>{cell.name}</b>
                            <span>{cell.role}</span>
                          </div>
                        </footer>
                      </div>
                    </Reveal>
                  )
                )}
              </div>
            ))}
          </div>

          <Reveal style={{ marginTop: 34, textAlign: "center" }}>
            <Link to="/case-studies" className="mc-pill-btn mc-pill-ghost">
              Read the case studies
              <span className="mc-pill-chip"><FiArrowUpRight /></span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- PRICING ---------- */}
      <section className="mc-slab mc-slab-alt" id="pricing">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Pricing"
              title="Transparent packages for every stage of growth"
              text="Clear starting points with custom scoping confirmed after discovery."
            />
          </Reveal>
          <div className="mc-grid-3 mt-5">
            {pricing.map((p, i) => (
              <Reveal key={p.name} delay={i * 70}>
                <div className={`mc-card mc-price ${p.featured ? "featured" : ""}`}>
                  {p.featured && <span className="mc-tag">Most chosen</span>}
                  <h3>{p.name}</h3>
                  <div className="mc-who">{p.who}</div>
                  <div className="mc-cost">
                    {p.cost}
                    {!p.cost.startsWith("From") && !p.cost.startsWith("Custom") && <small>/project</small>}
                  </div>
                  <ul>
                    {p.items.map((item) => (
                      <li key={item}><FiCheck /> {item}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className={`mc-btn ${p.featured ? "mc-btn-primary" : "mc-btn-ink"} mc-btn-block`}>
                    {p.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 32, textAlign: "center" }}>
            <Link to="/pricing" className="mc-btn mc-btn-ghost">
              Compare plan structures <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- BLOG PREVIEW ---------- */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Insights"
              title="Ideas on operations, AI and growth"
              text="Practical guidance for evaluating software, automation and digital transformation."
            />
          </Reveal>
          <div className="mc-grid-3">
            {blog.slice(0, 3).map((post, i) => (
              <Reveal key={post.id} delay={i * 70}>
                <Link to="/blog" className="mc-card mc-card-hover mc-post">
                  <div className="mc-thumb" style={{ minHeight: 180, overflow: "hidden" }}>
                    {post.image ? (
                      <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" decoding="async" />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--muted)", background: "linear-gradient(135deg, var(--brand-soft), var(--accent-soft))" }}>
                        <FiSearch size={34} style={{ color: "var(--brand)" }} />
                      </div>
                    )}
                  </div>
                  <div className="mc-body">
                    <div className="mc-meta"><span>{post.tag}</span><span>{post.date}</span><span>{post.read}</span></div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <span className="mc-read">Read article <FiArrowRight /></span>
                  </div>
                </Link>
              </Reveal>
            ))
            }
          </div>

          <Reveal style={{ marginTop: 36 }}>
            <div className="mc-newsletter-band">
              <div className="mc-nl-copy">
                <span className="mc-nl-icon d-flex justify-content-center align-items-center"><FiMail size={20}/></span>
                <div>
                  <b>Stay connected with Manage Core</b>
                  <span>Latest insights, case studies and product updates — no spam, unsubscribe anytime.</span>
                </div>
              </div>
              <form className="mc-news-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" required placeholder="you@company.com" aria-label="Email" className="mc-nl-input" />
                <button type="submit" className="mc-btn mc-btn-primary">Subscribe</button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mc-slab mc-slab-alt" id="faq">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <SectionHeader
              center
              eyebrow="FAQ"
              title="Straight answers for serious buyers"
              text="Specific capabilities and terms are confirmed after requirements and scope are reviewed."
            />
          </Reveal>
          <div className="mc-faq" style={{ display: "grid", gap: 12, marginTop: 40 }}>
            {faqs.slice(0, 6).map(([q, a], i) => (
              <Reveal key={q} delay={i * 40}>
                <FAQItem q={q} a={a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- VALUES (Xovo) ---------- */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container mt-4">
          <Reveal>
            <SectionHeader
              center
              eyebrow="What we stand for"
              title="The values that shape our engineering"
              text="A shared standard across research, engineering, delivery and support."
            />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 44 }}>
            {valuesXovo.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 70}>
                <div className="mc-card mc-card-hover mc-res-card" style={{ minHeight: 190 }}>
                  <div className="mc-res-top" style={{ marginBottom: 16 }}>
                    <span className="mc-res-icon"><v.icon /></span>
                  </div>
                  <h3>{v.title}</h3>
                  <p style={{ marginBottom: 0 }}>{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- DESCRIBE THE PROBLEM — Console Section ---------- */}
      <section className="mc-console-section" id="console">
        <div className="mc-container">
          <Reveal>
            <div className="mc-console-head">
              <h2>Describe the problem.<br />See the plan.</h2>
              <p>Type what is actually going wrong, or pick a starting point. The console names the likely cause and the exact services we would run — in order.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mc-console-box">
              <div className="mc-console-bar">
                <span className="mc-console-dot" />
                <span className="mc-console-status">Console ready</span>
                <span className="mc-console-meta">Full service model indexed</span>
              </div>
              <div className="mc-console-body">
                <div className="mc-console-input-col">
                  <label className="mc-console-label">Your prompt</label>
                  <div className="mc-console-input-wrap">
                    <span className="mc-console-prompt">&gt;</span>
                    <textarea
                      className="mc-console-textarea"
                      rows="2"
                      placeholder="e.g. we spend on ads every month but the pipeline never grows"
                      readOnly
                    />
                  </div>
                  <button className="mc-btn mc-btn-primary mc-btn-pill mc-console-btn">
                    Map my services <FiArrowRight />
                  </button>
                  <span className="mc-console-helper">Plain language works best</span>
                  <div className="mc-console-chips">
                    {["Ad spend rises, results do not", "Invisible outside brand search", "AI answers skip us entirely", "Traffic without enquiries", "Launching or replatforming a store", "Reporting nobody trusts"].map((c) => (
                      <span key={c} className="mc-console-chip">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="mc-console-output-col">
                  <span className="mc-console-awaiting">Awaiting input</span>
                  <h3>A full service menu is a lot to read through.</h3>
                  <p>Tell the console the symptom instead — it maps your description to the services, tools and sequence that match.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- FIVE CAPABILITIES ORBITING ONE PLAN ---------- */}
      <section className="mc-orbit-section-alt" id="capabilities" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
        <div className="mc-orbit-bg-glow" aria-hidden="true" />
        <div className="mc-container">
          <Reveal>
            <div className="mc-orbit-head-alt">
              <h2>Five capabilities<br />orbiting one plan</h2>
            </div>
          </Reveal>
          <div className="mc-orbit-layout">
            <div className="mc-orbit-content">
              {[
                { num: "01", label: "Search", title: "Demand you do not rent", desc: "Search and AI visibility compound: the page you publish this quarter is still working next year. It is the only channel that keeps paying after you stop spending.", cta: "SEO & organic growth", href: "/services" },
                { num: "02", label: "Paid", title: "Spend that compounds", desc: "Every rupee is tracked from first click to closed deal. We connect ad platforms, CRM and analytics so you see exactly what converts — and we kill what does not.", cta: "Paid media", href: "/services" },
                { num: "03", label: "Creative", title: "Stories that sell", desc: "From landing pages to product demos, we produce content that explains complex products simply and converts visitors into pipeline.", cta: "Social & creative", href: "/services" },
                { num: "04", label: "Build", title: "Systems that scale", desc: "Custom software, AI agents and workflow automation that connect your data, eliminate manual work and give your team superpowers.", cta: "Web & ecommerce", href: "/services" },
                { num: "05", label: "Data", title: "Be cited, not buried", desc: "ChatGPT, Gemini and Perplexity are the new front page. We optimize your content to be the source these engines reference — so when buyers ask, your brand answers.", cta: "Data & automation", href: "/services" },
              ].map((cap, i) => (
                <Reveal key={cap.num} delay={i * 80}>
                  <div className={`mc-orbit-cap ${i === activeCapability ? "active" : ""}`}>
                    <span className="mc-orbit-cap-accent" aria-hidden="true" />
                    <span className="mc-orbit-cap-num">{cap.num} — {cap.label}</span>
                    <div className="mc-orbit-cap-body">
                      <h3>{cap.title}</h3>
                      <p>{cap.desc}</p>
                      <div className="mc-orbit-cap-actions">
                        <Link to={cap.href} className="mc-orbit-cap-cta">{cap.cta}</Link>
                        <span className="mc-orbit-cap-dots" role="tablist" aria-label="Capability slides">
                          {[0,1,2,3,4].map(d => (
                            <button
                              key={d}
                              type="button"
                              className={`mc-orbit-cap-dot ${d === activeCapability ? "active" : ""}`}
                              aria-label={`Show capability ${d + 1}`}
                              aria-selected={d === activeCapability}
                              role="tab"
                              onClick={() => setActiveCapability(d)}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div className="mc-orbit-carousel-controls">
                <button type="button" aria-label="Previous capability" onClick={() => moveCarousel(setActiveCapability, 5, -1)}><FiChevronLeft /></button>
                <span>{String(activeCapability + 1).padStart(2, "0")} / 05</span>
                <button type="button" aria-label="Next capability" onClick={() => moveCarousel(setActiveCapability, 5, 1)}><FiChevronRight /></button>
              </div>
            </div>
            <div className="mc-orbit-visual">
              <div className="mc-orbit-rings">
                <div className="mc-orbit-ring-sweep" />
                <div className="mc-orbit-ring mc-orbit-ring-outer" />
                <div className="mc-orbit-ring mc-orbit-ring-inner" />
                <div className="mc-orbit-ring mc-orbit-ring-core" />
                <div className="mc-orbit-pulse mc-orbit-pulse-1" />
                <div className="mc-orbit-pulse mc-orbit-pulse-2" />
                <div className="mc-orbit-pulse mc-orbit-pulse-3" />
              </div>
              {["Search", "Paid", "Creative", "Build", "Data"].map((label, i) => {
                const angle = -90 + i * 72;
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 38 * Math.cos(rad);
                const y = 50 + 38 * Math.sin(rad);
                return (
                  <span
                    key={label}
                    className={`mc-orbit-node ${i === activeCapability ? "on" : ""}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setActiveCapability(i)}
                  >
                    <span className="mc-orbit-node-dot" />
                    {label}
                  </span>
                );
              })}
              <div className="mc-orbit-center">
                <img src={logoMark} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CASE STUDIES + RESULTS ---------- */}
      <section className="mc-cs-results-section" id="results" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
        <div className="mc-container">
          <Reveal>
            <div className="mc-cs-results-head">
              <div>
                <span className="mc-cs-results-eyebrow">Case studies</span>
                <h2>Results that speak<br />for themselves</h2>
                <p>From search visibility to conversions, our clients see measurable impact across every metric that matters.</p>
              </div>
            </div>
          </Reveal>
          <div className="mc-cs-results-flex">
            {[
              { metric: "3x", label: "Increase in conversions", desc: "Optimised landing pages and streamlined user flows helped this client triple their conversion rate within 90 days.", color: "var(--brand)", closedHeight: "280px" },
              { metric: "45%", label: "Reduction in churn", desc: "Smart retention workflows and automated engagement reduced customer churn by almost half in six months.", color: "#cfe6ff", closedHeight: "330px" },
              { metric: "93%", label: "Faster response times", desc: "AI-powered support automation cut average response time from hours to minutes.", color: "#1a1f2e", closedHeight: "390px" },
              { metric: "100%", label: "AI search visibility", desc: "Complete optimization across ChatGPT, Gemini and Perplexity — now cited in every relevant query.", color: "var(--brand)", closedHeight: "430px" },
            ].map((cs, i) => (
              <Reveal key={cs.label} delay={i * 100}>
                <div
                  role="button"
                  tabIndex={0}
                  className={`mc-cs-card-new ${i === activeResult ? "is-open" : ""}`}
                  aria-label={`Show case study: ${cs.label}`}
                  aria-pressed={i === activeResult}
                  onClick={() => setActiveResult(i)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setActiveResult(i);
                  }}
                     style={{ "--card-bg": cs.color, "--ih-closed": cs.closedHeight }}>
                  <div className="mc-cs-card-inner">
                    <div className="mc-cs-card-text">
                      <span className="mc-cs-card-label">Case study</span>
                      <h3>{cs.label}</h3>
                      {i === activeResult && <p>{cs.desc}</p>}
                      {i === activeResult && (
                        <Link to="/case-studies" className="mc-cs-card-link">
                          Read case study <FiArrowRight />
                        </Link>
                      )}
                    </div>
                    <div className="mc-cs-card-metric-block">
                      <div className="mc-cs-card-metric">{cs.metric}</div>
                      <div className="mc-cs-card-metric-label">{cs.label}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mc-carousel-controls">
            <button type="button" aria-label="Previous case study" onClick={() => moveCarousel(setActiveResult, 4, -1)}><FiChevronLeft /></button>
            <span>{String(activeResult + 1).padStart(2, "0")} / 04</span>
            <button type="button" aria-label="Next case study" onClick={() => moveCarousel(setActiveResult, 4, 1)}><FiChevronRight /></button>
          </div>
          <Reveal delay={200}>
            <Link to="/case-studies" className="mc-cs-results-cta">
              See your potential — estimate your growth with a free strategy call. <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- LET'S TALK — CTA Section ---------- */}
      <section className="mc-talk-section" id="talk" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
        <div className="mc-talk-dotfield" aria-hidden="true" />
        <div className="mc-container">
          <Reveal>
              <div className="mc-talk-card">
              <div className="mc-talk-card-glow" />
              <div className="mc-talk-card-inner">
                <div className="mc-talk-visual">
                  <div className="mc-talk-visual-center">
                    <FiTarget />
                  </div>
                  {["SEO", "AI Search", "Web Dev", "Paid Media", "Branding", "Social"].map((tag, i) => {
                    const positions = [
                      { left: "2%", top: "10%" },
                      { left: "50%", top: "4%" },
                      { left: "62%", top: "38%" },
                      { left: "44%", top: "74%" },
                      { left: "2%", top: "78%" },
                      { left: "0%", top: "44%" },
                    ];
                    return (
                      <span key={tag} className={`mc-talk-tag ${i === activeQuestion ? "is-active" : ""}`} style={positions[i]}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
                <div className="mc-talk-copy">
                  <span className="mc-talk-eyebrow">Let's talk</span>
                  <h2 className="mc-talk-h2">Any questions about growth?</h2>
                  <div className="mc-talk-question" aria-live="polite">
                    {["Where should we focus first?", "How do we turn traffic into pipeline?", "Can AI make our operations faster?"][activeQuestion]}
                  </div>
                  <p>Tell us where you want to be and we'll map the route — SEO, AI search visibility, paid media and web, in one plan.</p>
                                    <div className="mc-talk-carousel-controls">
                                      <button type="button" aria-label="Previous growth question" onClick={() => moveCarousel(setActiveQuestion, 3, -1)}><FiChevronLeft /></button>
                                      {[0, 1, 2].map((index) => (
                                        <button key={index} type="button" className={index === activeQuestion ? "active" : ""} aria-label={`Show question ${index + 1}`} onClick={() => setActiveQuestion(index)} />
                                      ))}
                                      <button type="button" aria-label="Next growth question" onClick={() => moveCarousel(setActiveQuestion, 3, 1)}><FiChevronRight /></button>
                                    </div>
                  <Link to="/contact" className="mc-btn mc-btn-cta-white mc-talk-btn">
                    Get Your Growth Plan <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA (premium) ---------- */}
      <section className="mc-slab mc-slab-tight">
        <div className="mc-container">
          <Reveal>
            <div className="mc-premium-cta">
              <div className="mc-pc-orb o1" aria-hidden="true" />
              <div className="mc-pc-orb o2" aria-hidden="true" />
              <div className="mc-pc-orb o3" aria-hidden="true" />
              <div className="mc-pc-grid" aria-hidden="true" />
              <div className="mc-pc-corner tl" aria-hidden="true" />
              <div className="mc-pc-corner br" aria-hidden="true" />

              <div className="mc-pc-copy">
                <span className="mc-xo-eyebrow"><i /> // Next step</span>
                <h2>
                  Bring us the business problem. We’ll map the connected
                  <em> data, software and automation </em>around it.
                </h2>
                <p className="mc-pc-lead">
                  See how a single, real-time view of customers, projects and finance changes how
                  your operation runs — scoped honestly against your priorities before anyone writes a line of code.
                </p>
                <div className="mc-pc-actions">
                  <Link to="/contact" className="mc-btn mc-btn-cta-white">
                    Book a free audit <FiArrowRight />
                  </Link>
                  <Link to="/services" className="mc-btn mc-btn-cta-ghost">
                    Explore the services <FiArrowRight />
                  </Link>
                </div>
                <div className="mc-pc-trust">
                  <span><FiCheck /> No obligation</span>
                  <span><FiCheck /> 24h response</span>
                  <span><FiCheck /> Private by default</span>
                </div>
              </div>

              <div className="mc-pc-card">
                <div className="mc-pc-card-head">
                  <span className="mc-pc-card-dot" />
                  <span>What a typical first call covers</span>
                </div>
                <ol className="mc-pc-step">
                  <li><b>01</b> Map the workflows, approvals and data that matter most.</li>
                  <li><b>02</b> Identify the highest-ROI automation to build first.</li>
                  <li><b>03</b> Get a clear scope and milestone plan — no hype, no guesswork.</li>
                </ol>
                <div className="mc-pc-card-foot">
                  <span><FiShield /> Your data stays private &amp; yours</span>
                  <small>Avg. reply &lt; 24 hours</small>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
