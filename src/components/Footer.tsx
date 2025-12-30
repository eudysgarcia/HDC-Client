import React from 'react';
import { Film, Github, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-light border-t border-dark-lighter mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-white">
                Hablemos de <span className="text-primary">Cine</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.movies')}
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.trending')}
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.search')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.myAccount')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.profile')}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.favorites')}
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.myList')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-dark-lighter mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} XEYA. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

