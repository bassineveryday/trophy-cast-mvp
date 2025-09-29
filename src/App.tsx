import HomeDashboard from "@/features/home/HomeDashboard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import DevHealthButton from "@/components/DevHealthButton";

// Auth Feature
import AuthPage from "@/features/auth/AuthPage";

// Catch Management Features
import CatchLogging from "@/features/catches/CatchLogging";
import MyCatches from "@/features/catches/MyCatches";

// Profile Features
import Profile from "@/features/profile/Profile";

// Leaderboard & Performance Features
import Leaderboard from "@/features/leaderboard/Leaderboard";

// Shared Utility Pages
import NotFound from "@/shared/pages/NotFound";

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
              <Route index element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute><HomeDashboard /></ProtectedRoute>} />
              <Route path="catch-logging" element={<ProtectedRoute><CatchLogging /></ProtectedRoute>} />
              <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              <Route path="my-catches" element={<ProtectedRoute><MyCatches /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Route>

            {/* Standalone Pages - no shared layout needed */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <DevHealthButton />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
