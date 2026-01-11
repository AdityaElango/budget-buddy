import axios from "axios";

const api = axios.create({
  baseURL: "https://budget-buddy-k52t.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_BASE_URL = "https://budget-buddy-k52t.onrender.com/api";

// Attach bearer token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("usersdatatoken");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

// -------------------------------------------------
// Lightweight GET cache with TTL + request de-dupe
// -------------------------------------------------
const responseCache = new Map(); // key -> { expiry: number, data: any }
const inFlight = new Map(); // key -> Promise

const buildKey = (path, params = {}) => {
  try {
    const q = new URLSearchParams(params);
    return `${path}?${q.toString()}`;
  } catch (_) {
    // Fallback serialization
    return `${path}?${JSON.stringify(params)}`;
  }
};

/**
 * cachedGet: perform a GET request with in-memory caching.
 * @param {string} path - API path (e.g., "/expense/user/123")
 * @param {object} params - Query params object
 * @param {object} options - { ttl?: number } cache time in ms (default 5 min)
 * @returns {Promise<any>} response data
 */
export async function cachedGet(path, params = {}, options = {}) {
  const ttl = typeof options.ttl === "number" ? options.ttl : 5 * 60 * 1000; // 5 minutes
  const key = buildKey(path, params);

  const now = Date.now();
  const cached = responseCache.get(key);
  if (cached && cached.expiry > now) {
    return cached.data;
  }

  // De-dupe concurrent requests for same key
  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const req = api
    .get(path, { params })
    .then((res) => {
      responseCache.set(key, { expiry: now + ttl, data: res.data });
      inFlight.delete(key);
      return res.data;
    })
    .catch((err) => {
      inFlight.delete(key);
      throw err.response?.data || err;
    });

  inFlight.set(key, req);
  return req;
}

/**
 * clearCachedGet: invalidate cache for a path+params combo.
 */
export function clearCachedGet(path, params = {}) {
  const key = buildKey(path, params);
  responseCache.delete(key);
}

export default api;
 