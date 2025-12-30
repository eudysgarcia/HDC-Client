import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart } from 'lucide-react';
import { Movie } from '../types/movie.types';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToastContext } from '../context/ToastContext';
import { useLoginModal } from '../context/LoginModalContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTranslation } from 'react-i18next';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const { isAuthenticated } = useAuth();
  const { success } = useToastContext();
  const { openLoginModal } = useLoginModal();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { t } = useTranslation();
  const placeholderImage = 'https://via.placeholder.com/300x450/1f1f1f/666666?text=Sin+Imagen';
  
  // Verificar si esta película está en favoritos
  const isMovieFavorite = isFavorite(movie.id);
  
  // Helper para obtener la URL completa de la imagen
  const getImageUrl = (path: string | null) => {
    if (!path) return placeholderImage;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    try {
      if (isMovieFavorite) {
        await removeFromFavorites(movie.id);
        success(t('toast.removedFromFavorites'));
      } else {
        await addToFavorites(movie.id);
        success(t('toast.addedToFavorites'));
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        className="group relative cursor-pointer"
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-lighter shadow-lg">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = placeholderImage;
            }}
          />

          {/* Overlay en hover - Diseño moderno SIN botón */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-red-600 text-white px-2 py-2 rounded-full font-bold flex items-center gap-2 shadow-2xl">
                <Play className="w-3 h-3 fill-white" />
                <span>{t('common.viewDetails')}</span>
              </div>
            </div>
          </div>

          {/* Rating badge - Siempre visible */}
          <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-lg border-2 border-yellow-300/50">
            <Star className="w-4 h-4 text-black fill-black" />
            <span className="text-black text-sm font-black">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          {/* Botón de favoritos - top left */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md border-2 transition-all shadow-lg ${
              isMovieFavorite
                ? 'bg-red-500 border-red-400 text-white'
                : 'bg-black/50 border-white/30 text-white hover:bg-red-500 hover:border-red-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isMovieFavorite ? 'fill-white' : ''}`} />
          </motion.button>
        </div>

        {/* Título fuera de la imagen (visible siempre) - Mejor espaciado */}
        <div className="mt-3 space-y-1">
          <h3 className="text-white font-bold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-sm font-medium">
            {movie.release_date?.split('-')[0] || 'N/A'}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default MovieCard;

