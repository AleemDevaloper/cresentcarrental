import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiCheck, FiCpu, FiCheckCircle } from "react-icons/fi";
import { Reveal, SectionHeader, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { servicePillars, aiAgents } from "@/data/siteData";

const workflowShot = "/images/company/screens/workflow-dashboard.png";
const aiShot = "/images/company/screens/ai-insights-dashboard.png";
const erpShot = "/images/company/screens/erp-dashboard.png";
const designShot = "/images/company/screens/homepage-design.png";

const pillarShots = {
  "ai-agents": aiShot,
  "advanced-ai-ml": aiShot,
  "product-engineering": workflowShot,
  "design-strategy": designShot,
  "digital-growth": erpShot,
};

export default function ServicePillar() {
  const id = routeParam(useParams().id);
  const pillar = servicePillars.find((p) => p.id === id);

  if (!pillar) return <Navigate to="/services" replace />;

  const IconComponent = pillar.icon || FiCpu;

  // Find related agents
  const relatedAgents = aiAgents.filter(
    (a) => (pillar.related || []).includes(a.slug)
  );

  return (
    <>
      <section className="mc-page-hero">
        <div className="mc-container">
          <nav className="mc-breadcrumb">
            <Link to="/">Home</Link>
            <i>/</i>
            <Link to="/services">Services</Link>
            <i>/</i>
            <span>{pillar.title}</span>
          </nav>
          <div className="mc-kicker" style={{ marginBottom: 22, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <IconComponent size={18} /> Service Pillar
          </div>
          <h1>{pillar.title}</h1>
          <p className="mc-lede">{pillar.tagline}</p>
          <div className="mc-hero-actions" style={{ marginTop: 26 }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">Consult with Us <FiArrowRight /></Link>
            <Link to="/contact" className="mc-btn mc-btn-ghost">Request a Capability Deck</Link>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Overview" title={pillar.title} text={pillar.text} />
            </Reveal>
            <Reveal delay={80}>
              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 12 }}>Primary Use Cases & Solutions:</h4>
                <ul className="mc-check-list">
                  {(pillar.useCases || []).map((uc) => (
                    <li key={uc}>
                      <span className="mc-tick"><FiCheck /></span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div style={{ display: "grid", gap: 20 }}>
              <DashFrame
                image={pillarShots[pillar.id] || erpShot}
                label={pillar.title}
                alt={`${pillar.title} deliverable preview`}
              />
              <div className="mc-band">
                <div className="mc-eyebrow">Our Core Capabilities</div>
                <div className="mc-tech-cloud" style={{ marginTop: 20 }}>
                  {(pillar.features || []).map((f) => (
                    <span className="mc-tech-pill" key={f}>
                      <FiCheckCircle size={14} style={{ marginRight: '6px', color: 'var(--brand-3)' }} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process / Workflow */}
      {pillar.workflow && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <SectionHeader eyebrow="Engagement Workflow" title="How we deliver this pillar" />
            </Reveal>
            <div className="mc-process" style={{ marginTop: 40 }}>
              {pillar.workflow.map((w, i) => (
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
      )}

      {/* Tech Stack */}
      {pillar.stack && (
        <section className="mc-slab">
          <div className="mc-container">
            <Reveal>
              <SectionHeader eyebrow="Technology Sandbox" title="Pragmatic frameworks & libraries we build with" />
            </Reveal>
            <div className="mc-tech-cloud" style={{ marginTop: 24 }}>
              {pillar.stack.map((t) => (
                <span className="mc-tech-pill" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Products / Agents */}
      {relatedAgents.length > 0 && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <SectionHeader eyebrow="Related Products" title="Ready-to-deploy agents built under this pillar" />
            </Reveal>
            <div className="mc-grid-3" style={{ marginTop: 40 }}>
              {relatedAgents.map((ra) => {
                const RaIcon = ra.icon || FiCpu;
                return (
                  <Reveal key={ra.slug}>
                    <div className="mc-card mc-card-hover" style={{ padding: 24 }}>
                      <span className="mc-svc-icon" style={{ marginBottom: 16 }}><RaIcon size={24} /></span>
                      <h3>{ra.title}</h3>
                      <p style={{ color: "var(--muted)", margin: "12px 0 20px" }}>{ra.text}</p>
                      <Link to={`/products/${ra.slug}`} className="mc-link-arrow">
                        Explore product <FiArrowRight />
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title={"Partner with us for " + pillar.title + "."}
        text="Bring us your business vision, and let's structure a team, technology stack, and plan to deliver it."
        primary="Start a Project"
        secondary="View Other Services"
        primaryTo="/contact"
        secondaryTo="/services"
      />
    </>
  );
}

