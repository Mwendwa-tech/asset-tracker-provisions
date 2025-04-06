
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/components/ui/NotificationCenter";
import { Suspense, lazy, useState, useEffect } from "react";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { ThemeProvider } from "./components/theme-provider";

// Lazy load pages to improve initial load time
const Dashboard = lazy(() => import("./pages/Index"));
const Inventory = lazy(() => import("./pages/Inventory"));
const Assets = lazy(() => import("./pages/Assets"));
const Reports = lazy(() => import("./pages/Reports"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Requests = lazy(() => import("./pages/Requests"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create query client with shorter stale time for faster refresh
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Only retry once to avoid unnecessary waiting
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

// Simplified loading spinner with timeout to prevent infinite loading
const LoadingSpinner = () => {
  const [showFallbackMessage, setShowFallbackMessage] = useState(false);
  
  useEffect(() => {
    // If loading takes too long, show a message
    const timeout = setTimeout(() => {
      setShowFallbackMessage(true);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      {showFallbackMessage && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Taking longer than expected...</p>
          <p className="text-xs text-gray-400">Try refreshing the page if this continues.</p>
        </div>
      )}
    </div>
  );
};

// Protected route component with better timeout handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized } = useAuth();
  const [timeoutError, setTimeoutError] = useState(false);
  
  useEffect(() => {
    // Set a timeout to handle potential infinite loading
    const timeout = setTimeout(() => {
      if (loading && !initialized) {
        setTimeoutError(true);
        console.error("Authentication initialization timeout");
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [loading, initialized]);
  
  // Show error state if initialization takes too long
  if (timeoutError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4">
        <div className="rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-bold">Unable to authenticate</h2>
          <p className="mb-4 text-gray-500">Please try refreshing the page.</p>
          <button 
            className="rounded bg-primary px-4 py-2 text-white"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  // Show loading spinner while checking authentication
  if (loading || !initialized) {
    return <LoadingSpinner />;
  }
  
  // Redirect to sign-in if not authenticated
  if (!user && initialized && !loading) {
    return <Navigate to="/sign-in" />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// App component with simplified initialization
const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
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
                <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
