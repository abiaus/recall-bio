# Scripts de Importación de Preguntas

Este directorio contiene scripts para importar preguntas bilingües (inglés/español) a Supabase.

## Prerequisitos

1. **Ejecutar la migración SQL**: Antes de importar, ejecuta `migration_add_text_es.sql` en el SQL Editor de Supabase para añadir la columna `text_es`.

2. **Variables de entorno**: Asegúrate de tener en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   OPENAI_API_KEY=tu_openai_api_key  # Para traducción automática
   ```

3. **Instalar dependencias**:
   ```bash
   npm install
   ```

## Archivos

- `migration_add_text_es.sql`: Migración SQL para añadir columna `text_es` a `public.questions`
- `importQuestions.ts`: Script principal de importación y traducción

## Uso

### 1. Ejecutar la migración SQL

Abre el SQL Editor en Supabase y ejecuta el contenido de `migration_add_text_es.sql`:
```sql
ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS text_es text;
```

### 2. Importar preguntas

#### Modo normal (con traducción):
```bash
npm run import:questions
```

#### Modo dry-run (solo muestra qué haría sin cambios):
```bash
npm run import:questions:dry-run
```

#### Sin traducción (solo importa inglés):
```bash
npm run import:questions:no-translation
```

## Proceso del Script

1. **Parsea el archivo TXT**: Lee `1000_new_questions_recall_style.txt` desde `../Downloads/`
2. **Deduplicación**: Compara con preguntas existentes en la BD (normalizando texto)
3. **Inserción**: Inserta solo preguntas nuevas con tags basados en categorías
4. **Traducción**: Traduce al español usando OpenAI GPT-4o-mini (batch de 20)
5. **Cache**: Guarda traducciones en `scripts/.cache/questions-es.json` para reintentos idempotentes
6. **Actualización**: Actualiza `text_es` en la BD para todas las preguntas

## Estructura del Archivo TXT

El script espera un formato específico:
```
Questions
Category 1: Childhood, Family & Parenting (Questions 1–100)
1. Primera pregunta aquí?
2. Segunda pregunta aquí?
...
```

## Validación Post-Importación

Después de ejecutar el script, valida en Supabase:

```sql
-- Contar total de preguntas
SELECT COUNT(*) FROM public.questions;

-- Contar preguntas con traducción
SELECT COUNT(*) FROM public.questions WHERE text_es IS NOT NULL AND text_es != '';

-- Muestreo aleatorio de preguntas bilingües
SELECT text, text_es 
FROM public.questions 
WHERE text_es IS NOT NULL 
ORDER BY RANDOM() 
LIMIT 10;
```

## Verificación en la App

1. **En inglés**: Visita `http://localhost:3000/en/(app)/today` - debe mostrar pregunta en inglés
2. **En español**: Visita `http://localhost:3000/es/(app)/today` - debe mostrar pregunta en español

## Solución de Problemas

### Error: "SUPABASE_SERVICE_ROLE_KEY must be in .env.local"
- Asegúrate de tener la variable en `.env.local` (nunca commits este archivo)

### Error: "OPENAI_API_KEY not found"
- Si solo quieres importar inglés, usa `--skip-translation`
- Si quieres traducción, añade `OPENAI_API_KEY` a `.env.local`

### Error: "Column text_es does not exist"
- Ejecuta primero `migration_add_text_es.sql` en Supabase SQL Editor

### La traducción falla a mitad del proceso
- El script usa cache, puedes re-ejecutarlo y continuará desde donde falló
- Revisa `scripts/.cache/questions-es.json` para ver traducciones guardadas

### Duplicados detectados pero se insertan igual
- El script normaliza texto (lowercase, espacios) para dedupe
- Si hay diferencias sutiles (puntuación, mayúsculas), se insertarán como nuevas

## Notas

- El script usa `SUPABASE_SERVICE_ROLE_KEY` que tiene permisos de administrador - **nunca lo uses en producción o commits**
- Las traducciones se guardan en cache local para evitar re-traducir en reintentos
- El script hace rate limiting (1 segundo entre lotes de traducción) para evitar límites de OpenAI
- Las categorías se convierten automáticamente a tags (slug format: `childhood-family-parenting`)
