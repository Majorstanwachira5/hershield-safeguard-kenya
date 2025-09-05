import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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
    localStorage.removeItem('hershield_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, signUp }}>
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
