# Manage Core Engineering Rules

These rules apply to `manage-core-website-react`, `manage-core-frontend`, and
`manage-core-backend`. Follow existing patterns first; keep exceptions small and documented.

## Change discipline

1. Inspect the related page, component, styles, route, API contract, and helpers before editing.
2. Make surgical changes and preserve user work. Never use destructive resets, broad deletion, or checkout-based reverts.
3. Remove dead code instead of leaving commented-out production code. Comment only non-obvious decisions or constraints.
4. Follow existing formatting, keep new text ASCII by default, and update directly related documentation.

## UI/UX design

1. Every screen must clearly communicate purpose, current state, primary action, and next step.
2. Reuse Manage Core tokens, Bootstrap utilities, spacing, typography, colors, radii, and elevation before adding new values.
3. Distinguish primary, secondary, destructive, disabled, selected, loading, empty, success, permission, and error states.
4. Never show blank panels or silently swallow failures. Preserve context during navigation, filtering, pagination, dialogs, and forms.
5. Use semantic HTML, visible focus states, descriptive labels, comfortable touch targets, and meaningful button/link names.
6. Avoid unnecessary parallax, blur, fixed backgrounds, hover-only behavior, and continuous animation. Respect `prefers-reduced-motion`.

## Responsive and mobile-first behavior

1. Every page and shared component must work below 430px, 430-767px, 768-1023px, and desktop widths.
2. Avoid fixed layout widths and assumptions that cause clipping or horizontal page scroll.
3. Use flexible grids, wrapping controls, `min-width: 0`, and fluid typography; content must remain usable at 320px.
4. Give tables, charts, code, and wide content an intentional mobile treatment: scroll, cards, or a focused subset.
5. Headers, sidebars, breadcrumbs, filters, action groups, dialogs, forms, and pagination must stack or collapse cleanly.
6. Do not hide required information or actions merely to make a layout fit. Verify light and dark themes where supported.

## React frontend and components

1. Keep shared UI in `src/components`, screens in `src/pages`, API calls in `src/api`, and shared state in the appropriate context.
2. Reuse `Dashmainheading`, layout primitives, controls, tables, feedback states, and helpers before creating duplicates.
3. Use stable keys, explicit props, semantic elements, controlled forms, and proper loading/error states.
4. Keep render paths cheap; avoid unnecessary state, repeated derived work, expensive render calculations, and large inline objects.
5. Lazy-load route-level and heavy modules where supported. Do not statically and dynamically import the same module without a reason.
6. Cancel or ignore stale async work. Keep business logic in hooks, helpers, or services rather than complex markup.
7. Avoid `any`, unsafe casts, duplicated constants, global side effects, and unjustified dependencies.
8. Scope page styles to component/page classes and avoid broad selectors or excessive `!important`.

## Accessibility

1. Use semantic landmarks, ordered headings, labels, descriptive links, and native controls.
2. Keyboard users must be able to reach, operate, understand, and exit every interactive feature.
3. Dialogs, menus, popovers, and drawers must manage focus and close behavior correctly.
4. Maintain contrast and provide status cues that do not depend on color alone.
5. Use live regions for important asynchronous status changes where appropriate; do not use ARIA to mask incorrect HTML.

## Laravel backend and API

1. Keep controllers thin. Use Form Requests for validation, policies/middleware for authorization, and services/actions for business logic.
2. Validate and authorize all external input at the API boundary; never trust client-side validation.
3. Protect Sanctum-authenticated, tenant-scoped, and admin routes with existing permission and customer-isolation mechanisms.
4. Every query must enforce tenant, user, role, and permission scope. An ID alone is never proof of access.
5. Return consistent JSON, correct HTTP status codes, pagination for collections, and useful errors without stack traces or secrets.
6. Prevent N+1 queries, use eager loading deliberately, and add indexes through migrations for new lookup paths.
7. Use transactions for related writes and queue slow or retryable external work when appropriate.
8. Use migrations for schema changes. Never modify production schema or data manually during normal feature work.

## Data, forms, and security

1. Normalize identifiers and dates at system boundaries. Handle null, empty, stale, duplicate, unauthorized, and partial data explicitly.
2. Forms must prevent duplicate submission, preserve values after validation failure, and show field-level errors.
3. Escape or sanitize user-generated content before rendering HTML/Markdown or generating exports.
4. Apply least privilege to routes, roles, tokens, files, exports, and administrative actions.
5. Treat uploads, exports, webhooks, and third-party responses as untrusted input.
6. Never log passwords, tokens, full payment data, or unnecessary personal information.
7. Keep credentials, tokens, environment values, and personal secrets out of source, logs, frontend bundles, and documentation.

## Performance

1. Measure before optimizing and preserve meaningful improvements with a targeted check where possible.
2. Keep mobile startup small: lazy-load heavy screens, charts, editors, export libraries, and rarely used workflows.
3. Paginate or virtualize large datasets and do not render hidden duplicate copies of large tables.
4. Debounce search/filter requests, cache stable reference data, and prevent duplicate API calls from effects or rerenders.
5. Prefer transform/opacity animation over layout-triggering animation. Reduce blur, shadow, and decorative effects on constrained devices.
6. Images, fonts, charts, and third-party resources must not block essential content unnecessarily.

## Verification and delivery

Before completing a change:

1. Run the smallest relevant existing checks: `npm run lint` and/or `npm run build` for frontend changes,
   `npm run build` for the marketing site, and `php artisan test` for backend behavior.
2. Check UI changes at desktop, tablet, 430px, and below 430px, including loading, empty, error,
   permission, keyboard, dark-theme, and reduced-motion states where relevant.
3. Recheck API consumers after changing routes, response shapes, validation, or database fields.
4. Treat build errors, lint failures, test failures, broken imports, and accessibility regressions as blockers.
5. Review the final diff for debug code, temporary files, generated output, unrelated formatting, and secret exposure.
6. Keep commits focused and describe the user-visible or architectural change.
