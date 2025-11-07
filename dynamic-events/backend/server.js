import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor Ok: " + res.statusCode);
});

// Endpoint para conectarse con OpenAI
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Hola!, cómo estas?" },
        { role: "user", content: prompt }
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
