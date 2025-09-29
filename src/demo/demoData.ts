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
    display_name: "Mike",
    avatar_url: null,
  },
} as const;

// MIKE'S DEMO PROFILE DATA
export const mikeProfile = {
  "id": "demo-mike",
  "username": "mike_prez",
  "displayName": "Mike Johnson",
  "titleLine": "President, ABC-12",
  "role": "president",
  "avatarUrl": "/images/avatars/mike.png",
  "badges": [
    { "id": "aoy-2024", "label": "Angler of the Year 2024" },
    { "id": "top10-50", "label": "50 Top-10 Finishes" },
    { "id": "biggest-catch", "label": "Biggest Catch: 12.3 lb Bass" }
  ],
  "careerStats": {
    "wins": 8,
    "aoyTitles": 2,
    "biggestCatchLb": 12.3,
    "top10s": 50,
    "top20s": 120,
    "placeCounts": { "1st": 8, "2nd": 15, "3rd": 12 }
  },
  "clubMemberships": [
    {
      "clubId": "alabama-bass-chapter-12",
      "clubName": "Alabama Bass Chapter 12",
      "role": "President"
    }
  ],
  "upcomingTournaments": [
    { "id": "tourn-20250930", "name": "Fall Bass Classic", "date": "2025-09-30" }
  ],
  "quickActions": [
    { "id": "bod-dashboard", "label": "Board of Directors", "to": "/admin/board-of-directors", "icon": "📊" },
    { "id": "manage-club",    "label": "Manage Club",      "to": "/clubs/alabama-bass-chapter-12/manage", "icon": "⚙️" }
  ]
};

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