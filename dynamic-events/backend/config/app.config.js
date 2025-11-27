import dotenv from "dotenv";

dotenv.config();

/**
 * Obtiene los orígenes permitidos para CORS
 * Soporta múltiples orígenes separados por coma
 * @returns {string|string[]|Function} Orígenes permitidos para CORS
 */
const getCorsOrigins = () => {
  const corsOrigin = process.env.CORS_ORIGIN;
  
  // Si no hay CORS_ORIGIN definido, usar localhost para desarrollo
  if (!corsOrigin) {
    return "http://localhost:5173";
  }
  
  // Si hay múltiples orígenes separados por coma, convertirlos a array
  if (corsOrigin.includes(',')) {
    const origins = corsOrigin.split(',').map(origin => origin.trim()).filter(Boolean);
    console.log('🌐 CORS configurado para múltiples orígenes:', origins);
    return origins;
  }
  
  // Un solo origen
  return corsOrigin.trim();
};

/**
 * Configuración de la aplicación
 */
export const config = {
  port: process.env.PORT || 3000,
  corsOrigin: getCorsOrigins(),
  nodeEnv: process.env.NODE_ENV || "development",
};

/**
 * Configuración de rate limiting
 */
export const rateLimitConfig = {
  windowMs: 60_000, // 1 minuto
  max: 30, // 30 solicitudes por minuto
  message: "Demasiadas solicitudes, intenta de nuevo en un momento.",
};

