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
    <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="mobile-container pt-8 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="subheading-mobile">{t('profile.title')}</h1>
            <p className="caption-mobile text-muted-foreground">
              Manage your digital identity and preferences
            </p>
          </div>
          <Button
            variant={isEditing ? "hero" : "outline"}
            size="icon"
            className="rounded-full"
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            disabled={isLoading}
          >
            {isEditing ? <Save className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <div className="mobile-container flex-1 pb-24 space-y-6">
        {/* Digital ID Section */}
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('profile.digitalId')}</h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Your tamper-proof digital identity for secure travel
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-muted-foreground">Digital ID</Label>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-xl font-bold ${showDigitalId ? 'text-primary' : 'blur-sm'}`}>
                  {profile.digitalId}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowDigitalId(!showDigitalId)}
                  >
                    {showDigitalId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={copyDigitalId}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <Alert className="bg-info/5 border-info/20 border">
              <Lock className="h-4 w-4 text-info" />
              <AlertDescription className="text-sm">
                Your Digital ID is secured using blockchain technology, ensuring tamper-proof verification of your identity.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Your basic profile information
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-sm font-medium">Nationality</Label>
                <Input
                  id="nationality"
                  value={profile.nationality}
                  onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                  disabled={!isEditing}
                  className="h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('profile.emergencyContacts')}</h3>
                  <p className="text-sm text-muted-foreground font-normal">
                    Contacts that will be notified in case of emergency
                  </p>
                </div>
              </div>
              {isEditing && (
                <Button variant="outline" size="sm" onClick={addEmergencyContact} className="shrink-0">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.emergencyContacts.map((contact) => (
              <div key={contact.id} className="p-4 bg-muted/30 rounded-xl border border-border/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {contact.isPrimary && (
                      <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
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
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeEmergencyContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Name</Label>
                    <Input
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(contact.id, { name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Contact name"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone</Label>
                    <Input
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(contact.id, { phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Phone number"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Relationship</Label>
                    <Input
                      value={contact.relationship}
                      onChange={(e) => updateEmergencyContact(contact.id, { relationship: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Spouse, Parent, Friend"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{t('profile.language')}</h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Choose your preferred language
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={profile.preferences.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="h-12">
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
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Manage your alert settings
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(profile.preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <Label className="capitalize font-medium">{key} Alerts</Label>
                  <p className="text-sm text-muted-foreground">
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
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Control your privacy preferences
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Share Location</Label>
                <p className="text-sm text-muted-foreground">
                  Allow sharing location with emergency services
                </p>
              </div>
              <Switch
                checked={profile.preferences.privacy.shareLocation}
                onCheckedChange={(checked) => updatePrivacyPreference('shareLocation', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Allow Tracking</Label>
                <p className="text-sm text-muted-foreground">
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
        <Card className="border-0 shadow-soft bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">App Information</h3>
                <p className="text-sm text-muted-foreground font-normal">
                  Version and build details
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">Version</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">Build</span>
              <span className="text-muted-foreground">2024.09.12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="font-medium">Last Updated</span>
              <span className="text-muted-foreground">{new Date().toLocaleDateString()}</span>
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