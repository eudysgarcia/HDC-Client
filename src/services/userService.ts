import api from './api';
import { User } from '../types/user.types';
import { MovieDetails } from '../types/movie.types';

export const userService = {
  // Obtener perfil
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/users/profile', data);
    return response.data;
  },

  // Favoritos
  getFavorites: async (): Promise<MovieDetails[]> => {
    const response = await api.get<MovieDetails[]>('/users/favorites');
    return response.data;
  },

  addToFavorites: async (movieId: number): Promise<void> => {
    await api.post(`/users/favorites/${movieId}`);
  },

  removeFromFavorites: async (movieId: number): Promise<void> => {
    await api.delete(`/users/favorites/${movieId}`);
  },

  // Watchlist
  getWatchlist: async (): Promise<MovieDetails[]> => {
    const response = await api.get<MovieDetails[]>('/users/watchlist');
    return response.data;
  },

  addToWatchlist: async (movieId: number): Promise<void> => {
    await api.post(`/users/watchlist/${movieId}`);
  },

  removeFromWatchlist: async (movieId: number): Promise<void> => {
    await api.delete(`/users/watchlist/${movieId}`);
  },
};

