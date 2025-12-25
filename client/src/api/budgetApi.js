import api from "./api";

export const setBudget = async (payload) => {
  const res = await api.post("/budget", payload);
  return res.data;
};

export const listBudgets = async (params = {}) => {
  const res = await api.get("/budget", { params });
  return res.data;
};
