import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "./Context/ThemeContext";
import "./PublicHeader.css";
import logo from "../logo_icon.png";

const PublicHeader = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="public-header">
      <nav className="public-navbar">
        <div className="public-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <img className="public-logo" src={logo} alt="BudgetBuddy" />
          <span className="public-brand-name">BudgetBuddy</span>
        </div>

        <div className="public-nav-actions">
          <button className="public-theme-toggle" onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <NavLink to="/login" className="public-btn public-btn-login">
            Login
          </NavLink>
          <NavLink to="/signup" className="public-btn public-btn-signup">
            Sign Up
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default PublicHeader;
