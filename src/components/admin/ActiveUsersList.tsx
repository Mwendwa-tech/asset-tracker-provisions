
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, UserCheck, Shield, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { companyInfo } from '@/config/systemConfig';

export function ActiveUsersList() {
  const { user, isAdmin, signOut } = useAuth();
  const [activeUsers, setActiveUsers] = React.useState<User[]>([]);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  
  // Get active users from localStorage
  React.useEffect(() => {
    const storedUsers = localStorage.getItem('mock_active_users');
    if (storedUsers) {
      setActiveUsers(JSON.parse(storedUsers));
    }
  }, []);
  
  const handleSignOutUser = async (userId: string) => {
    await signOut(userId);
    // Refresh the list
    const storedUsers = localStorage.getItem('mock_active_users');
    if (storedUsers) {
      setActiveUsers(JSON.parse(storedUsers));
    }
    setShowConfirm(false);
  };
  
  const confirmSignOut = (user: User) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };
  
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'generalManager':
        return 'bg-red-100 text-red-800';
      case 'departmentHead':
        return 'bg-blue-100 text-blue-800';
      case 'storekeeper':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Only admins can see this component
  if (!isAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
            Access Restricted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>You need administrator privileges to view active users of {companyInfo.name}.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="mr-2 h-5 w-5" />
            Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 scrollbar-visible">
            {activeUsers.length === 0 ? (
              <p className="text-muted-foreground">No active users found</p>
            ) : (
              activeUsers.map((activeUser) => (
                <div
                  key={activeUser.id}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{activeUser.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {activeUser.email}
                    </div>
                    <div className="flex items-center mt-1">
                      <Badge className={getRoleBadgeColor(activeUser.role)}>
                        {activeUser.role}
                      </Badge>
                      <span className="ml-2 text-xs">{activeUser.department}</span>
                    </div>
                  </div>
                  
                  <div>
                    {activeUser.id === user?.id ? (
                      <Badge variant="outline" className="ml-2">
                        Current User
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmSignOut(activeUser)}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out {selectedUser?.name} from {companyInfo.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedUser && handleSignOutUser(selectedUser.id)}
            >
              Sign Out User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
