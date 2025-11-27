import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "../config/app.config.js";

/**
 * Middleware de rate limiting para el endpoint de chat
 */
export const chatRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: rateLimitConfig.message,
  standardHeaders: true,
  legacyHeaders: false,
});

