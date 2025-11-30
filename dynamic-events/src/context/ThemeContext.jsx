import { createContext, useContext, useState, useEffect } from 'react';

// Importar estilos de temas
import '../styles/themes/christmas.css';
import '../styles/themes/halloween.css';
import '../styles/themes/vacation.css';

const ThemeContext = createContext();

/**
 * ThemeProvider - Proveedor de contexto para el sistema de temas
 * Maneja el tema actual y permite cambiarlo
 */
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Obtener tema guardado en localStorage o usar 'christmas' por defecto
    const savedTheme = localStorage.getItem('selectedTheme');
    return savedTheme || 'christmas';
  });

  useEffect(() => {
    // Guardar tema en localStorage
    localStorage.setItem('selectedTheme', currentTheme);
    
    // Aplicar clase al body para estilos temáticos
    // Remover clases de otros temas
    document.body.classList.remove('theme-christmas', 'theme-halloween', 'theme-vacation');
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  /**
   * Cambia el tema actual
   */
  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
  };

  const value = {
    currentTheme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook para usar el contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

