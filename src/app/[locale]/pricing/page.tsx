import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { localePath, routing } from "@/i18n/routing";
import { PricingClient } from "./PricingClient";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "pricingPage" });
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const url = `${baseUrl}${localePath("/pricing", locale)}`;

    return {
        title: t("title"),
        description: t("subtitle"),
        alternates: {
            canonical: url,
            languages: {
                en: `${baseUrl}${localePath("/pricing", routing.defaultLocale)}`,
                es: `${baseUrl}${localePath("/pricing", "es")}`,
                "x-default": `${baseUrl}${localePath("/pricing", routing.defaultLocale)}`,
            },
        },
    };
}

export default function PricingPage() {
    return <PricingClient />;
}
