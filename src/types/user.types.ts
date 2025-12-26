export interface WatchedMovie {
  movieId: number;
  watchedAt: Date;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  role: string;
  favoriteMovies: number[];
  watchlist: number[];
  watchedMovies?: WatchedMovie[];
  createdAt?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  role: string;
  token: string;
  favoriteMovies: number[];
  watchlist: number[];
  watchedMovies?: WatchedMovie[];
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

