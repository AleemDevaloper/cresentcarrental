import client from "./client";

export async function listApiKeys() {
  const res = await client.get("/integrations/keys");
  return res.data;
}

export async function storeApiKey(data) {
  const res = await client.post("/integrations/keys", data);
  return res.data;
}

export async function toggleApiKey(id) {
  const res = await client.post(`/integrations/keys/${id}/toggle`);
  return res.data;
}

export async function deleteApiKey(id) {
  const res = await client.delete(`/integrations/keys/${id}`);
  return res.data;
}

export async function listWebhooks() {
  const res = await client.get("/integrations/webhooks");
  return res.data;
}

export async function storeWebhook(data) {
  const res = await client.post("/integrations/webhooks", data);
  return res.data;
}

export async function toggleWebhook(id) {
  const res = await client.post(`/integrations/webhooks/${id}/toggle`);
  return res.data;
}

export async function deleteWebhook(id) {
  const res = await client.delete(`/integrations/webhooks/${id}`);
  return res.data;
}
