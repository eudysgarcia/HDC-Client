import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, PlayCircle, ArrowLeft, TrendingUp, Users } from 'lucide-react';
import { jikanService, JikanAnime } from '../services/jikanService';
import { reviewService } from '../services/reviewService';
import { Review } from '../types/review.types';
import Loading from '../components/Loading';
import TrailerModal from '../components/TrailerModal';
import ReviewSection from '../components/ReviewSection';
import { useTranslation } from 'react-i18next';
import { translateText } from '../services/translationService';

const AnimeDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [anime, setAnime] = useState<JikanAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

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
    const fetchAnimeData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await jikanService.getAnimeById(parseInt(id));
        let animeData = response.data;

        // Traducir sinopsis si el idioma no es inglés
        const currentLang = localStorage.getItem('language') || 'en';
        if (currentLang !== 'en' && animeData.synopsis) {
          const translatedSynopsis = await translateText(animeData.synopsis, currentLang);
          animeData = { ...animeData, synopsis: translatedSynopsis };
        }

        setAnime(animeData);

        // Cargar reviews
        await fetchReviews();

        // Cargar recomendaciones
        try {
          const recsResponse = await jikanService.getAnimeRecommendations(parseInt(id));
          setRecommendations(recsResponse.data?.slice(0, 12) || []);
        } catch (error) {
          console.error('Error al cargar recomendaciones:', error);
        }
      } catch (error) {
        console.error('Error al cargar anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">{t('anime.animeNotFound')}</h2>
          <button
            onClick={() => navigate('/anime')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg"
          >
            {t('anime.backToAnime')}
          </button>
        </div>
      </div>
    );
  }

  const youtubeKey = anime.trailer?.youtube_id;

  return (
    <div className="min-h-screen bg-dark pt-16">
      {/* Hero Section */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover object-center blur-xl opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
        
        <div className="relative h-full max-w-7xl mx-auto px-4 py-20 flex items-end">
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <img
                src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-64 h-96 object-cover rounded-2xl shadow-2xl border-4 border-primary/50"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-grow space-y-4"
            >
              <button
                onClick={() => navigate('/anime')}
                className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('anime.backToAnime')}
              </button>

              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl">
                {anime.title}
              </h1>
              
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-xl text-gray-300">{anime.title_english}</p>
              )}

              <div className="flex flex-wrap gap-4 items-center">
                {anime.score && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 rounded-full shadow-lg">
                    <Star className="w-5 h-5 fill-yellow-900 text-yellow-900" />
                    <span className="text-black font-bold text-lg">{anime.score.toFixed(1)}</span>
                  </div>
                )}
                {anime.rank && (
                  <div className="flex items-center gap-2 bg-primary/90 px-4 py-2 rounded-full">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-white font-bold">#{anime.rank}</span>
                  </div>
                )}
                {anime.year && (
                  <span className="text-white bg-dark-light/80 px-4 py-2 rounded-full font-semibold">
                    {anime.year}
                  </span>
                )}
                {anime.type && (
                  <span className="text-white bg-dark-light/80 px-4 py-2 rounded-full font-semibold">
                    {anime.type}
                  </span>
                )}
                {anime.episodes && (
                  <div className="flex items-center gap-2 text-white bg-dark-light/80 px-4 py-2 rounded-full">
                    <PlayCircle className="w-5 h-5" />
                    <span className="font-semibold">{anime.episodes} eps</span>
                  </div>
                )}
              </div>

              {/* Géneros */}
              <div className="flex flex-wrap gap-2">
                {anime.genres.map(genre => (
                  <span
                    key={genre.mal_id}
                    className="bg-gradient-to-r from-primary to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Botón de trailer */}
              {youtubeKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg"
                >
                  <PlayCircle className="w-6 h-6" />
                  {t('anime.viewTrailer')}
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Synopsis */}
        <div className="bg-dark-light rounded-2xl p-8 border border-dark-lighter">
          <h2 className="text-3xl font-bold text-white mb-4">{t('anime.synopsis')}</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {anime.synopsis || t('anime.noSynopsis')}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-dark-light rounded-xl p-6 border border-dark-lighter text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{anime.score || 'N/A'}</p>
            <p className="text-gray-400">{t('anime.rating')}</p>
          </div>
          <div className="bg-dark-light rounded-xl p-6 border border-dark-lighter text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{anime.members?.toLocaleString() || 'N/A'}</p>
            <p className="text-gray-400">{t('anime.members')}</p>
          </div>
          <div className="bg-dark-light rounded-xl p-6 border border-dark-lighter text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">#{anime.popularity || 'N/A'}</p>
            <p className="text-gray-400">{t('anime.popularity')}</p>
          </div>
          <div className="bg-dark-light rounded-xl p-6 border border-dark-lighter text-center">
            <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{anime.status || 'N/A'}</p>
            <p className="text-gray-400">{t('anime.status')}</p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-dark-light rounded-2xl p-8 border border-dark-lighter">
          <h2 className="text-2xl font-bold text-white mb-6">{t('anime.information')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            {anime.studios.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm">{t('anime.studio')}</p>
                <p className="text-white font-semibold">
                  {anime.studios.map(s => s.name).join(', ')}
                </p>
              </div>
            )}
            {anime.source && (
              <div>
                <p className="text-gray-400 text-sm">{t('anime.source')}</p>
                <p className="text-white font-semibold">{anime.source}</p>
              </div>
            )}
            {anime.duration && (
              <div>
                <p className="text-gray-400 text-sm">{t('anime.duration')}</p>
                <p className="text-white font-semibold">{anime.duration}</p>
              </div>
            )}
            {anime.rating && (
              <div>
                <p className="text-gray-400 text-sm">{t('anime.classification')}</p>
                <p className="text-white font-semibold">{anime.rating}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reseñas */}
        <div className="bg-dark-light rounded-2xl p-8 border border-dark-lighter">
          <ReviewSection
            movieId={parseInt(id!)}
            movieTitle={anime?.title || 'Anime'}
            reviews={reviews}
            onReviewAdded={fetchReviews}
          />
        </div>

        {/* Recomendaciones */}
        {recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{t('anime.recommendations')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((rec, index) => (
                <motion.a
                  key={index}
                  href={`/anime/${rec.entry.mal_id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={rec.entry.images.webp.large_image_url || rec.entry.images.jpg.large_image_url}
                      alt={rec.entry.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="text-white text-sm mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {rec.entry.title}
                  </h3>
                </motion.a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {youtubeKey && anime && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailerKey={youtubeKey}
          title={anime.title_english || anime.title}
        />
      )}
    </div>
  );
};

export default AnimeDetail;

