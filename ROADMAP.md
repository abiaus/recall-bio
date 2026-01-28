# Recall.bio — Roadmap de Desarrollo

> Última actualización: Enero 2026

Este documento describe el roadmap completo de desarrollo de Recall.bio, organizado en fases con historias de usuario y tareas específicas.

---

## Índice

- [Fase 0: MVP (Completado)](#fase-0-mvp-completado)
- [Fase 1: Polish y Quick Wins](#fase-1-polish-y-quick-wins)
- [Fase 2: Monetización](#fase-2-monetización)
- [Fase 3: Features PRO](#fase-3-features-pro)
- [Fase 4: Plataforma Enterprise](#fase-4-plataforma-enterprise)

---

## Fase 0: MVP (Completado)

**Estado:** ✅ Completado

### Funcionalidades implementadas

- Autenticación (email/password) con Supabase Auth
- Onboarding (life_stage, timezone)
- Preguntas diarias personalizadas por etapa de vida
- Memorias con texto y audio (WebM/Opus)
- Sistema de legado (invitar herederos)
- Internacionalización (inglés/español)
- Landing page con SEO básico

---

## Fase 1: Polish y Quick Wins

**Estado:** 🔲 Pendiente  
**Prioridad:** Alta  
**Complejidad:** Baja

### Historia 1.1: Logo y Branding

> **Como** visitante o usuario,  
> **quiero** ver un logo profesional y favicon consistente,  
> **para** reconocer la marca y tener una experiencia pulida.

#### Tareas

- [x] **1.1.1** Diseñar/obtener logo oficial de Recall.bio
- [x] **1.1.2** Generar `favicon.ico` (16x16, 32x32, 48x48)
- [x] **1.1.3** Crear `apple-touch-icon.png` (180x180)
- [x] **1.1.4** Crear iconos PWA `public/icons/icon-192x192.png`
- [x] **1.1.5** Crear iconos PWA `public/icons/icon-512x512.png`
- [x] **1.1.6** Actualizar `public/manifest.json` con iconos correctos
- [x] **1.1.7** Verificar que favicon aparece en todas las páginas

**Archivos afectados:**
- `public/favicon.ico` (nuevo)
- `public/apple-touch-icon.png` (nuevo)
- `public/icons/` (nuevo directorio)
- `public/manifest.json`

---

### Historia 1.2: OG Image

> **Como** usuario que comparte en redes sociales,  
> **quiero** que el preview tenga una imagen atractiva con el logo,  
> **para** que mis contactos vean de qué trata Recall.bio.

#### Tareas

- [x] **1.2.1** Mejorar diseño de `opengraph-image.tsx`
- [x] **1.2.2** Incorporar logo en la imagen OG
- [x] **1.2.3** Ajustar colores y tipografía según branding
- [x] **1.2.4** Verificar preview en Facebook Debugger
- [x] **1.2.5** Verificar preview en Twitter Card Validator
- [x] **1.2.6** Actualizar `twitter-image.tsx` con mismo diseño

**Archivos afectados:**
- `src/app/[locale]/opengraph-image.tsx`
- `src/app/[locale]/twitter-image.tsx`

---

### Historia 1.3: Detección Automática de Idioma

> **Como** usuario hispanohablante,  
> **quiero** que la app detecte mi idioma automáticamente,  
> **para** no tener que cambiar manualmente a español.

#### Tareas

- [x] **1.3.1** Agregar `localeDetection: true` en `src/i18n/routing.ts`
- [x] **1.3.2** Verificar que middleware no interfiere con detección
- [x] **1.3.3** Probar con navegador en español (Accept-Language: es)
- [x] **1.3.4** Probar con navegador en inglés (Accept-Language: en)
- [x] **1.3.5** Verificar que cookie guarda preferencia
- [x] **1.3.6** Documentar comportamiento en I18N_MIGRATION.md

**Archivos afectados:**
- `src/i18n/routing.ts`
- `src/middleware.ts` (verificar)
- `I18N_MIGRATION.md` (actualizar)

---

### Historia 1.4: Feedback de Preguntas

> **Como** usuario,  
> **quiero** indicar si me gustó o no la pregunta del día,  
> **para** ayudar a mejorar la selección de preguntas futuras.

#### Tareas

- [x] **1.4.1** Crear migración SQL para tabla `question_feedback`
  ```sql
  CREATE TABLE question_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL,
    question_id UUID REFERENCES questions NOT NULL,
    rating TEXT CHECK (rating IN ('up', 'down')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, question_id)
  );
  ```
- [x] **1.4.2** Agregar políticas RLS para `question_feedback`
- [x] **1.4.3** Crear componente `QuestionFeedback.tsx`
- [x] **1.4.4** Crear server action `submitQuestionFeedback`
- [x] **1.4.5** Integrar en `TodayHero.tsx`
- [x] **1.4.6** Mostrar estado visual cuando ya se dio feedback
- [x] **1.4.7** Usar feedback para ajustar pesos de preguntas (opcional)

**Archivos afectados:**
- `scripts/migration_question_feedback.sql` (nuevo)
- `src/components/today/QuestionFeedback.tsx` (nuevo)
- `src/server/actions/questionFeedback.ts` (nuevo)
- `src/components/today/TodayHero.tsx`

---

## Fase 2: Monetización

**Estado:** 🔲 Pendiente  
**Prioridad:** Alta  
**Complejidad:** Alta

### Historia 2.1: Integración con Stripe

> **Como** empresa,  
> **quiero** procesar pagos de suscripciones con Stripe,  
> **para** monetizar el producto de forma segura.

#### Tareas

- [ ] **2.1.1** Instalar dependencias: `stripe`, `@stripe/stripe-js`
- [ ] **2.1.2** Configurar variables de entorno Stripe
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] **2.1.3** Crear `src/lib/stripe/client.ts` (cliente servidor)
- [ ] **2.1.4** Crear `src/lib/stripe/stripe-js.ts` (cliente browser)
- [ ] **2.1.5** Crear API route `src/app/api/stripe/webhook/route.ts`
- [ ] **2.1.6** Crear API route `src/app/api/stripe/checkout/route.ts`
- [ ] **2.1.7** Crear API route `src/app/api/stripe/portal/route.ts`
- [ ] **2.1.8** Crear productos y precios en Stripe Dashboard
  - Producto: "Recall Pro"
  - Precio mensual: $9.99/mes
  - Precio anual: $99/año
- [ ] **2.1.9** Probar webhook localmente con Stripe CLI

**Archivos afectados:**
- `package.json`
- `.env.local`
- `src/lib/stripe/` (nuevo directorio)
- `src/app/api/stripe/` (nuevo directorio)

---

### Historia 2.2: Sistema de Suscripciones

> **Como** sistema,  
> **quiero** rastrear el estado de suscripción de cada usuario,  
> **para** controlar el acceso a funcionalidades premium.

#### Tareas

- [ ] **2.2.1** Crear migración SQL para tabla `subscriptions`
  ```sql
  CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
    status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  ```
- [ ] **2.2.2** Agregar políticas RLS para `subscriptions`
- [ ] **2.2.3** Crear función para sincronizar webhook → DB
- [ ] **2.2.4** Manejar eventos: `checkout.session.completed`
- [ ] **2.2.5** Manejar eventos: `customer.subscription.updated`
- [ ] **2.2.6** Manejar eventos: `customer.subscription.deleted`
- [ ] **2.2.7** Crear helper `getUserSubscription(userId)`
- [ ] **2.2.8** Crear hook `useSubscription()` para cliente

**Archivos afectados:**
- `scripts/migration_subscriptions.sql` (nuevo)
- `src/lib/stripe/webhooks.ts` (nuevo)
- `src/lib/subscription/` (nuevo directorio)

---

### Historia 2.3: Sistema de Feature Flags

> **Como** admin,  
> **quiero** controlar qué funcionalidades tiene cada plan,  
> **para** ajustar la oferta sin cambiar código.

#### Tareas

- [ ] **2.3.1** Crear migración SQL para tabla `plan_features`
  ```sql
  CREATE TABLE plan_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan TEXT NOT NULL,
    feature_key TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    limit_value INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(plan, feature_key)
  );
  ```
- [ ] **2.3.2** Insertar features iniciales (free vs pro)
- [ ] **2.3.3** Crear `src/lib/features/checkFeature.ts`
- [ ] **2.3.4** Crear `src/lib/features/getFeatureLimit.ts`
- [ ] **2.3.5** Crear hook `useFeatureAccess(featureKey)`
- [ ] **2.3.6** Crear componente `FeatureGate.tsx`
- [ ] **2.3.7** Crear componente `UpgradePrompt.tsx`

**Features a configurar:**

| Feature Key | Free | Pro |
|-------------|------|-----|
| `memories_per_month` | 10 | ∞ |
| `audio_recording` | ✅ | ✅ |
| `video_recording` | ❌ | ✅ |
| `transcription` | ❌ | ✅ |
| `export_pdf` | ❌ | ✅ |
| `legacy_heirs` | 1 | 5 |

**Archivos afectados:**
- `scripts/migration_plan_features.sql` (nuevo)
- `src/lib/features/` (nuevo directorio)
- `src/components/subscription/FeatureGate.tsx` (nuevo)
- `src/components/subscription/UpgradePrompt.tsx` (nuevo)

---

### Historia 2.4: Página de Pricing

> **Como** visitante,  
> **quiero** ver los planes y precios disponibles,  
> **para** decidir si me suscribo al plan Pro.

#### Tareas

- [ ] **2.4.1** Crear página `src/app/[locale]/pricing/page.tsx`
- [ ] **2.4.2** Crear componente `PricingCard.tsx`
- [ ] **2.4.3** Crear componente `PricingToggle.tsx` (mensual/anual)
- [ ] **2.4.4** Crear componente `PricingFeatureList.tsx`
- [ ] **2.4.5** Mostrar descuento del 17% en plan anual
- [ ] **2.4.6** Integrar botón "Suscribirse" con Stripe Checkout
- [ ] **2.4.7** Agregar link a Pricing en navbar
- [ ] **2.4.8** Agregar traducciones en/es
- [ ] **2.4.9** Agregar sección de FAQ de pricing

**Diseño sugerido:**
```
┌─────────────────┐  ┌─────────────────────┐
│      FREE       │  │   PRO ⭐ Popular    │
│   $0/siempre    │  │  $9.99/mes          │
│                 │  │  $99/año (ahorra 17%)│
├─────────────────┤  ├─────────────────────┤
│ ✓ 10 memorias   │  │ ✓ Memorias ilimitadas│
│ ✓ Audio         │  │ ✓ Audio + Video     │
│ ✗ Video         │  │ ✓ Transcripción IA  │
│ ✗ Transcripción │  │ ✓ Exportar PDF      │
│ ✓ 1 heredero    │  │ ✓ 5 herederos       │
├─────────────────┤  ├─────────────────────┤
│ [Comenzar]      │  │ [Suscribirse]       │
└─────────────────┘  └─────────────────────┘
```

**Archivos afectados:**
- `src/app/[locale]/pricing/page.tsx` (nuevo)
- `src/components/pricing/` (nuevo directorio)
- `messages/en.json` (actualizar)
- `messages/es.json` (actualizar)

---

## Fase 3: Features PRO

**Estado:** 🔲 Pendiente  
**Prioridad:** Media  
**Complejidad:** Media-Alta

### Historia 3.1: Transcripción de Audio

> **Como** usuario Pro,  
> **quiero** que mis audios se transcriban automáticamente,  
> **para** poder buscar y leer mis memorias sin escucharlas.

#### Tareas

- [ ] **3.1.1** Configurar API key de OpenAI
- [ ] **3.1.2** Crear migración para columnas en `memory_media`
  ```sql
  ALTER TABLE memory_media
  ADD COLUMN transcript TEXT,
  ADD COLUMN transcript_language TEXT,
  ADD COLUMN transcript_status TEXT DEFAULT 'pending';
  ```
- [ ] **3.1.3** Crear server action `transcribeAudio.ts`
- [ ] **3.1.4** Integrar llamada a Whisper API
- [ ] **3.1.5** Procesar transcripción async después de guardar
- [ ] **3.1.6** Mostrar transcripción en `MemoryDetail.tsx`
- [ ] **3.1.7** Mostrar estado "Transcribiendo..." mientras procesa
- [ ] **3.1.8** Permitir editar transcripción manualmente
- [ ] **3.1.9** Gate con `FeatureGate` para usuarios Pro

**Archivos afectados:**
- `scripts/migration_transcript.sql` (nuevo)
- `src/server/actions/transcribe.ts` (nuevo)
- `src/components/memories/TranscriptDisplay.tsx` (nuevo)
- `src/components/memories/MemoryDetail.tsx`

---

### Historia 3.2: Video en Memorias

> **Como** usuario Pro,  
> **quiero** grabar o subir videos para mis memorias,  
> **para** preservar momentos visuales de mi historia.

#### Tareas

- [ ] **3.2.1** Agregar tab "Video" en `MemoryComposer.tsx`
- [ ] **3.2.2** Crear componente `VideoRecorder.tsx`
- [ ] **3.2.3** Implementar grabación con MediaRecorder API
- [ ] **3.2.4** Crear componente `VideoUploader.tsx` (subir archivos)
- [ ] **3.2.5** Mostrar preview antes de guardar
- [ ] **3.2.6** Subir a Supabase Storage (bucket: media)
- [ ] **3.2.7** Guardar registro en `memory_media` con `kind: 'video'`
- [ ] **3.2.8** Crear componente `VideoPlayer.tsx`
- [ ] **3.2.9** Integrar reproductor en `MemoryDetail.tsx`
- [ ] **3.2.10** Generar thumbnail (Edge Function o servicio)
- [ ] **3.2.11** Limitar duración a 5 minutos / 100MB
- [ ] **3.2.12** Gate con `FeatureGate` para usuarios Pro

**Archivos afectados:**
- `src/components/memories/MemoryComposer.tsx`
- `src/components/recording/VideoRecorder.tsx` (nuevo)
- `src/components/recording/VideoUploader.tsx` (nuevo)
- `src/components/memories/VideoPlayer.tsx` (nuevo)
- `src/components/memories/MemoryDetail.tsx`

---

### Historia 3.3: Exportar Memorias

> **Como** usuario,  
> **quiero** descargar todas mis memorias,  
> **para** tener un backup personal de mi contenido.

#### Tareas

- [ ] **3.3.1** Agregar sección "Exportar datos" en Settings
- [ ] **3.3.2** Crear server action `exportMemories.ts`
- [ ] **3.3.3** Generar archivo JSON con todas las memorias
- [ ] **3.3.4** Incluir archivos de media en ZIP
- [ ] **3.3.5** Subir ZIP a Storage con URL temporal
- [ ] **3.3.6** Enviar email con link de descarga (24h expiry)
- [ ] **3.3.7** Mostrar progreso de exportación
- [ ] **3.3.8** Limitar a 1 export por día

**Archivos afectados:**
- `src/app/[locale]/app/settings/page.tsx`
- `src/server/actions/exportMemories.ts` (nuevo)
- `src/components/settings/ExportSection.tsx` (nuevo)

---

### Historia 3.4: Generar Libro/PDF

> **Como** usuario Pro,  
> **quiero** generar un libro PDF con mis memorias,  
> **para** tener un producto tangible de mi legado.

#### Tareas

- [ ] **3.4.1** Instalar `@react-pdf/renderer`
- [ ] **3.4.2** Crear página `src/app/[locale]/app/book/page.tsx`
- [ ] **3.4.3** Crear componente `BookGenerator.tsx`
- [ ] **3.4.4** Selector de memorias a incluir
- [ ] **3.4.5** Selector de template (Clásico, Moderno, Minimalista)
- [ ] **3.4.6** Crear componente `BookPreview.tsx`
- [ ] **3.4.7** Diseñar templates PDF:
  - Portada con nombre y fechas
  - Índice por fecha
  - Página por memoria (texto + transcripción)
  - Imágenes decorativas por mood
- [ ] **3.4.8** Crear server action `generateBook.ts`
- [ ] **3.4.9** Botón de descarga PDF
- [ ] **3.4.10** Gate con `FeatureGate` para usuarios Pro

**Archivos afectados:**
- `package.json`
- `src/app/[locale]/app/book/page.tsx` (nuevo)
- `src/components/book/` (nuevo directorio)
- `src/server/actions/generateBook.ts` (nuevo)

---

### Historia 3.5: Explorador de Preguntas

> **Como** usuario,  
> **quiero** explorar preguntas disponibles por categoría,  
> **para** elegir una que me inspire hoy.

#### Tareas

- [ ] **3.5.1** Crear página `src/app/[locale]/app/questions/page.tsx`
- [ ] **3.5.2** Crear componente `QuestionExplorer.tsx`
- [ ] **3.5.3** Crear componente `QuestionCard.tsx`
- [ ] **3.5.4** Implementar filtros por categoría (familia, carrera, etc.)
- [ ] **3.5.5** Mostrar indicador de preguntas ya respondidas
- [ ] **3.5.6** Botón "Usar esta pregunta hoy"
- [ ] **3.5.7** Integrar con `assignNextDailyPrompt`
- [ ] **3.5.8** Agregar link en navegación
- [ ] **3.5.9** Agregar traducciones en/es

**Archivos afectados:**
- `src/app/[locale]/app/questions/page.tsx` (nuevo)
- `src/components/questions/` (nuevo directorio)
- `src/components/ui/MobileNav.tsx`

---

## Fase 4: Plataforma Enterprise

**Estado:** 🔲 Pendiente  
**Prioridad:** Media  
**Complejidad:** Muy Alta

### Historia 4.1: Panel de Administración

> **Como** administrador,  
> **quiero** un dashboard con métricas y gestión,  
> **para** monitorear y administrar la plataforma.

#### Tareas

- [ ] **4.1.1** Agregar columna `role` a `profiles`
  ```sql
  ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' 
    CHECK (role IN ('user', 'admin', 'super_admin'));
  ```
- [ ] **4.1.2** Crear middleware de protección admin
- [ ] **4.1.3** Crear layout `src/app/[locale]/admin/layout.tsx`
- [ ] **4.1.4** Crear dashboard `src/app/[locale]/admin/page.tsx`
- [ ] **4.1.5** Métricas a mostrar:
  - Total usuarios (activos, nuevos)
  - Memorias creadas (total, por día)
  - Suscripciones (free vs pro)
  - Revenue (mensual, anual)
  - Retention rate
- [ ] **4.1.6** Crear página de gestión de usuarios
- [ ] **4.1.7** Crear página de gestión de suscripciones
- [ ] **4.1.8** Crear página de gestión de preguntas
- [ ] **4.1.9** Crear página de feature flags (editar plan_features)
- [ ] **4.1.10** Charts con Recharts o similar

**Archivos afectados:**
- `scripts/migration_admin_role.sql` (nuevo)
- `src/app/[locale]/admin/` (nuevo directorio)
- `src/middleware.ts`

---

### Historia 4.2: Notificaciones Diarias

> **Como** usuario,  
> **quiero** recibir un recordatorio diario,  
> **para** no olvidarme de documentar mis memorias.

#### Tareas

- [ ] **4.2.1** Crear tabla `notification_preferences`
  ```sql
  CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users,
    email_daily_reminder BOOLEAN DEFAULT true,
    push_daily_reminder BOOLEAN DEFAULT true,
    reminder_time TIME DEFAULT '09:00',
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```
- [ ] **4.2.2** Crear UI de preferencias en Settings
- [ ] **4.2.3** Integrar servicio de email (Resend/SendGrid)
- [ ] **4.2.4** Crear template de email de recordatorio
- [ ] **4.2.5** Crear Edge Function `daily-reminder`
- [ ] **4.2.6** Configurar cron job en Supabase
- [ ] **4.2.7** Respetar timezone del usuario
- [ ] **4.2.8** Implementar Web Push (Service Worker)
- [ ] **4.2.9** Solicitar permiso de notificaciones
- [ ] **4.2.10** Enviar push notification diaria

**Archivos afectados:**
- `scripts/migration_notifications.sql` (nuevo)
- `supabase/functions/daily-reminder/` (nuevo)
- `src/app/[locale]/app/settings/page.tsx`
- `public/sw.js` (nuevo o actualizar)

---

### Historia 4.3: Aplicación Mobile (Capacitor)

> **Como** usuario mobile,  
> **quiero** una app nativa en mi teléfono,  
> **para** documentar memorias de forma más conveniente.

#### Tareas

- [ ] **4.3.1** Instalar Capacitor
  ```bash
  npm install @capacitor/core @capacitor/cli
  npm install @capacitor/ios @capacitor/android
  ```
- [ ] **4.3.2** Inicializar proyecto: `npx cap init`
- [ ] **4.3.3** Crear `capacitor.config.ts`
- [ ] **4.3.4** Instalar plugins necesarios:
  - `@capacitor/push-notifications`
  - `@capacitor/camera`
  - `@capacitor/filesystem`
  - `@capacitor/share`
- [ ] **4.3.5** Configurar deep linking para auth
- [ ] **4.3.6** Crear splash screen y app icons
- [ ] **4.3.7** Configurar permisos (cámara, micrófono, notificaciones)
- [ ] **4.3.8** Agregar proyecto iOS: `npx cap add ios`
- [ ] **4.3.9** Agregar proyecto Android: `npx cap add android`
- [ ] **4.3.10** Detectar idioma del dispositivo
- [ ] **4.3.11** Integrar push notifications nativas
- [ ] **4.3.12** Build iOS y subir a TestFlight
- [ ] **4.3.13** Build Android y subir a Internal Testing
- [ ] **4.3.14** Publicar en App Store
- [ ] **4.3.15** Publicar en Google Play Store

**Archivos afectados:**
- `package.json`
- `capacitor.config.ts` (nuevo)
- `ios/` (nuevo directorio)
- `android/` (nuevo directorio)

---

## Diagrama de Dependencias

```
Fase 1 (Polish)
├── 1.1 Logo ─────────────┬──→ 1.2 OG Image
│                         └──→ 4.3 Mobile App (icons)
├── 1.3 Locale Detection
└── 1.4 Question Feedback

Fase 2 (Monetización)
├── 2.1 Stripe ───────────┬──→ 2.2 Subscriptions
│                         └──→ 4.1 Admin Panel
├── 2.2 Subscriptions ────┬──→ 2.3 Feature Flags
│                         └──→ 2.4 Pricing Page
└── 2.3 Feature Flags ────┬──→ 3.1 Transcription
                          ├──→ 3.2 Video
                          └──→ 3.4 Book/PDF

Fase 3 (Features PRO)
├── 3.1 Transcription ────┬──→ 3.4 Book/PDF
├── 3.2 Video
├── 3.3 Export ───────────┴──→ 3.4 Book/PDF
├── 3.4 Book/PDF
└── 3.5 Question Explorer

Fase 4 (Enterprise)
├── 4.1 Admin Panel (requiere 2.1, 2.3)
├── 4.2 Notifications ────────→ 4.3 Mobile App
└── 4.3 Mobile App (requiere 1.1, 4.2)
```

---

## Resumen de Esfuerzo

| Fase | Historias | Tareas | Complejidad |
|------|-----------|--------|-------------|
| 1    | 4         | ~25    | Baja        |
| 2    | 4         | ~40    | Alta        |
| 3    | 5         | ~50    | Media-Alta  |
| 4    | 3         | ~45    | Muy Alta    |
| **Total** | **16** | **~160** | - |

---

## Changelog

- **2026-01-27**: Creación inicial del roadmap
