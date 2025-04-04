
import { useState, useEffect, useCallback } from 'react';
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

// Debounced localStorage save function to improve performance
const useDebounceStorage = (key: string, data: any) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data));
    }, 100); // Short delay for better performance

    return () => clearTimeout(handler);
  }, [key, data]);
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

  // Use debounced storage for performance
  useDebounceStorage(STORAGE_KEYS.ASSETS, assets);
  useDebounceStorage(STORAGE_KEYS.CHECKOUT_HISTORY, checkoutHistory);

  // Memoize summary calculation for better performance
  const calculateSummary = useCallback((assetItems: Asset[]): AssetSummary => {
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
  }, []);

  // Update summary whenever assets change - with optimized performance
  useEffect(() => {
    // Use requestAnimationFrame for smoother UI updates
    const updateFrame = requestAnimationFrame(() => {
      const newSummary = calculateSummary(assets);
      setSummary(newSummary);
    });
    
    return () => cancelAnimationFrame(updateFrame);
  }, [assets, calculateSummary]);

  // Add new asset
  const addAsset = useCallback((newAsset: Omit<Asset, 'id'>) => {
    setLoading(true);
    
    try {
      // Create the asset with immediate UI update
      const assetToAdd: Asset = {
        ...newAsset,
        id: generateId()
      };
      
      setAssets(currentAssets => [...currentAssets, assetToAdd]);
      
      toast({
        title: 'Asset added',
        description: `${assetToAdd.name} has been added to the asset registry.`,
      });
      
      setLoading(false);
      return assetToAdd;
    } catch (error) {
      console.error('Error adding asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return null;
    }
  }, []);

  // Update existing asset
  const updateItem = useCallback((id: string, updatedData: Partial<Asset>) => {
    setLoading(true);
    
    try {
      // Update with immediate UI change
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
      return true;
    } catch (error) {
      console.error('Error updating asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to update asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return false;
    }
  }, []);

  // Delete asset
  const deleteItem = useCallback((id: string) => {
    setLoading(true);
    
    try {
      const assetToDelete = assets.find(asset => asset.id === id);
      
      // Delete with immediate UI update
      setAssets(currentAssets => currentAssets.filter(asset => asset.id !== id));
      
      if (assetToDelete) {
        toast({
          title: 'Asset deleted',
          description: `${assetToDelete.name} has been removed from the asset registry.`,
        });
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return false;
    }
  }, [assets]);

  // Check out an asset
  const checkOutAsset = useCallback((
    assetId: string, 
    assignedTo: string, 
    expectedReturnDate?: Date,
    notes?: string
  ) => {
    setLoading(true);
    
    try {
      const asset = assets.find(a => a.id === assetId);
      
      if (!asset) {
        setLoading(false);
        throw new Error('Asset not found');
      }
      
      if (asset.status !== 'available') {
        setLoading(false);
        throw new Error('Asset is not available for checkout');
      }
      
      // Update asset status with proper typing
      const updatedAsset: Asset = {
        ...asset,
        status: 'checked-out' as const,
        assignedTo,
        checkoutDate: new Date(),
        expectedReturnDate
      };
      
      // Immediately update UI with optimistic updates
      setAssets(current => 
        current.map(a => a.id === assetId ? updatedAsset : a)
      );
      
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
  }, [assets]);

  // Check in an asset
  const checkInAsset = useCallback((assetId: string, notes?: string, condition: Asset['condition'] = 'good') => {
    setLoading(true);
    
    try {
      const asset = assets.find(a => a.id === assetId);
      
      if (!asset) {
        setLoading(false);
        throw new Error('Asset not found');
      }
      
      if (asset.status !== 'checked-out') {
        setLoading(false);
        throw new Error('Asset is not checked out');
      }
      
      // Determine next status based on condition with proper typing
      let nextStatus: Asset['status'] = 'available';
      
      if (['excellent', 'good'].includes(condition)) {
        nextStatus = 'available';
      } else {
        nextStatus = 'maintenance';
      }
      
      // Ensure condition is properly typed
      const assetCondition: Asset['condition'] = condition;
      
      // Update asset status with immediate UI update
      const updatedAsset: Asset = {
        ...asset,
        status: nextStatus,
        assignedTo: undefined,
        checkoutDate: undefined,
        expectedReturnDate: undefined,
        condition: assetCondition,
        lastConditionNote: notes || `Checked in with ${condition} condition`
      };
      
      setAssets(current => 
        current.map(a => a.id === assetId ? updatedAsset : a)
      );
      
      // Update checkout history
      const updatedHistory = checkoutHistory.map(history => 
        history.assetId === assetId && !history.returnedDate
          ? { 
              ...history, 
              returnedDate: new Date(), 
              returnCondition: condition,
              notes: notes 
                ? `${history.notes || ''} | Return condition: ${condition} | Note: ${notes}` 
                : `${history.notes || ''} | Return condition: ${condition}`
            }
          : history
      );
      
      setCheckoutHistory(updatedHistory);
      
      toast({
        title: 'Asset checked in',
        description: nextStatus === 'available' 
          ? `${asset.name} has been returned to inventory.` 
          : `${asset.name} has been sent to maintenance.`,
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
  }, [assets, checkoutHistory]);

  // Change asset status
  const changeAssetStatus = useCallback((assetId: string, newStatus: Asset['status'], notes?: string) => {
    setLoading(true);
    
    try {
      const asset = assets.find(a => a.id === assetId);
      
      if (!asset) {
        setLoading(false);
        throw new Error('Asset not found');
      }
      
      // Prevent invalid transitions
      if (asset.status === 'checked-out' && newStatus !== 'available') {
        setLoading(false);
        throw new Error('Checked-out assets must be checked in before changing to other statuses');
      }
      
      // Update asset status with immediate UI update
      const updatedAsset: Asset = {
        ...asset,
        status: newStatus,
        statusChangeDate: new Date(),
        statusChangeNote: notes || `Status changed to ${newStatus}`,
        // Clear checkout data if going to a status other than 'checked-out'
        ...(newStatus !== 'checked-out' && {
          assignedTo: undefined,
          checkoutDate: undefined,
          expectedReturnDate: undefined
        })
      };
      
      setAssets(current => 
        current.map(a => a.id === assetId ? updatedAsset : a)
      );
      
      toast({
        title: 'Status updated',
        description: `${asset.name} status changed to ${newStatus}.`,
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error changing asset status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change asset status. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return false;
    }
  }, [assets]);

  return {
    assets,
    summary,
    checkoutHistory,
    loading,
    addAsset,
    updateItem,
    deleteItem,
    checkOutAsset,
    checkInAsset,
    changeAssetStatus
  };
}
