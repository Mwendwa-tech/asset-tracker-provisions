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
  signIn: (email: string, password: string, role?: string, department?: HotelDepartment, fullName?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role?: string, department?: HotelDepartment) => Promise<void>;
  signOut: (userId?: string) => Promise<void>;
  initialized: boolean;
  hasPermission: (permission: Permission) => boolean;
  getCurrentUserRole: () => string | null;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type UserAccount = {
  email: string;
  password: string;
  name: string;
  role: User['role'];
  department: HotelDepartment;
};

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
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const storedAccounts = localStorage.getItem('mock_user_accounts');
    return storedAccounts ? JSON.parse(storedAccounts) : [];
  });

  const [activeUsers, setActiveUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('mock_active_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setSession({ user: parsedUser });
        
        const userExists = activeUsers.some(u => u.id === parsedUser.id);
        if (!userExists) {
          const updatedActiveUsers = [...activeUsers, parsedUser];
          setActiveUsers(updatedActiveUsers);
          localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
        }
        
        setInitialized(true);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        setInitialized(true);
      }
    } else {
      setInitialized(true);
    }
    
    localStorage.setItem('mock_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    if (userAccounts.length > 0) {
      localStorage.setItem('mock_user_accounts', JSON.stringify(userAccounts));
    }
  }, [userAccounts]);

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

  const signIn = async (email: string, password: string, role?: string, department?: HotelDepartment, fullName?: string): Promise<void> => {
    setLoading(true);
    
    try {
      const userAccount = userAccounts.find(account => account.email.toLowerCase() === email.toLowerCase());
      
      if (!userAccount) {
        throw new Error("No account found with this email. Please sign up first.");
      }
      
      if (userAccount.password !== password) {
        throw new Error("Invalid password. Please try again.");
      }
      
      const userRole = role || userAccount.role;
      const userDepartment = department || userAccount.department;
      const displayName = fullName || userAccount.name;
      
      const mockUser: User = { 
        id: `user-${Date.now()}`, 
        email, 
        name: displayName,
        role: userRole as User['role'],
        department: userDepartment,
        permissions: userRole === 'generalManager' ? Object.values(Permission) : RolePermissions[userRole as User['role']]
      };
      
      setUser(mockUser);
      setSession({ user: mockUser });
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      
      const updatedActiveUsers = [...activeUsers, mockUser];
      setActiveUsers(updatedActiveUsers);
      localStorage.setItem('mock_active_users', JSON.stringify(updatedActiveUsers));
      
      toast({
        title: 'Signed in successfully',
        description: `Welcome back ${displayName}! You are signed in as ${userRole} in ${userDepartment}.`
      });
    } catch (error: any) {
      toast({
        title: 'Error signing in',
        description: error.message || 'An error occurred during sign in',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'staff', department: HotelDepartment = 'Front Office'): Promise<void> => {
    setLoading(true);
    try {
      const existingUser = userAccounts.find(account => account.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        throw new Error("This email is already registered. Please sign in instead.");
      }
      
      const newUserAccount: UserAccount = {
        email,
        password,
        name,
        role: role as User['role'],
        department
      };
      
      setUserAccounts(prev => [...prev, newUserAccount]);
      
      const mockUser: User = { 
        id: `user-${Date.now()}`, 
        email, 
        name,
        role: role as User['role'],
        department,
        permissions: role === 'generalManager' ? Object.values(Permission) : RolePermissions[role as User['role']]
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
    } catch (error: any) {
      toast({
        title: 'Error signing up',
        description: error.message || 'An error occurred during sign up',
        variant: 'destructive'
      });
      throw error;
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
