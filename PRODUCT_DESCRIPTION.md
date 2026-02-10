# Recall.bio — Descripción General del Producto

## Propuesta de valor

**Recall.bio** es una plataforma de legado digital que ayuda a las personas a documentar su historia de vida a través de respuestas diarias (texto, audio, imágenes y en el futuro video), construyendo un **archivo emocional** que ellas mismas y las personas que elijan podrán atesorar para siempre.

### El problema

- **Las historias se diluyen**: momentos importantes, conversaciones significativas y aprendizajes que definen quién somos se pierden con el tiempo.
- **Los aprendizajes se olvidan**: las lecciones de vida no quedan escritas ni compartidas de forma estructurada.
- **La voz se pierde en el tiempo**: sin documentarla, la forma única de cada persona de expresarse y contar su historia desaparece.

### La solución

Recall.bio permite **preservar la historia un día a la vez**:

- **Preguntas diarias**: cada día se recibe una pregunta única, diseñada para inspirar reflexión y conexión personal.
- **Audio, texto e imágenes**: documentar recuerdos en texto, grabar la voz (con transcripción automática) o adjuntar fotos para conservar emoción, tono y recuerdos visuales.
- **Compartir el legado**: el usuario elige con quién compartir sus recuerdos y cuándo activar el acceso.
- **Privacidad total**: los recuerdos están protegidos; solo el usuario controla quién tiene acceso.

### Eslogan

*«Tu vida, tu voz, tu legado.»*

---

## Tecnología

| Área | Stack |
|------|--------|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript (tipado estricto) |
| **Backend / BD** | Supabase (Auth, PostgreSQL, Storage para medios, Realtime) |
| **Estilos** | Tailwind CSS 4 + Framer Motion |
| **Componentes** | shadcn/ui, Lucide React |
| **Estado / datos** | TanStack Query (React Query) + Server Actions |
| **Internacionalización** | next-intl (inglés por defecto, español) |

### Infraestructura y seguridad

- **Supabase Auth**: registro e inicio de sesión por email/contraseña.
- **PostgreSQL**: perfiles, preguntas, prompts diarios, recuerdos, medios, herederos y auditoría.
- **Supabase Storage**: bucket privado `media` para audio e imágenes (y en el futuro video); rutas `user/{user_id}/memories/{memory_id}/`.
- **RLS (Row Level Security)**: políticas por usuario para `memories`, `memory_media`, `profiles`, `daily_prompts`, `legacy_access`, etc.
- **Variables de entorno**: credenciales de Supabase en `.env.local` (nunca en código).

---

## Funcionalidades principales

### 1. Autenticación

- Registro e inicio de sesión con email y contraseña.
- Páginas de login y signup localizadas (en/es).
- Logout y configuración de contraseña en Ajustes.

### 2. Onboarding

- Flujo guiado en dos pasos:
  - **Etapa de vida**: teen, young_adult, adult, midlife, senior (para personalizar preguntas).
  - **Zona horaria**: para asignar correctamente el «día» de cada usuario.
- Guardado en `profiles`; redirección a la app tras completar.

### 3. Preguntas diarias (Today)

- **Asignación estable**: misma pregunta por usuario y fecha (seed `userId:isoDate`).
- **Personalización**: preguntas ponderadas por `life_stage` del perfil.
- **Múltiples prompts por día**: el usuario puede pedir una pregunta nueva si lo permite la configuración.
- Preguntas con soporte **bilingüe** (`text`, `text_es`) según locale.

### 4. Recuerdos (Memories)

- **Creación** desde la pregunta del día:
  - **Texto**: compositor con textarea.
  - **Audio**: grabación en navegador (WebM/Opus), reproducción, borrado y re-grabación.
  - **Imágenes**: hasta 5 fotos por memoria (5 MB cada una, 20 MB total); formatos JPEG, PNG, WebP. Previsualización, validaciones y eliminación antes de guardar.
- **Estado de ánimo**: happy, grateful, contemplative, nostalgic, peaceful, excited (opcional).
- **Almacenamiento**: `memories` (texto, mood, `question_id`, etc.) y `memory_media` + Storage para audio e imágenes.
- **Listado**: vista de recuerdos con fecha, extracto, mood.
- **Detalle**: vista individual de un recuerdo con reproductor de audio si aplica, **transcripción** del audio y **galería de imágenes** con lightbox.
- **Transcripción de audio**: grabaciones de voz se transcriben automáticamente (Gemini) con soporte multiidioma (en, es, pt, fr, de, it, zh, ja, ko, ar). Límites por plan. Estados: pendiente, procesando, completado, fallido.

### 5. Legado (Legacy)

- **Invitar herederos**: email + relación (ej. hijo, hija, amigo).
- **Estados**: invitado → aceptado → activado / revocado.
- **Modos de liberación**: por decisión manual (activar acceso) o por inactividad (roadmap).
- **Vista dual**: «Mis herederos» (invitaciones enviadas) y «Legados que recibí» (invitaciones aceptadas).
- Confirmaciones antes de activar o revocar acceso.

### 6. Ajustes (Settings)

- **Perfil**: nombre, etapa de vida, zona horaria.
- **Contraseña**: cambio de contraseña.
- **Transcripción**: idioma preferido para transcripción y uso mensual por plan.
- **Cerrar sesión**: sección dedicada.

### 6.1 Planes y feature flags

- **Planes**: `free`, `pro` (y futuros) definidos en `plan_features`. Control por feature key (ej. `transcription`).
- **Feature flags**: habilitación y límites por plan (`enabled`, `limit_value`). Overrides por usuario en `user_feature_overrides`.
- **Uso mensual**: control de cuotas (ej. transcripciones/mes) con `getMonthlyFeatureUsage` y `getFeatureLimit`.

### 7. Internacionalización (i18n)

- **Idiomas**: inglés (por defecto) y español.
- Rutas con locale: `/en/...`, `/es/...` (en sin prefijo).
- Traducciones en `messages/en.json` y `messages/es.json` para marketing, app, errores, etc.
- Selector de idioma en landing y en la app.

### 8. Marketing y landing

- **Hero**: eslogan, CTAs «Comenzar» / «Iniciar sesión».
- **Problema**: vida que pasa rápido, historias que se pierden.
- **Solución**: preguntas diarias, audio/texto, compartir legado, privacidad.
- **Cómo funciona**: registro → responder diario → construir archivo → compartir cuando se quiera.
- **Testimonios** y **FAQ**.
- **SEO**: Open Graph, Twitter card, `sitemap.xml`, `robots.txt`.

### 9. Otros

- **Dashboard**: redirige a `/app/today` (hub principal).
- **Auditoría**: logging básico de acciones relevantes.
- **Analytics**: integración con Google Analytics y eventos (ej. CTAs).
- **Responsive**: diseño adaptable y accesible.

---

## Roadmap (resumen)

- **MVP (actual)**: auth, onboarding, prompts diarios, recuerdos texto+audio+imágenes, transcripción de audio, planes y feature flags, legado con herederos, i18n.
- **V1.5 (previsto)**: grabación de video, motor híbrido de preguntas, dashboard con estadísticas, Stripe, legado híbrido (inactividad + verificación).

---

## Resumen ejecutivo

Recall.bio combina **preguntas diarias reflexivas**, **documentación en texto, voz e imágenes** (con transcripción automática de audio) y **control sobre el legado digital** para que cualquier persona pueda construir, con poco esfuerzo diario, un archivo emocional propio y compartirlo solo con quien elija, con **privacidad** y **seguridad** desde el primer día.
