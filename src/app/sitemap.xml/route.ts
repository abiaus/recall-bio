import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isAppSubdomain = host.startsWith("app.");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";

  if (isAppSubdomain) {
    // For app subdomain, return empty sitemap
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`,
      {
        headers: {
          "Content-Type": "application/xml",
        },
      }
    );
  }

  // For main domain, generate sitemap with public pages
  const urls = routing.locales.flatMap((locale) => {
    const path = locale === routing.defaultLocale ? "" : `/${locale}`;
    return [
      {
        loc: `${baseUrl}${path}`,
        changefreq: "weekly" as const,
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
    ];
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
      .map(
        (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    ${routing.locales
            .map(
              (locale) =>
                `    <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale === routing.defaultLocale ? "" : locale}" />`
            )
            .join("\n")}
  </url>`
      )
      .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
