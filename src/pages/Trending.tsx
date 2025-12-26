import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import { movieService } from '../services/movieService';
import { Movie } from '../types/movie.types';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const Trending: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('week');

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const data = await movieService.getTrending();
        setMovies(data.results);
      } catch (error) {
        console.error('Error al cargar tendencias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [timeWindow]);

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
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Tendencias
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Las películas más populares del momento
          </p>
        </div>

        {/* Controles */}
        <div className="bg-dark-light rounded-2xl p-6 mb-8 border border-dark-lighter">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 font-semibold">Periodo:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeWindow('day')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  timeWindow === 'day'
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setTimeWindow('week')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  timeWindow === 'week'
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                Esta Semana
              </button>
            </div>
          </div>
        </div>

        {/* Grid de películas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative">
              {/* Badge de posición */}
              {index < 10 && (
                <div className="absolute top-2 left-2 z-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-black font-bold text-xl w-10 h-10 rounded-full flex items-center justify-center shadow-2xl border-2 border-yellow-300">
                  {index + 1}
                </div>
              )}
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>

        {/* Estadísticas */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-light rounded-2xl p-6 border border-dark-lighter text-center">
            <div className="text-4xl font-bold text-primary mb-2">{movies.length}</div>
            <div className="text-gray-400">Películas en Tendencia</div>
          </div>
          <div className="bg-dark-light rounded-2xl p-6 border border-dark-lighter text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {movies[0]?.vote_average.toFixed(1) || '0.0'}
            </div>
            <div className="text-gray-400">Calificación Promedio</div>
          </div>
          <div className="bg-dark-light rounded-2xl p-6 border border-dark-lighter text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {new Date().getFullYear()}
            </div>
            <div className="text-gray-400">Año Actual</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Trending;

