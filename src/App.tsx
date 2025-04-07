
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/components/ui/NotificationCenter";
import { Suspense, lazy, useEffect } from "react";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { ThemeProvider } from "./components/theme-provider";

// Load Dashboard directly to avoid lazy loading issues
import Dashboard from "./pages/Index";

// Lazy load other pages to improve initial load time
const Inventory = lazy(() => import("./pages/Inventory"));
const Assets = lazy(() => import("./pages/Assets"));
const Reports = lazy(() => import("./pages/Reports"));
const Suppliers = lazy(() => import("./pages/Suppliers"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Requests = lazy(() => import("./pages/Requests"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create query client with optimized settings for responsiveness
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true, // Enable auto-refresh when window regains focus
      staleTime: 1000 * 30, // 30 seconds - shorter time for more frequent updates
      cacheTime: 1000 * 60 * 5, // 5 minutes
      refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes for real-time data
    },
  },
});

// Improved loading spinner
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

// Enhanced protected route with better error handling
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized } = useAuth();
  
  // Add timeout for loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading state taking too long");
      }
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [loading]);
  
  if (!initialized || loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

// Add global styles for scrollbars
const AppStyles = () => {
  useEffect(() => {
    // Add custom scrollbar styles to the document
    const style = document.createElement('style');
    style.textContent = `
      /* Custom scrollbar styles */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.3);
      }
      
      /* For Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
      }
      
      /* Ensure content is scrollable */
      html, body {
        overflow-y: auto;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

// App component with improved initialization
const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <AppStyles />
            <Toaster />
            <Sonner closeButton position="top-right" />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                
                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route 
                  path="/inventory" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Inventory />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/assets" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Assets />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Reports />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/suppliers" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Suppliers />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Users />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/requests" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Requests />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
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
