# Project Memory

## Identity
Crescent Car Rental — “Drive Your Next Story.” — crescentrentacar.com

## Product intent
This is a complete digital car-rental platform, not a static brochure website. The customer experience, fleet, availability, pricing, bookings, inquiries and admin CMS are API/database driven.

## Visual system
Premium automotive/luxury direction: black/deep charcoal base, Crescent red accents, white/metallic grey typography, large vehicle visuals, controlled motion, editorial layouts, strong whitespace and fast page loads.

## Architecture
- React/Vite frontend.
- Laravel REST API.
- MySQL.
- Sanctum-compatible token authentication for administration.
- Thin controllers, service-layer pricing/availability/booking logic.
- Versioned API at `/api/v1`.

## Core invariants
1. A vehicle cannot have overlapping active bookings.
2. Pricing is calculated server-side.
3. Dynamic content is not permanently hardcoded in React.
4. Admin changes are auditable.
5. Important conversion CTAs are trackable.
6. Accessibility and reduced-motion are first-class requirements.
7. Public visitor analytics and authenticated admin audit logs remain separate concerns.
8. Analytics metadata must never contain secrets, payment data, identity documents or unrestricted form payloads.

## Animation system
Shared module at `frontend/src/animation/` (`Reveal`, `Stagger`, `TextReveal`, `ImageReveal`, `Parallax`, `Counter`, `useInView`) + `frontend/src/styles/animations.css`. HomePage continues to use GSAP ScrollTrigger for its cinematic sections; do not double-wrap the same elements with both GSAP and `Reveal`. Always respect `prefers-reduced-motion`.

## Button system
- CSS: `frontend/src/styles/buttons.css` (single source for hover/active/focus/loading/shine on `.btn`).
- Component: `frontend/src/components/Button.jsx` — map existing classes (`btn btn-{variant} btn-{size}`); do not invent new color variants without brand review.
- Magnetic only on desktop fine pointer when `magnetic` prop is set; max ±4px.
- Forms use `loading={isSubmitting}` to block double submit.

## Admin auth (frontend)
Token key: `crescent_admin_token`. Login: POST `/api/v1/admin/login` (throttle 6/min). Guard: token presence only in `App.jsx` — no role check yet. Stale token can show empty dashboard until 401 handling is added. Do not reintroduce 419/"Session expired" messaging — auth is bearer-token only (no CSRF/session).

**Local API port:** `http://127.0.0.1:8000/api/v1` (`VITE_API_BASE_URL` in `frontend/.env`). Port `8080` is often Apache/XAMPP serving another project — pointing Crescent there yields `419 CSRF token mismatch` on admin login. After changing frontend `.env`, restart Vite.

## Custom cursor & overflow
- Cursor: `frontend/src/components/CustomCursor.jsx` + `styles/cursor.css` — only when fine pointer + no reduced-motion; `html.has-custom-cursor` hides native cursor.
- Horizontal scroll guard: `html, body { max-width: 100%; overflow-x: hidden }` in `theme.css`; keep `.cinematic-marquee` clipped.

## UI polish (2026-09-24)
- Benefit cards: `.benefit-card*` in `theme.css` + markup in `ServiceDetailPage` (index, shine, glow, red bar). Reduced-motion must stay color/border only.
- Breadcrumbs: visual breadcrumb removed from marketing pages and service detail only; keep `Breadcrumb` on Services/Cars/Contact/Blog/etc. for SEO/nav.
- Footer wordmark: `Footer.jsx` renders `CRESCENT` as individual `.footer-wordmark-char` spans with staggered neon animation, a sweep rail and fog layers. Keep the wordmark crisp at rest, decorative (`aria-hidden`) and reduced-motion safe.

## Admin dashboard conventions (2026-09-25)
- Most CMS tabs render through `AdminCollectionManagerPage.jsx` — it must keep loading/empty/error states and tolerate both plain arrays and Laravel paginators (`data.data ?? data`). Never assume a fixed shape.
- `GET /admin/reports`, `/admin/notifications`, `/admin/activity`, `/admin/pricing` return **objects or GET-only collections** — Reports has its own page (`AdminReportsPage.jsx`); notifications/activity/media run `readOnly` (no write actions).
- Writable pricing rules live at `pricing-rules`; the `pricing` utility route is read-only.
- All admin field lists live in the route definitions in `App.jsx` — keep them in sync with backend model columns.
- Website Analytics is a separate admin route at `/admin/analytics`; public automatic tracking must remain disabled for `/admin/*`.

## Website analytics invariants (2026-09-25)

- The frontend sends validated events to `POST /api/v1/analytics/events`.
- The browser session identifier is stored in `sessionStorage`; it is not an authentication credential.
- Current event names are `page_view`, `cta_click`, `button_click` and `blog_read`.
- Server aggregation currently covers a rolling 30-day window.
- The backend records server-observed user agent/IP values; production retention and consent policy still require an explicit decision.
- `website_analytics_events` is not a substitute for `activity_logs`: public behavior and admin mutations must not be mixed.

## Floating actions
- Back-to-top: `.back-to-top` at `bottom: 90px`; WhatsApp FAB: `.whatsapp-fab` at `bottom: 28px` — **the WhatsApp icon must stay below back-to-top** (both in `theme.css`, mounted in `PublicLayout`).
