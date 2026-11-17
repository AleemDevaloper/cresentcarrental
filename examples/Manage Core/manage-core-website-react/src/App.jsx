import React, { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { SiteThemeProvider } from "@/components/SiteTheme";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import ChatBot from "@/components/ChatBot";
import Preloader from "@/components/Preloader";
import PageSkeleton from "@/components/PageSkeleton";
import { FiX, FiZap, FiSliders, FiArrowUp } from "react-icons/fi";
import "@/styles/site.css";
import "@/styles/preloader.css";
import "@/styles/skeleton.css";
import "@/styles/fonts-bridge.css";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const AboutSection = lazy(() => import("@/pages/AboutSection"));
const AboutStory = lazy(() => import("@/pages/AboutStory"));
const AboutMission = lazy(() => import("@/pages/AboutMission"));
const AboutLeadership = lazy(() => import("@/pages/AboutLeadership"));
const AboutWhyChooseUs = lazy(() => import("@/pages/AboutWhyChooseUs"));
const AboutValues = lazy(() => import("@/pages/AboutValues"));
const AboutApproach = lazy(() => import("@/pages/AboutApproach"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const ServicePillar = lazy(() => import("@/pages/ServicePillar"));
const ServiceCategory = lazy(() => import("@/pages/ServiceCategory"));
const ResourceDetail = lazy(() => import("@/pages/ResourceDetail"));
const Industries = lazy(() => import("@/pages/Industries"));
const IndustryDetail = lazy(() => import("@/pages/IndustryDetail"));
const Solutions = lazy(() => import("@/pages/Solutions"));
const Products = lazy(() => import("@/pages/Products"));
const AgentDetail = lazy(() => import("@/pages/AgentDetail"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const CaseStudies = lazy(() => import("@/pages/CaseStudies"));
const Technologies = lazy(() => import("@/pages/Technologies"));
const Process = lazy(() => import("@/pages/Process"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const Tickets = lazy(() => import("@/pages/Tickets"));
const Resources = lazy(() => import("@/pages/Resources"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Careers = lazy(() => import("@/pages/Careers"));
const Contact = lazy(() => import("@/pages/Contact"));
const Team = lazy(() => import("@/pages/Team"));
const Faq = lazy(() => import("@/pages/Faq"));
const Demo = lazy(() => import("@/pages/Demo"));
const Legal = lazy(() => import("@/pages/Legal"));
const SolutionDetail = lazy(() => import("@/pages/SolutionDetail"));
const CaseStudyDetail = lazy(() => import("@/pages/CaseStudyDetail"));
const CareerDetail = lazy(() => import("@/pages/CareerDetail"));
const Support = lazy(() => import("@/pages/Support"));
const Training = lazy(() => import("@/pages/Training"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const Compare = lazy(() => import("@/pages/Compare"));
const CompareDetail = lazy(() => import("@/pages/CompareDetail"));
const PricingDetail = lazy(() => import("@/pages/PricingDetail"));
const Locations = lazy(() => import("@/pages/Locations"));
const LocationDetail = lazy(() => import("@/pages/LocationDetail"));
const Partners = lazy(() => import("@/pages/Partners"));
const Results = lazy(() => import("@/pages/Results"));
const Accessibility = lazy(() => import("@/pages/Accessibility"));
const Sitemap = lazy(() => import("@/pages/Sitemap"));
const PrivacyChoices = lazy(() => import("@/pages/PrivacyChoices"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

function AnnounceBar() {
  const [hidden, setHidden] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("mc-announce-dismissed") === "1"
  );
  if (hidden) return null;
  return (
    <div className="mc-announce">
      <div className="mc-container mc-announce-inner">
        <span className="mc-announce-badge"><FiZap /> New</span>
        <span className="mc-announce-text">
          AI automation discovery workshops for 2026 planning — scope before you commit.
        </span>
        <Link to="/contact" className="mc-announce-link">Book a workshop <FiZap /></Link>
        <button
          type="button"
          className="mc-announce-close"
          onClick={() => {
            window.localStorage.setItem("mc-announce-dismissed", "1");
            setHidden(true);
          }}
          aria-label="Dismiss announcement"
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}

function CookieBanner() {
  const [prefs, setPrefs] = useState(() => {
    if (typeof window === "undefined") return { saved: true };
    const saved = window.localStorage.getItem("mc-cookie-prefs");
    return saved ? JSON.parse(saved) : null;
  });
  const [panel, setPanel] = useState(false);
  if (prefs) return null;
  return (
    <div className="mc-cookie">
      <div className="mc-cookie-card">
        <div className="mc-cookie-head"><FiSliders /><b>Cookie preferences</b></div>
        <p>Essential storage is always active. Optional categories remain off unless you enable them.</p>
        {panel && (
          <div className="mc-cookie-panel">
            {[["Essential", true], ["Analytics", false], ["Marketing", false]].map(([label, def]) => (
              <label key={String(label)} className="mc-cookie-row">
                <span><b>{label}</b></span>
                <input type="checkbox" defaultChecked={Boolean(def)} aria-label={String(label)} />
              </label>
            ))}
          </div>
        )}
        <div className="mc-cookie-actions">
          <button
            type="button"
            className="mc-cookie-btn primary"
            onClick={() => {
              window.localStorage.setItem("mc-cookie-prefs", JSON.stringify({ saved: true }));
              setPrefs({ saved: true });
            }}
          >
            Accept all
          </button>
          <button type="button" className="mc-cookie-btn" onClick={() => setPanel((p) => !p)}>
            {panel ? "Hide" : "Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}

function RouteFallback() {
  const { pathname } = useLocation();
  const detail = /\/(products|services|solutions|case-studies|blog\/posts|careers)\//.test(pathname);
  return <PageSkeleton variant={detail ? "minimal" : "default"} />;
}

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const threshold = 200;
    const scrollEls = new Set();
    if (typeof window !== "undefined") scrollEls.add(window);
    if (document && (document.scrollingElement || document.documentElement)) scrollEls.add(document.scrollingElement || document.documentElement);
    const root = document.getElementById("root");
    if (root) scrollEls.add(root);
    const flexRoot = document.querySelector(".flex-grow-1");
    if (flexRoot) scrollEls.add(flexRoot);

    const getScrollTop = (el) => {
      if (el === window) return window.scrollY || window.pageYOffset || 0;
      return el ? el.scrollTop || 0 : 0;
    };

    const onScroll = () => {
      let max = 0;
      scrollEls.forEach((el) => {
        try {
          max = Math.max(max, getScrollTop(el));
        } catch {
          // ignore unreadable scroll targets
        }
      });
      setShow(max > threshold);
    };

    scrollEls.forEach((el) => {
      try {
        el.addEventListener("scroll", onScroll, { passive: true });
      } catch {
        // ignore non-listeners
      }
    });

    const pollId = setInterval(onScroll, 300);
    onScroll();

    return () => {
      clearInterval(pollId);
      scrollEls.forEach((el) => {
        try {
          el.removeEventListener("scroll", onScroll);
        } catch {
          // ignore detached listeners
        }
      });
    };
  }, []);

  return (
    <button
      type="button"
      className={`mc-to-top ${show ? "is-visible" : ""}`}
      aria-label="Back to top"
      onClick={() => {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          // ignore unsupported smooth scroll
        }
        const root = document.getElementById("root");
        if (root) root.scrollTo({ top: 0, behavior: "smooth" });
        const flexRoot = document.querySelector(".flex-grow-1");
        if (flexRoot) flexRoot.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <FiArrowUp />
    </button>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <SiteThemeProvider>
      {!booted && <Preloader minMs={1200} onDone={() => setBooted(true)} />}
      <Seo />
      <ScrollToTop />
      <AnnounceBar />
      <CookieBanner />
      <Navbar />
      <main id="main-content">
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="about/our-story" element={<AboutStory />} />
            <Route path="about/mission-vision" element={<AboutMission />} />
            <Route path="about/leadership" element={<AboutLeadership />} />
            <Route path="about/why-choose-us" element={<AboutWhyChooseUs />} />
            <Route path="about/values" element={<AboutValues />} />
            <Route path="about/how-we-work" element={<AboutApproach />} />
            <Route path="about/:slug" element={<AboutSection />} />
            <Route path="services" element={<Services />} />
            <Route path="services/pillars/:id" element={<ServicePillar />} />
            <Route path="services/categories/:slug" element={<ServiceCategory />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="resources/:slug" element={<ResourceDetail />} />
            <Route path="industries" element={<Industries />} />
            <Route path="industries/:slug" element={<IndustryDetail />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="solutions/:slug" element={<SolutionDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<AgentDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="technologies" element={<Technologies />} />
            <Route path="process" element={<Process />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="pricing/:slug" element={<PricingDetail />} />
            <Route path="compare" element={<Compare />} />
            <Route path="compare/:slug" element={<CompareDetail />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="resources" element={<Resources />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:cat" element={<Blog />} />
            <Route path="blog/posts/:id" element={<BlogPost />} />
            <Route path="careers" element={<Careers />} />
            <Route path="careers/:slug" element={<CareerDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="team" element={<Team />} />
            <Route path="faq" element={<Faq />} />
            <Route path="demo" element={<Demo />} />
            <Route path="legal" element={<Legal />} />
            <Route path="support" element={<Support />} />
            <Route path="training" element={<Training />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="locations" element={<Locations />} />
            <Route path="locations/:slug" element={<LocationDetail />} />
            <Route path="partners" element={<Partners />} />
            <Route path="results" element={<Results />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="sitemap" element={<Sitemap />} />
            <Route path="privacy-choices" element={<PrivacyChoices />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <ChatBot />
      <BackToTop />
      <Footer />
    </SiteThemeProvider>
  );
}
