import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="font-serif text-5xl font-bold text-[#2B241B]">
          {t("title")}
        </h1>
        <p className="text-xl text-[#5A4A3A]">{t("subtitle")}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/signup"
            className="px-6 py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors"
          >
            {t("getStarted")}
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-lg border border-[#8B7355] text-[#8B7355] font-medium hover:bg-[#8B7355]/10 transition-colors"
          >
            {t("signIn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
