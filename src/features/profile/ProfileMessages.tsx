import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  MessageSquare,
  Send,
  Mic,
  AlertTriangle,
  ArrowLeft,
  Building2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ProfileMessagesProps {
  anglerId?: string;
}

const ProfileMessages = ({ anglerId }: ProfileMessagesProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();

  // Empty state for demo cleanup
  const anglerData = null;
  const clubInboxMessages: any[] = [];
  const anglerThreads: any[] = [];
  const selectedThreadData = null;
  const threadMessages: any[] = [];
  const quickReplies: string[] = [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const handleMicPress = () => {
    setIsRecording(true);
    toast({
      title: "🎤 Listening...",
      description: "Hold to speak, release when done"
    });

    recordingTimeoutRef.current = setTimeout(() => {
      setIsRecording(false);
      setTranscribedText("Thanks for the tip! I'll try that spot next time.");
      setShowTranscript(true);
    }, 2000);
  };

  const handleMicRelease = () => {
    setIsRecording(false);
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    
    setTranscribedText("Thanks for the tip! I'll try that spot next time.");
    setShowTranscript(true);
  };

  const handleSendVoiceMessage = () => {
    if (transcribedText.trim()) {
      toast({
        title: "Message sent!",
        description: "Voice message delivered"
      });
      setTranscribedText("");
      setShowTranscript(false);
    }
  };

  const handleSendTextMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message sent!",
        description: "Text message delivered"
      });
      setMessage("");
    }
  };

  const handleQuickReply = (reply: string) => {
    toast({
      title: "Message sent!",
      description: `"${reply}" delivered`
    });
  };

  if (selectedThread && selectedThreadData) {
    return (
      <div className="min-h-[600px] flex flex-col">
        {/* Thread Header */}
        <div className="bg-gradient-hero text-white px-4 py-4 rounded-t-lg flex-shrink-0">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setSelectedThread(null)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <Avatar className="w-10 h-10 border-2 border-white/30">
              <AvatarImage src={selectedThreadData.avatar} />
              <AvatarFallback className="bg-white text-primary font-bold">
                {selectedThreadData.initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-lg font-bold">{selectedThreadData.name}</h2>
              {selectedThreadData.commonGround.clubs.length > 0 && (
                <Badge className="text-xs px-2 py-0 bg-trophy-gold/20 text-white">
                  Same Club
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="px-4 py-2 bg-muted/50 flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <AlertTriangle className="w-3 h-3" />
            <span>Be respectful. Report abuse (demo).</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-background rounded-b-lg">
          {threadMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-1`}>
                <div
                  className={`p-3 rounded-2xl ${
                    msg.isOwn 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className={`text-xs text-muted-foreground ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp} {msg.isOwn && `• ${msg.status}`}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 flex-shrink-0 bg-background">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.slice(0, 3).map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="whitespace-nowrap text-xs"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Transcript Preview */}
        <AnimatePresence>
          {showTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="px-4 py-2 flex-shrink-0 bg-background"
            >
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Voice message:</p>
                      <p className="text-sm">{transcribedText}</p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button size="sm" onClick={() => setShowTranscript(false)} variant="outline">
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSendVoiceMessage}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Composer */}
        <div className="px-4 py-4 bg-background border-t flex-shrink-0 rounded-b-lg">
          <div className="flex items-end space-x-2">
            {/* Voice Button */}
            <Button
              size="lg"
              className={`w-12 h-12 rounded-full bg-water-blue hover:bg-water-blue-dark text-white transition-all ${
                isRecording ? 'animate-pulse scale-110' : ''
              }`}
              onMouseDown={handleMicPress}
              onMouseUp={handleMicRelease}
              onTouchStart={handleMicPress}
              onTouchEnd={handleMicRelease}
            >
              <Mic className="w-6 h-6" />
            </Button>
            
            {/* Text Input */}
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendTextMessage();
                  }
                }}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendTextMessage}
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {isRecording && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              🎤 Listening... Release to send
            </p>
          )}
        </div>
      </div>
    );
  }

  // Thread List View
  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="club-inbox" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Club Inbox
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                Personal Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Recent Message Thread Preview */}
              {anglerThreads.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2 text-muted-foreground">Most Recent</h3>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-all"
                    onClick={() => setSelectedThread(anglerThreads[0].threadId)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={anglerThreads[0].avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                          {anglerThreads[0].initials}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{anglerThreads[0].name}</h4>
                          <span className="text-xs text-muted-foreground">{anglerThreads[0].timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {anglerThreads[0].lastMessage}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Quick Send Message */}
              <div className="mb-4">  
                <Button 
                  className="w-full"
                  onClick={() => navigate('/messages/new')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send New Message
                </Button>
              </div>

              {anglerThreads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Start conversations with fellow anglers!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {anglerThreads.map((thread) => (
                    <motion.div
                      key={thread.threadId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                        thread.unread ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedThread(thread.threadId)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={thread.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                            {thread.initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium text-sm ${thread.unread ? 'font-bold' : ''}`}>
                              {thread.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
                              {thread.unread && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm text-muted-foreground truncate ${thread.unread ? 'font-medium' : ''}`}>
                            {thread.lastMessage}
                          </p>
                          
                          {/* Common Ground Indicators */}
                          {(thread.commonGround.clubs.length > 0 || thread.commonGround.cityMatch || thread.commonGround.sharedLakes.length > 0) && (
                            <div className="flex gap-1 mt-2">
                              {thread.commonGround.clubs.length > 0 && (
                                <Badge className="bg-trophy-gold/10 text-trophy-gold text-xs px-1 py-0">
                                  Same Club
                                </Badge>
                              )}
                              {thread.commonGround.cityMatch && (
                                <Badge className="bg-water-blue/10 text-water-blue text-xs px-1 py-0">
                                  Same City
                                </Badge>
                              )}
                              {thread.commonGround.sharedLakes.length > 0 && (
                                <Badge className="bg-fishing-green/10 text-fishing-green text-xs px-1 py-0">
                                  Shared Lakes
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/messages/new')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start New Conversation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="club-inbox" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-primary" />
                Club Inbox
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clubInboxMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No club messages yet</p>
                  <p className="text-xs">Club announcements and updates will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clubInboxMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${
                        !message.isRead ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 hover:bg-muted/50'
                      }`}
                      onClick={() => toast({
                        title: message.subject,
                        description: "Club message details coming soon (demo)"
                      })}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-accent/40 flex-shrink-0">
                          <img 
                            src={message.fromLogo} 
                            alt={`${message.from} logo`}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-medium text-sm ${!message.isRead ? 'font-bold' : ''}`}>
                                {message.from}
                              </h4>
                              <Badge className="bg-club-blue/10 text-club-blue text-xs px-1 py-0">
                                Club
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">{message.date}</span>
                              {!message.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <h5 className={`text-sm font-medium mb-1 ${!message.isRead ? 'font-bold' : ''}`}>
                            {message.subject}
                          </h5>
                          
                          <p className={`text-sm text-muted-foreground truncate ${!message.isRead ? 'font-medium' : ''}`}>
                            {message.preview}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => toast({
                    title: "Club Settings",
                    description: "Club notification preferences coming soon (demo)"
                  })}
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Manage Club Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileMessages;