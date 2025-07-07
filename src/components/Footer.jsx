// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css"; // Import external styles

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} PurpleFlix. All rights reserved.</p>

      <p>
        Designed and built by{" "}
        <a
          href="https://mathew-portfolio.onrender.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mathew – View Portfolio
        </a>
      </p>

      <p className="footer-note">Powered by React · Styled with 💜</p>
    </footer>
  );
};

export default Footer;
