#!/usr/bin/env tsx
/**
 * Ejecuta los lotes de update_life_stage vía Supabase.
 * Lee scripts/out/update_life_stage_batch_*.sql y los ejecuta uno a uno.
 *
 * Requiere: .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
 * Usa fetch al Management API de Supabase para ejecutar SQL.
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];
const outDir = path.join(process.cwd(), "scripts", "out");

async function runSql(sql: string): Promise<{ error?: string }> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  if (!res.ok) {
    const t = await res.text();
    return { error: `HTTP ${res.status}: ${t}` };
  }
  return {};
}

async function main() {
  const files = fs.readdirSync(outDir).filter((f) => f.startsWith("update_life_stage_batch_") && f.endsWith(".sql"));
  files.sort();

  for (const f of files) {
    const filePath = path.join(outDir, f);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`⏳ Ejecutando ${f}...`);
    const { error } = await runSql(sql);
    if (error) {
      console.error(`❌ ${f}: ${error}`);
      process.exit(1);
    }
    console.log(`✅ ${f}`);
  }
  console.log("\n🎉 Todos los lotes ejecutados.");
}

main();
