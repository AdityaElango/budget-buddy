import axios from "axios";

const api = axios.create({
  baseURL: "https://budget-buddy-k52t.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
 