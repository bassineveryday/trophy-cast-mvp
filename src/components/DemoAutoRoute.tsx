import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDemoMode } from "@/contexts/DemoModeContext";

export default function DemoAutoRoute() {
  const { role } = useDemoMode();
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const lastRole = useRef<string | null>(null);

  useEffect(() => {
    if (role === lastRole.current) return;
    lastRole.current = role;

    const routes: Record<string, string> = {
      off: "/",
      jake: "/prototype/angler?demo=jake",
      president: "/prototype/president?demo=president",
    };

    const target = routes[role] ?? "/";
    const current = pathname + (search || "");
    if (current !== target) nav(target);
  }, [role, pathname, search, nav]);

  return null;
}