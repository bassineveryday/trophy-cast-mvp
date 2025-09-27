import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AICoachLayout } from "@/layouts/AICoachLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PersonalizedAuthRedirect } from "@/components/auth/PersonalizedAuthRedirect";

// Auth Feature
import AuthPage from "@/features/auth/AuthPage";

// Home & Dashboard Features
import Homepage from "@/features/home/Homepage";
import PersonalizedDashboard from "@/features/home/PersonalizedDashboard";

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

// Unified Profile System
import UnifiedProfile from "@/features/profile/UnifiedProfile";

// Messages Features  
import MessagesInbox from "@/features/messages/MessagesInbox";
import MessageThread from "@/features/messages/MessageThread";
import MessageNew from "@/features/messages/MessageNew";
import ClubInboxDetail from "@/features/messages/ClubInboxDetail";

// Club Features
import ClubDashboard from "@/features/clubs/ClubDashboard";
import ClubFeed from "@/features/clubs/ClubFeed";

// Enhanced Club Features
import ClubDashboardNew from "@/features/clubs/ClubDashboardNew";

// Club Organization Hub
import ClubOrganizationHub from "@/features/clubs/organization/ClubOrganizationHub";

// Club Management Dashboard
import ClubManagementDashboard from "@/features/clubs/ClubManagementDashboard";

// Member Import Wizard
import MemberImportPage from "@/features/clubs/MemberImportPage";

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

import GearDashboard from "@/features/gear/GearDashboard";
import HybridDashboard from "@/features/hybrid/HybridDashboard";

// Tournament Features - Enhanced
import TournamentDashboard from "@/features/tournaments/TournamentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DemoModeProvider>
          <BrowserRouter>
            <PersonalizedAuthRedirect>
          <Routes>
            {/* Auth Route - standalone, no layout */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Main Application Routes - wrapped with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              {/* Home & Dashboard - Allow guest access */}
              <Route index element={<Homepage />} />
              <Route path="dashboard" element={<PersonalizedDashboard />} />
              
              {/* Demo Access Route */}
              <Route path="demo" element={<PersonalizedDashboard />} />
              
            {/* Legacy dashboard routes - redirect to profile for members */}
            <Route path="dashboard-legacy" element={<UnifiedProfile />} />

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

            {/* Unified Profile System - Allow guest access */}
            <Route path="profile" element={<UnifiedProfile />} />
            <Route path="anglers/:anglerId" element={<UnifiedProfile />} />
            
            {/* Legacy profile routes - redirect to unified profile */}
            <Route path="badges" element={<UnifiedProfile />} />

            {/* Messages */}
            <Route path="messages" element={<ProtectedRoute><MessagesInbox /></ProtectedRoute>} />
            <Route path="messages/new" element={<ProtectedRoute><MessageNew /></ProtectedRoute>} />
            <Route path="messages/:threadId" element={<ProtectedRoute><MessageThread /></ProtectedRoute>} />
            <Route path="messages/club/:itemId" element={<ProtectedRoute><ClubInboxDetail /></ProtectedRoute>} />

            {/* Club Features - Allow demo access */}
            <Route path="clubs" element={<ClubDashboardNew />} />
            <Route path="clubs/:id/manage" element={<ClubManagementDashboard />} />
            <Route path="clubs/:id/import" element={<MemberImportPage />} />
            <Route path="club-dashboard" element={<ClubDashboard />} />
            <Route path="club-feed" element={<ClubFeed />} />
            <Route path="club-organization" element={<ClubOrganizationHub />} />

            {/* Demo Club Routes - using demo club ID */}
            <Route path="clubs/demo-alabama-bass-chapter-12/manage" element={<ClubManagementDashboard />} />

            {/* Hybrid Demo Dashboard */}
            <Route path="hybrid" element={<ProtectedRoute><HybridDashboard /></ProtectedRoute>} />

            {/* Gear Management */}
            <Route path="gear" element={<ProtectedRoute><GearDashboard /></ProtectedRoute>} />

            {/* Plans Management */}
            <Route path="plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />
            <Route path="my-plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />

            {/* Sponsor Features */}
            <Route path="sponsor-deals" element={<ProtectedRoute><SponsorDeals /></ProtectedRoute>} />

            {/* Shared Utility Pages */}
            <Route path="calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="database-example" element={<ProtectedRoute><DatabaseExample /></ProtectedRoute>} />

            {/* Legacy/Placeholder Routes */}
            <Route path="catches" element={<ProtectedRoute><UnifiedProfile /></ProtectedRoute>} />
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
            </PersonalizedAuthRedirect>
          </BrowserRouter>
        </DemoModeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
