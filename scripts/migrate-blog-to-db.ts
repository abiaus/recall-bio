#!/usr/bin/env tsx

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const IDEAS_FILE = path.join(process.cwd(), "content", "blog-ideas.json");
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

async function run() {
    console.log("Migrating Blog Ideas...");
    const ideas = JSON.parse(fs.readFileSync(IDEAS_FILE, "utf-8"));

    const { data: insertedIdeas, error: ideasError } = await supabase
        .from("blog_post_ideas")
        .upsert(
            ideas.map((idea: any) => ({
                title: idea.title,
                category: idea.category,
                is_created: idea.created
            })),
            { onConflict: 'title' }
        )
        .select();

    if (ideasError) {
        console.error("Error inserting ideas:", ideasError);
        return;
    }
    console.log(`✅ Inserted/Updated ${insertedIdeas.length} ideas.`);

    console.log("Migrating Existing Blog Posts...");
    const languages = ["en", "es"];
    let postsCount = 0;

    for (const lang of languages) {
        const langDir = path.join(BLOG_DIR, lang);
        if (!fs.existsSync(langDir)) continue;

        const files = fs.readdirSync(langDir).filter(f => f.endsWith(".md"));
        for (const file of files) {
            const slug = file.replace(/\.md$/, "");
            const fullPath = path.join(langDir, file);
            const content = fs.readFileSync(fullPath, "utf-8");

            const { data, content: markdownBody } = matter(content);
            const dateString = data.date instanceof Date ? data.date.toISOString().split("T")[0] : String(data.date);

            const { error: postError } = await supabase
                .from("blog_posts")
                .upsert({
                    slug: slug,
                    language: lang,
                    title: data.title || slug,
                    description: data.description || "",
                    content: markdownBody,
                    tags: data.tags || [],
                    date: new Date(dateString).toISOString()
                }, { onConflict: "slug,language" });

            if (postError) {
                console.error(`Error inserting post ${slug} (${lang}):`, postError);
            } else {
                postsCount++;
            }
        }
    }

    console.log(`✅ Inserted/Updated ${postsCount} existing posts.`);
}

run().catch(console.error);
