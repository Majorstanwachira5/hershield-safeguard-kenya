import { useState } from "react";
import { Shield, Menu, X, Home, User, Settings, HelpCircle, LogOut, Brain, Users, Book, AlertTriangle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
    { label: "AI Safety", path: "/ai", icon: Brain },
    { label: "Community", path: "/community", icon: Users },
    { label: "Resources", path: "/resources", icon: Book },
    { label: "Report", path: "/report", icon: AlertTriangle, highlight: true },
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navItems[0], mobile?: boolean }) => (
    <Link
      to={item.path}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative ${
        isActive(item.path)
          ? "bg-primary text-primary-foreground"
          : item.highlight
          ? "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      } ${mobile ? "w-full justify-start" : ""}`}
    >
      <item.icon className={`h-4 w-4 ${item.highlight ? 'animate-pulse' : ''}`} />
      <span className={mobile ? "" : "hidden md:inline"}>{item.label}</span>
      {item.highlight && !mobile && (
        <Badge variant="destructive" className="ml-1 text-xs px-1 py-0 h-4">
          !
        </Badge>
      )}
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
                    <Link to="/profile">
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50" />
                          <AvatarFallback className="text-xs">SM</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{user.email?.split('@')[0]}</span>
                      </Button>
                    </Link>
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