import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Handle i18n routing first
  const response = intlMiddleware(request);

  // Then handle Supabase auth
  let supabaseResponse = response || NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
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

  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1];
  const isLocale = ["en", "es"].includes(locale);
  const pathWithoutLocale = isLocale ? pathname.slice(locale.length + 1) : pathname;

  // Protect app routes
  if (pathWithoutLocale.startsWith("/app") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale || "en"}/auth/login`;
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    pathWithoutLocale.startsWith("/auth") &&
    user &&
    pathWithoutLocale !== "/auth/logout"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale || "en"}/app/today`;
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
