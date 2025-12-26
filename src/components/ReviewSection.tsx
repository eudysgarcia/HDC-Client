import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Trash2, Edit2, Send } from 'lucide-react';
import { Review } from '../types/review.types';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';

interface ReviewSectionProps {
  movieId: number;
  movieTitle: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ movieId, movieTitle, reviews, onReviewAdded }) => {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para escribir una reseña');
      return;
    }

    // Validación de comentario
    const trimmedComment = comment.trim();
    
    if (!trimmedComment) {
      alert('Por favor escribe un comentario');
      return;
    }

    if (trimmedComment.length < 10) {
      alert(`El comentario debe tener al menos 10 caracteres. Actualmente: ${trimmedComment.length}`);
      return;
    }

    if (trimmedComment.length > 1000) {
      alert('El comentario no puede tener más de 1000 caracteres');
      return;
    }

    if (submitting) return;

    try {
      setSubmitting(true);
      await reviewService.create({
        movieId,
        movieTitle,
        rating,
        comment: trimmedComment,
      });
      setComment('');
      setRating(5);
      setShowForm(false);
      onReviewAdded();
      alert('¡Reseña publicada exitosamente!');
    } catch (error: any) {
      console.error('Error al crear review:', error);
      const errorMsg = error.response?.data?.message || 'Error al publicar la reseña. Intenta de nuevo.';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      await reviewService.like(reviewId);
      onReviewAdded();
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;

    try {
      await reviewService.delete(reviewId);
      onReviewAdded();
    } catch (error) {
      console.error('Error al eliminar review:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">
          Reseñas ({reviews.length})
        </h3>
        {isAuthenticated && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors font-semibold"
          >
            Escribir Reseña
          </button>
        )}
      </div>

      {/* Formulario de nueva reseña */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-dark-light rounded-lg p-6 border border-dark-lighter"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de calificación */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Tu Calificación
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-white font-bold ml-2">{rating}/10</span>
                </div>
              </div>

              {/* Comentario */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-white font-semibold">
                    Tu Reseña
                  </label>
                  <span className={`text-sm ${
                    comment.trim().length < 10 
                      ? 'text-red-400' 
                      : comment.trim().length > 1000 
                      ? 'text-red-400' 
                      : 'text-gray-400'
                  }`}>
                    {comment.trim().length} / 10-1000 caracteres
                  </span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comparte tu opinión sobre esta película... (mínimo 10 caracteres)"
                  rows={4}
                  className={`w-full bg-dark text-white px-4 py-3 rounded-lg border ${
                    comment.trim().length > 0 && comment.trim().length < 10
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-dark-lighter focus:ring-primary'
                  } focus:outline-none focus:ring-2 resize-none`}
                  required
                  minLength={10}
                  maxLength={1000}
                />
                {comment.trim().length > 0 && comment.trim().length < 10 && (
                  <p className="text-red-400 text-sm mt-1">
                    ⚠️ Faltan {10 - comment.trim().length} caracteres
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Publicando...' : 'Publicar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setComment('');
                    setRating(5);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-light rounded-lg p-6 border border-dark-lighter"
            >
              {/* Header de la reseña */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=dc2626&color=fff&size=128`}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=dc2626&color=fff&size=128`;
                    }}
                  />
                  <div>
                    <p className="text-white font-semibold">{review.user.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold">{review.rating}/10</span>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones (solo para el autor) */}
                {user?._id === review.user._id && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Comentario */}
              <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>

              {/* Likes */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(review._id)}
                  disabled={!isAuthenticated}
                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.likes?.length || 0}</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-dark-light rounded-lg p-12 text-center border border-dark-lighter">
            <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              No hay reseñas todavía. ¡Sé el primero en escribir una!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;

