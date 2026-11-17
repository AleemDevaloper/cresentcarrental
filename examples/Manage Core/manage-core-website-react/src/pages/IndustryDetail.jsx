import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useState } from "react";
import { FiArrowRight, FiCheck, FiArrowUpRight } from "react-icons/fi";
import { Reveal, PageHero, SectionHeader, FAQItem, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { industries } from "@/data/siteData";
import { industryDetails, industryShots, industryIcons } from "@/data/industriesData";

export default function IndustryDetail() {
  const slug = routeParam(useParams().slug);
  const entry = industries.find((i) => i.slug === slug);
  const detail = industryDetails[slug];
  const [openFaq, setOpenFaq] = useState(0);

  if (!entry || !detail) return <Navigate to="/industries" replace />;

  const Icon = industryIcons[slug] || entry.icon;
  const image = industryShots[slug];

  const applyServices = [
    { slug: "software-development", name: "Custom Software" },
    { slug: "erp-development", name: "ERP Systems" },
    { slug: "ai-development", name: "AI Solutions" },
    { slug: "web-development", name: "Web & Portals" },
    { slug: "business-automation-consulting", name: "Business Automation" },
    { slug: "cloud-solutions", name: "Cloud & Infrastructure" },
    { slug: "cybersecurity", name: "Cybersecurity" },
    { slug: "digital-marketing", name: "Digital Marketing" },
    { slug: "core-" + slug, name: detail.name + " Systems" },
  ];

  const related = (detail.services || []).slice(0, 6);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Industries", to: "/industries" },
          { label: detail.name, to: `#` },
        ]}
        kicker={<> {detail.name} </>}
        title={<>{detail.name} software <span className="mc-grad-text">built for the way you work</span></>}
        lede={detail.tagline}
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">{detail.name}</span>
          <span className="mc-kicker">Connected systems</span>
          <span className="mc-kicker">Controlled access</span>
          <span className="mc-kicker">You own the IP</span>
        </div>
      </PageHero>

      {/* Stats */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-xo-statsrow" style={{ marginTop: 0 }}>
            {(detail.stats || []).map((st) => (
              <div className="mc-xo-stat-item" key={st.label}>
                <b style={{ fontSize: "clamp(26px,3vw,36px)" }}>{st.value}{st.suffix}</b>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview split */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-svc-layout">
            <div>
              <Reveal>
                <SectionHeader eyebrow="Why it matters" title={`Systems for ${detail.name.toLowerCase()} opererations`} />
              </Reveal>
              <Reveal delay={80}>
                <p className="mc-svc-copy">{detail.overview}</p>
              </Reveal>
              <Reveal delay={120}>
                <div className="mc-svc-who">
                  <b className="mc-eyebrow">Who this is for</b>
                  <p>{detail.whoNeeds}</p>
                </div>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <DashFrame image={image} label={`${detail.name} — live preview`} alt={`${detail.name} interface preview`} />
            </Reveal>
          </div>
          <div className="mc-svc-cap-grid" style={{ marginTop: 44 }}>
            {(detail.capabilities || []).map((c) => (
              <div className="mc-svc-cap-chip" key={c}>
                <FiCheck /> {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <div className="mc-split">
            <div>
              <Reveal>
                <SectionHeader eyebrow="The challenges" title="The problems this removes" />
              </Reveal>
              <Reveal delay={100} style={{ marginTop: 26 }}>
                <Link to="/contact" className="mc-btn mc-btn-primary">
                  Discuss your situation <FiArrowRight />
                </Link>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <ul className="mc-check-list">
                {(detail.problems || []).map((p) => (
                  <li key={p}>
                    <span className="mc-tick"><FiCheck /></span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services that apply */}
      <section className="mc-slab">
        <div className="mc-container">
          <Reveal>
            <SectionHeader
              center
              eyebrow="Services that apply"
              title={<>How we help <span className="mc-grad-text">{detail.name}</span></>}
              text="We typically combine several capabilities into one connected platform. These are the most common starting points."
            />
          </Reveal>
          <div className="mc-svc-grid" style={{ marginTop: 40 }}>
            {related.map((slug, i) => {
              const s = {
                slug,
                name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                description: "A connected, controlled capability that plugs into your operation.",
              };
              return (
                <Reveal key={slug} delay={(i % 3) * 70}>
                  <article className="mc-svc-card">
                    <span className="mc-svc-top">
                      <span className="mc-svc-icon"><Icon /></span>
                    </span>
                    <span className="mc-svc-body">
                      <span className="mc-svc-title">{s.name}</span>
                      <span className="mc-svc-text">{s.description}</span>
                    </span>
                    <span className="mc-svc-foot">
                      <Link to={`/services/${s.slug}`}>Explore service <FiArrowUpRight /></Link>
                    </span>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Engagement path" title="How we deliver it" />
          </Reveal>
          <div className="mc-process" style={{ marginTop: 40 }}>
            {(detail.workflow || []).map((w, i) => (
              <Reveal key={w} delay={i * 60}>
                <div className="mc-card mc-card-hover mc-step">
                  <div className="mc-step-n">0{i + 1}</div>
                  <h3>{w}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Apply chips */}
      <section className="mc-slab mc-slab-tight">
        <div className="mc-container">
          <Reveal>
            <SectionHeader eyebrow="Common applications" title="Straightforward starting points" />
          </Reveal>
          <div className="mc-tech-cloud" style={{ marginTop: 24 }}>
            {applyServices.slice(0, 8).map((s) => (
              <Link to={`/services/${s.slug}`} className="mc-tech-pill" key={s.slug} style={{ textDecoration: "none" }}>
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mc-slab mc-slab-alt">
        <div className="mc-container" style={{ maxWidth: 880 }}>
          <Reveal>
            <SectionHeader center eyebrow="FAQ" title={<>Answers for <span className="mc-grad-text">{detail.name}</span></>} />
          </Reveal>
          <div className="mc-faq-list" style={{ marginTop: 32 }}>
            {(detail.faqs || []).map((f, i) => (
              <Reveal key={f[0]} delay={i * 40}>
                <FAQItem
                  q={f[0]}
                  a={f[1]}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Build a system for your ${detail.name.toLowerCase()} business?`}
        text="Tell us your industry and pain points, and we'll recommend the fastest, cleanest path forward."
        primary="Start a Project"
        secondary="See All Industries"
        primaryTo="/contact"
        secondaryTo="/industries"
      />
    </>
  );
}