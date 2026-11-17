import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiClock, FiTag, FiCheck } from "react-icons/fi";
import { Reveal, CtaBand } from "@/components/SitePrimitives";
import { blog } from "@/data/siteData";

export default function BlogPost() {
  const id = routeParam(useParams().id);
  const post = blog.find((p) => String(p.id) === String(id));

  if (!post) return <Navigate to="/blog" replace />;

  const related = blog.filter((p) => p.id !== id).slice(0, 3);

  return (
    <>
      <section className="mc-ai-hero mc-news-single-hero">
        <img src={post.image} alt="" className="mc-ai-bg" aria-hidden="true" />
        <div className="mc-ai-overlay" aria-hidden="true" />
        <div className="mc-container mc-ai-hero-inner">
          <div className="mc-ai-hero-copy">
            <nav className="mc-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <i>/</i>
              <Link to="/blog">News</Link>
              <i>/</i>
              <span>{post.tag}</span>
            </nav>
            <h1 className="mc-news-single-title">{post.title}</h1>
          </div>
          <div className="mc-ai-hero-side">
            <span className="mc-post-meta">
              <span><FiClock size={14} /> {post.read} read</span>
              <span><FiTag size={14} /> {post.date}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 820 }}>
          <Reveal>
            <div className="mc-news-article">
              <img src={post.image} alt={post.title} className="mc-news-cover" />
              <span className="mc-post-tag">{post.tag}</span>
              <h2>{post.title}</h2>
              <div className="mc-news-meta">
                <span>Manage Core</span>
                <span>{post.date}</span>
                <span>{post.read} read</span>
              </div>
              <div className="mc-news-body">
                {(post.body || [post.excerpt]).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              {post.highlights?.length > 0 && (
                <div className="mc-band mc-takeaways" style={{ marginTop: 28 }}>
                  <div className="mc-eyebrow">Key highlights</div>
                  <ul className="mc-check-list" style={{ marginTop: 16 }}>
                    {post.highlights.map((h) => (
                      <li key={h}>
                        <span className="mc-tick"><FiCheck /></span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mc-news-body">
                <p className="mc-news-cta-line">
                  Want to see how this applies to your operation?{" "}
                  <Link to="/contact">Book a consultation <FiArrowRight /></Link>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="mc-container">
          <Reveal>
            <div className="mc-section-header" style={{ marginBottom: 30 }}>
              <div className="mc-eyebrow">Keep reading</div>
              <h2 style={{ fontSize: "clamp(26px,3.2vw,38px)" }}>More from Manage Core</h2>
            </div>
          </Reveal>
          <div className="mc-grid-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link to={`/blog/posts/${p.id}`} className="mc-card mc-card-hover mc-post" style={{ textDecoration: "none" }}>
                  <div className="mc-thumb" style={{ minHeight: 150, display: "grid", placeItems: "center" }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 14 }} />
                  </div>
                  <div className="mc-body">
                    <div className="mc-meta"><span>{p.tag}</span><span>{p.date}</span><span>{p.read}</span></div>
                    <h3 style={{ fontSize: 17 }}>{p.title}</h3>
                    <span className="mc-read">Read article <FiArrowRight /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Turn an idea into a working system"
        text="Bring us the business problem — we’ll map the connected data, software and automation around it."
        primary="Book a Consultation"
        secondary="Explore Services"
        secondaryTo="/services"
      />
    </>
  );
}