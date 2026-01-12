import React from "react";

export const SkeletonCard = ({ lines = 3, accent = false }) => (
  <div className={`skeleton-card ${accent ? "accent" : ""}`} aria-hidden="true">
    <div className="skeleton skeleton-pill" />
    {[...Array(lines)].map((_, idx) => (
      <div
        key={idx}
        className={`skeleton skeleton-line ${idx === 0 ? "w-70" : idx === lines - 1 ? "w-40" : "w-90"}`}
      />
    ))}
  </div>
);

export const SkeletonList = ({ rows = 5 }) => (
  <div className="skeleton-list" aria-hidden="true">
    {[...Array(rows)].map((_, idx) => (
      <div key={idx} className="skeleton skeleton-row" />
    ))}
  </div>
);

export const SkeletonHero = () => (
  <div className="skeleton-hero" aria-hidden="true">
    <div className="skeleton skeleton-line skeleton-lg w-60" />
    <div className="skeleton skeleton-line skeleton-md w-30" />
  </div>
);
