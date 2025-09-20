import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Bell, 
  Settings,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface TopNavigationProps {
  title?: string;
  showBack?: boolean;
  showStatus?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ 
  title, 
  showBack = true, 
  showStatus = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();

  const getPageTitle = () => {
    if (title) return title;
    
    switch (location.pathname) {
      case '/dashboard':
        return 'Safe Traveler';
      case '/profile':
        return 'Profile';
      case '/profile-setup':
        return 'Setup';
      case '/trips':
        return 'My Trips';
      case '/alerts':
        return 'Alerts';
      default:
        return 'Safe Traveler';
    }
  };

  const handleBack = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      // Don't navigate away from main dashboard
      return;
    }
    navigate(-1);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/90 backdrop-blur-md border-b border-primary/20 max-w-md mx-auto">
      {/* Status Bar */}
      {showStatus && (
        <div className="flex items-center justify-between px-4 py-1 text-xs text-primary-foreground/80">
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <span>STB</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{getCurrentTime()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
            <span>85%</span>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && location.pathname !== '/dashboard' && location.pathname !== '/' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-primary-foreground">
                {getPageTitle()}
              </h1>
              {userProfile && (
                <p className="text-xs text-primary-foreground/70">
                  {userProfile.name || currentUser?.email?.split('@')[0]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Connection Status */}
          <Badge variant="secondary" className="bg-success/20 text-success text-xs">
            <div className="w-2 h-2 bg-success rounded-full mr-1 animate-pulse" />
            Online
          </Badge>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => navigate('/alerts')}
          >
            <Bell className="w-4 h-4" />
          </Button>
          
          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => navigate('/profile')}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;