import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../Context/Context";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(LoginContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
