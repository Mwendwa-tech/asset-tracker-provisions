
import { useState } from 'react';
import { Asset } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/formatters';

interface CheckinFormProps {
  asset: Asset;
  onSubmit: (data: { notes?: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CheckinForm({ asset, onSubmit, onCancel, loading = false }: CheckinFormProps) {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Asset: {asset.name}</p>
        <p className="text-sm text-muted-foreground">
          Category: {asset.category} | Location: {asset.location}
        </p>
      </div>
      
      <div className="rounded-md bg-blue-50 p-3 my-2">
        <p className="text-sm font-medium text-blue-800">Currently checked out</p>
        <p className="text-sm text-blue-700">
          Assigned to: <span className="font-medium">{asset.assignedTo}</span>
        </p>
        {asset.expectedReturnDate && (
          <p className="text-sm text-blue-700">
            Expected return: <span className="font-medium">{formatDate(asset.expectedReturnDate)}</span>
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Return Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Add any notes about the condition upon return"
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
          {loading ? "Processing..." : "Check In Asset"}
        </Button>
      </div>
    </form>
  );
}
