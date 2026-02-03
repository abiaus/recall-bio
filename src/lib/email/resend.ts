import { Resend } from "resend";
import { getLegacyInvitationEmailHtml, getLegacyInvitationEmailText, type LegacyInvitationEmailData } from "./templates/legacy-invitation";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  RESEND_API_KEY no está configurada. Los emails no se enviarán.");
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Recall.bio <noreply@recall.bio>";
const FROM_NAME = "Recall.bio";

export interface SendLegacyInvitationEmailParams {
  to: string;
  ownerName: string;
  relationship?: string | null;
}

export async function sendLegacyInvitationEmail(
  params: SendLegacyInvitationEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { to, ownerName, relationship } = params;

  if (!process.env.RESEND_API_KEY) {
    console.error("❌ RESEND_API_KEY no está configurada");
    return { success: false, error: "Servicio de email no configurado" };
  }

  // Construir URL de aceptación
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";
  const defaultLocale = "es"; // Puedes hacerlo dinámico según el usuario
  const acceptUrl = `${baseUrl}/${defaultLocale}/app/legacy`;

  const emailData: LegacyInvitationEmailData = {
    ownerName,
    heirEmail: to,
    relationship,
    acceptUrl,
  };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `${ownerName} te ha invitado a su Legado Digital`,
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
