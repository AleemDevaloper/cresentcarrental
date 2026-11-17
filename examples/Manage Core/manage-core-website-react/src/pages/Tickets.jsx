import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiCheck, FiArrowRight, FiMinus, FiPlus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { Reveal } from "@/components/SitePrimitives";

const heroBg = "/images/company/aivent/background/7.webp";

const tickets = [
  { name: "MVP Sprint", price: 149, benefits: ["Discovery workshop", "UX prototype", "Core MVP build", "Launch support"], note: "Perfect for a focused first release." },
  { name: "Growth System", price: 299, benefits: ["Custom modules", "Admin dashboard", "Integrations", "Analytics", "Adoption plan"], note: "Our most chosen package.", featured: true },
  { name: "AI Automation", price: 499, benefits: ["AI agents setup", "Document intelligence", "Workflow automation", "Secure API wiring", "Copilot access"], note: "Practical AI that removes duplicate work." },
  { name: "Enterprise Partner", price: 999, benefits: ["Solution architecture", "Security model", "Dedicated team", "SLA support", "Priority delivery"], note: "Priced after discovery.", featured: true },
  { name: "Consultation", price: 99, benefits: ["Process discovery", "Automation roadmap", "MVP scoping", "IT strategy"], note: "Clarity on what to build next." },
  { name: "Training & Support", price: 79, benefits: ["Go-live training", "Documentation", "Ongoing assistance", "Priority support"], note: "Keep your team enabled." },
];

const CART_LINK = "/contact";

export default function Tickets() {
  const [cart, setCart] = useState({});

  const qty = (name) => cart[name] || 0;
  const setQty = (name, n) => setCart((c) => ({ ...c, [name]: Math.max(0, n) }));
  const bump = (name, d) => setQty(name, qty(name) + d);

  const lines = tickets.filter((t) => qty(t.name) > 0);
  const total = lines.reduce((sum, t) => sum + t.price * qty(t.name), 0);

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
              <span>Packages</span>
            </nav>
            <Reveal>
              <h1 className="mc-ai-title">Packages</h1>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <p className="mc-ai-hero-side">
              Choose the engagement that fits your stage. Pick a package, set a quantity and
              reserve a slot — we’ll confirm requirements before any commitment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tickets */}
      <section className="mc-slab mc-ai-ticket-section">
        <div className="mc-container">
          <div className="mc-ai-tickets-layout">
            {/* Cards */}
            <div className="mc-ai-ticket-grid">
              {tickets.map((t, i) => (
                <Reveal key={t.name} delay={(i % 2) * 60}>
                  <article className={`mc-ai-ticket ${t.featured ? "featured" : ""}`}>
                    <div className="mc-ai-ticket-edge" aria-hidden="true" />
                    <div className="mc-ai-ticket-body">
                      <div className="mc-ai-ticket-head">
                        <h3>{t.name}</h3>
                        <div className="mc-ai-price">
                          ${t.price.toLocaleString()}
                          <small> / package</small>
                        </div>
                      </div>
                      <div className="mc-ai-ticket-divider" />
                      <h4>What’s included</h4>
                      <ul className="mc-ai-benefits">
                        {t.benefits.map((b) => (
                          <li key={b}>
                            <span className="mc-ai-check"><FiCheck /></span> {b}
                          </li>
                        ))}
                      </ul>
                      <p className="mc-ai-note">{t.note}</p>
                    </div>

                    <div className="mc-ai-ticket-qty">
                      <div className="mc-count">
                        <button type="button" onClick={() => bump(t.name, -1)} aria-label={`Remove one ${t.name}`}>
                          <FiMinus />
                        </button>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={qty(t.name)}
                          onChange={(e) => setQty(t.name, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)}
                          aria-label={`Quantity of ${t.name}`}
                        />
                        <button type="button" onClick={() => bump(t.name, 1)} aria-label={`Add one ${t.name}`}>
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            {/* Cart */}
            <aside className="mc-ai-cart-wrap">
              <div className="mc-ai-cart">
                <div className="mc-ai-cart-head">
                  <FiShoppingCart /> Cart
                </div>
                {lines.length === 0 ? (
                  <p className="mc-ai-cart-empty">
                    Your cart is empty. Use the + controls on a package to add it.
                  </p>
                ) : (
                  <>
                    <div className="mc-ai-cart-lines">
                      {lines.map((t) => (
                        <div className="mc-ai-cart-line" key={t.name}>
                          <div>
                            <h5>{t.name}</h5>
                            <span>${t.price.toLocaleString()} × {qty(t.name)}</span>
                          </div>
                          <div className="mc-ai-cart-line-end">
                            <b>${(t.price * qty(t.name)).toLocaleString()}</b>
                            <button type="button" onClick={() => setQty(t.name, 0)} aria-label={`Remove ${t.name}`}>
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mc-ai-cart-total">
                      <span>Total</span>
                      <b>${total.toLocaleString()}</b>
                    </div>
                  </>
                )}
                <Link to={CART_LINK} className={`mc-btn mc-btn-primary mc-btn-block ${lines.length === 0 ? "is-disabled" : ""}`}>
                  Book a Consultation <FiArrowRight />
                </Link>
                <p className="mc-ai-cart-foot">
                  Names and quantities are placeholders. We’ll agree exact scope before billing.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

