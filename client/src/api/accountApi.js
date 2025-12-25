import api from "./api";

export const addAccount = async (payload) => {
  const res = await api.post("/account", payload);
  return res.data;
};

export const listAccounts = async (params = {}) => {
  const res = await api.get("/account", { params });
  return res.data;
};
