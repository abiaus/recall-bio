"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const params = useParams();
  const locale = params.locale as string;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Verificar si hay una sesión válida (el usuario llegó desde el email)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();
  }, [supabase.auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
    }
  };

  // Estado de carga inicial
  if (isValidSession === null) {
    return (
      <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5">
          <p className="text-center text-[#5A4A3A]">{t("verifyingLink")}</p>
        </div>
      </div>
    );
  }

  // Enlace inválido o expirado
  if (!isValidSession) {
    return (
      <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5">
          <h1 className="font-serif text-3xl font-semibold text-[#2B241B] mb-4">
            {t("invalidLink")}
          </h1>
          <p className="text-sm text-[#5A4A3A] mb-6">
            {t("invalidLinkDescription")}
          </p>
          <Link
            href="/auth/forgot-password"
            className="block w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors text-center"
          >
            {t("requestNewLink")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="font-serif text-3xl font-semibold text-[#2B241B] mb-2">
          {t("newPassword")}
        </h1>
        <p className="text-sm text-[#5A4A3A] mb-6">
          {t("newPasswordDescription")}
        </p>

        {success ? (
          <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
            <p className="font-medium">{t("passwordUpdated")}</p>
            <p className="mt-1">{t("redirectingToLogin")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2B241B] mb-2"
              >
                {t("newPasswordLabel")}
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

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#2B241B] mb-2"
              >
                {t("confirmPasswordLabel")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? t("updating") : t("updatePassword")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
