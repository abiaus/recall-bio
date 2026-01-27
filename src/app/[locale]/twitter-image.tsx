import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Recall.bio - Your Digital Legacy";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isSpanish = locale === "es";

  // Cargar fuente Playfair Display (Misma fuente para consistencia de marca)
  const fontData = await fetch(
    new URL("https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          background: "#FDF8F3", // Fondo Beige Marca
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Contenedor con borde decorativo (Efecto tarjeta premium) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "1px solid #DCC8B3", // Borde un poco más oscuro para contraste
            borderRadius: "2px",
            background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)", // Gradiente muy sutil hacia abajo
            position: "relative",
          }}
        >
          {/* Marca Principal - Enorme para impacto en Twitter */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "130px", // Más grande que en OG regular
              fontWeight: 600,
              color: "#3D3229",
              letterSpacing: "-0.04em",
              marginBottom: "10px",
              lineHeight: "1",
            }}
          >
            Recall
          </div>

          {/* Tagline "Handwritten style" (Simulado con Italic Serif) */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "38px",
              fontStyle: "italic",
              color: "#8B7355", // Color acento (dorado/marrón)
              textAlign: "center",
              marginBottom: "40px",
              maxWidth: "800px",
            }}
          >
            {isSpanish ? "Tu voz. Tu vida. Tu legado." : "Your voice. Your life. Your legacy."}
          </div>

          {/* Pill / Badge inferior con la URL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 24px",
              border: "1px solid #3D3229",
              borderRadius: "50px", // Pill shape
              marginTop: "20px",
            }}
          >
            <span
              style={{
                fontFamily: '"Playfair Display"',
                fontSize: "20px",
                color: "#3D3229",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Recall.bio
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}