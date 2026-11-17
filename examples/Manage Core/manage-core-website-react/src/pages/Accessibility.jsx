import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader } from "@/components/SitePrimitives";

export default function Accessibility() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Accessibility", to: "/accessibility" }]}
        title={<>Accessibility <span className="mc-grad-text">statement</span></>}
        lede="Manage Core is committed to making our website accessible to everyone, regardless of ability or technology."
      />

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 800 }}>
          <Reveal>
            <div className="mc-card" style={{ padding: 40 }}>
              <h2 style={{ fontSize: 24, marginBottom: 16 }}>Our Commitment</h2>
              <p style={{ color: "var(--ink-lo)", lineHeight: 1.7, marginBottom: 16 }}>
                Manage Core strives to ensure that our website is accessible to all users, including those with disabilities. We are committed to providing an inclusive digital experience that meets or exceeds applicable accessibility standards.
              </p>
              <p style={{ color: "var(--ink-lo)", lineHeight: 1.7, marginBottom: 24 }}>
                This website endeavors to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>

              <h2 style={{ fontSize: 24, marginBottom: 16 }}>Accessibility Features</h2>
              <ul style={{ color: "var(--ink-lo)", lineHeight: 1.8, paddingLeft: 20, marginBottom: 24 }}>
                <li>Semantic HTML structure with proper heading hierarchy</li>
                <li>ARIA labels and roles for interactive elements</li>
                <li>Keyboard navigation support throughout the site</li>
                <li>Color contrast ratios meeting WCAG AA standards</li>
                <li>Alt text for all meaningful images</li>
                <li>Focus indicators for interactive elements</li>
                <li>Responsive design that works across all device sizes</li>
                <li>Screen reader compatibility testing</li>
              </ul>

              <h2 style={{ fontSize: 24, marginBottom: 16 }}>Known Limitations</h2>
              <p style={{ color: "var(--ink-lo)", lineHeight: 1.7, marginBottom: 16 }}>
                While we work to ensure accessibility across our website, some areas may not yet be fully accessible. We are continuously working to improve the accessibility of our site and welcome feedback on any areas where users encounter difficulties.
              </p>

              <h2 style={{ fontSize: 24, marginBottom: 16 }}>Feedback</h2>
              <p style={{ color: "var(--ink-lo)", lineHeight: 1.7, marginBottom: 16 }}>
                If you encounter any accessibility barriers on our website or have suggestions for improvement, please contact us:
              </p>
              <ul style={{ color: "var(--ink-lo)", lineHeight: 1.8, paddingLeft: 20, marginBottom: 24 }}>
                <li>Email: accessibility@managecore.test</li>
                <li>Phone: +92 319 0782328</li>
                <li>Contact form: <Link to="/contact" style={{ color: "var(--brand)" }}>Contact Us</Link></li>
              </ul>
              <p style={{ color: "var(--ink-lo)", lineHeight: 1.7 }}>
                We aim to respond to accessibility feedback within 5 business days and to resolve issues within 30 days.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
