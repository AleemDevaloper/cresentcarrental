# INV - Inventory Management System

## Purpose

INV is ManageCore's independent inventory and warehouse system. It owns inventory
identity, stock availability, warehouse operations, costing, replenishment, and
inventory reporting. INV must operate normally when POS, CRM, FMS, or Accounting is
disabled.

INV has no direct database, model, controller, service, or synchronous runtime
dependency on AMS, FMS, HRMS, PMS, CRM, TMS, DMS, POS, MFG, FX, or EMS. Any optional
communication uses the platform integration layer.

## Ownership

INV is the source of truth for:

- Inventory products, variants, categories, brands, and units
- Warehouses, locations, bins, zones, and stock policies
- Stock quantities and immutable stock-ledger movements
- Batches, serial numbers, expiry, quarantine, and FEFO allocation
- Inventory counts, adjustments, transfers, reorder rules, and alerts
- Purchase receiving, inventory valuation, and cost layers

INV does not own POS sales, payments, registers, cash drawers, receipts, or customer
loyalty balances.

## Data boundary

INV tables use the `inv_` namespace where new independent tables are introduced:

```text
inv_products
inv_product_variants
inv_categories
inv_units
inv_warehouses
inv_warehouse_locations
inv_stock
inv_stock_movements
inv_stock_transfers
inv_stock_adjustments
inv_inventory_counts
inv_inventory_count_items
inv_batches
inv_serial_numbers
inv_cost_layers
inv_reorder_rules
inv_inventory_alerts
inv_inventory_settings
inv_inventory_audit_logs
```

Existing legacy inventory tables must be treated as INV-owned implementation details.
POS must never query or update them directly.

## Stock ledger rules

Stock is never changed by editing an aggregate quantity. Every stock change creates an
immutable movement with product, variant, warehouse, location, quantity, unit cost,
reason, source document, actor, timestamp, tenant, and idempotency information.

```text
Opening
+ Purchase Receipts
+ Sales Returns
+ Approved Adjustments
+ Transfer Receipts
- Sales Issues
- Purchase Returns
- Transfer Issues
- Damage
- Expiry
- Consumption
= Available Stock
```

Negative stock, batch status, serial ownership, expiry, and reservation rules are
validated by the INV service before a movement is posted.

## Core workflows

### Product and catalog

Create product -> configure type/unit -> add variants and barcodes -> configure stock
policy -> activate/archive.

Supported product types include stockable, consumable, service, bundle, kit, batch,
serialized, and digital.

### Receiving

Purchase order -> goods receipt -> quantity/quality validation -> batch/serial/expiry
capture -> cost layer -> stock ledger receipt.

### Transfer

Draft -> requested -> approved -> in transit -> partially received -> received.

### Stock count

Count draft -> snapshot -> physical count -> variance review -> approval -> adjustment
ledger movement.

### Replenishment

Available stock is compared with reorder point, safety stock, minimum/maximum levels,
lead time, and demand history. Recommendations remain reviewable before a purchase
request is created.

## API boundary

INV APIs expose product, warehouse, stock, movement, transfer, batch, serial, count,
reorder, valuation, and reporting operations. Controllers validate authorization and
call INV services; they do not call POS services or modify POS tables.

## Optional integration

When enabled, INV may publish product and stock events:

```text
INV_PRODUCT_CREATED
INV_PRODUCT_UPDATED
INV_PRODUCT_DEACTIVATED
INV_STOCK_UPDATED
INV_PRICE_UPDATED
```

Events are copied through the integration layer. No receiving system is required to
consume them, and an unavailable integration must not block INV operations.

## Security and reliability

- Tenant and branch scopes apply to every query.
- Inventory mutations require permissions and audit records.
- Posted movements are immutable; corrections use reversal or adjustment movements.
- Import, export, and file uploads are validated and authorized.
- Repeated requests use idempotency keys where they can create stock movements.
- Long-running valuation, expiry, and alert calculations should use queued jobs.

## Navigation

```text
Dashboard
Catalog
Warehouses
Stock
Movements
Transfers
Adjustments
Inventory Counts
Batches
Serial Numbers
Reorder and Alerts
Purchasing Inventory
Valuation
Reports
Settings
```
