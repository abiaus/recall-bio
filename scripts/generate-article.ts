#!/usr/bin/env tsx
/**
 * Script for AI-driven SEO/GEO content generation for Recall.bio
 * Generates an optimized Markdown article from a given topic/seed.
 *
 * Usage:
 *   tsx scripts/generate-article.ts "How to start voice journaling"
 */

import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY is required in .env.local");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const topic = process.argv.slice(2).join(" ");

if (!topic) {
  console.error("❌ Please provide a topic. Example: tsx scripts/generate-article.ts \"Why voice journaling is important\"");
  process.exit(1);
}

const CONTENT_DIR_ES = path.join(process.cwd(), "content", "blog", "es");
const CONTENT_DIR_EN = path.join(process.cwd(), "content", "blog", "en");

[CONTENT_DIR_ES, CONTENT_DIR_EN].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "")    // Remove invalid chars
    .replace(/\s+/g, "-")            // Collapse whitespace and replace by -
    .replace(/-+/g, "-")             // Collapse dashes
    .replace(/^-+/, "")              // Trim - from start
    .replace(/-+$/, "");             // Trim - from end
}

async function generateArticle(language: "en" | "es") {
  console.log(`\n🤖 Generating ${language.toUpperCase()} article for topic: "${topic}"`);

  const languagePrompt = language === "en" ? "English" : "Spanish";

  const currentDate = new Date().toISOString().split("T")[0];

  const systemPrompt = `
You are an expert SEO and GEO (Generative Engine Optimization) writer for Recall.bio, a digital legacy platform where users answer daily questions (audio/text/images) to build an emotional archive for themselves and their loved ones.
Your writing style is empathetic, inspiring, warm, and highly structured for readability.
Create an article about this topic in ${languagePrompt}.

REQUIREMENTS:
1. Return purely valid Markdown formatting.
2. The FIRST thing in the file MUST be valid YAML frontmatter wrapped in \`---\` boundaries containing:
   - title: A highly SEO-optimized title (H1) under 60 chars.
   - description: A compelling meta description under 160 chars.
   - date: ${currentDate}
   - tags: Array of 3 to 5 relevant tags.
   Do NOT wrap the frontmatter in a markdown code block (\`\`\`yaml). Use exactly \`---\` at the top.
3. The content must use markdown headings (H2, H3), bullet points, and short paragraphs. Focus on E-E-A-T principles. Include a FAQ section at the end for GEO optimization. DO NOT include an H1 (# Heading) at the beginning of the content, start directly with the introduction or an H2.
4. Naturally insert the context of "Recall.bio" as the ideal solution or companion in the conclusion and seamlessly throughout the text if relevant. DO NOT be overly promotional, keep it deeply valuable.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // using gpt-4o for high quality content
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write an exhaustive article about: "${topic}"` }
      ],
      temperature: 0.7,
    });

    let content = response.choices[0]?.message?.content?.trim();
    if (!content) throw new Error("Empty response from OpenAI");

    // Clean up code blocks if GPT adds them casually around the whole response
    if (content.startsWith("\`\`\`markdown")) {
      content = content.replace(/^\`\`\`markdown/, "").replace(/\`\`\`$/, "").trim();
    }

    // Extract title from frontmatter to create slug
    const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/);
    const title = titleMatch ? titleMatch[1].trim() : `draft-${Date.now()}`;
    const slug = createSlug(title);

    const dir = language === "en" ? CONTENT_DIR_EN : CONTENT_DIR_ES;
    const filePath = path.join(dir, `${slug}.md`);

    fs.writeFileSync(filePath, content, "utf-8");
    console.log(`✅ ${language.toUpperCase()} article generated and saved at: ${filePath}`);

  } catch (error) {
    console.error(`❌ Error generating ${language.toUpperCase()} article:`, error);
  }
}

async function main() {
  await Promise.all([
    generateArticle("es"),
    generateArticle("en")
  ]);
  console.log("\n🎉 AI content generation complete.");
}

main();
