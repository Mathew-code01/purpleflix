// src/components/Navbar.jsx
import React, { useEffect, useRef } from "react";
import { useTheme }  from "../theme";
import logoLight     from "../assets/images/logo-light.png";
import logoDark      from "../assets/images/logo-dark.png";
import {
  FaFire, FaStar, FaClock,
  FaFistRaised, FaHiking, FaTv,
  FaUserSecret, FaHeart,
  FaExclamationTriangle, FaFlask,
} from "react-icons/fa";
import {
  GiMagnifyingGlass,
  GiScrollUnfurled,
  GiDramaMasks,
} from "react-icons/gi";
import {
  MdAnimation,
  MdOutlineFamilyRestroom,
  MdOutlineEmojiEmotions,
} from "react-icons/md";
import { BiGhost } from "react-icons/bi";
import { X }       from "lucide-react";
import "../styles/Navbar.css";

/* ── Data ── */
const CATEGORIES = [
  { id: "popular",   label: "Popular",   icon: <FaFire /> },
  { id: "top_rated", label: "Top Rated", icon: <FaStar /> },
  { id: "upcoming",  label: "Upcoming",  icon: <FaClock /> },
];

const GENRES = [
  { id: "16",    label: "Animation",      icon: <MdAnimation /> },
  { id: "9648",  label: "Mystery",        icon: <GiMagnifyingGlass /> },
  { id: "878",   label: "Sci-Fi",         icon: <FaFlask /> },
  { id: "36",    label: "History",        icon: <GiScrollUnfurled /> },
  { id: "28",    label: "Action",         icon: <FaFistRaised /> },
  { id: "12",    label: "Adventure",      icon: <FaHiking /> },
  { id: "10759", label: "Series",         icon: <FaTv /> },
  { id: "27",    label: "Horror",         icon: <BiGhost /> },
  { id: "80",    label: "Crime",          icon: <FaUserSecret /> },
  { id: "35",    label: "Comedy",         icon: <MdOutlineEmojiEmotions /> },
  { id: "18",    label: "Drama",          icon: <GiDramaMasks /> },
  { id: "10751", label: "Family",         icon: <MdOutlineFamilyRestroom /> },
  { id: "10749", label: "Romance",        icon: <FaHeart /> },
  { id: "53",    label: "Thriller",       icon: <FaExclamationTriangle /> },
];

/* ── Nav item ── */
function NavItem({ item, type, isActive, onClick }) {
  return (
    <li>
      <button
        className={`nb-item ${isActive ? "nb-item--active" : ""}`}
        onClick={() => onClick({ type, id: item.id, label: item.label })}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="nb-item-icon" aria-hidden="true">
          {item.icon}
        </span>
        <span className="nb-item-label">{item.label}</span>
        {isActive && (
          <span className="nb-item-dot" aria-hidden="true" />
        )}
      </button>
    </li>
  );
}

/* ── Main component ── */
export default function Navbar({ isOpen, onClose, onSelectCategory, selectedCategory }) {
  const { theme }  = useTheme();
  const logo       = theme === "dark" ? logoDark : logoLight;
  const sidebarRef = useRef(null);

  /* ── Trap focus & close on Escape ── */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  /* ── Restore body scroll ── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (type, id) =>
    selectedCategory?.type === type && selectedCategory?.id === id;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="nb-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar panel */}
      <nav
        id="app-sidebar"
        ref={sidebarRef}
        className={`nb-sidebar ${isOpen ? "nb-sidebar--open" : ""}`}
        aria-label="Site navigation"
        aria-hidden={!isOpen}
      >
        {/* Sidebar header */}
        <div className="nb-header">
          {/* Desktop */}
          <div className="nb-workspace">
            <h2 className="nb-workspace-title">Browse</h2>

            <p className="nb-workspace-subtitle">Explore the library</p>
          </div>

          {/* Mobile */}
          <a href="/" className="nb-logo-link" aria-label="PurpleFlix home">
            <img
              src={logo}
              alt="PurpleFlix"
              className="nb-logo-img"
              width={108}
              height={32}
            />
          </a>

          <button
            className="nb-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable list */}
        <div className="nb-scroll">
          {/* Categories */}
          <div className="nb-group">
            <p className="nb-group-label">Categories</p>
            <ul className="nb-list">
              {CATEGORIES.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  type="category"
                  isActive={isActive("category", item.id)}
                  onClick={(cat) => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                />
              ))}
            </ul>
          </div>

          <div className="nb-divider" aria-hidden="true" />

          {/* Genres */}
          <div className="nb-group">
            <p className="nb-group-label">Genres</p>
            <ul className="nb-list">
              {GENRES.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  type="genre"
                  isActive={isActive("genre", item.id)}
                  onClick={(cat) => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Footer credit */}
        <div className="nb-footer">
          <p className="nb-footer-text">
            Data from{" "}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="nb-footer-link"
            >
              TMDB
            </a>
          </p>
        </div>
      </nav>
    </>
  );
}