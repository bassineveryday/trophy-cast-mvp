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
  Star,
  Crown,
  PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { mockMessageThreads, mockClubInbox } from "@/data/mockMessages";
import OfficerNotesSection from "@/components/OfficerNotesSection";
import { useToast } from "@/hooks/use-toast";
import { useDemoAwareRoles } from '@/hooks/useDemoRoles';
import UniversalAvatar from '@/components/UniversalAvatar';

const MessagesInbox = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'chats';
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { isDemoMode, currentDemoUser, isClubOfficer } = useDemoAwareRoles();

  const filteredThreads = mockMessageThreads.filter(thread =>
    thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {/* New Message Button */}
            <div className="flex justify-end mb-4">
              <Link to="/messages/new">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </Link>
            </div>
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
              {filteredThreads.map((thread) => {
                const commonGroundChips = getCommonGroundChips(thread.commonGround);
                
                return (
                  <Link key={thread.threadId} to={`/messages/${thread.threadId}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={thread.avatar} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                  {thread.initials}
                                </AvatarFallback>
                              </Avatar>
                              {thread.unread && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className={`font-medium truncate ${thread.unread ? 'text-foreground' : 'text-foreground'}`}>
                                  {thread.name}
                                </h3>
                                <span className="text-xs text-muted-foreground">
                                  {thread.timestamp}
                                </span>
                              </div>
                              
                              {/* Common Ground Chips */}
                              {commonGroundChips.length > 0 && (
                                <div className="flex gap-1 mb-2">
                                  {commonGroundChips.map((chip, index) => (
                                    <Badge
                                      key={index}
                                      className={`text-xs px-2 py-0 ${chip.color}`}
                                    >
                                      {chip.label}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              <p className={`text-sm truncate ${thread.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {thread.lastMessage}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                );
              })}
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
            {/* Officer Section */}
            {isClubOfficer && (
              <Card className="border-orange-500/50 bg-orange-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Crown className="w-5 h-5 text-orange-500" />
                    Officer Communications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send announcements and manage club communications
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Draft Announcement
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      Member Directory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Officer Notes Section */}
            <OfficerNotesSection clubId="alabama-bass-nation-12" />
            
            {/* Club Inbox Items */}
            <div className="space-y-3">
              {mockClubInbox.map((item) => (
                <Link key={item.id} to={`/messages/club/${item.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-trophy-gold/10 rounded-lg flex items-center justify-center">
                            {getClubTypeIcon(item.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium truncate">
                                {item.title}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                {item.date}
                              </span>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">
                              {item.club}
                            </p>
                            
                            <p className="text-sm text-muted-foreground truncate">
                              {item.preview}
                            </p>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MessagesInbox;