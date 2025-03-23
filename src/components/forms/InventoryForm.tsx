
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (data: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

// List of inventory categories
const inventoryCategories = [
  'Food',
  'Beverages', 
  'Cleaning Supplies',
  'Office Supplies',
  'Linens',
  'Maintenance',
  'Disposables',
  'Other'
];

// List of inventory locations
const inventoryLocations = [
  'Main Storage',
  'Kitchen',
  'Bar',
  'Housekeeping',
  'Front Desk',
  'Maintenance Shop',
  'Other'
];

export function InventoryForm({ item, onSubmit, onCancel, loading = false }: InventoryFormProps) {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'lastUpdated'>>({
    name: '',
    category: 'Food',
    quantity: 0,
    unit: 'pcs',
    minStockLevel: 0,
    currentValue: 0,
    location: 'Main Storage',
  });

  // Populate form with item data if editing
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        minStockLevel: item.minStockLevel,
        currentValue: item.currentValue,
        location: item.location,
        expiryDate: item.expiryDate,
        supplier: item.supplier,
      });
    }
  }, [item]);

  const handleChange = (field: keyof Omit<InventoryItem, 'id' | 'lastUpdated'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={value => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {inventoryCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Current Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={e => {
              const value = parseInt(e.target.value);
              handleChange('quantity', isNaN(value) ? 0 : value);
            }}
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={e => handleChange('unit', e.target.value)}
            required
            placeholder="pcs, kg, lt, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
          <Input
            id="minStockLevel"
            type="number"
            value={formData.minStockLevel}
            onChange={e => {
              const value = parseInt(e.target.value);
              handleChange('minStockLevel', isNaN(value) ? 0 : value);
            }}
            required
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={formData.location}
            onValueChange={value => handleChange('location', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {inventoryLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentValue">Current Value (KES)</Label>
          <Input
            id="currentValue"
            type="number"
            value={formData.currentValue}
            onChange={e => {
              const value = parseFloat(e.target.value);
              handleChange('currentValue', isNaN(value) ? 0 : value);
            }}
            required
            min="0"
            step="0.01"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
          <DatePicker
            selectedDate={formData.expiryDate}
            onSelect={date => handleChange('expiryDate', date)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier (if applicable)</Label>
          <Input
            id="supplier"
            value={formData.supplier || ''}
            onChange={e => handleChange('supplier', e.target.value)}
            placeholder="Supplier name"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={loading}
          className={cn(loading && "opacity-70 cursor-not-allowed")}
        >
          {loading ? "Saving..." : item ? "Update Item" : "Add Item"}
        </Button>
      </div>
    </form>
  );
}
