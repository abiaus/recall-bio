export async function StructuredData({ locale }: { locale: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://recall.bio";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Recall.bio",
    url: baseUrl,
    description: locale === "es"
      ? "Documenta tu vida mediante respuestas diarias. Reflexiona, aprende y preserva tu voz para vos y las personas que elijas."
      : "Document your life through daily responses. Reflect, learn, and preserve your voice for yourself and the people you choose.",
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Recall.bio",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: locale === "es"
      ? "Plataforma para documentar tu vida, reflexionar y preservar tu legado mediante preguntas diarias y tu propia voz."
      : "Platform to document your life, reflect, and preserve your legacy through daily questions and your own voice.",
    sameAs: [
      // Add social media links here when available
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
