import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isAppSubdomain = host.startsWith("app.");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";

  if (isAppSubdomain) {
    // For app subdomain, disallow all indexing
    return new NextResponse(
      `User-agent: *
Disallow: /

# No indexing for app subdomain`,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }

  // For main domain, allow indexing of public pages
  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  
  return new NextResponse(
    `User-agent: *
Allow: /
Allow: /en
Allow: /es
Disallow: /app/
Disallow: /auth/
Disallow: /api/

Sitemap: ${sitemapUrl}`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
