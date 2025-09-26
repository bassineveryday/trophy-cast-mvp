import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Brain, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { VoiceProvider, useVoice } from "@/contexts/VoiceContext";
import { VoiceToggle } from "@/components/voice/VoiceToggle";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";
import { parseVoiceCommand } from "@/utils/voiceCommands";

const AICoachContent = () => {
  const navigate = useNavigate();
  const { registerCommands } = useVoice();

  useEffect(() => {
    const commands = [
      {
        phrase: "Give me a quick plan",
        action: () => navigate('/ai-coach/tournament-plan')
      },
      {
        phrase: "quick plan",
        action: () => navigate('/ai-coach/tournament-plan')
      },
      {
        phrase: "build tournament plan",
        action: () => navigate('/ai-coach/tournament-plan')
      }
    ];
    
    registerCommands(commands);
  }, [navigate, registerCommands]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-4">
        <div className="flex items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2 flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-trophy-gold/20 mr-2">
              <Brain className="w-4 h-4 text-trophy-gold" />
            </div>
            AI Coach Chat
          </h1>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Voice Toggle */}
        <VoiceToggle />

        {/* Demo Notice */}
        <div className="text-center">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Demo Chat - Scripted Responses
          </Badge>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4">
          {/* AI Coach Message 1 */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-trophy-gold to-fishing-green flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-trophy-gold/10 to-fishing-green/10 border border-trophy-gold/20 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm font-medium text-trophy-gold mb-1">AI Coach</p>
              <p className="text-sm">Hey Jake! I see you've got Lake Pueblo coming up next Saturday — want to prep together?</p>
            </div>
          </div>

          {/* User Response 1 */}
          <div className="flex items-start space-x-3 justify-end">
            <div className="bg-muted border rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Yes, let's do it!</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-water-blue flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* AI Coach Message 2 */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-trophy-gold to-fishing-green flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-trophy-gold/10 to-fishing-green/10 border border-trophy-gold/20 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm font-medium text-trophy-gold mb-1">AI Coach</p>
              <p className="text-sm">Great! What's your goal this time — big bag or consistent limit?</p>
            </div>
          </div>

          {/* User Response 2 */}
          <div className="flex items-start space-x-3 justify-end">
            <div className="bg-muted border rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">I want to focus on a consistent limit this time</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-water-blue flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* AI Coach Message 3 */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-trophy-gold to-fishing-green flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-trophy-gold/10 to-fishing-green/10 border border-trophy-gold/20 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm font-medium text-trophy-gold mb-1">AI Coach</p>
              <p className="text-sm">Smart approach! Pueblo's got good numbers right now. I'm analyzing current conditions, moon phase, and your past success patterns there.</p>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex items-start space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-trophy-gold to-fishing-green flex-shrink-0">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gradient-to-r from-trophy-gold/10 to-fishing-green/10 border border-trophy-gold/20 rounded-lg p-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-trophy-gold rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-trophy-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-trophy-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs text-muted-foreground ml-2">AI Coach is analyzing...</span>
              </div>
            </div>
          </div>

          {/* AI Coach Tip */}
          <Card className="bg-fishing-green/5 border-fishing-green/20">
            <CardContent className="p-3">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-fishing-green/20 flex-shrink-0">
                  <MessageCircle className="w-3 h-3 text-fishing-green" />
                </div>
                <div>
                  <p className="text-xs font-medium text-fishing-green mb-1">AI Coach Tip</p>
                  <p className="text-xs text-muted-foreground">Spinnerbait bite is best with wind on grass edges — perfect for your consistent limit strategy!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Build Tournament Plan Button */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <Link to="/ai-coach/tournament-plan">
          <Button className="w-full h-12 bg-gradient-to-r from-trophy-gold to-fishing-green text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
            <Brain className="w-5 h-5 mr-2" />
            Build Full Tournament Plan
          </Button>
        </Link>
      </div>

      {/* Floating Mic Button */}
      <FloatingMicButton />
    </div>
  );
};

const AICoach = () => {
  return (
    <VoiceProvider>
      <AICoachContent />
    </VoiceProvider>
  );
};

export default AICoach;