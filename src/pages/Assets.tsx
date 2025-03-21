
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Briefcase, 
  Plus, 
  Trash, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { Asset, CheckoutHistory } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  formatCurrency, 
  formatDate, 
  getStatusColorClass, 
  getConditionColorClass 
} from '@/utils/formatters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Assets = () => {
  const { 
    assets, 
    checkoutHistory,
    loading, 
    addAsset,
    updateAsset,
    deleteAsset,
    checkOutAsset,
    checkInAsset
  } = useAssets();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  const assetColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Asset,
      cell: (item: Asset) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.category}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Asset,
      cell: (item: Asset) => (
        <Badge className={getStatusColorClass(item.status)}>
          {item.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: "Location",
      accessorKey: "location" as keyof Asset,
      sortable: true,
    },
    {
      header: "Condition",
      accessorKey: "condition" as keyof Asset,
      cell: (item: Asset) => (
        <span className={getConditionColorClass(item.condition)}>
          {item.condition}
        </span>
      ),
      sortable: true,
    },
    {
      header: "Value",
      accessorKey: "currentValue" as keyof Asset,
      cell: (item: Asset) => formatCurrency(item.currentValue),
      sortable: true,
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: (item: Asset) => {
        console.log("Edit:", item);
        // You would implement edit functionality here
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (item: Asset) => {
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
          title="Asset Management"
          description="Track and manage all your assets"
          actions={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Button>
          }
        />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="checked-out">Checked Out</TabsTrigger>
            <TabsTrigger value="checkout-history">Checkout History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <DataTable
              data={assets}
              columns={assetColumns}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              searchable
              searchKeys={["name", "category", "location"]}
            />
          </TabsContent>
          
          <TabsContent value="available" className="space-y-4">
            <DataTable
              data={assets.filter(asset => asset.status === 'available')}
              columns={assetColumns}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              searchable
              searchKeys={["name", "category", "location"]}
            />
          </TabsContent>
          
          <TabsContent value="checked-out" className="space-y-4">
            <DataTable
              data={assets.filter(asset => asset.status === 'checked-out')}
              columns={[
                ...assetColumns,
                {
                  header: "Assigned To",
                  accessorKey: "assignedTo" as keyof Asset,
                  sortable: true,
                },
                {
                  header: "Expected Return",
                  accessorKey: "expectedReturnDate" as keyof Asset,
                  cell: (item: Asset) => formatDate(item.expectedReturnDate),
                  sortable: true,
                },
              ]}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              searchable
              searchKeys={["name", "category", "location", "assignedTo"]}
            />
          </TabsContent>
          
          <TabsContent value="checkout-history" className="space-y-4">
            <DataTable
              data={checkoutHistory}
              columns={[
                {
                  header: "Asset",
                  accessorKey: "assetName" as keyof CheckoutHistory,
                  sortable: true,
                },
                {
                  header: "Checked Out By",
                  accessorKey: "checkedOutBy" as keyof CheckoutHistory,
                  sortable: true,
                },
                {
                  header: "Checkout Date",
                  accessorKey: "checkedOutDate" as keyof CheckoutHistory,
                  cell: (item: CheckoutHistory) => formatDate(item.checkedOutDate),
                  sortable: true,
                },
                {
                  header: "Return Date",
                  accessorKey: "returnedDate" as keyof CheckoutHistory,
                  cell: (item: CheckoutHistory) => 
                    item.returnedDate 
                      ? formatDate(item.returnedDate)
                      : "Not returned yet",
                  sortable: true,
                },
                {
                  header: "Status",
                  accessorKey: "returnedDate" as keyof CheckoutHistory,
                  cell: (item: CheckoutHistory) => 
                    item.returnedDate 
                      ? <Badge className="bg-green-100 text-green-800">Returned</Badge>
                      : <Badge className="bg-blue-100 text-blue-800">Active</Badge>,
                  sortable: false,
                },
              ]}
              searchable
              searchKeys={["assetName", "checkedOutBy"]}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Asset Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAsset?.name}</DialogTitle>
            <DialogDescription>
              {selectedAsset?.category} • {selectedAsset?.location}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColorClass(selectedAsset.status)}>
                    {selectedAsset.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className={`text-lg font-medium ${getConditionColorClass(selectedAsset.condition)}`}>
                    {selectedAsset.condition}
                  </p>
                </div>
              </div>
              
              {selectedAsset.status === 'checked-out' && (
                <div className="rounded-md bg-blue-50 p-3">
                  <p className="text-sm font-medium text-blue-800">Currently checked out</p>
                  <p className="text-sm text-blue-700">
                    Assigned to: <span className="font-medium">{selectedAsset.assignedTo}</span>
                  </p>
                  {selectedAsset.expectedReturnDate && (
                    <p className="text-sm text-blue-700">
                      Expected return: <span className="font-medium">{formatDate(selectedAsset.expectedReturnDate)}</span>
                    </p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p className="text-lg font-medium">
                    {formatDate(selectedAsset.purchaseDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Value</p>
                  <p className="text-lg font-medium">
                    {formatCurrency(selectedAsset.purchaseValue)}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-lg font-medium">
                  {formatCurrency(selectedAsset.currentValue)}
                </p>
              </div>
              
              {selectedAsset.lastMaintenance && (
                <div>
                  <p className="text-sm text-muted-foreground">Last Maintenance</p>
                  <p className="text-lg font-medium">
                    {formatDate(selectedAsset.lastMaintenance)}
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                
                {selectedAsset.status === 'available' ? (
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check Out
                  </Button>
                ) : selectedAsset.status === 'checked-out' ? (
                  <Button>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                ) : selectedAsset.status === 'maintenance' ? (
                  <Button>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Mark as Available
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Assets;
