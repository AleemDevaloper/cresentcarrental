import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiArrowUpRight, FiMonitor, FiPlayCircle, FiUsers, FiSliders, FiSend, FiCheck, FiZap, FiClock } from "react-icons/fi";
import { Reveal, PageHero, CtaBand, DashFrame } from "@/components/SitePrimitives";
import { aiAgents } from "@/data/siteData";
import { submitDemoRequest } from "@/api/leads";

const erpShot = "/images/company/screens/erp-dashboard.png";

const whyLive = [
  { icon: <FiUsers />, title: "Your workflows, live", text: "We run the demo against workflows and data similar to yours — not a canned sales deck." },
  { icon: <FiSliders />, title: "Real modules, not mockups", text: "Watch the actual dashboards, approvals and AI actions so you can judge fit honestly." },
  { icon: <FiMonitor />, title: "30–45 minutes, zero pressure", text: "Product walkthrough, honest capability boundaries, and a clear next step. Then you decide." },
  { icon: <FiZap />, title: "Q&A with the builders", text: "Talk to the engineers who built it — architecture, integrations, security and limits." },
];

export default function Demo() {
  const [form, setForm] = useState({ name: "", email: "", company: "", product: aiAgents[0]?.slug || "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async () => {
    if (submitting) return;
    if (!form.name.trim() || !form.email.trim()) {
      setError("Please fill in your name and work email.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitDemoRequest({
        name: form.name,
        email: form.email,
        company: form.company,
        product: form.product,
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "Company", to: "/about" }, { label: "Demo", to: "/demo" }]}
        title={<>Book a live demo — <span className="mc-grad-text">see the real product</span></>}
        lede="A guided walkthrough of the modules and AI actions that matter to you. Real interface, your kind of workflows, honest answers."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Live walkthrough</span>
          <span className="mc-kicker">30–45 minutes</span>
          <span className="mc-kicker">With the builders</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-demo-split">
            <Reveal>
              <div className="mc-demo-form-card">
                {!sent ? (
                  <>
                    <div className="mc-demo-kicker"><FiPlayCircle /> Request your demo</div>
                    <h3>Tell us what you want to see</h3>
                    <div className="mc-demo-form">
                      <label>
                        <span>Full name</span>
                        <input type="text" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
                      </label>
                      <label>
                        <span>Work email</span>
                        <input type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" />
                      </label>
                      <label>
                        <span>Company</span>
                        <input type="text" value={form.company} onChange={set("company")} placeholder="Acme Inc" />
                      </label>
                      <label>
                        <span>Product or solution</span>
                        <select value={form.product} onChange={set("product")}>
                          {aiAgents.map((a) => (
                            <option key={a.slug} value={a.slug}>{a.title}</option>
                          ))}
                          <option value="custom">Custom build / not sure yet</option>
                        </select>
                      </label>
                      {error && <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>{error}</p>}
                      <button type="button" className="mc-btn mc-btn-primary mc-btn-xl" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Sending..." : "Request demo"} {!submitting && <FiSend />}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mc-demo-success">
                    <span className="mc-demo-success-icon"><FiCheck /></span>
                    <h3>Request received</h3>
                    <p className="mc-muted" style={{ lineHeight: 1.6 }}>
                      Thanks, <b>{form.name || "there"}</b>! A consultant will reach out at{" "}
                      <b>{form.email || "your email"}</b> within one business day to schedule your
                      {form.product ? ` ${aiAgents.find((a) => a.slug === form.product)?.title || form.product}` : ""} demo.
                    </p>
                    <button type="button" className="mc-btn mc-btn-ghost" onClick={() => setSent(false)}>
                      Send another request
                    </button>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="mc-demo-live">
                <div className="mc-demo-live-head">
                  <span className="mc-demo-dot" /> Live with the team
                </div>
                {whyLive.map((w) => (
                  <div className="mc-demo-reason" key={w.title}>
                    <span className="mc-demo-reason-icon">{w.icon}</span>
                    <div>
                      <h4>{w.title}</h4>
                      <p>{w.text}</p>
                    </div>
                  </div>
                ))}
                <div className="mc-demo-time">
                  <FiClock /> Typically scheduled within 48 hours
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-demo-section">
        <div className="mc-container">
          <div className="mc-demo-band">
            <div className="mc-demo-glow" aria-hidden="true" />
            <Reveal>
              <div className="mc-demo-copy">
                <span className="mc-demo-kicker"><FiMonitor /> Prefer to explore first?</span>
                <h2>Tour the products at your own pace</h2>
                <p>
                  Browse every AI agent, review dashboards, metrics and workflow steps — then book
                  a demo when you’re ready.
                </p>
                <div className="mc-demo-actions">
                  <Link to="/products" className="mc-btn mc-btn-primary">
                    Explore Products <FiArrowRight />
                  </Link>
                  <Link to="/pricing" className="mc-btn mc-btn-ghost">
                    View Pricing
                  </Link>
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

      <CtaBand
        title="Not sure which demo to book?"
        text="Book a free 15-minute scoping call and we’ll recommend the right product or custom build."
        primary="Book a Scoping Call"
        secondary="See the Process"
        secondaryTo="/process"
      />
    </>
  );
}

