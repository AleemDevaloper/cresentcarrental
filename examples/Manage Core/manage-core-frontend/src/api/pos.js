import client from './client';

export async function listPosCatalog(params = {}) {
  const response = await client.get('/pos/catalog', { params });
  return response.data;
}

export async function searchPosBarcode(barcode) {
  const response = await client.get('/pos/catalog/barcode', { params: { barcode }, skipCache: true });
  return response.data;
}

export async function checkoutPosSale(payload) {
  const response = await client.post('/pos/checkout', payload);
  return response.data;
}

export async function getPosIntegrationSettings() {
  const response = await client.get('/pos/integrations', { skipCache: true });
  return response.data;
}

export async function updatePosIntegrationSettings(payload) {
  const response = await client.patch('/pos/integrations', payload);
  return response.data;
}

export async function listPosTerminals() {
  const response = await client.get('/pos/terminals', { skipCache: true });
  return response.data;
}

export async function listPosSessions(params = {}) {
  const response = await client.get('/pos/sessions', { params, skipCache: true });
  return response.data;
}

export async function holdPosCart(payload) {
  const response = await client.post('/pos/carts/hold', payload);
  return response.data;
}

export async function listPosOrders(params = {}) {
  const response = await client.get('/pos/orders', { params, skipCache: true });
  return response.data;
}

export async function getPosOrder(id) {
  const response = await client.get(`/pos/orders/${id}`, { skipCache: true });
  return response.data;
}

export async function listPosHeldCarts(params = {}) {
  const response = await client.get('/pos/carts/held', { params, skipCache: true });
  return response.data;
}

export async function resumePosCart(id) {
  const response = await client.post(`/pos/carts/held/${id}/resume`);
  return response.data;
}

export async function createPosRegister(payload) {
  const response = await client.post('/pos/registers', payload);
  return response.data;
}

export async function createPosTerminal(payload) {
  const response = await client.post('/pos/terminals', payload);
  return response.data;
}

export async function openPosSession(payload) {
  const response = await client.post('/pos/sessions', payload);
  return response.data;
}

export async function closePosSession(id, payload) {
  const response = await client.post(`/pos/sessions/${id}/close`, payload);
  return response.data;
}

export async function createPosReturn(payload) {
  const response = await client.post('/pos/returns', payload);
  return response.data;
}

export async function refundPosReturn(id, payload) {
  const response = await client.post(`/pos/returns/${id}/refund`, payload);
  return response.data;
}

export async function getPosPriceLists() {
  const response = await client.get('/pos/price-lists', { skipCache: true });
  return response.data;
}

export async function getPosDiscountRules(params = {}) {
  const response = await client.get('/pos/discount-rules', { params, skipCache: true });
  return response.data;
}
