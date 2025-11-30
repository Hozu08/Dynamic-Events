/**
 * Configuración de temas/épocas disponibles
 * Cada tema define colores, textos, personajes y archivos de contexto
 */
export const themes = {
  christmas: {
    id: 'christmas',
    name: 'Navidad',
    icon: '🎄',
    colors: {
      primary: '#2d5a3d',
      primaryDark: '#0b6a45',
      secondary: '#8b4513',
      accent: '#AB0000',
      accentDark: '#8B0000',
      gold: '#d4af37',
      bgLight: '#fdfdfd',
      bgPaper: '#fff6dd',
      textDark: '#2c3e50',
      textMedium: '#3b2d21',
      textLight: '#7a6750',
    },
    dataFile: 'christmas.txt',
    character: 'Santa Claus',
    greeting: '¡Ho, ho, ho!',
    welcomeMessage: '¡Bienvenido pequeño soñador y gran creador! Aquí tú y yo escribiremos juntos una historia mágica de Navidad.',
    borderDecorative: 'repeating-linear-gradient(45deg, #AB0000 0 18px, #AB0000 18px 36px, #0b6a45 36px 54px, #0b6a45 54px 72px)',
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween',
    icon: '🎃',
    colors: {
      primary: '#8B4513',
      primaryDark: '#654321',
      secondary: '#4B0082',
      accent: '#FF6B35',
      accentDark: '#D32F2F',
      gold: '#FFA500',
      bgLight: '#1a1a1a',
      bgPaper: '#2d2d2d',
      textDark: '#f5f5f5',
      textMedium: '#e0e0e0',
      textLight: '#b0b0b0',
    },
    dataFile: 'halloween.txt',
    character: 'El Narrador de Historias',
    greeting: '¡Bienvenido, valiente explorador!',
    welcomeMessage: 'En esta noche de misterio, tú y yo crearemos juntos una historia escalofriante llena de magia y sorpresas.',
    borderDecorative: 'repeating-linear-gradient(45deg, #FF6B35 0 18px, #8B4513 18px 36px, #4B0082 36px 54px, #FF6B35 54px 72px)',
  },
  vacation: {
    id: 'vacation',
    name: 'Vacaciones',
    icon: '🏖️',
    colors: {
      primary: '#006994',
      primaryDark: '#004d73',
      secondary: '#FF6B6B',
      accent: '#FFB347',
      accentDark: '#FF8C00',
      gold: '#FFD700',
      bgLight: '#f0f8ff',
      bgPaper: '#FFF8DC',
      textDark: '#2c3e50',
      textMedium: '#3b2d21',
      textLight: '#5a5a5a',
    },
    dataFile: 'vacation.txt',
    character: 'El Guía de Aventuras',
    greeting: '¡Hola, aventurero!',
    welcomeMessage: '¡Prepárate para crear juntos una historia llena de aventuras, playas soleadas y momentos inolvidables!',
    borderDecorative: 'repeating-linear-gradient(45deg, #FFB347 0 18px, #006994 18px 36px, #FF6B6B 36px 54px, #FFB347 54px 72px)',
  },
};

/**
 * Obtiene un tema por su ID
 */
export const getTheme = (themeId) => {
  return themes[themeId] || themes.christmas;
};

/**
 * Obtiene todos los temas disponibles
 */
export const getAllThemes = () => {
  return Object.values(themes);
};

