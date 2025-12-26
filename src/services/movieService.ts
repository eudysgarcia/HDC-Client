import api from './api';
import { Movie, MovieDetails, MovieResults } from '../types/movie.types';

export const movieService = {
  // Obtener películas populares
  getPopular: async (page: number = 1): Promise<MovieResults> => {
    const response = await api.get<MovieResults>(`/movies/popular?page=${page}`);
    return response.data;
  },

  // Obtener películas en tendencia
  getTrending: async (): Promise<MovieResults> => {
    const response = await api.get<MovieResults>('/movies/trending');
    return response.data;
  },

  // Obtener películas mejor calificadas
  getTopRated: async (page: number = 1): Promise<MovieResults> => {
    const response = await api.get<MovieResults>(`/movies/top-rated?page=${page}`);
    return response.data;
  },

  // Obtener estrenos
  getUpcoming: async (page: number = 1): Promise<MovieResults> => {
    const response = await api.get<MovieResults>(`/movies/upcoming?page=${page}`);
    return response.data;
  },

  // Obtener películas en cartelera
  getNowPlaying: async (page: number = 1): Promise<MovieResults> => {
    const response = await api.get<MovieResults>(`/movies/now-playing?page=${page}`);
    return response.data;
  },

  // Obtener detalles de una película
  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    const response = await api.get<MovieDetails>(`/movies/${id}`);
    return response.data;
  },

  // Buscar películas
  search: async (query: string, page: number = 1): Promise<MovieResults> => {
    const response = await api.get<MovieResults>(`/movies/search?q=${query}&page=${page}`);
    return response.data;
  },

  // Obtener géneros
  getGenres: async (): Promise<{ genres: { id: number; name: string }[] }> => {
    const response = await api.get('/movies/genres');
    return response.data;
  },

  // Obtener películas por género
  getByGenre: async (genreId: number, page: number = 1): Promise<MovieResults> => {
    const response = await api.get<MovieResults>(`/movies/genre/${genreId}?page=${page}`);
    return response.data;
  },
};

