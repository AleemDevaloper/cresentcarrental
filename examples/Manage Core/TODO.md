# TODO — Manage Core

## v3.6 — Enterprise CRM Module + Excel Import ✅ COMPLETE

### Completed in v3.6
- [x] ~~CRM Excel Import: Backend (`CrmController::importLeads`) with ENUM validation, safe code generation, custom_fields storage~~
- [x] ~~CRM Excel Import: Frontend 4-step modal (Upload → Column Mapping → Preview → Result)~~
- [x] ~~CRM Excel Import: Drag & drop file upload, supports .xlsx/.xls/.csv~~
- [x] ~~CRM Excel Import: Conservative auto-mapping for standard fields~~
- [x] ~~CRM Excel Import: Custom fields column in leads table (colored tags, "+N more" overflow)~~
- [x] ~~Bug fix: `faHandshake` missing import in ModuleContentRenderer.jsx~~
- [x] ~~811 existing leads preserved (status=existing)~~
- [x] ~~Build: `npm run build` PASSING (~42s)~~

## v3.5 — Enterprise CRM Module ✅ COMPLETE

### Completed in v3.5
- [x] ~~10 CRM database tables created (crm_customers, crm_leads, crm_contacts, crm_deals, crm_pipelines, crm_pipeline_stages, crm_activities, crm_campaigns, crm_notes, crm_tasks)~~
- [x] ~~10 CRM Eloquent models with tenant connection~~
- [x] ~~CrmController: full CRUD + dashboard + convert lead + move deal stage + mark won/lost + 5 reports~~
- [x] ~~40+ CRM API routes in routes/modules/crm.php~~
- [x] ~~CRM routes registered in routes/api.php~~
- [x] ~~Default sales pipeline with 6 stages seeded~~
- [x] ~~CrmModuleTabs component with 4 tab groups~~
- [x] ~~CRM enabled in TopNavBar (disabled: true removed)~~
- [x] ~~CrmDashboard: 8 KPI cards + pipeline funnel + customer breakdown + timeline + top performers~~
- [x] ~~CrmCustomers: Full CRUD with 20+ fields + filters + export~~
- [x] ~~CrmLeads: Lead scoring + qualification + convert-to-customer~~
- [x] ~~CrmContacts: Contact directory linked to customers~~
- [x] ~~CrmDeals: Kanban pipeline view + list view + mark won/lost~~
- [x] ~~CrmActivities: Activity tracking with 9 types + completion~~
- [x] ~~CrmCampaigns: Marketing campaign management with ROI~~
- [x] ~~CrmReports: 5 report tabs (Pipeline, Conversion, Activity, Performers, Revenue)~~
- [x] ~~CrmTasks: Task management with priority/due dates~~
- [x] ~~API client: api/crm.js with 30+ functions~~
- [x] ~~pageRegistry.js: 9 CRM pages lazy-loaded~~
- [x] ~~featureRegistry.js: 10 CRM features registered~~
- [x] ~~ModuleContentRenderer.jsx: 9 CRM page cases added~~
- [x] ~~Build: `npm run build` PASSING (~40s)~~

## v3.4 — Translation Completion & AI Card Description ✅ COMPLETE

### Completed in v3.4
- [x] ~~AI system card: description field added to backend systemModules()~~
- [x] ~~AI system card: description rendered in WorkspaceLauncher.jsx~~
- [x] ~~21 new translation keys added to all 5 languages (English, Spanish, French, German, Arabic)~~
- [x] ~~ai_name, ai_full_name, ai_short_desc, ai_workspace, ai_tools, ai_settings~~
- [x] ~~ai_knowledge_center, ai_provider_settings, ai_quota_management~~
- [x] ~~ai_assistant, ai_copilot, ai_intelligence_hub~~
- [x] ~~drawing_name, drawing_full_name, drawing_short_desc~~
- [x] ~~ems_full_name, ems_short_desc~~
- [x] ~~pos_name, pos_full_name, pos_short_desc, pos_dashboard~~
- [x] ~~63 previously missing keys added across all languages (DMS, HRMS, HR Management, EMS)~~
- [x] ~~Build: `npm run build` PASSING (~25s)~~

## v3.3 — Unified AMS Sales UI ✅ COMPLETE

### Completed in v3.3
- [x] ~~ErpCustomerReceipts: Icons use solid colored buttons (not transparent hover)~~
- [x] ~~ShareQrButton: Solid background instead of transparent~~
- [x] ~~All action icons: fontSize 0.85rem, padding 5px 9px~~
- [x] ~~ErpSalesOrders: View modal + Export dropdown + Convert to Invoice~~
- [x] ~~ErpQuotations: View modal + Export dropdown + Convert to Order~~
- [x] ~~ErpDeliveryChallans: View modal + Export dropdown~~
- [x] ~~ErpCreditNotes: View modal + Export dropdown + Convert to Refund~~
- [x] ~~ErpSalesReturns: View modal + Export dropdown + Inspect/Refund~~
- [x] ~~3-template system (Standard/Minimal/Premium) for all sales docs~~
- [x] ~~Company branding from getAccountingSettings across all templates~~
- [x] ~~Build: `npm run build` PASSING (~23s)~~

## v3.2 — UI Polish & Dashboard Real-Data ✅ COMPLETE

### Completed in v3.2
- [x] ~~ErpCustomerReceipts: Action icons enlarged to 0.95rem~~
- [x] ~~QR Code Modal: Uses createPortal to render at page level~~
- [x] ~~QR Code Modal: Fixed stuck height/width, added proper zIndex~~
- [x] ~~AMS Dashboard: FmsController rewritten with real DB aggregations~~
- [x] ~~ErpDashboard: All hardcoded arrays removed (top customers, vendors, banks, overdue, etc.)~~
- [x] ~~ErpDashboard: Empty-state messages added for all list sections~~
- [x] ~~Foundation Status & Posting Controls use real backend data~~
- [x] ~~Interlink design: All modules work independently, user can opt-in to links~~
- [x] ~~Build: `npm run build` PASSING (~41s)~~

## v3.1 — Bug Fixes & Migrations ✅ COMPLETE

All critical SQL/React errors fixed. All 31 missing database tables created. Build passing.

### Completed in v3.1
- [x] ~~31 new database tables created (MFG, FX, Journal, PMS, Chat, TMS, FMS, HRMS)~~
- [x] ~~MFG models: $table property added to all 6 models~~
- [x] ~~ProjectProgress: $table property added~~
- [x] ~~PmsController: import added to routes~~
- [x] ~~JournalEntryController: Arr::except fix + fiscal_periods reference~~
- [x] ~~MfgController: createWorkOrder variance fix~~
- [x] ~~Duplicate migration deleted~~
- [x] ~~faClose → faTimes in 4 HRMS files~~
- [x] ~~faExclamationTriangle → faTriangleExclamation in ModuleContentRenderer~~
- [x] ~~PMS API unwrap fix in 11 pages~~
- [x] ~~fms.js: 7 journal entry API functions added~~
- [x] ~~HrmsOutdoorDuty: localStorage → API~~
- [x] ~~ErpJournalEntries: mock data → real API~~
- [x] ~~HrmsPhysicalLeaveEntry: localStorage → API~~
- [x] ~~HrmsMyLeaveBalance: localStorage → API~~
- [x] ~~HrmsNotificationInbox: localStorage → API~~
- [x] ~~Build: `npm run build` PASSING~~

## v3.0 — Full System Completion ✅ COMPLETE

All major systems are now DB-backed. See PROJECT_STATUS.md for full details.

### Completed in v3.0
- [x] ~~MFG module: 6 models, 6 migrations, full controller, 4 frontend pages~~
- [x] ~~FX module: 5 models, 5 migrations, full controller, 5 frontend pages~~
- [x] ~~HRMS Employee Database: EmployeeController + OutdoorDuty + 13 routes~~
- [x] ~~FMS Core: Cache → DB migration via FmsCoreController~~
- [x] ~~Journal Entries: Full backend with debit=credit validation~~
- [x] ~~SuperAdmin GovernanceController: Mock → Real DB~~
- [x] ~~TMS Collaboration + Reporting: 3 models, 2 controllers, 12 frontend pages~~
- [x] ~~PMS Sub-Features: 9 models, PmsController, 10 frontend pages~~
- [x] ~~Common Chat: 5 models, 2 controllers, 14 routes~~
- [x] ~~EMS Dashboard: Mock data → Real API~~
- [x] ~~HRMS Leave filter params: from_date → start_date, employee_id → user_id~~

### Remaining (P3 — Low Priority)
- [x] ~~Build CRM module from scratch~~ ✅ DONE
- [ ] Migrate FMS cache docs (quotations/invoices) to DB
- [ ] EMS ↔ HRMS cross-module linking (merge ems.sqlite into main DB)
- [ ] Company/Branch dynamic filter dropdowns in HrmsOverview
- [ ] DMS version comparison fix (uses `rand()`)
- [ ] Password reset flow
- [ ] Add comprehensive tests (PHPUnit + Playwright)
- [ ] Audit inline `fontSize` overrides (100+ pages)
- [ ] Delete dead `custom.scss`
- [ ] Fix `_reset.scss:37-42`

---

## Current — Critical Bug Fixes (v2.6 — Styling, Data, Status)

### CSS/Styling — Cards, Icons, Fonts Disturbed

- [x] ~~Remove `overflow: hidden`~~ from `.card` in `_global.scss:275` — icons/text no longer clipped
- [x] ~~Remove `.card.border-0, .card.shadow-sm` override~~ at `_global.scss:279-285` — Bootstrap utilities work again
- [x] ~~Align font variables~~ — `$body-size` now 15px, `$small-size` now 13px (aligned with `_theme.scss`)
- [x] ~~Fix table header sizes~~ — all 12 themes in `table-themes.css` increased from ~10px to 0.75rem
- [ ] Audit inline `fontSize` overrides — 100+ pages use hardcoded 9-11px inline styles
- [ ] Delete dead `custom.scss` — not imported, contains conflicting Bootstrap config ($primary #2828e2 vs #4F46E5)
- [ ] Fix `_reset.scss:37-42` — `font: inherit` on inputs resets Bootstrap form sizing

### Data Stored But Not Displaying (Cache Invalidation)

- [x] ~~Add `clearCache()` after mutations~~ — 10 critical pages fixed (17 calls total): ApprovalCenter, AccessRequests, Settings, AdminSettings, UserRequests, RoleDashboard, ThemeAssignmentCenter, AddUser, LoanManagementPortal, LeaveApprovalCenter
- [ ] Fix ERP data fallbacks — `setItems(res.data || res)` where `res` is `{data:...}` not array (OpeningBalances, FiscalYears, AccountTypes, AccountGroups, Accounts)
- [ ] Fix null access crashes — `req.type.replace()` without null check (ApprovalCenter:216, AccessRequests:72, UserRequests:229)
- [ ] Fix ApprovalCenter infinite loop — `filters` object in useEffect deps creates new reference every render

### Status Display Bugs

- [x] ~~Create centralized StatusMap.jsx~~ — 60+ backend status values mapped to colors/icons/labels
- [x] ~~Update StatusBadge.jsx~~ — now handles all statuses via StatusMap
- [x] ~~Fix HrmsAttendanceCorrections:303~~ — approve/reject buttons now appear (was checking Title Case)
- [x] ~~Fix BiometricDevices:263~~ — proper status color mapping (was hardcoded green)
- [x] ~~Fix TmsApprovalWorkflow:24-31~~ — status colors match (was checking `'Under Review'` vs `'in_review'`)
- [ ] Unify error notification types — some pages use `"error"`, others `"danger"`
- [ ] Add error state handling to pages that only console.error (ApprovalCenter, AccessRequests, Settings, AdminSettings)

---

## Company Website (v2.4 — design refinement)

- [x] ~~Services page hero rebuild + stats strip~~ (v2.4)
- [x] ~~Quote form redesign (field wrappers, required markers, custom select, success state)~~ (v2.4)
- [x] ~~Services dropdown featured image panel~~ (v2.4)
- [x] ~~Enterprise pricing comparison table~~ (v2.4)
- [x] ~~Detailed pricing for every product (5 products, 3 tiers each)~~ (v2.4)
- [x] ~~Detailed pricing for every service (60+, grouped by category)~~ (v2.4)
- [x] ~~Price engine `serviceTierPricing()` removes `[Edit — …]` placeholders site-wide (packages + PDF)~~ (v2.4)
- [ ] Services page: polish lower sections (deliverables, process, FAQ, reviews)
- [ ] Wire contact / quote forms to the backend API
- [ ] Connect ChatBot to the working AI SSE backend (OpenRouter proxy)
- [ ] Persist newsletter + footer form submissions to the backend
- [ ] i18n for the marketing site (admin SPA already has 5 languages)
- [ ] Add OG/social images (reuse `og/pages/*.webp` from Xovo reference)
- [ ] Code-split pages + lazy-load chatbot for smaller bundles
- [ ] Accessibility pass (focus states, ARIA, reduced-motion, contrast)
- See `COMPANY_WEBSITE.md` for full architecture, design system, and pricing page detail

## High Priority

- [x] ~~Company marketing website lint cleanup~~ (v2.4) — 8 errors fixed, build verified
- [x] ~~Standardize ERP listing pages to match ErpQuotations feature set~~ (v2.1)
- [x] ~~Replace localStorage edit pattern with setEditDocument across all modules~~ (v2.1)
- [x] ~~Build backend AssetCategoryController + routes~~ (v2.1)
- [x] ~~Remove hardcoded mock data from 6 AMS listing pages~~ (v2.1)
- [x] ~~Replace confirm() with DeleteConfirmDialog in ErpPayrollHrIntegration~~ (v2.1)
- [ ] Complete Payroll Engine
- [ ] HRMS Dashboard
- [ ] Attendance Analytics
- [ ] Leave Analytics
- [ ] Recruitment Module
- [ ] Candidate Portal
- [ ] Offer Letter Generator
- [ ] Asset Clearance Workflow (controller exists, needs routes)
- [ ] Exit Settlement Workflow
- [ ] Migrate 43+ form pages from localStorage draft auto-save to backend drafts API
- [ ] Migrate erpPurchaseStore.js from localStorage to backend API
- [ ] Migrate ErpCashierSessions from localStorage to backend API

## Medium Priority

- [ ] Treasury Management
- [ ] Cost Centers
- [ ] Profit Centers
- [ ] Budgeting
- [ ] Forecast Reports
- [ ] Add AssetMaintenanceController with standalone CRUD routes
- [ ] Fix AssetLocation assets() relationship (broken — joins on string column instead of location_id FK)

## Low Priority

- [ ] AI Assistant
- [ ] Advanced BI
- [ ] Workforce Forecasting
- [ ] Executive Intelligence

---

## Completed (v2.5 — Premium Review Form & Website Polish)

### Premium review submission form (`Reviews.jsx`, both apps)
- Right-side `.mc-review-form-panel` redesigned: gradient top accent bar, icon-tile header,
  pulsing live status pill, two numbered section cards ("About you" / "Your experience"),
  icon-prefixed inputs, interactive 1–5 **star rating** with labels, textarea with live char
  counter (red at 500 cap), consent card with bold title, branded submit row + lock note.
- Fully themed for light + dark mode; mirrored in `manage-core-frontend`.
- Icon note: `FiBuilding` not in `react-icons/fi` → used `FiHome`.

### Link & dark-mode fixes
- Footer/navbar `const W = "/"` → `const W = ""` (both Footers + frontend Navbar) — fixes
  `//products/...` protocol-relative URLs resolving to `http://products/...`.
- Dark-mode compare card headings: added `!important` to `.mc-compare-win h3` overrides in
  both apps (global `h1..h6 !important` rule was overriding them).
- Client Login footer link → `http://127.0.0.1:8061/login` (website-react footer).

### Palette consistency
- CTA gradients unified to `#0d246e` (CaseStudies, CompareDetail).
- Cyan/magenta accents recolored to blue/purple (`.mc-pc-card-dot` → `#a78bfa`, step badge
  gradient → `#7c8ff8,#a78bfa`, `.mc-pc-card-foot svg` → `#7c8ff8`, `.mc-f-nl-ok` blue).

### Verified
- `npm run build` passing in both `manage-core-website-react` (~30s) and
  `manage-core-frontend` (~1m15s).

---

## Completed (v2.4 — Company Website Design Refinement)

### Services dropdown — featured image panel
- Replaced small brochure-strip with a full-height `mc-drop-panel`: bg image + gradient overlay,
  eyebrow tag, live counts (`allServices.length` categories), white download-brochure CTA with
  loading spinner + "Saved to downloads" success. `Navbar.jsx` + `.mc-drop-panel*` CSS.

### Services page — hero + stats + quote form
- Hero rebuilt: badge pill, gradient title, dual CTAs, right asset panel with stats card and
  `<Skeleton variant="stats">` fallback.
- Delivery stats strip: 4 animated KPI tiles (`Counter` + `mc-stats`).
- Quote form: `.mc-field` wrappers, required markers, custom select arrow (budget), upgraded
  success state (icon ring + 3 steps + reset), "Free" badge on the form-card header.

### Pricing page — enterprise comparison table
- Replaced the basic table with `mc-compare*` matrix: sticky label column, tier headers
  (gradient icon + price + CTA), "Most chosen" ribbon + brand-tint column on Growth System,
  green check chips, gradient price text, row hover highlight, responsive horizontal scroll.
- Expanded from 4 rows to 10 rows (scope/build/support/commitment).

### Pricing page — detailed pricing for every product & service
- **Products**: added `pricing` (Starter/Growth/Enterprise, features + CTAs) to all 5
  `coreProducts` in `productsData.js`; new `mc-product-price-*` section renders a detailed
  pricing block per product.
- **Services**: added a full service price catalog — every service (60+) grouped by its 8
  categories, category anchor chips, and per-service price cards
  (`mc-svc-price-*`/`mc-price-cat-*`) showing Starter / Growth / Enterprise prices.
- **Price engine**: `serviceTierPricing(service)` in `pricingData.js` (per-category bands +
  per-service overrides + fallback) powers pricing page, service package cards
  (`ServiceComponents.jsx`), and the brochure PDF (`ServicePdf.js`) — removing all
  `[Edit — …]` placeholder prices site-wide.

### Verified
- `eslint src/pages/company` clean; `npm run build` passing.

---

## Completed (v2.3 — ERP Inventory & AI Chat)

### ERP Inventory Service — Feature Parity with ErpQuotations (7 tabs)
- Rewritten: ErpUoms, ErpWarehouses, ErpProductCategories, ErpStockMovements, ErpStockTransfers, ErpInventoryValuation
- Incremental upgrade: ErpProducts
- Per-page: searchable `ErpDataTable`, KPI cards, view/preview modal, edit navigation (`setEditDocument`), `DeleteConfirmDialog`, Draft/Active toggle, card/table view toggle, export dropdown (PDF/DOCX/Word/Excel/CSV), live-refresh listeners (`erp:refresh` / `app:minor-refresh`)
- Lint-clean for all 7 files (0 errors)

### ErpAddWarehouse — Form/Table Parity + Edit Mode
- All table columns are now form inputs (Code, Name, Type, City, Location Head, Email, Phone, Max/Current Capacity, Status)
- Edit mode reads `editDocument` (documentType `warehouse`), pre-fills the form, and shows "Update Warehouse"

### AI Chatbot — Working Models + SSE Streaming
- Replaced all retired OpenRouter models with working free models (frontend `OPENROUTER_MODELS` + backend `config/ai.php`)
- Backend `AiService::streamChat()` + `AiChatController` SSE `stream` branch (quota enforced, usage logged)
- Frontend `sendMessage` streams via backend proxy (`fetch` + `ReadableStream`), falls back to direct OpenRouter SDK
- Default `selectedModel` → `openrouter/free`; backend `.env` now has `OPENROUTER_API_KEY`
- 429 org-quota errors preserved; 120s timeout; per-model stream accumulator reset

### Bug Fixes
- `parents.map is not a function` — unwrap `res.data.data` with `Array.isArray` guard (ErpAddProductCategory, ErpAddAssetCategory)
- `faFileExport` / `faFileSignature` missing imports (ErpPayrollHrIntegration, ErpProducts)
- Corrupted `handleEdit` block in ErpInventoryValuation restored
- Frontend build still blocked by unrelated pre-existing syntax errors in ErpChartOfAccounts.jsx / ErpOpeningBalances.jsx (not touched)

---

## Completed (v2.1 — AMS Standardization)

### Backend
- `AssetController@destroy` — DELETE endpoint for assets
- `AssetCategoryController` — Full CRUD (index, store, show, update, destroy)
- `Route::apiResource('asset-categories')` — Registered in erp.php

### Frontend API
- `getAsset(id)` — GET `/assets/{id}`
- `deleteAsset(id)` — DELETE `/assets/{id}`
- `deleteAssetCategory(id)` — DELETE `/asset-categories/{id}`

### AMS Listing Pages (mock data → real API)
- `ErpFixedAssets.jsx` — `listAssets()` + `getAssetStats()`
- `ErpAssetCategories.jsx` — `listAssetCategories()`
- `ErpAssetLocations.jsx` — `listAssetLocations()`
- `ErpAssetDepreciation.jsx` — `listAssetDepreciations()`
- `ErpAssetDisposals.jsx` — `listAssetDisposals()`
- `ErpAssetBookValueReport.jsx` — `listAssets()` (derived report)

### EditDoc Pattern (localStorage → context)
- 12 listing pages: ErpBankCashAccounts, ErpBankCashVouchers, ErpBankReconciliation, ErpBankTransfers, ErpPurchaseOrders, ErpPurchaseRequisitions, ErpPurchaseReturns, ErpVendorBills, ErpVendorPayments, ErpGoodsReceipts, ErpCustomerReceipts, ErpCreditNotes
- 7 additional listing pages: ErpAssetLocations, ErpAssetDisposals, ErpFixedAssets, ErpAssetCategories, ErpRfqs, ErpVendors, ErpAssetDepreciation
- 7 create/edit forms: ErpAddAsset, ErpAddAssetCategory, ErpAddAssetLocation, ErpCreateRfq, ErpAddVendor, ErpRunDepreciation, ErpDisposeAsset
- 1 purchase form: ErpCreatePurchaseOrder

### Feature Standardization (matching ErpQuotations)
- ErpPosSalesScreen — Full 14-feature rewrite
- ErpImportBankStatement — All features added
- ErpCashFlow — All features added
- ErpJournalEntries — All features added
- ErpPayablesAging — All features added
- ErpPayrollHrIntegration — DeleteConfirmDialog replacement

### Bug Fixes
- ErpPayrollHrIntegration parse error (DeleteConfirmDialog outside root div)
- ErpPayablesAging missing confirmLabel prop
- ErpCreditNotes/ErpCustomerReceipts missing ?. optional chaining
- ErpImportBankStatement dead ErpPageShell import

---

## Website-React Design Audit & Polish (v2.7)

### Deep Analysis Summary (2026-09-14)

#### Project Structure Analyzed:
- **manage-core-website-react**: 50 pages, 12 components, 9 data modules, ~6400-line CSS
- **manage-core-frontend**: Admin SPA (21 page directories) — not focus of this task
- **manage-core-backend**: Laravel API — not focus of this task

#### CSS Design System (site.css — ~6400 lines):
- Well-structured with CSS custom properties for theming
- Light/dark mode tokens defined in `.mc-root` and `.mc-root[data-theme="dark"]`
- Responsive breakpoints: 1600px, 1200px, 980px, 860px, 720px, 700px, 640px, 560px, 520px, 480px, 420px, 380px
- Missing some utility classes that are used in components

#### Issues Identified:

##### 1. CSS Gaps & Missing Styles (High Priority)
- [ ] `.mc-hero-badge` — used in Home.jsx but not defined in site.css (styles exist but need verification)
- [ ] `.mc-scroll-cue` + `.mc-scroll-mouse` — hero scroll indicator, need CSS verification
- [ ] `.mc-about-nav` — About page sub-nav, styles may be missing
- [ ] `.mc-stats-about` + `.mc-stat-about` — About page stats grid, need CSS
- [ ] `.mc-ai-check-list` — used in About.jsx, partially defined
- [ ] `.mc-console-*` — Console section in Home.jsx, need CSS verification
- [ ] `.mc-orbit-section-alt` + `.mc-orbit-layout` — alternative orbit layout in Home.jsx
- [ ] `.mc-num` — numbered item component used in multiple places
- [ ] `.mc-nums` + `.mc-nums-head` + `.mc-nums-grid` — stats section in Home.jsx
- [ ] `.mc-hero-divider` — divider between hero and next section

##### 2. Inline Style Overrides (Medium Priority)
- [ ] Home.jsx: 40+ inline `style={{...}}` on sections (margin, padding, background)
- [ ] About.jsx: inline styles on headings and paragraphs
- [ ] Contact.jsx: inline styles on form elements
- [ ] Services.jsx: inline `style={{ paddingTop: 0 }}` on sections
- [ ] Many pages use `style={{ marginTop: 44 }}` or `style={{ marginTop: 36 }}` instead of CSS classes

##### 3. Mobile Responsiveness (Medium Priority)
- [ ] Navbar: compact phone styles at 420px need verification
- [ ] Hero grid: collapses to 1 column at 980px — verify no overflow
- [ ] Footer: 6-column layout needs proper collapse at smaller breakpoints
- [ ] Chat panel: sizing at 480px and below needs verification
- [ ] Compare cards: 2-column to 1-column at 860px
- [ ] Product tabs: carousel controls need mobile-friendly sizing

##### 4. Dark Mode Consistency (Medium Priority)
- [ ] `.mc-compare-win` headings: global `h1..h6 !important` was overriding — verify fix
- [ ] Footer dark mode: verify all link colors are readable
- [ ] Chat panel dark mode: verify bubble colors
- [ ] Form inputs dark mode: verify background and border colors

##### 5. Form Styling (Low Priority)
- [ ] Contact form: verify focus ring visibility
- [ ] Newsletter form: verify input sizing
- [ ] Review form: verify star rating dark mode
- [ ] Demo form: verify all field states

##### 6. Animation & Motion (Low Priority)
- [ ] Verify `prefers-reduced-motion` is respected for all animations
- [ ] Check shimmer/sheen animations don't cause layout shifts
- [ ] Verify scroll reveal works on all pages

### Work Plan — Applying Fixes

#### Step 1: Add Missing CSS Classes
Add all missing utility/component classes to site.css:
- `.mc-hero-badge` and children
- `.mc-scroll-cue` + `.mc-scroll-mouse`
- `.mc-about-nav` grid
- `.mc-stats-about` + `.mc-stat-about` grid
- `.mc-console-*` section styles
- `.mc-orbit-section-alt` styles
- `.mc-nums` + `.mc-num` home stats
- `.mc-hero-divider`

#### Step 2: Convert Inline Styles to CSS Classes
Replace common inline patterns with reusable classes:
- `.mc-section-sm` for `paddingTop: 0`
- `.mc-mt-*` utilities for consistent spacing
- Section background overrides

#### Step 3: Fix Mobile Breakpoints
- Navbar compact mode
- Footer column collapse
- Hero grid overflow
- Chat panel sizing

#### Step 4: Dark Mode Polish
- Verify all component colors in dark mode
- Fix any remaining contrast issues

#### Step 5: Build Verification
- Run `npm run build` in manage-core-website-react
- Verify no CSS warnings or errors

### Completed Work Summary (2026-09-14)

#### 1. Missing CSS Classes Added (12 classes)
- `.mc-about-nav` — About page sub-navigation flex layout
- `.mc-section-nav` — About section sub-navigation flex layout
- `.mc-compare-step` — Numbered step badge with dark mode support
- `.mc-pros` — Pros list with green check icons (+ dark mode `#4ade80`)
- `.mc-cons` — Cons list with red X icons (+ dark mode `#f87171`)
- `.mc-console-input-col` — Console section left column
- `.mc-neon-cta-copy` — Footer CTA copy area
- `.mc-neon-cta-form` — Footer CTA form area
- `.mc-neon-brand-col` — Footer brand column
- `.mc-neon-col` — Footer individual link column
- `.mc-product-carousel` — Product carousel wrapper
- `.mc-slab-alt` — Alternating background utility (replaces `background: "var(--bg-2)"`)

#### 2. Utility Classes Added
- `.mc-slab-alt` — `background: var(--bg-2)` with dark mode support
- `.mc-pt-0` — Zero top padding for stacked sections
- `.mc-text-center` — Text centering
- `.mc-mt-32`, `.mc-mt-36`, `.mc-mt-40`, `.mc-mt-44` — Top margin utilities
- `.mc-mb-16`, `.mc-mb-24`, `.mc-mb-32` — Bottom margin utilities

#### 3. Inline Style Replacements (111 changes across 40+ files)
- **59 files**: Replaced `style={{ background: "var(--bg-2)" }}` → `mc-slab-alt`
- **52 files**: Replaced `style={{ paddingTop: 0 }}` → `mc-pt-0`
- 6 additional manual fixes for multi-property inline styles in Home.jsx, Products.jsx, BlogPost.jsx, Legal.jsx, Services.jsx

#### 4. Mobile Responsiveness Fixes
- `.mc-drop-inner`: Changed `300px` → `min(300px, 28vw)` for better tablet behavior
- Verified: Nav already has hamburger at 980px, chat has responsive rules at 480px/560px

#### 5. Dark Mode Fixes
- `.mc-drop-panel-btn`: Added dark mode override (was hardcoded `#fff` bg)
- `.mc-pros li svg`: Added lighter green `#4ade80` for dark backgrounds
- `.mc-cons li svg`: Added lighter red `#f87171` for dark backgrounds

#### 6. Accessibility Improvements
- Added `:focus-visible` states for `.mc-input`, `.mc-select`, `.mc-textarea`

#### Build Verification
- `npm run build` completed in 8.84s — zero errors, all 376 modules transformed
