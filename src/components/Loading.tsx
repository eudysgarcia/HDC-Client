import React from 'react';
import { Film } from 'lucide-react';
import { motion } from 'framer-motion';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="text-center"
      >
        <Film className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-white text-xl font-semibold">Cargando...</h2>
      </motion.div>
    </div>
  );
};

export default Loading;

