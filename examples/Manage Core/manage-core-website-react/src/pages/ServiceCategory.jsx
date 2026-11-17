import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiCheck, FiLayers } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { serviceCategories } from "@/data/servicesData";
import { SHARED_PROCESS } from "@/data/servicesData";

const workflowShot = "/images/company/screens/workflow-dashboard.png";

const CATEGORY_EXTRA = {
  "software-product-development": {
    lede: "Custom software, web and mobile products engineered to fit your operation — from focused MVPs to enterprise platforms. Here's everything we can build for you under one connected practice.",
  },
  "ai-and-automation": {
    lede: "Practical AI — agents, RAG, ML and automation — scoped to measurable business outcomes and deployed with guardrails, not experiments. Here are the ways we apply it.",
  },
  "business-software-systems": {
    lede: "ERP, HRMS, CRM, finance, inventory and management systems with workflow, control and audit built in. Here are the systems we build and configure.",
  },
  "digital-marketing-growth": {
    lede: "SEO, paid, content, email and conversion engineering run as one predictable acquisition system. Here's the full growth practice.",
  },
  "design-branding": {
    lede: "UI/UX, identity and creative that make your product and brand credible, consistent and clear. Here's the design practice end to end.",
  },
  "cloud-it": {
    lede: "Cloud architecture, migration, DevOps, servers and databases engineered for reliability and scale. Here's the infrastructure practice.",
  },
  cybersecurity: {
    lede: "Assessments, pen testing, security engineering and compliance that protect what you've built. Here's the security practice.",
  },
  consulting: {
    lede: "Technology strategy, transformation and product guidance from a position of hands-on experience. Here's the consulting practice.",
  },
};

export default function ServiceCategory() {
  const slug = routeParam(useParams().slug);
  const cat = serviceCategories.find((c) => c.slug === slug);
  const [openFaq, setOpenFaq] = useState(0);

  if (!cat) return <Navigate to="/services" replace />;

  const extra = CATEGORY_EXTRA[slug] || {};
  const services = cat.links || [];
  const IconComponent = cat.icon || FiLayers;

  const faqs = [
    ["How do I know which service in this category I need?", "Start with the free consultation. We map your problem, point you to the right service — or the right combination — and scope it with you before anything is built."],
    ["Can you combine services from this category with others?", "Yes. Most clients begin with one entry point and we connect an end-to-end platform across software, AI, security, design and growth."],
    ["Do you work with our existing tools?", "Almost always. We integrate with and extend what you already use, and only replace something when it makes sense after we see how it works."],
    ["How are packages priced?", "Every package is scoped from your requirements. Prices are confirmed after discovery — no unclear day-rates, no surprise change orders."],
    ["What happens after launch?", "Every delivery includes a warranty window, and we offer ongoing support, monitoring and optimization plans."],
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Services", to: "/services" }, { label: cat.name, to: `#` }]}
        kicker={<>{IconComponent && <IconComponent size={18} />} {cat.name}</>}
        title={<>{cat.name} — <span className="mc-grad-text">built the way your business works</span></>}
        lede={extra.lede || cat.short}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">{cat.name}</span>
          <span className="mc-kicker">{services.length} services</span>
          <span className="mc-kicker">One delivery team</span>
        </div>
      </PageHero>

      {/* Stats */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-xo-statsrow" style={{ marginTop: 0 }}>
            <div className="mc-xo-stat-item">
              <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>{services.length}</b>
              <span>Services in this category</span>
            </div>
            <div className="mc-xo-stat-item">
              <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>8</b>
              <span>Connected practices overall</span>
            </div>
            <div className="mc-xo-stat-item">
              <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>100%</b>
              <span>Source code ownership</span>
            </div>
            <div className="mc-xo-stat-item">
              <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>24h</b>
              <span>Response time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Service directory */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="In this category" title={<>Every service in <span className="mc-grad-text">{cat.name}</span></>} text="Each service has its own page with scope, packages, deliverables and answers." />
          </Reveal>
          <div className="mc-svc-grid" style={{ marginTop: 36 }}>
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 70}>
                <article className="mc-svc-card">
                  <span className="mc-svc-top">
                    <span className="mc-svc-icon"><s.icon /></span>
                    <span className="mc-svc-pill">{cat.name}</span>
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
      </section>

      {/* Why this practice */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <div className="mc-split">
            <div>
              <Reveal>
                <SectionHeader eyebrow="Why this practice" title="Because a practice beats a menu" />
              </Reveal>
              <Reveal delay={80}>
                <p className="mc-muted" style={{ lineHeight: 1.7 }}>
                  These services aren't isolated offerings — they're one connected practice delivered by a single team.
                  Most engagements blend two or more, so the handoffs, data and reporting stay under one roof.
                </p>
              </Reveal>
              <Reveal delay={120} style={{ marginTop: 26 }}>
                <Link to="/contact" className="mc-btn mc-btn-primary">Find the right combination <FiArrowRight /></Link>
              </Reveal>
            </div>
            <Reveal delay={100}>
              <DashFrame image={workflowShot} label="Unified delivery dashboard" alt="Manage Core delivery dashboard" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Process"
              title={<>The same delivery model for <span className="mc-grad-text">every service</span></>}
              text="From discovery to supported operation — one structured path regardless of which service you choose."
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
        </div>
      </section>

      {/* Other categories */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Explore further" title="Other connected practices" />
          </Reveal>
          <div className="mc-cat-grid" style={{ marginTop: 36 }}>
            {serviceCategories.filter((c) => c.slug !== slug).map((c, i) => (
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

      {/* FAQ */}
      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 880 }}>
          <Reveal>
            <SectionHeader center eyebrow="FAQ" title={<>How this category <span className="mc-grad-text">actually works</span></>} />
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

      <CtaBand
        title="Not sure where to start in this category?"
        text="Tell us the business problem. We'll map the right services around it — free, no obligation."
        primary="Book a Consultation"
        secondary="View All Services"
        primaryTo="/contact"
        secondaryTo="/services"
      />
    </>
  );
}

