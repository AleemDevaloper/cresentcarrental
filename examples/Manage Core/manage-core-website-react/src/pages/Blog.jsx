import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Reveal, PageHero, CtaBand } from "@/components/SitePrimitives";
import { blog as blogData } from "@/data/siteData";

function postDateParts(date) {
  const parts = String(date || "").split(" ");
  return { month: parts[0] || "New", year: parts[1] || "" };
}

function NewsCard({ post, i }) {
  const { month, year } = postDateParts(post.date);
  return (
    <Reveal delay={i * 60}>
      <Link to={`/blog/posts/${post.id}`} className="mc-post-card">
        <div className="mc-post-media">
          <div className="mc-post-date">
            <b>{month}</b>
            <span>{year}</span>
          </div>
          <img src={post.image} alt={post.title} />
          <div className="mc-post-shade" aria-hidden="true" />
        </div>
        <div className="mc-post-body">
          <span className="mc-post-tag">{post.tag}</span>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <span className="mc-post-read">
            Read article <FiArrowRight />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

export default function Blog() {
  const cat = routeParam(useParams().cat);
  const navigate = useNavigate();

  // Normalize current filter
  const filter = cat ? decodeURIComponent(cat) : "All";

  const setFilter = (c) => {
    if (c === "All") {
      navigate("/blog");
    } else {
      navigate(`/blog/${encodeURIComponent(c)}`);
    }
  };

  const filteredPosts = filter === "All"
    ? blogData
    : blogData.filter((post) => post.tag?.toLowerCase() === filter.toLowerCase());

  const categories = [...new Set(blogData.map((p) => p.tag).filter(Boolean))];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Insights", to: "/blog" }]}
        title={<>{filter !== "All" ? `${filter} ` : ""}Engineering <span className="mc-grad-text">insights</span></>}
        lede="Playbooks, technical breakdowns and product updates — written by the engineers actually building the systems, not a marketing team guessing from the outside."
      >
        <div className="mc-page-tags">
          <span className="mc-kicker">Automation</span>
          <span className="mc-kicker">AI Trends</span>
          <span className="mc-kicker">Solutions</span>
          <span className="mc-kicker">Growth</span>
        </div>
      </PageHero>

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-filterbar" style={{ marginBottom: 34 }}>
            <button 
              className={`mc-filter-btn ${filter === "All" ? "active" : ""}`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            {categories.map((c) => (
              <button 
                key={c} 
                className={`mc-filter-btn ${filter.toLowerCase() === c.toLowerCase() ? "active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mc-news-grid">
            {filteredPosts.map((post, i) => (
              <NewsCard key={post.id} post={post} i={i} />
            ))}
            {filteredPosts.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
                No articles found in this category.
              </div>
            )}
          </div>

          <Reveal style={{ marginTop: 46, textAlign: "center" }}>
            <nav className="mc-post-pagination" aria-label="Page navigation">
              <button type="button" aria-label="Previous page"><FiChevronLeft /></button>
              <button type="button" className="active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button" aria-label="Next page"><FiChevronRight /></button>
            </nav>
          </Reveal>
        </div>
      </section>

      <section className="mc-slab mc-slab-alt">
        <div className="mc-container" style={{ maxWidth: 760 }}>
          <Reveal>
            <div style={{ display: "grid", gap: 14, textAlign: "center" }}>
              <span className="mc-eyebrow" style={{ marginInline: "auto" }}>Newsletter</span>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)" }}>Get new insights in your inbox</h2>
              <p className="mc-muted" style={{ fontSize: 16 }}>Practical guidance on operations, AI and growth. No spam, unsubscribe anytime.</p>
              <form className="mc-news-form" onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: 10, maxWidth: 460, margin: "10px auto 0" }}>
                <input type="email" required placeholder="you@company.com" aria-label="Email" className="mc-nl-input" />
                <button className="mc-btn mc-btn-primary">Subscribe</button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Ready to move from reading to building?"
        text="Turn these ideas into a practical implementation plan for your business."
        primary="Book a Consultation"
        secondary="Explore Solutions"
        secondaryTo="/solutions"
      />
    </>
  );
}

