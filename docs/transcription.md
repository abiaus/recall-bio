# Configuración de Transcripción de Audio con Gemini

La transcripción de audios en Recall.bio usa **Google Gemini 2.0 Flash** para convertir las grabaciones de voz en texto. El flujo es asíncrono: cuando un usuario guarda un recuerdo con audio, se encola la transcripción y un worker (Edge Function + cron) la procesa en segundo plano.

---

## 1. Obtener una API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. En el menú, selecciona **"Get API key"** o **"API keys"**
4. Clic en **"Create API key"**
5. Elige un proyecto de Google Cloud (o crea uno nuevo)
6. Copia la clave generada y guárdala de forma segura

> **Importante:** No compartas la API key ni la subas a repositorios públicos. Gemini tiene un tier gratuito generoso para desarrollo; consulta [pricing](https://ai.google.dev/pricing) para uso en producción.

---

## 2. Variables de entorno locales (.env.local)

Para desarrollo local (si usas transcripción síncrona desde el servidor):

```
GEMINI_API_KEY=tu_api_key_de_gemini_aqui
```

Esta variable es **opcional** para el flujo principal: la transcripción en producción la hace la Edge Function, que usa sus propios secrets (paso 5).

---

## 3. Ejecutar migraciones en Supabase

En el **SQL Editor** de Supabase, ejecuta los scripts en este orden:

### 3.1 Schema y feature flags

```sql
-- Ejecuta el contenido de scripts/migration_transcription_feature.sql
```

Este script:
- Añade `plan` y `transcription_language` a `profiles`
- Añade columnas de transcript a `memory_media` (`transcript`, `transcript_status`, etc.)
- Crea `plan_features` y `user_feature_overrides` para feature flags
- Habilita transcripción para plan `pro` y la deshabilita para `free`

### 3.2 Límites por plan

```sql
-- Ejecuta el contenido de scripts/migration_transcription_plan_limits.sql
```

Este script:
- Asigna plan `free` a usuarios sin plan
- Define límites mensuales (p. ej. `free`: 0, `pro`: 200 transcripciones/mes)

### 3.3 Cron job (reemplaza los placeholders)

```sql
-- Ejecuta scripts/migration_transcription_cron.sql
```

**Antes de ejecutar**, edita el archivo y sustituye:

| Placeholder             | Reemplazar por                          |
|-------------------------|-----------------------------------------|
| `<SUPABASE_PROJECT_REF>`| El ref de tu proyecto (ej: `aesthjdavhfzieetesvm`) |
| `<SUPABASE_ANON_KEY>`   | Tu `anon` key de Supabase (Settings → API) |

Ejemplo:
- URL: `https://aesthjdavhfzieetesvm.supabase.co` → ref = `aesthjdavhfzieetesvm`
- La anon key está en **Project Settings → API → Project API keys → anon public**

---

## 4. Desplegar la Edge Function `transcribe-audio`

La Edge Function procesa audios encolados y llama a la API de Gemini.

### 4.1 Requisitos

- [Supabase CLI](https://supabase.com/docs/guides/cli) instalada
- Sesión iniciada: `supabase login`

### 4.2 Deploy

```bash
supabase functions deploy transcribe-audio --no-verify-jwt
```

`--no-verify-jwt` permite que el cron (pg_net) invoque la función sin un JWT de usuario.

### 4.3 Verificar

En **Supabase Dashboard → Edge Functions** debería aparecer `transcribe-audio` como desplegada.

---

## 5. Configurar Secrets en Supabase

La Edge Function necesita variables de entorno. Configúralas como secrets:

```bash
supabase secrets set GEMINI_API_KEY=tu_api_key_de_gemini
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

- **GEMINI_API_KEY**: La clave obtenida en el paso 1.
- **SUPABASE_SERVICE_ROLE_KEY**: En **Project Settings → API → service_role** (secret). Permite a la función acceder a Storage y a la base de datos.

> **Nota:** `SUPABASE_URL` se inyecta automáticamente. No necesitas configurarla como secret.

Para comprobar los secrets configurados:

```bash
supabase secrets list
```

---

## 6. Verificar que todo funciona

1. **Cron:** En Supabase SQL Editor:
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'transcribe_pending_audio';
   ```
   Debería mostrarse el job programado cada 2 minutos.

2. **Extensión pg_cron:** Si tu plan no incluye pg_cron, puede que necesites habilitarla desde el dashboard (Extensions).

3. **Prueba end-to-end:**
   - Crea un recuerdo con audio desde la app.
   - En `memory_media`, el registro debería tener `transcript_status = 'pending'`.
   - Espera unos minutos; el cron invocará la Edge Function.
   - Tras procesar, `transcript_status` pasará a `completed` y `transcript` tendrá el texto.

---

## Resumen del flujo

```
Usuario guarda memoria con audio
         ↓
queueMemoryTranscriptionAction (server action)
         ↓
memory_media.transcript_status = 'pending'
         ↓
pg_cron cada 2 min → POST /functions/v1/transcribe-audio
         ↓
Edge Function descarga audio, llama Gemini, guarda transcript
         ↓
transcript_status = 'completed'
```

---

## Modelo y idiomas

| Parámetro      | Valor por defecto |
|----------------|-------------------|
| Modelo Gemini  | `gemini-2.0-flash` |
| Idioma por defecto | `en` |

Idiomas soportados: `en`, `es`, `pt`, `fr`, `de`, `it`, `zh`, `ja`, `ko`, `ar`.

El idioma preferido se toma de **Settings** (`profiles.transcription_language`) o del encabezado de la solicitud.

---

## Troubleshooting

### "GEMINI_API_KEY no configurada"
- En local: verifica `.env.local`.
- En producción: ejecuta `supabase secrets set GEMINI_API_KEY=...`.

### transcripción en `failed`
- Revisa `memory_media.transcript_error`.
- Comprueba que la API key sea válida y tenga cuota disponible.
- Audios muy largos o formatos no soportados pueden fallar.

### El cron no ejecuta
- Comprueba que `pg_cron` y `pg_net` estén habilitados.
- Revisa la URL y la Authorization en el job (project ref y anon key correctos).

### Límite mensual excedido
- Los planes `free` tienen límite 0 (transcripción deshabilitada).
- Plan `pro`: 200 transcripciones/mes por defecto. Revisa `plan_features` y `getMonthlyFeatureUsage`.
