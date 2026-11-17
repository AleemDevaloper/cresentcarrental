/** Lightweight nav-only data — avoids importing full siteData/servicesData into the shell */
import {
  FiCpu, FiCode, FiGrid, FiMonitor, FiCloud, FiUsers, FiZap, FiBriefcase, FiBook,
  FiShield, FiHeart, FiTool, FiBox, FiHome, FiTruck, FiShoppingBag, FiLayers,
  FiDatabase, FiMessageSquare, FiGitBranch, FiSettings, FiTrendingUp,
  FiStar, FiAward, FiEye, FiHeadphones, FiHelpCircle, FiMail, FiDollarSign, FiInfo,
} from "react-icons/fi";

export const navServicePillars = [
  { id: "ai-agents", title: "AI Agents & Automation", tagline: "Practical agents for ops, support and knowledge", icon: FiCpu },
  { id: "custom-software", title: "Custom Software", tagline: "Workflows, dashboards and internal tools", icon: FiCode },
  { id: "business-systems", title: "Business Systems", tagline: "ERP, HRMS, POS and education platforms", icon: FiGrid },
  { id: "web-product", title: "Web & Product", tagline: "Sites, SaaS UX and growth surfaces", icon: FiMonitor },
  { id: "cloud-security", title: "Cloud & Security", tagline: "Hosting, DevOps and hardened delivery", icon: FiCloud },
];

export const navIndustries = [
  { slug: "startups", name: "Startups", icon: FiZap, text: "Validate your product and ship an MVP fast." },
  { slug: "smes", name: "SMEs", icon: FiBriefcase, text: "Replace spreadsheets with connected systems." },
  { slug: "enterprise", name: "Enterprise", icon: FiLayers, text: "Custom architecture, security and scale." },
  { slug: "government", name: "Government", icon: FiShield, text: "Transparent, audit-ready and controlled." },
  { slug: "education", name: "Education", icon: FiBook, text: "Schools, colleges and universities." },
  { slug: "healthcare", name: "Healthcare", icon: FiHeart, text: "Patient, hospital and clinic systems." },
  { slug: "construction", name: "Construction", icon: FiTool, text: "Projects, documents and site operations." },
  { slug: "manufacturing", name: "Manufacturing", icon: FiBox, text: "Inventory, production and quality." },
  { slug: "real-estate", name: "Real Estate", icon: FiHome, text: "Listings, CRM and property ops." },
  { slug: "logistics", name: "Logistics", icon: FiTruck, text: "Fleet, warehouse and delivery." },
  { slug: "ecommerce", name: "E-commerce", icon: FiShoppingBag, text: "Storefronts, POS and fulfillment." },
  { slug: "services", name: "Professional Services", icon: FiUsers, text: "Delivery, billing and client portals." },
];

export const navProducts = [
  { slug: "managecore-erp", title: "Manage Core ERP", text: "Finance, inventory and operations in one system", icon: FiDatabase },
  { slug: "ai-insight-desk", title: "AI Insight Desk", text: "Ask your business data in plain language", icon: FiMessageSquare },
  { slug: "workflow-os", title: "Workflow OS", text: "Approvals and processes without the chaos", icon: FiGitBranch },
  { slug: "people-cloud", title: "People Cloud", text: "HR, attendance and payroll connected", icon: FiUsers },
  { slug: "school-suite", title: "School Suite", text: "Students, fees and academics together", icon: FiBook },
];

export const navAgents = [
  { slug: "support-agent", title: "Support Agent", text: "Ticket triage and knowledge answers", icon: FiHeadphones },
  { slug: "sales-agent", title: "Sales Agent", text: "Lead qualification and follow-ups", icon: FiTrendingUp },
  { slug: "ops-agent", title: "Ops Agent", text: "Routine operational workflows", icon: FiSettings },
];

export const navAboutSections = [
  { slug: "our-story", name: "Our Story", tagline: "From a software shop to an engineering partner", icon: FiInfo },
  { slug: "mission-vision", name: "Mission & Vision", tagline: "Why we build, and where we're taking it", icon: FiEye },
  { slug: "leadership", name: "Leadership", tagline: "Led by engineers who still ship", icon: FiStar },
  { slug: "why-choose-us", name: "Why Choose Us", tagline: "Ownership, transparency and support", icon: FiAward },
  { slug: "values", name: "Values", tagline: "How we work with clients", icon: FiHeart },
  { slug: "how-we-work", name: "How We Work", tagline: "The delivery model behind every engagement", icon: FiGitBranch },
];

export const SERVICE_COUNT = 31;
export const CATEGORY_COUNT = 8;
