import {
  FiTarget, FiEye, FiUsers, FiShield, FiZap, FiLayers, FiCheck,
  FiAward, FiGlobe, FiHeart, FiActivity, FiCpu,
} from "react-icons/fi";


const aboutImg = "/images/company/aivent/misc/c1.webp";
const aiShot = "/images/company/screens/ai-insights-dashboard.png";
const erpShot = "/images/company/screens/erp-dashboard.png";
const workflowShot = "/images/company/screens/workflow-dashboard.png";

export const aboutShots = {
  "our-story": aboutImg,
  "mission-vision": aiShot,
  "why-choose-us": erpShot,
  leadership: workflowShot,
  values: aiShot,
  "how-we-work": workflowShot,
};

export const aboutSections = {
  "our-story": {
    name: "Our Story",
    tagline: "From a focused software shop to a full engineering partner for AI, SaaS and connected systems.",
    headline: "The Manage Core story",
    overview:
      "Manage Core started with a simple conviction: businesses don't need more software, they need software that fits. We began building bespoke applications for clients whose off-the-shelf tools forced them to change their process — and we kept the approach that made those projects work: business-first discovery, disciplined engineering, and honest scope.",
    story: [
      "In the beginning we were a small custom-software team taking on the problems bigger vendors ignored — scattered finance records, manual approval chains, operational reporting that never matched management questions. Each project taught us the same lesson: the value is in the fit, not the feature list.",
      "As our clients grew, so did the problems they brought us — automation across disconnected tools, AI that had to work on real production data, platforms that needed to scale across departments and regions. We expanded into AI engineering, cloud operations, cybersecurity, design and digital growth so one team could own a problem end to end.",
      "Today Manage Core is a global engineering partner shipping connected platforms, AI agents and growth systems — with the delivery discipline that made the early projects work, and the depth to take on enterprise and public-sector complexity. The code, the data, the models and the infrastructure always stay with the client.",
    ],
    milestones: [
      { label: "Founded", text: "Started as a bespoke software shop solving workflow problems for SME operations." },
      { label: "Expanded practice", text: "Grew into ERP, CRM, HRMS and enterprise systems delivery across industries." },
      { label: "AI era", text: "Launched AI solutions, agents and automation practice with private, owned deployments." },
      { label: "Eight practice areas", text: "Unified software, AI, business systems, cloud, security, design, growth and consulting under one delivery model." },
    ],
    facts: [
      { value: 120, suffix: "+", label: "Solutions delivered" },
      { value: 80, suffix: "+", label: "Client types served" },
      { value: 8, suffix: "", label: "Delivery categories" },
      { value: 100, suffix: "%", label: "Source code ownership" },
    ],
  },
  "mission-vision": {
    name: "Mission & Vision",
    tagline: "Why we build, and where we're taking it.",
    headline: "Building software that returns control to the people who use it",
    mission:
      "Our mission is to remove the distance between a business problem and the software that solves it — by understanding the work, scoping honestly, and delivering systems our clients fully own, with the training and support to actually use them.",
    vision:
      "Our vision is a world where every serious organization — from a founder's first product to a public institution — can operate on software that fits its processes, protects its data, and evolves with it. No black boxes. No lock-in. No software that forces you to change the way you work for its convenience.",
    pillars: [
      { icon: FiTarget, title: "Business-first", text: "We solve the problem before we reach for the stack." },
      { icon: FiShield, title: "Ownership by default", text: "Code, data, models and infrastructure remain yours, always." },
      { icon: FiEye, title: "Transparency", text: "Clear milestones, documented decisions, honest reporting." },
      { icon: FiUsers, title: "Adoption as delivery", text: "Training and enablement are part of the build, not an afterthought." },
    ],
    goals: [
      "Every client can own, extend and operate the systems we hand over.",
      "AI adopted safely — private by default, reviewable by design.",
      "Connected operations replace disconnected spreadsheets and email chains.",
      "Reporting leadership needs is live, not reassembled at month-end.",
    ],
  },
  leadership: {
    name: "Leadership",
    tagline: "The senior team behind our delivery model.",
    headline: "Led by engineers who still ship",
    overview:
      "Manage Core is run by people who build — senior engineers, designers and operators who stay hands-on with clients. There are no sales scripts between you and the people who will architect and build your system.",
    principles: [
      "Senior talent on every engagement, not just the pitch.",
      "Reviews with the engineers, not account managers.",
      "Decisions documented and argued with evidence.",
      "Long-term ownership of the outcome, not the ticket.",
    ],
    leaders: [
      {
        role: "Founding team",
        title: "Engineering",
        text: "Architects full-stack platforms, AI systems and integration layers end to end — from database design to production operations.",
        initials: "MC",
      },
      {
        role: "Delivery",
        title: "Delivery leadership",
        text: "Keep engagements scoped, transparent and on schedule — reconciling scope, budget and timelines honestly.",
        initials: "DL",
      },
      {
        role: "Product & Design",
        title: "Product & Design",
        text: "Turn business workflows into interfaces teams adopt — research, prototypes and design systems before the build.",
        initials: "PD",
      },
    ],
    hiring: "We're always hiring senior engineers, AI specialists, designers and delivery leads.",
    hiringTo: "/careers",
  },
  "why-choose-us": {
    name: "Why Choose Us",
    tagline: "Ownership, transparency and support — compared honestly against the typical agency model.",
    headline: "Why teams choose Manage Core",
    overview:
      "There are a lot of vendors who can write code. We're chosen for how we run the work: honest scope, full ownership handed to you, a senior team that stays involved, and long-term support after launch.",
    compare: [
      {
        us: "Design, build and run together — one team that owns the whole stack and outcome.",
        other: "An agency hands off deliverables and disappears after launch.",
        title: "How we operate",
      },
      {
        us: "Clear packages with prices confirmed after discovery — scope, not menu.",
        other: "Vague day-rates and surprise change orders.",
        title: "Pricing",
      },
      {
        us: "Warranty, monitoring and aggregated support after every launch.",
        other: "You hope nothing breaks after handover.",
        title: "Support",
      },
      {
        us: "You own the source code, data and architecture — always.",
        other: "You rent a locked-in, hosted black box.",
        title: "Ownership",
      },
    ],
    reasons: [
      { icon: FiLayers, title: "Full-stack ownership", text: "One team covering software, AI, cloud, security, design and growth — so nothing falls between vendors." },
      { icon: FiShield, title: "You own everything", text: "Source code, data, models and infrastructure are yours. We build for portability, not lock-in." },
      { icon: FiEye, title: "Honest scope", text: "Capabilities are described exactly. Prices follow discovery and scope — no unclear day-rates." },
      { icon: FiZap, title: "Senior, hands-on team", text: "Reviews and decisions happen with the engineers who build your system." },
      { icon: FiUsers, title: "Adoption built in", text: "Training, enablement and support are part of delivery, not an upsell." },
      { icon: FiAward, title: "Outcomes, not output", text: "We measure what we ship against the business result, with dashboards that show it." },
    ],
    stats: [
      { value: 120, suffix: "+", label: "Solutions delivered" },
      { value: 98, suffix: "%", label: "On-time delivery" },
      { value: 24, suffix: "/7", label: "Support mindset" },
      { value: 100, suffix: "%", label: "Source code ownership" },
    ],
  },
  values: {
    name: "Values",
    tagline: "Principles that shape every engagement.",
    headline: "How we behave when no one is watching",
    overview:
      "Our values aren't a poster — they're the standards we hold ourselves to on every commit, every sprint review and every go-live.",
    values: [
      { icon: FiTarget, title: "Business-first", text: "We solve the problem before we reach for the stack." },
      { icon: FiShield, title: "Truthful scope", text: "Capabilities are described exactly — no inflated promises." },
      { icon: FiUsers, title: "People over process", text: "Training and adoption are part of delivery, not an afterthought." },
      { icon: FiLayers, title: "Modular growth", text: "Start where it matters and expand without rewriting." },
      { icon: FiEye, title: "Transparency", text: "Clear milestones, documented decisions, honest reporting." },
      { icon: FiActivity, title: "Long-term thinking", text: "Architecture decisions account for the next five years." },
    ],
  },
  "how-we-work": {
    name: "How We Work",
    tagline: "The delivery model behind every engagement.",
    headline: "Discovery, honest scope, modular build, owned handover",
    overview:
      "Every engagement follows the same operating model — refined across hundreds of projects. It removes surprises on both sides and keeps the work moving toward a result you can measure.",
    steps: [
      { stage: "Discover", title: "Understand the business problem", text: "Map goals, users, data, blockers and ROI targets before any design." },
      { stage: "Architect", title: "Design the right system", text: "Define scope, modules, security, workflows, integrations and milestones." },
      { stage: "Design", title: "Prototype premium experiences", text: "Wireframe and validate the interface with stakeholders before build." },
      { stage: "Build", title: "Ship in controlled phases", text: "Deliver in sprints with clean APIs, components and QA gates." },
      { stage: "Launch", title: "Launch and enable adoption", text: "Migrate data, train teams, monitor adoption and operate the first cycle." },
    ],
    commitments: [
      "Reply within one business day.",
      "Scope, timeline and budget confirmed before work starts.",
      "Working demos at every step — no reveal-day surprises.",
      "Full ownership handed over with documentation and training.",
    ],
  },
};

export const aboutSectionList = Object.keys(aboutSections).map((slug) => ({
  slug,
  icon: {
    "our-story": FiEye,
    "mission-vision": FiTarget,
    leadership: FiUsers,
    "why-choose-us": FiShield,
    values: FiHeart,
    "how-we-work": FiActivity,
  }[slug] || FiLayers,
  ...aboutSections[slug],
}));

export default aboutSections;