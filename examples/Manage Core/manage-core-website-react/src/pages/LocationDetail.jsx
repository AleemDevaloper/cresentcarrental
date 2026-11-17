import { Link, useParams } from "react-router-dom";
import React from "react";
import { FiMapPin, FiArrowRight, FiPhone, FiMail, FiClock, FiGlobe } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader } from "@/components/SitePrimitives";
import { WorldClock } from "@/components/SitePrimitives";

const locationData = {
  lahore: {
    name: "Lahore, Pakistan",
    type: "Primary Engineering & Research Center",
    description: "Our headquarters and largest team — home to engineering, AI research, product development and delivery operations. Located in the heart of Lahore's tech ecosystem.",
    address: "Lahore, Punjab, Pakistan",
    phone: "+92 319 0782328",
    email: "hello@managecore.test",
    timezone: "Asia/Karachi",
    features: [
      "Core engineering team of 50+ developers",
      "AI research and development lab",
      "Product development center",
      "24/7 delivery and support operations",
      "Training and internship programs",
      "Innovation and prototyping lab",
    ],
    highlights: [
      { label: "Team Size", value: "50+" },
      { label: "Timezone", value: "PKT (UTC+5)" },
      { label: "Focus", value: "Engineering & AI" },
      { label: "Languages", value: "English, Urdu" },
    ],
  },
  "al-jubail": {
    name: "Al Jubail, KSA",
    type: "Regional Delivery & Partnerships Hub",
    description: "Our Middle East presence — focused on regional partnerships, client delivery and market expansion across the GCC region.",
    address: "Al Jubail, Eastern Province, Saudi Arabia",
    phone: "+966 13 000 0000",
    email: "ksa@managecore.test",
    timezone: "Asia/Riyadh",
    features: [
      "Regional partnership development",
      "Client delivery and support",
      "GCC market expansion",
      "Local business development",
      "Government and enterprise relations",
      "Cultural and language support",
    ],
    highlights: [
      { label: "Team Size", value: "10+" },
      { label: "Timezone", value: "AST (UTC+3)" },
      { label: "Focus", value: "Partnerships & Delivery" },
      { label: "Languages", value: "English, Arabic" },
    ],
  },
  remote: {
    name: "Remote / Global",
    type: "Distributed Team Network",
    description: "Our distributed team spans multiple time zones, enabling follow-the-sun delivery and 24/7 coverage for global clients.",
    address: "Worldwide",
    email: "global@managecore.test",
    timezone: "UTC",
    features: [
      "Follow-the-sun delivery model",
      "24/7 coverage for global clients",
      "Access to global talent pool",
      "Async-first collaboration",
      "Flexible working arrangements",
      "Timezone-aligned project teams",
    ],
    highlights: [
      { label: "Team Size", value: "20+" },
      { label: "Timezone", value: "Multi-timezone" },
      { label: "Focus", value: "Global Delivery" },
      { label: "Languages", value: "English + Local" },
    ],
  },
};

export default function LocationDetail() {
  const { slug } = useParams();
  const location = locationData[slug] || locationData.lahore;

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Locations", to: "/locations" },
          { label: location.name },
        ]}
        title={location.name}
        lede={location.description}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">{location.type}</span>
        </div>
      </PageHero>

      <section className="mc-slab">
        <div className="mc-container">
          <div className="mc-split">
            <Reveal>
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 16 }}>Office Details</h2>
                <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <FiMapPin size={18} style={{ color: "var(--brand)", marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Address</div>
                      <div style={{ color: "var(--muted)" }}>{location.address}</div>
                    </div>
                  </div>
                  {location.phone && (
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <FiPhone size={18} style={{ color: "var(--brand)", marginTop: 3 }} />
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 2 }}>Phone</div>
                        <div style={{ color: "var(--muted)" }}>{location.phone}</div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <FiMail size={18} style={{ color: "var(--brand)", marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Email</div>
                      <div style={{ color: "var(--muted)" }}>{location.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <FiClock size={18} style={{ color: "var(--brand)", marginTop: 3 }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>Timezone</div>
                      <div style={{ color: "var(--muted)" }}>{location.timezone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div>
                <h2 style={{ fontSize: 24, marginBottom: 16 }}>Capabilities</h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {location.features.map((f) => (
                    <li key={f} style={{ padding: "8px 0", display: "flex", gap: 10, alignItems: "center", borderBottom: "1px solid var(--line)" }}>
                      <FiArrowRight size={14} style={{ color: "var(--brand)" }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Quick Facts"
              title="At a glance"
            />
          </Reveal>
          <Reveal delay={60}>
            <div className="mc-grid-4" style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              {location.highlights.map((h) => (
                <div key={h.label} className="mc-card" style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "var(--brand)" }}>{h.value}</div>
                  <div style={{ color: "var(--muted)", marginTop: 4, fontSize: 13 }}>{h.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 800, textAlign: "center" }}>
          <Reveal>
            <SectionHeader
              center
              eyebrow="Get in Touch"
              title={`Connect with our ${location.name} team`}
              text="Book a consultation or reach out directly."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mc-hero-actions" style={{ justifyContent: "center", marginTop: 24 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-pill">
                Book a Free Audit <FiArrowRight />
              </Link>
              <a href={`mailto:${location.email}`} className="mc-btn mc-btn-ghost mc-btn-pill">
                Email Us <FiArrowRight />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
