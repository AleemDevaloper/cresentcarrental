# Deployment Guide - Manage Core ERP to cPanel

## Overview

- **Domain:** https://managecore.asiancon.com
- **Database:** asiancon_managecore
- **DB User:** asiancon_managecore
- **Deploy Path:** `/home/asiancon/public_html/managecore/`
- **PHP:** 8.2+
- **MySQL:** 8+

---

## Step 1: Set Up Subdomain in cPanel

1. Go to **cPanel → Subdomains**
2. Create subdomain: `managecore.asiancon.com`
3. Document root: `public_html/managecore`
4. Ensure **SSL** (AutoSSL or Let's Encrypt) is enabled

---

## Step 2: Prepare Database in cPanel

1. Go to **cPanel → MySQL Databases**
2. Database `asiancon_managecore` should already exist
3. User `asiancon_managecore` should already exist with password
4. Go to **phpMyAdmin** → select `asiancon_managecore`
5. Import your database SQL dump (if you have existing data)

---

## Step 3: Build the Frontend (on your local machine)

Run these commands on your local machine in the `manage-core-frontend/` folder:

```bash
cd manage-core-frontend
npm install
npm run build
```

This builds the React SPA and outputs files into `manage-core-backend/public/`.

---

## Step 4: Upload Files to cPanel

For security, keep **Laravel app files outside public_html**.

### Option A: Recommended (Separate App & Public)

**Upload Laravel app to:** `/home/asiancon/managecore/`

Use cPanel File Manager or FTP to upload the entire `manage-core-backend/` folder (excluding `node_modules`, `.git`, etc.) to `/home/asiancon/managecore/`.

**Upload public files to:** `/home/asiancon/public_html/managecore/`

Copy the contents of `manage-core-backend/public/` into `public_html/managecore/`:
- `index.php`
- `.htaccess`
- `assets/` (the built frontend assets)
- `index.html` (SPA fallback from Vite)
- `favicon.ico`, `robots.txt`, etc.

### Option B: Simple (Everything in public_html)

Upload ALL of `manage-core-backend/` into `public_html/managecore/`.
Then update cPanel to point the subdomain document root to `public_html/managecore/public`.

---

## Step 5: Set Correct Paths in public/index.php

If using **Option A**, edit `public_html/managecore/index.php`:

```php
<?php

// Path to Laravel app (outside public_html)
$appDir = '/home/asiancon/managecore';

require $appDir . '/vendor/autoload.php';

/** @var \Illuminate\Foundation\Application $app */
$app = require_once $appDir . '/bootstrap/app.php';

$app->handleRequest(\Illuminate\Http\Request::capture());
```

If using **Option B**, the existing `public/index.php` works as-is since all files are together.

---

## Step 6: Install Backend Dependencies (on cPanel)

### Via SSH (if available):

```bash
cd /home/asiancon/managecore
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan event:cache
```

### Via cPanel Terminal:

Some cPanel plans have SSH/Terminal access under **Advanced** section.

### Without SSH:

1. Run `composer install --no-dev --optimize-autoloader` locally
2. Upload the `vendor/` folder along with app files in Step 4
3. Use **cPanel → Cron Jobs** to run Artisan commands:

```
cd /home/asiancon/managecore; /usr/local/bin/php84 artisan schedule:run >> /dev/null 2>&1
```

---

## Step 7: Set File Permissions

```bash
chmod 755 /home/asiancon/managecore/storage
chmod 755 /home/asiancon/managecore/bootstrap/cache
chmod -R 775 /home/asiancon/managecore/storage/logs
chmod -R 775 /home/asiancon/managecore/storage/framework
chmod -R 775 /home/asiancon/managecore/storage/app
```

---

## Step 8: Configure Queue Worker (Cron Job)

In **cPanel → Cron Jobs**, add:

```
* * * * * cd /home/asiancon/managecore; /usr/local/bin/php84 artisan schedule:run >> /dev/null 2>&1
```

Also add a cron to keep the queue running:

```
* * * * * cd /home/asiancon/managecore; /usr/local/bin/php84 artisan queue:work --sleep=3 --tries=3 --max-time=3600 >> /dev/null 2>&1
```

---

## Step 9: Configure PHP Version

In **cPanel → Select PHP Version**:
- Set PHP to **8.2** or **8.3**
- Enable extensions: `bcmath`, `ctype`, `curl`, `dom`, `fileinfo`, `gd`, `json`, `mbstring`, `mysqlnd`, `openssl`, `pdo`, `pdo_mysql`, `tokenizer`, `xml`, `zip`

---

## Step 10: Verify Deployment

1. Visit `https://managecore.asiancon.com` — you should see the login page
2. API should be accessible at `https://managecore.asiancon.com/api/v1/auth/login`
3. Login with your credentials

---

## Troubleshooting

### Blank page / 500 error
- Check `storage/logs/laravel.log` for errors
- Verify `.env` file has correct DB credentials
- Ensure `APP_KEY` is set (run `php artisan key:generate`)
- Check PHP version (must be 8.2+)

### 404 on all routes except homepage
- Ensure `.htaccess` is in the document root
- Apache mod_rewrite must be enabled
- Verify `public/index.php` paths are correct

### API returns 419 (CSRF mismatch)
- Ensure `SANCTUM_STATEFUL_DOMAINS` is set correctly in `.env`
- Verify `SESSION_DOMAIN` is `.asiancon.com`
- Clear cookies and try again

### Login works but API calls fail with 401
- Check that `FRONTEND_URL` matches the actual frontend URL
- Ensure CORS config includes `https://managecore.asiancon.com`
- Verify `supports_credentials` is `true` in CORS config

---

## Files Modified for Deployment

| File | Change |
|------|--------|
| `manage-core-backend/.env` | Updated to production DB & domain settings |
| `manage-core-backend/.env.production` | Created as production template reference |
| `manage-core-frontend/.env` | Updated VITE_API_BASE_URL to production |
| `manage-core-backend/config/cors.php` | Added production domain, enabled credentials |
| `manage-core-backend/.env` | SANCTUM_STATEFUL_DOMAINS set to managecore.asiancon.com |
| `DEPLOYMENT_GUIDE.md` | This file |
