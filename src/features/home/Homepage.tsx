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
import { useAuth } from "@/contexts/AuthContext";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AIStatusBar from "@/components/AIStatusBar";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";
import UniversalAvatar from "@/components/UniversalAvatar";
import { BottomNavigation } from "@/components/BottomNavigation";
import DemoSwitcher from "@/components/DemoSwitcher";
import bassTrophyLogo from "@/assets/bass-trophy-logo.png";

const Homepage = () => {
  const DEMO_PROFILES = { 
    jake: { 
      displayName: "Jake Wilson", 
      clubs: [
        { id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Member" }, 
        { id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Member" }
      ], 
      adminButtons: [],
      upcomingTournaments: [
        { name: "Fall Classic", location: "Lake Guntersville", date: "Oct 15, 2025" },
        { name: "Tennessee Valley Open", location: "Pickwick Lake", date: "Oct 22, 2025" }
      ],
      recentCatches: [
        { species: "Largemouth Bass", weight: "4.2 lbs", location: "Lake Guntersville", date: "Oct 1" },
        { species: "Smallmouth Bass", weight: "3.1 lbs", location: "Pickwick Lake", date: "Sept 28" },
        { species: "Spotted Bass", weight: "2.8 lbs", location: "Lake Guntersville", date: "Sept 25" }
      ]
    }, 
    president: { 
      displayName: "Mike Johnson", 
      clubs: [
        { id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "President" }
      ], 
      adminButtons: [
        { label: "Board of Directors", to: "/admin/board-of-directors", icon: Building2 }, 
        { label: "Manage Club", to: "/clubs/alabama-bass-chapter-12/manage", icon: Building2 }
      ],
      upcomingTournaments: [
        { name: "Alabama State Championship", location: "Lake Guntersville", date: "Oct 10, 2025" },
        { name: "President's Cup", location: "Lake Martin", date: "Oct 18, 2025" },
        { name: "Fall Classic", location: "Lake Guntersville", date: "Oct 15, 2025" }
      ],
      recentCatches: [
        { species: "Largemouth Bass", weight: "6.8 lbs", location: "Lake Martin", date: "Oct 2" },
        { species: "Largemouth Bass", weight: "5.4 lbs", location: "Lake Guntersville", date: "Sept 30" },
        { species: "Spotted Bass", weight: "4.1 lbs", location: "Lake Martin", date: "Sept 27" },
        { species: "Smallmouth Bass", weight: "3.9 lbs", location: "Pickwick Lake", date: "Sept 24" },
        { species: "Largemouth Bass", weight: "5.2 lbs", location: "Lake Guntersville", date: "Sept 20" }
      ]
    } 
  };
  
  const { user, loading } = useAuth();
  const { role } = useDemoMode();
  const activeProfile = role !== "off" ? DEMO_PROFILES[role as keyof typeof DEMO_PROFILES] : null;

  const ozToLbOz = (oz: number) => {
    const lb = Math.floor(oz / 16);
    const rem = oz % 16;
    return lb > 0 ? `${lb} lb ${rem} oz` : `${oz} oz`;
  };

  const greetName = (role !== "off" && activeProfile) ? activeProfile.displayName : (user?.user_metadata?.display_name || user?.email?.split('@')[0] || "angler");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const { toast } = useToast();

  const handleAnglerLongPress = (angler: any) => {
    toast({
      title: "Coming Soon",
      description: "Angler interactions coming soon"
    });
  };

  const toggleDropdown = (cardId: string) => {
    setOpenDropdown(openDropdown === cardId ? null : cardId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative bg-gradient-hero text-white px-4 py-16 overflow-hidden">
          <div className="flex items-center justify-center mb-8">
            <img src={bassTrophyLogo} alt="TrophyCast Logo" className="w-16 h-16 object-contain mr-3" />
            <div className="text-trophy-gold font-bold text-2xl tracking-wide">TrophyCast</div>
          </div>
          <div className="text-center max-w-md mx-auto">
            <motion.h1 className="text-4xl font-bold mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Welcome to TrophyCast</motion.h1>
            <motion.p className="text-lg opacity-90 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>AI-powered tournament fishing companion for serious anglers</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Link to="/auth"><Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3">Get Started</Button></Link>
            </motion.div>
          </div>
        </div>
        <div className="px-4 py-12">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Join the Competition</h2>
              <p className="text-muted-foreground">Track catches, plan tournaments, and compete with the best</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-fishing-green/20 rounded-full flex items-center justify-center"><Fish className="w-5 h-5 text-fishing-green" /></div>
                  <div><h3 className="font-semibold">Track Your Catches</h3><p className="text-sm text-muted-foreground">Log every bass with photos and details</p></div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-trophy-gold/20 rounded-full flex items-center justify-center"><Trophy className="w-5 h-5 text-trophy-gold" /></div>
                  <div><h3 className="font-semibold">Tournament Ready</h3><p className="text-sm text-muted-foreground">AI-powered tournament planning and strategy</p></div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-water-blue/20 rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-water-blue" /></div>
                  <div><h3 className="font-semibold">Join Your Club</h3><p className="text-sm text-muted-foreground">Connect with fellow anglers and compete</p></div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>{isRefreshing && <LoadingSpinner message="Refreshing..." />}</AnimatePresence>
      <AIStatusBar />
      <div className="bg-background border-b border-border h-12 flex items-center justify-end px-4"><DemoSwitcher /></div>
      <div className="relative bg-gradient-hero text-white px-4 py-6 overflow-hidden">
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center space-x-2">
            <img src={bassTrophyLogo} alt="TrophyCast Logo" className="w-10 h-10 object-contain" />
            <div className="text-trophy-gold font-bold text-base tracking-wide">TrophyCast</div>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10 -mr-8 -mt-4"><img src={bassTrophyLogo} alt="" className="w-32 h-32 object-contain transform rotate-12" /></div>
        <div className="absolute top-4 right-4 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="text-white hover:bg-white/20 relative"><Bell className="w-5 h-5" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
              <div className="p-2 font-semibold text-sm border-b">Recent Notifications</div>
              <div className="p-8 text-center text-muted-foreground"><Bell className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No notifications yet</p></div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="relative z-10 pt-12">
          <div className="text-center mb-4"><h2 className="text-xl font-bold mb-1">Welcome back, {greetName}!</h2><p className="text-sm opacity-90">Ready to fish?</p></div>
          <div className="text-center">
            <motion.h1 className="text-2xl font-bold mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Where Every Cast Counts</motion.h1>
            <motion.p className="text-sm opacity-90" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>AI-powered tournament fishing companion</motion.p>
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Your Dashboard</h3></div>
        <div className="grid grid-cols-2 gap-3 relative">
          <div className="relative">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={() => toggleDropdown('catches')}>
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center"><Fish className="w-4 h-4 text-emerald-600" /></div>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${openDropdown === 'catches' ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-emerald-700 mb-1">{activeProfile?.recentCatches?.length || 0}</p>
                  <p className="text-sm text-gray-600 mb-2">Recent Catches</p>
                  {activeProfile?.recentCatches?.length ? (
                    <div className="text-xs bg-emerald-200 text-emerald-700 px-2 py-1 rounded-full inline-block">View details</div>
                  ) : (
                    <div className="text-xs bg-emerald-200 text-emerald-700 px-2 py-1 rounded-full inline-block">No catches yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
            {openDropdown === 'catches' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-2">
                  {activeProfile?.recentCatches?.length ? (
                    <>
                      {activeProfile.recentCatches.map((catchData, idx) => (
                        <div key={idx} className="text-xs py-2 px-3 hover:bg-emerald-50 rounded mb-1">
                          <div className="font-semibold text-emerald-700">{catchData.species} - {catchData.weight}</div>
                          <div className="text-gray-500">{catchData.location} • {catchData.date}</div>
                        </div>
                      ))}
                      <Link to="/my-catches" className="block mt-1"><div className="text-xs text-emerald-600 py-2 px-3 hover:bg-emerald-50 rounded cursor-pointer text-center font-semibold">View All Catches</div></Link>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-500 py-2 px-3 text-center">No catches logged yet</div>
                      <Link to="/catch-logging" className="block"><div className="text-xs text-emerald-600 py-2 px-3 hover:bg-emerald-50 rounded cursor-pointer text-center">Log Your First Catch</div></Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={() => toggleDropdown('plans')}>
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center"><Target className="w-4 h-4 text-amber-600" /></div>
                  <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform ${openDropdown === 'plans' ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-amber-700 mb-1">0</p>
                  <p className="text-sm text-gray-600 mb-2">Active Plans</p>
                  <p className="text-xs text-gray-500">No active plans yet</p>
                </div>
              </CardContent>
            </Card>
            {openDropdown === 'plans' && (<div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"><div className="p-2"><div className="text-xs text-gray-500 py-2 px-3 text-center">No plans created yet</div><Link to="/plans" className="block"><div className="text-xs text-amber-600 py-2 px-3 hover:bg-amber-50 rounded cursor-pointer text-center">Create Your First Plan</div></Link></div></div>)}
          </div>
          <div className="relative">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={() => toggleDropdown('tournaments')}>
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><Trophy className="w-4 h-4 text-blue-600" /></div>
                  <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${openDropdown === 'tournaments' ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-blue-700 mb-1">{activeProfile?.upcomingTournaments?.length || 0}</p>
                  <p className="text-sm text-gray-600 mb-2">Upcoming Tournaments</p>
                  {activeProfile?.upcomingTournaments?.length ? (
                    <div className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full inline-block">View schedule</div>
                  ) : (
                    <div className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full inline-block">No tournaments scheduled</div>
                  )}
                </div>
              </CardContent>
            </Card>
            {openDropdown === 'tournaments' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-2">
                  {activeProfile?.upcomingTournaments?.length ? (
                    <>
                      {activeProfile.upcomingTournaments.map((tournament, idx) => (
                        <div key={idx} className="text-xs py-2 px-3 hover:bg-blue-50 rounded mb-1">
                          <div className="font-semibold text-blue-700">{tournament.name}</div>
                          <div className="text-gray-500">{tournament.location} • {tournament.date}</div>
                        </div>
                      ))}
                      <Link to="/leaderboard" className="block mt-1"><div className="text-xs text-blue-600 py-2 px-3 hover:bg-blue-50 rounded cursor-pointer text-center font-semibold">View All Tournaments</div></Link>
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-500 py-2 px-3 text-center">No tournaments scheduled yet</div>
                      <Link to="/leaderboard" className="block"><div className="text-xs text-blue-600 py-2 px-3 hover:bg-blue-50 rounded cursor-pointer text-center">Browse Tournaments</div></Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 cursor-pointer hover:shadow-lg transition-shadow h-full" onClick={() => toggleDropdown('notifications')}>
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center"><Bell className="w-4 h-4 text-teal-600" /></div>
                  <ChevronDown className={`w-4 h-4 text-teal-600 transition-transform ${openDropdown === 'notifications' ? 'rotate-180' : ''}`} />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-teal-700 mb-1">0</p>
                  <p className="text-sm text-gray-600 mb-2">Notifications</p>
                  <p className="text-xs text-gray-500">No notifications yet</p>
                </div>
              </CardContent>
            </Card>
            {openDropdown === 'notifications' && (<div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"><div className="p-2"><div className="text-xs text-gray-500 py-2 px-3 text-center">No notifications yet</div></div></div>)}
          </div>
        </div>
        <BottomNavigation />
      </div>
      <div className="px-4 mb-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center"><Users className="w-5 h-5 mr-2 text-primary" />Recent Activity</div><Link to="/club-feed"><Button variant="outline" size="sm">View All</Button></Link></CardTitle></CardHeader>
          <CardContent className="space-y-3"><div className="p-8 text-center text-muted-foreground"><Users className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No recent activity yet</p><p className="text-xs mt-1">Activity from your clubs will appear here</p></div></CardContent>
        </Card>
      </div>
      {activeProfile && activeProfile.clubs.length > 0 && (<div className="px-4 mb-6"><Card><CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center"><Users className="w-5 h-5 mr-2 text-primary" />My Clubs</div></CardTitle></CardHeader><CardContent className="space-y-3">{activeProfile.clubs.map((club) => (<div key={club.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"><div className="flex items-center justify-between"><div><h4 className="font-semibold">{club.name}</h4><p className="text-sm text-muted-foreground">{club.role}</p></div><ArrowRight className="w-5 h-5 text-muted-foreground" /></div></div>))}{activeProfile.adminButtons.length > 0 && (<div className="mt-4 pt-4 border-t space-y-2">{activeProfile.adminButtons.map((btn) => (<Link key={btn.label} to={btn.to}><Button variant="outline" className="w-full justify-start" size="sm"><btn.icon className="w-4 h-4 mr-2" />{btn.label}</Button></Link>))}</div>)}</CardContent></Card></div>)}
      <div className="px-4 mb-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><div className="flex items-center"><Users className="w-5 h-5 mr-2 text-primary" />Followed Anglers</div><Button variant="outline" size="sm" onClick={() => toast({ title: "Coming Soon", description: "Follow other anglers to see their activity" })}>Browse</Button></CardTitle></CardHeader>
          <CardContent><div className="p-8 text-center text-muted-foreground"><Users className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No followed anglers yet</p><p className="text-xs mt-1">Follow other anglers to see their catches and updates</p></div></CardContent>
        </Card>
      </div>
      <div className="px-4 mb-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary" />Next Tournament</CardTitle></CardHeader>
          <CardContent className="space-y-3"><div className="p-8 text-center text-muted-foreground"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">No tournaments scheduled yet</p><p className="text-xs mt-1">Tournament schedule will appear here</p><Link to="/leaderboard" className="block mt-4"><Button size="sm">Browse Tournaments</Button></Link></div></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Homepage;
