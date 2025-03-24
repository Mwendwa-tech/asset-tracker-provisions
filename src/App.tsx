
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized } = useAuth();
  const [showSupabaseDialog, setShowSupabaseDialog] = useState(false);
  
  useEffect(() => {
    // Only show the dialog if Supabase is not configured and we've initialized auth
    if (!isSupabaseConfigured() && initialized && !loading) {
      setShowSupabaseDialog(true);
    }
  }, [initialized, loading]);
  
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
  
  return (
    <>
      {children}
      
      <AlertDialog open={showSupabaseDialog} onOpenChange={setShowSupabaseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Connect to Supabase?</AlertDialogTitle>
            <AlertDialogDescription>
              This application requires Supabase to function. Would you like to connect to Supabase now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => window.open("https://lovable.dev/docs", "_blank")}>
              No, I need more info
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                // This will guide the user to the Supabase connection in Lovable
                alert("Please click on the Supabase icon in the top navigation bar to connect your Supabase project, then reload the page");
                setShowSupabaseDialog(false);
              }}
            >
              Yes, connect now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
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
