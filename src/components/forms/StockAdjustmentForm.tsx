
import { useState } from 'react';
import { InventoryItem, StockTransaction } from '@/types';
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
import { cn } from '@/lib/utils';
import { getStockLevelClass } from '@/utils/formatters';

interface StockAdjustmentFormProps {
  item: InventoryItem;
  onSubmit: (data: Omit<StockTransaction, 'id' | 'date' | 'itemId' | 'itemName'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function StockAdjustmentForm({ item, onSubmit, onCancel, loading = false }: StockAdjustmentFormProps) {
  const [type, setType] = useState<StockTransaction['type']>('received');
  const [quantity, setQuantity] = useState(0);
  const [performedBy, setPerformedBy] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For 'used' and 'expired' types, ensure the quantity is not greater than available stock
    if ((type === 'used' || type === 'expired') && quantity > item.quantity) {
      alert(`Cannot ${type} more than the current quantity (${item.quantity} ${item.unit}).`);
      return;
    }
    
    // For 'adjusted' type, ensure the resulting quantity won't be negative
    if (type === 'adjusted' && quantity < 0 && Math.abs(quantity) > item.quantity) {
      alert(`Cannot adjust by ${quantity} as it would result in negative stock.`);
      return;
    }
    
    onSubmit({
      type,
      quantity: type === 'used' || type === 'expired' ? Math.abs(quantity) : quantity,
      performedBy,
      notes
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Item: {item.name}</p>
        <p className="text-sm text-muted-foreground">
          Current Stock: <span className={getStockLevelClass(item.quantity, item.minStockLevel)}>
            {item.quantity} {item.unit}
          </span>
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select
          value={type}
          onValueChange={value => setType(value as StockTransaction['type'])}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select transaction type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="received">Received (Add Stock)</SelectItem>
            <SelectItem value="used">Used (Remove Stock)</SelectItem>
            <SelectItem value="expired">Expired (Remove Stock)</SelectItem>
            <SelectItem value="adjusted">Adjusted (Manual Adjustment)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="quantity">
          {type === 'adjusted' ? 'Adjustment Amount' : 'Quantity'} ({item.unit})
        </Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={e => {
            const value = parseInt(e.target.value);
            setQuantity(isNaN(value) ? 0 : value);
          }}
          required
          min={type === 'adjusted' ? undefined : "0"}
          placeholder={type === 'adjusted' ? "Use negative for removal" : ""}
        />
        {type === 'adjusted' && (
          <p className="text-xs text-muted-foreground mt-1">
            Use negative values to remove stock, positive to add stock
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="performedBy">Performed By</Label>
        <Input
          id="performedBy"
          value={performedBy}
          onChange={e => setPerformedBy(e.target.value)}
          required
          placeholder="Your name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any additional details about this transaction"
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
          {loading ? "Processing..." : "Confirm"}
        </Button>
      </div>
    </form>
  );
}
