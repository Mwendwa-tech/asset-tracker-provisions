
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Phone, Mail, MapPin } from 'lucide-react';
import { Supplier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSuppliers } from '@/hooks/useSuppliers';

const Suppliers = () => {
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const form = useForm<Omit<Supplier, 'id'>>({
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      categories: []
    }
  });

  const supplierColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Supplier,
      cell: (item: Supplier) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.contactPerson}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Contact",
      accessorKey: "email" as keyof Supplier,
      cell: (item: Supplier) => (
        <div>
          <div className="flex items-center text-sm">
            <Mail className="h-3 w-3 mr-1" /> {item.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1" /> {item.phone}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Address",
      accessorKey: "address" as keyof Supplier,
      cell: (item: Supplier) => (
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" /> {item.address}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Categories",
      accessorKey: "categories" as keyof Supplier,
      cell: (item: Supplier) => (
        <div className="flex flex-wrap gap-1">
          {item.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      ),
      sortable: false,
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        form.reset({
          name: supplier.name,
          contactPerson: supplier.contactPerson,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          categories: supplier.categories
        });
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (supplier: Supplier) => {
        if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
          deleteSupplier(supplier.id);
        }
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    form.reset({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      categories: supplier.categories
    });
    setDialogOpen(true);
  };

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    form.reset({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      categories: []
    });
    setDialogOpen(true);
  };

  const handleSubmit = form.handleSubmit((data) => {
    const formData = {
      ...data,
      categories: data.categories.filter(Boolean) // Remove empty categories
    };

    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, formData);
    } else {
      addSupplier(formData);
    }
    setDialogOpen(false);
  });

  const handleCategoryChange = (value: string, index: number) => {
    const currentCategories = form.getValues().categories || [];
    const newCategories = [...currentCategories];
    newCategories[index] = value;
    form.setValue('categories', newCategories);
  };

  const addCategory = () => {
    const currentCategories = form.getValues().categories || [];
    form.setValue('categories', [...currentCategories, '']);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Suppliers"
          description="Manage your suppliers and vendor relationships"
          actions={
            <Button onClick={handleAddSupplier}>
              <Plus className="mr-2 h-4 w-4" /> Add Supplier
            </Button>
          }
        />

        <DataTable
          data={suppliers}
          columns={supplierColumns}
          onRowClick={handleRowClick}
          rowActions={rowActions}
          searchable
          searchKeys={["name", "contactPerson", "email", "address", "categories"]}
        />

        {/* Supplier Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
              <DialogDescription>
                {selectedSupplier ? 'Update supplier information' : 'Enter new supplier details'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input 
                  id="name" 
                  {...form.register('name', { required: true })}
                  placeholder="Company name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">Name is required</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input 
                  id="contactPerson" 
                  {...form.register('contactPerson')}
                  placeholder="Primary contact name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    {...form.register('email')}
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    {...form.register('phone')}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  {...form.register('address')}
                  placeholder="123 Main St, City, State"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2">
                  {form.watch('categories', []).map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value, index)}
                        placeholder="Category name"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                    Add Category
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  )}
                  {selectedSupplier ? 'Save Changes' : 'Add Supplier'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Suppliers;
