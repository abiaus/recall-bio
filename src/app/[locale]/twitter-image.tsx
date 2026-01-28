import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Recall.bio - Your Digital Legacy";
const OG_SCALE = 2;
export const size = {
  width: 1200 * OG_SCALE, // 2400px para retina
  height: 600 * OG_SCALE, // 1200px - ratio 2:1 exacto
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
          padding: "100px", // Safe margins para 2x (50px * 2)
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
            border: "2px solid #DCC8B3", // Borde escalado 2x
            borderRadius: "4px",
            background: "linear-gradient(180deg, #FDF8F3 0%, #F5EBE0 100%)", // Gradiente muy sutil hacia abajo
            position: "relative",
          }}
        >
          {/* Marca Principal - Enorme para impacto en Twitter */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "260px", // Escalado 2x (130px * 2)
              fontWeight: 600,
              color: "#3D3229",
              letterSpacing: "-0.04em",
              marginBottom: "20px", // Escalado 2x
              lineHeight: "1",
            }}
          >
            Recall
          </div>

          {/* Tagline "Handwritten style" (Simulado con Italic Serif) */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "76px", // Escalado 2x (38px * 2)
              fontStyle: "italic",
              color: "#8B7355", // Color acento (dorado/marrón)
              textAlign: "center",
              marginBottom: "80px", // Escalado 2x
              maxWidth: "1600px", // Escalado 2x
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
                fontSize: "40px", // Escalado 2x (20px * 2)
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