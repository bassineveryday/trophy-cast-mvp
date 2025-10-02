// Complete member profiles for all 12 club members across 2 clubs

export interface Trophy {
  id: string;
  title: string;
  year: number | string;
  placement?: number; // 1, 2, 3 for podium finishes
  category: 'tournament' | 'award' | 'badge';
  description?: string;
  icon?: string; // emoji or special indicator
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  placement: number | string;
  weightLbs: number;
  fishCount: number;
  points: number;
}

export interface CatchLog {
  id: string;
  date: string;
  time: string;
  location: string;
  coords: string;
  species: string;
  weight: number;
  length: number;
  weather: string;
  airTemp: number;
  waterTemp: number;
  waterClarity: string;
  lure: string;
  lureColor: string;
  technique: string;
  notes: string;
}

export interface Following {
  id: string;
  name: string;
  username: string;
  club: string;
  role: string;
  followingSince: string;
  mutual: boolean;
}

export interface MemberProfile {
  id: string;
  username: string;
  name: string;
  hometown: string;
  memberSince: number;
  bio: string;
  clubs: Array<{ id: string; name: string; role: string }>;
  stats: {
    tournaments: number;
    winRate: number;
    catches: number;
    biggestBass: number;
    rank: number;
    aoyPoints: number;
  };
  trophies: Trophy[];
  tournamentHistory: Tournament[];
  catchLog: CatchLog[];
  following: Following[];
}

export const MEMBER_PROFILES: Record<string, MemberProfile> = {
  "mike-johnson": {
    id: "mike-johnson",
    username: "mike-johnson",
    name: "Mike Johnson",
    hometown: "Madison, AL",
    memberSince: 2015,
    bio: "10-year competitive angler and club president. Passionate about growing the sport and mentoring new anglers.",
    clubs: [{ id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "President" }],
    stats: {
      tournaments: 45,
      winRate: 31.1,
      catches: 287,
      biggestBass: 8.9,
      rank: 1,
      aoyPoints: 4890
    },
    trophies: [
      { id: "t1", title: "Alabama State Championship", year: 2024, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t2", title: "President's Cup", year: 2024, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t3", title: "Fall Classic", year: 2024, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t4", title: "State Championship", year: 2023, placement: 2, category: 'tournament' },
      { id: "t5", title: "Regional Finals", year: 2023, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t6", title: "Summer Series Champion", year: 2023, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t7", title: "Angler of the Year", year: 2022, category: 'award', icon: '⭐' },
      { id: "t8", title: "Lake Martin Classic", year: 2022, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t9", title: "Biggest Bass Award 2024", year: 2024, category: 'badge', description: '8.9 lbs' },
      { id: "t10", title: "Biggest Bass Award 2023", year: 2023, category: 'badge', description: '8.1 lbs' },
      { id: "t11", title: "Tournament Director Award", year: 2024, category: 'badge' },
      { id: "t12", title: "Leadership Excellence", year: 2024, category: 'badge' },
      { id: "t13", title: "200+ Catches Milestone", year: 2023, category: 'badge' },
      { id: "t14", title: "10 Year Member Anniversary", year: 2024, category: 'badge' },
      { id: "t15", title: "Mentor of the Year", year: 2023, category: 'badge' },
      { id: "t16", title: "Conservation Champion", year: 2024, category: 'badge' },
      { id: "t17", title: "Club President 2020-2025", year: 2024, category: 'badge' },
      { id: "t18", title: "Hall of Fame Inductee", year: 2024, category: 'badge', icon: '⭐' },
    ],
    tournamentHistory: [
      { id: "1", name: "Alabama State Championship 2024", date: "Sept 28, 2024", location: "Lake Guntersville", placement: 1, weightLbs: 27.3, fishCount: 5, points: 100 },
      { id: "2", name: "President's Cup 2024", date: "Aug 15, 2024", location: "Lake Martin", placement: 1, weightLbs: 26.2, fishCount: 5, points: 100 },
      { id: "3", name: "Fall Classic 2024", date: "Sept 15, 2024", location: "Lake Guntersville", placement: 1, weightLbs: 24.8, fishCount: 5, points: 100 },
      { id: "4", name: "Regional Finals 2024", date: "July 20, 2024", location: "Pickwick Lake", placement: 2, weightLbs: 25.9, fishCount: 5, points: 99 },
      { id: "5", name: "Summer Series 2024", date: "June 12, 2024", location: "Wheeler Lake", placement: 1, weightLbs: 26.7, fishCount: 5, points: 100 },
      { id: "6", name: "State Championship 2023", date: "Sept 30, 2023", location: "Lake Martin", placement: 2, weightLbs: 25.4, fishCount: 5, points: 99 },
      { id: "7", name: "Regional Finals 2023", date: "Aug 18, 2023", location: "Lake Guntersville", placement: 1, weightLbs: 28.1, fishCount: 5, points: 100 },
      { id: "8", name: "President's Cup 2023", date: "July 22, 2023", location: "Pickwick Lake", placement: 1, weightLbs: 27.8, fishCount: 5, points: 100 },
      { id: "9", name: "Lake Martin Classic 2022", date: "Oct 5, 2022", location: "Lake Martin", placement: 1, weightLbs: 29.3, fishCount: 5, points: 100 },
      { id: "10", name: "Angler of Year Finals 2022", date: "Sept 10, 2022", location: "Lake Guntersville", placement: 1, weightLbs: 28.5, fishCount: 5, points: 100 },
    ],
    catchLog: [
      { id: "1", date: "Oct 2", time: "5:15 AM", location: "Lake Martin", coords: "32.7515°N, 85.9730°W", species: "Largemouth Bass", weight: 6.8, length: 22, weather: "Clear 65°F", airTemp: 65, waterTemp: 70, waterClarity: "Clear", lure: "Alabama Rig", lureColor: "Shad", technique: "Slow roll deep", notes: "Dawn patrol pays off" },
      { id: "2", date: "Sept 30", time: "6:00 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 5.4, length: 20, weather: "Sunny 68°F", airTemp: 68, waterTemp: 72, waterClarity: "Clear", lure: "Jig", lureColor: "Black/Blue", technique: "Flippin' grass mats", notes: "Classic pattern" },
      { id: "3", date: "Sept 27", time: "7:30 AM", location: "Lake Martin", coords: "32.7515°N, 85.9730°W", species: "Spotted Bass", weight: 4.1, length: 17, weather: "Partly Cloudy 70°F", airTemp: 70, waterTemp: 71, waterClarity: "Clear", lure: "Shaky Head", lureColor: "Green Pumpkin", technique: "Dragging points", notes: "Nice spot!" },
      { id: "4", date: "Sept 24", time: "11:00 AM", location: "Pickwick Lake", coords: "35.0644°N, 88.2442°W", species: "Smallmouth Bass", weight: 3.9, length: 17, weather: "Sunny 72°F", airTemp: 72, waterTemp: 69, waterClarity: "Clear", lure: "Drop Shot", lureColor: "Emerald Shiner", technique: "Deep structure", notes: "Pickwick smallie" },
      { id: "5", date: "Sept 20", time: "6:45 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 8.9, length: 24, weather: "Overcast 70°F", airTemp: 70, waterTemp: 73, waterClarity: "Slightly Stained", lure: "Swimjig + Rage Craw", lureColor: "White/Chartreuse", technique: "Punching mats", notes: "NEW PERSONAL BEST!" },
      { id: "6", date: "Sept 18", time: "2:00 PM", location: "Lake Martin", coords: "32.7515°N, 85.9730°W", species: "Largemouth Bass", weight: 5.8, length: 20, weather: "Clear 75°F", airTemp: 75, waterTemp: 72, waterClarity: "Clear", lure: "Carolina Rig", lureColor: "Brush Hog", technique: "Deep structure", notes: "Afternoon grind" },
      { id: "7", date: "Sept 15", time: "8:30 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 7.2, length: 22, weather: "Sunny 76°F", airTemp: 76, waterTemp: 74, waterClarity: "Clear", lure: "Crankbait", lureColor: "Chartreuse Shad", technique: "Deep grass edge", notes: "Tournament day magic" },
      { id: "8", date: "Sept 12", time: "5:45 AM", location: "Pickwick Lake", coords: "35.0644°N, 88.2442°W", species: "Smallmouth Bass", weight: 4.5, length: 18, weather: "Clear 68°F", airTemp: 68, waterTemp: 70, waterClarity: "Clear", lure: "Jerkbait", lureColor: "Chrome", technique: "Suspending", notes: "Trophy smallmouth" },
      { id: "9", date: "Sept 10", time: "7:00 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 6.1, length: 21, weather: "Partly Cloudy 72°F", airTemp: 72, waterTemp: 73, waterClarity: "Clear", lure: "Frog", lureColor: "Black", technique: "Walking pads", notes: "Explosive topwater" },
      { id: "10", date: "Sept 7", time: "6:15 AM", location: "Lake Martin", coords: "32.7515°N, 85.9730°W", species: "Largemouth Bass", weight: 5.9, length: 20, weather: "Overcast 70°F", airTemp: 70, waterTemp: 72, waterClarity: "Clear", lure: "Swimbait", lureColor: "Bluegill", technique: "Slow roll ledge", notes: "Martin beast" },
      { id: "11", date: "Sept 5", time: "1:30 PM", location: "Wheeler Lake", coords: "34.7642°N, 87.0242°W", species: "Largemouth Bass", weight: 4.8, length: 19, weather: "Sunny 78°F", airTemp: 78, waterTemp: 74, waterClarity: "Stained", lure: "Texas Rig", lureColor: "Creature", technique: "Flippin' brush", notes: "Midday grind" },
      { id: "12", date: "Sept 1", time: "6:00 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 7.5, length: 23, weather: "Foggy 68°F", airTemp: 68, waterTemp: 73, waterClarity: "Stained", lure: "Chatterbait + Swimbait", lureColor: "White", technique: "Fast retrieve", notes: "September giant" },
    ],
    following: [
      { id: "1", name: "Jake Wilson", username: "jake-wilson", club: "ABC12 + TVA", role: "Member", followingSince: "2020", mutual: true },
      { id: "2", name: "Tom Wilson", username: "tom-wilson", club: "ABC12", role: "Vice President", followingSince: "2017", mutual: true },
      { id: "3", name: "Sarah Martinez", username: "sarah-martinez", club: "ABC12", role: "Secretary", followingSince: "2019", mutual: true },
      { id: "4", name: "David Brown", username: "david-brown", club: "ABC12", role: "Tournament Director", followingSince: "2016", mutual: true },
      { id: "5", name: "Jennifer Lee", username: "jennifer-lee", club: "ABC12", role: "Member", followingSince: "2021", mutual: true },
      { id: "6", name: "John Smith", username: "john-smith", club: "TVA", role: "President", followingSince: "2018", mutual: true },
      { id: "7", name: "Amy Garcia", username: "amy-garcia", club: "TVA", role: "Vice President", followingSince: "2018", mutual: true },
      { id: "8", name: "Mary Johnson", username: "mary-johnson", club: "TVA", role: "Secretary", followingSince: "2019", mutual: true },
      { id: "9", name: "Paul Davis", username: "paul-davis", club: "TVA", role: "Tournament Director", followingSince: "2017", mutual: true },
      { id: "10", name: "Chris Anderson", username: "chris-anderson", club: "TVA", role: "Member", followingSince: "2020", mutual: true },
    ]
  },

  "jake-wilson": {
    id: "jake-wilson",
    username: "jake-wilson",
    name: "Jake Wilson",
    hometown: "Huntsville, AL",
    memberSince: 2020,
    bio: "Competitive bass angler with a passion for big fish and new techniques. Always looking to learn and improve my game.",
    clubs: [
      { id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Member" },
      { id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Member" }
    ],
    stats: {
      tournaments: 28,
      winRate: 14.3,
      catches: 156,
      biggestBass: 7.2,
      rank: 3,
      aoyPoints: 2890
    },
    trophies: [
      { id: "t1", title: "Tennessee Valley Open", year: 2024, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t2", title: "Spring Shootout", year: 2024, placement: 3, category: 'tournament' },
      { id: "t3", title: "Fall Classic", year: 2023, placement: 2, category: 'tournament' },
      { id: "t4", title: "Lake Guntersville Challenge", year: 2023, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t5", title: "Pickwick Open", year: 2023, placement: 4, category: 'tournament' },
      { id: "t6", title: "Alabama State Qualifier", year: 2022, placement: 3, category: 'tournament' },
      { id: "t7", title: "Biggest Bass Award 2024", year: 2024, category: 'badge', description: '7.2 lbs' },
      { id: "t8", title: "Most Improved Angler", year: 2023, category: 'badge' },
      { id: "t9", title: "Conservation Award", year: 2024, category: 'badge' },
      { id: "t10", title: "100+ Catches Milestone", year: 2023, category: 'badge' },
      { id: "t11", title: "5 Year Member Anniversary", year: 2024, category: 'badge' },
      { id: "t12", title: "Club MVP", year: 2023, category: 'badge' },
    ],
    tournamentHistory: [
      { id: "1", name: "Fall Classic 2024", date: "Sept 15, 2024", location: "Lake Guntersville", placement: 3, weightLbs: 22.9, fishCount: 5, points: 98 },
      { id: "2", name: "Tennessee Valley Open 2024", date: "Aug 22, 2024", location: "Pickwick Lake", placement: 1, weightLbs: 25.1, fishCount: 5, points: 100 },
      { id: "3", name: "Summer Showdown 2024", date: "July 18, 2024", location: "Wheeler Lake", placement: 5, weightLbs: 19.3, fishCount: 5, points: 96 },
      { id: "4", name: "Spring Shootout 2024", date: "May 10, 2024", location: "Lake Martin", placement: 3, weightLbs: 20.7, fishCount: 5, points: 98 },
      { id: "5", name: "Lake Guntersville Challenge 2023", date: "Nov 12, 2023", location: "Lake Guntersville", placement: 1, weightLbs: 24.5, fishCount: 5, points: 100 },
      { id: "6", name: "Pickwick Open 2023", date: "Sept 20, 2023", location: "Pickwick Lake", placement: 4, weightLbs: 18.9, fishCount: 4, points: 97 },
      { id: "7", name: "Fall Classic 2023", date: "Sept 16, 2023", location: "Lake Guntersville", placement: 2, weightLbs: 23.2, fishCount: 5, points: 99 },
      { id: "8", name: "Alabama State Qualifier 2023", date: "June 8, 2023", location: "Lake Martin", placement: 8, weightLbs: 17.1, fishCount: 4, points: 93 },
    ],
    catchLog: [
      { id: "1", date: "Oct 2", time: "6:45 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 4.2, length: 18, weather: "Partly Cloudy 68°F", airTemp: 68, waterTemp: 72, waterClarity: "Clear", lure: "Texas-rigged PowerBait Worm", lureColor: "Green Pumpkin", technique: "Flippin' docks", notes: "Hit on first cast!" },
      { id: "2", date: "Sept 28", time: "7:15 AM", location: "Pickwick Lake", coords: "35.0644°N, 88.2442°W", species: "Smallmouth Bass", weight: 3.1, length: 16, weather: "Sunny 70°F", airTemp: 70, waterTemp: 70, waterClarity: "Clear", lure: "Ned Rig", lureColor: "Watermelon", technique: "Dragging rocky points", notes: "Great fight!" },
      { id: "3", date: "Sept 25", time: "5:30 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Spotted Bass", weight: 2.8, length: 15, weather: "Overcast 65°F", airTemp: 65, waterTemp: 71, waterClarity: "Clear", lure: "Chatterbait", lureColor: "White/Chartreuse", technique: "Fast retrieve grass", notes: "Pre-dawn bite" },
      { id: "4", date: "Sept 22", time: "2:30 PM", location: "Wheeler Lake", coords: "34.7642°N, 87.0242°W", species: "Largemouth Bass", weight: 3.9, length: 17, weather: "Sunny 75°F", airTemp: 75, waterTemp: 73, waterClarity: "Stained", lure: "Topwater Whopper Plopper", lureColor: "Bone", technique: "Walking the dog", notes: "Epic blowup!" },
      { id: "5", date: "Sept 18", time: "8:00 AM", location: "Lake Martin", coords: "32.7515°N, 85.9730°W", species: "Largemouth Bass", weight: 5.1, length: 19, weather: "Partly Cloudy 70°F", airTemp: 70, waterTemp: 72, waterClarity: "Clear", lure: "Jig", lureColor: "Black/Blue", technique: "Flippin' laydowns", notes: "Personal best for Martin" },
      { id: "6", date: "Sept 15", time: "11:30 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 6.8, length: 21, weather: "Sunny 78°F", airTemp: 78, waterTemp: 74, waterClarity: "Clear", lure: "Swimbait", lureColor: "Bluegill", technique: "Slow roll ledge", notes: "Tournament kicker fish!" },
      { id: "7", date: "Sept 12", time: "6:00 AM", location: "Pickwick Lake", coords: "35.0644°N, 88.2442°W", species: "Smallmouth Bass", weight: 4.3, length: 18, weather: "Clear 68°F", airTemp: 68, waterTemp: 70, waterClarity: "Clear", lure: "Drop Shot", lureColor: "Roboworm", technique: "Vertical presentation", notes: "River smallie!" },
      { id: "8", date: "Sept 8", time: "7:45 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 3.5, length: 17, weather: "Overcast 72°F", airTemp: 72, waterTemp: 73, waterClarity: "Slightly Stained", lure: "Spinnerbait", lureColor: "Chartreuse/White", technique: "Burning grass", notes: "Early morning pattern" },
      { id: "9", date: "Sept 5", time: "3:00 PM", location: "Wheeler Lake", coords: "34.7642°N, 87.0242°W", species: "Largemouth Bass", weight: 2.9, length: 15, weather: "Sunny 80°F", airTemp: 80, waterTemp: 75, waterClarity: "Stained", lure: "Wacky Rig Senko", lureColor: "Green Pumpkin", technique: "Skipping docks", notes: "Afternoon shade bite" },
      { id: "10", date: "Sept 1", time: "6:30 AM", location: "Lake Guntersville", coords: "34.3583°N, 86.2946°W", species: "Largemouth Bass", weight: 4.7, length: 18, weather: "Foggy 70°F", airTemp: 70, waterTemp: 74, waterClarity: "Stained", lure: "Crankbait", lureColor: "Chartreuse/Black", technique: "Medium dive", notes: "Fog bite was on!" },
    ],
    following: [
      { id: "1", name: "Mike Johnson", username: "mike-johnson", club: "ABC12", role: "President", followingSince: "2020", mutual: true },
      { id: "2", name: "Tom Wilson", username: "tom-wilson", club: "ABC12", role: "Vice President", followingSince: "2020", mutual: true },
      { id: "3", name: "Sarah Martinez", username: "sarah-martinez", club: "ABC12", role: "Secretary", followingSince: "2021", mutual: true },
      { id: "4", name: "John Smith", username: "john-smith", club: "TVA", role: "President", followingSince: "2021", mutual: true },
      { id: "5", name: "Amy Garcia", username: "amy-garcia", club: "TVA", role: "Vice President", followingSince: "2022", mutual: true },
    ]
  },

  // Additional members can be added here following the same structure
  // For brevity, I'm including summaries for the remaining 10 members
  
  "tom-wilson": {
    id: "tom-wilson",
    username: "tom-wilson",
    name: "Tom Wilson",
    hometown: "Huntsville, AL",
    memberSince: 2017,
    bio: "Vice President and tournament organizer. Love fishing deep structure and ledges.",
    clubs: [{ id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Vice President" }],
    stats: { tournaments: 32, winRate: 18.8, catches: 198, biggestBass: 7.8, rank: 5, aoyPoints: 3210 },
    trophies: [
      { id: "t1", title: "Regional Finals", year: 2024, placement: 2, category: 'tournament' },
      { id: "t2", title: "Club VP Award", year: 2024, category: 'badge' },
      { id: "t3", title: "Summer Slam", year: 2023, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t4", title: "150 Catches Badge", year: 2023, category: 'badge' },
      { id: "t5", title: "7 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t6", title: "Officer Excellence", year: 2023, category: 'badge' },
      { id: "t7", title: "Team Tournament 1st", year: 2023, category: 'tournament', icon: '🏆' },
      { id: "t8", title: "Conservation Award", year: 2024, category: 'badge' },
      { id: "t9", title: "Sportsmanship Award", year: 2023, category: 'badge' },
      { id: "t10", title: "Mentor Badge", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "sarah-martinez": {
    id: "sarah-martinez",
    username: "sarah-martinez",
    name: "Sarah Martinez",
    hometown: "Madison, AL",
    memberSince: 2019,
    bio: "Club secretary and tournament photographer. First generation angler making waves!",
    clubs: [{ id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Secretary" }],
    stats: { tournaments: 28, winRate: 14.3, catches: 142, biggestBass: 6.9, rank: 8, aoyPoints: 2890 },
    trophies: [
      { id: "t1", title: "Fall Classic", year: 2024, placement: 4, category: 'tournament' },
      { id: "t2", title: "Lady Angler Champion", year: 2023, category: 'award', icon: '🏆' },
      { id: "t3", title: "Rising Star", year: 2022, category: 'badge' },
      { id: "t4", title: "100 Catches Badge", year: 2023, category: 'badge' },
      { id: "t5", title: "Secretary Award", year: 2024, category: 'badge' },
      { id: "t6", title: "Team Tournament 2nd", year: 2023, category: 'tournament' },
      { id: "t7", title: "Conservation Leader", year: 2024, category: 'badge' },
      { id: "t8", title: "Photography Award", year: 2023, category: 'badge' },
      { id: "t9", title: "5 Year Anniversary", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "david-brown": {
    id: "david-brown",
    username: "david-brown",
    name: "David Brown",
    hometown: "Harvest, AL",
    memberSince: 2016,
    bio: "Tournament director with a passion for fair competition and big bass.",
    clubs: [{ id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Tournament Director" }],
    stats: { tournaments: 38, winRate: 21.1, catches: 215, biggestBass: 8.2, rank: 3, aoyPoints: 3780 },
    trophies: [
      { id: "t1", title: "Tournament Director Award", year: 2024, category: 'badge' },
      { id: "t2", title: "President's Cup", year: 2023, placement: 2, category: 'tournament' },
      { id: "t3", title: "Lake Martin Classic", year: 2022, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t4", title: "Regional Finals", year: 2024, placement: 3, category: 'tournament' },
      { id: "t5", title: "Biggest Bass 2023", year: 2023, category: 'badge', description: '8.0 lbs' },
      { id: "t6", title: "200 Catches Badge", year: 2023, category: 'badge' },
      { id: "t7", title: "8 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t8", title: "Leadership Award", year: 2024, category: 'badge' },
      { id: "t9", title: "Officer Excellence", year: 2023, category: 'badge' },
      { id: "t10", title: "Sportsmanship Badge", year: 2024, category: 'badge' },
      { id: "t11", title: "Conservation Champion", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "jennifer-lee": {
    id: "jennifer-lee",
    username: "jennifer-lee",
    name: "Jennifer Lee",
    hometown: "Huntsville, AL",
    memberSince: 2021,
    bio: "Newer member learning from the best. Love topwater fishing and early mornings!",
    clubs: [{ id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Member" }],
    stats: { tournaments: 18, winRate: 8.3, catches: 89, biggestBass: 5.8, rank: 18, aoyPoints: 1560 },
    trophies: [
      { id: "t1", title: "Rookie of Year", year: 2021, category: 'badge' },
      { id: "t2", title: "First Tournament Badge", year: 2021, category: 'badge' },
      { id: "t3", title: "50 Catches Badge", year: 2022, category: 'badge' },
      { id: "t4", title: "Conservation Award", year: 2023, category: 'badge' },
      { id: "t5", title: "Team Spirit Award", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "john-smith": {
    id: "john-smith",
    username: "john-smith",
    name: "John Smith",
    hometown: "Decatur, AL",
    memberSince: 2014,
    bio: "TVA President and family fishing advocate. Building community through competition.",
    clubs: [{ id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "President" }],
    stats: { tournaments: 41, winRate: 26.8, catches: 249, biggestBass: 8.4, rank: 2, aoyPoints: 4120 },
    trophies: [
      { id: "t1", title: "TVA President Award", year: 2024, category: 'badge' },
      { id: "t2", title: "Regional Champion", year: 2023, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t3", title: "Tennessee Valley Open", year: 2022, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t4", title: "State Qualifier", year: 2024, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t5", title: "Biggest Bass 2022", year: 2022, category: 'badge', description: '8.4 lbs' },
      { id: "t6", title: "AOY Runner-up", year: 2023, category: 'award' },
      { id: "t7", title: "10 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t8", title: "200 Catches Badge", year: 2023, category: 'badge' },
      { id: "t9", title: "Leadership Excellence", year: 2024, category: 'badge' },
      { id: "t10", title: "Mentor of Year", year: 2023, category: 'badge' },
      { id: "t11", title: "Conservation Champion", year: 2024, category: 'badge' },
      { id: "t12", title: "Family Tournament Organizer", year: 2023, category: 'badge' },
      { id: "t13", title: "Youth Development Award", year: 2024, category: 'badge' },
      { id: "t14", title: "Officer Excellence", year: 2023, category: 'badge' },
      { id: "t15", title: "Hall of Fame Nominee", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "amy-garcia": {
    id: "amy-garcia",
    username: "amy-garcia",
    name: "Amy Garcia",
    hometown: "Athens, AL",
    memberSince: 2018,
    bio: "VP and competitive lady angler. Proving women dominate on the water!",
    clubs: [{ id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Vice President" }],
    stats: { tournaments: 30, winRate: 16.7, catches: 167, biggestBass: 7.1, rank: 7, aoyPoints: 2990 },
    trophies: [
      { id: "t1", title: "Lady Angler Champion", year: 2024, category: 'award', icon: '🏆' },
      { id: "t2", title: "VP Excellence Award", year: 2024, category: 'badge' },
      { id: "t3", title: "Spring Shootout", year: 2023, placement: 2, category: 'tournament' },
      { id: "t4", title: "Conservation Leader", year: 2024, category: 'badge' },
      { id: "t5", title: "Team Tournament 1st", year: 2022, category: 'tournament', icon: '🏆' },
      { id: "t6", title: "150 Catches Badge", year: 2023, category: 'badge' },
      { id: "t7", title: "6 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t8", title: "Sportsmanship Award", year: 2023, category: 'badge' },
      { id: "t9", title: "Officer Badge", year: 2024, category: 'badge' },
      { id: "t10", title: "Mentor Award", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "mary-johnson": {
    id: "mary-johnson",
    username: "mary-johnson",
    name: "Mary Johnson",
    hometown: "Huntsville, AL",
    memberSince: 2019,
    bio: "Secretary and social media coordinator. Sharing the joy of fishing with the community!",
    clubs: [{ id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Secretary" }],
    stats: { tournaments: 25, winRate: 12.0, catches: 134, biggestBass: 6.5, rank: 14, aoyPoints: 2240 },
    trophies: [
      { id: "t1", title: "Secretary Award", year: 2024, category: 'badge' },
      { id: "t2", title: "Team Tournament 2nd", year: 2023, category: 'tournament' },
      { id: "t3", title: "Fall Family Tournament", year: 2022, placement: 1, category: 'tournament', icon: '🏆' },
      { id: "t4", title: "100 Catches Badge", year: 2023, category: 'badge' },
      { id: "t5", title: "5 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t6", title: "Social Media Excellence", year: 2024, category: 'badge' },
      { id: "t7", title: "Photography Award", year: 2023, category: 'badge' },
      { id: "t8", title: "Community Builder", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "paul-davis": {
    id: "paul-davis",
    username: "paul-davis",
    name: "Paul Davis",
    hometown: "Madison, AL",
    memberSince: 2017,
    bio: "Tournament director focused on fair play and growing TVA membership.",
    clubs: [{ id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Tournament Director" }],
    stats: { tournaments: 35, winRate: 19.4, catches: 189, biggestBass: 7.6, rank: 6, aoyPoints: 3340 },
    trophies: [
      { id: "t1", title: "Tournament Director Excellence", year: 2024, category: 'badge' },
      { id: "t2", title: "Pickwick Open", year: 2023, placement: 2, category: 'tournament' },
      { id: "t3", title: "Summer Series", year: 2024, placement: 3, category: 'tournament' },
      { id: "t4", title: "150 Catches Badge", year: 2023, category: 'badge' },
      { id: "t5", title: "7 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t6", title: "Officer Award", year: 2024, category: 'badge' },
      { id: "t7", title: "Leadership Badge", year: 2023, category: 'badge' },
      { id: "t8", title: "Conservation Award", year: 2024, category: 'badge' },
      { id: "t9", title: "Team Tournament Organizer", year: 2023, category: 'badge' },
      { id: "t10", title: "Sportsmanship Excellence", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },

  "chris-anderson": {
    id: "chris-anderson",
    username: "chris-anderson",
    name: "Chris Anderson",
    hometown: "Athens, AL",
    memberSince: 2020,
    bio: "Weekend warrior and river fishing enthusiast. Always learning new techniques!",
    clubs: [{ id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Member" }],
    stats: { tournaments: 22, winRate: 10.9, catches: 118, biggestBass: 6.3, rank: 15, aoyPoints: 1890 },
    trophies: [
      { id: "t1", title: "Fall Classic", year: 2024, placement: 5, category: 'tournament' },
      { id: "t2", title: "Team Tournament 3rd", year: 2022, category: 'tournament' },
      { id: "t3", title: "100 Catches Badge", year: 2023, category: 'badge' },
      { id: "t4", title: "4 Year Anniversary", year: 2024, category: 'badge' },
      { id: "t5", title: "River Specialist Badge", year: 2023, category: 'badge' },
      { id: "t6", title: "Conservation Supporter", year: 2024, category: 'badge' },
    ],
    tournamentHistory: [],
    catchLog: [],
    following: []
  },
};

// Club data structure
export const CLUB_DATA = {
  "alabama-bass-chapter-12": {
    id: "alabama-bass-chapter-12",
    name: "Alabama Bass Chapter 12",
    location: "Huntsville, AL",
    description: "Competitive bass fishing club serving North Alabama. We host monthly tournaments and promote conservation of our local waterways.",
    boardMembers: ["mike-johnson", "tom-wilson", "sarah-martinez", "david-brown"],
    members: ["jake-wilson", "jennifer-lee"]
  },
  "tennessee-valley-anglers": {
    id: "tennessee-valley-anglers",
    name: "Tennessee Valley Anglers",
    location: "Decatur, AL",
    description: "Family-friendly fishing club focused on recreation and youth development. Join us for fun tournaments and community events.",
    boardMembers: ["john-smith", "amy-garcia", "mary-johnson", "paul-davis"],
    members: ["jake-wilson", "chris-anderson"]
  }
};
