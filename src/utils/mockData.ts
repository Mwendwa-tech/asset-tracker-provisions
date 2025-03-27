import { Asset, InventoryItem, User, Supplier, StockTransaction, CheckoutHistory } from '@/types';
import { 
  InventorySummary, 
  AssetSummary, 
  LowStockAlert 
} from '@/types';

// Helper to get random date in the last 30-60 days
const getRecentDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

// Helper to get future date in the next 1-12 months
const getFutureDate = (monthsAhead = 6) => {
  const date = new Date();
  date.setMonth(date.getMonth() + Math.ceil(Math.random() * monthsAhead));
  return date;
};

export const mockInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Rice',
    category: 'Food',
    quantity: 50,
    unit: 'kg',
    minStockLevel: 20,
    currentValue: 5000,
    location: 'Main Kitchen Storage',
    lastUpdated: getRecentDate(15),
    expiryDate: getFutureDate(8),
    supplier: 'Nairobi Wholesalers',
  },
  {
    id: '2',
    name: 'Sugar',
    category: 'Food',
    quantity: 15,
    unit: 'kg',
    minStockLevel: 10,
    currentValue: 1800,
    location: 'Main Kitchen Storage',
    lastUpdated: getRecentDate(10),
    expiryDate: getFutureDate(10),
    supplier: 'Nairobi Wholesalers',
  },
  {
    id: '3',
    name: 'Coffee Beans',
    category: 'Beverages',
    quantity: 8,
    unit: 'kg',
    minStockLevel: 5,
    currentValue: 3200,
    location: 'Bar Storage',
    lastUpdated: getRecentDate(5),
    expiryDate: getFutureDate(6),
    supplier: 'Kenya Coffee Co.',
  },
  {
    id: '4',
    name: 'Fresh Tomatoes',
    category: 'Produce',
    quantity: 12,
    unit: 'kg',
    minStockLevel: 15,
    currentValue: 1200,
    location: 'Refrigerator 1',
    lastUpdated: getRecentDate(2),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    supplier: 'Local Farmers Market',
  },
  {
    id: '5',
    name: 'Toilet Paper',
    category: 'Housekeeping',
    quantity: 200,
    unit: 'rolls',
    minStockLevel: 50,
    currentValue: 4000,
    location: 'Housekeeping Storage',
    lastUpdated: getRecentDate(20),
    supplier: 'Supermart Wholesalers',
  },
  {
    id: '6',
    name: 'Cooking Oil',
    category: 'Food',
    quantity: 30,
    unit: 'liters',
    minStockLevel: 15,
    currentValue: 6000,
    location: 'Main Kitchen Storage',
    lastUpdated: getRecentDate(8),
    expiryDate: getFutureDate(4),
    supplier: 'Nairobi Wholesalers',
  },
  {
    id: '7',
    name: 'Beef',
    category: 'Meat',
    quantity: 18,
    unit: 'kg',
    minStockLevel: 20,
    currentValue: 7200,
    location: 'Freezer 1',
    lastUpdated: getRecentDate(3),
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    supplier: 'Quality Meats Ltd',
  },
  {
    id: '8',
    name: 'Laundry Detergent',
    category: 'Housekeeping',
    quantity: 45,
    unit: 'kg',
    minStockLevel: 20,
    currentValue: 5400,
    location: 'Laundry Room',
    lastUpdated: getRecentDate(25),
    expiryDate: getFutureDate(12),
    supplier: 'CleanSupplies Inc',
  },
];

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Conference Room Projector',
    category: 'Electronics',
    status: 'available',
    location: 'Conference Room A',
    purchaseDate: new Date('2022-03-15'),
    purchaseValue: 85000,
    currentValue: 68000,
    condition: 'excellent',
    lastMaintenance: getRecentDate(90),
  },
  {
    id: '2',
    name: 'Commercial Coffee Machine',
    category: 'Kitchen Equipment',
    status: 'maintenance',
    location: 'Maintenance Shop',
    purchaseDate: new Date('2021-10-20'),
    purchaseValue: 120000,
    currentValue: 90000,
    condition: 'fair',
    lastMaintenance: getRecentDate(10),
  },
  {
    id: '3',
    name: 'Lounge Sofa Set',
    category: 'Furniture',
    status: 'available',
    location: 'Main Lounge',
    purchaseDate: new Date('2022-01-05'),
    purchaseValue: 75000,
    currentValue: 65000,
    condition: 'good',
    lastMaintenance: getRecentDate(120),
  },
  {
    id: '4',
    name: 'Golf Cart #1',
    category: 'Vehicles',
    status: 'checked-out',
    location: 'Property Grounds',
    assignedTo: 'Samuel Maina',
    checkoutDate: getRecentDate(2),
    expectedReturnDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    purchaseDate: new Date('2021-07-15'),
    purchaseValue: 250000,
    currentValue: 180000,
    condition: 'good',
    lastMaintenance: getRecentDate(45),
  },
  {
    id: '5',
    name: 'Industrial Lawn Mower',
    category: 'Grounds Equipment',
    status: 'available',
    location: 'Maintenance Shed',
    purchaseDate: new Date('2022-05-20'),
    purchaseValue: 95000,
    currentValue: 85000,
    condition: 'excellent',
    lastMaintenance: getRecentDate(30),
  },
  {
    id: '6',
    name: 'Smart TV - 65"',
    category: 'Electronics',
    status: 'available',
    location: 'Suite 201',
    purchaseDate: new Date('2022-02-10'),
    purchaseValue: 65000,
    currentValue: 52000,
    condition: 'good',
    lastMaintenance: null,
  },
  {
    id: '7',
    name: 'Commercial Dishwasher',
    category: 'Kitchen Equipment',
    status: 'available',
    location: 'Main Kitchen',
    purchaseDate: new Date('2021-11-28'),
    purchaseValue: 180000,
    currentValue: 153000,
    condition: 'good',
    lastMaintenance: getRecentDate(60),
  },
  {
    id: '8',
    name: 'Outdoor Dining Set',
    category: 'Furniture',
    status: 'checked-out',
    location: 'Pool Area',
    assignedTo: 'Events Department',
    checkoutDate: getRecentDate(1),
    expectedReturnDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    purchaseDate: new Date('2022-04-15'),
    purchaseValue: 45000,
    currentValue: 40000,
    condition: 'excellent',
    lastMaintenance: null,
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jane Wambui',
    role: 'generalManager',
    department: 'Executive',
    email: 'jane.wambui@lukenyagetaway.com',
  },
  {
    id: '2',
    name: 'David Ochieng',
    role: 'fbManager',
    department: 'Food & Beverage',
    email: 'david.ochieng@lukenyagetaway.com',
  },
  {
    id: '3',
    name: 'Mary Njeri',
    role: 'housekeeper',
    department: 'Housekeeping',
    email: 'mary.njeri@lukenyagetaway.com',
  },
  {
    id: '4',
    name: 'John Kamau',
    role: 'departmentHead',
    department: 'Maintenance',
    email: 'john.kamau@lukenyagetaway.com',
  },
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Nairobi Wholesalers',
    contactPerson: 'Rajesh Patel',
    email: 'info@nairobiwholesalers.co.ke',
    phone: '+254 712 345 678',
    address: 'Industrial Area, Nairobi',
    categories: ['Food', 'Beverages'],
  },
  {
    id: '2',
    name: 'Quality Meats Ltd',
    contactPerson: 'Samuel Wanjau',
    email: 'orders@qualitymeats.co.ke',
    phone: '+254 723 456 789',
    address: 'Karen, Nairobi',
    categories: ['Meat', 'Food'],
  },
  {
    id: '3',
    name: 'CleanSupplies Inc',
    contactPerson: 'Grace Muthoni',
    email: 'sales@cleansupplies.co.ke',
    phone: '+254 734 567 890',
    address: 'Westlands, Nairobi',
    categories: ['Housekeeping', 'Toiletries'],
  },
  {
    id: '4',
    name: 'Kenya Coffee Co.',
    contactPerson: 'Michael Mwangi',
    email: 'info@kenyacoffee.co.ke',
    phone: '+254 745 678 901',
    address: 'Kiambu Road, Nairobi',
    categories: ['Beverages', 'Food'],
  },
];

export const mockStockTransactions: StockTransaction[] = [
  {
    id: '1',
    itemId: '1',
    itemName: 'Rice',
    type: 'received',
    quantity: 50,
    date: getRecentDate(30),
    performedBy: 'David Ochieng',
    notes: 'Regular monthly supply',
  },
  {
    id: '2',
    itemId: '3',
    itemName: 'Coffee Beans',
    type: 'used',
    quantity: 2,
    date: getRecentDate(15),
    performedBy: 'Mary Njeri',
    notes: 'Used for weekend event',
  },
  {
    id: '3',
    itemId: '7',
    itemName: 'Beef',
    type: 'received',
    quantity: 25,
    date: getRecentDate(10),
    performedBy: 'David Ochieng',
    notes: 'Special order for corporate event',
  },
  {
    id: '4',
    itemId: '4',
    itemName: 'Fresh Tomatoes',
    type: 'expired',
    quantity: 5,
    date: getRecentDate(5),
    performedBy: 'Mary Njeri',
    notes: 'Removed expired stock',
  },
  {
    id: '5',
    itemId: '6',
    itemName: 'Cooking Oil',
    type: 'adjusted',
    quantity: -2,
    date: getRecentDate(8),
    performedBy: 'Jane Wambui',
    notes: 'Inventory count adjustment',
  },
];

export const mockCheckoutHistory: CheckoutHistory[] = [
  {
    id: '1',
    assetId: '4',
    assetName: 'Golf Cart #1',
    checkedOutBy: 'Samuel Maina',
    checkedOutDate: getRecentDate(2),
    notes: 'For guest transportation',
  },
  {
    id: '2',
    assetId: '8',
    assetName: 'Outdoor Dining Set',
    checkedOutBy: 'Events Department',
    checkedOutDate: getRecentDate(1),
    notes: 'For poolside wedding reception',
  },
  {
    id: '3',
    assetId: '1',
    assetName: 'Conference Room Projector',
    checkedOutBy: 'Peter Mwangi',
    checkedOutDate: getRecentDate(10),
    returnedDate: getRecentDate(8),
    notes: 'Corporate training event',
  },
  {
    id: '4',
    assetId: '2',
    assetName: 'Commercial Coffee Machine',
    checkedOutBy: 'Maintenance',
    checkedOutDate: getRecentDate(12),
    notes: 'Scheduled maintenance',
  },
];

// Generate calculated summary data
export const getInventorySummary = (): InventorySummary => {
  const categories: Record<string, number> = {};
  let totalValue = 0;
  let lowStockItems = 0;

  mockInventoryItems.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
    
    totalValue += item.currentValue;
    
    if (item.quantity <= item.minStockLevel) {
      lowStockItems++;
    }
  });

  return {
    totalItems: mockInventoryItems.length,
    categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
    lowStockItems,
    totalValue
  };
};

export const getAssetSummary = (): AssetSummary => {
  const categories: Record<string, number> = {};
  let available = 0;
  let checkedOut = 0;
  let maintenance = 0;
  let totalValue = 0;

  mockAssets.forEach(asset => {
    categories[asset.category] = (categories[asset.category] || 0) + 1;
    
    if (asset.status === 'available') available++;
    if (asset.status === 'checked-out') checkedOut++;
    if (asset.status === 'maintenance') maintenance++;
    
    totalValue += asset.currentValue;
  });

  return {
    totalAssets: mockAssets.length,
    available,
    checkedOut,
    maintenance,
    categories: Object.entries(categories).map(([name, count]) => ({ name, count })),
    totalValue
  };
};

export const getLowStockAlerts = (): LowStockAlert[] => {
  return mockInventoryItems
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
