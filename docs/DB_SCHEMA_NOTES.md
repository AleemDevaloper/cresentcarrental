# Database Schema Notes

## Core relational groups

| Group | Tables |
|---|---|
| Fleet | `vehicle_brands`, `vehicle_categories`, `vehicles`, `vehicle_images`, `vehicle_features`, `vehicle_feature_vehicle` |
| Operations | `locations`, `services`, `pricing_rules`, `discounts` |
| Customers / conversion | `customers`, `bookings`, `booking_status_history`, `leads`, `contact_submissions` |
| Content | `reviews`, `faqs`, `blog_categories`, `blog_posts`, `homepage_sections`, `website_settings`, `seo_metadata`, `media` |
| Administration | `users`, `personal_access_tokens`, `activity_logs`, `admin_notes`, `notifications`, `payment_records` |
| Website analytics | `website_analytics_events` |

## Notes

- Booking date/time values are stored as datetimes. Application-level availability checks run inside database transactions, and production should additionally use appropriate transaction isolation/locking for concurrent booking creation.
- Admin collections map 1:1 to `apiResource` routes (see `backend/routes/api.php`) — when adding a column, update the matching frontend field config in `frontend/src/App.jsx`.
- `personal_access_tokens` backs Sanctum bearer auth for the admin dashboard.
- Seed data includes the default super admin (change the password outside development).
- `activity_logs` is for authenticated admin/system audit activity. It is intentionally separate from `website_analytics_events`, which stores anonymous public visitor events.
- `website_analytics_events` stores validated event names, session identifiers, route/title context, target labels/URLs, optional content identifiers, JSON metadata, referrer, user agent, IP address and occurrence time.
- Analytics indexes support event-name, session, route and time-window aggregation. The migration must be run before the public tracker or `/admin/analytics` can return data.
- Retention, consent and anonymization are phase-two production decisions; do not treat the current event table as an unlimited archive.
