import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiExternalLink, FiCheck, FiGrid } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader } from "@/components/SitePrimitives";

const partnerCategories = [
  {
    title: "Technology Partners",
    description: "We work with the platforms and tools that power modern businesses.",
    partners: [
      { name: "AWS", description: "Cloud infrastructure and deployment" },
      { name: "Microsoft Azure", description: "Enterprise cloud and AI services" },
      { name: "Google Cloud", description: "Data, AI and analytics platform" },
      { name: "OpenAI", description: "AI models and API integration" },
      { name: "Vercel", description: "Frontend deployment and hosting" },
      { name: "Docker", description: "Containerization and DevOps" },
    ],
  },
  {
    title: "Integration Partners",
    description: "We connect with the tools your teams already use.",
    partners: [
      { name: "HubSpot", description: "CRM and marketing automation" },
      { name: "Salesforce", description: "Enterprise CRM platform" },
      { name: "Stripe", description: "Payment processing" },
      { name: "Twilio", description: "Communication APIs" },
      { name: "Slack", description: "Team collaboration" },
      { name: "Notion", description: "Knowledge management" },
    ],
  },
  {
    title: "Delivery Partners",
    description: "We collaborate with specialist firms to deliver comprehensive solutions.",
    partners: [
      { name: "UI/UX Agencies", description: "Design collaboration" },
      { name: "Marketing Firms", description: "Growth and campaign execution" },
      { name: "Security Auditors", description: "Penetration testing and compliance" },
      { name: "Data Consultants", description: "Analytics and BI implementation" },
    ],
  },
];

export default function Partners() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Partners", to: "/partners" }]}
        title={<>Our technology & delivery <span className="mc-grad-text">partners</span></>}
        lede="We collaborate with best-in-class platforms and specialists to deliver comprehensive solutions."
      />

      {partnerCategories.map((cat, ci) => (
        <section key={cat.title} className="mc-slab" style={{ background: ci % 2 === 0 ? "var(--bg-2)" : "var(--bg)" }}>
          <div className="mc-container">
            <Reveal>
              <SectionHeader
                eyebrow={`Category ${ci + 1}`}
                title={cat.title}
                text={cat.description}
              />
            </Reveal>
            <div className="mc-grid-3" style={{ marginTop: 40 }}>
              {cat.partners.map((p, i) => (
                <Reveal key={p.name} delay={i * 60}>
                  <div className="mc-card mc-card-glow" style={{ padding: 24 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <FiGrid size={20} style={{ color: "var(--brand)" }} />
                      <h4 style={{ margin: 0, fontSize: 18 }}>{p.name}</h4>
                    </div>
                    <p style={{ color: "var(--muted)", margin: 0, fontSize: 14 }}>{p.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 800, textAlign: "center" }}>
          <Reveal>
            <SectionHeader
              center
              eyebrow="Become a Partner"
              title="Let's build together"
              text="Interested in partnering with Manage Core? We're always looking for complementary specialists and platform partners."
            />
          </Reveal>
          <Reveal delay={80}>
            <Link to="/contact" className="mc-btn mc-btn-primary mc-btn-pill" style={{ marginTop: 24 }}>
              Get in Touch <FiArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
