import dotenv from "dotenv";

dotenv.config();

/**
 * Configuración de la aplicación
 */
export const config = {
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
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

