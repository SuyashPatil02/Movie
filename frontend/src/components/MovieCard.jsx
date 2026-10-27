import React, { useState } from 'react';
import { Star, Clock, Calendar, Bookmark, BookmarkCheck, Sparkles, Film, Info } from 'lucide-react';
import { GENRE_GRADIENTS } from '../utils/constants';
import ExplanationBadge from './ExplanationBadge';

export default function MovieCard({
  movie,
  rank,
  onSelectMovie,
  onFindSimilar,
  isInWatchlist,
  onToggleWatchlist,
  showExplanation = false,
}) {
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'Drama';
  const gradientClass = GENRE_GRADIENTS[primaryGenre] || 'from-indigo-900 via-slate-900 to-black';

  // Format runtime
  const formatRuntime = (mins) => {
    if (!mins || mins <= 0) return 'N/A';
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return hrs > 0 ? `${hrs}h ${m}m` : `${m}m`;
  };

  return (
    <div className="group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30">
      {/* Poster Image or Art Banner */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        {/* Ranked recommendation badge */}
        {rank !== undefined && (
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-indigo-500/40 text-indigo-300 font-extrabold text-xs shadow-lg">
            <span>#{rank}</span>
          </div>
        )}

        {/* Watchlist toggle button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist?.(movie.id);
          }}
          className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-xl backdrop-blur-md transition-all duration-200 ${
            isInWatchlist
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
              : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/90'
          }`}
          title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label="Toggle watchlist"
        >
          {isInWatchlist ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
        </button>

        {/* Poster Visual Fallback (or TMDB image if available) */}
        {!imgError && movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Artistic Cinematic Graphic Fallback */
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} p-4 flex flex-col justify-between relative`}>
            {/* Ambient pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex justify-between items-start pt-8">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-slate-200 border border-white/10 backdrop-blur-sm">
                {primaryGenre}
              </span>
            </div>

            <div className="relative z-10 my-auto text-center px-2 py-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base leading-snug text-white line-clamp-3 drop-shadow-md">
                {movie.title}
              </h3>
              {movie.director && (
                <p className="text-xs text-slate-300/80 mt-1 line-clamp-1">
                  dir. {movie.director}
                </p>
              )}
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 border-t border-white/10 pt-2">
              <span>{movie.year || 'Unknown'}</span>
              <div className="flex items-center space-x-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Hover action overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={() => onSelectMovie?.(movie)}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-white/20"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Movie Details</span>
            </button>

            {onFindSimilar && (
              <button
                onClick={() => onFindSimilar(movie)}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Find Similar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metadata Bottom Section */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {(movie.genres || []).slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/50"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h4
            onClick={() => onSelectMovie?.(movie)}
            className="font-bold text-sm text-slate-100 hover:text-indigo-400 cursor-pointer transition-colors line-clamp-1"
            title={movie.title}
          >
            {movie.title}
          </h4>

          {/* Year & Runtime */}
          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1.5">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{movie.year || 'N/A'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{formatRuntime(movie.runtime)}</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-400 font-semibold ml-auto">
              <Star className="w-3 h-3 fill-current" />
              <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '—'}</span>
            </span>
          </div>
        </div>

        {/* Explainable Recommendation Evidence Box */}
        {showExplanation && (
          <ExplanationBadge
            score={movie.similarityScore}
            reason={movie.explanationReason}
            sharedGenres={movie.sharedGenres}
            sharedKeywords={movie.sharedKeywords}
          />
        )}
      </div>
    </div>
  );
}
