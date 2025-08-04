import { Shield, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SafetyTipCardProps {
  title: string;
  description: string;
  tips: string[];
  category: "privacy" | "harassment" | "emergency" | "general";
}

const SafetyTipCard = ({ title, description, tips, category }: SafetyTipCardProps) => {
  const categoryColors = {
    privacy: "border-primary/20 bg-primary/5",
    harassment: "border-warning/20 bg-warning/5", 
    emergency: "border-destructive/20 bg-destructive/5",
    general: "border-accent/20 bg-accent/5"
  };

  return (
    <Card className={`${categoryColors[category]} transition-all hover:shadow-card`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <Button variant="soft" size="sm" className="mt-4 w-full">
          Learn More
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default SafetyTipCard;