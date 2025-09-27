import React from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";

function ozToLbOz(oz: number) {
  const lb = Math.floor(oz / 16);
  const rem = oz % 16;
  return lb > 0 ? `${lb} lb ${rem} oz` : `${oz} oz`;
}

export default function AnglerDashboard() {
  const nav = useNavigate();
  const { enabled, role, demoUser, demoCatches, demoTournament } = useDemoMode();

  const totalCatches = demoCatches?.length ?? 0;
  const best = demoCatches && demoCatches.length
    ? demoCatches.reduce((a, b) => (a.weight_oz > b.weight_oz ? a : b))
    : null;

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Angler Dashboard</h1>
          <div style={{ opacity: 0.7, fontSize: 13 }}>
            {enabled ? (role === "jake" ? "Demo: Jake (Angler)" : "Demo: Other") : "Demo Off"}
            {demoUser ? ` • ${demoUser.display_name}` : ""}
          </div>
        </div>
        <button onClick={() => nav("/prototype")} style={{ padding: "6px 10px", borderRadius: 8 }}>
          ← Back to Hub
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
        <div style={card}>
          <div style={kicker}>Catches</div>
          <div style={big}>{totalCatches}</div>
        </div>
        <div style={card}>
          <div style={kicker}>Personal Best</div>
          <div style={big}>{best ? ozToLbOz(best.weight_oz) : "—"}</div>
        </div>
        <div style={card}>
          <div style={kicker}>Next Tournament</div>
          <div style={big}>{demoTournament?.name ?? "—"}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>
            {demoTournament?.lake ? `@ ${demoTournament.lake}` : ""}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button style={cta} onClick={() => nav("/my-catches")}>My Catches</button>
        <button style={cta} onClick={() => nav("/tournaments")}>Tournaments</button>
        <button style={cta} onClick={() => nav("/leaderboard")}>Leaderboard</button>
      </div>

      {/* Recent catches */}
      <section>
        <h3 style={{ margin: "10px 0" }}>Recent Catches</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {(demoCatches ? [...demoCatches] : []).slice(0, 2).map((c) => (
            <div key={c.id} style={row}>
              <div>
                <div style={{ fontWeight: 600 }}>{c.species}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {ozToLbOz(c.weight_oz)} • {new Date(c.captured_at).toLocaleString()}
                </div>
              </div>
              <button style={smallBtn} onClick={() => nav("/my-catches")}>View</button>
            </div>
          ))}
        </div>
      </section>
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
const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  border: "1px solid rgba(0,0,0,0.12)",
  borderRadius: 10,
  padding: 10,
  background: "#fff",
};
const smallBtn: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#fff",
  cursor: "pointer",
};