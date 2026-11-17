import client from "./client";

export async function listAnnouncements(params = {}) {
  const res = await client.get("/announcements", { params });
  return res.data.data;
}

export async function listManageableAnnouncements(params = {}) {
  const res = await client.get("/announcements", { params: { ...params, manage: 1 } });
  return res.data.data;
}

export async function getAnnouncementStats() {
  const res = await client.get("/announcements/stats");
  return res.data.data;
}

export async function listAnnouncementTenants() {
  const res = await client.get("/announcements/tenants");
  return res.data.data;
}

export async function createAnnouncement(data) {
  const res = await client.post("/announcements", data);
  return res.data.data;
}

export async function updateAnnouncement(id, data) {
  const res = await client.put(`/announcements/${id}`, data);
  return res.data.data;
}

export async function deleteAnnouncement(id) {
  const res = await client.delete(`/announcements/${id}`);
  return res.data;
}

export async function markAnnouncementRead(id) {
  const res = await client.post(`/announcements/${id}/read`);
  return res.data.data;
}

export async function acknowledgeAnnouncement(id) {
  const res = await client.post(`/announcements/${id}/acknowledge`);
  return res.data.data;
}
