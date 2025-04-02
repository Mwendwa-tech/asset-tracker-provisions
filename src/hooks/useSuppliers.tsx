
import { useState, useEffect } from 'react';
import { Supplier, SupplierProduct } from '@/types';
import { mockSuppliers } from '@/utils/mockData';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';

// Use localStorage key constants
const STORAGE_KEYS = {
  SUPPLIERS: 'hostel-suppliers',
};

export function useSuppliers() {
  // Initialize state with data from localStorage or mock data
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const savedSuppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return savedSuppliers ? JSON.parse(savedSuppliers) : mockSuppliers;
  });
  
  const [summary, setSummary] = useState({
    totalSuppliers: 0,
    totalProducts: 0,
    categoriesCount: 0,
    autoReorderProducts: 0
  });
  
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever suppliers change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  }, [suppliers]);

  // Update summary whenever suppliers change
  useEffect(() => {
    calculateSummary();
  }, [suppliers]);

  // Calculate suppliers summary
  const calculateSummary = () => {
    const allProducts: SupplierProduct[] = suppliers.flatMap(s => s.products || []);
    const allCategories = new Set(suppliers.flatMap(s => s.categories));
    const autoReorderCount = allProducts.filter(p => p.autoReorder).length;
    
    setSummary({
      totalSuppliers: suppliers.length,
      totalProducts: allProducts.length,
      categoriesCount: allCategories.size,
      autoReorderProducts: autoReorderCount
    });
  };

  // Add new supplier
  const addSupplier = (newSupplier: Omit<Supplier, 'id' | 'products'>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const supplierToAdd: Supplier = {
          ...newSupplier,
          id: generateId(),
          products: []
        };
        
        setSuppliers(current => [...current, supplierToAdd]);
        
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
  const updateSupplier = (id: string, updatedData: Partial<Omit<Supplier, 'id' | 'products'>>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const updatedSuppliers = suppliers.map(supplier => 
          supplier.id === id 
            ? { ...supplier, ...updatedData } 
            : supplier
        );
        setSuppliers(updatedSuppliers);
        
        toast({
          title: 'Supplier updated',
          description: 'Supplier information has been updated successfully.',
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
        
        setSuppliers(current => current.filter(supplier => supplier.id !== id));
        
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

  // Add product to a supplier
  const addProduct = (supplierId: string, product: Omit<SupplierProduct, 'id'>) => {
    setLoading(true);
    
    try {
      setTimeout(() => {
        const productToAdd: SupplierProduct = {
          ...product,
          id: generateId()
        };
        
        const updatedSuppliers = suppliers.map(supplier => {
          if (supplier.id === supplierId) {
            return {
              ...supplier,
              products: [...(supplier.products || []), productToAdd]
            };
          }
          return supplier;
        });
        
        setSuppliers(updatedSuppliers);
        
        toast({
          title: 'Product added',
          description: `${productToAdd.name} has been added to the supplier catalog.`,
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = (supplierId: string, productId: string, updatedData: Partial<SupplierProduct>) => {
    setLoading(true);
    
    try {
      setTimeout(() => {
        const updatedSuppliers = suppliers.map(supplier => {
          if (supplier.id === supplierId) {
            const updatedProducts = supplier.products?.map(product => 
              product.id === productId 
                ? { ...product, ...updatedData } 
                : product
            ) || [];
            
            return {
              ...supplier,
              products: updatedProducts
            };
          }
          return supplier;
        });
        
        setSuppliers(updatedSuppliers);
        
        toast({
          title: 'Product updated',
          description: 'Product information has been updated successfully.',
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = (supplierId: string, productId: string) => {
    setLoading(true);
    
    try {
      setTimeout(() => {
        const supplierWithProduct = suppliers.find(supplier => supplier.id === supplierId);
        const productToDelete = supplierWithProduct?.products?.find(product => product.id === productId);
        
        const updatedSuppliers = suppliers.map(supplier => {
          if (supplier.id === supplierId) {
            return {
              ...supplier,
              products: supplier.products?.filter(product => product.id !== productId) || []
            };
          }
          return supplier;
        });
        
        setSuppliers(updatedSuppliers);
        
        if (productToDelete) {
          toast({
            title: 'Product deleted',
            description: `${productToDelete.name} has been removed from the supplier catalog.`,
          });
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  return {
    suppliers,
    summary,
    loading,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
