import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AICoachLayout } from "@/layouts/AICoachLayout";

// Home & Dashboard Features
import Homepage from "@/features/home/Homepage";
import Dashboard from "@/features/home/Dashboard";

// AI Coach Feature (grouped under AICoachLayout)
import AICoach from "@/features/ai-coach/AICoach";
import AICoachPreTrip from "@/features/ai-coach/AICoachPreTrip";
import AICoachAtLake from "@/features/ai-coach/AICoachAtLake";
import AICoachAdjustedPlan from "@/features/ai-coach/AICoachAdjustedPlan";
import TournamentPlanReport from "@/features/ai-coach/TournamentPlanReport";

// Tournament Features
import TournamentDetail from "@/features/tournaments/TournamentDetail";
import TournamentAlerts from "@/features/tournaments/TournamentAlerts";

// Catch Management Features
import CatchLogging from "@/features/catches/CatchLogging";
import CatchDetail from "@/features/catches/CatchDetail";
import MyCatches from "@/features/catches/MyCatches";
import CatchesThisMonth from "@/features/catches/CatchesThisMonth";

// Profile Features
import Profile from "@/features/profile/Profile";
import PublicProfile from "@/features/profile/PublicProfile";
import BadgeCollection from "@/features/profile/BadgeCollection";

// Messages Features  
import MessagesInbox from "@/features/messages/MessagesInbox";
import MessageThread from "@/features/messages/MessageThread";
import MessageNew from "@/features/messages/MessageNew";
import ClubInboxDetail from "@/features/messages/ClubInboxDetail";

// Club Features
import ClubDashboard from "@/features/clubs/ClubDashboard";
import ClubFeed from "@/features/clubs/ClubFeed";

// Leaderboard & Performance Features
import Leaderboard from "@/features/leaderboard/Leaderboard";
import FirstPlaceFinishes from "@/features/leaderboard/FirstPlaceFinishes";
import SecondPlaceFinishes from "@/features/leaderboard/SecondPlaceFinishes";
import ThirdPlaceFinishes from "@/features/leaderboard/ThirdPlaceFinishes";
import Top10Finishes from "@/features/leaderboard/Top10Finishes";
import Top20Finishes from "@/features/leaderboard/Top20Finishes";

// Plans Feature
import MyPlans from "@/features/plans/Plans";

// Sponsor Features
import SponsorDeals from "@/features/sponsors/SponsorDeals";

// Shared/Utility Pages
import Calendar from "@/shared/pages/Calendar";
import NotFound from "@/shared/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Application Routes - wrapped with MainLayout for shared context */}
          <Route path="/" element={<MainLayout />}>
            {/* Home & Dashboard */}
            <Route index element={<Homepage />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Leaderboard & Performance Tracking */}
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="tournament-finishes/first-place" element={<FirstPlaceFinishes />} />
            <Route path="tournament-finishes/second-place" element={<SecondPlaceFinishes />} />
            <Route path="tournament-finishes/third-place" element={<ThirdPlaceFinishes />} />
            <Route path="tournament-finishes/top-10" element={<Top10Finishes />} />
            <Route path="tournament-finishes/top-20" element={<Top20Finishes />} />

            {/* Tournament Management */}
            <Route path="tournament/:tournamentId" element={<TournamentDetail />} />
            <Route path="tournament-alerts" element={<TournamentAlerts />} />

            {/* Catch Management */}
            <Route path="catch-logging" element={<CatchLogging />} />
            <Route path="tournament/:tournamentId/catch/:catchId" element={<CatchDetail />} />
            <Route path="my-catches" element={<MyCatches />} />
            <Route path="catches-this-month" element={<CatchesThisMonth />} />

            {/* Profile & Achievement */}
            <Route path="profile" element={<Profile />} />
            <Route path="anglers/:anglerId" element={<PublicProfile />} />
            <Route path="badges" element={<BadgeCollection />} />

            {/* Messages */}
            <Route path="messages" element={<MessagesInbox />} />
            <Route path="messages/new" element={<MessageNew />} />
            <Route path="messages/:threadId" element={<MessageThread />} />
            <Route path="messages/club/:itemId" element={<ClubInboxDetail />} />

            {/* Club Features */}
            <Route path="club-dashboard" element={<ClubDashboard />} />
            <Route path="club-feed" element={<ClubFeed />} />

            {/* Plans Management */}
            <Route path="plans" element={<MyPlans />} />
            <Route path="my-plans" element={<MyPlans />} />

            {/* Sponsor Features */}
            <Route path="sponsor-deals" element={<SponsorDeals />} />

            {/* Shared Utility Pages */}
            <Route path="calendar" element={<Calendar />} />

            {/* Legacy/Placeholder Routes */}
            <Route path="tournaments" element={<Dashboard />} />
            <Route path="catches" element={<Dashboard />} />
          </Route>

          {/* AI Coach Feature Routes - specialized layout with shared context and UI */}
          <Route path="/ai-coach" element={<AICoachLayout />}>
            <Route index element={<AICoach />} />
            <Route path="pre-trip" element={<AICoachPreTrip />} />
            <Route path="tournament-plan" element={<TournamentPlanReport />} />
            <Route path="at-lake" element={<AICoachAtLake />} />
            <Route path="adjusted-plan" element={<AICoachAdjustedPlan />} />
          </Route>

          {/* Standalone Pages - no shared layout needed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
