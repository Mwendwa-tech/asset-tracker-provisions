
import React, { useState } from 'react';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Eye, Edit, Trash, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { generateId } from '@/utils/formatters';
import { companyInfo } from '@/config/systemConfig';
import { toast } from '@/components/ui/use-toast';

interface LPOItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

interface LocalPurchaseOrderData {
  id: string;
  lpoNumber: string;
  vendor: string;
  department: string;
  requestedBy: string;
  approvedBy?: string;
  dateCreated: Date;
  dateRequired: Date;
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'received' | 'cancelled';
  items: LPOItem[];
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
  terms?: string;
}

export function LocalPurchaseOrder() {
  const [orders, setOrders] = useState<LocalPurchaseOrderData[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LocalPurchaseOrderData | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit' | 'add'>('add');
  const [orderItems, setOrderItems] = useState<LPOItem[]>([]);

  const form = useForm<Omit<LocalPurchaseOrderData, 'id' | 'lpoNumber' | 'items' | 'subtotal' | 'total'>>({
    defaultValues: {
      vendor: '',
      department: '',
      requestedBy: '',
      dateCreated: new Date(),
      dateRequired: new Date(),
      status: 'draft',
      notes: '',
      terms: 'Net 30'
    }
  });

  const itemForm = useForm<Omit<LPOItem, 'id' | 'totalPrice'>>({
    defaultValues: {
      description: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0
    }
  });

  const columns = [
    {
      header: "LPO Number",
      accessorKey: "lpoNumber" as keyof LocalPurchaseOrderData,
      cell: (order: LocalPurchaseOrderData) => (
        <div className="font-medium">{order.lpoNumber}</div>
      ),
      sortable: true,
    },
    {
      header: "Vendor",
      accessorKey: "vendor" as keyof LocalPurchaseOrderData,
      sortable: true,
    },
    {
      header: "Department",
      accessorKey: "department" as keyof LocalPurchaseOrderData,
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof LocalPurchaseOrderData,
      cell: (order: LocalPurchaseOrderData) => (
        <Badge className={getStatusColor(order.status)}>
          {order.status}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: "Total",
      accessorKey: "total" as keyof LocalPurchaseOrderData,
      cell: (order: LocalPurchaseOrderData) => (
        <div className="font-medium">${order.total.toFixed(2)}</div>
      ),
      sortable: true,
    },
    {
      header: "Date Created",
      accessorKey: "dateCreated" as keyof LocalPurchaseOrderData,
      cell: (order: LocalPurchaseOrderData) => 
        new Date(order.dateCreated).toLocaleDateString(),
      sortable: true,
    },
  ];

  const rowActions = [
    {
      label: "View",
      onClick: (order: LocalPurchaseOrderData) => {
        setSelectedOrder(order);
        setDialogMode('view');
        setDialogOpen(true);
      },
      icon: <Eye className="h-4 w-4" />,
    },
    {
      label: "Edit",
      onClick: (order: LocalPurchaseOrderData) => {
        setSelectedOrder(order);
        setOrderItems(order.items);
        form.reset(order);
        setDialogMode('edit');
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (order: LocalPurchaseOrderData) => {
        if (window.confirm(`Delete LPO ${order.lpoNumber}?`)) {
          setOrders(prev => prev.filter(o => o.id !== order.id));
          toast({
            title: "LPO Deleted",
            description: `LPO ${order.lpoNumber} has been deleted.`,
          });
        }
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  function getStatusColor(status: string) {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  const generateLPONumber = () => {
    const year = new Date().getFullYear();
    const sequence = String(orders.length + 1).padStart(4, '0');
    return `${companyInfo.name.substring(0, 3).toUpperCase()}-LPO-${year}-${sequence}`;
  };

  const calculateTotal = (items: LPOItem[]) => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const addItem = () => {
    const formData = itemForm.getValues();
    const totalPrice = formData.quantity * formData.unitPrice;
    
    const newItem: LPOItem = {
      id: generateId(),
      ...formData,
      totalPrice
    };

    setOrderItems(prev => [...prev, newItem]);
    itemForm.reset();
  };

  const removeItem = (itemId: string) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSubmit = form.handleSubmit((data) => {
    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item to the LPO.",
        variant: "destructive"
      });
      return;
    }

    const subtotal = calculateTotal(orderItems);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const orderData: LocalPurchaseOrderData = {
      ...data,
      id: selectedOrder?.id || generateId(),
      lpoNumber: selectedOrder?.lpoNumber || generateLPONumber(),
      items: orderItems,
      subtotal,
      tax,
      total
    };

    if (selectedOrder) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? orderData : o));
      toast({
        title: "LPO Updated",
        description: `LPO ${orderData.lpoNumber} has been updated.`,
      });
    } else {
      setOrders(prev => [orderData, ...prev]);
      toast({
        title: "LPO Created",
        description: `LPO ${orderData.lpoNumber} has been created.`,
      });
    }

    setDialogOpen(false);
    setOrderItems([]);
    form.reset();
  });

  const handleAddNew = () => {
    setSelectedOrder(null);
    setOrderItems([]);
    form.reset();
    setDialogMode('add');
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Local Purchase Orders</h2>
          <p className="text-muted-foreground">
            Create and manage local purchase orders for {companyInfo.name}
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          New LPO
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total LPOs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={orders}
        columns={columns}
        rowActions={rowActions}
        searchable
        searchKeys={["lpoNumber", "vendor", "department", "requestedBy"]}
        onRefresh={() => {
          toast({
            title: "Data Refreshed",
            description: "LPO data has been refreshed.",
          });
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'add' ? 'Create New LPO' : 
               dialogMode === 'edit' ? 'Edit LPO' : 'View LPO'}
            </DialogTitle>
          </DialogHeader>

          {dialogMode === 'view' && selectedOrder ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LPO Number</Label>
                  <div className="font-medium">{selectedOrder.lpoNumber}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label>Vendor</Label>
                  <div>{selectedOrder.vendor}</div>
                </div>
                <div>
                  <Label>Department</Label>
                  <div>{selectedOrder.department}</div>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <div className="mt-2 border rounded-md">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Qty</th>
                        <th className="p-3 text-left">Unit Price</th>
                        <th className="p-3 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3">{item.quantity} {item.unit}</td>
                          <td className="p-3">${item.unitPrice.toFixed(2)}</td>
                          <td className="p-3">${item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-right space-y-2">
                <div>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</div>
                {selectedOrder.tax && <div>Tax: ${selectedOrder.tax.toFixed(2)}</div>}
                <div className="text-lg font-bold">Total: ${selectedOrder.total.toFixed(2)}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Input {...form.register('vendor', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input {...form.register('department', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="requestedBy">Requested By *</Label>
                  <Input {...form.register('requestedBy', { required: true })} />
                </div>
                <div>
                  <Label htmlFor="dateRequired">Date Required *</Label>
                  <Input 
                    type="date" 
                    {...form.register('dateRequired', { required: true })} 
                  />
                </div>
              </div>

              <div>
                <Label>Add Items</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  <Input 
                    placeholder="Description" 
                    {...itemForm.register('description')}
                  />
                  <Input 
                    type="number" 
                    placeholder="Qty" 
                    {...itemForm.register('quantity', { valueAsNumber: true })}
                  />
                  <Input 
                    placeholder="Unit" 
                    {...itemForm.register('unit')}
                  />
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="Unit Price" 
                    {...itemForm.register('unitPrice', { valueAsNumber: true })}
                  />
                  <Button type="button" onClick={addItem}>Add</Button>
                </div>
              </div>

              {orderItems.length > 0 && (
                <div>
                  <Label>Items ({orderItems.length})</Label>
                  <div className="mt-2 border rounded-md">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Description</th>
                          <th className="p-3 text-left">Qty</th>
                          <th className="p-3 text-left">Unit Price</th>
                          <th className="p-3 text-left">Total</th>
                          <th className="p-3 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="p-3">{item.description}</td>
                            <td className="p-3">{item.quantity} {item.unit}</td>
                            <td className="p-3">${item.unitPrice.toFixed(2)}</td>
                            <td className="p-3">${item.totalPrice.toFixed(2)}</td>
                            <td className="p-3">
                              <Button 
                                type="button"
                                variant="outline" 
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-right mt-2">
                    <div className="text-lg font-bold">
                      Total: ${calculateTotal(orderItems).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea {...form.register('notes')} />
                </div>
                <div>
                  <Label htmlFor="terms">Terms</Label>
                  <Textarea {...form.register('terms')} />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {dialogMode === 'edit' ? 'Update LPO' : 'Create LPO'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
