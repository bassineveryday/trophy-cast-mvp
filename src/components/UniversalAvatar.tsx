import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UniversalAvatarProps {
  // Core props
  name: string;
  photoUrl?: string;
  club?: {
    id: string;
    abbreviation: string;
    name?: string;
  };
  
  // Context info for micro-copy
  role?: string;
  city?: string;
  anglerId?: string;
  
  // Visual props
  size?: "row" | "card" | "hero";
  isAOYChampion?: boolean;
  className?: string;
  
  // Behavior
  clickable?: boolean;
  showMicroCopy?: boolean;
}

const UniversalAvatar = ({
  name,
  photoUrl,
  club,
  role,
  city,
  anglerId,
  size = "row",
  isAOYChampion = false,
  className,
  clickable = true,
  showMicroCopy = true
}: UniversalAvatarProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();
  
  // Generate initials from name
  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };
  
  // Get club-based background color for initials
  const getClubBackground = () => {
    if (!club) return "bg-muted";
    
    switch (club.id) {
      case "alabama-bass-nation":
        return "bg-fishing-green";
      case "river-valley":
        return "bg-trophy-gold";
      case "trophy-cast":
        return "bg-water-blue";
      default:
        return "bg-muted";
    }
  };
  
  // Size classes
  const sizeClasses = {
    row: "w-8 h-8",
    card: "w-10 h-10", 
    hero: "w-20 h-20 md:w-24 md:h-24"
  };
  
  // Border classes
  const borderClasses = cn(
    "border border-border/30",
    isAOYChampion && size === "hero" && "border-trophy-gold/40 border-2"
  );
  
  const initials = getInitials(name);
  const clubBg = getClubBackground();
  
  // Handle avatar click
  const handleClick = () => {
    if (clickable && anglerId) {
      navigate(`/anglers/${anglerId}`);
    }
  };
  
  // Micro-copy content
  const microCopyContent = (
    <div className="space-y-3">
      <div>
        <p className="font-bold text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">
          {[club?.abbreviation, role, city].filter(Boolean).join(" • ")}
        </p>
      </div>
      {anglerId && (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigate(`/anglers/${anglerId}`);
              setSheetOpen(false);
            }}
            className="flex-1"
          >
            <User className="w-3 h-3 mr-1" />
            View Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigate(`/messages/new?to=${anglerId}`);
              setSheetOpen(false);
            }}
            className="flex-1"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Message
          </Button>
        </div>
      )}
    </div>
  );
  
  const avatarElement = (
    <Avatar 
      className={cn(
        sizeClasses[size],
        borderClasses,
        clickable && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={handleClick}
    >
      <AvatarImage 
        src={photoUrl} 
        alt={`Avatar — ${name}`}
      />
      <AvatarFallback 
        className={cn(
          clubBg,
          "text-white font-bold text-center"
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
  
  if (!showMicroCopy) {
    return avatarElement;
  }
  
  return (
    <>
      {/* Desktop: Tooltip */}
      <div className="hidden md:block">
        <Tooltip>
          <TooltipTrigger asChild>
            {avatarElement}
          </TooltipTrigger>
          <TooltipContent className="p-3 max-w-xs">
            {microCopyContent}
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Mobile: Sheet on long press */}
      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <div
              onTouchStart={(e) => {
                const longPressTimer = setTimeout(() => {
                  setSheetOpen(true);
                }, 500);
                
                const clearTimer = () => {
                  clearTimeout(longPressTimer);
                  document.removeEventListener('touchend', clearTimer);
                  document.removeEventListener('touchmove', clearTimer);
                };
                
                document.addEventListener('touchend', clearTimer);
                document.addEventListener('touchmove', clearTimer);
              }}
            >
              {avatarElement}
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-4">
            {microCopyContent}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default UniversalAvatar;