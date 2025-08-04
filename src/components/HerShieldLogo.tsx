import { Shield } from "lucide-react";

interface HerShieldLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const HerShieldLogo = ({ size = "md", showText = true }: HerShieldLogoProps) => {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Shield className={`${iconSizes[size]} text-primary drop-shadow-sm`} />
        <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 blur-sm"></div>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold bg-gradient-primary bg-clip-text text-transparent`}>
          HerShield
        </span>
      )}
    </div>
  );
};

export default HerShieldLogo;