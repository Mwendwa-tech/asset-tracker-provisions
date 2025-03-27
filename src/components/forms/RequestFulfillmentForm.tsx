
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RequestItem } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

// Define the form schema
const formSchema = z.object({
  fulfillerName: z.string().min(2, {
    message: 'Your name must be at least 2 characters.',
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RequestFulfillmentFormProps {
  request: RequestItem;
  onFulfill: (fulfillerName: string, notes?: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function RequestFulfillmentForm({
  request,
  onFulfill,
  onCancel,
  loading
}: RequestFulfillmentFormProps) {
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fulfillerName: user?.name || '',
      notes: '',
    },
  });

  const handleSubmit = (data: FormValues) => {
    onFulfill(data.fulfillerName, data.notes);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="rounded-md bg-muted p-4 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Item</p>
              <p className="font-medium">{request.itemName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{request.itemType}</p>
            </div>
          </div>
          
          {request.quantity && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quantity</p>
              <p className="font-medium">{request.quantity}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Requested By</p>
              <p className="font-medium">{request.requestedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="font-medium">{request.department || 'N/A'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Request Date</p>
              <p className="font-medium">{formatDate(request.requestDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className="mt-1 bg-blue-100 text-blue-800">
                {request.status}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved By</p>
              <p className="font-medium">{request.approvedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approval Date</p>
              <p className="font-medium">{request.approvalDate ? formatDate(request.approvalDate) : 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reason</p>
            <p>{request.reason}</p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="fulfillerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Keeper Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" disabled={!!user?.name} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Add any notes about this fulfillment" 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Issue Items'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
