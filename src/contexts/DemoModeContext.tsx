import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { demoUsers, demoClub, demoTournament, demoCatches, type DemoRole } from "@/demo/demoData";

/**
 * Demo Mode is additive and non-invasive:
 * - Does NOT touch Supabase auth or real data.
 * - Provides mock "current user" + demo entities when enabled.
 * - Can be toggled by URL (?demo=jake or ?demo=president) or programmatically.
 */
type DemoState = {
  enabled: boolean;
  role: DemoRole;
  setRole: (r: DemoRole) => void;
  // Convenience mock objects
  demoUser: typeof demoUsers.jake | typeof demoUsers.president | null;
  demoClub: typeof demoClub | null;
  demoTournament: typeof demoTournament | null;
  demoCatches: typeof demoCatches | null;
};

const DemoCtx = createContext<DemoState>({
  enabled: false,
  role: "off",
  setRole: () => {},
  demoUser: null,
  demoClub: null,
  demoTournament: null,
  demoCatches: null,
});

function inferRoleFromUrl(): DemoRole {
  try {
    const p = new URLSearchParams(window.location.search);
    const v = (p.get("demo") || "").toLowerCase();
    if (v === "jake") return "jake";
    if (v === "pres" || v === "president") return "president";
    return "off";
  } catch {
    return "off";
  }
}

export const DemoModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<DemoRole>(inferRoleFromUrl());

  // Update when ?demo= changes (e.g., user toggles via URL)
  useEffect(() => {
    const handlePop = () => setRole(inferRoleFromUrl());
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const enabled = role !== "off";

  const value: DemoState = useMemo(() => {
    const user = role === "jake" ? demoUsers.jake : role === "president" ? demoUsers.president : null;
    return {
      enabled,
      role,
      setRole,
      demoUser: user,
      demoClub: enabled ? demoClub : null,
      demoTournament: enabled ? demoTournament : null,
      demoCatches: enabled ? demoCatches : null,
    };
  }, [role, enabled]);

  return <DemoCtx.Provider value={value}>{children}</DemoCtx.Provider>;
};

export const useDemoMode = () => useContext(DemoCtx);