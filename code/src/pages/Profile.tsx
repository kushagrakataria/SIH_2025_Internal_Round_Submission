import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import BottomNavigation from "@/components/BottomNavigation";
import { 
  ArrowLeft,
  User,
  Shield,
  Phone,
  Globe,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Save,
  Plus,
  Trash2,
  Check,
  Copy,
  Lock,
  Smartphone,
  Mail,
  CreditCard,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  digitalId: string;
  nationality: string;
  passportNumber: string;
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

interface UserPreferences {
  language: string;
  notifications: {
    geofencing: boolean;
    weather: boolean;
    security: boolean;
    emergency: boolean;
  };
  privacy: {
    shareLocation: boolean;
    allowTracking: boolean;
  };
}

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, userProfile, updateProfile, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDigitalId, setShowDigitalId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load user profile data from Firebase Auth context
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (userProfile) {
      // Map Firebase user profile to local profile structure
      const mappedProfile: UserProfile = {
        id: currentUser.uid,
        name: userProfile.name || currentUser.displayName || 'Unknown User',
        email: currentUser.email || '',
        phone: userProfile.phone || '',
        digitalId: userProfile.digitalId || `STB${Date.now().toString().slice(-6)}`,
        nationality: (userProfile as any)?.nationality || 'Indian',
        passportNumber: (userProfile as any)?.passportNumber || '',
        emergencyContacts: userProfile.emergencyContacts || [
          {
            id: 'contact_1',
            name: '',
            phone: '',
            email: '',
            relationship: 'Family',
            isPrimary: true
          }
        ],
        preferences: {
          language: userProfile.preferences?.language || 'en',
          notifications: {
            geofencing: userProfile.preferences?.notifications?.emergencyAlerts ?? true,
            weather: userProfile.preferences?.notifications?.safetyUpdates ?? true,
            security: userProfile.preferences?.notifications?.tripReminders ?? true,
            emergency: userProfile.preferences?.notifications?.emergencyAlerts ?? true,
          },
          privacy: {
            shareLocation: userProfile.preferences?.privacy?.shareLocation ?? true,
            allowTracking: userProfile.preferences?.privacy?.publicProfile ?? true,
          }
        }
      };
      setProfile(mappedProfile);
    } else {
      // Create default profile for new users
      const defaultProfile: UserProfile = {
        id: currentUser.uid,
        name: currentUser.displayName || 'New User',
        email: currentUser.email || '',
        phone: '',
        digitalId: `STB${Date.now().toString().slice(-6)}`,
        nationality: 'Indian',
        passportNumber: '',
        emergencyContacts: [
          {
            id: 'contact_1',
            name: '',
            phone: '',
            email: '',
            relationship: 'Family',
            isPrimary: true
          }
        ],
        preferences: {
          language: 'en',
          notifications: {
            geofencing: true,
            weather: true,
            security: true,
            emergency: true,
          },
          privacy: {
            shareLocation: true,
            allowTracking: true,
          }
        }
      };
      setProfile(defaultProfile);
    }
  }, [currentUser, userProfile, navigate]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      // Update Firebase user profile with mapped properties
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        digitalId: profile.digitalId,
        emergencyContacts: profile.emergencyContacts.map(contact => ({
          ...contact,
          createdAt: new Date().toISOString()
        })),
        preferences: {
          language: profile.preferences.language,
          notifications: {
            emergencyAlerts: profile.preferences.notifications.emergency,
            tripReminders: profile.preferences.notifications.geofencing,
            safetyUpdates: profile.preferences.notifications.security
          },
          privacy: {
            shareLocation: profile.preferences.privacy.shareLocation,
            publicProfile: profile.preferences.privacy.allowTracking
          }
        }
      });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (!profile) return;
    
    i18n.changeLanguage(newLanguage);
    localStorage.setItem("tourist-app-language", newLanguage);
    
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        language: newLanguage
      }
    });
    
    toast({
      title: "Language Updated",
      description: "App language has been changed successfully.",
      variant: "default",
    });
  };

  const copyDigitalId = () => {
    if (profile) {
      navigator.clipboard.writeText(profile.digitalId);
      toast({
        title: "Copied!",
        description: "Digital ID copied to clipboard.",
        variant: "default",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addEmergencyContact = () => {
    if (!profile) return;
    
    const newContact: EmergencyContact = {
      id: `contact_${Date.now()}`,
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false
    };
    
    setProfile({
      ...profile,
      emergencyContacts: [...profile.emergencyContacts, newContact]
    });
  };

  const removeEmergencyContact = (contactId: string) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      emergencyContacts: profile.emergencyContacts.filter(c => c.id !== contactId)
    });
  };

  const updateEmergencyContact = (contactId: string, updates: Partial<EmergencyContact>) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      emergencyContacts: profile.emergencyContacts.map(contact =>
        contact.id === contactId ? { ...contact, ...updates } : contact
      )
    });
  };

  const updateNotificationPreference = (key: keyof UserPreferences['notifications'], value: boolean) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          [key]: value
        }
      }
    });
  };

  const updatePrivacyPreference = (key: keyof UserPreferences['privacy'], value: boolean) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        privacy: {
          ...profile.preferences.privacy,
          [key]: value
        }
      }
    });
  };

  if (!profile) {
    return (
      <div className="mobile-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "mr", name: "मराठी" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "pt", name: "Português" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ar", name: "العربية" },
  ];

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
          <h1 className="text-xl font-semibold">{t('profile.title')}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20 ml-auto"
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            disabled={isLoading}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="mobile-container flex-1 p-4 space-y-6">
        {/* Digital ID Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('profile.digitalId')}
            </CardTitle>
            <CardDescription>
              Your tamper-proof digital identity for secure travel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
              <div>
                <Label className="text-sm font-medium">Digital ID</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-mono text-lg ${showDigitalId ? '' : 'blur-sm'}`}>
                    {profile.digitalId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDigitalId(!showDigitalId)}
                  >
                    {showDigitalId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyDigitalId}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="secondary" className="bg-success text-success-foreground">
                <Check className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
            
            <Alert className="bg-info/10 border-info">
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your Digital ID is secured using blockchain technology, ensuring tamper-proof verification of your identity.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={profile.nationality}
                  onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t('profile.emergencyContacts')}
                </CardTitle>
                <CardDescription>
                  Contacts that will be notified in case of emergency
                </CardDescription>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addEmergencyContact}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.emergencyContacts.map((contact) => (
              <div key={contact.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {contact.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        Primary
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {contact.relationship}
                    </Badge>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmergencyContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(contact.id, { name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Contact name"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(contact.id, { phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Phone number"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Relationship</Label>
                    <Input
                      value={contact.relationship}
                      onChange={(e) => updateEmergencyContact(contact.id, { relationship: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Spouse, Parent, Friend"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('profile.language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={profile.preferences.language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(profile.preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label className="capitalize">{key} Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications about {key} updates
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    updateNotificationPreference(key as keyof UserPreferences['notifications'], checked)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Share Location</Label>
                <p className="text-xs text-muted-foreground">
                  Allow sharing location with emergency services
                </p>
              </div>
              <Switch
                checked={profile.preferences.privacy.shareLocation}
                onCheckedChange={(checked) => updatePrivacyPreference('shareLocation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Tracking</Label>
                <p className="text-xs text-muted-foreground">
                  Enable real-time location tracking for safety
                </p>
              </div>
              <Switch
                checked={profile.preferences.privacy.allowTracking}
                onCheckedChange={(checked) => updatePrivacyPreference('allowTracking', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Build</span>
              <span>2024.09.12</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Profile;