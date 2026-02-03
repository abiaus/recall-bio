"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GlowButton } from "@/components/ui/GlowButton";

export function LogoutSection() {
  const t = useTranslations("settings.session");
  const tAuth = useTranslations("auth");

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">{t("logoutDescription")}</p>
      <Link href="/auth/logout">
        <GlowButton
          variant="ghost"
          className="w-full text-red-600 border-red-300 hover:bg-red-50"
        >
          {tAuth("logout")}
        </GlowButton>
      </Link>
    </div>
  );
}
