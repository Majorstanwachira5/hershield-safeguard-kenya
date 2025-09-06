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
    <div className="flex items-center gap-3">
      <div className="relative">
        <Shield className={`${iconSizes[size]} text-primary drop-shadow-sm float`} />
        <div className="absolute inset-0 bg-gradient-feminine rounded-full opacity-30 blur-sm pulse-glow"></div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold bg-gradient-navy-pink bg-clip-text text-transparent`}>
            HerShield
          </span>
          <span className="text-xs text-secondary/80 font-medium tracking-wider">
            SAFEGUARD KENYA
          </span>
        </div>
      )}
    </div>
  );
};

export default HerShieldLogo;