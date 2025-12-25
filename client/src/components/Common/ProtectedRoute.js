import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../Context/Context";

const ProtectedRoute = ({ children }) => {
  const { logindata } = useContext(LoginContext);
  const token = localStorage.getItem("usersdatatoken");

  // Must have BOTH a valid token AND logindata populated by auth validation
  // logindata is populated by AuthProvider after successful token validation
  const isAuthed = !!token && !!logindata && logindata.ValidUserOne;

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
