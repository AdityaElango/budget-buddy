import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div style={{ textAlign: "center", padding: 20, color: "#6b7280" }}>{text}</div>
);

export default Loader;
