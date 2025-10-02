import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Shield, Brain, MessageCircle, Send, Target, Fish, Compass, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: string;
}

interface Conversation {
  id: string;
  message: string;
  response: string | null;
  created_at: string;
}

const AICoach = () => {
  const { toast } = useToast();
  const { enabled: isDemoMode } = useDemoMode();
  const [messageInput, setMessageInput] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [insights, setInsights] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Demo data
  const demoConversations: Conversation[] = [
    {
      id: "1",
      message: "What lures work best for largemouth bass in summer?",
      response: "For summer bass, try topwater early morning (poppers, frogs). Midday switch to deep diving crankbaits or Texas-rigged worms near structure. Focus on shaded areas and deeper water 10-15 feet.",
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "2",
      message: "Best time to fish?",
      response: "Dawn (5-8am) and dusk (6-9pm) are prime. Water temps are cooler and bass are actively feeding. Midday can work but target deeper, shaded spots.",
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ];

  const demoMissions: Mission[] = [
    {
      id: "1",
      title: "Catch 5 Bass This Month",
      description: "Log 5 bass catches to complete this mission",
      progress: 60,
      icon: "🎯"
    },
    {
      id: "2",
      title: "Try 3 New Lures",
      description: "Experiment with different lure types",
      progress: 33,
      icon: "🎣"
    },
    {
      id: "3",
      title: "Fish 3 Different Spots",
      description: "Explore new fishing locations",
      progress: 66,
      icon: "🧭"
    }
  ];

  const demoInsights: Conversation[] = [
    {
      id: "1",
      message: "",
      response: "Water temps are warming up. Consider switching to faster retrieves and topwater baits early morning.",
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "2",
      message: "",
      response: "Your success rate with spinnerbaits is 40% higher on cloudy days. Focus on those conditions!",
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: "3",
      message: "",
      response: "Bass are moving to pre-spawn areas. Target shallow flats near deep water access.",
      created_at: new Date(Date.now() - 259200000).toISOString()
    }
  ];

  useEffect(() => {
    if (isDemoMode) {
      setConversations(demoConversations);
      setMissions(demoMissions);
      setInsights(demoInsights);
      setIsLoading(false);
    } else {
      fetchData();
    }
  }, [isDemoMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch conversations
      const { data: convData, error: convError } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (convError) throw convError;
      setConversations(convData || []);

      // Get last 3 for insights
      const lastThree = (convData || []).slice(0, 3).filter(c => c.response);
      setInsights(lastThree);

      // Fetch missions
      const { data: missionsData, error: missionsError } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'active')
        .limit(3);

      if (missionsError) throw missionsError;
      
      const formattedMissions: Mission[] = (missionsData || []).map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        progress: m.progress || 0,
        icon: getIconForMission(m.title)
      }));
      
      setMissions(formattedMissions);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForMission = (title: string): string => {
    if (title.toLowerCase().includes('catch')) return '🎯';
    if (title.toLowerCase().includes('lure')) return '🎣';
    if (title.toLowerCase().includes('spot') || title.toLowerCase().includes('location')) return '🧭';
    return '🏆';
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    setIsSending(true);
    const userMessage = messageInput.trim();
    setMessageInput("");

    try {
      if (isDemoMode) {
        // Demo mode: generate simple response
        const demoResponse = generateDemoResponse(userMessage);
        const newConv: Conversation = {
          id: Date.now().toString(),
          message: userMessage,
          response: demoResponse,
          created_at: new Date().toISOString()
        };
        setConversations([newConv, ...conversations]);
      } else {
        // Save to database
        const { data, error } = await supabase
          .from('ai_conversations')
          .insert({
            message: userMessage,
            response: generateSimpleResponse(userMessage)
          })
          .select()
          .single();

        if (error) throw error;
        
        setConversations([data, ...conversations]);
      }

      toast({
        title: "Message sent",
        description: "AI Coach is analyzing your question",
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const generateDemoResponse = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes('lure')) return "For current conditions, try spinnerbaits or chatterbaits. They work great in murky water.";
    if (lower.includes('time') || lower.includes('when')) return "Early morning (5-8am) and evening (6-9pm) are your best times.";
    if (lower.includes('where') || lower.includes('spot')) return "Focus on rocky points and grass edges. Bass are staging near structure.";
    return "That's a great question! Based on your fishing patterns, I'd recommend experimenting with different retrieval speeds.";
  };

  const generateSimpleResponse = (message: string): string => {
    // Phase 6 will replace this with real AI API
    return generateDemoResponse(message);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-full">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">AI Coach</h1>
          </div>
          <p className="text-lg mb-2">Your fishing secrets stay yours - private AI coaching</p>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            <span className="text-white/90">AI Coach never shares your spots or techniques with other users</span>
          </div>
          <Badge variant="secondary" className="mt-3 bg-trophy-gold text-foreground">
            <Shield className="w-3 h-3 mr-1" />
            Privacy Guaranteed
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with AI Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {isLoading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : conversations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Ask me anything about fishing!
                </p>
              ) : (
                conversations.map((conv) => (
                  <div key={conv.id} className="space-y-2">
                    {/* User message */}
                    {conv.message && (
                      <div className="flex justify-end">
                        <div className="bg-water-blue text-white rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">{conv.message}</p>
                          <p className="text-xs text-white/70 mt-1">{formatDate(conv.created_at)}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* AI response */}
                    {conv.response && (
                      <div className="flex justify-start">
                        <div className="bg-fishing-green text-white rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4" />
                            <span className="text-xs font-medium">AI Coach</span>
                          </div>
                          <p className="text-sm">{conv.response}</p>
                          <p className="text-xs text-white/70 mt-1">{formatDate(conv.created_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-fishing-green/20 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-fishing-green rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-fishing-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-fishing-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      <span className="text-xs text-muted-foreground ml-2">AI Coach is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything about fishing..."
                className="flex-1 min-h-[60px]"
                disabled={isSending}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  className="bg-trophy-gold hover:bg-trophy-gold-dark text-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Missions */}
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-trophy-gold" />
            Current Missions
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {isLoading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : missions.length === 0 ? (
              <Card className="md:col-span-3">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No active missions. Start fishing to unlock new challenges!
                </CardContent>
              </Card>
            ) : (
              missions.map((mission) => (
                <Card key={mission.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">{mission.icon}</div>
                    <h3 className="font-semibold mb-1">{mission.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                    <Progress value={mission.progress} className="mb-2 h-2" />
                    <p className="text-xs text-muted-foreground">{mission.progress}% complete</p>
                    <Button
                      className="w-full mt-3 bg-fishing-green hover:bg-fishing-green-dark"
                      size="sm"
                    >
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recent Insights */}
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Compass className="w-5 h-5 text-fishing-green" />
            Recent Insights
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {isLoading ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : insights.length === 0 ? (
              <Card className="md:col-span-3">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No insights yet. Chat with AI Coach to get personalized fishing tips!
                </CardContent>
              </Card>
            ) : (
              insights.map((insight) => (
                <Card key={insight.id} className="bg-fishing-green/5 border-fishing-green/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Brain className="w-4 h-4 text-fishing-green mt-1 flex-shrink-0" />
                      <p className="text-sm">{insight.response}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(insight.created_at)}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-3 md:grid-cols-2">
          <Link to="/ai-coach/pre-trip">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Fish className="w-8 h-8 mx-auto mb-2 text-water-blue" />
                <h3 className="font-semibold mb-1">Plan Your Trip</h3>
                <p className="text-sm text-muted-foreground">Get AI-powered fishing plans</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/ai-coach/at-lake">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="p-6 text-center">
                <Compass className="w-8 h-8 mx-auto mb-2 text-fishing-green" />
                <h3 className="font-semibold mb-1">At the Lake</h3>
                <p className="text-sm text-muted-foreground">Real-time coaching & quick logging</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
