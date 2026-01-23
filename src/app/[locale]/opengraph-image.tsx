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
          background: "linear-gradient(135deg, #F6F1E7 0%, #E8DDD0 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "serif",
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
              color: "#2B241B",
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
              color: "#5A4A3A",
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
            color: "#8B7355",
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
