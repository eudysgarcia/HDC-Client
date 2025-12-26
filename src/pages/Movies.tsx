import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc, Grid3x3, LayoutGrid } from 'lucide-react';
import { movieService } from '../services/movieService';
import { Movie, Genre } from '../types/movie.types';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'release'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesData, genresData] = await Promise.all([
          movieService.getPopular(page),
          movieService.getGenres(),
        ]);
        setMovies(moviesData.results);
        setGenres(genresData.genres);
      } catch (error) {
        console.error('Error al cargar películas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const filteredMovies = movies
    .filter(movie => selectedGenre === null || movie.genre_ids?.includes(selectedGenre))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.vote_average - a.vote_average;
        case 'release':
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        default:
          return b.popularity - a.popularity;
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
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-primary to-red-500 bg-clip-text text-transparent">
            Catálogo de Películas
          </h1>
          <p className="text-gray-400 text-lg">
            Explora nuestra colección completa de películas
          </p>
        </div>

        {/* Filtros y Controles */}
        <div className="bg-dark-light rounded-2xl p-6 mb-8 border border-dark-lighter">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Ordenamiento */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SortAsc className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400 font-semibold">Ordenar:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('popularity')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    sortBy === 'popularity'
                      ? 'bg-primary text-white shadow-lg shadow-primary/50'
                      : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  Populares
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    sortBy === 'rating'
                      ? 'bg-primary text-white shadow-lg shadow-primary/50'
                      : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  Mejor Valoradas
                </button>
                <button
                  onClick={() => setSortBy('release')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    sortBy === 'release'
                      ? 'bg-primary text-white shadow-lg shadow-primary/50'
                      : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  Más Recientes
                </button>
              </div>
            </div>

            {/* Vista */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'large'
                    ? 'bg-primary text-white'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Géneros */}
          <div className="mt-6 pt-6 border-t border-dark-lighter">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold">Géneros:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedGenre === null
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                Todos
              </button>
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedGenre === genre.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/50'
                      : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de películas */}
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredMovies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>

        {/* Paginación con números */}
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-12 h-12 rounded-lg font-bold transition-all ${
                page === pageNum
                  ? 'bg-gradient-to-r from-primary to-red-600 text-white shadow-lg shadow-primary/50'
                  : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Movies;

