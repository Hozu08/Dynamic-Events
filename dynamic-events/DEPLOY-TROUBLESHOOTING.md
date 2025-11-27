# Solución de Problemas de Despliegue

## Error: "Could not read package.json"

### Síntoma
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

### Causas y Soluciones

#### 1. Root Directory incorrecto en Vercel

**Problema**: Vercel está buscando el `package.json` en la ruta incorrecta.

**Solución**:
1. Ve a tu proyecto en Vercel Dashboard
2. Ve a **Settings** → **General**
3. Busca la sección **Root Directory**
4. Verifica la estructura de tu repositorio:
   - Si tu repositorio es: `github.com/Hozu08/Dynamic-Events`
   - Y el `package.json` está en: `Dynamic-Events/dynamic-events/package.json`
   - Entonces el Root Directory debe ser: `dynamic-events`
   - Si el `package.json` está en la raíz: `Dynamic-Events/package.json`
   - Entonces el Root Directory debe estar **vacío** o ser `.`

#### 2. Estructura del repositorio

Verifica la estructura de tu repositorio en GitHub:

```
Opción A (package.json en raíz):
Dynamic-Events/
├── package.json  ← Aquí
├── src/
├── backend/
└── ...

Opción B (package.json en subcarpeta):
Dynamic-Events/
└── dynamic-events/
    ├── package.json  ← Aquí
    ├── src/
    ├── backend/
    └── ...
```

**Para Opción A**: Root Directory = `.` (vacío)
**Para Opción B**: Root Directory = `dynamic-events`

#### 3. Verificar configuración en Vercel

1. Ve a **Settings** → **General**
2. Verifica:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Root Directory**: (según tu estructura)

#### 4. Limpiar caché y redeploy

1. En Vercel Dashboard, ve a **Deployments**
2. Encuentra el deployment fallido
3. Click en los tres puntos `...` → **Redeploy**
4. O mejor, elimina el proyecto y vuelve a conectarlo

---

## Error: "Module not found" o errores de importación

### Síntoma
```
Error: Cannot find module './utils/apiConfig'
```

### Solución

1. Verifica que todos los archivos estén en el repositorio
2. Asegúrate de que no haya archivos en `.gitignore` que deberían estar incluidos
3. Verifica que el build local funcione:
   ```bash
   npm install
   npm run build
   ```

---

## Error: Variables de entorno no funcionan

### Síntoma
La aplicación no se conecta al backend en producción.

### Solución

1. Verifica que `VITE_API_URL` esté configurada en Vercel:
   - **Settings** → **Environment Variables**
   - Debe estar en los entornos: Production, Preview
2. Verifica el formato:
   - ✅ Correcto: `https://tu-backend.onrender.com`
   - ❌ Incorrecto: `https://tu-backend.onrender.com/api`
3. Después de agregar variables, haz un nuevo deploy

---

## Error: "TypeError: Failed to fetch" en producción

### Síntoma
```
TypeError: Failed to fetch
Error en la consola del navegador al intentar usar el chat
```

### Causas Comunes

1. **Backend no está corriendo en Render**
2. **Variable `VITE_API_URL` no configurada o incorrecta en Vercel**
3. **CORS no configurado correctamente en Render**
4. **URL del backend incorrecta**

### Solución Paso a Paso

#### 1. Verificar que el Backend esté funcionando

1. Ve a tu servicio en Render Dashboard
2. Verifica que el estado sea **"Live"** (no "Paused" o "Building")
3. Abre la URL del backend directamente en el navegador:
   ```
   https://tu-backend.onrender.com/api/test
   ```
4. Deberías ver una respuesta JSON como:
   ```json
   {
     "status": "ok",
     "message": "Servidor funcionando correctamente"
   }
   ```
5. Si no responde, revisa los logs en Render para ver qué está fallando

#### 2. Verificar Variable de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Verifica que `VITE_API_URL` esté configurada:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tu-backend.onrender.com` ⚠️ **DEBE incluir `https://`**
   - **Environments**: Debe estar marcado para Production y Preview
4. **Formato correcto**:
   - ✅ **Correcto**: `https://dynamic-events.onrender.com`
   - ❌ **Incorrecto**: `dynamic-events.onrender.com` (falta protocolo)
   - ❌ **Incorrecto**: `https://dynamic-events.onrender.com/api` (no incluyas `/api`)
5. **Importante**: 
   - Después de agregar/modificar variables, haz un **nuevo deploy**
   - El sistema agregará `https://` automáticamente si falta, pero es mejor configurarlo correctamente

#### 3. Verificar CORS en Render ⚠️ CRÍTICO

1. Ve a Render Dashboard → Tu servicio backend
2. **Environment** → Edita las variables de entorno
3. Verifica que `CORS_ORIGIN` tenga la URL **exacta** de Vercel:
   ```
   CORS_ORIGIN=https://dynamic-events.vercel.app
   ```
   - **Formato correcto**:
     - ✅ `https://dynamic-events.vercel.app` (URL exacta de producción)
     - ✅ `https://app1.vercel.app,https://app2.vercel.app` (múltiples orígenes separados por coma)
     - ❌ `http://localhost:5173` (solo para desarrollo local)
     - ❌ `*` (no recomendado por seguridad)
     - ❌ `dynamic-events.vercel.app` (falta `https://`)
   - **Importante**: 
     - Debe incluir `https://` al inicio
     - Debe ser la URL exacta (sin trailing slash)
     - Si tienes múltiples deployments (production, preview), puedes usar: `https://app.vercel.app,https://app-git-main.vercel.app`
4. **Guarda los cambios** (Render reiniciará automáticamente)
5. **Espera 1-2 minutos** a que el servicio se reinicie completamente
6. **Verifica los logs** en Render para confirmar que CORS está configurado correctamente:
   - Deberías ver: `🌐 CORS habilitado para: https://dynamic-events.vercel.app`

#### 4. Verificar en la Consola del Navegador

1. Abre tu app en Vercel
2. Abre las DevTools (F12)
3. Ve a la pestaña **Console**
4. Busca los logs que muestran:
   - `🔧 Configuración de API:` - Verifica que `VITE_API_URL` esté correcta
   - `📍 Endpoint de chat configurado:` - Debe ser `https://tu-backend.onrender.com/api/chat`
5. Ve a la pestaña **Network**
6. Intenta enviar un mensaje en el chat
7. Busca la petición a `/api/chat`
8. Si aparece en rojo, click en ella y revisa:
   - **Status**: ¿Qué código de error muestra?
   - **Headers**: ¿La URL es correcta?
   - **Response**: ¿Qué mensaje de error muestra?

#### 5. Verificar la URL del Backend

Abre la consola del navegador y ejecuta:
```javascript
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

Debería mostrar la URL de tu backend. Si muestra `undefined`, la variable no está configurada.

### Checklist de Verificación

- [ ] Backend está "Live" en Render
- [ ] Backend responde en `/api/test`
- [ ] `VITE_API_URL` está configurada en Vercel
- [ ] `CORS_ORIGIN` está configurada en Render con la URL de Vercel
- [ ] Se hizo un nuevo deploy en Vercel después de agregar variables
- [ ] La URL del backend no tiene `/api` al final
- [ ] La URL del backend comienza con `https://`

---

## Error: CORS en producción

### Síntoma
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

### Solución

1. Ve a Render Dashboard
2. Edita las variables de entorno de tu servicio
3. Actualiza `CORS_ORIGIN` con la URL exacta de Vercel:
   ```
   CORS_ORIGIN=https://tu-app.vercel.app
   ```
   - **Importante**: 
     - Debe ser la URL exacta (con `https://`)
     - No uses `*` 
     - No uses múltiples URLs
4. Guarda y espera a que Render reinicie el servicio
5. Verifica que el backend esté respondiendo correctamente

---

## Verificar que todo funciona localmente

Antes de desplegar, verifica localmente:

```bash
# 1. Instalar dependencias
npm install

# 2. Build de producción
npm run build

# 3. Preview del build
npm run preview
```

Si esto funciona, el problema está en la configuración de Vercel.

---

## Contacto y Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Render Documentation](https://render.com/docs)

