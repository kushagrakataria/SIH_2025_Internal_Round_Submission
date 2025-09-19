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
  Activity,
  Eye
} from "lucide-react";

// Mock data for demonstration
const mockTouristData = [
  {
    id: 1,
    name: "Tourist Group A",
    location: "Guwahati",
    status: "Safe",
    count: 12,
    lastUpdate: "2 min ago",
    digitalId: "TG001-2025"
  },
  {
    id: 2,
    name: "Solo Traveler",
    location: "Tezpur",
    status: "Alert",
    count: 1,
    lastUpdate: "5 min ago",
    digitalId: "ST002-2025"
  },
  {
    id: 3,
    name: "Family Trip",
    location: "Kaziranga",
    status: "Safe",
    count: 5,
    lastUpdate: "1 min ago",
    digitalId: "FT003-2025"
  }
];

const mockIncidents = [
  {
    id: 1,
    type: "Panic Alert",
    location: "Tezpur Border",
    time: "10:15 AM",
    severity: "High",
    tourist: "Solo Traveler (ST002-2025)"
  },
  {
    id: 2,
    type: "Weather Warning",
    location: "Kaziranga National Park",
    time: "09:30 AM",
    severity: "Medium",
    tourist: "Multiple Groups"
  },
  {
    id: 3,
    type: "Route Deviation",
    location: "NH-27 Bypass",
    time: "08:45 AM",
    severity: "Low",
    tourist: "Tourist Group A (TG001-2025)"
  }
];

interface PoliceAdminDashboardProps {
  height?: string;
}

const PoliceAdminDashboard: React.FC<PoliceAdminDashboardProps> = ({ height = "500px" }) => {
  const [selectedTourist, setSelectedTourist] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'tourists' | 'incidents' | 'analytics'>('tourists');

  const generateEFIR = (incident: any) => {
    alert(`🚨 Generating E-FIR for:\n\nIncident: ${incident.type}\nLocation: ${incident.location}\nTime: ${incident.time}\nTourist: ${incident.tourist}\n\nThis would normally:\n- Create digital FIR record\n- Notify relevant authorities\n- Log in blockchain system\n- Send alerts to emergency contacts`);
  };

  const viewDigitalID = (tourist: any) => {
    alert(`👤 Digital ID Details:\n\nName: ${tourist.name}\nID: ${tourist.digitalId}\nStatus: ${tourist.status}\nLocation: ${tourist.location}\nLast Update: ${tourist.lastUpdate}\n\nThis would normally:\n- Show complete digital profile\n- Display emergency contacts\n- Show travel itinerary\n- Access health information`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Police/Admin Dashboard
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">
              {mockIncidents.filter(i => i.severity === 'High').length} Critical
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {mockTouristData.reduce((sum, group) => sum + group.count, 0)} Tourists Tracked
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button 
            size="sm" 
            variant={viewMode === 'tourists' ? 'default' : 'outline'}
            onClick={() => setViewMode('tourists')}
          >
            <Users className="w-4 h-4 mr-1" />
            Tourists
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'incidents' ? 'default' : 'outline'}
            onClick={() => setViewMode('incidents')}
          >
            <AlertTriangle className="w-4 h-4 mr-1" />
            Incidents
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            onClick={() => setViewMode('analytics')}
          >
            <Activity className="w-4 h-4 mr-1" />
            Analytics
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div style={{ height, overflow: 'auto' }}>
          
          {/* Tourist Tracking View */}
          {viewMode === 'tourists' && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm mb-3">Live Tourist Tracking</h3>
              {mockTouristData.map((tourist) => (
                <div 
                  key={tourist.id} 
                  className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedTourist(tourist)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{tourist.name}</span>
                      <Badge 
                        variant={tourist.status === 'Safe' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {tourist.status}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tourist.count} {tourist.count === 1 ? 'person' : 'people'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    📍 {tourist.location} • ID: {tourist.digitalId} • Updated {tourist.lastUpdate}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewDigitalID(tourist);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Digital ID
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`📞 Contacting ${tourist.name}...\n\nThis would normally:\n- Call registered phone number\n- Send SMS alert\n- Notify emergency contacts\n- Log contact attempt`);
                      }}
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Incident Management View */}
          {viewMode === 'incidents' && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm mb-3">Active Incidents & Alerts</h3>
              {mockIncidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedIncident(incident)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{incident.type}</span>
                      <Badge 
                        variant={
                          incident.severity === 'High' ? 'destructive' : 
                          incident.severity === 'Medium' ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{incident.time}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    📍 {incident.location} • {incident.tourist}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateEFIR(incident);
                      }}
                    >
                      📋 Generate E-FIR
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`🚨 Dispatching response team to ${incident.location}...\n\nThis would normally:\n- Alert nearest patrol units\n- Coordinate with local authorities\n- Send emergency medical team if needed\n- Update incident status`);
                      }}
                    >
                      🚔 Dispatch Response
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Analytics View */}
          {viewMode === 'analytics' && (
            <div className="space-y-4">
              <h3 className="font-medium text-sm mb-3">Analytics & Reports</h3>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">18</div>
                  <div className="text-sm text-muted-foreground">Total Tourists</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-sm text-muted-foreground">Active Alerts</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-muted-foreground">High-Risk Zones</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-muted-foreground">Response Teams</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>🟢 Tourist group checked in - Kaziranga</span>
                    <span className="text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🔴 Panic button activated - Tezpur</span>
                    <span className="text-muted-foreground">5 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟡 Weather alert issued - Majuli</span>
                    <span className="text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🟢 E-FIR generated - Incident #1247</span>
                    <span className="text-muted-foreground">30 min ago</span>
                  </div>
                </div>
              </div>

              {/* Admin Controls */}
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Admin Controls</h4>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    👥 Manage Police Accounts
                  </Button>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    📊 Export Reports
                  </Button>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    ⚙️ System Settings
                  </Button>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    🔍 Audit Logs
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Tourist Details */}
        {selectedTourist && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{selectedTourist.name}</h4>
              <Badge 
                variant={selectedTourist.status === 'Safe' ? 'default' : 'destructive'}
              >
                {selectedTourist.status}
              </Badge>
            </div>
            <div className="text-sm space-y-1">
              <div>📍 Location: {selectedTourist.location}</div>
              <div>🆔 Digital ID: {selectedTourist.digitalId}</div>
              <div>👥 Group Size: {selectedTourist.count}</div>
              <div>🕐 Last Update: {selectedTourist.lastUpdate}</div>
            </div>
            <Button 
              size="sm" 
              className="mt-2 w-full" 
              onClick={() => setSelectedTourist(null)}
            >
              Close
            </Button>
          </div>
        )}

        {/* Selected Incident Details */}
        {selectedIncident && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{selectedIncident.type}</h4>
              <Badge 
                variant={
                  selectedIncident.severity === 'High' ? 'destructive' : 
                  selectedIncident.severity === 'Medium' ? 'secondary' : 'outline'
                }
              >
                {selectedIncident.severity}
              </Badge>
            </div>
            <div className="text-sm space-y-1">
              <div>📍 Location: {selectedIncident.location}</div>
              <div>🕐 Time: {selectedIncident.time}</div>
              <div>👤 Tourist: {selectedIncident.tourist}</div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => generateEFIR(selectedIncident)}
              >
                Generate E-FIR
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedIncident(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoliceAdminDashboard;