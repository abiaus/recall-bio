#!/usr/bin/env tsx
/**
 * Script para importar 1000 preguntas desde un archivo TXT a Supabase
 * Incluye traducción automática al español usando OpenAI
 * 
 * Uso:
 *   tsx scripts/importQuestions.ts [--dry-run] [--skip-translation]
 * 
 * Requiere:
 *   - NEXT_PUBLIC_SUPABASE_URL en .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY en .env.local (para escribir en BD)
 *   - OPENAI_API_KEY en .env.local (para traducción)
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import * as dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_TRANSLATION = process.argv.includes("--skip-translation");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Error: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY deben estar en .env.local");
  process.exit(1);
}

if (!OPENAI_API_KEY && !SKIP_TRANSLATION) {
  console.error("⚠️  Advertencia: OPENAI_API_KEY no encontrado. Usa --skip-translation para importar solo en inglés.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

interface ParsedQuestion {
  number: number;
  text: string;
  category: string;
  categorySlug: string;
}

const CACHE_DIR = path.join(process.cwd(), "scripts", ".cache");
const TRANSLATION_CACHE_FILE = path.join(CACHE_DIR, "questions-es.json");

// Crear directorio de cache si no existe
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Normaliza el texto para dedupe (trim, lowercase, normalizar espacios)
 */
function normalizeText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'");
}

/**
 * Convierte nombre de categoría a slug para tags
 */
function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Parsea el archivo TXT y extrae preguntas con categorías
 */
function parseQuestionsFile(filePath: string): ParsedQuestion[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const questions: ParsedQuestion[] = [];
  let currentCategory = "";
  let currentCategorySlug = "";

  for (const line of lines) {
    // Detectar categorías: "Category N: ... (Questions X–Y)"
    const categoryMatch = line.match(/^Category\s+\d+:\s+(.+?)\s+\(Questions\s+\d+–\d+\)$/i);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      currentCategorySlug = categoryToSlug(currentCategory);
      continue;
    }

    // Detectar preguntas: "N. Texto de la pregunta"
    const questionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (questionMatch && currentCategory) {
      const number = parseInt(questionMatch[1], 10);
      const text = questionMatch[2].trim();
      questions.push({
        number,
        text,
        category: currentCategory,
        categorySlug: currentCategorySlug,
      });
    }
  }

  return questions;
}

/**
 * Obtiene preguntas existentes de la BD para dedupe
 */
async function getExistingQuestions(): Promise<Set<string>> {
  const normalized = new Set<string>();
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabase
      .schema("public")
      .from("questions")
      .select("text")
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("❌ Error al obtener preguntas existentes:", error);
      break;
    }

    if (!data || data.length === 0) break;

    for (const q of data) {
      if (q.text) {
        normalized.add(normalizeText(q.text));
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return normalized;
}

/**
 * Inserta preguntas nuevas en la BD
 */
async function insertQuestions(
  questions: ParsedQuestion[],
  existingNormalized: Set<string>
): Promise<{ inserted: number; skipped: number }> {
  const toInsert = questions.filter((q) => {
    const normalized = normalizeText(q.text);
    return !existingNormalized.has(normalized);
  });

  if (toInsert.length === 0) {
    console.log("✅ No hay preguntas nuevas para insertar");
    return { inserted: 0, skipped: questions.length };
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] Se insertarían ${toInsert.length} preguntas nuevas`);
    return { inserted: toInsert.length, skipped: questions.length - toInsert.length };
  }

  // Insertar en lotes de 100
  const batchSize = 100;
  let inserted = 0;

  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const values = batch.map((q) => ({
      text: q.text,
      type: "text" as const,
      is_active: true,
      tags: [q.categorySlug],
      life_stage: null,
    }));

    const { error } = await supabase.schema("public").from("questions").insert(values);

    if (error) {
      console.error(`❌ Error al insertar lote ${Math.floor(i / batchSize) + 1}:`, error);
    } else {
      inserted += batch.length;
      console.log(`✅ Insertado lote ${Math.floor(i / batchSize) + 1}: ${batch.length} preguntas`);
    }
  }

  return { inserted, skipped: questions.length - toInsert.length };
}

/**
 * Carga cache de traducciones existentes
 */
function loadTranslationCache(): Record<string, string> {
  if (!fs.existsSync(TRANSLATION_CACHE_FILE)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(TRANSLATION_CACHE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

/**
 * Guarda traducciones en cache
 */
function saveTranslationCache(cache: Record<string, string>): void {
  fs.writeFileSync(TRANSLATION_CACHE_FILE, JSON.stringify(cache, null, 2), "utf-8");
}

/**
 * Traduce un lote de preguntas usando OpenAI
 */
async function translateBatch(
  questions: string[],
  cache: Record<string, string>
): Promise<Record<string, string>> {
  if (!openai) {
    throw new Error("OpenAI client no está disponible");
  }

  const toTranslate = questions.filter((q) => !cache[normalizeText(q)]);
  if (toTranslate.length === 0) {
    return cache;
  }

  try {
    const prompt = `Traduce las siguientes preguntas de reflexión personal del inglés al español. Mantén el tono introspectivo y personal. Devuelve SOLO un JSON array con las traducciones en el mismo orden, sin explicaciones.

${toTranslate.map((q, i) => `${i + 1}. ${q}`).join("\n")}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un traductor profesional que traduce preguntas de reflexión personal. Devuelve SOLO un array JSON de strings, sin explicaciones adicionales.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("Respuesta vacía de OpenAI");
    }

    // Limpiar posibles markdown code blocks
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const translations = JSON.parse(cleaned) as string[];

    if (translations.length !== toTranslate.length) {
      throw new Error(
        `Longitud de traducciones (${translations.length}) no coincide con preguntas (${toTranslate.length})`
      );
    }

    // Actualizar cache
    for (let i = 0; i < toTranslate.length; i++) {
      cache[normalizeText(toTranslate[i])] = translations[i];
    }

    console.log(`✅ Traducidas ${toTranslate.length} preguntas`);
    return cache;
  } catch (error) {
    console.error("❌ Error al traducir lote:", error);
    throw error;
  }
}

/**
 * Actualiza text_es en la BD para preguntas que ya tienen texto en inglés
 */
async function updateSpanishTranslations(
  questions: ParsedQuestion[],
  cache: Record<string, string>
): Promise<number> {
  if (DRY_RUN || SKIP_TRANSLATION) {
    console.log(`[DRY RUN/SKIP] Se actualizarían ${questions.length} traducciones`);
    return questions.length;
  }

  let updated = 0;
  const batchSize = 50;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);

    for (const q of batch) {
      const normalized = normalizeText(q.text);
      const translated = cache[normalized];

      if (!translated) {
        console.warn(`⚠️  No hay traducción para: ${q.text.substring(0, 50)}...`);
        continue;
      }

      const { error } = await supabase
        .schema("public")
        .from("questions")
        .update({ text_es: translated })
        .eq("text", q.text)
        .is("text_es", null);

      if (error) {
        // Si falla por constraint, intentar update sin el filtro is null
        const { error: error2 } = await supabase
          .schema("public")
          .from("questions")
          .update({ text_es: translated })
          .eq("text", q.text);

        if (error2) {
          console.error(`❌ Error al actualizar pregunta ${q.number}:`, error2);
        } else {
          updated++;
        }
      } else {
        updated++;
      }
    }

    console.log(`✅ Procesado lote ${Math.floor(i / batchSize) + 1}: ${batch.length} preguntas`);
  }

  return updated;
}

/**
 * Función principal
 */
async function main() {
  // Intentar varias rutas posibles para el archivo
  const possiblePaths = [
    path.join(process.cwd(), "..", "..", "Downloads", "1000_new_questions_recall_style.txt"),
    path.join(process.env.USERPROFILE || process.env.HOME || "", "Downloads", "1000_new_questions_recall_style.txt"),
    process.argv.find((arg, i) => i > 1 && arg.endsWith(".txt") && !arg.startsWith("--")),
  ].filter((p): p is string => !!p);

  let inputFile: string | undefined;
  for (const possiblePath of possiblePaths) {
    if (possiblePath && fs.existsSync(possiblePath)) {
      inputFile = possiblePath;
      break;
    }
  }

  if (!inputFile) {
    console.error(`❌ Archivo no encontrado. Rutas intentadas:`);
    possiblePaths.forEach((p) => console.error(`   - ${p}`));
    console.error(`\n💡 Usa: tsx scripts/importQuestions.ts /ruta/completa/al/archivo.txt`);
    process.exit(1);
  }

  console.log(`📂 Archivo encontrado: ${inputFile}`);

  console.log("📖 Parseando archivo...");
  const questions = parseQuestionsFile(inputFile);
  console.log(`✅ Parseadas ${questions.length} preguntas en ${new Set(questions.map((q) => q.category)).size} categorías`);

  console.log("\n🔍 Obteniendo preguntas existentes de la BD...");
  const existingNormalized = await getExistingQuestions();
  console.log(`✅ Encontradas ${existingNormalized.size} preguntas existentes`);

  console.log("\n💾 Insertando preguntas nuevas...");
  const { inserted, skipped } = await insertQuestions(questions, existingNormalized);
  console.log(`✅ Insertadas: ${inserted}, Omitidas (duplicadas): ${skipped}`);

  if (SKIP_TRANSLATION) {
    console.log("\n⏭️  Traducción omitida (--skip-translation)");
    return;
  }

  if (!openai) {
    console.log("\n⚠️  OpenAI no disponible, saltando traducción");
    return;
  }

  console.log("\n🌐 Traduciendo al español...");
  const cache = loadTranslationCache();
  console.log(`✅ Cache cargado: ${Object.keys(cache).length} traducciones existentes`);

  // Traducir en lotes de 20
  const batchSize = 20;
  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize).map((q) => q.text);
    console.log(`\n📝 Traduciendo lote ${Math.floor(i / batchSize) + 1}...`);
    await translateBatch(batch, cache);
    saveTranslationCache(cache); // Guardar después de cada lote
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Rate limiting: 1 segundo entre lotes
  }

  console.log("\n💾 Actualizando text_es en la BD...");
  const updated = await updateSpanishTranslations(questions, cache);
  console.log(`✅ Actualizadas ${updated} traducciones en la BD`);

  console.log("\n🎉 ¡Importación completada!");
}

main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});
