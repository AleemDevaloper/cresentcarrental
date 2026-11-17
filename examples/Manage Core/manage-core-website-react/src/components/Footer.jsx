import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGithub, FiCheck, FiMessageCircle, FiDownload, FiGlobe } from "react-icons/fi";
import { aiAgents, servicePillars } from "@/data/siteData";
import { downloadCompanyBrochure } from "@/components/ServicePdf";

const logoMark = "/images/logo1.png";
const W = "";

const cols = [
  {
    title: "Products",
    links: [
      { label: "AI Procurement Agent", to: `${W}/products/${aiAgents.find((a) => a.slug === "procurement")?.slug || "products"}` },
      { label: "AI HR Agent", to: `${W}/products/${aiAgents.find((a) => a.slug === "hr")?.slug || "products"}` },
      { label: "AI Cold Email", to: `${W}/products/${aiAgents.find((a) => a.slug === "cold-email")?.slug || "products"}` },
      { label: "AI Medical Documentation Bot", to: `${W}/products/${aiAgents.find((a) => a.slug === "medical-docs")?.slug || "products"}` },
      { label: "AI Chatbot", to: `${W}/products/${aiAgents.find((a) => a.slug === "chatbot")?.slug || "products"}` },
      { label: "View All Products", to: `${W}/products`, all: true },
    ],
  },
  {
    title: "Services",
    links: servicePillars.map((p) => ({ label: p.title, to: `${W}/services/pillars/${p.id}` })).concat([
      { label: "All Services", to: `${W}/services`, all: true },
    ]),
  },
  {
    title: "Insights",
    links: [
      { label: "Automation", to: `${W}/blog/Automation` },
      { label: "AI Trends", to: `${W}/blog/AI%20Trends` },
      { label: "Solutions", to: `${W}/blog/Solutions` },
      { label: "Growth", to: `${W}/blog/Growth` },
      { label: "All Insights", to: `${W}/blog`, all: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: `${W}/about` },
      { label: "Our Team", to: `${W}/team` },
      { label: "Case Studies", to: `${W}/case-studies` },
      { label: "Project Gallery", to: `${W}/portfolio` },
      { label: "Compare Services", to: `${W}/compare` },
      { label: "Careers", to: `${W}/careers` },
      { label: "FAQs", to: `${W}/faq`, all: true },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Book a Demo", to: `${W}/demo` },
      { label: "Pricing", to: `${W}/pricing` },
      { label: "Our Process", to: `${W}/process` },
      { label: "Technologies", to: `${W}/technologies` },
      { label: "Industries", to: `${W}/industries` },
      { label: "Resources", to: `${W}/resources`, all: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Demo Center", to: `${W}/demo` },
      { label: "Demo Login", href: "https://managecore.asiancon.com/app", external: true },
      { label: "Training Academy", to: `${W}/training` },
      { label: "Client Reviews", to: `${W}/reviews` },
      { label: "Support Hub", to: `${W}/support` },
      { label: "Blog & Insights", to: `${W}/blog` },
      { label: "Request Proposal", to: `${W}/contact`, all: true },
    ],
  },
];

function DownloadBrochureButton() {
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const start = async () => {
    try {
      setLoading(true);
      await downloadCompanyBrochure();
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };
  return (
    <button type="button" className={`mc-neon-submit ${loading ? "loading" : ""}`} onClick={start} aria-busy={loading} aria-live="polite">
      {loading ? "Downloading…" : done ? "Saved ✓" : "Download Brochure"} <FiDownload />
    </button>
  );
}

const wordmarkChars = "MANAGE CORE".split("");

export default function Footer() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const subscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="mc-neon-footer">
      <span className="mc-neon-blob mc-neon-blob--a" aria-hidden="true" />
      <span className="mc-neon-blob mc-neon-blob--b" aria-hidden="true" />

      <div className="mc-container mc-neon-inner">
        {/* CTA Section */}
        <div className="mc-neon-cta">
          <div className="mc-neon-cta-copy">
            <span className="mc-neon-eyebrow">
              <span className="mc-neon-dot" aria-hidden="true" />
              Ready when you are
            </span>
            <h2 className="mc-neon-h2">Not sure where to start?</h2>
          </div>
          <div className="mc-neon-cta-form">
            <p className="mc-neon-lead">
              We map your workflows and find the highest-ROI automation to build first.
            </p>
            {subscribed ? (
              <div className="mc-f-nl-ok"><FiCheck /> Thanks! We'll be in touch.</div>
            ) : (
              <form className="mc-neon-form" onSubmit={subscribe}>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  aria-label="Email"
                  className="mc-neon-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="mc-neon-submit">Get a proposal</button>
              </form>
            )}
          </div>
        </div>

        {/* Top: Brand + Columns */}
        <div className="mc-neon-top">
          <div className="mc-neon-brand-col">
            <Link to={W} className="mc-neon-logo">
              <img src={logoMark} alt="Manage Core logo" />
              Manage<small>Core</small>
            </Link>
            <p className="mc-neon-blurb">Intelligent Automation · Global Support</p>
            <div className="mc-neon-contact">
              <a href="mailto:hello@managecore.test"><FiMail /> hello@managecore.test</a>
              <a href="tel:+923190782328"><FiPhone /> +92 319 0782328</a>
            </div>
            <div className="mc-neon-offices">
              <div>
                <b><FiMapPin /> Lahore, Pakistan</b>
                <span>Primary engineering &amp; research center</span>
              </div>
              <div>
                <b><FiMapPin /> Al Jubail, KSA</b>
                <span>Regional delivery &amp; partnerships hub</span>
              </div>
            </div>
            <div className="mc-neon-socials">
              <a href="#" className="mc-neon-social" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="#" className="mc-neon-social" aria-label="GitHub"><FiGithub /></a>
              <a href="#" className="mc-neon-social" aria-label="WhatsApp"><FiMessageCircle /></a>
              <a href="#" className="mc-neon-social" aria-label="Website"><FiGlobe /></a>
            </div>
          </div>

          <div className="mc-neon-cols">
            {cols.map((col) => (
              <div className="mc-neon-col" key={col.title}>
                <strong className="mc-neon-coltitle">{col.title}</strong>
                <div className="mc-neon-col-links">
                  {col.links.map((l) =>
                    l.external ? (
                      <a key={l.label} href={l.href} className="mc-neon-link">
                        {l.label}
                        <FiArrowRight size={12} />
                      </a>
                    ) : (
                      <Link key={l.label} to={l.to} className={`mc-neon-link ${l.all ? "mc-neon-link--all" : ""}`}>
                        {l.label}
                        {l.all && <FiArrowRight size={12} />}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sweeping rail divider */}
        <div className="mc-neon-rail" aria-hidden="true">
          <span className="mc-neon-sweep" />
        </div>

        {/* Animated Wordmark */}
        <div className="mc-neon-word" role="img" aria-label="Manage Core">
          {wordmarkChars.map((ch, i) => (
            <span
              key={i}
              className={`mc-neon-ch ${ch === " " ? "mc-neon-gap" : ""}`}
              style={{ animationDelay: `${i * 0.16}s` }}
              aria-hidden="true"
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mc-neon-bottom">
          <span className="mc-neon-fine">&copy; {new Date().getFullYear()} Manage Core. All Rights Reserved.</span>
          <div className="mc-neon-legal">
            <Link to={`${W}/legal`} className="mc-neon-link mc-neon-link--fine">Privacy Policy</Link>
            <Link to={`${W}/legal#terms`} className="mc-neon-link mc-neon-link--fine">Terms</Link>
            <Link to={`${W}/accessibility`} className="mc-neon-link mc-neon-link--fine">Accessibility</Link>
            <Link to={`${W}/sitemap`} className="mc-neon-link mc-neon-link--fine">Sitemap</Link>
            <Link to={`${W}/privacy-choices`} className="mc-neon-link mc-neon-link--fine">Privacy Choices</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
