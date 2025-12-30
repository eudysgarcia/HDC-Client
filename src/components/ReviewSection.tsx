import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Trash2, Send, MessageCircle, Edit2, X } from 'lucide-react';
import { Review } from '../types/review.types';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { useConfirm } from '../hooks/useConfirm';
import { useLoginModal } from '../context/LoginModalContext';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import { useTranslation } from 'react-i18next';

interface ReviewSectionProps {
  movieId: number;
  movieTitle: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

// Componente recursivo para renderizar respuestas anidadas
interface RenderRepliesProps {
  replies: Review[];
  user: any;
  editingReviewId: string | null;
  editComment: string;
  setEditComment: (value: string) => void;
  handleEdit: (review: Review) => void;
  handleDelete: (reviewId: string) => void;
  handleUpdateReview: (reviewId: string) => void;
  handleCancelEdit: () => void;
  handleLike: (reviewId: string) => void;
  handleDislike: (reviewId: string) => void;
  handleReply: (reviewId: string) => void;
  replyingToId: string | null;
  replyComment: string;
  setReplyComment: (value: string) => void;
  handleSubmitReply: (parentReviewId: string) => void;
  handleCancelReply: () => void;
  level: number;
}

const RenderReplies: React.FC<RenderRepliesProps> = ({
  replies,
  user,
  editingReviewId,
  editComment,
  setEditComment,
  handleEdit,
  handleDelete,
  handleUpdateReview,
  handleCancelEdit,
  handleLike,
  handleDislike,
  handleReply,
  replyingToId,
  replyComment,
  setReplyComment,
  handleSubmitReply,
  handleCancelReply,
  level,
}) => {
  // Limitar el nivel de anidamiento visual (máximo 5 niveles)
  const maxLevel = 5;
  const currentLevel = Math.min(level, maxLevel);
  const marginLeft = currentLevel <= maxLevel ? `${currentLevel * 2}rem` : `${maxLevel * 2}rem`;

  return (
    <div style={{ marginLeft }} className="mt-4 space-y-3 border-l-2 border-primary/30 pl-4">
      {replies.map((reply) => (
        <div key={reply._id} className="bg-dark rounded-lg p-4">
          {/* Modo edición de respuesta */}
          {editingReviewId === reply._id ? (
            <div className="space-y-3">
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={3}
                className="w-full bg-dark-light text-white px-4 py-3 rounded-lg border border-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                minLength={10}
                maxLength={1000}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateReview(reply._id)}
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-lg transition-colors font-semibold text-sm"
                >
                  {t('reviews.save')}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg transition-colors font-semibold text-sm"
                >
                  {t('reviews.cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img
                    src={reply.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user.name)}&background=dc2626&color=fff&size=128`}
                    alt={reply.user.name}
                    className="w-8 h-8 rounded-full border border-primary object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.user.name)}&background=dc2626&color=fff&size=128`;
                    }}
                  />
                  <div>
                    <p className="text-white font-semibold text-sm">{reply.user.name}</p>
                    <span className="text-gray-500 text-xs">
                      {new Date(reply.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {reply.isEdited && <span className="ml-1 italic">(editado)</span>}
                    </span>
                  </div>
                </div>
                {user?._id === reply.user._id && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(reply)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(reply._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-3">{reply.comment}</p>
              
              {/* Likes/Dislikes y Responder */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLike(reply._id)}
                  className={`flex items-center gap-1.5 transition-colors text-sm ${
                    reply.userAction === 'like'
                      ? 'text-green-500'
                      : 'text-gray-400 hover:text-green-500'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${reply.userAction === 'like' ? 'fill-green-500' : ''}`} />
                  <span className="font-semibold">{reply.likesCount || 0}</span>
                </button>
                <button
                  onClick={() => handleDislike(reply._id)}
                  className={`flex items-center gap-1.5 transition-colors text-sm ${
                    reply.userAction === 'dislike'
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <ThumbsDown className={`w-3.5 h-3.5 ${reply.userAction === 'dislike' ? 'fill-red-500' : ''}`} />
                  <span className="font-semibold">{reply.dislikesCount || 0}</span>
                </button>
                {/* Botón de responder en respuestas también */}
                <button
                  onClick={() => handleReply(reply._id)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors text-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('reviews.reply')} {reply.repliesCount ? `(${reply.repliesCount})` : ''}</span>
                </button>
              </div>

              {/* Formulario de respuesta */}
              <AnimatePresence>
                {replyingToId === reply._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-dark-light rounded-lg p-3 mt-3"
                  >
                    <textarea
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                      placeholder={t('reviews.writeReplyPlaceholder')}
                      rows={3}
                      className="w-full bg-dark text-white px-3 py-2 rounded-lg border border-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-2 text-sm"
                      minLength={10}
                      maxLength={1000}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubmitReply(reply._id)}
                        className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm"
                      >
                        {t('reviews.publish')}
                      </button>
                      <button
                        onClick={handleCancelReply}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm"
                      >
                        {t('reviews.cancel')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Respuestas anidadas (recursivo) */}
              {reply.replies && reply.replies.length > 0 && (
                <RenderReplies
                  replies={reply.replies}
                  user={user}
                  editingReviewId={editingReviewId}
                  editComment={editComment}
                  setEditComment={setEditComment}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleUpdateReview={handleUpdateReview}
                  handleCancelEdit={handleCancelEdit}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  handleReply={handleReply}
                  replyingToId={replyingToId}
                  replyComment={replyComment}
                  setReplyComment={setReplyComment}
                  handleSubmitReply={handleSubmitReply}
                  handleCancelReply={handleCancelReply}
                  level={level + 1}
                />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ movieId, movieTitle, reviews, onReviewAdded }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { toast, hideToast, success, error, warning } = useToast();
  const { confirmState, confirm, cancel } = useConfirm();
  const { openLoginModal } = useLoginModal();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    // Validación de comentario
    const trimmedComment = comment.trim();
    
    if (!trimmedComment) {
      error('Por favor escribe un comentario');
      return;
    }

    if (trimmedComment.length < 10) {
      warning(`El comentario debe tener al menos 10 caracteres. Actualmente: ${trimmedComment.length}`);
      return;
    }

    if (trimmedComment.length > 1000) {
      error('El comentario no puede tener más de 1000 caracteres');
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
      success('¡Reseña publicada exitosamente!');
    } catch (error: any) {
      console.error('Error al crear review:', error);
      const errorMsg = error.response?.data?.message || 'Error al publicar la reseña. Intenta de nuevo.';
      error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    try {
      await reviewService.like(reviewId);
      onReviewAdded();
    } catch (err) {
      console.error('Error al dar like:', err);
      error('Error al dar like');
    }
  };

  const handleDislike = async (reviewId: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    try {
      await reviewService.dislike(reviewId);
      onReviewAdded();
    } catch (err) {
      console.error('Error al dar dislike:', err);
      error('Error al dar dislike');
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment('');
  };

  const handleUpdateReview = async (reviewId: string) => {
    const trimmedComment = editComment.trim();
    
    if (trimmedComment.length < 10) {
      warning('El comentario debe tener al menos 10 caracteres');
      return;
    }

    try {
      await reviewService.update(reviewId, {
        rating: editRating,
        comment: trimmedComment,
      });
      setEditingReviewId(null);
      onReviewAdded();
      success('Reseña actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar review:', err);
      error('Error al actualizar la reseña');
    }
  };

  const handleReply = (reviewId: string) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    setReplyingToId(reviewId);
    setReplyComment('');
  };

  const handleCancelReply = () => {
    setReplyingToId(null);
    setReplyComment('');
  };

  const handleSubmitReply = async (parentReviewId: string) => {
    const trimmedComment = replyComment.trim();
    
    if (trimmedComment.length < 10) {
      warning('La respuesta debe tener al menos 10 caracteres');
      return;
    }

    try {
      await reviewService.reply(parentReviewId, trimmedComment);
      setReplyingToId(null);
      setReplyComment('');
      onReviewAdded();
      success('Respuesta publicada correctamente');
    } catch (err) {
      console.error('Error al responder:', err);
      error('Error al publicar la respuesta');
    }
  };

  const handleDelete = async (reviewId: string) => {
    const confirmed = await confirm({
      title: 'Eliminar Reseña',
      message: '¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await reviewService.delete(reviewId);
      onReviewAdded();
      success('Reseña eliminada correctamente');
    } catch (err) {
      console.error('Error al eliminar review:', err);
      error('Error al eliminar la reseña');
    }
  };

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <ConfirmDialog {...confirmState} onCancel={cancel} />
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">
          {t('reviews.reviews')} ({reviews.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openLoginModal();
                return;
              }
              setShowForm(true);
            }}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors font-semibold"
          >
            {t('reviews.writeReview')}
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
                  {t('reviews.yourRating')}
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
                    {t('reviews.yourReview')}
                  </label>
                  <span className={`text-sm ${
                    comment.trim().length < 10 
                      ? 'text-red-400' 
                      : comment.trim().length > 1000 
                      ? 'text-red-400' 
                      : 'text-gray-400'
                  }`}>
                    {comment.trim().length} / {t('reviews.charLimit')}
                  </span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('reviews.writePlaceholder')}
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
                    ⚠️ {t('reviews.charsNeeded', { count: 10 - comment.trim().length })}
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
                  {submitting ? t('reviews.publishing') : t('reviews.publish')}
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
                  {t('reviews.cancel')}
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
              {/* Modo edición */}
              {editingReviewId === review._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      {t('reviews.rating')}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= editRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-white font-bold ml-2">{editRating}/10</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      {t('reviews.comment')}
                    </label>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={4}
                      className="w-full bg-dark text-white px-4 py-3 rounded-lg border border-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      minLength={10}
                      maxLength={1000}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateReview(review._id)}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                    >
                      {t('reviews.save')}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                    >
                      {t('reviews.cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                          {review.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 font-bold">{review.rating}/10</span>
                      </div>
                          )}
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                          {review.isEdited && (
                            <span className="text-gray-500 text-sm italic">(editado)</span>
                          )}
                    </div>
                  </div>
                </div>

                {/* Acciones (solo para el autor) */}
                {user?._id === review.user._id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                      </div>
                )}
              </div>

              {/* Comentario */}
              <p className="text-gray-300 mb-4 leading-relaxed">{review.comment}</p>

                  {/* Likes, Dislikes y Responder */}
                  <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleLike(review._id)}
                      className={`flex items-center gap-2 transition-colors ${
                        review.userAction === 'like'
                          ? 'text-green-500'
                          : 'text-gray-400 hover:text-green-500'
                      }`}
                >
                      <ThumbsUp className={`w-4 h-4 ${review.userAction === 'like' ? 'fill-green-500' : ''}`} />
                      <span className="font-semibold">{review.likesCount || 0}</span>
                    </button>
                    <button
                      onClick={() => handleDislike(review._id)}
                      className={`flex items-center gap-2 transition-colors ${
                        review.userAction === 'dislike'
                          ? 'text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <ThumbsDown className={`w-4 h-4 ${review.userAction === 'dislike' ? 'fill-red-500' : ''}`} />
                      <span className="font-semibold">{review.dislikesCount || 0}</span>
                    </button>
                    <button
                      onClick={() => handleReply(review._id)}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t('reviews.reply')} {review.repliesCount ? `(${review.repliesCount})` : ''}</span>
                    </button>
                  </div>

                  {/* Formulario de respuesta */}
                  <AnimatePresence>
                    {replyingToId === review._id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-dark rounded-lg p-4 mb-4"
                      >
                        <textarea
                          value={replyComment}
                          onChange={(e) => setReplyComment(e.target.value)}
                          placeholder={t('reviews.writeReplyPlaceholder')}
                          rows={3}
                          className="w-full bg-dark-light text-white px-4 py-3 rounded-lg border border-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3"
                          minLength={10}
                          maxLength={1000}
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleSubmitReply(review._id)}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                          >
                            {t('reviews.publishReply')}
                          </button>
                          <button
                            onClick={handleCancelReply}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors font-semibold text-sm"
                          >
                            {t('reviews.cancel')}
                </button>
              </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Respuestas (Componente recursivo para anidamiento profundo) */}
                  {review.replies && review.replies.length > 0 && (
                    <RenderReplies
                      replies={review.replies}
                      user={user}
                      editingReviewId={editingReviewId}
                      editComment={editComment}
                      setEditComment={setEditComment}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                      handleUpdateReview={handleUpdateReview}
                      handleCancelEdit={handleCancelEdit}
                      handleLike={handleLike}
                      handleDislike={handleDislike}
                      handleReply={handleReply}
                      replyingToId={replyingToId}
                      replyComment={replyComment}
                      setReplyComment={setReplyComment}
                      handleSubmitReply={handleSubmitReply}
                      handleCancelReply={handleCancelReply}
                      level={1}
                    />
                  )}
                </>
              )}
            </motion.div>
          ))
        ) : (
          <div className="bg-dark-light rounded-lg p-12 text-center border border-dark-lighter">
            <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {t('reviews.noReviewsYet')}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ReviewSection;

