import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import HerShieldLogo from "@/components/HerShieldLogo";
import LanguageSelector from "@/components/LanguageSelector";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <HerShieldLogo />
        <LanguageSelector />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {isSignUp ? <SignUpForm /> : <LoginForm />}
          
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Auth;