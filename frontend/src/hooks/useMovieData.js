import { useState, useEffect, useMemo, useCallback } from 'react';

export function useMovieData() {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch datasets in parallel from the public/data folder
        const [moviesRes, recsRes, statsRes] = await Promise.all([
          fetch('/data/movies.json'),
          fetch('/data/recommendations.json'),
          fetch('/data/dataset_stats.json'),
        ]);

        if (!moviesRes.ok || !recsRes.ok || !statsRes.ok) {
          throw new Error('Failed to load movie recommendation datasets. Ensure "python ml/preprocess.py" has been executed.');
        }

        const [moviesData, recsData, statsData] = await Promise.all([
          moviesRes.json(),
          recsRes.json(),
          statsRes.json(),
        ]);

        if (isMounted) {
          setMovies(moviesData);
          setRecommendations(recsData);
          setStats(statsData);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Data loading error:', err);
          setError(err.message || 'An error occurred while loading dataset.');
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Map for fast O(1) lookups by ID
  const movieMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < movies.length; i++) {
      map.set(movies[i].id, movies[i]);
    }
    return map;
  }, [movies]);

  const getMovieById = useCallback(
    (id) => {
      if (!id) return null;
      return movieMap.get(Number(id)) || null;
    },
    [movieMap]
  );

  // Return top 10 recommended movies enriched with full metadata
  const getRecommendationsForMovie = useCallback(
    (movieId) => {
      if (!movieId) return [];
      const key = String(movieId);
      const recList = recommendations[key] || [];

      return recList
        .map((rec) => {
          const target = movieMap.get(rec.id);
          if (!target) return null;
          return {
            ...target,
            similarityScore: rec.score,
            explanationReason: rec.reason,
            sharedGenres: rec.shared_genres || [],
            sharedKeywords: rec.shared_keywords || [],
          };
        })
        .filter(Boolean);
    },
    [recommendations, movieMap]
  );

  // Instant title search
  const searchMovies = useCallback(
    (query, limit = 12) => {
      if (!query || !query.trim()) return [];
      const q = query.trim().toLowerCase();
      const results = [];

      for (let i = 0; i < movies.length; i++) {
        const m = movies[i];
        if (m.title.toLowerCase().includes(q)) {
          results.push(m);
          if (results.length >= limit) break;
        }
      }
      return results;
    },
    [movies]
  );

  return {
    movies,
    movieMap,
    recommendations,
    stats,
    loading,
    error,
    getMovieById,
    getRecommendationsForMovie,
    searchMovies,
  };
}
