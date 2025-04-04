
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, UserCog, User as UserIcon } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HotelDepartment } from '@/types';
import { toast } from 'sonner';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<HotelDepartment>('Front Office');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const { signIn, loading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (showRoleSelection && selectedRole) {
        const fullName = `${firstName} ${lastName}`.trim();
        await signIn(email, password, selectedRole, selectedDepartment, fullName);
      } else {
        // First step - show role selection after email/password are entered
        setShowRoleSelection(true);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
    }
  };

  // Redirect to dashboard if already signed in
  if (user) {
    return <Navigate to="/" />;
  }

  const roles = [
    { value: 'generalManager', label: 'General Manager' },
    { value: 'departmentHead', label: 'Department Head' },
    { value: 'storekeeper', label: 'Storekeeper' },
    { value: 'roomsManager', label: 'Rooms Manager' },
    { value: 'fbManager', label: 'F&B Manager' },
    { value: 'housekeeper', label: 'Housekeeper' },
    { value: 'frontDesk', label: 'Front Desk' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'chef', label: 'Chef' },
    { value: 'staff', label: 'Staff' }
  ];

  const departments: HotelDepartment[] = [
    'Executive',
    'Front Office',
    'Housekeeping',
    'Food & Beverage',
    'Kitchen',
    'Maintenance',
    'Accounting',
    'Human Resources',
    'Purchasing',
    'Stores',
    'Security',
    'Spa & Wellness'
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            {!showRoleSelection 
              ? 'Enter your credentials to access your account'
              : 'Complete your profile to sign in'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!showRoleSelection ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/reset-password" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Select Your Role</Label>
                  <div className="relative">
                    <UserCog className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Select Your Department</Label>
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={(value: HotelDepartment) => setSelectedDepartment(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || (showRoleSelection && (!selectedRole || !firstName || !lastName))}
            >
              {loading ? 'Signing in...' : showRoleSelection ? 'Complete Sign In' : 'Continue'}
            </Button>
            {showRoleSelection && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setShowRoleSelection(false)}
              >
                Back
              </Button>
            )}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
