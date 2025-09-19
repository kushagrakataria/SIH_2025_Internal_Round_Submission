import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Phone, Settings, User, MapPin } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Safe Traveler</h1>
                <p className="text-sm text-gray-600">Tourist Safety Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString()}
              </span>
              <Button variant="outline" onClick={handleLogin} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome to Tourist Safety Dashboard</h2>
            <p className="text-blue-100 mb-6">
              Your comprehensive safety companion for travel. Monitor your location, receive alerts, and stay connected with emergency services.
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={handleLogin}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate('/welcome')}
              >
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">Safety Status</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Safe Zone
            </span>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
            <h3 className="text-lg font-semibold mb-2">Alert Level</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
              Low Risk
            </span>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="text-sm text-gray-600">Mumbai, India</p>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <Phone className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Emergency</h3>
            <Button 
              onClick={handleSOS}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg w-full"
              size="sm"
            >
              🚨 SOS
            </Button>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Safety Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Real-time location monitoring
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Geo-fenced safety zones
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Emergency contact alerts
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Trip tracking & management
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/trips')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  Manage Trips
                </Button>
                <Button 
                  onClick={() => navigate('/alerts')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  View Safety Alerts
                </Button>
                <Button 
                  onClick={() => navigate('/profile')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  Update Profile
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard-full')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  Full Map Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-700">Firebase</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Maps API</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Emergency Service</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-700">Location Service</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Not Enabled
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSimple;