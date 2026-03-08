import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Footer } from "@/components/marketing/Footer";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "privacy" });
    
    return {
        title: t("title"),
        description: t("description"),
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "privacy" });

    const sections = [
        "collect",
        "use",
        "storage",
        "retention",
        "third_parties",
        "cookies",
        "rights",
        "contact",
    ];

    return (
        <main className="min-h-screen bg-[var(--bg-cream)] flex flex-col">
            <MarketingHeader />
            
            <div className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-8 py-16 md:py-24">
                <div className="space-y-4 mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl text-[var(--text-primary)] tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wider">
                        {t("lastUpdated")}
                    </p>
                    <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-2xl pt-4">
                        {t("description")}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#D4C5B0]/30 space-y-10">
                    {sections.map((section) => (
                        <section key={section} className="space-y-4">
                            <h2 className="font-serif text-2xl text-[var(--text-primary)]">
                                {t(`${section}.title`)}
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                {t(`${section}.content`, {
                                    contactEmail: "hello@recall.bio"
                                })}
                            </p>
                        </section>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
