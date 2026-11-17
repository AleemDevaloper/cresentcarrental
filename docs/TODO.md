# TODO

## Done

- [x] Expand public content pages (services detail, reviews, requirements, legal) and fix Breadcrumb crash.
- [x] Implement shared animation system covering the 16 required motion patterns.
- [x] Harden SEO (sitemap, robots, per-page meta/JSON-LD, indexable privacy/terms).
- [x] Improve README/docs with admin login flow and animation usage.
- [x] Verify production build (`npm run build`).
- [x] Premium button interaction system (`buttons.css` + `Button` component, loading/success, magnetic CTAs).
- [x] Custom cursor (desktop fine-pointer only), horizontal overflow-x guard, remove admin login 419 "Session expired" path.
- [x] Fix admin login 419 CSRF — frontend pointed at port 8080 (XAMPP Manage Core) instead of Crescent API on 8000.
- [x] Polish service benefit cards (shine/glow/index bar), remove top breadcrumb on marketing + service detail, add glowing footer “Crescent” wordmark.
- [x] Stabilize admin dashboard: fix `AdminCollectionManagerPage` import crash, add loading/empty/error states, dedicated Reports page, per-tab field configs, `pricing` → `pricing-rules` endpoint, admin form/table CSS.
- [x] Move WhatsApp FAB below the back-to-top button.
- [x] Add crisp per-character Crescent footer animation inspired by the ManageCore footer.
- [x] Add Security, Accessibility and Sitemap pages.
- [x] Add first-party page, CTA, button and blog-read tracking.
- [x] Add protected admin analytics endpoint and Website Analytics dashboard.

## Pending

- [ ] Install Composer dependencies and run full Laravel framework boot test if not already done in the environment.
- [ ] Add production vehicle photography and AVIF/WebP variants.
- [ ] Configure transactional email provider and customer/admin mail templates.
- [ ] Add queued notification channels for future WhatsApp/SMS integration.
- [ ] Implement media conversion jobs and image focal-point controls.
- [ ] Add rich blog editor and preview.
- [ ] Add CSV/PDF reporting exports if required operationally.
- [ ] Add payment gateway adapters only when a gateway is selected.
- [ ] Add comprehensive PHPUnit/Pest API tests and Playwright E2E tests.
- [ ] Add admin role/ability middleware and global 401 redirect for stale tokens.
- [ ] Run WCAG, Lighthouse and Core Web Vitals audit after deployment.
- [ ] Run `php artisan migrate` for `website_analytics_events`.
- [ ] Add analytics consent, retention policy and admin export controls before production marketing campaigns.
- [x] Start Phase 2 from `docs/SECOND_PHASE_SPEC.md`: dashboard KPI/chart foundation, booking operations workspace and dynamic fleet management are implemented.
- [ ] Add fleet maintenance and inspection management screens.
- [ ] Add CRM lead follow-up workspace and report exports.
- [ ] Add role-specific permission controls and bulk actions.
