# ManageCore INV + POS Master Tab Specification

**Status:** Implementation contract  
**Scope:** Every visible INV and POS workspace tab  
**Architecture:** Independent systems with optional asynchronous integration  

This document is the page-level contract for implementation. It is intentionally more
detailed than `INVENTORY_POS_ARCHITECTURE.md`. A tab is not complete when a route and a
table exist; it is complete when its lifecycle, permissions, audit behavior, API, failure
handling, and test coverage are implemented.

## 1. System relationship map

```text
INV internally:
Products -> Warehouses -> Stock -> Movements -> Transfers
         -> Counts -> Adjustments -> Valuation -> Reports

POS internally:
Products -> Cart -> Sale -> Payment -> Receipt
         -> Session -> Cash -> Reconciliation -> Reports

Optional connection:
POS Completed Sale -> Integration Event -> Queue -> INV Stock Movement
INV Product/Stock Event -> Queue -> POS Catalog Projection
```

The following boundaries are mandatory:

```text
POS does not depend on INV.
INV does not depend on POS.
POS does not directly access INV tables.
INV does not directly access POS tables.
INV and POS do not directly access AMS, FMS, HRMS, PMS, CRM, TMS, DMS, MFG, FX, or EMS.
```

Authentication, tenant resolution, permission primitives, audit infrastructure,
notifications, and queues may be shared platform capabilities. Business records,
models, services, and transactions remain system-owned and communicate only through
versioned optional integration contracts.

## 2. Universal page contract

Every list, detail, and work-form page must provide only actions valid for the record
type, status, role, permission, tenant, branch, store, register, and payment state.
Actions are calculated by the backend and returned to the frontend; the frontend must
also hide unavailable actions.

### Universal list behavior

Every appropriate list includes:

- KPI cards: total, active/open, pending, completed, exception, and financial totals
- Search across identifier, name, barcode, reference, customer/supplier, and status
- Server-side filtering, sorting, pagination, date range, branch/store, and status
- User-controlled column visibility with safe default columns
- Export of the filtered result, with permission and audit logging
- Row selection, selection count, select-all-current-page, and safe bulk actions
- Empty, loading, validation, unauthorized, offline, and error states
- View action menu instead of a row full of buttons
- Activity/history entry point and audit information

### Universal detail behavior

Every detail page includes:

1. Overview: identifier, status, owner, scope, dates, totals, and primary actions
2. Related records: links to children, source documents, and downstream records
3. Documents and attachments
4. Notes and comments
5. Activity timeline with actor, timestamp, action, old value, and new value
6. Audit panel with IP/device metadata where permitted
7. API-backed refresh and conflict/error state

### Universal lifecycle

```text
Draft -> Submitted -> Pending Approval -> Approved -> Completed -> Archived
                 \-> Rejected
Draft/Submitted/Pending -> Cancelled
Completed -> Voided / Reversed / Refunded where business rules permit
```

Draft records have a unique identifier, `created_by`, `updated_by`, timestamps, status,
resumable form data, and activity history. Completed financial records are immutable.

### Universal data and audit fields

Business tables should include `id`, `tenant_id`, branch/store scope where applicable,
status, `created_by`, `updated_by`, `created_at`, `updated_at`, and `deleted_at` when
soft deletion is allowed. Audit records additionally include action, actor, reason,
before/after payload or changed fields, IP/device, request ID, and timestamp.

### Universal permissions

Use the existing permission registry and adapt names to its conventions:

```text
pos.view/create/edit/delete/archive/restore/duplicate/approve/reject/cancel
pos.print/export/import/return/refund/void/discount/discount.override/payment
pos.cash.adjust/session.open/session.close/reconciliation
inv.view/create/edit/delete/archive/restore/duplicate/approve/reject/cancel
inv.print/export/import/stock.adjust/stock.transfer/count.approve/valuation
```

Authorization is enforced in routes, policies/services, and database scope queries.

### Universal implementation pipeline

```text
Frontend action
 -> API endpoint
 -> authentication and permission policy
 -> request validation
 -> domain service
 -> database transaction and row locks
 -> audit event
 -> notification/event dispatch
 -> response containing current record and available actions
```

## 3. INV tab specifications

### 3.1 INV Dashboard

**Purpose and users:** Inventory health command center for inventory managers, warehouse
managers, purchasing users, auditors, and executives. It solves delayed visibility into
quantity, value, expiry, and operational exceptions.

**Cards and trends:** Total products, active products, total quantity, inventory value,
low stock, out of stock, expiring, expired, pending transfers, open counts, today's
receipts/issues, fast/slow/dead stock, stock value by warehouse, movement trend, and
valuation trend.

**Quick actions:** Create product, receive goods, transfer stock, adjust stock, start
count, export report, resolve alert. Cards link to filtered source tabs.

**Table and controls:** Recent movements columns are movement number, date/time, type,
product/SKU, batch/serial, warehouse/location, quantity, unit cost, source, actor,
status, and actions. Server search, date/warehouse/type/status filters, sorting,
pagination, export, print, and column visibility are required.

**Actions:** View, refresh, filter, export, print, customize dashboard. No destructive
dashboard action. Dashboard preferences are saved per user.

**Data and APIs:** Read-only aggregates from INV products, stock, movements, transfers,
counts, alerts, and cost layers. `GET /api/v1/inventory/dashboard` and report endpoints.

**Notifications and edge cases:** Show stale-data, failed-job, negative-stock, expiry,
and permission warnings. A failed analytics job must not display a successful-looking
metric; show its last-known timestamp and error state.

**Tests:** KPI authorization, tenant/branch filters, date calculations, zero-data,
failed-job, export permission, and dashboard-to-record navigation.

### 3.2 INV Catalog

**Purpose and users:** Manage INV-owned product identity used by purchasing, warehousing,
stock, WMS, and INV fulfillment. It prevents duplicate SKU/barcode identity and unsafe
archiving.

**Cards:** Total, draft, active, inactive, archived, stockable, batch-controlled,
serialized, and products missing barcode/cost/reorder policy.

**Table columns:** Product ID, SKU, name, type, category, brand, unit, barcode count,
stock policy, status, variants, last updated, creator, and actions. Search by name/SKU/
barcode; filter type/category/brand/status/stock control; sort, paginate, export, import,
bulk activate/deactivate/archive/restore/export.

**Actions:** Create, view, edit draft/inactive, duplicate, archive, restore, activate,
deactivate, import, export, print, bulk actions. Delete only an unused draft with no
dependent variants, stock, purchasing, or ledger history.

**Form fields:** Name required text; SKU required unique text; product code optional text;
type required select; category/brand/unit sourced from INV masters; description rich text;
tax profile optional INV tax reference; stockable/batch/serial flags boolean; reorder
policy optional; cost method select; status controlled select; images/files optional.
Conditional batch fields require lot/expiry policy; serial fields require serial policy.

**Detail:** Overview, variants, barcodes, prices/costs, stock by warehouse, purchasing
history, movements, documents, notes, activity, audit. Creating or archiving emits
INV product events only when integration is enabled.

**Database/API:** `inv_products`, `inv_product_variants`, `inv_product_barcodes`,
`inv_product_images`, `inv_product_audit_logs`; `GET/POST/PATCH /api/v1/inventory/products`,
archive/restore/duplicate/import/export endpoints. Unique tenant-scoped SKU/code.

**Rules/tests:** Historical products cannot hard-delete. Test duplicate SKU, dependent
history, archive/restore permission, conditional fields, import errors, audit, and
tenant/branch isolation.

### 3.3 INV Product Variants

**Purpose/users:** Maintain size, color, model, pack, SKU, barcode, dimensions, and
variant-specific stock identity for catalog and warehouse teams.

**Cards/table:** Total, active, archived, missing barcode, and duplicate-risk counts.
Columns parent product, variant name, attributes, SKU, barcode, unit, weight, dimensions,
status, stock quantity, and actions. Search/filter parent/status/attribute; paginate,
export, bulk activate/deactivate/archive.

**Form:** Parent product required; attribute values required from product attributes;
SKU and barcode unique; weight/dimensions optional numeric; status controlled. Auto-generate
SKU/barcode only when configured, with collision validation.

**Actions/detail/data:** Create, view, edit while not posted, duplicate, archive, restore,
activate/deactivate, delete only unused draft. Detail links stock, batches, serials,
prices, movements, and history. Uses `inv_product_variants` and related barcode/
attribute tables. Tests cover parent archive, SKU collision, historical protection,
and concurrent edits.

### 3.4 INV Categories, Brands, Units, Attributes, Bundles, Barcodes, SKUs, Images

These catalog tabs share the catalog list contract but have the following specific rules:

| Tab | Purpose and fields | Business rules and actions | Data/API |
|---|---|---|---|
| Categories | Hierarchical name, code, parent, description, image, sort order, status | Prevent deleting a category with products/children; archive/restore, duplicate, activate/deactivate, import/export | `inv_categories`; tree and descendants endpoints |
| Brands | Name, code, manufacturer, website, description, logo, status | Prevent hard delete when products reference it; archive/restore, duplicate, import/export | `inv_brands` |
| Units of Measure | Code, name, type, base unit, conversion factor, decimal precision, status | Base units cannot be deleted when used; validate positive conversion and cycles | `inv_units`, `inv_unit_conversions` |
| Product Attributes | Name, code, data type, allowed values, required flag, status | Attribute type changes are blocked when variants use it | `inv_product_attributes`, values |
| Bundles/Kits | Name, SKU, components, quantities, pricing rule, stock behavior, status | Component availability and circular bundle references are validated | `inv_bundles`, `inv_bundle_items` |
| Barcodes | Barcode, type, product/variant, pack quantity, source, status | Tenant-scoped uniqueness; deactivate instead of deleting historical barcode | `inv_product_barcodes` |
| SKUs | SKU, product/variant, generated/manual flag, channel, status | Immutable once posted; duplicate checks and archival only | Product/variant SKU fields and mapping |
| Product Images | product/variant, file, alt text, sort order, primary flag, status | Validate file type/size; deleting primary image requires replacement | `inv_product_images`, storage references |

All have create/view/edit/duplicate/archive/restore/activate/deactivate/import/export
where applicable, safe delete for unused drafts, detail history, audit, and tests for
dependent records, duplicate identity, upload validation, and permission enforcement.

### 3.5 INV Warehouses and Locations

**Purpose/users:** Warehouse and operations users manage the physical hierarchy required
for stock custody, putaway, picking, counts, and transfers.

**Cards/table:** Warehouses by status, capacity, utilization, locations, blocked bins,
and stock value. Columns warehouse code/name, branch, address, manager, timezone,
location count, capacity, status, and actions. Location table columns warehouse, zone,
aisle, rack, shelf, bin, capacity, restrictions, status, and stock quantity.

**Actions/forms:** Create/view/edit/duplicate/archive/restore/activate/deactivate/export.
Warehouse fields code/name required, branch required, address/timezone/manager optional,
capacity and settings validated. Location fields hierarchy, code, type, capacity,
product/batch/serial restrictions, and blocked flag. Deleting a warehouse/location with
stock, movements, or open tasks is forbidden; archive or block instead.

**Data/API:** `inv_warehouses`, `inv_warehouse_locations`, zones/racks/bins tables;
CRUD, hierarchy, capacity, block/unblock, and availability endpoints.

**Interconnections:** Product stock belongs to warehouse/location; transfers, counts,
receipts, reservations, and WMS tasks reference locations. Tests cover hierarchy,
capacity, blocked destinations, concurrent assignments, and branch isolation.

### 3.6 INV Purchasing and Receiving

**Tabs:** Suppliers, Purchase Requisitions, Purchase Orders, Goods Receipt Notes,
Purchase Receipts, Supplier Returns, Purchase History.

**Purpose/users:** Purchasing officers, warehouse receivers, approvers, and auditors
control the source-to-stock flow and prevent unapproved or duplicate receiving.

**Universal lifecycle:** Draft -> Submitted -> Pending Approval -> Approved -> Partially
Received -> Received -> Archived; rejected/cancelled alternatives. Completed receipts
cannot be edited or deleted.

**Tables/KPIs:** Supplier count, open requisitions, pending approvals, open POs, due
receipts, received value, rejected quantity, and return value. Lists show document number,
date, supplier, branch, buyer, lines, requested/ordered/received/returned quantities,
subtotal, tax, total, currency, status, and actions. Search number/supplier/product;
filter dates/status/branch/approval; sort, paginate, export, print, and safe bulk
submit/approve/reject/cancel/export.

**Forms:** Supplier reference; requested/ordered lines with product, unit, quantity,
price, tax, warehouse, expected date; terms, currency, exchange rate, attachments,
reason, and notes. Receiving additionally requires received/rejected quantities, batch,
serial, expiry, inspection result, quarantine location, and discrepancy reason.

**Interconnections/data:** Purchasing records reference INV products, suppliers, tax,
warehouses, approvals, documents, stock movements, and cost layers. Goods receipt
posts through `InventoryStockService`, creates ledger movements and cost layers, and
emits an optional event. Suggested tables are `inv_purchase_requisitions`,
`inv_purchase_orders`, `inv_goods_receipts`, `inv_purchase_returns`, and line tables.

**APIs/tests:** CRUD plus submit/approve/reject/cancel/receive/return endpoints; policy,
validation, transaction, row locking, idempotency, over-receipt, partial receipt,
currency/tax, batch/serial, quarantine, duplicate retry, and failed-integration tests.

### 3.7 INV Stock, Movements, Transfers, Reservations, Adjustments

**Purpose/users:** Warehouse operators and inventory controllers manage quantity custody
without editing aggregate stock.

**KPIs/table:** Available, reserved, inbound, blocked, negative-risk, movement volume,
transfer pipeline, and adjustment variance. Columns movement/transfer number, timestamp,
type, product/SKU, batch/serial, source/destination, quantity, unit cost, reason, source
document, actor, status, and actions.

**Forms and actions:** Movement forms require product, warehouse/location, quantity,
unit/cost where applicable, type, reason, source reference, batch/serial, and notes.
Reservations require source order, quantity, expiry, and priority. Transfers require
source/destination, lines, requested date, approval, and receipt. Adjustments require
reason, evidence, approval, and variance. Actions include create draft, submit, approve,
reject, cancel, view, print/export; posted movements cannot edit/delete.

**Business logic:** Every posting is an immutable ledger movement. Reservation reduces
available, not on-hand. Transfer issue and receipt are separate movements. Adjustment
requires authorization and reason. Batch/serial/expiry/negative stock policies are
validated under row locks.

**Data/API:** `inv_stock`, `inv_stock_movements`, `inv_stock_transfers`,
`inv_stock_transfer_items`, `inv_reservations`, `inv_adjustments`, and ledger tables.
Service endpoints must be transactional and idempotent.

**Failures/tests:** Duplicate posting, insufficient stock, expired batch, blocked bin,
concurrent issue, partial receipt, cancellation after issue, permission violation,
and event outage tests are mandatory.

### 3.8 INV Counts, Batches, Serials, Expiry, Valuation, Control

| Area | Required page contract |
|---|---|
| Inventory/Cycle/Physical Counts | KPIs for open counts, variance, approval backlog; table count number, warehouse, scope, snapshot, counted, variance, status, owner; draft/submit/approve/reject/cancel/complete; count form scope, blind-count flag, counters, lines, physical quantity, reason; approval creates adjustment movements, never edits stock directly. |
| Count Sessions/Variances/History | Session and variance detail with expected, counted, difference, value, reason, approver, adjustment reference, timeline and audit; completed records immutable; export/print/reconcile actions. |
| Batch/Lot Tracking | Batch number, product, manufacture/expiry, supplier, quantity, cost, location, status; FEFO allocation, quarantine, release, expiry alerts; cannot delete a used batch. |
| Serial Tracking | Serial, product/variant, batch, lifecycle status, location, customer/warranty reference; unique identity, scan/search, assign, transfer, return, quarantine; sold serial cannot be reused. |
| Expiry Tracking | Expiring/expired/held quantities, days-to-expiry, value; filters by date/location/status; actions quarantine, approve disposal, export, notify; expiry never silently changes stock. |
| Valuation/Cost Layers | Value by warehouse/product/category, FIFO/weighted-average/standard cost, cost-layer table, adjustments, history; cost adjustment requires approval and creates an auditable valuation movement. |
| Reorder/Safety/Min-Max/Alerts | Rule fields product/location, reorder point, safety stock, min/max, lead time, supplier, active dates; alert table severity, trigger, quantity, expiry, status, resolution; acknowledge/resolve/reopen/export, with queued calculations. |

These areas use `inv_inventory_counts`, batch/serial, expiry, cost-layer, reorder, and
alert tables, with dedicated services/jobs and tests for calculations, locks, approvals,
FEFO/FIFO, expiry, and notification failure.

### 3.9 INV Reports, Import/Export, Settings, Administration

**Reports:** Stock, movement, valuation, aging, slow/fast/dead stock, variance,
warehouse, product, supplier, batch, serial, and expiry reports. Every report supports
view/filter/refresh/export/print/save/schedule where enabled. Saved reports support
create/edit/duplicate/archive/restore/delete/share with permission and audit.

**Import/export:** Product, stock, supplier, and opening stock imports require upload
validation, preview, row-level errors, dry run, permission, idempotency, import history,
rollback/reconciliation, and audit. Exports are filtered, paginated server jobs for large
sets and expose download status.

**Settings:** Inventory, product, warehouse, stock, valuation, batch, serial, barcode,
numbering, units, approvals, and notifications. Fields declare type, required status,
scope, validation, default, reset behavior, and effective date. Dangerous changes require
confirmation and audit.

**Administration:** INV roles, permissions, approval workflows, audit logs, activity
logs. Audit logs are view/search/filter/export/print only; never edit/delete/restore
through normal UI. APIs use policy middleware, services, jobs, events, and tests for
permission matrix, audit immutability, setting scope, and import failure recovery.

## 4. POS tab specifications

### 4.1 POS Dashboard

**Purpose/users:** Retail managers, cashiers, supervisors, and executives monitor sales,
payments, returns, registers, sessions, and cash without depending on INV.

**Cards/trends:** Today's sales, completed transactions, pending/failed payments,
returns, refunds, average order value, discounts, open registers, active sessions,
cash summary, hourly/daily/weekly/monthly sales, best sellers, payment mix, and
variance trend.

**Actions/data:** View, refresh, filter, export, print, customize dashboard. Cards link
to POS-owned lists. `GET /api/v1/pos/dashboard` must report data freshness and failures.
Tests cover standalone mode, store/register scope, empty data, permissions, and export.

### 4.2 POS Products, Categories, Variants, Prices, Price Lists

**Purpose/users:** POS catalog managers maintain the independent sellable catalog used
by checkout, pricing, promotions, and receipts.

**Product cards/table:** Total, draft, active, inactive, archived, missing price/barcode,
and store availability. Columns POS product ID, SKU, name, category, barcode, price,
tax profile, store scope, status, updated date, and actions. Search name/SKU/barcode;
filter category/store/status; sort/paginate/export/import and bulk activate/deactivate/
archive/restore/export.

**Forms:** Name, SKU, barcode aliases, category, variant attributes, description,
image, price list, base price, tax, store/branch scope, inventory policy (optional),
status, and effective dates. Required and uniqueness rules are server-side. Product with
historical sales cannot hard-delete; archive/deactivate instead.

**Prices:** Price, currency, effective from/to, price list, store/branch, channel,
tax-inclusive flag, reason, status. Lifecycle Draft -> Scheduled -> Active -> Expired ->
Archived. Prevent overlapping active prices for the same scope unless explicitly allowed.

**Data/API:** `pos_product_catalog`, `pos_product_barcodes`, `pos_product_variants`,
`pos_price_lists`, `pos_product_prices`, `pos_product_categories`, and POS audit tables.
POS APIs never query INV tables. Optional INV events update a mapped projection.

**Actions/tests:** Create/view/edit/duplicate/archive/restore/delete safe drafts,
activate/deactivate, import/export/bulk update/print. Test price precedence, effective
dates, duplicate SKU/barcode, store scope, archived checkout rejection, and outage
without INV.

### 4.3 POS Sales, New Sale, Draft Sales, Held Sales, Transactions

**Purpose/users:** Cashiers create sales; supervisors manage exceptions; managers audit
completed financial activity. This is the critical transaction workspace.

**KPI cards:** Today's Sales, Completed Transactions, Pending Payments, Returns, Refunds,
Average Order Value, discounts, tax, cash total, card total, and voids.

**Table columns:** Invoice/transaction number, date/time, customer, cashier, item count,
subtotal, discount, tax, total, payment status, sale status, store, register, session,
source (online/offline), and actions. Search number/customer/barcode/cashier; filter
date/status/payment/store/register/session; sort/paginate; export/print; bulk export
only for financial records.

**Draft actions:** View, edit, resume, submit/checkout, cancel, delete, duplicate, print.
Draft form stores cart lines, customer, discounts, tax, notes, terminal/session,
created/updated actors, and local/device ID.

**Completed actions:** View, print/download/email receipt, return, refund, permitted
void, duplicate, export, audit. No normal edit or delete.

**Sale form:** POS catalog line required; quantity, price resolved server-side; customer
optional; discount/tax/notes conditional; payment method and tender required at checkout;
register/session required; offline source fields auto-generated. Checkout recalculates
subtotal, discounts, taxes, total, payment allocation, and change.

**Detail/interconnections:** Summary, lines, discounts, taxes, payments, customer,
register/session, receipt, returns/refunds, integration events, notes, timeline, audit.
Sale -> customer (optional), register, session, payment, receipt, return, refund, and
optional INV synchronization.

**Data/API:** `pos_orders` or `pos_transactions`, `pos_order_lines`,
`pos_transaction_discounts`, `pos_transaction_taxes`, `pos_payments`, receipts, and
events. Endpoints include create draft, update draft, checkout, duplicate, cancel,
void, return, refund, receipt, export, and audit. All financial writes use transaction,
idempotency, row locks, and permission policies.

**Statuses:** Draft, Pending Payment, Partially Paid, Paid, Completed, Cancelled,
Voided, Refunded, Partially Refunded. Invalid transitions are rejected.

**Tests:** Server price authority, duplicate checkout, split tender, insufficient cash,
payment timeout, completed edit rejection, void permission/reason, partial return,
offline sync, tenant/store/register isolation, and optional integration outage.

### 4.4 POS Carts and Held Sales

**Purpose/users:** Cashiers pause and resume unfinished customer interactions.

**Cards/table:** Open carts, aging carts, carts by cashier/store, and expiring carts.
Columns cart ID, created/updated, cashier, customer, item count, estimated total, store,
terminal, session, expiry, status, and actions.

**Actions/forms:** Create, save draft, view, edit, resume, duplicate, cancel, delete,
restore within retention, convert to sale, print, export. Fields are cart lines,
customer, notes, terminal/session, hold reason, expiry, and local ID. Deleting a cart
must not delete a completed sale. Detail includes activity and conversion reference.

**Data/API/tests:** `pos_held_carts`, lines, history, soft-delete/retention fields;
create/update/resume/convert/delete/restore endpoints. Test concurrent resume, expired
cart, duplicate conversion, permission, and retention restore.

### 4.5 POS Payments and Payment Methods

**Purpose/users:** Cashiers, payment supervisors, and reconciliation users manage tender
without editing completed payment facts.

**Payment cards/table:** Pending, processing, paid, failed, cancelled, refunded,
partially refunded, reversed; columns payment ID, transaction, method, amount, currency,
provider/reference, status, attempt count, cashier, date/time, and actions.

**Actions:** View, create for a draft sale, retry, verify, refund, reverse, print,
export, audit. Completed payments cannot ordinary-edit/delete. Failed provider payment
may retry with same idempotency family and a new attempt record.

**Forms:** Method, amount, currency, tender, provider, provider reference, customer
optional, receipt preference, reason. Cash requires tendered/change; card/online may
require provider token/reference; split payment validates sum equals server total.

**Payment methods:** CRUD for POS-owned methods with name/code/type, fee, provider,
sort order, store scope, active dates, status, and configuration. Actions create/view/
edit/duplicate/activate/deactivate/archive/restore/delete unused method/reorder/import/
export.

**Data/API/tests:** `pos_payments`, attempts, refunds, reversals, `pos_payment_methods`;
payment intent/verify/retry/refund/reverse endpoints. Test timeout, duplicate charge,
partial refund, provider outage, permission, webhook verification, and reconciliation.

### 4.6 POS Returns, Refunds, Exchanges

**Purpose/users:** Cashiers initiate; supervisors approve; finance/retail managers
complete and audit customer recovery while protecting original sale integrity.

**Returns lifecycle:** Draft -> Submitted -> Pending Approval -> Approved -> Completed,
with Rejected/Cancelled. Refund lifecycle: Draft -> Pending -> Approved -> Processing ->
Completed, with Failed/Cancelled/Rejected and authorized Retry.

**Cards/table:** Pending returns, completed returns, refund value, failed refunds, and
aging. Columns return/refund number, original sale, customer, date, lines, quantity,
amount, reason, payment method, status, store, cashier, approver, and actions.

**Forms:** Original transaction/line, return quantity, reason, condition, batch/serial,
inspection result, restock/quarantine choice, refund method, amount, destination,
notes, attachments, and approval reason. Remaining quantity is calculated server-side.

**Actions:** Create/save draft/view/edit draft/submit/approve/reject/cancel/complete,
process/retry refund, print/export/audit. No delete completed return/refund. Completed
refunds use reversal or correction workflow, never ordinary delete.

**Interconnections/data:** Sale -> return -> refund/exchange; payment -> refund; optional
INV event -> stock decision. Tables `pos_returns`, return lines, `pos_refunds`,
refund attempts, `pos_exchanges`, reasons, and audit. Cash refund creates POS cash-out;
store credit creates POS credit; card refund waits for provider confirmation.

**Tests:** Partial return, duplicate submission, quantity race, serial mismatch,
failed provider retry, cash variance, approval separation, completed immutability,
stock shortage, and integration failure isolation.

### 4.7 POS Customers and Credits

**Purpose/users:** POS staff maintain local customer information when CRM is unavailable;
managers view purchase context and credit/store-credit balances.

**Table/form:** Customer ID, name, phone/email, group, tax details, consent, store scope,
status, balance, last purchase, and actions. Fields validate contact uniqueness per
tenant policy, consent, credit limit, and status. Actions create/view/edit/duplicate/
archive/restore/activate/deactivate/import/export/print; hard delete only without
financial history.

**Detail:** Profile, purchases, returns, payments, credits, store-credit ledger, notes,
documents, activity, audit. CRM mapping is optional and reference-based.

**Data/API/tests:** `pos_customers`, groups, credits, store-credit ledger, mappings;
CRUD/search/history/credit endpoints. Test CRM-disabled operation, duplicate contact,
privacy permissions, financial-history archive, and tenant/store scope.

### 4.8 POS Discounts, Promotions, Coupons, Loyalty

**Purpose/users:** Merchandising and managers define controlled pricing incentives;
cashiers apply only active eligible rules.

**Lifecycle:** Discount Draft -> Pending Approval -> Approved -> Active -> Expired/
Rejected/Archived. Promotion Draft -> Pending Approval -> Approved -> Scheduled ->
Active -> Paused/Expired/Cancelled/Archived.

**Table/form:** Code/name, type, value, products/categories, customer group, coupon
requirements, usage limits, remaining usage, stores, channels, date range, stacking
rules, approval owner, status, and reason. Validate date range, percentage bounds,
fixed amount, nonnegative margin policy, unique code, usage concurrency, and scope.

**Actions:** Create/view/edit/duplicate/activate/deactivate/pause/resume/archive/restore/
delete unused drafts/approve/reject/import/export/bulk. Coupon usage is atomic and
never exceeds limit. Loyalty points and gift/store credit operations require ledger
entries and reversal rules.

**Data/API/tests:** `pos_discount_rules`, `pos_promotions`, `pos_coupons`,
`pos_coupon_usages`, loyalty/credit tables; evaluate/apply/approve/pause endpoints.
Test stacking, expiry, usage race, override permission, refund allocation, and
offline restrictions.

### 4.9 POS Stores, Registers, Terminals, Cash Drawers

**Purpose/users:** Retail administrators configure physical POS topology and assignment.

**Lists/cards:** Stores by status, registers, terminals online/offline, drawers, open
sessions, and unassigned devices. Columns code/name, branch, address, manager, register/
terminal count, status, heartbeat, assigned drawer, and actions.

**Forms/actions:** Store fields code/name/branch/address/timezone/settings; register
fields code/store/currency/numbering/status; terminal fields device identity/register/
printer/scanner settings/status; drawer fields code/register, opening policy, threshold,
status. Actions create/view/edit/activate/deactivate/archive/restore/delete unused,
assign/unassign, reorder/export. Historical financial activity prevents deletion.

**Data/API:** `pos_stores`, `pos_registers`, `pos_terminals`, `pos_cash_drawers`,
assignments and heartbeats. Tests cover duplicate codes, assignment conflicts, offline
heartbeat, branch scope, active-session protection, and authorization.

### 4.10 POS Sessions, Shifts, Cash Management

**Purpose/users:** Cashiers operate registers; supervisors open/close and approve;
managers reconcile physical cash.

**Session actions:** Open session with opening cash/denomination snapshot; active session
supports view, cash in/out, cash drop, transfer, print; closed session supports view,
print, export, reconcile, audit. Closed sessions cannot normal-edit. Shift supports
create/view/edit while open/open/close/transfer/approve/reject/cancel/print/export.

**Cash movement table:** Movement ID, session/register/drawer, type, amount, tender,
reason, actor, approver, idempotency key, status, timestamp, and actions. Types are
cash in, cash out, drop, transfer, opening, closing, adjustment.

**Forms/rules:** Opening denominations, amount, reason, destination/source session,
approval reason, actual closing denominations. Expected cash equals opening plus POS
cash sales minus cash refunds plus approved movements. Non-cash tenders are excluded.
Safe-drop thresholds, session lock, one-open-session-per-terminal, row locks, and
idempotency are mandatory.

**Data/API/tests:** `pos_sessions`, shifts, cash movements, drawers, `pos_cash_ledger`,
denominations, transfers, variance approvals. Endpoints open/close/suspend/resume,
cash-in/out/drop/transfer, count, reconcile, reopen controlled. Test concurrent open,
duplicate movement, close with pending payment, variance approval, unauthorized reopen,
and terminal lock.

### 4.11 POS Reconciliation

**Purpose/users:** Supervisors and finance users compare expected and actual cash/payment
tenders and approve differences.

**Lifecycle:** Draft -> Submitted -> Under Review -> Approved/Rejected -> Completed.
Completed reconciliation cannot normal-edit.

**Cards/table:** Sessions awaiting reconciliation, cash variance, payment variance,
unsettled providers, and completed count. Columns reconciliation number, date, store,
register, session/shift, expected cash, actual cash, cash variance, non-cash totals,
provider variance, status, reviewer, and actions.

**Forms/actions:** Session/register/date, counted denominations, provider statements,
variance reason, attachments, reviewer notes. Actions create/view/edit draft/submit/
approve/reject/reopen/complete/export/print/audit. Completion posts approved adjustment,
never silently changes historical sales.

**Data/API/tests:** `pos_reconciliations`, lines, payment settlement references,
variance approvals; test arithmetic, duplicate completion, closed session protection,
provider mismatch, permissions, and audit.

### 4.12 POS Receipts

**Purpose/users:** Cashiers and customers access immutable proof of completed transactions.

**Table/detail:** Receipt number, sale number, date/time, store, register, cashier,
customer, total, payment status, delivery status, and actions. Detail includes rendered
receipt, items, taxes, discounts, payment, barcode/QR, delivery attempts, reprint
history, timeline, and audit.

**Actions:** View, print, download, email, SMS/share where supported, reprint, export.
No delete. Reprint requires permission/reason and creates audit. Receipt templates have
view/edit/duplicate/activate/deactivate/archive/restore with preview and test print.

**Data/API/tests:** `pos_receipts`, templates, delivery attempts; receipt generation
must be idempotent and linked to one completed sale. Test duplicate generation, printer
failure, email failure, privacy, reprint audit, and completed-sale immutability.

### 4.13 POS Reports, Import/Export, Settings, Administration

**Reports:** Sales, daily sales, product/category/cashier/store/register sales, payments,
tax, discounts, promotions, returns, refunds, voids, cash, profit where data is
available, customer sales, hourly and period trends, and best sellers. Every report
supports view/filter/refresh/export/print/save/schedule where supported. Saved reports
support create/edit/duplicate/archive/restore/delete/share.

**Import/export:** Product, customer, price, and coupon imports require preview,
validation, row errors, dry run, idempotency, import history, and audit. Sales and
transaction exports are read-only, filtered, permission-controlled, and generated as
jobs for large ranges.

**Settings:** POS/store/register/terminal/receipt/payment/tax/discount/return/customer/
barcode/printer/cash-drawer/numbering/notification settings. Each setting documents
type, scope, default, validation, effective date, reset behavior, and confirmation.

**Administration:** POS roles, permissions, approval workflows, cashier/discount/refund/
void permissions, audit logs, activity logs. Audit logs allow view/filter/search/export/
print only. APIs, services, jobs, events, and tests must cover permission matrices,
setting isolation, export authorization, and audit immutability.

## 5. Optional integration tabs

Integration must be a separate platform area, not a hidden dependency inside INV or POS.
Recommended tabs are Integration Dashboard, INV-POS Connection, Product Mapping,
Category Mapping, Warehouse-Store Mapping, Stock Synchronization, Sales Synchronization,
Return Synchronization, Integration Events, Sync Queue, Failed Syncs, Retry Queue, Dead
Letter Events, Integration Logs, and Integration Settings.

Each integration list follows the universal list/detail contract and supports view,
filter, search, export, retry/replay where authorized, and audit. It must never expose
direct cross-database editing.

**Event fields:** event ID, source, target, type, source reference, target reference,
tenant/branch, idempotency key, payload version, status, attempts, next retry, created/
processed timestamps, error, and actor.

**Statuses:** pending, processing, processed, retrying, failed, dead_letter. The source
transaction commits before optional delivery. Failed delivery never rolls back a
completed POS sale or INV operation.

**Tests:** disabled target, enabled event creation, duplicate event delivery, retry,
dead-letter/replay, payload versioning, tenant/branch isolation, queue outage, and
consumer failure.

## 6. Final acceptance matrix

For every tab, acceptance must verify:

| Area | Required verification |
|---|---|
| Lifecycle | Valid transitions only; completed financial records immutable |
| Actions | Available actions vary by status, permission, scope, and record type |
| Forms | Required fields, conditional fields, source dropdowns, defaults, and validation |
| List | Search, filters, sorting, pagination, columns, export, selection, bulk safety |
| Detail | Overview, related records, documents, notes, timeline, audit |
| Security | Tenant/branch/store/register scope and backend authorization |
| Reliability | Transactions, row locks, idempotency, retries, no silent failures |
| Notifications | In-app, email/provider, low-stock, approval, payment, expiry, and failure alerts |
| API | Controller, policy, validation, service, transaction, event/job, and response actions |
| Testing | UI, API, database, permission, integration, concurrency, and failure tests |

The POS and INV systems are accepted only when each visible tab has a real destination,
its applicable actions are implemented end-to-end, and unsupported actions are explicitly
hidden rather than presented as misleading CRUD controls.
