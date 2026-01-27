#!/usr/bin/env tsx
/**
 * Parsea el CSV clasificado y genera SQL para actualizar life_stage en public.questions.
 * Genera ≥2 sentencias UPDATE (lotes de ≤500 filas) por límite de 1000 de Supabase.
 *
 * Uso:
 *   tsx scripts/updateLifeStageFromCsv.ts [<ruta.csv>] [--dry-run]
 *
 * Salida: scripts/out/update_life_stage.sql
 */

import * as fs from "fs";
import * as path from "path";

const VALID_STAGES = new Set(["teen", "young_adult", "adult", "midlife", "senior"]);
const BATCH_SIZE = 250;
const DEFAULT_CSV = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
  "classified_output_1769510188289.csv"
);

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (!inQuotes && c === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += c;
  }
  out.push(cur);
  return out;
}

function parseLifeStage(raw: string): string[] | null {
  const s = raw.trim();
  if (!s || s === "[]" || s === "['']") return null;
  const stripped = s.replace(/^\[|\]$/g, "").replace(/'/g, "");
  if (!stripped) return null;
  const parts = stripped.split(",").map((p) => p.trim()).filter(Boolean);
  const valid = parts.filter((p) => VALID_STAGES.has(p));
  return valid.length > 0 ? valid : null;
}

function escapeSqlString(str: string): string {
  return str.replace(/'/g, "''");
}

function toPgText(arr: string[] | null): string {
  if (!arr || arr.length === 0) return "NULL";
  const json = JSON.stringify(arr);
  return "'" + escapeSqlString(json) + "'";
}

interface Row {
  id: string;
  life_stage: string[] | null;
}

function loadCsv(filePath: string): Row[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0];
  if (!header.toLowerCase().includes("id") || !header.toLowerCase().includes("life_stage")) {
    throw new Error("CSV debe tener columnas 'id' y 'life_stage'");
  }
  const rows: Row[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const id = cols[0]?.trim().replace(/^"|"$/g, "");
    const lifeStageRaw = cols[3] ?? "";
    if (!id) continue;
    const lifeStage = parseLifeStage(lifeStageRaw);
    rows.push({ id, life_stage: lifeStage });
  }
  return rows;
}

function generateBatchSql(batch: Row[]): string {
  const values = batch
    .map(
      (r) =>
        `  ('${r.id}'::uuid, ${toPgText(r.life_stage)})`
    )
    .join(",\n");
  return `WITH data(id, life_stage) AS (
  VALUES
${values}
)
UPDATE public.questions q
SET life_stage = d.life_stage
FROM data d
WHERE q.id = d.id;
`;
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const dryRun = process.argv.includes("--dry-run");
  const csvPath = args[0] || DEFAULT_CSV;

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ No se encontró: ${csvPath}`);
    process.exit(1);
  }

  console.log(`📂 Leyendo ${csvPath}...`);
  const rows = loadCsv(csvPath);
  console.log(`✅ ${rows.length} filas parseadas`);

  const batches: Row[][] = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE));
  }
  if (batches.length < 2) {
    console.error("❌ Se requieren ≥2 lotes (límite 1000 por query). Ajusta BATCH_SIZE o el CSV.");
    process.exit(1);
  }
  console.log(`📦 ${batches.length} lotes (máx. ${BATCH_SIZE} filas/lote)`);

  const outDir = path.join(process.cwd(), "scripts", "out");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "update_life_stage.sql");

  const allSql = batches.map((b, i) => `-- Batch ${i + 1}/${batches.length} (${b.length} rows)\n` + generateBatchSql(b)).join("\n\n");

  if (!dryRun) {
    fs.writeFileSync(outFile, allSql, "utf-8");
    console.log(`\n💾 SQL escrito en ${outFile}`);
    batches.forEach((b, i) => {
      const single = generateBatchSql(b);
      const singlePath = path.join(outDir, `update_life_stage_batch_${i + 1}.sql`);
      fs.writeFileSync(singlePath, single, "utf-8");
    });
    console.log(`   + ${batches.length} archivos por lote: update_life_stage_batch_1.sql, ...`);
  } else {
    console.log("\n[DRY RUN] No se escribió archivo.");
  }

  console.log("\n📋 Muestra (primeras 3 filas):");
  rows.slice(0, 3).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.id} → ${r.life_stage ? JSON.stringify(r.life_stage) : "NULL"}`);
  });
}

main();
