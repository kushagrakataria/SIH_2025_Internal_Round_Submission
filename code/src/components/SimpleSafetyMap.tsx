import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Navigation, 
  Users,
  Phone,
  Map as MapIcon
} from "lucide-react";

const RISK_LEVELS = {
  LOW: { color: "#22c55e", label: "Safe Zone", level: 1 },
  MEDIUM: { color: "#f59e0b", label: "Caution Zone", level: 2 },
  HIGH: { color: "#ef4444", label: "High Risk Zone", level: 3 },
  CRITICAL: { color: "#dc2626", label: "Danger Zone", level: 4 }
};

const SAFETY_ZONES = [
  // Safe/Tourist Zones
  {
    id: 1,
    name: "Golden Triangle - Delhi",
    location: [28.6139, 77.2090],
    riskLevel: "LOW",
    population: 32000000,
    alerts: 0,
    description: "Major tourist circuit with excellent security infrastructure",
    facilities: ["Tourist Police", "Medical Centers", "24/7 Helpline", "Embassy Services"],
    type: "Tourist Hub",
    riskTags: ["Safe Zone"]
  },
  {
    id: 2,
    name: "Gateway of India - Mumbai",
    location: [18.9220, 72.8347],
    riskLevel: "LOW",
    population: 20000000,
    alerts: 1,
    description: "Iconic tourist destination with high security presence",
    facilities: ["Coastal Guard", "Tourist Police", "Hospitals", "Transportation Hub"],
    type: "Tourist Hub",
    riskTags: ["Safe Zone", "Coastal Area"]
  },
  {
    id: 3,
    name: "IT Corridor - Bangalore",
    location: [12.9716, 77.5946],
    riskLevel: "LOW",
    population: 13000000,
    alerts: 0,
    description: "Modern business district with advanced safety systems",
    facilities: ["Corporate Security", "Medical Facilities", "Emergency Response"],
    type: "Business District",
    riskTags: ["Safe Zone", "Urban Area"]
  },

  // Medium Risk Zones
  {
    id: 4,
    name: "Hill Station - Shimla",
    location: [31.1048, 77.1734],
    riskLevel: "MEDIUM",
    population: 200000,
    alerts: 2,
    description: "Mountain terrain - weather dependent risks",
    facilities: ["Mountain Rescue", "Weather Monitoring", "Medical Center"],
    type: "Hill Station",
    riskTags: ["Weather Risk", "Mountain Area"]
  },
  {
    id: 5,
    name: "Desert Region - Jaisalmer",
    location: [26.9157, 70.9083],
    riskLevel: "MEDIUM",
    population: 65000,
    alerts: 3,
    description: "Desert conditions - extreme temperatures possible",
    facilities: ["Desert Patrol", "Water Stations", "Emergency Shelter"],
    type: "Desert Area",
    riskTags: ["Extreme Weather", "Remote Area"]
  },
  {
    id: 6,
    name: "Monsoon Zone - Cherrapunji",
    location: [25.3000, 91.7000],
    riskLevel: "MEDIUM",
    population: 12000,
    alerts: 4,
    description: "Heavy rainfall region - flooding possible during monsoon",
    facilities: ["Flood Monitoring", "Emergency Shelter", "Communication Tower"],
    type: "Weather Sensitive",
    riskTags: ["Flood Risk", "Monsoon Area"]
  },

  // High Risk Zones
  {
    id: 7,
    name: "Border Region - Wagah",
    location: [31.6050, 74.5720],
    riskLevel: "HIGH",
    population: 5000,
    alerts: 6,
    description: "International border - restricted access and security protocols",
    facilities: ["Border Security", "Military Outpost", "Restricted Zone Monitoring"],
    type: "Border Area",
    riskTags: ["Border Security", "Restricted Access"]
  },
  {
    id: 8,
    name: "Earthquake Zone - Kutch",
    location: [23.7337, 69.8597],
    riskLevel: "HIGH",
    population: 45000,
    alerts: 5,
    description: "Seismically active region - earthquake preparedness required",
    facilities: ["Seismic Monitoring", "Emergency Response", "Disaster Management"],
    type: "Seismic Zone",
    riskTags: ["Earthquake Risk", "Geological Hazard"]
  },
  {
    id: 9,
    name: "Tribal Area - Bastar",
    location: [19.3205, 81.9614],
    riskLevel: "HIGH",
    population: 25000,
    alerts: 7,
    description: "Remote tribal region - limited connectivity and infrastructure",
    facilities: ["Tribal Liaison", "Basic Medical", "Communication Post"],
    type: "Tribal Region",
    riskTags: ["Remote Area", "Limited Infrastructure"]
  },

  // Critical Risk Zones
  {
    id: 10,
    name: "Glacier Zone - Siachen Area",
    location: [35.5000, 77.0000],
    riskLevel: "CRITICAL",
    population: 500,
    alerts: 10,
    description: "Extreme altitude and weather - military controlled area",
    facilities: ["Military Base", "High Altitude Medical", "Emergency Evacuation"],
    type: "Military Zone",
    riskTags: ["Military Area", "Extreme Weather", "High Altitude"]
  },
  {
    id: 11,
    name: "Cyclone Prone - Paradip",
    location: [20.3101, 86.6241],
    riskLevel: "CRITICAL",
    population: 75000,
    alerts: 8,
    description: "Cyclone-prone coastal area - seasonal evacuation protocols",
    facilities: ["Cyclone Shelter", "Coast Guard", "Disaster Management", "Evacuation Routes"],
    type: "Cyclone Zone",
    riskTags: ["Cyclone Risk", "Coastal Hazard", "Evacuation Zone"]
  },
  {
    id: 12,
    name: "Wildlife Corridor - Sundarbans",
    location: [21.9497, 88.9468],
    riskLevel: "CRITICAL",
    population: 8000,
    alerts: 9,
    description: "Dense mangrove forest with wildlife - crocodile and tiger habitat",
    facilities: ["Forest Guard Station", "Wildlife Rescue", "Boat Patrol"],
    type: "Wildlife Reserve",
    riskTags: ["Wildlife Danger", "Dense Forest", "Water Bodies"]
  }
];

const RECENT_ALERTS = [
  {
    id: 1,
    type: "Weather",
    message: "Cyclone warning issued for Odisha coast - tourists advised to evacuate",
    time: "30 minutes ago",
    severity: "high",
    location: "Paradip"
  },
  {
    id: 2,
    type: "Security",
    message: "Enhanced security measures at Delhi monuments during festival season",
    time: "2 hours ago",
    severity: "low",
    location: "Delhi"
  },
  {
    id: 3,
    type: "Geological",
    message: "Minor tremors detected in Kutch region - no immediate danger",
    time: "4 hours ago",
    severity: "medium",
    location: "Gujarat"
  },
  {
    id: 4,
    type: "Wildlife",
    message: "Tiger movement reported near tourist trails in Sundarbans",
    time: "6 hours ago",
    severity: "high",
    location: "West Bengal"
  },
  {
    id: 5,
    type: "Transport",
    message: "Landslide blocks mountain highway to Shimla - alternate routes available",
    time: "8 hours ago",
    severity: "medium",
    location: "Himachal Pradesh"
  },
  {
    id: 6,
    type: "Border",
    message: "Border area restrictions updated - permit verification required",
    time: "12 hours ago",
    severity: "high",
    location: "Punjab Border"
  }
];

export const SimpleSafetyMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [activeRiskFilter, setActiveRiskFilter] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Demo location for testing
          setCurrentLocation([28.6139, 77.2090]); // Delhi coordinates
        }
      );
    } else {
      // Fallback for demo
      setCurrentLocation([28.6139, 77.2090]);
    }
  };

  const handleEmergencyCall = () => {
    // In production, this would trigger actual emergency services
    alert("🚨 Emergency services contacted! Help is on the way.");
  };

  const filteredZones = activeRiskFilter 
    ? SAFETY_ZONES.filter(zone => zone.riskLevel === activeRiskFilter)
    : SAFETY_ZONES;

  const getStats = () => {
    const total = SAFETY_ZONES.length;
    const safe = SAFETY_ZONES.filter(z => z.riskLevel === 'LOW').length;
    const caution = SAFETY_ZONES.filter(z => z.riskLevel === 'MEDIUM').length;
    const high = SAFETY_ZONES.filter(z => z.riskLevel === 'HIGH').length;
    const critical = SAFETY_ZONES.filter(z => z.riskLevel === 'CRITICAL').length;
    const totalAlerts = SAFETY_ZONES.reduce((sum, z) => sum + z.alerts, 0);
    
    return { total, safe, caution, high, critical, totalAlerts };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.safe}</div>
            <div className="text-xs text-gray-500">Safe Zones</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.caution}</div>
            <div className="text-xs text-gray-500">Caution Zones</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.high + stats.critical}</div>
            <div className="text-xs text-gray-500">High Risk Zones</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalAlerts}</div>
            <div className="text-xs text-gray-500">Active Alerts</div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Level Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeRiskFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveRiskFilter(null)}
            >
              All Zones ({SAFETY_ZONES.length})
            </Button>
            {Object.entries(RISK_LEVELS).map(([key, level]) => (
              <Button
                key={key}
                variant={activeRiskFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveRiskFilter(activeRiskFilter === key ? null : key)}
                style={{
                  backgroundColor: activeRiskFilter === key ? level.color : undefined,
                  borderColor: level.color
                }}
              >
                {level.label} ({SAFETY_ZONES.filter(z => z.riskLevel === key).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Map Placeholder with Interactive Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            India Tourist Safety Map - Interactive Risk Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-br from-blue-50 via-green-50 to-amber-50 rounded-lg h-96 border-2 border-dashed border-gray-300 overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* India outline approximation */}
                <path
                  d="M80 80 L120 60 L160 70 L200 50 L240 60 L280 80 L300 120 L320 160 L300 200 L280 220 L240 240 L200 250 L160 240 L120 230 L100 200 L80 160 Z"
                  fill="#e5e7eb"
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Interactive Safety Zones */}
            <div className="absolute inset-0 p-4">
              {filteredZones.map((zone, index) => {
                const riskInfo = RISK_LEVELS[zone.riskLevel as keyof typeof RISK_LEVELS];
                const x = (zone.location[1] - 68) * 4; // Longitude scaling
                const y = (35 - zone.location[0]) * 8; // Latitude scaling (inverted)
                
                return (
                  <div
                    key={zone.id}
                    className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 hover:scale-150 ${
                      selectedZone === zone.id ? 'scale-150 ring-2 ring-white' : ''
                    }`}
                    style={{
                      backgroundColor: riskInfo.color,
                      left: `${Math.min(Math.max(x, 10), 90)}%`,
                      top: `${Math.min(Math.max(y, 10), 85)}%`,
                      boxShadow: `0 0 10px ${riskInfo.color}50`
                    }}
                    onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                    title={`${zone.name} - ${riskInfo.label}`}
                  >
                    {zone.alerts > 5 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">!</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-white/95 rounded-lg p-3 shadow-sm">
                <h4 className="font-semibold text-sm mb-2">Risk Levels</h4>
                {Object.entries(RISK_LEVELS).map(([key, level]) => (
                  <div key={key} className="flex items-center gap-2 text-xs mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: level.color }}
                    />
                    <span>{level.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Info */}
            <div className="absolute top-4 right-4">
              <Button 
                onClick={handleGetLocation}
                variant="outline"
                size="sm"
                className="bg-white/90"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Find My Location
              </Button>
            </div>

            {currentLocation && (
              <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
                📍 Your Location: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
              </div>
            )}

            {/* Zone Details Popup */}
            {selectedZone && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
                {(() => {
                  const zone = filteredZones.find(z => z.id === selectedZone);
                  if (!zone) return null;
                  const riskInfo = RISK_LEVELS[zone.riskLevel as keyof typeof RISK_LEVELS];
                  
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-sm">{zone.name}</h4>
                        <Badge 
                          variant="secondary"
                          style={{ 
                            backgroundColor: riskInfo.color + '20',
                            color: riskInfo.color
                          }}
                        >
                          {riskInfo.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{zone.description}</p>
                      <div className="flex items-center gap-3 text-xs mb-2">
                        <span>👥 {zone.population.toLocaleString()}</span>
                        <span>⚠️ {zone.alerts} alerts</span>
                        <span>📍 {zone.type}</span>
                      </div>
                      {zone.riskTags && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {zone.riskTags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                          Navigate
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                          Alerts
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                          Contact
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Safety Zones Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => {
          const riskInfo = RISK_LEVELS[zone.riskLevel as keyof typeof RISK_LEVELS];
          return (
            <Card 
              key={zone.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedZone === zone.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">{zone.type}</p>
                  </div>
                  <Badge 
                    variant="secondary"
                    style={{ 
                      backgroundColor: riskInfo.color + '20',
                      color: riskInfo.color,
                      border: `1px solid ${riskInfo.color}`
                    }}
                  >
                    {riskInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{zone.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {zone.population.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {zone.alerts} alerts
                  </div>
                </div>

                {selectedZone === zone.id && (
                  <div className="pt-3 border-t space-y-2">
                    <p className="font-medium text-sm">Available Facilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.facilities.map((facility, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                    
                    {zone.riskTags && (
                      <div>
                        <p className="font-medium text-sm">Risk Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {zone.riskTags.map((tag, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_ALERTS.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-red-500' :
                  alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {alert.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {alert.location}
                    </Badge>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Button */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">Emergency Assistance</h3>
              <p className="text-sm text-red-600 mt-1">
                In case of emergency, press the button below for immediate help
              </p>
            </div>
            <Button 
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
              size="lg"
            >
              <Phone className="h-4 w-4 mr-2" />
              🚨 EMERGENCY CALL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleSafetyMap;