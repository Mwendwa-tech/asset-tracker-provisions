
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

// Use localStorage key constants
const STORAGE_KEYS = {
  INVENTORY_ITEMS: 'hostel-inventory-items',
  TRANSACTIONS: 'hostel-inventory-transactions'
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
  
  // Fix: no arguments for these functions
  const [summary, setSummary] = useState<InventorySummary>(getInventorySummary());
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(getLowStockAlerts());
  
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

  // Save to localStorage whenever items or transactions change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVENTORY_ITEMS, JSON.stringify(items));
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

    return {
      totalItems: inventoryItems.length,
      categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
      lowStockItems,
      totalValue
    };
  }, []);

  // Calculate low stock alerts
  const calculateLowStockAlerts = useCallback((inventoryItems: InventoryItem[]): LowStockAlert[] => {
    return inventoryItems
      .filter(item => item.quantity <= item.minStockLevel)
      .map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        currentStock: item.quantity,
        minStockLevel: item.minStockLevel,
        unit: item.unit
      }));
  }, []);

  // Update summary and alerts whenever items change
  useEffect(() => {
    try {
      const newSummary = calculateSummary(items);
      const newAlerts = calculateLowStockAlerts(items);
      
      setSummary(newSummary);
      setLowStockAlerts(newAlerts);
    } catch (error) {
      console.error("Error updating inventory summary:", error);
      // Don't let the app crash if summary calculation fails
    }
  }, [items, calculateSummary, calculateLowStockAlerts]);

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

  // Add a stock transaction
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
            updatedItem.quantity += transaction.quantity;
            break;
          case 'used':
          case 'expired':
            updatedItem.quantity = Math.max(0, updatedItem.quantity - transaction.quantity);
            break;
          case 'adjusted':
            updatedItem.quantity = Math.max(0, updatedItem.quantity + transaction.quantity);
            break;
        }
        
        // Update the item
        setItems(currentItems => 
          currentItems.map(item => 
            item.id === updatedItem.id 
              ? { ...item, quantity: updatedItem.quantity, lastUpdated: new Date() } 
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
    addTransaction
  };
}
