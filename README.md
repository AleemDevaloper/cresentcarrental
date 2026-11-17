# Crescent Car Rental — Full-Stack Platform

Production-oriented implementation for **Crescent Car Rental** — *Drive Your Next Story.*

## Contents

- [Included](#included)
- [Brand](#brand)
- [Project structure](#project-structure)
- [Quick start](#quick-start)
- [Static deployment](#static-deployment)
- [Admin dashboard](#admin-dashboard)
- [Admin login flow](#admin-login-flow)
- [API](#api)
- [Animations](#animations)
- [Custom cursor](#custom-cursor)
- [Button system](#button-system)
- [Floating actions](#floating-actions)
- [Documentation](#documentation)
- [Production notes](#production-notes)

## Included

- Premium React + Vite customer website with responsive automotive UI.
- Animated landing experience: fade/slide/scale reveals, staggered cards, parallax, counters, text/image reveals (see `frontend/src/animation/`).
- Service detail benefit cards with hover shine/glow; marketing + service-detail pages omit the top breadcrumb (hero sits under the navbar); footer shows a large glowing "Crescent" wordmark.
- Dynamic fleet browsing and car detail flows.
- Availability search, transparent pricing, booking submission, confirmation flow.
- Contact and lead capture.
- Full public SEO page set: about, services (9 detail pages), locations, pricing, FAQ, blog, reviews, rental requirements, privacy, terms, security, accessibility, sitemap, wedding/self-drive/outstation/airport pages.
- Laravel REST API with Sanctum-ready token auth (admin dashboard login).
- MySQL schema covering vehicles, pricing, bookings, customers, leads, contacts, CMS, SEO, media settings, activity and status history.
- Admin dashboard for bookings, fleet, contacts, content, reports, settings and first-party website analytics.
- SEO foundations: per-page meta/JSON-LD, sitemap.xml, robots.txt (admin blocked), Open Graph tags.
- Documentation and deployment notes.

## Brand

| Key | Value |
|---|---|
| Website | `crescentrentacar.com` |
| Phone | `+92 300 6277997` |
| Email | `info@crescentrentacar.com` |
| Address | DHA Phase 1, Block H, Commercial Area, Lahore |
| Hours | 24/7 |
| Tagline | **Drive Your Next Story.** |
| Founded | 2018 |
| Visual system | Black/deep charcoal + Crescent red, white/metallic grey |

## Project structure

```text
frontend/  React + Vite customer/admin app
backend/   Laravel REST API source scaffold
preview/   zero-dependency visual homepage preview
docs/      implementation memory, API, schema, deployment and status notes
```

## Quick start

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |

Set `VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1` for local API access (matches `php artisan serve`). Do **not** point the frontend at port `8080` unless Crescent is the app bound there — on many machines `8080` is already Apache/XAMPP serving another project (that causes `419 CSRF token mismatch` on login). Restart Vite after changing `.env`.

## Static deployment

The customer site and admin demo can run without Laravel:

```bash
cd frontend
npm install
npm run build
# deploy the contents of dist/
```

- `.env.production` sets `VITE_STATIC_MODE=true`; the bundled static API handles catalogue, availability, bookings, contact, analytics and admin flows.
- Static admin login: `admin@crescentrentacar.com` / `ChangeMe123!`. Demo data lives in the browser's localStorage, so each browser has its own copy.
- Vite uses a relative base and the app uses `HashRouter`, so `dist/` works at a domain root or a GitHub Pages project subpath.
- The included workflow `.github/workflows/deploy.yml` builds and publishes `frontend/dist` to GitHub Pages. Enable Pages with **GitHub Actions** as the source.
- Performance: fleet images are served as compressed WebP with 640px card variants, hero imagery is preloaded, and the WebGL scene loads only on capable desktops after the page is interactive.

To use a live Laravel API instead, build with `VITE_STATIC_MODE=false` and set `VITE_API_BASE_URL` to the deployed API URL.

### Backend

The backend is source-ready but PHP vendor dependencies are intentionally not bundled.

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Create a MySQL database named crescent_car_rental and update .env
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

## Admin dashboard

Single shared shell (`AdminLayout` + `AdminSidebar`) with collapsible grouped navigation:

| Group | Tabs |
|---|---|
| Overview | Dashboard (aggregated stats) |
| Operations | Bookings, Fleet, Customers, Contacts, Leads |
| Content | Services, Locations, Homepage Content, Blog, Media Library |
| Fleet Management | Brands, Categories, Features, Discounts |
| Growth | Reviews, FAQ, Pricing, SEO, Website Analytics |
| System | Notifications, Reports, Admin Users, Activity Logs, Settings |

Most CMS tabs render through one reusable manager — `frontend/src/pages/AdminCollectionManagerPage.jsx` — which provides loading/empty/error states, safe handling of paginated or non-array responses, and a side drawer form with add/edit/delete. Bookings use a dedicated operations workspace (`AdminBookingsPage.jsx`) with filters, detail editing, payment state, lifecycle timeline and internal notes. Vehicles use a dedicated fleet editor (`AdminVehiclesPage.jsx`) so administrators can create and update the exact cards, images, prices, availability and publish state consumed by the public fleet. Read-only tabs (Notifications, Activity, Media) hide write actions. Reports has a dedicated stats view (`AdminReportsPage.jsx`). Website Analytics has a dedicated dashboard (`AdminAnalyticsPage.jsx`) with KPI cards, traffic bars, top pages and top actions.

### ManageCore-inspired admin direction

The admin experience is being developed from the ManageCore AMS patterns found in `examples/Manage Core`:

- KPI cards for high-value operational numbers.
- Dashboard panels for trends and recent activity.
- Dense, responsive data tables with search, filters, status badges, pagination and row actions.
- Detail drawers for inspection and editing without losing table context.
- Explicit states for loading, empty data, errors and retry.
- Operational actions such as create, edit, archive/delete, export, refresh and status updates.
- Phase-two additions will extend this into saved views, bulk actions, audit history, export workflows, approvals and role-based access.

## Admin login flow

1. Open `/admin/login` on the frontend.
2. POST `/api/v1/admin/login` with email + password (+ optional remember).
3. Server validates, checks `is_active`, verifies hash, issues Sanctum token with `admin` ability.
4. Token stored as `crescent_admin_token` (localStorage if remember, else sessionStorage).
5. Axios interceptor attaches `Authorization: Bearer <token>` for `/admin/*` requests.
6. `AdminGuard` in `App.jsx` checks token presence and renders `AdminLayout` → dashboard (`GET /admin/dashboard`).

Auth is bearer-token only — there is no CSRF/session check on login (no 419 "Session expired" UI path).

Seeded admin rate limit: **6 login attempts per minute** per IP.

### Default seeded admin

For development only:

- Email: `admin@crescentrentacar.com`
- Password: `ChangeMe123!`
- Role: `super_admin`

Change this immediately outside local development.

## API

| | |
|---|---|
| Public prefix | `/api/v1` |
| Admin prefix | `/api/v1/admin` |
| Auth | Sanctum bearer token (`Authorization: Bearer <token>`) |

Full endpoint reference: [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md).

## First-party website analytics

Crescent records a minimal operational event stream in its own database. Public routes are tracked; `/admin/*` routes are intentionally excluded.

Tracked events currently include:

- `page_view` — route and page title.
- `cta_click` — links and navigation calls to action.
- `button_click` — button labels and actions.
- `blog_read` — blog slug and title.

Each event can include the route, session identifier, referrer, target label/href, content type/id, metadata, user agent and server-observed IP address. The event endpoint is rate limited and accepts only validated fields. The admin analytics screen aggregates the last 30 days into page views, unique sessions, CTA clicks, blog reads, top pages, top actions and daily traffic.

## Animations

Shared system lives in `frontend/src/animation/`:

| Export | Purpose |
|---|---|
| `Reveal` | fade/up/down/left/right/slide/scale/zoom on scroll |
| `Stagger` | staggered children cards via cloneElement + `--delay` |
| `TextReveal` | word-by-word masked text reveal |
| `ImageReveal` | clip-path image reveal |
| `Parallax` | rAF scroll parallax offset |
| `Counter` | eased count-up numbers |
| `useInView` | shared IntersectionObserver hook |

Styles in `frontend/src/styles/animations.css` (imported from `main.jsx`). Reduced-motion is respected via media query overrides.

## Custom cursor

- `frontend/src/components/CustomCursor.jsx` + `styles/cursor.css` (mounted in `App.jsx`).
- Desktop fine pointer only; off on touch and `prefers-reduced-motion`.
- Ring grows on links/buttons; native cursor hidden while active; text fields keep `cursor: text`.

## Button system

- **CSS layer**: `frontend/src/styles/buttons.css` — premium interactions on every `.btn` (lift, shine, icon nudge, press scale, focus rings, loading/success, outline wipe, reduced-motion/touch rules).
- **Component**: `frontend/src/components/Button.jsx`

```jsx
import Button from '../components/Button';

<Button variant="red" size="lg" loading={isSubmitting}>Book Now</Button>
<Button as="link" to="/book" variant="ghost" magnetic>View Fleet</Button>
<Button as="a" href="tel:..." variant="outline-light">Contact</Button>
```

| Prop | Values |
|---|---|
| `variant` | `red` \| `ghost` \| `outline-light` \| `outline-dark` \| `light` \| `dark` \| `whatsapp` |
| `size` | `sm` \| `md` \| `lg` |
| `as` | `button` \| `a` \| `link` |
| `loading` | spinner + disable (prevents double submit) |
| `success` | `true` or string label for success state |
| `fullWidth` | `.w-100` |
| `magnetic` | desktop fine-pointer micro-follow only |

Hierarchy: **Primary** = `btn-red` / `btn-light` (Book/Get Quote) · **Secondary** = `btn-ghost` / `btn-outline-*` (View/Explore) · **Tertiary** = `.text-link` (Learn More).

## Floating actions

Public pages include a futuristic site sidebar (`SiteSidebar.jsx`) opened from the navbar **Explore** button or the left-edge trigger, with primary/secondary navigation and quick contact actions. Mobile keeps the sidebar trigger above the bottom action bar.

Two fixed controls sit on the bottom-right of public pages (mounted in `PublicLayout`):

- **Back to top** (`BackToTop.jsx`, `.back-to-top`) — appears after 400px of scroll, sits at `bottom: 90px`.
- **WhatsApp** (`WhatsAppChat.jsx`, `.whatsapp-fab`) — directly below it at `bottom: 28px`.

`theme.css` owns both positions; keep the WhatsApp FAB under the back-to-top button if either value changes.

## Documentation

| File | Contents |
|---|---|
| [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) | Public + admin endpoint reference |
| [`docs/DB_SCHEMA_NOTES.md`](docs/DB_SCHEMA_NOTES.md) | Relational table groups |
| [`docs/DEPLOYMENT_NOTES.md`](docs/DEPLOYMENT_NOTES.md) | Production topology and checklist |
| [`docs/PHASE_STATUS.md`](docs/PHASE_STATUS.md) | Phase matrix and next steps |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Dated change history |
| [`docs/TODO.md`](docs/TODO.md) | Done / pending work |
| [`docs/PROJECT_MEMORY.md`](docs/PROJECT_MEMORY.md) | Architecture invariants and conventions |
| [`docs/UI_UX_REFERENCE_ANALYSIS.md`](docs/UI_UX_REFERENCE_ANALYSIS.md) | Design reference findings |
| [`docs/SECOND_PHASE_SPEC.md`](docs/SECOND_PHASE_SPEC.md) | ManageCore-inspired phase-two scope, workflows and acceptance criteria |

## Production notes

Use separate domains/subdomains or reverse-proxy paths for frontend and API, HTTPS only, production CORS rules, secure DB credentials, queue/mail configuration, backups, and a real image optimization pipeline. See [`docs/DEPLOYMENT_NOTES.md`](docs/DEPLOYMENT_NOTES.md).
