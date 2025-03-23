import { useState, useEffect } from 'react';
import { 
  Asset, 
  AssetSummary, 
  CheckoutHistory 
} from '@/types';
import { 
  mockAssets, 
  getAssetSummary,
  mockCheckoutHistory
} from '@/utils/mockData';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';

// Use localStorage key constants
const STORAGE_KEYS = {
  ASSETS: 'hostel-assets',
  CHECKOUT_HISTORY: 'hostel-checkout-history'
};

export function useAssets() {
  // Initialize state with data from localStorage or mock data
  const [assets, setAssets] = useState<Asset[]>(() => {
    const savedAssets = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return savedAssets ? JSON.parse(savedAssets) : mockAssets;
  });
  
  const [summary, setSummary] = useState<AssetSummary>(getAssetSummary());
  
  const [checkoutHistory, setCheckoutHistory] = useState<CheckoutHistory[]>(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.CHECKOUT_HISTORY);
    return savedHistory ? JSON.parse(savedHistory) : mockCheckoutHistory;
  });
  
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever assets or checkout history change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKOUT_HISTORY, JSON.stringify(checkoutHistory));
  }, [checkoutHistory]);

  // Update summary whenever assets change
  useEffect(() => {
    const newSummary = calculateSummary(assets);
    setSummary(newSummary);
  }, [assets]);

  // Calculate asset summary
  const calculateSummary = (assetItems: Asset[]): AssetSummary => {
    const categories: Record<string, number> = {};
    let available = 0;
    let checkedOut = 0;
    let maintenance = 0;
    let totalValue = 0;

    assetItems.forEach(asset => {
      // Count categories
      categories[asset.category] = (categories[asset.category] || 0) + 1;
      
      // Count by status
      if (asset.status === 'available') available++;
      if (asset.status === 'checked-out') checkedOut++;
      if (asset.status === 'maintenance') maintenance++;
      
      // Sum values
      totalValue += asset.currentValue;
    });

    return {
      totalAssets: assetItems.length,
      available,
      checkedOut,
      maintenance,
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      totalValue
    };
  };

  // Add new asset
  const addAsset = (newAsset: Omit<Asset, 'id'>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const assetToAdd: Asset = {
          ...newAsset,
          id: generateId()
        };
        
        setAssets(currentAssets => {
          const updatedAssets = [...currentAssets, assetToAdd];
          return updatedAssets;
        });
        
        toast({
          title: 'Asset added',
          description: `${assetToAdd.name} has been added to the asset registry.`,
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Update existing asset
  const updateAsset = (id: string, updatedData: Partial<Asset>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        setAssets(currentAssets => 
          currentAssets.map(asset => 
            asset.id === id 
              ? { ...asset, ...updatedData } 
              : asset
          )
        );
        
        toast({
          title: 'Asset updated',
          description: 'Asset has been updated successfully.',
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to update asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Delete asset
  const deleteAsset = (id: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const assetToDelete = assets.find(asset => asset.id === id);
        
        setAssets(currentAssets => currentAssets.filter(asset => asset.id !== id));
        
        if (assetToDelete) {
          toast({
            title: 'Asset deleted',
            description: `${assetToDelete.name} has been removed from the asset registry.`,
          });
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Check out an asset
  const checkOutAsset = (
    assetId: string, 
    assignedTo: string, 
    expectedReturnDate?: Date,
    notes?: string
  ) => {
    setLoading(true);
    
    try {
      const asset = assets.find(a => a.id === assetId);
      
      if (!asset) {
        throw new Error('Asset not found');
      }
      
      if (asset.status !== 'available') {
        throw new Error('Asset is not available for checkout');
      }
      
      // Update asset status
      updateAsset(assetId, {
        status: 'checked-out',
        assignedTo,
        checkoutDate: new Date(),
        expectedReturnDate
      });
      
      // Add to checkout history
      const newCheckout: CheckoutHistory = {
        id: generateId(),
        assetId,
        assetName: asset.name,
        checkedOutBy: assignedTo,
        checkedOutDate: new Date(),
        notes
      };
      
      setCheckoutHistory(current => {
        const updatedHistory = [newCheckout, ...current];
        return updatedHistory;
      });
      
      toast({
        title: 'Asset checked out',
        description: `${asset.name} has been checked out to ${assignedTo}.`,
      });
      
      setLoading(false);
      return newCheckout;
    } catch (error) {
      console.error('Error checking out asset:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check out asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return null;
    }
  };

  // Check in an asset
  const checkInAsset = (assetId: string, notes?: string) => {
    setLoading(true);
    
    try {
      const asset = assets.find(a => a.id === assetId);
      
      if (!asset) {
        throw new Error('Asset not found');
      }
      
      if (asset.status !== 'checked-out') {
        throw new Error('Asset is not checked out');
      }
      
      // Update asset status
      updateAsset(assetId, {
        status: 'available',
        assignedTo: undefined,
        checkoutDate: undefined,
        expectedReturnDate: undefined
      });
      
      // Update checkout history
      setCheckoutHistory(current => 
        current.map(history => 
          history.assetId === assetId && !history.returnedDate
            ? { ...history, returnedDate: new Date(), notes: notes ? `${history.notes || ''} | Return note: ${notes}` : history.notes }
            : history
        )
      );
      
      toast({
        title: 'Asset checked in',
        description: `${asset.name} has been returned to inventory.`,
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error checking in asset:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check in asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return false;
    }
  };

  return {
    assets,
    summary,
    checkoutHistory,
    loading,
    addAsset,
    updateAsset,
    deleteAsset,
    checkOutAsset,
    checkInAsset
  };
}
