import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

/**
 * Crea un cliente de OpenAI con una API key específica
 * @param {string} apiKey - La API key de OpenAI
 * @returns {OpenAI} Cliente de OpenAI configurado
 */
export const createOpenAIClient = (apiKey) => {
  if (!apiKey) {
    throw new Error("API Key no proporcionada");
  }
  return new OpenAI({
    apiKey: apiKey,
  });
};

/**
 * Obtiene las API keys disponibles desde las variables de entorno
 * @returns {string[]} Array de API keys disponibles
 */
export const getAvailableApiKeys = () => {
  const keys = [];
  if (process.env.OPENAI_API_KEY) {
    keys.push(process.env.OPENAI_API_KEY);
  }
  if (process.env.OPENAI_API_KEY2) {
    keys.push(process.env.OPENAI_API_KEY2);
  }
  return keys;
};

/**
 * Valida que exista al menos una API key
 * @throws {Error} Si no hay API keys disponibles
 */
export const validateApiKeys = () => {
  const keys = getAvailableApiKeys();
  if (keys.length === 0) {
    throw new Error("ERROR: No se encontraron API_KEY. Verifica las variables de entorno.");
  }
  return keys;
};

