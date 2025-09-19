import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft,
  Bell,
  AlertTriangle,
  Shield,
  MapPin,
  Clock,
  Info,
  CheckCircle,
  X,
  Filter,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SafetyAlert {
  id: string;
  type: 'geofencing' | 'weather' | 'security' | 'traffic' | 'emergency' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  isRead: boolean;
  isActive: boolean;
  source: string;
  actionRequired?: boolean;
}

const AlertsFeed = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock alerts data - in production this would come from your backend
  useEffect(() => {
    const mockAlerts: SafetyAlert[] = [
      {
        id: 'alert_001',
        type: 'geofencing',
        severity: 'medium',
        title: 'Geo-fencing Alert',
        message: 'You have entered a moderate risk area near Crawford Market. Stay alert and follow local guidelines.',
        location: {
          lat: 19.0760,
          lng: 72.8850,
          address: 'Crawford Market, Fort, Mumbai'
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        isRead: false,
        isActive: true,
        source: 'Geo-fencing System',
        actionRequired: false
      },
      {
        id: 'alert_002',
        type: 'weather',
        severity: 'low',
        title: 'Weather Advisory',
        message: 'Light rain expected in your area between 3:00 PM - 5:00 PM. Consider carrying an umbrella.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: true,
        isActive: false,
        source: 'Weather Service'
      },
      {
        id: 'alert_003',
        type: 'security',
        severity: 'high',
        title: 'Security Advisory',
        message: 'Increased security presence reported near tourist areas due to local event. No immediate threat.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        isRead: true,
        isActive: false,
        source: 'Local Authorities'
      },
      {
        id: 'alert_004',
        type: 'traffic',
        severity: 'medium',
        title: 'Traffic Update',
        message: 'Heavy traffic reported on Marine Drive due to construction work. Consider alternate routes.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        isRead: true,
        isActive: true,
        source: 'Traffic Management'
      },
      {
        id: 'alert_005',
        type: 'system',
        severity: 'low',
        title: 'System Notification',
        message: 'Your emergency contact information has been successfully updated.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: true,
        isActive: false,
        source: 'Tourist Safety App'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const refreshAlerts = async () => {
    setIsLoading(true);
    try {
      // In production: fetch fresh alerts from backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Alerts Refreshed",
        description: "Latest safety alerts have been loaded.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh alerts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Dismissed",
      description: "The alert has been removed from your feed.",
      variant: "default",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'geofencing': return <MapPin className="w-4 h-4" />;
      case 'weather': return <Info className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'traffic': return <AlertTriangle className="w-4 h-4" />;
      case 'emergency': return <Bell className="w-4 h-4" />;
      case 'system': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filterType === 'all' || alert.type === filterType
  );

  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  const activeAlerts = alerts.filter(alert => alert.isActive);

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
          <h1 className="text-xl font-semibold">{t('alerts.title')}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20 ml-auto"
            onClick={refreshAlerts}
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary-foreground">{alerts.length}</div>
              <div className="text-xs opacity-90">Total Alerts</div>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary-foreground">{unreadCount}</div>
              <div className="text-xs opacity-90">Unread</div>
            </CardContent>
          </Card>
          <Card className="bg-primary-foreground/10 border-primary-foreground/20">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary-foreground">{activeAlerts.length}</div>
              <div className="text-xs opacity-90">Active</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mobile-container flex-1 p-4 space-y-4">
        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'geofencing', label: 'Geo-fencing' },
            { key: 'weather', label: 'Weather' },
            { key: 'security', label: 'Security' },
            { key: 'traffic', label: 'Traffic' },
            { key: 'system', label: 'System' }
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={filterType === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(filter.key)}
              className="whitespace-nowrap"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Active Alerts
            </h3>
            {activeAlerts.map((alert) => (
              <Alert key={`active-${alert.id}`} className="mb-3 bg-warning/10 border-warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <strong>{alert.title}</strong>
                      <p className="mt-1">{alert.message}</p>
                      {alert.location && (
                        <p className="text-xs text-muted-foreground mt-2">
                          📍 {alert.location.address}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* All Alerts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">All Alerts</h3>
          
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('alerts.noAlerts')}</h3>
                <p className="text-muted-foreground">
                  You'll receive notifications here when we detect safety-related updates in your area.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`transition-all ${!alert.isRead ? 'border-primary/50 bg-primary/5' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${
                        alert.severity === 'critical' ? 'bg-destructive/20 text-destructive' :
                        alert.severity === 'high' ? 'bg-danger/20 text-danger' :
                        alert.severity === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-secondary/20 text-secondary-foreground'
                      }`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                              {alert.severity.toUpperCase()}
                            </Badge>
                            {!alert.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(alert.id)}
                                className="text-xs"
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dismissAlert(alert.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {alert.message}
                        </p>
                        
                        {alert.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location.address}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            </div>
                            <span>Source: {alert.source}</span>
                          </div>
                          {alert.isActive && (
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsFeed;