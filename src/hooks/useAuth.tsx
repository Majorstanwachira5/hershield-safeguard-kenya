import { createContext, useContext, useState, useEffect } from "react";
import { adminAuthService, AdminUser } from "@/services/adminAuth";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin' | 'super_admin';
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  getCurrentAdmin: () => AdminUser | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAdmin: false,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  getCurrentAdmin: () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('hershield_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('hershield_user');
      }
    }
    
    // Check for admin session
    const adminUser = adminAuthService.getCurrentAdmin();
    if (adminUser && adminAuthService.isAdmin()) {
      setIsAdmin(true);
      // Set admin as current user if no regular user is logged in
      if (!storedUser) {
        const adminAsUser: User = {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: adminUser.role,
          isAdmin: true
        };
        setUser(adminAsUser);
      }
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login for demo
    const mockUser = {
      id: '1',
      email: email,
      name: email.split('@')[0]
    };
    
    setUser(mockUser);
    localStorage.setItem('hershield_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    const mockUser = {
      id: Date.now().toString(),
      email: email,
      name: name || email.split('@')[0]
    };
    
    setUser(mockUser);
    localStorage.setItem('hershield_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('hershield_user');
    // Also logout admin if logged in
    adminAuthService.adminLogout();
  };
  
  const getCurrentAdmin = () => {
    return adminAuthService.getCurrentAdmin();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      signOut, 
      signIn, 
      signUp, 
      getCurrentAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
