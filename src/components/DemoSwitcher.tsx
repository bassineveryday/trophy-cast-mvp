import React, { useCallback } from "react";
import { useDemoMode } from "@/contexts/DemoModeContext";

function goHomeWithDemo(value: string | null) {
  const url = new URL(window.location.origin + "/");
  if (value === null) url.searchParams.delete("demo");
  else url.searchParams.set("demo", value);
  // Push new URL and notify listeners
  window.history.pushState({}, "", url.toString());
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function DemoSwitcher() {
  const { enabled, role } = useDemoMode();
  
  const setOff = useCallback(() => {
    goHomeWithDemo(null);
  }, []);
  
  const setJake = useCallback(() => {
    goHomeWithDemo("jake");
  }, []);
  
  const setPres = useCallback(() => {
    goHomeWithDemo("president");
  }, []);

  // Keep the switcher subtle; only show a small pill in bottom-right
  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 9999,
        display: "flex",
        gap: 8,
        padding: 8,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
      }}
      aria-label="Demo mode switcher"
    >
      <button
        onClick={setOff}
        title="Demo Off"
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.12)",
          background: !enabled ? "#eee" : "transparent",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Off
      </button>
      <button
        onClick={setJake}
        title="Jake (Demo Angler)"
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.12)",
          background: role === "jake" ? "#eee" : "transparent",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        Jake
      </button>
      <button
        onClick={setPres}
        title="Club President (Demo)"
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.12)",
          background: role === "president" ? "#eee" : "transparent",
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        President
      </button>
    </div>
  );
}
