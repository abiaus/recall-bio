import dynamic from "next/dynamic";
import { HeroSection } from "@/components/marketing/HeroSection";
import { Footer } from "@/components/marketing/Footer";

const ProblemSection = dynamic(() => import("@/components/marketing/ProblemSection").then(mod => mod.ProblemSection));
const SolutionSection = dynamic(() => import("@/components/marketing/SolutionSection").then(mod => mod.SolutionSection));
const HowItWorksSection = dynamic(() => import("@/components/marketing/HowItWorksSection").then(mod => mod.HowItWorksSection));
const TestimonialsSection = dynamic(() => import("@/components/marketing/TestimonialsSection").then(mod => mod.TestimonialsSection));
const FAQSection = dynamic(() => import("@/components/marketing/FAQSection").then(mod => mod.FAQSection));
const CTASection = dynamic(() => import("@/components/marketing/CTASection").then(mod => mod.CTASection));

export default function HomePage() {
    return (
        <main className="min-h-screen">
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </main>
    );
}
