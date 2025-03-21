
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Mail, User } from 'lucide-react';
import { mockUsers } from '@/utils/mockData';
import { User as UserType } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { useUsers } from '@/hooks/useUsers';

const Users = () => {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const getUserRoleBadge = (role: string) => {
    switch(role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case 'manager':
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>;
      case 'staff':
        return <Badge className="bg-green-100 text-green-800">Staff</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const userColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof UserType,
      cell: (item: UserType) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="font-medium">{item.name}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Email",
      accessorKey: "email" as keyof UserType,
      cell: (item: UserType) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-1" />
          <span>{item.email}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Department",
      accessorKey: "department" as keyof UserType,
      sortable: true,
    },
    {
      header: "Role",
      accessorKey: "role" as keyof UserType,
      cell: (item: UserType) => getUserRoleBadge(item.role),
      sortable: true,
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: (user: UserType) => {
        setSelectedUser(user);
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (user: UserType) => {
        deleteUser(user.id);
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  const handleRowClick = (user: UserType) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Users"
          description="Manage user accounts and permissions"
          actions={
            <Button onClick={() => {
              setSelectedUser(null);
              setDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          }
        />

        <DataTable
          data={users}
          columns={userColumns}
          onRowClick={handleRowClick}
          rowActions={rowActions}
          searchable
          searchKeys={["name", "email", "department", "role"]}
        />

        {/* User Detail Dialog - This would be expanded with a form in a real implementation */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {selectedUser ? 'Update user information' : 'Enter new user details'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a placeholder for the user form. In a real implementation, you would add form controls here.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: selectedUser ? "User updated" : "User added",
                  description: "This is a demo action. In a real implementation, this would save the user data.",
                });
                setDialogOpen(false);
              }}>
                {selectedUser ? 'Save Changes' : 'Add User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Users;
