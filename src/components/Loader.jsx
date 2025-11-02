import React from "react";
import "../style.css"; // optional separate CSS

export default function Loader() {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Loading your tasks...</p>
    </div>
  );
}
