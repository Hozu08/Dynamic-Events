import { createOpenAIClient, getAvailableApiKeys } from "../config/openai.config.js";
import { loadDataContext } from "../utils/dataLoader.js";

// Estado del cliente actual (se mantiene en memoria)
let currentClient = null;
let currentApiKeyIndex = 0;
// Cache de contextos por tema
const dataContextCache = {};

// Inicializar el cliente
const initializeChat = async () => {
  const apiKeys = getAvailableApiKeys();
  if (apiKeys.length === 0) {
    throw new Error("No hay API keys disponibles");
  }

  if (!currentClient) {
    currentClient = createOpenAIClient(apiKeys[0]);
    currentApiKeyIndex = 0;
  }
};

// Inicializar al cargar el módulo
await initializeChat();

// Cargar contexto para un tema específico
const getDataContext = async (theme = 'christmas') => {
  // Si ya está en cache, retornarlo
  if (dataContextCache[theme]) {
    return dataContextCache[theme];
  }

  try {
    const context = await loadDataContext(theme);
    dataContextCache[theme] = context;
    return context;
  } catch (error) {
    console.error(`Error al cargar el contexto de IA para tema ${theme}:`, error);
    // Fallback a christmas si hay error
    if (theme !== 'christmas') {
      return getDataContext('christmas');
    }
    return ""; // Fallback a string vacío
  }
};

/**
 * Maneja la solicitud de chat con OpenAI
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export const handleChat = async (req, res) => {
  const { messages, theme = 'christmas' } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      error: "invalid_request",
      message: "El campo 'messages' es requerido y debe ser un array.",
    });
  }

  try {
    // Asegurar que el cliente esté inicializado
    await initializeChat();

    // Cargar contexto según el tema
    const dataContextIA = await getDataContext(theme);

    const completion = await currentClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: dataContextIA },
        ...messages,
      ],
    });

    console.log("Uso de tokens:", completion.usage);

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en OpenAI:", error);

    // Verificar si es un error de rate limit
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
    if (isRateLimit && currentApiKeyIndex === 0 && apiKeys.length > 1) {
      console.log("Rate limit alcanzado con API_KEY1, cambiando a API_KEY2...");
      currentApiKeyIndex = 1;
      currentClient = createOpenAIClient(apiKeys[1]);

      try {
        // Reintentar con la segunda API key
        const dataContextIA = await getDataContext(theme);
        const retryCompletion = await currentClient.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: dataContextIA },
            ...messages,
          ],
        });

        console.log("Éxito con API_KEY2:", retryCompletion.usage);
        res.json({ reply: retryCompletion.choices[0].message.content });
        return;
      } catch (retryError) {
        // Si también falla la segunda API key con rate limit
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
        // Si el error de retry no es rate limit, continuar con el manejo de errores general
      }
    } else if (isRateLimit) {
      // Si ya estamos usando la segunda API key y también tiene rate limit
      return res.status(429).json({
        error: "rate_limit_exceeded",
        message:
          "El modelo AI ha llegado al límite de solicitudes. Por favor, intenta más tarde.",
      });
    }

    // Para otros errores, devolver error 500
    res.status(500).json({
      error: "api_error",
      message:
        "No hay conexión con la API. Por favor, verifica tu conexión e intenta de nuevo.",
    });
  }
};

/**
 * Endpoint de prueba
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express
 */
export const handleTest = (req, res) => {
  res.json({
    status: "ok",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
};

