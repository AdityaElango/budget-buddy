import React from "react";

const Card = ({ children, className = "card" }) => (
  <div className={className}>
    {children}
  </div>
);

export default Card;
