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
   - ✅ Detección automática de idioma del navegador
   - ✅ Persistencia de preferencia de idioma

## 📝 Notas

- El idioma por defecto es **inglés (en)**
- Las rutas sin locale redirigen a `/en`
- Los Links deben usar `Link` de `@/i18n/routing` en lugar de `next/link`
- Los componentes client deben usar `useTranslations` de `next-intl`
- Los componentes server deben usar `getTranslations` de `next-intl/server`

## 🌐 Detección Automática de Idioma

### Comportamiento

La app detecta automáticamente el idioma preferido del usuario basándose en:

1. **Cookie `NEXT_LOCALE`**: Si existe, tiene prioridad (guarda la preferencia del usuario)
2. **Header `Accept-Language`**: Si no hay cookie, usa el idioma del navegador
3. **Idioma por defecto**: Si ninguno coincide con los locales soportados, usa `en`

### Configuración

```typescript
// src/i18n/routing.ts
export const routing = defineRouting({
    locales: ["en", "es"],
    defaultLocale: "en",
    localePrefix: "always",
    localeDetection: true, // Habilita detección automática
});
```

### Flujo de Detección

1. Usuario visita la app por primera vez
2. El middleware lee `Accept-Language` del navegador (ej: `es-ES,es;q=0.9,en;q=0.8`)
3. Si el idioma preferido está soportado (`es` o `en`), redirige a ese locale
4. Se establece la cookie `NEXT_LOCALE` para futuras visitas

### Testing

- **Navegador en español**: Configurar idioma del navegador a español → debe redirigir a `/es`
- **Navegador en inglés**: Configurar idioma del navegador a inglés → debe redirigir a `/en`
- **Persistencia**: Cambiar idioma manualmente → la cookie guarda la preferencia

## 🚀 Próximos Pasos

1. Completar páginas faltantes
2. Actualizar componentes restantes
3. Agregar selector de idioma
4. Testing de ambos idiomas
5. Actualizar documentación
