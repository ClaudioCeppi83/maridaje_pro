# Maridaje Pro 🍷

![Version](https://img.shields.io/badge/version-1.2-blue.svg)

Maridaje Pro es una aplicación innovadora que utiliza IA para encontrar el maridaje de vino perfecto para cualquier plato. Describe tu comida y nuestra sommelier inteligente te proporcionará una recomendación curada.

## ✨ Características

- **Bring Your Own Key (BYOK)**: Integración con la cuota personal del usuario mediante Google OAuth.
- **IA de Vanguardia**: Utiliza **Gemini 2.5 Flash** para recomendaciones rápidas y precisas.
- **Autenticación con Google**: Inicio de sesión seguro para utilizar tus propias credenciales de IA.
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
- **Autenticación**: [Auth.js (NextAuth v5)](https://authjs.dev/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/), Lottie.

## ⚙️ Configuración del Entorno

Para ejecutar este proyecto localmente, necesitas las siguientes variables de entorno en un archivo `.env`:

```env
AUTH_GOOGLE_ID=tu_cliente_id_de_google
AUTH_GOOGLE_SECRET=tu_secreto_de_google
AUTH_SECRET=tu_secreto_de_autenticacion
AUTH_TRUST_HOST=true
```

## 🚀 Despliegue

La aplicación está lista para ser desplegada en plataformas como **Netlify** o **Vercel**.

## 📄 Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.
