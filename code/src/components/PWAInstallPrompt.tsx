import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after 3 seconds if not dismissed before
      setTimeout(() => {
        const hasShownBefore = localStorage.getItem('pwa-install-dismissed');
        if (!hasShownBefore && !isStandaloneMode) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const IOSInstallInstructions = () => (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Smartphone className="w-5 h-5" />
          Add to Home Screen
        </CardTitle>
        <CardDescription className="text-blue-600">
          Install Safe Traveler Buddy for the best experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-blue-700">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-200 rounded flex items-center justify-center text-xs font-bold">1</div>
          <span>Tap the Share button at the bottom of Safari</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-200 rounded flex items-center justify-center text-xs font-bold">2</div>
          <span>Scroll down and tap "Add to Home Screen"</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-200 rounded flex items-center justify-center text-xs font-bold">3</div>
          <span>Tap "Add" to install the app</span>
        </div>
        <Button 
          onClick={handleDismiss} 
          variant="outline" 
          size="sm" 
          className="w-full mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          Got it!
        </Button>
      </CardContent>
    </Card>
  );

  // Don't show if already installed or no prompt available
  if (isStandalone || (!deferredPrompt && !isIOS) || !showInstallPrompt) {
    return null;
  }

  return (
    <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Install App
          </DialogTitle>
          <DialogDescription>
            Get the best experience with our app installed on your device
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isIOS ? (
            <IOSInstallInstructions />
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Why install?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Faster loading and better performance</li>
                  <li>• Works offline for emergency situations</li>
                  <li>• Full-screen experience without browser UI</li>
                  <li>• Push notifications for safety alerts</li>
                  <li>• Quick access from your home screen</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleInstallClick}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Not Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAInstallPrompt;