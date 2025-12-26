import api from './api';
import { Review, CreateReviewData } from '../types/review.types';

export const reviewService = {
  // Crear review
  create: async (data: CreateReviewData): Promise<Review> => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  // Obtener reviews de una película
  getByMovie: async (movieId: number): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/reviews/movie/${movieId}`);
    return response.data;
  },

  // Obtener mis reviews
  getMyReviews: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/my-reviews');
    return response.data;
  },

  // Actualizar review
  update: async (id: string, data: Partial<CreateReviewData>): Promise<Review> => {
    const response = await api.put<Review>(`/reviews/${id}`, data);
    return response.data;
  },

  // Eliminar review
  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },

  // Dar like
  like: async (id: string): Promise<void> => {
    await api.post(`/reviews/${id}/like`);
  },

  // Quitar like
  unlike: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}/like`);
  },
};

