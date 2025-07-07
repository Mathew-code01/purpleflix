// src/components/Header.jsx
// src/components/Header.jsx
import React, { useState } from "react";
import { useTheme } from "../theme";
import logoLight from "../assets/images/logo-light.svg";
import logoDark from "../assets/images/logo-dark.svg";
import "../styles/Header.css";
import { Search, Sun, Moon, Menu } from "lucide-react";

const Header = ({ onToggleSidebar, setSearchQuery }) => {
  const { theme, toggleTheme } = useTheme();
  const logo = theme === "dark" ? logoDark : logoLight;
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value); // This triggers navigate("/") from App.jsx
  };

  return (
    <header className="header">
      <a href="/" className="header-logo-wrapper">
        <img src={logo} alt="PurpleFlix Logo" className="header-logo-img" />
      </a>

      <div className="header-left">
        <button
          className="menu-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="header-center">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            value={inputValue}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="header-right">
        <button className="theme-button" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
