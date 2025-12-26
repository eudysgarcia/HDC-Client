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

