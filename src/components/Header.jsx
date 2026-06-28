// src/components/Header.jsx
// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../theme";

import logoLight from "../assets/images/logo-light.svg";
import logoDark from "../assets/images/logo-dark.svg";

import "../styles/Header.css";

import { Search, Sun, Moon, Menu } from "lucide-react";

const Header = ({ onToggleSidebar, setSearchQuery }) => {
  const { theme, toggleTheme } = useTheme();

  const [inputValue, setInputValue] = useState("");

  const logo = theme === "dark" ? logoDark : logoLight;

  const handleChange = (e) => {
    const value = e.target.value;

    setInputValue(value);

    setSearchQuery(value);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            className="header-menu"
            onClick={onToggleSidebar}
            aria-label="Open navigation"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="header-brand">
            <img src={logo} alt="PurpleFlix" className="header-logo" />
          </Link>
        </div>

        <div className="header-search">
          <div className="search-box">
            <Search className="search-icon" size={20} />

            <input
              type="text"
              placeholder="Search movies..."
              value={inputValue}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Change theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;