// src/App.jsx
// src/App.jsx

// src/App.jsx
import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Header      from "./components/Header";
import Navbar      from "./components/Navbar";
import Footer      from "./components/Footer";
import Home        from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import "./styles/App.css";

function AppShell() {
  const navigate = useNavigate();

  const [sidebarOpen,      setSidebarOpen]      = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery,      setSearchQuery]      = useState("");

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-lock");
    } else {
      document.body.classList.remove("sidebar-lock");
    }
    return () => document.body.classList.remove("sidebar-lock");
  }, [sidebarOpen]);

  const handleToggleSidebar = useCallback(
    () => setSidebarOpen((o) => !o),
    []
  );

  const handleCloseSidebar = useCallback(
    () => setSidebarOpen(false),
    []
  );

  const handleSelectCategory = useCallback(
    (category) => {
      setSelectedCategory(category);
      setSearchQuery("");
      setSidebarOpen(false);
      navigate("/");
    },
    [navigate]
  );

  const handleSearchChange = useCallback(
    (query) => {
      setSearchQuery(query);
      setSelectedCategory(null);
      navigate("/");
    },
    [navigate]
  );

  return (
    <div className="app-shell">
      {/* Skip to main content (accessibility) */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Header
        onToggleSidebar={handleToggleSidebar}
        sidebarOpen={sidebarOpen}
        setSearchQuery={handleSearchChange}
      />

      <div className="app-body">
        <Navbar
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <main className="app-main" id="main-content" tabIndex={-1}>
          <div className="app-page">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                  />
                }
              />
              <Route path="/movie/:id" element={<MovieDetails />} />
            </Routes>
          </div>
          <Footer onSelectCategory={handleSelectCategory} />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}