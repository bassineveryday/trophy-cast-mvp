import React from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";

export default function PresidentDashboard() {
  const nav = useNavigate();
  const { enabled, role, demoUser, demoClub, demoTournament } = useDemoMode();

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>President Dashboard</h1>
          <div style={{ opacity: 0.7, fontSize: 13 }}>
            {enabled ? "Demo: Club President" : "Demo Off"} {demoUser ? `• ${demoUser.display_name}` : ""}
          </div>
        </div>
        <button onClick={() => nav("/prototype")} style={{ padding: "6px 10px", borderRadius: 8 }}>
          ← Back to Hub
        </button>
      </div>

      {/* Club summary */}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        <div style={card}>
          <div style={kicker}>Club</div>
          <div style={big}>{demoClub?.name ?? "—"}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>ID: {demoClub?.id ?? "—"}</div>
        </div>
        <div style={card}>
          <div style={kicker}>Next Event</div>
          <div style={big}>{demoTournament?.name ?? "—"}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {demoTournament?.lake ? `@ ${demoTournament.lake}` : ""}
          </div>
        </div>
        <div style={card}>
          <div style={kicker}>Quick Stats</div>
          <div style={{ fontSize: 14 }}>Members: 24 (demo)</div>
          <div style={{ fontSize: 14 }}>Upcoming Events: 3 (demo)</div>
        </div>
      </div>

      {/* Management shortcuts */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button style={cta} onClick={() => nav("/clubs")}>Club Dashboard</button>
        <button style={cta} onClick={() => nav("/tournament-alerts")}>Tournament Alerts</button>
        <button style={cta} onClick={() => nav("/messages")}>Club Messages</button>
        <button style={cta} onClick={() => nav("/leaderboard")}>Leaderboard</button>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 12,
  padding: 12,
  background: "#fff",
};
const kicker: React.CSSProperties = { fontSize: 12, opacity: 0.7 };
const big: React.CSSProperties = { fontSize: 20, fontWeight: 700 };
const cta: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#fff",
  cursor: "pointer",
};