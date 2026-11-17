const API_BASE = (import.meta.env?.VITE_API_BASE_URL || "http://managecore.local:8080").replace(/\/$/, "");

async function post(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export function submitDemoRequest(payload) {
  return post("/api/v1/public/website/demo", payload);
}

export function submitContactMessage(payload) {
  return post("/api/v1/public/website/contact", payload);
}
