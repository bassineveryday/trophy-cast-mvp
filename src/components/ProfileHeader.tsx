import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, MapPin, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserProfile } from "@/types";
import trophyCastLogo from "@/assets/trophy-cast-logo.png";
interface ProfileHeaderProps {
  user: UserProfile;
  notificationCount?: number;
}
export const ProfileHeader = ({
  user,
  notificationCount = 2
}: ProfileHeaderProps) => {
  const initials = user?.name?.trim()?.split(/\s+/)?.map(n => n[0])?.join("")?.slice(0, 2) || "AN";
  return <div className="relative min-h-[14rem] bg-gradient-hero rounded-b-2xl overflow-hidden shadow-card-custom" role="banner">
      {/* subtle overlay (kept your theme token) */}
      <div className="absolute inset-0 bg-gradient-hero opacity-80" aria-hidden />

      <div className="relative z-10 px-6 pt-4 pb-5 text-white flex flex-col h-full">
        {/* Top row: logo + tagline, notifications */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <motion.img src={trophyCastLogo} alt="Trophy Cast logo" className="w-10 h-10 shrink-0 rounded-md" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} />
            <div className="leading-tight">
              <h1 className="text-base font-bold">Trophy Cast</h1>
              <p className="text-xs opacity-90 mt-1">Where Every Cast Counts</p>
            </div>
          </div>

          <Link to="/tournament-alerts" aria-label="Open tournament alerts">
            <motion.div className="relative" whileHover={{
            scale: 1.08
          }} whileTap={{
            scale: 0.92
          }}>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" aria-label="Notifications">
                <Bell className="w-6 h-6" aria-hidden />
              </Button>
              {notificationCount > 0 && <div className="absolute -top-1 -right-1 min-w-[1.1rem] h-5 px-1 bg-destructive rounded-full flex items-center justify-center" aria-live="polite" aria-label={`${notificationCount} new notifications`}>
                  <span className="text-[10px] font-bold text-white">
                    {notificationCount}
                  </span>
                </div>}
            </motion.div>
          </Link>
        </div>

        {/* Spacer to breathe on small screens */}
        <div className="h-3" />

        {/* Profile block */}
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-trophy-gold shadow-trophy">
            <AvatarImage src="/placeholder.svg" alt={`${user.name} avatar`} />
            <AvatarFallback className="bg-trophy-gold text-foreground font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center mb-1 text-sm mx-0 my-[8px]">
              <Trophy className="w-4 h-4 text-trophy-gold mr-2" aria-hidden />
              <span className="opacity-90 font-medium truncate">{user.title}</span>
            </div>

            <h2 className="text-xl font-bold truncate">{user.name}</h2>

            <p className="text-sm opacity-90 mt-2 mx-0 my-[14px]">
              2025 State Contender – CBN
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge className="bg-trophy-gold/20 text-trophy-gold border-trophy-gold/30">
                🏅 {user.badges} Badges
              </Badge>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-1" aria-hidden />
                <span className="truncate">{user.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            View Profile
          </Button>

          <Link to="/badges">
            <Button variant="outline" size="sm" className="bg-trophy-gold/20 border-trophy-gold/40 text-trophy-gold hover:bg-trophy-gold/30">
              🏅 View Badges
            </Button>
          </Link>
        </div>
      </div>
    </div>;
};