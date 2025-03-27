import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Mail, User as UserIcon, Shield } from 'lucide-react';
import { User as UserType, Permission, HotelDepartment, RolePermissions } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { useUsers } from '@/hooks/useUsers';
import { useAuth } from '@/context/AuthContext';

const Users = () => {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
  const { hasPermission } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: string;
    department: HotelDepartment;
  }>({
    name: '',
    email: '',
    role: 'staff',
    department: 'Front Office'
  });

  const canManageUsers = hasPermission(Permission.ManageUsers);

  const departments: HotelDepartment[] = [
    'Executive',
    'Front Office',
    'Housekeeping',
    'Food & Beverage',
    'Kitchen',
    'Maintenance',
    'Accounting',
    'Human Resources',
    'Purchasing',
    'Stores',
    'Security',
    'Spa & Wellness'
  ];

  const roles = [
    { value: 'generalManager', label: 'General Manager' },
    { value: 'departmentHead', label: 'Department Head' },
    { value: 'storekeeper', label: 'Storekeeper' },
    { value: 'roomsManager', label: 'Rooms Manager' },
    { value: 'fbManager', label: 'F&B Manager' },
    { value: 'housekeeper', label: 'Housekeeper' },
    { value: 'frontDesk', label: 'Front Desk' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'chef', label: 'Chef' },
    { value: 'staff', label: 'Staff' }
  ];

  const getUserRoleBadge = (role: string) => {
    switch(role) {
      case 'generalManager':
        return <Badge className="bg-purple-100 text-purple-800">General Manager</Badge>;
      case 'departmentHead':
        return <Badge className="bg-blue-100 text-blue-800">Department Head</Badge>;
      case 'storekeeper':
        return <Badge className="bg-amber-100 text-amber-800">Storekeeper</Badge>;
      case 'roomsManager':
        return <Badge className="bg-green-100 text-green-800">Rooms Manager</Badge>;
      case 'fbManager':
        return <Badge className="bg-pink-100 text-pink-800">F&B Manager</Badge>;
      case 'chef':
        return <Badge className="bg-red-100 text-red-800">Chef</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role.charAt(0).toUpperCase() + role.slice(1).replace(/([A-Z])/g, ' $1')}</Badge>;
    }
  };

  const resetForm = () => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        department: selectedUser.department
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'staff',
        department: 'Front Office'
      });
    }
  };

  const openDialog = (user: UserType | null = null) => {
    setSelectedUser(user);
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    if (selectedUser) {
      updateUser(selectedUser.id, {
        ...formData,
        role: formData.role as UserType['role']
      });
    } else {
      addUser({
        ...formData,
        role: formData.role as UserType['role']
      });
    }
    
    setDialogOpen(false);
  };

  const userColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof UserType,
      cell: (item: UserType) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <UserIcon className="h-4 w-4 text-gray-600" />
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
    {
      header: "Permissions",
      accessorKey: "role" as keyof UserType,
      cell: (item: UserType) => (
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          <span>{RolePermissions[item.role].length}</span>
        </div>
      ),
      sortable: false,
    }
  ];

  const rowActions = canManageUsers ? [
    {
      label: "Edit",
      onClick: (user: UserType) => openDialog(user),
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (user: UserType) => {
        deleteUser(user.id);
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ] : [];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="User Management"
          description="Manage hotel staff accounts and permissions"
          actions={
            canManageUsers && (
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            )
          }
        />

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p>Loading users...</p>
          </div>
        ) : (
          <DataTable
            data={users}
            columns={userColumns}
            onRowClick={canManageUsers ? (user) => openDialog(user) : undefined}
            rowActions={rowActions}
            searchable
            searchKeys={["name", "email", "department", "role"]}
          />
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
              <DialogDescription>
                {selectedUser ? 'Update staff information and permissions' : 'Enter new staff member details'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Enter full name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  placeholder="email@grandfivestar.hotel" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => setFormData({...formData, department: value as HotelDepartment})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({...formData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="flex space-x-2 sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSubmit}>
                {selectedUser ? 'Update Staff' : 'Add Staff'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Users;
