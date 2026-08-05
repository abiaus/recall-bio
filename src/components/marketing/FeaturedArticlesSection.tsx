import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { MoveRight, BookOpen } from "lucide-react";
import { BlogPost } from "@/lib/blog";

interface FeaturedArticlesProps {
    locale: string;
    posts: BlogPost[];
}

export async function FeaturedArticlesSection({ locale, posts }: FeaturedArticlesProps) {
    const t = await getTranslations({ locale });
    const featuredPosts = posts.slice(0, 3);

    if (featuredPosts.length === 0) return null;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#E8DFD1]/60">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-terracotta)]/10 text-[var(--primary-terracotta)] text-xs font-semibold uppercase tracking-wider mb-4">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Blog & Guides</span>
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                            {t("blog.featuredTitle")}
                        </h2>
                        <p className="text-[var(--text-secondary)] mt-2 max-w-xl text-base md:text-lg">
                            {t("blog.featuredSubtitle")}
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-terracotta)] hover:text-[var(--primary-clay)] transition-colors group shrink-0"
                    >
                        <span>{t("blog.viewAllPosts")}</span>
                        <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block rounded-2xl border border-[#E8DFD1] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--primary-terracotta)]/40 flex flex-col justify-between"
                        >
                            <div>
                                <div className="text-xs text-[var(--text-muted)] font-medium mb-3">
                                    {post.date}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-[var(--text-primary)] mb-3 line-clamp-2 group-hover:text-[var(--primary-terracotta)] transition-colors leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-6 leading-relaxed">
                                    {post.description}
                                </p>
                            </div>
                            <div className="flex items-center text-sm font-semibold text-[var(--primary-terracotta)]">
                                {t("blog.readMore")} <MoveRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
