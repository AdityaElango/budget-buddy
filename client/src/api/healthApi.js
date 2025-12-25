import api from "./api";

export const getHealthScore = async (month, year) => {
  const res = await api.get("/health-score", { params: { month, year } });
  return res.data; // {status, score, label, explanation}
};
