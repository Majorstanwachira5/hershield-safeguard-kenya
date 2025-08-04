import { Shield, Users, Phone, Settings, HelpCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "hero" | "safe" | "report" | "soft";
  action: () => void;
}

const QuickActions = () => {
  const actions: QuickAction[] = [
    {
      title: "Privacy Dashboard",
      description: "Customize your privacy settings and data visibility",
      icon: Shield,
      variant: "hero",
      action: () => console.log("Navigate to privacy settings")
    },
    {
      title: "Trusted Contacts",
      description: "Manage your emergency contacts and trusted network",
      icon: Users,
      variant: "safe",
      action: () => console.log("Navigate to contacts")
    },
    {
      title: "Emergency Resources",
      description: "Quick access to emergency services and helplines",
      icon: Phone,
      variant: "report",
      action: () => console.log("Navigate to emergency resources")
    },
    {
      title: "Safety Settings",
      description: "Configure your safety preferences and alerts",
      icon: Settings,
      variant: "soft",
      action: () => console.log("Navigate to safety settings")
    },
    {
      title: "Get Help",
      description: "Access support, guides, and community resources",
      icon: HelpCircle,
      variant: "soft",
      action: () => console.log("Navigate to help")
    },
    {
      title: "Report Issue",
      description: "Report harassment, abuse, or safety concerns",
      icon: AlertTriangle,
      variant: "report",
      action: () => console.log("Open report dialog")
    }
  ];

  const getCardStyle = (variant: string) => {
    const styles = {
      hero: "bg-card/50 border-primary/20 hover:shadow-card transition-all",
      safe: "bg-card/50 border-success/20 hover:shadow-card transition-all",
      report: "bg-card/50 border-warning/20 hover:shadow-card transition-all",
      soft: "bg-card/50 border-accent/20 hover:shadow-card transition-all"
    };
    return styles[variant as keyof typeof styles] || styles.soft;
  };

  const getIconColor = (variant: string) => {
    const colors = {
      hero: "text-primary",
      safe: "text-success", 
      report: "text-warning",
      soft: "text-accent-foreground"
    };
    return colors[variant as keyof typeof colors] || colors.soft;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Card key={index} className={getCardStyle(action.variant)}>
          <CardHeader className="text-center pb-3">
            <action.icon className={`h-8 w-8 ${getIconColor(action.variant)} mx-auto mb-2`} />
            <CardTitle className="text-lg">{action.title}</CardTitle>
            <CardDescription className="text-sm">
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