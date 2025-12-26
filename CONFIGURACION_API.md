# ✅ Cliente Configurado para API de Producción

## 🎯 Configuración Completada

Tu cliente React ahora está configurado para consumir la API de producción en Render:

**API Backend**: [https://hdc-server-1.onrender.com](https://hdc-server-1.onrender.com)

## 📝 Cambios Realizados

### 1. **src/services/api.ts**

Se actualizó para usar automáticamente la URL correcta según el entorno:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://hdc-server-1.onrender.com/api'  // Producción
    : 'http://localhost:5002/api');             // Desarrollo
```

### 2. **Archivos de Documentación Creados**

- ✅ `ENV_SETUP.md` - Guía de configuración de variables de entorno
- ✅ `DEPLOY_VERCEL.md` - Guía completa de despliegue en Vercel
- ✅ `env.example.txt` - Ejemplo de archivo .env
- ✅ `CONFIGURACION_API.md` - Este archivo

## 🚀 Cómo Usar

### Desarrollo Local

```bash
# Iniciar el servidor de desarrollo
npm run dev

# El cliente usará: http://localhost:5002/api
# (Asegúrate de tener el servidor local corriendo)
```

### Usar API de Producción en Desarrollo (Opcional)

Si quieres probar con la API de producción sin hacer deploy:

1. Crea un archivo `.env` en la carpeta `client/`
2. Agrega:
   ```env
   VITE_API_URL=https://hdc-server-1.onrender.com/api
   ```
3. Reinicia el servidor de desarrollo

### Build de Producción

```bash
# Compilar para producción
npm run build

# El cliente usará: https://hdc-server-1.onrender.com/api
```

## 🌐 Endpoints Disponibles

Tu API expone los siguientes endpoints:

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual

### Películas
- `GET /api/movies` - Listar películas
- `GET /api/movies/:id` - Detalle de película
- `GET /api/movies/search` - Buscar películas
- `GET /api/movies/trending` - Películas en tendencia
- `GET /api/movies/popular` - Películas populares

### Series TV
- `GET /api/tv` - Listar series
- `GET /api/tv/:id` - Detalle de serie
- `GET /api/tv/trending` - Series en tendencia
- `GET /api/tv/popular` - Series populares

### Usuarios
- `GET /api/users/profile` - Ver perfil
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/favorites/:movieId` - Agregar a favoritos
- `DELETE /api/users/favorites/:movieId` - Quitar de favoritos
- `GET /api/users/favorites` - Ver favoritos
- `POST /api/users/watchlist/:movieId` - Agregar a watchlist
- `DELETE /api/users/watchlist/:movieId` - Quitar de watchlist
- `GET /api/users/watchlist` - Ver watchlist

### Reseñas
- `POST /api/reviews` - Crear reseña
- `GET /api/reviews/movie/:movieId` - Reseñas de película
- `GET /api/reviews/my-reviews` - Mis reseñas
- `PUT /api/reviews/:id` - Actualizar reseña
- `DELETE /api/reviews/:id` - Eliminar reseña
- `POST /api/reviews/:id/like` - Dar like
- `DELETE /api/reviews/:id/like` - Quitar like

## 📚 Documentación Swagger

Puedes ver la documentación interactiva de la API en:

**[https://hdc-server-1.onrender.com/api-docs](https://hdc-server-1.onrender.com/api-docs)**

## 🔍 Verificar Configuración

### 1. En el Navegador

```javascript
// Abre la consola del navegador (F12)
// Verifica las llamadas a la API en la pestaña Network
// Deberían ir a: https://hdc-server-1.onrender.com/api
```

### 2. En el Código

```typescript
// src/services/api.ts
console.log('API URL:', API_URL);
```

## ⚠️ Consideraciones Importantes

### 1. Primera Carga Lenta
- Render (plan gratuito) se "duerme" después de 15 minutos de inactividad
- La primera request puede tardar ~50 segundos
- Las siguientes requests son rápidas

### 2. CORS
- La API ya tiene CORS habilitado con `cors()`
- Permite requests desde cualquier origen
- Si necesitas restringir, modifica `server/src/server.ts`

### 3. Autenticación
- El token JWT se guarda en `localStorage`
- Se envía automáticamente en cada request (header `Authorization`)
- Expira en 30 días

### 4. Manejo de Errores
- Error 401: Redirige automáticamente a `/login`
- Otros errores: Se propagan al componente

## 🧪 Probar la Configuración

```bash
# 1. Iniciar el cliente
npm run dev

# 2. Abrir en el navegador
# http://localhost:5173

# 3. Intentar:
#    - Ver películas (no requiere login)
#    - Registrarse
#    - Iniciar sesión
#    - Agregar a favoritos (requiere login)
#    - Crear reseña (requiere login)

# 4. Verificar en la consola del navegador
#    - Las llamadas deben ir a la API correcta
#    - No debe haber errores de CORS
```

## 📦 Desplegar en Vercel

Sigue la guía en `DEPLOY_VERCEL.md` para desplegar tu cliente en Vercel.

## 🎉 ¡Todo Listo!

Tu cliente ya está configurado para consumir la API de producción. 

**Próximos pasos:**
1. Prueba localmente con `npm run dev`
2. Verifica que todo funcione correctamente
3. Despliega en Vercel siguiendo `DEPLOY_VERCEL.md`
4. ¡Disfruta tu app en producción! 🍿🎬

---

**URLs Importantes:**
- 🌐 API: https://hdc-server-1.onrender.com
- 📚 Docs: https://hdc-server-1.onrender.com/api-docs
- 📖 Guía Deploy: DEPLOY_VERCEL.md

