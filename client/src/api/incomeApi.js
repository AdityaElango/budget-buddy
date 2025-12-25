import api from "./api";

export const addIncome = async (payload) => {
  const res = await api.post("/income", payload);
  return res.data;
};

export const listIncome = async (params = {}) => {
  const res = await api.get("/income", { params });
  return res.data;
};
