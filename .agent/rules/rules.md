---
trigger: always_on
---

# Maridaje Pro: Project Standards & Vibe

Este proyecto es una aplicación de alta gama para maridaje de vinos y gastronomía, utilizando IA (Genkit/Gemini) y Firebase.

## 1. Identidad Visual (Organic Minimalist)

- **Filosofía**: "Calidez Estructurada". Estética limpia tipo Apple pero con alma.
- **UI/UX**:
  - **Bordes**: `rounded-xl` o `rounded-2xl` por defecto (estilo orgánico).
  - **Componentes**: Tarjetas (Bento Grid) para resúmenes. Botones grandes y táctiles (mínimo 44px).
  - **Animaciones**: Uso mandatorio de `framer-motion` con curvas "Spring" (muelle suave). Feedback táctil (`scale: 0.98`) al pulsar.
  - **Mobile-First**: El 90% del uso será en móviles durante cenas o catas.

## 2. Stack Tecnológico & Calidad

- **Frontend**: Next.js (App Router) + Tailwind CSS + Radix UI.
- **IA Integration**: Enfoque **BYOK** (Bring Your Own Key). Gestionar la `GOOGLE_API_KEY` del usuario de forma segura, nunca hardcodearla.
- **Backend**: Firebase (v9+ modular). Reglas de seguridad estrictas (`request.auth != null`).
- **Código**:
  - **Principio DRY**: Extraer lógica de maridaje o llamadas a IA en servicios/hooks reutilizables.
  - **Indentación**: Tabulaciones (Tab).
  - **Tipado**: TypeScript estricto. Zod para validación de esquemas e inputs.

## 3. Gestión y Documentación (Clarity over Chaos)

- **TODO.md**: Fuente de la verdad. Mantener actualizado el progreso.
- **README.md**: Documentación viva. Actualizar con cada feature mayor.
- **Logs**: Prohibido `console.log` en producción. Usar logs estructurados si es necesario.
- **Limpieza**: Eliminar archivos temporales o código muerto inmediatamente.

## 4. Git & Workflow

1. Revisar codigo y limpiar codigo que no se use y redundancias.
2. Revisar comentarios: agregar, editar y/o eliminar segun convenciones y buenas practicas.
3. Revisar gitignore.
4. Limpieza de logs/comentarios temporales.
5. Typecheck (`npm run typecheck`).
6. Commit Semántico (`feat:`, `fix:`, `docs:`, `refactor:`).
7. Sincronización proactiva.
