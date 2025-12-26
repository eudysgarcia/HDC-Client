import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { movieService } from '../services/movieService';
import { Movie } from '../types/movie.types';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [searchParams]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const results = await movieService.search(searchQuery);
      setMovies(results.results);
    } catch (error) {
      console.error('Error al buscar películas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <div className="min-h-screen bg-dark pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Barra de búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Buscar Películas
          </h1>
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Busca por título, actor, director..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-dark-lighter text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </motion.div>

        {/* Resultados */}
        {loading ? (
          <Loading />
        ) : searched ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-white mb-6"
            >
              {movies.length > 0
                ? `Encontrados ${movies.length} resultados para "${searchParams.get('q')}"`
                : `No se encontraron resultados para "${searchParams.get('q')}"`}
            </motion.h2>

            {movies.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie, index) => (
                  <MovieCard key={movie.id} movie={movie} index={index} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <p className="text-gray-400 text-lg">
              Busca tus películas favoritas por título, actor o director
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

