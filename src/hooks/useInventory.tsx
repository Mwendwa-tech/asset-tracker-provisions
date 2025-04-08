import { useState, useEffect, useCallback } from 'react';
import { 
  InventoryItem, 
  InventorySummary, 
  LowStockAlert, 
  StockTransaction 
} from '@/types';
import { 
  mockInventoryItems, 
  getLowStockAlerts, 
  getInventorySummary, 
  mockStockTransactions 
} from '@/utils/mockData';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { systemSettings } from '@/config/systemConfig';

// Use localStorage key constants
const STORAGE_KEYS = {
  INVENTORY_ITEMS: `${systemSettings.storageKeyPrefix}inventory-items`,
  TRANSACTIONS: `${systemSettings.storageKeyPrefix}inventory-transactions`
};

export function useInventory() {
  // Initialize state with data from localStorage or mock data
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEYS.INVENTORY_ITEMS);
      return savedItems ? JSON.parse(savedItems) : mockInventoryItems;
    } catch (error) {
      console.error("Error loading inventory from localStorage:", error);
      return mockInventoryItems;
    }
  });
  
  // Fixed: call these functions with no arguments
  const [summary, setSummary] = useState<InventorySummary>(() => getInventorySummary());
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(() => getLowStockAlerts());
  
  const [transactions, setTransactions] = useState<StockTransaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return savedTransactions ? JSON.parse(savedTransactions) : mockStockTransactions;
    } catch (error) {
      console.error("Error loading transactions from localStorage:", error);
      return mockStockTransactions;
    }
  });
  
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever items or transactions change and broadcast to other tabs
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY_ITEMS, JSON.stringify(items));
      
      // Notify other tabs/windows about the data change
      if (systemSettings.enableMultiUserSync) {
        // Create a micro-timestamp to avoid collisions in storage events
        const timestamp = new Date().getTime() + Math.random();
        localStorage.setItem('hostel-inventory-update', timestamp.toString());
      }
    } catch (error) {
      console.error("Error saving inventory to localStorage:", error);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error);
    }
  }, [transactions]);

  // Calculate inventory summary - memoized for performance
  const calculateSummary = useCallback((inventoryItems: InventoryItem[]): InventorySummary => {
    const categories: Record<string, number> = {};
    let totalValue = 0;
    let lowStockItems = 0;

    inventoryItems.forEach(item => {
      // Count categories
      categories[item.category] = (categories[item.category] || 0) + 1;
      
      // Sum values
      totalValue += item.currentValue;
      
      // Count low stock items
      if (item.quantity <= item.minStockLevel) {
        lowStockItems++;
      }
    });

    const newSummary = {
      totalItems: inventoryItems.length,
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      lowStockItems,
      totalValue
    };

    // Update summary state
    setSummary(newSummary);
    
    return newSummary;
  }, []);

  // Calculate low stock alerts
  const calculateLowStockAlerts = useCallback((inventoryItems: InventoryItem[]): LowStockAlert[] => {
    const alerts = inventoryItems
      .filter(item => item.quantity <= item.minStockLevel)
      .map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        currentStock: item.quantity,
        minStockLevel: item.minStockLevel,
        unit: item.unit
      }));
      
    // Update alerts state
    setLowStockAlerts(alerts);
    
    return alerts;
  }, []);

  // Update summary and alerts whenever items change
  useEffect(() => {
    try {
      calculateSummary(items);
      calculateLowStockAlerts(items);
    } catch (error) {
      console.error("Error updating inventory summary:", error);
      // Don't let the app crash if summary calculation fails
    }
  }, [items, calculateSummary, calculateLowStockAlerts]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'hostel-inventory-update') {
        // Reload data from localStorage (other tab made changes)
        try {
          const savedItems = localStorage.getItem(STORAGE_KEYS.INVENTORY_ITEMS);
          if (savedItems) {
            setItems(JSON.parse(savedItems));
          }
          
          const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
          if (savedTransactions) {
            setTransactions(JSON.parse(savedTransactions));
          }
        } catch (error) {
          console.error("Error syncing inventory data from other tabs:", error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  
  // Check for and handle expired items automatically
  useEffect(() => {
    const checkForExpiredItems = () => {
      const today = new Date();
      const expiredItems: InventoryItem[] = [];
      
      items.forEach(item => {
        if (item.expiryDate) {
          const expiryDate = new Date(item.expiryDate);
          if (expiryDate <= today && item.quantity > 0) {
            expiredItems.push(item);
          }
        }
      });
      
      // Process expired items
      if (expiredItems.length > 0) {
        expiredItems.forEach(item => {
          // Add an expired transaction
          const transaction: Omit<StockTransaction, 'id' | 'date'> = {
            itemId: item.id,
            itemName: item.name,
            type: 'expired',
            quantity: item.quantity, // Mark all as expired
            performedBy: 'System',
            notes: `Automatically marked as expired on ${today.toLocaleDateString()}`
          };
          
          addTransaction(transaction);
        });
      }
    };
    
    // Check for expired items when component mounts and daily
    checkForExpiredItems();
    
    const intervalId = setInterval(checkForExpiredItems, 86400000); // Check once a day
    
    return () => clearInterval(intervalId);
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  // Add new inventory item with safe implementation
  const addItem = useCallback((newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    setLoading(true);
    
    try {
      const itemToAdd: InventoryItem = {
        ...newItem,
        id: generateId(),
        lastUpdated: new Date()
      };
      
      setItems(currentItems => [...currentItems, itemToAdd]);
      
      // Record transaction
      const newTransaction = {
        id: generateId(),
        itemId: itemToAdd.id,
        itemName: itemToAdd.name,
        type: 'received' as const,
        quantity: itemToAdd.quantity,
        performedBy: 'Current User',
        notes: 'Initial inventory setup',
        date: new Date()
      };
      
      setTransactions(current => [newTransaction, ...current]);
      
      toast({
        title: 'Item added',
        description: `${itemToAdd.name} has been added to inventory.`,
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Update existing inventory item
  const updateItem = useCallback((id: string, updatedData: Partial<InventoryItem>) => {
    setLoading(true);
    
    try {
      setItems(currentItems => 
        currentItems.map(item => 
          item.id === id 
            ? { ...item, ...updatedData, lastUpdated: new Date() } 
            : item
        )
      );
      
      toast({
        title: 'Item updated',
        description: 'Inventory item has been updated successfully.',
      });
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete inventory item
  const deleteItem = useCallback((id: string) => {
    setLoading(true);
    
    try {
      const itemToDelete = items.find(item => item.id === id);
      
      setItems(currentItems => currentItems.filter(item => item.id !== id));
      
      if (itemToDelete) {
        toast({
          title: 'Item deleted',
          description: `${itemToDelete.name} has been removed from inventory.`,
        });
      }
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [items]);

  // Improved FIFO (First In, First Out) inventory handling for better expiry tracking
  const addTransaction = useCallback((transaction: Omit<StockTransaction, 'id' | 'date'>) => {
    try {
      const newTransaction: StockTransaction = {
        ...transaction,
        id: generateId(),
        date: new Date()
      };
      
      setTransactions(current => [newTransaction, ...current]);
      
      // Update item quantity based on transaction
      const itemToUpdate = items.find(item => item.id === transaction.itemId);
      
      if (itemToUpdate) {
        const updatedItem = { ...itemToUpdate };
        
        switch (transaction.type) {
          case 'received':
            // Properly handle inventory with different expiration dates
            if (transaction.expiryDate) {
              const currentStock = updatedItem.quantity;
              const currentValue = updatedItem.currentValue;
              const newStock = currentStock + transaction.quantity;
              
              // Calculate weighted expiry date for inventory
              // If current stock is 0 or the new batch expires sooner than the existing one, use the new expiry date
              if (currentStock === 0 || 
                  !updatedItem.expiryDate || 
                  new Date(transaction.expiryDate) < new Date(updatedItem.expiryDate)) {
                updatedItem.expiryDate = transaction.expiryDate;
              } else if (transaction.quantity > currentStock * 2) {
                // If the new batch is significantly larger, use its expiry date
                updatedItem.expiryDate = transaction.expiryDate;
              }
              
              updatedItem.quantity = newStock;
              
              // Update value if provided
              if (transaction.value) {
                const newValue = currentValue + transaction.value;
                updatedItem.currentValue = newValue;
              }
            } else {
              // Simple quantity update if no expiry tracking
              updatedItem.quantity += transaction.quantity;
              
              // Update value if provided
              if (transaction.value) {
                updatedItem.currentValue += transaction.value;
              }
            }
            break;
            
          case 'used':
          case 'expired':
            // Deduct from quantity, ensuring we don't go below zero
            const deductionAmount = Math.min(updatedItem.quantity, transaction.quantity);
            updatedItem.quantity -= deductionAmount;
            
            // Adjust the value proportionally
            if (updatedItem.quantity > 0) {
              const valuePerUnit = updatedItem.currentValue / (updatedItem.quantity + deductionAmount);
              updatedItem.currentValue -= valuePerUnit * deductionAmount;
            } else {
              updatedItem.currentValue = 0;
              // Clear expiry date if all stock is gone
              updatedItem.expiryDate = undefined;
            }
            break;
            
          case 'adjusted':
            // For manual adjustments
            updatedItem.quantity = Math.max(0, updatedItem.quantity + transaction.quantity);
            
            // If adjustment includes a value update
            if (transaction.value !== undefined) {
              updatedItem.currentValue = Math.max(0, updatedItem.currentValue + transaction.value);
            }
            break;
        }
        
        // Update the item
        setItems(currentItems => 
          currentItems.map(item => 
            item.id === updatedItem.id 
              ? { ...item, 
                  quantity: updatedItem.quantity, 
                  currentValue: updatedItem.currentValue,
                  expiryDate: updatedItem.expiryDate,
                  lastUpdated: new Date() 
                } 
              : item
          )
        );
      }
      
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to record transaction. Please try again.',
        variant: 'destructive'
      });
      return null;
    }
  }, [items]);

  return {
    items,
    summary,
    lowStockAlerts,
    transactions,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addTransaction,
    calculateSummary,
    calculateLowStockAlerts
  };
}
