# Demo Mode (Additive, No-Risk)

This module lets you preview TrophyCast as:
- **Jake (Demo Angler)** — "?demo=jake"
- **Club President (Demo)** — "?demo=pres" or "?demo=president"

## What it does
- Provides mock user + demo club/tournament/catches via `DemoModeProvider`.
- Does NOT modify Supabase auth/database or existing files.
- Can be wired into App.tsx later by wrapping <AppContent/> with <DemoModeProvider>.

## How to test (without wiring)
- Import `useDemoMode()` inside any screen and branch on `enabled`:
  ```ts
  const { enabled, demoUser, demoCatches } = useDemoMode();