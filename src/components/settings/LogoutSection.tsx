"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GlowButton } from "@/components/ui/GlowButton";

export function LogoutSection() {
  const t = useTranslations("settings.session");
  const tAuth = useTranslations("auth");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">{t("logoutDescription")}</p>
      <Link href={`/${locale}/auth/logout`}>
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
