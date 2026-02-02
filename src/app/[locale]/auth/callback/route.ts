import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const locale = requestUrl.pathname.split("/")[1] || routing.defaultLocale;

  if (code) {
    const supabase = await createClient();

    // Intercambiar el código por una sesión
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error);
      const url = requestUrl.clone();
      url.pathname = `/${locale}/auth/login`;
      url.searchParams.set("error", "auth_failed");
      return NextResponse.redirect(url);
    }

    // Obtener el usuario autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const url = requestUrl.clone();
      url.pathname = `/${locale}/auth/login`;
      url.searchParams.set("error", "no_user");
      return NextResponse.redirect(url);
    }

    // Verificar si el usuario tiene un perfil
    const { data: profile } = await supabase
      .schema("public")
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    // Redirigir según si tiene perfil o no
    const url = requestUrl.clone();
    if (profile) {
      // Usuario existente, redirigir a today
      url.pathname = `/${locale}/app/today`;
    } else {
      // Usuario nuevo, redirigir a onboarding
      url.pathname = `/${locale}/app/onboarding`;
    }
    url.search = ""; // Limpiar query params

    return NextResponse.redirect(url);
  }

  // Si no hay código, redirigir a login
  const url = requestUrl.clone();
  url.pathname = `/${locale}/auth/login`;
  url.searchParams.set("error", "no_code");
  return NextResponse.redirect(url);
}
