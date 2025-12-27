import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que hace scroll to top cuando cambia la ruta
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Hacer scroll al top instantáneamente al cambiar de ruta
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;


