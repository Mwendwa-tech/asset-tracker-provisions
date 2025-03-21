
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Phone, Mail, MapPin } from 'lucide-react';
import { mockSuppliers } from '@/utils/mockData';
import { Supplier } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from '@/components/ui/use-toast';
import { useSuppliers } from '@/hooks/useSuppliers';

const Suppliers = () => {
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

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
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (supplier: Supplier) => {
        deleteSupplier(supplier.id);
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Suppliers"
          description="Manage your suppliers and vendor relationships"
          actions={
            <Button onClick={() => {
              setSelectedSupplier(null);
              setDialogOpen(true);
            }}>
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

        {/* Supplier Detail Dialog - This would be expanded with a form in a real implementation */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
              <DialogDescription>
                {selectedSupplier ? 'Update supplier information' : 'Enter new supplier details'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This is a placeholder for the supplier form. In a real implementation, you would add form controls here.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: selectedSupplier ? "Supplier updated" : "Supplier added",
                  description: "This is a demo action. In a real implementation, this would save the supplier data.",
                });
                setDialogOpen(false);
              }}>
                {selectedSupplier ? 'Save Changes' : 'Add Supplier'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Suppliers;
