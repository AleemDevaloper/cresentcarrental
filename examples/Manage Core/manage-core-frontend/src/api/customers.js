const API_BASE = '/api/v1';

async function request(path, opts = {}) {
  const url = API_BASE + path + (opts.q ? `?${new URLSearchParams(opts.q)}` : '');
  const res = await fetch(url, {
    method: opts.method || 'GET',
    credentials: 'include',
    headers: Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}),
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (isJson && data && data.message) ? data.message : res.statusText;
    const err = new Error(message || 'Request failed');
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

// AR CUSTOMERS API (from clients table - Accounts Receivable)
export const listARCustomers = (params = {}) => request('/customers', { q: params });
export const getARCustomer = (id) => request(`/customers/${id}`);
export const createARCustomer = (data) => request('/customers', { method: 'POST', body: data });
export const updateARCustomer = (id, data) => request(`/customers/${id}`, { method: 'PATCH', body: data });
export const deleteARCustomer = (id) => request(`/customers/${id}`, { method: 'DELETE' });
export const getARCustomerStats = () => request('/customers/stats');

// SUPER ADMIN CUSTOMERS API (from superadmin_customers table)
export const listSuperAdminCustomers = (params = {}) => request('/super-admin/customers', { q: params });
export const getSuperAdminCustomer = (id) => request(`/super-admin/customers/${id}`);
export const createSuperAdminCustomer = (data) => request('/super-admin/customers', { method: 'POST', body: data });
export const updateSuperAdminCustomer = (id, data) => request(`/super-admin/customers/${id}`, { method: 'PATCH', body: data });
export const deleteSuperAdminCustomer = (id) => request(`/super-admin/customers/${id}`, { method: 'DELETE' });
export const getSuperAdminCustomerStats = () => request('/super-admin/customers/stats');