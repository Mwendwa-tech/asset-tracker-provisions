
import { useState, useEffect } from 'react';
import { Supplier } from '@/types';
import { mockSuppliers } from '@/utils/mockData';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';

// Use localStorage key constant
const STORAGE_KEY = 'hostel-suppliers';

export function useSuppliers() {
  // Initialize with localStorage data or fallback to mock data
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const savedSuppliers = localStorage.getItem(STORAGE_KEY);
    return savedSuppliers ? JSON.parse(savedSuppliers) : mockSuppliers;
  });
  
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever suppliers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
  }, [suppliers]);

  // Add new supplier
  const addSupplier = (newSupplier: Omit<Supplier, 'id'>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const supplierToAdd: Supplier = {
          ...newSupplier,
          id: generateId()
        };
        
        setSuppliers(currentSuppliers => {
          const updatedSuppliers = [...currentSuppliers, supplierToAdd];
          return updatedSuppliers;
        });
        
        toast({
          title: 'Supplier added',
          description: `${supplierToAdd.name} has been added to your suppliers.`,
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast({
        title: 'Error',
        description: 'Failed to add supplier. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Update existing supplier
  const updateSupplier = (id: string, updatedData: Partial<Supplier>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setSuppliers(currentSuppliers => 
          currentSuppliers.map(supplier => 
            supplier.id === id 
              ? { ...supplier, ...updatedData } 
              : supplier
          )
        );
        
        toast({
          title: 'Supplier updated',
          description: 'Supplier has been updated successfully.',
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast({
        title: 'Error',
        description: 'Failed to update supplier. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Delete supplier
  const deleteSupplier = (id: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const supplierToDelete = suppliers.find(supplier => supplier.id === id);
        
        setSuppliers(currentSuppliers => currentSuppliers.filter(supplier => supplier.id !== id));
        
        if (supplierToDelete) {
          toast({
            title: 'Supplier deleted',
            description: `${supplierToDelete.name} has been removed from your suppliers.`,
          });
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete supplier. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return {
    suppliers,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
}
