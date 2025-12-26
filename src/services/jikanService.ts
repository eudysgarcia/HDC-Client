import axios, { AxiosInstance } from 'axios';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// Cliente axios para Jikan API
const jikanClient: AxiosInstance = axios.create({
  baseURL: JIKAN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rate limiting: Esperar entre requests (Jikan tiene límite de 60 req/min)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 segundo entre requests

const waitForRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
};

export interface JikanAnime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  approved: boolean;
  titles: Array<{
    type: string;
    title: string;
  }>;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string | null;
    string: string;
  };
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  broadcast: {
    day: string | null;
    time: string | null;
    timezone: string | null;
    string: string | null;
  };
  producers: Array<{ mal_id: number; name: string }>;
  licensors: Array<{ mal_id: number; name: string }>;
  studios: Array<{ mal_id: number; name: string }>;
  genres: Array<{ mal_id: number; name: string; type: string }>;
  explicit_genres: Array<{ mal_id: number; name: string }>;
  themes: Array<{ mal_id: number; name: string }>;
  demographics: Array<{ mal_id: number; name: string }>;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanAnimeResponse {
  pagination: JikanPagination;
  data: JikanAnime[];
}

export interface JikanAnimeDetailResponse {
  data: JikanAnime;
}

export const jikanService = {
  // Buscar anime
  searchAnime: async (query: string, page: number = 1): Promise<JikanAnimeResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeResponse>('/anime', {
      params: {
        q: query,
        page,
        limit: 25,
        order_by: 'popularity',
        sort: 'asc',
      },
    });
    return response.data;
  },

  // Top anime (por rating)
  getTopAnime: async (page: number = 1, type?: string, filter?: string): Promise<JikanAnimeResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeResponse>('/top/anime', {
      params: {
        page,
        limit: 25,
        type,
        filter,
      },
    });
    return response.data;
  },

  // Anime de la temporada actual (trending)
  getCurrentSeasonAnime: async (page: number = 1): Promise<JikanAnimeResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeResponse>('/seasons/now', {
      params: {
        page,
        limit: 25,
      },
    });
    return response.data;
  },

  // Anime por temporada específica
  getSeasonAnime: async (year: number, season: string, page: number = 1): Promise<JikanAnimeResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeResponse>(`/seasons/${year}/${season}`, {
      params: {
        page,
        limit: 25,
      },
    });
    return response.data;
  },

  // Detalles de un anime específico
  getAnimeById: async (id: number): Promise<JikanAnimeDetailResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeDetailResponse>(`/anime/${id}`);
    return response.data;
  },

  // Personajes y staff de un anime
  getAnimeCharacters: async (id: number) => {
    await waitForRateLimit();
    const response = await jikanClient.get(`/anime/${id}/characters`);
    return response.data;
  },

  // Episodios de un anime
  getAnimeEpisodes: async (id: number, page: number = 1) => {
    await waitForRateLimit();
    const response = await jikanClient.get(`/anime/${id}/episodes`, {
      params: { page },
    });
    return response.data;
  },

  // Reseñas de un anime
  getAnimeReviews: async (id: number, page: number = 1) => {
    await waitForRateLimit();
    const response = await jikanClient.get(`/anime/${id}/reviews`, {
      params: { page },
    });
    return response.data;
  },

  // Recomendaciones de un anime
  getAnimeRecommendations: async (id: number) => {
    await waitForRateLimit();
    const response = await jikanClient.get(`/anime/${id}/recommendations`);
    return response.data;
  },

  // Anime por género
  getAnimeByGenre: async (genreId: number, page: number = 1): Promise<JikanAnimeResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeResponse>('/anime', {
      params: {
        genres: genreId,
        page,
        limit: 25,
        order_by: 'popularity',
        sort: 'asc',
      },
    });
    return response.data;
  },

  // Anime populares
  getPopularAnime: async (page: number = 1): Promise<JikanAnimeResponse> => {
    await waitForRateLimit();
    const response = await jikanClient.get<JikanAnimeResponse>('/anime', {
      params: {
        page,
        limit: 25,
        order_by: 'popularity',
        sort: 'asc',
      },
    });
    return response.data;
  },
};

