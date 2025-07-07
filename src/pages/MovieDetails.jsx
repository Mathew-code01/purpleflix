// src/pages/MovieDetails.jsx
// src/pages/MovieDetails.jsx
// src/pages/MovieDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/MovieDetails.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_KEY = "5e3b94329fcd0b4985881ed512471b73";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movieRes, videoRes, creditsRes] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`),
          fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`)
        ]);

        const movieData = await movieRes.json();
        const videoData = await videoRes.json();
        const creditsData = await creditsRes.json();

        setMovie(movieData);

        if (Array.isArray(creditsData.cast)) {
          setCast(creditsData.cast.slice(0, 6));
        } else {
          setCast([]);
        }

        if (Array.isArray(videoData.results)) {
          const officialTrailer = videoData.results.find(
            (vid) =>
              vid.type === "Trailer" &&
              vid.site === "YouTube" &&
              vid.official === true
          );
          setTrailer(officialTrailer || videoData.results[0] || null);
        } else {
          setTrailer(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="movie-details">
        <div className="movie-header">
          <Skeleton height={400} width={300} />
          <div className="movie-info" style={{ flex: 1, marginLeft: "2rem" }}>
            <Skeleton height={40} width={`60%`} />
            <Skeleton height={20} width={`40%`} />
            <Skeleton count={4} />
          </div>
        </div>

        <div className="movie-trailer">
          <h2><Skeleton width={120} /></h2>
          <Skeleton height={300} />
        </div>

        <div className="movie-cast">
          <h2><Skeleton width={80} /></h2>
          <div className="cast-grid">
            {Array(6)
              .fill()
              .map((_, i) => (
                <div className="cast-member" key={i}>
                  <Skeleton height={278} width={185} />
                  <Skeleton width={100} />
                  <Skeleton width={120} />
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return <p>Movie not found.</p>;

  return (
    <div className="movie-details">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>

      <div className="movie-header">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="movie-tagline">{movie.tagline}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {movie.vote_average?.toFixed(1)} (
            {movie.vote_count} votes)
          </p>
          <p className="movie-overview">{movie.overview}</p>
        </div>
      </div>

      {/* Trailer */}
      {trailer && (
        <div className="movie-trailer">
          <h2>Trailer</h2>
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title="Trailer"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      )}

      {/* Cast */}
      {cast.length > 0 && (
        <div className="movie-cast">
          <h2>Cast</h2>
          <div className="cast-grid">
            {cast.map((actor) => (
              <div key={actor.id} className="cast-member">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "https://via.placeholder.com/185x278?text=No+Image"
                  }
                  alt={actor.name}
                />
                <p>
                  <strong>{actor.name}</strong>
                </p>
                <p className="character">as {actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
