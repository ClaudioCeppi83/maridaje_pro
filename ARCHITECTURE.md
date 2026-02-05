# Arquitectura de Maridaje Pro 🍷

## Visión General

Maridaje Pro es una aplicación web progresiva diseñada para democratizar el conocimiento de los sommeliers mediante Inteligencia Artificial. Utiliza un enfoque **BYOK (Bring Your Own Key)** para permitir a los usuarios finales utilizar sus propias cuotas de Google AI (Gemini).

## Stack Tecnológico

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript.
- **Estilos**: Tailwind CSS con sistema "Minimalismo Cálido" y Shadcn/UI.
- **IA**: Google AI Genkit para la orquestación de flujos de IA.
- **Backend (Serverless)**: Next.js Server Actions.
- **Base de Datos & Auth**: Firebase (Firestore para persistencia, Auth.js para autenticación con Google).

## Estructura de Carpetas (Arquitectura Pro-Soft)

- `src/app`: Rutas, layouts y server actions (`actions.ts`).
- `src/components`:
  - `/ui`: Componentes atómicos de Shadcn/UI (alta reusabilidad).
  - `/app`: Componentes de negocio específicos de la aplicación.
  - `/auth`: Lógica de sesión y componentes de protección.
- `src/ai`:
  - `/flows`: Definición de flujos Genkit (Zod schemas + prompts).
  - `genkit.ts`: Configuración global del plugin de Google AI.
- `src/lib`: Utilidades, configuraciones de Firebase y clientes de API.
- `src/types`: Definiciones de interfaces de TypeScript para base de datos y negocio.

## Flujos Clave

### Maridaje con BYOK

1. El usuario se autentica con Google OAuth.
2. El `accessToken` se recupera en las Server Actions.
3. Se invoca el flujo de Genkit pasando el token.
4. Si hay `accessToken`, se realiza una llamada REST directa a la API de Gemini (evitando el uso de la API Key del lado del servidor).
5. Si no hay token, se utiliza el flujo estándar de Genkit (fallback).

## Estándares de Calidad

- **Mobile-First**: Diseño optimizado prioritariamente para dispositivos móviles.
- **SEO**: Metadatos dinámicos y estructuras semánticas HTML5.
- **Seguridad**: Validación de esquemas con Zod en todas las entradas y salidas de la IA.
