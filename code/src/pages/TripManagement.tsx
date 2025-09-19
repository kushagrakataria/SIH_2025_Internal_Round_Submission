import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Clock, 
  Play, 
  Pause, 
  Square,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Calendar,
  Users,
  ArrowLeft,
  X,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface TripItinerary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed' | 'planned';
  destinations: TripDestination[];
  emergencyContacts: string[];
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface TripDestination {
  id: string;
  name: string;
  address: string;
  arrivalTime: string;
  departureTime: string;
  status: 'pending' | 'current' | 'completed' | 'skipped';
  safetyRating: 'safe' | 'moderate' | 'caution';
  notes?: string;
}

const TripManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentTrip, setCurrentTrip] = useState<TripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock trip data - in production this would come from your backend
  useEffect(() => {
    const mockTrip: TripItinerary = {
      id: 'trip_001',
      name: 'Mumbai Cultural Tour',
      startDate: '2024-09-12T09:00:00Z',
      endDate: '2024-09-12T18:00:00Z',
      status: 'active',
      emergencyContacts: ['contact_1', 'contact_2'],
      currentLocation: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Gateway of India, Mumbai'
      },
      destinations: [
        {
          id: 'dest_1',
          name: 'Gateway of India',
          address: 'Apollo Bandar, Colaba, Mumbai',
          arrivalTime: '2024-09-12T09:00:00Z',
          departureTime: '2024-09-12T11:00:00Z',
          status: 'completed',
          safetyRating: 'safe'
        },
        {
          id: 'dest_2',
          name: 'Chhatrapati Shivaji Terminus',
          address: 'Fort, Mumbai',
          arrivalTime: '2024-09-12T11:30:00Z',
          departureTime: '2024-09-12T13:00:00Z',
          status: 'current',
          safetyRating: 'safe'
        },
        {
          id: 'dest_3',
          name: 'Crawford Market',
          address: 'Dadabhai Naoroji Rd, Fort, Mumbai',
          arrivalTime: '2024-09-12T14:00:00Z',
          departureTime: '2024-09-12T16:00:00Z',
          status: 'pending',
          safetyRating: 'moderate',
          notes: 'Crowded area - stay alert'
        },
        {
          id: 'dest_4',
          name: 'Marine Drive',
          address: 'Marine Dr, Mumbai',
          arrivalTime: '2024-09-12T16:30:00Z',
          departureTime: '2024-09-12T18:00:00Z',
          status: 'pending',
          safetyRating: 'safe'
        }
      ]
    };
    setCurrentTrip(mockTrip);
  }, []);

  const handleEndTrip = async () => {
    if (!currentTrip) return;
    
    setIsLoading(true);
    try {
      // In production: API call to end trip
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentTrip({
        ...currentTrip,
        status: 'completed'
      });
      
      toast({
        title: "Trip Ended Successfully",
        description: "Your trip has been completed and archived. Digital ID monitoring is now inactive.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseTrip = async () => {
    if (!currentTrip) return;
    
    setIsLoading(true);
    try {
      const newStatus = currentTrip.status === 'active' ? 'paused' : 'active';
      
      // In production: API call to pause/resume trip
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentTrip({
        ...currentTrip,
        status: newStatus
      });
      
      toast({
        title: newStatus === 'paused' ? "Trip Paused" : "Trip Resumed",
        description: newStatus === 'paused' 
          ? "Trip monitoring is temporarily paused. You can resume anytime."
          : "Trip monitoring has been resumed.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update trip status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'secondary';
      case 'planned': return 'outline';
      default: return 'outline';
    }
  };

  const getSafetyColor = (rating: string) => {
    switch (rating) {
      case 'safe': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'caution': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getProgress = () => {
    if (!currentTrip) return 0;
    const completedCount = currentTrip.destinations.filter(d => d.status === 'completed').length;
    return (completedCount / currentTrip.destinations.length) * 100;
  };

  if (!currentTrip) {
    return (
      <div className="mobile-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('trip.noActiveTrip')}</h3>
            <p className="text-muted-foreground mb-4">
              Start a new trip to begin safety monitoring and tracking.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t('trip.title')}</h1>
        </div>
      </div>

      <div className="mobile-container flex-1 p-4 space-y-6">
        {/* Current Trip Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  {currentTrip.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(currentTrip.startDate).toLocaleDateString()} - {new Date(currentTrip.endDate).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge variant={getStatusColor(currentTrip.status) as any}>
                {currentTrip.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Trip Progress</span>
                <span>{Math.round(getProgress())}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>

            {/* Current Location */}
            {currentTrip.currentLocation && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Current Location</p>
                  <p className="text-xs text-muted-foreground">
                    {currentTrip.currentLocation.address}
                  </p>
                </div>
              </div>
            )}

            {/* Trip Controls */}
            <div className="flex gap-3">
              <Button
                variant={currentTrip.status === 'active' ? 'outline' : 'default'}
                onClick={handlePauseTrip}
                disabled={isLoading || currentTrip.status === 'completed'}
                className="flex-1"
              >
                {currentTrip.status === 'active' ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    {t('trip.pauseTrip')}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Trip
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={handleEndTrip}
                disabled={isLoading || currentTrip.status === 'completed'}
                className="flex-1"
              >
                <Square className="w-4 h-4 mr-2" />
                {t('trip.endTrip')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trip Status Alert */}
        {currentTrip.status === 'paused' && (
          <Alert className="bg-warning/10 border-warning">
            <Pause className="h-4 w-4" />
            <AlertDescription>
              Trip monitoring is paused. Resume to continue safety tracking and emergency monitoring.
            </AlertDescription>
          </Alert>
        )}

        {/* Destinations List */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Itinerary</CardTitle>
            <CardDescription>
              Your planned destinations and current progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentTrip.destinations.map((destination, index) => (
              <div
                key={destination.id}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
                  destination.status === 'current'
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent bg-background'
                }`}
              >
                <div className="mt-1">
                  {destination.status === 'completed' && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                  {destination.status === 'current' && (
                    <Navigation className="w-5 h-5 text-primary animate-pulse" />
                  )}
                  {destination.status === 'pending' && (
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  )}
                  {destination.status === 'skipped' && (
                    <X className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{destination.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {destination.address}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span>
                        {new Date(destination.arrivalTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(destination.departureTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <div className={`flex items-center gap-1 ${getSafetyColor(destination.safetyRating)}`}>
                        <Shield className="w-3 h-3" />
                        <span className="capitalize">{destination.safetyRating}</span>
                      </div>
                    </div>
                  </div>
                  
                  {destination.notes && (
                    <div className="mt-2 p-2 bg-warning/10 rounded text-xs">
                      <AlertTriangle className="w-3 h-3 inline mr-1" />
                      {destination.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              Contacts that will be notified in case of emergency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {currentTrip.emergencyContacts.length} contacts configured
            </div>
            <Button variant="outline" size="sm" className="mt-2">
              Manage Contacts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripManagement;