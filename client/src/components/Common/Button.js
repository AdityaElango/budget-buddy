import React from "react";

const Button = ({ children, className = "btn", disabled, onClick, type = "button" }) => (
  <button className={className} disabled={disabled} onClick={onClick} type={type}>
    {children}
  </button>
);

export default Button;
