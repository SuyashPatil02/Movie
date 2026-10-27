import React, { useEffect } from 'react';
import { X, Star, Calendar, Clock, Film, Sparkles, Bookmark, BookmarkCheck, User, Users, Tag } from 'lucide-react';
import { GENRE_GRADIENTS } from '../utils/constants';

export default function MovieDetailsModal({
  movie,
  onClose,
  onFindSimilar,
  isInWatchlist,
  onToggleWatchlist,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'Drama';
  const gradientClass = GENRE_GRADIENTS[primaryGenre] || 'from-indigo-900 via-slate-900 to-black';

  const formatRuntime = (mins) => {
    if (!mins || mins <= 0) return 'Not available';
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return hrs > 0 ? `${hrs}h ${m}m (${mins} minutes)` : `${m} minutes`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-slate-700/80 shadow-2xl flex flex-col text-slate-100"
      >
        {/* Header Art Banner */}
        <div className={`relative h-48 sm:h-56 bg-gradient-to-r ${gradientClass} p-6 flex flex-col justify-between overflow-hidden`}>
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-colors backdrop-blur-sm border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top badges */}
          <div className="relative z-10 flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 text-white border border-white/20 backdrop-blur-sm">
              {primaryGenre}
            </span>
            {movie.year && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/40 text-slate-200 border border-white/10 backdrop-blur-sm">
                {movie.year}
              </span>
            )}
          </div>

          {/* Title on Banner */}
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h2>
            {movie.director && (
              <p className="text-sm text-slate-200/90 mt-1 flex items-center space-x-1 font-medium">
                <User className="w-4 h-4 text-slate-300" />
                <span>Directed by {movie.director}</span>
              </p>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">TMDB Rating</span>
              <div className="flex items-center space-x-1.5 mt-1 text-amber-400 font-extrabold text-base">
                <Star className="w-4 h-4 fill-current" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '—'} / 10</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Votes</span>
              <span className="text-slate-200 font-bold text-base mt-1 block">
                {movie.vote_count ? Number(movie.vote_count).toLocaleString() : '0'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Duration</span>
              <div className="flex items-center space-x-1.5 mt-1 text-slate-200 font-bold text-base">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{formatRuntime(movie.runtime)}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Popularity</span>
              <span className="text-indigo-300 font-mono font-bold text-base mt-1 block">
                {movie.popularity ? movie.popularity.toFixed(1) : '—'}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Synopsis</h3>
            <p className="text-sm leading-relaxed text-slate-200 font-normal">
              {movie.overview || 'No synopsis available for this movie.'}
            </p>
          </div>

          {/* Cast */}
          {movie.cast && movie.cast.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Top Cast</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 text-xs font-medium"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-xl bg-indigo-950/40 border border-indigo-700/40 text-indigo-300 text-xs font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords / Themes */}
          {movie.keywords && movie.keywords.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Plot Themes & Keywords</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {movie.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onToggleWatchlist?.(movie.id);
              }}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                isInWatchlist
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {isInWatchlist ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
              <span>{isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
            </button>

            {onFindSimilar && (
              <button
                onClick={() => {
                  onFindSimilar(movie);
                  onClose();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find Top 10 Similar Movies (ML)</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full sm:w-auto sm:ml-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
