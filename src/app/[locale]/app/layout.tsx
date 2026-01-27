import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AppHeader } from "@/components/ui/AppHeader";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { BlobBackground } from "@/components/ui/BlobBackground";

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
    <div className="min-h-dvh relative overflow-hidden" style={{ background: "var(--bg-cream)" }}>
      <BlobBackground count={3} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <AppHeader
          navItems={[
            { href: "/app/today", label: t("today") },
            { href: "/app/memories", label: t("memories") },
            { href: "/app/legacy", label: t("legacy") },
            { href: "/app/settings", label: t("settings") },
          ]}
        />

        <PageWrapper>
          <main className="rounded-3xl bg-white/80 backdrop-blur-md p-4 sm:p-6 md:p-8 shadow-lg border border-[#D4C5B0]/30 mt-8">
            {children}
          </main>
        </PageWrapper>
      </div>
    </div>
  );
}

