# Deployment Notes — Manage Core

## Environment

| Component | Technology |
|-----------|------------|
| Frontend  | React Production Build |
| Backend   | Laravel Production |
| Database  | MySQL 8+ |
| Server    | Apache / Nginx |
| PHP       | 8.2+ |

## Deployment Steps

```bash
# 1. Clone repository
git clone <repo-url>

# 2. Configure environment
cp .env.example .env
# Edit .env with production credentials

# 3. Install backend dependencies & run migrations
composer install --no-dev
php artisan migrate --force
php artisan storage:link
php artisan optimize

# 4. Build frontend
npm install
npm run build

# 5. Configure queue
php artisan queue:work --daemon &

# 6. Configure scheduler (crontab)
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1

# 7. Configure SSL (Certbot / Let's Encrypt)

# 8. Configure backups
```

## Backup Strategy

| Frequency | Type |
|-----------|------|
| Daily     | Database backup |
| Weekly    | Full backup |
| Monthly   | Archive backup |

## Production Checklist

- [ ] `APP_DEBUG=false`
- [ ] Queue running
- [ ] Scheduler running
- [ ] Storage linked
- [ ] SSL enabled
- [ ] Backups enabled
- [ ] Error logging enabled
- [ ] Audit logging enabled
- [ ] Tenant isolation verified
- [ ] Permissions verified

## Disaster Recovery

- [ ] Daily database restore test
- [ ] Backup validation
- [ ] Recovery documentation
- [ ] Emergency rollback procedure
