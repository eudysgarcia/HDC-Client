import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Calendar, Heart, List, Play, ArrowLeft } from 'lucide-react';
import { movieService } from '../services/movieService';
import { userService } from '../services/userService';
import { reviewService } from '../services/reviewService';
import { MovieDetails as MovieDetailsType } from '../types/movie.types';
import { Review } from '../types/review.types';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { useLoginModal } from '../context/LoginModalContext';
import { useFavorites } from '../context/FavoritesContext';
import Loading from '../components/Loading';
import MovieRow from '../components/MovieRow';
import ReviewSection from '../components/ReviewSection';
import TrailerModal from '../components/TrailerModal';
import { useTranslation } from 'react-i18next';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToastContext();
  const { openLoginModal } = useLoginModal();
  const { isFavorite: checkIsFavorite, isInWatchlist: checkIsInWatchlist, addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } = useFavorites();
  
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  
  const isFavorite = movie ? checkIsFavorite(movie.id) : false;
  const isInWatchlist = movie ? checkIsInWatchlist(movie.id) : false;

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const reviewsData = await reviewService.getByMovie(parseInt(id));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error al cargar reviews:', error);
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const movieData = await movieService.getMovieDetails(parseInt(id));
        setMovie(movieData);

        // Cargar reviews
        await fetchReviews();
      } catch (error) {
        console.error('Error al cargar película:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!movie) return;

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id);
        success(t('toast.removedFromFavorites'));
      } else {
        await addToFavorites(movie.id);
        success(t('toast.addedToFavorites'));
      }
    } catch (err) {
      console.error('Error al actualizar favoritos:', err);
      showError(t('toast.error'));
    }
  };

  const handleToggleWatchlist = async () => {
    if (!movie) return;

    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    try {
      if (isInWatchlist) {
        await removeFromWatchlist(movie.id);
        success(t('toast.removedFromWatchlist'));
      } else {
        await addToWatchlist(movie.id);
        success(t('toast.addedToWatchlist'));
      }
    } catch (err) {
      console.error('Error al actualizar watchlist:', err);
      showError(t('toast.error'));
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">{t('common.error')}</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  const trailer = movie.videos?.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark"
    >
      {/* Hero Banner */}
      <div className="relative h-[80vh] w-full mt-16">
        <img
          src={movie.backdrop_path || movie.poster_path || ''}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-8 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white p-3 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Contenido */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center space-x-1 bg-yellow-500 px-3 py-1 rounded-lg">
                <Star className="w-5 h-5 fill-yellow-500 text-black" />
                <span className="text-black font-bold text-lg">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Clock className="w-5 h-5" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Calendar className="w-5 h-5" />
                <span>{movie.release_date}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{t('movie.trailer')}</span>
                </button>
              )}
              <button
                onClick={handleToggleFavorite}
                className={`${
                  isFavorite ? 'bg-primary' : 'bg-gray-600/80'
                } hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                <span>{isFavorite ? t('movie.removeFromFavorites') : t('movie.addToFavorites')}</span>
              </button>
              <button
                onClick={handleToggleWatchlist}
                className={`${
                  isInWatchlist ? 'bg-primary' : 'bg-gray-600/80'
                } hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors`}
              >
                <List className="w-5 h-5" />
                <span>{isInWatchlist ? t('movie.removeFromWatchlist') : t('movie.addToWatchlist')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detalles */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">{t('movie.overview')}</h2>
              <p className="text-gray-300 text-lg leading-relaxed">{movie.overview}</p>
            </div>

            {/* Géneros */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">{t('movie.genres')}</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-dark-lighter px-4 py-2 rounded-lg text-white"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Elenco */}
            {movie.credits && movie.credits.cast.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">{t('movie.cast')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <motion.div
                      key={actor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center group"
                    >
                      <div className="relative overflow-hidden rounded-xl mb-3 shadow-lg">
                        <img
                          src={
                            actor.profile_path
                              ? actor.profile_path.startsWith('http')
                                ? actor.profile_path
                                : `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                              : 'https://via.placeholder.com/300x450/1f1f1f/666666?text=Sin+Foto'
                          }
                          alt={actor.name}
                          className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/300x450/1f1f1f/666666?text=Sin+Foto';
                          }}
                        />
                      </div>
                      <p className="text-white font-bold text-sm mb-1">{actor.name}</p>
                      <p className="text-gray-400 text-xs leading-relaxed">{actor.character}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Reseñas */}
            <ReviewSection
              movieId={parseInt(id!)}
              movieTitle={movie.title}
              reviews={reviews}
              onReviewAdded={fetchReviews}
            />
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            <div className="bg-dark-lighter p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">{t('movie.information')}</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">{t('movie.status')}</p>
                  <p className="text-white font-semibold">{movie.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('movie.budget')}</p>
                  <p className="text-white font-semibold">
                    ${movie.budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('movie.revenue')}</p>
                  <p className="text-white font-semibold">
                    ${movie.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">{t('movie.originalLanguage')}</p>
                  <p className="text-white font-semibold uppercase">
                    {movie.original_language}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Películas similares */}
      {movie.similar && movie.similar.results.length > 0 && (
        <div className="mt-12">
          <MovieRow title={t('movie.similar')} movies={movie.similar.results} />
        </div>
      )}

      {/* Modal del trailer */}
      {trailer && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailerKey={trailer.key}
          title={movie.title}
        />
      )}
    </motion.div>
  );
};

export default MovieDetail;

