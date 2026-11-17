/** Normalize Next.js App Router dynamic segment (string | string[] | undefined). */
export function routeParam(value) {
  if (value == null || value === "") return "";
  const raw = Array.isArray(value) ? value[0] : value;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
