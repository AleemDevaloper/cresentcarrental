# Customer Data Isolation Implementation Guide

## Overview
This implementation creates complete separation between AR (Accounts Receivable) Customers and Super Admin Customers, ensuring they use separate database tables and API endpoints.

## Architecture

### Database Layer
- **AR Customers**: Stored in `clients` table (existing)
- **Super Admin Customers**: Stored in `superadmin_customers` table (new)
- **Contacts**: Separate tables for each (`client_contacts` and `superadmin_customer_contacts`)

### Backend Models
1. `Client.php` - AR customer model (existing)
2. `SuperAdminCustomer.php` - Super Admin customer model (new)
3. `ClientContact.php` - AR customer contacts (existing)
4. `SuperAdminCustomerContact.php` - Super Admin customer contacts (new)

### Controllers
1. `CustomerController.php` - AR customer API endpoints
   - Endpoint: `/api/v1/customers`
   - Methods: GET, POST, PATCH, DELETE
   - Data source: `clients` table only

2. `SuperAdminCustomerController.php` - Super Admin customer API endpoints
   - Endpoint: `/api/v1/super-admin/customers`
   - Methods: GET, POST, PATCH, DELETE
   - Data source: `superadmin_customers` table only
   - Protection: Super Admin role verification

### Middleware
- `CustomerDataIsolationMiddleware.php`
  - Validates customer type based on route
  - Ensures Super Admin role for `/super-admin/customers` endpoints
  - Prevents accidental data mixing

### Frontend APIs
- `src/api/customers.js` - Separate functions for AR and Super Admin customers

### Frontend Components
1. `ErpCustomers.jsx` - AR Customers page (Updated)
   - Uses: `/api/v1/customers` endpoint
   - Shows: AR customers only

2. `SuperAdminCustomers.jsx` - Super Admin Customers page (New)
   - Uses: `/api/v1/super-admin/customers` endpoint
   - Shows: Super Admin customers only

## API Endpoints

### AR Customers (Accounts Receivable)
```
GET    /api/v1/customers              - List AR customers
POST   /api/v1/customers              - Create AR customer
GET    /api/v1/customers/{id}         - Get AR customer
PATCH  /api/v1/customers/{id}         - Update AR customer
DELETE /api/v1/customers/{id}         - Delete AR customer
GET    /api/v1/customers/stats        - Get AR customer statistics
POST   /api/v1/customers/{id}/contacts - Add AR customer contact
```

### Super Admin Customers
```
GET    /api/v1/super-admin/customers              - List Super Admin customers (requires super_admin role)
POST   /api/v1/super-admin/customers              - Create Super Admin customer
GET    /api/v1/super-admin/customers/{id}         - Get Super Admin customer
PATCH  /api/v1/super-admin/customers/{id}         - Update Super Admin customer
DELETE /api/v1/super-admin/customers/{id}         - Delete Super Admin customer
GET    /api/v1/super-admin/customers/stats        - Get Super Admin customer statistics
POST   /api/v1/super-admin/customers/{id}/contacts - Add Super Admin customer contact
```

## Data Isolation Guarantees

1. **Table Separation**: Different database tables ensure no data mixing
2. **Route Isolation**: Separate API endpoints prevent cross-contamination
3. **Role-Based Access**: Super Admin endpoints require `super_admin` role
4. **Middleware Protection**: Request-level validation prevents unauthorized access
5. **Model Separation**: Distinct models prevent accidental data queries

## Frontend Usage

### AR Customers (Accounts Receivable)
```javascript
import { listARCustomers, createARCustomer } from 'api/customers';

// List AR customers
const data = await listARCustomers({ page: 1, perPage: 10 });

// Create AR customer
await createARCustomer({
  name: 'Customer Name',
  email: 'customer@example.com',
  type: 'VIP'
});
```

### Super Admin Customers
```javascript
import { listSuperAdminCustomers, createSuperAdminCustomer } from 'api/customers';

// List Super Admin customers
const data = await listSuperAdminCustomers({ page: 1, perPage: 10 });

// Create Super Admin customer
await createSuperAdminCustomer({
  name: 'Platform Customer',
  email: 'platform@example.com',
  type: 'Enterprise'
});
```

## Migration Steps

1. Run migration to create new tables:
   ```bash
   php artisan migrate
   ```

2. Update frontend components to use new API endpoints

3. Both customer types can coexist without conflict

## Security Features

1. **Authorization**: Super Admin role checks on protected endpoints
2. **Data Isolation**: No queries can accidentally access both tables
3. **Validation**: Middleware validates request routing
4. **Error Messages**: Clear error responses for unauthorized access

## Testing

### Test AR Customers Endpoint
```bash
GET /api/v1/customers
- Verify returns only clients table data
- Verify superadmin_customers not included
```

### Test Super Admin Customers Endpoint
```bash
GET /api/v1/super-admin/customers
- Verify requires super_admin role
- Verify returns only superadmin_customers table data
- Verify clients table not included
```

## Files Modified/Created

### Backend
- ✅ Created: `/database/migrations/tenant/2026_07_22_000001_create_superadmin_customers_table.php`
- ✅ Created: `/app/Models/SuperAdminCustomer.php`
- ✅ Created: `/app/Models/SuperAdminCustomerContact.php`
- ✅ Created: `/app/Http/Controllers/Api/CustomerController.php`
- ✅ Created: `/app/Http/Controllers/Api/SuperAdmin/SuperAdminCustomerController.php`
- ✅ Created: `/app/Http/Middleware/CustomerDataIsolationMiddleware.php`
- ✅ Updated: `/routes/api.php` (added routes and middleware)

### Frontend
- ✅ Created: `/src/api/customers.js`
- ✅ Updated: `/src/pages/systems/FMS/ERP/ErpCustomers.jsx`
- ✅ Created: `/src/pages/superadmin/SuperAdminCustomers.jsx`

## Next Steps

1. Run migrations to create tables
2. Register Super Admin page in page registry if not already done
3. Test both endpoints to verify data isolation
4. Update any other components that reference customers
