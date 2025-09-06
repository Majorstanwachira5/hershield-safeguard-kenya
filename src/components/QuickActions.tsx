import { Shield, Users, Phone, Settings, HelpCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "hero" | "safe" | "report" | "soft";
  action: () => void;
}

const QuickActions = () => {
  const navigate = useNavigate();
  
  const actions: QuickAction[] = [
    {
      title: "Privacy Dashboard",
      description: "Customize your privacy settings and data visibility",
      icon: Shield,
      variant: "hero",
      action: () => navigate('/profile?tab=privacy')
    },
    {
      title: "Trusted Contacts",
      description: "Manage your emergency contacts and trusted network",
      icon: Users,
      variant: "safe",
      action: () => navigate('/profile?tab=contacts')
    },
    {
      title: "Emergency Resources",
      description: "Quick access to emergency services and helplines",
      icon: Phone,
      variant: "report",
      action: () => navigate('/resources')
    },
    {
      title: "Safety Settings",
      description: "Configure your safety preferences and alerts",
      icon: Settings,
      variant: "soft",
      action: () => navigate('/safety')
    },
    {
      title: "Get Help",
      description: "Access support, guides, and community resources",
      icon: HelpCircle,
      variant: "soft",
      action: () => navigate('/resources?tab=help')
    },
    {
      title: "Report Issue",
      description: "Report harassment, abuse, or safety concerns",
      icon: AlertTriangle,
      variant: "report",
      action: () => navigate('/report')
    }
  ];

  const getCardStyle = (variant: string) => {
    const styles = {
      hero: "bg-gradient-to-br from-card to-secondary/10 border-secondary/30 hover:shadow-feminine transition-feminine hover-lift",
      safe: "bg-gradient-to-br from-card to-accent/10 border-accent/30 hover:shadow-feminine transition-feminine hover-lift",
      report: "bg-gradient-to-br from-card to-destructive/5 border-destructive/20 hover:shadow-feminine transition-feminine hover-lift",
      soft: "bg-gradient-to-br from-card to-muted/20 border-border hover:shadow-feminine transition-feminine hover-lift"
    };
    return styles[variant as keyof typeof styles] || styles.soft;
  };

  const getIconStyle = (variant: string) => {
    const styles = {
      hero: "text-white bg-gradient-navy-pink p-3 rounded-lg shadow-glow",
      safe: "text-white bg-gradient-safe p-3 rounded-lg shadow-glow",
      report: "text-white bg-gradient-pink-yellow p-3 rounded-lg shadow-glow",
      soft: "text-secondary bg-gradient-feminine/20 p-3 rounded-lg"
    };
    return styles[variant as keyof typeof styles] || styles.soft;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Card key={index} className={getCardStyle(action.variant)}>
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-4">
              <action.icon className={`h-8 w-8 ${getIconStyle(action.variant)}`} />
            </div>
            <CardTitle className="text-lg bg-gradient-navy-pink bg-clip-text text-transparent">{action.title}</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {action.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button 
              variant={action.variant} 
              className="w-full"
              onClick={action.action}
            >
              Open
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;