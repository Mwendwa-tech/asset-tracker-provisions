
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { purchaseOrderTypes, purchaseOrderStatus, hotelDepartments } from '@/config/systemConfig';
import { Printer, Save, Send } from 'lucide-react';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PurchaseOrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export function LocalPurchaseOrder() {
  const [poNumber, setPoNumber] = useState(`LPO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`);
  const [supplier, setSupplier] = useState('');
  const [department, setDepartment] = useState('Procurement');
  const [poType, setPoType] = useState('Local Purchase Order');
  const [status, setStatus] = useState('Draft');
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<PurchaseOrderItem>>({
    id: '',
    name: '',
    quantity: 1,
    unit: 'pcs',
    unitPrice: 0,
    totalPrice: 0
  });
  const [notes, setNotes] = useState('');

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.unitPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all item details",
        variant: "destructive"
      });
      return;
    }

    const itemToAdd: PurchaseOrderItem = {
      id: Date.now().toString(),
      name: newItem.name || '',
      quantity: newItem.quantity || 0,
      unit: newItem.unit || 'pcs',
      unitPrice: newItem.unitPrice || 0,
      totalPrice: (newItem.quantity || 0) * (newItem.unitPrice || 0)
    };

    setItems([...items, itemToAdd]);
    setNewItem({
      id: '',
      name: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      totalPrice: 0
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = () => {
    if (!supplier) {
      toast({
        title: "Missing information",
        description: "Please enter supplier name",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "No items",
        description: "Please add at least one item to the purchase order",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to the database
    toast({
      title: "Purchase Order Saved",
      description: `Local Purchase Order ${poNumber} has been saved as ${status}`
    });
  };

  const handlePrint = () => {
    // In a real app, this would generate a printable version
    toast({
      title: "Printing",
      description: "Preparing Local Purchase Order for printing"
    });
  };

  const handleSubmit = () => {
    if (status === 'Draft') {
      setStatus('Awaiting Approval');
      toast({
        title: "Purchase Order Submitted",
        description: `Local Purchase Order ${poNumber} has been submitted for approval`
      });
    }
  };

  return (
    <DashboardCard
      title="Local Purchase Order"
      className="w-full"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="poNumber">LPO Number</Label>
            <Input id="poNumber" value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input id="supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Enter supplier name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {hotelDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="poType">PO Type</Label>
            <Select value={poType} onValueChange={setPoType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {purchaseOrderTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={status} readOnly className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-2">Items</h3>
          <ScrollArea className="h-48 rounded-md border">
            <div className="p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Item</th>
                    <th className="text-right p-2">Qty</th>
                    <th className="text-right p-2">Unit</th>
                    <th className="text-right p-2">Unit Price</th>
                    <th className="text-right p-2">Total</th>
                    <th className="text-center p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">{item.unit}</td>
                      <td className="text-right p-2">${item.unitPrice.toFixed(2)}</td>
                      <td className="text-right p-2">${item.totalPrice.toFixed(2)}</td>
                      <td className="text-center p-2">
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-2 text-center text-gray-500">
                        No items added yet
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={4} className="text-right p-2">Total:</td>
                    <td className="text-right p-2">${calculateTotal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </ScrollArea>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input 
                id="itemName" 
                value={newItem.name || ''} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Item name"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="1"
                value={newItem.quantity || ''} 
                onChange={(e) => setNewItem({
                  ...newItem, 
                  quantity: Number(e.target.value),
                  totalPrice: Number(e.target.value) * (newItem.unitPrice || 0)
                })}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input 
                id="unit" 
                value={newItem.unit || ''} 
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                placeholder="pcs, kg, etc."
              />
            </div>
            <div>
              <Label htmlFor="unitPrice">Unit Price</Label>
              <Input 
                id="unitPrice" 
                type="number" 
                min="0" 
                step="0.01"
                value={newItem.unitPrice || ''} 
                onChange={(e) => setNewItem({
                  ...newItem, 
                  unitPrice: Number(e.target.value),
                  totalPrice: (newItem.quantity || 0) * Number(e.target.value)
                })}
              />
            </div>
            <div>
              <Button onClick={handleAddItem} className="w-full">Add Item</Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes or delivery instructions"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={items.length === 0 || !supplier}>
            <Send className="mr-2 h-4 w-4" /> Submit for Approval
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
