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

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Endpoint de prueba.
app.get("/test", (req, res) => {
  res.send("Servidor Ok: " + res.statusCode);
});

//Endpoint para conectarse con OpenAI.
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: dataContextIA },
        ...messages, // Se mantiene todo el historial
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en OpenAI:", error);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
