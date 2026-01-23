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

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #8B7355 0%, #7A6345 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              marginBottom: "24px",
              lineHeight: "1.1",
            }}
          >
            {isSpanish
              ? "Tu Legado Digital, Un Recuerdo a la Vez"
              : "Your Digital Legacy, One Memory at a Time"}
          </div>
          <div
            style={{
              fontSize: "32px",
              opacity: 0.9,
              lineHeight: "1.4",
            }}
          >
            {isSpanish
              ? "Documenta tu historia de vida mediante respuestas diarias"
              : "Document your life story through daily responses"}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            fontSize: "36px",
            fontWeight: "bold",
            opacity: 0.9,
          }}
        >
          Recall.bio
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
