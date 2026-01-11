import api from "./api";

export const addIncome = async (payload) => {
  try {
    console.log("Sending income payload:", payload);
    const res = await api.post("/income", payload);
    return res.data;
  } catch (error) {
    console.error("Income API error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const listIncome = async (params = {}) => {
  const res = await api.get("/income", { params });
  return res.data;
};
