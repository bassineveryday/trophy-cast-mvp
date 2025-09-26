import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Award, Medal, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CareerStats } from "@/types";

interface CareerStatsSectionProps {
  stats: CareerStats;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CareerStatsSection = ({ stats, isExpanded, onToggle }: CareerStatsSectionProps) => {
  const statItems = [
    { label: "Tournaments", value: stats.tournaments, icon: Trophy, color: "text-fishing-green", link: "/tournaments" },
    { label: "Wins", value: stats.wins, icon: Award, color: "text-trophy-gold", link: "/tournament-finishes/first-place" },
    { label: "AOY Titles", value: stats.aoyTitles, icon: Medal, color: "text-trophy-gold", link: "/leaderboard" },
    { label: "Personal Best", value: `${stats.personalBest} lbs`, icon: TrendingUp, color: "text-water-blue", link: "/my-catches" },
  ];

  const finishStats = [
    { label: "1st Place", value: stats.firstPlace, link: "/tournament-finishes/first-place" },
    { label: "2nd Place", value: stats.secondPlace, link: "/tournament-finishes/second-place" },
    { label: "3rd Place", value: stats.thirdPlace, link: "/tournament-finishes/third-place" },
    { label: "Top 10", value: stats.top10, link: "/tournament-finishes/top-10" },
    { label: "Top 20", value: stats.top20, link: "/tournament-finishes/top-20" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="shadow-card-custom border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-trophy-gold" />
              Career Stats
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="hover:bg-accent"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {statItems.map((stat, index) => (
              <Link key={stat.label} to={stat.link}>
                <motion.div
                  className="text-center p-4 bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              </Link>
            ))}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Tournament Finishes</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {finishStats.map((finish) => (
                      <Link key={finish.label} to={finish.link}>
                        <motion.div
                          className="text-center p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-lg font-bold">{finish.value}</div>
                          <div className="text-xs text-muted-foreground">{finish.label}</div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};