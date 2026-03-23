import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { localePath } from "@/i18n/routing";

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect(localePath("/auth/login", locale));
}
