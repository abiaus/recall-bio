import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const isAppSubdomain = host.startsWith("app.");

  if (isAppSubdomain) {
    if (pathname === "/" || pathname.match(/^\/(en|es)$/)) {
      const { data: { user } } = await createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll() { },
          },
        }
      ).auth.getUser();

      const locale = pathname === "/" ? routing.defaultLocale : pathname.slice(1);
      const url = request.nextUrl.clone();
      url.pathname = user ? `/${locale}/app/today` : `/${locale}/auth/login`;
      return NextResponse.redirect(url);
    }
  }

  const intlResponse = intlMiddleware(request);
  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const response = intlResponse || NextResponse.next({ request });

  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const isLocale = routing.locales.includes(firstSegment as "en" | "es");
  const locale = isLocale ? firstSegment : routing.defaultLocale;
  const pathWithoutLocale = isLocale
    ? "/" + segments.slice(1).join("/")
    : request.nextUrl.pathname;

  let supabaseResponse = response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathWithoutLocale.startsWith("/app") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/login`;
    return NextResponse.redirect(url);
  }

  if (
    pathWithoutLocale.startsWith("/auth") &&
    user &&
    pathWithoutLocale !== "/auth/logout"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/app/today`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
