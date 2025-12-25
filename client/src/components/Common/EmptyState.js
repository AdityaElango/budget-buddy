import React from "react";

const EmptyState = ({ message = "No data available." }) => (
  <div style={{ textAlign: "center", padding: 20, color: "var(--text-secondary)" }}>{message}</div>
);

export default EmptyState;
