import { Resend } from "resend";
import { getTranslations } from "next-intl/server";
import { getLegacyInvitationEmailHtml, getLegacyInvitationEmailText, type LegacyInvitationEmailData } from "./templates/legacy-invitation";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY no está configurada. Los emails no se enviarán.");
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Recall.bio <noreply@recall.bio>";

export interface SendLegacyInvitationEmailParams {
  to: string;
  ownerName: string;
  relationship?: string | null;
  invitationToken: string;
  locale: "en" | "es";
}

export async function sendLegacyInvitationEmail(
  params: SendLegacyInvitationEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { to, ownerName, relationship, invitationToken, locale } = params;

  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY no está configurada");
    return { success: false, error: "Servicio de email no configurado" };
  }

  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "email.legacyInvitation" });

  // Construir URL de aceptación con token
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
  const acceptUrl = `${baseUrl}/${locale}/invite/${invitationToken}`;

  // Preparar traducciones
  const translations = {
    subject: t("subject", { ownerName }),
    title: t("title"),
    greeting: t("greeting"),
    body: t("body", { ownerName, relationship: relationship || "" }),
    description: t("description"),
    acceptButton: t("acceptButton"),
    fallbackLink: t("fallbackLink"),
    sentTo: t("sentTo"),
    copyright: t("copyright"),
  };

  const emailData: LegacyInvitationEmailData = {
    ownerName,
    heirEmail: to,
    relationship,
    acceptUrl,
    translations,
    locale,
  };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: translations.subject,
      html: getLegacyInvitationEmailHtml(emailData),
      text: getLegacyInvitationEmailText(emailData),
    });

    if (error) {
      console.error("Error enviando email de invitación:", error);
      return { success: false, error: error.message || "Error al enviar email" };
    }

    console.log("✅ Email de invitación enviado:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Excepción al enviar email de invitación:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido al enviar email",
    };
  }
}
