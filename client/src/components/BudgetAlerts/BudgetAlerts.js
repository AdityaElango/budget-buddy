import React from "react";
import "../Insights/Insights.css";

const BudgetAlert = ({ alert }) => {
  return (
    <div className={`budget-alert severity-${alert.severity}`}>
      <div className="budget-alert-header">
        <span className="budget-alert-category">{alert.category}</span>
        <span className="budget-alert-percent">{alert.percent}%</span>
      </div>
      <div className="budget-alert-bar">
        <div
          className="budget-alert-progress"
          style={{ width: `${Math.min(alert.percent, 100)}%` }}
        />
      </div>
      <div className="budget-alert-stats">
        <span>Spent: ₹{alert.spent.toFixed(0)}</span>
        <span>Limit: ₹{alert.limit.toFixed(0)}</span>
      </div>
      <div className="budget-alert-message">{alert.message}</div>
      {alert.suggestion && (
        <div className="budget-alert-suggestion">💡 {alert.suggestion}</div>
      )}
    </div>
  );
};

const BudgetAlerts = ({ alerts = [], title = "Budget Alerts" }) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  const dangerAlerts = alerts.filter(a => a.severity === 'danger');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');

  return (
    <div className="insights-card">
      <h3 className="insights-title" style={{ "::before": "⚠" }}>
        {title}
      </h3>
      <div className="budget-alert-container">
        {dangerAlerts.map((alert, idx) => (
          <BudgetAlert key={`danger-${idx}`} alert={alert} />
        ))}
        {warningAlerts.map((alert, idx) => (
          <BudgetAlert key={`warning-${idx}`} alert={alert} />
        ))}
        {infoAlerts.map((alert, idx) => (
          <BudgetAlert key={`info-${idx}`} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default BudgetAlerts;
