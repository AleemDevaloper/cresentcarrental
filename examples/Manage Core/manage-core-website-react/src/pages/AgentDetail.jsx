import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiCheck, FiCpu, FiCheckCircle } from "react-icons/fi";
import { Reveal, SectionHeader, DashFrame, CtaBand } from "@/components/SitePrimitives";
import { aiAgents } from "@/data/siteData";
import { coreProducts } from "@/data/productsData";

export default function AgentDetail() {
  const slug = routeParam(useParams().slug);
  const agent = aiAgents.find((a) => a.slug === slug) || coreProducts.find((p) => p.slug === slug);

  if (!agent) return <Navigate to="/products" replace />;

  const IconComponent = agent.icon || FiCpu;
  const isCore = coreProducts.some((p) => p.slug === slug);

  // Find related products/agents
  const relatedPool = isCore ? coreProducts : aiAgents;
  const relatedAgents = relatedPool.filter(
    (a) => a.slug !== agent.slug && (agent.related || []).includes(a.slug)
  );

  return (
    <>
      <section className="mc-page-hero">
        <div className="mc-container">
          <nav className="mc-breadcrumb">
            <Link to="/">Home</Link>
            <i>/</i>
            <Link to="/products">Products</Link>
            <i>/</i>
            <span>{agent.title}</span>
          </nav>
          <div className="mc-kicker" style={{ marginBottom: 22, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <IconComponent size={18} /> {agent.category}
          </div>
          <h1>{agent.title}</h1>
          <p className="mc-lede">{agent.tagline || agent.text}</p>
          <div className="mc-hero-actions" style={{ marginTop: 26 }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">{isCore ? "Start with this Product" : "Deploy Agent"} <FiArrowRight /></Link>
            <Link to="/contact" className="mc-btn mc-btn-ghost">Request a Demo</Link>
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="mc-slab mc-pt-0">
        <div className="mc-container mc-split">
          <div>
            <Reveal>
              <SectionHeader eyebrow="Business Outcome" title={agent.outcome || "What this agent delivers for your business"} />
            </Reveal>
            <Reveal delay={80}>
              <ul className="mc-check-list">
                {(agent.useCases || []).map((uc) => (
                  <li key={uc}>
                    <span className="mc-tick"><FiCheck /></span>
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <div style={{ display: "grid", gap: 20 }}>
              <DashFrame
                image={agent.image}
                label={`${agent.title} — live preview`}
                alt={`${agent.title} interface preview`}
              />
              <div className="mc-band">
                <div className="mc-eyebrow">Key Capabilities</div>
                <div className="mc-tech-cloud" style={{ marginTop: 20 }}>
                  {(agent.features || []).map((f) => (
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

      {/* Workflow Section */}
      {agent.workflow && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <SectionHeader eyebrow="Implementation Journey" title="Our 6-step integration workflow" />
            </Reveal>
            <div className="mc-process" style={{ marginTop: 40 }}>
              {agent.workflow.map((w, i) => (
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

      {/* Tech Stack Section */}
      {agent.stack && (
        <section className="mc-slab">
          <div className="mc-container">
            <Reveal>
              <SectionHeader eyebrow="Technology & Integrations" title="An enterprise-grade, secure runtime stack" />
            </Reveal>
            <div className="mc-tech-cloud" style={{ marginTop: 24 }}>
              {agent.stack.map((t) => (
                <span className="mc-tech-pill" key={t}>{t}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Agents */}
      {relatedAgents.length > 0 && (
        <section className="mc-slab mc-slab-alt">
          <div className="mc-container">
            <Reveal>
              <SectionHeader eyebrow="Related Products" title={isCore ? "Connected modules and products" : "Coordinate multiple agents on your workflow"} />
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
        title={isCore ? `Run ${agent.title} across your operations.` : `Integrate ${agent.title} into your operations.`}
        text={isCore
          ? "Discuss licensing, module selection, integrations and a rollout plan with our engineers."
          : "Discuss licensing, private cloud deployment options, and customized business logic mapping with our engineers."}
        primary="Request a Demo"
        secondary="View All Products"
        primaryTo="/contact"
        secondaryTo="/products"
      />
    </>
  );
}
