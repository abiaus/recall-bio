declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    const gaId = process.env.NEXT_PUBLIC_GA4_ID || "G-M8PQZP1R7Y";
    window.gtag("config", gaId, {
      page_path: url,
    });
  }
};

// Specific event helpers
export const trackSignup = () => {
  trackEvent("sign_up", "engagement", "user_signup");
};

export const trackLogin = () => {
  trackEvent("login", "engagement", "user_login");
};

export const trackCTAClick = (location: string) => {
  trackEvent("click", "cta", location);
};

export const trackMemorySaved = () => {
  trackEvent("save_memory", "engagement", "memory_created");
};
