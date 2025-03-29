
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { toast } from '@/components/ui/use-toast';
import { User, Permission, RolePermissions, HotelDepartment } from '@/types';

type Session = {
  user: User;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string, department?: HotelDepartment) => Promise<void>;
  signOut: () => Promise<void>;
  initialized: boolean;
  hasPermission: (permission: Permission) => boolean;
  getCurrentUserRole: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getRoleFromEmail = (email: string): User['role'] => {
  if (email.startsWith('gm') || email.startsWith('general')) {
    return 'generalManager';
  } else if (email.startsWith('head') || email.startsWith('dept')) {
    return 'departmentHead';
  } else if (email.startsWith('store') || email.startsWith('inventory')) {
    return 'storekeeper';
  } else if (email.startsWith('rooms')) {
    return 'roomsManager';
  } else if (email.startsWith('fb') || email.startsWith('food')) {
    return 'fbManager';
  } else if (email.startsWith('house') || email.startsWith('cleaning')) {
    return 'housekeeper';
  } else if (email.startsWith('front') || email.startsWith('reception')) {
    return 'frontDesk';
  } else if (email.startsWith('maint') || email.startsWith('engineer')) {
    return 'maintenance';
  } else if (email.startsWith('chef') || email.startsWith('kitchen')) {
    return 'chef';
  } else {
    return 'staff';
  }
};

const getDepartmentFromEmail = (email: string): HotelDepartment => {
  if (email.startsWith('gm') || email.startsWith('general')) {
    return 'Executive';
  } else if (email.startsWith('rooms') || email.startsWith('front') || email.startsWith('reception')) {
    return 'Front Office';
  } else if (email.startsWith('house') || email.startsWith('cleaning')) {
    return 'Housekeeping';
  } else if (email.startsWith('fb') || email.startsWith('food')) {
    return 'Food & Beverage';
  } else if (email.startsWith('chef') || email.startsWith('kitchen')) {
    return 'Kitchen';
  } else if (email.startsWith('maint') || email.startsWith('engineer')) {
    return 'Maintenance';
  } else if (email.startsWith('store') || email.startsWith('inventory')) {
    return 'Stores';
  } else if (email.startsWith('hr')) {
    return 'Human Resources';
  } else if (email.startsWith('acc') || email.startsWith('finance')) {
    return 'Accounting';
  } else if (email.startsWith('spa') || email.startsWith('wellness')) {
    return 'Spa & Wellness';
  } else if (email.startsWith('sec') || email.startsWith('guard')) {
    return 'Security';
  } else if (email.startsWith('purch') || email.startsWith('buy')) {
    return 'Purchasing';
  } else {
    return 'Front Office'; // Default department
  }
};

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
    } else {
      // Auto-create a demo user with full permissions if none exists
      const demoUser: User = {
        id: 'demo-id',
        email: 'demo@grandluxury.hotel',
        name: 'Demo User',
        role: 'generalManager',
        department: 'Executive',
        permissions: Object.values(Permission) // Grant all permissions
      };
      setUser(demoUser);
      setSession({ user: demoUser });
      localStorage.setItem('mock_user', JSON.stringify(demoUser));
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
        // Determine role and department based on email
        const role = getRoleFromEmail(email);
        const department = getDepartmentFromEmail(email);
        
        const mockUser: User = { 
          id: 'mock-id', 
          email, 
          name: email.split('@')[0],
          role,
          department,
          permissions: Object.values(Permission) // Grant all permissions for demo purposes
        };
        
        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        toast({
          title: 'Signed in successfully',
          description: `Welcome back! You are signed in as ${role} in ${department}.`
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

  const signUp = async (email: string, password: string, name: string, role: string = 'staff', department: HotelDepartment = 'Front Office') => {
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
