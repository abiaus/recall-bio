import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';
import { localePath, routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recall.bio';
    const sitemapEntries: MetadataRoute.Sitemap = [];

    const staticPages = [
        '',
        '/blog',
    ];

    for (const locale of routing.locales) {
        for (const page of staticPages) {
            const url =
                page === ''
                    ? locale === routing.defaultLocale
                        ? baseUrl
                        : `${baseUrl}/${locale}`
                    : `${baseUrl}${localePath(page, locale)}`;
            sitemapEntries.push({
                url,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: page === '' ? 1 : 0.8,
            });
        }

        const posts = await getBlogPosts(locale);
        for (const post of posts) {
            sitemapEntries.push({
                url: `${baseUrl}${localePath(`/blog/${post.slug}`, locale)}`,
                lastModified: new Date(post.date),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        }
    }

    return sitemapEntries;
}
