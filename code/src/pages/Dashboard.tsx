import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  Phone, 
  Settings, 
  User, 
  Navigation,
  Clock,
  Battery,
  Bell,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmergencyService, type EmergencyData } from "@/services/emergencyService";

// Mock data for demo - In production, this would come from your backend
const mockUserLocation = { lat: 19.0760, lng: 72.8777 }; // Mumbai
const mockZones = [
  { 
    id: 1, 
    type: "safe", 
    name: "Tourist Hub", 
    lat: 19.0720, 
    lng: 72.8825, 
    radius: 500,
    color: "#22c55e"
  },
  { 
    id: 2, 
    type: "moderate", 
    name: "Market Area", 
    lat: 19.0760, 
    lng: 72.8850, 
    radius: 300,
    color: "#f59e0b"
  },
  { 
    id: 3, 
    type: "high-risk", 
    name: "Construction Zone", 
    lat: 19.0800, 
    lng: 72.8900, 
    radius: 200,
    color: "#ef4444"
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [safetyStatus, setSafetyStatus] = useState<"safe" | "moderate" | "danger">("safe");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sosPressed, setSosPressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(mockUserLocation);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // Fallback to mock location if geolocation fails
          console.log("Using mock location");
        }
      );
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapLoaded(true);
  }, []);

  const handleSOSPress = async () => {
    setSosPressed(true);
    
    // Prepare emergency data
    const emergencyData: EmergencyData = {
      location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      timestamp: new Date().toISOString(),
      emergencyType: 'SOS_BUTTON',
      userId: 'user_123', // This would come from auth context
      digitalId: 'TST2024001',
      additionalInfo: `Safety status: ${safetyStatus}, Current zone: Tourist Hub Area`
    };
    
    try {
      const emergencyService = EmergencyService.getInstance();
      const success = await emergencyService.sendEmergencyAlert(emergencyData);
      
      if (success) {
        toast({
          title: t('dashboard.emergencyAlert'),
          description: t('dashboard.emergencyDesc'),
          variant: "destructive",
        });
        
        // Also log to blockchain for tamper-proof record
        await emergencyService.logIncidentToBlockchain(emergencyData);
      } else {
        toast({
          title: "Emergency Alert Queued",
          description: "Alert saved locally and will be sent when connection is restored.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Emergency alert failed:', error);
      toast({
        title: "Emergency Alert Failed",
        description: "Please try again or contact emergency services directly.",
        variant: "destructive",
      });
    }
    
    // Reset after 3 seconds for demo
    setTimeout(() => setSosPressed(false), 3000);
  };

  const getSafetyColor = (status: string) => {
    switch (status) {
      case "safe": return "success";
      case "moderate": return "warning";
      case "danger": return "danger";
      default: return "success";
    }
  };

  const getSafetyText = (status: string) => {
    switch (status) {
      case "safe": return t('dashboard.safeZone');
      case "moderate": return t('dashboard.moderateRisk');
      case "danger": return t('dashboard.highRisk');
      default: return t('dashboard.safeZone');
    }
  };

  return (
    <div className="mobile-viewport bg-background relative overflow-hidden">
      {/* Full-screen Map */}
      <div className="absolute inset-0 map-mobile">
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
          onLoad={() => setMapLoaded(true)}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={15}
            onLoad={onMapLoad}
            options={mapOptions}
          >
            {/* User Location Marker */}
            <Marker
              position={userLocation}
              icon={{
                url: "data:image/svg+xml;base64," + btoa(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
                    <circle cx="12" cy="12" r="3" fill="#ffffff"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
              }}
            />
            
            {/* Geo-fenced Zones */}
            {mockZones.map((zone) => (
              <Circle
                key={zone.id}
                center={{ lat: zone.lat, lng: zone.lng }}
                radius={zone.radius}
                options={{
                  fillColor: zone.color,
                  fillOpacity: 0.2,
                  strokeColor: zone.color,
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-3 md:p-4 mobile-safe-area">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20 bg-black/20 touch-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <Menu className="w-4 h-4 md:w-5 md:h-5" />}
            </Button>
            <div className="text-white">
              <h2 className="text-sm md:text-base font-semibold">John Doe</h2>
              <p className="text-xs md:text-sm opacity-90">Tourist ID: #TST2024001</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 bg-black/20"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Safety Status Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className={`w-6 h-6 text-${getSafetyColor(safetyStatus)}`} />
                <div>
                  <p className="font-medium text-foreground">
                    {getSafetyText(safetyStatus)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentTime.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Badge variant={getSafetyColor(safetyStatus) as any} className="text-xs">
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Menu */}
      {menuOpen && (
        <div className="absolute top-0 left-0 bottom-0 z-30 w-80 bg-white/95 backdrop-blur-sm border-r shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Menu</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Card className="p-4 cursor-pointer hover:bg-accent/5 transition-colors" 
                    onClick={() => navigate('/trips')}>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-medium">{t('navigation.trips')}</h4>
                    <p className="text-sm text-muted-foreground">Manage your trip</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => navigate('/alerts')}>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-warning" />
                  <div>
                    <h4 className="font-medium">{t('navigation.alerts')}</h4>
                    <p className="text-sm text-muted-foreground">Safety notifications</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 cursor-pointer hover:bg-accent/5 transition-colors"
                    onClick={() => navigate('/profile')}>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-accent" />
                  <div>
                    <h4 className="font-medium">{t('navigation.profile')}</h4>
                    <p className="text-sm text-muted-foreground">Digital ID & settings</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Legend - Responsive */}
      <div className="map-controls-mobile">
        <Card className="bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-2 md:p-3">
            <div className="space-y-1 md:space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-success rounded-full"></div>
                <span className="hide-mobile">{t('dashboard.safeZoneLabel')}</span>
                <span className="show-mobile">Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-warning rounded-full"></div>
                <span className="hide-mobile">{t('dashboard.moderateRiskLabel')}</span>
                <span className="show-mobile">Moderate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-danger rounded-full"></div>
                <span className="hide-mobile">{t('dashboard.highRiskLabel')}</span>
                <span className="show-mobile">High Risk</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency SOS Button - Mobile Optimized */}
      <div className="absolute bottom-20 md:bottom-24 left-1/2 transform -translate-x-1/2 z-20">
        <Button
          className={`btn-mobile-emergency ${sosPressed ? 'animate-pulse scale-110' : 'pulse-emergency hover:scale-105'} 
                     transition-all duration-300 shadow-2xl`}
          onClick={handleSOSPress}
          disabled={sosPressed}
        >
          {sosPressed ? (
            <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />
          ) : (
            <>
              <Phone className="w-5 h-5 md:w-6 md:h-6" />
              <span className="sr-only">Emergency SOS</span>
            </>
          )}
        </Button>
      </div>

      {/* Location Info Card - Mobile Status */}
      <div className="map-status-mobile">
        <Card className="mobile-card bg-white/90 backdrop-blur-sm border-0">
          <CardContent className="p-2 md:p-3">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              <span className="hide-mobile">{t('dashboard.currentLocation')}: {t('dashboard.touristHub')}</span>
              <span className="show-mobile">Tourist Hub Area</span>
              <Badge variant="outline" className="ml-auto text-xs">
                <Navigation className="w-2 h-2 md:w-3 md:h-3 mr-1" />
                <span className="hide-mobile">{t('dashboard.gpsActive')}</span>
                <span className="show-mobile">GPS</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {safetyStatus !== "safe" && (
        <div className="absolute top-24 md:top-32 left-3 right-3 md:left-4 md:right-4 z-20">
          <Alert className="bg-warning/90 border-warning backdrop-blur-sm">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
            <AlertDescription className="text-xs md:text-sm">
              {t('dashboard.monitoredArea')}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Status Bar - Mobile Safe Area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-primary text-primary-foreground px-3 md:px-4 py-2 mobile-safe-area">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hide-mobile">{t('dashboard.digitalIdActive')}</span>
            <span className="show-mobile">ID Active</span>
            <div className="flex items-center gap-1">
              <Battery className="w-3 h-3" />
              <span className="hide-mobile">{t('dashboard.gpsConnected')}</span>
              <span className="show-mobile">Connected</span>
            </div>
          </div>
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;