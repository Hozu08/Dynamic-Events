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
4. Guarda y espera a que Render reinicie el servicio

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

