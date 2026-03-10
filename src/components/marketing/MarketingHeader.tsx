"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

function AnimatedLogoLanding() {
    const letters = "Recall".split("");
    const Component = motion.span;

    return (
        <Component
            className="font-serif text-4xl md:text-5xl tracking-tight text-[var(--text-primary)] cursor-pointer inline-flex"
            whileHover="hover"
            initial="initial"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                        initial: { y: 0 },
                        hover: {
                            y: [0, -8, 0],
                            transition: {
                                delay: index * 0.05,
                                duration: 0.3,
                                ease: "easeInOut",
                            },
                        },
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </Component>
    );
}

export function MarketingHeader() {
    const t = useTranslations("blog");

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full pt-6 pb-4 md:pt-8 md:pb-4 relative flex justify-between md:justify-center items-center px-4 sm:px-6 md:px-8 z-50"
        >
            <Link href="/" className="shrink-0">
                <AnimatedLogoLanding />
            </Link>
            <div className="static md:absolute md:right-4 lg:right-8 md:top-8 flex items-center gap-4 sm:gap-6">
                <Link href="/pricing" className="text-sm font-medium text-[var(--primary-terracotta)] hover:text-[var(--primary-clay)] transition-colors">
                    {t("pricing")}
                </Link>
                <Link href="/blog" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--primary-terracotta)] transition-colors">
                    Blog
                </Link>
                <LanguageSwitcher />
            </div>
        </motion.header>
    );
}
