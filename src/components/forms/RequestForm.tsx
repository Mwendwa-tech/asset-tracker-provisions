
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InventoryItem, Asset } from '@/types';

// Define the form schema
const formSchema = z.object({
  quantity: z.coerce.number().optional(),
  requestedBy: z.string().min(2, {
    message: 'Requester name must be at least 2 characters.',
  }),
  reason: z.string().min(5, {
    message: 'Please provide a reason with at least 5 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface RequestFormProps {
  item: InventoryItem | Asset;
  itemType: 'inventory' | 'asset';
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  loading: boolean;
}

export function RequestForm({
  item,
  itemType,
  onSubmit,
  onCancel,
  loading
}: RequestFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: itemType === 'inventory' ? 1 : undefined,
      requestedBy: '',
      reason: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">Item</p>
          <p className="font-medium">{item.name}</p>
        </div>
        
        {itemType === 'inventory' && (
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    min={1} 
                    max={itemType === 'inventory' ? (item as InventoryItem).quantity : undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="requestedBy"
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
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Request</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Why do you need this item?" 
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
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
