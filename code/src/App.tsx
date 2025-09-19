import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import DashboardSimple from "./pages/DashboardSimple";
import TripManagement from "./pages/TripManagement";
import AlertsFeed from "./pages/AlertsFeed";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Import Firebase debug utilities
import { firebaseDebugUtils } from "@/utils/firebaseDebug";

const queryClient = new QueryClient();

// Run Firebase diagnostics in development
if (import.meta.env.DEV) {
  console.log('🔍 Running Firebase diagnostics...');
  firebaseDebugUtils.testConnection();
  console.log('📊 Project info:', firebaseDebugUtils.getProjectInfo());
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
