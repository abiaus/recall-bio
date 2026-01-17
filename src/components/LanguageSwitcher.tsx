"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher() {
    const t = useTranslations("language");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#D4C5B0]/30">
            {routing.locales.map((loc) => (
                <motion.button
                    key={loc}
                    onClick={() => handleLocaleChange(loc)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all ${
                        locale === loc
                            ? "bg-[var(--primary-terracotta)] text-white shadow-md"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/50"
                    }`}
                    aria-label={t(loc)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                >
                    {loc.toUpperCase()}
                </motion.button>
            ))}
        </div>
    );
}
