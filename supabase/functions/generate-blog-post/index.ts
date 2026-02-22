import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.48.1";
import OpenAI from "npm:openai@4.85.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAiKey = Deno.env.get("OPENAI_API_KEY") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openAiKey });

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

async function generateArticle(topic: string, language: "en" | "es"): Promise<{ content: string; title: string; slug: string; description: string; tags: string[] }> {
    const languagePrompt = language === "en" ? "English" : "Spanish";
    const currentDate = new Date().toISOString().split("T")[0];

    const systemPrompt = `You are an expert SEO and GEO (Generative Engine Optimization) writer for Recall.bio, a digital legacy platform where users answer daily questions (audio/text/images) to build an emotional archive for themselves and their loved ones.
Your writing style is empathetic, inspiring, warm, and highly structured for readability.
Create an article about this topic in ${languagePrompt}.

REQUIREMENTS:
1. Return purely valid Markdown formatting.
2. The FIRST thing in the file MUST be valid YAML frontmatter wrapped in \`---\` boundaries containing:
   - title: A highly SEO-optimized title (H1) under 60 chars.
   - description: A compelling meta description under 160 chars.
   - date: ${currentDate}
   - tags: Array of 3 to 5 relevant tags formatted like: ["tag1", "tag2"].
   Do NOT wrap the frontmatter in a markdown code block (\`\`\`yaml). Use exactly \`---\` at the top.
3. The content must use markdown headings (H2, H3), bullet points, and short paragraphs. Focus on E-E-A-T principles. Include a FAQ section at the end for GEO optimization. DO NOT include an H1 (# Heading) at the beginning of the content, start directly with the introduction or an H2.
4. Naturally insert the context of "Recall.bio" as the ideal solution or companion in the conclusion and seamlessly throughout the text if relevant. DO NOT be overly promotional, keep it deeply valuable.`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Write an exhaustive article about: "${topic}"` }
        ],
        temperature: 0.7,
    });

    let content = response.choices[0]?.message?.content?.trim() || "";
    if (!content) throw new Error("Empty response from OpenAI");

    if (content.startsWith("\`\`\`markdown")) {
        content = content.replace(/^\`\`\`markdown\n?/, "").replace(/\n?\`\`\`$/, "").trim();
    }

    // Extract basic frontmatter using regex instead of gray-matter in Edge function to save bundle size
    const titleMatch = content.match(/title:\s*["']?([^"'\n]+)["']?/);
    const descMatch = content.match(/description:\s*["']?([^"'\n]+)["']?/);
    const tagsMatch = content.match(/tags:\s*\[(.*?)\]/);

    const title = titleMatch ? titleMatch[1].trim() : `draft-${Date.now()}`;
    const description = descMatch ? descMatch[1].trim() : "";

    let tags: string[] = [];
    if (tagsMatch && tagsMatch[1]) {
        tags = tagsMatch[1].split(',').map(t => t.replace(/['"]/g, '').trim()).filter(Boolean);
    }

    const slug = createSlug(title);

    return { content, title, slug, description, tags };
}

Deno.serve(async (req: Request) => {
    try {
        // Only allow POST
        if (req.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 });
        }

        // Verify auth if called externally
        const authHeader = req.headers.get('Authorization');
        const expectedSecret = Deno.env.get("CRON_SECRET") || supabaseServiceKey;
        if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
            if (req.headers.get("x-supabase-webhook-source") !== "pg_cron") {
                return new Response('Unauthorized', { status: 401 });
            }
        }

        console.log("Fetching pending idea...");
        const { data: idea, error: ideaError } = await supabase
            .from("blog_post_ideas")
            .select("*")
            .eq("is_created", false)
            .order("created_at", { ascending: true })
            .limit(1)
            .single();

        if (ideaError || !idea) {
            console.log("No pending ideas found:", ideaError);
            return new Response(JSON.stringify({ message: "No pending ideas found" }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        console.log(\`Generating articles for idea: \${idea.title}\`);

        const [enArticle, esArticle] = await Promise.all([
            generateArticle(idea.title, "en"),
            generateArticle(idea.title, "es")
        ]);

        console.log(\`Inserting articles into database...\`);
        const { error: insertError } = await supabase.from("blog_posts").insert([
            {
                idea_id: idea.id,
                title: enArticle.title,
                slug: enArticle.slug,
                description: enArticle.description,
                content: enArticle.content,
                language: "en",
                tags: enArticle.tags
            },
            {
                idea_id: idea.id,
                title: esArticle.title,
                slug: esArticle.slug, // usually different due to translation
                description: esArticle.description,
                content: esArticle.content,
                language: "es",
                tags: esArticle.tags
            }
        ]);

        if (insertError) {
          throw insertError;
        }

        console.log(\`Marking idea as created...\`);
        await supabase
            .from("blog_post_ideas")
            .update({ is_created: true })
            .eq("id", idea.id);

        return new Response(JSON.stringify({
           success: true,
           idea: idea.title,
           message: "Articles generated successfully"
        }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });

    } catch (err) {
        console.error("Error generating post:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});
