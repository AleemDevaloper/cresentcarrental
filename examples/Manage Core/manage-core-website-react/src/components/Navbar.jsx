import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronRight, FiMenu, FiX, FiSun, FiMoon, FiArrowRight, FiFileText, FiPlay, FiDownload, FiCheck, FiUsers, FiAward, FiDollarSign, FiBook, FiGrid, FiLayers, FiBriefcase, FiHeadphones, FiStar, FiHelpCircle, FiMail, FiInfo, FiEye, FiZap, FiTrendingUp, FiSettings, FiBarChart2, FiGitBranch } from "react-icons/fi";
import { useSiteTheme } from "@/components/SiteTheme";
import {
  navServicePillars as servicePillars,
  navIndustries as industries,
  navProducts as coreProducts,
  navAgents as aiAgents,
  navAboutSections as aboutSectionList,
  SERVICE_COUNT,
  CATEGORY_COUNT,
} from "@/data/navData";

const logoMark = "/images/logo1.png";
const aiInsightsDashboard = "/images/company/ai-insights-dashboard.png";
const workflowDashboard = "/images/company/workflow-dashboard.png";
const hrmsDashboard = "/images/company/hrms-dashboard.png";

const W = "/";

function NavChip({ icon: Icon, label, text, to }) {
  return (
    <Link to={to} className="mc-drop-card">
      <span className="mc-drop-icon">
        <Icon size={16} />
      </span>
      <span className="mc-drop-text">
        <b>{label}</b>
        <span>{text}</span>
      </span>
    </Link>
  );
}

function DropFoot({ to, label = "View all", onNav }) {
  return (
    <Link to={to} className="mc-drop-foot" onClick={onNav}>
      {label}
      <FiChevronRight size={15} />
    </Link>
  );
}

function DropMedia({ image, title, text, to }) {
  return (
    <Link to={to} className="mc-drop-media">
      <span className="mc-drop-media-img">
        <img src={image} alt={title} />
        <i aria-hidden="true" />
      </span>
      <span className="mc-drop-media-copy">
        <b>{title}</b>
        <span>{text}</span>
      </span>
    </Link>
  );
}

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      el.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : "0%";
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="mc-scroll-progress" aria-hidden="true">
      <i ref={barRef} />
    </div>
  );
}

function DownloadBrochureButton({ image }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const start = async () => {
    try {
      setLoading(true);
      const { downloadCompanyBrochure } = await import("@/components/ServicePdf");
      await downloadCompanyBrochure();
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mc-drop-panel">
      <span className="mc-drop-panel-bg"><img src={image} alt="" /><i aria-hidden="true" /></span>
      <span className="mc-drop-panel-body">
        <span className="mc-drop-panel-tag"><FiFileText /> Full services catalog</span>
        <h4>Everything we ship, in one brochure</h4>
        <p>{SERVICE_COUNT} services across {CATEGORY_COUNT} categories — scoping, delivery, pricing and support in a clean PDF.</p>
        <button
          type="button"
          className={`mc-drop-panel-btn ${loading ? "mc-drop-panel-loading" : ""}`}
          onClick={start}
          aria-busy={loading}
          aria-live="polite"
        >
          {done ? <><FiCheck /> Saved to downloads</> : <><FiDownload /> Download brochure</>}
        </button>
      </span>
    </div>
  );
}

export default function Navbar() {
  const { toggle } = useSiteTheme();
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const navRef = useRef(null);
  const { pathname } = useLocation();

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  const [menuLefts, setMenuLefts] = useState({});

  const MENU_WIDTH_MAX = 1460;
  const menuHalfWidth = () => Math.min(window.innerWidth * 0.94 - 32, MENU_WIDTH_MAX) / 2;

  const openMenu = (key, e) => {
    if (!canHover) return;
    const label = e.currentTarget;
    const navbar = navRef.current;
    if (label && navbar) {
      const navRect = navbar.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const center = labelRect.left + labelRect.width / 2 - navRect.left;
      const half = menuHalfWidth();
      const clamped = Math.max(half, Math.min(navRect.width - half, center));
      setMenuLefts((prev) => (prev[key] === clamped ? prev : { ...prev, [key]: clamped }));
    }
    setOpen(key);
  };

  const hoverProps = (key) => (canHover
    ? { onMouseEnter: (e) => openMenu(key, e) }
    : {});

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onDoc(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onNavMouseLeave = () => (canHover ? setOpen(null) : null);

  const closeMobile = () => setMobile(false);

  const companyLinks = [
    { to: `/about`, label: "About Us", text: "Who we are and how we work", icon: FiInfo },
    { to: `/team`, label: "Our Team", text: "Meet our builders and developers", icon: FiUsers },
    { to: `/process`, label: "Our Process", text: "How every engagement is delivered", icon: FiGitBranch },
    { to: `/pricing`, label: "Pricing", text: "Plans, packages and enterprise scope", icon: FiDollarSign },
    { to: `/case-studies`, label: "Case Studies", text: "Real deployments, measurable results", icon: FiAward },
    { to: `/portfolio`, label: "Project Gallery", text: "The results we’ve shipped", icon: FiGrid },
    { to: `/compare`, label: "Compare Services", text: "Build vs buy — honest decision guides", icon: FiLayers },
    { to: `/careers`, label: "Careers", text: "Build AI systems with us", icon: FiBriefcase },
    { to: `/training`, label: "Training Academy", text: "Guided courses on software and AI", icon: FiBook },
    { to: `/support`, label: "Support Hub", text: "Help and assistance when you need it", icon: FiHeadphones },
    { to: `/reviews`, label: "Client Reviews", text: "Verified client feedback", icon: FiStar },
    { to: `/faq`, label: "FAQ", text: "Answers to common questions", icon: FiHelpCircle },
    { to: `/contact`, label: "Contact Us", text: "Get in touch with our team", icon: FiMail },
  ];

  const aboutSubLinks = aboutSectionList.map((s) => ({
    to: `/about/${s.slug}`,
    label: s.name,
    text: s.tagline,
    icon: s.icon,
  }));

  const mobileMenu = [
    { label: "Home", to: `/` },
    { label: "Services", to: `/services`, children: servicePillars.map((p) => ({ label: p.title, to: `/services/pillars/${p.id}` })) },
    { label: "Products", to: `/products`, children: coreProducts.slice(0, 5).map((a) => ({ label: a.title, to: `/products/${a.slug}` })) },
    { label: "Solutions", to: `/solutions` },
    { label: "Industries", to: `/industries`, children: industries.map((ind) => ({ label: ind.name, to: `/industries/${ind.slug}` })) },
    { label: "Technologies", to: `/technologies` },
    { label: "Pricing", to: `/pricing` },
    { label: "Insights", to: `/blog` },
    { label: "About", to: `/about`, children: aboutSubLinks.map((s) => ({ label: s.label, to: s.to })) },
    { label: "Our Team", to: `/team` },
    { label: "Careers", to: `/careers` },
    { label: "Training", to: `/training` },
    { label: "Support", to: `/support` },
    { label: "Reviews", to: `/reviews` },
    { label: "Compare Services", to: `/compare` },
    { label: "Book a Demo", to: `/demo` },
    { label: "FAQ", to: `/faq` },
    { label: "Contact", to: `/contact` },
  ];

  return (
    <header className={`mc-navbar ${scrolled ? "mc-navbar-scrolled" : ""}`} ref={navRef} onMouseLeave={onNavMouseLeave}>
      <ScrollProgress />
      <div className="mc-container mc-navbar-inner">
        <Link to={`/`} className="mc-brand" aria-label="Manage Core home">
          <img src={logoMark} alt="Manage Core logo" />
          Manage
          <small>Core</small>
        </Link>

        <nav className="mc-nav-links" aria-label="Primary">
          <div className={`mc-menu-root ${open === "company" ? "mc-menu-open" : ""}`} {...hoverProps("company")}>
            <a
              to="#company"
              className="mc-nav-item"
              aria-expanded={open === "company"}
              onClick={(e) => {
                e.preventDefault();
                setOpen(open === "company" ? null : "company");
              }}
            >
              Company <FiChevronDown />
            </a>
            <div className="mc-dropdown wide mc-drop-center mc-drop-company" style={{ left: menuLefts.company ? `${menuLefts.company}px` : undefined }}>
              <div className="mc-drop-inner">
                <div className="mc-drop-cards">
                  <div className="mc-company-section">
                    <div className="mc-drop-title">Inside About</div>
                    <div className="mc-dropdown-cols">
                      {aboutSubLinks.map((l) => (
                        <NavChip key={l.label} icon={l.icon} label={l.label} text={l.text} to={l.to} />
                      ))}
                    </div>
                  </div>
                  <div className="mc-company-section">
                    <div className="mc-drop-title">Company</div>
                    <div className="mc-dropdown-cols">
                      {companyLinks.map((l) => (
                        <NavChip key={l.label} icon={l.icon} label={l.label} text={l.text} to={l.to} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`mc-menu-root ${open === "products" ? "mc-menu-open" : ""}`} {...hoverProps("products")}>
            <a
              to="#products"
              className="mc-nav-item"
              aria-expanded={open === "products"}
              onClick={(e) => {
                e.preventDefault();
                setOpen(open === "products" ? null : "products");
              }}
            >
              Products <FiChevronDown />
            </a>
            <div className="mc-dropdown wide mc-drop-products mc-drop-center" style={{ left: menuLefts.products ? `${menuLefts.products}px` : undefined }}>
              <div className="mc-drop-inner">
                <div className="mc-drop-cards">
                  <div className="mc-drop-title">The Product Suite</div>
                  <div className="mc-dropdown-cols">
                    {coreProducts.map((a) => (
                      <NavChip key={a.slug} icon={a.icon || FiFileText} label={a.title} text={a.text} to={`/products/${a.slug}`} />
                    ))}
                    {aiAgents.slice(0, 3).map((a) => (
                      <NavChip key={a.slug} icon={a.icon || FiFileText} label={a.title} text={a.text} to={`/products/${a.slug}`} />
                    ))}
                  </div>
                  <DropFoot to={`/products`} label="View all products" />
                </div>
                <DropMedia
                  image={aiInsightsDashboard}
                  title="What’s new"
                  text="Read how our autonomous agents perform on real production workloads."
                  to={`/case-studies`}
                />
              </div>
            </div>
          </div>

          <div className={`mc-menu-root mc-menu-center ${open === "services" ? "mc-menu-open" : ""}`} {...hoverProps("services")}>
            <a
              to="#services"
              className="mc-nav-item"
              aria-expanded={open === "services"}
              onClick={(e) => {
                e.preventDefault();
                setOpen(open === "services" ? null : "services");
              }}
            >
              Services <FiChevronDown />
            </a>
            <div className="mc-dropdown wide mc-drop-center" style={{ left: menuLefts.services ? `${menuLefts.services}px` : undefined }}>
              <div className="mc-drop-inner">
                <div className="mc-drop-cards">
                  <div className="mc-drop-title">Services</div>
                  <div className="mc-dropdown-cols">
                    {servicePillars.map((p) => (
                      <NavChip key={p.id} icon={p.icon} label={p.title} text={p.tagline} to={`/services/pillars/${p.id}`} />
                    ))}
                  </div>
                  <DropFoot to={`/services`} label="View all services" />
                </div>
                <DownloadBrochureButton image={workflowDashboard} />
              </div>
            </div>
          </div>

          <div className={`mc-menu-root ${open === "industries" ? "mc-menu-open" : ""}`} {...hoverProps("industries")}>
            <a
              to="#industries"
              className="mc-nav-item"
              aria-expanded={open === "industries"}
              onClick={(e) => {
                e.preventDefault();
                setOpen(open === "industries" ? null : "industries");
              }}
            >
              Industries <FiChevronDown />
            </a>
            <div className="mc-dropdown wide mc-drop-center" style={{ left: menuLefts.industries ? `${menuLefts.industries}px` : undefined }}>
              <div className="mc-drop-inner">
                <div className="mc-drop-cards">
                  <div className="mc-drop-title">Industries We Serve</div>
                  <div className="mc-dropdown-cols">
                    {industries.map((ind) => (
                      <NavChip key={ind.name} icon={ind.icon} label={ind.name} text={ind.text} to={`/industries/${ind.slug}`} />
                    ))}
                  </div>
                  <DropFoot to={`/industries`} label="Explore all industries" />
                </div>
                <DropMedia
                  image={workflowDashboard}
                  title="Your industry, one operating model"
                  text="The same premium architecture, adapted to the workflows, controls and compliance of your vertical."
                  to={`/industries`}
                />
                </div>
              </div>
            </div>

          <div className={`mc-menu-root ${open === "insights" ? "mc-menu-open" : ""}`} {...hoverProps("insights")}>
            <a
              to="#insights"
              className="mc-nav-item"
              aria-expanded={open === "insights"}
              onClick={(e) => {
                e.preventDefault();
                setOpen(open === "insights" ? null : "insights");
              }}
            >
              Insights <FiChevronDown />
            </a>
            <div className="mc-dropdown wide mc-drop-center" style={{ left: menuLefts.insights ? `${menuLefts.insights}px` : undefined }}>
              <div className="mc-drop-inner">
                <div className="mc-drop-cards">
                  <div className="mc-drop-title">Insights &amp; Trends</div>
                  <div className="mc-dropdown-cols">
                    {[
                      { label: "AI Trends", to: `/blog/AI%20Trends`, text: "Latest advancements and future forecasts", icon: FiTrendingUp },
                      { label: "Solutions", to: `/blog/Solutions`, text: "Pragmatic architectures and systems integration", icon: FiSettings },
                      { label: "Growth", to: `/blog/Growth`, text: "Strategies for digital transformation and scale", icon: FiBarChart2 },
                      { label: "Automation", to: `/blog/Automation`, text: "Workflows, security, and orchestration tips", icon: FiZap },
                    ].map((l) => (
                      <NavChip key={l.label} icon={l.icon} label={l.label} text={l.text} to={l.to} />
                    ))}
                  </div>
                  <DropFoot to={`/blog`} label="All insights &amp; publications" />
                </div>
                <DropMedia
                  image={hrmsDashboard}
                  title="Command Center Insights"
                  text="See how real-time BI analytics and AI workflows can unify operations and increase ROI."
                  to={`/blog`}
                />
              </div>
            </div>
          </div>

          <Link to={`/contact`} className="mc-nav-item">
            Contact Us
          </Link>
        </nav>

        <div className="mc-nav-actions">
          <button className="mc-theme-toggle" onClick={toggle} aria-label="Toggle theme">
            <FiSun className="mc-theme-icon mc-theme-icon-sun" aria-hidden />
            <FiMoon className="mc-theme-icon mc-theme-icon-moon" aria-hidden />
          </button>
          <Link to={`/demo`} className="mc-nav-demo-btn">
            <FiPlay /> Book a Demo
          </Link>
          <Link to={`/contact`} className="mc-btn mc-btn-primary mc-btn-pill">
            Free Audit <FiArrowRight />
          </Link>
          <button className="mc-burger" onClick={() => setMobile((m) => !m)} aria-label="Menu">
            {mobile ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="mc-mobile-menu">
          {mobileMenu.map((l) => (
            <React.Fragment key={l.label}>
              <Link to={l.to} className="mc-mobile-link" onClick={closeMobile}>
                {l.label}
              </Link>
              {l.children &&
                l.children.slice(0, 5).map((c) => (
                  <Link key={c.label} to={c.to} className="mc-mobile-sub" onClick={closeMobile}>
                    <FiChevronRight size={13} /> {c.label}
                  </Link>
                ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );
}
