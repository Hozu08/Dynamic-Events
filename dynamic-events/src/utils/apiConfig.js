/**
 * Configuración de la API
 * 
 * En desarrollo: usa el proxy de Vite (/api/chat)
 * En producción: usa la variable de entorno VITE_API_URL o el endpoint relativo
 */

/**
 * Normaliza una URL asegurando que tenga protocolo
 * @param {string} url - URL a normalizar
 * @returns {string} URL normalizada con protocolo
 */
const normalizeUrl = (url) => {
  if (!url) return '';
  
  // Remover espacios
  url = url.trim();
  
  // Si ya tiene protocolo, retornar tal cual (después de limpiar)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
  }
  
  // Si no tiene protocolo, agregar https://
  const urlWithProtocol = `https://${url}`;
  return urlWithProtocol.endsWith('/') ? urlWithProtocol.slice(0, -1) : urlWithProtocol;
};

/**
 * Obtiene la URL base de la API
 * @returns {string} URL base de la API
 */
export const getApiBaseUrl = () => {
  // En desarrollo, Vite proxy maneja /api
  // En producción, usa VITE_API_URL si está definida
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (apiUrl) {
    // Normalizar la URL (agregar https:// si falta, remover trailing slash)
    const normalizedUrl = normalizeUrl(apiUrl);
    
    // Log en desarrollo para debugging
    if (import.meta.env.DEV) {
      if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        console.warn('⚠️ VITE_API_URL no tiene protocolo. Se agregó automáticamente https://');
        console.warn('   Original:', apiUrl);
        console.warn('   Normalizada:', normalizedUrl);
      }
    }
    
    return normalizedUrl;
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

