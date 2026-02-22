import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--bg-cream)] flex flex-col">
            <MarketingHeader />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}
