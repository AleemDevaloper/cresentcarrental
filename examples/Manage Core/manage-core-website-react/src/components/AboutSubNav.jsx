import { Link } from "react-router-dom";
import React from "react";
import { aboutSections } from "@/data/aboutData";

export default function AboutSubNav({ active }) {
  return (
    <div className="mc-section-nav" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 34 }}>
      {Object.entries(aboutSections).map(([slug, s]) => (
        <Link
          key={slug}
          to={`/about/${slug}`}
          className={active === slug ? "mc-kicker active" : "mc-kicker"}
          style={{ textDecoration: "none", cursor: "pointer" }}
        >
          {s.name}
        </Link>
      ))}
    </div>
  );
}