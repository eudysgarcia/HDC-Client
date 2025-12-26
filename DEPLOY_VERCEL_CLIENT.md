# 🚀 Deploy del Cliente en Vercel

## Requisitos Previos
- ✅ Cuenta en GitHub
- ✅ Cuenta en Vercel (https://vercel.com - login con GitHub)
- ✅ Repositorio del cliente en GitHub

---

## 📋 Paso 1: Preparar el Proyecto

### 1.1 Asegúrate de tener el archivo `.env.example`:

```env
VITE_API_URL=https://hdc-server-1.onrender.com/api
```

### 1.2 Verifica que el `.gitignore` esté correcto:

```
node_modules
.env
.env.local
dist
dist-ssr
*.local
```

### 1.3 Asegúrate de que `package.json` tenga los scripts correctos:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 🌐 Paso 2: Deploy en Vercel

### Opción A: Deploy desde la Web (Más Fácil)

1. **Ir a Vercel**:
   - Ve a https://vercel.com
   - Click en "Sign Up" o "Log In" con GitHub

2. **Importar Proyecto**:
   - Click en "Add New..." → "Project"
   - Selecciona tu repositorio del cliente de GitHub
   - Click en "Import"

3. **Configurar el Proyecto**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables de Entorno**:
   - Click en "Environment Variables"
   - Agregar:
     ```
     Name: VITE_API_URL
     Value: https://hdc-server-1.onrender.com/api
     ```
   - Click en "Add"

5. **Deploy**:
   - Click en "Deploy"
   - Espera 2-3 minutos ⏳
   - ¡Listo! 🎉

### Opción B: Deploy desde CLI

1. **Instalar Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd client
vercel
```

4. **Seguir las instrucciones**:
```
? Set up and deploy "~/client"? Y
? Which scope? [Tu cuenta]
? Link to existing project? N
? What's your project's name? cinetalk-client
? In which directory is your code located? ./
? Want to override the settings? N
```

5. **Configurar variables de entorno**:
```bash
vercel env add VITE_API_URL production
# Pegar: https://hdc-server-1.onrender.com/api
```

6. **Deploy a producción**:
```bash
vercel --prod
```

---

## 🔄 Paso 3: Configurar Deploy Automático

Vercel automáticamente:
- ✅ Deploy cada vez que haces `git push` a `main`
- ✅ Preview deploys para cada Pull Request
- ✅ Actualización instantánea del sitio

---

## 🌍 Paso 4: Acceder a tu Aplicación

Vercel te dará una URL como:
```
https://cinetalk-client.vercel.app
```

También puedes configurar un dominio personalizado gratis.

---

## ⚙️ Configuración Avanzada

### Redirects para React Router

Crear `vercel.json` en la raíz del cliente:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Esto asegura que React Router funcione correctamente en todas las rutas.

---

## 🔧 Variables de Entorno

### Producción:
```env
VITE_API_URL=https://hdc-server-1.onrender.com/api
```

### Preview (opcional):
```env
VITE_API_URL=https://hdc-server-1.onrender.com/api
```

### Development (local):
```env
VITE_API_URL=http://localhost:5002/api
```

---

## 📊 Monitoreo

En el Dashboard de Vercel puedes ver:
- 📈 Analytics
- 🐛 Error logs
- 🚀 Deploy history
- 📊 Performance metrics

---

## 🔒 CORS - Configurar en el Servidor

Asegúrate de que tu servidor en Render acepte peticiones desde Vercel:

En `server/src/server.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:5173',
  'https://cinetalk-client.vercel.app', // Tu URL de Vercel
  'https://tudominio.com' // Si tienes dominio personalizado
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

Luego redeploy el servidor en Render.

---

## ✅ Checklist Final

Antes de compartir tu app:

- [ ] Cliente desplegado en Vercel
- [ ] Servidor desplegado en Render
- [ ] Variables de entorno configuradas
- [ ] CORS configurado correctamente
- [ ] React Router funcionando (todas las rutas)
- [ ] Autenticación funcionando
- [ ] Imágenes cargando correctamente
- [ ] Notificaciones funcionando
- [ ] Responsive en móvil

---

## 🎉 ¡Listo!

Tu aplicación ya está en línea y lista para compartir:

```
🌐 Cliente: https://cinetalk-client.vercel.app
🔧 API: https://hdc-server-1.onrender.com
```

---

## 🆘 Solución de Problemas

### Error: "Failed to fetch"
- ✅ Verifica que `VITE_API_URL` esté configurado
- ✅ Verifica que el servidor en Render esté corriendo
- ✅ Verifica CORS en el servidor

### Error: "404 on refresh"
- ✅ Agrega `vercel.json` con rewrites (ver arriba)

### Error: "Environment variable not found"
- ✅ Configura `VITE_API_URL` en Vercel Dashboard
- ✅ Redeploy después de agregar variables

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Router on Vercel](https://vercel.com/guides/deploying-react-with-vercel)

