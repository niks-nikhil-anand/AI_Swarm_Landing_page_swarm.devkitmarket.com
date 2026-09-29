import { ImageResponse } from "next/og";

export const alt = "AI Swarm — Validate your SaaS idea with an AI research team";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0f",
          color: "#f0eff5",
          padding: "72px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: 26 }}>
          <div
            style={{
              display: "flex",
              width: 38,
              height: 38,
              borderRadius: 12,
              background: "#7c6ff7",
            }}
          />
          <span>AI Swarm</span>
          <span style={{ color: "#a89ef9", fontSize: 18, marginLeft: "auto" }}>PRIVATE BETA · JOIN THE WAITLIST</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div style={{ fontSize: 72, lineHeight: 1.08, letterSpacing: "-2px" }}>
            Validate your SaaS idea with an AI research team.
          </div>
          <div style={{ marginTop: 28, color: "#a89ef9", fontSize: 28, lineHeight: 1.4 }}>
            Market research · competitors · pricing · build-ready PRD
          </div>
        </div>
        <div style={{ color: "#9998a8", fontSize: 20 }}>Free during private beta · No credit card</div>
      </div>
    ),
    size,
  );
}
