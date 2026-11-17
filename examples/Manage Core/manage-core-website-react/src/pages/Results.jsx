import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiCheck, FiTrendingUp, FiClock, FiDollarSign, FiUsers, FiBriefcase } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, Counter, Stars } from "@/components/SitePrimitives";

const metrics = [
  { value: 120, suffix: "+", label: "Solutions Delivered", icon: FiBriefcase },
  { value: 98, suffix: "%", label: "On-Time Delivery", icon: FiClock },
  { value: 40, suffix: "%", label: "Average Cost Reduction", icon: FiDollarSign },
  { value: 38, suffix: "%", label: "Average ROI Increase", icon: FiTrendingUp },
  { value: 10, suffix: "+", label: "Hours Saved Weekly", icon: FiClock },
  { value: 120, suffix: "+", label: "Happy Clients", icon: FiUsers },
];

const caseResults = [
  {
    title: "Unified Operations Platform",
    industry: "Logistics & Distribution",
    before: "Sales, projects and finance in three different tools. Monday reviews took an entire day of reconciliation.",
    after: "One live source of truth. Monday reviews became a 40-minute meeting with a single screen.",
    metrics: [
      { label: "Time saved weekly", value: "40+ hours" },
      { label: "Reporting speed", value: "10x faster" },
      { label: "Data accuracy", value: "100%" },
    ],
  },
  {
    title: "Financial Dashboard Automation",
    industry: "SaaS Startup",
    before: "Month-end scramble with delayed reports. Leadership argued about whose numbers were right.",
    after: "Live dashboards updating from real data. Problems caught the day they happen.",
    metrics: [
      { label: "Month-end close", value: "3 days faster" },
      { label: "Report accuracy", value: "100%" },
      { label: "Decision speed", value: "Same-day" },
    ],
  },
  {
    title: "Construction Project Control",
    industry: "Construction",
    before: "Site costs, contracts and progress scattered across files and email threads.",
    after: "Entire project team sees live costs, approvals and status without asking for updates.",
    metrics: [
      { label: "ROI timeline", value: "< 1 quarter" },
      { label: "Visibility", value: "Real-time" },
      { label: "Cost overruns", value: "Eliminated" },
    ],
  },
];

const testimonials = [
  {
    quote: "Manage Core put every team on one live source of truth. A 40-minute weekly meeting replaced what used to be a full day of file comparisons.",
    name: "Operations Director",
    role: "Logistics & Distribution",
    rating: 5,
  },
  {
    quote: "The month-end scramble is gone. Our dashboards update from live data, so we catch problems the day they happen instead of reading about them in last month's reports.",
    name: "Founder",
    role: "SaaS Startup",
    rating: 5,
  },
  {
    quote: "Our external auditors asked fewer questions this year, not more. Reporting is consistent, approvals are documented, and the audit trail means I can sign off with confidence.",
    name: "CFO",
    role: "Enterprise Client",
    rating: 5,
  },
];

export default function Results() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Results", to: "/results" }]}
        title={<>Proven outcomes, <span className="mc-grad-text">measured results</span></>}
        lede="Every engagement is scoped against measurable outcomes. Here's what our clients actually achieve."
      />

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="By the Numbers"
              title="Results that speak for themselves"
              text="Real data across every engagement — not vanity metrics."
            />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 60}>
                <div className="mc-card mc-card-glow" style={{ textAlign: "center", padding: 32 }}>
                  <m.icon size={24} style={{ color: "var(--brand)", marginBottom: 12 }} />
                  <div style={{ fontSize: 36, fontWeight: 700, color: "var(--ink-hi)" }}>
                    <Counter value={m.value} suffix={m.suffix} />
                  </div>
                  <div style={{ color: "var(--muted)", marginTop: 8 }}>{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Case Study Results"
              title="Before and after"
              text="Real transformations with measured outcomes."
            />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {caseResults.map((cs, i) => (
              <Reveal key={cs.title} delay={i * 80}>
                <div className="mc-card mc-card-glow" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <span className="mc-kicker" style={{ marginBottom: 8 }}>{cs.industry}</span>
                  <h3 style={{ fontSize: 20, marginBottom: 16 }}>{cs.title}</h3>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)", textTransform: "uppercase" }}>Before</span>
                    <p style={{ color: "var(--muted)", fontSize: 14, margin: "4px 0 0" }}>{cs.before}</p>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#06b6d4", textTransform: "uppercase" }}>After</span>
                    <p style={{ color: "var(--ink)", fontSize: 14, margin: "4px 0 0" }}>{cs.after}</p>
                  </div>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: "auto" }}>
                    {cs.metrics.map((m) => (
                      <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                        <span style={{ color: "var(--muted)" }}>{m.label}</span>
                        <span style={{ fontWeight: 600, color: "var(--brand)" }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Client Testimonials"
              title="What our clients say"
              text="Verified feedback from real engagements."
            />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div className="mc-card mc-card-glow" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Stars />
                  <blockquote style={{ flex: 1, margin: "16px 0", fontStyle: "italic", color: "var(--ink-lo)" }}>
                    "{t.quote}"
                  </blockquote>
                  <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 800, textAlign: "center" }}>
          <Reveal>
            <SectionHeader
              center
              eyebrow="Get Started"
              title="Ready to see these results?"
              text="Book a free consultation and we'll map your problem to a measurable outcome."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mc-hero-actions" style={{ justifyContent: "center", marginTop: 24 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-pill">
                Book a Free Audit <FiArrowRight />
              </Link>
              <Link to="/case-studies" className="mc-btn mc-btn-ghost mc-btn-pill">
                Read Case Studies <FiArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
