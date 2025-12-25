import api from "./api";

export const signup = async (fname, email, password, cpassword) => {
  const res = await api.post("/signup", { fname, email, password, cpassword });
  return res.data; // {status, storeData}
};

export const login = async (email, password) => {
  const res = await api.post("/login", { email, password });
  return res.data; // {status, result:{token,userValid}}
};

export const validateUser = async () => {
  const res = await api.get("/validuser");
  return res.data; // {status, ValidUserOne}
};

export const logout = async () => {
  const res = await api.post("/logout");
  return res.data; // {status, message}
};
