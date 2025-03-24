
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, User } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showSupabaseDialog, setShowSupabaseDialog] = useState(!isSupabaseConfigured());
  const { signUp, loading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Supabase is configured before attempting signup
    if (!isSupabaseConfigured()) {
      setShowSupabaseDialog(true);
      return;
    }
    
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  // Redirect to dashboard if already signed in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        {!isSupabaseConfigured() && (
          <Alert className="mx-6 mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Supabase Not Configured</AlertTitle>
            <AlertDescription>
              Please connect to Supabase and create a project before signing up.
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={!isSupabaseConfigured()}
                />
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
                  disabled={!isSupabaseConfigured()}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                  minLength={6}
                  disabled={!isSupabaseConfigured()}
                />
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading || !isSupabaseConfigured()}
            >
              {!isSupabaseConfigured() ? 'Supabase Not Connected' : loading ? 'Creating account...' : 'Create account'}
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

      <Dialog open={showSupabaseDialog} onOpenChange={setShowSupabaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Supabase Project</DialogTitle>
            <DialogDescription>
              You've connected to your Supabase organization, but you need to create a project to use this application.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Supabase Project Found</AlertTitle>
              <AlertDescription>
                Your organization "Mwendwa-tech's Org" doesn't have any projects yet. You need to create one.
              </AlertDescription>
            </Alert>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click on the Supabase icon in the top navigation bar</li>
              <li>Select "Create a new project" option</li>
              <li>Follow the steps to create your project (it's free!)</li>
              <li>Once created, select your new project</li>
              <li>After connecting, refresh the page</li>
            </ol>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                alert("Please click on the Supabase icon in the top navigation bar to create and connect a Supabase project, then reload the page");
                setShowSupabaseDialog(false);
              }}
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
