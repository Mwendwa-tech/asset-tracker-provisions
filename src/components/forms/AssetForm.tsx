
import { useState, useEffect } from 'react';
import { Asset } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: Omit<Asset, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

// List of asset categories
const assetCategories = [
  'Electronics',
  'Furniture',
  'Kitchen Equipment',
  'Vehicles',
  'Grounds Equipment',
  'Office Equipment',
  'Recreational Equipment',
  'Other'
];

// List of asset conditions
const assetConditions = [
  'excellent',
  'good',
  'fair',
  'poor'
];

// List of asset locations
const assetLocations = [
  'Main Building',
  'Conference Room A',
  'Conference Room B',
  'Main Kitchen',
  'Bar Area',
  'Pool Area',
  'Maintenance Shop',
  'Maintenance Shed',
  'Property Grounds',
  'Storage Room',
  'Other'
];

export function AssetForm({ asset, onSubmit, onCancel, loading = false }: AssetFormProps) {
  const [formData, setFormData] = useState<Omit<Asset, 'id'>>({
    name: '',
    category: 'Electronics',
    status: 'available',
    location: 'Main Building',
    purchaseDate: new Date(),
    purchaseValue: 0,
    currentValue: 0,
    condition: 'good',
  });

  // Populate form with asset data if editing
  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        category: asset.category,
        status: asset.status,
        location: asset.location,
        assignedTo: asset.assignedTo,
        checkoutDate: asset.checkoutDate,
        expectedReturnDate: asset.expectedReturnDate,
        purchaseDate: asset.purchaseDate,
        purchaseValue: asset.purchaseValue,
        currentValue: asset.currentValue,
        condition: asset.condition,
        lastMaintenance: asset.lastMaintenance,
      });
    }
  }, [asset]);

  const handleChange = (field: keyof Omit<Asset, 'id'>, value: any) => {
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
          <Label htmlFor="name">Asset Name</Label>
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
              {assetCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={value => handleChange('status', value as Asset['status'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
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
              {assetLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {formData.status === 'checked-out' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo || ''}
                onChange={e => handleChange('assignedTo', e.target.value)}
                required={formData.status === 'checked-out'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
              <DatePicker
                selectedDate={formData.expectedReturnDate}
                onSelect={date => handleChange('expectedReturnDate', date)}
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <DatePicker
            selectedDate={formData.purchaseDate}
            onSelect={date => handleChange('purchaseDate', date)}
          />
        </div>
                
        <div className="space-y-2">
          <Label htmlFor="purchaseValue">Purchase Value (KES)</Label>
          <Input
            id="purchaseValue"
            type="number"
            value={formData.purchaseValue}
            onChange={e => {
              const value = parseFloat(e.target.value);
              handleChange('purchaseValue', isNaN(value) ? 0 : value);
            }}
            required
          />
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
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={formData.condition}
            onValueChange={value => handleChange('condition', value as Asset['condition'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {assetConditions.map(condition => (
                <SelectItem key={condition} value={condition}>{condition}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
          <DatePicker
            selectedDate={formData.lastMaintenance}
            onSelect={date => handleChange('lastMaintenance', date)}
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
          {loading ? "Saving..." : asset ? "Update Asset" : "Add Asset"}
        </Button>
      </div>
    </form>
  );
}
