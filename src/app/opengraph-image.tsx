import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ASRAR LALLA — La Beauté Marocaine, Réinventée";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #FFF0F5 0%, #FFE4EE 40%, #FFCFE1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#FF5FA2",
            marginBottom: 12,
            letterSpacing: 4,
          }}
        >
          ✿ ASRAR LALLA
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#4A3728",
            fontWeight: 500,
          }}
        >
          La Beauté Marocaine, Réinventée
        </div>
        <div
          style={{
            fontSize: 20,
            color: "#8B7355",
            marginTop: 24,
          }}
        >
          Produits naturels · Livraison partout au Maroc · Paiement à la livraison
        </div>
      </div>
    ),
    { ...size }
  );
}
