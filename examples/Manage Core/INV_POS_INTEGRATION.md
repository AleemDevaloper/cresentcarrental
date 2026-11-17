# INV and POS Integration Boundary

## Principle

INV and POS are independent systems. Integration is an optional asynchronous boundary,
not a shared business layer and not a database shortcut.

```text
INV database <- INV service <- Integration events -> POS service -> POS database
```

Neither system may directly query or mutate the other's tables.

## No direct cross-system access

INV and POS must not directly access any of these systems:

```text
AMS, FMS, HRMS, PMS, CRM, TMS, DMS, INV, POS, MFG, FX, EMS
```

This prohibition includes direct database queries, cross-domain model relationships,
controller-to-controller calls, service imports that bypass integration, shared
transaction assumptions, and synchronous completion dependencies. Shared platform
capabilities such as authentication, tenant context, authorization primitives, queues,
notifications, and audit infrastructure are allowed; business data remains owned by
the source system.

All cross-system business communication must use an explicitly versioned integration
contract through the platform integration layer. Each consumer must be independently
disableable.

## Modes

Each target can be configured independently:

```text
disabled
manual
event_driven
scheduled
real_time
```

The default is `disabled`. A disabled integration creates no cross-system work and
must not affect local workflows.

## Event contract

An integration event contains:

- Event ID
- Source system
- Target system
- Event type
- Payload reference
- Status
- Retry count
- Created timestamp
- Processed timestamp
- Error details
- Idempotency key

Recommended statuses:

```text
pending
processing
processed
retrying
failed
dead_letter
```

## Event ownership

### INV to POS

```text
INV_PRODUCT_CREATED
INV_PRODUCT_UPDATED
INV_PRODUCT_DEACTIVATED
INV_STOCK_UPDATED
INV_PRICE_UPDATED
```

POS consumes these as local catalog or availability projections. POS remains usable
with its own local records if delivery fails.

### POS to INV

```text
POS_SALE_COMPLETED
POS_RETURN_COMPLETED
POS_EXCHANGE_COMPLETED
POS_VOID_COMPLETED
```

INV decides whether and how to create stock movements. POS never updates INV stock.

### Other optional consumers

CRM may consume customer and purchase events. FMS/Accounting may consume payment,
revenue, tax, and reconciliation events. Their availability must not block INV or
POS completion.

## Failure and retry

The source transaction is committed before optional integration delivery. A failed
consumer leaves the source transaction completed and the event retryable. Retries use
the same event ID and idempotency key. A dead-letter event requires operator review
and replay; it must never silently disappear.

## Data mapping

When mapping products or transactions, store:

```text
source_system
source_reference
target_system
target_reference
integration_reference
last_sync_status
last_sync_error
```

Mappings are references, not foreign keys across INV and POS tables.

## Acceptance tests

1. Disable INV and complete a POS sale.
2. Disable POS and receive and transfer INV stock.
3. Enable integration and verify one event creates at most one target operation.
4. Disconnect a target and verify the source workflow remains completed.
5. Retry the same event and verify no duplicate stock, payment, or transaction.
6. Verify tenant and branch isolation for source records and events.
