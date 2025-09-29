import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft,
  Mic,
  Send,
  Info,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const MessageThread = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [showTranscript, setShowTranscript] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout>();

  // Empty state for demo cleanup
  const thread = null;
  const threadMessages: any[] = [];
  const quickReplies: string[] = [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  if (!thread) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <h2 className="text-lg font-medium mb-2">No messages yet</h2>
          <p className="text-sm text-muted-foreground mb-4">Start a conversation to see messages here.</p>
          <Button onClick={() => navigate('/messages')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Messages
          </Button>
        </div>
      </div>
    );
  }

  const getCommonGroundChips = (commonGround: any) => {
    const chips = [];
    
    if (commonGround.clubs.length > 0) {
      chips.push({
        label: `Same Club`,
        detail: commonGround.clubs[0].replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        color: "bg-trophy-gold/10 text-trophy-gold"
      });
    }
    
    if (commonGround.cityMatch) {
      chips.push({
        label: "City Match",
        detail: "Both in Birmingham area", 
        color: "bg-water-blue/10 text-water-blue"
      });
    }
    
    if (commonGround.sharedLakes.length > 0 && chips.length < 2) {
      chips.push({
        label: "Shared Lake",
        detail: commonGround.sharedLakes.join(", "),
        color: "bg-fishing-green/10 text-fishing-green"
      });
    }
    
    return chips.slice(0, 2);
  };

  const commonGroundChips = getCommonGroundChips(thread.commonGround);

  const handleMicPress = () => {
    setIsRecording(true);
    toast({
      title: "🎤 Listening...",
      description: "Hold to speak, release when done"
    });

    // Simulate voice recording with timeout
    recordingTimeoutRef.current = setTimeout(() => {
      setIsRecording(false);
      setTranscribedText("Hey, great catch at Guntersville! Want to fish together next week?");
      setShowTranscript(true);
    }, 2000);
  };

  const handleMicRelease = () => {
    setIsRecording(false);
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
    }
    
    // Mock transcription
    setTranscribedText("Hey, great catch at Guntersville! Want to fish together next week?");
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

  const showCommonGroundDetails = (chip: any) => {
    toast({
      title: chip.label,
      description: chip.detail
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-4 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/messages')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Avatar className="w-10 h-10 border-2 border-white/30">
            <AvatarImage src={thread.avatar} />
            <AvatarFallback className="bg-white text-primary font-bold">
              {thread.initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-lg font-bold">{thread.name}</h1>
            
            {/* Common Ground Chips */}
            {commonGroundChips.length > 0 && (
              <div className="flex gap-1 mt-1">
                {commonGroundChips.map((chip, index) => (
                  <Badge
                    key={index}
                    className={`text-xs px-2 py-0 ${chip.color} cursor-pointer`}
                    onClick={() => showCommonGroundDetails(chip)}
                  >
                    {chip.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => toast({
              title: "Demo only",
              description: "Thread info coming soon"
            })}
          >
            <Info className="w-5 h-5" />
          </Button>
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
      <div className="px-4 py-2 flex-shrink-0">
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
            className="px-4 py-2 flex-shrink-0"
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
      <div className="px-4 py-4 bg-background border-t flex-shrink-0">
        <div className="flex items-end space-x-2">
          {/* Voice Button (Primary) */}
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
          
          {/* Text Input (Secondary) */}
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
};

export default MessageThread;