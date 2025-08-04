import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyPress = () => {
    setIsPressed(true);
    // Quick exit functionality - redirect to a safe site
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        variant="emergency"
        size="emergency"
        onClick={handleEmergencyPress}
        className={`${isPressed ? 'scale-95' : 'scale-100'} transition-transform`}
        aria-label="Emergency Exit"
      >
        <AlertTriangle className="h-6 w-6" />
      </Button>
      
      {/* Emergency contact tooltip */}
      <div className="absolute -top-12 right-0 bg-destructive text-destructive-foreground px-3 py-1 rounded-lg text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
        Quick Exit
      </div>
    </div>
  );
};

export default EmergencyButton;