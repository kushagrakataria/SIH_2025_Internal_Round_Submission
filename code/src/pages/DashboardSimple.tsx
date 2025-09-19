import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Menu
} from "lucide-react";

const DashboardSimple = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSOS = () => {
    alert("🚨 Emergency SOS Activated!\n\nThis would normally:\n- Send alerts to emergency contacts\n- Log incident to Firebase\n- Contact local authorities\n- Share location data");
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Show loading state briefly
  if (!mounted) {
    return (
      <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Mobile App Header */}
      <div className="mobile-container">
        {/* Status Bar */}
        <div className="flex justify-between items-center py-3 px-1">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-foreground rounded-full opacity-80"></div>
              <div className="w-1 h-1 bg-foreground rounded-full opacity-60"></div>
              <div className="w-1 h-1 bg-foreground rounded-full opacity-40"></div>
            </div>
            <span className="text-xs font-medium text-foreground">SafeTravel</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="flex gap-1 ml-2">
              <div className="w-3 h-2 border border-foreground rounded-sm">
                <div className="w-2 h-1 bg-green-500 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between mb-6 pt-2">
          <div>
            <h1 className="heading-mobile text-foreground">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}</h1>
            <p className="text-muted-foreground text-sm">Stay safe on your journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full bg-muted/50">
              <Bell className="w-5 h-5 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-muted/50" onClick={handleLogin}>
              <User className="w-5 h-5 text-foreground" />
            </Button>
          </div>
        </div>

        {/* SOS Emergency Button */}
        <Card className="mb-6 bg-gradient-to-r from-red-500 to-red-600 border-none shadow-lg">
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
        <div className="grid grid-cols-2 gap-4 mb-6">
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
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
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

        {/* Safety Features */}
        <Card className="mb-6 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Safety Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Real-time location monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Geo-fenced safety zones</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Emergency contact alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-foreground">Trip tracking & management</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="mb-20 bg-card/80 backdrop-blur-sm border-border/50 shadow-soft">
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
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-nav-container">
        <div className="mobile-nav-grid">
          <button className="mobile-nav-item active" onClick={() => navigate('/dashboard')}>
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button className="mobile-nav-item" onClick={() => navigate('/trips')}>
            <Navigation className="w-5 h-5" />
            <span>Trips</span>
          </button>
          <button className="mobile-nav-item" onClick={() => navigate('/alerts')}>
            <AlertTriangle className="w-5 h-5" />
            <span>Alerts</span>
          </button>
          <button className="mobile-nav-item" onClick={() => navigate('/profile')}>
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSimple;