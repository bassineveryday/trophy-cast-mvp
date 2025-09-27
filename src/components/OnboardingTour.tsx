import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Trophy, 
  Users, 
  User, 
  ArrowRight, 
  ArrowLeft, 
  X,
  CheckCircle,
  Crown,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsClubOfficer } from '@/hooks/useRoles';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({ onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { profile } = useAuth();
  const isClubOfficer = useIsClubOfficer();

  const getSteps = (): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = [
      {
        id: 'home',
        title: 'Home Dashboard',
        description: 'Your personalized command center',
        icon: Home,
        features: [
          'Quick access to upcoming tournaments',
          'Recent catches and activity',
          'Personalized recommendations',
          'Role-based quick actions'
        ],
        color: 'from-primary/10 to-primary/20'
      },
      {
        id: 'tournaments',
        title: 'Tournaments',
        description: 'Everything about fishing competitions',
        icon: Trophy,
        features: [
          'View upcoming tournaments',
          'Register for events',
          'Check results and standings',
          'Track your performance'
        ],
        color: 'from-trophy-gold/10 to-trophy-gold/20'
      },
      {
        id: 'club',
        title: 'Club Hub',
        description: isClubOfficer ? 'Manage your club and connect with members' : 'Connect with your fishing community',
        icon: Users,
        features: isClubOfficer ? [
          'Manage club members and roles',
          'Create and schedule tournaments',
          'Send announcements',
          'View club analytics'
        ] : [
          'Browse club directory',
          'View club announcements',
          'Connect with other anglers',
          'Access club resources'
        ],
        color: isClubOfficer ? 'from-orange-500/10 to-orange-500/20' : 'from-water-blue/10 to-water-blue/20'
      },
      {
        id: 'profile',
        title: 'Your Profile',
        description: 'Stats, gear, and personal settings',
        icon: User,
        features: [
          'View your fishing statistics',
          'Manage your gear inventory',
          'Update personal information',
          'Customize app settings'
        ],
        color: 'from-fishing-green/10 to-fishing-green/20'
      }
    ];

    return baseSteps;
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="absolute top-0 right-0 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center`}>
            <currentStepData.icon className="w-8 h-8 text-primary" />
          </div>
          
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            {currentStepData.title}
            {currentStepData.id === 'club' && isClubOfficer && (
              <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">
                <Crown className="w-3 h-3 mr-1" />
                Officer
              </Badge>
            )}
          </CardTitle>
          
          <CardDescription>
            {currentStepData.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Features List */}
          <div className="space-y-2">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-fishing-green flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Special Officer Welcome */}
          {currentStep === 0 && isClubOfficer && (
            <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Officer Access Granted</span>
              </div>
              <p className="text-xs text-orange-600">
                You have special privileges to manage club activities, create tournaments, and communicate with members.
              </p>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>{isLastStep ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
              Skip Tour
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}