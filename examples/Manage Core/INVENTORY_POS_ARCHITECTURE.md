# ManageCore Inventory and POS Architecture

## Purpose

Inventory Management (INV) and Point of Sale (POS) are independent software systems inside
ManageCore. They may share the platform shell and authentication, but they own separate
catalogs, tables, services, settings, permissions, reports, workflows, and audit records.

The platform boundary is:

```text
ManageCore Platform
├── CRM             optional customer and relationship integration
├── AMS/FMS         optional finance and accounting integrations
├── HRMS            optional employee and cashier integration
├── INV             independent stock, warehouse, costing, replenishment
└── POS             independent selling, payments, registers, receipts
```

INV owns inventory truth. POS owns POS transaction truth. AMS, FMS, HRMS, PMS, CRM, TMS,
DMS, MFG, FX, and EMS are optional integration participants, not prerequisites. INV and
POS do not directly access any of those systems or each other's tables. Cross-domain
changes are performed only through the integration layer and versioned events.

Detailed contracts:

- `INV_SYSTEM.md` - INV ownership, stock ledger, workflows, APIs, and navigation.
- `POS_SYSTEM.md` - POS checkout, payments, cash, returns, offline behavior, and navigation.
- `INV_POS_INTEGRATION.md` - optional event contract, mappings, retries, and failure handling.
- `INV_POS_TAB_SPECIFICATION.md` - tab/page-level implementation contract for every INV and POS workspace.

## Inventory navigation

### Dashboard

The dashboard reports total, active, low-stock, out-of-stock, overstocked, expiring, and expired
products; total quantity and inventory value; today's receipts, issues, transfers, adjustments;
pending purchase orders and goods receipts; turnover; and dead-stock value.

Widgets include stock value by warehouse, stock by category, movement trend, fast/slow/dead
stock, low-stock and expiry alerts, top-selling products, adjustments, purchase versus sales,
and valuation trend.

### Master data

- **Products**: INV owns its own product master containing product ID, SKU, product code,
  barcodes, name, type, category, brand, manufacturer, model, description, tags, status,
  costing, and stock-control settings. POS may maintain a separate sellable catalog and
  optionally receive a mapped projection through integration.
- **Product types**: stockable, consumable, service, bundle, kit, serialized, batch, and digital.
- **Variants**: each size/color/model variant has its own SKU, barcode, price, cost, stock,
  weight, and dimensions while sharing a parent product.
- **Categories**: unlimited parent-child hierarchy with image, description, status, and sort order.
- **Brands**: manufacturer, logo, description, website, and status.
- **Units**: base units and conversions such as `1 carton = 24 pieces`.

### Warehousing and stock

Warehouses belong to branches and contain zones, racks, bins, and other locations. Stock is
never changed directly. Every opening, purchase, sale, return, transfer, adjustment, damage,
expiry, consumption, production, or count result creates an immutable stock-ledger movement.

The available quantity is derived from ledger movements:

```text
Opening + Purchases + Sales Returns + Adjustments + Receipts
- Sales - Purchase Returns - Transfers Out - Damage - Expiry = Current Stock
```

Transfers use the lifecycle `Draft -> Requested -> Approved -> In Transit -> Partially
Received -> Received` and support cancellation and partial receipt.

Batch products track batch number, manufacture date, expiry, quantity, cost, warehouse, and
supplier. Serialized products track the serial lifecycle from purchase through warehouse,
sale, customer, warranty, and return. FEFO is used for expiry-controlled stock; FIFO or weighted
average is selected by product/category configuration.

### Control workflows

- **Stock counts** snapshot stock, record physical counts and variances, require review and
  approval, then create adjustment ledger entries.
- **Reorder management** compares available stock with reorder point, safety stock, and lead time.
  Approved recommendations may create purchase requisitions.
- **Valuation** supports FIFO, weighted average, and standard cost, with quantity, unit cost,
  total cost, and valuation history.

## POS navigation and behavior

POS has a speed-first interface separate from the normal administrative dashboard:

`Dashboard | Terminal | Sales | Held Sales | Returns | Customers | Payments | Registers |
Sessions | Discounts | Promotions | Gift Cards | Loyalty | Layaway | Reports | Settings`

The terminal provides barcode/SKU search, category and brand filters, product variants,
touch-friendly product tiles, keyboard shortcuts, cart editing, customer selection, hold/resume,
discounts, tax, notes, and fast payment.

Payments support cash, card, bank, wallet, online payment, credit, and split tender. Each
register records branch, terminal, cashier, opening balance, cash movements, and closing
variance. Sessions follow `Open -> Sales/Refunds/Cash In-Out -> Close -> Count -> Variance`.

Returns validate the original receipt, product, quantity, serial/batch, and return period.
They support full/partial return, exchange, refund, and store credit. Optional integration
events can request inventory or accounting work; POS remains complete without those consumers.

Retail features include permission-controlled percentage/fixed discounts, coupons and
time/category/customer promotions, CRM-linked customer lookup, loyalty tiers and points,
gift-card activation/redemption/reload/expiry, and layaway deposits and installments.

### POS frontend delivery note (September 2026)

The standalone POS workspace is implemented under
`manage-core-frontend/src/pages/systems/POS` and selected through a POS-specific tab
registry. It is deliberately not derived from the AMS or INV tab registries. Dashboard,
billing, and receipt flows reuse POS-owned API clients and the existing server lifecycle;
catalog fallback data is only a degraded display state when the API is unavailable.

The supplied concept screenshots are the visual contract: dark platform navigation,
pale gray workspace, white bordered panels, red retail actions, compact tab strips,
command-room dashboard, dense catalog tables, feature-specific filter/export controls,
setup forms, readiness banners, operational dashboards, and a step-based checkout surface.
Implementation status for every visible tab is tracked in `POS_SYSTEM.md`; navigation
alone is not considered feature completion.

## Integration contract

### Completed sale

```text
POS Sale Service
├── validates cart, price, tax, discount, customer, and tender
├── persists sale and payment atomically
├── emits SaleCompleted
├── INV optionally consumes event -> stock ledger deduction
├── CRM optionally consumes event -> purchase history and loyalty
├── AMS/FMS optionally consume event -> journal and reconciliation records
└── Notifications optionally consume event -> receipt delivery
```

POS must not update inventory quantities or accounting tables directly. INV and POS may each
maintain local records needed for standalone operation. All event consumers must be idempotent
and record source document references to prevent duplicate posting.

## Offline POS

The terminal must continue selling with a versioned local product/pricing/tax cache. Offline
sales and payments enter a durable queue with an idempotency key, local receipt number, and
device/session metadata. On reconnect, the sync service retries safely, detects conflicts,
reports failures, and never duplicates a sale or stock movement.

## Backend boundaries

Laravel controllers validate requests and call domain services. Inventory services own products,
warehouses, stock ledger, batches, serials, counts, reorder, and valuation. POS services own
sales, sale lines, payments, registers, sessions, returns, promotions, gift cards, loyalty, and
layaway. Events connect these domains. Tenant and authorization scopes apply to every query.

## Delivery phases

1. Inventory foundation: product master, variants, categories, brands, units, SKU, and barcodes.
2. Warehousing: warehouses, locations, stock levels, ledger, movements, transfers, adjustments.
3. Advanced inventory: batches, serials, expiry, FEFO/FIFO, counts, reorder, valuation.
4. Purchasing integration: requisitions, purchase orders, goods receipts, returns, suppliers.
5. Sales fulfillment: quotations, sales orders, reservations, picking, packing, deliveries,
   outbound inventory issues, and customer returns.
6. Advanced WMS: warehouse hierarchy, directed tasks, receiving, putaway, replenishment,
   waves, packing, staging, dispatch, and warehouse exceptions.
7. Independent POS core: catalog, terminals, sessions, checkout, payments, receipts, and
   offline-safe integration events.
8. POS finance: tender, split payments, registers, sessions, cash movements, returns.
9. Retail: discounts, promotions, loyalty, gift cards, layaway, customer pricing.
10. Offline and enterprise: local queue, sync, conflict handling, branches, currencies, taxes,
   permissions, approvals, and audit.
11. Analytics: inventory/sales metrics, demand forecasting, dead-stock prediction, and anomaly
   detection.

## Part 3 implementation status

The advanced inventory foundation is now wired to the Part 2 stock engine. Tenant migrations add
batch and serial dimensions to stock and ledger records, cost layers for receipt history, stock
count documents/items, reorder rules, alerts, and ABC/classification storage. The backend exposes
server-side batch/serial search, controlled status changes, stock-count submission/approval/
reconciliation, reorder configuration, alert resolution, real-data stock health, and FIFO/FEFO
allocation recommendations. Receipts continue to create cost layers and all issues remain subject
to available-stock, batch-status, and expiry protection.

The next implementation increment should add the dedicated INV screens and scheduled alert/aging
jobs, then connect purchasing receipts and POS issues to the same batch/serial-aware movement
service.

## Part 3 completion contract

Part 3 is complete only when advanced inventory remains ledger-driven: batches and serials are
validated before issue, expiry protection is enforced, FIFO/FEFO allocation uses real cost layers,
counts reconcile through adjustment movements, and reorder/health/aging metrics come from
persisted stock, ledger, and configuration data. Expensive expiry, aging, dead-stock, and alert
calculations belong in queued jobs or materialized summaries; APIs must remain paginated,
tenant-scoped, authorized, and auditable.

## Part 4 purchasing architecture

Purchasing uses the existing supplier/vendor master and approval, notification, DMS, currency,
tax, and audit services. It owns requisitions, RFQs, quotations, purchase orders, amendments,
goods receipts, purchase returns, price history, landed-cost records, and three-way matching
references. It never changes stock directly.

The controlled receiving flow is:

```text
PR -> RFQ -> Supplier Quotation -> PO -> Approval -> GRN
   -> quality/batch/serial/expiry validation -> InventoryStockService
   -> stock ledger + cost layer -> PO receipt progress
```

PO and GRN quantities are locked during posting so partial receipts, backorders, over-receipt
tolerances, and retries cannot duplicate inventory. Rejected or damaged quantities remain outside
available stock, quarantine is explicit, and purchase returns create negative inventory movements
only when posted. Original currency, exchange-rate reference, tax, supplier pricing, PO/GRN
references, and price variances remain preserved for future AMS/FMS posting.

Part 4 navigation is `Suppliers | Supplier Products | Requisitions | RFQs | Quotations | Purchase
Orders | Goods Receipts | Purchase Returns`, with server-side search, filters, pagination,
responsive receiving forms, approval actions, document references, and audit history. Vendor bills
and accounting entries remain owned by AMS/FMS; DMS remains the document store.

## Part 4 implementation status

Part 4 is documented as the purchasing-to-stock implementation contract. The implementation must
not advertise a PO, GRN, return, approval, or supplier metric as functional until its database
record, authorization, workflow transition, audit event, and inventory integration are wired.

## Part 5 sales and outbound contract

Sales owns quotations, sales orders, fulfillment, packages, deliveries, and customer returns.
CRM and AMS/FMS may provide optional customer and financial integrations. Inventory reservation,
picking, allocation, and issue are always performed through
the existing inventory services and ledger. An order does not reduce stock at creation; only a
configured, authorized delivery-posting transaction creates the negative ledger movement.

The controlled outbound flow is:

```text
Quotation -> Sales Order -> Approval -> Reservation -> Picking -> Packing
  -> Delivery -> Inventory Issue -> Ledger/Cost Layers
```

Batch and serial allocations are explicit and traceable, FEFO/FIFO uses the existing allocation
engine, partial fulfillment produces linked backorders, and returns pass inspection before
restocking or quarantine. Every workflow requires tenant/branch authorization, idempotent
posting, audit history, pagination, and real database-derived metrics.

## Part 6 WMS contract

WMS is an execution layer over the existing inventory engine. It stores warehouse structure
(zones, aisles, racks, shelves, bins, and docks), workers, waves, tasks, replenishment rules,
and exceptions. It never stores an independent stock quantity. Capacity and utilization must be
derived from inventory stock/ledger data, while task completion calls the existing inventory
movement, reservation, and allocation services.

The controlled warehouse flow is:

```text
Inbound -> Dock -> Receiving/GRN -> Inspection -> Putaway -> Storage
Outbound -> Allocation -> Wave -> Pick -> Pack -> Stage -> Dispatch -> Inventory Issue
```

Tasks are validated by warehouse, source/destination, product, batch/serial, quantity, worker
assignment, and status transition. Blocked, quarantine, damaged, expired, or incompatible
locations cannot receive normal putaway. Exceptions are persisted with reason, actor, task,
resolution, and audit context. WMS dashboard metrics are database-derived and tenant-scoped.

The initial WMS increment includes the schema/API foundation, dashboard metrics, WMS activation
navigation, and responsive dashboard entry point. Directed putaway execution, scanner/offline
sync, wave allocation, capacity calculation, dock appointments, and task-to-ledger posting are
subsequent required increments and must reuse the central InventoryStockService.

## Unified integration acceptance contract

The master integration requirements apply to every INV, WMS, POS, purchasing, and sales feature:
no isolated UI-only behavior, direct quantity updates, or cross-system table access. INV and POS
may maintain separate product, customer, SKU, and barcode records because each must operate
independently. Each mutation must be validated, authorized, tenant-scoped, persisted atomically,
ledger/event-backed where applicable, idempotent on retry, auditable, reportable, and surfaced to
notifications/automation through the optional platform integration layer. Offline queues must sync
with conflict detection rather than overwrite source records. This contract is mandatory for all
future phase implementations.

## Part 2 INV product master contract

INV Product Master is the tenant-scoped identity for INV products, variants, SKUs, and barcodes.
Its API provides database-derived master-data KPIs, fast name/SKU/barcode search including
variant identifiers, uniqueness validation, lifecycle statuses, and safe archival when historical
ledger or variant records exist. Purchasing, INV sales fulfillment, WMS, reporting, and INV
analytics consume this API. POS does not depend on it and may maintain its own catalog.

## Implementation standards

- Keep product, customer, and barcode ownership explicit per system; use mappings/events for
  synchronization instead of shared tables.
- Use stock-ledger and financial journal records as sources of truth.
- Keep every mutation tenant-scoped, authorized, audited, and idempotent where retried.
- Use pagination and server-side filtering for large lists.
- Keep the POS terminal responsive on touch devices and below 430px.
- Provide loading, empty, validation, permission, error, and offline states for every workflow.
- Verify API contracts, migrations, frontend builds, and mobile layouts at every phase.

## Independent POS core contract

POS owns its operational catalog, terminals, sessions, checkout orders, payments, receipts, cash
operations, and returns. Its catalog is intentionally lightweight and may be local, imported,
synced from Product Master, or supplied by an external provider. POS APIs do not query inventory
tables and checkout does not call INV services. Inventory synchronization is an optional,
retryable integration event with an idempotency key; an INV outage therefore cannot block
standalone POS checkout. POS supports online and offline transaction sources, split payment
records, durable transaction identifiers, and duplicate-safe retries. INV remains independently
operable through its own product, purchasing, warehouse, ledger, and valuation APIs.

## POS terminal and session contract

Every sale belongs to an authorized terminal and session. Terminals have unique codes and
device identities, configurable hardware/settings, heartbeat status, and lifecycle controls.
Only one open session per terminal is permitted by the default policy; opening cash, cash-in,
cash-out, cash-drop, cash count, expected cash, actual cash, and variance are persisted in POS
records. Closing a session locks it against new sales and calculates expected cash from actual
POS cash payments and recorded cash movements. No terminal or session operation requires INV,
CRM, accounting, or an external payment provider. Sessions also expose detail/history data,
denomination cash counts, controlled reopen with a reason, and explicit lock/unlock state for
cashier handover and automatic-lock policies.

POS cash management now also has POS-owned registers and an immutable cash ledger. Cash sales,
cash refunds, cash-in, cash-out, safe drops, and other drawer movements can be reconciled by
session and movement type without including non-cash tenders in physical cash. Register and
cash-reconciliation APIs remain independent of INV, CRM, and accounting.

Session operations additionally support suspension/resume, controlled inter-session cash
transfers, cash-drawer records with safe-drop thresholds, and variance reconciliation records
with approval status.

POS also owns its sellable catalog projection, barcode aliases, product metadata, price lists,
effective-date product prices, and discount rules. These records can be synchronized through
optional integration events, but catalog search and checkout remain operational without INV.

## POS returns and refunds contract

Returns reference the original POS order lines and calculate remaining returnable quantity
server-side. Return lines preserve the original unit price, discount, and tax snapshot; refund
records are separate from return records and have their own idempotency key and lifecycle.
Cash refunds create POS cash-out movements, store-credit refunds create POS-owned credits, and
optional INV/CRM/accounting notifications are queued as integration events. Repeated return or
refund submissions return the existing transaction instead of creating duplicates.
