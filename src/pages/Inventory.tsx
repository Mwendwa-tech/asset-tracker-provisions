
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  Edit, 
  Package, 
  Plus, 
  Trash,
  ArrowUpDown
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStockLevelClass } from '@/utils/formatters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Inventory = () => {
  const { 
    items, 
    lowStockAlerts, 
    transactions,
    loading, 
    addItem, 
    updateItem, 
    deleteItem 
  } = useInventory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleRowClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const inventoryColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof InventoryItem,
      cell: (item: InventoryItem) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.category}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Quantity",
      accessorKey: "quantity" as keyof InventoryItem,
      cell: (item: InventoryItem) => (
        <div className={getStockLevelClass(item.quantity, item.minStockLevel)}>
          {item.quantity} {item.unit}
          {item.quantity <= item.minStockLevel && (
            <div className="mt-1 flex items-center text-xs text-amber-600">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Low stock
            </div>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Location",
      accessorKey: "location" as keyof InventoryItem,
      sortable: true,
    },
    {
      header: "Value",
      accessorKey: "currentValue" as keyof InventoryItem,
      cell: (item: InventoryItem) => formatCurrency(item.currentValue),
      sortable: true,
    },
    {
      header: "Last Updated",
      accessorKey: "lastUpdated" as keyof InventoryItem,
      cell: (item: InventoryItem) => formatDate(item.lastUpdated),
      sortable: true,
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: (item: InventoryItem) => {
        console.log("Edit:", item);
        // You would implement edit functionality here
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (item: InventoryItem) => {
        console.log("Delete:", item);
        // You would implement delete functionality here
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Inventory Management"
          description="Manage your entire inventory from one place"
          actions={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          }
        />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="low-stock">
              Low Stock
              {lowStockAlerts.length > 0 && (
                <Badge className="ml-2 bg-amber-500" variant="secondary">
                  {lowStockAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <DataTable
              data={items}
              columns={inventoryColumns}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              searchable
              searchKeys={["name", "category", "location"]}
            />
          </TabsContent>
          
          <TabsContent value="low-stock" className="space-y-4">
            <DataTable
              data={items.filter(item => item.quantity <= item.minStockLevel)}
              columns={inventoryColumns}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              searchable
              searchKeys={["name", "category", "location"]}
            />
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="rounded-md border">
              <DataTable
                data={transactions}
                columns={[
                  {
                    header: "Item",
                    accessorKey: "itemName",
                    cell: (transaction) => (
                      <div className="font-medium">{transaction.itemName}</div>
                    ),
                    sortable: true,
                  },
                  {
                    header: "Type",
                    accessorKey: "type",
                    cell: (transaction) => (
                      <Badge
                        className={
                          transaction.type === "received"
                            ? "bg-green-100 text-green-800"
                            : transaction.type === "used"
                            ? "bg-blue-100 text-blue-800"
                            : transaction.type === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    ),
                    sortable: true,
                  },
                  {
                    header: "Quantity",
                    accessorKey: "quantity",
                    cell: (transaction) => (
                      <div>
                        {transaction.type === "adjusted" && transaction.quantity < 0
                          ? transaction.quantity
                          : transaction.type === "adjusted"
                          ? `+${transaction.quantity}`
                          : transaction.quantity}
                      </div>
                    ),
                    sortable: true,
                  },
                  {
                    header: "Date",
                    accessorKey: "date",
                    cell: (transaction) => formatDate(transaction.date),
                    sortable: true,
                  },
                  {
                    header: "Performed By",
                    accessorKey: "performedBy",
                    sortable: true,
                  },
                ]}
                searchable
                searchKeys={["itemName", "type", "performedBy"]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
            <DialogDescription>
              {selectedItem?.category} • {selectedItem?.location}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Stock</p>
                  <p className={`text-lg font-medium ${
                    getStockLevelClass(selectedItem.quantity, selectedItem.minStockLevel)
                  }`}>
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minimum Stock</p>
                  <p className="text-lg font-medium">
                    {selectedItem.minStockLevel} {selectedItem.unit}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedItem.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-medium">
                    {formatDate(selectedItem.lastUpdated)}
                  </p>
                </div>
              </div>
              
              {selectedItem.expiryDate && (
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="text-lg font-medium">
                    {formatDate(selectedItem.expiryDate)}
                  </p>
                </div>
              )}
              
              {selectedItem.supplier && (
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="text-lg font-medium">{selectedItem.supplier}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Adjust Stock
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inventory;
