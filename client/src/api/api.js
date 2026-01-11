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

export default api;
 