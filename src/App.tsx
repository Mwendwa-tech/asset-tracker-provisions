
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/components/ui/NotificationCenter";
import { Suspense, lazy } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, initialized } = useAuth();
  
  // Show nothing while checking authentication
  if (!initialized || loading) {
    return <LoadingSpinner />;
  }
  
  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" />;
  }
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

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
