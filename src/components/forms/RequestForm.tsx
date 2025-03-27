
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
import { InventoryItem, Asset, HotelDepartment } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

// Define the form schema
const formSchema = z.object({
  quantity: z.coerce.number().optional(),
  requestedBy: z.string().min(2, {
    message: 'Requester name must be at least 2 characters.',
  }),
  reason: z.string().min(5, {
    message: 'Please provide a reason with at least 5 characters.',
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent'], {
    required_error: 'Please select a priority level',
  }),
  department: z.string().min(1, {
    message: 'Please select a department',
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
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: itemType === 'inventory' ? 1 : undefined,
      requestedBy: user?.name || '',
      reason: '',
      priority: 'medium',
      department: user?.department || 'Front Office',
    },
  });

  const departments: HotelDepartment[] = [
    'Executive',
    'Front Office',
    'Housekeeping',
    'Food & Beverage',
    'Kitchen',
    'Maintenance',
    'Accounting',
    'Human Resources',
    'Purchasing',
    'Stores',
    'Security',
    'Spa & Wellness',
  ];

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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
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
