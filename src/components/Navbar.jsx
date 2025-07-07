// src/components/Navbar.jsx
// src/components/Navbar.jsx
import React from "react";
import { useTheme } from "../theme";
import "../styles/Navbar.css";
import logoLight from "../assets/images/logo-light.svg";
import logoDark from "../assets/images/logo-dark.svg";
import {
  FaFire,
  FaStar,
  FaClock,
  FaFistRaised,
  FaHiking,
  FaTv,
  FaUserSecret,
  FaHeart,
  FaExclamationTriangle,
  FaFlask,
} from "react-icons/fa";
import {
  GiMagnifyingGlass,
  GiScrollUnfurled,
  GiDramaMasks,
} from "react-icons/gi";
import {
  MdAnimation,
  MdOutlineScience,
  MdOutlineFamilyRestroom,
  MdOutlineEmojiEmotions,
} from "react-icons/md";
import { BiGhost } from "react-icons/bi";


const categories = [
  { id: "popular", label: "Popular", icon: <FaFire /> },
  { id: "top_rated", label: "Top Rated", icon: <FaStar /> },
  { id: "upcoming", label: "Upcoming", icon: <FaClock /> },
];

const genres = [
  { id: "16", label: "Animation", icon: <MdAnimation /> },
  { id: "9648", label: "Mystery", icon: <GiMagnifyingGlass /> },
  { id: "878", label: "Science Fiction", icon: <FaFlask /> },
  { id: "36", label: "History", icon: <GiScrollUnfurled /> },
  { id: "28", label: "Action", icon: <FaFistRaised /> },
  { id: "12", label: "Adventure", icon: <FaHiking /> },
  { id: "10759", label: "Series", icon: <FaTv /> },
  { id: "27", label: "Horror", icon: <BiGhost /> },
  { id: "80", label: "Crime", icon: <FaUserSecret /> },
  { id: "35", label: "Comedy", icon: <MdOutlineEmojiEmotions /> },
  { id: "18", label: "Drama", icon: <GiDramaMasks /> },
  { id: "10751", label: "Family", icon: <MdOutlineFamilyRestroom /> },
  { id: "10749", label: "Romance", icon: <FaHeart /> },
  { id: "53", label: "Thriller", icon: <FaExclamationTriangle /> },
];




const Navbar = ({ isOpen, onClose, onSelectCategory, selectedCategory }) => {
  const { theme } = useTheme();
  const logo = theme === "dark" ? logoDark : logoLight;

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}
      <nav className={`navbar ${isOpen ? "open" : ""}`}>
        <div className="navbar-logo">
          <a href="/">
            <img src={logo} alt="PurpleFlix Logo" className="navbar-logo-img" />
          </a>
        </div>
        
        <ul className="navbar-list">
          <li className="navbar-section-title">Categories</li>
          {categories.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                className={`navbar-button ${
                  selectedCategory?.type === "category" &&
                  selectedCategory.id === id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  onSelectCategory({ type: "category", id, label })
                }
              >
                <span className="navbar-icon">{icon}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
          <hr />
          <li className="navbar-section-title">Genres</li>
          {genres.map(({ id, label, icon }) => (
            <li key={id}>
              <button
                className={`navbar-button ${
                  selectedCategory?.type === "genre" &&
                  selectedCategory.id === id
                    ? "active"
                    : ""
                }`}
                onClick={() => onSelectCategory({ type: "genre", id, label })}
              >
                <span className="navbar-icon">{icon}</span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
