import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { allServices, serviceCategories } from "@/data/servicesData";
import { industryDetailOf } from "@/data/industriesData";
import { coreProductOf } from "@/data/productsData";
import { resourceOf } from "@/data/resourceData";
import { aboutSectionList } from "@/data/aboutData";
import { comparisonOf } from "@/data/comparisonData";
import { pricingPageOf } from "@/data/pricingData";

const BASE = "https://managecore.asiancon.com";

const routeMeta = {
  "": {
    title: "Manage Core — Software, AI Automation & Digital Growth",
    description:
      "A global software house building custom software, SaaS products, AI automation and digital growth systems for startups, SMEs, enterprises, schools, hospitals and construction teams.",
  },
  "/about": {
    title: "About — Manage Core",
    description:
      "Manage Core is a software house delivering custom software, AI automation, SaaS products and digital growth — designed around real business problems.",
  },
  "/services": {
    title: "Services — Manage Core",
    description:
      "Custom software, AI & automation, ERP/CRM/HRMS, web & mobile apps, cloud & security, APIs, UI/UX design, digital marketing and business consulting.",
  },
  "/solutions": {
    title: "Solutions — Manage Core",
    description:
      "AI integration, HRMS & payroll, accounting ERP, retail POS, school management, custom software, websites, project systems and startup MVPs.",
  },
  "/products": {
    title: "Products — Manage Core",
    description:
      "Manage Core ERP, AI Insight Desk, Workflow OS and People Cloud — connected, custom SaaS products built on proven foundations.",
  },
  "/industries": {
    title: "Industries — Manage Core",
    description:
      "Software and automation for startups, SMEs, enterprise, government, education, healthcare, construction, manufacturing, real estate, logistics and e-commerce.",
  },
  "/portfolio": {
    title: "Portfolio — Manage Core",
    description:
      "Selected software, ERP, AI, HRMS and automation projects delivered by Manage Core.",
  },
  "/case-studies": {
    title: "Case Studies — Manage Core",
    description:
      "Real implementation stories showing workflows, modules and measured outcomes.",
  },
  "/technologies": {
    title: "Technologies — Manage Core",
    description:
      "The pragmatic technology stack Manage Core selects per project: React, Node.js, Laravel, Python, cloud, DevOps, AI and data tools.",
  },
  "/process": {
    title: "Process — Manage Core",
    description:
      "Discovery, solution design, scoping, build, data migration, testing, training and ongoing support — our structured delivery model.",
  },
  "/pricing": {
    title: "Pricing — Manage Core",
    description:
      "Transparent packages with custom scoping confirmed after discovery. Pricing depends on modules, users, branches, integrations and support.",
  },
  "/resources": {
    title: "Resources — Manage Core",
    description:
      "Demo center, training academy, insights, client reviews, support hub and security practice.",
  },
  "/blog": {
    title: "Blog — Manage Core",
    description:
      "Ideas on operations, AI automation, software evaluation and digital transformation.",
  },
  "/careers": {
    title: "Careers — Manage Core",
    description:
      "Join the Manage Core team — engineering, product, delivery, design and growth roles.",
  },
  "/contact": {
    title: "Contact — Manage Core",
    description:
      "Start a project or book a consultation with the Manage Core team.",
  },
  "/team": {
    title: "Our Team — Manage Core",
    description:
      "Meet the senior engineers, designers and operators building Manage Core's AI systems across Lahore, Al Jubail and remote hubs.",
  },
  "/faq": {
    title: "FAQ — Manage Core",
    description:
      "Honest answers on pricing, process, technology, security and support from the Manage Core team.",
  },
  "/demo": {
    title: "Book a Demo — Manage Core",
    description:
      "See live product demos of Manage Core's AI agents and software. Your workflows, real modules, honest answers.",
  },
  "/support": {
    title: "Support — Manage Core",
    description:
      "Implementation support, training, maintenance and assistance for the systems we build and run.",
  },
  "/training": {
    title: "Training Academy — Manage Core",
    description:
      "Structured courses on software evaluation, finance, HR, retail, education and digital transformation.",
  },
  "/reviews": {
    title: "Client Reviews — Manage Core",
    description:
      "Verified, approved client feedback and our honest publishing policy. Read reviews or share your experience.",
  },
  "/compare": {
    title: "Build vs Buy Comparisons — Manage Core",
    description:
      "Honest decision guides: custom software vs SaaS, web vs mobile, ERP, SEO vs Google Ads, in-house vs outsourcing — with a framework for deciding.",
  },
};

const SERVICE_META = {
  title: "Services — Manage Core",
  description:
    "Purpose-built software, AI automation and digital growth delivered around the way your business works.",
};

function ensureMeta(attrName, attrValue) {
  const selector = `meta[${attrName}="${attrValue}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  return el;
}

function applyMeta({ title, description }) {
  document.title = title;
  ensureMeta("name", "description").setAttribute("content", description);
  ensureMeta("property", "og:title").setAttribute("content", title);
  ensureMeta("property", "og:description").setAttribute("content", description);
  ensureMeta("property", "og:type").setAttribute("content", "website");
  ensureMeta("property", "og:url").setAttribute("content", `${BASE}${window.location.pathname}`);
  ensureMeta("property", "og:image").setAttribute("content", `${BASE}/og/company/social-share.png`);
  ensureMeta("name", "twitter:card").setAttribute("content", "summary_large_image");
  ensureMeta("name", "twitter:title").setAttribute("content", title);
  ensureMeta("name", "twitter:description").setAttribute("content", description);
  ensureMeta("name", "twitter:image").setAttribute("content", `${BASE}/og/company/social-share.png`);
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", `${BASE}${window.location.pathname}`);
}

function injectJsonLd(jsonLd) {
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.text = JSON.stringify(jsonLd);
  el.dataset.mcJsonLd = "true";
  document.head.appendChild(el);
}

function applyServiceMeta(service) {
  const path = window.location.pathname;
  const url = `${BASE}${path}`;
  applyMeta({
    title: `${service.name} — Manage Core`,
    description: service.description,
  });

  const faqSchema = (service.faqs || []).map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  }));

  injectJsonLd({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "Organization", name: "Manage Core", url: BASE },
    url,
    areaServed: "Worldwide",
    serviceType: service.name,
  });
  injectJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${BASE}/services` },
      { "@type": "ListItem", position: 3, name: service.name, item: url },
    ],
  });
  if (faqSchema.length) {
    injectJsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqSchema });
  }
}

function clearMcJsonLd() {
  document.head.querySelectorAll('script[data-mc-json-ld="true"]').forEach((el) => el.remove());
}

function injectOrgGraph() {
  injectJsonLd({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${BASE}/#organization`,
        name: "Manage Core",
        url: BASE,
        logo: {
          "@type": "ImageObject",
          url: `${BASE}/assets/images/logo1.png`,
        },
        description:
          "A software house building custom software, AI automation, SaaS products and digital growth systems for startups, SMEs and enterprises.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lahore",
          addressCountry: "PK",
        },
        areaServed: "Worldwide",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: BASE,
        name: "Manage Core",
        publisher: { "@id": `${BASE}/#organization` },
        inLanguage: "en",
      },
    ],
  });
}

function injectFaqSchema(faqs) {
  injectJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  });
}

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    clearMcJsonLd();
    let meta = routeMeta[pathname];
    if (pathname === "") {
      injectOrgGraph();
      injectFaqSchema([
        ["Do you build complete SaaS products?", "Yes. We handle product strategy, UX, frontend, backend, APIs, cloud deployment, billing and ongoing iterations end to end."],
        ["Can we start with one module?", "Yes. A modular rollout can begin with the highest-priority workflow and expand as dependencies and the roadmap allow."],
        ["How is pricing calculated?", "Pricing depends on modules, users, branches, integrations, migration, deployment, training and the support level required."],
        ["What support is available after launch?", "Agreed maintenance, issue handling, user assistance and planned improvements are available after go-live."],
      ]);
    }
    if (!meta) {
      const serviceMatch = pathname.match(/^\/services\/([^/]+)/);
      if (serviceMatch) {
        const service = allServices.find((s) => s.slug === serviceMatch[1]);
        if (service) {
          applyServiceMeta(service);
          return;
        }
      }

      const categoryMatch = pathname.match(/^\/services\/categories\/([^/]+)/);
      if (categoryMatch) {
        const cat = serviceCategories.find((c) => c.slug === categoryMatch[1]);
        if (cat) {
          applyMeta({
            title: `${cat.name} — Services | Manage Core`,
            description: `${cat.name}: ${cat.links.length} connected services — ${cat.links.map((s) => s.name).slice(0, 6).join(", ")}. Delivered by one team with full source ownership.`,
          });
          return;
        }
      }

      const industryMatch = pathname.match(/^\/industries\/([^/]+)/);
      if (industryMatch) {
        const ind = industryDetailOf(industryMatch[1]);
        if (ind) {
          applyMeta({
            title: `${ind.name} Software & Automation | Manage Core`,
            description: `${ind.tagline} Software, AI and automation for ${ind.name.toLowerCase()} teams — built around your workflows, with full ownership.`,
          });
          return;
        }
      }

      const aboutMatch = pathname.match(/^\/about\/([^/]+)/);
      if (aboutMatch) {
        const sec = aboutSectionList.find((s) => s.slug === aboutMatch[1]);
        if (sec) {
          applyMeta({
            title: `${sec.name} | About Manage Core`,
            description: sec.tagline,
          });
          return;
        }
      }

      const productMatch = pathname.match(/^\/products\/([^/]+)/);
      if (productMatch) {
        const prod = coreProductOf(productMatch[1]);
        if (prod) {
          applyMeta({
            title: `${prod.title} | Manage Core`,
            description: prod.tagline,
          });
          return;
        }
      }

      const resourceMatch = pathname.match(/^\/resources\/([^/]+)/);
      if (resourceMatch) {
        const guide = resourceOf(resourceMatch[1]);
        if (guide) {
          applyMeta({
            title: `${guide.title} | Manage Core Resources`,
            description: guide.excerpt,
          });
          return;
        }
      }

      const compareMatch = pathname.match(/^\/compare\/([^/]+)/);
      if (compareMatch) {
        const comparison = comparisonOf(compareMatch[1]);
        if (comparison) {
          applyMeta({
            title: `${comparison.title} — Build vs Buy | Manage Core`,
            description: `${comparison.focus} ${comparison.left.name} vs ${comparison.right.name} — the trade-offs, hidden costs and the framework for deciding.`,
          });
          return;
        }
      }

      const pricingMatch = pathname.match(/^\/pricing\/([^/]+)/);
      if (pricingMatch) {
        const pricingPage = pricingPageOf(pricingMatch[1]);
        if (pricingPage) {
          applyMeta({
            title: `${pricingPage.service} Pricing — Manage Core`,
            description: `${pricingPage.headline} Transparent packages, what's included and the factors that shape your quote — confirmed after discovery, no hidden fees.`,
          });
          return;
        }
      }

      if (pathname.startsWith("/services/")) meta = SERVICE_META;
      else if (pathname.startsWith("/blog/")) meta = routeMeta["/blog"];
      else meta = routeMeta[""];
    }
    if (meta) applyMeta(meta);
  }, [pathname]);
  return null;
}
