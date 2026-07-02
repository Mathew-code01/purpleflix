// src/components/Footer.jsx
// src/components/Footer.jsx
import React from "react";
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from "react-icons/fa";

import { useTheme } from "../theme";

import logoLight from "../assets/images/logo-light.png";
import logoDark from "../assets/images/logo-dark.png";
import { ExternalLink } from "lucide-react";
import "../styles/Footer.css";

const LINKS = {
  portfolio: "https://mthw-dev.vercel.app/",
  github: "https://github.com/Mathew-code01",
  linkedin: "https://www.linkedin.com/in/mathew-oloyede-281b68367/",
  twitter: "https://x.com/MathewOloy88336",
  tmdb: "https://www.themoviedb.org",
};

const NAV = [
  {
    label: "Popular",
    type: "category",
    id: "popular",
  },
  {
    label: "Top Rated",
    type: "category",
    id: "top_rated",
  },
  {
    label: "Upcoming",
    type: "category",
    id: "upcoming",
  },
  {
    label: "Animation",
    type: "genre",
    id: "16",
  },
];

const SOCIALS = [
  { label: "GitHub", href: LINKS.github, icon: <FaGithub size={16} /> },
  { label: "LinkedIn", href: LINKS.linkedin, icon: <FaLinkedin size={16} /> },
  { label: "Twitter", href: LINKS.twitter, icon: <FaTwitter size={16} /> },
];

export default function Footer({ onSelectCategory }) {
  const { theme } = useTheme();

  const logo = theme === "dark" ? logoDark : logoLight;

  const year = new Date().getFullYear();

  return (
    <footer className="ft-root" aria-label="Site footer">
      {/* ── Top band ── */}
      <div className="ft-top">
        <div className="ft-inner">
          {/* Brand column */}
          <div className="ft-brand">
            <a href="/" className="ft-logo-link" aria-label="PurpleFlix Home">
              <img src={logo} alt="PurpleFlix" className="ft-logo-img" />
            </a>
            <p className="ft-brand-desc">
              Discover movies, explore genres, and find your next watch. Powered
              by the TMDB API.
            </p>

            {/* Social row */}
            <div className="ft-socials">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-social-btn"
                  aria-label={`Visit ${label} profile`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav className="ft-nav" aria-label="Footer navigation">
            <p className="ft-nav-heading">Browse</p>
            <ul className="ft-nav-list">
              {NAV.map(({ label, type, id }) => (
                <li key={id}>
                  <button
                    type="button"
                    className="ft-nav-link"
                    onClick={() =>
                      onSelectCategory?.({
                        type,
                        id,
                        label,
                      })
                    }
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Built by */}
          <div className="ft-built">
            <p className="ft-nav-heading">Developer</p>
            <a
              href={LINKS.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="ft-portfolio-card"
              aria-label="Visit Mathew Oloyede's portfolio"
            >
              <div className="ft-portfolio-avatar" aria-hidden="true">
                MO
              </div>
              <div className="ft-portfolio-info">
                <span className="ft-portfolio-name">Mathew Oloyede</span>
                <span className="ft-portfolio-role">Full Stack Developer</span>
              </div>
              <ExternalLink
                size={13}
                className="ft-portfolio-arrow"
                aria-hidden="true"
              />
            </a>

            <p className="ft-tmdb-note">
              Data provided by{" "}
              <a
                href={LINKS.tmdb}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-tmdb-link"
              >
                TMDB
              </a>
              . This product uses the TMDB API but is not endorsed or certified
              by TMDB.
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <div className="ft-inner ft-bottom-inner">
          <p className="ft-copy">© {year} PurpleFlix. All rights reserved.</p>
          <p className="ft-made-with">
            Built with{" "}
            <FaHeart size={11} className="ft-heart" aria-label="love" /> using
            React &amp; TMDB API
          </p>
        </div>
      </div>
    </footer>
  );
}