// src/App.jsx
// src/App.jsx

// src/App.jsx
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import "./styles/App.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <MainRouter
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </Router>
  );
};

const MainRouter = ({
  sidebarOpen,
  setSidebarOpen,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const navigate = useNavigate();

  const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setSidebarOpen(false);
    navigate("/"); // Ensure MovieDetails is hidden
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setSelectedCategory(null);
    navigate("/"); // Ensure MovieDetails is hidden
  };

  return (
    <div className="app">
      <Header
        onToggleSidebar={handleToggleSidebar}
        setSearchQuery={handleSearchChange} // ✅ use new search handler
      />

      <div className={`main-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Navbar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <div className="main-content">
          <div className="page-body">
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
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default App;
