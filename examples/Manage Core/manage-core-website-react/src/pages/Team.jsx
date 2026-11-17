import { Link } from "react-router-dom";
import React from "react";
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Reveal, PageHero, CtaBand } from "@/components/SitePrimitives";

const t1 = "/images/company/aivent/team/1.webp";
const t2 = "/images/company/aivent/team/2.webp";
const t3 = "/images/company/aivent/team/3.webp";
const t4 = "/images/company/aivent/team/4.webp";
const t5 = "/images/company/aivent/team/5.webp";
const t6 = "/images/company/aivent/team/6.webp";
const t7 = "/images/company/aivent/team/7.webp";
const t8 = "/images/company/aivent/team/8.webp";
const t9 = "/images/company/aivent/team/9.webp";
const t10 = "/images/company/aivent/team/10.webp";
const t11 = "/images/company/aivent/team/11.webp";
const t12 = "/images/company/aivent/team/12.webp";

const members = [
  { img: t1, name: "Adeel Razaq", role: "Founder & CEO", focus: "Strategy, architecture and product vision.", tags: ["Product", "Strategy"] },
  { img: t2, name: "Muhammad Bilal", role: "Principal AI Engineer", focus: "LLM systems, RAG pipelines and agent architecture.", tags: ["LLMs", "Agents"] },
  { img: t3, name: "Fatima Noor", role: "Product Designer", focus: "Design systems, research and premium interfaces.", tags: ["UI/UX", "Brand"] },
  { img: t4, name: "Owais Ahmed", role: "Backend Engineer", focus: "APIs, data models and platform reliability.", tags: ["Node.js", "PostgreSQL"] },
  { img: t5, name: "Hira Khan", role: "ML Engineer", focus: "Model training, evaluation and MLOps.", tags: ["ML", "Python"] },
  { img: t6, name: "Zain Ul Abidin", role: "Frontend Engineer", focus: "Performance-first React applications.", tags: ["React", "TS"] },
  { img: t7, name: "Arooba Sattar", role: "Project Manager", focus: "Delivery, scope and client partnership.", tags: ["Delivery", "Client"] },
  { img: t8, name: "Umar Farooq", role: "Cloud & DevOps Engineer", focus: "Kubernetes, CI/CD and security hardening.", tags: ["AWS", "DevOps"] },
  { img: t9, name: "Nimra Aslam", role: "Growth Strategist", focus: "SEO, paid acquisition and funnel design.", tags: ["SEO", "PPC"] },
  { img: t10, name: "Hamza Yousaf", role: "Mobile Engineer", focus: "Cross-platform mobile and desktop apps.", tags: ["Flutter", "React Native"] },
  { img: t11, name: "Sadia Riaz", role: "Data Analyst", focus: "Dashboards, BI and executive reporting.", tags: ["BI", "Analytics"] },
  { img: t12, name: "Talha Masood", role: "Support Engineer", focus: "Implementation, training and long-term support.", tags: ["Support", "Client"] },
];

export default function Team() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Company", to: "/about" }, { label: "Team", to: "/team" }]}
        title={<>The engineers &amp; founders behind <span className="mc-grad-text">Manage Core</span></>}
        lede="A senior, remote-first team of product thinkers, AI engineers, designers and operators working across Lahore, Al Jubail and remote hubs worldwide."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Senior by default</span>
          <span className="mc-kicker">Remote-first</span>
          <span className="mc-kicker">12 specialists</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-team-grid">
            {members.map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 60}>
                <article className="mc-team-card">
                  <div className="mc-team-media">
                    <img src={m.img} alt={m.name} loading="lazy" />
                    <div className="mc-team-socials">
                      <a to="#" aria-label="LinkedIn"><FiLinkedin /></a>
                      <a to="#" aria-label="GitHub"><FiGithub /></a>
                      <a to="mailto:hello@managecore.test" aria-label="Email"><FiMail /></a>
                    </div>
                  </div>
                  <div className="mc-team-body">
                    <h3>{m.name}</h3>
                    <span className="mc-team-role">{m.role}</span>
                    <p>{m.focus}</p>
                    <div className="mc-hash">
                      {m.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <div className="mc-band mc-band-cta">
              <div>
                <span className="mc-kicker"><FiArrowRight /> Join the team</span>
                <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", marginTop: 12 }}>Work with people who ship AI systems at scale</h2>
                <p className="mc-muted" style={{ marginTop: 12, maxWidth: 560, lineHeight: 1.65 }}>
                  We hire exceptional generalists and specialists. If that sounds like your kind of team, we should talk.
                </p>
              </div>
              <Reveal delay={80}>
                <Link to="/careers" className="mc-btn mc-btn-primary mc-btn-xl mc-btn-pill">
                  See open roles <FiArrowRight />
                </Link>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Want to work with a senior, product-minded team?"
        text="Bring us the business problem and we’ll map the software, automation and growth path around it."
        primary="Book a Consultation"
        secondary="Explore Services"
        secondaryTo="/services"
      />
    </>
  );
}

