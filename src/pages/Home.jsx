// src/pages/Home.jsx
// src/pages/Home.jsx
// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "../styles/Home.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaStar } from "react-icons/fa";

const API_KEY = "5e3b94329fcd0b4985881ed512471b73";

const tvGenreIds = ["10759", "10762", "10763", "10764", "10765", "10766", "10767", "10768"];

const formatTitle = (id) =>
  id?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const Home = ({ selectedCategory, searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  const buildApiUrl = () => {
    const base = `https://api.themoviedb.org/3`;

    if (searchQuery?.trim()) {
      return `${base}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        searchQuery
      )}&language=en-US&page=${page}`;
    }

    if (!selectedCategory) {
      return `${base}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    }

    const { type, id } = selectedCategory;

    if (type === "category") {
      return `${base}/movie/${id}?api_key=${API_KEY}&language=en-US&page=${page}`;
    }

    if (type === "genre") {
      const isTV = tvGenreIds.includes(id);
      const mediaType = isTV ? "tv" : "movie";
      return `${base}/discover/${mediaType}?api_key=${API_KEY}&with_genres=${id}&language=en-US&page=${page}`;
    }

    return "";
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      const url = buildApiUrl();

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!Array.isArray(data.results)) {
          throw new Error("Unexpected API response: No results array");
        }

        const isUpcoming = selectedCategory?.id === "upcoming";
        const today = new Date();

        const filtered = data.results.filter((movie) => {
          if (isUpcoming) {
            const date = new Date(
              movie.release_date || movie.first_air_date || ""
            );
            return date >= today;
          }
          return true;
        });

        setMovies(filtered);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message || "Failed to fetch movies");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedCategory, searchQuery, page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const headingTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : selectedCategory?.label ||
      formatTitle(selectedCategory?.id) ||
      "Popular Movies";

  if (error) return <p>Error: {error}</p>;
  if (!movies.length && !loading) return <p>No movies found.</p>;

  return (
    <section className="home-wrapper">
      <h2 className="section-heading">{headingTitle}</h2>

      {/* Featured Movie Skeleton */}
      {loading ? (
        <div className="featured-movie">
          <Skeleton height={300} />
        </div>
      ) : (
        <div className="featured-movie">
          <img
            src={
              movies[0].backdrop_path
                ? `https://image.tmdb.org/t/p/w780${movies[0].backdrop_path}`
                : movies[0].poster_path
                ? `https://image.tmdb.org/t/p/w500${movies[0].poster_path}`
                : "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={movies[0].title || movies[0].name || "Featured"}
          />
          <div className="featured-content">
            <h3>{movies[0].title || movies[0].name || "Untitled"}</h3>
            <p className="featured-overview">
              {movies[0].overview || "No description available."}
            </p>
            <div className="featured-meta">
              <div className="meta-item">
                <strong>Release:</strong>{" "}
                {movies[0].release_date || movies[0].first_air_date || "N/A"}
              </div>
              <div className="meta-item rating">
                <FaStar className="star-icon" />
                {movies[0].vote_average != null
                  ? `${movies[0].vote_average.toFixed(1)} / 10`
                  : "N/A"}
              </div>
              <div className="meta-item">
                <strong>Votes:</strong>{" "}
                {movies[0].vote_count != null
                  ? movies[0].vote_count.toLocaleString()
                  : "0"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Grid */}
      <div className="movies-grid">
        {loading
          ? Array(12)
              .fill()
              .map((_, i) => <Skeleton key={i} height={250} />)
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="pagination-controls">
          <button onClick={handlePrev} disabled={page === 1}>
            ← Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={page >= totalPages}>
            Next →
          </button>
        </div>
      )}
    </section>
  );
};

export default Home;
