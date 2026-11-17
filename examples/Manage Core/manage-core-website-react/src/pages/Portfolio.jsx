import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Reveal, PageHero, CtaBand } from "@/components/SitePrimitives";
import { portfolio } from "@/data/siteData";

export default function Portfolio() {
  const categories = ["All", ...Array.from(new Set(portfolio.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Portfolio", to: "/portfolio" }]}
        title={<>Selected work showing <span className="mc-grad-text">real outcomes</span></>}
        lede="Filter by category to see how we turn business problems into connected, premium, adopted systems."
      />

      <section className="mc-slab mc-pt-0">
        <div className="mc-container">
          <div className="mc-filterbar">
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                className={`mc-filter-btn ${filter === c ? "active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mc-grid-3">
            {items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 60}>
                <Link to="/case-studies" className="mc-card mc-card-hover mc-portfolio">
                  <div className="mc-media">
                    <span className="mc-cat">{item.category}</span>
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="mc-p-body">
                    <h3>{item.title}</h3>
                    <p>{item.result}</p>
                    <div className="mc-tags">
                      {item.tags.map((t) => <span key={t}>{t}</span>)}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 36, textAlign: "center" }}>
            <Link to="/contact" className="mc-btn mc-btn-primary">Start your project <FiArrowRight /></Link>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Your next system could be on this page"
        text="Bring us the business problem and we’ll design, build and launch the solution."
        primary="Book a Consultation"
        secondary="See Case Studies"
        secondaryTo="/case-studies"
      />
    </>
  );
}