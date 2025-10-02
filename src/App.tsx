import Homepage from "@/features/home/Homepage";
import Dashboard from "@/features/home/Dashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { VoiceProvider } from "@/contexts/VoiceContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import { ContextAwareAIProvider } from "@/contexts/ContextAwareAIContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import DemoSwitcher from "@/components/DemoSwitcher";

// Auth Feature
import AuthPage from "@/features/auth/AuthPage";

// Catch Management Features
import CatchLogging from "@/features/catches/CatchLogging";
import MyCatches from "@/features/catches/MyCatches";

// Profile & Settings Features
import Profile from "@/features/profile/Profile";
import ProfilePage from "@/features/profile/ProfilePage";
import TrophyRoomPage from "@/components/profile/TrophyRoomPage";
import { EditProfile } from "@/features/profile/EditProfile";

// Trophy Room
import TrophyRoom from "@/features/trophies/TrophyRoom";

// Settings
import Settings from "@/features/settings/Settings";

// Leaderboard & Performance Features
import Leaderboard from "@/features/leaderboard/Leaderboard";

// AI Coach Features
import { AICoachLayout } from "@/layouts/AICoachLayout";
import AICoach from "@/features/ai-coach/AICoach";
import AICoachPreTrip from "@/features/ai-coach/AICoachPreTripPlaceholder";
import AICoachAtLake from "@/features/ai-coach/AICoachAtLakePlaceholder";

// Tournament Features
import TournamentDashboard from "@/features/tournaments/TournamentDashboardPlaceholder";
import TournamentDetail from "@/features/tournaments/TournamentDetailPlaceholder";

// Club Features
import ClubDashboard from "@/features/clubs/ClubDashboardPlaceholder";
import ClubFeed from "@/features/clubs/ClubFeedPlaceholder";
import ClubDetailPage from "@/components/club/ClubDetailPage";

// Community Features
import CommunityDock from "@/features/community/CommunityDock";

// Trust Center
import TrustCenter from "@/features/trust-center/TrustCenter";

// Shared Utility Pages
import NotFound from "@/shared/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoModeProvider>
        <AuthProvider>
          <VoiceProvider>
            <BrowserRouter>
              <ContextAwareAIProvider>
                <Routes>
              {/* Auth Route - standalone, no layout */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Main Application Routes - wrapped with MainLayout */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Homepage />} />
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="catch-logging" element={<ProtectedRoute><CatchLogging /></ProtectedRoute>} />
                <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                <Route path="my-catches" element={<ProtectedRoute><MyCatches /></ProtectedRoute>} />
                <Route path="trophy-room" element={<ProtectedRoute><TrophyRoom /></ProtectedRoute>} />
                <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                
                {/* Tournament Routes */}
                <Route path="tournaments/dashboard" element={<ProtectedRoute><TournamentDashboard /></ProtectedRoute>} />
                <Route path="tournaments/:id" element={<ProtectedRoute><TournamentDetail /></ProtectedRoute>} />
                
                {/* Profile Routes */}
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="profile/trophy-room" element={<ProtectedRoute><TrophyRoomPage /></ProtectedRoute>} />
                <Route path="profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                
                {/* Club Routes */}
                <Route path="club/dashboard" element={<ProtectedRoute><ClubDashboard /></ProtectedRoute>} />
                <Route path="club/feed" element={<ProtectedRoute><ClubFeed /></ProtectedRoute>} />
                <Route path="clubs/:clubId" element={<ProtectedRoute><ClubDetailPage /></ProtectedRoute>} />
                
                {/* Community Route */}
                <Route path="community" element={<ProtectedRoute><CommunityDock /></ProtectedRoute>} />
                
                {/* Trust Center */}
                <Route path="trust-center" element={<ProtectedRoute><TrustCenter /></ProtectedRoute>} />
              </Route>

              {/* AI Coach Routes - separate layout */}
              <Route path="/ai-coach" element={<AICoachLayout />}>
                <Route index element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
                <Route path="pre-trip" element={<ProtectedRoute><AICoachPreTrip /></ProtectedRoute>} />
                <Route path="at-lake" element={<ProtectedRoute><AICoachAtLake /></ProtectedRoute>} />
              </Route>

              {/* Standalone Pages - no shared layout needed */}
              <Route path="*" element={<NotFound />} />
                </Routes>
              </ContextAwareAIProvider>
            </BrowserRouter>
            <Toaster />
            <DemoSwitcher />
          </VoiceProvider>
        </AuthProvider>
      </DemoModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
