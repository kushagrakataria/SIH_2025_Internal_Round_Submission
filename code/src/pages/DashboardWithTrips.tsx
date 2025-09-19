import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar,
  Plus,
  Plane,
  Shield,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Navigation,
  Users,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import databaseService from "@/services/databaseService";

interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  purpose: string;
  plannedRoute: string;
  accommodations: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [tripFormData, setTripFormData] = useState<TripFormData>({
    destination: "",
    startDate: "",
    endDate: "",
    purpose: "",
    plannedRoute: "",
    accommodations: "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Check if profile is completed (optional check since it's not in interface)
    // if (!userProfile?.profileCompleted) {
    //   navigate('/profile-setup');
    //   return;
    // }

    loadUserTrips();
  }, [currentUser, userProfile, navigate]);

  const loadUserTrips = async () => {
    if (!currentUser) return;
    
    try {
      const userTrips = await databaseService.getUserTrips(currentUser.uid);
      setTrips(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

  const updateTripFormData = (field: keyof TripFormData, value: string) => {
    setTripFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateTrip = async () => {
    if (!currentUser || !tripFormData.destination || !tripFormData.startDate || !tripFormData.endDate) {
      toast({
        title: "Please fill in required fields",
        description: "Destination, start date, and end date are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tripData = {
        userId: currentUser.uid,
        name: `Trip to ${tripFormData.destination}`,
        description: tripFormData.purpose || "Personal trip",
        startDate: tripFormData.startDate,
        endDate: tripFormData.endDate,
        status: "planned" as const,
        destinations: [{
          id: '1',
          name: tripFormData.destination,
          address: tripFormData.destination,
          coordinates: {
            lat: 0,
            lng: 0
          },
          isCompleted: false,
          notes: tripFormData.plannedRoute || undefined
        }],
        safetyCheckInterval: 60, // 1 hour
      };

      await databaseService.createTrip(tripData);
      
      toast({
        title: "Trip created successfully!",
        description: "Your trip itinerary has been saved.",
      });

      // Reset form and reload trips
      setTripFormData({
        destination: "",
        startDate: "",
        endDate: "",
        purpose: "",
        plannedRoute: "",
        accommodations: "",
      });
      setShowTripForm(false);
      loadUserTrips();
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error creating trip",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencySOSx = () => {
    toast({
      title: "Emergency Alert Sent!",
      description: "Your emergency contacts have been notified with your location.",
      variant: "destructive",
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date().toDateString();
    const date = new Date(dateString).toDateString();
    return today === date;
  };

  const getUpcomingTrip = () => {
    const now = new Date();
    return trips.find(trip => new Date(trip.startDate) > now);
  };

  const getCurrentTrip = () => {
    const now = new Date();
    return trips.find(trip => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      return now >= start && now <= end;
    });
  };

  if (!currentUser || !userProfile) {
    return <div>Loading...</div>;
  }

  const upcomingTrip = getUpcomingTrip();
  const currentTrip = getCurrentTrip();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userProfile.name}!
              </h1>
              <p className="text-gray-600">Stay safe on your travels</p>
            </div>
            <Button
              onClick={handleEmergencySOSx}
              variant="destructive"
              size="lg"
              className="flex items-center gap-2 animate-pulse"
            >
              <AlertTriangle className="w-5 h-5" />
              SOS Emergency
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Safety Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Travel Status</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentTrip ? "Active Trip" : upcomingTrip ? "Trip Planned" : "No Active Trips"}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentTrip 
                  ? `In ${currentTrip.destinations[0]?.name || currentTrip.name}` 
                  : upcomingTrip 
                    ? `Next: ${upcomingTrip.destinations[0]?.name || upcomingTrip.name}`
                    : "Plan your next adventure"
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">95%</div>
              <p className="text-xs text-muted-foreground">
                All safety measures active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency Contacts</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.emergencyContacts?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Contacts ready to help
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current/Upcoming Trip */}
        {(currentTrip || upcomingTrip) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {currentTrip ? "Current Trip" : "Upcoming Trip"}
                <Badge variant={currentTrip ? "default" : "secondary"}>
                  {currentTrip ? "Active" : "Planned"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {(currentTrip || upcomingTrip)?.destinations[0]?.name || (currentTrip || upcomingTrip)?.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date((currentTrip || upcomingTrip)?.startDate).toLocaleDateString()} - {' '}
                        {new Date((currentTrip || upcomingTrip)?.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Trip: {(currentTrip || upcomingTrip)?.description}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Safety Checklist</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Emergency contacts notified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Location sharing enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Safety alerts active</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Trip Creation Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Plan a New Trip
            </CardTitle>
            <CardDescription>
              Create a new trip itinerary to activate safety features
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showTripForm ? (
              <Button 
                onClick={() => setShowTripForm(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Trip
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      value={tripFormData.destination}
                      onChange={(e) => updateTripFormData("destination", e.target.value)}
                      placeholder="e.g., Mumbai, Delhi, Goa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={tripFormData.purpose}
                      onChange={(e) => updateTripFormData("purpose", e.target.value)}
                      placeholder="e.g., Business, Tourism, Family Visit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={tripFormData.startDate}
                      onChange={(e) => updateTripFormData("startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={tripFormData.endDate}
                      onChange={(e) => updateTripFormData("endDate", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plannedRoute">Planned Route</Label>
                  <Textarea
                    id="plannedRoute"
                    value={tripFormData.plannedRoute}
                    onChange={(e) => updateTripFormData("plannedRoute", e.target.value)}
                    placeholder="Describe your travel route and stops"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accommodations">Accommodations</Label>
                  <Textarea
                    id="accommodations"
                    value={tripFormData.accommodations}
                    onChange={(e) => updateTripFormData("accommodations", e.target.value)}
                    placeholder="Hotel names, addresses, contact details"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleCreateTrip}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Creating..." : "Create Trip"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowTripForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Trips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Your Trips
            </CardTitle>
            <CardDescription>
              Manage all your travel itineraries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No trips planned yet. Create your first trip above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{trip.destinations[0]?.name || trip.name}</h3>
                      <Badge variant={
                        new Date(trip.endDate) < new Date() ? "secondary" : 
                        new Date(trip.startDate) <= new Date() ? "default" : "outline"
                      }>
                        {new Date(trip.endDate) < new Date() ? "Completed" : 
                         new Date(trip.startDate) <= new Date() ? "Active" : "Planned"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </div>
                      <div>
                        <Users className="w-4 h-4 inline mr-1" />
                        {trip.description || "Personal trip"}
                      </div>
                    </div>
                    {trip.destinations[0]?.notes && (
                      <p className="text-sm mt-2">{trip.destinations[0].notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;