"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function Footer() {
    const t = useTranslations("footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#fcf9f5] border-t border-[#D4C5B0]/30 py-12 md:py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 cursor-default">
                {/* Brand & Description */}
                <div className="flex flex-col max-w-sm">
                    <Link href="/" className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-4 tracking-tight inline-block hover:opacity-80 transition-opacity">
                        Recall.bio
                    </Link>
                    <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
                        {t("description")}
                    </p>
                </div>

                {/* Links Matrix */}
                <div className="flex flex-col sm:flex-row gap-12 md:gap-24 w-full md:w-auto">
                    {/* Product */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-medium text-sm text-[var(--text-primary)] uppercase tracking-wider">
                            {t("product")}
                        </h4>
                        <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] text-sm transition-colors">
                            {t("home")}
                        </Link>
                        <Link href="/pricing" className="text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] text-sm transition-colors">
                            {t("pricing")}
                        </Link>
                        <Link href="/blog" className="text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] text-sm transition-colors">
                            {t("blog")}
                        </Link>
                        <a href={`mailto:${t("contactEmail")}`} className="text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] text-sm transition-colors">
                            {t("contact")}
                        </a>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="font-medium text-sm text-[var(--text-primary)] uppercase tracking-wider">
                            {t("legal")}
                        </h4>
                        <Link href="/terms" className="text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] text-sm transition-colors">
                            {t("terms")}
                        </Link>
                        <Link href="/privacy" className="text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] text-sm transition-colors">
                            {t("privacy")}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#D4C5B0]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
                <p>{t("copyright", { year: currentYear })}</p>
                <div className="flex items-center space-x-4">
                    <span className="opacity-50">Made with care.</span>
                </div>
            </div>
        </footer>
    );
}
