import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiShield, FiLock, FiFileText, FiAlertCircle, FiSliders } from "react-icons/fi";
import { Reveal, PageHero, CtaBand } from "@/components/SitePrimitives";

const legalDocs = {
  privacy: {
    icon: <FiShield />,
    title: "Privacy Policy",
    intro: "How Manage Core collects, uses and protects the information you share with us when you use our website, products and services.",
    sections: [
      ["Information we collect", "We collect contact details you provide (name, email, company), product and demo preferences, and limited technical data such as browser type and pages visited so we can operate and improve the site."],
      ["How we use information", "We use your information to respond to inquiries, schedule demos and consultations, provide and support our products, send service-related communications, and meet legal obligations. We do not sell your personal data."],
      ["Data you process in our products", "Business data you load into Manage Core products remains yours. It is stored with access controls, roles and auditability, and processed only to operate the system you have deployed."],
      ["Cookies", "We use essential cookies to keep the site working, and optional analytics cookies to understand usage. You can disable non-essential cookies in your browser."],
      ["Third-party services", "We work with a small set of processors (hosting, email, analytics) under data-processing agreements. Each is limited to the purpose required and obligated to keep your data secure."],
      ["Your rights", "Depending on your location, you may have rights to access, correct, export or delete personal data we hold about you. Contact us and we will respond within the required time frame."],
      ["Data retention", "We keep inquiry and account data only as long as needed for the purposes described, then delete or anonymize it in line with our retention policy."],
      ["Contact", "For privacy questions or requests, email hello@managecore.test or write to our Lahore office."],
    ],
  },
  terms: {
    icon: <FiFileText />,
    title: "Terms of Service",
    intro: "The terms that apply when you use Manage Core's website, products and professional services.",
    sections: [
      ["Acceptance of terms", "By accessing this website or using our services you agree to these terms. If you are using a product on behalf of an organization, you confirm you have authority to bind that organization."],
      ["Our services", "Manage Core provides custom software, AI automation, product engineering, design and digital growth services, plus productized AI agents and connected platforms. Service-specific terms are confirmed in your written proposal or agreement."],
      ["Proposals and engagement", "Every engagement starts with a written proposal describing scope, deliverables, fees and timeline. Fees, invoicing and acceptance criteria are governed by that agreement."],
      ["Your responsibilities", "You agree to provide accurate information, keep credentials secure, maintain your own data rights and follow the terms of your subscription or agreement."],
      ["Intellectual property", "Unless otherwise agreed, software and IP we build for you is delivered to you per your agreement. Our marketing materials, templates and underlying frameworks remain ours."],
      ["Confidentiality", "Both parties treat non-public information received during an engagement as confidential and use it only for the purpose of the engagement."],
      ["Suspension and termination", "Either party may suspend or end an engagement in line with the agreement. Outstanding fees remain payable for work completed."],
      ["Disclaimers and liability", "Our services are provided with reasonable care and skill. Liability is limited as set out in your agreement; nothing in these terms excludes liability that cannot be limited by law."],
      ["Contact", "Questions about these terms can be sent to hello@managecore.test."],
    ],
  },
  security: {
    icon: <FiLock />,
    title: "Security Practice",
    intro: "How Manage Core protects the data, code and infrastructure behind the systems we build and run.",
    sections: [
      ["Encryption", "Data is encrypted in transit with TLS and at rest with strong symmetric encryption on our storage layers."],
      ["Access control", "We enforce least-privilege access, role-based permissions, company boundaries and multi-factor authentication for admin and staff systems."],
      ["Deployment options", "Products can be deployed in private or air-gapped environments where regulations require data to stay inside your network."],
      ["Auditability", "Approvals, changes and AI actions are logged and reviewable so your teams retain an audit trail."],
      ["Application security", "We follow secure coding practices, dependency review and regular vulnerability checks across the systems we ship."],
      ["Backups and recovery", "Backups and recovery procedures are documented per deployment to meet your recovery objectives."],
      ["Vulnerability reporting", "If you believe you have found a security issue in a Manage Core product, contact us directly and we will respond promptly."],
    ],
  },
  cookies: {
    icon: <FiSliders />,
    title: "Cookie Policy",
    intro: "How Manage Core uses cookies and similar technologies, and the choices you have.",
    sections: [
      ["Essential cookies", "Required for security, navigation and saving your privacy choice. These are always active."],
      ["Analytics cookies", "Help us understand aggregate website usage so we can improve content and performance. Optional."],
      ["Marketing cookies", "Allow optional campaign measurement when a configured integration is active. Optional."],
      ["Managing cookies", "You can disable non-essential cookies in your browser settings or via the cookie preference controls on our site."],
      ["Excluded data", "We do not sell personal data, and cookies never reveal information from the business systems we deploy for clients."],
    ],
  },
};

const index = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "security", label: "Security Practice" },
  { id: "cookies", label: "Cookie Policy" },
];

export default function Legal() {
  const [slug, setSlug] = React.useState("privacy");
  React.useEffect(() => {
    const apply = () => setSlug((window.location.hash || "#privacy").replace("#", "") || "privacy");
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);
  const doc = legalDocs[slug] || legalDocs.privacy;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Company", to: "/about" }, { label: doc.title }]}
        title={<>{doc.title}</>}
        lede={doc.intro}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Last updated: August 2026</span>
          <span className="mc-kicker">Governing law: as per agreement</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0" style={{ marginTop: 30}}>
        <div className="mc-container" style={{ maxWidth: 920 }}>
          <div className="mc-legal-nav">
            {index.map((i) => (
              <a key={i.id} href={`#${i.id}`} className={`mc-legal-link ${slug === i.id ? "active" : ""}`}>
                {legalDocs[i.id].icon} {i.label}
              </a>
            ))}
          </div>
          <Reveal>
            <div className="mc-legal-doc">
              <div className="mc-legal-head">
                <span className="mc-legal-icon">{doc.icon}</span>
                <h2>{doc.title}</h2>
              </div>
              <p className="mc-legal-intro">{doc.intro}</p>
              {doc.sections.map(([h, body]) => (
                <div className="mc-legal-section" key={h}>
                  <h3>{h}</h3>
                  <p>{body}</p>
                </div>
              ))}
              <div className="mc-legal-note">
                <FiAlertCircle />
                <span>
                  This page is a summary. Your signed agreement, proposal or subscription terms take precedence where they
                  differ. Questions? <Link to="/contact">Contact us <FiArrowRight /></Link>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Have a compliance or security question?"
        text="Our team can walk through deployment, data residency and security options for your environment."
        primary="Talk to an Engineer"
      />
    </>
  );
}