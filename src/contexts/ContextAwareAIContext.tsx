import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Tournament } from "@/types";
import { mockTournaments } from "@/data/mockData";

export type AIContext = 
  | "home"
  | "calendar" 
  | "lake-detail"
  | "plans"
  | "plan-report"
  | "profile"
  | "tournament-detail"
  | "other";

interface ContextAwareAIContextType {
  context: AIContext;
  contextData: any;
  getContextPrompt: () => string;
  getContextResponse: (input: string) => {
    message: string;
    actions: Array<{ label: string; action: () => void }>;
  };
}

const ContextAwareAIContext = createContext<ContextAwareAIContextType | null>(null);

export const useContextAwareAI = () => {
  const context = useContext(ContextAwareAIContext);
  if (!context) {
    throw new Error("useContextAwareAI must be used within a ContextAwareAIProvider");
  }
  return context;
};

export const ContextAwareAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const params = useParams();
  const [context, setContext] = useState<AIContext>("other");
  const [contextData, setContextData] = useState<any>(null);

  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/") {
      setContext("home");
      setContextData({ nextTournament: mockTournaments[0] });
    } else if (path.includes("/plans")) {
      setContext("plans");
      setContextData({ tournaments: mockTournaments, nextPlan: mockTournaments[0] });
    } else if (path.includes("/tournament-plan") || path.includes("/adjusted-plan")) {
      setContext("plan-report");
      setContextData({ currentPlan: mockTournaments[0] });
    } else if (path.includes("/tournament/")) {
      setContext("tournament-detail");
      const tournamentId = params.tournamentId;
      const tournament = mockTournaments.find(t => t.id === tournamentId) || mockTournaments[0];
      setContextData({ tournament, hasHistory: Math.random() > 0.5 });
    } else if (path.includes("/calendar") || path.includes("/dashboard")) {
      setContext("calendar");
      setContextData({ tournaments: mockTournaments });
    } else if (path.includes("/profile") || path.includes("/my-catches") || path.includes("/badges")) {
      setContext("profile");
      setContextData({ totalTournaments: 15, wins: 3, topLakes: ["Lake Guntersville", "Lake Murray"] });
    } else {
      setContext("other");
      setContextData(null);
    }
  }, [location.pathname, params]);

  const getContextPrompt = (): string => {
    switch (context) {
      case "home":
        return `Need a quick check? Try: "What's my next event?" or "Give me today's lake tips."`;
      
      case "calendar":
        const focusedTournament = contextData?.tournaments?.[0];
        if (focusedTournament) {
          return `I've got ${focusedTournament.name} on ${focusedTournament.date}. Want a quick confidence read and a tip?`;
        }
        return `Which tournament interests you? I can give confidence reads and tips for any upcoming event.`;
      
      case "tournament-detail":
        const tournament = contextData?.tournament;
        if (tournament && contextData?.hasHistory) {
          return `You've fished ${tournament.name} before. Want advice factoring wind, moon, pressure + your past patterns?`;
        } else if (tournament) {
          return `Want advice for ${tournament.name} right now? I can factor wind, moon, pressure + seasonal patterns.`;
        }
        return `Tell me about this tournament and I'll give you targeted advice.`;
      
      case "plans":
        const nextPlan = contextData?.nextPlan;
        if (nextPlan) {
          return `Which plan do you want to update—Next up: ${nextPlan.name} ${nextPlan.date} or browse others?`;
        }
        return `Which plan needs attention? I can help refine any of your saved tournament plans.`;
      
      case "plan-report":
        return `Refine this plan? Say things like "bump confidence if wind shifts north" or "swap primary to chatterbait".`;
      
      case "profile":
        return `Want a career snapshot or trends? Try: "Show wins and best lakes" or "How's my spinnerbait effectiveness?"`;
      
      default:
        return `How can I help with your fishing strategy today?`;
    }
  };

  const getContextResponse = (input: string): { message: string; actions: Array<{ label: string; action: () => void }> } => {
    const confidence = Math.floor(Math.random() * 20) + 75; // 75-95%
    
    switch (context) {
      case "tournament-detail":
        return {
          message: `${confidence}% confidence. Key tip: Focus on transition areas with current wind direction. 🎣`,
          actions: [
            { label: "Build Full Plan", action: () => window.location.href = "/ai-coach/tournament-plan" },
            { label: "See Lake History", action: () => {} }
          ]
        };
      
      case "plans":
        return {
          message: `${confidence}% confidence on your next plan. Consider wind shift adjustments. ⚡`,
          actions: [
            { label: "Open Plan", action: () => window.location.href = "/ai-coach/tournament-plan" },
            { label: "Update Pattern", action: () => {} }
          ]
        };
      
      case "plan-report":
        return {
          message: `Updated to ${confidence}% confidence. Primary pattern optimized for conditions. 🔧`,
          actions: [
            { label: "Save Changes", action: () => {} },
            { label: "Test Alternative", action: () => {} }
          ]
        };
      
      case "profile":
        return {
          message: `You're 23% better on spinnerbaits this season. Guntersville = your best lake. 📊`,
          actions: [
            { label: "View Trends", action: () => {} },
            { label: "Pattern Analysis", action: () => {} }
          ]
        };
      
      default:
        return {
          message: `${confidence}% confidence. Try moving to deeper structure with current conditions. 🎯`,
          actions: [
            { label: "Build Plan", action: () => window.location.href = "/ai-coach/tournament-plan" },
            { label: "Open Plans", action: () => window.location.href = "/plans" }
          ]
        };
    }
  };

  return (
    <ContextAwareAIContext.Provider value={{
      context,
      contextData,
      getContextPrompt,
      getContextResponse
    }}>
      {children}
    </ContextAwareAIContext.Provider>
  );
};