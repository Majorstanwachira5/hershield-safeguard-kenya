import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { adminAuthService } from "@/services/adminAuth";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const { signIn, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    
    try {
      const response = await adminAuthService.adminSignIn(adminEmail, adminPassword);
      
      if (response.success && response.user) {
        toast({
          title: "Admin Access Granted!",
          description: `Welcome ${response.user.name}. ${response.message}`,
        });
        // Navigate to admin dashboard or regular dashboard
        navigate("/dashboard");
      } else {
        toast({
          title: "Admin Authentication Failed",
          description: response.error || "Invalid admin credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Admin Login Error",
        description: "Failed to connect to user service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your HerShield account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              User Login
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin Login
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="user" className="space-y-4">
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">🚀 <strong>Demo Mode:</strong> Use any email/password combination to sign in!</p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setEmail('demo@hershield.com');
                  setPassword('demo123');
                }}
                className="text-xs"
              >
                Use Demo Credentials
              </Button>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin" className="space-y-4">
            <div className="mb-4 p-3 bg-gradient-feminine/10 border border-secondary/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-secondary" />
                <p className="text-sm text-secondary font-medium">Admin Access</p>
                <Badge variant="outline" className="text-xs">Secure API</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                Admin authentication with user service API key integration
              </p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setAdminEmail('admin@hershield.com');
                  setAdminPassword('admin123');
                }}
                className="text-xs"
              >
                Use Admin Demo
              </Button>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  placeholder="Enter admin email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-navy-pink" disabled={isAdminLoading}>
                {isAdminLoading ? "Authenticating..." : "Admin Sign In"}
              </Button>
            </form>
            
            <div className="text-center p-2 bg-muted/50 rounded text-xs text-muted-foreground">
              API Key: ***{adminAuthService.getApiKey().slice(-8)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};