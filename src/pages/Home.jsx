// src/pages/Home.jsx
// src/pages/Home.jsx
// src/pages/Home.jsx
// src/pages/Home.jsx
import React, { useState, useEffect, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaStar, FaCalendarAlt, FaVoteYea,
  FaChevronLeft, FaChevronRight,
  FaFilm, FaExclamationTriangle,
} from "react-icons/fa";
import MovieCard from "../components/MovieCard";
import "../styles/Home.css";

/* ── Constants ── */
const API_KEY    = import.meta.env.VITE_TMDB_API_KEY;
const IMG_BASE   = "https://image.tmdb.org/t/p";
const TV_GENRES  = new Set([
  "10759","10762","10763","10764",
  "10765","10766","10767","10768",
]);

/* ── Helpers ── */
const formatTitle = (id) =>
  id?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "";

function buildUrl(selectedCategory, searchQuery, page) {
  const base = "https://api.themoviedb.org/3";
  const qs   = `api_key=${API_KEY}&language=en-US&page=${page}`;

  if (searchQuery?.trim()) {
    return `${base}/search/movie?${qs}&query=${encodeURIComponent(searchQuery.trim())}`;
  }
  if (!selectedCategory) {
    return `${base}/movie/popular?${qs}`;
  }

  const { type, id } = selectedCategory;

  if (type === "category") return `${base}/movie/${id}?${qs}`;
  if (type === "genre") {
    const media = TV_GENRES.has(String(id)) ? "tv" : "movie";
    return `${base}/discover/${media}?${qs}&with_genres=${id}`;
  }
  return "";
}

/* ── Featured skeleton ── */
function FeaturedSkeleton() {
  return (
    <div className="hm-featured hm-featured--skeleton">
      <Skeleton height="100%" containerClassName="hm-featured-img-skel" />
      <div className="hm-featured-body">
        <Skeleton width="60%" height={28} style={{ marginBottom: 12 }} />
        <Skeleton count={3} style={{ marginBottom: 6 }} />
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Skeleton width={100} height={32} borderRadius={99} />
          <Skeleton width={100} height={32} borderRadius={99} />
        </div>
      </div>
    </div>
  );
}

/* ── Grid skeleton ── */
function GridSkeleton({ count = 12 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="mc-card mc-card--skeleton">
      <div style={{ aspectRatio: "2/3" }}>
        <Skeleton height="100%" />
      </div>
      <div style={{ padding: "10px 12px" }}>
        <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="50%" height={12} />
      </div>
    </div>
  ));
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function Home({ selectedCategory, searchQuery }) {
  const [movies,     setMovies]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* Reset page when query or category changes */
  useEffect(() => { setPage(1); }, [searchQuery, selectedCategory]);

  /* Fetch */
  const fetchMovies = useCallback(async () => {
    const url = buildUrl(selectedCategory, searchQuery, page);
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();

      if (!Array.isArray(data.results)) {
        throw new Error("Unexpected API response");
      }

      const today    = new Date();
      const isUpcoming = selectedCategory?.id === "upcoming";

      const filtered = isUpcoming
        ? data.results.filter((m) => {
            const d = new Date(m.release_date || m.first_air_date || "");
            return d >= today;
          })
        : data.results;

      setMovies(filtered);
      setTotalPages(Math.min(data.total_pages ?? 1, 500));
    } catch (err) {
      setError(err.message || "Failed to fetch movies");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, page]);

  useEffect(() => { fetchMovies(); }, [fetchMovies]);

  /* Derived */
  const heading = searchQuery
    ? `Results for "${searchQuery}"`
    : selectedCategory?.label || formatTitle(selectedCategory?.id) || "Popular Movies";

  const featured = movies[0];

  /* ── Error state ── */
  if (error) {
    return (
      <div className="hm-state-screen">
        <span className="hm-state-icon hm-state-icon--error">
          <FaExclamationTriangle size={30} />
        </span>
        <h2 className="hm-state-title">Something went wrong</h2>
        <p className="hm-state-desc">{error}</p>
        <button className="hm-state-btn" onClick={fetchMovies}>
          Try again
        </button>
      </div>
    );
  }

  /* ── Empty state ── */
  if (!loading && !movies.length) {
    return (
      <div className="hm-state-screen">
        <span className="hm-state-icon">
          <FaFilm size={30} />
        </span>
        <h2 className="hm-state-title">No movies found</h2>
        <p className="hm-state-desc">
          Try a different search term or category.
        </p>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <section className="hm-wrapper">

      {/* Section heading */}
      <div className="hm-heading-row">
        <h2 className="hm-heading">{heading}</h2>
        {!loading && (
          <span className="hm-count">
            {movies.length} title{movies.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Featured banner ── */}
      {loading ? (
        <FeaturedSkeleton />
      ) : featured ? (
        <div className="hm-featured">
          {/* Backdrop */}
          <div className="hm-featured-img-wrap">
            <img
              className="hm-featured-img"
              src={
                featured.backdrop_path
                  ? `${IMG_BASE}/w1280${featured.backdrop_path}`
                  : featured.poster_path
                  ? `${IMG_BASE}/w780${featured.poster_path}`
                  : "https://via.placeholder.com/1280x720?text=No+Image"
              }
              alt={featured.title || featured.name || "Featured film"}
              loading="eager"
            />
            <div className="hm-featured-gradient" aria-hidden="true" />
          </div>

          {/* Info */}
          <div className="hm-featured-body">
            {/* Genre chip */}
            <span className="hm-featured-chip">Featured</span>

            <h3 className="hm-featured-title">
              {featured.title || featured.name || "Untitled"}
            </h3>

            {featured.overview && (
              <p className="hm-featured-overview">{featured.overview}</p>
            )}

            <div className="hm-featured-meta">
              {featured.vote_average != null && (
                <div className="hm-meta-pill hm-meta-pill--rating">
                  <FaStar size={12} aria-hidden="true" />
                  {Number(featured.vote_average).toFixed(1)}
                  <span className="hm-meta-dim">/ 10</span>
                </div>
              )}
              {(featured.release_date || featured.first_air_date) && (
                <div className="hm-meta-pill">
                  <FaCalendarAlt size={12} aria-hidden="true" />
                  {featured.release_date || featured.first_air_date}
                </div>
              )}
              {featured.vote_count != null && (
                <div className="hm-meta-pill">
                  <FaVoteYea size={12} aria-hidden="true" />
                  {featured.vote_count.toLocaleString()} votes
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Movie grid ── */}
      <div className="hm-grid">
        {loading
          ? <GridSkeleton count={12} />
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
        }
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <nav className="hm-pagination" aria-label="Movie pages">
          <button
            className="hm-page-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <FaChevronLeft size={13} />
            <span>Previous</span>
          </button>

          <div className="hm-page-info">
            <span className="hm-page-current">{page}</span>
            <span className="hm-page-sep">of</span>
            <span className="hm-page-total">{totalPages.toLocaleString()}</span>
          </div>

          <button
            className="hm-page-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <span>Next</span>
            <FaChevronRight size={13} />
          </button>
        </nav>
      )}

    </section>
  );
}