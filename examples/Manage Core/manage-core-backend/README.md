# ManageCore Backend

Laravel 12 API backend powering the ManageCore ERP platform with multi-tenant architecture, Sanctum authentication, and modular business logic.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Laravel 12 (PHP 8.2+) |
| Auth | Laravel Sanctum 4.3 |
| ORM | Eloquent with multi-tenant migrations |
| CSS | Tailwind CSS 4 |
| PDF | dompdf 3 |
| Spreadsheets | PhpSpreadsheet 5.9 |
| Word export | PhpWord 1.4 |
| Build | Vite 7 with laravel-vite-plugin 2 |
| Database | MySQL (multi-tenant) |

## Quick start

```bash
cd manage-core-backend

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate

# Start server (port 8060)
php artisan serve --host=127.0.0.1 --port=8060
```

## Useful commands

```bash
# Run tests
php artisan test

# Clear cache
php artisan optimize:clear

# Queue worker
php artisan queue:listen --tries=1 --timeout=0

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed
```

## Project structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/     # API controllers (ERP, CRM, HRMS, etc.)
│   │   ├── Middleware/       # Auth, tenant, CORS middleware
│   │   └── Requests/        # Form request validation
│   ├── Models/              # Eloquent models (100+ models)
│   ├── Services/            # Business logic services
│   └── Jobs/                # Queue jobs
├── database/
│   └── migrations/          # 100+ migration files (multi-tenant)
├── routes/
│   ├── api.php              # API route definitions
│   └── modules/             # Module-specific routes (crm.php, etc.)
├── config/                  # Application configuration
├── resources/
│   └── css/app.css          # Tailwind CSS entry point
└── public/                  # Built frontend assets
```

## Multi-tenant architecture

The backend uses a multi-tenant model where each customer gets an isolated database connection. Tenant-scoped models automatically route queries to the correct database.

## Module API routes

| Module | Route file | Purpose |
|--------|-----------|---------|
| CRM | `routes/modules/crm.php` | Customer relationship management |
| FMS | `routes/modules/fms.php` | Financial management |
| HRMS | `routes/modules/hrms.php` | Human resources |
| POS | `routes/modules/pos.php` | Point of sale |
| INV | `routes/modules/inv.php` | Inventory management |
| AMS | `routes/modules/ams.php` | Asset management |
| PMS | `routes/modules/pms.php` | Project management |

## Frontend integration

## Recent changes

- Marketing website CSS refinements deployed via build (`npm run build` outputs to `public/`). Changes include orbit spacing, capabilities ring alignment, and case studies styling updates.

The backend serves two frontend applications:

| Frontend | Build output | Port |
|----------|-------------|------|
| Marketing website | `public/` | 3001 (Vite dev) |
| ERP dashboard | `public/app/` | 8061 (Vite dev) |

In production, the backend serves both frontends from the same Laravel instance.

## Environment variables

Key `.env` settings:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=managecore
DB_USERNAME=root
DB_PASSWORD=

# Frontend proxy (development)
FRONTEND_URL=http://localhost:8061

# AI integration
OPENROUTER_API_KEY=your-key

# Mail
MAIL_MAILER=smtp
```
