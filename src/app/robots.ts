import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://recall.bio';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/app/', '/auth/', '/admin/', '/private/'],
            },
            {
                userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Bingbot'],
                allow: '/',
                disallow: ['/api/', '/app/', '/auth/', '/admin/', '/private/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

