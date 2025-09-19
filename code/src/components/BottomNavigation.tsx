import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Navigation, 
  AlertTriangle, 
  User, 
  Phone 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BottomNavigationProps {
  onSOS?: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onSOS }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSOSActive, setIsSOSActive] = useState(false);

  const handleSOS = async () => {
    if (isSOSActive) return; // Prevent multiple activations
    
    setIsSOSActive(true);
    
    try {
      // Show immediate feedback
      toast({
        title: "🚨 SOS ACTIVATED",
        description: "Emergency services have been notified. Help is on the way!",
        variant: "destructive",
      });

      if (onSOS) {
        onSOS();
      } else {
        // Production SOS logic would go here:
        // 1. Get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Emergency location:', { latitude, longitude });
              
              // 2. Send to emergency services API
              // 3. Notify emergency contacts
              // 4. Log to Firebase
              // 5. Send SMS alerts
              
              toast({
                title: "📍 Location Shared",
                description: `Emergency services notified at: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              });
            },
            (error) => {
              console.error('Location error:', error);
              toast({
                title: "⚠️ Location Unavailable",
                description: "Emergency services notified without precise location",
                variant: "default",
              });
            }
          );
        }
        
        // Simulate emergency contact notification
        setTimeout(() => {
          toast({
            title: "📞 Contacts Notified",
            description: "Emergency contacts have been alerted with your location",
          });
        }, 2000);
      }
    } catch (error) {
      console.error('SOS Error:', error);
      toast({
        title: "❌ SOS Error",
        description: "Failed to send emergency alert. Please call 112 directly.",
        variant: "destructive",
      });
    } finally {
      // Reset SOS button after 10 seconds
      setTimeout(() => {
        setIsSOSActive(false);
      }, 10000);
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Navigation, label: 'Trips', path: '/trips' },
    { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="mobile-nav-container">
      <div className="flex items-center justify-between px-4 py-2">
        {/* First two nav items */}
        <div className="flex gap-8">
          {navItems.slice(0, 2).map((item) => (
            <button
              key={item.path}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Central SOS Button */}
        <Button
          onClick={handleSOS}
          size="lg"
          disabled={isSOSActive}
          className={`w-16 h-16 rounded-full font-bold shadow-lg transform transition-all duration-200 ${
            isSOSActive 
              ? 'bg-red-700 text-white scale-110 animate-pulse'
              : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105'
          }`}
        >
          <div className="flex flex-col items-center">
            <Phone className="w-6 h-6" />
            <span className="text-xs mt-1">{isSOSActive ? 'SENT' : 'SOS'}</span>
          </div>
        </Button>

        {/* Last two nav items */}
        <div className="flex gap-8">
          {navItems.slice(2).map((item) => (
            <button
              key={item.path}
              className={`mobile-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;