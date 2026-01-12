import React from "react";
import "../Insights/Insights.css";

const RecurringAnalysis = ({ analysis = {}, title = "Recurring Transactions" }) => {
  const {
    totalMonthlyCommitment = 0,
    predictedMonthlyExpense = 0,
    recommendations = []
  } = analysis;

  return (
    <div className="recurring-analysis">
      <h3 className="insights-title" style={{ "::before": "🔄" }}>
        {title}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
        <div className="recurring-stat">
          <div className="recurring-stat-label">Monthly Commitment</div>
          <div className="recurring-stat-value">
            ₹{totalMonthlyCommitment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="recurring-stat">
          <div className="recurring-stat-label">Recurring Expenses</div>
          <div className="recurring-stat-value">
            ₹{predictedMonthlyExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h4 style={{ margin: "0 0 var(--space-md) 0", fontSize: "var(--font-size-base)", fontWeight: "600" }}>
            Recommendations
          </h4>
          <div className="recurring-recommendations">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="recurring-rec-item">
                <p className="recurring-rec-text">{rec.text}</p>
                {rec.amount && (
                  <p className="recurring-rec-amount">
                    Monthly impact: ₹{rec.amount.toFixed(0)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringAnalysis;
