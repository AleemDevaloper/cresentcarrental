import { Link } from "react-router-dom";
import React from "react";
import { FiMapPin, FiArrowRight, FiClock, FiGlobe, FiPhone, FiMail } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader } from "@/components/SitePrimitives";
import { WorldClock } from "@/components/SitePrimitives";

const locations = [
  {
    id: "lahore",
    name: "Lahore, Pakistan",
    type: "Primary Engineering & Research Center",
    description: "Our headquarters and largest team — home to engineering, AI research, product development and delivery operations.",
    address: "Lahore, Punjab, Pakistan",
    phone: "+92 319 0782328",
    email: "hello@managecore.test",
    timezone: "Asia/Karachi",
    features: ["Core engineering team", "AI research lab", "Product development", "24/7 delivery support"],
  },
  {
    id: "al-jubail",
    name: "Al Jubail, KSA",
    type: "Regional Delivery & Partnerships Hub",
    description: "Our Middle East presence — focused on regional partnerships, client delivery and market expansion across the GCC.",
    address: "Al Jubail, Eastern Province, Saudi Arabia",
    phone: "+966 13 000 0000",
    email: "ksa@managecore.test",
    timezone: "Asia/Riyadh",
    features: ["Regional partnerships", "Client delivery", "GCC market expansion", "Local support"],
  },
  {
    id: "remote",
    name: "Remote / Global",
    type: "Distributed Team Network",
    description: "Our distributed team spans multiple time zones, enabling follow-the-sun delivery and 24/7 coverage for global clients.",
    address: "Worldwide",
    email: "global@managecore.test",
    timezone: "UTC",
    features: ["Follow-the-sun delivery", "24/7 coverage", "Global talent pool", "Async collaboration"],
  },
];

export default function Locations() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Locations", to: "/locations" }]}
        title={<>Our offices, <span className="mc-grad-text">your timezone</span></>}
        lede="Headquartered in Lahore with a regional hub in Al Jubail and a distributed global team — we deliver where you need us."
      />

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <WorldClock />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              eyebrow="Our Offices"
              title="Where we operate"
              text="Three operational modes — one connected team."
            />
          </Reveal>
          <div className="mc-grid-3" style={{ marginTop: 40 }}>
            {locations.map((loc, i) => (
              <Reveal key={loc.id} delay={i * 80}>
                <Link to={`/locations/${loc.id}`} className="mc-card mc-card-hover mc-card-glow" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <div style={{ marginBottom: 16 }}>
                    <FiMapPin size={24} style={{ color: "var(--brand)" }} />
                  </div>
                  <span className="mc-kicker" style={{ marginBottom: 8 }}>{loc.type}</span>
                  <h3 style={{ fontSize: 22, marginBottom: 12 }}>{loc.name}</h3>
                  <p style={{ color: "var(--muted)", flex: 1, marginBottom: 16 }}>{loc.description}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {loc.features.map((f) => (
                      <li key={f} style={{ padding: "4px 0", color: "var(--ink-lo)", fontSize: 14 }}>
                        <FiArrowRight size={12} style={{ marginRight: 8, color: "var(--brand)" }} /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mc-svc-foot" style={{ marginTop: 16 }}>
                    View details <FiArrowRight />
                  </div>
                </Link>
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
              eyebrow="Get in Touch"
              title="Ready to start?"
              text="Book a free consultation — we'll map your problem and scope the solution together."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mc-hero-actions" style={{ justifyContent: "center", marginTop: 32 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-pill">
                Book a Free Audit <FiArrowRight />
              </Link>
              <Link to="/demo" className="mc-btn mc-btn-ghost mc-btn-pill">
                Book a Demo <FiArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
