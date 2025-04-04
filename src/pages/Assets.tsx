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
  AlertCircle,
  Store
} from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';
import { useRequests } from '@/hooks/useRequests';
import { Asset, CheckoutHistory, HotelDepartment } from '@/types';
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetForm } from '@/components/forms/AssetForm';
import { CheckoutForm } from '@/components/forms/CheckoutForm';
import { CheckinForm } from '@/components/forms/CheckinForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { toast } from '@/components/ui/use-toast';

const Assets = () => {
  const { 
    assets, 
    checkoutHistory,
    loading: assetLoading, 
    addAsset,
    updateItem,
    deleteItem,
    checkOutAsset,
    checkInAsset,
    changeAssetStatus
  } = useAssets();

  const {
    loading: requestLoading,
    createRequest
  } = useRequests();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'add' | 'checkout' | 'checkin' | 'request'>('view');

  const loading = assetLoading || requestLoading;

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
      deleteItem(asset.id);
    }
  };

  const handleCheckout = (asset: Asset) => {
    if (asset.status !== 'available') {
      toast({
        title: "Cannot check out",
        description: `Asset is currently ${asset.status}`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAsset(asset);
    setDialogMode('checkout');
    setDialogOpen(true);
  };

  const handleCheckin = (asset: Asset) => {
    if (asset.status !== 'checked-out') {
      toast({
        title: "Cannot check in",
        description: "Asset is not currently checked out",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAsset(asset);
    setDialogMode('checkin');
    setDialogOpen(true);
  };

  const handleRequestAsset = (asset: Asset) => {
    if (asset.status !== 'available') {
      toast({
        title: "Cannot request",
        description: `Asset is currently ${asset.status}`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedAsset(asset);
    setDialogMode('request');
    setDialogOpen(true);
  };

  const handleAssetFormSubmit = (data: Omit<Asset, 'id'>) => {
    if (selectedAsset) {
      updateItem(selectedAsset.id, data);
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

  const handleRequestSubmit = (data: { requestedBy?: string; reason?: string; priority?: 'low' | 'medium' | 'high' | 'urgent'; department?: string }) => {
    if (selectedAsset) {
      createRequest({
        itemId: selectedAsset.id,
        itemType: 'asset',
        itemName: selectedAsset.name,
        requestedBy: data.requestedBy || '',
        reason: data.reason || '',
        priority: data.priority || 'medium',
        department: data.department as HotelDepartment || 'Front Office'
      });
      setDialogOpen(false);
    }
  };

  const handleStatusChange = (asset: Asset, newStatus: Asset['status']) => {
    if (asset.status === newStatus) return;
    
    if (newStatus === 'checked-out') {
      handleCheckout(asset);
      return;
    }
    
    if (asset.status === 'checked-out' && newStatus === 'available') {
      handleCheckin(asset);
      return;
    }
    
    changeAssetStatus(asset.id, newStatus);
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
      label: "Request",
      onClick: handleRequestAsset,
      icon: <Store className="h-4 w-4" />,
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
      case 'request':
        return 'Request Asset';
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
      case 'request':
        return 'Submit a request for this asset';
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
                  cell: (item: Asset) => item.expectedReturnDate ? formatDate(item.expectedReturnDate) : "No date set",
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
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColorClass(selectedAsset.status)}>
                      {selectedAsset.status}
                    </Badge>
                    <Select 
                      value={selectedAsset.status} 
                      onValueChange={(value) => handleStatusChange(selectedAsset, value as Asset['status'])}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="checked-out">Check Out</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <>
                    <Button variant="outline" onClick={() => handleCheckout(selectedAsset)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Check Out
                    </Button>
                    <Button onClick={() => handleRequestAsset(selectedAsset)}>
                      <Store className="mr-2 h-4 w-4" />
                      Request
                    </Button>
                  </>
                ) : selectedAsset.status === 'checked-out' ? (
                  <Button onClick={() => handleCheckin(selectedAsset)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In
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
          
          {dialogMode === 'request' && selectedAsset && (
            <RequestForm 
              item={selectedAsset}
              itemType="asset"
              onSubmit={handleRequestSubmit}
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
