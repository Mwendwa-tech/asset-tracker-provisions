
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { useUsers } from '@/hooks/useUsers';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, UserCog, Users as UsersIcon, Shield } from 'lucide-react';
import { ActiveUsersList } from '@/components/admin/ActiveUsersList';
import { useAuth } from '@/context/AuthContext';
import { UserManagement } from '@/components/admin/UserManagement';

const Users = () => {
  const { users } = useUsers();
  const { isAdmin } = useAuth();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (user: any) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user: any) => (
        <Badge className="capitalize">
          {user.role}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: "Department",
      accessorKey: "department",
      sortable: true,
    },
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in space-y-6">
        <PageHeader
          title="User Management"
          description="Manage hotel staff and their permissions"
          actions={
            <Button onClick={() => setAddUserDialogOpen(true)} disabled={!isAdmin()}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          }
        />

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users"><UsersIcon className="h-4 w-4 mr-2" /> All Users</TabsTrigger>
            <TabsTrigger value="active"><UserCog className="h-4 w-4 mr-2" /> Active Sessions</TabsTrigger>
            {isAdmin() && (
              <TabsTrigger value="admin"><Shield className="h-4 w-4 mr-2" /> Admin Controls</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <DataTable
              data={users}
              columns={columns}
              searchable
              searchKeys={["name", "email", "role"]}
            />
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <ActiveUsersList />
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="admin" className="space-y-4">
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Users;
