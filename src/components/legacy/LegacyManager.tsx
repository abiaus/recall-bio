"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  inviteHeir,
  acceptInvitation,
  activateLegacyAccess,
  revokeLegacyAccess,
} from "@/server/actions/legacy";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { containerVariants, itemVariants } from "@/components/ui/animations";
import { UserPlus, Mail, Users, CheckCircle2, XCircle, Clock, Send } from "lucide-react";

interface LegacyAccess {
  id: string;
  owner_user_id: string;
  heir_email: string;
  heir_user_id: string | null;
  relationship: string | null;
  status: string;
  release_mode: string;
  effective_at: string | null;
  created_at: string;
}

interface LegacyManagerProps {
  ownedLegacy: LegacyAccess[];
  heirLegacy: LegacyAccess[];
}

export function LegacyManager({ ownedLegacy, heirLegacy }: LegacyManagerProps) {
  const t = useTranslations("legacy");
  const tErrors = useTranslations("errors");
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [heirEmail, setHeirEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await inviteHeir(heirEmail, relationship);

    if (result.success) {
      setHeirEmail("");
      setRelationship("");
      setShowInviteForm(false);
      router.refresh();
    } else {
      alert(result.error || tErrors("genericError"));
    }

    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    setLoading(true);
    const result = await acceptInvitation(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || tErrors("genericError"));
    }
    setLoading(false);
  };

  const handleActivate = async (id: string) => {
    if (!confirm(t("activateConfirm"))) return;
    setLoading(true);
    const result = await activateLegacyAccess(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || tErrors("genericError"));
    }
    setLoading(false);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm(t("revokeConfirm"))) return;
    setLoading(true);
    const result = await revokeLegacyAccess(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || tErrors("genericError"));
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
      invited: { icon: <Clock className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-800", label: t("statusInvited") },
      accepted: { icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-blue-100 text-blue-800", label: t("statusAccepted") },
      active: { icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-green-100 text-green-800", label: t("statusActive") },
      revoked: { icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-800", label: t("statusRevoked") },
      paused: { icon: <Clock className="w-4 h-4" />, color: "bg-gray-100 text-gray-800", label: t("statusPaused") },
    };
    const statusConfig = config[status] || config.invited;
    return (
      <motion.span
        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${statusConfig.color}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {statusConfig.icon}
        {statusConfig.label}
      </motion.span>
    );
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Invite Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[var(--primary-terracotta)]" />
            <h2 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
              {t("designatedHeirs")}
            </h2>
          </div>
          <GlowButton
            onClick={() => setShowInviteForm(!showInviteForm)}
            variant="primary"
            className="flex items-center gap-2"
          >
            {showInviteForm ? (
              <>
                <XCircle className="w-4 h-4" />
                {t("cancel")}
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                {t("inviteHeir")}
              </>
            )}
          </GlowButton>
        </div>

        <AnimatePresence>
          {showInviteForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatedCard className="p-6 mb-6">
                <form onSubmit={handleInvite} className="space-y-4">
                  <FloatingInput
                    id="heirEmail"
                    label={t("heirEmail")}
                    type="email"
                    value={heirEmail}
                    onChange={(e) => setHeirEmail(e.target.value)}
                    placeholder={t("heirEmailPlaceholder")}
                    required
                  />

                  <FloatingInput
                    id="relationship"
                    label={t("relationship")}
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder={t("relationshipPlaceholder")}
                  />

                  <GlowButton
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? t("sending") : t("sendInvitation")}
                  </GlowButton>
                </form>
              </AnimatedCard>
            </motion.div>
          )}
        </AnimatePresence>

        {ownedLegacy.length === 0 ? (
          <AnimatedCard className="p-8 text-center">
            <Mail className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">{t("noHeirs")}</p>
          </AnimatedCard>
        ) : (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
          >
            {ownedLegacy.map((legacy) => (
              <motion.div key={legacy.id} variants={itemVariants}>
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)] text-lg mb-1">
                        {legacy.heir_email}
                      </p>
                      {legacy.relationship && (
                        <p className="text-sm text-[var(--text-secondary)] mb-3">
                          {legacy.relationship}
                        </p>
                      )}
                      {getStatusBadge(legacy.status)}
                    </div>
                    <div className="flex gap-2 ml-4">
                      {legacy.status === "accepted" && (
                        <GlowButton
                          onClick={() => handleActivate(legacy.id)}
                          disabled={loading}
                          variant="secondary"
                          className="text-sm"
                        >
                          {t("activate")}
                        </GlowButton>
                      )}
                      {legacy.status !== "revoked" && (
                        <GlowButton
                          onClick={() => handleRevoke(legacy.id)}
                          disabled={loading}
                          variant="ghost"
                          className="text-sm text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {t("revoke")}
                        </GlowButton>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Invitations Received */}
      {heirLegacy.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-[var(--primary-terracotta)]" />
            <h2 className="font-serif text-2xl font-semibold text-[var(--text-primary)]">
              {t("invitationsReceived")}
            </h2>
          </div>
          <motion.div
            className="space-y-4"
            variants={containerVariants}
          >
            {heirLegacy.map((legacy) => (
              <motion.div key={legacy.id} variants={itemVariants}>
                <AnimatedCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[var(--text-primary)] text-lg mb-3">
                        {t("invitationFrom")} {legacy.owner_user_id}
                      </p>
                      {getStatusBadge(legacy.status)}
                    </div>
                    {legacy.status === "invited" && (
                      <GlowButton
                        onClick={() => handleAccept(legacy.id)}
                        disabled={loading}
                        variant="primary"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t("accept")}
                      </GlowButton>
                    )}
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
