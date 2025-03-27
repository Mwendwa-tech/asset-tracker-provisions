
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

// Define the form schema
const formSchema = z.object({
  approverName: z.string().min(2, {
    message: 'Approver name must be at least 2 characters.',
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RequestApprovalFormProps {
  request: RequestItem;
  onApprove: (approverName: string) => void;
  onReject: (approverName: string, reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export function RequestApprovalForm({
  request,
  onApprove,
  onReject,
  onCancel,
  loading
}: RequestApprovalFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      approverName: '',
      notes: '',
    },
  });

  const handleApprove = (data: FormValues) => {
    onApprove(data.approverName);
  };

  const handleReject = (data: FormValues) => {
    if (!data.notes) {
      form.setError('notes', {
        type: 'manual',
        message: 'Please provide a reason for rejection'
      });
      return;
    }
    onReject(data.approverName, data.notes);
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
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
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(request.requestDate)}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Reason</p>
            <p>{request.reason}</p>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="approverName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your full name" />
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
              <FormLabel>Notes (Required for rejection)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Add your notes or reason for rejection" 
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
          <Button 
            type="button" 
            variant="destructive" 
            onClick={form.handleSubmit(handleReject)}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reject'}
          </Button>
          <Button 
            type="button" 
            onClick={form.handleSubmit(handleApprove)}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Approve'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
