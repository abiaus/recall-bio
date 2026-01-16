# Internacionalización (i18n) - Estado de Migración

## ✅ Completado

1. **Configuración base de next-intl**
   - ✅ Instalación de `next-intl`
   - ✅ Configuración de routing (`src/i18n/routing.ts`)
   - ✅ Configuración de request (`src/i18n/request.ts`)
   - ✅ Actualización de `next.config.ts`
   - ✅ Middleware integrado con next-intl

2. **Archivos de traducción**
   - ✅ `messages/en.json` - Inglés (idioma por defecto)
   - ✅ `messages/es.json` - Español

3. **Estructura de rutas**
   - ✅ `[locale]/layout.tsx` - Layout principal con NextIntlClientProvider
   - ✅ `[locale]/page.tsx` - Homepage traducida
   - ✅ `[locale]/(app)/layout.tsx` - Layout de app traducido
   - ✅ `[locale]/(app)/today/page.tsx` - Página de prompts diarios
   - ✅ `[locale]/(app)/onboarding/page.tsx` - Onboarding traducido
   - ✅ `[locale]/auth/login/page.tsx` - Login traducido
   - ✅ `[locale]/auth/signup/page.tsx` - Signup traducido

4. **Componentes actualizados**
   - ✅ `MemoryComposer` - Usa traducciones
   - ✅ `AudioRecorder` - Usa traducciones (parcial)

## 🔄 Pendiente

1. **Páginas faltantes**
   - ⏳ `[locale]/(app)/memories/page.tsx`
   - ⏳ `[locale]/(app)/memories/[id]/page.tsx`
   - ⏳ `[locale]/(app)/legacy/page.tsx`
   - ⏳ `[locale]/(app)/settings/page.tsx`
   - ⏳ `[locale]/(app)/dashboard/page.tsx`

2. **Componentes pendientes**
   - ⏳ `MemoryList` - Actualizar para usar traducciones
   - ⏳ `MemoryCard` - Actualizar para usar traducciones
   - ⏳ `MemoryDetail` - Actualizar para usar traducciones
   - ⏳ `LegacyManager` - Actualizar para usar traducciones

3. **Metadata y SEO**
   - ⏳ Actualizar metadata en `[locale]/layout.tsx` para inglés
   - ⏳ Agregar metadata dinámico por idioma

4. **Mejoras**
   - ⏳ Selector de idioma en la UI
   - ⏳ Detección automática de idioma del navegador
   - ⏳ Persistencia de preferencia de idioma

## 📝 Notas

- El idioma por defecto es **inglés (en)**
- Las rutas sin locale redirigen a `/en`
- Los Links deben usar `Link` de `@/i18n/routing` en lugar de `next/link`
- Los componentes client deben usar `useTranslations` de `next-intl`
- Los componentes server deben usar `getTranslations` de `next-intl/server`

## 🚀 Próximos Pasos

1. Completar páginas faltantes
2. Actualizar componentes restantes
3. Agregar selector de idioma
4. Testing de ambos idiomas
5. Actualizar documentación
