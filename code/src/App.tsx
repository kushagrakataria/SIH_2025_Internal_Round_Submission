import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PageLoading } from "@/components/LoadingSpinner";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Welcome = lazy(() => import("./pages/Welcome"));
const Login = lazy(() => import("./pages/Login"));
const ProfileSetup = lazy(() => import("./pages/ProfileSetup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardSimple = lazy(() => import("./pages/DashboardSimple"));
const TripManagement = lazy(() => import("./pages/TripManagement"));
const AlertsFeed = lazy(() => import("./pages/AlertsFeed"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Import Firebase debug utilities
import { firebaseDebugUtils } from "@/utils/firebaseDebug";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Run Firebase diagnostics in development
if (import.meta.env.DEV) {
  console.log('🔍 Running Firebase diagnostics...');
  firebaseDebugUtils.testConnection();
  console.log('📊 Project info:', firebaseDebugUtils.getProjectInfo());
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <BrowserRouter>
            <Suspense fallback={<PageLoading text="Loading Safe Traveler Buddy..." />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/index" element={<Index />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/dashboard" element={<DashboardSimple />} />
                <Route path="/dashboard-full" element={<Dashboard />} />
                <Route path="/trips" element={<TripManagement />} />
                <Route path="/alerts" element={<AlertsFeed />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
