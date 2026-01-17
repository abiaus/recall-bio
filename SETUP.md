# Guía de Configuración - Recall.bio

## Pasos de Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 2. Configuración de Supabase Storage

#### Crear el Bucket `media`

1. Ve al dashboard de Supabase → Storage
2. Clic en "New bucket"
3. Nombre: `media`
4. **Público**: No (privado)
5. File size limit: 100MB (o el límite que prefieras)
6. Allowed MIME types: `audio/*, video/*, image/*`

#### Configurar Políticas de Storage y Tablas

Ejecuta el script `scripts/migration_memories_rls.sql` en el SQL Editor de Supabase. Este script configura:

1. **Políticas RLS para la tabla `memories`** - CRUD para usuarios autenticados
2. **Políticas RLS para la tabla `memory_media`** - CRUD para usuarios autenticados
3. **Políticas de Storage** - Acceso a archivos en el bucket `media`

La estructura de carpetas en storage es:
```
media/user/{user_id}/memories/{memory_id}/{filename}
```

Las políticas verifican que el usuario solo acceda a su carpeta:
```sql
(storage.foldername(name))[1] = 'user' AND
(storage.foldername(name))[2] = auth.uid()::text
```

### 3. Verificar Migraciones

Las migraciones ya están aplicadas en el schema `public`. Puedes verificar ejecutando:

```sql
SELECT * FROM public.profiles LIMIT 1;
```

### 4. Preguntas de Ejemplo

Las preguntas de ejemplo ya están insertadas. Puedes agregar más ejecutando:

```sql
INSERT INTO public.questions (text, type, life_stage, tags, is_active)
VALUES ('Tu pregunta aquí', 'text', null, ARRAY['tag1', 'tag2'], true);
```

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura de Archivos en Storage

Los archivos se organizan así:
```
media/
  └── user/
      └── {user_id}/
          └── memories/
              └── {memory_id}/
                  └── {timestamp}.webm
```

## Próximos Pasos

1. **Configurar email de invitaciones**: Implementar Edge Function o servicio externo para enviar emails de invitación a herederos
2. **Stripe Integration**: Para suscripciones (V1.5)
3. **Video Recording**: Extender el AudioRecorder para soportar video
4. **Dashboard Analytics**: Estadísticas de consistencia y streaks

## Troubleshooting

### Error: "Bucket not found"
- Asegúrate de crear el bucket `media` en Supabase Storage
- Verifica que el nombre sea exactamente `media` (minúsculas)

### Error: "Permission denied" al subir archivos
- Verifica que las políticas de Storage estén correctamente configuradas
- Asegúrate de que el usuario esté autenticado

### Error: "Schema recallbio does not exist"
- Las migraciones deberían haberse aplicado automáticamente
- Verifica en el SQL Editor que el schema existe: `SELECT * FROM public.profiles LIMIT 1;`
