# Crescent Car Rental — Phase 2 Specification

Updated: 2026-09-25

## Purpose

Phase 1 established the full-stack foundation: public website, booking request flow, fleet and CMS entities, Sanctum admin authentication, reusable admin collection management, premium motion, legal pages and first-party website analytics.

Phase 2 brings the admin product closer to the operational quality observed in the ManageCore AMS/ERP reference. The goal is not to turn Crescent into an ERP. The goal is to make every car-rental workflow measurable, searchable, auditable and efficient for staff.

## Phase 2 priorities

| Priority | Area | Outcome |
|---|---|---|
| P0 | Admin foundation | Shared tables, filters, pagination, drawers, permissions and error handling behave consistently. |
| P0 | Booking operations | Staff can manage a booking from request through confirmation, handover, active rental, return and closure. |
| P0 | Analytics | Staff can understand visitors, conversion actions and content performance without leaving the dashboard. |
| P1 | Fleet lifecycle | Vehicles have availability, maintenance, inspection, damage and document states. |
| P1 | Customer and lead CRM | Every inquiry, booking, follow-up and communication is visible in one timeline. |
| P1 | Reporting and exports | Staff can export operational reports and filter by date, location, vehicle and status. |
| P2 | Automation | Notifications, reminders, queued messages and scheduled reports reduce manual follow-up. |

## Admin dashboard layout

The dashboard should use a ManageCore-style information hierarchy:

### KPI row

- Total booking requests.
- Pending confirmation.
- Active rentals.
- Completed rentals.
- Revenue confirmed/collected.
- Fleet availability rate.
- New contacts and leads.
- Website conversion actions.

Each KPI card should support:

- label and value
- icon and semantic color
- period comparison
- trend indicator
- click-through to the filtered source list
- loading, empty and error states

### Main dashboard panels

1. **Booking funnel** — request, contacted, quoted, confirmed, active, completed, cancelled.
2. **Revenue trend** — daily/weekly/monthly confirmed revenue.
3. **Fleet utilization** — available, reserved, active rental, maintenance and inactive.
4. **Recent bookings** — reference, customer, vehicle, dates, status and quick actions.
5. **Follow-up queue** — new contacts, leads and bookings requiring staff action.
6. **Website signals** — top pages, CTA clicks, blog reads and booking-intent events.

## Standard admin table contract

Every operational table should provide:

- server-side search
- status and date filters
- location/vehicle/category filters where relevant
- sortable columns
- configurable page size
- pagination with result counts
- row selection
- bulk actions where safe
- export action
- refresh action
- empty, loading and error states
- row action menu
- detail drawer or detail page
- confirmation dialog for destructive actions
- status badge with consistent semantics
- audit link showing who changed the record and when

### Required row actions

| Table | Actions |
|---|---|
| Bookings | View, update status, add note, send follow-up, print summary, cancel |
| Vehicles | View, edit, availability toggle, maintenance, media, archive |
| Customers | View profile, booking history, add note, contact |
| Leads | Convert to customer, assign, change status, add follow-up |
| Contacts | Mark read, assign, reply/call, archive |
| Blog/CMS | Preview, edit, publish/unpublish, duplicate, archive |
| Analytics | Inspect route/action, filter period, export |

## Booking lifecycle

The booking status machine should move through:

```text
Pending
  -> Contacted
  -> Quoted
  -> Confirmed
  -> Handover Scheduled
  -> Active
  -> Returned
  -> Completed
```

Alternative terminal states:

```text
Cancelled
Rejected
No Show
```

Every transition must:

- validate the allowed previous state
- record `from_status`, `to_status`, actor, timestamp and note
- optionally trigger a notification
- appear in the booking timeline
- preserve the original booking and price snapshot

## Fleet lifecycle

Vehicles need operational states beyond active/inactive:

```text
Available
Reserved
On Rent
Returned - Inspection Pending
Under Maintenance
Blocked
Retired
```

Phase-two vehicle operations should include:

- odometer at handover and return
- fuel level at handover and return
- inspection checklist
- damage notes and photos
- maintenance schedule
- registration and insurance expiry
- location transfer history
- vehicle utilization history
- availability conflict explanation

## Customer and lead workspace

Each customer record should show:

- contact details and identity status
- booking history
- lifetime value and total rental days
- open leads and follow-ups
- notes and communication history
- preferred vehicle/category/location
- consent and contact preferences

Lead statuses:

```text
New -> Contacted -> Qualified -> Quoted -> Converted
                              -> Lost
```

## Analytics product

The current first-party tracker is the foundation. Phase 2 should add:

- consent state and opt-out handling
- configurable retention window
- date-range filter
- route and content filters
- booking-intent funnel
- vehicle detail views
- booking form starts and completions
- search usage and no-result searches
- WhatsApp/phone conversion attribution
- UTM source/campaign reporting
- CSV export
- privacy-safe aggregation

Do not store payment data, CNIC, passwords, booking notes or unrestricted form payloads in analytics metadata.

## Reports

Required reports:

1. Booking volume by period, status, location and vehicle.
2. Revenue by period, vehicle category and rental type.
3. Fleet utilization and downtime.
4. Vehicle maintenance and document expiry.
5. Leads and contacts by source and conversion status.
6. Website funnel from page view to booking request.
7. Blog and SEO content performance.

Each report should have:

- filter bar
- KPI summary
- chart
- detailed table
- export action
- generated-at timestamp

## Security and authorization

Phase 2 must add:

- Sanctum token ability checks.
- Role-to-permission matrix.
- Policies for vehicles, bookings, customers, CMS and settings.
- Global frontend handling for expired 401 tokens.
- Admin audit logs for all writes and status transitions.
- Login/session monitoring.
- Rate limits on sensitive actions.
- Upload validation and private media authorization.

Suggested roles:

| Role | Scope |
|---|---|
| Super Admin | All modules, settings, users and audit |
| Operations Manager | Bookings, fleet, customers, leads, reports |
| Content Manager | Services, locations, blog, FAQs, reviews, media, SEO |
| Finance Viewer | Revenue, pricing, reports, read-only bookings |
| Support Agent | Contacts, leads, booking follow-up, limited customer data |

## API and data conventions

- Use Laravel Resources for stable response shapes.
- Use request classes for complex validation.
- Use service classes for booking, pricing, availability and lifecycle transitions.
- Use pagination consistently.
- Return `data`, `meta` and `links` for paginated collections.
- Return validation errors in Laravel's standard 422 shape.
- Never silently convert failed writes into success responses.
- Use transactions for booking status changes, pricing snapshots and customer conversion.

## Phase 2 delivery order

1. Shared admin table/filter/action primitives.
2. Booking lifecycle and timeline.
3. Fleet operational states and inspection records.
4. Customer/lead workspace and follow-up queue.
5. Reports and exports.
6. Permissions, policies and audit enforcement.
7. Analytics consent, funnel events and date-range reporting.
8. Notifications and scheduled automation.
9. Browser QA, accessibility and performance validation.

## Acceptance criteria

Phase 2 is complete when:

- Staff can complete a booking lifecycle without editing the database directly.
- Every status change is visible in an audit timeline.
- Fleet availability reflects bookings and maintenance states.
- Admin tables share search, filters, pagination, actions and error states.
- Reports can be filtered and exported.
- Analytics can explain the path from page visit to booking request.
- Permissions prevent unauthorized module actions.
- Public and admin routes pass responsive, accessibility and error-state QA.
