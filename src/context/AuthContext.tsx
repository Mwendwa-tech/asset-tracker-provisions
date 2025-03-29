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
  signOut: (userId?: string) => Promise<void>;
  initialized: boolean;
  hasPermission: (permission: Permission) => boolean;
  getCurrentUserRole: () => string | null;
  isAdmin: () => boolean;
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

  const [activeUsers, setActiveUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('mock_active_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setSession({ user: parsedUser });
      
      const userExists = activeUsers.some(u => u.id === parsedUser.id);
      if (!userExists) {
        const updatedActiveUsers = [...activeUsers, parsedUser];
        setActiveUsers(updatedActiveUsers);
        localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
      }
    } else {
      const demoUser: User = {
        id: 'demo-id',
        email: 'demo@grandluxury.hotel',
        name: 'Demo User',
        role: 'generalManager',
        department: 'Executive',
        permissions: Object.values(Permission)
      };
      setUser(demoUser);
      setSession({ user: demoUser });
      localStorage.setItem('mock_user', JSON.stringify(demoUser));
      
      setActiveUsers([demoUser]);
      localStorage.setItem('mock_active_users', JSON.stringify([demoUser]));
    }
    setInitialized(true);
  }, []);

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }
    
    const rolePermissions = RolePermissions[user.role] || [];
    return rolePermissions.includes(permission);
  };

  const getCurrentUserRole = (): string | null => {
    return user ? user.role : null;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'generalManager';
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      setTimeout(() => {
        const role = getRoleFromEmail(email);
        const department = getDepartmentFromEmail(email);
        
        const mockUser: User = { 
          id: `user-${Date.now()}`, 
          email, 
          name: email.split('@')[0],
          role,
          department,
          permissions: role === 'generalManager' ? Object.values(Permission) : RolePermissions[role]
        };
        
        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        const updatedActiveUsers = [...activeUsers, mockUser];
        setActiveUsers(updatedActiveUsers);
        localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
        
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
      setTimeout(() => {
        const mockUser: User = { 
          id: `user-${Date.now()}`, 
          email, 
          name,
          role: role as User['role'],
          department
        };
        
        setUser(mockUser);
        setSession({ user: mockUser });
        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        
        const updatedActiveUsers = [...activeUsers, mockUser];
        setActiveUsers(updatedActiveUsers);
        localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
        
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

  const signOut = async (userId?: string) => {
    setLoading(true);
    try {
      if (userId && user && userId !== user.id) {
        if (user.role !== 'generalManager') {
          throw new Error('Only administrators can sign out other users');
        }
        
        const updatedActiveUsers = activeUsers.filter(u => u.id !== userId);
        setActiveUsers(updatedActiveUsers);
        localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
        
        toast({
          title: 'User signed out',
          description: 'The selected user has been signed out successfully'
        });
      } else {
        setUser(null);
        setSession(null);
        localStorage.removeItem('mock_user');
        
        const updatedActiveUsers = activeUsers.filter(u => u.id !== user?.id);
        setActiveUsers(updatedActiveUsers);
        localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
        
        toast({
          title: 'Signed out successfully'
        });
      }
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
      getCurrentUserRole,
      isAdmin
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
