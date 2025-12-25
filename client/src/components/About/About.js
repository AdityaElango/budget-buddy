import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import leftImage from './leftImage.jpeg';
import rightImage from './rightImage.jpeg';

const About = () => {
  return (
    <div className="main_about">
      <div className="hero_section">
        <div className="hero_content">
          <h1 className="main_heading">Understand Where Your Money Goes — Instantly.</h1>
          <p className="hero_subtitle">
            BudgetBuddy keeps your finances crystal clear—track every dollar, set sharp budgets, and build confident money habits without the noise.
          </p>
          <div className="hero_actions">
            <Link to="/signup" className="btn btn_primary">Get Started</Link>
            <Link to="/login" className="btn btn_secondary">Login</Link>
          </div>
          <div className="trust_badges">
            <div className="trust_badge">
              <span className="badge_icon">🔒</span>
              <span className="badge_label">Your data is encrypted & private</span>
            </div>
            <div className="trust_badge">
              <span className="badge_icon">📊</span>
              <span className="badge_label">Designed for clarity, not clutter</span>
            </div>
            <div className="trust_badge">
              <span className="badge_icon">⚡</span>
              <span className="badge_label">Fast. Simple. No ads.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about">
        <div className="images-content">
          <img src={leftImage} alt="Financial Growth" className="left-image" />
          <div className="text-content">
            <h2>Why Choose BudgetBuddy?</h2>
            <div className="how_strip">
              <div className="step">
                <span className="step_icon">➕</span>
                <div>
                  <p className="step_title">Add income & expenses</p>
                  <p className="step_copy">Log transactions in seconds with clean categories.</p>
                </div>
              </div>
              <div className="step">
                <span className="step_icon">🎯</span>
                <div>
                  <p className="step_title">Set monthly budgets</p>
                  <p className="step_copy">Assign limits and alerts that keep you on course.</p>
                </div>
              </div>
              <div className="step">
                <span className="step_icon">📈</span>
                <div>
                  <p className="step_title">Track trends & insights</p>
                  <p className="step_copy">Spot patterns, adjust quickly, and stay in control.</p>
                </div>
              </div>
            </div>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Expense Tracking</h3>
                <p>Easily categorize and track your expenses to gain insights into where your money is going.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h3>Budget Management</h3>
                <p>Set personalized budgets for different categories and keep your spending in check.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <h3>Analytical Tools</h3>
                <p>Visualize your spending habits with interactive charts and reports for informed decisions.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h3>Secure Data Storage</h3>
                <p>Your financial data is encrypted and stored securely to ensure privacy and protection.</p>
              </div>
            </div>
          </div>
          <img src={rightImage} alt="Budget Planning" className="right-image" />
        </div>
      </div>
    </div>
  );
};

export default About;
