
import { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSuppliers() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      return data.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        contactPerson: supplier.contact_person,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
        categories: supplier.categories
      })) as Supplier[];
    }
  });

  // Add new supplier
  const addSupplierMutation = useMutation({
    mutationFn: async (newSupplier: Omit<Supplier, 'id'>) => {
      const id = generateId();
      
      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          id,
          name: newSupplier.name,
          contact_person: newSupplier.contactPerson,
          email: newSupplier.email,
          phone: newSupplier.phone,
          address: newSupplier.address,
          categories: newSupplier.categories
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.id,
        name: data.name,
        contactPerson: data.contact_person,
        email: data.email,
        phone: data.phone,
        address: data.address,
        categories: data.categories
      } as Supplier;
    },
    onSuccess: (newSupplier) => {
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
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: updatedData.name,
          contact_person: updatedData.contactPerson,
          email: updatedData.email,
          phone: updatedData.phone,
          address: updatedData.address,
          categories: updatedData.categories
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

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
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
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
