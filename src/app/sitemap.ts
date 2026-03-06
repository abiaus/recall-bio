import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recall.bio';
    const sitemapEntries: MetadataRoute.Sitemap = [];

    const staticPages = [
        '',
        '/blog',
    ];

    for (const locale of routing.locales) {
        // Add static pages for each locale
        for (const page of staticPages) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: page === '' ? 1 : 0.8,
            });
        }

        // Add blog posts for each locale
        const posts = await getBlogPosts(locale);
        for (const post of posts) {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: new Date(post.date),
                changeFrequency: 'weekly',
                priority: 0.6,
            });
        }
    }

    return sitemapEntries;
}
