# ⚙️ Configuración de Variables de Entorno para Vercel

## 📋 Variables Requeridas

En el Dashboard de Vercel, configurar:

### Variable 1:
```
Name: VITE_API_URL
Value: https://hdc-server-1.onrender.com/api
Environment: Production, Preview, Development
```

---

## 🔧 Archivo .env Local (para desarrollo)

Crear archivo `.env` en la raíz del cliente:

```env
VITE_API_URL=http://localhost:5002/api
```

---

## 🌐 Archivo .env.production (opcional)

Si quieres tener configuración específica para producción:

```env
VITE_API_URL=https://hdc-server-1.onrender.com/api
```

---

## ✅ Verificación

Después de configurar, verifica que funcione:

1. En local:
   ```bash
   npm run dev
   # Debería conectarse a http://localhost:5002/api
   ```

2. En Vercel:
   ```bash
   vercel env ls
   # Debería mostrar VITE_API_URL configurado
   ```

---

## 🔄 Actualizar Variables

Si cambias la URL del API:

1. En Vercel Dashboard:
   - Settings → Environment Variables
   - Editar `VITE_API_URL`
   - Redeploy

2. Desde CLI:
   ```bash
   vercel env rm VITE_API_URL production
   vercel env add VITE_API_URL production
   vercel --prod
   ```


