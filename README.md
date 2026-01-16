# Recall.bio

A digital legacy platform that allows users to document their life story through daily responses (text, audio, video) to create an emotional archive for their families.

## Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict typing)
- **Backend/Database**: Supabase (Auth, PostgreSQL, Storage for media, Realtime)
- **Styling**: Tailwind CSS + Framer Motion
- **Components**: shadcn/ui
- **State/Data Fetching**: TanStack Query (React Query) + Server Actions
- **Internationalization**: next-intl (English default, Spanish support)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Configure Supabase:
   - Migrations are already applied in the `recallbio` schema
   - Create a Storage bucket named `media` (private) from Supabase dashboard
   - Configure Storage policies for authenticated uploads (see `SETUP.md`)

5. Run the development server:
   ```bash
   npm run dev
   ```

## Internationalization

The app supports multiple languages:
- **English (en)** - Default language
- **Spanish (es)**

Routes are automatically prefixed with locale (e.g., `/en/app/today` or `/es/app/today`). The default locale (`en`) can be accessed without prefix.

### Adding New Languages

1. Add locale to `src/i18n/config.ts` and `src/i18n/routing.ts`
2. Create translation file in `messages/{locale}.json`
3. Copy structure from `messages/en.json` and translate

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── (app)/         # Authenticated routes
│   │   │   ├── today/     # Daily prompt
│   │   │   ├── memories/  # List and detail of memories
│   │   │   ├── legacy/    # Heir management
│   │   │   └── settings/  # Settings
│   │   └── auth/          # Authentication pages
│   └── layout.tsx         # Root layout (redirects to /en)
├── components/
│   ├── memories/          # Memory components
│   ├── recording/         # Audio/video recorders
│   └── legacy/            # Legacy components
├── lib/
│   ├── supabase/          # Supabase clients (server/client)
│   └── prompts/           # Daily prompt logic
├── server/
│   └── actions/          # Server Actions
├── i18n/                 # Internationalization config
└── messages/             # Translation files
```

## MVP Features

- ✅ Authentication with Supabase (email/password)
- ✅ Onboarding with life stage and timezone
- ✅ Daily prompt system (stable assignment)
- ✅ Memory creation (text + audio)
- ✅ Memory list and detail views
- ✅ Legacy management (invite heirs, activate access)
- ✅ Basic audit logging
- ✅ Multi-language support (English/Spanish)

## Next Steps (V1.5)

- Video recording
- Enhanced hybrid prompt engine
- Dashboard with statistics
- Stripe subscription integration
- Hybrid legacy (inactivity + verification)

## Notes

- Database schema is isolated in `recallbio` to avoid conflicts
- RLS policies are configured for maximum privacy
- Storage bucket must be created manually from Supabase dashboard
- All user-facing text is internationalized

## Documentation

- `SETUP.md` - Detailed setup guide
- `I18N_MIGRATION.md` - Internationalization migration status
