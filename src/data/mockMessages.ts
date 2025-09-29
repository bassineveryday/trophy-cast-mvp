// Mock data for messaging functionality

export interface MessageThread {
  threadId: string;
  anglerId: string;
  name: string;
  avatar: string;
  initials: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  commonGround: {
    clubs: string[];
    cityMatch: boolean;
    sharedLakes: string[];
  };
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ClubInboxItem {
  id: string;
  title: string;
  club: string;
  clubLogo: string;
  date: string;
  preview: string;
  type: 'newsletter' | 'announcement' | 'sponsor' | 'schedule';
  content: string;
}

export interface OfficerNote {
  id: string;
  title: string;
  club: string;
  clubId: string;
  clubLogo: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  eventDate?: string;
  dueDate?: string;
  contextLine: string;
  target?: {
    current: number;
    needed: number;
    type: string; // e.g., "boaters", "riders", "judges"
  };
  threadId?: string;
  priority: 'high' | 'medium' | 'low';
  author: {
    name: string;
    role: string;
  };
  createdAt: string;
  resolvedAt?: string;
  eventDetails?: {
    tournamentId?: string;
    lake: string;
    checkInTime: string;
  };
}

export const mockMessageThreads: MessageThread[] = [
  {
    threadId: "thread-1",
    anglerId: "jake-patterson",
    name: "Jake Patterson",
    avatar: "/placeholder.svg",
    initials: "JP",
    lastMessage: "Great catch at Guntersville! That spinnerbait pattern is working well.",
    timestamp: "2m ago",
    unread: true,
    commonGround: {
      clubs: ["alabama-bass-nation"],
      cityMatch: true,
      sharedLakes: ["Lake Guntersville", "Wheeler Lake"]
    }
  },
  {
    threadId: "thread-2", 
    anglerId: "maria-santos",
    name: "Maria Santos",
    avatar: "/placeholder.svg",
    initials: "MS",
    lastMessage: "Thanks for the Wheeler Lake tips! Definitely helped with the current breaks.",
    timestamp: "1h ago", 
    unread: false,
    commonGround: {
      clubs: [],
      cityMatch: false,
      sharedLakes: ["Wheeler Lake", "Pickwick Lake"]
    }
  },
  {
    threadId: "thread-3",
    anglerId: "tommy-lee", 
    name: "Tommy Lee",
    avatar: "/placeholder.svg",
    initials: "TL",
    lastMessage: "You fishing the Smith Lake tournament next month?",
    timestamp: "3d ago",
    unread: false,
    commonGround: {
      clubs: ["river-valley"],
      cityMatch: false, 
      sharedLakes: ["Smith Lake"]
    }
  }
];

export const mockMessages: Message[] = [
  // Thread 1 - Jake Patterson
  {
    id: "msg-1",
    threadId: "thread-1",
    senderId: "jake-patterson",
    senderName: "Jake Patterson",
    content: "Hey! Saw your catch from Guntersville yesterday. Nice bass!",
    timestamp: "Yesterday 3:45 PM",
    isOwn: false,
    status: 'read'
  },
  {
    id: "msg-2", 
    threadId: "thread-1",
    senderId: "current-user",
    senderName: "You",
    content: "Thanks! That deep grass edge has been producing all week.",
    timestamp: "Yesterday 4:12 PM",
    isOwn: true,
    status: 'delivered'
  },
  {
    id: "msg-3",
    threadId: "thread-1", 
    senderId: "jake-patterson",
    senderName: "Jake Patterson",
    content: "Great catch at Guntersville! That spinnerbait pattern is working well.",
    timestamp: "2m ago",
    isOwn: false,
    status: 'delivered'
  },

  // Thread 2 - Maria Santos
  {
    id: "msg-4",
    threadId: "thread-2",
    senderId: "current-user", 
    senderName: "You",
    content: "The current breaks on Wheeler are holding good fish right now. Try the north side.",
    timestamp: "2 days ago 10:30 AM",
    isOwn: true,
    status: 'read'
  },
  {
    id: "msg-5",
    threadId: "thread-2",
    senderId: "maria-santos",
    senderName: "Maria Santos", 
    content: "Thanks for the Wheeler Lake tips! Definitely helped with the current breaks.",
    timestamp: "1h ago",
    isOwn: false,
    status: 'delivered'
  },

  // Thread 3 - Tommy Lee  
  {
    id: "msg-6",
    threadId: "thread-3",
    senderId: "tommy-lee",
    senderName: "Tommy Lee",
    content: "You fishing the Smith Lake tournament next month?",
    timestamp: "3 days ago 2:15 PM", 
    isOwn: false,
    status: 'read'
  }
];

export const mockClubInbox: ClubInboxItem[] = [
  {
    id: "club-1",
    title: "ABN-12 Monthly Newsletter", 
    club: "Alabama Bass Nation – Chapter 12",
    clubLogo: "/placeholder.svg",
    date: "Sept 25, 2024",
    preview: "Tournament updates, new member spotlight, and October schedule changes...",
    type: "newsletter",
    content: `
      <h2>Alabama Bass Nation Chapter 12 - September Newsletter</h2>
      
      <h3>Tournament Updates</h3>
      <p>Great turnout at Lake Guntersville! 47 anglers competed with Jake Patterson taking first place with 21.45 lbs.</p>
      
      <h3>New Member Spotlight</h3>
      <p>Welcome Sarah Johnson to ABN-12! Sarah brings 5 years of tournament experience and has already registered for upcoming events.</p>
      
      <h3>October Schedule</h3>
      <ul>
        <li>Oct 12: Wheeler Lake Open (5:30 AM launch)</li>
        <li>Oct 26: Smith Lake Championship (6:00 AM launch)</li>
      </ul>
      
      <h3>Sponsor Spotlight</h3>
      <p>Thanks to Guntersville Bait & Tackle for supporting our club with gear discounts!</p>
    `
  },
  {
    id: "club-2",
    title: "Wheeler Lake Schedule Update",
    club: "Alabama Bass Nation – Chapter 12", 
    clubLogo: "/placeholder.svg",
    date: "Sept 23, 2024",
    preview: "Launch time changed to 5:30 AM due to boat ramp construction...",
    type: "announcement",
    content: `
      <h2>Important Schedule Change - Wheeler Lake Tournament</h2>
      
      <p><strong>Date:</strong> October 12, 2024</p>
      <p><strong>New Launch Time:</strong> 5:30 AM (changed from 6:00 AM)</p>
      
      <h3>Reason for Change</h3>
      <p>The main boat ramp will have construction crews starting at 7:00 AM. By launching earlier, we ensure all anglers can get on the water safely.</p>
      
      <h3>What This Means</h3>
      <ul>
        <li>Registration: 5:00 - 5:25 AM</li>
        <li>Boat inspection: 4:45 - 5:20 AM</li>
        <li>Launch: 5:30 AM sharp</li>
        <li>Weigh-in: Still at 2:30 PM</li>
      </ul>
      
      <p>Please plan accordingly and spread the word to your fishing partners!</p>
    `
  },
  {
    id: "club-3",
    title: "Sponsor Deal: 20% Off Spinnerbaits",
    club: "Alabama Bass Nation – Chapter 12",
    clubLogo: "/placeholder.svg", 
    date: "Sept 20, 2024",
    preview: "Guntersville Bait & Tackle is offering ABN-12 members 20% off all spinnerbaits...",
    type: "sponsor",
    content: `
      <h2>Member Exclusive: Spinnerbait Sale</h2>
      
      <p><strong>Guntersville Bait & Tackle</strong> is offering ABN-12 members an exclusive deal!</p>
      
      <h3>Deal Details</h3>
      <ul>
        <li><strong>Discount:</strong> 20% off all spinnerbaits</li>
        <li><strong>Valid Until:</strong> September 30, 2024</li>
        <li><strong>Code:</strong> ABN12SPIN</li>
        <li><strong>Location:</strong> 123 Marina Dr, Guntersville, AL</li>
      </ul>
      
      <h3>Featured Brands</h3>
      <p>Sale includes War Eagle, Strike King, and Booyah spinnerbaits - perfect for the fall bite on Guntersville!</p>
      
      <p>Show your ABN-12 membership card or mention this newsletter to redeem in-store.</p>
      
      <p><em>Thanks to Guntersville Bait & Tackle for supporting our club!</em></p>
    `
  }
];

export const mockOfficerNotes: OfficerNote[] = [
  {
    id: "note-1",
    title: "Need 2 Boaters for Oct Guntersville",
    club: "Alabama Bass Nation – Chapter 12",
    clubId: "alabama-bass-nation-12",
    clubLogo: "/src/assets/alabama-bass-logo.png",
    status: "UNRESOLVED",
    eventDate: "Oct 12, 2024",
    dueDate: "Oct 10, 2024",
    contextLine: "Lake Guntersville • Oct 12 • 5:30 AM check-in",
    target: {
      current: 1,
      needed: 2,
      type: "boaters"
    },
    threadId: "officer-thread-1",
    priority: "high",
    author: {
      name: "Mike Johnson",
      role: "Tournament Director"
    },
    createdAt: "Sept 24, 2024",
    eventDetails: {
      tournamentId: "guntersville-oct-2024",
      lake: "Lake Guntersville",
      checkInTime: "5:30 AM"
    }
  },
  {
    id: "note-2", 
    title: "Judges Needed - Wheeler Championship",
    club: "Alabama Bass Nation – Chapter 12",
    clubId: "alabama-bass-nation-12",
    clubLogo: "/src/assets/alabama-bass-logo.png",
    status: "RESOLVED",
    eventDate: "Nov 5, 2024",
    contextLine: "Wheeler Lake • Nov 5 • Championship Event",
    target: {
      current: 3,
      needed: 3,
      type: "judges"
    },
    threadId: "officer-thread-2",
    priority: "medium",
    author: {
      name: "Sarah Davis",
      role: "Club President"
    },
    createdAt: "Sept 20, 2024",
    resolvedAt: "Sept 23, 2024",
    eventDetails: {
      tournamentId: "wheeler-championship-2024",
      lake: "Wheeler Lake",
      checkInTime: "6:00 AM"
    }
  },
  {
    id: "note-3",
    title: "Help Needed: Lake Cleanup Day",
    club: "River Valley Bass Club",
    clubId: "river-valley-bass-club",
    clubLogo: "/src/assets/river-valley-logo.png",
    status: "UNRESOLVED",
    eventDate: "Oct 8, 2024",
    contextLine: "Smith Lake • Oct 8 • Community Service",
    target: {
      current: 4,
      needed: 8,
      type: "volunteers"
    },
    threadId: "officer-thread-3",
    priority: "medium",
    author: {
      name: "Tommy Lee",
      role: "Conservation Officer"
    },
    createdAt: "Sept 22, 2024",
    eventDetails: {
      lake: "Smith Lake",
      checkInTime: "8:00 AM"
    }
  }
];

export const quickReplies = [
  "Great job at Guntersville!",
  "You fishing Wheeler next week?", 
  "Let's pre-fish Saturday.",
  "Thanks for the tip!",
  "See you at the tournament!",
  "Good luck out there!"
];