import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Star,
  Tv,
  Globe,
  Info,
  Users,
  Film,
  ArrowLeft,
} from 'lucide-react';
import { tvmazeService } from '../services/tvmazeService';
import { TVShow, Episode, Cast, Season } from '../types/tvmaze.types';
import ReviewSection from '../components/ReviewSection';
import Loading from '../components/Loading';

const TVShowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<TVShow | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'episodes' | 'cast'>('info');
  const [reviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchShowData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const showId = parseInt(id);

        const [showData, episodesData, castData, seasonsData] = await Promise.all([
          tvmazeService.getShowById(showId),
          tvmazeService.getShowEpisodes(showId),
          tvmazeService.getShowCast(showId),
          tvmazeService.getShowSeasons(showId),
        ]);

        setShow(showData);
        setEpisodes(episodesData);
        setCast(castData);
        setSeasons(seasonsData);
      } catch (error) {
        console.error('Error al cargar detalles de la serie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowData();
  }, [id]);

  const stripHtml = (html: string | null) => {
    if (!html) return 'Sin descripción disponible';
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return <Loading />;
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Serie no encontrada</h2>
          <button
            onClick={() => navigate('/tv-shows')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver a Series
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark"
    >
      {/* Hero Banner - Igual que películas */}
      <div className="relative h-[80vh] w-full mt-16">
        <img
          src={show.image?.original || 'https://via.placeholder.com/1920x1080/1f1f1f/666666'}
          alt={show.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />

        {/* Botón volver */}
            <button
              onClick={() => navigate('/tv-shows')}
          className="absolute top-20 left-4 md:left-8 bg-black/50 backdrop-blur-sm hover:bg-black/80 text-white p-3 rounded-full transition-colors"
            >
          <ArrowLeft className="w-6 h-6" />
            </button>

        {/* Contenido */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow">
              {show.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {show.rating.average && (
                <div className="flex items-center space-x-1 bg-yellow-500 px-3 py-1 rounded-lg">
                  <Star className="w-5 h-5 fill-yellow-500 text-black" />
                  <span className="text-black font-bold text-lg">
                    {show.rating.average.toFixed(1)}
                  </span>
                </div>
              )}
              {show.runtime && (
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-5 h-5" />
                  <span>{show.runtime} min</span>
                </div>
              )}
              {show.premiered && (
                <div className="flex items-center space-x-2 text-white">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(show.premiered).getFullYear()}</span>
                </div>
              )}
              {show.status && (
                <div className="flex items-center space-x-2 text-white">
                  <Tv className="w-5 h-5" />
                  <span>{show.status === 'Running' ? '🔴 En Emisión' : 'Finalizada'}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {show.genres.map(genre => (
                <span
                  key={genre}
                  className="bg-primary/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-dark-lighter">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'info'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Info className="w-5 h-5 inline mr-2" />
            Información
          </button>
          <button
            onClick={() => setActiveTab('episodes')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'episodes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-5 h-5 inline mr-2" />
            Episodios ({episodes.length})
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`pb-4 px-6 font-semibold transition-all ${
              activeTab === 'cast'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Elenco
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Información */}
          {activeTab === 'info' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-dark-light rounded-2xl p-6 border border-dark-lighter">
                <h2 className="text-2xl font-bold text-white mb-4">Sinopsis</h2>
                <p className="text-gray-300 leading-relaxed">{stripHtml(show.summary)}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-dark-light rounded-2xl p-6 border border-dark-lighter">
                  <h3 className="text-xl font-bold text-white mb-4">Detalles</h3>
                  <div className="space-y-3 text-gray-300">
                    {show.network && (
                      <div>
                        <span className="text-gray-400">Cadena:</span>{' '}
                        <span className="text-white">{show.network.name}</span>
                      </div>
                    )}
                    {show.webChannel && (
                      <div>
                        <span className="text-gray-400">Plataforma:</span>{' '}
                        <span className="text-white">{show.webChannel.name}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Idioma:</span>{' '}
                      <span className="text-white">{show.language}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Tipo:</span>{' '}
                      <span className="text-white">{show.type}</span>
                    </div>
                    {show.schedule.days.length > 0 && (
                      <div>
                        <span className="text-gray-400">Días:</span>{' '}
                        <span className="text-white">{show.schedule.days.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-dark-light rounded-2xl p-6 border border-dark-lighter">
                  <h3 className="text-xl font-bold text-white mb-4">Temporadas</h3>
                  <div className="space-y-2">
                    {seasons.map(season => (
                      <div
                        key={season.id}
                        className="flex justify-between items-center text-gray-300"
                      >
                        <span>Temporada {season.number}</span>
                        <span className="text-gray-400">{season.episodeOrder} episodios</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {show.officialSite && (
                <div className="text-center">
                  <a
                    href={show.officialSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    Sitio Oficial
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* Episodios */}
          {activeTab === 'episodes' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {episodes.map(episode => (
                <div
                  key={episode.id}
                  className="bg-dark-light rounded-lg p-6 border border-dark-lighter hover:border-primary transition-colors"
                >
                  <div className="flex gap-4">
                    {episode.image && (
                      <img
                        src={episode.image.medium}
                        alt={episode.name}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="text-white font-bold mb-2">
                        {episode.season}x{episode.number.toString().padStart(2, '0')} -{' '}
                        {episode.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {stripHtml(episode.summary).substring(0, 200)}...
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{episode.airdate}</span>
                        {episode.runtime && <span>{episode.runtime} min</span>}
                        {episode.rating.average && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            {episode.rating.average}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Elenco */}
          {activeTab === 'cast' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >
              {cast.map(member => (
                <div
                  key={member.person.id}
                  className="bg-dark-light rounded-lg overflow-hidden border border-dark-lighter hover:border-primary transition-colors"
                >
                  <img
                    src={
                      member.person.image?.medium ||
                      'https://via.placeholder.com/210x295/1f1f1f/666666?text=Sin+Foto'
                    }
                    alt={member.person.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {member.person.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{member.character.name}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sección de Reseñas */}
        <div className="mt-12">
          <ReviewSection
            movieId={show.id}
            movieTitle={show.name}
            reviews={reviews}
            onReviewAdded={() => {
              // Recargar reviews si es necesario
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TVShowDetail;

