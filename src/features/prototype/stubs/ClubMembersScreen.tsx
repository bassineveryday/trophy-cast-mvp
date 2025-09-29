import React from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";

export default function ClubMembersScreen() {
  const { enabled, role, demoUser, demoClub, demoTournament, demoCatches } = useDemoMode();
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0 }}>{"Club Members Screen (Prototype Stub)"}</h1>
      <p style={{ opacity: 0.75, marginTop: 6 }}>
        This is a non-destructive prototype stub. Replace with the real screen later.
      </p>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12 }}>
        <strong>Demo Mode</strong>: {enabled ? (role === "jake" ? "Jake (Angler)" : "Club President") : "Off"}
        <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>
          {demoUser ? `User: ${demoUser.display_name} (${demoUser.email})` : "No demo user selected"}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Example Demo Data</h3>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f8f8f8", padding: 12, borderRadius: 8 }}>
{JSON.stringify({ demoClub, demoTournament, demoCatches }, null, 2)}
        </pre>
      </div>
    </div>
  );
}