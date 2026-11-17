# Changelog

## 2026-09-25 - Admin dashboard stability pass + WhatsApp FAB position

- Fixed admin crash (`AdminCollectionManagerPage is not defined`) caused by a dropped lazy import in `App.jsx`.
- Rewrote `AdminCollectionManagerPage.jsx`: loading spinner, empty state, error banner, safe handling of paginated/non-array responses, read-only mode for Notifications/Activity/Media, drawer form with anti-double-submit.
- Added `AdminReportsPage.jsx` — dedicated stats cards for `GET /admin/reports` (endpoint returns an object, not an array, which previously broke the generic table renderer).
- Reworked admin routes/field configs in `App.jsx`: per-tab fields (customers, users, seo, media, activity, notifications), `pricing` now uses the writable `pricing-rules` endpoint (the `/admin/pricing` route is a read-only utility collection).
- Admin CSS in `theme.css`: table panel, drawer form, inputs, report cards, banners, spin keyframe.
- Moved WhatsApp FAB below the back-to-top button (`.whatsapp-fab` `bottom: 28px` vs `.back-to-top` `bottom: 90px`).
- README restructured (TOC, admin dashboard section, docs index, floating-actions note); API documentation expanded with all admin endpoints.

## 2026-09-24 - Benefit cards, breadcrumb removal, footer glow wordmark

- Upgraded service-detail `.benefit-cards` / `.benefit-card` in `theme.css` and `ServiceDetailPage` markup: numbered index, corner glow layer, one-shot shine sweep on hover, icon lift/ring, animated red underline bar, red title hover, deep red glow shadow; full `prefers-reduced-motion` fallback. Applies to daily rental (Flexible daily rates, Free delivery in Lahore, No hidden charges, 24/7 support, Well-kept vehicles) and all service details.
- Removed the top-of-page visual breadcrumb from marketing pages (`MarketingPages.jsx`) and from `ServiceDetailPage` (`Home / Services / …`) so the page hero sits directly under the navbar. Other index/detail breadcrumbs (Services list, Cars, Contact, Blog, etc.) kept.
- Footer (`Footer.jsx` + `theme.css`): large animated glowing “CRESCENT” wordmark above the footer grid — gradient sweep, red glow pulse, soft red halo; decorative (`aria-hidden`), static under reduced motion.
- `npm run build` passes.

## 2026-09-24 - Fix admin login 419 CSRF (wrong API port)

- Root cause: frontend `.env` pointed at `http://127.0.0.1:8080`, but port **8080** was Apache/XAMPP serving a **different** app (`Manage Core/manage-core-backend`). That app runs web/session middleware and returns `419 CSRF token mismatch.` Crescent's API was already running correctly on **port 8000** (`php -S 127.0.0.1:8000` + Laravel `server.php`) and returns **200** for `POST /api/v1/admin/login`.
- Fixed `frontend/.env` → `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1`.
- Fixed `frontend/src/services/api.js` fallback base URL to port `8000`.
- Fixed `backend/.env` `APP_URL` to `http://127.0.0.1:8000`.
- Admin login offline message now says port `8000`.
- README local API guidance corrected to port `8000` with a warning about XAMPP on `8080`.
- Note: restart Vite after changing `.env` so the new API base URL is picked up.

## 2026-09-24 - Custom cursor, horizontal overflow fix, login error cleanup

- Added `frontend/src/components/CustomCursor.jsx` + `src/styles/cursor.css`: desktop fine-pointer-only ring/dot cursor (grows on interactive hover, press state, text-field mode, hides native cursor while active). Off on touch and when `prefers-reduced-motion` is set. Mounted once in `App.jsx`.
- Fixed horizontal (x-axis) page scroll: `html, body { max-width: 100%; overflow-x: hidden }` in `theme.css`; hardened `.cinematic-marquee` with `max-width: 100%` and `contain: paint`.
- Removed admin login 419 "Session expired" branch in `AdminLoginPage.jsx` (API is token-based; no CSRF/session check path remains). Other status handlers (network, 422, 429, 5xx) kept.
- `npm run build` passes.

## 2026-09-24 - Premium button interaction system

- Added `frontend/src/styles/buttons.css`: global premium interaction layer for every `.btn` without redesigning variants — cubic-bezier transitions, ~2px lift + shadow, one-shot diagonal shine, trailing icon/arrow +5px nudge (no rotation), `:active` scale(0.97), focus-visible rings, disabled styles, loading spinner, success state, ghost/outline left-to-right wipe, tertiary `.text-link` arrow polish, icon-button focus styles, touch targets (44px), tablet calmer hover, no sticky hover on coarse pointers, full `prefers-reduced-motion` handling (color/border only).
- Added reusable `frontend/src/components/Button.jsx`: `variant` (red/ghost/outline-light/outline-dark/light/dark/whatsapp), `size` (sm/md/lg), `as` (button/a/link), `loading`, `success`, `fullWidth`, `magnetic` (desktop fine-pointer only, ±4px, respects reduced-motion).
- Removed duplicate hero-only shine and base `.btn` transition from `theme.css` (owned by `buttons.css`).
- Applied `Button` across: Navbar, hero, footer, vehicle cards, car detail, booking search, booking/contact/admin login (loading + success), admin settings/vehicles/collections (anti double-submit), marketing/content CTAs, confirmation, NotFound, ErrorBoundary, WhatsAppButton, mobile sticky Book.
- Admin vehicles drawer rewritten cleanly (fixed corrupted close control); save buttons now block double submit.
- Updated README, CHANGELOG, PHASE_STATUS, TODO, PROJECT_MEMORY.

## 2026-09-24 - Animation system, content overhaul, SEO hardening

- Added shared animation module (`src/animation/`): `Reveal`, `Stagger`, `TextReveal`, `ImageReveal`, `Parallax`, `Counter`, `useInView` covering all 16 required motion patterns (fade/up/down/left/right/slide/scale/zoom, scroll reveal, stagger, image reveal, parallax, hover lift/zoom, text reveal, counter).
- Added `src/styles/animations.css` with reduced-motion overrides; imported globally in `main.jsx`.
- Premium route loading screen (loader mark/rings/word/shine/bar) and global `ErrorBoundary` in `App.jsx`.
- Global IntersectionObserver for legacy `.reveal-*` classes on route change; Home keeps GSAP ScrollTrigger (no double-animation on story blocks).
- Rewrote `SimpleContentPages.jsx`: fixed missing `Breadcrumb` import (crashed About/Services/Pricing/FAQ); added service detail knowledge map (9 services), real FAQs/testimonials, Reviews page, Rental Requirements page, distinct indexable privacy/terms.
- Rewrote `MarketingPages.jsx`: wedding, self-drive, outstation page types; breadcrumbs; gallery with lightbox; Reveal/Stagger/TextReveal throughout.
- Rewrote `CarsPage`, `CarDetailPage`, `ContactPage` with SEO (ItemList/Product/ContactPage JSON-LD), breadcrumbs, skeleton loaders, premium panels.
- Upgraded `SectionHeading` (wrapped in Reveal), `Footer` (address/hours/real socials/more service links), `Navbar` (More dropdown + expanded mobile menu), `NotFoundPage` (Stagger/TextReveal), `AdminLayout` (noindex).
- Expanded `brandConfig.js`: founded year, address, hours, service areas, real socials, better default SEO.
- SEO: expanded `public/sitemap.xml` (all marketing/legal routes + lastmod), `robots.txt` (`Disallow: /admin`), BookingPage meta, better default OG image.
- Improved `README.md` with admin login flow, animation system docs, correct local API port guidance (8080).

## 2026-09-23 - Homepage flagship polish and setup fixes
- Upgraded homepage hero with premium metrics, animated scan line, availability card and cinematic marquee.
- Added a new "Crescent command flow" section showing the real booking platform journey behind the website.
- Rewrote "Special offers" and "Why Crescent" homepage copy to focus on car rental services, airport transfer, monthly rental, corporate travel and fleet trust.
- Tuned Lenis smooth scrolling to reduce sticky/janky scrolling and disabled it on touch/coarse devices.
- Connected Lenis scroll updates to GSAP ScrollTrigger so scroll animations stay synchronized.
- Fixed backend Composer install failure by adding Laravel's required `bootstrap/cache/.gitignore`.
- Removed duplicate XAMPP PHP OpenSSL loading warning by disabling the old `extension=php_openssl.dll` line after backing up `php.ini`.

## 2026-09-23 - Motors reference and old-site expansion
- Expanded the homepage with Motors-inspired rental sections: category quick search, featured vehicle carousel, special offers, brand search, trust panels, testimonials carousel, SEO topic links and FAQ preview.
- Added public marketing/SEO pages for offers, gallery, corporate rental, monthly rental, airport rental and chauffeur service.
- Added routes and sitemap entries for the new SEO pages.
- Improved homepage structured data with CarRental and WebSite schema graph.
- Added carousel-style horizontal scrolling content blocks without introducing heavy slider dependencies.

## 2026-09-23 - Second UI/UX polish pass
- Rebuilt the cars page into a clearer availability-aware fleet search experience with proof points and a premium intro panel.
- Reworked the booking page into a guided request flow with stronger hero messaging, reassurance cues and a premium quote panel.
- Reworked the contact page with clearer response expectations, improved contact methods and a more polished inquiry form.
- Upgraded the footer with a stronger conversion CTA, cleaner copy and better social/contact presentation.
- Added additional CSS polish for page heroes, elevated forms, empty states, vehicle hover states and mobile responsiveness.

## 2026-09-23 - UI/UX reference pass
- Reviewed provided homepage, cars, car-detail, about and FAQ reference mockups plus mirrored automotive template examples.
- Added curated local fallback fleet imagery from the examples folder.
- Reworked homepage fallback visuals so the hero, story section and empty-API fleet state feel more premium.
- Added deterministic fallback vehicle-card images while preserving admin/API media as the primary source.
- Added responsive visual refinements for the new hero image frame.
- Added `UI_UX_REFERENCE_ANALYSIS.md` documenting findings, current stage and remaining UX tasks.

## 2026-09-23 — Initial platform package
- Added premium customer-facing React/Vite website source.
- Added Laravel API architecture and MySQL schema.
- Added fleet, pricing, availability and booking services.
- Added admin dashboard source and CMS management foundations.
- Added supplied Crescent logo variants.
- Added SEO, analytics, WhatsApp/phone CTA foundations.
- Added project, API, schema and deployment documentation.
