/**
 * Utilidades de debug para la API
 * Solo se usa en desarrollo
 */

/**
 * Logs información sobre la configuración de la API
 * Se ejecuta en desarrollo y producción para debugging
 */
export const logApiConfig = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // Importar dinámicamente para obtener el endpoint normalizado
  import('./apiConfig.js').then(({ getChatApiEndpoint }) => {
    const endpoint = getChatApiEndpoint();
    
    const config = {
      'VITE_API_URL (raw)': apiUrl || 'No definida (usando proxy/relativo)',
      'Endpoint final (normalizado)': endpoint,
      'Modo': import.meta.env.MODE,
      'Dev': import.meta.env.DEV,
      'Prod': import.meta.env.PROD
    };
    
    // Advertencia si falta protocolo en la variable original
    if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
      config['⚠️ ADVERTENCIA'] = 'VITE_API_URL no tiene protocolo. Se agregó https:// automáticamente.';
      config['💡 Recomendación'] = 'Configura VITE_API_URL con https:// en Vercel para evitar este warning.';
    }
    
    console.log('🔧 Configuración de API:', config);
  }).catch(err => {
    console.error('Error al cargar configuración de API:', err);
  });
};

/**
 * Verifica la conectividad con el backend
 * @param {string} apiEndpoint - URL del endpoint
 * @returns {Promise<boolean>} true si el backend responde
 */
export const checkBackendConnection = async (apiEndpoint) => {
  try {
    // Intentar hacer una petición OPTIONS o GET simple
    const testUrl = apiEndpoint.replace('/api/chat', '/api/test');
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
    });
    return response.ok;
  } catch (error) {
    console.error('Backend no disponible:', error);
    return false;
  }
};

