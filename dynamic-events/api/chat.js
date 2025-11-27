/**
 * Serverless Function para Vercel
 * Esta función maneja las solicitudes de chat cuando se despliega en Vercel
 * 
 * Para usar esta función en Vercel:
 * 1. Asegúrate de tener las variables de entorno configuradas en Vercel
 * 2. El endpoint será: https://tu-dominio.vercel.app/api/chat
 */

import { createOpenAIClient, getAvailableApiKeys } from "../backend/config/openai.config.js";
import { loadDataContext } from "../backend/utils/dataLoader.js";

// Cache para el contexto y cliente (se mantiene entre invocaciones en el mismo proceso)
let cachedDataContext = null;
let cachedClient = null;
let cachedApiKeyIndex = 0;

/**
 * Inicializa el cliente de OpenAI y carga el contexto
 */
async function initializeChat() {
  if (!cachedDataContext) {
    try {
      cachedDataContext = await loadDataContext();
    } catch (error) {
      console.error("Error al cargar el contexto de IA:", error);
      cachedDataContext = "";
    }
  }

  const apiKeys = getAvailableApiKeys();
  if (apiKeys.length === 0) {
    throw new Error("No hay API keys disponibles");
  }

  if (!cachedClient) {
    cachedClient = createOpenAIClient(apiKeys[0]);
    cachedApiKeyIndex = 0;
  }
}

/**
 * Handler para la función serverless de Vercel
 */
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Solo se permite el método POST",
    });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "invalid_request",
      message: "El campo 'messages' es requerido y debe ser un array.",
    });
  }

  try {
    await initializeChat();

    const completion = await cachedClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: cachedDataContext },
        ...messages,
      ],
    });

    console.log("Uso de tokens:", completion.usage);

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en OpenAI:", error);

    const errorCode =
      error?.code ||
      error?.error?.code ||
      error?.response?.status ||
      error?.status;
    const isRateLimit =
      errorCode === "rate_limit_exceeded" ||
      errorCode === "insufficient_quota" ||
      error?.message?.includes("rate_limit") ||
      error?.error?.message?.includes("rate_limit");

    const apiKeys = getAvailableApiKeys();

    // Si es rate limit y tenemos una segunda API key, intentar con ella
    if (isRateLimit && cachedApiKeyIndex === 0 && apiKeys.length > 1) {
      console.log("Rate limit alcanzado con API_KEY1, cambiando a API_KEY2...");
      cachedApiKeyIndex = 1;
      cachedClient = createOpenAIClient(apiKeys[1]);

      try {
        const retryCompletion = await cachedClient.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: cachedDataContext },
            ...messages,
          ],
        });

        console.log("Éxito con API_KEY2:", retryCompletion.usage);
        return res.status(200).json({ reply: retryCompletion.choices[0].message.content });
      } catch (retryError) {
        const retryErrorCode =
          retryError?.code ||
          retryError?.error?.code ||
          retryError?.response?.status ||
          retryError?.status;
        const isRetryRateLimit =
          retryErrorCode === "rate_limit_exceeded" ||
          retryErrorCode === "insufficient_quota" ||
          retryError?.message?.includes("rate_limit") ||
          retryError?.error?.message?.includes("rate_limit");

        if (isRetryRateLimit) {
          console.error("Ambas API keys han alcanzado el límite de rate limit");
          return res.status(429).json({
            error: "rate_limit_exceeded",
            message:
              "El modelo AI ha llegado al límite de solicitudes. Por favor, intenta más tarde.",
          });
        }
      }
    } else if (isRateLimit) {
      return res.status(429).json({
        error: "rate_limit_exceeded",
        message:
          "El modelo AI ha llegado al límite de solicitudes. Por favor, intenta más tarde.",
      });
    }

    return res.status(500).json({
      error: "api_error",
      message:
        "No hay conexión con la API. Por favor, verifica tu conexión e intenta de nuevo.",
    });
  }
}

