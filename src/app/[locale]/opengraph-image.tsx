import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Recall.bio - Your Digital Legacy";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Función auxiliar para cargar la fuente de Google
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isSpanish = locale === "es";

  // Textos dinámicos
  const titleText = isSpanish
    ? "Tu Legado Digital, Un Recuerdo a la Vez"
    : "Your Digital Legacy, One Memory at a Time";
  
  const subTitleText = isSpanish
    ? "Documenta tu historia de vida mediante respuestas diarias"
    : "Document your life story through daily responses";

  // Cargar la fuente Playfair Display
  // Nota: Cargamos los caracteres necesarios o una versión completa si es posible cachearla
  const fontData = await fetch(
    new URL("https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff2", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDF8F3", // El beige cálido solicitado
          padding: "40px", // Margen externo
        }}
      >
        {/* Contenedor Interno "Elegante" con borde */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            border: "2px solid #E8DDD0", // Borde sutil
            borderRadius: "4px",
            background: "radial-gradient(circle at center, #FDF8F3 0%, #FAF2EB 100%)",
          }}
        >
          {/* Logo Principal - Estilo "Recall" */}
          <div
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "100px", // Muy grande y refinado
              color: "#3D3229", // Marrón oscuro de marca
              marginBottom: "10px",
              letterSpacing: "-0.03em",
            }}
          >
            Recall
          </div>

          {/* Línea divisoria decorativa */}
          <div
            style={{
              width: "60px",
              height: "2px",
              backgroundColor: "#8B7355", // Acento dorado/marrón
              opacity: 0.5,
              marginBottom: "40px",
            }}
          />

          {/* Mensaje Principal (Dinámico) */}
          <div
            style={{
              display: "flex",
              textAlign: "center",
              maxWidth: "900px",
              fontFamily: '"Playfair Display"',
              fontSize: "52px",
              lineHeight: "1.1",
              color: "#3D3229",
              marginBottom: "24px",
              fontStyle: "italic", // El toque "editorial"
            }}
          >
            {titleText}
          </div>

          {/* Subtítulo (Descriptivo) */}
          <div
            style={{
              display: "flex",
              textAlign: "center",
              maxWidth: "700px",
              fontFamily: '"Playfair Display"', // Mantenemos la misma familia para consistencia
              fontSize: "26px",
              color: "#6D5A4B", // Un tono más suave para jerarquía
              lineHeight: "1.5",
              opacity: 0.9,
            }}
          >
            {subTitleText}
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