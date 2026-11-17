const cacheStore = new Map();
const inflightStore = new Map();
const CACHE_TTL = 30_000;

function getCacheKey(url, params) {
  if (!params) return url;
  const query = new URLSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
}

function cachedFetch(fullPath, fetchFn) {
  const cached = cacheStore.get(fullPath);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return Promise.resolve(cached.data);
  }
  const inflight = inflightStore.get(fullPath);
  if (inflight) return inflight;
  const promise = fetchFn().then(data => {
    cacheStore.set(fullPath, { data, ts: Date.now() });
    inflightStore.delete(fullPath);
    return data;
  }).catch(err => {
    inflightStore.delete(fullPath);
    throw err;
  });
  inflightStore.set(fullPath, promise);
  return promise;
}

export function clearCache(pattern) {
  if (pattern) {
    for (const key of cacheStore.keys()) {
      if (key.includes(pattern)) cacheStore.delete(key);
    }
  } else {
    cacheStore.clear();
    inflightStore.clear();
  }
}

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
}

export function getAuthToken() {
  return localStorage.getItem("auth_token");
}

export function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem("auth_token");
    return;
  }

  localStorage.setItem("auth_token", token);
}

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function buildHeaders({ body, authToken, headers = {} }) {
  const language = localStorage.getItem("app_language") || "English";
  const languageMap = {
    'English': 'en',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Arabic': 'ar'
  };
  
  const finalHeaders = {
    Accept: "application/json",
    "Accept-Language": languageMap[language] || 'en',
    ...headers,
  };

  if (authToken) {
    finalHeaders.Authorization = 'Bearer ' + authToken;
  }

  if (!(body instanceof FormData) && body !== undefined && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  return finalHeaders;
}

export async function apiRequest(
  path,
  { method = "GET", body, token, headers = {}, responseType = "json", ...restOpts } = {}
) {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const authToken = token ?? getAuthToken();
  const requestHeaders = buildHeaders({ body, authToken, headers });

  const maskedHeaders = { ...requestHeaders, Authorization: requestHeaders.Authorization ? 'Bearer ****' : undefined };
  console.debug('[apiRequest]', method, url, maskedHeaders);

  const res = await fetch(url, {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : requestHeaders["Content-Type"] === "application/json"
        ? JSON.stringify(body)
        : body,
  });

  if (responseType === "blob") {
    if (!res.ok) {
      let body = null;
      try { body = await res.text(); } catch {}
      throw new Error(`Request failed (${res.status})${body ? `: ${body.slice(0, 300)}` : ''}`);
    }

    return {
      blob: await res.blob(),
      headers: res.headers,
      status: res.status,
    };
  }

  const contentType = res.headers.get("content-type") || "";
  let data = null;
  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch (parseErr) {
      // Non-JSON body returned despite JSON content-type. Fall back to text.
      const text = await res.text();
      data = { message: text.slice(0, 500) || 'Invalid JSON response' };
    }
  } else {
    const text = await res.text();
    if (text) {
      data = { message: text.slice(0, 500) };
    }
  }

  if (!res.ok) {
    if (res.status === 401 && authToken && restOpts?.validateAuthOnUnauthorized && path !== '/api/v1/auth/me') {
      try {
        await apiRequest('/api/v1/auth/me', { token: authToken });
      } catch {
        // The auth probe owns session cleanup; preserve the original request error.
      }
    } else if (res.status === 401 && authToken && !restOpts?.skipAuthRedirect) {
      const isAuthProbe = path === '/api/v1/auth/me';
      if (isAuthProbe) {
        setAuthToken(null);
        unauthorizedHandler?.();
      }
    }

    const message =
      data?.message ||
      data?.error ||
      (data?.errors ? Object.values(data.errors).flat()[0] : null) ||
      `Request failed (${res.status})`;

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

const client = {
  get: (path, options = {}) => {
    const { params, skipCache, ...rest } = options;
    let url = path;
    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) url += (url.includes("?") ? "&" : "?") + query;
    }
    const fullPath = url.startsWith("/api/v1") ? url : `/api/v1${url.startsWith("/") ? "" : "/"}${url}`;
    if (skipCache) {
      return apiRequest(fullPath, { ...rest, method: "GET" }).then((data) => ({ data }));
    }
    const cacheKey = getCacheKey(fullPath, params);
    return cachedFetch(cacheKey, () =>
      apiRequest(fullPath, { ...rest, method: "GET" })
    ).then((data) => ({ data }));
  },
  post: (path, body, options = {}) => {
    const fullPath = path.startsWith("/api/v1") ? path : `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
    return apiRequest(fullPath, {
      ...options,
      method: "POST",
      body,
    }).then((data) => ({ data }));
  },
  patch: (path, body, options = {}) => {
    const fullPath = path.startsWith("/api/v1") ? path : `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
    return apiRequest(fullPath, {
      ...options,
      method: "PATCH",
      body,
    }).then((data) => ({ data }));
  },
  put: (path, body, options = {}) => {
    const fullPath = path.startsWith("/api/v1") ? path : `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
    return apiRequest(fullPath, {
      ...options,
      method: "PUT",
      body,
    }).then((data) => ({ data }));
  },
  delete: (path, options = {}) => {
    const fullPath = path.startsWith("/api/v1") ? path : `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
    return apiRequest(fullPath, {
      ...options,
      method: "DELETE",
    }).then((data) => ({ data }));
  },
};

export default client;
