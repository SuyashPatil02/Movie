import React, { useState } from 'react';
import { useMovieData } from './hooks/useMovieData';
import { useWatchlist } from './hooks/useWatchlist';
import Navbar from './components/Navbar';
import MovieDetailsModal from './components/MovieDetailsModal';
import DiscoverPage from './pages/DiscoverPage';
import RecommendPage from './pages/RecommendPage';
import WatchlistPage from './pages/WatchlistPage';
import InsightsPage from './pages/InsightsPage';
import AboutPage from './pages/AboutPage';
import { Film, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const {
    movies,
    movieMap,
    recommendations,
    stats,
    loading,
    error,
    getRecommendationsForMovie,
  } = useMovieData();

  const {
    watchlistIds,
    watchlistCount,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
  } = useWatchlist();

  const [activeTab, setActiveTab] = useState('discover');
  const [selectedMovieForDetails, setSelectedMovieForDetails] = useState(null);
  const [selectedMovieForRecommendId, setSelectedMovieForRecommendId] = useState(27205); // Default: Inception

  // Navigate to Recommend page with a chosen seed movie
  const handleFindSimilar = (movie) => {
    if (!movie) return;
    setSelectedMovieForRecommendId(movie.id);
    setActiveTab('recommend');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0d14] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        watchlistCount={watchlistCount}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {/* Loading State */}
        {loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
                <Film className="w-8 h-8" />
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-white">Loading CineMood Datasets...</h2>
              <p className="text-xs text-slate-400 mt-1">
                Parsing 4,800+ movies, TF-IDF vectors, and precomputed cosine similarity matrix.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="my-12 p-8 rounded-3xl glass-card border border-rose-500/30 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Dataset Files Not Found</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {error}
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs font-mono text-indigo-300">
              <p className="text-slate-400 mb-1"># Run the Python ML preprocessing pipeline:</p>
              <code>python ml/preprocess.py</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Active Tab Pages */}
        {!loading && !error && (
          <>
            {activeTab === 'discover' && (
              <DiscoverPage
                movies={movies}
                onSelectMovie={(movie) => setSelectedMovieForDetails(movie)}
                onFindSimilar={handleFindSimilar}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}

            {activeTab === 'recommend' && (
              <RecommendPage
                movies={movies}
                movieMap={movieMap}
                getRecommendationsForMovie={getRecommendationsForMovie}
                selectedMovieId={selectedMovieForRecommendId}
                onSelectMovieId={setSelectedMovieForRecommendId}
                onOpenDetails={(movie) => setSelectedMovieForDetails(movie)}
                isInWatchlist={isInWatchlist}
                onToggleWatchlist={toggleWatchlist}
              />
            )}

            {activeTab === 'watchlist' && (
              <WatchlistPage
                watchlistIds={watchlistIds}
                movieMap={movieMap}
                onSelectMovie={(movie) => setSelectedMovieForDetails(movie)}
                onFindSimilar={handleFindSimilar}
                onToggleWatchlist={toggleWatchlist}
                onClearWatchlist={clearWatchlist}
                onGoToDiscover={() => {
                  setActiveTab('discover');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'insights' && <InsightsPage stats={stats} />}

            {activeTab === 'about' && <AboutPage />}
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovieForDetails && (
        <MovieDetailsModal
          movie={selectedMovieForDetails}
          onClose={() => setSelectedMovieForDetails(null)}
          onFindSimilar={handleFindSimilar}
          isInWatchlist={isInWatchlist(selectedMovieForDetails.id)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
              C
            </div>
            <span className="font-semibold text-slate-200">CineMood</span>
            <span>— Smart Movie Discovery & Recommendation System</span>
          </div>

          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            Academic Machine Learning Project • TMDB 5000 Movie Dataset • TF-IDF & Cosine Similarity
          </p>
        </div>
      </footer>
    </div>
  );
}
