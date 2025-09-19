import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Phone, Globe, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Real-time Safety Monitoring",
      description: "Continuous monitoring of your location with instant safety assessments"
    },
    {
      icon: <MapPin className="w-8 h-8 text-success" />,
      title: "Smart Geo-fencing",
      description: "Automated alerts when entering high-risk or restricted areas"
    },
    {
      icon: <Phone className="w-8 h-8 text-emergency" />,
      title: "Emergency SOS System",
      description: "One-touch emergency alert system with live location sharing"
    },
    {
      icon: <Users className="w-8 h-8 text-accent" />,
      title: "Emergency Contacts",
      description: "Automatic notifications to your trusted emergency contacts"
    },
    {
      icon: <Globe className="w-8 h-8 text-info" />,
      title: "Multi-language Support",
      description: "Available in 13+ languages for global travelers"
    },
    {
      icon: <Clock className="w-8 h-8 text-warning" />,
      title: "Trip Management",
      description: "Track and manage your travel itinerary with safety checkpoints"
    }
  ];

  const safetyStats = [
    { label: "Active Users", value: "50K+", icon: <Users className="w-4 h-4" /> },
    { label: "Countries Covered", value: "25+", icon: <Globe className="w-4 h-4" /> },
    { label: "Emergency Responses", value: "1.2K+", icon: <Phone className="w-4 h-4" /> },
    { label: "Safety Zones", value: "500+", icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <div className="mobile-container py-6 md:py-12">
        <div className="text-center space-mobile mb-8 md:mb-12">
          <div className="mx-auto w-16 h-16 md:w-24 md:h-24 bg-gradient-hero rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8">
            <Shield className="w-8 h-8 md:w-12 md:h-12 text-primary-foreground" />
          </div>
          
          <Badge variant="secondary" className="mb-3 md:mb-4 text-xs md:text-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Trusted by 50,000+ Travelers
          </Badge>
          
          <h1 className="text-responsive-xl font-bold tracking-tight text-foreground mb-3 md:mb-4 px-4">
            {t('app.name')}
          </h1>
          
          <p className="text-responsive-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            {t('app.tagline')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8 px-4">
            <Button 
              className="btn-mobile-primary text-base md:text-lg px-6 md:px-8"
              onClick={() => navigate("/welcome")}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="touch-button text-base md:text-lg px-6 md:px-8"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Safety Stats */}
        <div className="mobile-grid mb-12 md:mb-16">
          {safetyStats.map((stat, index) => (
            <Card key={index} className="mobile-card text-center">
              <CardContent className="pt-3 md:pt-4">
                <div className="flex items-center justify-center mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-xl md:text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-12 px-4">
            <h2 className="text-responsive-xl font-bold text-foreground mb-3 md:mb-4">
              Advanced Safety Features
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive safety tools designed to keep you protected throughout your journey
            </p>
          </div>
          
          <div className="mobile-grid">
            {features.map((feature, index) => (
              <Card key={index} className="mobile-card group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-base md:text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm md:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Alert Section */}
        <Card className="mobile-card bg-gradient-to-r from-emergency/5 to-emergency/10 border-emergency/20 mb-12 md:mb-16">
          <CardContent className="p-6 md:p-8 text-center">
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-emergency/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-emergency" />
              </div>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-3 md:mb-4">
              24/7 Emergency Response
            </h3>
            <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
              Our emergency response system is always active, ready to connect you with local authorities 
              and emergency services wherever you are in the world.
            </p>
            <Button className="btn-mobile-primary text-sm md:text-lg px-6 md:px-8">
              Learn More About Emergency Features
            </Button>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-xl md:rounded-2xl p-6 md:p-8">
          <h3 className="text-lg md:text-2xl font-bold text-foreground mb-3 md:mb-4">
            Ready to Travel Safely?
          </h3>
          <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-6 max-w-2xl mx-auto">
            Join thousands of travelers who trust our platform for their safety and peace of mind.
          </p>
          <Button 
            className="btn-mobile-primary text-sm md:text-lg px-6 md:px-8"
            onClick={() => navigate("/welcome")}
          >
            Start Your Safe Journey
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-background/50 mobile-safe-area">
        <div className="mobile-container py-6 md:py-8">
          <p className="text-center text-xs md:text-sm text-muted-foreground">
            {t('app.poweredBy')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
