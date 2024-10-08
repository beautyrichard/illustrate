import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="app-header" role="banner">
      {/* The h1 serves as the main title */}
      <h1 id="main-title">Cribl Log Viewer</h1>
      {/* This is a subtitle, placed below the main title */}
      <p aria-describedby="main-title">
        Streaming logs directly from the server
      </p>
    </header>
  );
};

export default Header;
