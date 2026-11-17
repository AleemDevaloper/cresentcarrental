# Manage Core — Company Website (Marketing Site)

**Module:** `manage-core-frontend/src/pages/company/site/`
**Route root:** `/website/*`
**Status:** Active — design refinement in progress (v2.5 premium review form)
**Last updated:** 2026-08-20

---

## 1. Project Overview

The company website is the public, marketing face of **Manage Core**. It is a fully
client-rendered React (Vite) application mounted inside the Manage Core admin SPA under
the `/website/*` route, with its own theme system (`SiteTheme.jsx`), its own global stylesheet
(`site.css`, ~6,900 lines), a dedicated preloader, and a nested router stack that serves
**43 pages** plus shared layouts (navbar mega-menus, footer, chatbot).

The site is the **reference demo of everything Manage Core sells** — it presents the exact
ERP / HRMS / DMS / AI products that the admin platform ships, wrapped in a high-conversion
agency-grade marketing experience.

### Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18 + React Router (nested routes under `/website`) |
| Build      | Vite (`npm run build`) |
| Styling    | Hand-written CSS in `site.css`, CSS custom-property design tokens, dark/light themes |
| Icons      | `react-icons/fi` (Feather) + `@fortawesome/fontawesome-free` (legacy, app-wide) |
| Fonts      | Urbanist (body), Space Grotesk (display), Poppins (serif accents) |
| Content    | Static data modules (`siteData.js`, `servicesData.js`, `pricingData.js`, …) |
| Extras     | PDF brochure generator (`ServicePdf.js`), SEO/JSON-LD injector (`Seo.jsx`), preloader |

---

## 2. Design Inspiration — `Design Concepts/` Folder

The visual and conversion patterns of this site are **directly inspired by the real-world
websites saved in the `Design Concepts/` folder** at the repo root:

| Folder | Source site | What the design borrows |
|--------|-------------|-------------------------|
| `Xovo/xovotechnologies.com/` | AI services agency | Rich mega-menu dropdowns, featured "media card" panels in dropdowns, gradient text headlines, service/product detail pages, case-study proof cards, insights/blog sections, dark premium hero |
| `Zylvoo/` | ERP / education software company | Pricing page structure, pricing-detail pages, comparison tables, solutions pages, "book a demo" conversion flow, product dashboard screenshots as proof |
| `Aiwave`, `Alvent`, `Bitelo`, `Esoft`, `robok`, `Softec`, `Techor` | Additional reference sites | Accent gradient systems, glassy surfaces, animated hero CTAs, stats bands, trust bands |

The design language was adapted from these references rather than copied: the same
*conversion psychology* (free audit funnel, demo booking, comparison honesty, risk reversal)
and *premium visual grammar* (glass cards, gradient text, dash-preview frames, motion on
scroll) were re-implemented natively in React/CSS for Manage Core.

### What was taken from Xovo
- **Dropdown mega-menu layout** with a left column of icon + label + description cards and a
  right "featured media" panel.
- **PageHero + eyebrow + tag chips** pattern for interior page headers.
- **Insights / blog as category filter pages** and case-study proof cards.

### What was taken from Zylvoo
- **Pricing as plan cards + pricing-detail pages** with transparent starting prices.
- **Solutions by vertical** (custom software, custom websites, industries).
- **Book a demo as the primary conversion CTA** across the navbar and CTAs.
- **Product screenshots** (dashboard mockups) shown inside framed browser previews.

### Recent sessions took the dropdown "featured panel" pattern and the enterprise
### comparison-table pattern further (see §5 and §6).

---

## 3. Site Architecture

### 3.1 Routing & pages (`src/pages/company/site/pages/`)

All pages mount inside `WebsiteSite.jsx` (shell with navbar/footer/chatbot/preloader) and
`Seo.jsx` (per-route meta + JSON-LD). List of pages:

| Area | Pages |
|------|-------|
| Home | `Home.jsx` |
| Services | `Services.jsx`, `ServiceCategory.jsx`, `ServiceDetail.jsx`, `ServicePillar.jsx` |
| Products | `Products.jsx`, `AgentDetail.jsx` |
| Solutions | `Solutions.jsx`, `SolutionDetail.jsx` |
| Industries | `Industries.jsx`, `IndustryDetail.jsx` |
| Technologies | `Technologies.jsx` |
| Pricing | `Pricing.jsx`, `PricingDetail.jsx` |
| Insights | `Blog.jsx`, `BlogPost.jsx` |
| Company | `About.jsx`, `AboutSection.jsx`, `Team.jsx`, `Process.jsx`, `Careers.jsx`, `CareerDetail.jsx` |
| Proof | `CaseStudies.jsx`, `CaseStudyDetail.jsx`, `Portfolio.jsx`, `Reviews.jsx` |
| Guides | `Compare.jsx`, `CompareDetail.jsx`, `Resources.jsx`, `ResourceDetail.jsx` |
| Conversion | `Contact.jsx`, `Demo.jsx`, `Faq.jsx`, `Support.jsx`, `Tickets.jsx`, `Training.jsx`, `Legal.jsx` |

### 3.2 Shared components (`components/`)

- `Navbar.jsx` — sticky glass navbar, scroll-progress bar, 5 mega-dropdown menus
  (Company / Products / Services / Industries / Insights), theme toggle, demo + audit CTAs,
  mobile slide-down menu.
- `Footer.jsx` — multi-column footer with product/service/insights/company link groups,
  newsletter capture, contact links.
- `SitePrimitives.jsx` — the reusable design-system layer (see §4).
- `ChatBot.jsx` — floating support chatbot widget.
- `Seo.jsx` — per-page `<title>`, meta, OpenGraph/Twitter, and Organization/WebSite/FAQ JSON-LD.
- `Preloader.jsx` + `preloader.css` — branded boot animation.
- `PageSkeleton.jsx` + `skeleton.css` — loading skeletons (`text/title/circle/rect/card/table/stats` variants).
- `ServiceComponents.jsx` — shared blocks used across Services/SolutionDetail pages
  (process steps, deliverables, FAQ accordion, packages, quote form, AI-intelligence banner).
- `ServicePdf.js` — generates and downloads the full services **brochure PDF** from the
  service catalog data.

### 3.3 Content data modules (top of `site/`)

| File | Contents |
|------|----------|
| `siteData.js` (28 exports) | company name, hero stats, logos, services, solutions, 12 industries, process, testimonials, pricing, pricing factors, FAQs, technologies, blog, careers, portfolio, case studies, values, resources, AI agents, tech marquee, integrations, service pillars |
| `servicesData.js` (1,120 lines) | **8 service categories** → `allServices` (flattened catalog of 60+ individual services), each with overview, problems, capabilities, tech stack, packages, deliverables, FAQs, related links; shared `SHARED_PROCESS` / `DEFAULT_DELIVERABLES` / `DEFAULT_FAQS` / `DEFAULT_PACKAGES`; screenshot pool `PICTURES` |
| `pricingData.js` (406 lines) | **8 pricing-detail pages** (software-development, web-development, mobile-app-development, ai-development, ai-automation, seo, digital-marketing, google-ads), each with tiers + factors |
| `productsData.js` | 5 core products: managecore, ams, edus, dms, hrms |
| `comparisonData.js` (601 lines) | 10 "build vs buy" decision guides |
| `industriesData.js` (500 lines) | per-industry detail pages + shots |
| `aboutData.js` | about section tabs |
| `resourceData.js` | resource/guide pages |

---

## 4. UI/UX Design System

### 4.1 Design tokens (`site.css` `:root` / dark theme)

- **Brand blue:** light `#4778f3` / dark `#6f9bff`; accent `#385fc0` / `#8fb0ff`; brand-soft tint for chip/icon backgrounds.
- **Surfaces:** light `--surface:#ffffff`, `--bg:#edf1f5`; dark `--surface:#1f2029`, `--bg:#15151b`.
- **Ink:** `--ink-hi`, `--ink`, `--muted`, `--muted-2` for a clear type hierarchy.
- **Lines:** `--line` / `--line-strong` borders.
- **Shadows:** `--shadow-sm/md/lg`, `--shadow-brand` (colored brand glow).
- **Semantic:** `--warning`, `--danger`, `--glow`.
- **Fonts:** `--font` Urbanist, `--display` Space Grotesk, `--serif` Poppins.
- **Dark theme:** same token names redefined under `.mc-root[data-theme="dark"]`, so all components theme automatically.

### 4.2 Design primitives (`SitePrimitives.jsx`)

- `Reveal` — scroll-reveal (fade/slide `up`, delays, `as` tag).
- `Tilt` / `Magnetic` — 3D tilt and magnetic cursor pull on cards/buttons.
- `Scrub` — scroll-scrubbed parallax via CSS vars (`--scrub-y`, `--scrub-s`).
- `Counter` — animated count-up numbers (used in stat bands).
- `Stars` — review star row.
- `SectionHeader` — eyebrow + gradient headline + lede, optional centered.
- `PageHero` — breadcrumbs + kicker chips + big headline + lede + tag row.
- `DashFrame` — browser-frame screenshot preview (product dashboard proof).
- `FAQItem` — accessible accordion item.
- `CtaBand` — gradient conversion band (primary/secondary CTAs).
- `CheckList` / `IconBadge` — bullet and icon helpers.

### 4.3 Signature patterns

- **Glass navbar** with backdrop blur + scroll shadow + top scroll-progress bar.
- **Mega-dropdown menus** with centered alignment, hover-open (hover-capable devices only),
  staggered card entrance animations, and a right-hand **featured media panel**.
- **Gradient text** (`mc-grad-text`) on headlines; **gradient brand buttons** with a
  repeating sheen sweep (`mcShine` keyframe, Zylvoo-style).
- **Dash preview frames** (`DashFrame`) showing real product screenshots as proof.
- **KPI stat bands** with animated counters and gradient numbers.
- **Trust bands, guarantee bands, newsletter bands** for conversion.
- **Reveal-on-scroll** everywhere with staggered delays.
- **Skeleton loading** per page variant for a polished first paint.

---

## 5. Recent Work — Design Refinement (this session, 2026-08-13)

Scope: raise the polish of the two highest-traffic marketing surfaces — the **Services**
page/dropdown and the **Pricing** page — toward enterprise agency quality.

### 5.1 Services page (`pages/Services.jsx`) — hero rebuild

- Rebuilt the page hero:
  - New `mc-badge-pill` badge ("Software • AI • Automation") above the headline.
  - Larger gradient `mc-hero-title` with a `mc-grad-text` span.
  - Subhead line, two CTAs (primary "Request a Quote" → `/website/contact`, secondary
    "Explore the process" → `/website/process`).
  - Right-hand **hero asset panel** showing a live `DashFrame`-style product screenshot with
    an interactive stats card, plus a `<Skeleton variant="stats">` fallback while the image
    loads (covers the pre-existing blank/stretched image issue).
- Added a **delivery stats strip** (`mc-slab-tight` + `mc-stats` band) above "How we deliver":
  - 8 services … delivery categories, products shipped, client count, AI integrations —
    using `Counter` animations, split into 4 KPI tiles with `FiGrid` / `FiPackage` /
    `FiUsers` / `FiCpu` icons.
- Kept the filter tabs (8 categories + "All Services") and the category header cards;
  service cards (`mc-svc-card`) now include a category pill + "Explore" link.

### 5.2 Services page — quote form redesign (`components/ServiceComponents.jsx`)

Replaced the old flat form with a field-system form:
- New `Field` wrapper using the app-wide `.mc-field` + `.mc-form-row` pattern (used across
  the site for consistent styling) — no more bare `<label><input class="mc-field">`.
- **Required markers** (`mc-req` `*`), `required` + HTML5 validation (name, email, service, message).
- **Budget range** uses a custom select (`mc-select-wrap` with chevron arrow) instead of a plain `<select>`.
- **Success state upgrade:** icon ring (`mc-f-icon-ring` with `FiCheck`), confirmation
  headline, personal message ("Thanks, {name}"), a **3-step "what happens next"** list, and a
  "Send another request" reset button.
- Form-card header now includes a gradient **"Free" badge** (`mc-ai-formcard-badge`).
- New form note with `FiLock` ("NDA-friendly · No obligation · Reply within one business day").

### 5.3 Services dropdown — featured image panel (`components/Navbar.jsx`)

- Replaced the small horizontal brochure-strip (`mc-drop-media.mc-brochure`, 78×58 thumb)
  in the Services mega-menu with a **full-height featured panel** (`mc-drop-panel`):
  - Background image (workflow dashboard) with a layered dark gradient + brand radial glow.
  - Eyebrow tag pill ("Full services catalog"), bold headline ("Everything we ship, in one
    brochure"), and a description line powered by live counts
    (`{allServices.length} services across {serviceCategories.length} categories`).
  - White **"Download brochure"** CTA button (gradient hover lift), which streams the PDF via
    `ServicePdf.js`; loading spinner state + "Saved to downloads" success state.
  - Panel stretches to the dropdown height (`grid align-items: stretch`), body anchored to the
    bottom for a premium editorial look.

### 5.4 Pricing page — full detailed pricing for every service & product (`pages/Pricing.jsx`)

The pricing page was expanded from 8 guide links + a basic table into a **complete price
catalog**:
- Replaced the plain 4-column table (Feature | MVP Sprint | Growth System | Enterprise Partner)
  with a **professional enterprise-grade comparison matrix** (see §6.6).
- Added a **Products & platforms** section with **detailed 3-tier pricing for each of the 5
  products** (ManageCore, AMS, EDUS, DMS, HRMS) — see §6.3.
- Added a **service price catalog** covering **every service** (60+) grouped by category, each
  with Starter / Growth / Enterprise pricing — see §6.7.
- Added a **price engine** (`serviceTierPricing()` in `pricingData.js`) that resolves real
  indicative prices from per-category bands + per-service overrides, and wired it into the
  service package cards (`ServiceComponents.jsx`) and the brochure PDF (`ServicePdf.js`) so the
  old `[Edit — e.g. $2,500]` placeholders no longer appear anywhere.
- Verified: eslint clean; `npm run build` passing.

---

## 6. Pricing Page — Everything in Detail

Route: `/website/pricing` (`pages/Pricing.jsx`). The page is built from top to bottom as:

### 6.1 Page hero (`PageHero`)
- Crumbs (Pricing), eyebrow chips: **No hidden fees · Scope-first · Fixed milestones**.
- Headline: *"Packages for every stage of growth"* (gradient span).
- Lede: transparent starting points, custom scoping confirmed after discovery.

### 6.2 Plan cards (`mc-grid-3` from `siteData.pricing`)
Three responsive plan cards with icons/CTA per plan:
| Plan | Cost | Tag | CTA |
|------|------|-----|-----|
| **MVP Sprint** | From $3k | — | Start Project |
| **Growth System** | From $8k | "Most chosen" | Book a Demo |
| **Enterprise Partner** | Custom | — | Talk to a Consultant |

Each card: `mc-tag` ribbon on the featured plan, `mc-who` audience line, gradient `mc-cost`,
`FiCheck` item list, note line, and a full-width CTA button (primary gradient on the featured
plan, ink on the others). Reveal-animated with staggered delays.

### 6.3 Products & platforms — detailed pricing (`mc-product-price-*`)
Every built product (`coreProducts`: ManageCore Platform, AMS, EDUS, DMS, HRMS) now shows its
own **detailed 3-tier pricing** block:
- **Product header row**: gradient icon tile, category kicker, product title + tagline, and a
  "Product details →" link to `/website/products/:slug`.
- **3 tier cards** (reusing `.mc-price`): Starter → Growth (featured, "Most popular") →
  Enterprise (Custom); each with audience line, gradient price, price note, `FiCheck` feature
  list, and full-width CTA.
- Pricing per product (indicative): ManageCore from $8k/$15k, AMS from $6k/$12k, EDUS from
  $7k/$14k, DMS from $5k/$10k, HRMS from $8k/$16k (Enterprise = Custom for all).
- Prices are stored on each product object in `productsData.js` (`product.pricing`).

### 6.4 Pricing factors (`mc-grid-3`, `siteData.pricingFactors`)
6 cards describing what is reviewed before a proposal: modules & workflows, users &
organization, data migration, integrations, deployment, training & support — each with a
colored icon tile (`FiGrid`, `FiUsers`, `FiDatabase`, `FiLink`, `FiCloud`, `FiSettings`).

### 6.5 Pricing by service (`mc-grid-4`, `pricingData`)
A 4-column grid of **8 pricing-detail link cards** (Software Development, Web Development,
Mobile App Development, AI Development, AI Automation, SEO, Digital Marketing, Google Ads).
Each card shows the service name, headline, the mid-tier starting price in gradient, a price
note, and a "View pricing →" link to `/website/pricing/:slug`.

### 6.6 Enterprise comparison table (`mc-compare-*`) — the centerpiece
A full-width, horizontally scrollable comparison matrix comparing the three packages:

- **Sticky first column** (`mc-compare-feature`) keeps row labels visible while scrolling.
- **Tier header cells** (`mc-compare-tier`): gradient icon tile, bold name, "who it's for"
  line, gradient price, and a full-width CTA button.
- **Featured column treatment**: "Growth System" gets a **brand-gradient header**, a white
  **"Most chosen" ribbon**, and a brand-tint background down the entire column body.
- **Row content**: 10 comparison rows across scope / build / support / commitment —
  Best for, Delivery model, Modules & interface, Integrations, Analytics & reports,
  Support & response, Security & compliance, Training, Typical timeline, Starting price.
- **Cell rendering**: included features get a **green check chip** (`mc-compare-tick`) + text;
  price cells use **gradient price text** (`mc-compare-price`); not-included cells use a muted dash.
- **Row hover** highlights the full row (including the sticky label column).
- **Note below**: "Prices are starting points — final scope, timeline and cost are confirmed
  after discovery" (alert band).

### 6.7 Service price catalog — every service, detailed (`mc-price-cat` / `mc-svc-price-*`)
The full pricing page now covers **all 60+ services**, grouped under their **8 service
categories** (`serviceCategories`):
- **Category chips** (`mc-cat-chip`): an anchor nav above the catalog — icon + category name,
  scrolling to each category's section.
- **Category blocks** (`mc-price-cat`): header with icon tile, category name, short description,
  and a "N services" count pill, followed by a 2-column responsive grid of service cards.
- **Service price cards** (`mc-svc-price`): service icon + name + headline, then the three
  **Starter / Growth / Enterprise** package rows — each showing the package name and its
  **gradient price + price note** (the Growth tier is highlighted as featured). Footer links to
  the service detail page and a "Get quote" CTA.
- **Price engine** (`serviceTierPricing()` in `pricingData.js`): every service's packages get
  real indicative prices resolved from per-category bands (e.g. software from $3k/$8k, AI from
  $3.5k/$9k, marketing per-month) with per-service overrides that match the 8 detailed
  `/pricing/:slug` guides and a fallback band. The same engine now powers the service package
  cards on detail pages and the brochure PDF, so `[Edit — …]` placeholders are gone site-wide.
- Note below: "Prices are indicative starting points per package — confirmed after discovery."

### 6.8 Interface previews (`DashFrame`)
3 screenshot frames with `SectionHeader` "The connected interfaces your teams actually use":
Management reporting, Financial reports, Inventory control — proving the product, not just the pitch.

### 6.9 CTA band (`CtaBand`)
"Plan the next step with confidence" — primary **Request a Proposal** (`/website/contact`)
and secondary **Book a Demo** (`/website/contact`).

### 6.10 Pricing detail pages (`pages/PricingDetail.jsx`)
Each `/website/pricing/:slug` page renders tiers, what's included, factors that shape the
quote, and a conversion band from `pricingData.js`.

---

## 7. Current Status

- `npm run lint` / eslint: **clean** for `src/pages/company`.
- `npm run build`: **passing** (~30s website-react; ~1m15s frontend, only pre-existing chunk-size warnings).
- Branding, dropdowns, services, products, industries, pricing, compare, blog, careers,
  support, demo, contact, FAQ, legal: all pages render and are routed.
- Live API integrations: brochure PDF (client-generated), chatbot (front-end only), newsletter
  forms (front-end state). No backend CMS/API for marketing content yet — all content is static data.

## 7a. Premium Review Form (v2.5)

The **Reviews** page (`pages/Reviews.jsx`, route `/website/reviews`) has a two-column intake:
a left dark gradient info/assurance column and a right **`.mc-review-form-panel`** that was
rebuilt to a premium, sectioned form (applied in both `manage-core-website-react` and
`manage-core-frontend`):

- **Panel chrome**: gradient top accent bar (`::before`), icon-tile header
  (`.mc-review-form-head-icon`), kicker + headline + helper copy, and a **pulsing live status
  pill** (`.mc-review-status i` + `mc-pulse-dot` keyframe).
- **Numbered section cards** (`.mc-review-sec`, `.mc-review-sec-n`): **01 About you**
  (name / role / company / email) and **02 Your experience** (solution select, star rating,
  review textarea). Cards get a brand-tinted focus ring on `:focus-within`.
- **Icon-prefixed inputs** (`.mc-input-wrap`): Feather icons (`FiUser`, `FiBriefcase`,
  `FiHome`, `FiMail`, `FiLayers`) that tint brand on focus; padded-left fields.
- **Interactive 1–5 star rating** (`.mc-rating-star`): gradient-filled active stars with glow,
  hover lift, and a text label (`ratingLabels`); radio-group semantics.
- **Textarea + live char counter**: `{len} / 500`, turns `var(--danger)` at the cap.
- **Consent card** (`.mc-review-consent`): bold title + body, custom checkbox, focus highlight.
- **Submit row**: full-width primary button (`FiSend`) + `FiLock` "Stored privately until
  approved" note; dashed top separator.
- **Dark mode**: full `.mc-root[data-theme="dark"]` override set (panel, sections, inputs,
  rating, consent, status pill). Responsive: stacks to one column ≤980px, header collapses ≤640px.

## 7b. Premium Brochure and Dropdown Centering Updates (v2.6)

- **Cover Page Redesign (Zylvoo Style)**: Built a premium dark-themed Cover Page for the company overview brochure (`slate-900` dark background, vertical brand accent borders, geometric corner lines, high-contrast title typography, and core solutions cards).
- **Service PDFs Layout Upgrades**: Rebuilt service brochures with `20mm` balanced margins, elegant left border accent blocks on sections, soft plain dividers instead of boxy table borders, and custom cell paddings.
- **Dynamic Headers & Footers**: Replaced static header/footer placement with a dynamic page loop applying headers/footers to all content pages (while skipping the cover page) and outputting page numbers in `Page X of Y` format.
- **Navbar Dropdown Position Alignment (React 19 Compatibility)**: Fixed a bug where dropdown menus for Company and Products started from the left side instead of centering. Added `mc-drop-center` class matching Industries/Services, and explicitly appended the `px` unit in the style binder to resolve React 19 unitless style omissions.

## 8. Remaining Tasks (website)

- [x] ~~Reviews page: premium review submission form~~ (v2.5 — star rating, sectioned cards, icon inputs, char counter)
- [ ] Services page: apply the same hero/stat polish to the lower sections (deliverables,
      process, FAQ) — currently more basic than the top of the page.
- [ ] Home page: verify hero asset panel consistency after the Services hero rebuild.
- [ ] Products / Solutions pages: add the `mc-drop-panel`-style featured blocks where useful.
- [ ] Pricing: add a monthly/one-time billing toggle (mock) if requested.
- [ ] Contact + Demo: wire the quote/contact forms to the backend (currently front-end only),
      and add validation + honeypot + rate limiting.
- [ ] ChatBot: connect to the working AI SSE backend (OpenRouter proxy) for live answers.
- [ ] Newsletter + footer forms: persist submissions to the backend.
- [ ] Preloader: reduce `minMs` / add skip for returning visitors.
- [ ] i18n for the marketing site (admin SPA already supports 5 languages).
- [ ] Add OG social images (can reuse `og/pages/*.webp` from the Xovo reference).
- [ ] Reduce bundle: code-split pages, lazy-load the chatbot + heavy icons.
- [ ] Accessibility pass: focus states, ARIA on mega-menus/accordions, reduced-motion
      verification, contrast audit.
