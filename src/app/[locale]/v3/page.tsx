import { Metadata } from "next";
import { V3AnimatedBackground } from "@/components/v3-revamp/V3AnimatedBackground";
import { V3RevampHeader } from "@/components/v3-revamp/V3RevampHeader";
import { V3RevampHero } from "@/components/v3-revamp/V3RevampHero";
import { V3RevampMatrix } from "@/components/v3-revamp/V3RevampMatrix";
import { V3RevampStudio } from "@/components/v3-revamp/V3RevampStudio";
import { V3RevampHeirTerminal } from "@/components/v3-revamp/V3RevampHeirTerminal";
import { V3RevampComparison } from "@/components/v3-revamp/V3RevampComparison";
import { V3RevampPricing } from "@/components/v3-revamp/V3RevampPricing";
import { V3RevampFooter } from "@/components/v3-revamp/V3RevampFooter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === "es";

  return {
    title: isEs
      ? "Recall.bio V3 — Rediseño Total Bóveda de Legado Sonoro"
      : "Recall.bio V3 — Total Revamp Sonic Legacy Vault",
    description: isEs
      ? "La nueva experiencia inmersiva para preservar historias de voz con transcripción Gemini IA y custodia para herederos."
      : "The all-new immersive experience to preserve voice stories with Gemini AI transcription and heir custody controls.",
  };
}

export default async function V3LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      {/* Impeccable 4 Direction Contract */}
      <script
        dangerouslySetInnerHTML={{
          __html: `<!--
THESIS: Rediseño total absoluto y completo de la landing page con fondo animado continuo de auroras orgánicas y partículas de estelado sónico.
OWN-WORLD: Midnight Dark Canvas (#1C1612), Flame Terracotta (#E07A5F), Sage (#81B29A), Amber Gold (#F2CC8F). Animated Canvas Fluid Background, Interactive Audio Reactor, Live Studio.
STORY: El visitante vive una experiencia inmersiva cinematográfica con fondo animado fluido, interactúa con el reactivo de voz 3D, prueba la grabación de voz en tiempo real con Gemini IA y configura la terminal de herederos.
FIRST VIEWPORT: Sonic Sphere Reactor with Live Interactive Audio and Animated Fluid Background.
FORM: Total Revamp Sonic Legacy Sanctuary.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->`,
        }}
      />

      <div className="relative min-h-screen bg-[#1C1612] text-[#FDF8F3] font-sans antialiased selection:bg-[#E07A5F] selection:text-white">
        {/* Animated Background Canvas */}
        <V3AnimatedBackground />

        {/* Foreground Content */}
        <div className="relative z-10">
          <V3RevampHeader locale={locale} />
          <V3RevampHero />
          <V3RevampMatrix />
          <V3RevampStudio />
          <V3RevampHeirTerminal />
          <V3RevampComparison />
          <V3RevampPricing />
          <V3FooterRevamp />
        </div>
      </div>
    </>
  );
}

function V3FooterRevamp() {
  return <V3RevampFooter />;
}
