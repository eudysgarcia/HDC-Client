import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, SortAsc } from 'lucide-react';
import { userService } from '../services/userService';
import { movieService } from '../services/movieService';
import { Movie } from '../types/movie.types';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useTranslation } from 'react-i18next';

const Favorites: React.FC = () => {
  const { t } = useTranslation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        
        const favoriteMovies = await Promise.all(
          profile.favoriteMovies.map(id => movieService.getMovieDetails(id))
        );
        
        setMovies(favoriteMovies);
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const sortedMovies = [...movies].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.vote_average - a.vote_average;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'date':
      default:
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
    }
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark pt-20 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold text-white">{t('favorites.title')}</h1>
          </div>
          <p className="text-gray-400">
            {t('favorites.count', { count: movies.length })} {t('favorites.inList')}
          </p>
        </div>

        {/* Filtros y ordenamiento */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <SortAsc className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">{t('favorites.sortBy')}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'date'
                  ? 'bg-primary text-white'
                  : 'bg-dark-light text-gray-400 hover:bg-dark-lighter'
              }`}
            >
              {t('favorites.date')}
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'rating'
                  ? 'bg-primary text-white'
                  : 'bg-dark-light text-gray-400 hover:bg-dark-lighter'
              }`}
            >
              {t('favorites.rating')}
            </button>
            <button
              onClick={() => setSortBy('title')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                sortBy === 'title'
                  ? 'bg-primary text-white'
                  : 'bg-dark-light text-gray-400 hover:bg-dark-lighter'
              }`}
            >
              {t('favorites.movieTitle')}
            </button>
          </div>
        </div>

        {/* Grid de películas */}
        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {sortedMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-light rounded-2xl p-16 text-center border border-dark-lighter">
            <Heart className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('favorites.empty')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('favorites.emptyDescription')}
            </p>
            <a
              href="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-lg transition-colors"
            >
              {t('favorites.explore')}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;

