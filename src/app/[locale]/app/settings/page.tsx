import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { localePath } from "@/i18n/routing";
import { SettingsContent } from "@/components/settings/SettingsContent";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(localePath("/auth/login", locale));
  }

  return <SettingsContent />;
}
