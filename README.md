# Dynamic Events

Dynamic Events es un proyecto desarrollado con el fin de ofrecer una experiencia digital única que evoluciona con las épocas del año. El objetivo es crear un entorno adaptable según la época del año, interactivo ofreciendo historias personalizadas guiadas por IA y entretenido con la implementación de mini juegos.

# Link de despliegue: https://dynamic-events.vercel.app

## Tabla de Contenidos

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Wireframes](#wireframes)
- [Documentación](#documentación)
- [Instrucciones de Instalación](#instrucciones-de-instalación)
- [Dependencias](#dependencias)
- [Estructura de Archivos](#estructura-de-archivos)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Scripts Disponibles](#scripts-disponibles)
- [Configuración del Entorno](#configuración-del-entorno)

## Resumen del Proyecto

Dynamic Events es una aplicación web interactiva que ofrece:

- **Temas Dinámicos**: Tres épocas del año (Navidad, Halloween, Vacaciones) con contenido temático único
- **Historias con IA**: Generación de historias personalizadas usando OpenAI GPT
- **Minijuegos**: Varios minijuegos temáticos por época:
  - **Navidad**: Trineo Veloz
  - **Halloween**: Laberinto Encantado
  - **Vacaciones**: Coconut Bowling, Billar
- **Interfaz Adaptativa**: Diseño responsive que se adapta a diferentes dispositivos
- **Navegación Intuitiva**: Sistema de navegación entre páginas y secciones

## Arquitectura del Proyecto

### Estructura General

El proyecto está dividido en dos partes principales:

```
Dynamic-Events/
├── dynamic-events/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── config/          # Configuraciones y contenido
│   │   ├── context/         # Context API (ThemeContext)
│   │   ├── styles/          # Estilos CSS (OOCSS)
│   │   └── utils/           # Utilidades
│   ├── public/              # Archivos estáticos
│   └── package.json
│
└── dynamic-events/backend/  # Backend (Node.js + Express)
    ├── controllers/         # Controladores
    ├── routes/              # Rutas de la API
    ├── middleware/          # Middleware (rate limiting)
    ├── data/               # Archivos de contexto para IA
    └── package.json
```

### Arquitectura Frontend

#### **Componentes Base (OOCSS)**
- Componentes reutilizables en `src/components/base/`:
  - `Button.jsx` - Botones con variantes temáticas
  - `Card.jsx` - Tarjetas para contenido
  - `Header.jsx` - Encabezado con navegación
  - `Footer.jsx` - Pie de página
  - `Modal.jsx` - Modales reutilizables
  - `Hero.jsx` - Secciones hero
  - `Carousel.jsx` - Carruseles de contenido

#### **Componentes de Página**
- `Landing.jsx` - Página principal con contenido temático
- `ChatPage.jsx` - Página de chat con IA
- `GamePage.jsx` - Página de minijuegos
- `CreateHistory.jsx` - Formulario para crear historias
- `AboutUs.jsx` - Página sobre el proyecto
- `AddInfo.jsx` - Página de información adicional

#### **Componentes de Juego**
- `MinigameTest.jsx` - Trineo Veloz (Navidad)
- `MazeGame.jsx` - Laberinto Encantado (Halloween)
- `CoconutBowling.jsx` - Coconut Bowling (Vacaciones)
- `PoolGame.jsx` - Billar (Vacaciones)

#### **Sistema de Temas**
- `ThemeContext.jsx` - Context API para gestión de temas
- `themes.js` - Configuración de temas
- `christmasContent.js`, `halloweenContent.js`, `vacationContent.js` - Contenido temático

#### **Metodología OOCSS (Object-Oriented CSS)**

El proyecto sigue la metodología OOCSS que separa:

1. **Estructura (Layout)**: Posicionamiento, dimensiones, márgenes
2. **Skin (Apariencia)**: Colores, fuentes, bordes, sombras

**Archivos CSS principales:**
- `variables.css` - Variables CSS globales (colores, espaciado, etc.)
- `base/utilities.css` - Clases de utilidad reutilizables (`.u-flex`, `.u-text-center`, etc.)
- `base/*.css` - Estilos base para componentes
- `themes/*.css` - Estilos específicos por tema
- `*.css` - Estilos específicos de componentes

**Ejemplo de OOCSS:**
```css
/* Estructura */
.card {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

/* Skin */
.card--christmas {
  background: var(--bg-paper);
  border: 2px solid var(--color-primary);
}
```

### Arquitectura Backend

#### **API REST**
- Endpoint principal: `/api/chat`
- Integración con OpenAI GPT para generación de historias
- Rate limiting para prevenir abuso
- CORS configurado para frontend

#### **Estructura Backend**
```
backend/
├── server.js              # Servidor Express principal
├── routes/
│   └── chat.routes.js    # Rutas de chat
├── controllers/
│   └── chat.controller.js # Lógica de negocio
├── middleware/
│   └── rateLimiter.js    # Rate limiting
├── data/
│   ├── christmas.txt     # Contexto para Navidad
│   ├── halloween.txt     # Contexto para Halloween
│   └── vacation.txt      # Contexto para Vacaciones
└── config/
    ├── app.config.js     # Configuración de la app
    └── openai.config.js  # Configuración de OpenAI
```

## Wireframes

### Página Principal (Landing)
```
┌─────────────────────────────────────────┐
│           Header (Sticky)              │
│  Logo | Nav | Theme Selector          │
├─────────────────────────────────────────┤
│                                         │
│         Hero Section                    │
│    (Imagen + Título + Descripción)     │
│                                         │
├─────────────────────────────────────────┤
│      Historias Destacadas              │
│    [Card] [Card] [Card]                │
├─────────────────────────────────────────┤
│      Historias Originales              │
│    [Card] [Card] [Card]                │
├─────────────────────────────────────────┤
│      Minijuegos                         │
│    [Card] [Card] [Card]                │
├─────────────────────────────────────────┤
│           Footer                        │
└─────────────────────────────────────────┘
```

### Página de Chat
```
┌─────────────────────────────────────────┐
│           Header                        │
├─────────────────────────────────────────┤
│                                         │
│      Título del Chat                    │
│      Descripción                        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      Área de Mensajes                   │
│      (Scrollable)                       │
│                                         │
├─────────────────────────────────────────┤
│      Input de Mensaje                   │
│      [________________] [Enviar]        │
└─────────────────────────────────────────┘
```

### Página de Juego
```
┌─────────────────────────────────────────┐
│           Header                        │
├─────────────────────────────────────────┤
│                                         │
│      Canvas del Juego                   │
│      (800x600)                          │
│                                         │
├─────────────────────────────────────────┤
│      Instrucciones | Mecánicas          │
│      Estadísticas                       │
└─────────────────────────────────────────┘
```

## Documentación

### Componentes Principales

#### `Landing.jsx`
Componente principal que muestra el contenido temático según la época del año.

**Props:**
- `onNavigateToChat` - Navegar al chat
- `onNavigateToGame` - Navegar a juegos
- `onNavigateToCreateHistory` - Navegar a crear historia
- `onNavigateToLanding` - Volver a landing
- `onNavigateToMinijuegos` - Scroll a sección de minijuegos
- `onNavigateToAboutUs` - Navegar a About Us
- `onNavigateToAddInfo` - Navegar a información adicional

#### `ChatPage.jsx`
Página de chat con IA que genera historias personalizadas.

**Características:**
- Integración con OpenAI GPT
- Rate limiting
- Manejo de errores
- Auto-start con tema

#### `GamePage.jsx`
Página que renderiza los minijuegos según el tema seleccionado.

**Juegos disponibles:**
- Navidad: Trineo Veloz
- Halloween: Laberinto Encantado
- Vacaciones: Coconut Bowling, Billar

#### `ThemeContext.jsx`
Context API que gestiona el tema actual de la aplicación.

**Temas disponibles:**
- `christmas` - Navidad
- `halloween` - Halloween
- `vacation` - Vacaciones

### API Backend

#### Endpoint: `/api/chat`

**Método:** POST

**Body:**
```json
{
  "message": "Mensaje del usuario",
  "seasonTheme": "christmas" | "halloween" | "vacation",
  "conversationHistory": [...]
}
```

**Response:**
```json
{
  "response": "Respuesta de la IA",
  "finished": false
}
```

## Instrucciones de Instalación

Esta guía te llevará paso a paso a través de la instalación completa del proyecto Dynamic Events, incluyendo la configuración del frontend, backend y todas las dependencias necesarias.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
  - Verificar instalación: `node --version`
  - Descargar desde: [nodejs.org](https://nodejs.org/)
- **npm** (viene incluido con Node.js) o **yarn**
  - Verificar instalación: `npm --version` o `yarn --version`
- **Git** (para clonar el repositorio)
  - Verificar instalación: `git --version`
- **Cuenta de OpenAI** con API key (requerida para el backend)
  - Obtener API key en: [platform.openai.com](https://platform.openai.com/api-keys)

### Paso 1: Clonar el Repositorio

1. Abre una terminal en la ubicación donde deseas clonar el proyecto
2. Ejecuta el siguiente comando:

```bash
git clone <url-del-repositorio>
```

3. Navega al directorio del proyecto:

```bash
cd Dynamic-Events
```

### Paso 2: Instalar Dependencias del Frontend

1. Navega al directorio del frontend:

```bash
cd dynamic-events
```

2. Instala todas las dependencias del frontend:

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`, incluyendo:
- React y React DOM
- Vite y sus plugins
- ESLint y herramientas de desarrollo

**Tiempo estimado:** 2-5 minutos dependiendo de tu conexión a internet.

3. Verifica que la instalación fue exitosa:

```bash
npm list --depth=0
```

### Paso 3: Instalar Dependencias del Backend

1. Navega al directorio del backend:

```bash
cd backend
```

2. Instala todas las dependencias del backend:

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `backend/package.json`, incluyendo:
- Express
- OpenAI SDK
- CORS
- Express Rate Limit
- Dotenv

**Tiempo estimado:** 1-3 minutos.

3. Verifica que la instalación fue exitosa:

```bash
npm list --depth=0
```

### Paso 4: Configurar Variables de Entorno

Las variables de entorno son necesarias para que el proyecto funcione correctamente. Debes crear archivos `.env` en las ubicaciones especificadas.

#### Configuración del Frontend

1. Navega al directorio del frontend:

```bash
cd dynamic-events
```

2. Crea un archivo `.env` en la raíz del directorio `dynamic-events/`:

```bash
# En Windows (PowerShell)
New-Item -Path .env -ItemType File

# En Windows (CMD)
type nul > .env

# En Linux/Mac
touch .env
```

3. Abre el archivo `.env` y agrega la siguiente configuración:

```env
# URL del backend API (opcional en desarrollo, usa proxy local)
# Para producción, descomenta y configura:
# VITE_API_URL=https://tu-backend-url.com
```

**Nota:** En desarrollo, puedes dejar esta variable vacía o comentada. El frontend usará automáticamente el proxy configurado en `vite.config.js` que apunta a `http://localhost:3000`.

#### Configuración del Backend

1. Navega al directorio del backend:

```bash
cd dynamic-events/backend
```

2. Crea un archivo `.env` en la raíz del directorio `backend/`:

```bash
# En Windows (PowerShell)
New-Item -Path .env -ItemType File

# En Windows (CMD)
type nul > .env

# En Linux/Mac
touch .env
```

3. Abre el archivo `.env` y agrega la siguiente configuración:

```env
# API Key de OpenAI (REQUERIDA)
OPENAI_API_KEY=sk-proj-tu-api-key-aqui

# Puerto del servidor (opcional, por defecto es 3000)
PORT=3000
```

**Importante:**
- Reemplaza `sk-proj-tu-api-key-aqui` con tu API key real de OpenAI
- No compartas este archivo ni lo subas al repositorio (debe estar en `.gitignore`)
- La API key debe comenzar con `sk-` y tener el formato correcto

4. Verifica que el archivo `.env` existe y tiene el formato correcto:

```bash
# En Linux/Mac
cat .env

# En Windows (PowerShell)
Get-Content .env
```

### Paso 5: Verificar la Configuración

Antes de ejecutar el proyecto, verifica que todo esté configurado correctamente:

1. **Verificar estructura de directorios:**

```
Dynamic-Events/
├── dynamic-events/
│   ├── node_modules/        # Debe existir después de npm install
│   ├── .env                  # Debe existir (puede estar vacío en dev)
│   └── package.json
└── dynamic-events/backend/
    ├── node_modules/         # Debe existir después de npm install
    ├── .env                  # Debe existir con OPENAI_API_KEY
    └── package.json
```

2. **Verificar que las dependencias están instaladas:**

```bash
# Frontend
cd dynamic-events
npm list react react-dom vite

# Backend
cd backend
npm list express openai dotenv
```

### Paso 6: Ejecutar el Proyecto

El proyecto requiere ejecutar tanto el backend como el frontend simultáneamente. Necesitarás dos terminales.

#### Modo Desarrollo

**Terminal 1 - Backend:**

1. Navega al directorio del backend:

```bash
cd dynamic-events/backend
```

2. Inicia el servidor backend:

```bash
npm run dev
```

Deberías ver un mensaje similar a:
```
Servidor corriendo en http://localhost:3000
```

**Terminal 2 - Frontend:**

1. Abre una nueva terminal
2. Navega al directorio del frontend:

```bash
cd dynamic-events
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

Deberías ver un mensaje similar a:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

4. Abre tu navegador y visita:

```
http://localhost:5173
```

**Verificación:**
- El frontend debe cargar correctamente
- El backend debe estar respondiendo en `http://localhost:3000`
- No deben aparecer errores en las consolas de las terminales

#### Modo Producción

**Backend:**

1. Navega al directorio del backend:

```bash
cd dynamic-events/backend
```

2. Inicia el servidor en modo producción:

```bash
npm start
```

**Frontend:**

1. Navega al directorio del frontend:

```bash
cd dynamic-events
```

2. Construye el proyecto para producción:

```bash
npm run build
```

Este comando creará una carpeta `dist/` con los archivos optimizados.

3. Previsualiza el build de producción:

```bash
npm run preview
```

### Solución de Problemas Comunes

#### Error: "Cannot find module"

**Solución:** Asegúrate de haber ejecutado `npm install` en ambos directorios (frontend y backend).

```bash
cd dynamic-events && npm install
cd backend && npm install
```

#### Error: "OPENAI_API_KEY is not defined"

**Solución:** Verifica que el archivo `.env` existe en `backend/` y contiene la variable `OPENAI_API_KEY` con un valor válido.

#### Error: "Port 3000 is already in use"

**Solución:** Cambia el puerto en el archivo `.env` del backend:

```env
PORT=3001
```

O detén el proceso que está usando el puerto 3000.

#### Error: "Proxy error" en el frontend

**Solución:** Asegúrate de que el backend esté corriendo antes de iniciar el frontend. El proxy de Vite requiere que el backend esté disponible en `http://localhost:3000`.

#### Error: "Module not found" después de clonar

**Solución:** Los `node_modules` no se incluyen en el repositorio. Debes ejecutar `npm install` después de clonar.

### Verificación Final

Una vez que ambos servidores estén corriendo, verifica:

1. **Frontend accesible:** `http://localhost:5173`
2. **Backend accesible:** `http://localhost:3000/api/chat` (debe responder con un error de método, no un 404)
3. **Sin errores en consola:** Revisa las terminales y la consola del navegador
4. **Temas funcionando:** Cambia entre temas en la landing page
5. **Chat funcionando:** Intenta iniciar una conversación con la IA

### Archivos Necesarios

Asegúrate de que estos archivos existan antes de ejecutar:

- `dynamic-events/package.json` ✓
- `dynamic-events/backend/package.json` ✓
- `dynamic-events/.env` (opcional en desarrollo) ✓
- `dynamic-events/backend/.env` (requerido) ✓
- `dynamic-events/vite.config.js` ✓
- `dynamic-events/backend/server.js` ✓

## Dependencias

### Frontend

**Producción:**
- `react` ^19.1.1 - Biblioteca de UI
- `react-dom` ^19.1.1 - Renderizado de React

**Desarrollo:**
- `vite` - Build tool y dev server
- `@vitejs/plugin-react-swc` - Plugin de React para Vite
- `eslint` - Linter de código
- `@types/react` - Tipos de TypeScript para React

### Backend

**Producción:**
- `express` ^5.1.0 - Framework web
- `openai` ^6.8.1 - SDK de OpenAI
- `cors` ^2.8.5 - Middleware CORS
- `dotenv` ^17.2.3 - Variables de entorno
- `express-rate-limit` ^8.2.1 - Rate limiting

## Estructura de Archivos

```
Dynamic-Events/
├── dynamic-events/
│   ├── src/
│   │   ├── components/
│   │   │   ├── base/              # Componentes base reutilizables
│   │   │   ├── AboutUs.jsx
│   │   │   ├── AddInfo.jsx
│   │   │   ├── ChatIA.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── CoconutBowling.jsx
│   │   │   ├── CreateHistory.jsx
│   │   │   ├── GamePage.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── MazeGame.jsx
│   │   │   ├── MinigameTest.jsx
│   │   │   └── PoolGame.jsx
│   │   ├── config/
│   │   │   ├── christmasContent.js
│   │   │   ├── halloweenContent.js
│   │   │   ├── themes.js
│   │   │   └── vacationContent.js
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── styles/
│   │   │   ├── base/              # Estilos base OOCSS
│   │   │   ├── themes/            # Estilos por tema
│   │   │   ├── variables.css      # Variables CSS globales
│   │   │   └── *.css             # Estilos de componentes
│   │   ├── utils/
│   │   │   ├── apiConfig.js
│   │   │   └── debugApi.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   ├── images/               # Imágenes del proyecto
│   │   └── sounds/                # Sonidos de los juegos
│   ├── backend/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── data/
│   │   ├── config/
│   │   └── server.js
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── README.md
```

## Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **CSS3** - Estilos con metodología OOCSS
- **Canvas API** - Para los minijuegos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5** - Framework web
- **OpenAI API** - Generación de historias con IA

### Herramientas
- **ESLint** - Linter de código
- **Git** - Control de versiones
- **Vercel** - Deployment (configurado)

## Scripts Disponibles

### Frontend

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza build de producción
npm run lint     # Ejecuta ESLint
```

### Backend

```bash
npm run dev      # Inicia servidor en modo desarrollo
npm start        # Inicia servidor en modo producción
```

## Configuración del Entorno

### Variables de Entorno Frontend

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_API_URL` | URL del backend API | No (usa proxy en dev) |

### Variables de Entorno Backend

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `OPENAI_API_KEY` | API key de OpenAI | Sí |
| `PORT` | Puerto del servidor | No (default: 3000) |

### Proxy de Desarrollo

El frontend está configurado para usar un proxy en desarrollo (`vite.config.js`):

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    }
  }
}
```

## Minijuegos

### Trineo Veloz (Navidad)
- Atrapa regalos que caen del cielo
- Evita que toquen el suelo
- Power-ups disponibles
- Sistema de vidas y niveles

### Laberinto Encantado (Halloween)
- Navega un laberinto oscuro con linterna
- Recolecta dulces
- Evita monstruos
- Batería limitada

### Coconut Bowling (Vacaciones)
- Lanza cocos para derribar objetivos
- Sistema de niveles
- Física realista
- Sistema de puntuación

### Billar (Vacaciones)
- Modos: Bola 8 y Bola 9
- Multijugador (hasta 2 jugadores)
- Física realista
- Bolas rayadas y lisas

## Contribuidores

Desarrollado por el equipo de Dynamic Events.

---

**Nota:** Este proyecto requiere una API key de OpenAI para funcionar correctamente. Asegúrate de configurar las variables de entorno antes de ejecutar el proyecto.
