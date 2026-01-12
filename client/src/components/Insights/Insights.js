import React from "react";
import "./Insights.css";

const InsightItem = ({ insight, index }) => {
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'positive':
        return 'insight-positive';
      case 'warning':
        return 'insight-warning';
      case 'danger':
        return 'insight-danger';
      default:
        return 'insight-info';
    }
  };

  return (
    <div className={`insight-item ${getSeverityClass(insight.severity)}`} key={index}>
      <div className="insight-content">
        <p className="insight-text">{insight.text}</p>
        {insight.suggestion && (
          <p className="insight-suggestion">💡 {insight.suggestion}</p>
        )}
      </div>
    </div>
  );
};

const InsightsCard = ({ insights = [], title = "Monthly Insights" }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="insights-card">
        <h3 className="insights-title">{title}</h3>
        <p className="insights-empty">Keep tracking your expenses to see insights!</p>
      </div>
    );
  }

  const sortedInsights = [...insights].sort((a, b) => {
    const severityOrder = { danger: 0, warning: 1, positive: 2, info: 3 };
    return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
  });

  return (
    <div className="insights-card">
      <h3 className="insights-title">{title}</h3>
      <div className="insights-list">
        {sortedInsights.slice(0, 5).map((insight, idx) => (
          <InsightItem key={idx} insight={insight} index={idx} />
        ))}
      </div>
      {insights.length > 5 && (
        <p className="insights-more">+{insights.length - 5} more insights</p>
      )}
    </div>
  );
};

export default InsightsCard;
