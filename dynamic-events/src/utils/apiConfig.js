/**
 * Configuración de la API
 * 
 * En desarrollo: usa el proxy de Vite (/api/chat)
 * En producción: usa la variable de entorno VITE_API_URL o el endpoint relativo
 */

/**
 * Obtiene la URL base de la API
 * @returns {string} URL base de la API
 */
export const getApiBaseUrl = () => {
  // En desarrollo, Vite proxy maneja /api
  // En producción, usa VITE_API_URL si está definida
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (apiUrl) {
    // Si VITE_API_URL está definida, usarla (debe incluir el protocolo y dominio)
    // Ejemplo: https://tu-backend.onrender.com
    return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  }
  
  // Si no hay VITE_API_URL, usar endpoint relativo (funciona con serverless de Vercel)
  return '';
};

/**
 * Obtiene la URL completa del endpoint de chat
 * @returns {string} URL completa del endpoint de chat
 */
export const getChatApiEndpoint = () => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}/api/chat` : '/api/chat';
};

/**
 * Obtiene la URL completa del endpoint de test
 * @returns {string} URL completa del endpoint de test
 */
export const getTestApiEndpoint = () => {
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl}/api/test` : '/api/test';
};

