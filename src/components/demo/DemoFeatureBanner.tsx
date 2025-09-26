// ============================================
// DEMO FEATURE BANNER - INVESTOR SHOWCASE
// ============================================
// Showcases upcoming AI features and premium capabilities

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Mic, 
  Camera, 
  TrendingUp, 
  Zap,
  Crown,
  X,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface DemoFeatureBannerProps {
  variant?: "ai-coaching" | "voice-logging" | "predictive-analytics" | "premium";
}

export const DemoFeatureBanner = ({ variant = "ai-coaching" }: DemoFeatureBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const bannerConfigs = {
    "ai-coaching": {
      title: "🧠 AI Coach Now Live!",
      subtitle: "Real-time tournament strategy powered by machine learning",
      features: ["Pattern recognition", "Weather integration", "Success predictions"],
      cta: "Try AI Coach",
      gradient: "from-trophy-gold/10 to-fishing-green/10",
      border: "border-trophy-gold/20",
      icon: Sparkles
    },
    "voice-logging": {
      title: "🎤 Voice Catch Logging",
      subtitle: "Log catches hands-free while fishing",
      features: ["Voice recognition", "Auto GPS tagging", "Smart transcription"],
      cta: "Enable Voice Mode", 
      gradient: "from-water-blue/10 to-trophy-gold/10",
      border: "border-water-blue/20",
      icon: Mic
    },
    "predictive-analytics": {
      title: "📊 Predictive Tournament Analytics",
      subtitle: "AI predicts your tournament performance",
      features: ["Success probability", "Pattern matching", "Weather correlation"],
      cta: "View Predictions",
      gradient: "from-fishing-green/10 to-water-blue/10", 
      border: "border-fishing-green/20",
      icon: TrendingUp
    },
    "premium": {
      title: "👑 Premium Features Available",
      subtitle: "Unlock advanced coaching and analytics",
      features: ["Unlimited AI sessions", "Priority support", "Advanced insights"],
      cta: "Upgrade to Premium",
      gradient: "from-trophy-gold/15 to-trophy-gold-light/15",
      border: "border-trophy-gold/30",
      icon: Crown
    }
  };

  const config = bannerConfigs[variant] || bannerConfigs["ai-coaching"];
  const IconComponent = (config?.icon) || Sparkles;

  return (
    <Card className={`mb-4 ${config.gradient} ${config.border} shadow-glow`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="bg-white/10 p-2 rounded-full mt-1">
              <IconComponent className="w-5 h-5 text-trophy-gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm mb-1">{config.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{config.subtitle}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {config.features.map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="text-[10px] px-2 py-0.5 bg-white/20 text-foreground border-white/30"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  className={`bg-trophy-gold hover:bg-trophy-gold-dark text-white font-medium text-xs px-3 py-1.5 ${
                    variant === "premium" ? "animate-pulse" : ""
                  }`}
                >
                  {config.cta}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
                
                {variant === "premium" && (
                  <Badge className="bg-success text-white text-[10px] animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    Limited Time
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto text-muted-foreground hover:text-foreground"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// DEMO NOTIFICATION POPUP
// ============================================

interface DemoNotificationProps {
  type: "ai-tip" | "sponsor-deal" | "tournament-alert" | "social";
  title: string;
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export const DemoNotification = ({ 
  type, 
  title, 
  message, 
  isVisible, 
  onDismiss, 
  actionLabel,
  onAction 
}: DemoNotificationProps) => {
  if (!isVisible) return null;

  const typeConfigs = {
    "ai-tip": { 
      icon: Sparkles, 
      color: "text-trophy-gold", 
      bg: "bg-trophy-gold/10", 
      border: "border-trophy-gold/20" 
    },
    "sponsor-deal": { 
      icon: Zap, 
      color: "text-fishing-green", 
      bg: "bg-fishing-green/10", 
      border: "border-fishing-green/20" 
    },
    "tournament-alert": { 
      icon: TrendingUp, 
      color: "text-water-blue", 
      bg: "bg-water-blue/10", 
      border: "border-water-blue/20" 
    },
    "social": { 
      icon: Camera, 
      color: "text-muted-foreground", 
      bg: "bg-accent", 
      border: "border-border" 
    }
  };

  // Fallback to default config if type not found
  const config = typeConfigs[type] || typeConfigs["ai-tip"];
  const IconComponent = config.icon;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-top-2 duration-300">
      <Card className={`${config.bg} ${config.border} shadow-lg`}>
        <CardContent className="p-3">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <IconComponent className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{message}</p>
              
              {actionLabel && onAction && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 text-xs h-6"
                  onClick={onAction}
                >
                  {actionLabel}
                </Button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-auto"
              onClick={onDismiss}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};