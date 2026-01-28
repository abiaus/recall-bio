import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { StructuredData } from "@/components/marketing/StructuredData";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "marketing.hero" });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const url = `${baseUrl}/${locale === routing.defaultLocale ? "" : locale}`;
    const domain = new URL(baseUrl).hostname;

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: t("title"),
            template: "%s | Recall.bio",
        },
        description: t("subtitle"),
        keywords: [
            "legado digital",
            "recuerdos",
            "memorias",
            "historia familiar",
            "diario personal",
            "archivo emocional",
            "digital legacy",
            "memories",
            "family history",
            "personal journal",
            "emotional archive",
        ],
        authors: [{ name: "Recall.bio" }],
        creator: "Recall.bio",
        publisher: "Recall.bio",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        alternates: {
            canonical: url,
            languages: {
                en: `${baseUrl}/en`,
                es: `${baseUrl}/es`,
                "x-default": baseUrl,
            },
        },
        openGraph: {
            type: "website",
            locale: locale,
            url: url,
            siteName: "Recall.bio",
            title: "\u200B", // Zero-width space - oculta título superpuesto en X
            description: t("subtitle"),
            images: [
                {
                    url: "/og.png",
                    width: 1200,
                    height: 600,
                    alt: "Recall - Your Life, Your Voice, Your Legacy",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "\u200B", // Zero-width space - oculta título superpuesto en X
            description: t("subtitle"),
            creator: "@recallbio",
            images: ["/og.png"],
        },
        other: {
            "twitter:domain": domain,
            "twitter:url": url,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        icons: {
            icon: "/favicon.ico",
            apple: "/apple-touch-icon.png",
        },
        manifest: "/manifest.json",
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "en" | "es")
    ) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `document.documentElement.lang = '${locale}';`,
                }}
            />
            <StructuredData locale={locale} />
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </>
    );
}
