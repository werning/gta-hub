import { ImageResponse } from "next/og";

export const alt = "Leonida Living – Die GTA 6 Community";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0414",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(255,46,136,0.35), rgba(11,4,20,0) 60%)",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 220,
            height: 220,
            borderRadius: "50%",
            backgroundImage:
              "linear-gradient(135deg, #ff5fa2 0%, #ff2e88 55%, #6c1bd6 100%)",
            marginBottom: 48,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            color: "#f5f0f8",
            letterSpacing: -2,
          }}
        >
          Leonida Living
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 36,
            color: "#8ff0e8",
          }}
        >
          Die Community-Seite rund um GTA 6
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 22,
            color: "rgba(245,240,248,0.5)",
          }}
        >
          Inoffizielle Fan-Seite · nicht verbunden mit Rockstar Games
        </div>
      </div>
    ),
    { ...size }
  );
}
