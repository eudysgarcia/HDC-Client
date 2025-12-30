import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SortAsc, Filter } from 'lucide-react';
import { jikanService, JikanAnime } from '../services/jikanService';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Géneros REALES de Anime según MyAnimeList
const ANIME_GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 24, name: 'Sci-Fi' },
  { id: 22, name: 'Romance' },
  { id: 7, name: 'Mystery' },
  { id: 18, name: 'Mecha' },
  { id: 36, name: 'Slice of Life' },
  { id: 30, name: 'Sports' },
  { id: 37, name: 'Supernatural' },
  { id: 41, name: 'Suspense' },
  { id: 27, name: 'Shounen' },
  { id: 42, name: 'Seinen' },
  { id: 25, name: 'Shoujo' },
];

const Anime: React.FC = () => {
  const { t } = useTranslation();
  const [animeList, setAnimeList] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'all' | 'popular' | 'trending' | 'top_rated'>('popular');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        let response;
        
        // Si hay género seleccionado, filtrar por género
        if (selectedGenre) {
          response = await jikanService.getAnimeByGenre(selectedGenre, page);
        } else {
          // Cargar por categoría
          if (category === 'all') {
            // Cargar populares por defecto cuando es "all"
            response = await jikanService.getPopularAnime(page);
          } else if (category === 'trending') {
            // Anime de la temporada actual
            response = await jikanService.getCurrentSeasonAnime(page);
          } else if (category === 'top_rated') {
            // Top anime por rating
            response = await jikanService.getTopAnime(page);
          } else {
            // Popular por defecto
            response = await jikanService.getPopularAnime(page);
          }
        }
        
        setAnimeList(response.data);
        setTotalPages(response.pagination.last_visible_page);
      } catch (error) {
        console.error('Error al cargar anime:', error);
        setAnimeList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [category, page, selectedGenre]);

  // Componente de tarjeta de anime
  const AnimeCard: React.FC<{ anime: JikanAnime; index: number }> = ({ anime, index }) => (
    <Link to={`/anime/${anime.mal_id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        className="group relative cursor-pointer"
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-dark-lighter shadow-lg">
          <img
            src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay en hover - igual que películas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 pointer-events-none">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary via-pink-500 to-purple-500 text-white px-2 py-2 rounded-full font-bold flex items-center gap-2 shadow-2xl">
                <Sparkles className="w-3 h-3 fill-white" />
                <span className="text-sm">{t('common.viewDetails')}</span>
              </div>
            </div>
          </div>

          {/* Rating badge */}
          {anime.score && (
            <div className="absolute top-3 right-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-lg border-2 border-yellow-300/50">
              <Star className="w-4 h-4 text-black fill-black" />
              <span className="text-black text-sm font-black">
                {anime.score.toFixed(1)}
              </span>
            </div>
          )}

          {/* Type badge */}
          {anime.type && (
            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
              <span className="text-white text-xs font-bold uppercase">
                {anime.type}
              </span>
            </div>
          )}
        </div>

        {/* Título fuera de la imagen */}
        <div className="mt-3 space-y-1">
          <h3 className="text-white font-bold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {anime.title}
          </h3>
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-400 font-medium">
              {anime.year || anime.aired?.from?.split('-')[0] || 'N/A'}
            </p>
            {anime.episodes && (
              <p className="text-gray-400 font-medium">
                {anime.episodes} eps
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );

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
            <Sparkles className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-primary via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {t('anime.title')}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {t('anime.subtitle')}
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-dark-light rounded-2xl p-4 md:p-6 mb-8 border border-dark-lighter space-y-4">
          {/* Categorías */}
          <div>
            <div className="flex items-center gap-2 md:gap-4 mb-3">
              <SortAsc className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold text-sm md:text-base">{t('anime.category')}</span>
            </div>
            
            {/* Mobile: Dropdown */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as 'all' | 'popular' | 'trending' | 'top_rated');
                setPage(1);
              }}
              className="md:hidden w-full bg-dark-lighter text-white px-4 py-2 rounded-lg border border-dark-lighter focus:border-primary focus:outline-none"
            >
              <option value="all">{t('anime.all')}</option>
              <option value="popular">{t('anime.popular')}</option>
              <option value="trending">{t('anime.trending')}</option>
              <option value="top_rated">{t('anime.topRated')}</option>
            </select>
            
            {/* Desktop: Buttons */}
            <div className="hidden md:flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setCategory('all');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  category === 'all'
                    ? 'bg-gradient-to-r from-primary via-pink-500 to-purple-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                {t('anime.all')}
              </button>
              <button
                onClick={() => {
                  setCategory('popular');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  category === 'popular'
                    ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                {t('anime.popular')}
              </button>
              <button
                onClick={() => {
                  setCategory('trending');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  category === 'trending'
                    ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                {t('anime.trending')}
              </button>
              <button
                onClick={() => {
                  setCategory('top_rated');
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  category === 'top_rated'
                    ? 'bg-gradient-to-r from-primary to-pink-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                {t('anime.topRated')}
              </button>
            </div>
          </div>

          {/* Géneros */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold text-sm md:text-base">{t('anime.genre')}</span>
            </div>
            
            {/* Mobile: Dropdown */}
            <select
              value={selectedGenre || ''}
              onChange={(e) => setSelectedGenre(e.target.value ? parseInt(e.target.value) : null)}
              className="md:hidden w-full bg-dark-lighter text-white px-4 py-2 rounded-lg border border-dark-lighter focus:border-primary focus:outline-none"
            >
              <option value="">{t('anime.allGenres')}</option>
              {ANIME_GENRES.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            
            {/* Desktop: Buttons */}
            <div className="hidden md:flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedGenre(null)}
                className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  selectedGenre === null
                    ? 'bg-gradient-to-r from-primary via-pink-500 to-purple-500 text-white shadow-lg shadow-primary/50'
                    : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                }`}
              >
                {t('anime.all')}
              </button>
              {ANIME_GENRES.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                    selectedGenre === genre.id
                      ? 'bg-gradient-to-r from-primary via-pink-500 to-purple-500 text-white shadow-lg shadow-primary/50'
                      : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de anime */}
        {animeList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {animeList.map((anime, index) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-dark-light rounded-2xl p-16 text-center border border-dark-lighter">
            <Sparkles className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('anime.noAnimeFound')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('anime.tryOtherCategory')}
            </p>
            <button
              onClick={() => {
                setCategory('popular');
                setSelectedGenre(null);
                setPage(1);
              }}
              className="inline-block bg-gradient-to-r from-primary via-pink-500 to-purple-500 hover:from-primary-dark hover:to-purple-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg shadow-primary/50"
            >
              {t('anime.viewAll')}
            </button>
          </div>
        )}

        {/* Paginación con números */}
        <div className="mt-12 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`w-12 h-12 rounded-lg font-bold transition-all ${
                page === pageNum
                  ? 'bg-gradient-to-r from-primary via-pink-500 to-purple-500 text-white shadow-lg shadow-primary/50'
                  : 'bg-dark-lighter text-gray-400 hover:bg-dark hover:text-white'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 via-pink-500/10 to-purple-500/10 rounded-2xl p-8 border border-primary/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            {t('anime.aboutCollection')}
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {t('anime.aboutDescription')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Anime;
