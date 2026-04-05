"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CreditCard, Loader2 } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useRouter } from "next/navigation";
import { createPortalSession } from "@/server/actions/stripe";

interface SubscriptionSettingsProps {
  plan: string;
}

export function SubscriptionSettings({ plan }: SubscriptionSettingsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("settings.subscription");

  const title = t("title");
  const currentPlanLabel = t("currentPlan");
  const manageLabel = t("manageSubscription");
  const upgradeLabel = t("upgradeToPremium");

  const handleManage = async () => {
    setLoading(true);
    try {
      if (plan === "free") {
        router.push("/pricing");
      } else {
        const data = await createPortalSession();
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error("Failed to load portal URL", data);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-[var(--bg-warm)] bg-white/70 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-[var(--text-muted)]">{currentPlanLabel}</span>
            <span className={`text-sm font-bold capitalize ${plan === "premium" ? "text-amber-500" : "text-[var(--text-primary)]"}`}>
              {plan === "free" ? "Free" : "Recall Premium"}
            </span>
          </div>
        </div>
        <GlowButton
          variant={plan === "premium" ? "secondary" : "primary"}
          onClick={handleManage}
          disabled={loading}
          className="rounded-xl flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CreditCard className="w-4 h-4" />
          )}
          {plan === "free" ? upgradeLabel : manageLabel}
        </GlowButton>
      </div>
    </div>
  );
}
