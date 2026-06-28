// src/components/Header.jsx
// src/components/Header.jsx
// src/components/Header.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../theme";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import logoLight from "../assets/images/logo-light.svg";
import logoDark  from "../assets/images/logo-dark.svg";
import "../styles/Header.css";

export default function Header({ onToggleSidebar, sidebarOpen, setSearchQuery }) {
  const { theme, toggleTheme } = useTheme();
  const logo = theme === "dark" ? logoDark : logoLight;

  const [inputValue, setInputValue]   = useState("");
  const [isFocused,  setIsFocused]    = useState(false);
  const [scrolled,   setScrolled]     = useState(false);
  const debounceRef                   = useRef(null);
  const inputRef                      = useRef(null);

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Keyboard shortcut: / to focus search ── */
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") inputRef.current?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Debounced search ── */
  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearchQuery(value), 280);
    },
    [setSearchQuery]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
    inputRef.current?.focus();
  }, [setSearchQuery]);

  return (
    <header
      className={`hdr-root ${scrolled ? "hdr-root--scrolled" : ""}`}
      role="banner"
    >
      <div className="hdr-inner">

        {/* ── Logo ── */}
        <a href="/" className="hdr-logo" aria-label="PurpleFlix home">
          <img
            src={logo}
            alt="PurpleFlix"
            className="hdr-logo-img"
            width={120}
            height={36}
          />
        </a>

        {/* ── Search ── */}
        <div
          className={`hdr-search-wrap ${isFocused ? "hdr-search-wrap--focused" : ""}`}
          role="search"
        >
          <Search
            size={16}
            className="hdr-search-icon"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            className="hdr-search-input"
            placeholder="Search movies, series…"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search movies and series"
            autoComplete="off"
            spellCheck="false"
          />
          {inputValue && (
            <button
              className="hdr-search-clear"
              onClick={handleClear}
              aria-label="Clear search"
              tabIndex={0}
            >
              <X size={14} />
            </button>
          )}
          {/* Keyboard shortcut hint */}
          {!inputValue && !isFocused && (
            <kbd className="hdr-search-kbd" aria-hidden="true">/</kbd>
          )}
        </div>

        {/* ── Right actions ── */}
        <div className="hdr-actions">
          {/* Theme toggle */}
          <button
            className="hdr-icon-btn"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light"
              ? <Moon size={18} aria-hidden="true" />
              : <Sun  size={18} aria-hidden="true" />
            }
          </button>

          {/* Hamburger — mobile / tablet only */}
          <button
            className={`hdr-icon-btn hdr-hamburger ${sidebarOpen ? "hdr-hamburger--open" : ""}`}
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
          >
            {sidebarOpen
              ? <X    size={20} aria-hidden="true" />
              : <Menu size={20} aria-hidden="true" />
            }
          </button>
        </div>

      </div>
    </header>
  );
}