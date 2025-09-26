import { Sun, Cloud, Trophy, Anchor, Waves, TrendingUp } from "lucide-react";
import { Tournament, CatchData, UserProfile, CareerStats } from "@/types";

export const mockUser: UserProfile = {
  name: "Jake the Tournament Angler",
  title: "2019 AOY Champion",
  location: "Alabama",
  badges: 4,
  personalBest: {
    weight: 7.1,
    location: "Lake Pueblo",
    date: "May 2023",
    lure: "Spinnerbait",
    technique: "Grass Edge"
  }
};

export const mockTournaments: Tournament[] = [
  {
    id: "1",
    name: "Lake Guntersville",
    club: "Alabama Bass Nation – Chapter 12",
    date: "Sept 28",
    time: "6:00 AM",
    registered: true,
    fee: "$100",
    weather: "74°/58° • W 8mph",
    weatherIcon: Sun,
    link: "/tournament/lake-guntersville",
    hasPlan: true
  },
  {
    id: "2",
    name: "Wheeler Lake", 
    club: "River Valley Independent Bass Club",
    date: "Oct 12",
    time: "5:30 AM",
    registered: true,
    fee: "$100",
    weather: "Early Outlook",
    weatherIcon: Cloud,
    link: "/tournament/wheeler-lake",
    hasPlan: true
  },
  {
    id: "3",
    name: "Smith Lake",
    club: "Alabama Bass Nation – Chapter 12", 
    date: "Oct 26",
    time: "6:00 AM",
    registered: false,
    fee: "$100",
    weather: "Early Outlook",
    weatherIcon: Cloud,
    link: "/tournament/smith-lake",
    hasPlan: false
  }
];

export const mockCatches: CatchData[] = [
  {
    id: 1,
    weight: 6.2,
    lure: "Deep Diving Crankbait",
    time: "1:27 PM",
    lake: "Lake Guntersville",
    badge: { name: "Big Bass – Tournament Leader", icon: Trophy, color: "bg-trophy-gold" },
    tournamentId: "lake-guntersville",
    catchId: "pin-4"
  },
  {
    id: 2, 
    weight: 5.7,
    lure: "White/Chartreuse Spinnerbait",
    time: "7:42 AM",
    lake: "Lake Guntersville",
    badge: { name: "First Keeper", icon: Anchor, color: "bg-amber-600" },
    tournamentId: "lake-guntersville",
    catchId: "pin-1"
  },
  {
    id: 3,
    weight: 4.3,
    lure: "Football Jig, Green Pumpkin",
    time: "10:18 AM", 
    lake: "Lake Guntersville",
    badge: { name: "Deep Water Bite", icon: Waves, color: "bg-water-blue" },
    tournamentId: "lake-guntersville",
    catchId: "pin-2"
  },
  {
    id: 4,
    weight: 3.9,
    lure: "Texas Rig Worm",
    time: "12:05 PM",
    lake: "Lake Guntersville", 
    badge: { name: "Pattern Change", icon: TrendingUp, color: "bg-fishing-green" },
    tournamentId: "lake-guntersville",
    catchId: "pin-3"
  }
];

export const mockCareerStats: CareerStats = {
  tournaments: 47,
  wins: 3,
  aoyTitles: 1,
  personalBest: 7.1,
  firstPlace: 3,
  secondPlace: 5,
  thirdPlace: 4,
  top10: 18,
  top20: 31
};