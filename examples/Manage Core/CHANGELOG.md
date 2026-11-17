# Changelog — Manage Core

## v2.3 (ERP Inventory Feature Parity & AI Chat Streaming)

### Added
- **Backend: AI SSE streaming** — `AiChatController::chat` supports `stream: true`, returning a `text/event-stream` `response()->stream()`. Org quota enforcement applies to both streaming and non-streaming paths; usage is logged from the final SSE chunk.
- **Backend: `AiService::streamChat()`** — Passes OpenRouter SSE chunks straight through to the client, tracks text + usage, and rotates through the configured fallback models if a model fails to start.
- **ErpAddWarehouse.jsx edit mode** — Form reads `editDocument` (documentType `warehouse`) from context, pre-fills every field, switches title/submit to "Update Warehouse".

### Changed
- **ERP Inventory Service (7 files) — feature parity with ErpQuotations**: ErpUoms, ErpWarehouses, ErpProductCategories, ErpStockMovements, ErpStockTransfers, ErpInventoryValuation rewritten; ErpProducts upgraded incrementally. Each page now includes: searchable `ErpDataTable`, KPI cards (`ErpKpiCard`), view/preview modal, edit navigation via `setEditDocument`, `DeleteConfirmDialog`, Draft/Active toggle (`faFileSignature`), card/table view toggle, export dropdown (PDF/DOCX/Word/Excel/CSV), and live-refresh listeners (`erp:refresh` / `app:minor-refresh`).
- **ErpAddWarehouse.jsx — form/table parity**: every warehouse table column is now an input (Warehouse Code, Name, Type, City, Location Head, Email, Phone, Max/Current Capacity PLT, Status Active/Draft/Inactive). Submit sends all fields to `createWarehouse`.
- **AI model defaults** — Replaced all retired OpenRouter models with working free models in `AiChatContext.jsx` (`OPENROUTER_MODELS`) and `config/ai.php` (`default_model`, `fallback_models`, `models.*`): `openrouter/free`, `google/gemma-4-26b-a4b-it:free`, `openai/gpt-oss-20b:free`, `nvidia/nemotron-3-super-120b-a12b:free`.
- **AiChatContext sendMessage** — Streams through the backend proxy first (`fetch` + `ReadableStream` + SSE parsing) so tokens appear as generated; falls back to direct OpenRouter SDK streaming; default `selectedModel` changed to `openrouter/free`.

### Fixed
- **AI Chatbot unresponsive** — Every configured model was retired on OpenRouter ("No endpoints found for google/gemini-2.0-flash-exp:free"). Verified 17 live free models and wired the working ones into both frontend and backend.
- **AI Chat latency** — Backend proxy was non-streaming (user waited for the full completion). Streaming now renders text token-by-token.
- **AiService retry loop** — Retried the same dead model 3×; now rotates through the fallback model list when the primary fails.
- **Backend `.env`** — Added `OPENROUTER_API_KEY` (mirrored from frontend `VITE_OPENROUTER_KEY`); ran `config:clear` / `cache:clear`.
- **Frontend streaming bugs** — `fullResponse` accumulator reset per model attempt (no corrupted concatenation); 120s request timeout added; backend 429 (org quota) errors are surfaced instead of bypassed by the fallback.

### Verified
- Backend streaming returns real SSE chunks, `data: [DONE]`, and usage tokens (tinker test); `php -l` clean for `AiService.php` and `AiChatController.php`.
- Frontend: `eslint` clean for the 7 Inventory pages and `AiChatContext.jsx` (only the pre-existing `react-refresh` rule); the full `npm run build` shows no errors in these files (build blocked only by unrelated pre-existing syntax errors in `ErpChartOfAccounts.jsx` / `ErpOpeningBalances.jsx`).

## v2.2 (FMS/ERP Feature Parity & Functional Actions)

### Changed
- **ErpVendorLedgerSummary.jsx** — Full parity upgrade matching ErpCustomerLedgerSummary: `initialVendors` → `vendors` state, opening balance added to summary computation (5 KPI cards), functional Export dropdown (CSV/XLSX/DOCX/Word/PDF via brandedExport), `handleEdit` → `erp_add_vendor`, real delete (removes row) / move-to-draft (sets Draft status) mutating local state, AI Ledger Intelligence banner, per-row Edit/Draft/Trash actions
- **ErpPayablesAging.jsx** — `initialPayables` → `payables` state (computed list + vendorNames now depend on it), delete filters the row, `handleMoveToDraft` sets Draft status, Draft action button added, edit navigates to `erp_create_purchase_order`
- **Banking & Cash (4 files)** — ErpBankCashAccounts, ErpBankCashVouchers, ErpBankReconciliation, ErpBankTransfers: `handleMoveToDraft` now mutates local state to status `'Draft'` instead of showing a notification stub
- **Budget & Cost Centers (4 files)** — ErpCostCenters, ErpBudgetPlans, ErpBudgetVsActual, ErpBudgetAlerts: delete now filters local state + trash notification, move-to-draft mutates status; ErpBudgetPlans edit now opens the inline add modal on `erp_budget_plans` instead of navigating to the nonexistent `erp_create_budget_plan` tab
- **ErpCreditNotes.jsx** — Raw `<table>` replaced with `ErpDataTable` (searchable, registry title, loading/error/empty states); actions column with View/Edit/Draft/PDF/Audit/Trash buttons; removed unused faSearch/faFilter imports
- **ErpSalesInvoices.jsx** / **ErpSalesOrders.jsx** — Added AI Intelligence banner cards above the data tables
- **Purchase module (7 files)** — ErpPurchaseOrders, ErpPurchaseRequisitions, ErpPurchaseReturns, ErpVendors, ErpRfqs, ErpVendorBills, ErpVendorPayments: DeleteConfirmDialog standardized to "Move to Trash" / "...restore it later from Accounting Trash" wording; ErpVendors move-to-draft mutates vendor state

### Verified
- `erp_create_purchase_order` renderer case exists in ModuleContentRenderer.jsx (ErpPayablesAging edit target)
- No `ErpCreateBudgetPlan` component exists, so ErpBudgetPlans edit stays on-page via the inline modal
- Frontend build passes cleanly (`npm run build`, ~41s)

## v2.1 (AMS Standardization & Backend Alignment)

### Added
- **Backend: AssetCategoryController** — Full CRUD controller for asset categories (index, store, show, update, destroy)
- **Backend: Asset destroy method** — Added `destroy()` to AssetController for DELETE `/assets/{id}`
- **Backend: Asset category routes** — `Route::apiResource('asset-categories', AssetCategoryController::class)` in erp.php
- **Frontend API: Asset functions** — Added `getAsset(id)`, `deleteAsset(id)`, `deleteAssetCategory(id)` to enterprise.js
- **EditDoc pattern across AMS** — All 6 AMS listing pages now use `setEditDocument` for edit navigation (replaced localStorage/sessionStorage)
- **EditDoc pattern on create pages** — 7 AMS create/edit forms now read `editDocument` from context and support edit mode (ErpAddAsset, ErpAddAssetCategory, ErpAddAssetLocation, ErpCreateRfq, ErpAddVendor, ErpRunDepreciation, ErpDisposeAsset)

### Changed
- **ErpFixedAssets.jsx** — Removed 170 lines of hardcoded mock data, now fetches from `listAssets()` API with loading/error states
- **ErpAssetCategories.jsx** — Removed 60 lines of hardcoded mock data, now fetches from `listAssetCategories()` API
- **ErpAssetLocations.jsx** — Removed 60 lines of hardcoded mock data, now fetches from `listAssetLocations()` API
- **ErpAssetDepreciation.jsx** — Removed 60 lines of hardcoded mock data, now fetches from `listAssetDepreciations()` API
- **ErpAssetDisposals.jsx** — Removed 55 lines of hardcoded mock data, now fetches from `listAssetDisposals()` API
- **ErpAssetBookValueReport.jsx** — Removed 50 lines of hardcoded mock data, now derives report from `listAssets()` API
- **ErpPayablesAging.jsx** — Added missing `confirmLabel` prop to DeleteConfirmDialog
- **ErpCreditNotes.jsx** / **ErpCustomerReceipts.jsx** — Added `?.` optional chaining to `setEditDocument`/`setActiveTab` for consistency
- **ErpImportBankStatement.jsx** — Removed unused `ErpPageShell` import

### Fixed
- **ErpPayrollHrIntegration.jsx** — Fixed parse error: `DeleteConfirmDialog` was placed outside root `<div>` (JSX two-root-elements error)
- **ErpPayrollHrIntegration.jsx** — Replaced 2 `confirm()` calls with `DeleteConfirmDialog` component
- **7 files: localStorage → setEditDocument** — ErpAssetLocations, ErpAssetDisposals, ErpFixedAssets, ErpAssetCategories, ErpRfqs, ErpVendors, ErpAssetDepreciation all migrated from `localStorage.setItem('edit_item')` to `setEditDocument` pattern

## v2.0 (Enterprise Expansion)

### Added
- Account Deletion Request workflow: users submit deletion requests via Settings, admins approve/reject in the same tab
- Backend: ApprovalController deletes the user when a `deletion`-type request is approved
- Settings.jsx & AdminSettings.jsx: local mock state replaced with real API calls to `/approvals`
- Multi-Branch / Consolidation module (4 pages)
- Enterprise Task Detail Workspace (15-tab slide-over panel)
- TaskDocumentCenter with 4 professional viewers (Spreadsheet, Presentation, Text, Word)
- Week/Month/Year view modes for TMS Timeline
- DMS Enterprise module: 13 frontend pages, 5 backend controllers, 57 routes
- Translation coverage for 5 languages (535 keys each)
- Department Management: edit modal, card view, CSV export, analytics
- Theme Assignment Center: full CRUD, live preview, bulk assign
- Dependency type selection (FS/FF/SS/SF) in TMS dependency graph

### Improved
- AMS/ERP module: 15 tabs upgraded with consistent premium glassmorphism UI (glass cards, premium tables, gradient headers, entry animations) — ErpDashboard, Customers, CustomerReceipts, CreditNotes, DeliveryChallans, GoodsReceipts, PurchaseOrders, PurchaseRequisitions, PurchaseReturns, Rfqs, SalesInvoices, SalesReturns, VendorBills, VendorPayments, Vendors
- AMS Inventory Service: 7 tabs upgraded with premium glassmorphism UI — ErpProducts, ErpProductCategories, ErpUoms, ErpWarehouses, ErpStockMovements, ErpStockTransfers, ErpInventoryValuation
- ErpSettings.jsx: Fixed header layout so heading and action buttons stay on one line
- TmsEditor simplified to Document Center wrapper
- Modules & Permissions pages rewritten with FEATURE_REGISTRY
- TMS Kanban: larger cards, custom scrollbar, file preview badges
- Admin panel: System Storage moved to Data Backup tab
- Default storage path: `C:\ManageCore\Projects`
- SuperAdmin Backup Export: 3 critical auth/data bugs fixed

### Fixed
- DMS upload: missing boundary param, orphaned files, folder_id/tags validation
- DMS listing: All Documents tab not loading, folder navigation bugs
- DMS file download: wrong storage disk (local→public), blob extraction fix
- DMS pagination: preview_url causing 500 errors on large lists
- DMS Document Viewer: empty on mount, wrong param names
- Shared Boards TaskCard: detail modal not opening
- Notification type: `'error'` → `'danger'` across 9 DMS files
- Module Management dropdown z-index stacking

## v1.0 (Enterprise Foundation)

### Added
- User Management
- Role Management
- Project Management
- Task Management
- Leave Management
- Loan Management
- Attendance Management
- Asset Management
- Reports
- Notifications

### Improved
- Permission Controls
- Dashboard Performance

### Fixed
- Authentication Issues
- Report Export Issues
