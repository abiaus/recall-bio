import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';
import { localePath, routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recall.bio';
    const sitemapEntries: MetadataRoute.Sitemap = [];

    const staticPages = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
        { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
        { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
    ];

    for (const locale of routing.locales) {
        for (const page of staticPages) {
            const url =
                page.path === ''
                    ? locale === routing.defaultLocale
                        ? baseUrl
                        : `${baseUrl}/${locale}`
                    : `${baseUrl}${localePath(page.path, locale)}`;
            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: page.changeFrequency,
                priority: page.priority,
            });
        }

        const posts = await getBlogPosts(locale);
        for (const post of posts) {
            sitemapEntries.push({
                url: `${baseUrl}${localePath(`/blog/${post.slug}`, locale)}`,
                lastModified: new Date(post.date),
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    return sitemapEntries;
}
