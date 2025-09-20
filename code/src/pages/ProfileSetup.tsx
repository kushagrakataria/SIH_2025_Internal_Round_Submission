import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Shield, 
  Phone, 
  User,
  Contact,
  CheckCircle,
  Settings,
  Camera,
  MapPin,
  Heart,
  CreditCard,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import TopNavigation from "@/components/TopNavigation";

interface FormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  
  // Document Information
  aadharNumber: string;
  passportNumber: string;
  
  // Trip Information
  tripStartDate: string;
  tripEndDate: string;
  destinations: string;
  plannedRoute: string;
  purpose: string;
  
  // Emergency Contacts
  emergencyContact1: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  emergencyContact2: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  
  // Safety Preferences
  locationSharing: boolean;
  emergencyAlerts: boolean;
  safetyReminders: boolean;
}

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: userProfile?.name || "",
    dateOfBirth: "",
    nationality: "Indian",
    address: "",
    aadharNumber: "",
    passportNumber: "",
    tripStartDate: "",
    tripEndDate: "",
    destinations: "",
    plannedRoute: "",
    purpose: "",
    emergencyContact1: { name: "", relationship: "", phone: "", email: "" },
    emergencyContact2: { name: "", relationship: "", phone: "", email: "" },
    locationSharing: true,
    emergencyAlerts: true,
    safetyReminders: true,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        fullName: userProfile.name || "",
      }));
    }
  }, [currentUser, userProfile, navigate]);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FormData] as any,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.dateOfBirth && formData.nationality);
      case 2:
        return !!(formData.emergencyContact1.name && formData.emergencyContact1.phone);
      case 3:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Please fill in all required fields",
        description: "Complete the current step before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/login");
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Prepare emergency contacts with required fields
      const emergencyContacts = [
        {
          id: '1',
          ...formData.emergencyContact1,
          isPrimary: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2', 
          ...formData.emergencyContact2,
          isPrimary: false,
          createdAt: new Date().toISOString(),
        }
      ].filter(contact => contact.name && contact.phone);

      // Update user profile in Firebase
      await updateProfile({
        name: formData.fullName,
        emergencyContacts,
        preferences: {
          language: 'en',
          notifications: {
            emergencyAlerts: formData.emergencyAlerts,
            tripReminders: formData.safetyReminders,
            safetyUpdates: true,
          },
          privacy: {
            shareLocation: formData.locationSharing,
            publicProfile: false,
          },
        },
        // Add custom fields that aren't in the base UserProfile interface
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        address: formData.address,
        profileCompleted: true,
      } as any);

      toast({
        title: "Profile setup complete!",
        description: "Your profile has been saved successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!(formData.fullName && formData.dateOfBirth && formData.nationality);
      case 2:
        return !!(formData.emergencyContact1.name && formData.emergencyContact1.phone);
      case 3:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                KYC Verification
              </CardTitle>
              <CardDescription>
                Provide your identification details for secure Digital ID creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="As per official documents"
                  className="h-12"
                  value={formData.fullName}
                  onChange={(e) => updateFormData("fullName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  className="h-12"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  placeholder="Indian"
                  className="h-12"
                  value={formData.nationality}
                  onChange={(e) => updateFormData("nationality", e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhaar Number</Label>
                <Input
                  id="aadharNumber"
                  placeholder="1234 5678 9012"
                  className="h-12"
                  value={formData.aadharNumber}
                  onChange={(e) => updateFormData("aadharNumber", e.target.value)}
                />
              </div>

              <div className="text-center text-muted-foreground">OR</div>

              <div className="space-y-2">
                <Label htmlFor="passportNumber">Passport Number</Label>
                <Input
                  id="passportNumber"
                  placeholder="A1234567"
                  className="h-12"
                  value={formData.passportNumber}
                  onChange={(e) => updateFormData("passportNumber", e.target.value)}
                />
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your documents are encrypted and stored securely with blockchain technology
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Contact className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                Add trusted contacts for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Primary Contact *
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Full name"
                      className="h-12"
                      value={formData.emergencyContact1.name}
                      onChange={(e) => updateNestedFormData("emergencyContact1", "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input
                      placeholder="e.g., Spouse, Parent"
                      className="h-12"
                      value={formData.emergencyContact1.relationship}
                      onChange={(e) => updateNestedFormData("emergencyContact1", "relationship", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="h-12"
                    value={formData.emergencyContact1.phone}
                    onChange={(e) => updateNestedFormData("emergencyContact1", "phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="contact@email.com"
                    className="h-12"
                    value={formData.emergencyContact1.email}
                    onChange={(e) => updateNestedFormData("emergencyContact1", "email", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Secondary Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Secondary Contact (Optional)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Full name"
                      className="h-12"
                      value={formData.emergencyContact2.name}
                      onChange={(e) => updateNestedFormData("emergencyContact2", "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input
                      placeholder="e.g., Friend, Sibling"
                      className="h-12"
                      value={formData.emergencyContact2.relationship}
                      onChange={(e) => updateNestedFormData("emergencyContact2", "relationship", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="h-12"
                    value={formData.emergencyContact2.phone}
                    onChange={(e) => updateNestedFormData("emergencyContact2", "phone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Trip Itinerary
              </CardTitle>
              <CardDescription>
                Share your travel plans for enhanced safety monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tripStartDate">Start Date *</Label>
                  <Input
                    id="tripStartDate"
                    type="date"
                    className="h-12"
                    value={formData.tripStartDate}
                    onChange={(e) => updateFormData("tripStartDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tripEndDate">End Date *</Label>
                  <Input
                    id="tripEndDate"
                    type="date"
                    className="h-12"
                    value={formData.tripEndDate}
                    onChange={(e) => updateFormData("tripEndDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinations">Destinations *</Label>
                <Input
                  id="destinations"
                  placeholder="Mumbai, Goa, Kerala"
                  className="h-12"
                  value={formData.destinations}
                  onChange={(e) => updateFormData("destinations", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedRoute">Planned Route</Label>
                <Input
                  id="plannedRoute"
                  placeholder="Mumbai → Goa → Kerala → Mumbai"
                  className="h-12"
                  value={formData.plannedRoute}
                  onChange={(e) => updateFormData("plannedRoute", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Travel</Label>
                <Input
                  id="purpose"
                  placeholder="Tourism, Business, Family visit"
                  className="h-12"
                  value={formData.purpose}
                  onChange={(e) => updateFormData("purpose", e.target.value)}
                />
              </div>

              <Alert>
                <Calendar className="h-4 w-4" />
                <AlertDescription>
                  Your itinerary helps us provide location-specific safety alerts and emergency assistance
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Header */}
      <div className="mobile-container pt-20 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="subheading-mobile">Profile Setup</h1>
            <p className="caption-mobile text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>KYC Details</span>
            <span>Emergency Contacts</span>
            <span>Trip Itinerary</span>
          </div>
        </div>
      </div>

      {/* Form Content with Tabs */}
      <Tabs value={`step-${currentStep}`} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
          <TabsTrigger 
            value="step-1" 
            className="text-xs flex items-center gap-1"
            onClick={() => setCurrentStep(1)}
          >
            {validateStep(1) && <CheckCircle className="w-3 h-3" />}
            KYC Details
          </TabsTrigger>
          <TabsTrigger 
            value="step-2" 
            className="text-xs flex items-center gap-1"
            onClick={() => {
              if (validateStep(1)) {
                setCurrentStep(2);
              } else {
                toast({
                  title: "Complete previous step",
                  description: "Please complete KYC details first.",
                  variant: "destructive",
                });
              }
            }}
            disabled={!validateStep(1)}
          >
            {validateStep(2) && <CheckCircle className="w-3 h-3" />}
            Emergency
          </TabsTrigger>
          <TabsTrigger 
            value="step-3" 
            className="text-xs flex items-center gap-1"
            onClick={() => {
              if (validateStep(1) && validateStep(2)) {
                setCurrentStep(3);
              } else {
                toast({
                  title: "Complete previous steps",
                  description: "Please complete KYC and Emergency contact details first.",
                  variant: "destructive",
                });
              }
            }}
            disabled={!validateStep(1) || !validateStep(2)}
          >
            {validateStep(3) && <CheckCircle className="w-3 h-3" />}
            Trip Details
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <div className="mobile-container flex-1 pb-32">
          <TabsContent value="step-1" className="mt-0">
            {currentStep === 1 && renderStep()}
          </TabsContent>
          <TabsContent value="step-2" className="mt-0">
            {currentStep === 2 && renderStep()}
          </TabsContent>
          <TabsContent value="step-3" className="mt-0">
            {currentStep === 3 && renderStep()}
          </TabsContent>
        </div>
      </Tabs>

      {/* Validation Feedback */}
      {!isStepValid() && !loading && (
        <div className="fixed bottom-20 left-0 right-0 bg-orange-50 border-t border-orange-200 p-3">
          <Alert className="bg-orange-50 border-orange-200">
            <AlertDescription className="text-orange-700 text-sm">
              {currentStep === 1 && "Please fill in: Full Name, Date of Birth, and Nationality"}
              {currentStep === 2 && "Please fill in: Emergency Contact Name and Phone Number"}
              {currentStep === 3 && "All fields are optional for this step"}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="mobile-container">
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleBack}
              className="flex-1"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? "Cancel" : "Previous"}
            </Button>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className={`flex-1 ${!isStepValid() && !loading ? 'opacity-75 cursor-not-allowed border-2 border-dashed border-gray-300' : ''}`}
              title={!isStepValid() ? "Please fill all required fields to continue" : ""}
            >
              {loading ? (
                "Creating Digital ID..."
              ) : currentStep === totalSteps ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit & Create Digital ID
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;