import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiMessageSquare, FiDownload, FiLock } from "react-icons/fi";
import { Reveal, SectionHeader, DashFrame, CheckList, FAQItem } from "./SitePrimitives";
import { SHARED_PROCESS, DEFAULT_DELIVERABLES, DEFAULT_FAQS, categoryFor, relatedServices } from "@/data/servicesData";
import { serviceTierPricing } from "@/data/pricingData";

export function ServiceHero({ service, onPdf }) {
  const cat = categoryFor(service.category);
  return (
    <section className="mc-page-hero">
      <div className="mc-container">
        <nav className="mc-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <i>/</i>
          <Link to="/services">Services</Link>
          <i>/</i>
          {cat && (
            <>
              <Link to={`/services/categories/${cat.slug}`}>{cat.name}</Link>
              <i>/</i>
            </>
          )}
          <span>{service.name}</span>
        </nav>
        <div className="mc-kicker" style={{ marginBottom: 22 }}>
          <service.icon /> {cat ? `${cat.name} · ` : ""}{service.name}
        </div>
        <h1>{service.headline}</h1>
        <p className="mc-lede">{service.description}</p>
        <div className="mc-hero-actions" style={{ marginTop: 26 }}>
          <Link to="/contact" className="mc-btn mc-btn-primary">Start a Project <FiArrowRight /></Link>
          <Link to="/contact" className="mc-btn mc-btn-ghost">Request a Proposal</Link>
          {onPdf && (
            <button type="button" className="mc-btn mc-btn-ghost" onClick={onPdf}>
              <FiDownload style={{ marginRight: 6 }} /> Brochure (PDF)
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export function ServiceOverview({ service }) {
  const hasCapabilities = service.capabilities && service.capabilities.length;
  return (
    <section className="mc-slab" style={{ paddingTop: 0 }}>
      <div className="mc-container">
        <div className="mc-svc-layout">
          <div>
            <Reveal>
              <SectionHeader eyebrow="What this service covers" title={service.name} />
            </Reveal>
            <Reveal delay={80}>
              <p className="mc-svc-copy">{service.overview}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mc-svc-who">
                <b className="mc-eyebrow">Who this is for</b>
                <p>{service.whoNeeds}</p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <DashFrame image={service.image} label={service.name} alt={`${service.name} interface preview`} />
          </Reveal>
        </div>
        {hasCapabilities && (
          <div className="mc-svc-cap-grid" style={{ marginTop: 44 }}>
            {service.capabilities.map((c) => (
              <div className="mc-svc-cap-chip" key={c}>
                <FiCheck /> {c}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function ServiceProblems({ service }) {
  if (!service.problems || !service.problems.length) return null;
  return (
    <section className="mc-slab" style={{ background: "var(--bg-2)" }}>
      <div className="mc-container">
        <div className="mc-split">
          <div>
            <Reveal>
              <SectionHeader
                eyebrow="Why teams reach for this"
                title="The problems this service removes"
              />
            </Reveal>
            <Reveal delay={100} style={{ marginTop: 26 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary">
                Discuss your situation <FiArrowRight />
              </Link>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <ul className="mc-check-list">
              {service.problems.map((p) => (
                <li key={p}>
                  <span className="mc-tick"><FiCheck /></span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ServiceProcess({ title, text }) {
  return (
    <section className="mc-slab">
      <div className="mc-container">
        <Reveal>
          <SectionHeader
            center
            eyebrow="Delivery process"
            title={title || <>How we deliver <span className="mc-grad-text">every engagement</span></>}
            text={text}
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
  );
}

function TechGroup({ label, values }) {
  if (!values || !values.length) return null;
  return (
    <div className="mc-svc-tech-group">
      <b>{label}</b>
      <div className="mc-tech-cloud">
        {values.map((t) => (
          <span className="mc-tech-pill" key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export function ServiceTechnology({ service }) {
  const tech = service.tech;
  if (!tech) return null;
  const groups = [
    ["Frontend", tech.frontend],
    ["Backend", tech.backend],
    ["Mobile", tech.mobile],
    ["Database", tech.database],
    ["Cloud & Infrastructure", tech.cloud],
  ].filter(([, v]) => v && v.length && !v.some((x) => x === "N/A"));

  if (!groups.length) return null;
  return (
    <section className="mc-slab" style={{ background: "var(--bg-2)" }}>
      <div className="mc-container">
        <Reveal>
          <SectionHeader
            eyebrow="Technology"
            title="A pragmatic, maintainable stack"
            text="We select tools for fit, maintainability and your team's ability to run them — not for fashion."
          />
        </Reveal>
        <div className="mc-svc-tech-wrap" style={{ marginTop: 36 }}>
          {groups.map(([label, values]) => (
            <TechGroup key={label} label={label} values={values} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicePackages({ service }) {
  const packages = serviceTierPricing(service);
  if (!packages || !packages.length) return null;
  return (
    <section className="mc-slab">
      <div className="mc-container">
        <Reveal>
          <SectionHeader
            center
            eyebrow="Packages & pricing"
            title={<>Simple, honest <span className="mc-grad-text">starting packages</span></>}
            text="Pricing is confirmed after discovery — these packages describe scope, not a binding price list. Custom quotes for enterprise needs."
          />
        </Reveal>
        <div className="mc-package-grid" style={{ marginTop: 44 }}>
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <article className={`mc-package-card ${p.featured ? "featured" : ""}`}>
                {p.featured && <span className="mc-package-badge">Most Popular</span>}
                <h3>{p.name}</h3>
                <p className="mc-package-audience">{p.audience}</p>
                <div className="mc-package-price">{p.price}</div>
                <div className="mc-package-note">{p.priceNote}</div>
                <ul className="mc-package-list">
                  {p.features.map((f) => (
                    <li key={f}><span className="mc-tick"><FiCheck /></span><span>{f}</span></li>
                  ))}
                </ul>
                <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-block">
                  {p.cta || "Get Custom Quote"} <FiArrowRight />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceDeliverables({ deliverables }) {
  const list = deliverables || DEFAULT_DELIVERABLES;
  return (
    <section className="mc-slab mc-slab-tight">
      <div className="mc-container">
        <Reveal>
          <SectionHeader
            eyebrow="What you own at handover"
            title="Deliverables, not just work"
          />
        </Reveal>
        <div className="mc-deliver-grid" style={{ marginTop: 32 }}>
          {list.map((d) => (
            <div className="mc-deliver-item" key={d.label}>
              <span className="mc-tick"><FiCheck /></span>
              <div>
                <b>{d.label}</b>
                <p>{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceFAQ({ service }) {
  const [open, setOpen] = useState(0);
  const faqs = service.faqs || DEFAULT_FAQS;
  return (
    <section className="mc-slab">
      <div className="mc-container" style={{ maxWidth: 880 }}>
        <Reveal>
          <SectionHeader
            center
            eyebrow="FAQ"
            title={<>Answers about <span className="mc-grad-text">{service.name}</span></>}
            text="Honest, practical answers to the questions that come up most."
          />
        </Reveal>
        <div className="mc-faq-list" style={{ marginTop: 32 }}>
          {faqs.map((f, i) => (
            <Reveal key={f[0]} delay={i * 40}>
              <FAQItem
                q={f[0]}
                a={f[1]}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServiceRelated({ service }) {
  const related = relatedServices(service, 3);
  if (!related.length) return null;
  return (
    <section className="mc-slab" style={{ background: "var(--bg-2)" }}>
      <div className="mc-container">
        <Reveal>
          <SectionHeader eyebrow="Explore more" title="Related services" />
        </Reveal>
        <div className="mc-svc-grid" style={{ marginTop: 32 }}>
          {related.map((s) => (
            <Reveal key={s.slug}>
              <article className="mc-svc-card">
                <span className="mc-svc-top">
                  <span className="mc-svc-icon"><s.icon /></span>
                </span>
                <span className="mc-svc-body">
                  <span className="mc-svc-title">{s.name}</span>
                  <span className="mc-svc-text">{s.description}</span>
                </span>
                <span className="mc-svc-foot">
                  <Link to={`/services/${s.slug}`}>View service <FiArrowRight /></Link>
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const initialQuote = { name: "", email: "", company: "", budget: "", message: "" };

function Field({ id, label, required, children }) {
  return (
    <div className="mc-field">
      <label htmlFor={id}>
        {label}
        {required && <i className="mc-req" aria-hidden="true">*</i>}
      </label>
      {children}
    </div>
  );
}

export function QuoteForm({ serviceName }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ ...initialQuote, service: serviceName || "" });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => { e.preventDefault(); setSent(true); };
  const reset = () => { setForm({ ...initialQuote, service: serviceName || "" }); setSent(false); };

  if (sent) {
    return (
      <div className="mc-quote-success">
        <div className="mc-f-icon-ring"><FiCheck /></div>
        <h3>Request received</h3>
        <p>Thanks, {form.name || "there"} — we’ll reply within one business day with next steps for your {form.service || "project"}.</p>
        <div className="mc-success-steps">
          <span><i>1</i> A member of the team reviews your request.</span>
          <span><i>2</i> We confirm your scope and a practical timeline.</span>
          <span><i>3</i> You receive a clear plan and quote — no obligation.</span>
        </div>
        <button type="button" className="mc-btn mc-btn-ghost" onClick={reset}>Send another request</button>
      </div>
    );
  }

  return (
    <form className="mc-form" onSubmit={submit} noValidate={false}>
      <div className="mc-form-row">
        <Field id="quote-name" label="Your name" required>
          <input id="quote-name" name="name" required autoComplete="name" value={form.name} onChange={update} placeholder="Full name" />
        </Field>
        <Field id="quote-email" label="Work email" required>
          <input id="quote-email" name="email" type="email" required autoComplete="email" value={form.email} onChange={update} placeholder="you@company.com" />
        </Field>
      </div>
      <div className="mc-form-row">
        <Field id="quote-company" label="Company">
          <input id="quote-company" name="company" autoComplete="organization" value={form.company} onChange={update} placeholder="Company name" />
        </Field>
        <Field id="quote-budget" label="Budget range">
          <span className="mc-select-wrap">
            <select id="quote-budget" name="budget" value={form.budget} onChange={update}>
              <option value="">Select a range</option>
              <option>Under $5,000</option>
              <option>$5,000 – $15,000</option>
              <option>$15,000 – $50,000</option>
              <option>$50,000+</option>
              <option>Not sure yet</option>
            </select>
          </span>
        </Field>
      </div>
      <Field id="quote-service" label="Service of interest" required>
        <input id="quote-service" name="service" required value={form.service} onChange={update} placeholder="Service" />
      </Field>
      <Field id="quote-message" label="Tell us about the work" required>
        <textarea id="quote-message" name="message" rows="4" required value={form.message} onChange={update} placeholder="Goals, current tools, timeline…" />
      </Field>
      <button type="submit" className="mc-btn mc-btn-primary mc-btn-block">
        <FiMessageSquare /> Request a Quote
      </button>
      <p className="mc-form-note"><FiLock /> NDA-friendly · No obligation · Reply within one business day</p>
    </form>
  );
}

export function ServiceQuoteSection({ service }) {
  return (
    <section className="mc-slab" style={{ background: "var(--bg-2)" }}>
      <div className="mc-container">
        <div className="mc-split" style={{ gap: 48 }}>
          <div>
            <Reveal>
              <SectionHeader
                eyebrow={`Work with Manage Core on ${service.name}`}
                title={<>Tell us about <span className="mc-grad-text">your project</span></>}
                text="We map the problem, scope the work and share a clear plan and quote — no obligation."
              />
            </Reveal>
            <Reveal delay={100}>
              <ul className="mc-check-list" style={{ marginTop: 24 }}>
                <li><span className="mc-tick"><FiCheck /></span><span>Reply within one business day</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span>Clear scope, timeline and budget</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span>NDA-friendly from day one</span></li>
              </ul>
            </Reveal>
          </div>
          <div>
            <Reveal delay={120}>
              <div className="mc-ai-formcard">
                <div className="mc-ai-formcard-head">
                  <FiMessageSquare />
                  <div style={{ flex: 1 }}>
                    <h3>Request a Quote</h3>
                    <p>For {service.name}</p>
                  </div>
                  <span className="mc-ai-formcard-badge">Free</span>
                </div>
                <div className="mc-ai-formcard-body">
                  <QuoteForm serviceName={service.name} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}