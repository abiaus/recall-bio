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
  };

  const softwareSchema = {

    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Recall.bio",
    operatingSystem: "All (Web App)",
    applicationCategory: "LifestyleApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: locale === "es"
      ? "Plataforma de legado digital para documentar historias de vida mediante respuestas diarias, audio, fotos y transcripción de voz."
      : "Digital legacy platform to document life stories through daily prompts, audio, photos, and AI voice transcription.",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: locale === "es" ? [
      {
        "@type": "Question",
        name: "¿Qué es Recall.bio y cómo funciona?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recall.bio es una plataforma de legado digital que te hace una pregunta diaria para documentar tus recuerdos, historias de vida y reflexiones en texto, audio o fotos.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo comparto mi legado con mi familia o herederos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Puedes invitar a herederos o seres queridos por email y configurar cuándo se les dará acceso a tu archivo emocional de recuerdos.",
        },
      },
      {
        "@type": "Question",
        name: "¿Mis grabaciones de voz se transcriben automáticamente?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, Recall.bio incluye transcripción de voz automática multiidioma para que tus audios se conviertan en texto de forma precisa.",
        },
      },
    ] : [
      {
        "@type": "Question",
        name: "What is Recall.bio and how does it work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recall.bio is a digital legacy platform that sends you daily prompts to document your life story and memories in text, voice recordings, or photos.",
        },
      },
      {
        "@type": "Question",
        name: "How do I share my digital legacy with family or heirs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can invite heirs or family members via email and configure when they unlock access to your emotional memory archive.",
        },
      },
      {
        "@type": "Question",
        name: "Are my voice recordings transcribed automatically?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Recall.bio features automatic multi-language AI transcription to convert your audio memories into searchable text.",
        },
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

