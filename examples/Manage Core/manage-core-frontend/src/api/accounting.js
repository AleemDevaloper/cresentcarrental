import client from './client';

const BASE = '/fiscal-years';

export async function listFiscalYears(params = {}) {
  const res = await client.get('/fiscal-years', { params });
  return res;
}
export async function createFiscalYear(payload) {
  const res = await client.post('/fiscal-years', payload);
  return res;
}
export async function updateFiscalYear(id, payload) {
  const res = await client.patch(`/fiscal-years/${id}`, payload);
  return res;
}
export async function deleteFiscalYear(id) {
  const res = await client.delete(`/fiscal-years/${id}`);
  return res;
}

// Periods
export async function listPeriods(params = {}) {
  const res = await client.get('/periods', { params });
  return res;
}
export async function createPeriod(payload) { const res = await client.post('/periods', payload); return res; }
export async function updatePeriod(id, payload) { const res = await client.patch(`/periods/${id}`, payload); return res; }
export async function deletePeriod(id) { const res = await client.delete(`/periods/${id}`); return res; }

// Account Types
export async function listAccountTypes(params = {}) { const res = await client.get('/account-types', { params }); return res; }
export async function createAccountType(p) { const res = await client.post('/account-types', p); return res; }
export async function updateAccountType(id,p){ const res = await client.patch(`/account-types/${id}`, p); return res; }
export async function deleteAccountType(id){ const res = await client.delete(`/account-types/${id}`); return res; }

// Account Groups
export async function listAccountGroups(params={}){ const res = await client.get('/account-groups', { params }); return res; }
export async function createAccountGroup(p){ const res = await client.post('/account-groups', p); return res; }
export async function updateAccountGroup(id,p){ const res = await client.patch(`/account-groups/${id}`, p); return res; }
export async function deleteAccountGroup(id){ const res = await client.delete(`/account-groups/${id}`); return res; }

// Accounts
export async function listAccounts(params={}){ const res = await client.get('/accounts', { params }); return res; }
export async function createAccount(p){ const res = await client.post('/accounts', p); return res; }
export async function updateAccount(id,p){ const res = await client.patch(`/accounts/${id}`, p); return res; }
export async function deleteAccount(id){ const res = await client.delete(`/accounts/${id}`); return res; }

// Opening Balances
export async function listOpeningBalances(params={}){ const res = await client.get('/opening-balances', { params }); return res; }
export async function createOpeningBalance(p){ const res = await client.post('/opening-balances', p); return res; }
export async function updateOpeningBalance(id,p){ const res = await client.patch(`/opening-balances/${id}`, p); return res; }
export async function deleteOpeningBalance(id){ const res = await client.delete(`/opening-balances/${id}`); return res; }
