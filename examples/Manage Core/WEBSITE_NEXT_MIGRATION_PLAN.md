# Manage Core Website — React → Next.js Migration Plan

**Source (preserved):** `manage-core-frontend/src/pages/company/site/`  
**Target (new):** `manage-core-website/` (sibling project — existing Vite app untouched)  
**Date:** 2026-08-13

---

## Goals

| Goal | Approach |
|------|----------|
| SEO crawlable HTML | App Router + Server Components + Metadata API |
| Preserve design | Reuse `site.css`, assets, data, layout structure |
| Preserve UX | Theme, animations, forms, chatbot, mega-menu |
| Performance | `next/image`, `next/font`, split Client Components |
| SEO equity | 301 redirects `/website/*` → `/*` |

---

## Audit summary

| Item | Finding |
|------|---------|
| Pages | 36 route pages |
| Data modules | 8 files (~31 services, 11 agents, 8 posts, …) |
| Site deps | `react-icons`, `jspdf`, `jspdf-autotable` |
| Forms | Client-only mock (no backend) |
| SEO today | Runtime `Seo.jsx` only — not crawlable |
| Theme | `mc-theme` localStorage + `.mc-root[data-theme]` |

---

## Reuse / modify / replace

### Reuse directly
- `site.css`, `preloader.css`, `skeleton.css`
- All `*Data.js` content (with import path fixes)
- Image assets under `assets/company/`
- Visual design tokens, class names (`mc-*`)
- ChatBot rule KB, ServicePdf brochure logic
- Form UX (local success states)

### Modify
- `Link` / `NavLink` / `useNavigate` / `useParams` / `useLocation` → Next.js equivalents
- Asset imports → `public/` or `next/image`
- Page shells → Server Components where possible
- Interactive islands → `"use client"`
- Theme: add anti-flicker script in root layout
- Internal links: `/website/...` → `/...`

### Replace
- `react-router-dom` → App Router
- `Seo.jsx` document mutation → `metadata` / `generateMetadata`
- Google Fonts `<link>` → `next/font`
- `<img>` LCP/hero → `next/image` (priority)

### Optimize
- Remove 1800ms forced preloader gate (or shorten for SSR)
- Lazy third-party (none today except fonts/bootstrap CDN — drop Bootstrap CDN for marketing site)
- Static generation via `generateStaticParams` for all slug pages
- Sitemap + robots.txt

### SEO risks to fix
- Placeholder domain `managecore.example` → env `NEXT_PUBLIC_SITE_URL`
- Missing meta on tickets, legal, blog posts, case studies, careers
- Client-only content for H1/body

### Performance risks to fix
- Entire pages as Client Components
- Huge CSS monolith (keep for design parity; split later)
- Unoptimized images
- Forced long preloader

---

## URL mapping

| Old | New |
|-----|-----|
| `/website` | `/` |
| `/website/services` | `/services` |
| `/website/services/:slug` | `/services/[slug]` |
| `/website/blog/posts/:id` | `/blog/[slug]` (prefer slug) + redirect from id |
| `/company/*`, `/home` | `/` or matching path |
| `/website/:path*` | `/:path*` (301) |

---

## Architecture (target)

```
manage-core-website/
  app/
    (marketing)/
      layout.tsx
      page.tsx
      about/...
      services/...
      ...
    sitemap.ts
    robots.ts
    not-found.tsx
  components/          # client islands + shared UI
  lib/
    data/              # copied *Data.js
    seo.ts
    site.ts
  public/
    images/company/
    og/
  next.config.ts
  MIGRATION_PLAN.md
```

---

## Execution phases

1. Scaffold Next.js (TS, App Router) — **done next**
2. Copy CSS + assets + data
3. Theme layout + Navbar/Footer client islands
4. SEO helpers + sitemap + robots + JSON-LD
5. Port all pages (static then dynamic)
6. Redirects + env + build validation

---

## Non-goals (this migration)

- Do not redesign brand/UI
- Do not migrate Manage Core ERP/dashboard app
- Do not invent fake backend APIs for forms
- Do not delete `manage-core-frontend` company site until Next site is verified
