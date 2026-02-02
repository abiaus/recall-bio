"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function LoginPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/${locale}/app/today`);
      router.refresh();
    }
  };

  return (
    <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="font-serif text-3xl font-semibold text-[#2B241B] mb-6">
          {t("login")}
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

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
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2B241B]"
              >
                {t("password")}
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-[#8B7355] hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
              placeholder={t("passwordPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("signingIn") : t("login")}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D4C5B0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/70 text-[#5A4A3A]">
                {t("or")}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#5A4A3A]">
          {t("noAccount")}{" "}
          <Link href="/auth/signup" className="text-[#8B7355] hover:underline">
            {t("signUpHere")}
          </Link>
        </p>
      </div>
    </div>
  );
}
