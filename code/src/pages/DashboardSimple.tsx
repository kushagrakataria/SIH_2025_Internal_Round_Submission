import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PoliceAdminDashboard from "@/components/PoliceAdminDashboard";
import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import SimpleSafetyMap from "@/components/SimpleSafetyMap";
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  Settings, 
  User, 
  MapPin, 
  Navigation,
  Heart,
  Zap,
  Bell,
  ChevronRight,
  Home,
  Users,
  Activity,
  Menu,
  Map,
  UserCheck
} from "lucide-react";

const DashboardSimple = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardMode, setDashboardMode] = useState<'tourist' | 'police'>('tourist');

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSOS = () => {
    const alertMessage = userProfile 
      ? `🚨 Emergency SOS Activated for ${userProfile.name}!\n\nThis would normally:\n- Send alerts to emergency contacts\n- Log incident to Firebase\n- Contact local authorities\n- Share location data\n- Use Digital ID: ${userProfile.digitalId}`
      : "🚨 Emergency SOS Activated!\n\nThis would normally:\n- Send alerts to emergency contacts\n- Log incident to Firebase\n- Contact local authorities\n- Share location data";
    alert(alertMessage);
  };

  const handleLogin = () => {
    if (currentUser) {
      signOut();
    } else {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const toggleDashboardMode = () => {
    setDashboardMode(prev => prev === 'tourist' ? 'police' : 'tourist');
  };

  // Show loading state briefly
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Top Navigation */}
      <TopNavigation showBack={false} />
      
      {/* Main Content - add top padding for pinned navigation */}
      <div className="pt-24 px-4 space-y-6 pb-28">
        {/* Main Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}
                {userProfile && `, ${userProfile.name.split(' ')[0]}`}
              </h1>
              <p className="text-muted-foreground text-sm mb-3">
                {currentUser ? 'Stay safe on your journey' : 'Please login to access full features'}
              </p>
              {userProfile?.isProfileComplete && (
                <Badge variant="default" className="text-xs bg-green-500">
                  ✓ Verified Traveler
                </Badge>
              )}
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs px-3 py-1 h-8"
              onClick={toggleDashboardMode}
            >
              {dashboardMode === 'tourist' ? (
                <>
                  <Shield className="w-3 h-3 mr-1" />
                  Police
                </>
              ) : (
                <>
                  <User className="w-3 h-3 mr-1" />
                  Tourist
                </>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-muted/50">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-muted/50" 
              onClick={handleProfileClick}
            >
              {currentUser ? (
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm text-white font-medium">
                    {userProfile?.name?.charAt(0) || currentUser.email?.charAt(0)}
                  </span>
                </div>
              ) : (
                <User className="w-5 h-5 text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Dashboard Content - Conditional Rendering */}
        {dashboardMode === 'tourist' ? (
          <>
              {/* Hero Section with Map */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Live Safety Map
                  </CardTitle>
                  <p className="text-sm text-blue-600">Real-time safety zones across India</p>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="rounded-lg overflow-hidden">
                    <SimpleSafetyMap />
                  </div>
                </CardContent>
              </Card>

              {/* SOS Emergency Button */}
              <Card className="bg-gradient-to-r from-red-500 to-red-600 border-none shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Emergency SOS</h3>
                        <p className="text-red-100 text-sm">Tap for immediate help</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSOS}
                      size="lg"
                      className="bg-white text-red-600 hover:bg-red-50 font-bold rounded-full px-6 shadow-lg"
                    >
                      SOS
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Safety Status</p>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Safe Zone</Badge>
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Location</p>
                    <p className="text-sm text-muted-foreground">Mumbai, India</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate('/trips')}
                    variant="ghost" 
                    className="w-full justify-between h-12 px-4 bg-muted/50 hover:bg-muted/80 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-foreground font-medium">Manage Trips</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Button 
                    onClick={() => navigate('/alerts')}
                    variant="ghost" 
                    className="w-full justify-between h-12 px-4 bg-muted/50 hover:bg-muted/80 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-foreground font-medium">Safety Alerts</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>

                  <Button 
                    onClick={() => navigate('/profile')}
                    variant="ghost" 
                    className="w-full justify-between h-12 px-4 bg-muted/50 hover:bg-muted/80 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-foreground font-medium">Settings</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-foreground">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Firebase</p>
                      <Badge className="bg-green-100 text-green-700 text-xs">Connected</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Maps API</p>
                      <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Emergency</p>
                      <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <Badge className="bg-orange-100 text-orange-700 text-xs">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Police/Admin Dashboard */}
              <div className="min-h-[600px]">
                <PoliceAdminDashboard height="600px" />
              </div>
            </>
          )}

        {/* Global Bottom Navigation with SOS */}
        <BottomNavigation onSOS={handleSOS} />
      </div>
     </div>
    );
};

export default DashboardSimple;