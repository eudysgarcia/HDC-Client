import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Film, User, LogOut, Heart, List, Menu, X, Home, Tv, Sparkles, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowMobileMenu(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/95 backdrop-blur-sm border-b border-dark-lighter">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Film className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">
              Hablemos de <span className="text-primary">Cine</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link
              to="/"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/movies"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Películas
            </Link>
            <Link
              to="/tv-shows"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Series
            </Link>
            <Link
              to="/anime"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Anime
            </Link>
            <Link
              to="/trending"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Tendencias
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar películas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-lighter text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=dc2626&color=fff&size=128`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-primary object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=dc2626&color=fff&size=128`;
                    }}
                  />
                  <span>{user?.name}</span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-light rounded-lg shadow-xl border border-dark-lighter overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors flex items-center space-x-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Perfil</span>
                      </Link>
                      <Link
                        to="/favorites"
                        className="block px-4 py-3 text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors flex items-center space-x-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Heart className="w-4 h-4" />
                        <span>Favoritos</span>
                      </Link>
                      <Link
                        to="/watchlist"
                        className="block px-4 py-3 text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors flex items-center space-x-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <List className="w-4 h-4" />
                        <span>Mi Lista</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors flex items-center space-x-2 border-t border-dark-lighter"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-light border-t border-dark-lighter max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar películas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-dark-lighter text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </form>

              {/* Navigation Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
                  Explorar
                </h3>
                
                <Link
                  to="/"
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive('/') 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-semibold">Inicio</span>
                </Link>

                <Link
                  to="/movies"
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive('/movies') 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Film className="w-5 h-5" />
                  <span className="font-semibold">Películas</span>
                </Link>

                <Link
                  to="/tv-shows"
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive('/tv-shows') 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Tv className="w-5 h-5" />
                  <span className="font-semibold">Series</span>
                </Link>

                <Link
                  to="/anime"
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive('/anime') 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">Anime</span>
                </Link>

                <Link
                  to="/trending"
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive('/trending') 
                      ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                      : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">🔥 Tendencias</span>
                </Link>
              </div>

              {isAuthenticated ? (
                <>
                  {/* User Section */}
                  <div className="pt-4 border-t border-dark-lighter space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-3">
                      Mi Cuenta
                    </h3>
                    
                    <Link
                      to="/profile"
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isActive('/profile') 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-semibold">Perfil</span>
                    </Link>

                    <Link
                      to="/favorites"
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isActive('/favorites') 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold">Favoritos</span>
                    </Link>

                    <Link
                      to="/watchlist"
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isActive('/watchlist') 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                          : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
                      }`}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <List className="w-5 h-5" />
                      <span className="font-semibold">Mi Lista</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-semibold">Cerrar Sesión</span>
                    </button>
                  </div>

                  {/* User Info Card */}
                  <div className="pt-4 border-t border-dark-lighter">
                    <div className="flex items-center gap-3 px-3 py-3 bg-dark-lighter rounded-lg">
                      <img
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=dc2626&color=fff&size=128`}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{user?.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-4 border-t border-dark-lighter space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-lighter hover:text-white transition-all font-semibold"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center bg-gradient-to-r from-primary to-red-600 hover:from-primary-dark hover:to-red-700 text-white px-4 py-3 rounded-lg transition-all font-semibold shadow-lg shadow-primary/20"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

