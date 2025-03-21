
import { useState } from 'react';
import { Asset } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

interface CheckoutFormProps {
  asset: Asset;
  onSubmit: (data: { assignedTo: string; expectedReturnDate?: Date; notes?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CheckoutForm({ asset, onSubmit, onCancel, loading = false }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    assignedTo: '',
    expectedReturnDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    notes: '',
  });

  const handleChange = (field: string, value: any) => {
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
      <div>
        <p className="text-sm font-medium mb-2">Asset: {asset.name}</p>
        <p className="text-sm text-muted-foreground mb-4">
          Category: {asset.category} | Location: {asset.location}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input
          id="assignedTo"
          value={formData.assignedTo}
          onChange={e => handleChange('assignedTo', e.target.value)}
          placeholder="Enter name of person checking out this asset"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
        <DatePicker
          selectedDate={formData.expectedReturnDate}
          onSelect={date => handleChange('expectedReturnDate', date)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={e => handleChange('notes', e.target.value)}
          placeholder="Add any additional notes about this checkout"
        />
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
          {loading ? "Processing..." : "Check Out Asset"}
        </Button>
      </div>
    </form>
  );
}
