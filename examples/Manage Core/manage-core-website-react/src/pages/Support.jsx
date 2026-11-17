import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight, FiHeadphones, FiBookOpen, FiLifeBuoy, FiMessageCircle, FiMail, FiShield, FiLock, FiPhone, FiClock, FiZap, FiFileText, FiCheck } from "react-icons/fi";
import { Reveal, PageHero, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";

const approvalShot = "/images/company/screens/approval-workflow.png";

const channels = [
  { icon: <FiLifeBuoy />, title: "Implementation support", text: "Guided setup, configuration and launch support for every engagement.", to: "/process" },
  { icon: <FiBookOpen />, title: "Training & enablement", text: "Role-relevant training and documentation so your teams stay enabled.", to: "/training" },
  { icon: <FiHeadphones />, title: "Ongoing maintenance", text: "Agreed maintenance, issue handling and improvement after launch.", to: "/contact" },
  { icon: <FiZap />, title: "Bi-weekly product releases", text: "Monthly product releases, not quarterly promises.", to: "/resources" },
];

const security = [
  [FiLock, "Role-based access", "Restrict screens and actions according to approved responsibilities and permissions."],
  [FiShield, "Company-level separation", "Maintain structured isolation where multi-company or tenant architecture is enabled."],
  [FiLock, "Secure authentication", "Approved authentication, session and access-control practices on the application platform."],
  [FiFileText, "Audit-ready activity records", "Record relevant actions where audit logging is included in the selected module."],
  [FiLock, "Deployment options", "Cloud, private and air-gapped options depend on the product and agreed scope."],
  [FiClock, "Encryption & recovery", "Data encrypted in transit and at rest, with documented backup and recovery procedures."],
];

export default function Support() {
  const [open, setOpen] = useState(-1);

  const faqs = [
    ["What support is available after launch?", "Agreed maintenance, issue handling, user assistance and planned improvements are available after go-live with a documented SLA."],
    ["How fast do you respond to issues?", "We reply within 24 hours on business days — typically much faster for priority issues from existing clients."],
    ["Do you provide training?", "Yes. Training for administrators and end users is role-relevant and delivered before and after go-live."],
    ["Can you take over an existing system?", "Yes. We assess the existing deployment, data and workflows before agreeing a controlled migration and support plan."],
    ["What happens during warranty or prepaid support?", "Included months follow your agreement, then ongoing support is confirmed before it expires so there is no gap."],
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Company", to: "/about" }, { label: "Support", to: "/support" }]}
        title={<>Support that <span className="mc-grad-text">keeps systems healthy</span></>}
        lede="Implementation support, training, maintenance and assistance — whether you just went live or are planning your next release. One team from strategy to support."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiClock /> 24h response</span>
          <span className="mc-kicker">Priority for clients</span>
          <span className="mc-kicker">Documented SLAs</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-4">
            {channels.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <Link to={c.to} className="mc-card mc-card-hover mc-feature" style={{ display: "block", height: "100%" }}>
                  <div className="mc-f-icon">{c.icon}</div>
                  <h3 style={{ fontSize: 16.5 }}>{c.title}</h3>
                  <p style={{ fontSize: 13.5 }}>{c.text}</p>
                  <span className="mc-res-link">Learn more <FiArrowRight /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SLA band */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-stats">
              <div className="mc-stat"><b>24h</b><span>Issue response (business days)</span></div>
              <div className="mc-stat"><b>100%</b><span>Deliverables documented &amp; handover-owned</span></div>
              <div className="mc-stat"><b>30d</b><span>Included support after go-live</span></div>
              <div className="mc-stat"><b>24/7</b><span>Managed support option</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Security controls */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 44 }}>
              <div className="mc-eyebrow">Security &amp; operations</div>
              <h2>Controls backed by implementation and assistance</h2>
              <p>Security and support depend on the selected product, deployment and agreed scope. We present only capabilities that can be configured, implemented or verified.</p>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {security.map(([Icon, t, d], i) => (
              <Reveal key={t} delay={(i % 3) * 60}>
                <article className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><Icon /></div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 30, textAlign: "center" }}>
            <Link to="/legal#security" className="mc-btn mc-btn-ghost">Read our Security Practice <FiArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      {/* Contact / tickets */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <div className="mc-section-header" style={{ marginBottom: 26 }}>
                <div className="mc-eyebrow">Get help now</div>
                <h2>Prefer to talk to a person?</h2>
                <p>Contact us directly — we reply within 24 hours on business days and typically much faster.</p>
              </div>
            </Reveal>
            <div className="mc-hash" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
              <a to="mailto:hello@managecore.test" className="mc-res-link" style={{ fontSize: 15 }}><FiMail /> hello@managecore.test</a>
              <a to="tel:+923190782328" className="mc-res-link" style={{ fontSize: 15 }}><FiPhone /> +92 319 0782328</a>
              <a to="https://wa.me/923190782328" target="_blank" rel="noreferrer" className="mc-res-link" style={{ fontSize: 15 }}><FiMessageCircle /> WhatsApp support</a>
            </div>
            <Reveal style={{ marginTop: 26 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary">Open a support request <FiArrowRight /></Link>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div className="mc-band" style={{ padding: 30 }}>
              <div className="mc-eyebrow" style={{ marginBottom: 14 }}>What we’ll ask</div>
              <ul className="mc-check-list">
                <li><span className="mc-tick"><FiCheck /></span><span>Which product or module relates.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span>What you expected vs. what happened.</span></li>
                <li><span className="mc-tick"><FiCheck /></span><span>Your business priority and urgency.</span></li>
              </ul>
              <DashFrame
                image={approvalShot}
                label="Support &amp; approval workflow"
                alt="Manage Core support workflow dashboard"
                style={{ marginTop: 20 }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 860 }}>
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 36 }}>
              <div className="mc-eyebrow">Support FAQ</div>
              <h2>Answers about support &amp; maintenance</h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gap: 12 }}>
            {faqs.map(([q, a], i) => (
              <Reveal key={q} delay={i * 40}>
                <FAQItem q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Planning your next release or expansion?"
        text="We’ll review the current system, recommend improvements and arrange support that keeps everything healthy."
        primary="Talk to the Team"
        secondary="Explore Resources"
        secondaryTo="/resources"
      />
    </>
  );
}

