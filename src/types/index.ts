export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStockLevel: number;
  currentValue: number;
  location: string;
  lastUpdated: Date;
  expiryDate?: Date;
  supplier?: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'available' | 'checked-out' | 'maintenance' | 'retired';
  location: string;
  assignedTo?: string;
  checkoutDate?: Date;
  expectedReturnDate?: Date;
  purchaseDate: Date;
  purchaseValue: number;
  currentValue: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  lastMaintenance?: Date;
}

export interface InventorySummary {
  totalItems: number;
  categories: { name: string; count: number }[];
  lowStockItems: number;
  totalValue: number;
}

export interface AssetSummary {
  totalAssets: number;
  available: number;
  checkedOut: number;
  maintenance: number;
  categories: { name: string; count: number }[];
  totalValue: number;
}

export interface LowStockAlert {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  unit: string;
}

export interface CheckoutHistory {
  id: string;
  assetId: string;
  assetName: string;
  checkedOutBy: string;
  checkedOutDate: Date;
  returnedDate?: Date;
  notes?: string;
}

export interface StockTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'received' | 'used' | 'adjusted' | 'expired';
  quantity: number;
  date: Date;
  performedBy: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  department: string;
  email: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
}

export interface RequestItem {
  id: string;
  itemId: string;
  itemType: 'inventory' | 'asset';
  itemName: string;
  quantity?: number;
  requestedBy: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approvedBy?: string;
  approvalDate?: Date;
  fulfilledBy?: string;
  fulfillmentDate?: Date;
  returnDate?: Date;
  reason: string;
  notes?: string;
}

export interface Receipt {
  id: string;
  requestId: string;
  items: {
    name: string;
    quantity?: number;
    type: 'inventory' | 'asset';
  }[];
  requestedBy: string;
  approvedBy: string;
  issuedBy: string;
  issueDate: Date;
  notes?: string;
}
