import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function AppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("nav");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div className="min-h-dvh bg-[#F6F1E7] text-[#2B241B]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link href="/app/today" className="font-serif text-2xl tracking-tight">
            Recall
          </Link>
          <nav className="flex items-center gap-6 text-sm text-[#5A4A3A]">
            <Link
              href="/app/today"
              className="hover:text-[#2B241B] transition-colors"
            >
              {t("today")}
            </Link>
            <Link
              href="/app/memories"
              className="hover:text-[#2B241B] transition-colors"
            >
              {t("memories")}
            </Link>
            <Link
              href="/app/legacy"
              className="hover:text-[#2B241B] transition-colors"
            >
              {t("legacy")}
            </Link>
            <Link
              href="/app/settings"
              className="hover:text-[#2B241B] transition-colors"
            >
              {t("settings")}
            </Link>
          </nav>
        </header>

        <main className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5">
          {children}
        </main>
      </div>
    </div>
  );
}
