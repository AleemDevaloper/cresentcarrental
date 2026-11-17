# Deployment Notes

## Recommended topology

| URL | Target |
|---|---|
| `https://crescentrentacar.com` | Built React frontend (`dist/`) |
| `https://api.crescentrentacar.com` (or `/api` via reverse proxy) | Laravel API |
| Private host/network | MySQL |

## Backend checklist

1. PHP 8.2+ with required Laravel extensions.
2. `composer install --no-dev --optimize-autoloader`.
3. Configure `.env`:
   - `APP_KEY`, `APP_URL` (must match the public API URL)
   - DB credentials (least-privileged user)
   - Mail/queue/cache/session drivers
   - `FRONTEND_URL` / allowed CORS origins
4. `php artisan migrate --force`.
5. `php artisan storage:link`.
6. `php artisan config:cache && php artisan route:cache && php artisan view:cache`.
7. Change the seeded admin password (or create a new admin user).
8. Configure scheduler and queue worker if asynchronous mail/media jobs are enabled.

## Frontend checklist

1. Set production `VITE_API_BASE_URL` (must end in `/api/v1`) and optional analytics IDs in `frontend/.env`.
2. `npm ci && npm run build`.
3. Serve `dist/` with SPA fallback to `index.html`.
4. Long-cache hashed assets, but **not** `index.html`.

## Security / ops

- HTTPS only; HSTS after verification.
- Restrict CORS to production origin(s).
- Disable debug mode.
- Use least-privileged DB credentials.
- Back up DB and uploaded media.
- Add WAF/rate limits for public forms and login (API already throttles: login 6/min, contact 10/min, bookings 20/min).
- Monitor errors, response time and failed logins.

## Post-deploy verification

- [ ] Public pages load with correct meta/JSON-LD and `sitemap.xml` / `robots.txt`.
- [ ] Admin login at `/admin/login` returns 200 and dashboard stats render.
- [ ] All admin sidebar tabs load (bookings, fleet, content, reports, settings).
- [ ] Availability → quote → booking creation end-to-end.
- [ ] Contact and lead submissions appear in the admin dashboard.
