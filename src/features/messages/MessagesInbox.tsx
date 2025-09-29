import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Users, 
  Search, 
  Plus,
  ArrowLeft,
  Calendar,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import OfficerNotesSection from "@/components/OfficerNotesSection";
import { useToast } from "@/hooks/use-toast";

const MessagesInbox = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'chats';
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Empty threads for demo cleanup
  const filteredThreads: any[] = [];

  const getCommonGroundChips = (commonGround: any) => {
    const chips = [];
    
    if (commonGround.clubs.length > 0) {
      chips.push({
        label: `Same Club: ${commonGround.clubs[0].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`,
        color: "bg-trophy-gold/10 text-trophy-gold"
      });
    }
    
    if (commonGround.cityMatch) {
      chips.push({
        label: "City Match: Birmingham",
        color: "bg-water-blue/10 text-water-blue"
      });
    }
    
    if (commonGround.sharedLakes.length > 0 && chips.length < 2) {
      chips.push({
        label: `Shared Lake: ${commonGround.sharedLakes[0]}`,
        color: "bg-fishing-green/10 text-fishing-green"
      });
    }
    
    return chips.slice(0, 2);
  };

  const getClubTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter': return <MessageSquare className="w-4 h-4" />;
      case 'announcement': return <Calendar className="w-4 h-4" />;
      case 'sponsor': return <Star className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-4">
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Button
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chats
            </TabsTrigger>
            <TabsTrigger value="club" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Club Inbox
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search anglers or messages"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Threads List */}
            <div className="space-y-3">
              {filteredThreads.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-2">Start conversations with fellow anglers to see messages here.</p>
                </div>
              )}
            </div>

            {/* New Message FAB */}
            <div className="fixed bottom-6 right-6">
              <Button
                size="lg"
                className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
                onClick={() => toast({
                  title: "Demo only",
                  description: "New message composer coming soon"
                })}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="club" className="space-y-4">
            {/* Officer Notes Section */}
            <OfficerNotesSection clubId="alabama-bass-nation-12" />
            
            {/* Club Inbox Items */}
            <div className="space-y-3">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No club messages yet</p>
                <p className="text-xs mt-2">Club announcements and newsletters will appear here.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MessagesInbox;