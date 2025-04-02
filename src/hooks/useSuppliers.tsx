import { useState } from 'react';
import { Supplier, SupplierProduct } from '@/types';
import { supabase } from '@/lib/supabase';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Mock suppliers data with products
const mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Acme Supplies',
    contactPerson: 'John Doe',
    email: 'john@acmesupplies.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, USA',
    categories: ['Office', 'Electronics'],
    products: [
      {
        id: 'prod-1',
        name: 'A4 Paper',
        category: 'Office',
        unitPrice: 5.99,
        unit: 'Ream',
        minOrderQuantity: 10,
        leadTime: 3,
        autoReorder: true,
        reorderThreshold: 5
      },
      {
        id: 'prod-2',
        name: 'Laptop Dell XPS',
        category: 'Electronics',
        unitPrice: 1299.99,
        unit: 'Unit',
        minOrderQuantity: 1,
        leadTime: 14,
        autoReorder: false,
        reorderThreshold: 2
      }
    ]
  },
  {
    id: 'sup-2',
    name: 'Fresh Foods Inc',
    contactPerson: 'Jane Smith',
    email: 'jane@freshfoods.com',
    phone: '(555) 987-6543',
    address: '456 Farm Road, Countryside, CA',
    categories: ['Food', 'Beverages'],
    products: [
      {
        id: 'prod-3',
        name: 'Rice (Basmati)',
        category: 'Food',
        unitPrice: 25.99,
        unit: 'Kg',
        minOrderQuantity: 20,
        leadTime: 5,
        autoReorder: true,
        reorderThreshold: 10
      },
      {
        id: 'prod-4',
        name: 'Cooking Oil',
        category: 'Food',
        unitPrice: 8.99,
        unit: 'Litre',
        minOrderQuantity: 10,
        leadTime: 4,
        autoReorder: true,
        reorderThreshold: 5
      }
    ]
  }
];

// Storage key for localStorage
const SUPPLIERS_STORAGE_KEY = 'hotel-suppliers-data';

export function useSuppliers() {
  const queryClient = useQueryClient();
  
  // Get suppliers from localStorage or use mock data
  const getInitialSuppliers = () => {
    const storedData = localStorage.getItem(SUPPLIERS_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : mockSuppliers;
  };

  // Fetch suppliers
  const { data: suppliers = getInitialSuppliers(), isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // In a real implementation, this would fetch from Supabase
      return getInitialSuppliers();
    }
  });

  // Save suppliers to localStorage
  const saveSuppliers = (updatedSuppliers: Supplier[]) => {
    localStorage.setItem(SUPPLIERS_STORAGE_KEY, JSON.stringify(updatedSuppliers));
    return updatedSuppliers;
  };

  // Add new supplier
  const addSupplierMutation = useMutation({
    mutationFn: async (newSupplier: Omit<Supplier, 'id'>) => {
      const id = generateId();
      
      // Create a new supplier object with the generated ID
      const supplier: Supplier = {
        id,
        ...newSupplier,
        products: newSupplier.products || []
      };
      
      // Save to localStorage
      const updatedSuppliers = saveSuppliers([...suppliers, supplier]);
      
      return supplier;
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
      const updatedSuppliers = suppliers.map(s => 
        s.id === id ? { ...s, ...updatedData } : s
      );
      
      // Save to localStorage
      saveSuppliers(updatedSuppliers);
      
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
      const updatedSuppliers = suppliers.filter(s => s.id !== id);
      
      // Save to localStorage
      saveSuppliers(updatedSuppliers);
      
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

  // Add product to supplier
  const addProductMutation = useMutation({
    mutationFn: async ({ 
      supplierId, 
      product 
    }: { 
      supplierId: string, 
      product: Omit<SupplierProduct, 'id'>
    }) => {
      const newProduct = {
        id: generateId('prod'),
        ...product
      };
      
      const updatedSuppliers = suppliers.map(supplier => {
        if (supplier.id === supplierId) {
          return {
            ...supplier,
            products: [...(supplier.products || []), newProduct]
          };
        }
        return supplier;
      });
      
      // Save to localStorage
      saveSuppliers(updatedSuppliers);
      
      return { supplierId, product: newProduct };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Product added',
        description: `${data.product.name} has been added to supplier's products.`,
      });
    },
    onError: (error: any) => {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add product. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: async ({ 
      supplierId, 
      productId, 
      updatedData 
    }: { 
      supplierId: string, 
      productId: string, 
      updatedData: Partial<SupplierProduct>
    }) => {
      const updatedSuppliers = suppliers.map(supplier => {
        if (supplier.id === supplierId) {
          const updatedProducts = (supplier.products || []).map(product => 
            product.id === productId ? { ...product, ...updatedData } : product
          );
          
          return {
            ...supplier,
            products: updatedProducts
          };
        }
        return supplier;
      });
      
      // Save to localStorage
      saveSuppliers(updatedSuppliers);
      
      return { supplierId, productId, updatedData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Product updated',
        description: 'Product has been updated successfully.',
      });
    },
    onError: (error: any) => {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async ({ 
      supplierId, 
      productId 
    }: { 
      supplierId: string, 
      productId: string 
    }) => {
      const updatedSuppliers = suppliers.map(supplier => {
        if (supplier.id === supplierId) {
          return {
            ...supplier,
            products: (supplier.products || []).filter(product => product.id !== productId)
          };
        }
        return supplier;
      });
      
      // Save to localStorage
      saveSuppliers(updatedSuppliers);
      
      return { supplierId, productId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: 'Product removed',
        description: 'Product has been removed from supplier.',
      });
    },
    onError: (error: any) => {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove product. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Check inventory levels and generate auto-reorder alerts
  const getAutoReorderAlerts = (inventoryItems: any[]) => {
    const alerts: {
      supplierId: string;
      supplierName: string;
      productId: string;
      productName: string;
      currentStock: number;
      reorderThreshold: number;
      suggestedOrderQuantity: number;
    }[] = [];
    
    suppliers.forEach(supplier => {
      (supplier.products || []).forEach(product => {
        if (product.autoReorder) {
          // Find matching inventory item
          const inventoryItem = inventoryItems.find(
            item => item.name.toLowerCase() === product.name.toLowerCase()
          );
          
          if (inventoryItem && inventoryItem.quantity <= product.reorderThreshold) {
            alerts.push({
              supplierId: supplier.id,
              supplierName: supplier.name,
              productId: product.id,
              productName: product.name,
              currentStock: inventoryItem.quantity,
              reorderThreshold: product.reorderThreshold,
              suggestedOrderQuantity: product.minOrderQuantity
            });
          }
        }
      });
    });
    
    return alerts;
  };

  // Wrapper functions for mutations
  const addSupplier = (newSupplier: Omit<Supplier, 'id'>) => {
    addSupplierMutation.mutate(newSupplier);
  };

  const updateSupplier = (id: string, updatedData: Partial<Supplier>) => {
    updateSupplierMutation.mutate({ id, updatedData });
  };

  const deleteSupplier = (id: string) => {
    deleteSupplierMutation.mutate(id);
  };

  const addProduct = (supplierId: string, product: Omit<SupplierProduct, 'id'>) => {
    addProductMutation.mutate({ supplierId, product });
  };

  const updateProduct = (supplierId: string, productId: string, updatedData: Partial<SupplierProduct>) => {
    updateProductMutation.mutate({ supplierId, productId, updatedData });
  };

  const deleteProduct = (supplierId: string, productId: string) => {
    deleteProductMutation.mutate({ supplierId, productId });
  };

  return {
    suppliers,
    loading: isLoadingSuppliers || addSupplierMutation.isPending || updateSupplierMutation.isPending || deleteSupplierMutation.isPending,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addProduct,
    updateProduct,
    deleteProduct,
    getAutoReorderAlerts
  };
}
