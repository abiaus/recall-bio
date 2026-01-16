"use client";

import { useState } from "react";
import {
  inviteHeir,
  acceptInvitation,
  activateLegacyAccess,
  revokeLegacyAccess,
} from "@/server/actions/legacy";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
    const styles: Record<string, string> = {
      invited: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      revoked: "bg-red-100 text-red-800",
      paused: "bg-gray-100 text-gray-800",
    };
    const statusLabels: Record<string, string> = {
      invited: t("statusInvited"),
      accepted: t("statusAccepted"),
      active: t("statusActive"),
      revoked: t("statusRevoked"),
      paused: t("statusPaused"),
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[status] || styles.invited
        }`}
      >
        {statusLabels[status] || statusLabels.invited}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Invite Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-[#2B241B]">
            {t("designatedHeirs")}
          </h2>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="px-4 py-2 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors"
          >
            {showInviteForm ? t("cancel") : t("inviteHeir")}
          </button>
        </div>

        {showInviteForm && (
          <form onSubmit={handleInvite} className="mb-6 p-4 rounded-lg bg-[#F6F1E7] border border-[#D4C5B0] space-y-4">
            <div>
              <label
                htmlFor="heirEmail"
                className="block text-sm font-medium text-[#2B241B] mb-2"
              >
                {t("heirEmail")}
              </label>
              <input
                id="heirEmail"
                type="email"
                value={heirEmail}
                onChange={(e) => setHeirEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                placeholder={t("heirEmailPlaceholder")}
              />
            </div>

            <div>
              <label
                htmlFor="relationship"
                className="block text-sm font-medium text-[#2B241B] mb-2"
              >
                {t("relationship")}
              </label>
              <input
                id="relationship"
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
                placeholder={t("relationshipPlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50"
            >
              {loading ? t("sending") : t("sendInvitation")}
            </button>
          </form>
        )}

        {ownedLegacy.length === 0 ? (
          <p className="text-[#5A4A3A] text-sm">
            {t("noHeirs")}
          </p>
        ) : (
          <div className="space-y-3">
            {ownedLegacy.map((legacy) => (
              <div
                key={legacy.id}
                className="p-4 rounded-lg bg-white border border-[#D4C5B0] flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#2B241B]">
                    {legacy.heir_email}
                  </p>
                  {legacy.relationship && (
                    <p className="text-sm text-[#5A4A3A]">
                      {legacy.relationship}
                    </p>
                  )}
                  <div className="mt-2">{getStatusBadge(legacy.status)}</div>
                </div>
                <div className="flex gap-2">
                  {legacy.status === "accepted" && (
                    <button
                      onClick={() => handleActivate(legacy.id)}
                      disabled={loading}
                      className="px-3 py-1 rounded text-sm bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                    >
                      {t("activate")}
                    </button>
                  )}
                  {legacy.status !== "revoked" && (
                    <button
                      onClick={() => handleRevoke(legacy.id)}
                      disabled={loading}
                      className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {t("revoke")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invitations Received */}
      {heirLegacy.length > 0 && (
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#2B241B] mb-4">
            {t("invitationsReceived")}
          </h2>
          <div className="space-y-3">
            {heirLegacy.map((legacy) => (
              <div
                key={legacy.id}
                className="p-4 rounded-lg bg-white border border-[#D4C5B0] flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#2B241B]">
                    {t("invitationFrom")} {legacy.owner_user_id}
                  </p>
                  <div className="mt-2">{getStatusBadge(legacy.status)}</div>
                </div>
                {legacy.status === "invited" && (
                  <button
                    onClick={() => handleAccept(legacy.id)}
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] disabled:opacity-50"
                  >
                    {t("accept")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
