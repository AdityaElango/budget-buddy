import React from "react";

const EmptyState = ({
  title = "No data yet",
  description = "Start by adding your first item to see it here.",
  actionLabel = "+ Add",
  onAction,
  secondaryLabel,
  onSecondary,
  illustration = "*",
}) => {
  return (
    <div className="empty-card" role="status" aria-live="polite">
      <div className="empty-illustration" aria-hidden="true">{illustration}</div>
      <p className="empty-title">{title}</p>
      <p className="empty-body">{description}</p>
      {(onAction || onSecondary) && (
        <div className="empty-actions">
          {onAction && (
            <button type="button" className="btn-primary" onClick={onAction}>
              {actionLabel}
            </button>
          )}
          {onSecondary && (
            <button type="button" className="btn-ghost" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
