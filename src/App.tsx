// ============================================================================
// TROPHYCAST - COMPLETE APPLICATION ROUTER 
// ============================================================================
// Eight-phase development structure for organized feature development
// All routes are protected and use consistent layouts and authentication
// Updated to fix caching issues

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AICoachLayout } from "@/layouts/AICoachLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// ============================================================================
// AUTHENTICATION & CORE SYSTEM
// ============================================================================
import AuthPage from "@/features/auth/AuthPage";

// ============================================================================
// PHASE 1: DEMO SYSTEM & ROLE SWITCHER
// ============================================================================
// Demo mode components for showcase and user role testing
// Components will be created as needed for demo functionality

// ============================================================================
// PHASE 2: PERSONALIZED HOME DASHBOARD
// ============================================================================
// Hero welcome, career stats, boat & gear snapshot, club tiles, tournaments carousel
import HomeDashboard from "@/features/home/HomeDashboard";
import Homepage from "@/features/home/Homepage";
import StreamlinedHomepage from "@/features/home/StreamlinedHomepage";
import Dashboard from "@/features/home/Dashboard";

// ============================================================================
// PHASE 3: MOBILE-FIRST ANGLER PROFILE
// ============================================================================
// Single-column layout, burger menu, stats grid, editable signature techniques
import Profile from "@/features/profile/Profile";
import PublicProfile from "@/features/profile/PublicProfile";
import BadgeCollection from "@/features/profile/BadgeCollection";

// ============================================================================
// PHASE 4: SMART GEAR & BOAT TRACKING
// ============================================================================
// Rod/reel serial lookup, combo management, line setup tracking, boat profiles
import GearDashboard from "@/features/gear/GearDashboard";

// ============================================================================
// PHASE 5: AI-POWERED NEWSLETTER GENERATOR
// ============================================================================
// OpenAI newsletter generation and SendGrid distribution UI
// Components will be created as needed for newsletter functionality

// ============================================================================
// PHASE 6: ENVIRONMENTAL DATA & AI COACHING
// ============================================================================
// OpenWeather, solunar tables, catch-condition correlations, AI recommendations
import AICoach from "@/features/ai-coach/AICoach";
import AICoachPreTrip from "@/features/ai-coach/AICoachPreTrip";
import AICoachAtLake from "@/features/ai-coach/AICoachAtLake";
import AICoachAdjustedPlan from "@/features/ai-coach/AICoachAdjustedPlan";
import TournamentPlanReport from "@/features/ai-coach/TournamentPlanReport";

// ============================================================================
// PHASE 7: ADVANCED NAVIGATION & UX
// ============================================================================
// Universal header, breadcrumbs, progress indicators, enhanced navigation
import { UniversalHeader } from "@/components/UniversalHeader";
import { BottomNavigation } from "@/components/BottomNavigation";

// ============================================================================
// PHASE 8: FOUNDER & PLATFORM ADMIN TOOLS
// ============================================================================
// Platform dashboard, user impersonation, debug panels, feature flags
import PlatformDashboard from "@/features/admin/PlatformDashboard";
import UserImpersonationPanel from "@/features/admin/UserImpersonationPanel";
import SystemHealthDashboard from "@/features/admin/SystemHealthDashboard";
import DatabaseExample from "@/features/admin/DatabaseExample";

// ============================================================================
// EXISTING CORE TOURNAMENT MANAGEMENT
// ============================================================================
import TournamentDashboard from "@/features/tournaments/TournamentDashboard";
import TournamentDetail from "@/features/tournaments/TournamentDetail";
import TournamentAlerts from "@/features/tournaments/TournamentAlerts";

// ============================================================================
// EXISTING CATCH LOGGING & MANAGEMENT
// ============================================================================
import CatchLogging from "@/features/catches/CatchLogging";
import CatchDetail from "@/features/catches/CatchDetail";
import MyCatches from "@/features/catches/MyCatches";
import CatchesThisMonth from "@/features/catches/CatchesThisMonth";

// ============================================================================
// EXISTING CLUB MANAGEMENT & SOCIAL FEATURES
// ============================================================================
import ClubDashboard from "@/features/clubs/ClubDashboard";
import ClubDashboardNew from "@/features/clubs/ClubDashboardNew";
import ClubFeed from "@/features/clubs/ClubFeed";
import StreamlinedClubHub from "@/features/clubs/StreamlinedClubHub.tsx";
import ClubDirectory from "@/features/clubs/ClubDirectory";
import ClubOrganizationHub from "@/features/clubs/organization/ClubOrganizationHub";
import ClubManagementDashboard from "@/features/clubs/ClubManagementDashboard";
import MemberImportPage from "@/features/clubs/MemberImportPage";

// ============================================================================
// EXISTING MESSAGING & COMMUNICATION
// ============================================================================
import MessagesInbox from "@/features/messages/MessagesInbox";
import MessageThread from "@/features/messages/MessageThread";
import MessageNew from "@/features/messages/MessageNew";
import ClubInboxDetail from "@/features/messages/ClubInboxDetail";

// ============================================================================
// EXISTING PERFORMANCE TRACKING & LEADERBOARDS
// ============================================================================
import Leaderboard from "@/features/leaderboard/Leaderboard";
import FirstPlaceFinishes from "@/features/leaderboard/FirstPlaceFinishes";
import SecondPlaceFinishes from "@/features/leaderboard/SecondPlaceFinishes";
import ThirdPlaceFinishes from "@/features/leaderboard/ThirdPlaceFinishes";
import Top10Finishes from "@/features/leaderboard/Top10Finishes";
import Top20Finishes from "@/features/leaderboard/Top20Finishes";

// ============================================================================
// EXISTING PLANNING & STRATEGY
// ============================================================================
import MyPlans from "@/features/plans/Plans";

// ============================================================================
// EXISTING PARTNERSHIPS & MONETIZATION
// ============================================================================
import SponsorDeals from "@/features/sponsors/SponsorDeals";

// ============================================================================
// EXISTING HYBRID DEMO & DEVELOPMENT FEATURES
// ============================================================================
import HybridDashboard from "@/features/hybrid/HybridDashboard";

// ============================================================================
// EXISTING SHARED UTILITIES & PAGES
// ============================================================================
import Calendar from "@/shared/pages/Calendar";
import NotFound from "@/shared/pages/NotFound";

// ============================================================================
// QUERY CLIENT & APP CONFIGURATION
// ============================================================================
const queryClient = new QueryClient();

// ============================================================================
// APP CONTENT COMPONENT - HANDLES CONDITIONAL CHROME RENDERING
// ============================================================================
const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/auth');

  return (
    <>
      {/* Phase 7: Universal Header - Hidden on auth routes */}
      {!isAuthRoute && <UniversalHeader />}

      <Routes>
        {/* ================================================================ */}
        {/* AUTHENTICATION - Standalone Routes */}
        {/* ================================================================ */}
        <Route path="/auth" element={<AuthPage />} />

        {/* ================================================================ */}
        {/* PHASE 1: DEMO SYSTEM & ROLE SWITCHER */}
        {/* ================================================================ */}
        {/* Demo routes will be added when components are created */}

        {/* ================================================================ */}
        {/* MAIN APPLICATION - MainLayout Wrapper */}
        {/* ================================================================ */}
        <Route path="/" element={<MainLayout />}>
          
          {/* ========================================================== */}
          {/* PHASE 2: PERSONALIZED HOME DASHBOARD */}
          {/* ========================================================== */}
          <Route index element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
          {/* Additional Phase 2 routes will be added when components are created */}
          <Route path="legacy-dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* PHASE 3: MOBILE-FIRST ANGLER PROFILE */}
          {/* ========================================================== */}
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="anglers/:anglerId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
          <Route path="badges" element={<ProtectedRoute><BadgeCollection /></ProtectedRoute>} />
          {/* Additional Phase 3 routes will be added when components are created */}

          {/* ========================================================== */}
          {/* PHASE 4: SMART GEAR & BOAT TRACKING */}
          {/* ========================================================== */}
          <Route path="gear" element={<ProtectedRoute><GearDashboard /></ProtectedRoute>} />
          {/* Additional Phase 4 routes will be added when components are created */}

          {/* ========================================================== */}
          {/* PHASE 5: AI-POWERED NEWSLETTER GENERATOR */}
          {/* ========================================================== */}
          {/* Newsletter routes will be added when components are created */}

          {/* ========================================================== */}
          {/* EXISTING PERFORMANCE TRACKING & LEADERBOARDS */}
          {/* ========================================================== */}
          <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="tournament-finishes/first-place" element={<ProtectedRoute><FirstPlaceFinishes /></ProtectedRoute>} />
          <Route path="tournament-finishes/second-place" element={<ProtectedRoute><SecondPlaceFinishes /></ProtectedRoute>} />
          <Route path="tournament-finishes/third-place" element={<ProtectedRoute><ThirdPlaceFinishes /></ProtectedRoute>} />
          <Route path="tournament-finishes/top-10" element={<ProtectedRoute><Top10Finishes /></ProtectedRoute>} />
          <Route path="tournament-finishes/top-20" element={<ProtectedRoute><Top20Finishes /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING TOURNAMENT MANAGEMENT & COMPETITION */}
          {/* ========================================================== */}
          <Route path="tournaments" element={<ProtectedRoute><TournamentDashboard /></ProtectedRoute>} />
          <Route path="tournament/:tournamentId" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
          <Route path="tournament-alerts" element={<ProtectedRoute><TournamentAlerts /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING CATCH LOGGING & TRACKING */}
          {/* ========================================================== */}
          <Route path="catch-logging" element={<ProtectedRoute><CatchLogging /></ProtectedRoute>} />
          <Route path="tournament/:tournamentId/catch/:catchId" element={<ProtectedRoute><CatchDetail /></ProtectedRoute>} />
          <Route path="my-catches" element={<ProtectedRoute><MyCatches /></ProtectedRoute>} />
          <Route path="catches-this-month" element={<ProtectedRoute><CatchesThisMonth /></ProtectedRoute>} />
          <Route path="catches" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING MESSAGING & COMMUNICATION */}
          {/* ========================================================== */}
          <Route path="messages" element={<ProtectedRoute><MessagesInbox /></ProtectedRoute>} />
          <Route path="messages/new" element={<ProtectedRoute><MessageNew /></ProtectedRoute>} />
          <Route path="messages/:threadId" element={<ProtectedRoute><MessageThread /></ProtectedRoute>} />
          <Route path="messages/club/:itemId" element={<ProtectedRoute><ClubInboxDetail /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING CLUB MANAGEMENT & SOCIAL FEATURES */}
          {/* ========================================================== */}
          <Route path="clubs" element={<ProtectedRoute><StreamlinedClubHub /></ProtectedRoute>} />
          <Route path="clubs/:id/manage" element={<ProtectedRoute><ClubManagementDashboard /></ProtectedRoute>} />
          <Route path="clubs/:id/import" element={<ProtectedRoute><MemberImportPage /></ProtectedRoute>} />
          <Route path="club-dashboard" element={<ProtectedRoute><ClubDashboard /></ProtectedRoute>} />
          <Route path="club-feed" element={<ProtectedRoute><ClubFeed /></ProtectedRoute>} />
          <Route path="club-organization" element={<ProtectedRoute><ClubOrganizationHub /></ProtectedRoute>} />

          {/* Demo Club Routes - Development & Testing */}
          <Route path="clubs/demo-alabama-bass-chapter-12/manage" element={<ProtectedRoute><ClubManagementDashboard /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING PLANNING & STRATEGY TOOLS */}
          {/* ========================================================== */}
          <Route path="plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />
          <Route path="my-plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING PARTNERSHIPS & MONETIZATION */}
          {/* ========================================================== */}
          <Route path="sponsor-deals" element={<ProtectedRoute><SponsorDeals /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* PHASE 8: FOUNDER & PLATFORM ADMIN TOOLS */}
          {/* ========================================================== */}
          <Route path="admin/dashboard" element={<ProtectedRoute><PlatformDashboard /></ProtectedRoute>} />
          <Route path="admin/impersonation" element={<ProtectedRoute><UserImpersonationPanel /></ProtectedRoute>} />
          <Route path="admin/system" element={<ProtectedRoute><SystemHealthDashboard /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute><PlatformDashboard /></ProtectedRoute>} />
          <Route path="admin/clubs" element={<ProtectedRoute><PlatformDashboard /></ProtectedRoute>} />
          <Route path="admin/debug" element={<ProtectedRoute><SystemHealthDashboard /></ProtectedRoute>} />
          <Route path="admin/features" element={<ProtectedRoute><SystemHealthDashboard /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING HYBRID DEMO & DEVELOPMENT FEATURES */}
          {/* ========================================================== */}
          <Route path="hybrid" element={<ProtectedRoute><HybridDashboard /></ProtectedRoute>} />

          {/* ========================================================== */}
          {/* EXISTING SHARED UTILITIES & TOOLS */}
          {/* ========================================================== */}
          <Route path="calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="database-example" element={<ProtectedRoute><DatabaseExample /></ProtectedRoute>} />

        </Route>

        {/* ================================================================ */}
        {/* PHASE 6: ENVIRONMENTAL DATA & AI COACHING - Specialized Layout */}
        {/* ================================================================ */}
        <Route path="/ai-coach" element={<AICoachLayout />}>
          <Route index element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
          <Route path="pre-trip" element={<ProtectedRoute><AICoachPreTrip /></ProtectedRoute>} />
          <Route path="tournament-plan" element={<ProtectedRoute><TournamentPlanReport /></ProtectedRoute>} />
          <Route path="at-lake" element={<ProtectedRoute><AICoachAtLake /></ProtectedRoute>} />
          <Route path="adjusted-plan" element={<ProtectedRoute><AICoachAdjustedPlan /></ProtectedRoute>} />
          {/* Additional Phase 6 routes will be added when components are created */}
        </Route>

        {/* ================================================================ */}
        {/* FALLBACK & ERROR HANDLING */}
        {/* ================================================================ */}
        <Route path="*" element={<NotFound />} />

      </Routes>

      {/* Phase 7: Bottom Navigation - Hidden on auth routes */}
      {!isAuthRoute && <BottomNavigation />}

      {/* Phase 7: Breadcrumbs - will be added when component is created */}
    </>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DemoModeProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </DemoModeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
