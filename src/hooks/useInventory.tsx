
import { useState, useEffect } from 'react';
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

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [summary, setSummary] = useState<InventorySummary>(getInventorySummary());
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>(getLowStockAlerts());
  const [transactions, setTransactions] = useState<StockTransaction[]>(mockStockTransactions);
  const [loading, setLoading] = useState(false);

  // Update summary and alerts whenever items change
  useEffect(() => {
    const newSummary = calculateSummary(items);
    const newAlerts = calculateLowStockAlerts(items);
    
    setSummary(newSummary);
    setLowStockAlerts(newAlerts);
  }, [items]);

  // Calculate inventory summary
  const calculateSummary = (inventoryItems: InventoryItem[]): InventorySummary => {
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
  };

  // Calculate low stock alerts
  const calculateLowStockAlerts = (inventoryItems: InventoryItem[]): LowStockAlert[] => {
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
  };

  // Add new inventory item
  const addItem = (newItem: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const itemToAdd: InventoryItem = {
          ...newItem,
          id: generateId(),
          lastUpdated: new Date()
        };
        
        setItems(currentItems => [...currentItems, itemToAdd]);
        
        // Record transaction
        addTransaction({
          itemId: itemToAdd.id,
          itemName: itemToAdd.name,
          type: 'received',
          quantity: itemToAdd.quantity,
          performedBy: 'Current User', // In a real app, this would be the logged-in user
          notes: 'Initial inventory setup'
        });
        
        toast({
          title: 'Item added',
          description: `${itemToAdd.name} has been added to inventory.`,
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Update existing inventory item
  const updateItem = (id: string, updatedData: Partial<InventoryItem>) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
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
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteItem = (id: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      setTimeout(() => {
        const itemToDelete = items.find(item => item.id === id);
        
        setItems(currentItems => currentItems.filter(item => item.id !== id));
        
        if (itemToDelete) {
          toast({
            title: 'Item deleted',
            description: `${itemToDelete.name} has been removed from inventory.`,
          });
        }
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete item. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Add a stock transaction
  const addTransaction = (transaction: Omit<StockTransaction, 'id' | 'date'>) => {
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
      updateItem(updatedItem.id, {
        quantity: updatedItem.quantity,
        lastUpdated: new Date()
      });
    }
    
    return newTransaction;
  };

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
