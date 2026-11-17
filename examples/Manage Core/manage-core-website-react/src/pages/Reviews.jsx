import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiStar, FiShield, FiSend, FiLock, FiMessageSquare, FiUser, FiMail, FiHome, FiBriefcase, FiLayers } from "react-icons/fi";
import { Reveal, PageHero, DashFrame, CtaBand } from "@/components/SitePrimitives";

const approvalShot = "/images/company/screens/approval-workflow.png";

const principles = [
  { icon: <FiShield />, title: "Clear scope and expectations", text: "Modules, responsibilities, assumptions and exclusions are documented before implementation." },
  { icon: <FiMessageSquare />, title: "Practical workflow understanding", text: "The solution is shaped around users, controls, approvals and reporting needs, not generic feature lists." },
  { icon: <FiCheck />, title: "Implementation and user support", text: "Configuration, testing, training and launch readiness are treated as part of successful delivery." },
  { icon: <FiStar />, title: "Long-term system thinking", text: "Architecture and rollout decisions consider future modules, integrations and business growth." },
];

const process = [
  ["1", "Submitted reviews enter a secure, private moderation queue for verification."],
  ["2", "A member of the Manage Core trust team may contact the author to confirm identity and context."],
  ["3", "Authors may request edits or withdrawal prior to publication; final wording is mutually agreed."],
  ["4", "Only non-confidential, approved fields are published; verification contacts remain private."],
];

const assurance = [
  ["Private by default", "All submissions are held privately until verification and consent are complete."],
  ["Controlled publication", "We publish only approved excerpts — no invented identities or fabricated metrics."],
  ["Enterprise-grade handling", "We never request or publish confidential data; compliance and privacy are maintained."],
];

const initialForm = {
  name: "",
  role: "",
  company: "",
  email: "",
  solution: "Not specified",
  rating: 0,
  review: "",
  confirm: false,
};

const ratingLabels = ["", "Needs improvement", "Satisfactory", "Good", "Very good", "Outstanding"];

export default function Reviews() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const updateField = (k, v) => setFormData((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Please enter your name.";
    if (!formData.company.trim()) e.company = "Please enter your company.";
    if (!formData.email.trim()) e.email = "Please provide a verification email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Please enter a valid email address.";
    if (!formData.review.trim() || formData.review.trim().length < 20) e.review = "Please provide a substantive review, at least 20 characters.";
    if (!formData.confirm) e.confirm = "Please confirm permission for verification and publication approval.";
    return e;
  };

  const resetForm = () => {
    setSent(false);
    setFormData(initialForm);
    setErrors({});
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 900);
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "Resources", to: "/resources" }, { label: "Client Reviews", to: "/reviews" }]}
        title={<>Verified client feedback — <span className="mc-grad-text">authentic and accountable</span></>}
        lede="View vetted client feedback or submit your own evidence-based review. Submissions are kept private, verified for authenticity, and only published with explicit permission and editorial approval."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiShield /> Verified submissions</span>
          <span className="mc-kicker"><FiLock /> Private until verified</span>
          <span className="mc-kicker"><FiCheck /> Editorial approval</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">Responsible publishing</div>
              <h2>Trust without fabricated proof</h2>
              <p>We do not publish invented identities, ratings or quotations. Verified feedback appears only after approval.</p>
            </div>
          </Reveal>
          <div className="mc-grid-4">
            {["No automatic public posting", "No fake identities or photographs", "Explicit permission recorded", "Only verified non-demo reviews displayed"].map((t, i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="mc-num mc-card mc-card-hover" style={{ height: "100%", padding: 22 }}>
                  <div className="mc-n">0{i + 1}</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15.5, lineHeight: 1.45 }}>{t}</h4>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 30, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">Share Your Experience <FiArrowRight /></Link>
            <span style={{ marginLeft: 14 }} className="mc-muted">Or explore <Link to="/case-studies" style={{ color: "var(--brand-3)", fontWeight: 700 }}>case studies</Link></span>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-review-intake-section">
        <div className="mc-container">
          <Reveal>
            <div className="mc-review-intake">
              {!sent ? (
                <>
                  <aside className="mc-review-intake-side">
                    <span className="mc-review-intake-icon"><FiMessageSquare /></span>
                    <span className="mc-eyebrow">Client review desk</span>
                    <h2>Contribute verified feedback via a controlled approval flow</h2>
                    <p>
                      Provide concise, factual feedback about outcomes, delivery, or support. Submissions are handled privately, verified for authenticity, and published only with explicit consent.
                    </p>
                    <div className="mc-review-assurance">
                      {assurance.map(([title, text]) => (
                        <div key={title}>
                          <FiCheck />
                          <span><b>{title}</b><small>{text}</small></span>
                        </div>
                      ))}
                    </div>
                  </aside>

                  <div className="mc-review-form-panel">
                    <div className="mc-review-form-head">
                      <div className="mc-review-form-head-icon"><FiMessageSquare /></div>
                      <div className="mc-review-form-head-copy">
                        <span className="mc-kicker"><FiShield /> Verification required</span>
                        <h3>Review submission</h3>
                        <p>Share a verified experience — it takes under two minutes.</p>
                      </div>
                      <span className="mc-review-status"><i /> Private — under review</span>
                    </div>

                    <form className="mc-form mc-review-form" onSubmit={(e) => e.preventDefault()} noValidate>
                      <div className="mc-review-sec">
                        <div className="mc-review-sec-head">
                          <span className="mc-review-sec-n">01</span>
                          <div><b>About you</b><small>We use this only for verification, never for display.</small></div>
                        </div>
                        <div className="mc-form-row">
                          <div className="mc-field">
                            <label htmlFor="rv-name">Your name *</label>
                            <div className="mc-input-wrap">
                              <FiUser />
                              <input id="rv-name" name="name" className={`mc-input ${errors.name ? "invalid" : ""}`} type="text" placeholder="Jane Doe" value={formData.name} onChange={(e) => updateField("name", e.target.value)} aria-invalid={errors.name ? "true" : "false"} required />
                            </div>
                            {errors.name && <div className="mc-form-error">{errors.name}</div>}
                          </div>
                          <div className="mc-field">
                            <label htmlFor="rv-role">Role / designation</label>
                            <div className="mc-input-wrap">
                              <FiBriefcase />
                              <input id="rv-role" name="role" className="mc-input" type="text" placeholder="Operations Manager" value={formData.role} onChange={(e) => updateField("role", e.target.value)} />
                            </div>
                          </div>
                        </div>

                        <div className="mc-form-row">
                          <div className="mc-field">
                            <label htmlFor="rv-company">Company *</label>
                            <div className="mc-input-wrap">
                              <FiHome />
                              <input id="rv-company" name="company" className={`mc-input ${errors.company ? "invalid" : ""}`} type="text" placeholder="Acme Inc" value={formData.company} onChange={(e) => updateField("company", e.target.value)} aria-invalid={errors.company ? "true" : "false"} required />
                            </div>
                            {errors.company && <div className="mc-form-error">{errors.company}</div>}
                          </div>
                          <div className="mc-field">
                            <label htmlFor="rv-email">Verification email *</label>
                            <div className="mc-input-wrap">
                              <FiMail />
                              <input id="rv-email" name="email" className={`mc-input ${errors.email ? "invalid" : ""}`} type="email" placeholder="you@company.com" value={formData.email} onChange={(e) => updateField("email", e.target.value)} aria-invalid={errors.email ? "true" : "false"} required />
                            </div>
                            {errors.email && <div className="mc-form-error">{errors.email}</div>}
                          </div>
                        </div>
                      </div>

                      <div className="mc-review-sec">
                        <div className="mc-review-sec-head">
                          <span className="mc-review-sec-n">02</span>
                          <div><b>Your experience</b><small>What you chose, and how it went.</small></div>
                        </div>

                        <div className="mc-field">
                          <label htmlFor="rv-solution">Solution used</label>
                          <div className="mc-input-wrap mc-select-wrap">
                            <FiLayers />
                            <select id="rv-solution" name="solution" className="mc-select" value={formData.solution} onChange={(e) => updateField("solution", e.target.value)}>
                              <option>Not specified</option>
                              <option>AI Integration &amp; Automation</option>
                              <option>HRMS &amp; Payroll</option>
                              <option>Accounting ERP &amp; Inventory</option>
                              <option>Retail POS</option>
                              <option>School Management</option>
                              <option>Custom Software</option>
                              <option>Custom Website / Products</option>
                            </select>
                          </div>
                        </div>

                        <div className="mc-field mc-rating-field">
                          <label>Overall rating</label>
                          <div className="mc-rating" role="radiogroup" aria-label="Overall rating">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button
                                key={n}
                                type="button"
                                role="radio"
                                aria-checked={formData.rating === n}
                                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                                className={`mc-rating-star ${formData.rating >= n ? "active" : ""}`}
                                onClick={() => updateField("rating", formData.rating === n ? 0 : n)}
                              >
                                <FiStar />
                              </button>
                            ))}
                            <span className="mc-rating-label">{formData.rating ? ratingLabels[formData.rating] : "Tap to rate"}</span>
                          </div>
                        </div>

                        <div className="mc-field">
                          <label htmlFor="rv-review">Your review *</label>
                          <div className="mc-input-wrap mc-textarea-wrap">
                            <FiMessageSquare />
                            <textarea id="rv-review" name="review" rows={5} maxLength={500} className={`mc-textarea ${errors.review ? "invalid" : ""}`} placeholder="Describe the workflow, support experience or business result that mattered most. Do not include passwords or confidential data." value={formData.review} onChange={(e) => updateField("review", e.target.value)} aria-invalid={errors.review ? "true" : "false"} required />
                          </div>
                          <div className="mc-char-count">
                            <span style={{ color: formData.review.length >= 500 ? "var(--danger)" : "inherit" }}>{formData.review.length} / 500</span>
                          </div>
                          {errors.review && <div className="mc-form-error">{errors.review}</div>}
                        </div>
                      </div>

                      <label className="mc-field mc-checkbox mc-review-consent d-flex">
                        <input type="checkbox" checked={formData.confirm} onChange={(e) => updateField("confirm", e.target.checked)} aria-required="true" />
                        <span><b>Verification &amp; publication consent</b>I confirm this is my genuine experience and permit Manage Core to contact me for verification and, after approval, publish approved public fields in line with the Privacy Policy.</span>
                      </label>
                      {errors.confirm && <div className="mc-form-error">{errors.confirm}</div>}

                      <div className="mc-review-submit-row">
                        <button type="button" className="mc-btn mc-btn-primary mc-btn-pill" disabled={submitting} onClick={handleSubmit}>
                          {submitting ? "Submitting..." : "Submit Review"} <FiSend />
                        </button>
                        <span><FiLock /> Stored privately until approved</span>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="mc-demo-success mc-review-success">
                  <span className="mc-demo-success-icon"><FiCheck /></span>
                  <h3>Thank you — submission received</h3>
                  <p className="mc-muted" style={{ lineHeight: 1.6 }}>
                    The review is in our private verification queue. The team will confirm the submission and reach out if clarification is required. Only approved, non-confidential excerpts are published.
                  </p>
                  <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                    <button type="button" className="mc-btn mc-btn-primary" onClick={resetForm}>
                      Submit another
                    </button>
                    <Link to="/case-studies" className="mc-btn mc-btn-ghost">Browse case studies</Link>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 900 }}>
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">Guided response</div>
              <h2>How review approval works</h2>
            </div>
          </Reveal>
          <div className="mc-grid-2">
            {process.map(([n, t], i) => (
              <Reveal key={n} delay={i * 60}>
                <article className="mc-card mc-card-hover mc-approval-card" style={{ height: "100%" }}>
                  <div className="mc-approval-left">
                    <div className="mc-n">{n}</div>
                  </div>
                  <div className="mc-approval-body">
                    <h4>{t}</h4>
                    <p className="mc-muted">We verify the submission source, confirm permission, and show only approved fields publicly.</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={80} style={{ marginTop: 40, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            <DashFrame image={approvalShot} label="Moderation &amp; approval queue" alt="Manage Core review moderation workflow" />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">What businesses value in Manage Core</div>
              <h2>Service principles, not marketing claims</h2>
              <p>These guide how every engagement is shaped and delivered.</p>
            </div>
          </Reveal>
          <div className="mc-grid-4">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 4) * 60}>
                <article className="mc-card mc-card-hover mc-feature" style={{ height: "100%" }}>
                  <div className="mc-f-icon">{p.icon}</div>
                  <h3 style={{ fontSize: 15.5 }}>{p.title}</h3>
                  <p style={{ fontSize: 13.5 }}>{p.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Heard enough? See the systems yourself."
        text="Explore live demos and product workflows, or book a guided session around your own requirements."
        primary="Book a Demo"
        secondary="Browse Case Studies"
        secondaryTo="/case-studies"
        primaryTo="/demo"
      />
    </>
  );
}

