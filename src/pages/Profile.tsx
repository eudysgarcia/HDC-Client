import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, Film, Heart, List as ListIcon, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { movieService } from '../services/movieService';
import { Movie } from '../types/movie.types';
import MovieCard from '../components/MovieCard';
import Loading from '../components/Loading';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

const Profile: React.FC = () => {
  const { user: authUser, updateUser: updateAuthUser } = useAuth();
  const { toast, hideToast, success, error, warning } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // Profile completo del usuario
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [profileData, setProfileData] = useState({
    name: authUser?.name || '',
    bio: authUser?.bio || '',
    avatar: authUser?.avatar || '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profile = await userService.getProfile();
        setUser(profile); // Guardar el perfil completo
        
        // Actualizar datos del formulario
        setProfileData({
          name: profile.name,
          bio: profile.bio || '',
          avatar: profile.avatar || '',
        });
        
        // Cargar películas favoritas
        const favMovies = await Promise.all(
          profile.favoriteMovies.slice(0, 6).map(id => movieService.getMovieDetails(id))
        );
        setFavoriteMovies(favMovies);

        // Cargar watchlist
        const watchMovies = await Promise.all(
          profile.watchlist.slice(0, 6).map(id => movieService.getMovieDetails(id))
        );
        setWatchlistMovies(watchMovies);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const updatedProfile = await userService.updateProfile(profileData);
      setUser(updatedProfile); // Actualizar el perfil local
      
      // ✅ ACTUALIZAR EL AUTHCONTEXT para que se refleje en el navbar
      updateAuthUser({
        name: updatedProfile.name,
        avatar: updatedProfile.avatar,
        bio: updatedProfile.bio,
      });
      
      setIsEditing(false);
      success('Perfil actualizado exitosamente');
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      
      // Manejar errores específicos
      if (error.response?.status === 413) {
        error('La imagen es muy grande. Por favor usa una imagen más pequeña o comprímela. Máximo recomendado: 2MB');
      } else {
        const errorMsg = error.response?.data?.message || error.message || 'Error al actualizar el perfil';
        error(errorMsg);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toast {...toast} onClose={hideToast} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-dark pt-20 pb-12"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header del perfil */}
        <div className="bg-dark-light rounded-2xl p-8 mb-8 border border-dark-lighter">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-32 h-32 rounded-full border-4 border-primary object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full">
                <Film className="w-6 h-6" />
              </div>
            </div>

            {/* Información */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2">
                      🖼️ Cambiar Avatar
                    </label>
                    <div className="space-y-3">
                      {/* Vista previa */}
                      {profileData.avatar && (
                        <div className="flex items-center justify-center">
                          <img 
                            src={profileData.avatar} 
                            alt="Preview" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Selector de archivo */}
                      <div className="bg-dark-lighter p-4 rounded-lg border-2 border-dashed border-dark text-center">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validar tamaño (máximo 2MB)
                              if (file.size > 2 * 1024 * 1024) {
                                warning('La imagen es muy grande. Máximo 2MB permitido.');
                                return;
                              }

                              // Convertir imagen a base64
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfileData({ ...profileData, avatar: reader.result as string });
                                success('Imagen cargada correctamente');
                              };
                              reader.onerror = () => {
                                error('Error al cargar la imagen. Intenta con otra.');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id="avatar-upload"
                        />
                        <label 
                          htmlFor="avatar-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <div className="bg-primary/20 p-4 rounded-full">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-primary font-semibold">Click para seleccionar imagen</span>
                          <span className="text-gray-500 text-xs">JPG, PNG, GIF, WebP (máx. 2MB)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full bg-dark text-white text-2xl font-bold px-4 py-2 rounded-lg border border-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Cuéntanos sobre ti..."
                    rows={3}
                    className="w-full bg-dark text-white px-4 py-2 rounded-lg border border-dark-lighter focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Guardar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-gray-400 mb-4">{user?.bio || 'Amante del cine 🎬'}</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-primary" />
                      {user?.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-primary" />
                      Miembro desde {new Date(user?.createdAt || '').toLocaleDateString()}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="bg-dark p-4 rounded-lg border border-dark-lighter">
                  <Film className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{user?.watchedMovies?.length || 0}</p>
                  <p className="text-xs text-gray-400">Vistas</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-dark p-4 rounded-lg border border-dark-lighter">
                  <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{user?.favoriteMovies?.length || 0}</p>
                  <p className="text-xs text-gray-400">Favoritas</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-dark p-4 rounded-lg border border-dark-lighter">
                  <ListIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{user?.watchlist?.length || 0}</p>
                  <p className="text-xs text-gray-400">Mi Lista</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Películas Favoritas */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Películas Favoritas
            </h2>
            <a href="/favorites" className="text-primary hover:text-primary-dark transition-colors">
              Ver todas →
            </a>
          </div>
          {favoriteMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoriteMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-light rounded-lg p-12 text-center border border-dark-lighter">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aún no tienes películas favoritas</p>
            </div>
          )}
        </div>

        {/* Mi Lista */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ListIcon className="w-6 h-6 text-primary" />
              Mi Lista
            </h2>
            <a href="/watchlist" className="text-primary hover:text-primary-dark transition-colors">
              Ver todas →
            </a>
          </div>
          {watchlistMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlistMovies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-light rounded-lg p-12 text-center border border-dark-lighter">
              <ListIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Tu lista está vacía</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Profile;

