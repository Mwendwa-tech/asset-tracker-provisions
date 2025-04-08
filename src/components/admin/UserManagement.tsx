
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from '@/types';
import { LogOut, ShieldAlert, RefreshCw } from 'lucide-react';
import { companyInfo, multiUserSettings } from '@/config/systemConfig';
import { ScrollArea } from '@/components/ui/scroll-area';

export function UserManagement() {
  const { isAdmin, user, signOut } = useAuth();
  const [activeUsers, setActiveUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('mock_active_users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Setup sync for real-time active users updates
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'mock_active_users') {
        refreshActiveUsers();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Periodically check for updates
    const interval = setInterval(refreshActiveUsers, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  const refreshActiveUsers = () => {
    const storedUsers = localStorage.getItem('mock_active_users');
    if (storedUsers) {
      setActiveUsers(JSON.parse(storedUsers));
    }
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
    refreshActiveUsers();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  const handleSignOutUser = async (userId: string) => {
    if (!isAdmin()) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can sign out other users",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await signOut(userId);
      // Update local state after successful sign out
      setActiveUsers(prev => prev.filter(u => u.id !== userId));
      
      // Trigger cross-tab notification
      window.localStorage.setItem(multiUserSettings.channels.users, new Date().toISOString());
      
      toast({
        title: "User Signed Out",
        description: "The user has been successfully signed out"
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to sign out user",
        variant: "destructive"
      });
    }
    
    setConfirmSignOutOpen(false);
  };

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Administrator Access Required</h2>
        <p className="text-muted-foreground text-center max-w-md">
          You need administrator privileges to manage {companyInfo.name} users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{companyInfo.name} User Management</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        As an administrator, you can monitor and manage active users.
      </p>
      
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="grid gap-4">
          {activeUsers.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">No active users found</p>
          ) : (
            activeUsers.map(activeUser => (
              <div key={activeUser.id} className="flex items-center justify-between p-4 rounded-md border bg-card">
                <div>
                  <p className="font-medium">{activeUser.name}</p>
                  <p className="text-sm text-muted-foreground">{activeUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {activeUser.role}
                    </span>
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {activeUser.department}
                    </span>
                  </div>
                </div>
                
                {user?.id !== activeUser.id && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => {
                      setSelectedUser(activeUser);
                      setConfirmSignOutOpen(true);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out User
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <AlertDialog open={confirmSignOutOpen} onOpenChange={setConfirmSignOutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out {selectedUser?.name} from {companyInfo.name}? This will immediately terminate their session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedUser && handleSignOutUser(selectedUser.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Sign Out User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
