import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import Movies from './pages/Movies';
import Trending from './pages/Trending';
import TVShows from './pages/TVShows';
import TVShowDetail from './pages/TVShowDetail';
import Anime from './pages/Anime';
import AnimeDetail from './pages/AnimeDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <ScrollToTop />
          <div className="App flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/tv-shows" element={<TVShows />} />
              <Route path="/tv/:id" element={<TVShowDetail />} />
              <Route path="/anime" element={<Anime />} />
              <Route path="/anime/:id" element={<AnimeDetail />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

