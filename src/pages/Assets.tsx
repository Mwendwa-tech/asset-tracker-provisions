
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
import { AssetForm } from '@/components/forms/AssetForm';
import { CheckoutForm } from '@/components/forms/CheckoutForm';
import { CheckinForm } from '@/components/forms/CheckinForm';
import { toast } from '@/components/ui/use-toast';

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
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'add' | 'checkout' | 'checkin'>('view');

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleAddAsset = () => {
    setSelectedAsset(null);
    setDialogMode('add');
    setDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleDeleteAsset = (asset: Asset) => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      deleteAsset(asset.id);
    }
  };

  const handleCheckout = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogMode('checkout');
    setDialogOpen(true);
  };

  const handleCheckin = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogMode('checkin');
    setDialogOpen(true);
  };

  const handleAssetFormSubmit = (data: Omit<Asset, 'id'>) => {
    if (selectedAsset) {
      updateAsset(selectedAsset.id, data);
    } else {
      addAsset(data);
    }
    setDialogOpen(false);
  };

  const handleCheckoutSubmit = (data: { assignedTo: string; expectedReturnDate?: Date; notes?: string }) => {
    if (selectedAsset) {
      checkOutAsset(selectedAsset.id, data.assignedTo, data.expectedReturnDate, data.notes);
      setDialogOpen(false);
    }
  };

  const handleCheckinSubmit = (data: { notes?: string }) => {
    if (selectedAsset) {
      checkInAsset(selectedAsset.id, data.notes);
      setDialogOpen(false);
    }
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
      onClick: handleEditAsset,
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: handleDeleteAsset,
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  const getDialogTitle = () => {
    switch (dialogMode) {
      case 'add':
        return 'Add New Asset';
      case 'edit':
        return 'Edit Asset';
      case 'checkout':
        return 'Check Out Asset';
      case 'checkin':
        return 'Check In Asset';
      default:
        return selectedAsset?.name || 'Asset Details';
    }
  };

  const getDialogDescription = () => {
    switch (dialogMode) {
      case 'add':
        return 'Enter details for the new asset';
      case 'edit':
        return 'Update asset information';
      case 'checkout':
        return 'Assign this asset to a person';
      case 'checkin':
        return 'Return this asset to inventory';
      default:
        return selectedAsset ? `${selectedAsset.category} • ${selectedAsset.location}` : '';
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Asset Management"
          description="Track and manage all your assets"
          actions={
            <Button onClick={handleAddAsset}>
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
        <DialogContent className={dialogMode === 'view' ? "sm:max-w-md" : "sm:max-w-lg"}>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode === 'view' && selectedAsset && (
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
                <Button variant="outline" onClick={() => handleEditAsset(selectedAsset)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                
                {selectedAsset.status === 'available' ? (
                  <Button onClick={() => handleCheckout(selectedAsset)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check Out
                  </Button>
                ) : selectedAsset.status === 'checked-out' ? (
                  <Button onClick={() => handleCheckin(selectedAsset)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                ) : selectedAsset.status === 'maintenance' ? (
                  <Button onClick={() => updateAsset(selectedAsset.id, { status: 'available' })}>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Mark as Available
                  </Button>
                ) : null}
              </div>
            </div>
          )}
          
          {(dialogMode === 'add' || dialogMode === 'edit') && (
            <AssetForm 
              asset={dialogMode === 'edit' ? selectedAsset || undefined : undefined}
              onSubmit={handleAssetFormSubmit}
              onCancel={() => setDialogOpen(false)}
              loading={loading}
            />
          )}
          
          {dialogMode === 'checkout' && selectedAsset && (
            <CheckoutForm 
              asset={selectedAsset}
              onSubmit={handleCheckoutSubmit}
              onCancel={() => setDialogOpen(false)}
              loading={loading}
            />
          )}
          
          {dialogMode === 'checkin' && selectedAsset && (
            <CheckinForm 
              asset={selectedAsset}
              onSubmit={handleCheckinSubmit}
              onCancel={() => setDialogOpen(false)}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Assets;
