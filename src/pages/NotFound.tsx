import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Film } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        {/* Número 404 animado */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Film className="w-6 h-6" />
            <span className="text-xl">Película no encontrada</span>
            <Film className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Mensaje */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Oops! Esta página se perdió en el cine
          </h2>
          <p className="text-gray-400 text-lg">
            Parece que la página que buscas no existe o fue movida a otra sala.
          </p>
        </motion.div>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>
          <Link
            to="/search"
            className="bg-dark-light hover:bg-dark-lighter text-white font-bold px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-colors border border-dark-lighter"
          >
            <Search className="w-5 h-5" />
            Buscar Películas
          </Link>
        </motion.div>

        {/* Decoración */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16"
        >
          <p className="text-gray-600 text-sm">
            🎬 🍿 🎥 🎞️ 📽️
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;

