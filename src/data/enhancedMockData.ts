// ============================================
// ENHANCED MOCK DATA FOR INVESTOR DEMO
// ============================================
// TODO: Replace with real API integrations when backend is ready

import { Sun, Cloud, Trophy, Anchor, Waves, TrendingUp, Fish, Star, Calendar, Award, Target } from "lucide-react";

// Profile images
import jakePatterson from "@/assets/profiles/jake-patterson.jpg";
import mariaSantos from "@/assets/profiles/maria-santos.jpg";
import tommyLee from "@/assets/profiles/tommy-lee.jpg";
import mikeJohnson from "@/assets/profiles/mike-johnson.jpg";
import chrisWilson from "@/assets/profiles/chris-wilson.jpg";
import sarahJohnson from "@/assets/profiles/sarah-johnson.jpg";
import mikeRodriguez from "@/assets/profiles/mike-rodriguez.jpg";

// ============================================
// ENHANCED USER PROFILES & CLUB MEMBERS
// ============================================

export const mockClubMembers = [
  {
    id: "1",
    name: "Jake Patterson", 
    initials: "JP",
    title: "2024 AOY Leader",
    location: "Alabama",
    rank: 1,
    points: 1847,
    earnings: "$12,450",
    wins: 4,
    personalBest: 8.4,
    avatar: jakePatterson
  },
  {
    id: "2", 
    name: "Maria Santos",
    initials: "MS",
    title: "Tournament Pro",
    location: "Tennessee", 
    rank: 2,
    points: 1723,
    earnings: "$9,875",
    wins: 3,
    personalBest: 7.9,
    avatar: mariaSantos
  },
  {
    id: "3",
    name: "Tommy Lee",
    initials: "TL", 
    title: "Veteran Angler",
    location: "Georgia",
    rank: 3,
    points: 1685,
    earnings: "$8,200", 
    wins: 2,
    personalBest: 9.1,
    avatar: tommyLee
  },
  {
    id: "12",
    name: "Mike Johnson", // Our user
    initials: "MJ",
    title: "2019 AOY Champion", 
    location: "Alabama",
    rank: 12,
    points: 1247,
    earnings: "$3,450",
    wins: 3,
    personalBest: 7.1,
    avatar: mikeJohnson,
    isCurrentUser: true
  }
];

// ============================================
// ENHANCED TOURNAMENTS WITH RICH DATA
// ============================================

export const enhancedMockTournaments = [
  {
    id: "lake-guntersville-sept",
    name: "Lake Guntersville Championship",
    club: "Alabama Bass Nation – Chapter 12", 
    date: "Sept 28, 2024",
    time: "6:00 AM",
    registered: true,
    fee: "$200",
    prizePool: "$15,000",
    weather: "74°/58° • W 8mph • Partly Cloudy",
    weatherIcon: Sun,
    link: "/tournament/lake-guntersville-sept",
    anglers: 47,
    location: "Guntersville, AL",
    description: "Premier fall tournament on legendary Lake Guntersville",
    conditions: {
      waterTemp: 72,
      clarity: "Stained",
      level: "Normal",
      pressure: "Stable"
    },
    hasPlan: true,
    confidence: 78
  },
  {
    id: "wheeler-lake-oct", 
    name: "Wheeler Lake Open",
    club: "River Valley Independent Bass Club",
    date: "Oct 12, 2024", 
    time: "5:30 AM",
    registered: true,
    fee: "$175",
    prizePool: "$12,500",
    weather: "Early Outlook: Cooler temps expected",
    weatherIcon: Cloud,
    link: "/tournament/wheeler-lake-oct",
    anglers: 52,
    location: "Decatur, AL",
    description: "Technical river system tournament",
    conditions: {
      waterTemp: 68,
      clarity: "Clear to Stained", 
      level: "Rising",
      pressure: "Falling"
    },
    hasPlan: true,
    confidence: 65
  },
  {
    id: "smith-lake-championship",
    name: "Smith Lake Championship", 
    club: "Alabama Bass Nation – Chapter 12",
    date: "Oct 26, 2024",
    time: "6:00 AM", 
    registered: false,
    fee: "$250",
    prizePool: "$18,000", 
    weather: "Early Outlook",
    weatherIcon: Cloud,
    link: "/tournament/smith-lake-championship",
    anglers: 65,
    location: "Cullman, AL",
    description: "Deep, clear water challenge - season finale",
    conditions: {
      waterTemp: 65,
      clarity: "Very Clear",
      level: "Full Pool", 
      pressure: "Rising"
    },
    hasPlan: false,
    confidence: null
  }
];

// ============================================
// ENHANCED CATCH DATA WITH GPS & CONDITIONS
// ============================================

// Monthly catches with tournament vs non-tournament separation
export const monthlyMockCatches = [
  {
    id: "catch-1",
    anglerId: "jake-patterson",
    anglerName: "Jake Patterson",
    weight: 6.2,
    length: 22.5,
    lure: "Deep Diving Crankbait - Chartreuse/Blue",
    technique: "Cranking deep points",
    time: "1:27 PM", 
    date: "Sept 28, 2024",
    gpsCoords: "34.3583°N, 86.2097°W",
    depth: "12-15 feet",
    structure: "Rocky point with scattered grass", 
    waterTemp: 72,
    lake: "Lake Guntersville",
    tournament: "Guntersville Championship",
    badge: { name: "Big Bass – Tournament Leader", icon: Trophy, color: "bg-trophy-gold" },
    photo: "/placeholder.svg",
    notes: "Fish was relating to the deep grass edge. Crankbait retrieved at medium speed.",
    tournamentId: "lake-guntersville-sept",
    isTournament: true
  },
  {
    id: "catch-2",
    anglerId: "jake-patterson", 
    anglerName: "Jake Patterson",
    weight: 5.7, 
    length: 21.0,
    lure: "White/Chartreuse Spinnerbait 3/8oz",
    technique: "Slow rolling shallow cover",
    time: "7:42 AM",
    date: "Sept 28, 2024",
    gpsCoords: "34.3621°N, 86.2145°W", 
    depth: "3-5 feet",
    structure: "Shallow grass flats with scattered stumps",
    waterTemp: 71,
    lake: "Lake Guntersville",
    tournament: "Guntersville Championship", 
    badge: { name: "First Keeper", icon: Anchor, color: "bg-amber-600" },
    photo: "/placeholder.svg",
    notes: "Early morning bite in shallow grass. Fish hit on the fall.",
    tournamentId: "lake-guntersville-sept",
    isTournament: true
  },
  {
    id: "catch-3",
    anglerId: "maria-santos",
    anglerName: "Maria Santos",
    weight: 4.3,
    length: 19.5, 
    lure: "Football Jig - Green Pumpkin with Craw Trailer",
    technique: "Dragging deep structure",
    time: "10:18 AM",
    date: "Sept 22, 2024",
    gpsCoords: "34.3556°N, 86.2089°W",
    depth: "18-22 feet", 
    structure: "Deep ledge with shell bed",
    waterTemp: 72,
    lake: "Smith Lake",
    tournament: null,
    badge: { name: "Deep Water Bite", icon: Waves, color: "bg-water-blue" },
    photo: "/placeholder.svg", 
    notes: "Practice fishing - found school on deep ledge. Great spot for tournaments.",
    tournamentId: null,
    isTournament: false
  },
  {
    id: "catch-4",
    anglerId: "tommy-lee",
    anglerName: "Tommy Lee",
    weight: 3.8,
    length: 18.5,
    lure: "Texas Rigged Senko - Watermelon",
    technique: "Flipping heavy cover",
    time: "2:15 PM",
    date: "Sept 20, 2024",
    gpsCoords: "34.2891°N, 86.1743°W",
    depth: "4-6 feet",
    structure: "Laydown timber and brush",
    waterTemp: 73,
    lake: "Wheeler Lake",
    tournament: null,
    badge: { name: "Reaction Bite", icon: Fish, color: "bg-fishing-green" },
    photo: "/placeholder.svg",
    notes: "Fun fishing session. Fish was buried in thick cover.",
    tournamentId: null,
    isTournament: false
  },
  {
    id: "catch-5",
    anglerId: "jake-patterson",
    anglerName: "Jake Patterson", 
    weight: 5.1,
    length: 20.2,
    lure: "Chatterbait - White/Blue",
    technique: "Burning grass beds",
    time: "8:30 AM",
    date: "Sept 15, 2024",
    gpsCoords: "34.3612°N, 86.2087°W",
    depth: "6-8 feet",
    structure: "Grass beds with open pockets",
    waterTemp: 75,
    lake: "Lake Guntersville",
    tournament: null,
    badge: { name: "Early Bird", icon: Star, color: "bg-yellow-500" },
    photo: "/placeholder.svg",
    notes: "Morning practice run. Great pattern developing.",
    tournamentId: null,
    isTournament: false
  }
];

export const enhancedMockCatches = [
  {
    id: "catch-1",
    anglerId: "jake-patterson",
    anglerName: "Jake Patterson",
    weight: 6.2,
    length: 22.5,
    lure: "Deep Diving Crankbait - Chartreuse/Blue",
    technique: "Cranking deep points",
    time: "1:27 PM", 
    gpsCoords: "34.3583°N, 86.2097°W",
    depth: "12-15 feet",
    structure: "Rocky point with scattered grass", 
    waterTemp: 72,
    lake: "Lake Guntersville",
    tournament: "Guntersville Championship",
    badge: { name: "Big Bass – Tournament Leader", icon: Trophy, color: "bg-trophy-gold" },
    photo: "/placeholder.svg",
    notes: "Fish was relating to the deep grass edge. Crankbait retrieved at medium speed.",
    tournamentId: "lake-guntersville-sept"
  },
  {
    id: "catch-2",
    anglerId: "jake-patterson", 
    anglerName: "Jake Patterson",
    weight: 5.7, 
    length: 21.0,
    lure: "White/Chartreuse Spinnerbait 3/8oz",
    technique: "Slow rolling shallow cover",
    time: "7:42 AM",
    gpsCoords: "34.3621°N, 86.2145°W", 
    depth: "3-5 feet",
    structure: "Shallow grass flats with scattered stumps",
    waterTemp: 71,
    lake: "Lake Guntersville",
    tournament: "Guntersville Championship", 
    badge: { name: "First Keeper", icon: Anchor, color: "bg-amber-600" },
    photo: "/placeholder.svg",
    notes: "Early morning bite in shallow grass. Fish hit on the fall.",
    tournamentId: "lake-guntersville-sept"
  },
  {
    id: "catch-3",
    anglerId: "maria-santos",
    anglerName: "Maria Santos",
    weight: 4.3,
    length: 19.5, 
    lure: "Football Jig - Green Pumpkin with Craw Trailer",
    technique: "Dragging deep structure",
    time: "10:18 AM",
    gpsCoords: "34.3556°N, 86.2089°W",
    depth: "18-22 feet", 
    structure: "Deep ledge with shell bed",
    waterTemp: 72,
    lake: "Lake Guntersville",
    tournament: "Guntersville Championship",
    badge: { name: "Deep Water Bite", icon: Waves, color: "bg-water-blue" },
    photo: "/placeholder.svg", 
    notes: "Found school on deep ledge. Multiple fish in this area.",
    tournamentId: "lake-guntersville-sept"
  }
];

// ============================================
// ENHANCED LEADERBOARD DATA
// ============================================

export const enhancedLiveLeaderboard = [
  { id: "jp", rank: 1, name: "Jake Patterson", anglerId: "jake-patterson", weightLbs: 21.45, bigLbs: 6.2, change: "up", avatar: "JP", clubPoints: 350 },
  { id: "ms", rank: 2, name: "Maria Santos", anglerId: "maria-santos", weightLbs: 20.12, bigLbs: 5.8, change: "up", avatar: "MS", clubPoints: 340 },
  { id: "tl", rank: 3, name: "Tommy Lee", anglerId: "tommy-lee", weightLbs: 19.89, bigLbs: 5.1, change: "flat", avatar: "TL", clubPoints: 330 },
  { id: "mj", rank: 12, name: "Mike Johnson", anglerId: "mike-johnson", weightLbs: 16.33, bigLbs: 4.9, change: "up", avatar: "MJ", clubPoints: 285, isUser: true },
  { id: "cw", rank: 15, name: "Chris Wilson", anglerId: "chris-wilson", weightLbs: 15.22, bigLbs: 4.2, change: "down", avatar: "CW", clubPoints: 270 },
];

// ============================================
// SPONSOR DEALS & ANALYTICS DATA 
// ============================================

export const mockSponsorDeals = [
  {
    id: "local-tackle-guntersville",
    sponsorName: "Guntersville Bait & Tackle", 
    sponsorType: "Local Partner",
    deal: {
      title: "20% OFF Tournament Prep Package",
      description: "Spinnerbaits, Crankbaits, and Terminal Tackle for Guntersville",
      discount: "20%",
      validUntil: "Sept 30, 2024",
      code: "GVILLE20"
    },
    engagement: {
      views: 1247,
      clicks: 89, 
      conversions: 12,
      revenue: "$340" 
    },
    location: "Guntersville, AL",
    rating: 4.9
  },
  {
    id: "xyz-lures-national",
    sponsorName: "XYZ Lures",
    sponsorType: "National Brand",
    deal: {
      title: "Big Bass Bounty Program", 
      description: "Win gear packages for tournament big bass with XYZ Lures",
      prize: "$500 Gear Package",
      validUntil: "Season End"
    },
    engagement: {
      views: 3421,
      clicks: 234,
      conversions: 45,
      revenue: "$2,250"
    },
    location: "National",
    rating: 4.7
  }
];

// ============================================
// ENHANCED CLUB FEED WITH RICH INTERACTIONS
// ============================================

export const enhancedClubFeed = [
  {
    id: "post-1",
    angler: "Jake Patterson", 
    anglerId: "jake-patterson",
    initials: "JP",
    tournament: "Lake Guntersville Championship",
    placement: "1st Place",
    weight: "21.45 lbs",
    bigBass: "6.2 lbs",
    timeAgo: "2 hours ago",
    likes: 47,
    comments: 23,
    shares: 8,
    photo: jakePatterson,
    caption: "What a day on Guntersville! The deep grass edge bite was on fire. Spinnerbait and crankbait combo did the trick!",
    clubPoints: 350,
    clubId: "alabama-bass-nation",
    location: "Huntsville, AL"
  },
  {
    id: "post-2", 
    angler: "Maria Santos",
    anglerId: "maria-santos",
    initials: "MS",
    tournament: "Wheeler Lake Fall Classic",
    placement: "2nd Place", 
    weight: "20.12 lbs",
    bigBass: "5.8 lbs", 
    timeAgo: "1 day ago",
    likes: 34,
    comments: 15,
    shares: 5,
    photo: mariaSantos, 
    caption: "Strong finish at Wheeler! The current breaks were holding quality fish. Can't wait for the next one!",
    clubPoints: 340,
    clubId: "river-valley",
    location: "Nashville, TN"
  },
  {
    id: "post-3",
    angler: "Tommy Lee",
    anglerId: "tommy-lee", 
    initials: "TL", 
    tournament: "Pueblo Reservoir Open",
    placement: "3rd Place",
    weight: "16.89 lbs", 
    bigBass: "4.7 lbs",
    timeAgo: "3 days ago", 
    likes: 28,
    comments: 12,
    shares: 3,
    photo: tommyLee,
    caption: "Tough conditions at Pueblo but managed a good bag. The jig bite saved the day!",
    clubPoints: 330,
    clubId: "trophy-cast",
    location: "Birmingham, AL"
  }
];

// ============================================
// PUBLIC ANGLER PROFILES
// ============================================

import { PublicProfile } from "@/types";

// ... keep existing code (imports and other exports)

export const mockPublicProfiles: Record<string, PublicProfile> = {
  "jake-patterson": {
    id: "jake-patterson",
    name: "Jake Patterson",
    initials: "JP", 
    avatar: jakePatterson,
    homeClub: "Alabama Bass Nation – Chapter 12",
    location: "Huntsville, AL",
    stats: {
      wins: 12,
      aoyTitles: 2,
      top10: 34,
      pbWeight: "8.2 lbs"
    },
    achievements: [
      { id: "aoy-2023", name: "2023 AOY Champion", icon: Trophy },
      { id: "big-bass-king", name: "Big Bass Award (5x)", icon: Fish },
      { id: "tournament-master", name: "Tournament Winner (12x)", icon: Award }
    ],
    seasonSnapshot: {
      tournamentsFished: 15,
      aoyPoints: 1847,
      avgFinish: "4th",
      trend: "up",
      top10Finishes: 8,
      top20Finishes: 12,
      finishesInMoney: 13
    },
    clubSeasonSnapshots: {
      "alabama-bass-nation": {
        clubName: "Alabama Bass Nation – Chapter 12",
        clubAcronym: "ABN-12",
        clubLogo: "/src/assets/alabama-bass-logo.png",
        tournamentsFished: 9,
        top10Finishes: 5,
        aoyPosition: "1st Place",
        aoyDelta: "Leading by 124 pts",
        points: 1247
      },
      "trophy-cast": {
        clubName: "Trophy Cast Elite Series", 
        clubAcronym: "TCES",
        clubLogo: "/src/assets/trophy-cast-logo.png",
        tournamentsFished: 6,
        top10Finishes: 3,
        aoyPosition: "2nd Place",
        aoyDelta: "+27 pts to 1st",
        points: 600
      }
    },
    highlights: [
      {
        id: "big-bass",
        type: "biggest-bass",
        title: "Personal Best Bass",
        description: "8.2 lbs • Lake Guntersville",
        image: "/src/assets/hero-fishing.jpg",
        date: "Aug 15, 2024",
        stats: "22.5\" • Morning bite • Spinnerbait"
      },
      {
        id: "tournament-win",
        type: "tournament-win", 
        title: "Championship Victory",
        description: "Lake Wheeler Open Winner",
        image: "/src/assets/hero-fishing.jpg",
        date: "Sept 14, 2024",
        stats: "21.4 lbs total • $2,500 prize"
      },
      {
        id: "aoy-leader",
        type: "aoy-standing",
        title: "AOY Leader",  
        description: "Leading 2024 standings",
        image: "/src/assets/hero-fishing.jpg",
        date: "Current",
        stats: "1,847 points • 124 pt lead"
      },
      {
        id: "club-photo",
        type: "club-highlight",
        title: "Club Tournament Day",
        description: "ABN-12 Championship", 
        image: "/src/assets/hero-fishing.jpg",
        date: "Sept 28, 2024",
        stats: "47 anglers • Lake Guntersville"
      }
    ],
    clubDetails: {
      "alabama-bass-nation": {
        name: "Alabama Bass Nation – Chapter 12",
        logo: "/src/assets/alabama-bass-logo.png",
        acronym: "ABN-12"
      },
      "trophy-cast": {
        name: "Trophy Cast Elite Series",
        logo: "/src/assets/trophy-cast-logo.png", 
        acronym: "TCES"
      }
    },
    clubInboxMessages: [
      {
        id: "msg-club-1",
        from: "Alabama Bass Nation",
        fromLogo: "/src/assets/alabama-bass-logo.png",
        subject: "October Tournament Schedule Released",
        preview: "Lake Wheeler and Smith Lake dates confirmed...",
        date: "2 days ago",
        isRead: false,
        isClubMessage: true
      },
      {
        id: "msg-club-2", 
        from: "Trophy Cast Elite",
        fromLogo: "/src/assets/trophy-cast-logo.png",
        subject: "New Sponsor Partnership Announced",
        preview: "Exclusive deals on tackle and gear...",
        date: "5 days ago", 
        isRead: true,
        isClubMessage: true
      }
    ],
    recentCatches: [
      { lake: "Lake Guntersville", weight: "6.2 lbs", length: "22.5\"", date: "Sept 28" },
      { lake: "Wheeler Lake", weight: "5.8 lbs", length: "21.0\"", date: "Sept 22" },
      { lake: "Smith Lake", weight: "4.9 lbs", length: "20.1\"", date: "Sept 15" }
    ],
    clubs: ["alabama-bass-nation", "trophy-cast"]
  },
  "maria-santos": {
    id: "maria-santos",
    name: "Maria Santos",
    initials: "MS",
    avatar: mariaSantos, 
    homeClub: "River Valley Independent Bass Club",
    location: "Nashville, TN",
    stats: {
      wins: 8,
      aoyTitles: 1,
      top10: 28,
      pbWeight: "7.8 lbs"
    },
    achievements: [
      { id: "aoy-2022", name: "2022 AOY Champion", icon: Trophy },
      { id: "consistent-angler", name: "Top 10 Finisher (28x)", icon: Target },
      { id: "tournament-pro", name: "Tournament Winner (8x)", icon: Award }
    ],
    seasonSnapshot: {
      tournamentsFished: 14,
      aoyPoints: 1723,
      avgFinish: "6th", 
      trend: "up",
      top10Finishes: 7,
      top20Finishes: 11,
      finishesInMoney: 13
    },
    recentCatches: [
      { lake: "Wheeler Lake", weight: "5.8 lbs", length: "21.2\"", date: "Sept 26" },
      { lake: "Pickwick Lake", weight: "5.1 lbs", length: "20.8\"", date: "Sept 20" },
      { lake: "Kentucky Lake", weight: "4.7 lbs", length: "19.9\"", date: "Sept 14" }
    ],
    clubs: ["river-valley"]
  },
  "tommy-lee": {
    id: "tommy-lee",
    name: "Tommy Lee",
    initials: "TL",
    avatar: tommyLee,
    homeClub: "Trophy Cast Elite Series", 
    location: "Atlanta, GA",
    stats: {
      wins: 15,
      aoyTitles: 3,
      top10: 42,
      pbWeight: "9.1 lbs"
    },
    achievements: [
      { id: "veteran-angler", name: "Veteran Angler (10+ Years)", icon: Star },
      { id: "multi-club-champion", name: "Multi-Club Champion", icon: Trophy },
      { id: "big-bass-legend", name: "Personal Best 9+ lbs", icon: Fish }
    ],
    seasonSnapshot: {
      tournamentsFished: 18,
      aoyPoints: 1685,
      avgFinish: "5th",
      trend: "flat",
      top10Finishes: 9,
      top20Finishes: 15,
      finishesInMoney: 17
    },
    recentCatches: [
      { lake: "Lake Lanier", weight: "7.2 lbs", length: "23.1\"", date: "Sept 29" },
      { lake: "Allatoona Lake", weight: "6.1 lbs", length: "21.8\"", date: "Sept 24" },
      { lake: "West Point Lake", weight: "5.4 lbs", length: "20.5\"", date: "Sept 18" }
    ],
    clubs: ["trophy-cast", "river-valley"]
  },
  "sarah-johnson": {
    id: "sarah-johnson", 
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: sarahJohnson,
    homeClub: "Alabama Bass Nation – Chapter 12",
    location: "Birmingham, AL",
    stats: {
      wins: 6,
      aoyTitles: 0,
      top10: 19,
      pbWeight: "6.9 lbs"
    },
    achievements: [
      { id: "rising-star", name: "Rising Star (2024)", icon: Star },
      { id: "consistent-performer", name: "Top 20 Finisher (19x)", icon: Target },
      { id: "tournament-winner", name: "Tournament Winner (6x)", icon: Award }
    ],
    seasonSnapshot: {
      tournamentsFished: 12,
      aoyPoints: 1156,
      avgFinish: "8th",
      trend: "up",
      top10Finishes: 3,
      top20Finishes: 8,
      finishesInMoney: 10
    },
    recentCatches: [
      { lake: "Smith Lake", weight: "5.2 lbs", length: "20.3\"", date: "Sept 27" },
      { lake: "Lake Martin", weight: "4.8 lbs", length: "19.7\"", date: "Sept 21" },
      { lake: "Weiss Lake", weight: "4.3 lbs", length: "19.1\"", date: "Sept 16" }
    ],
    clubs: ["alabama-bass-nation"]
  },
  "mike-rodriguez": {
    id: "mike-rodriguez",
    name: "Mike Rodriguez",
    initials: "MR",
    avatar: mikeRodriguez,
    homeClub: "Trophy Cast Elite Series",
    location: "Austin, TX",
    stats: {
      wins: 10,
      aoyTitles: 1,
      top10: 31, 
      pbWeight: "8.5 lbs"
    },
    achievements: [
      { id: "texas-champion", name: "Texas State Champion", icon: Trophy },
      { id: "technique-master", name: "Technique Master", icon: Target },
      { id: "big-bass-hunter", name: "Big Bass Hunter (8+ lbs)", icon: Fish }
    ],
    seasonSnapshot: {
      tournamentsFished: 16,
      aoyPoints: 1432,
      avgFinish: "7th",
      trend: "up",
      top10Finishes: 5,
      top20Finishes: 11,
      finishesInMoney: 14
    },
    recentCatches: [
      { lake: "Lake Travis", weight: "6.8 lbs", length: "22.4\"", date: "Sept 28" },
      { lake: "Lake Buchanan", weight: "5.9 lbs", length: "21.3\"", date: "Sept 23" },
      { lake: "Canyon Lake", weight: "5.2 lbs", length: "20.6\"", date: "Sept 17" }
    ],
    clubs: ["trophy-cast"]
  },
  "mike-johnson": {
    id: "mike-johnson",
    name: "Mike Johnson",
    initials: "MJ",
    avatar: mikeJohnson,
    titleLine: "President, ABC-12",
    homeClub: "Alabama Bass Nation – Chapter 12",
    location: "Birmingham, AL",
    stats: {
      wins: 8,
      aoyTitles: 2,
      top10: 50,
      pbWeight: "12.3 lbs"
    },
    achievements: [
      { id: "aoy-2024", name: "Angler of the Year 2024", icon: Trophy },
      { id: "top10-50", name: "50 Top-10 Finishes", icon: Target },
      { id: "biggest-catch", name: "Biggest Catch: 12.3 lb Bass", icon: Fish }
    ],
    seasonSnapshot: {
      tournamentsFished: 12,
      aoyPoints: 1247,
      avgFinish: "7th",
      trend: "up",
      top10Finishes: 6,
      top20Finishes: 10,
      finishesInMoney: 11
    },
    recentCatches: [
      { lake: "Lake Guntersville", weight: "12.3 lbs", length: "26.2\"", date: "Sept 15" },
      { lake: "Wheeler Lake", weight: "7.8 lbs", length: "23.1\"", date: "Sept 8" },
      { lake: "Smith Lake", weight: "6.4 lbs", length: "21.9\"", date: "Aug 30" }
    ],
    clubs: ["alabama-bass-nation"]
  }
};

// ============================================
// AI COACH DEMO RESPONSES & TIPS
// ============================================

export const mockAIResponses = {
  confidence: [
    "Looking good for Guntersville! 78% confidence based on your spinnerbait success there.",
    "Wheeler Lake is tricky - 65% confidence. Focus on current breaks and rocky areas.",
    "Smith Lake will be tough - 45% confidence. Ultra-clear water requires finesse tactics."
  ],
  tips: [
    "Wind from the west will push baitfish to the north shore grass beds.",
    "Falling pressure means fish will likely be more aggressive - good time for reaction baits.", 
    "Water temp dropping to 68° suggests transition to fall patterns starting.",
    "Early morning bite has been strong lately - get there at first light."
  ],
  patterns: [
    "Your best Guntersville pattern: Spinnerbait on grass edges (73% success rate)",
    "Wheeler Lake success comes from jigs on current breaks (68% success rate)", 
    "Fall transition active - fish are moving from shallow to deeper structure"
  ]
};

// ============================================
// DEMO NOTIFICATIONS & ALERTS
// ============================================

export const mockNotifications = [
  {
    id: "notif-1",
    type: "tournament-alert",
    title: "Wheeler Lake Registration Closing Soon", 
    message: "Only 3 days left to register for Wheeler Lake Open",
    timestamp: "2 hours ago",
    urgent: true,
    read: false
  },
  {
    id: "notif-2", 
    type: "ai-tip",
    title: "Weather Alert - Guntersville",
    message: "Wind shifting to NE 15mph for tournament day", 
    timestamp: "4 hours ago",
    urgent: false,
    read: false
  },
  {
    id: "notif-3",
    type: "sponsor-deal", 
    title: "New Sponsor Deal Available",
    message: "20% off at Guntersville Bait & Tackle", 
    timestamp: "1 day ago",
    urgent: false,
    read: true
  },
  {
    id: "notif-4",
    type: "social",
    title: "Jake Patterson liked your catch",
    message: "Your 6.2 lb bass from Guntersville",
    timestamp: "2 days ago", 
    urgent: false,
    read: true
  },
  {
    id: "notif-5",
    type: "achievement",
    title: "New Badge Unlocked!",
    message: "You've earned the 'Deep Water Expert' badge",
    timestamp: "3 days ago",
    urgent: false,
    read: false
  }
];

// ============================================
// TOURNAMENT PLANS WITH AI INSIGHTS
// ============================================

export const mockTournamentPlans = [
  {
    id: "plan-guntersville-sept",
    tournament: "Lake Guntersville Championship",
    date: "Sept 28, 2024", 
    confidence: 78,
    primaryPattern: "Spinnerbait - Grass Edges",
    backupPattern: "Deep Crankbait - Points",
    conditions: "Stable weather, normal water levels",
    aiInsights: [
      "Strong NE wind will position baitfish on south shore", 
      "Your spinnerbait success rate here is 73%",
      "Morning bite typically peaks at 8:30 AM"
    ],
    waypoints: [
      { name: "Grass Edge Honey Hole", lat: 34.3583, lng: -86.2097, notes: "6.2 lb bass last time" },
      { name: "Deep Point #2", lat: 34.3556, lng: -86.2089, notes: "School of keepers" }
    ],
    lastUpdated: "Sept 25, 2024"
  },
  {
    id: "plan-wheeler-oct",
    tournament: "Wheeler Lake Open", 
    date: "Oct 12, 2024",
    confidence: 65,
    primaryPattern: "Football Jig - Current Breaks", 
    backupPattern: "Spinnerbait - Shallow Cover",
    conditions: "Falling water, cooler temps expected",
    aiInsights: [
      "Current breaks hold fish during stable conditions",
      "Your jig success rate on Wheeler is 68%", 
      "Cooler water means slower presentation needed"
    ],
    waypoints: [
      { name: "Current Break #1", lat: 34.7519, lng: -87.1042, notes: "Deep channel bend" },
      { name: "Rocky Shoal", lat: 34.7489, lng: -87.0998, notes: "Backup shallow area" }
    ],
    lastUpdated: "Oct 8, 2024"
  }
];

// ============================================
// TODO COMMENTS FOR INVESTOR PRESENTATION
// ============================================

/*
TODO: INVESTOR UPGRADE OPPORTUNITIES

1. REAL-TIME INTEGRATIONS
   - Weather API integration (AccuWeather/Weather Underground)
   - Lake condition monitoring (water temp, level sensors)
   - GPS tracking and waypoint sync with fish finders
   - Live tournament scoring systems

2. ADVANCED AI FEATURES  
   - Machine learning pattern recognition from historical data
   - Predictive modeling for tournament success
   - Computer vision for automatic catch logging from photos
   - Voice command processing for hands-free operation

3. SOCIAL & GAMIFICATION
   - Real-time social feeds during tournaments
   - Achievement system with unlockable content
   - Mentorship matching between pros and amateurs
   - Fantasy fishing leagues and betting

4. MONETIZATION OPPORTUNITIES
   - Premium coaching subscriptions ($9.99/month)
   - Sponsor deal commission (10-15%)
   - Tournament entry fee processing (2-3%)
   - Data licensing to fishing industry

5. HARDWARE INTEGRATIONS
   - Smart scale integration for automatic weigh-ins
   - Fishfinder data sync and waypoint sharing
   - Wearable device integration for biometric data
   - Drone scouting integration

6. ENTERPRISE FEATURES
   - Tournament director dashboard and management
   - Sponsor analytics and ROI tracking
   - Club administration and member management
   - Regulatory compliance and record keeping
*/