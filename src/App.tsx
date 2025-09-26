import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AICoachLayout } from "@/layouts/AICoachLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Auth Feature
import AuthPage from "@/features/auth/AuthPage";

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

// Shared Utility Pages
import Calendar from "@/shared/pages/Calendar";
import NotFound from "@/shared/pages/NotFound";

// Database Example
import DatabaseExample from "@/features/admin/DatabaseExample";

// Tournament Features - Enhanced
import TournamentDashboard from "@/features/tournaments/TournamentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Route - standalone, no layout */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Main Application Routes - wrapped with MainLayout and protected */}
            <Route path="/" element={<MainLayout />}>
              {/* Home & Dashboard */}
              <Route index element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

            {/* Leaderboard & Performance Tracking */}
            <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="tournament-finishes/first-place" element={<ProtectedRoute><FirstPlaceFinishes /></ProtectedRoute>} />
            <Route path="tournament-finishes/second-place" element={<ProtectedRoute><SecondPlaceFinishes /></ProtectedRoute>} />
            <Route path="tournament-finishes/third-place" element={<ProtectedRoute><ThirdPlaceFinishes /></ProtectedRoute>} />
            <Route path="tournament-finishes/top-10" element={<ProtectedRoute><Top10Finishes /></ProtectedRoute>} />
            <Route path="tournament-finishes/top-20" element={<ProtectedRoute><Top20Finishes /></ProtectedRoute>} />

            {/* Tournament Management */}
            <Route path="tournaments" element={<ProtectedRoute><TournamentDashboard /></ProtectedRoute>} />
            <Route path="tournament/:tournamentId" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
            <Route path="tournament-alerts" element={<ProtectedRoute><TournamentAlerts /></ProtectedRoute>} />

            {/* Catch Management */}
            <Route path="catch-logging" element={<ProtectedRoute><CatchLogging /></ProtectedRoute>} />
            <Route path="tournament/:tournamentId/catch/:catchId" element={<ProtectedRoute><CatchDetail /></ProtectedRoute>} />
            <Route path="my-catches" element={<ProtectedRoute><MyCatches /></ProtectedRoute>} />
            <Route path="catches-this-month" element={<ProtectedRoute><CatchesThisMonth /></ProtectedRoute>} />

            {/* Profile & Achievement */}
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="anglers/:anglerId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
            <Route path="badges" element={<ProtectedRoute><BadgeCollection /></ProtectedRoute>} />

            {/* Messages */}
            <Route path="messages" element={<ProtectedRoute><MessagesInbox /></ProtectedRoute>} />
            <Route path="messages/new" element={<ProtectedRoute><MessageNew /></ProtectedRoute>} />
            <Route path="messages/:threadId" element={<ProtectedRoute><MessageThread /></ProtectedRoute>} />
            <Route path="messages/club/:itemId" element={<ProtectedRoute><ClubInboxDetail /></ProtectedRoute>} />

            {/* Club Features */}
            <Route path="club-dashboard" element={<ProtectedRoute><ClubDashboard /></ProtectedRoute>} />
            <Route path="club-feed" element={<ProtectedRoute><ClubFeed /></ProtectedRoute>} />

            {/* Plans Management */}
            <Route path="plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />
            <Route path="my-plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />

            {/* Sponsor Features */}
            <Route path="sponsor-deals" element={<ProtectedRoute><SponsorDeals /></ProtectedRoute>} />

            {/* Shared Utility Pages */}
            <Route path="calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="database-example" element={<ProtectedRoute><DatabaseExample /></ProtectedRoute>} />

            {/* Legacy/Placeholder Routes */}
            <Route path="catches" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Route>

          {/* AI Coach Feature Routes - specialized layout with shared context and UI */}
          <Route path="/ai-coach" element={<AICoachLayout />}>
            <Route index element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
            <Route path="pre-trip" element={<ProtectedRoute><AICoachPreTrip /></ProtectedRoute>} />
            <Route path="tournament-plan" element={<ProtectedRoute><TournamentPlanReport /></ProtectedRoute>} />
            <Route path="at-lake" element={<ProtectedRoute><AICoachAtLake /></ProtectedRoute>} />
            <Route path="adjusted-plan" element={<ProtectedRoute><AICoachAdjustedPlan /></ProtectedRoute>} />
          </Route>

          {/* Standalone Pages - no shared layout needed */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
