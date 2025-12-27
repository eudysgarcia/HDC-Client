export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  movieId: number;
  movieTitle: string;
  rating: number;
  comment: string;
  likes: string[];
  dislikes: string[];
  likesCount: number;
  dislikesCount: number;
  userAction: 'like' | 'dislike' | null;  // Estado del usuario actual
  parentReview?: string;
  replies?: Review[];
  repliesCount?: number;  // Contador de respuestas
  isEdited: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  movieId: number;
  movieTitle: string;
  rating: number;
  comment: string;
}

