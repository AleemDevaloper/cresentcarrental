# POS - Point of Sale System

## Purpose

POS is ManageCore's independent retail transaction system. It owns the sellable POS
catalog, checkout, payments, receipts, registers, cash management, returns, refunds,
and POS reporting. POS must operate normally when INV, CRM, FMS, Accounting, or an
external payment provider is disabled.

POS has no direct database, model, controller, service, or synchronous runtime
dependency on AMS, FMS, HRMS, PMS, CRM, TMS, DMS, INV, MFG, FX, or EMS. Any optional
communication uses the platform integration layer.

## Ownership

POS is the source of truth for:

- POS products, variants, barcodes, categories, prices, and promotions
- Carts, held carts, sales, returns, exchanges, voids, and cancellations
- Payment attempts, payment lines, refunds, and store credits
- Registers, terminals, cash drawers, sessions, shifts, and cash ledger entries
- Receipts, reprints, digital receipt references, and POS audit history
- POS customers and customer-facing checkout data when CRM is unavailable

POS does not own INV stock truth, warehouse movements, accounting journals, or CRM
customer master data.

## Data boundary

POS tables use the `pos_` namespace:

```text
pos_product_catalog
pos_product_barcodes
pos_price_lists
pos_product_prices
pos_discount_rules
pos_held_carts
pos_orders
pos_order_lines
pos_payments
pos_returns
pos_return_lines
pos_refunds
pos_store_credits
pos_receipts
pos_terminals
pos_registers
pos_cash_drawers
pos_sessions
pos_cash_movements
pos_cash_ledger
pos_reconciliations
pos_transaction_events
pos_integration_events
```

POS code must not query `inv_*`, warehouse, stock-ledger, or accounting tables. POS
catalog records may be created locally, imported, or populated by an optional
integration projection.

## Checkout lifecycle

```text
Product Selection
 -> Cart
 -> Customer (optional)
 -> Server Pricing
 -> Discounts and Promotions
 -> Tax and Charges
 -> Server Total Validation
 -> Payment
 -> Receipt
 -> Completed Sale
 -> Optional Integration Events
```

The browser never supplies the authoritative price, tax, discount, or final total.
The server resolves active POS catalog records and recalculates the complete order.

## Payments

Supported payment methods are configurable:

```text
Cash, Card, Bank Transfer, Wallet, QR Payment, Store Credit,
Gift Card, Customer Credit, Other
```

Payments support split tender, partial payment where policy permits, cash tender and
change, provider references, status transitions, and idempotency keys. A provider
timeout creates an unknown or pending payment state; it must not silently create a
second charge.

## Cash management

```text
Company -> Branch -> Store -> Register -> Terminal -> Cash Drawer -> Session
```

Every cash movement is recorded in the immutable POS cash ledger:

```text
Opening Balance
Cash Sale
Cash Refund
Cash In
Cash Out
Paid In
Paid Out
Cash Drop
Adjustment
Closing Adjustment
```

Session closing calculates expected cash from the opening float, cash payments, cash
refunds, and cash movements. Non-cash tenders are excluded. Actual cash, variance,
reason, approval, and denomination counts are persisted.

## Returns, refunds, and exchanges

Returns reference original POS order lines and calculate remaining returnable quantity
under row locking. Refunds are separate records with their own lifecycle and
idempotency key. Historical price, discount, tax, and promotion allocation are used;
current catalog prices are never used for refunds.

Cash refunds create POS cash-out entries. Store-credit refunds create POS-owned credit
ledger records. Card refunds remain pending until the provider confirms them.

## Offline operation

When enabled, POS stores a versioned local catalog and pricing snapshot with an offline
transaction ID, local sequence, device/session metadata, payment policy, and
idempotency key. Synchronization maps the local transaction to one server transaction
and reports conflicts instead of overwriting data.

Card payments are not marked successful offline unless the provider confirms them.

## API boundary

POS APIs expose catalog, barcode search, checkout, transactions, returns, refunds,
registers, terminals, sessions, cash operations, reconciliation, receipts, and
integration settings. Controllers validate input and call POS-owned logic only.

## Navigation

POS is an independent ManageCore workspace with its own POS tab registry and
`src/pages/systems/POS` implementation. The AMS POS/Retail group remains a separate
compatibility surface and does not populate the standalone POS menu.

```text
POS / Retail (group)
  POS Sales Screen
  Cashier Sessions
  POS Invoices & Receipts
  Z-Reports
```

## Current implementation status

The Sales Terminal currently uses the independent POS catalog, terminal, session, checkout, held-cart, and order-list APIs. Completed checkout persists the order, lines, payment, receipt, cash ledger entry, idempotency record, and optional integration event in the POS transaction boundary. The terminal order history is server-backed and no longer depends on seeded browser data.

### Implemented and API-backed

- Standalone POS navigation and POS-only frontend folder.
- Reference-style retail dashboard with command-room hero, sales pulse, KPI cards,
  sales trend, tender mix, and operational shortcuts.
- Billing uses POS catalog, barcode, terminal/session discovery, checkout, order history,
  payments, receipt, and held-cart APIs.
- Sales and receipts use the existing API-backed POS transaction screen.
- POS API clients cover catalog, barcode lookup, checkout, orders, order detail, held
  carts, registers, terminals, sessions, returns, refunds, price lists, discount rules,
  cash operations, reconciliation, and integration settings.

### Visible POS surfaces requiring remaining domain contracts

The following tabs are visible in the standalone POS menu, but require dedicated CRUD or
report endpoints and full lifecycle tests before they can be called complete:

| Area | Tabs | Current status |
|---|---|---|
| Catalog | Categories, price lists, discount rules, coupons, labels | Price-list/rule APIs exist; remaining CRUD is pending |
| Inventory | Stock, movements, adjustments, transfers, counts, valuation, alerts | POS routes exist; stock truth remains INV and must arrive by integration events |
| Purchasing | Vendors, purchase orders, receipts, returns | Navigation exists; POS purchasing APIs are pending |
| Customers | Customers, groups, loyalty, gift cards, custom fields | Navigation exists; POS-owned or optional CRM APIs are pending |
| Operations | Sessions, registers, counters, branches, staff, hardware, tenders | Sessions/registers/terminals/cash are API-backed; remaining setup CRUD is pending |
| Reports | Sales, product, payment, customer, cashier, tax, reconciliation | Navigation exists; server-side aggregate/export APIs are pending |
| Administration | Settings, integrations, compliance, roles, offline | Integrations are API-backed; remaining contracts are pending |

A tab is complete only when its server endpoint, tenant/branch authorization, validation,
persistence, lifecycle transitions, audit event, failure/offline state, and focused tests
are present. The UI must not present placeholder values as authoritative financial data.

## Security and reliability

- Tenant, branch, store, register, and session scopes apply to every operation.
- Completed financial transactions are immutable.
- Voids, discounts, price overrides, refunds, reprints, and cash adjustments require
  permissions and reasons.
- Checkout, payment, return, refund, cash movement, and integration events are
  idempotent.
- Session opening, checkout, returns, and closing use concurrency protection.
- INV, AMS, FMS, HRMS, PMS, CRM, TMS, DMS, MFG, FX, EMS, and payment-provider failures
  must leave recoverable POS states.
