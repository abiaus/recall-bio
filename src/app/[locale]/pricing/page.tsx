"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Footer } from "@/components/marketing/Footer";
import { useTranslations } from "next-intl";
import { createCheckoutSession } from "@/server/actions/stripe";

export default function PricingPage() {
  const t = useTranslations("pricingPage");
  const [loading, setLoading] = useState<string | null>(null);

  const tiers = [
    {
      name: t("tiers.free.name"),
      price: t("tiers.free.price"),
      description: t("tiers.free.description"),
      features: t.raw("tiers.free.features") as string[],
      buttonText: t("tiers.free.buttonText"),
      priceId: null,
      popular: false,
      icon: <BookOpen className="w-5 h-5 text-[var(--text-secondary)]" />,
    },
    {
      name: t("tiers.premium.name"),
      price: t("tiers.premium.price"),
      description: t("tiers.premium.description"),
      features: t.raw("tiers.premium.features") as string[],
      buttonText: t("tiers.premium.buttonText"),
      priceId: "price_1T9DTIGGmM9ytcu4GLfAsn2q",
      popular: true,
      icon: <Sparkles className="w-5 h-5 text-[var(--primary-clay)]" />,
    },
    {
      name: t("tiers.book.name"),
      price: t("tiers.book.price"),
      description: t("tiers.book.description"),
      features: t.raw("tiers.book.features") as string[],
      buttonText: t("tiers.book.buttonText"),
      priceId: null,
      popular: false,
      icon: <Star className="w-5 h-5 text-[var(--text-muted)]" />,
      disabled: true,
    },
  ];

  const handleCheckout = async (priceId: string | null) => {
    if (!priceId) return;
    try {
      setLoading(priceId);
      const data = await createCheckoutSession(priceId);
      
      let dataUrl = null;
      if (data.sessionId) {
        if (data.url) {
          dataUrl = data.url;
          window.location.href = data.url;
        } else {
           console.error("Missing URL from session");
        }
      } else if (data.url) {
         dataUrl = data.url;
         window.location.href = data.url;
      }

      if (!dataUrl) {
         setLoading(null);
      }
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <MarketingHeader />
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 selection:bg-[var(--primary-clay)] selection:text-white">
          
          {/* Editorial Header Sequence */}
          <div className="text-center space-y-6 mb-20">
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 40 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mx-auto border-t border-[var(--primary-clay)] mb-6"
            />
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-[var(--text-primary)] leading-tight"
            >
              {t("title")}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed"
            >
              {t("subtitle")}
            </motion.p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
            {tiers.map((tier, index) => (
              <motion.div 
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 + (index * 0.15), ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col p-8 md:p-10 transition-shadow duration-500 ease-out ${
                  tier.popular 
                    ? "bg-white border border-[#D4C5B0] shadow-xl hover:shadow-2xl z-10 md:-mt-4 md:mb-4" 
                    : "bg-[#FDF8F3] border border-[#D4C5B0]/50 hover:bg-white/80 hover:shadow-lg"
                }`}
                style={tier.disabled ? { opacity: 0.7 } : {}}
              >
                {/* Subtle visual paper texture overlay logic can be added here if desired via SVG, matching Hero */}
                
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--primary-clay)] text-white text-[11px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] shadow-sm whitespace-nowrap">
                      {t("mostPopular")}
                    </span>
                  </div>
                )}
                
                <div className="mb-10 text-center">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className={`p-3 rounded-full ${tier.popular ? 'bg-[var(--bg-warm)]' : 'bg-white'}`}>
                      {tier.icon}
                    </div>
                    <h3 className="text-xl font-serif text-[var(--text-primary)]">{tier.name}</h3>
                  </div>
                  
                  <div className="mb-3">
                    <span className="font-serif text-5xl text-[var(--text-primary)] tracking-tight">
                      {tier.price}
                    </span>
                  </div>
                  
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-[200px] mx-auto italic">
                    &ldquo;{tier.description}&rdquo;
                  </p>
                </div>

                {/* The divider line matches the hero layout style */}
                <div className="h-px w-12 bg-[#D4C5B0]/50 mx-auto mb-10" />

                <div className="flex-grow">
                  <ul className="space-y-5 mb-10">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-0.5">
                          <Check className="w-4 h-4 text-[var(--primary-clay)]/80" strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] text-[var(--text-secondary)] leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleCheckout(tier.priceId)}
                  className={`group relative w-full py-4 text-[15px] font-medium tracking-wide transition-all duration-300 ease-out overflow-hidden flex items-center justify-center gap-2 ${
                    tier.disabled 
                    ? 'bg-transparent border border-[#D4C5B0] text-[var(--text-muted)] cursor-not-allowed' 
                    : tier.popular
                      ? 'bg-[var(--text-primary)] text-white hover:bg-[var(--text-secondary)] shadow-md hover:shadow-lg'
                      : 'bg-transparent border border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-white'
                  }`}
                  disabled={tier.disabled || (loading !== null && loading === tier.priceId)}
                >
                  <span className="relative z-10 flex items-center text-center whitespace-normal break-words max-w-full">
                    {loading !== null && loading === tier.priceId ? "Preparing your journal..." : tier.buttonText}
                  </span>
                  
                  {/* Arrow animation for active buttons */}
                  {!tier.disabled && (loading === null || loading !== tier.priceId) && (
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out absolute right-6 flex-shrink-0" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </PageWrapper>
      <Footer />
    </main>
  );
}
