# Manage Core — Company Website (React / Vite)

Standalone **React 19 + Vite 6 + React Router 7** marketing site for Manage Core.

| Project | Stack | Port | Purpose |
|---------|-------|------|---------|
| **`manage-core-website-react`** | React 19 + Vite 6 | **3001** | Standalone company website |
| `manage-core-frontend` | React 19 + Vite 8 | 8061 | Full ERP/dashboard + embedded company site |

## Quick start

```bash
cd manage-core-website-react
npm install
npm run dev        # http://localhost:3001
npm run build      # outputs to ../manage-core-backend/public/
npm run preview
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 6.2 (`@vitejs/plugin-react`) |
| Routing | react-router-dom 7.13 |
| Styling | Vanilla CSS (custom design system, no Tailwind) |
| CSS framework | Bootstrap 5.3.8 (isolated usage) |
| Icons | react-icons 5.7 (Feather icons) |
| PDF | jspdf + jspdf-autotable |
| Dev server | Port 3001 |
| Build output | `../manage-core-backend/public/` |

## Project structure

```
src/
├── components/          # Shared UI components
│   ├── SitePrimitives.jsx   # Reusable animations (Reveal, Tilt, Magnetic, Scrub, Marquee, etc.)
│   ├── SiteTheme.jsx        # Light/Dark theme context provider
│   ├── Navbar.jsx           # Main navigation
│   ├── Footer.jsx           # Site footer
│   ├── ChatBot.jsx          # ChatBot widget
│   ├── Seo.jsx              # Client-side SEO meta
│   └── ServiceComponents.jsx
├── pages/               # 50+ route-driven pages
│   ├── Home.jsx             # Main landing page
│   ├── About.jsx            # About pages (7 sub-pages)
│   ├── Services.jsx         # Services + detail pages
│   ├── Products.jsx         # Products + agent detail pages
│   ├── Solutions.jsx        # Solutions pages
│   ├── Industries.jsx       # Industry pages
│   ├── CaseStudies.jsx      # Case studies
│   ├── Pricing.jsx          # Pricing pages
│   ├── Blog.jsx             # Blog posts
│   ├── Careers.jsx          # Career pages
│   ├── Contact.jsx          # Contact / Demo
│   └── ... (50+ pages)
├── data/                # Static data modules
│   ├── siteData.js          # Stats, testimonials, products, AI agents, blog
│   ├── servicesData.js      # All service definitions
│   ├── industriesData.js
│   ├── comparisonData.js
│   ├── pricingData.js
│   ├── productsData.js
│   ├── resourceData.js
│   ├── navData.js
│   └── aboutData.js
├── styles/              # Design system
│   ├── site.css             # Master CSS (10,000+ lines, full design system)
│   ├── preloader.css
│   ├── skeleton.css
│   └── fonts-bridge.css
└── public/images/       # Static assets
```

## Design system

The site uses a custom CSS design system defined in `site.css` with CSS custom properties:

- **Brand**: `#4778f3` (blue) with purple accent `#7c5cff`
- **Dark mode**: Full dark theme via `[data-theme="dark"]`
- **Typography**: Space Grotesk + Urbanist (Google Fonts)
- **Animations**: Custom primitives (Reveal, Tilt, Magnetic, Scrub, Marquee, MorphBlob, etc.)
- **Responsive**: Mobile-first breakpoints at 480px, 700px, 768px, 860px, 980px, 1080px

## Pages and routes

Clean client-side paths:

- `/` — Home
- `/about` — About (7 sub-pages: approach, leadership, mission, story, values, why-choose-us)
- `/services`, `/services/:slug` — Services + detail pages
- `/products`, `/products/:slug` — Products + AI agent details
- `/solutions`, `/solutions/:slug` — Solutions
- `/industries`, `/industries/:slug` — Industry pages
- `/case-studies`, `/case-studies/:slug` — Case studies
- `/pricing`, `/pricing/:slug` — Pricing
- `/blog`, `/blog/posts/:id` — Blog
- `/careers`, `/careers/:slug` — Careers
- `/contact`, `/demo` — Contact / Demo
- `/compare`, `/compare/:slug` — Comparison pages

## Key features

- **Client-side SEO** via `Seo.jsx` (SPA)
- **Light/Dark theme** toggle with `SiteTheme.jsx` context
- **Responsive design** — fully responsive across all breakpoints
- **Accessible** — ARIA labels, reduced-motion support, semantic HTML
- **Performance** — lazy-loaded images, code-split pages, preloader

## Sync from ERP frontend

After updating the company site in `manage-core-frontend`, refresh this copy:

```bash
node scripts/setup-from-frontend.mjs
```

This copies pages, components, data, styles, and `public/images/`.

## Notes

- Images live in `public/images/`.
- ERP app at `manage-core-frontend` is unchanged.
- Build output goes to `../manage-core-backend/public/` for Laravel serving.

## Recent changes (site.css)

### Atomic Enterprise Design — Orbit node spacing
- Increased `--orbit-r` from 218px to 230px for better node-to-core spacing
- Node label offset increased from `top: -40px` to `-44px`
- Node label padding increased from `4px 10px` to `6px 12px`
- Mobile (720px): `--orbit-r` increased from 120px to 126px
- Mobile (420px): `--orbit-r` increased from 104px to 108px

### "Five capabilities orbiting one plan" section
- `.mc-orbit-ring-outer` inset changed from 12% to 10%
- `.mc-orbit-ring-inner` inset changed from 21% to 22%
- `.mc-orbit-ring-core` inset changed from 30% to 32%
- `.mc-orbit-center` width/height reduced from 30% to 28%
- `.mc-orbit-node` padding increased from `8px 16px` to `8px 18px`
- `.mc-orbit-node` border opacity reduced from 0.28 to 0.22
- `.mc-orbit-cap` padding updated to `1.25rem 1.5rem` (added side padding)
- `.mc-orbit-cap-num` font-size increased from 10.5px to 11px
- `.mc-orbit-cap-label` got `margin-bottom: 4px; display: block`

### Case Studies — "Results that speak for themselves"
- `.mc-cs-card-new` added `border: 1px solid rgba(0,0,0,0.06)` for subtle card border
- `.mc-cs-card-metric` font-size increased to `clamp(3rem, 5.5vw, 5rem)`
- `.mc-cs-card-metric` letter-spacing tightened to -0.05em
- `.mc-cs-card-new h3` font-size increased to 1.05rem with -0.01em letter-spacing
- `.mc-cs-card-link` font-size increased to 13.5px with -0.01em letter-spacing
- `.mc-cs-results-head h2` letter-spacing tightened to -0.04em
- `.mc-cs-results-head p` color muted to 0.55 opacity
- `.mc-cs-results-cta` changed from pill (border-radius: 999px) to rectangular (14px), padding adjusted to 16px 28px
