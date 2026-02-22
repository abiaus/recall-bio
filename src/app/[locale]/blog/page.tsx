import { getBlogPosts } from "@/lib/blog";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { MoveRight } from "lucide-react";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const pathLocale = locale === "en" ? "" : `/${locale}`;
    const url = `${baseUrl}${pathLocale}/blog`;

    return {
        title: t("marketing.hero.title") + " - Blog",
        description: "Read the latest resources and guides on Recall.bio",
        alternates: {
            canonical: url,
            languages: {
                en: `${baseUrl}/blog`,
                es: `${baseUrl}/es/blog`,
                "x-default": `${baseUrl}/blog`,
            }
        },
    };
}

export default async function BlogIndexPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const posts = await getBlogPosts(locale);
    const t = await getTranslations({ locale });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const pathLocale = locale === "en" ? "" : `/${locale}`;
    const url = `${baseUrl}${pathLocale}/blog`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "url": url,
        "name": t("blog.title"),
        "description": t("blog.subtitle"),
        "publisher": {
            "@type": "Organization",
            "name": "Recall.bio",
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/og.png`
            }
        },
        "blogPost": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "url": `${baseUrl}${pathLocale}/blog/${post.slug}`,
            "datePublished": post.date,
            "description": post.description
        }))
    };

    return (
        <main className="min-h-screen pt-12 pb-16 px-6 lg:px-8 max-w-5xl mx-auto">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {t("blog.title")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    {t("blog.subtitle")}
                </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {post.date}
                                    </span>
                                </div>
                                <h2 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                                    {post.description}
                                </p>
                            </div>
                            <div className="flex items-center text-sm font-medium text-primary">
                                {t("blog.readMore")} <MoveRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </Link>
                ))}

                {posts.length === 0 && (
                    <div className="col-span-full py-12 text-center border border-dashed rounded-xl text-muted-foreground">
                        {t("blog.noArticles")}
                    </div>
                )}
            </div>
        </main>
    );
}
