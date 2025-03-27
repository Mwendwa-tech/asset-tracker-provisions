
import { useState } from 'react';
import { Supplier } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock suppliers data
const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Acme Supplies',
    contactPerson: 'John Doe',
    email: 'john@acmesupplies.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    categories: ['Office', 'Electronics']
  },
  {
    id: 'sup-2',
    name: 'Tech Parts Inc',
    contactPerson: 'Jane Smith',
    email: 'jane@techparts.com',
    phone: '(555) 987-6543',
    address: '456 Tech Blvd, Silicon Valley, CA',
    categories: ['Hardware', 'Electronics', 'Components']
  }
];

export function useSuppliers() {
  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data: suppliers = mockSuppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // In a real implementation, this would fetch from Supabase
      // Since we're mocking, just return the mock data
      return mockSuppliers;
    }
  });

  // Add new supplier
  const addSupplierMutation = useMutation({
    mutationFn: async (newSupplier: Omit<Supplier, 'id'>) => {
      const id = generateId();
      
      // Create a new supplier object with the generated ID
      const supplier: Supplier = {
        id,
        ...newSupplier
      };
      
      // In a real implementation, this would save to Supabase
      // For the mock, just return the newly created supplier
      return supplier;
    },
    onSuccess: (newSupplier) => {
      // Add the new supplier to our mock data
      mockSuppliers.push(newSupplier);
      
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Supplier added',
        description: `${newSupplier.name} has been added to your suppliers.`,
      });
    },
    onError: (error: any) => {
      console.error('Error adding supplier:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add supplier. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Update existing supplier
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, updatedData }: { id: string, updatedData: Partial<Supplier> }) => {
      // Find the supplier in our mock data
      const index = mockSuppliers.findIndex(s => s.id === id);
      
      if (index !== -1) {
        // Update the supplier in our mock data
        mockSuppliers[index] = {
          ...mockSuppliers[index],
          ...updatedData
        };
      }
      
      // Return the updated supplier
      return { id, ...updatedData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Supplier updated',
        description: 'Supplier has been updated successfully.',
      });
    },
    onError: (error: any) => {
      console.error('Error updating supplier:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update supplier. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Delete supplier
  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      // Find the supplier in our mock data
      const index = mockSuppliers.findIndex(s => s.id === id);
      
      if (index !== -1) {
        // Remove the supplier from our mock data
        mockSuppliers.splice(index, 1);
      }
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      const supplier = suppliers.find(s => s.id === id);
      if (supplier) {
        toast({
          title: 'Supplier deleted',
          description: `${supplier.name} has been removed from your suppliers.`,
        });
      }
    },
    onError: (error: any) => {
      console.error('Error deleting supplier:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete supplier. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Wrapper functions for mutations
  const addSupplier = (newSupplier: Omit<Supplier, 'id'>) => {
    return addSupplierMutation.mutate(newSupplier);
  };

  const updateSupplier = (id: string, updatedData: Partial<Supplier>) => {
    return updateSupplierMutation.mutate({ id, updatedData });
  };

  const deleteSupplier = (id: string) => {
    return deleteSupplierMutation.mutate(id);
  };

  return {
    suppliers,
    loading: isLoadingSuppliers || addSupplierMutation.isPending || updateSupplierMutation.isPending || deleteSupplierMutation.isPending,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
}
