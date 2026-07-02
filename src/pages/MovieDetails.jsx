// src/pages/MovieDetails.jsx
// src/pages/MovieDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  FaStar, FaCalendarAlt, FaVoteYea,
  FaClock, FaGlobe, FaFilm,
  FaArrowLeft, FaExclamationTriangle,
  FaPlay,
} from "react-icons/fa";
import "../styles/MovieDetails.css";

const API_KEY  = import.meta.env.VITE_TMDB_API_KEY;
const IMG_BASE = "https://image.tmdb.org/t/p";

/* ── Rating badge colour ── */
function ratingClass(r) {
  if (r >= 7) return "md-rating--high";
  if (r >= 5) return "md-rating--mid";
  return "md-rating--low";
}

/* ── Skeleton screens ── */
function DetailsSkeleton() {
  return (
    <div className="md-wrapper md-wrapper--loading" aria-busy="true" aria-label="Loading movie details">
      <div className="md-hero-skeleton">
        <Skeleton height="100%" containerClassName="md-skel-backdrop" />
      </div>
      <div className="md-content">
        <div className="md-top">
          <Skeleton width={200} height={300} borderRadius={14} />
          <div className="md-info">
            <Skeleton width="65%" height={36} style={{ marginBottom: 12 }} />
            <Skeleton width="40%" height={18} style={{ marginBottom: 20 }} />
            <Skeleton count={4} style={{ marginBottom: 8 }} />
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} width={90} height={32} borderRadius={99} />
              ))}
            </div>
          </div>
        </div>
        <Skeleton height={220} borderRadius={14} style={{ marginTop: 32 }} />
        <div className="md-cast-skel">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton height={180} borderRadius={10} />
              <Skeleton width="80%" height={13} style={{ marginTop: 8 }} />
              <Skeleton width="60%" height={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function MovieDetails() {
  const { id } = useParams();

  const [movie,   setMovie]   = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast,    setCast]    = useState([]);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [movieRes, videoRes, creditsRes, similarRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`),
        fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US`),
      ]);

      const [movieData, videoData, creditsData, similarData] =
        await Promise.all([
          movieRes.json(),
          videoRes.json(),
          creditsRes.json(),
          similarRes.json(),
        ]);

      if (movieData.status_code) throw new Error("Movie not found");

      setMovie(movieData);
      setCast(
        Array.isArray(creditsData.cast)
          ? creditsData.cast.slice(0, 8)
          : []
      );
      setSimilar(
        Array.isArray(similarData.results)
          ? similarData.results.slice(0, 6)
          : []
      );

      if (Array.isArray(videoData.results)) {
        const official = videoData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
        );
        setTrailer(official || videoData.results[0] || null);
      }
    } catch (err) {
      setError(err.message || "Failed to load movie details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Loading ── */
  if (loading) return <DetailsSkeleton />;

  /* ── Error ── */
  if (error || !movie) {
    return (
      <div className="md-state-screen">
        <span className="md-state-icon md-state-icon--error">
          <FaExclamationTriangle size={28} />
        </span>
        <h2 className="md-state-title">
          {error || "Movie not found"}
        </h2>
        <p className="md-state-desc">
          We couldn&apos;t load this movie. Check your connection and try again.
        </p>
        <div className="md-state-actions">
          <button className="md-state-btn" onClick={fetchAll}>
            Try again
          </button>
          <Link to="/" className="md-state-btn md-state-btn--ghost">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const rating    = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null;
  const runtime   = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const backdrop  = movie.backdrop_path
    ? `${IMG_BASE}/w1280${movie.backdrop_path}`
    : null;
  const poster    = movie.poster_path
    ? `${IMG_BASE}/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  /* ── Render ── */
  return (
    <div className="md-wrapper">

      {/* ── Hero backdrop ── */}
      {backdrop && (
        <div className="md-hero" aria-hidden="true">
          <img src={backdrop} alt="" className="md-hero-img" />
          <div className="md-hero-gradient" />
        </div>
      )}

      <div className="md-content">

        {/* Back button */}
        <Link to="/" className="md-back-btn">
          <FaArrowLeft size={13} aria-hidden="true" />
          Back to home
        </Link>

        {/* ── Top: poster + info ── */}
        <div className="md-top">

          {/* Poster */}
          <div className="md-poster-wrap">
            <img
              src={poster}
              alt={`${movie.title} poster`}
              className="md-poster"
              loading="eager"
            />
            {rating && (
              <div className={`md-rating-badge ${ratingClass(Number(rating))}`}>
                <FaStar size={11} aria-hidden="true" />
                {rating}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md-info">
            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="md-genres">
                {movie.genres.slice(0, 4).map((g) => (
                  <span key={g.id} className="md-genre-chip">{g.name}</span>
                ))}
              </div>
            )}

            <h1 className="md-title">{movie.title}</h1>

            {movie.tagline && (
              <p className="md-tagline">&ldquo;{movie.tagline}&rdquo;</p>
            )}

            {/* Meta pills */}
            <div className="md-meta-row">
              {rating && (
                <div className={`md-meta-pill md-meta-pill--rating ${ratingClass(Number(rating))}`}>
                  <FaStar size={12} aria-hidden="true" />
                  {rating}
                  <span className="md-meta-dim">/ 10</span>
                </div>
              )}
              {movie.release_date && (
                <div className="md-meta-pill">
                  <FaCalendarAlt size={12} aria-hidden="true" />
                  {movie.release_date}
                </div>
              )}
              {runtime && (
                <div className="md-meta-pill">
                  <FaClock size={12} aria-hidden="true" />
                  {runtime}
                </div>
              )}
              {movie.vote_count != null && (
                <div className="md-meta-pill">
                  <FaVoteYea size={12} aria-hidden="true" />
                  {movie.vote_count.toLocaleString()} votes
                </div>
              )}
              {movie.original_language && (
                <div className="md-meta-pill">
                  <FaGlobe size={12} aria-hidden="true" />
                  {movie.original_language.toUpperCase()}
                </div>
              )}
            </div>

            {/* Overview */}
            {movie.overview && (
              <p className="md-overview">{movie.overview}</p>
            )}

            {/* Homepage link */}
            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="md-homepage-btn"
                aria-label={`Official site for ${movie.title}`}
              >
                <FaFilm size={13} aria-hidden="true" />
                Official site
              </a>
            )}
          </div>
        </div>

        {/* ── Trailer ── */}
        {trailer && (
          <section className="md-section" aria-labelledby="trailer-heading">
            <h2 id="trailer-heading" className="md-section-title">
              <FaPlay size={14} aria-hidden="true" />
              Trailer
            </h2>
            <div className="md-trailer-wrap">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="md-trailer-frame"
              />
            </div>
          </section>
        )}

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <section className="md-section" aria-labelledby="cast-heading">
            <h2 id="cast-heading" className="md-section-title">
              Cast
            </h2>
            <div className="md-cast-grid">
              {cast.map((actor) => (
                <div key={actor.id} className="md-cast-card">
                  <div className="md-cast-img-wrap">
                    <img
                      src={
                        actor.profile_path
                          ? `${IMG_BASE}/w185${actor.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Photo"
                      }
                      alt={actor.name}
                      className="md-cast-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="md-cast-body">
                    <p className="md-cast-name">{actor.name}</p>
                    <p className="md-cast-character">
                      {actor.character || "Unknown role"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Similar movies ── */}
        {similar.length > 0 && (
          <section className="md-section" aria-labelledby="similar-heading">
            <h2 id="similar-heading" className="md-section-title">
              You might also like
            </h2>
            <div className="md-similar-grid">
              {similar.map((m) => (
                <Link
                  key={m.id}
                  to={`/movie/${m.id}`}
                  className="md-similar-card"
                  aria-label={`View ${m.title || m.name}`}
                >
                  <img
                    src={
                      m.poster_path
                        ? `${IMG_BASE}/w300${m.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Image"
                    }
                    alt={m.title || m.name}
                    className="md-similar-img"
                    loading="lazy"
                  />
                  <div className="md-similar-overlay">
                    <p className="md-similar-title">{m.title || m.name}</p>
                    {m.vote_average != null && (
                      <p className="md-similar-rating">
                        <FaStar size={10} aria-hidden="true" />
                        {Number(m.vote_average).toFixed(1)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}