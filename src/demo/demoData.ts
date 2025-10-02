export type DemoRole = "off" | "jake" | "president";
// src/demo/demoData.ts

// ===== 1. ADD JAKE'S CLUBS HERE (at the top, before demoUsers) =====
const jakeClub1 = {
  id: "club-alabama-bass-12",
  name: "Alabama Bass Chapter 12",
  location: "Birmingham, AL",
  memberCount: 47,
  establishedYear: 2018,
  memberRole: "member",
};

const jakeClub2 = {
  id: "club-tennessee-valley",
  name: "Tennessee Valley Anglers",
  location: "Huntsville, AL",
  memberCount: 63,
  establishedYear: 2015,
  memberRole: "member",
};

// ===== 2. ADD JAKE'S STATS HERE =====
const jakeStats = {
  totalCatches: 87,
  biggestBass: 6.8,
  tournamentWins: 2,
  topFinishes: 8,
  yearsActive: 3,
  avgCatchWeight: 3.2,
};

// ===== 3. ADD JAKE'S CATCHES HERE =====
const jakeCatches = [
  {
    id: "catch-jake-1",
    species: "Largemouth Bass",
    weight: 5.4,
    length: 22.5,
    date: "2025-09-28",
    location: "Lake Guntersville, AL",
    photo: "/images/demo/bass-1.jpg",
    club: "club-alabama-bass-12",
  },
  {
    id: "catch-jake-2",
    species: "Largemouth Bass",
    weight: 4.2,
    length: 19.8,
    date: "2025-09-15",
    location: "Wheeler Lake, AL",
    photo: "/images/demo/bass-2.jpg",
    club: "club-tennessee-valley",
  },
  {
    id: "catch-jake-3",
    species: "Smallmouth Bass",
    weight: 3.9,
    length: 18.2,
    date: "2025-08-30",
    location: "Pickwick Lake, TN",
    photo: "/images/demo/bass-3.jpg",
    club: "club-tennessee-valley",
  },
];

// ===== 4. FIND YOUR EXISTING demoUsers OBJECT AND UPDATE JAKE =====
export const demoUsers = {
  jake: {
    id: "user-jake-demo",
    username: "jake_angler",
    email: "jake@example.com",
    firstName: "Jake",
    lastName: "Wilson",
    avatar: "/images/demo/jake-avatar.jpg",
    clubs: [jakeClub1, jakeClub2], // ← ADD THIS LINE
    stats: jakeStats,                // ← ADD THIS LINE
    recentCatches: jakeCatches,      // ← ADD THIS LINE
    isAdmin: false,                   // ← ADD THIS LINE
  },
  mike: {
    // Mike's existing data stays unchanged
  },
};

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

export const demoTournaments = [
  {
    id: "lake-powell-spring",
    name: "Lake Powell Spring Classic",
    date: "2025-04-15",
    time: "6:00 AM",
    location: "Lake Powell, AZ",
    club: {
      id: "rocky-mountain-bass",
      name: "Rocky Mountain Bass Club",
      logo_url: "/src/assets/river-valley-logo.png"
    },
    registered: 23,
    max_participants: 50,
    status: "open",
    entry_fee: 50,
    description: "Spring bass tournament on beautiful Lake Powell",
    rules: "5 bass limit, minimum 12 inches, no culling after weigh-in",
    prizes: { first: 500, second: 300, third: 150 }
  },
  {
    id: "memorial-day-bash",
    name: "Memorial Day Bass Bash",
    date: "2025-05-26",
    time: "5:30 AM",
    location: "Lake Mead, NV",
    club: {
      id: "lake-mead-anglers",
      name: "Lake Mead Anglers",
      logo_url: "/src/assets/alabama-bass-logo.png"
    },
    registered: 45,
    max_participants: 60,
    status: "open",
    entry_fee: 75,
    description: "Big tournament with big prizes!"
  },
  {
    id: "colorado-cup",
    name: "Colorado Cup",
    date: "2025-05-10",
    time: "7:00 AM",
    location: "Chatfield Reservoir, CO",
    club: {
      id: "colorado-bass-fed",
      name: "Colorado Bass Federation",
      logo_url: "/src/assets/bass-trophy-logo.png"
    },
    registered: 50,
    max_participants: 50,
    status: "active",
    entry_fee: 100,
    description: "Premier Colorado bass tournament"
  },
  {
    id: "spring-opener",
    name: "Spring Opener",
    date: "2025-03-20",
    time: "6:30 AM",
    location: "Cherry Creek Reservoir, CO",
    club: {
      id: "rocky-mountain-bass",
      name: "Rocky Mountain Bass Club",
      logo_url: "/src/assets/river-valley-logo.png"
    },
    registered: 38,
    max_participants: 40,
    status: "completed",
    entry_fee: 50,
    description: "Season opener tournament"
  },
  {
    id: "texas-lunker",
    name: "Texas Lunker Challenge",
    date: "2025-06-05",
    time: "5:00 AM",
    location: "Lake Fork, TX",
    club: {
      id: "texas-bass-nation",
      name: "Texas Bass Nation",
      logo_url: "/src/assets/trophy-cast-logo.png"
    },
    registered: 12,
    max_participants: 100,
    status: "open",
    entry_fee: 150,
    description: "Hunt for trophy Texas bass at legendary Lake Fork"
  }
];

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