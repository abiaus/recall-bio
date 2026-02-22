import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { MoveLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateStaticParams({
    params,
}: any) {
    const { locale } = await params;
    const posts = await getBlogPosts(locale);

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getBlogPostBySlug(slug, locale);

    if (!post) {
        return {};
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const path = locale === "en" ? "" : `/${locale}`;
    const url = `${baseUrl}${path}/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.description,
        keywords: post.tags,
        alternates: {
            canonical: url,
            languages: {
                en: `${baseUrl}/blog/${post.slug}`,
                es: `${baseUrl}/es/blog/${post.slug}`,
                "x-default": `${baseUrl}/blog/${post.slug}`,
            }
        },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            publishedTime: post.date,
            url: url,
            tags: post.tags,
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const post = await getBlogPostBySlug(slug, locale);
    const t = await getTranslations({ locale });

    if (!post) {
        notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const pathLocale = locale === "en" ? "" : `/${locale}`;
    const url = `${baseUrl}${pathLocale}/blog/${post.slug}`;

    // Generate Article JSON-LD Schema for rich results 
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url
        },
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
            "@type": "Organization",
            name: "Recall.bio",
            url: baseUrl,
        },
        publisher: {
            "@type": "Organization",
            name: "Recall.bio",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/og.png`,
            },
        },
    };

    return (
        <main className="min-h-screen pt-12 pb-16 px-6 lg:px-8 max-w-3xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mb-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <MoveLeft className="mr-2 w-4 h-4" /> {t("blog.backToBlog")}
                </Link>
            </div>

            <article className="prose prose-zinc dark:prose-invert md:prose-lg max-w-none">
                <div className="mb-10 text-center space-y-4">
                    <p className="text-sm font-medium text-primary uppercase tracking-wider">
                        {post.date}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-0">
                        {post.title}
                    </h1>
                    <p className="text-xl text-muted-foreground !leading-relaxed">
                        {post.description}
                    </p>
                    {post.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-6">
                            {post.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-xs font-medium rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="break-words mt-12 [&>h2]:mt-12 [&>h3]:mt-8 [&>h2]:border-b [&>h2]:pb-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content.replace(/^#\s+.*\n+/, '')}
                    </ReactMarkdown>
                </div>
            </article>

            <div className="mt-16 pt-8 border-t">
                <div className="bg-primary/5 rounded-2xl p-8 text-center max-w-lg mx-auto border border-primary/10">
                    <h3 className="text-xl font-semibold mb-3">{t("blog.startLegacyTitle")}</h3>
                    <p className="text-muted-foreground mb-6">
                        {t("blog.startLegacySubtitle")}
                    </p>
                    <Link
                        href="/auth/signup"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
                    >
                        {t("blog.startFree")}
                    </Link>
                </div>
            </div>
        </main>
    );
}
