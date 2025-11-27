# Dynamic Events

Aplicación web interactiva para crear historias personalizadas con IA, con temática navideña y minijuegos.

## 📁 Estructura del Proyecto

```
dynamic-events/
├── backend/              # Backend Express (API)
│   ├── config/          # Configuración (OpenAI, app)
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middleware personalizado
│   ├── routes/          # Definición de rutas
│   ├── utils/           # Utilidades
│   ├── data/            # Archivos de datos (contexto IA)
│   ├── package.json     # Dependencias del backend
│   └── server.js        # Punto de entrada del servidor
├── api/                  # Serverless Functions para Vercel
│   └── chat.js          # Función serverless para chat
├── src/                  # Frontend React
│   ├── components/      # Componentes React
│   │   ├── base/        # Componentes base reutilizables
│   │   └── ...          # Componentes específicos
│   ├── styles/          # Estilos CSS (OOCSS)
│   │   ├── base/        # Estilos base
│   │   └── ...          # Estilos específicos
│   └── ...
├── public/               # Archivos estáticos
├── package.json         # Dependencias del frontend
├── vercel.json          # Configuración de Vercel
└── README-DEPLOY.md     # Guía de despliegue
```

## 🚀 Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de OpenAI con API key

### Configuración Local

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd dynamic-events
   ```

2. **Instalar dependencias del frontend**:
   ```bash
   npm install
   ```

3. **Instalar dependencias del backend**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**:
   
   Crea un archivo `.env` en la raíz del proyecto (opcional para desarrollo):
   ```env
   OPENAI_API_KEY=tu_api_key_1
   OPENAI_API_KEY2=tu_api_key_2 (opcional)
   ```
   
   O crea un archivo `.env` en `backend/`:
   ```env
   OPENAI_API_KEY=tu_api_key_1
   OPENAI_API_KEY2=tu_api_key_2 (opcional)
   PORT=3000
   CORS_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

5. **Iniciar el backend**:
   ```bash
   cd backend
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3000`

6. **Iniciar el frontend** (en otra terminal):
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Arquitectura

### Backend

El backend está modularizado siguiendo el patrón MVC:

- **`config/`**: Configuración de la aplicación y servicios externos
- **`controllers/`**: Lógica de negocio y manejo de solicitudes
- **`middleware/`**: Middleware personalizado (rate limiting, etc.)
- **`routes/`**: Definición de rutas y endpoints
- **`utils/`**: Utilidades y helpers
- **`data/`**: Archivos de datos estáticos (contexto para IA)

### Frontend

El frontend usa React con Vite y sigue la metodología OOCSS:

- **Componentes base**: Componentes reutilizables en `components/base/`
- **Estilos OOCSS**: Separación entre estructura y apariencia
- **Componentes específicos**: Páginas y componentes de funcionalidad

## 📦 Scripts Disponibles

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

### Backend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm start` - Inicia el servidor en producción

## 🔧 Características

- ✅ Chat con IA usando OpenAI GPT-4o-mini
- ✅ Fallback automático entre múltiples API keys
- ✅ Rate limiting para proteger la API
- ✅ Manejo de errores robusto
- ✅ Minijuegos interactivos
- ✅ Diseño responsive
- ✅ Estilos OOCSS para mantenibilidad

## 📚 Documentación

- **Despliegue**: Consulta `README-DEPLOY.md` para instrucciones detalladas de despliegue en Vercel, Railway o Render.

## 🛠️ Tecnologías

### Frontend
- React 19
- Vite
- CSS (OOCSS)

### Backend
- Express 5
- OpenAI API
- Express Rate Limit
- CORS

## 📝 Notas

- El backend y frontend tienen `package.json` separados para mejor organización
- Las variables de entorno se cargan automáticamente con `dotenv`
- El sistema de fallback de API keys funciona automáticamente en caso de rate limits

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado.
