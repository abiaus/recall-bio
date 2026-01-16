# Recall.bio

Plataforma de legado digital que permite a los usuarios documentar su historia de vida mediante respuestas diarias (texto, audio, video) para crear un archivo emocional para sus familias.

## Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript (Tipado estricto)
- **Backend/Base de Datos**: Supabase (Auth, PostgreSQL, Storage para media, Realtime)
- **Estilizado**: Tailwind CSS + Framer Motion
- **Componentes**: shadcn/ui
- **Estado/Data Fetching**: TanStack Query (React Query) + Server Actions

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. Configura Supabase:
   - Las migraciones ya están aplicadas en el schema `recallbio`
   - Crea un bucket de Storage llamado `media` (privado) desde el dashboard de Supabase
   - Configura las políticas de Storage para permitir uploads autenticados

5. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Estructura del Proyecto

```
src/
├── app/
│   ├── (app)/          # Rutas autenticadas
│   │   ├── today/      # Prompt del día
│   │   ├── memories/   # Lista y detalle de recuerdos
│   │   ├── legacy/     # Gestión de herederos
│   │   └── settings/   # Configuración
│   ├── auth/           # Páginas de autenticación
│   └── page.tsx         # Landing page
├── components/
│   ├── memories/       # Componentes de recuerdos
│   ├── recording/      # Grabadores de audio/video
│   └── legacy/          # Componentes de legado
├── lib/
│   ├── supabase/       # Clientes de Supabase (server/client)
│   └── prompts/        # Lógica de prompts diarios
└── server/
    └── actions/        # Server Actions
```

## Funcionalidades MVP

- ✅ Autenticación con Supabase (email/password)
- ✅ Onboarding con etapa de vida y timezone
- ✅ Sistema de prompts diarios (asignación estable)
- ✅ Creación de recuerdos (texto + audio)
- ✅ Lista y detalle de recuerdos
- ✅ Gestión de legado (invitar herederos, activar acceso)
- ✅ Auditoría básica

## Próximos Pasos (V1.5)

- Video recording
- Prompt engine híbrido mejorado
- Dashboard con estadísticas
- Suscripción Stripe
- Legado híbrido (inactividad + verificación)

## Notas

- El schema de base de datos está aislado en `recallbio` para no interferir con otras tablas
- Las políticas RLS están configuradas para máxima privacidad
- El bucket de Storage debe crearse manualmente desde el dashboard de Supabase
