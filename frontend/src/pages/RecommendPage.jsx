import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Film, ArrowRight, BookOpen, Layers, CheckCircle2, User, Star } from 'lucide-react';
import { FEATURED_PRESETS } from '../utils/constants';
import MovieCard from '../components/MovieCard';

export default function RecommendPage({
  movies,
  movieMap,
  getRecommendationsForMovie,
  selectedMovieId,
  onSelectMovieId,
  onOpenDetails,
  isInWatchlist,
  onToggleWatchlist,
}) {
  const [searchInput, setSearchInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Default to Inception (27205) or The Dark Knight (155) if none selected
  const activeMovieId = selectedMovieId || 27205;
  const currentMovie = movieMap.get(activeMovieId) || movies[0];

  // Top 10 recommendations for this movie
  const recommendations = useMemo(() => {
    return currentMovie ? getRecommendationsForMovie(currentMovie.id) : [];
  }, [currentMovie, getRecommendationsForMovie]);

  // Autocomplete search suggestions
  const searchResults = useMemo(() => {
    if (!searchInput.trim()) return [];
    const q = searchInput.toLowerCase();
    const results = [];
    for (let i = 0; i < movies.length; i++) {
      const m = movies[i];
      if (m.title.toLowerCase().includes(q)) {
        results.push(m);
        if (results.length >= 8) break;
      }
    }
    return results;
  }, [searchInput, movies]);

  const handleSelectMovie = (movie) => {
    onSelectMovieId(movie.id);
    setSearchInput('');
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <section className="relative rounded-3xl p-6 sm:p-8 glass-panel border border-slate-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TF-IDF Vector Space Model & Cosine Similarity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Similar Movie Recommendations
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Search any movie from the TMDB 5000 dataset to generate the top 10 most contextually and thematically aligned recommendations. Each suggestion includes an explainable breakdown grounded in real dataset features.
          </p>

          {/* Search Bar with Autocomplete Dropdown */}
          <div className="mt-5 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search movie by title (e.g. Interstellar, Avatar)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl z-30 overflow-hidden divide-y divide-slate-800">
                {searchResults.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMovie(m)}
                    className="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-sm text-slate-100 block">{m.title}</span>
                      <span className="text-xs text-slate-400">
                        {m.year} • {(m.genres || []).slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">★ {m.vote_average?.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Preset Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Popular examples:</span>
            {FEATURED_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectMovie(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${currentMovie?.id === preset.id
                    ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 font-bold'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Seed Movie Banner */}
      {currentMovie && (
        <section className="p-6 rounded-3xl glass-card border border-indigo-500/30 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Target Movie For Similarity Query
                </span>
                <span className="text-xs text-slate-400">{currentMovie.year}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentMovie.title}
              </h2>
              {currentMovie.director && (
                <p className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Directed by <strong className="text-slate-200">{currentMovie.director}</strong></span>
                  {currentMovie.cast && currentMovie.cast.length > 0 && (
                    <span>• Starring {currentMovie.cast.slice(0, 2).join(', ')}</span>
                  )}
                </p>
              )}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {currentMovie.overview}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(currentMovie.genres || []).map((g) => (
                  <span
                    key={g}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => onOpenDetails?.(currentMovie)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-700"
              >
                <span>Full Details</span>
              </button>
              <button
                onClick={() => onToggleWatchlist?.(currentMovie.id)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 ${isInWatchlist(currentMovie.id)
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
              >
                <span>{isInWatchlist(currentMovie.id) ? 'Saved in Watchlist' : '+ Add to Watchlist'}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Recommendations Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Top 10 Similar Movies</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ranked in descending order of Cosine Similarity using TF-IDF feature vectors
            </p>
          </div>
          <span className="text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-3 py-1 rounded-full font-mono">
            Algorithm: Cosine Similarity on TF-IDF Matrix (5000 features)
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {recommendations.map((recMovie, index) => (
              <MovieCard
                key={recMovie.id}
                movie={recMovie}
                rank={index + 1}
                onSelectMovie={onOpenDetails}
                onFindSimilar={() => {
                  onSelectMovieId(recMovie.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isInWatchlist={isInWatchlist(recMovie.id)}
                onToggleWatchlist={onToggleWatchlist}
                showExplanation={true}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center glass-card rounded-2xl border border-slate-800">
            <p className="text-sm text-slate-400">No precomputed recommendations found for this movie ID.</p>
          </div>
        )}
      </section>

      {/* Academic Explanatory Viva Card 
      <section className="p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/20 text-xs text-slate-300 space-y-3">
        <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Academic Methodology: Content-Based Recommendation Formula</span>
        </div>
        <p className="leading-relaxed">
          In this project, each movie is mapped to a 5,000-dimensional term frequency-inverse document frequency (<strong className="text-white">TF-IDF</strong>) vector constructed from its synopsis, genres, keywords, cast, and director. The similarity score between movie vector <strong className="text-white">A</strong> and target movie vector <strong className="text-white">B</strong> is calculated using the <strong className="text-white">Cosine Similarity</strong> metric:
        </p>
        <div className="p-3 rounded-xl bg-black/60 font-mono text-center text-indigo-300 border border-slate-800">
          Cosine Similarity(A, B) = (A · B) / (||A|| × ||B||) = cos(θ)
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          Because TF-IDF vectors are non-negative, the resulting similarity ranges from <strong>0.000</strong> (completely orthogonal / zero vocabulary overlap) to <strong>1.000</strong> (identical textual feature representation). Unlike Collaborative Filtering, Content-Based Filtering does not suffer from the cold-start item problem and does not require private user rating histories.
        </p>
      </section>
      */}
    </div>
  );
}
