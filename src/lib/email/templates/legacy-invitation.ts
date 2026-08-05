export interface LegacyInvitationEmailData {
  ownerName: string;
  heirEmail: string;
  relationship?: string | null;
  acceptUrl: string;
  translations: {
    subject: string;
    title: string;
    greeting: string;
    body: string;
    description: string;
    acceptButton: string;
    fallbackLink: string;
    sentTo: string;
    copyright: string;
  };
  locale: "en" | "es";
}

export function getLegacyInvitationEmailHtml(data: LegacyInvitationEmailData): string {
  const { ownerName, heirEmail, relationship, acceptUrl, translations, locale } = data;

  const relationshipText = relationship
    ? locale === "es"
      ? `como ${relationship}`
      : `as ${relationship}`
    : "";

  const bodyText = translations.body
    .replace("{ownerName}", `<strong>${ownerName}</strong>`)
    .replace("{relationship}", relationshipText ? relationshipText + " " : "");

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${translations.title} - Recall.bio</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Outfit, sans-serif; background-color: #FDF8F3; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FDF8F3; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 12px rgba(61, 50, 41, 0.06);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9E5D46 0%, #8B6F4E 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; font-family: Playfair Display, Georgia, serif;">
                Recall.bio
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #3D3229; font-size: 24px; font-weight: 600; font-family: Georgia, serif;">
                ${translations.title}
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #6B5D4D; font-size: 16px;">
                ${translations.greeting}
              </p>
              
              <p style="margin: 0 0 20px 0; color: #6B5D4D; font-size: 16px;">
                ${bodyText}
              </p>
              
              <p style="margin: 0 0 30px 0; color: #6B5D4D; font-size: 16px;">
                ${translations.description}
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${acceptUrl}" style="display: inline-block; background-color: #9E5D46; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 16px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(158, 93, 70, 0.2);">
                      ${translations.acceptButton}
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #7C6C5B; font-size: 14px; line-height: 1.6;">
                ${translations.fallbackLink}<br>
                <a href="${acceptUrl}" style="color: #9E5D46; word-break: break-all;">${acceptUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #FDF8F3; border-top: 1px solid #F7EDE4; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #7C6C5B; font-size: 14px;">
                ${translations.sentTo} <strong>${heirEmail}</strong>
              </p>
              <p style="margin: 0; color: #7C6C5B; font-size: 14px;">
                © ${new Date().getFullYear()} Recall.bio. ${translations.copyright}
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
  const { ownerName, heirEmail, relationship, acceptUrl, translations, locale } = data;

  const relationshipText = relationship
    ? locale === "es"
      ? `como ${relationship}`
      : `as ${relationship}`
    : "";

  const bodyText = translations.body
    .replace("{ownerName}", ownerName)
    .replace("{relationship}", relationshipText ? relationshipText + " " : "");

  return `
${translations.title}

${translations.greeting}

${bodyText}

${translations.description}

${translations.acceptButton}: ${acceptUrl}

${translations.fallbackLink}: ${acceptUrl}

${translations.sentTo} ${heirEmail}

© ${new Date().getFullYear()} Recall.bio. ${translations.copyright}
  `.trim();
}
