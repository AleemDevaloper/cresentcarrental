# Manage-Core ERP — Project Memory

**Status:** v3.7 — Super Admin Full Stack Wiring + POS in AMS

---

## Recent Changes

### 43. v3.7 — Super Admin Full Stack Wiring + POS in AMS

**POS System (Part of AMS):**
- Removed 8 extra POS sidebar groups, kept only `fms_pos_retail_group` (POS / Retail) with 4 tabs
- Tabs: POS Sales Screen, Cashier Sessions, POS Invoices & Receipts, Z-Reports
- Updated `AmsModuleTabs.jsx`, `ModuleContentRenderer.jsx`, `Common.jsx` for new tab IDs
- POS is now a clean subset of AMS sidebar

**Super Admin Backend (User CRUD):**
- Added `storeUser` — create user in tenant DB with hashed password, role, and system permissions
- Added `showUser` — fetch user details with permissions and systems
- Added `updateUser` — update name, email, password, role
- Added `destroyUser` — delete user and their permissions
- Added `resetPassword` — reset user password in tenant DB
- All endpoints require `superadmin` middleware
- Routes: `POST/GET/PUT/DELETE /tenants/{tenant}/users/{user}` and `POST /tenants/{tenant}/users/{user}/reset-password`

**Super Admin Backend (Security Fix):**
- Integration routes (API Keys, Webhooks) moved inside `superadmin` middleware group
- Previously any authenticated user could manage API keys and webhooks

**Super Admin Frontend (CompanyManagement):**
- Rewired from hardcoded in-memory data to real Tenant API
- Company list fetched from `listTenants()` on mount
- "Add Company" calls `provisionTenant()` directly (creates tenant + database + admin)
- Company status toggle calls `updateTenant()` API
- Delete calls `deleteTenant()` API
- Users section loads from `listTenantUsers()` API
- Add/Edit/Delete User all use new CRUD endpoints
- Password reset modal calls `resetTenantUserPassword()` API
- Credentials (password) shown in create/edit modals
- Software access badges show assigned modules per company

**Super Admin Frontend (API Layer):**
- Added `getTenantUser`, `createTenantUser`, `updateTenantUser`, `deleteTenantUser`, `resetTenantUserPassword` to `api/tenants.js`
- Added `listWebhooks`, `storeWebhook`, `toggleWebhook`, `deleteWebhook` to `api/integrations.js`

**Super Admin Frontend (Governance Pages):**
- `SessionManagement.jsx` — wired to `getSessions()` API, removed hardcoded mock data
- `AuditCenter.jsx` — wired to `getAuditLogs()` API, removed hardcoded mock data
- `Webhooks.jsx` — wired to `listWebhooks()` API with CRUD operations

**Super Admin Frontend (Dashboard):**
- Companies state now loaded from tenants API for ProvisioningWizard
- Removed hardcoded Stark Industries / Wayne Enterprises data

**Files Modified:**
- `manage-core-backend/app/Http/Controllers/Api/TenantController.php` — added 5 user CRUD methods
- `manage-core-backend/routes/modules/superadmin.php` — added user routes, moved integration routes inside middleware
- `manage-core-frontend/src/api/tenants.js` — added 5 user API functions
- `manage-core-frontend/src/api/integrations.js` — added 4 webhook API functions
- `manage-core-frontend/src/pages/superadmin/CompanyManagement.jsx` — full rewrite to use API
- `manage-core-frontend/src/pages/superadmin/SuperAdminDashboard.jsx` — removed hardcoded data, updated company tabs
- `manage-core-frontend/src/pages/superadmin/governance/SessionManagement.jsx` — wired to API
- `manage-core-frontend/src/pages/superadmin/governance/AuditCenter.jsx` — wired to API
- `manage-core-frontend/src/pages/superadmin/Webhooks.jsx` — wired to API
- `manage-core-frontend/src/components/common/AMS/AmsModuleTabs.jsx` — removed extra POS groups
- `manage-core-frontend/src/components/layout/ModuleContentRenderer.jsx` — updated POS tab rendering
- `manage-core-frontend/src/components/common/Common.jsx` — updated POS sidebar filtering

### 42. v3.6 — Enterprise CRM Module + Excel Import
**Backend (Excel Import):**
- `CrmController::importLeads` — accepts array of lead rows with arbitrary keys
- Validates and sanitizes ENUM fields: status defaults to `new`, rating validated (`hot|warm|cold`), source defaults to `import`
- Score clamped 0-100; removes invalid FK fields (assigned_to, customer_id, campaign_id)
- Code generation uses `MAX(CAST(SUBSTRING(code, 6) AS UNSIGNED))` to avoid duplicate codes after failed imports
- Non-standard columns stored in `custom_fields` JSON column

**Frontend (Excel Import):**
- 4-step modal: Upload (drag & drop) → Column Mapping → Preview → Result
- Supports .xlsx, .xls, .csv files
- Conservative auto-mapping: exact-match only for standard fields (name, email, company, phone, etc.); everything else → Custom Field
- Standard fields dropdown: name, company, email, phone, title, industry, address, city, state, country, postal_code, notes, rating, score, estimated_value, currency, expected_close_date
- Status, rating, source NOT auto-mapped (user must manually select or skip)
- Import Excel button (blue) in CrmLeads header, left of New Lead button

**Leads Table:**
- Added `custom_fields` column ("Extra Data") showing imported data as colored tags (up to 3 shown + "+N more" overflow)

**Bug Fix:**
- `faHandshake` missing import in `ModuleContentRenderer.jsx` line 128 — was crashing entire CRM module via ErrorBoundary

**Data:**
- 811 existing leads preserved (status=existing), max code number 2082
- All CRM ENUM fields have proper validation on import

**Build:** `npm run build` PASSING (~42s)

### 41. v3.5 — Enterprise CRM Module
**Backend (10 models, 10 tables, 40+ routes):**
- 10 CRM Eloquent models (CrmCustomer, CrmLead, CrmContact, CrmDeal, CrmPipeline, CrmPipelineStage, CrmActivity, CrmCampaign, CrmNote, CrmTask) — all with `protected $connection = 'tenant'`
- 10 database migrations in `database/migrations/tenant/` with foreign key constraints
- CrmController with full CRUD + dashboard + convert lead + move deal stage + mark won/lost + 5 report endpoints
- 40+ API routes in `routes/modules/crm.php` registered in `routes/api.php`
- Default sales pipeline seeded with 6 stages (Lead → Qualified → Proposal → Negotiation → Won → Lost)

**Frontend (9 pages, full UI wiring):**
- 9 CRM pages: CrmDashboard (600+ lines), CrmCustomers (700+), CrmLeads (850+), CrmContacts (500+), CrmDeals (840+), CrmActivities (600+), CrmCampaigns (500+), CrmReports (700+), CrmTasks (500+)
- CrmModuleTabs component with 4 tab groups (Overview, Relationship Management, Engagement, Intelligence)
- API client: `api/crm.js` with 30+ functions
- CRM enabled in TopNavBar (disabled: true removed)
- 10 CRM features registered in featureRegistry.js
- 9 CRM pages registered in pageRegistry.js (lazy-loaded)
- 9 CRM page cases added in ModuleContentRenderer.jsx

**Build:**
- `npm run build` PASSING (~40s)
- Fixed: faClockRotateRight → faClockRotateLeft, faLinkedin/faTwitter → solid icons, react-i18next → useTranslation, free-brands-svg-icons → free-solid-svg-icons

### 40. v3.3 — Unified AMS Sales UI
**Customer Receipts Icons Fixed (Round 2):**
- Changed from transparent background with hover effects to solid colored backgrounds matching ErpSalesInvoices.jsx pattern
- All action icons: fontSize 0.85rem, padding 5px 9px
- Color scheme: View sky, Edit slate, Draft amber, PDF/QR slate, Trash red
- ShareQrButton also updated to solid background

**All AMS Sales Tabs Unified with Sales Invoice Pattern:**
- ErpSalesOrders.jsx — added view modal with template, export dropdown, Convert to Invoice button
- ErpQuotations.jsx — added view modal with template, export dropdown, Convert to Order button
- ErpDeliveryChallans.jsx — added view modal with template, export dropdown
- ErpCreditNotes.jsx — added view modal with template, export dropdown, Convert to Refund
- ErpSalesReturns.jsx — added view modal with template, export dropdown, Inspect/Refund

**All tabs now have:**
- 3-template system (Standard/Minimal/Premium) with persistence
- Company branding from getAccountingSettings
- Export: PDF (HTML print), DOCX (brandedExport), Word, Excel, CSV
- Solid colored action buttons matching ErpSalesInvoices.jsx
- Responsive preview modals

### 39. v3.2 — UI Polish & Dashboard Data Integration
**AMS Customer Receipts Icons Fixed:**
- All action column icons increased to 0.95rem font size
- Button padding increased to 6px 8px
- Post Ledger button font size increased to 0.7rem

**QR Code Modal Fixed:**
- ShareQrButton now uses createPortal to render modal at page level (not inside table cells)
- PublicShareDialog also uses createPortal for the same reason
- Added proper zIndex stacking (1071) and maxHeight (90vh) for dialog
- QR export canvas positioned off-screen (left: -9999px) instead of clipping
- Click handler uses e.stopPropagation() to prevent row click interference

**AMS Dashboard Dummy Data Removed:**
- FmsController::dashboard() rewritten with real DB aggregations (accounts, balances, receipts, payments, approvals, customers)
- ErpDashboard.jsx: all hardcoded arrays replaced with useMemo + API data
- Top Customers, Top Vendors, Bank Accounts, Overdue Invoices all from backend
- Foundation Status and Posting Controls use real data
- Recent Posted Transactions table uses real receipts/invoices
- Empty-state messages added: "No customer data available", "No overdue invoices", etc.
- Hero stats show real values (total_receivable, active_accounts, net profit)

**Interlink Design — User-Chosen Connections:**
- All modules are independent and work standalone
- Users can opt-in to module connections via Module Settings / Feature Registry
- Documented interlink map in PROJECT_STATUS.md

### 38. v3.1 — Critical Bug Fixes & Migration Completion
- **31 new database tables created** in manage_core_db
- **MFG models** — Added `protected $table` to all 6 models
- **ProjectProgress** — Added table property
- **PmsController import** — Added to routes/modules/projects.php
- **JournalEntryController** — Fixed Arr::except and fiscal_periods reference
- **MfgController::createWorkOrder** — Removed incorrect variance field
- **Duplicate migration** — Deleted 2026_06_30_141559_00_.php
- **faClose → faTimes** — Fixed in 4 HRMS files
- **faExclamationTriangle → faTriangleExclamation** — Fixed in ModuleContentRenderer
- **PMS API unwrap** — Fixed in 11 pages
- **fms.js** — Added 7 journal entry API functions
- **HrmsOutdoorDuty** — Full rewrite from localStorage to API
- **ErpJournalEntries** — Full rewrite from mock data to real API
- **HrmsPhysicalLeaveEntry, HrmsMyLeaveBalance, HrmsNotificationInbox** — localStorage to API
- **Build:** `npm run build` ✅ PASSING (~42s)

### 37. v3.0 — Full System Completion (Major)
Every module now uses real database persistence instead of cache/localStorage.

**MFG Module (0% → 90%):**
- 6 models: ProductionOrder, BillOfMaterial, BomItem, WorkOrder, MaterialConsumption, MachineUtilization
- 6 migrations
- MfgController rewritten — all 20 methods use real DB queries
- 4 frontend pages (Dashboard, ProductionOrders, BOMs, WorkOrders) wired to real API

**FX Module (0% → 90%):**
- 5 models: FxCurrency, FxExchangeRate, FxTransaction, FxRevaluation, FxRevaluationLine
- 5 migrations with soft deletes
- FxController rewritten — all 25 methods use real DB
- 5 frontend pages (Dashboard, Currencies, ExchangeRates, Transactions, Revaluations) wired to API

**HRMS Employee Database (Broken → 100%):**
- EmployeeController — 9 methods (list, CRUD, archive, reactivate, bulkImport, export)
- OutdoorDuty model + controller — Full CRUD
- 13 new routes added
- Fixed filter params (from_date → start_date, employee_id → user_id)

**FMS Core (Cache → DB):**
- FmsCoreController — Full DB CRUD for Fiscal Years, Periods, Currencies, Exchange Rates, Account Types, Groups, Chart of Accounts
- Routes switched from FmsController (cache) to FmsCoreController (DB)

**Journal Entries (0% → 100%):**
- JournalEntry + JournalEntryLine models
- JournalEntryController — 8 methods (index, store, show, update, destroy, post, reverse, bulkPost)
- Auto-numbering (JE-YYYYMMDD-NNNN), debit=credit validation
- 8 routes added to erp.php

**SuperAdmin GovernanceController (Mock → DB):**
- All 21 methods rewritten with real DB queries
- Module CRUD, features, flags, licenses, roles, permissions, sessions, impersonation, AI governance all real
- ModuleAnalyticsController also fixed

**TMS Collaboration + Reporting (Mock → DB):**
- 3 models: TaskWorkspace, TaskSharedBoard, TaskApproval
- 4 migrations
- TmsCollaborationController (12 methods) + TmsReportingController (5 methods)
- 12 frontend pages wired to real API

**PMS Sub-Features (localStorage → DB):**
- 9 models: ProjectBudget, Cost, Progress, Resource, Sprint, Backlog, Risk, Document, CalendarEvent
- 9 migrations
- PmsController — 35+ methods
- 10 frontend pages wired to real API (PmsDataBackup remains local)

**Common Chat (Missing → 100%):**
- 5 models: ChatChannel, ChatChannelMember, ChatChannelMessage (threads), ChatMeeting, ChatFile
- 5 migrations
- ChatChannelController + ChatMeetingController
- 14 routes added

**EMS Dashboard (Mock → API):**
- Added getEmsDashboardAnalytics() and getEmsAiInsights() to api/ems.js
- EmsDashboard.jsx — Removed entire hardcoded mockData object
- Now uses Promise.all for parallel API calls

**Total Backend Files Created/Modified:** 60+ (models, migrations, controllers, routes)
**Total Frontend Pages Updated:** 45+ (MFG, FX, PMS, TMS, EMS)
**Total New Database Tables:** 40+

### 36. Critical Bug Fixes Applied (v2.6)
Applied fixes for CSS/styling, data display, and status issues identified in analysis:

**CSS/Styling Fixes:**
- `_global.scss` — Removed `overflow: hidden` from `.card` selector (was clipping icons and text, making them appear "small")
- `_global.scss` — Removed `.card.border-0, .card.shadow-sm` override block that neutralized Bootstrap utilities
- `_global.scss` — Increased `.x-small` from 0.72rem to 0.78rem, `.xx-small` from 0.65rem to 0.72rem
- `_global.scss` — Increased `.table thead th` font-size from 0.8rem to 0.82rem
- `_variables.scss` — Aligned `$body-size` to 0.9375rem (15px) and `$small-size` to 0.8125rem (13px) to match `_theme.scss`
- `table-themes.css` — Increased all 12 table theme header sizes from 0.62-0.66rem to 0.75rem; mobile body from 0.74rem to 0.8rem

**Data Display Fixes (Cache Invalidation):**
- Added `clearCache()` calls to 10 critical mutation pages (17 total calls): ApprovalCenter, AccessRequests, Settings, AdminSettings, UserRequests, RoleDashboard, ThemeAssignmentCenter, AddUser, LoanManagementPortal, LeaveApprovalCenter
- After every POST/PUT/PATCH/DELETE, the relevant cache is now invalidated before re-fetching

**Status Display Fixes:**
- Created `StatusMap.jsx` — centralized status configuration mapping 60+ backend status values (lowercase + Title Case) to colors, labels, and icons
- Updated `StatusBadge.jsx` to use StatusMap — now handles all statuses instead of just Win/Lose/In Progress
- Fixed `HrmsAttendanceCorrections.jsx` — approve/reject buttons now appear (were checking Title Case but backend returns lowercase)
- Fixed `TmsApprovalWorkflow.jsx` — status colors now match (was checking `'Under Review'` but backend returns `'in_review'`)
- Fixed `BiometricDevices.jsx` — replaced hardcoded green badge with proper per-status color mapping

**User Management UX:**
- `User.jsx` — Replaced "Empty ResultSet" empty state with two friendly states: "No Users Yet" (first time) with Add User CTA, and "No Matching Users" (search filter) with Clear Search + Add User buttons

**Verified:** `npm run build` passing (~21s)

### 34. Company Website — Premium Review Form & Polish (v2.5)
Applied across **both** marketing surfaces: `manage-core-website-react` (standalone, port 3001)
and the embedded `/website/*` site in `manage-core-frontend` (port 8061, builds into
`manage-core-backend/public`).
- **Premium review submission form** (`pages/Reviews.jsx`, both apps): the right-side
  `.mc-review-form-panel` is now a premium, sectioned experience —
  - Gradient top accent bar + icon-tile header (`.mc-review-form-head-icon`) + pulsing live
    status pill (`.mc-review-status i` with `mc-pulse-dot` animation).
  - Two numbered section cards (`.mc-review-sec` / `.mc-review-sec-n`): "About you"
    (name/role/company/email with icon-prefixed inputs) and "Your experience"
    (solution select, **interactive 1–5 star rating** `.mc-rating-star` with labels, textarea
    with live char counter that turns red at the 500 cap).
  - Consent card with bold title, branded submit row (`FiSend` button) + lock trust note.
  - Fully light/dark themed via `.mc-root[data-theme="dark"]` overrides.
- **Footer/navbar link fix**: `const W = "/"` + `` `${W}/products/...` `` produced
  `//products/...` protocol-relative URLs → `http://products/...`. Set `const W = ""` in both
  Footers and the frontend Navbar so links render as `/products/procurement`.
- **Dark-mode card text fix**: global `.mc-root h1..h6 { color: var(--ink-hi) !important }`
  (site.css:43, both apps) overrode the compare card heading colors — near-white `--ink-hi` on
  light cards was invisible in dark mode. Added `!important` to the `.mc-compare-win h3`
  overrides (website-react site.css 5308–5309; frontend site.css 5242–5243).
- **Client Login footer link** → `<a href="http://127.0.0.1:8061/login">Client Login</a>`
  (website-react Footer; frontend Footer keeps its own `/login` route link).
- **Palette consistency**: CTA gradients unified to deep blue `#0d246e` (CaseStudies.jsx:76,
  CompareDetail.jsx:88); cyan/magenta accents recolored to blue/purple (`.mc-pc-card-dot`
  `#a78bfa`, step badge gradient `#7c8ff8,#a78bfa`, `.mc-pc-card-foot svg` `#7c8ff8`,
  `.mc-f-nl-ok` blue).
- **Icon note**: `FiBuilding` doesn't exist in `react-icons/fi` — used `FiHome` for the
  company input instead.
- **Verified**: `npm run build` passing in both apps (~30s website-react, ~1m15s frontend).

### 33. Company Website — Enterprise Design Refinement (v2.4)
Applied enterprise-grade polish to the marketing site (route `/website/*`), continuing the
Xovo/Zylvoo-era design direction and pushing the dropdown + services + pricing surfaces further:
- **Services dropdown** (`Navbar.jsx`): replaced the small horizontal brochure-strip with a
  full-height **featured image panel** (`mc-drop-panel`) — background screenshot + layered dark
  gradient + brand radial glow, "Full services catalog" eyebrow pill, headline, live counts
  (`allServices.length` × `serviceCategories.length`), and a white **Download brochure** CTA
  (`ServicePdf.js`) with loading spinner and "Saved to downloads" success state. New `.mc-drop-panel*` CSS.
- **Services page hero** (`pages/Services.jsx`): badge pill, gradient hero title, dual CTAs, and
  a right-hand hero asset panel showing a dashboard screenshot + stats card with a
  `<Skeleton variant="stats">` fallback while the image loads. Added a **delivery stats strip**
  (4 animated KPI tiles via `Counter` + `mc-stats`) above the process section.
- **Quote form** (`components/ServiceComponents.jsx`): rebuilt on the app-wide `.mc-field` /
  `.mc-form-row` pattern — required markers, HTML5 validation, custom select arrow for budget,
  and a richer success state (icon ring, "what happens next" 3-step list, reset button). Added
  a gradient **"Free" badge** to the form-card header and a `FiLock` trust note.
- **Pricing page** (`pages/Pricing.jsx`): replaced the plain 4-column table with an
  **enterprise comparison matrix** (`mc-compare-*`): sticky first column, tier headers with
  gradient icon + name + "who it's for" + price + full-width CTA, featured "Growth System"
  column with brand-gradient header + "Most chosen" ribbon + brand-tint body, 10 comparison rows
  with green check chips, gradient price text, mute–dash for n/a, and row-hover highlight.
  Horizontal scroll on mobile; graceful below 880px.
- **Pricing page — detailed pricing for every service & product**: added a **Products &
  platforms** section with detailed 3-tier pricing (Starter/Growth/Enterprise + CTAs) for all 5
  products — pricing stored on each `coreProducts` entry in `productsData.js` (`product.pricing`),
  rendered via new `mc-product-price-*` blocks. Added a **service price catalog** covering every
  service (60+) grouped under its 8 `serviceCategories`, with category anchor chips (`mc-cat-chip`)
  and per-service price cards (`mc-svc-price-*`) showing Starter / Growth / Enterprise prices in
  a 2-col grid. New **price engine** `serviceTierPricing(service)` in `pricingData.js` resolves
  real indicative prices from per-category bands, per-service overrides (aligned with the 8
  `/pricing/:slug` guides), and a fallback band; it now powers the pricing page, the service
  package cards (`ServiceComponents.jsx`), and the brochure PDF (`ServicePdf.js`), removing all
  `[Edit — e.g. $2,500]` placeholder prices site-wide.
- **Docs:** created `COMPANY_WEBSITE.md` (architecture, design system, full pricing-page
  breakdown, inspiration from `Design Concepts/`, remaining tasks); updated `PROJECT_STATUS.md`
  (v2.4, site status row, changelog) and `TODO.md` (website backlog + completed v2.4).
- Verified: eslint clean; `npm run build` passing.

### 32. Company Website — Conversion & Trust Improvements (inspired by sdipresence.com + flowly.lu)
Analyzed SDI Presence (enterprise IT services) and Flowly (Luxembourg workflow automation agency) and applied their strongest conversion/trust patterns to the Manage Core company site:
- **Named 3-step audit path (Flowly)** — New "How we start" section on Home: `30-Minute Workflow Audit (Free)` → `Custom Automation Engine (Scoped)` → `Live Dashboard & Optimization (Ongoing)`, mirroring Flowly's Bottleneck Blueprint Audit model, with a "Book your 30-minute audit" CTA.
- **Money-back / risk-reversal guarantee (Flowly)** — New guarantee band: "If we don't recover 10+ hours of manual work per week in the first month, we keep building for free until we do." plus "Talk to an expert" CTA.
- **Newsletter capture (SDI)** — Added a newsletter band to the Home blog-preview section and a "Stay Connected" newsletter form to the footer (email state + success confirmation).
- **Case studies as proof cards (SDI)** — Replaced the single featured case-study band with a 3-card grid: image, industry badge, headline, 3 metric tiles, and "Read more" linking to `/website/case-studies/:slug`.
- **Direct "Talk to an expert" CTAs** — Added a hero tertiary link (`FiClock`) and a navbar phone call link (`FiPhoneCall`, tel:+923190782328).
- **Expanded SEO (Flowly/SDI)** — `Seo.jsx` now injects an Organization + WebSite JSON-LD graph and a homepage FAQPage schema; `applyMeta` adds og:url, og:image, twitter:card/title/description/image.
- **CSS** — New styles in `site.css`: `.mc-audit-*`, `.mc-guarantee`, `.mc-cs-*`, `.mc-newsletter-band`, `.mc-footer-newsletter`, `.mc-hero-call`, `.mc-nav-call`.
- Verified: `eslint src/pages/company` clean; `npm run build` passes.

### 31. Company Marketing Website — Lint Cleanup & Build Verified
- Fixed 8 eslint errors across the company site (`src/pages/company/site/`):
  - Removed unused image imports (`payrollShot` in Pricing, `erpShot` in SolutionDetail/Solutions, `cloudShot` in Technologies)
  - Removed unused state (`openFaq`/`setOpenFaq` in SolutionDetail)
  - Fixed undefined `FiTrash` in Tickets (uses `FiTrash2`)
  - Fixed duplicate `text` key in the `hr` AI agent entry in `siteData.js`
- `eslint src/pages/company` now clean (0 errors)
- Full `npm run build` verified passing (~42s; only pre-existing chunk-size warnings)

### 30. ERP Inventory Feature Parity + AI Chat Streaming
- **ERP Inventory Service (7 files)** — ErpUoms, ErpWarehouses, ErpProductCategories, ErpStockMovements, ErpStockTransfers, ErpInventoryValuation rewritten; ErpProducts upgraded incrementally. Each page now matches the ErpQuotations feature set: searchable `ErpDataTable`, KPI cards (`ErpKpiCard`), view/preview modal, edit navigation via `setEditDocument`, `DeleteConfirmDialog`, Draft/Active toggle (`faFileSignature`), card/table view toggle, export dropdown (PDF/DOCX/Word/Excel/CSV), and live-refresh listeners (`erp:refresh` / `app:minor-refresh`).
- **ErpAddWarehouse.jsx** — Form now mirrors every warehouse table column (Code, Name, Type, City, Location Head, Email, Phone, Max/Current Capacity PLT, Status). Edit mode reads `editDocument` (documentType `warehouse`) and pre-fills the form (title/submit become "Update Warehouse").
- **AI Chatbot — root cause fixed**: every configured OpenRouter model was retired (e.g. `google/gemini-2.0-flash-exp:free` → "No endpoints found"). Replaced frontend `OPENROUTER_MODELS` and backend `config/ai.php` with verified working free models (`openrouter/free`, `google/gemma-4-26b-a4b-it:free`, `openai/gpt-oss-20b:free`, `nvidia/nemotron-3-super-120b-a12b:free`).
- **AI Chat latency — SSE streaming**: backend was non-streaming (user waited for the full completion). Added `AiService::streamChat()` (pass-through of OpenRouter SSE) + `AiChatController::chat` `stream` branch (org quota enforced, usage logged from the final chunk). Frontend `sendMessage` now streams via the proxy (`fetch` + `ReadableStream` + SSE parsing) and falls back to direct OpenRouter SDK streaming; default `selectedModel` → `openrouter/free`; backend `.env` configured with `OPENROUTER_API_KEY`; `AiService` rotates fallback models when the primary fails; 429 quota errors preserved; 120s request timeout; stream accumulator reset per model.
- **Verified**: backend streamed real SSE chunks + `[DONE]` + usage via tinker; `php -l` clean; frontend eslint clean for the 7 pages and `AiChatContext.jsx` (only pre-existing `react-refresh` rule). Full build still blocked by unrelated pre-existing syntax errors in ErpChartOfAccounts.jsx / ErpOpeningBalances.jsx (not touched this session).

### 29. AMS Inventory Service — Premium UI/UX Upgrade (7 Tabs)
- **Files upgraded (7):** ErpProducts.jsx, ErpProductCategories.jsx, ErpUoms.jsx, ErpWarehouses.jsx, ErpStockMovements.jsx, ErpStockTransfers.jsx, ErpInventoryValuation.jsx
- Applied same premium glassmorphism pattern as the previous AMS upgrade:
  - Premium headers with gradient accent bar and live-dot indicator
  - Glass-card wrapping on all panels, tables, filters, and modals
  - Premium KPI cards with AnimatedCounter and MiniSparkline sparkline charts
  - Premium tables with gradient headers, hover effects, and premium badges
  - Entry animations (enter-anim) on KPI row widgets
  - Glass-card modals with backdrop blur overlays
  - Section-header accent bars on card titles
- ErpProducts — also upgraded the product detail slide-over panel with glass-card styling and premium sub-tab navigation
- No business logic, state management, API calls, or event handlers were modified

### 28. AMS/ERP Module — Premium UI/UX Upgrade (15 Tabs)
- **Files modified (15):** ErpDashboard.jsx, ErpCustomers.jsx, ErpCustomerReceipts.jsx, ErpCreditNotes.jsx, ErpDeliveryChallans.jsx, ErpGoodsReceipts.jsx, ErpPurchaseOrders.jsx, ErpPurchaseRequisitions.jsx, ErpPurchaseReturns.jsx, ErpRfqs.jsx, ErpSalesInvoices.jsx, ErpSalesReturns.jsx, ErpVendorBills.jsx, ErpVendorPayments.jsx, ErpVendors.jsx
- Applied consistent premium glassmorphism pattern across all AMS tabs:
  - **Premium header** with gradient accent bar (indigo→purple→pink), live-dot pulsing indicator, heading icon, and buttons kept on same line
  - **Glass cards** (`glass-card` class) with `backdrop-filter: blur(24px)` on all panels, tables, and modals
  - **Premium cards** (`premium-card` class) with hover lift effects on KPI stat cards
  - **Premium tables** (`premium-table` class) with gradient headers, uppercase labels, hover border-left accent, alternating row colors
  - **Entry animations** (`enter-anim` class) with staggered fade-slide-up on widgets
  - **Consistent theme** with dark/light mode support across all components
  - **Standardized inline `<style>` tag** pattern with CSS custom properties
- No business logic, state management, API calls, or event handlers were modified

### 27. Account Deletion Request Workflow (Settings → Admin Approval)
- **Files modified (3):** `Settings.jsx`, `AdminSettings.jsx`, `ApprovalController.php`
- **Problem:** The deletion tab in both settings pages used only local mock state. Requests were never persisted and admin approval/rejection did nothing.
- **Fix:** Replaced local state with API calls:
  - `Settings.jsx` (lines 31–36, 397–530): `deletionRequests` changed from mock data to state initialized as `[]`. Added `fetchDeletionRequests()` via `client.get('/approvals', {params: {type: 'deletion', view: 'admin'}})`. User submission form now POSTs to `/approvals`. Admin approve/reject buttons PATCH `/approvals/{id}` with status `approved`/`rejected`.
  - `AdminSettings.jsx`: Same changes as Settings.jsx.
  - `ApprovalController.php` (lines 155–161): Added deletion handler — when a deletion-type request is approved, the approvable User is hard-deleted. This runs before the generic status-update-on-approvable block, so deleted users don't cause redundant UPDATE queries.

### 26. TmsEditor — Simplified to Document Center Only
- **Files:** `manage-core-frontend/src/pages/systems/TMS/TmsEditor.jsx` (725 → 31 lines)
- Removed all editor state (selectedFile, fileContent, fileFormat, editorMode, dirty, saving, leftOpen, zoomLevel, showViewer, docContent, docView, selectedProject, projects, attachments, loading)
- Removed sub-components: SpreadsheetEditor, CodeEditor, RichTextEditor, FilePreview
- Removed dependencies: xlsx, @fortawesome/fontawesome-svg-core, all API imports
- TmsEditor is now a clean wrapper rendering `<TaskDocumentCenter />`

### 25. TaskDocumentCenter — Enterprise Document Management
- **File created:** `manage-core-frontend/src/pages/systems/TMS/TaskDocumentCenter.jsx` (667 lines)
- **Modified:** TaskDetailModal.jsx (Documents tab renders TaskDocumentCenter)
- Dashboard: 8 KPI cards with trend indicators, gradient icons, progress bars, hover lift
- Library: Grid/List/Table modes, search bar, category pills, file-type badges, pagination
- Document viewer: 6-tab panel (Preview, Comments, Versions, Approvals, Details, Share)
- Version control, approvals, comments, share modal, upload modal with drag & drop

### 24a. TMS Timeline — Week/Month/Year View Modes
- **File:** TmsTimeline.jsx
- Added Week/Month/Year view toggle with range selector
- Dynamic columns, smart gap widths, today highlighting
- Pure JavaScript Date arithmetic — no date library

### 24b. TMS Viewer Components — Professional Document Viewers
- **Files created (4):** SpreadsheetViewer.jsx, PresentationViewer.jsx, TextViewer.jsx, WordViewer.jsx
- Each viewer supports zoom via searchPlus/searchMinus icons
- FontAwesome fix: faZoomIn/faZoomOut → faSearchPlus/faSearchMinus

### 23. Modules & Permissions — Full FEATURE_REGISTRY Coverage
- **Files:** Modules.jsx (rewrite), Permissions.jsx (rewrite)
- Both pages now use FEATURE_REGISTRY with all 6 systems (PMS, HRMS, FMS, TMS, DMS, CRM)
- System filter pills, expandable trees, Enable/Disable all per system

### 22. Multi-Branch / Consolidation Module
- **Files created (4):** BranchDashboard.jsx, BranchList.jsx, InterBranchTransfers.jsx, ConsolidationRuns.jsx
- **Modified:** Common.jsx (sidebar), SuperAdminDashboard.jsx, ModuleContentRenderer.jsx
- 12 branch types, 7 org types, currency conversion, status badges

### 21. Translations — Full Coverage Across 5 Languages
- **File:** translations.js
- +700 missing entries across Spanish (+169), French (+251), German (+241), Arabic (+267)
- Fixed Arabic section where ~55 keys had German text
- All 5 languages now have full key parity with English (535 keys)

### 20. Module Management — Dropdown Z-Index Stacking Fix
- **File:** ModuleManagement.jsx
- Added zIndex: 1 baseline, zIndex: 100 on open dropdown, overflow: visible

### 19. DMS "All Documents" Tab & Document Viewer Fixes
- Fixed backend 500 error on paginated lists (preview_url removed from $appends)
- Root-level documents now show in folder view
- Document Viewer loads documents on mount, fixed param names (query→search, perPage→per_page)

### 18. DMS File Download & Preview Fix
- **Files:** DmsController.php, DmsViewerController.php, DmsDocument.php, api.php, DmsDocuments.jsx, DmsDocumentViewer.jsx
- Storage disk: local → public (16 occurrences)
- New download/serve endpoints with audit logging
- Fixed blob extraction in handleDownloadDocument

### 17. DMS Document & Folder Listing Fixes
- **File:** DmsDocuments.jsx
- Fixed: All Documents tab never loaded, folder navigation didn't load sub-folders, folder parent override, owner filter param name

### 16. DMS Upload System Fix
- **Files:** dms.js, DmsDocuments.jsx
- Removed manual Content-Type header (stripped boundary param)
- Single FormData for file + metadata, proper tags[] format

### 15. DMS Central Database Migration
- **File created:** central migration for all DMS tables
- Tables: dms_documents, dms_folders, dms_templates, dms_audit_logs, dms_document_versions, dms_document_signatures, dms_document_approvals, dms_document_comments, dms_document_shares, dms_ai_analyses, dms_annotations, dms_discussions, dms_collaboration_tasks

### 14. Subdomain Routing & Login Redirect Fix
- **Files:** web.php, AppRoutes.jsx, TenantTable.jsx
- Subdomain root now serves SPA; unauthenticated users redirect to /login

### 13. CRM/ASST/INV Systems Set to 'In Building'
- **Files:** SystemsHub.jsx, WorkspaceLauncher.jsx, AdminDashboard.jsx, TopNavBar.jsx
- Cards render at 0.6 opacity + grayscale, not clickable, "Coming Soon" badge

### 12. Department Management — Full Enhancement
- **Files:** DepartmentManagement.jsx (rewrite, 900+ lines), hrms.js, DepartmentController.php, Department.php
- New DB fields: code, head_of_department, budget, location, status
- Edit modal, card view, enhanced table, CSV export, org chart, analytics

### 11. DMS Full Bug Audit & Fix (Round 2)
- **8 bugs fixed** across 7 files: missing imports, undefined variables, SQLite→MySQL, unused imports, invalid notification type

### 10. TaskDetailModal — Shared Board Click Handler Fix
- **File:** TmsSharedTaskBoards.jsx — TaskCard receives onTaskClick prop

### 9. Enterprise Task Detail Workspace (TaskDetailModal)
- **File created:** TaskDetailModal.jsx
- 820px slide-over panel, 15 tabs, time tracking, tags, file uploads

### 8. Theme Assignment Center — Full Rewrite
- **Files:** ThemeAssignmentCenter.jsx (rewrite), ThemeAssignmentController.php (6 new endpoints)
- Full CRUD, live preview, real API data, bulk assign, deployment lock

### 7. SuperAdmin Data Backup Export Fix
- **3 critical bugs fixed:** auth headers, blob download, SQL escaping

### 6. TMS Kanban Card File Preview
- **File:** TmsTasks.jsx
- Parallel attachment fetch, inline file badges, "+N more" overflow

### 5. TMS File Upload in Add Task
- **File:** TmsAddTask.jsx
- Drag-and-drop, multi-file, preview list, localStorage fallback

### 4. TMS Kanban Card Size & Scrollbar Improvements
- **File:** TmsTasks.jsx
- Larger cards (360px, p-4), custom purple gradient scrollbar

### 3. TMS Delete Task Confirmation Dialog
- **File:** TmsTasks.jsx
- window.confirm() → custom styled Modal

### 2. Default Storage Path Set to C: Drive
- **File:** ProjectFileStorage.php
- Path: `C:\ManageCore\Projects`

### 1. System Storage Moved to Data Backup Tab
- **Files:** AdminSettings.jsx, DataBackupCenter.jsx

### 0. DMS Enterprise Document Management System — Full Implementation
- **Frontend (13 pages):** Dashboard, Documents, Analytics, Storage, AI Intelligence, Collaboration, Approval Workflow, Signature Center, Security Center, Audit Logs, Templates, Archive Center, Document Viewer
- **Backend (7 models, 4 controllers, 1 migration):** 57 routes, 16 tables, 12 models
- **25+ new API functions** in dms.js

---

## Architecture

### Target Market
SMEs, Mid-Sized Businesses, Enterprises, Government, Service, Construction, Manufacturing

### Core Stack
- **Frontend:** React.js, Bootstrap 5, PWA
- **Backend:** Laravel API
- **Database:** MySQL
- **Deployment:** cPanel, Linux VPS

### Active Modules
| Module | Features |
|--------|----------|
| **HRMS** | Employee Management, Attendance, Leave, Payroll, Loans, Overtime, Recruitment, Asset Clearance, Documents, Onboarding, Exit |
| **PMS** | Projects, Milestones, Tasks, Teams, Productivity, Analytics |
| **TMS** | Tasks, Assignments, Timeline, Work Progress, Gantt, Document Center |
| **FMS** | Invoices, Expenses, Purchase Orders, Quotations, Vendors, Treasury, Budgeting |
| **DMS** | Storage, Documents, Version Control, E-Signatures, AI, Collaboration |

### Business Rules
- Employee codes: manually generated, immutable, used for biometric mapping, must remain unique
- Attendance priority: Biometric > GPS > QR > Selfie > Manual
- Payroll lock: locked payroll cannot be modified without authorized reopening
- Leave balance affects payroll calculations
- Assets must be cleared before employee exit

### Coding Standards
- Service-based architecture
- REST APIs
- Soft deletes enabled
- Audit logging enabled
- Tenant isolation mandatory
- Permission-based authorization

### Long-Term Vision
HRMS → PMS → TMS → FMS → CRM → DMS → Procurement → Inventory → Asset Management → BI → Executive Command Center → AI Automation
