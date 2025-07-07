// src/components/Components.jsx

// src/components/MovieCard.jsx

import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const overviewSnippet =
    movie.overview && movie.overview.length > 100
      ? movie.overview.substring(0, 100) + "..."
      : movie.overview || "No description available.";

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img src={posterUrl} alt={movie.title || movie.name} />
      <h3>{movie.title || movie.name}</h3>
      <p className="release-date">{movie.release_date || movie.first_air_date}</p>
      <p className="rating">⭐ {rating} ({movie.vote_count} votes)</p>
      <p className="overview">{overviewSnippet}</p>
    </Link>
  );
};

export default MovieCard;
