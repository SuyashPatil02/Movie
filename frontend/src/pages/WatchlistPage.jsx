import React, { useMemo } from 'react';
import { Bookmark, Trash2, Sparkles, Film, ArrowRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';

export default function WatchlistPage({
  watchlistIds,
  movieMap,
  onSelectMovie,
  onFindSimilar,
  onToggleWatchlist,
  onClearWatchlist,
  onGoToDiscover,
}) {
  // Retrieve movie objects for saved IDs
  const watchlistMovies = useMemo(() => {
    return watchlistIds
      .map((id) => movieMap.get(Number(id)))
      .filter(Boolean);
  }, [watchlistIds, movieMap]);

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Browser LocalStorage Persistence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Watchlist ({watchlistMovies.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Movies saved to your local session. Persisted in your browser without requiring external login or database servers.
          </p>
        </div>

        {watchlistMovies.length > 0 && (
          <button
            onClick={onClearWatchlist}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </section>

      {/* Grid or Empty State */}
      {watchlistMovies.length > 0 ? (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {watchlistMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              onFindSimilar={onFindSimilar}
              isInWatchlist={true}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </section>
      ) : (
        <section className="py-20 text-center rounded-3xl glass-card border border-slate-800 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Your Watchlist is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse the Discover tab or view recommendations and click the bookmark icon on any movie card to save it here.
          </p>
          <button
            onClick={onGoToDiscover}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Film className="w-4 h-4" />
            <span>Browse All Movies</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      )}
    </div>
  );
}
