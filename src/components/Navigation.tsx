import { useState } from "react";
import { Shield, Menu, X, Home, User, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HerShieldLogo from "./HerShieldLogo";
import LanguageSelector from "./LanguageSelector";
import { Link, useLocation } from "react-router-dom";

interface NavigationProps {
  showAuthButtons?: boolean;
}

const Navigation = ({ showAuthButtons = true }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Dashboard", path: "/dashboard", icon: Shield },
    { label: "Help", path: "/help", icon: HelpCircle },
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navItems[0], mobile?: boolean }) => (
    <Link
      to={item.path}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
        isActive(item.path)
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      } ${mobile ? "w-full justify-start" : ""}`}
    >
      <item.icon className="h-4 w-4" />
      <span className={mobile ? "" : "hidden md:inline"}>{item.label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/">
            <HerShieldLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            
            {showAuthButtons && (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm">Sign In</Button>
                <Link to="/dashboard">
                  <Button variant="hero" size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Settings className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <HerShieldLogo size="sm" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <NavLink key={item.path} item={item} mobile />
                    ))}
                  </div>

                  {showAuthButtons && (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <Button variant="ghost" className="justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        <Button variant="hero" className="w-full justify-start">
                          <Shield className="h-4 w-4 mr-2" />
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;