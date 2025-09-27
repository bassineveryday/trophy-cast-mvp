import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Search,
  ChevronLeft,
  Trophy,
  Target,
  Fish,
  Calendar,
  X,
  SlidersHorizontal,
  MapPin,
  Brain,
  MoreVertical,
  History,
  Archive,
  Clock
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Enhanced mock data with organization by time periods
const mockPlans = [
  // Active (next 30 days)
  {
    id: '1',
    lake: 'Lake Pueblo',
    date: '2025-01-15',
    eventDate: new Date('2025-01-15'),
    season: 'Winter',
    seasonTag: 'Winter Deep Structure ❄️',
    confidence: 78,
    primaryPattern: 'Jig',
    backupPatterns: ['Spoon', 'Dropshot'],
    outcome: null,
    notes: 'Updated for falling barometer conditions',
    weatherIcon: '❄️',
    club: 'Colorado Bass Nation',
    status: 'active',
    lastUpdated: new Date(),
    versions: 3
  },
  {
    id: '2',
    lake: 'Wheeler Lake',
    date: '2025-01-28',
    eventDate: new Date('2025-01-28'),
    season: 'Winter',
    seasonTag: 'Winter Deep Structure ❄️',
    confidence: 82,
    primaryPattern: 'Spoon',
    backupPatterns: ['Jig', 'Alabama Rig'],
    outcome: null,
    notes: 'New plan based on recent practice',
    weatherIcon: '❄️',
    club: 'Alabama Bass Nation',
    status: 'active',
    lastUpdated: new Date(),
    versions: 1
  },
  // Upcoming (31-120 days)
  {
    id: '3',
    lake: 'Lake Guntersville',
    date: '2025-03-15',
    eventDate: new Date('2025-03-15'),
    season: 'Spring',
    seasonTag: 'Spring Pre-Spawn 🌱',
    confidence: 85,
    primaryPattern: 'Spinnerbait',
    backupPatterns: ['Chatterbait', 'Lipless'],
    outcome: null,
    notes: 'Draft plan for pre-spawn conditions',
    weatherIcon: '🌱',
    club: 'Alabama Bass Nation',
    status: 'upcoming',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    versions: 2
  },
  {
    id: '4',
    lake: 'Smith Lake',
    date: '2025-04-12',
    eventDate: new Date('2025-04-12'),
    season: 'Spring',
    seasonTag: 'Spring Pre-Spawn 🌱',
    confidence: 71,
    primaryPattern: 'Chatterbait',
    backupPatterns: ['Jig', 'Creature'],
    outcome: null,
    notes: 'Early plan - needs refinement',
    weatherIcon: '🌱',
    club: 'Alabama Bass Nation',
    status: 'upcoming',
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    versions: 1
  },
  // Past
  {
    id: '5',
    lake: 'Lake Guntersville',
    date: '2024-11-20',
    eventDate: new Date('2024-11-20'),
    season: 'Fall',
    seasonTag: 'Fall Shad Migration 🍂',
    confidence: 85,
    primaryPattern: 'Spinnerbait',
    backupPatterns: ['Chatterbait', 'Lipless'],
    outcome: 'win',
    notes: 'Grass edges on north wind, spinnerbait was key',
    weatherIcon: '🍂',
    club: 'Alabama Bass Nation',
    status: 'past',
    lastUpdated: new Date('2024-11-20'),
    versions: 4
  },
  {
    id: '6',
    lake: 'Wheeler Lake',
    date: '2024-10-05',
    eventDate: new Date('2024-10-05'),
    season: 'Fall',
    seasonTag: 'Fall Shad Migration 🍂',
    confidence: 72,
    primaryPattern: 'Chatterbait',
    backupPatterns: ['Jig', 'Creature'],
    outcome: 'top20',
    notes: 'Current breaks were productive',
    weatherIcon: '🍂',
    club: 'Alabama Bass Nation',
    status: 'past',
    lastUpdated: new Date('2024-10-05'),
    versions: 2
  },
  {
    id: '7',
    lake: 'Lake Pueblo',
    date: '2024-07-12',
    eventDate: new Date('2024-07-12'),
    season: 'Summer',
    seasonTag: 'Summer Ledges ☀️',
    confidence: 92,
    primaryPattern: 'Lipless',
    backupPatterns: ['Jig', 'Spoon'],
    outcome: 'top5',
    notes: 'Deep ledges with lipless crankbait, morning bite was best',
    weatherIcon: '☀️',
    club: 'Colorado Bass Nation',
    status: 'past',
    lastUpdated: new Date('2024-07-12'),
    versions: 3
  }
];

const lakes = ['All Lakes', 'Lake Pueblo', 'Lake Guntersville', 'Wheeler Lake', 'Smith Lake'];
const seasons = ['All', 'Spring Pre-Spawn', 'Summer', 'Fall', 'Winter'];
const patterns = ['All', 'Spinnerbait', 'Chatterbait', 'Jig', 'Creature', 'Lipless', 'Stickbait', 'Topwater', 'Spoon', 'Dropshot', 'Alabama Rig'];
const sortOptions = ['Most Recent', 'Highest Confidence', 'Best Outcome', 'Lake A→Z'];

const Plans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLakes, setSelectedLakes] = useState<string[]>(['All Lakes']);
  const [selectedSeason, setSelectedSeason] = useState('All');
  const [confidenceRange, setConfidenceRange] = useState([0, 100]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>(['All']);
  const [sortBy, setSortBy] = useState('Most Recent');
  const [showArchived, setShowArchived] = useState(false);
  const [aiSyncing, setAiSyncing] = useState(false);

  // Simulate AI sync pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setAiSyncing(true);
      setTimeout(() => setAiSyncing(false), 1500);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Organize plans by status
  const organizedPlans = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const oneHundredTwentyDaysFromNow = new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000);

    let filtered = mockPlans.filter(plan => {
      // Search filter
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch = 
          plan.lake.toLowerCase().includes(searchLower) ||
          plan.date.includes(searchLower) ||
          plan.season.toLowerCase().includes(searchLower) ||
          plan.primaryPattern.toLowerCase().includes(searchLower) ||
          plan.notes.toLowerCase().includes(searchLower) ||
          plan.seasonTag.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Lake filter
      if (!selectedLakes.includes('All Lakes') && !selectedLakes.includes(plan.lake)) {
        return false;
      }

      // Season filter
      if (selectedSeason !== 'All' && plan.season !== selectedSeason) {
        return false;
      }

      // Confidence filter
      if (plan.confidence < confidenceRange[0] || plan.confidence > confidenceRange[1]) {
        return false;
      }

      // Pattern filter
      if (!selectedPatterns.includes('All')) {
        const hasPattern = selectedPatterns.some(pattern => 
          pattern === plan.primaryPattern || plan.backupPatterns.includes(pattern)
        );
        if (!hasPattern) return false;
      }

      return true;
    });

    // Sort within each category
    const sortPlans = (plans: typeof mockPlans) => {
      switch (sortBy) {
        case 'Most Recent':
          return plans.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
        case 'Highest Confidence':
          return plans.sort((a, b) => b.confidence - a.confidence);
        case 'Best Outcome':
          const outcomeOrder = { 'win': 4, 'top5': 3, 'top10': 2, 'top20': 1, 'none': 0 };
          return plans.sort((a, b) => (outcomeOrder[b.outcome as keyof typeof outcomeOrder] || 0) - (outcomeOrder[a.outcome as keyof typeof outcomeOrder] || 0));
        case 'Lake A→Z':
          return plans.sort((a, b) => a.lake.localeCompare(b.lake));
        default:
          return plans;
      }
    };

    // Categorize and sort
    const active = sortPlans(filtered.filter(plan => 
      plan.eventDate > now && plan.eventDate <= thirtyDaysFromNow
    ));
    
    const upcoming = sortPlans(filtered.filter(plan => 
      plan.eventDate > thirtyDaysFromNow && plan.eventDate <= oneHundredTwentyDaysFromNow
    ));
    
    const past = sortPlans(filtered.filter(plan => 
      plan.eventDate <= now
    ));

    return { active, upcoming, past };
  }, [debouncedSearch, selectedLakes, selectedSeason, confidenceRange, selectedPatterns, sortBy]);

  const toggleLakeFilter = (lake: string) => {
    if (lake === 'All Lakes') {
      setSelectedLakes(['All Lakes']);
    } else {
      const newSelection = selectedLakes.includes('All Lakes') 
        ? [lake]
        : selectedLakes.includes(lake)
          ? selectedLakes.filter(l => l !== lake)
          : [...selectedLakes.filter(l => l !== 'All Lakes'), lake];
      
      setSelectedLakes(newSelection.length === 0 ? ['All Lakes'] : newSelection);
    }
  };

  const togglePatternFilter = (pattern: string) => {
    if (pattern === 'All') {
      setSelectedPatterns(['All']);
    } else {
      const newSelection = selectedPatterns.includes('All') 
        ? [pattern]
        : selectedPatterns.includes(pattern)
          ? selectedPatterns.filter(p => p !== pattern)
          : [...selectedPatterns.filter(p => p !== 'All'), pattern];
      
      setSelectedPatterns(newSelection.length === 0 ? ['All'] : newSelection);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedLakes(['All Lakes']);
    setSelectedSeason('All');
    setConfidenceRange([0, 100]);
    setSelectedPatterns(['All']);
  };

  const getOutcomeBadge = (outcome: string | null) => {
    if (!outcome) return null;
    switch (outcome) {
      case 'win':
        return <Badge className="bg-trophy-gold text-primary-foreground text-xs">🏆 Win</Badge>;
      case 'top5':
        return <Badge className="bg-fishing-green text-success-foreground text-xs">Top 5</Badge>;
      case 'top10':
        return <Badge className="bg-water-blue text-secondary-foreground text-xs">Top 10</Badge>;
      case 'top20':
        return <Badge variant="outline" className="text-xs">Top 20</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">—</Badge>;
    }
  };

  const getPatternIcons = (primary: string, backup: string[]) => {
    const allPatterns = [primary, ...backup.slice(0, 2)];
    return allPatterns.map((pattern, index) => (
      <div key={index} className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
        {pattern.charAt(0)}
      </div>
    ));
  };

  const handleVersionAction = (planId: string, action: string) => {
    switch (action) {
      case 'history':
        toast({
          title: "Version History",
          description: "Feature coming soon - view all plan changes",
        });
        break;
      case 'restore':
        toast({
          title: "Version Restored",
          description: "Previous version restored successfully",
        });
        break;
      case 'archive':
        toast({
          title: "Plan Archived",
          description: "Plan moved to archived section",
        });
        break;
    }
  };

  const renderPlanCard = (plan: any) => (
    <Card 
      key={plan.id} 
      className="cursor-pointer hover:shadow-md transition-all duration-200 animate-fade-in relative"
      onClick={() => navigate(`/ai-coach/tournament-plan?lake=${encodeURIComponent(plan.lake)}`)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">{plan.lake}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border border-border">
                  <DropdownMenuItem onClick={() => handleVersionAction(plan.id, 'history')}>
                    <History className="w-4 h-4 mr-2" />
                    View Change Summary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleVersionAction(plan.id, 'restore')}>
                    <Clock className="w-4 h-4 mr-2" />
                    Restore Previous Version
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleVersionAction(plan.id, 'archive')}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(plan.date).toLocaleDateString()} • {plan.club}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs">{plan.seasonTag}</span>
              {plan.versions > 1 && (
                <Badge variant="outline" className="text-xs">
                  v{plan.versions}
                </Badge>
              )}
            </div>
          </div>
          {getOutcomeBadge(plan.outcome)}
        </div>

        {/* Confidence Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <span className="text-xs font-medium">{plan.confidence}%</span>
          </div>
          <Progress value={plan.confidence} className="h-2" />
        </div>

        {/* Patterns */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Patterns:</span>
            <div className="flex space-x-1">
              {getPatternIcons(plan.primaryPattern, plan.backupPatterns)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {plan.weatherIcon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const totalPlans = organizedPlans.active.length + organizedPlans.upcoming.length + organizedPlans.past.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="ml-2">
              <h1 className="text-xl font-bold">Plans</h1>
              <div className="flex items-center space-x-2">
                <p className="text-xs opacity-75">All plans are auto-saved and organized by AI</p>
                <div className="group relative">
                  <Brain className="w-4 h-4 opacity-75 hover:opacity-100 transition-opacity cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-background text-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    AI manages your plans in the background
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Auto-save Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${aiSyncing ? 'animate-pulse' : ''}`}>
              <Brain className="w-4 h-4" />
              <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                Auto-save On
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plans by lake, date, season, pattern, or notes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Quick Filters */}
        <div className="space-y-3">
          {/* Lake Filters */}
          <div className="flex flex-wrap gap-2">
            {lakes.map(lake => (
              <Button
                key={lake}
                variant={selectedLakes.includes(lake) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleLakeFilter(lake)}
              >
                <MapPin className="w-3 h-3 mr-1" />
                {lake}
              </Button>
            ))}
          </div>

          {/* Season & Pattern Filters */}
          <div className="flex flex-wrap gap-2">
            {seasons.map(season => (
              <Button
                key={season}
                variant={selectedSeason === season ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeason(season)}
              >
                {season}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {patterns.slice(0, 6).map(pattern => (
              <Button
                key={pattern}
                variant={selectedPatterns.includes(pattern) ? "default" : "outline"}
                size="sm"
                onClick={() => togglePatternFilter(pattern)}
              >
                <Target className="w-3 h-3 mr-1" />
                {pattern}
              </Button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-archived"
                  checked={showArchived}
                  onCheckedChange={setShowArchived}
                />
                <label htmlFor="show-archived" className="text-sm text-muted-foreground">
                  Show Archived
                </label>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border">
                {sortOptions.map(option => (
                  <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {totalPlans} {totalPlans === 1 ? 'plan' : 'plans'} found
        </div>

        {/* Organized Plans */}
        {totalPlans === 0 ? (
          <Card className="p-6 text-center">
            <Fish className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">No plans match your filters</h3>
            <p className="text-muted-foreground mb-4">Try clearing some filters or create a new plan</p>
            <div className="space-y-2">
              <Button onClick={clearAllFilters} variant="outline">
                Clear All Filters
              </Button>
              <br />
              <Button onClick={() => navigate('/ai-coach/pre-trip')}>
                Create Tournament Plan
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Plans */}
            {organizedPlans.active.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-fishing-green" />
                  Active ({organizedPlans.active.length})
                  <span className="text-sm text-muted-foreground ml-2">next 30 days</span>
                </h3>
                <div className="grid gap-3">
                  {organizedPlans.active.map(renderPlanCard)}
                </div>
              </div>
            )}

            {/* Upcoming Plans */}
            {organizedPlans.upcoming.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-water-blue" />
                  Upcoming ({organizedPlans.upcoming.length})
                  <span className="text-sm text-muted-foreground ml-2">31-120 days</span>
                </h3>
                <div className="grid gap-3">
                  {organizedPlans.upcoming.map(renderPlanCard)}
                </div>
              </div>
            )}

            {/* Past Plans */}
            {organizedPlans.past.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                  Past ({organizedPlans.past.length})
                  <span className="text-sm text-muted-foreground ml-2">completed tournaments</span>
                </h3>
                <div className="grid gap-3">
                  {organizedPlans.past.map(renderPlanCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />
    </div>
  );
};

export default Plans;