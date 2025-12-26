import React, { useEffect, useState } from 'react';
import { movieService } from '../services/movieService';
import { Movie, MovieResults } from '../types/movie.types';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
          movieService.getTrending(),
          movieService.getPopular(),
          movieService.getTopRated(),
          movieService.getUpcoming(),
        ]);

        setTrending(trendingRes.results);
        setPopular(popularRes.results);
        setTopRated(topRatedRes.results);
        setUpcoming(upcomingRes.results);
      } catch (err) {
        console.error('Error al cargar películas:', err);
        setError('Error al cargar las películas. Por favor intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Rotación automática del Hero cada 5 segundos
  useEffect(() => {
    if (trending.length === 0) return;
    
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(trending.length, 5));
    }, 5000);

    return () => clearInterval(interval);
  }, [trending]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const featuredMovie = trending[heroIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-dark pt-16"
    >
      {/* Hero Section con rotación automática */}
      {featuredMovie && (
        <motion.div
          key={heroIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection movie={featuredMovie} />
        </motion.div>
      )}

      {/* Movie Rows - Con espaciado adecuado */}
      <div className="relative z-10 py-16 bg-gradient-to-b from-dark via-dark to-dark-light space-y-16 px-4">
        <MovieRow title="🔥 Tendencias de la Semana" movies={trending} />
        <MovieRow title="⭐ Mejor Calificadas" movies={topRated} />
        <MovieRow title="🎬 Populares" movies={popular} />
        <MovieRow title="🎭 Próximos Estrenos" movies={upcoming} />
      </div>
    </motion.div>
  );
};

export default Home;

