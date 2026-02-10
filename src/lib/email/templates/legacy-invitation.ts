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
                ${translations.title}
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px;">
                ${translations.greeting}
              </p>
              
              <p style="margin: 0 0 20px 0; color: #4a4a4a; font-size: 16px;">
                ${bodyText}
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4a4a4a; font-size: 16px;">
                ${translations.description}
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${acceptUrl}" style="display: inline-block; background-color: #d4a574; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(212, 165, 116, 0.3);">
                      ${translations.acceptButton}
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.6;">
                ${translations.fallbackLink}<br>
                <a href="${acceptUrl}" style="color: #d4a574; word-break: break-all;">${acceptUrl}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f7; border-top: 1px solid #e5e5e0; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6a6a6a; font-size: 14px;">
                ${translations.sentTo} <strong>${heirEmail}</strong>
              </p>
              <p style="margin: 0; color: #8a8a8a; font-size: 12px;">
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
