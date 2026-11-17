import { Link } from "react-router-dom";
import React, { useState } from "react";
import {
  FiMail, FiPhoneCall, FiMapPin, FiClock, FiCheck, FiArrowRight, FiGlobe,
  FiMessageSquare, FiShield, FiLock, FiArrowUpRight, FiUsers,
} from "react-icons/fi";
import { Reveal, CtaBand } from "@/components/SitePrimitives";
import { downloadCompanyBrochure } from "@/components/ServicePdf";
import { submitContactMessage } from "@/api/leads";

const heroBg = "/images/company/aivent/background/4.webp";

const initialForm = { name: "", email: "", company: "", service: "Custom Software Development", budget: "", message: "" };

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        company: form.company,
        service: form.service,
        budget: form.budget,
        message: form.message,
      });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // New: reset the form and show it again (used from the success state)
  const resetForm = () => {
    setForm(initialForm);
    setSent(false);
  };

  function DownloadBrochureButton() {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const start = async () => {
      try {
        setLoading(true);
        await downloadCompanyBrochure();
        setDone(true);
        setTimeout(() => setDone(false), 2200);
      } catch {
        // fail silently — the download already handles errors
      } finally {
        setLoading(false);
      }
    };
    return (
      <button
        type="button"
        className={`mc-brochure mc-btn mc-btn-primary mc-btn-pill ${loading ? 'mc-btn-loading' : ''}`}
        onClick={start}
        aria-live="polite"
        aria-busy={loading}
      >
        {loading ? 'Downloading…' : done ? 'Saved ✓' : 'Download Brochure'} {loading ? null : <FiArrowRight />}
      </button>
    );
  }

  return (
    <>
      {/* Avent-style hero: full-bleed background image + overlay + huge title */}
      <section className="mc-ai-hero">
        <img src={heroBg} alt="" className="mc-ai-bg" aria-hidden="true" />
        <div className="mc-ai-overlay" aria-hidden="true" />
        <div className="mc-container mc-ai-hero-inner">
          <div className="mc-ai-hero-copy">
            <nav className="mc-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <i>/</i>
              <span>Contact</span>
            </nav>
            <Reveal>
              <h1 className="mc-ai-title">Let’s build, <span className="mc-grad-text">automate</span> &amp; grow</h1>
            </Reveal>
            <Reveal delay={140}>
              {/* New: trust/response chips under the hero title */}
              <div className="mc-ai-hero-chips">
                <span><i className="mc-chip-dot" /> 24h reply</span>
                <span><FiShield /> NDA-friendly</span>
                <span><FiCheck /> No-obligation audit</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <p className="mc-ai-hero-side">
              Bring us the business problem. We’ll map the software, automation and growth system
              around it — and respond within one business day.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-ai-contact-section">
        <div className="mc-container">
          <div className="mc-split" style={{ gap: 48 }}>
            {/* Info */}
            <div>
              <Reveal>
                <div className="mc-eyebrow">Get in touch</div>
                <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", marginTop: 12 }}>We’re here to answer your questions.</h2>
                <p className="mc-muted" style={{ marginTop: 14, marginBottom: 30, lineHeight: 1.7 }}>
                  Have a question about a project, product or partnership? Tell us where you are
                  and where you want to be.
                </p>
              </Reveal>
              {/* New: 2-column method card grid */}
              <div className="mc-contact-grid">
                {[
                  [FiGlobe, "Event & delivery", "Remote-ready, worldwide"],
                  [FiMail, "Send a message", "sales@managecore.test"],
                  [FiPhoneCall, "Call us directly", "+1 (000) 000-0000"],
                  [FiClock, "Response time", "Within one business day"],
                  [FiMapPin, "Headquarters", "Working globally"],
                  [FiShield, "Privacy", "NDA-friendly · Private by default"],
                ].map(([Icon, t, d], i) => (
                  <Reveal key={t} delay={i * 40}>
                    <div className="mc-ai-method">
                      <span className="mc-ai-method-icon"><Icon /></span>
                      <div>
                        <b>{t}</b>
                        {t === "Send a message" ? <a to="mailto:sales@managecore.test">{d}</a> : <div className="mc-muted">{d}</div>}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* New: "what happens next" mini timeline */}
              <Reveal delay={60} className="mc-ai-next">
                <div className="mc-ai-next-head">
                  <span className="mc-ai-method-icon"><FiArrowUpRight /></span>
                  <b>What happens next?</b>
                </div>
                <ol className="mc-ai-next-list">
                  <li><i>1</i> We reply within one business day.</li>
                  <li><i>2</i> A short call to map your priorities and scope.</li>
                  <li><i>3</i> Clear cost, timeline and plan — no obligation.</li>
                </ol>
              </Reveal>
            </div>

            {/* Right: form card like Avent */}
            <div>
              <Reveal delay={80}>
                <div className="mc-ai-formcard">
                  <div className="mc-ai-formcard-body">
                    <div className="mc-ai-formcard-head">
                      <FiMessageSquare />
                      <div>
                        <h3>Get in touch</h3>
                        <p>Fill out the form and we’ll get back to you soon.</p>
                      </div>
                    </div>

                    {sent ? (
                      <div style={{ textAlign: "center", padding: "40px 0" }} role="status" aria-live="polite">
                        {/* New: animated success ring */}
                        <div className="mc-f-icon-ring">
                          <FiCheck />
                        </div>
                        <h3 style={{ fontSize: 24 }}>Message received</h3>
                        <p className="mc-muted" style={{ marginTop: 12, lineHeight: 1.7 }}>
                          Thank you for reaching out. Here is what happens next:
                        </p>
                        <div className="mc-success-steps">
                          <span><i>1</i> We reply within one business day.</span>
                          <span><i>2</i> We match you to the right team member.</span>
                          <span><i>3</i> You get a clear, no-obligation plan.</span>
                        </div>
                        <button type="button" className="mc-btn mc-btn-ghost" style={{ marginTop: 8 }} onClick={resetForm}>
                          <FiUsers /> Send another message
                        </button>
                      </div>
                    ) : (
                      <form className="mc-form" onSubmit={submit} noValidate={false}>
                        {/* New: two-column rows keep the form compact */}
                        <div className="mc-form-row">
                          <div className="mc-field">
                            <label htmlFor="name">Full name</label>
                            <input id="name" name="name" required autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={update} />
                          </div>
                          <div className="mc-field">
                            <label htmlFor="email">Work email</label>
                            <input id="email" name="email" type="email" required autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={update} />
                          </div>
                        </div>
                        <div className="mc-form-row">
                          <div className="mc-field">
                            <label htmlFor="company">Company</label>
                            <input id="company" name="company" autoComplete="organization" placeholder="Acme Inc." value={form.company} onChange={update} />
                          </div>
                          <div className="mc-field">
                            <label htmlFor="service">What do you need?</label>
                            <span className="mc-select-wrap">
                              <select id="service" name="service" value={form.service} onChange={update}>
                                {["Custom Software Development", "AI Solutions & Automation", "ERP, CRM & HRMS", "Web, Mobile & Desktop", "Cloud, DevOps & Security", "UI/UX & Branding", "Digital & Growth Marketing", "Business Automation & Consulting"].map((s) => (
                                  <option key={s}>{s}</option>
                                ))}
                              </select>
                            </span>
                          </div>
                        </div>
                        <div className="mc-field">
                          <label htmlFor="budget">Budget range</label>
                          <span className="mc-select-wrap">
                            <select id="budget" name="budget" value={form.budget} onChange={update}>
                              {["Not sure yet", "Under $5k", "$5k – $20k", "$20k – $60k", "$60k+"].map((b) => (
                                <option key={b}>{b}</option>
                              ))}
                            </select>
                          </span>
                        </div>
                        <div className="mc-field">
                          <label htmlFor="message">Tell us about the business problem</label>
                          <textarea id="message" name="message" required placeholder="What are you trying to build, automate, fix or grow?" value={form.message} onChange={update} />
                        </div>
                        {error && <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 12 }}>{error}</p>}
                        <button type="submit" className="mc-btn mc-btn-primary mc-btn-block" style={{ minHeight: 54, fontSize: 16 }} disabled={submitting}>
                          {submitting ? "Sending..." : "Send message"} {!submitting && <FiArrowRight />}
                        </button>
                        {/* New: privacy reassurance under the button */}
                        <p className="mc-form-note"><FiLock /> Your information stays private. We never share it.</p>
                      </form>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-tight">
        <div className="mc-container">
          <Reveal>
            <div className="mc-cta">
              <h2>Want the full picture first?</h2>
              <p>Download the Manage Core capability brochure — all services, categories, delivery model and contact details in one PDF.</p>
              <div className="mc-hero-actions" style={{ marginTop: 26 }}>
                {/* Improved download UX: show downloading state and transient success */}
                <DownloadBrochureButton />
                <Link to="/solutions" className="mc-btn mc-btn-ghost">Explore Solutions</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

