import React, { useContext, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LoginContext, DateContext } from "./Context/Context";
import { ThemeContext } from "./Context/ThemeContext";
import Avatar from "@mui/material/Avatar";
import { logout as logoutApi } from "../api/authApi";
import "./header.css";
import logo from "../logo_icon.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { logindata, setLoginData, isAuthenticated } = useContext(LoginContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useContext(DateContext);

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side session
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear client-side authentication data
      localStorage.removeItem("usersdatatoken");
      setLoginData("");
      // Redirect to home
      navigate("/", { replace: true });
    }
  };

  const monthOptions = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const handleLogoClick = () => {
    // If logged in, go to dashboard; otherwise go to about page
    if (isAuthenticated) {
      navigate("/dash");
    } else {
      navigate("/");
    }
  };

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, idx) => currentYear - idx);
  }, []);

  const navItems = [
    { path: "/dash", label: "Dashboard", icon: "📊" },
    { path: "/accounts", label: "Accounts", icon: "🏦" },
    { path: "/transaction", label: "Transaction", icon: "💳" },
    { path: "/budget", label: "Budget", icon: "💰" },
    { path: "/recurring", label: "Recurring", icon: "🔄" },
    { path: "/analysis", label: "Analysis", icon: "📈" },
    { path: "/goals", label: "Goals", icon: "🎯" },
  ];

  return (
    <header className="header">
      <nav className="navbar">
        <div className="brand" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img className="logo" src={logo} alt="BudgetBuddy" />
          <span className="brand-name">BudgetBuddy</span>
        </div>

        <div className="nav-content">
          {isAuthenticated ? (
            <>
              <div className="period-controls" title="Time range applies across pages">
                <select
                  aria-label="Select month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {monthOptions.map((label, idx) => (
                    <option key={label} value={idx + 1}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Select year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {yearOptions.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                    onClick={() => setMobileMenuOpen(false)}
                    title={item.label}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="nav-right">
                <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
                  {isDark ? '☀️' : '🌙'}
                </button>

                <div className="user-menu">
                  <button 
                    className="user-avatar-btn" 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    title="User Menu"
                  >
                    <Avatar className="user-avatar" style={{ background: "#2563eb", cursor: "pointer" }}>
                      {logindata?.ValidUserOne?.fname?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <div className="user-name">{logindata?.ValidUserOne?.fname} {logindata?.ValidUserOne?.lname}</div>
                        <div className="user-email">{logindata?.ValidUserOne?.email}</div>
                      </div>
                      <hr className="dropdown-divider" />
                      <NavLink to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        ⚙️ Profile Settings
                      </NavLink>
                      <button onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }} className="dropdown-item logout-btn">
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  className="mobile-menu-toggle"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title="Menu"
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="theme-toggle" onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
                {isDark ? '☀️' : '🌙'}
              </button>
              <div className="nav-actions">
                <NavLink to="/login" className="btn btn-login">
                  Login
                </NavLink>
                <NavLink to="/signup" className="btn btn-signup">
                  Sign Up
                </NavLink>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
