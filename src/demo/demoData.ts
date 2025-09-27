export type DemoRole = "off" | "jake" | "president";

export const demoUsers = {
  jake: {
    id: "demo-user-jake",
    email: "jake@demo.trophycast",
    display_name: "Jake (Demo Angler)",
    avatar_url: null,
  },
  president: {
    id: "demo-user-president",
    email: "president@alabama-demo.club",
    display_name: "Club President (Demo)",
    avatar_url: null,
  },
} as const;

export const demoClub = {
  id: "demo-club-alabama",
  name: "Demo: Alabama Bass Chapter",
};

export const demoTournament = {
  id: "demo-tourn-classic",
  club_id: demoClub.id,
  name: "Demo Classic",
  start_at: new Date().toISOString(),
  end_at: new Date(Date.now() + 24*60*60*1000).toISOString(),
  lake: "Lake Demo",
};

export const demoCatches = [
  {
    id: "demo-c1",
    user_id: demoUsers.jake.id,
    tournament_id: demoTournament.id,
    club_id: demoClub.id,
    species: "Largemouth",
    weight_oz: 35,
    length_mm: 470,
    photo_key: "demos/demo1.jpg",
    status: "verified",
    captured_at: new Date().toISOString(),
  },
  {
    id: "demo-c2",
    user_id: demoUsers.jake.id,
    tournament_id: demoTournament.id,
    club_id: demoClub.id,
    species: "Smallmouth",
    weight_oz: 28,
    length_mm: 440,
    photo_key: "demos/demo2.jpg",
    status: "verified",
    captured_at: new Date().toISOString(),
  },
] as const;