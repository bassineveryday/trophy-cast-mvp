import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";

function setQueryParam(name: string, value: string | null) {
  const url = new URL(window.location.href);
  if (value === null) url.searchParams.delete(name);
  else url.searchParams.set(name, value);
  // Use pushState so our DemoModeProvider popstate listener will pick it up
  window.history.pushState({}, "", url.toString());
  // Manually dispatch popstate so listeners update immediately
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export default function DemoSwitcher() {
  const { enabled, role } = useDemoMode();
  const navigate = useNavigate();

  const setOff = useCallback(() => {
    navigate("/");
  }, [navigate]);
  
  const setJake = useCallback(() => {
    navigate("/?demo=jake");
  }, [navigate]);
  
  const setPres = useCallback(() => {
    navigate("/?demo=president");
  }, [navigate]);

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
