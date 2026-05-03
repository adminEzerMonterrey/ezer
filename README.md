# EZER Web Platform

Plataforma web oficial para EZER, diseñada para dar a conocer la organización, reclutar voluntarios mediante eventos y gestionar solicitudes de colaboración de empresas aliadas. Incluye un panel de administración para gestionar el contenido de forma dinámica.

## 🚀 Tecnologías (Tech Stack)

Este proyecto está construido con herramientas modernas para asegurar un buen rendimiento y facilidad de mantenimiento:

- **Frontend:** React + TypeScript
- **Bundler / Build Tool:** Vite
- **Estilos:** CSS / Tailwind CSS
- **Base de Datos & Autenticación:** Supabase (PostgreSQL)
- **Backend / Serverless:** Vercel Serverless Functions (`/api`)
- **Manejo de Correos:** Nodemailer
- **Generación de Reportes:** XLSX (Exportación a Excel)

---

## 🛠 Instalación y Entorno de Desarrollo Local

Sigue estos pasos para correr el proyecto en tu computadora local.

### 1. Prerrequisitos
- Node.js (v18 o superior recomendado)
- Git

### 2. Clonar el repositorio
```bash
git clone https://github.com/ethanPRS/ezer.git
cd ezer
```

### 3. Instalar dependencias
Puedes usar `npm`, `pnpm` o `yarn`.
```bash
npm install
```

### 4. Variables de Entorno (`.env`)
Para que el proyecto funcione correctamente (tanto el frontend como las APIs de correo y base de datos), necesitas crear un archivo `.env` en la raíz del proyecto. **Nunca subas este archivo a GitHub.**

Pide las credenciales actuales al administrador y crea tu archivo `.env` con la siguiente estructura:

```env
# Configuración del Frontend (Supabase)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Configuración Backend / Vercel Serverless (Supabase y Correos)
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SMTP_USER=tu_correo_remitente@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
```

### 5. Iniciar el Servidor de Desarrollo
Para arrancar el frontend:
```bash
npm run dev
```

> **Nota importante sobre las APIs (`/api`):** 
> Si necesitas probar el envío de correos o exportar excel localmente, Vercel requiere que levantes el proyecto usando el Vercel CLI para simular el entorno serverless:
> ```bash
> npm install -g vercel
> vercel dev
> ```

---

## ☁️ Despliegue (Deploy) en Vercel

El proyecto está preparado para ser desplegado fácilmente en [Vercel](https://vercel.com/).

1. Conecta el repositorio de GitHub a Vercel.
2. Vercel detectará automáticamente que es un proyecto de Vite/React.
3. **Paso Crucial:** En la configuración de Vercel (Project Settings > Environment Variables), debes agregar todas las variables mencionadas en el paso 4.
4. Despliega (Deploy).

---

## 📁 Estructura Principal del Proyecto

- `/src/app/pages/`: Contiene las páginas principales (Home, Admin, etc.).
- `/src/app/components/`: Componentes reutilizables de UI (Navbars, Cards, Formularios).
- `/api/`: Serverless Functions de Vercel. Aquí vive la lógica de backend (ej. `interest.js` para los correos de voluntarios).
- `supabaseClient.ts`: Archivo de configuración que inicializa la conexión con la base de datos Supabase para el Frontend.

<!-- Deployment Trigger 2026-05-03 -->


