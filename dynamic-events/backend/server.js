import express from "express";
import cors from "cors";
import { config } from "./config/app.config.js";
import { validateApiKeys } from "./config/openai.config.js";
import chatRoutes from "./routes/chat.routes.js";

// Validar que existan API keys antes de iniciar
try {
  validateApiKeys();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const app = express();

// Middleware global
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json());

// Rutas
app.use("/api", chatRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "Dynamic Events API",
    version: "1.0.0",
    status: "running",
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "Ruta no encontrada",
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({
    error: "internal_server_error",
    message: "Error interno del servidor",
  });
});

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
  console.log(`📝 Entorno: ${config.nodeEnv}`);
  console.log(`🌐 CORS habilitado para: ${config.corsOrigin}`);
});
