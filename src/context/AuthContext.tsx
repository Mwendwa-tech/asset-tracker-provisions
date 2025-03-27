import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { toast } from '@/components/ui/use-toast';
import { User, Permission, RolePermissions } from '@/types';

type Session = {
  user: User;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string, department?: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialized: boolean;
  hasPermission: (permission: Permission) => boolean;
  getCurrentUserRole: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Simulate auth initialization
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser });
    }
    setInitialized(true);
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // If the user has custom permissions, check those
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }
    
    // Otherwise check role-based permissions
    const rolePermissions = RolePermissions[user.role] || [];
    return rolePermissions.includes(permission);
  };

  const getCurrentUserRole = (): string | null => {
    return user ? user.role : null;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock sign in (no actual backend call)
      setTimeout(() => {
        // For demo purposes, assign role based on email prefix
        let role: User['role'] = 'staff';
        if (email.startsWith('admin')) {
          role = 'admin';
        } else if (email.startsWith('manager')) {
          role = 'manager';
        } else if (email.startsWith('store')) {
          role = 'storekeeper';
        } else if (email.startsWith('head')) {
          role = 'departmentHead';
        }
        
        const mockUser: User = { 
          id: 'mock-id', 
          email, 
          name: email.split('@')[0],
          role,
          department: 'General'
        };
        
        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        toast({
          title: 'Signed in successfully',
          description: `Welcome back! You are signed in as ${role}.`
        });
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Error signing in',
        description: error.message || 'An error occurred during sign in',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'staff', department: string = 'General') => {
    setLoading(true);
    try {
      // Mock sign up (no actual backend call)
      setTimeout(() => {
        const mockUser: User = { 
          id: 'mock-id', 
          email, 
          name,
          role: role as User['role'],
          department
        };
        
        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        toast({
          title: 'Signed up successfully',
          description: 'Your account has been created'
        });
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Error signing up',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Mock sign out
      setUser(null);
      setSession(null);
      localStorage.removeItem('mock_user');
      
      toast({
        title: 'Signed out successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message || 'An error occurred during sign out',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      initialized,
      hasPermission,
      getCurrentUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
