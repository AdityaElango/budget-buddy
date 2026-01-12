import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/Context";
import { validateUser as validateUserApi } from "../../api/authApi";
import authService from "../../services/authService";

// Bootstraps authentication on app load so protected routes have user state
const AuthProvider = ({ children }) => {
  const { setLoginData } = useContext(LoginContext);
  const [bootstrapping, setBootstrapping] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("usersdatatoken") || authService.getToken();

    // If no token, nothing to validate — render immediately
    if (!token) {
      setBootstrapping(false);
      return;
    }

    // Check if token is expired
    if (authService.isTokenExpired(token)) {
      localStorage.removeItem("usersdatatoken");
      setBootstrapping(false);
      const protectedPaths = ["/dash", "/accounts", "/transaction", "/budget", "/analysis", "/recurring", "/goals"]; 
      if (protectedPaths.some(p => location.pathname.toLowerCase().startsWith(p))) {
        navigate("/login", { replace: true });
      }
      return;
    }

    // Validate existing session and populate context
    (async () => {
      try {
        const data = await validateUserApi();
        if (data?.status === 201 && data?.ValidUserOne) {
          setLoginData(data);
          // Store user data in authService
          authService.setAuth(token, data.ValidUserOne);
        } else {
          // Invalid token — clear and redirect to login if on a protected path
          localStorage.removeItem("usersdatatoken");
          authService.logout();
          const protectedPaths = ["/dash", "/accounts", "/transaction", "/budget", "/analysis", "/recurring", "/goals"]; 
          if (protectedPaths.some(p => location.pathname.toLowerCase().startsWith(p))) {
            navigate("/login", { replace: true });
          }
        }
      } catch (err) {
        // Network or validation error — clear token and redirect if needed
        console.error("Auth validation error:", err);
        localStorage.removeItem("usersdatatoken");
        authService.logout();
        const protectedPaths = ["/dash", "/accounts", "/transaction", "/budget", "/analysis", "/recurring", "/goals"];
        if (protectedPaths.some(p => location.pathname.toLowerCase().startsWith(p))) {
          navigate("/login", { replace: true });
        }
      } finally {
        setBootstrapping(false);
      }
    })();

    // Setup token expiry check every minute
    const checkInterval = setInterval(() => {
      if (authService.checkTokenExpiry()) {
        navigate("/login", { replace: true });
      }
    }, 60000); // Check every minute

    // Listen for manual logout events
    const handleLogout = () => {
      navigate("/login", { replace: true });
    };
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      clearInterval(checkInterval);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [setLoginData, navigate]); // Removed location.pathname dependency

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
