export interface Movie {
  id: number;
  title: string;
  original_title: string;
  original_language?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string | null;
  genres: Genre[];
  credits?: {
    cast: Cast[];
  };
  videos?: {
    results: Video[];
  };
  similar?: {
    results: Movie[];
  };
}

export interface MovieResults {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

