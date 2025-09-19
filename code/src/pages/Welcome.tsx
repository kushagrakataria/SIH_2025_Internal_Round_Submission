import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Shield } from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
];

const Welcome = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(i18n.language || "");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedLanguage) {
      // Change language
      i18n.changeLanguage(selectedLanguage);
      // Store language preference
      localStorage.setItem("tourist-app-language", selectedLanguage);
      navigate("/login");
    }
  };

  return (
    <div className="mobile-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Header */}
      <div className="mobile-container pt-12 pb-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="heading-mobile text-foreground">{t('app.name')}</h1>
          <p className="body-mobile text-muted-foreground">
            {t('app.tagline')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobile-container flex-1 flex flex-col">
        {/* Language Selection */}
        <Card className="flex-1">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 subheading-mobile">
              <Globe className="w-5 h-5" />
              {t('welcome.chooseLanguage')}
            </CardTitle>
            <CardDescription>
              {t('welcome.selectLanguageDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="h-14 text-base">
                <SelectValue placeholder={t('welcome.selectLanguagePlaceholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="h-12">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-sm text-muted-foreground">{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="hero" 
              size="lg" 
              className="w-full"
              onClick={handleContinue}
              disabled={!selectedLanguage}
            >
              {t('welcome.continue')}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mobile-container py-6">
        <p className="caption-mobile text-center text-muted-foreground">
          {t('app.poweredBy')}
        </p>
      </div>
    </div>
  );
};

export default Welcome;