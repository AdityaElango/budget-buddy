import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://budget-buddy-k52t.onrender.com";

// Export BASE_URL for use in legacy fetch calls
export const API_BASE_URL = BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request: attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("usersdatatoken");
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

// Response: handle 401 (expired/invalid)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Clear token and redirect
      localStorage.removeItem("usersdatatoken");
      // Avoid infinite loops: only redirect if not already on login
      if (window.location.pathname.toLowerCase() !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
