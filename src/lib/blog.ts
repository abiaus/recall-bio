import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    content: string;
    locale: string;
}

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('language', locale)
        .order('date', { ascending: false });

    if (error || !posts) {
        console.error("Error fetching blog posts:", error);
        return [];
    }

    return posts.map(post => ({
        slug: post.slug,
        title: post.title,
        description: post.description || "",
        date: new Date(post.date).toISOString().split('T')[0],
        tags: post.tags || [],
        locale: post.language,
        content: post.content || ""
    }));
}

export async function getBlogPostBySlug(slug: string, locale: string): Promise<BlogPost | null> {
    const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('language', locale)
        .single();

    if (error || !post) {
        return null;
    }

    return {
        slug: post.slug,
        title: post.title,
        description: post.description || "",
        date: new Date(post.date).toISOString().split('T')[0],
        tags: post.tags || [],
        locale: post.language,
        content: post.content || ""
    };
}
