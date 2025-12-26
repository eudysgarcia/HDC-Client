import axios from 'axios';
import { TVShow, TVShowSearchResult, Episode, Cast, Season } from '../types/tvmaze.types';

const TVMAZE_BASE_URL = 'https://api.tvmaze.com';

// Cliente de axios para TVmaze
const tvmazeClient = axios.create({
  baseURL: TVMAZE_BASE_URL,
});

export const tvmazeService = {
  // Buscar series
  searchShows: async (query: string): Promise<TVShow[]> => {
    const response = await tvmazeClient.get<TVShowSearchResult[]>(`/search/shows`, {
      params: { q: query },
    });
    return response.data.map(result => result.show);
  },

  // Obtener serie por ID
  getShowById: async (id: number): Promise<TVShow> => {
    const response = await tvmazeClient.get<TVShow>(`/shows/${id}`);
    return response.data;
  },

  // Obtener episodios de una serie
  getShowEpisodes: async (id: number): Promise<Episode[]> => {
    const response = await tvmazeClient.get<Episode[]>(`/shows/${id}/episodes`);
    return response.data;
  },

  // Obtener elenco de una serie
  getShowCast: async (id: number): Promise<Cast[]> => {
    const response = await tvmazeClient.get<Cast[]>(`/shows/${id}/cast`);
    return response.data;
  },

  // Obtener temporadas de una serie
  getShowSeasons: async (id: number): Promise<Season[]> => {
    const response = await tvmazeClient.get<Season[]>(`/shows/${id}/seasons`);
    return response.data;
  },

  // Obtener series por página (índice de todas las series)
  getShowsByPage: async (page: number = 0): Promise<TVShow[]> => {
    const response = await tvmazeClient.get<TVShow[]>(`/shows`, {
      params: { page },
    });
    return response.data;
  },

  // Obtener programación del día
  getSchedule: async (country: string = 'US', date?: string): Promise<Episode[]> => {
    const params: any = { country };
    if (date) {
      params.date = date;
    }
    const response = await tvmazeClient.get<Episode[]>(`/schedule`, { params });
    return response.data;
  },

  // Obtener series populares (usando página 0 y ordenando por rating)
  getPopularShows: async (limit: number = 50): Promise<TVShow[]> => {
    // TVmaze no tiene endpoint de "popular" directo, así que usamos el índice
    // y filtramos/ordenamos por rating
    const shows = await tvmazeService.getShowsByPage(0);
    return shows
      .filter(show => show.rating.average !== null)
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, limit);
  },

  // Obtener series mejor valoradas
  getTopRatedShows: async (limit: number = 50): Promise<TVShow[]> => {
    const shows = await tvmazeService.getShowsByPage(0);
    return shows
      .filter(show => show.rating.average !== null && (show.rating.average || 0) >= 7)
      .sort((a, b) => (b.rating.average || 0) - (a.rating.average || 0))
      .slice(0, limit);
  },

  // Obtener series por género
  getShowsByGenre: async (genre: string, limit: number = 50): Promise<TVShow[]> => {
    const shows = await tvmazeService.getShowsByPage(0);
    return shows
      .filter(show => show.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
      .slice(0, limit);
  },

  // Obtener series activas (aún en emisión)
  getActiveShows: async (limit: number = 50): Promise<TVShow[]> => {
    const shows = await tvmazeService.getShowsByPage(0);
    return shows
      .filter(show => show.status === 'Running')
      .slice(0, limit);
  },
};

