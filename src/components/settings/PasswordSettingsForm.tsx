"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { updatePasswordAction } from "@/server/actions/settings";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { GlowButton } from "@/components/ui/GlowButton";
import { CheckCircle2, XCircle } from "lucide-react";

export function PasswordSettingsForm() {
  const t = useTranslations("settings.account");
  const tErrors = useTranslations("errors");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // Validación client-side básica
    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: t("passwordTooShort"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: t("passwordMismatch"),
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("newPassword", newPassword);
    formData.set("confirmPassword", confirmPassword);

    startTransition(async () => {
      const result = await updatePasswordAction(formData);
      if (result.success) {
        setMessage({ type: "success", text: t("changed") });
        setNewPassword("");
        setConfirmPassword("");
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({
          type: "error",
          text: result.error || tErrors("saveError"),
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-2xl p-4 flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border-2 border-green-200"
                : "bg-red-50 text-red-700 border-2 border-red-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingInput
        id="newPassword"
        label={t("newPassword")}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={t("passwordPlaceholder")}
        required
      />
      <p className="text-xs text-[var(--text-muted)] -mt-2">
        {t("passwordMinLength")}
      </p>

      <FloatingInput
        id="confirmPassword"
        label={t("confirmPassword")}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t("passwordPlaceholder")}
        required
      />

      <GlowButton
        type="submit"
        disabled={isPending}
        variant="primary"
        className="w-full"
      >
        {isPending ? t("changing") : t("changePassword")}
      </GlowButton>
    </form>
  );
}
