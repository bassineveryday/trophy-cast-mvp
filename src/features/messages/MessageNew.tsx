import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Mic } from "lucide-react";
import { mockPublicProfiles } from "@/data/enhancedMockData";
import { useToast } from "@/hooks/use-toast";

const MessageNew = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const toAnglerId = searchParams.get('to');
  const tournament = searchParams.get('tournament');
  const lake = searchParams.get('lake');
  
  const targetAngler = toAnglerId ? mockPublicProfiles[toAnglerId as keyof typeof mockPublicProfiles] : null;

  useEffect(() => {
    if (!targetAngler) {
      navigate('/messages');
      return;
    }

    // Pre-fill message based on context
    let prefilledMessage = "";
    if (tournament) {
      prefilledMessage = `Hey ${targetAngler.name.split(' ')[0]}, nice finish at ${tournament}!`;
    } else if (lake) {
      prefilledMessage = `Nice catch at ${lake}!`;
    } else {
      prefilledMessage = `Hey ${targetAngler.name.split(' ')[0]}!`;
    }
    
    setMessage(prefilledMessage);
  }, [targetAngler, tournament, lake, navigate]);

  const handleSendMessage = () => {
    if (message.trim() && targetAngler) {
      toast({
        title: "Message sent!",
        description: `Message sent to ${targetAngler.name}`
      });
      
      // Navigate to thread (would create new thread in real app)
      const threadId = `thread-${targetAngler.id}`;
      navigate(`/messages/${threadId}`);
    }
  };

  const handleMicPress = () => {
    setIsRecording(true);
    toast({
      title: "🎤 Listening...",
      description: "Hold to speak, release when done"
    });
  };

  const handleMicRelease = () => {
    setIsRecording(false);
    // Mock voice transcription
    if (targetAngler) {
      const voiceMessage = `Hey ${targetAngler.name.split(' ')[0]}, great fishing out there!`;
      setMessage(voiceMessage);
      toast({
        title: "Voice transcribed",
        description: "You can edit the message before sending"
      });
    }
  };

  if (!targetAngler) {
    return null;
  }

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
            <AvatarImage src={targetAngler.avatar} />
            <AvatarFallback className="bg-white text-primary font-bold">
              {targetAngler.initials}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-lg font-bold">New Message</h1>
            <p className="text-sm opacity-90">To: {targetAngler.name}</p>
          </div>
        </div>
      </div>

      {/* Empty message area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Start a conversation with {targetAngler.name.split(' ')[0]}</p>
          <p className="text-sm">Your message has been pre-filled based on context</p>
        </div>
      </div>

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
          
          {/* Text Input */}
          <div className="flex-1 flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {isRecording && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            🎤 Listening... Release to transcribe
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageNew;