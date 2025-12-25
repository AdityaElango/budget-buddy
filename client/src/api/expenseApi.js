import api from "./api";

export const addExpense = async (payload) => {
  const res = await api.post("/expense", payload);
  return res.data;
};

export const listExpenses = async (params = {}) => {
  const res = await api.get("/expense", { params });
  return res.data;
};
