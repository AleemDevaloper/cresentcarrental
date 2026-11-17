import { listARCustomers } from '../api/customers';

// Maps an Accounts Receivable customer (clients table) into the rich shape
// expected by the sales module forms (quotations, orders, challans, invoices,
// credit notes, returns).
export const mapARCustomer = (c = {}) => {
  const health = Number(c.health_score ?? 100);
  return {
    id: c.id,
    code: c.code || `CUST-${String(c.id).padStart(3, '0')}`,
    name: c.name || c.company_name || 'Unknown Customer',
    type: c.type || 'Customer',
    phone: c.phone || '',
    email: c.email || '',
    city: c.city || c.country || '',
    status: c.status || 'Active',
    creditLimit: Number(c.credit_limit ?? c.limit ?? 0) || 0,
    outstanding: Number(c.balance ?? 0) || 0,
    group: c.industry || 'General',
    rating: Math.round(health / 20),
    currency: c.currency || 'USD',
    terms: c.payment_terms || c.terms || 'Net 30',
    salesperson: c.salesperson || null,
    taxProfile: c.tax_profile || 'Standard',
    priceList: c.price_list || '',
    warehouse: c.warehouse || 'Main Warehouse',
    discount: Number(c.discount ?? 0) || 0,
    ntn: c.ntn || '',
    strn: c.strn || '',
    billingAddress: c.address || c.billing_address || '',
    shippingAddress: c.shipping_address || c.address || '',
    riskLevel: health >= 80 ? 'Low' : health >= 50 ? 'Medium' : 'High',
    lastPaymentDate: c.last_payment_date || '-',
    lastInvoiceDate: c.last_invoice_date || '-',
    totalSales: Number(c.total_revenue ?? 0) || 0,
    avgPaymentDays: Number(c.avg_payment_days ?? 0) || 0,
    customerSince: c.since || (c.created_at ? String(c.created_at).slice(0, 10) : '-'),
  };
};

// Fetches ONLY the customers managed in Accounts Receivable > Customers.
export const fetchSalesCustomers = async () => {
  try {
    const data = await listARCustomers({ perPage: 1000 });
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.map(mapARCustomer);
  } catch {
    return [];
  }
};
