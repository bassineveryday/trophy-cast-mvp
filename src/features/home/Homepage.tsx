import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, TrendingUp, Users, Calendar, Zap, Camera, Award, ArrowRight, Star, Bell, ChevronDown, Fish, Target, Brain, Mic, MessageSquare, AlertTriangle, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/contexts/DemoModeContext";

// Components
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AIStatusBar from "@/components/AIStatusBar";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";
import UniversalAvatar from "@/components/UniversalAvatar";

// Data
import { mockUser, mockCareerStats } from "@/data/mockData";
import { enhancedMockTournaments, mockNotifications, enhancedClubFeed } from "@/data/enhancedMockData";
import { mockOfficerNotes } from "@/data/mockMessages";

// Components
import OfficerNote from "@/components/OfficerNote";

// Assets
import alabamaBassLogo from "@/assets/alabama-bass-logo.png";
import riverValleyLogo from "@/assets/river-valley-logo.png";
import trophyCastLogo from "@/assets/trophy-cast-logo.png";

// Demo Components
import { DemoFeatureBanner, DemoNotification } from "@/components/demo/DemoFeatureBanner";
const Homepage = () => {
  const { enabled, role, demoUser, demoCatches, demoTournament, demoClub } = useDemoMode();
  
  // Helper function for weight conversion
  const ozToLbOz = (oz: number) => {
    const lb = Math.floor(oz / 16);
    const rem = oz % 16;
    return lb > 0 ? `${lb} lb ${rem} oz` : `${oz} oz`;
  };

  // If demo mode is enabled, show simplified demo-specific home screens
  if (enabled) {
    if (role === "jake") {
      // Jake's Angler Home Screen
      const totalCatches = demoCatches ? demoCatches.length : 0;
      const best = demoCatches && demoCatches.length > 0
        ? demoCatches.reduce((a, b) => (a.weight_oz > b.weight_oz ? a : b))
        : null;

      return (
        <div className="min-h-screen bg-background p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Welcome back, Jake!</h1>
            <p className="text-muted-foreground">Ready for your next tournament?</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Fish className="w-5 h-5 text-fishing-green" />
                  <div>
                    <p className="text-2xl font-bold">{totalCatches}</p>
                    <p className="text-sm text-muted-foreground">Demo Catches</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-trophy-gold" />
                  <div>
                    <p className="text-lg font-bold">{best ? ozToLbOz(best.weight_oz) : "—"}</p>
                    <p className="text-sm text-muted-foreground">Personal Best</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Tournament */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Next Tournament
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">{demoTournament?.name || "No tournament scheduled"}</h3>
              {demoTournament?.lake && <p className="text-sm text-muted-foreground">@ {demoTournament.lake}</p>}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/my-catches">
              <Button className="w-full">
                <Fish className="w-4 h-4 mr-2" />
                My Catches
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button className="w-full" variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                Tournaments
              </Button>
            </Link>
            <Link to="/ai-coach">
              <Button className="w-full" variant="outline">
                <Brain className="w-4 h-4 mr-2" />
                AI Coach
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button className="w-full" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    if (role === "president") {
      // President's Club Management Home Screen
      return (
        <div className="min-h-screen bg-background p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Club President Dashboard</h1>
            <p className="text-muted-foreground">Manage your club and tournaments</p>
          </div>

          {/* Club Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                {demoClub?.name || "Your Club"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Event */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Next Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold">{demoTournament?.name || "No tournament scheduled"}</h3>
              {demoTournament?.lake && <p className="text-sm text-muted-foreground">@ {demoTournament.lake}</p>}
            </CardContent>
          </Card>

          {/* Management Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/clubs">
              <Button className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Manage Club
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button className="w-full" variant="outline">
                <Trophy className="w-4 h-4 mr-2" />
                Tournaments
              </Button>
            </Link>
            <Link to="/messages">
              <Button className="w-full" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Club Messages
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button className="w-full" variant="outline">
                <Award className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      );
    }
  }

  // Original complex homepage for regular users
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedClub, setSelectedClub] = useState("alabama-bass-nation");
  const [tournamentsExpanded, setTournamentsExpanded] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const {
    toast
  } = useToast();

  // Mock clubs for multi-club support
  const userClubs = [{
    id: "alabama-bass-nation",
    name: "Alabama Bass Nation – Chapter 12",
    abbreviation: "ABN-12",
    leader: "Jake Patterson",
    leaderClubs: ["alabama-bass-nation"],
    points: 1847,
    logo: alabamaBassLogo
  }, {
    id: "river-valley",
    name: "River Valley Independent Bass Club",
    abbreviation: "RVIBC",
    leader: "Maria Santos",
    leaderClubs: ["river-valley"],
    points: 1723,
    logo: riverValleyLogo
  }, {
    id: "trophy-cast",
    name: "Trophy Cast Elite Series",
    abbreviation: "TCES",
    leader: "Tommy Lee",
    leaderClubs: ["trophy-cast", "river-valley"],
    // Multi-club angler
    points: 1685,
    logo: trophyCastLogo
  }];

  // Sample statistics for demo (club-specific)
  const currentClub = userClubs.find(club => club.id === selectedClub) || userClubs[0];
  const demoStats = {
    catchesThisMonth: 23,
    topClubLeader: currentClub.leader,
    clubPoints: currentClub.points,
    recentAiTip: "Try spinnerbaits on windy north shores",
    upcomingTournaments: 3
  };

  // Mock followed anglers data
  const followedAnglers = [{
    id: "jake-patterson",
    name: "Jake Patterson",
    avatar: "/placeholder.svg",
    initials: "JP",
    wins: 12,
    top10: 34,
    pbWeight: "8.2 lbs"
  }, {
    id: "maria-santos",
    name: "Maria Santos",
    avatar: "/placeholder.svg",
    initials: "MS",
    wins: 8,
    top10: 28,
    pbWeight: "7.8 lbs"
  }, {
    id: "tommy-lee",
    name: "Tommy Lee",
    avatar: "/placeholder.svg",
    initials: "TL",
    wins: 15,
    top10: 42,
    pbWeight: "9.1 lbs"
  }, {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    initials: "SJ",
    wins: 6,
    top10: 19,
    pbWeight: "6.9 lbs"
  }, {
    id: "mike-rodriguez",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg",
    initials: "MR",
    wins: 10,
    top10: 31,
    pbWeight: "8.5 lbs"
  }];
  const handleAnglerLongPress = (angler: any) => {
    // Mock quick actions - would show bottom sheet in real app
    toast({
      title: `${angler.name} Actions`,
      description: "View Profile • Message • Unfollow"
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {isRefreshing && <LoadingSpinner message="Refreshing..." />}
      </AnimatePresence>

      {/* AI Status Bar */}
      <AIStatusBar />

      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white px-4 py-8 overflow-hidden">
        {/* Notification Bell - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative">
                <Bell className="w-6 h-6" />
                {mockNotifications.filter(n => !n.read).length > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{mockNotifications.filter(n => !n.read).length}</span>
                  </div>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
              <div className="p-2 font-semibold text-sm border-b">Recent Notifications</div>
              {mockNotifications.slice(0, 5).map((notification, index) => <div key={notification.id}>
                  <DropdownMenuItem className="flex-col items-start p-3 cursor-pointer">
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-left">{notification.message}</p>
                    {notification.urgent && <Badge className="mt-1 bg-red-100 text-red-800 text-xs">Urgent</Badge>}
                  </DropdownMenuItem>
                  {index < mockNotifications.slice(0, 5).length - 1 && <DropdownMenuSeparator />}
                </div>)}
              <DropdownMenuSeparator />
              
              {/* Officer Notes Section */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Officer Notes</span>
                  {mockOfficerNotes.filter(note => note.status === 'UNRESOLVED').length > 0 && <Badge variant="destructive" className="text-xs">
                      {mockOfficerNotes.filter(note => note.status === 'UNRESOLVED').length}
                    </Badge>}
                </div>
                <div className="space-y-2">
                  {mockOfficerNotes.filter(note => note.status === 'UNRESOLVED').slice(0, 2).map(note => <div key={note.id} className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded p-1" onClick={() => window.location.href = '/messages?tab=club'}>
                      <div className="w-6 h-6 bg-orange-500/10 rounded flex items-center justify-center">
                        <AlertTriangle className="w-3 h-3 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{note.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {note.club.split(' – ')[0]} • {note.createdAt}
                        </p>
                      </div>
                    </div>)}
                  <Link to="/messages?tab=club" className="block">
                    <div className="text-xs text-primary hover:underline">View All Officer Notes</div>
                  </Link>
                </div>
              </div>
              <DropdownMenuSeparator />
              
              {/* Club Inbox Section */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Club Inbox</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-trophy-gold/10 rounded flex items-center justify-center">
                      <Users className="w-3 h-3 text-trophy-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">ABN-12 Monthly Newsletter</p>
                      <p className="text-xs text-muted-foreground">Sept 25</p>
                    </div>
                  </div>
                  <Link to="/messages?tab=club" className="block">
                    <div className="text-xs text-primary hover:underline">Open Club Inbox</div>
                  </Link>
                </div>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-center text-sm text-primary cursor-pointer">
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/20"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-white/15"></div>
        </div>

        <div className="relative z-10">
          {/* User greeting */}
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <UniversalAvatar name={mockUser.name} photoUrl="/placeholder.svg" club={{
              id: "alabama-bass-nation",
              abbreviation: "ABN-12"
            }} role="2019 AOY Champion" city="Huntsville, AL" anglerId="jake-patterson" size="hero" isAOYChampion={true} className="border-2 border-white/30" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.href = '/profile'}>
                Welcome back, {mockUser.name.split(' ')[0]}!
              </h2>
              <p className="text-sm opacity-90 mb-1">{mockUser.title}</p>
              
              {/* Compact Achievements Strip */}
              <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.location.href = '/profile'}>
                <Badge className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-white/30 text-[10px]">
                  🏆 {mockCareerStats.wins}
                </Badge>
                <Badge className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-white/30 text-[10px]">
                  ⭐ {mockCareerStats.top10}
                </Badge>
                <Badge className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-white/30 text-[10px]">
                  🥇 {mockCareerStats.aoyTitles}
                </Badge>
                <Badge className="text-xs px-1.5 py-0.5 bg-white/20 text-white border-white/30 text-[10px]">
                  🎣 {mockCareerStats.personalBest}
                </Badge>
              </div>
            </div>
          </div>

          {/* Main tagline */}
          <div className="text-center mb-6">
            <motion.h1 className="text-3xl md:text-4xl font-bold mb-2" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }}>
              Where Every Cast Counts
            </motion.h1>
            <motion.p className="text-lg opacity-90 mb-6" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              AI-powered tournament fishing companion
            </motion.p>
            
          {/* Main CTA */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
             <Link to="/ai-coach">
               <Button size="lg" className="bg-water-blue hover:bg-water-blue-dark text-white font-bold px-8 py-3 shadow-trophy">
                 <Brain className="w-5 h-5 mr-2" />
                 Start AI Coaching Session
                 <ArrowRight className="w-5 h-5 ml-2" />
               </Button>
             </Link>
          </motion.div>
          </div>
        </div>
      </div>

        {/* Performance Dashboard */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Your Dashboard
            </h3>
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="w-32">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <img src={currentClub.logo} alt={currentClub.name} className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-bold text-sm">{currentClub.abbreviation}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {userClubs.map(club => <SelectItem key={club.id} value={club.id}>
                    <div className="flex items-center gap-2">
                      <img src={club.logo} alt={club.name} className="w-5 h-5 rounded-full object-cover" />
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-sm">{club.abbreviation}</span>
                        <span className="text-xs text-muted-foreground">{club.name.split(' – ')[0]}</span>
                      </div>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Link to="/catches-this-month" aria-label="Open Catches This Month">
              <Card className="bg-gradient-to-br from-fishing-green/10 to-fishing-green/20 border-fishing-green/30 cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Fish className="w-5 h-5 text-fishing-green" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-fishing-green mb-1">{demoStats.catchesThisMonth}</p>
                    <p className="text-sm text-muted-foreground mb-2">Catches This Month</p>
                    <Badge variant="secondary" className="text-xs text-fishing-green bg-fishing-green/10 border-fishing-green/20">
                      +5 from last month
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/plans" aria-label="Open Plans">
              <Card className="bg-gradient-to-br from-trophy-gold/10 to-trophy-gold/20 border-trophy-gold/30 cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Target className="w-5 h-5 text-trophy-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-trophy-gold mb-1">3</p>
                    <p className="text-sm text-muted-foreground mb-2">Active Plans</p>
                    <p className="text-xs text-muted-foreground">Next: Lake Guntersville — Sept 28</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/tournaments" aria-label="Open Tournaments">
              <Card className="bg-gradient-to-br from-water-blue/10 to-water-blue/20 border-water-blue/30 cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Trophy className="w-5 h-5 text-water-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-water-blue mb-1">{demoStats.upcomingTournaments}</p>
                    <p className="text-sm text-muted-foreground mb-2">Tournaments</p>
                    <Badge variant="secondary" className="text-xs text-water-blue bg-water-blue/10 border-water-blue/20">
                      3 Upcoming
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/ai-coach" aria-label="Open AI Coach">
              <Card className="bg-gradient-to-br from-water-blue/10 to-water-blue/20 border-water-blue/30 cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Zap className="w-5 h-5 text-water-blue" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-water-blue mb-1">Synced</p>
                    <p className="text-sm text-muted-foreground mb-2">AI Readiness</p>
                    <Badge variant="secondary" className="text-xs text-water-blue bg-water-blue/10 border-water-blue/20 mb-1">
                      Weather • Moon • Pressure
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Quick Actions Toolbar */}
          <Card className="bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-between space-x-2">
                <Button 
                  className={`flex-1 h-12 flex items-center justify-center space-x-2 bg-fishing-green hover:bg-fishing-green-dark text-white transition-all rounded-full ${isVoiceListening ? 'animate-pulse shadow-lg' : ''}`} 
                  aria-label="Log Catch with Voice" 
                  onMouseDown={() => {
                    setIsVoiceListening(true);
                    toast({
                      title: "🎤 Listening...",
                      description: "Hold to speak, release when done"
                    });
                  }} 
                  onMouseUp={() => {
                    setIsVoiceListening(false);
                    toast({
                      title: "Catch logged (demo)",
                      description: "Voice logging successful"
                    });
                    setTimeout(() => {
                      window.location.href = '/catch-logging';
                    }, 1500);
                  }} 
                  onTouchStart={() => {
                    setIsVoiceListening(true);
                    toast({
                      title: "🎤 Listening...",
                      description: "Hold to speak, release when done"
                    });
                  }} 
                  onTouchEnd={() => {
                    setIsVoiceListening(false);
                    toast({
                      title: "Catch logged (demo)",
                      description: "Voice logging successful"
                    });
                    setTimeout(() => {
                      window.location.href = '/catch-logging';
                    }, 1500);
                  }}
                >
                  <Mic className="w-4 h-4" />
                  <span className="text-sm font-medium">Log Catch</span>
                </Button>
                
                <div className="w-px h-8 bg-border"></div>
                
                <Link to="/leaderboard" className="flex-1">
                  <Button className="w-full h-12 flex items-center justify-center space-x-2 bg-trophy-gold hover:bg-trophy-gold-dark text-white rounded-full" aria-label="View Leaderboard">
                    <Trophy className="w-4 h-4" />
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-medium">Leaderboard</span>
                      <span className="text-xs opacity-75">Guntersville</span>
                    </div>
                  </Button>
                </Link>
                
                <div className="w-px h-8 bg-border"></div>
                
                <Link to="/ai-coach" className="flex-1">
                  <Button className="w-full h-12 flex items-center justify-center space-x-2 bg-water-blue hover:bg-water-blue-dark text-white rounded-full" aria-label="Start AI Coach">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Coach</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="px-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-primary" />
                Recent Activity
              </div>
              <Link to="/club-feed">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Top Unresolved Officer Note as Alert */}
            {mockOfficerNotes.filter(note => note.status === 'UNRESOLVED').slice(0, 1).map(note => <motion.div key={`alert-${note.id}`} whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }} className="cursor-pointer" onClick={() => window.location.href = '/messages?tab=club'}>
                <div className="flex items-start space-x-3 p-3 bg-orange-50/50 border border-orange-200 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">{note.title}</h3>
                      <Badge className="text-xs text-orange-600 border-orange-500/20 bg-slate-100">
                        Officer Note
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{note.contextLine}</p>
                    {note.target && <p className="text-xs text-orange-600 mt-1">
                        {note.target.current}/{note.target.needed} {note.target.type} needed
                      </p>}
                  </div>
                  
                </div>
              </motion.div>)}
            
            {/* Newsletter Item */}
            <div className="flex items-start space-x-3 p-2 bg-accent rounded-lg cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = '/messages/club/club-1'}>
              <UniversalAvatar name="ABN-12 Officers" photoUrl={alabamaBassLogo} club={{
                id: "alabama-bass-nation",
                abbreviation: "ABN-12"
              }} role="Monthly Newsletter" size="row" clickable={false} showMicroCopy={false} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-sm">📩 Club Newsletter</h4>
                  <Badge className="bg-water-blue/10 text-water-blue text-xs">
                    New
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  ABN-12 September Update • 2 days ago
                </p>
              </div>
            </div>

            {enhancedClubFeed.slice(0, 2).map(post => <div key={post.id} className="flex items-start space-x-3 p-2 bg-accent rounded-lg">
                <UniversalAvatar name={post.angler} photoUrl={post.photo} club={{
                id: post.clubId || "alabama-bass-nation",
                abbreviation: post.clubId === "river-valley" ? "RVIBC" : post.clubId === "trophy-cast" ? "TCES" : "ABN-12"
              }} role="Angler" city={post.location || "Huntsville, AL"} anglerId={post.anglerId} size="row" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm cursor-pointer hover:text-primary transition-colors" onClick={() => {
                    const targetRoute = post.anglerId ? `/anglers/${post.anglerId}` : '/profile';
                    window.location.href = targetRoute;
                  }}>
                      {post.angler}
                    </h4>
                    <Badge className="bg-trophy-gold/10 text-trophy-gold text-xs px-1 py-0">
                      {post.clubId === "river-valley" ? "RVIBC" : post.clubId === "trophy-cast" ? "TCES" : "ABN-12"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {post.tournament} • {post.weight} • {post.timeAgo}
                  </p>
                </div>
                {post.anglerId && <Button variant="ghost" size="icon" className="w-6 h-6 text-muted-foreground hover:text-primary" onClick={e => {
                e.stopPropagation();
                window.location.href = `/messages/new?to=${post.anglerId}`;
              }} aria-label={`Message ${post.angler}`}>
                    <MessageSquare className="w-3 h-3" />
                  </Button>}
              </div>)}
          </CardContent>
        </Card>
        </div>

        {/* Followed Anglers */}
        <div className="px-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Followed Anglers
                </div>
                <Button variant="outline" size="sm" onClick={() => toast({
              title: "Demo only",
              description: "Full angler directory coming soon"
            })}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {followedAnglers.map(angler => <div key={angler.id} className="flex-shrink-0 snap-start">
                    <div className="bg-card border border-border rounded-lg p-3 w-32 cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = `/anglers/${angler.id}`} onContextMenu={e => {
                e.preventDefault();
                handleAnglerLongPress(angler);
              }} onTouchStart={e => {
                const touch = e.touches[0];
                const longPressTimer = setTimeout(() => {
                  handleAnglerLongPress(angler);
                }, 500);
                const clearTimer = () => {
                  clearTimeout(longPressTimer);
                  document.removeEventListener('touchend', clearTimer);
                  document.removeEventListener('touchmove', clearTimer);
                };
                document.addEventListener('touchend', clearTimer);
                document.addEventListener('touchmove', clearTimer);
              }} aria-label={`Open ${angler.name} profile`}>
                      <div className="flex flex-col items-center space-y-2">
                        <UniversalAvatar name={angler.name} photoUrl={angler.avatar} club={{
                    id: "alabama-bass-nation",
                    abbreviation: "ABN-12"
                  }} role="Angler" city="Huntsville, AL" anglerId={angler.id} size="card" clickable={false} />
                        <h4 className="font-semibold text-sm text-center truncate w-full">
                          {angler.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 justify-center">
                          <Badge className="bg-trophy-gold/10 text-trophy-gold text-xs px-1 py-0">
                            🏆 {angler.wins}
                          </Badge>
                          <Badge className="bg-fishing-green/10 text-fishing-green text-xs px-1 py-0">
                            ⭐ {angler.top10}
                          </Badge>
                        </div>
                        <Badge className="bg-water-blue/10 text-water-blue text-xs px-1 py-0">
                          🎣 {angler.pbWeight}
                        </Badge>
                      </div>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Tournament Preview */}
        <div className="px-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Next Tournament
            </CardTitle>
          </CardHeader>
          <CardContent>
            {enhancedMockTournaments.slice(0, 1).map(tournament => <div key={tournament.id} className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{tournament.name}</h3>
                    <p className="text-sm text-muted-foreground">{tournament.club}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <span>{tournament.date} • {tournament.time}</span>
                      <Badge variant="outline">{tournament.fee}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {tournament.confidence && <Badge className="bg-fishing-green/10 text-fishing-green border-fishing-green/20">
                        {tournament.confidence}% confidence
                      </Badge>}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link to={`/tournament/${tournament.id}`} className="flex-1">
                    <Button className="w-full" variant="outline">
                      View Details
                    </Button>
                  </Link>
                  {tournament.hasPlan ? <Link to="/ai-coach/tournament-plan" className="flex-1">
                      <Button className="w-full bg-fishing-green hover:bg-fishing-green-dark text-white">
                        <Target className="w-4 h-4 mr-2" />
                        View Plan
                      </Button>
                    </Link> : <Link to="/ai-coach/pre-trip" className="flex-1">
                      <Button className="w-full bg-water-blue hover:bg-water-blue-dark text-white">
                        <Brain className="w-4 h-4 mr-2" />
                        Build Plan
                      </Button>
                    </Link>}
                </div>
              </div>)}
          </CardContent>
        </Card>
      </div>


      {/* Always-visible Floating Mic Button */}
      <FloatingMicButton />
    </div>
  );
};
export default Homepage;