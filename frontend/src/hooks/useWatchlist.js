import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cinemood_watchlist';

export function useWatchlist() {
  const [watchlistIds, setWatchlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Failed to read watchlist from localStorage:', e);
      return [];
    }
  });

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistIds));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage:', e);
    }
  }, [watchlistIds]);

  const addToWatchlist = useCallback((id) => {
    const numId = Number(id);
    setWatchlistIds((prev) => (prev.includes(numId) ? prev : [...prev, numId]));
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    const numId = Number(id);
    setWatchlistIds((prev) => prev.filter((item) => item !== numId));
  }, []);

  const toggleWatchlist = useCallback((id) => {
    const numId = Number(id);
    setWatchlistIds((prev) =>
      prev.includes(numId) ? prev.filter((item) => item !== numId) : [...prev, numId]
    );
  }, []);

  const isInWatchlist = useCallback(
    (id) => {
      return watchlistIds.includes(Number(id));
    },
    [watchlistIds]
  );

  const clearWatchlist = useCallback(() => {
    setWatchlistIds([]);
  }, []);

  return {
    watchlistIds,
    watchlistCount: watchlistIds.length,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
  };
}
