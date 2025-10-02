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

// Components
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AIStatusBar from "@/components/AIStatusBar";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";
import UniversalAvatar from "@/components/UniversalAvatar";
import { BottomNavigation } from "@/components/BottomNavigation";
import DemoSwitcher from "@/components/DemoSwitcher";

// Assets
import bassTrophyLogo from "@/assets/bass-trophy-logo.png";

// Demo profile data - inline to prevent auto-deletion
const DEMO_PROFILES = {
  jake: {
    displayName: "Jake Wilson",
    clubs: [
      { id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "Member" },
      { id: "tennessee-valley-anglers", name: "Tennessee Valley Anglers", role: "Member" }
    ],
    adminButtons: []
  },
  president: {
    displayName: "Mike Johnson",
    clubs: [
      { id: "alabama-bass-chapter-12", name: "Alabama Bass Chapter 12", role: "President" }
    ],
    adminButtons: [
      { label: "Board of Directors", to: "/admin/board-of-directors", icon: Building2 },
      { label: "Manage Club", to: "/clubs/alabama-bass-chapter-12/manage", icon: Building2 }
    ]
  }
};

const Homepage = () => {
  const { user, loading } = useAuth();
  const { demoMode } = useDemoMode();
  
  // Get active demo profile
  const activeProfile = demoMode !== "off" ? DEMO_PROFILES[demoMode as keyof typeof DEMO_PROFILES] : null;

  // Helper function for weight conversion
  const ozToLbOz = (oz: number) => {
    const lb = Math.floor(oz / 16);
    const rem = oz % 16;
    return lb > 0 ? `${lb} lb ${rem} oz` : `${oz} oz`;
  };

  // Dynamic greeting based on auth
  const greetName = activeProfile?.displayName || user?.user_metadata?.display_name || user?.email?.split('@')[0] || "angler";

  // State management
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const { toast } = useToast();

  const handleAnglerLongPress = (angler: any) => {
    // Quick actions placeholder 
    toast({
      title: "Coming Soon",
      description: "Angler interactions coming soon"
    });
  };

  const toggleDropdown = (cardId: string) => {
    setOpenDropdown(openDropdown === cardId ? null : cardId);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section for Unauthenticated Users */}
        <div className="relative bg-gradient-hero text-white px-4 py-16 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <img src={bassTrophyLogo} alt="TrophyCast Logo" className="w-16 h-16 object-contain mr-3" />
            <div className="text-trophy-gold font-bold text-2xl tracking-wide">TrophyCast</div>
          </div>

          <div className="text-center max-w-md mx-auto">
            <motion.h1 
              className="text-4xl font-bold mb-4" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Welcome to TrophyCast
            </motion.h1>
            <motion.p 
              className="text-lg opacity-90 mb-8" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI-powered tournament fishing companion for serious anglers
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/auth">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="px-4 py-12">
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Join the Competition</h2>
              <p className="text-muted-foreground">Track catches, plan tournaments, and compete with the best</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-fishing-green/20 rounded-full flex items-center justify-center">
                    <Fish className="w-5 h-5 text-fishing-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Track Your Catches</h3>
                    <p className="text-sm text-muted-foreground">Log every bass with photos and details</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-trophy-gold/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-trophy-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tournament Ready</h3>
                    <p className="text-sm text-muted-foreground">AI-powered tournament planning and strategy</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-water-blue/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-water-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Join Your Club</h3>
                    <p className="text-sm text-muted-foreground">Connect with fellow anglers and compete</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full dashboard for authenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {isRefreshing && <LoadingSpinner message="Refreshing..." />}
      </AnimatePresence>

      {/* AI Status Bar */}
      <AIStatusBar />

      {/* Top Bar */}
      <div className="bg-background border-b border-border h-12 flex items-center justify-end px-4">
        <DemoSwitcher inline />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-hero text-white px-4 py-6 overflow-hidden">
        {/* Logo - Top Left */}
        <div className="absolute top-4 left-4 z-20">
          <div className="flex items-center space-x-2">
            <img src={bassTrophyLogo} alt="TrophyCast Logo" className="w-10 h-10 object-contain" />
            <div className="text-trophy-gold font-bold text-base tracking-wide">TrophyCast</div>
          </div>
        </div>

        {/* Decorative Logo Background */}
        <div className="absolute top-0 right-0 opacity-10 -mr-8 -mt-4">
          <img src={bassTrophyLogo} alt="" className="w-32 h-32 object-contain transform rotate-12" />
        </div>

        {/* Notification Bell - Top Right */}
        <div className="absolute top-4 right-4 z-20">
