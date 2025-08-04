import { Flag, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const QuickReportButton = () => {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    
    // Simulate encrypted report submission
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description: "Your report has been securely submitted and encrypted. You're safe.",
        duration: 3000,
      });
      setReportText("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="report" className="fixed bottom-6 left-6 z-50 shadow-lg">
          <Flag className="h-4 w-4" />
          Quick Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-warning" />
            Quick Report
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Report harassment, abuse, or any safety concerns. Your report is encrypted and anonymous.
          </p>
          <Textarea
            placeholder="Describe what happened..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            className="min-h-24"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmitReport}
              disabled={!reportText.trim() || isSubmitting}
              className="flex-1"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Emergency? Call 999 or use the emergency exit button.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickReportButton;