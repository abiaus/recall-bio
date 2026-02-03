export interface LegacyInvitationEmailData {
  ownerName: string;
  heirEmail: string;
  relationship?: string | null;
  acceptUrl: string;
}

export function getLegacyInvitationEmailHtml(data: LegacyInvitationEmailData): string {
  const { ownerName, heirEmail, relationship, acceptUrl } = data;

  const relationshipText = relationship
    ? `como ${relationship}`
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación de Legado - Recall.bio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f0; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f0; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d4a574 0%, #c4936a 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; font-family: Georgia, serif;">
                Recall.bio
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #2c2c2c; font-size: 24px; font-weight: 600; font-family: Georgia, serif;">
                Has sido invitado a un Legado Digital
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px;">
                Hola,
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px;">
                <strong>${ownerName}</strong> ${relationshipText ? relationshipText + " " : ""}te ha invitado a ser parte de su legado digital en Recall.bio.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4a4a4a; font-size: 16px;">
                Al aceptar esta invitación, podrás acceder a sus memorias y recuerdos cuando así lo decida, preservando su historia y voz para las generaciones futuras.
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${acceptUrl}" style="display: inline-block; background-color: #d4a574; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(212, 165, 116, 0.3);">
                      Aceptar Invitación
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.6;">
                Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
                <a href="${acceptUrl}" style="color: #d4a574; word-break: break-all;">${acceptUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f7; border-top: 1px solid #e5e5e0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6a6a6a; font-size: 14px;">
                Este email fue enviado a <strong>${heirEmail}</strong>
              </p>
              <p style="margin: 0; color: #8a8a8a; font-size: 12px;">
                © ${new Date().getFullYear()} Recall.bio. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getLegacyInvitationEmailText(data: LegacyInvitationEmailData): string {
  const { ownerName, heirEmail, relationship, acceptUrl } = data;

  const relationshipText = relationship
    ? `como ${relationship}`
    : "";

  return `
Has sido invitado a un Legado Digital

Hola,

${ownerName} ${relationshipText ? relationshipText + " " : ""}te ha invitado a ser parte de su legado digital en Recall.bio.

Al aceptar esta invitación, podrás acceder a sus memorias y recuerdos cuando así lo decida, preservando su historia y voz para las generaciones futuras.

Acepta la invitación aquí: ${acceptUrl}

Este email fue enviado a ${heirEmail}

© ${new Date().getFullYear()} Recall.bio. Todos los derechos reservados.
  `.trim();
}
