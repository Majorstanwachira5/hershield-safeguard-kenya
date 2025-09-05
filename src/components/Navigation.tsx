import { useState } from "react";
import { Shield, Menu, X, Home, User, Settings, HelpCircle, LogOut, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import HerShieldLogo from "./HerShieldLogo";
import LanguageSelector from "./LanguageSelector";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  showAuthButtons?: boolean;
}

const Navigation = ({ showAuthButtons = true }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Dashboard", path: "/dashboard", icon: Shield },
    { label: "Safety Center", path: "/safety", icon: Shield },
    { label: "AI Safety Hub", path: "/ai", icon: Brain },
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
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground mr-2">
                      {user.email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={signOut}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth">
                      <Button variant="ghost" size="sm">Sign In</Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button variant="hero" size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
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
                      {user ? (
                        <>
                          <div className="text-sm text-muted-foreground px-3 py-2">
                            {user.email}
                          </div>
                          <Button
                            variant="ghost"
                            className="justify-start"
                            onClick={() => {
                              signOut();
                              setIsOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link to="/auth" onClick={() => setIsOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <User className="h-4 w-4 mr-2" />
                              Sign In
                            </Button>
                          </Link>
                          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                            <Button variant="hero" className="w-full justify-start">
                              <Shield className="h-4 w-4 mr-2" />
                              Get Started
                            </Button>
                          </Link>
                        </>
                      )}
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