import { ImageResponse } from "next/og";

export const alt = "ToolkitGO - Simplifying Everyday Services in Hyderabad";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0F1940",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
        }}
      >
        {/* Top Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Brand Logo Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 48,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
            }}
          >
            <span>Toolkit</span>
            <span style={{ color: "#F57C20" }}>GO</span>
          </div>

          {/* Region Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(245, 124, 32, 0.15)",
              border: "1px solid #F57C20",
              color: "#F57C20",
              padding: "10px 22px",
              borderRadius: "9999px",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            <span>Hyderabad &bull; Telangana</span>
          </div>
        </div>

        {/* Central Hero Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 60,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              maxWidth: "950px",
            }}
          >
            <span>Simplifying Everyday Services with</span>
            <span style={{ color: "#F57C20" }}>Verified Technicians</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#94A3B8",
              lineHeight: 1.4,
              maxWidth: "900px",
            }}
          >
            <span>Major Appliances &bull; Electrical Systems &bull; Plumbing &bull; Carpentry &bull; Fabrication</span>
          </div>
        </div>

        {/* Bottom Feature Strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "28px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "36px",
              color: "#CBD5E1",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#F57C20", marginRight: "10px" }}>&#9679;</span>
              <span>Transparent Rate Card</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#F57C20", marginRight: "10px" }}>&#9679;</span>
              <span>Background-Checked Pros</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#F57C20", marginRight: "10px" }}>&#9679;</span>
              <span>On-Demand Booking</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "#F8F6ED",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            <span>toolkitgo.in</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
