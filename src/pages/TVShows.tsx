import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tv, SortAsc, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tvmazeService } from '../services/tvmazeService';
import { TVShow } from '../types/tvmaze.types';
import Loading from '../components/Loading';

// Géneros comunes de series de TV
const TV_GENRES = [
  'Drama',
  'Comedy',
  'Action',
  'Thriller',
  'Horror',
  'Science-Fiction',
  'Fantasy',
  'Crime',
  'Mystery',
  'Romance',
  'Adventure',
  'Anime',
  'Family',
  'Documentary',
];

const TVShows: React.FC = () => {
  const navigate = useNavigate();
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'popular' | 'top_rated' | 'active'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        setLoading(true);
        let data: TVShow[] = [];

        if (category === 'all') {
          // Cargar múltiples páginas para tener más variedad
          const [page0, page1, page2] = await Promise.all([
            tvmazeService.getShowsByPage(0),
            tvmazeService.getShowsByPage(1),
            tvmazeService.getShowsByPage(2),
          ]);
          data = [...page0, ...page1, ...page2];
        } else {
          switch (category) {
            case 'popular':
              data = await tvmazeService.getPopularShows(100);
              break;
            case 'top_rated':
              data = await tvmazeService.getTopRatedShows(100);
              break;
            case 'active':
              data = await tvmazeService.getActiveShows(100);
              break;
            default:
              data = await tvmazeService.getShowsByPage(page);
          }
        }

        setTVShows(data);
      } catch (error) {
        console.error('Error al cargar series:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTVShows();
  }, [category, page]);

  const filteredShows = selectedGenre
    ? tvShows.filter(show => show.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase()))
    : tvShows;

  const handleShowClick = (showId: number) => {
    navigate(`/tv/${showId}`);
  };

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
            <Tv className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Series de TV
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Las mejores series y programas de televisión
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-dark-light rounded-2xl p-6 mb-8 border border-dark-lighter space-y-6">
          {/* Categorías */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <SortAsc className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold">Categoría:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setCategory('all');
                  setPage(0);
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  category === 'all'
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                ⭐ Todos
              </button>
              <button
                onClick={() => {
                  setCategory('popular');
                  setPage(0);
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  category === 'popular'
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                📺 Populares
              </button>
              <button
                onClick={() => {
                  setCategory('top_rated');
                  setPage(0);
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  category === 'top_rated'
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                🏆 Mejor Valoradas
              </button>
              <button
                onClick={() => {
                  setCategory('active');
                  setPage(0);
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  category === 'active'
                    ? 'bg-primary text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                🔴 En Emisión
              </button>
            </div>
          </div>

          {/* Géneros */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold">Filtrar por género:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedGenre === null
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                Todos
              </button>
              {TV_GENRES.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/50'
                      : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de series */}
        {filteredShows.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleShowClick(show.id)}
                className="relative group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={show.image?.medium || 'https://via.placeholder.com/210x295/1f1f1f/666666?text=Sin+Imagen'}
                    alt={show.name}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm mb-1">{show.name}</h3>
                      {show.rating.average && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white text-sm">{show.rating.average.toFixed(1)}</span>
                        </div>
                      )}
                      {show.genres.length > 0 && (
                        <p className="text-gray-300 text-xs mt-1">
                          {show.genres.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {show.status === 'Running' && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    EN VIVO
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-dark-light rounded-2xl p-16 text-center border border-dark-lighter">
            <Tv className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              No se encontraron series
            </h2>
            <p className="text-gray-400 mb-8">
              Intenta con otra categoría o género
            </p>
          </div>
        )}

        {/* Paginación */}
        {category === 'all' && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: 10 }, (_, i) => i).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-12 h-12 rounded-lg font-bold transition-all ${
                  page === pageNum
                    ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                {pageNum + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TVShows;
