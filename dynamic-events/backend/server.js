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

// Middleware global de CORS
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = Array.isArray(config.corsOrigin) 
      ? config.corsOrigin 
      : [config.corsOrigin];
    
    // En desarrollo, permitir requests sin origin (Postman, curl, etc.)
    if (config.nodeEnv === 'development' && !origin) {
      return callback(null, true);
    }
    
    // Verificar si el origin está permitido
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS bloqueado para origin: ${origin}`);
      console.warn(`   Orígenes permitidos: ${allowedOrigins.join(', ')}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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
  const corsDisplay = Array.isArray(config.corsOrigin) 
    ? config.corsOrigin.join(', ') 
    : config.corsOrigin;
  console.log(`🌐 CORS habilitado para: ${corsDisplay}`);
  
  // Advertencia si CORS_ORIGIN no está configurado en producción
  if (config.nodeEnv === 'production' && !process.env.CORS_ORIGIN) {
    console.warn('⚠️ ADVERTENCIA: CORS_ORIGIN no está configurado. Usando valor por defecto (localhost).');
    console.warn('   Configura CORS_ORIGIN en Render con la URL de tu frontend en Vercel.');
  }
});
