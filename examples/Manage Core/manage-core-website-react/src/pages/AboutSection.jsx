import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiCheck, FiCpu, FiLock } from "react-icons/fi";
import { Reveal, SectionHeader, PageHero, CtaBand, Counter, DashFrame } from "@/components/SitePrimitives";
import { aboutSections, aboutShots } from "@/data/aboutData";

function WhatYouGet({ section }) {
  const entries = Object.entries(aboutSections);
  return (
    <div className="mc-section-nav" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 34 }}>
      {entries.map(([slug, s]) => {
        const active = s.name === section.name;
        return (
          <Link
            key={slug}
            to={`/about/${slug}`}
            className={active ? "mc-kicker active" : "mc-kicker"}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {s.name}
          </Link>
        );
      })}
    </div>
  );
}

function Cards({ list, render }) {
  return (
    <div className="mc-grid-3">
      {list.map((item, i) => (
        <Reveal key={item.title || item.label} delay={(i % 3) * 60}>
          {render(item, i)}
        </Reveal>
      ))}
    </div>
  );
}

function StorySection({ section }) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: `#` }]}
        title={<>{section.name} <span className="mc-grad-text">— from a software shop to an engineering partner</span></>}
        lede={section.tagline}
      >
        <WhatYouGet section={section} />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-stats-about" style={{ marginTop: 0 }}>
            {section.facts.map((f) => (
              <div className="mc-stat-about" key={f.label}>
                <b><Counter value={f.value} suffix={f.suffix} /></b>
                <span className="mc-stat-about-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="How we got here" title={section.headline} />
            </Reveal>
            {section.story.map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="mc-muted" style={{ lineHeight: 1.7, marginTop: i === 0 ? 4 : 18 }}>{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={100}>
            <DashFrame image={aboutShots["our-story"]} label={section.name} alt={`${section.name} — Manage Core`} />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Milestones" title="The path so far" />
          </Reveal>
          <div className="mc-process" style={{ marginTop: 40 }}>
            {section.milestones.map((m, i) => (
              <Reveal key={m.label} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{m.label}</h3>
                  <p>{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Interested in working with a team that fits?"
        text="Book a free consultation — we map your problem, scope the work and share a plan with no obligation."
        primary="Book a Consultation"
        secondary="Meet the Team"
        primaryTo="/contact"
        secondaryTo="/team"
      />
    </>
  );
}

function MissionVisionSection({ section }) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: `#` }]}
        title={<>{section.name} <span className="mc-grad-text">— why we build, and where we're going</span></>}
        lede={section.tagline}
      >
        <WhatYouGet section={section} />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-grid-2">
            <Reveal>
              <article className="mc-card mc-card-hover" style={{ padding: 32 }}>
                <div className="mc-eyebrow">Mission</div>
                <h3 style={{ marginTop: 12, fontSize: 20 }}>{section.headline}</h3>
                <p className="mc-muted" style={{ lineHeight: 1.7, marginTop: 14 }}>{section.mission}</p>
              </article>
            </Reveal>
            <Reveal delay={80}>
              <article className="mc-card mc-card-hover" style={{ padding: 32 }}>
                <div className="mc-eyebrow">Vision</div>
                <h3 style={{ marginTop: 12, fontSize: 20 }}>A world where software fits the organization</h3>
                <p className="mc-muted" style={{ lineHeight: 1.7, marginTop: 14 }}>{section.vision}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="What we stand for" title="Four commitments" />
          </Reveal>
          <Cards list={section.pillars} render={(p) => (
            <article className="mc-card mc-card-hover mc-feature">
              <div className="mc-f-icon"><p.icon /></div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          )} />
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="How we measure ourselves" title="The outcomes we hold ourselves to" />
          </Reveal>
          <ul className="mc-check-list" style={{ maxWidth: 720, display: "grid", gap: 10 }}>
            {section.goals.map((g) => (
              <li key={g}>
                <span className="mc-tick"><FiCheck /></span>
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Share your mission with us"
        text="Tell us what you're building towards — we'll help you scope the software that gets you there."
        primary="Start a Conversation"
        secondary="Why Choose Us"
        primaryTo="/contact"
        secondaryTo="/about/why-choose-us"
      />
    </>
  );
}

function LeadershipSection({ section }) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: `#` }]}
        title={<>{section.name} <span className="mc-grad-text">— led by engineers who still ship</span></>}
        lede={section.tagline}
      >
        <WhatYouGet section={section} />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="The team" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
          </div>
          <Reveal delay={80}>
            <div className="mc-band" style={{ padding: 28 }}>
              <div className="mc-eyebrow">How we lead</div>
              <ul className="mc-check-list" style={{ marginTop: 14, display: "grid", gap: 8 }}>
                {section.principles.map((p) => (
                  <li key={p}>
                    <span className="mc-tick"><FiCheck /></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Leadership" title="The people shaping delivery" />
          </Reveal>
          <div className="mc-grid-3">
            {section.leaders.map((l, i) => (
              <Reveal key={l.title} delay={i * 60}>
                <article className="mc-card mc-card-hover" style={{ padding: 26 }}>
                  <div className="mc-avatar">{l.initials}</div>
                  <div className="mc-eyebrow" style={{ marginTop: 16 }}>{l.role}</div>
                  <h3 style={{ marginTop: 6, fontSize: 19 }}>{l.title}</h3>
                  <p className="mc-muted" style={{ lineHeight: 1.6, marginTop: 10 }}>{l.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/careers" className="mc-btn mc-btn-primary">{section.hiring} <FiArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Want to work with this team?"
        text="We're hiring — or we'd love to build something with you."
        primary="Start a Project"
        secondary="See Open Roles"
        primaryTo="/contact"
        secondaryTo="/careers"
      />
    </>
  );
}

function WhyChooseUsSection({ section }) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: `#` }]}
        title={<>{section.name} — <span className="mc-grad-text">built the way serious work should be</span></>}
        lede={section.tagline}
      >
        <WhatYouGet section={section} />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-xo-statsrow" style={{ marginTop: 0 }}>
            {section.stats.map((st) => (
              <div className="mc-xo-stat-item" key={st.label}>
                <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>{st.value}{st.suffix}</b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Why Manage Core" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
            <Reveal delay={80} style={{ marginTop: 26 }}>
              <Link to="/contact" className="mc-btn mc-btn-primary">Book a Free Consultation <FiArrowRight /></Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <DashFrame image={aboutShots["why-choose-us"]} label="Unified delivery model" alt="Manage Core delivery platform" />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Why Manage Core" title="Honest comparison against the typical agency model" />
          </Reveal>
          <Reveal delay={80} style={{ marginTop: 44 }}>
            <div className="mc-compare">
              <div className="mc-compare-col mc-compare-win">
                <div className="mc-compare-head"><h3>Manage Core</h3><i aria-hidden="true" /></div>
                <ul className="mc-compare-list">
                  {section.compare.map((r) => (
                    <li key={r.title}>
                      <FiCpu style={{ color: "var(--brand-3)" }} />
                      <span><b>{r.title}.</b> {r.us}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mc-compare-col">
                <div className="mc-compare-head"><h3>Typical agency</h3></div>
                <ul className="mc-compare-list">
                  {section.compare.map((r) => (
                    <li key={r.title}>
                      <FiLock style={{ color: "var(--danger)" }} />
                      <span>{r.other}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader center eyebrow="Six reasons" title="Why teams choose us" />
          </Reveal>
          <Cards list={section.reasons} render={(r, i) => (
            <article className="mc-card mc-card-hover mc-reason">
              <div className="mc-reason-top">
                <div className="mc-f-icon"><r.icon /></div>
                <span className="mc-reason-num">0{i + 1}</span>
              </div>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              <span className="mc-reason-line" aria-hidden="true" />
            </article>
          )} />
        </div>
      </section>

      <CtaBand
        title="See the difference for yourself"
        text="Start with a free consultation. We'll show you honestly how we'd scope your project."
        primary="Book a Consultation"
        secondary="How We Work"
        primaryTo="/contact"
        secondaryTo="/about/how-we-work"
      />
    </>
  );
}

function ValuesSection({ section }) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: `#` }]}
        title={<>{section.name} <span className="mc-grad-text">— principles that shape every engagement</span></>}
        lede={section.tagline}
      >
        <WhatYouGet section={section} />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Values" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
          </div>
        </div>
        <div className="mc-container" style={{ marginTop: 36 }}>
          <div className="mc-grid-3">
            {section.values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 60}>
                <article className="mc-card mc-card-hover mc-feature">
                  <div className="mc-f-icon"><v.icon /></div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Work with a team that shares these values"
        text="We build software the way we'd want it built for ourselves — owned, honest and supported."
        primary="Start a Project"
        secondary="About Our Story"
        primaryTo="/contact"
        secondaryTo="/about/our-story"
      />
    </>
  );
}

function HowWeWorkSection({ section }) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "About", to: "/about" }, { label: section.name, to: `#` }]}
        title={<>{section.name} <span className="mc-grad-text">— the delivery model behind every engagement</span></>}
        lede={section.tagline}
      >
        <WhatYouGet section={section} />
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="How we work" title={section.headline} />
            </Reveal>
            <p className="mc-muted" style={{ lineHeight: 1.7 }}>{section.overview}</p>
          </div>
          <Reveal delay={100}>
            <DashFrame image={aboutShots["how-we-work"]} label="Connected delivery" alt="Manage Core connected delivery model" />
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="The stages" title="Our operating model" />
          </Reveal>
          <div className="mc-process" style={{ marginTop: 40 }}>
            {section.steps.map((s, i) => (
              <Reveal key={s.stage} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{s.stage} — {s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Our commitments" title="What you can expect" />
          </Reveal>
          <div className="mc-svc-cap-grid" style={{ marginTop: 32 }}>
            {section.commitments.map((c) => (
              <div className="mc-svc-cap-chip" key={c}><FiCheck /> {c}</div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Put the process to work for you"
        text="Book a discovery call and see the model in action on your own problem."
        primary="Book a Discovery Call"
        secondary="Why Choose Us"
        primaryTo="/contact"
        secondaryTo="/about/why-choose-us"
      />
    </>
  );
}

const RENDERERS = {
  "our-story": StorySection,
  "mission-vision": MissionVisionSection,
  leadership: LeadershipSection,
  "why-choose-us": WhyChooseUsSection,
  values: ValuesSection,
  "how-we-work": HowWeWorkSection,
};

export default function AboutSection() {
  const slug = routeParam(useParams().slug);
  const section = aboutSections[slug];
  if (!section) return <Navigate to="/about" replace />;
  const Renderer = RENDERERS[slug] || HowWeWorkSection;
  return <Renderer section={section} />;
}