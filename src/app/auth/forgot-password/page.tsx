"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#F6F1E7] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm ring-1 ring-black/5">
        <h1 className="font-serif text-3xl font-semibold text-[#2B241B] mb-2">
          Restablecer Contraseña
        </h1>
        <p className="text-sm text-[#5A4A3A] mb-6">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 text-green-700 text-sm">
              <p className="font-medium">¡Revisa tu correo!</p>
              <p className="mt-1">
                Te hemos enviado un enlace para restablecer tu contraseña a{" "}
                <span className="font-medium">{email}</span>
              </p>
            </div>
            <Link
              href="/auth/login"
              className="block w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors text-center"
            >
              Volver al inicio de sesión
            </Link>
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
                htmlFor="email"
                className="block text-sm font-medium text-[#2B241B] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-[#5A4A3A]">
          <Link href="/auth/login" className="text-[#8B7355] hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
