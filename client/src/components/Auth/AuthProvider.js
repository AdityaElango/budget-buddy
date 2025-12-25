import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/Context";
import { validateUser as validateUserApi } from "../../api/authApi";

// Bootstraps authentication on app load so protected routes have user state
const AuthProvider = ({ children }) => {
  const { setLoginData } = useContext(LoginContext);
  const [bootstrapping, setBootstrapping] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("usersdatatoken");

    // If no token, nothing to validate — render immediately
    if (!token) {
      setBootstrapping(false);
      return;
    }

    // Validate existing session and populate context
    (async () => {
      try {
        const data = await validateUserApi();
        if (data?.status === 201 && data?.ValidUserOne) {
          setLoginData(data);
        } else {
          // Invalid token — clear and redirect to login if on a protected path
          localStorage.removeItem("usersdatatoken");
          const protectedPaths = ["/dash", "/accounts", "/transaction", "/budget", "/analysis", "/recurring", "/goals"]; 
          if (protectedPaths.some(p => location.pathname.toLowerCase().startsWith(p))) {
            navigate("/login", { replace: true });
          }
        }
      } catch (err) {
        // Network or validation error — clear token and redirect if needed
        console.error("Auth validation error:", err);
        localStorage.removeItem("usersdatatoken");
        const protectedPaths = ["/dash", "/accounts", "/transaction", "/budget", "/analysis", "/recurring", "/goals"];
        if (protectedPaths.some(p => location.pathname.toLowerCase().startsWith(p))) {
          navigate("/login", { replace: true });
        }
      } finally {
        setBootstrapping(false);
      }
    })();
  }, [setLoginData, navigate, location.pathname]);

  // Prevent rendering of protected routes during token validation
  const hasToken = !!localStorage.getItem("usersdatatoken");
  const protectedPaths = ["/dash", "/accounts", "/transaction", "/budget", "/analysis", "/recurring", "/goals"];
  const isProtectedPath = protectedPaths.some(p => location.pathname.toLowerCase().startsWith(p));
  
  if (hasToken && isProtectedPath && bootstrapping) {
    return null; // Prevent flicker while validating auth
  }

  return children;
};

export default AuthProvider;
