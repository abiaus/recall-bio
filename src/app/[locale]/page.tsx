import { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/marketing/HeroSection";
import { Footer } from "@/components/marketing/Footer";
import { FeaturedArticlesSection } from "@/components/marketing/FeaturedArticlesSection";
import { getBlogPosts } from "@/lib/blog";
import { routing } from "@/i18n/routing";

const ProblemSection = dynamic(() => import("@/components/marketing/ProblemSection").then(mod => mod.ProblemSection));
const SolutionSection = dynamic(() => import("@/components/marketing/SolutionSection").then(mod => mod.SolutionSection));
const HowItWorksSection = dynamic(() => import("@/components/marketing/HowItWorksSection").then(mod => mod.HowItWorksSection));
const TestimonialsSection = dynamic(() => import("@/components/marketing/TestimonialsSection").then(mod => mod.TestimonialsSection));
const FAQSection = dynamic(() => import("@/components/marketing/FAQSection").then(mod => mod.FAQSection));
const CTASection = dynamic(() => import("@/components/marketing/CTASection").then(mod => mod.CTASection));

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
    const url =
        locale === routing.defaultLocale
            ? baseUrl
            : `${baseUrl}/${locale}`;

    return {
        alternates: {
            canonical: url,
            languages: {
                en: baseUrl,
                es: `${baseUrl}/es`,
                "x-default": baseUrl,
            },
        },
    };
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const posts = await getBlogPosts(locale);

    return (
        <main className="min-h-screen">
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <FeaturedArticlesSection locale={locale} posts={posts} />
            <FAQSection />
            <CTASection />
            <Footer />
        </main>
    );
}
