import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Reveal, PageHero } from "@/components/SitePrimitives";

const sitemapSections = [
  {
    title: "Main",
    links: [
      { label: "Home", to: "/" },
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/careers" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All Services", to: "/services" },
      { label: "Custom Software", to: "/services/custom-software" },
      { label: "AI Solutions", to: "/services/ai-solutions" },
      { label: "Business Intelligence", to: "/services/data-business-intelligence" },
      { label: "ERP/CRM/HRMS", to: "/services/erp-crm-hrms" },
      { label: "Web & Mobile", to: "/services/web-mobile-desktop" },
      { label: "Cloud & DevOps", to: "/services/cloud-devops" },
      { label: "API & Integration", to: "/services/integration-api" },
      { label: "UI/UX Design", to: "/services/ui-ux-brand" },
      { label: "Digital Marketing", to: "/services/digital-marketing" },
      { label: "SEO", to: "/services/seo" },
      { label: "GEO", to: "/services/generative-engine-optimization" },
      { label: "AEO", to: "/services/answer-engine-optimization" },
      { label: "ChatGPT Visibility", to: "/services/chatgpt-visibility" },
      { label: "Google Ads", to: "/services/google-ads" },
      { label: "Meta Ads", to: "/services/meta-ads" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Manage Core ERP", to: "/products/managecore-erp" },
      { label: "AI Insight Desk", to: "/products/ai-insight-desk" },
      { label: "Workflow OS", to: "/products/workflow-os" },
      { label: "People Cloud", to: "/products/people-cloud" },
      { label: "School Suite", to: "/products/school-suite" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "All Industries", to: "/industries" },
      { label: "Startups", to: "/industries/startups" },
      { label: "SMEs", to: "/industries/smes" },
      { label: "Enterprise", to: "/industries/enterprise" },
      { label: "Healthcare", to: "/industries/healthcare" },
      { label: "Education", to: "/industries/education" },
      { label: "Construction", to: "/industries/construction" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Case Studies", to: "/case-studies" },
      { label: "Portfolio", to: "/portfolio" },
      { label: "Technologies", to: "/technologies" },
      { label: "Pricing", to: "/pricing" },
      { label: "Process", to: "/process" },
      { label: "Compare", to: "/compare" },
      { label: "Reviews", to: "/reviews" },
      { label: "Training", to: "/training" },
      { label: "Support", to: "/support" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", to: "/about/our-story" },
      { label: "Mission & Vision", to: "/about/mission-vision" },
      { label: "Leadership", to: "/about/leadership" },
      { label: "Why Choose Us", to: "/about/why-choose-us" },
      { label: "Values", to: "/about/values" },
      { label: "How We Work", to: "/about/how-we-work" },
      { label: "Team", to: "/team" },
      { label: "Locations", to: "/locations" },
      { label: "Partners", to: "/partners" },
      { label: "Results", to: "/results" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/legal" },
      { label: "Terms of Service", to: "/legal#terms" },
      { label: "Security", to: "/legal#security" },
      { label: "Cookie Policy", to: "/legal#cookies" },
      { label: "Accessibility", to: "/accessibility" },
      { label: "Privacy Choices", to: "/privacy-choices" },
    ],
  },
];

export default function Sitemap() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Sitemap", to: "/sitemap" }]}
        title={<>Site <span className="mc-grad-text">map</span></>}
        lede="A complete directory of all pages on the Manage Core website."
      />

      <section className="mc-slab">
        <div className="mc-container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {sitemapSections.map((section, si) => (
              <Reveal key={section.title} delay={si * 60}>
                <div>
                  <h3 style={{ fontSize: 18, marginBottom: 16, color: "var(--brand)" }}>{section.title}</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {section.links.map((link) => (
                      <li key={link.to} style={{ padding: "6px 0" }}>
                        <Link
                          to={link.to}
                          style={{
                            color: "var(--ink-lo)",
                            textDecoration: "none",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => e.target.style.color = "var(--brand)"}
                          onMouseLeave={(e) => e.target.style.color = "var(--ink-lo)"}
                        >
                          <FiArrowRight size={12} /> {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
