import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Star } from 'lucide-react';
import { Movie } from '../types/movie.types';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  movie: Movie;
}

const HeroSection: React.FC<HeroSectionProps> = ({ movie }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const placeholderImage = 'https://via.placeholder.com/1920x1080/1f1f1f/666666?text=Hablemos de Cine';

  useEffect(() => {
    if (movie.backdrop_path) {
      const img = new Image();
      img.src = movie.backdrop_path;
      img.onload = () => setImageLoaded(true);
    }
  }, [movie.backdrop_path]);

  return (
    <div className="relative h-[85vh] md:h-[90vh] w-full overflow-hidden mt-16">
      {/* Imagen de fondo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}` || placeholderImage}
          alt={movie.title}
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Gradientes más suaves para mejor visibilidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-transparent" />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center"
      >
        <div className="max-w-3xl space-y-6">
          {/* Título con mejor espaciado */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 text-shadow drop-shadow-2xl"
          >
            {movie.title}
          </motion.h1>

          {/* Metadatos con mejor espaciado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 rounded-full shadow-lg">
              <Star className="w-5 h-5 fill-yellow-900 text-yellow-900" />
              <span className="text-black font-bold text-lg">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="text-white text-lg font-semibold bg-dark-light/80 px-4 py-2 rounded-full backdrop-blur-sm">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </span>
            <span className="text-gray-300 text-base bg-dark-light/60 px-4 py-2 rounded-full backdrop-blur-sm">
              {movie.vote_count.toLocaleString()} votos
            </span>
          </motion.div>

          {/* Sinopsis con mejor line-height y espaciado */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-100 text-lg md:text-xl leading-relaxed mb-8 line-clamp-3 text-shadow drop-shadow-lg max-w-2xl"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
          >
            {movie.overview || 'Sin descripción disponible.'}
          </motion.p>

          {/* Botones de acción con mejor diseño */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link to={`/movie/${movie.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary to-red-700 hover:from-primary-dark hover:to-red-800 text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 transition-all shadow-2xl shadow-primary/50"
              >
                <Play className="w-6 h-6 fill-white" />
                <span className="text-lg">Ver Detalles</span>
              </motion.button>
            </Link>
            <Link to={`/movie/${movie.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 transition-all border border-white/30"
              >
                <Info className="w-6 h-6" />
                <span className="text-lg">Más Información</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;

