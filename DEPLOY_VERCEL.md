# 🚀 Guía de Despliegue del Cliente en Vercel

## Tu API ya está funcionando

✅ API Backend: [https://hdc-server-1.onrender.com](https://hdc-server-1.onrender.com)

## Configuración del Cliente

El cliente ya está configurado para usar automáticamente:
- **Desarrollo**: `http://localhost:5002/api`
- **Producción**: `https://hdc-server-1.onrender.com/api`

## 📋 Pasos para Desplegar en Vercel

### Opción 1: Desplegar desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   cd client
   git add .
   git commit -m "feat: Configurar cliente para API de producción"
   git push
   ```

2. **Importa en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Click en "Add New" → "Project"
   - Importa tu repositorio del **client**

3. **Configuración del Proyecto**
   ```
   Framework Preset:     Vite
   Root Directory:       (vacío si el client está en la raíz)
   Build Command:        npm run build
   Output Directory:     dist
   Install Command:      npm install
   ```

4. **Variables de Entorno** (Opcional)
   
   Si quieres sobrescribir la URL de la API:
   ```
   Name:  VITE_API_URL
   Value: https://hdc-server-1.onrender.com/api
   ```

5. **Deploy**
   - Click en "Deploy"
   - Espera 2-3 minutos
   - ¡Tu app estará en línea!

### Opción 2: Desplegar desde CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desde la carpeta client
cd client

# Login en Vercel
vercel login

# Deploy
vercel

# O directamente a producción
vercel --prod
```

## 🔧 Configuración de CORS

Tu API ya debe tener CORS habilitado. Si tienes problemas, verifica en `server/src/server.ts`:

```typescript
app.use(cors());
```

O configura dominios específicos:

```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://tu-app.vercel.app'
  ]
}));
```

## 📝 Verificar que Funciona

Después del deploy:

1. **Abre tu app en Vercel**
   ```
   https://tu-app.vercel.app
   ```

2. **Abre la consola del navegador** (F12)

3. **Verifica las llamadas a la API**
   - Deberían ir a `https://hdc-server-1.onrender.com/api`
   - No debería haber errores de CORS

4. **Prueba funcionalidades**:
   - ✅ Ver películas
   - ✅ Registrarse
   - ✅ Iniciar sesión
   - ✅ Agregar a favoritos
   - ✅ Crear reseñas

## 🌐 URLs Finales

Después del deploy tendrás:

```
Frontend (Vercel):  https://tu-app.vercel.app
Backend (Render):   https://hdc-server-1.onrender.com
API Docs:           https://hdc-server-1.onrender.com/api-docs
```

## ⚠️ Consideraciones Importantes

### 1. Primera Carga Lenta
- Render (plan gratuito) se "duerme" después de 15 minutos
- La primera request tarda ~50 segundos en despertar
- Solución: Usar un servicio de "keep-alive" o plan de pago

### 2. Variables de Entorno
- Vite requiere el prefijo `VITE_` en las variables
- Las variables se "queman" en el build (no son secretas)
- Nunca pongas secretos en variables del frontend

### 3. Redeploy Automático
- Vercel redespliega automáticamente en cada push a GitHub
- Puedes configurar deploys por rama (main = producción)

## 🔄 Actualizar el Deploy

```bash
# Hacer cambios en el código
git add .
git commit -m "feat: Nueva funcionalidad"
git push

# Vercel redesplegará automáticamente
```

## 📊 Monitoreo

### En Vercel Dashboard:
- Ver logs de build
- Ver analytics de tráfico
- Ver errores en tiempo real
- Configurar dominios personalizados

### En Render Dashboard:
- Ver logs de la API
- Monitorear uso de recursos
- Ver tiempo de respuesta

## 🎨 Dominio Personalizado (Opcional)

1. En Vercel Dashboard → Settings → Domains
2. Agrega tu dominio (ej: `cinetalk.com`)
3. Configura los DNS según las instrucciones
4. Actualiza CORS en el backend si es necesario

## 🆘 Solución de Problemas

### Error: "Network Error" o "Failed to fetch"
- Verifica que la API esté corriendo: https://hdc-server-1.onrender.com
- Revisa CORS en el backend
- Verifica la URL en `src/services/api.ts`

### Error: "401 Unauthorized"
- El token JWT expiró o es inválido
- Cierra sesión y vuelve a iniciar sesión

### Error: "Build failed"
- Ejecuta `npm run build` localmente
- Verifica que no haya errores de TypeScript
- Revisa los logs en Vercel Dashboard

### La API tarda mucho
- Es normal en el plan gratuito de Render
- Primera request después de 15 min tarda ~50 segundos
- Considera actualizar a plan de pago o usar keep-alive

## 📞 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Vite](https://vitejs.dev)
- [Tu API en Render](https://hdc-server-1.onrender.com)
- [Swagger Docs](https://hdc-server-1.onrender.com/api-docs)

## 🎉 ¡Listo!

Tu aplicación CineTalk está lista para el mundo. ¡Disfruta! 🍿🎬

