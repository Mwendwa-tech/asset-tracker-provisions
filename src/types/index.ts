
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

// Updated user roles to match hotel organization
export interface User {
  id: string;
  name: string;
  role: 'generalManager' | 'departmentHead' | 'storekeeper' | 'roomsManager' | 'fbManager' | 'housekeeper' | 'frontDesk' | 'maintenance' | 'chef' | 'staff';
  department: HotelDepartment;
  email: string;
  permissions?: string[];
}

// Hotel-specific departments
export type HotelDepartment = 
  | 'Executive' 
  | 'Front Office' 
  | 'Housekeeping' 
  | 'Food & Beverage' 
  | 'Kitchen' 
  | 'Maintenance' 
  | 'Accounting' 
  | 'Human Resources' 
  | 'Purchasing' 
  | 'Stores' 
  | 'Security' 
  | 'Spa & Wellness';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: string[];
}

// Updated for hotel-specific request system
export interface RequestItem {
  id: string;
  itemId: string;
  itemType: 'inventory' | 'asset';
  itemName: string;
  quantity?: number;
  requestedBy: string;
  requestDate: Date;
  status: 'pending' | 'department-approved' | 'approved' | 'rejected' | 'fulfilled';
  departmentApprovedBy?: string;
  departmentApprovalDate?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  fulfilledBy?: string;
  fulfillmentDate?: Date;
  returnDate?: Date;
  reason: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: HotelDepartment;
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
  department: HotelDepartment;
}

// Permissions for different actions - updated for hotel context
export enum Permission {
  // Request permissions
  CreateRequest = "create:request",
  ViewRequest = "view:request",
  ApproveRequestDepartment = "approve:request:department",
  ApproveRequestFinal = "approve:request:final",
  FulfillRequest = "fulfill:request",
  
  // Inventory permissions
  ManageInventory = "manage:inventory",
  ViewInventory = "view:inventory",
  
  // Asset permissions
  ManageAssets = "manage:assets",
  ViewAssets = "view:assets",
  
  // User management
  ManageUsers = "manage:users"
}

// Role-based permissions mapping for hotel roles
export const RolePermissions: Record<User['role'], Permission[]> = {
  generalManager: Object.values(Permission),
  departmentHead: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ApproveRequestDepartment,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  storekeeper: [
    Permission.ViewRequest,
    Permission.FulfillRequest,
    Permission.ManageInventory,
    Permission.ManageAssets,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  roomsManager: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ApproveRequestDepartment,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  fbManager: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ApproveRequestDepartment,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  housekeeper: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  frontDesk: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  maintenance: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  chef: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ViewInventory,
    Permission.ViewAssets
  ],
  staff: [
    Permission.CreateRequest,
    Permission.ViewRequest,
    Permission.ViewInventory
  ]
}
