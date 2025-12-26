# 🔧 Configuración de Variables de Entorno

## Para Desarrollo Local

Crea un archivo `.env` en la carpeta `client/`:

```env
# API URL - Desarrollo Local
VITE_API_URL=http://localhost:5002/api
```

## Para Producción (Vercel/Netlify)

### Opción 1: Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:

```
Name:  VITE_API_URL
Value: https://hdc-server-1.onrender.com/api
```

### Opción 2: Archivo .env.production

Crea un archivo `.env.production` en la carpeta `client/`:

```env
# API URL de Producción
VITE_API_URL=https://hdc-server-1.onrender.com/api
```

## Configuración Actual

El código ya está configurado para usar automáticamente:
- **Desarrollo**: `http://localhost:5002/api`
- **Producción**: `https://hdc-server-1.onrender.com/api`

## Verificar Configuración

```bash
# Ver la URL que se está usando
npm run dev
# Abre la consola del navegador y verifica las llamadas a la API
```

## Cambiar la URL de la API

Si necesitas cambiar la URL de la API:

1. **Desarrollo**: Modifica `.env`
2. **Producción**: Modifica `.env.production` o las variables en Vercel
3. **Código**: Modifica `src/services/api.ts`

## Archivos Importantes

- `src/services/api.ts` - Configuración de Axios
- `.env` - Variables de desarrollo (no subir a Git)
- `.env.production` - Variables de producción (no subir a Git)
- `.env.example` - Ejemplo de variables (sí subir a Git)

## Ejemplo de .env

```env
# API URL
VITE_API_URL=http://localhost:5002/api

# O para usar la API de producción en desarrollo
# VITE_API_URL=https://hdc-server-1.onrender.com/api
```

## Notas Importantes

⚠️ **NUNCA** subas archivos `.env` a Git (ya están en `.gitignore`)  
✅ **SÍ** sube `.env.example` como referencia  
✅ Vite requiere el prefijo `VITE_` en las variables de entorno  
✅ Reinicia el servidor de desarrollo después de cambiar `.env`  

