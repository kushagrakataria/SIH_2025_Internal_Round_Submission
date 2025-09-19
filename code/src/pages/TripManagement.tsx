import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BottomNavigation from "@/components/BottomNavigation";
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
  Shield,
  Plus,
  Edit3,
  Trash2,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  const { currentUser } = useAuth();
  const [currentTrip, setCurrentTrip] = useState<TripItinerary | null>(null);
  const [allTrips, setAllTrips] = useState<TripItinerary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTripDialog, setShowNewTripDialog] = useState(false);
  const [editingTrip, setEditingTrip] = useState<TripItinerary | null>(null);
  
  // New trip form state
  const [newTripForm, setNewTripForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    destinations: '',
    emergencyContacts: '',
    notes: ''
  });

  // Mock trip data - in production this would come from your backend
  useEffect(() => {
    const mockTrips: TripItinerary[] = [
      {
        id: 'trip_001',
        name: 'Northeast Cultural Tour',
        startDate: '2024-09-12T09:00:00Z',
        endDate: '2024-09-12T18:00:00Z',
        status: 'active',
        emergencyContacts: ['contact_1', 'contact_2'],
        currentLocation: {
          lat: 26.1445,
          lng: 91.7362,
          address: 'Guwahati, Assam'
        },
        destinations: [
          {
            id: 'dest_1',
            name: 'Kamakhya Temple',
            address: 'Nilachal Hills, Guwahati, Assam',
            arrivalTime: '2024-09-12T09:00:00Z',
            departureTime: '2024-09-12T11:00:00Z',
            status: 'completed',
            safetyRating: 'safe'
          },
          {
            id: 'dest_2',
            name: 'Umananda Temple',
            address: 'Peacock Island, Guwahati, Assam',
            arrivalTime: '2024-09-12T11:30:00Z',
            departureTime: '2024-09-12T13:00:00Z',
            status: 'current',
            safetyRating: 'safe'
          },
          {
            id: 'dest_3',
            name: 'Assam State Museum',
            address: 'Dighalipukhuri, Guwahati, Assam',
            arrivalTime: '2024-09-12T14:00:00Z',
            departureTime: '2024-09-12T16:00:00Z',
            status: 'pending',
            safetyRating: 'moderate',
            notes: 'Crowded area - stay alert'
          },
          {
            id: 'dest_4',
            name: 'Brahmaputra River Cruise',
            address: 'Sukreswar Ghat, Guwahati, Assam',
            arrivalTime: '2024-09-12T16:30:00Z',
            departureTime: '2024-09-12T18:00:00Z',
            status: 'pending',
            safetyRating: 'safe'
          }
        ]
      },
      {
        id: 'trip_002',
        name: 'Kaziranga Wildlife Safari',
        startDate: '2024-09-15T06:00:00Z',
        endDate: '2024-09-15T18:00:00Z',
        status: 'planned',
        emergencyContacts: ['contact_1'],
        destinations: [
          {
            id: 'dest_5',
            name: 'Kaziranga National Park',
            address: 'Golaghat, Assam',
            arrivalTime: '2024-09-15T06:00:00Z',
            departureTime: '2024-09-15T18:00:00Z',
            status: 'pending',
            safetyRating: 'safe',
            notes: 'Early morning safari recommended'
          }
        ]
      }
    ];
    
    setAllTrips(mockTrips);
    setCurrentTrip(mockTrips.find(trip => trip.status === 'active') || null);
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

  // Enhanced trip management functions
  const handleCreateNewTrip = async () => {
    if (!newTripForm.name || !newTripForm.startDate || !newTripForm.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newTrip: TripItinerary = {
        id: `trip_${Date.now()}`,
        name: newTripForm.name,
        startDate: newTripForm.startDate,
        endDate: newTripForm.endDate,
        status: 'planned',
        emergencyContacts: newTripForm.emergencyContacts.split(',').map(c => c.trim()),
        destinations: newTripForm.destinations.split(',').map((dest, index) => ({
          id: `dest_${Date.now()}_${index}`,
          name: dest.trim(),
          address: dest.trim(),
          arrivalTime: newTripForm.startDate,
          departureTime: newTripForm.endDate,
          status: 'pending' as const,
          safetyRating: 'safe' as const,
          notes: newTripForm.notes
        }))
      };

      // In production: API call to create trip
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAllTrips(prev => [...prev, newTrip]);
      setNewTripForm({
        name: '',
        startDate: '',
        endDate: '',
        destinations: '',
        emergencyContacts: '',
        notes: ''
      });
      setShowNewTripDialog(false);
      
      toast({
        title: "Trip Created Successfully",
        description: `${newTrip.name} has been added to your trips.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    setIsLoading(true);
    try {
      // In production: API call to delete trip
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAllTrips(prev => prev.filter(trip => trip.id !== tripId));
      if (currentTrip?.id === tripId) {
        setCurrentTrip(null);
      }
      
      toast({
        title: "Trip Deleted",
        description: "Trip has been permanently removed.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrip = async (trip: TripItinerary) => {
    setIsLoading(true);
    try {
      // In production: API call to start trip
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedTrip = { ...trip, status: 'active' as const };
      setCurrentTrip(updatedTrip);
      setAllTrips(prev => prev.map(t => t.id === trip.id ? updatedTrip : t));
      
      toast({
        title: "Trip Started",
        description: `${trip.name} is now active. Stay safe!`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start trip. Please try again.",
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

  if (!currentTrip && allTrips.length === 0) {
    return (
      <div className="mobile-screen bg-background">
        <div className="mobile-container">
          {/* Header */}
          <div className="flex items-center justify-between py-4 px-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Trip Management</h1>
            <div className="w-10" />
          </div>

          {/* No trips state */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Trips Found</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first trip to start safety monitoring and tracking.
                </p>
                <Dialog open={showNewTripDialog} onOpenChange={setShowNewTripDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Trip
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Trip</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="tripName">Trip Name *</Label>
                        <Input
                          id="tripName"
                          value={newTripForm.name}
                          onChange={(e) => setNewTripForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Northeast Cultural Tour"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="datetime-local"
                            value={newTripForm.startDate}
                            onChange={(e) => setNewTripForm(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date *</Label>
                          <Input
                            id="endDate"
                            type="datetime-local"
                            value={newTripForm.endDate}
                            onChange={(e) => setNewTripForm(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="destinations">Destinations (comma-separated)</Label>
                        <Input
                          id="destinations"
                          value={newTripForm.destinations}
                          onChange={(e) => setNewTripForm(prev => ({ ...prev, destinations: e.target.value }))}
                          placeholder="e.g., Guwahati, Kaziranga, Shillong"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContacts">Emergency Contacts (comma-separated)</Label>
                        <Input
                          id="emergencyContacts"
                          value={newTripForm.emergencyContacts}
                          onChange={(e) => setNewTripForm(prev => ({ ...prev, emergencyContacts: e.target.value }))}
                          placeholder="e.g., +91-9876543210, +91-9876543211"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={newTripForm.notes}
                          onChange={(e) => setNewTripForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Any special requirements or notes..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowNewTripDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={handleCreateNewTrip}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Creating...' : 'Create Trip'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Show trip list if no active trip but trips exist
  if (!currentTrip && allTrips.length > 0) {
    return (
      <div className="mobile-screen bg-background">
        <div className="mobile-container">
          {/* Header */}
          <div className="flex items-center justify-between py-4 px-1 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Your Trips</h1>
            <Dialog open={showNewTripDialog} onOpenChange={setShowNewTripDialog}>
              <DialogTrigger asChild>
                <Button size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Trip</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tripName">Trip Name *</Label>
                    <Input
                      id="tripName"
                      value={newTripForm.name}
                      onChange={(e) => setNewTripForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Northeast Cultural Tour"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={newTripForm.startDate}
                        onChange={(e) => setNewTripForm(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={newTripForm.endDate}
                        onChange={(e) => setNewTripForm(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="destinations">Destinations (comma-separated)</Label>
                    <Input
                      id="destinations"
                      value={newTripForm.destinations}
                      onChange={(e) => setNewTripForm(prev => ({ ...prev, destinations: e.target.value }))}
                      placeholder="e.g., Guwahati, Kaziranga, Shillong"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContacts">Emergency Contacts (comma-separated)</Label>
                    <Input
                      id="emergencyContacts"
                      value={newTripForm.emergencyContacts}
                      onChange={(e) => setNewTripForm(prev => ({ ...prev, emergencyContacts: e.target.value }))}
                      placeholder="e.g., +91-9876543210, +91-9876543211"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={newTripForm.notes}
                      onChange={(e) => setNewTripForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setShowNewTripDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleCreateNewTrip}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Trip'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Trip List */}
          <div className="space-y-4 mb-20">
            {allTrips.map((trip) => (
              <Card key={trip.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{trip.name}</CardTitle>
                      <CardDescription>
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(trip.status) as any}>
                      {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {trip.destinations.length} destinations
                    </div>
                    
                    <div className="flex gap-2">
                      {trip.status === 'planned' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleStartTrip(trip)}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start Trip
                        </Button>
                      )}
                      {trip.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setCurrentTrip(trip)}
                          className="flex-1"
                        >
                          View Active
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteTrip(trip.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <BottomNavigation />
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

      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default TripManagement;