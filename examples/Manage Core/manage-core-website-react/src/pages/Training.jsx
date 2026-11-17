import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiPlayCircle, FiClock, FiUsers, FiCheckCircle, FiBookOpen, FiLock, FiZap, FiLayers } from "react-icons/fi";
import { Reveal, PageHero, DashFrame, CtaBand } from "@/components/SitePrimitives";

const cmsShot = "/images/company/screens/cms-dashboard.png";

const steps = [
  ["1", "Create and verify your learner account", "A quick verification keeps the academy useful and the community real."],
  ["2", "Follow structured videos and notes", "Every course is organized into modules with lecture descriptions."],
  ["3", "Resume progress across courses", "Your progress saves so you can continue any time, on any device."],
  ["4", "Mark lessons complete and discuss", "Join moderated discussions and earn verified completion."],
];

const courses = [
  { icon: <FiBookOpen />, title: "Evaluating Business Software", modules: 6, lessons: 24, level: "Beginner", desc: "A practical framework for evaluating ERP, HRMS and automation honestly — no vendor slides." },
  { icon: <FiZap />, title: "AI Automation Foundations", modules: 5, lessons: 18, level: "Beginner", desc: "Scope-first automation: workflow mapping, document processing and where AI fits." },
  { icon: <FiLayers />, title: "Operations & Finance Command", modules: 7, lessons: 31, level: "Intermediate", desc: "Home runs for finance leads: chart of accounts, stock control and management reporting." },
  { icon: <FiUsers />, title: "HR & Payroll Operations", modules: 6, lessons: 26, level: "Intermediate", desc: "Attendance-to-payroll with leave, overtime and approvals in one controlled flow." },
  { icon: <FiPlayCircle />, title: "Retail & Distribution Control", modules: 5, lessons: 20, level: "Beginner", desc: "Billing, cashier controls and branch reporting for multi-store operations." },
  { icon: <FiCheckCircle />, title: "Digital Transformation Playbooks", modules: 6, lessons: 22, level: "All levels", desc: "Videos from live engagements: build vs buy, migration planning and adoption." },
];

export default function Training() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Resources", to: "/resources" }, { label: "Training Academy", to: "/training" }]}
        title={<>Build skills that move <span className="mc-grad-text">real operations forward</span></>}
        lede="Structured, lecture-by-lecture learning for software evaluation, finance, HR, education, retail and digital transformation — from first lesson to confident execution."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker"><FiLock /> Verified access</span>
          <span className="mc-kicker">Private video</span>
          <span className="mc-kicker"><FiCheckCircle /> Saved progress</span>
          <span className="mc-kicker"><FiLayers /> Learning path</span>
        </div>
      </PageHero>

      {/* Steps */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 40 }}>
              <div className="mc-eyebrow">How it works</div>
              <h2>From first lesson to confident execution</h2>
            </div>
          </Reveal>
          <div className="mc-grid-4">
            {steps.map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-num-card">
                  <span className="mc-n">{n}</span>
                  <h3 style={{ fontSize: 16, lineHeight: 1.35 }}>{t}</h3>
                  <p style={{ fontSize: 13.5, marginBottom: 0 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 30, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">Create a learning account <FiArrowRight /></Link>
            <Link to="/demo" className="mc-btn mc-btn-ghost">Request a demo environment</Link>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-stats">
              <div className="mc-stat"><b>40+</b><span>Lectures available</span></div>
              <div className="mc-stat"><b>07</b><span>Structured courses</span></div>
              <div className="mc-stat"><b>24/7</b><span>Academy access</span></div>
              <div className="mc-stat"><b>100%</b><span>Progress saved</span></div>
            </div>
          </Reveal>
          <Reveal delay={80} style={{ marginTop: 44, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            <DashFrame image={cmsShot} label="Academy &amp; learning dashboard" alt="Manage Core learning academy dashboard" />
          </Reveal>
        </div>
      </section>

      {/* Course catalogue */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header center" style={{ marginBottom: 44 }}>
              <div className="mc-eyebrow">Course catalogue</div>
              <h2>Learn at your pace. Apply at work.</h2>
              <p>Each course includes organized modules, lecture descriptions, progress tracking and a moderated learner discussion.</p>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {courses.map((c, i) => (
              <Reveal key={c.title} delay={(i % 3) * 60}>
                <article className="mc-card mc-card-hover mc-feature" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <div className="mc-f-icon">{c.icon}</div>
                  <h3 style={{ fontSize: 18 }}>{c.title}</h3>
                  <p style={{ fontSize: 13.5, flex: 1 }}>{c.desc}</p>
                  <div className="mc-hash" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                    <span style={{ padding: "5px 10px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>{c.modules} modules</span>
                    <span style={{ padding: "5px 10px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>{c.lessons} lectures</span>
                    <span style={{ padding: "5px 10px", borderRadius: 9, background: "var(--surface-3)", color: "var(--muted)", fontSize: 12, fontWeight: 700 }}>{c.level}</span>
                  </div>
                  <Link to="/contact" className="mc-res-link" style={{ marginTop: 16 }}>Enroll <FiArrowRight /></Link>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <p className="mc-muted" style={{ fontSize: 14, maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
              New courses are published regularly from live engagements and product updates. Existing clients can request course topics for their teams.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Want academy access for your team?"
        text="Tell us which roles you want to enable and we’ll set up enrollment."
        primary="Request Access"
        secondary="Browse Resources"
        secondaryTo="/resources"
      />
    </>
  );
}

