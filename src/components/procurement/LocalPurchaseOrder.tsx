
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/DataTable';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FilePenLine, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Filter, 
  Download, 
  Printer, 
  Trash2, 
  Send
} from 'lucide-react';
import { purchaseOrderStatus, purchaseOrderTypes, companyInfo } from '@/config/systemConfig';
import { generateId } from '@/utils/formatters';
import { useSuppliers } from '@/hooks/useSuppliers';

// Define purchase order type
interface PurchaseOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  totalPrice: number;
  notes?: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  status: string;
  type: string;
  supplier: string;
  supplierContact?: string;
  shippingAddress: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  expectedDelivery?: Date;
  department: string;
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    orderNumber: 'LPO-2023-001',
    status: 'Approved',
    type: 'Local Purchase Order',
    supplier: 'Office Supplies Ltd',
    supplierContact: 'contact@officesupplies.example',
    shippingAddress: companyInfo.address,
    items: [
      {
        id: 'poi-1',
        productName: 'Printer Paper A4',
        quantity: 10,
        unitPrice: 5,
        unit: 'ream',
        totalPrice: 50
      },
      {
        id: 'poi-2',
        productName: 'Ink Cartridges',
        quantity: 5,
        unitPrice: 20,
        unit: 'each',
        totalPrice: 100
      }
    ],
    subtotal: 150,
    tax: 15,
    total: 165,
    notes: 'Urgent order for office supplies',
    createdBy: 'John Doe',
    createdAt: new Date(2023, 5, 10),
    approvedBy: 'Jane Smith',
    approvedAt: new Date(2023, 5, 11),
    expectedDelivery: new Date(2023, 5, 20),
    department: 'Administration'
  },
  {
    id: 'po-2',
    orderNumber: 'LPO-2023-002',
    status: 'Pending Approval',
    type: 'Local Purchase Order',
    supplier: 'Furniture Warehouse',
    supplierContact: 'sales@furniturewarehouse.example',
    shippingAddress: companyInfo.address,
    items: [
      {
        id: 'poi-3',
        productName: 'Office Chair',
        quantity: 5,
        unitPrice: 100,
        unit: 'each',
        totalPrice: 500
      }
    ],
    subtotal: 500,
    tax: 50,
    total: 550,
    createdBy: 'Robert Johnson',
    createdAt: new Date(2023, 5, 15),
    department: 'Administration'
  }
];

export function LocalPurchaseOrder() {
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();
  const { suppliers } = useSuppliers();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const savedOrders = localStorage.getItem('purchase-orders');
    return savedOrders ? JSON.parse(savedOrders) : mockPurchaseOrders;
  });
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newPO, setNewPO] = useState<Partial<PurchaseOrder>>({
    type: 'Local Purchase Order',
    supplier: '',
    shippingAddress: companyInfo.address,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: 'Draft',
    department: user?.department || ''
  });
  const [newItem, setNewItem] = useState<Partial<PurchaseOrderItem>>({
    productName: '',
    quantity: 1,
    unitPrice: 0,
    unit: 'each',
    totalPrice: 0
  });
  
  // Save purchase orders to localStorage
  useEffect(() => {
    localStorage.setItem('purchase-orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);
  
  // Function to generate LPO number
  const generateLPONumber = () => {
    const year = new Date().getFullYear();
    const count = purchaseOrders.length + 1;
    return `LPO-${year}-${count.toString().padStart(3, '0')}`;
  };
  
  // Calculate totals for new PO
  const calculateTotals = (items: Partial<PurchaseOrderItem>[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };
  
  // Handle adding new item to order
  const handleAddItem = () => {
    if (!newItem.productName || !newItem.quantity || !newItem.unitPrice) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields for the item",
        variant: "destructive"
      });
      return;
    }
    
    const totalPrice = (newItem.quantity || 0) * (newItem.unitPrice || 0);
    const item: PurchaseOrderItem = {
      id: generateId(),
      productName: newItem.productName || '',
      quantity: newItem.quantity || 0,
      unitPrice: newItem.unitPrice || 0,
      unit: newItem.unit || 'each',
      totalPrice: totalPrice,
      notes: newItem.notes
    };
    
    const updatedItems = [...(newPO.items || []), item];
    const { subtotal, tax, total } = calculateTotals(updatedItems);
    
    setNewPO(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax,
      total
    }));
    
    // Reset new item form
    setNewItem({
      productName: '',
      quantity: 1,
      unitPrice: 0,
      unit: 'each',
      totalPrice: 0
    });
  };
  
  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = (newPO.items || []).filter(item => item.id !== itemId);
    const { subtotal, tax, total } = calculateTotals(updatedItems);
    
    setNewPO(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      tax,
      total
    }));
  };
  
  // Handle creating new purchase order
  const handleCreatePO = () => {
    if (!newPO.supplier || (newPO.items || []).length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a supplier and add at least one item",
        variant: "destructive"
      });
      return;
    }
    
    const po: PurchaseOrder = {
      id: generateId(),
      orderNumber: generateLPONumber(),
      status: 'Draft',
      type: newPO.type || 'Local Purchase Order',
      supplier: newPO.supplier || '',
      supplierContact: newPO.supplierContact,
      shippingAddress: newPO.shippingAddress || companyInfo.address,
      items: newPO.items as PurchaseOrderItem[],
      subtotal: newPO.subtotal || 0,
      tax: newPO.tax || 0,
      total: newPO.total || 0,
      notes: newPO.notes,
      createdBy: user?.name || 'Current User',
      createdAt: new Date(),
      department: newPO.department || user?.department || 'Purchasing'
    };
    
    setPurchaseOrders(prev => [po, ...prev]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Purchase Order Created",
      description: `Order ${po.orderNumber} has been created successfully`,
    });
    
    // Reset form
    setNewPO({
      type: 'Local Purchase Order',
      supplier: '',
      shippingAddress: companyInfo.address,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'Draft',
      department: user?.department || ''
    });
  };
  
  // Handle changing PO status
  const handleChangeStatus = (poId: string, newStatus: string) => {
    setPurchaseOrders(prev => 
      prev.map(po => 
        po.id === poId 
          ? { 
              ...po, 
              status: newStatus,
              ...(newStatus === 'Approved' ? {
                approvedBy: user?.name || 'Current User',
                approvedAt: new Date()
              } : {})
            } 
          : po
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Purchase order status has been updated to ${newStatus}`,
    });
    
    if (selectedPO?.id === poId) {
      setSelectedPO(prev => 
        prev 
          ? { 
              ...prev, 
              status: newStatus,
              ...(newStatus === 'Approved' ? {
                approvedBy: user?.name || 'Current User',
                approvedAt: new Date()
              } : {})
            } 
          : null
      );
    }
  };
  
  // Delete purchase order
  const handleDeletePO = (poId: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== poId));
    
    if (selectedPO?.id === poId) {
      setSelectedPO(null);
      setIsViewDialogOpen(false);
    }
    
    toast({
      title: "Purchase Order Deleted",
      description: "The purchase order has been deleted successfully",
    });
  };
  
  // Filter POs based on active tab
  const filteredPOs = purchaseOrders.filter(po => {
    if (activeTab === 'all') return true;
    if (activeTab === 'draft') return po.status === 'Draft';
    if (activeTab === 'pending') return po.status === 'Pending Approval';
    if (activeTab === 'approved') return po.status === 'Approved';
    if (activeTab === 'sent') return po.status === 'Sent to Vendor';
    if (activeTab === 'received') return ['Partially Received', 'Received'].includes(po.status);
    return true;
  });
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending Approval': return 'bg-amber-100 text-amber-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Sent to Vendor': return 'bg-blue-100 text-blue-800';
      case 'Partially Received': return 'bg-purple-100 text-purple-800';
      case 'Received': return 'bg-indigo-100 text-indigo-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Check if user can create POs
  const canCreatePO = user?.role === 'generalManager' || 
                       user?.role === 'departmentHead' || 
                       user?.role === 'fbManager';
  
  // Table columns for purchase orders
  const columns = [
    {
      header: "Order #",
      accessorKey: "orderNumber",
      cell: (info: any) => <a href="#" onClick={(e) => {
        e.preventDefault();
        const po = purchaseOrders.find(p => p.orderNumber === info.getValue());
        setSelectedPO(po || null);
        setIsViewDialogOpen(true);
      }} className="text-blue-600 hover:underline">{info.getValue()}</a>,
    },
    {
      header: "Supplier",
      accessorKey: "supplier",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => (
        <Badge className={getStatusColor(info.getValue())}>
          {info.getValue()}
        </Badge>
      ),
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (info: any) => `${companyInfo.currencySymbol}${info.getValue().toFixed(2)}`,
    },
    {
      header: "Actions",
      cell: (info: any) => {
        const po = info.row.original;
        return (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => {
              setSelectedPO(po);
              setIsViewDialogOpen(true);
            }}>
              <FileText className="h-4 w-4" />
            </Button>
            {po.status === 'Draft' && (
              <Button size="sm" variant="outline" className="text-amber-600" onClick={() => handleChangeStatus(po.id, 'Pending Approval')}>
                <Send className="h-4 w-4" />
              </Button>
            )}
            {po.status === 'Pending Approval' && canCreatePO && (
              <Button size="sm" variant="outline" className="text-green-600" onClick={() => handleChangeStatus(po.id, 'Approved')}>
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            )}
            {po.status === 'Draft' && (
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleDeletePO(po.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold">Local Purchase Orders</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage purchase orders for {companyInfo.name}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} disabled={!canCreatePO}>
          <Plus className="mr-2 h-4 w-4" /> New LPO
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardContent className="p-0 scrollbar-visible">
          <DataTable
            data={filteredPOs}
            columns={columns}
            searchable
            searchKeys={["orderNumber", "supplier", "type", "status"]}
          />
        </CardContent>
      </Card>
      
      {/* Create PO Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="po-type">PO Type</Label>
              <Select 
                value={newPO.type} 
                onValueChange={value => setNewPO(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="po-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrderTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select 
                value={newPO.supplier} 
                onValueChange={value => {
                  const supplier = suppliers.find(s => s.name === value);
                  setNewPO(prev => ({ 
                    ...prev, 
                    supplier: value,
                    supplierContact: supplier?.email || supplier?.phone
                  }));
                }}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.name}>{supplier.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={newPO.department} 
                onChange={e => setNewPO(prev => ({ ...prev, department: e.target.value }))} 
                placeholder="Department"
              />
            </div>
            
            <div>
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Textarea 
                id="shipping-address" 
                value={newPO.shippingAddress} 
                onChange={e => setNewPO(prev => ({ ...prev, shippingAddress: e.target.value }))} 
                placeholder="Shipping Address"
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Items</h3>
            
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input 
                      id="product-name" 
                      value={newItem.productName} 
                      onChange={e => setNewItem(prev => ({ ...prev, productName: e.target.value }))} 
                      placeholder="Product Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      value={newItem.quantity} 
                      onChange={e => {
                        const quantity = Number(e.target.value);
                        const totalPrice = quantity * (newItem.unitPrice || 0);
                        setNewItem(prev => ({ 
                          ...prev, 
                          quantity, 
                          totalPrice 
                        }));
                      }} 
                      placeholder="Quantity"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input 
                      id="unit" 
                      value={newItem.unit} 
                      onChange={e => setNewItem(prev => ({ ...prev, unit: e.target.value }))} 
                      placeholder="each, box, kg, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit-price">Unit Price ({companyInfo.currencySymbol})</Label>
                    <Input 
                      id="unit-price" 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={newItem.unitPrice} 
                      onChange={e => {
                        const unitPrice = Number(e.target.value);
                        const totalPrice = (newItem.quantity || 0) * unitPrice;
                        setNewItem(prev => ({ 
                          ...prev, 
                          unitPrice, 
                          totalPrice 
                        }));
                      }} 
                      placeholder="Unit Price"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Button 
                      type="button" 
                      onClick={handleAddItem} 
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Item
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {(newPO.items || []).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <ScrollArea className="h-[200px]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">Product</th>
                          <th className="py-2">Quantity</th>
                          <th className="py-2">Unit Price</th>
                          <th className="py-2">Total</th>
                          <th className="py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(newPO.items || []).map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.productName}</td>
                            <td className="py-2">{item.quantity} {item.unit}</td>
                            <td className="py-2">{companyInfo.currencySymbol}{item.unitPrice.toFixed(2)}</td>
                            <td className="py-2">{companyInfo.currencySymbol}{item.totalPrice.toFixed(2)}</td>
                            <td className="py-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                  
                  <div className="mt-4 space-y-2 text-right">
                    <div>Subtotal: <span className="font-semibold">{companyInfo.currencySymbol}{newPO.subtotal?.toFixed(2)}</span></div>
                    <div>Tax (10%): <span className="font-semibold">{companyInfo.currencySymbol}{newPO.tax?.toFixed(2)}</span></div>
                    <div className="text-lg">Total: <span className="font-semibold">{companyInfo.currencySymbol}{newPO.total?.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={newPO.notes} 
                onChange={e => setNewPO(prev => ({ ...prev, notes: e.target.value }))} 
                placeholder="Additional notes or instructions"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePO}>
              Create Purchase Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View PO Dialog */}
      {selectedPO && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Purchase Order {selectedPO.orderNumber}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Details</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Status</dt>
                        <dd>
                          <Badge className={getStatusColor(selectedPO.status)}>
                            {selectedPO.status}
                          </Badge>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Type</dt>
                        <dd>{selectedPO.type}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Created By</dt>
                        <dd>{selectedPO.createdBy}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Created At</dt>
                        <dd>{new Date(selectedPO.createdAt).toLocaleDateString()}</dd>
                      </div>
                      {selectedPO.approvedBy && (
                        <div>
                          <dt className="text-muted-foreground">Approved By</dt>
                          <dd>{selectedPO.approvedBy}</dd>
                        </div>
                      )}
                      {selectedPO.approvedAt && (
                        <div>
                          <dt className="text-muted-foreground">Approved At</dt>
                          <dd>{new Date(selectedPO.approvedAt).toLocaleDateString()}</dd>
                        </div>
                      )}
                      {selectedPO.expectedDelivery && (
                        <div>
                          <dt className="text-muted-foreground">Expected Delivery</dt>
                          <dd>{new Date(selectedPO.expectedDelivery).toLocaleDateString()}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-muted-foreground">Department</dt>
                        <dd>{selectedPO.department}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Supplier</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Name</dt>
                        <dd>{selectedPO.supplier}</dd>
                      </div>
                      {selectedPO.supplierContact && (
                        <div>
                          <dt className="text-muted-foreground">Contact</dt>
                          <dd>{selectedPO.supplierContact}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Shipping</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Address</dt>
                        <dd className="whitespace-pre-line">{selectedPO.shippingAddress}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Items</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ScrollArea className="h-[200px]">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">Product</th>
                          <th className="py-2">Quantity</th>
                          <th className="py-2">Unit Price</th>
                          <th className="py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPO.items.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2">{item.productName}</td>
                            <td className="py-2">{item.quantity} {item.unit}</td>
                            <td className="py-2">{companyInfo.currencySymbol}{item.unitPrice.toFixed(2)}</td>
                            <td className="py-2">{companyInfo.currencySymbol}{item.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                  
                  <div className="mt-4 space-y-2 text-right">
                    <div>Subtotal: <span className="font-semibold">{companyInfo.currencySymbol}{selectedPO.subtotal.toFixed(2)}</span></div>
                    <div>Tax (10%): <span className="font-semibold">{companyInfo.currencySymbol}{selectedPO.tax.toFixed(2)}</span></div>
                    <div className="text-lg">Total: <span className="font-semibold">{companyInfo.currencySymbol}{selectedPO.total.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>
              
              {selectedPO.notes && (
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="whitespace-pre-line">{selectedPO.notes}</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" /> Print
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                  </Button>
                </div>
                
                <div className="space-x-2">
                  {selectedPO.status === 'Draft' && (
                    <>
                      <Button 
                        variant="outline" 
                        className="text-amber-600" 
                        onClick={() => handleChangeStatus(selectedPO.id, 'Pending Approval')}
                      >
                        <Send className="h-4 w-4 mr-2" /> Submit for Approval
                      </Button>
                      <Button 
                        variant="outline" 
                        className="text-red-600" 
                        onClick={() => handleDeletePO(selectedPO.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </Button>
                    </>
                  )}
                  {selectedPO.status === 'Pending Approval' && canCreatePO && (
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700" 
                      onClick={() => handleChangeStatus(selectedPO.id, 'Approved')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  )}
                  {selectedPO.status === 'Approved' && (
                    <Button 
                      variant="default" 
                      onClick={() => handleChangeStatus(selectedPO.id, 'Sent to Vendor')}
                    >
                      <Send className="h-4 w-4 mr-2" /> Mark as Sent
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
