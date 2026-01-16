"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/app/onboarding`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="font-serif text-3xl font-semibold text-[#2B241B] mb-6">
          {t("signup")}
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-[#2B241B] mb-2"
            >
              {t("displayName")}
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              placeholder={t("namePlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#2B241B] mb-2"
            >
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              placeholder={t("emailPlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#2B241B] mb-2"
            >
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("creatingAccount") : t("signup")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#5A4A3A]">
          {t("alreadyHaveAccount")}{" "}
          <Link href="/auth/login" className="text-[#8B7355] hover:underline">
            {t("signInHere")}
          </Link>
        </p>
      </div>
    </div>
  );
}
