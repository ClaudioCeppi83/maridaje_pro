# Maridaje Pro 🍷

![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)

Maridaje Pro es una aplicación innovadora que utiliza IA para encontrar el maridaje de vino perfecto para cualquier plato. Describe tu comida y nuestra sommelier inteligente te proporcionará una recomendación curada basada en tus preferencias y tu bodega personal.

## ✨ Características

- **Bring Your Own Key (BYOK)**: Integración con la cuota personal del usuario mediante Google OAuth.
- **Perfil de Usuario**: Sincronización automática de perfil con Google y almacenamiento persistente en **Firestore**.
- **Mi Bodega**: Gestiona tu colección de vinos personal para recibir recomendaciones basadas en lo que ya tienes.
- **Historial de Maridajes**: Guarda tus recomendaciones favoritas para consultas futuras.
- **IA de Vanguardia**: Utiliza **Gemini 2.5 Flash** para recomendaciones rápidas y precisas.
- **Interfaz Premium**:
  - **Paleta de Colores Sofisticada**: Una mezcla de beige claro, verde salvia profundo y borgoña suave.
  - **Tipografía Moderna**: Uso de la fuente Inter para una legibilidad óptima.
  - **Diseño Adaptable**: Optimizado para móviles, tablets y escritorio.
- **Elementos Interactivos**:
  - **Animaciones Lottie**: Indicadores de carga fluidos.
  - **Transiciones Dinámicas**: Los resultados aparecen con animaciones suaves de revelado.

## 🛠️ Tecnologías Utilizadas

- **Core**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **IA**: [Google AI Genkit](https://firebase.google.com/docs/genkit), Gemini 2.5 Flash API.
- **Base de Datos**: [Firebase Firestore](https://firebase.google.com/products/firestore)
- **Autenticación**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/), Lottie.

## ⚙️ Configuración del Entorno

Para ejecutar este proyecto localmente, necesitas las siguientes variables de entorno en un archivo `.env`:

```env
# Google OAuth
AUTH_GOOGLE_ID=tu_cliente_id_de_google
AUTH_GOOGLE_SECRET=tu_secreto_de_google
AUTH_SECRET=tu_secreto_de_autenticacion
AUTH_TRUST_HOST=true

# Firebase Admin (Firestore)
GOOGLE_CLOUD_PROJECT=maridaje-pro-app-v1
FIREBASE_SERVICE_ACCOUNT='{ "type": "service_account", ... }'
```

## 🚀 Despliegue

La aplicación está optimizada y lista para ser desplegada en **Netlify**.

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.
