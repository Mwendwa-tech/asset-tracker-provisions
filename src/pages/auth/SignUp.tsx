
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HotelDepartment } from '@/types';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('staff');
  const [selectedDepartment, setSelectedDepartment] = useState<HotelDepartment>('Front Office');
  const { signUp, loading, user } = useAuth();
  const navigate = useNavigate();

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    // Calculate score (0-5)
    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar];
    const score = criteria.filter(Boolean).length;
    
    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    });
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please ensure both passwords are identical"
      });
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Password is too weak", {
        description: "Please choose a stronger password"
      });
      return;
    }
    
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await signUp(email, password, fullName, selectedRole, selectedDepartment);
      toast.success("Account created successfully", {
        description: "You have been signed in automatically"
      });
      navigate('/'); // Redirect to dashboard after successful signup
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error("Failed to create account", {
        description: error.message || "An unexpected error occurred"
      });
    }
  };

  // Redirect to dashboard if already signed in
  if (user) {
    return <Navigate to="/" />;
  }

  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score === 0) return 'bg-gray-200';
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
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
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
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
              <Label htmlFor="role">Select Your Role</Label>
              <div className="relative">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10"
                  required
                  minLength={8}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Password strength:</span>
                    <span className="text-xs font-medium">
                      {passwordStrength.score === 0 ? 'None' : 
                       passwordStrength.score < 2 ? 'Weak' : 
                       passwordStrength.score < 4 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`} 
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="text-xs space-y-1 text-muted-foreground mt-2">
                    <li className={passwordStrength.hasMinLength ? "text-green-500" : ""}>
                      ✓ At least 8 characters
                    </li>
                    <li className={passwordStrength.hasUppercase ? "text-green-500" : ""}>
                      ✓ At least one uppercase letter (A-Z)
                    </li>
                    <li className={passwordStrength.hasLowercase ? "text-green-500" : ""}>
                      ✓ At least one lowercase letter (a-z)
                    </li>
                    <li className={passwordStrength.hasNumber ? "text-green-500" : ""}>
                      ✓ At least one number (0-9)
                    </li>
                    <li className={passwordStrength.hasSpecialChar ? "text-green-500" : ""}>
                      ✓ At least one special character (!@#$%^&*...)
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500">Passwords don't match</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || password !== confirmPassword || passwordStrength.score < 3}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
