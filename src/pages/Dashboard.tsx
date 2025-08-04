import { Shield, Users, AlertTriangle, BookOpen, Settings, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HerShieldLogo from "@/components/HerShieldLogo";
import LanguageSelector from "@/components/LanguageSelector";
import SafetyTipCard from "@/components/SafetyTipCard";
import EmergencyButton from "@/components/EmergencyButton";
import QuickReportButton from "@/components/QuickReportButton";

const Dashboard = () => {
  const safetyTips = [
    {
      title: "Protect Your Privacy",
      description: "Keep your personal information secure online",
      tips: [
        "Review your social media privacy settings regularly",
        "Don't share your location with strangers",
        "Use strong, unique passwords for each account",
        "Be cautious about what you post publicly"
      ],
      category: "privacy" as const
    },
    {
      title: "Dealing with Harassment",
      description: "How to handle online harassment and abuse",
      tips: [
        "Block and report abusive users immediately",
        "Document harassment with screenshots",
        "Don't engage with trolls or harassers",
        "Reach out to trusted friends or family for support"
      ],
      category: "harassment" as const
    },
    {
      title: "Emergency Preparedness",
      description: "Be prepared for urgent situations",
      tips: [
        "Save emergency contacts in your phone",
        "Know your local emergency numbers",
        "Share your location with trusted contacts when needed",
        "Have a safety plan for different scenarios"
      ],
      category: "emergency" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <HerShieldLogo size="md" />
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Your Safe Space
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            HerShield is designed to protect and empower women online. Access safety tools, 
            privacy controls, and emergency features all in one secure platform.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 border-primary/20 hover:shadow-card transition-all">
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Privacy Dashboard</CardTitle>
              <CardDescription>
                Customize your privacy settings and data visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="hero" className="w-full">
                Manage Privacy
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-success/20 hover:shadow-card transition-all">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-success mx-auto mb-2" />
              <CardTitle>Trusted Contacts</CardTitle>
              <CardDescription>
                Manage your emergency contacts and trusted network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="safe" className="w-full">
                Manage Contacts
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-warning/20 hover:shadow-card transition-all">
            <CardHeader className="text-center">
              <Phone className="h-8 w-8 text-warning mx-auto mb-2" />
              <CardTitle>Emergency Resources</CardTitle>
              <CardDescription>
                Quick access to emergency services and helplines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="report" className="w-full">
                View Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Safety Tips */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Safety Tips & Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyTips.map((tip, index) => (
              <SafetyTipCard key={index} {...tip} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your safety activity and report status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
                <div>
                  <p className="font-medium text-success">Privacy Settings Updated</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <Shield className="h-5 w-5 text-success" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div>
                  <p className="font-medium text-primary">Safety Check Completed</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
                <Shield className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Action Buttons */}
      <EmergencyButton />
      <QuickReportButton />
    </div>
  );
};

export default Dashboard;