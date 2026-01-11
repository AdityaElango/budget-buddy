import api from "./api";

export const addExpense = async (payload) => {
  try {
    console.log("Sending expense payload:", payload);
    const res = await api.post("/expense", payload);
    return res.data;
  } catch (error) {
    console.error("Expense API error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const listExpenses = async (params = {}) => {
  const res = await api.get("/expense", { params });
  return res.data;
};
