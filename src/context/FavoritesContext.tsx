import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';

interface FavoritesContextType {
  favoriteIds: number[];
  watchlistIds: number[];
  loading: boolean;
  addToFavorites: (movieId: number) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  addToWatchlist: (movieId: number) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
  refreshLists: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar listas cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      refreshLists();
    } else {
      setFavoriteIds([]);
      setWatchlistIds([]);
    }
  }, [isAuthenticated]);

  const refreshLists = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setFavoriteIds(profile.favoriteMovies || []);
      setWatchlistIds(profile.watchlist || []);
    } catch (error) {
      console.error('Error al cargar listas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (movieId: number) => {
    await userService.addToFavorites(movieId);
    setFavoriteIds(prev => [...prev, movieId]);
  };

  const removeFromFavorites = async (movieId: number) => {
    await userService.removeFromFavorites(movieId);
    setFavoriteIds(prev => prev.filter(id => id !== movieId));
  };

  const addToWatchlist = async (movieId: number) => {
    await userService.addToWatchlist(movieId);
    setWatchlistIds(prev => [...prev, movieId]);
  };

  const removeFromWatchlist = async (movieId: number) => {
    await userService.removeFromWatchlist(movieId);
    setWatchlistIds(prev => prev.filter(id => id !== movieId));
  };

  const isFavorite = (movieId: number) => favoriteIds.includes(movieId);
  const isInWatchlist = (movieId: number) => watchlistIds.includes(movieId);

  const value = {
    favoriteIds,
    watchlistIds,
    loading,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    isFavorite,
    isInWatchlist,
    refreshLists,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

