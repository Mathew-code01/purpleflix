// src/components/Components.jsx

// src/components/MovieCard.jsx
// src/components/MovieCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaCalendarAlt, FaUsers } from "react-icons/fa";
import "../styles/MovieCard.css";

const PLACEHOLDER = "https://via.placeholder.com/300x450?text=No+Image";
const IMG_BASE    = "https://image.tmdb.org/t/p/w400";

export default function MovieCard({ movie }) {
  const [imgErr, setImgErr] = useState(false);

  const poster  = !imgErr && movie.poster_path
    ? `${IMG_BASE}${movie.poster_path}`
    : PLACEHOLDER;

  const title   = movie.title || movie.name || "Untitled";
  const date    = movie.release_date || movie.first_air_date;
  const year    = date ? new Date(date).getFullYear() : null;
  const rating  = movie.vote_average != null
    ? Number(movie.vote_average).toFixed(1)
    : null;
  const votes   = movie.vote_count != null
    ? movie.vote_count.toLocaleString()
    : null;
  const snippet = movie.overview
    ? movie.overview.length > 110
      ? movie.overview.slice(0, 110).trimEnd() + "…"
      : movie.overview
    : null;

  /* Badge colour by rating */
  const ratingClass =
    !rating     ? ""             :
    rating >= 7 ? "mc-badge--high"   :
    rating >= 5 ? "mc-badge--mid"    :
                  "mc-badge--low";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="mc-card"
      aria-label={`View details for ${title}${year ? `, ${year}` : ""}`}
    >
      {/* ── Poster ── */}
      <div className="mc-poster-wrap">
        <img
          src={poster}
          alt={title}
          className="mc-poster"
          loading="lazy"
          onError={() => setImgErr(true)}
        />

        {/* Gradient overlay */}
        <div className="mc-poster-overlay" aria-hidden="true" />

        {/* Rating badge */}
        {rating && (
          <div className={`mc-badge ${ratingClass}`} aria-label={`Rating: ${rating}`}>
            <FaStar size={10} aria-hidden="true" />
            {rating}
          </div>
        )}

        {/* Year chip */}
        {year && (
          <div className="mc-year-chip">{year}</div>
        )}

        {/* Hover info overlay */}
        <div className="mc-hover-overlay" aria-hidden="true">
          {snippet && (
            <p className="mc-hover-overview">{snippet}</p>
          )}
          <div className="mc-hover-meta">
            {votes && (
              <span className="mc-hover-votes">
                <FaUsers size={11} />
                {votes}
              </span>
            )}
            {date && (
              <span className="mc-hover-date">
                <FaCalendarAlt size={11} />
                {date}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="mc-body">
        <h3 className="mc-title">{title}</h3>
        {date && (
          <p className="mc-date">
            <FaCalendarAlt size={11} aria-hidden="true" />
            {date}
          </p>
        )}
      </div>
    </Link>
  );
}