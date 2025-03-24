
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Dashboard from "./pages/Index";
import Inventory from "./pages/Inventory";
import Assets from "./pages/Assets";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { ThemeProvider } from "./components/theme-provider";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized } = useAuth();
  
  // If Supabase is not configured, show configuration message
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <Alert className="max-w-xl">
          <AlertTitle className="text-lg font-semibold">Supabase Configuration Required</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="mb-2">
              To use this application, you need to connect to Supabase and configure your environment variables.
            </div>
            <div className="mb-4">
              Please set the following environment variables in your Lovable Supabase integration:
            </div>
            <ul className="list-disc pl-6 mt-2 mb-2">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
            <div className="flex justify-end">
              <Button onClick={() => window.location.reload()}>
                Reload Application
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Show nothing while checking authentication
  if (!initialized || loading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>;
  }
  
  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
