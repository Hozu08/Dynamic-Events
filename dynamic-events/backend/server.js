import express from "express"; //Se importa Express para levantar el servidor y crear rutas.
import OpenAI from "openai"; //Se importa API de OpenAI.
import dotenv from "dotenv"; //Se importa para hacer uso de las variables de entorno.
import cors from "cors"; //Se utiliza para evitar conflictos con las peticiones que hace Vite (localhost:5173) al backend (localhost:3000).
import fs from "fs";
import rateLimit from "express-rate-limit";

let dataContextIA = ""; //Variable para almacenar el pre-prompt del modelo IA.

fs.readFile("data/christmas.txt", "utf-8", (err, data) => {
  if (err) throw err;
  dataContextIA = data;
});

dotenv.config(); //Lee .env.

const app = express();

//Habilita CORS para que reciba peticiones desde un origen específico.
app.use(cors({
  origin: 'http://localhost:5173'
})); 

//Limita las peticiones a 30 solicitudes por minuto
app.use(
  "/api/chat", 
  rateLimit({windowMs: 60_000, 
    max: 30,
    message: "Demasiadas solicitudes, intenta de nuevo en un momento."  
})); 

app.use(express.json()); //Parsea el body recibido de las peticiones.

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: API_KEY no encontrada");
  process.exit(1); //Finaliza el proceso de ejecución si no encuentra la Api_Key.
}

// Función para crear cliente OpenAI con una API key específica
const createOpenAIClient = (apiKey) => {
  return new OpenAI({
    apiKey: apiKey,
  });
};

// Cliente inicial con la primera API key
let currentClient = createOpenAIClient(process.env.OPENAI_API_KEY);
let currentApiKeyIndex = 1; // 1 = OPENAI_API_KEY, 2 = OPENAI_API_KEY2

//Endpoint de prueba.
app.get("/test", (req, res) => {
  res.send("Servidor Ok: " + res.statusCode);
});

//Endpoint para conectarse con OpenAI.
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await currentClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: dataContextIA },
        ...messages, //Se mantiene todo el historial.
      ]
    });

    console.log(completion.usage);

    res.json({ reply: completion.choices[0].message.content }); //Devuelve la respuesta al frontend.
  } catch (error) {
    console.error("Error en OpenAI:", error);
    
    // Verificar si es un error de rate limit
    const errorCode = error?.code || error?.error?.code || error?.response?.status || error?.status;
    const isRateLimit = errorCode === "rate_limit_exceeded" || 
                        errorCode === "insufficient_quota" ||
                        error?.message?.includes("rate_limit") ||
                        error?.error?.message?.includes("rate_limit");

    // Si es rate limit y tenemos una segunda API key, intentar con ella
    if (isRateLimit && currentApiKeyIndex === 1 && process.env.OPENAI_API_KEY2) {
      console.log("Rate limit alcanzado con API_KEY1, cambiando a API_KEY2...");
      currentApiKeyIndex = 2;
      currentClient = createOpenAIClient(process.env.OPENAI_API_KEY2);
      
      try {
        // Reintentar con la segunda API key
        const retryCompletion = await currentClient.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: dataContextIA },
            ...messages,
          ]
        });

        console.log("Éxito con API_KEY2:", retryCompletion.usage);
        res.json({ reply: retryCompletion.choices[0].message.content });
        return;
      } catch (retryError) {
        // Si también falla la segunda API key con rate limit
        const retryErrorCode = retryError?.code || retryError?.error?.code;
        const isRetryRateLimit = retryErrorCode === "rate_limit_exceeded" || 
                                 retryErrorCode === "insufficient_quota" ||
                                 retryError?.message?.includes("rate_limit") ||
                                 retryError?.error?.message?.includes("rate_limit");
        
        if (isRetryRateLimit) {
          console.error("Ambas API keys han alcanzado el límite de rate limit");
          res.status(429).json({ 
            error: "rate_limit_exceeded",
            message: "El modelo AI ha llegado al límite de solicitudes. Por favor, intenta más tarde." 
          });
          return;
        }
      }
    } else if (isRateLimit) {
      // Si ya estamos usando la segunda API key y también tiene rate limit
      res.status(429).json({ 
        error: "rate_limit_exceeded",
        message: "El modelo AI ha llegado al límite de solicitudes. Por favor, intenta más tarde." 
      });
      return;
    }

    // Para otros errores, devolver error 500
    res.status(500).json({ 
      error: "api_error",
      message: "No hay conexión con la API. Por favor, verifica tu conexión e intenta de nuevo." 
    });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
