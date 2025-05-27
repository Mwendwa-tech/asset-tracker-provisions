/**
 * System Configuration
 * Central place for configurable system settings
 */

// Company/Hotel information - SINGLE SOURCE OF TRUTH
export const companyInfo = {
  name: "Lukenya Getaway",
  address: "Lukenya Hills",
  city: "Machakos",
  state: "Machakos County", 
  zipCode: "90100",
  country: "Kenya",
  phone: "+254 722 000 000",
  email: "info@lukenyagetaway.com",
  website: "www.lukenyagetaway.com",
  taxId: "P051234567L",
  logo: "/logo.png", // Path to logo file
  currency: "KES",
  currencySymbol: "KSh",
  timezone: "UTC+3",
  yearEstablished: "2015",
  slogan: "Nature's Paradise Awaits You"
};

// System settings
export const systemSettings = {
  // Refresh rates in milliseconds
  dataRefreshInterval: 5000, // 5 seconds
  dashboardRefreshInterval: 5000, // 5 seconds
  notificationRefreshInterval: 30000, // 30 seconds
  
  // Feature flags
  enableNotifications: true,
  enableMultiUserSync: true,
  showToastOnAutoRefresh: false, // Don't show toast on auto refresh
  showToastOnManualRefresh: true, // Show toast only on manual refresh
  
  // Storage keys for cross-tab communication
  storageKeyPrefix: 'hostel-',
  
  // Default pagination
  defaultPageSize: 10,
  
  // Date formats
  dateFormat: 'PP', // '04/01/2023'
  timeFormat: 'p', // '10:15 AM'
  dateTimeFormat: 'PPp', // '04/01/2023 10:15 AM'
  
  // Inventory settings
  lowStockThreshold: 0.2, // 20% of min stock level
  expiringSoonDays: 7, // Items expiring within 7 days
  inventoryMinStockDefault: 10,
  
  // Asset settings
  assetDepreciationRate: 0.15, // 15% annual
  
  // User session timeout (milliseconds)
  sessionTimeout: 3600000, // 1 hour
  
  // Copyright notice - removed
  copyrightNotice: "",
};

// Define user roles and their access levels
export const userRoles = {
  generalManager: {
    label: "General Manager",
    level: 10,
    canApproveRequests: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: true,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: true,
    description: "Manages all aspects of hotel operations"
  },
  departmentHead: {
    label: "Department Head",
    level: 7,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: true,
    description: "Manages a specific department, approves departmental requests"
  },
  foodAndBeverageManager: {
    label: "Food & Beverage Manager",
    level: 7,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: true,
    description: "Manages all food and beverage operations including restaurants, bars, and banquets"
  },
  procurementOfficer: {
    label: "Procurement Officer",
    level: 6,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: true,
    canCreatePurchaseOrders: true,
    description: "Handles purchasing and procurement processes for the entire hotel"
  },
  executiveChef: {
    label: "Executive Chef",
    level: 6,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageKitchenInventory: true,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Manages kitchen operations and food inventory"
  },
  headChef: {
    label: "Head Chef",
    level: 5,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageKitchenInventory: true,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Oversees day-to-day kitchen operations"
  },
  souschef: {
    label: "Sous Chef",
    level: 4,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
    canManageInventory: false,
    canManageKitchenInventory: true,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Assistant to the executive chef, helps manage kitchen inventory"
  },
  restaurantManager: {
    label: "Restaurant Manager",
    level: 5,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages restaurant operations and staff"
  },
  barManager: {
    label: "Bar Manager",
    level: 5,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages bar operations and beverage inventory"
  },
  housekeepingManager: {
    label: "Housekeeping Manager",
    level: 6,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages housekeeping staff and related inventory"
  },
  frontOfficeManager: {
    label: "Front Office Manager",
    level: 6,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: false,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages front desk operations and guest services"
  },
  reservationsManager: {
    label: "Reservations Manager",
    level: 5,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: false,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Oversees booking and reservations systems"
  },
  storekeeper: {
    label: "Storekeeper",
    level: 5,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages the hotel's storage areas and inventory"
  },
  maintenanceManager: {
    label: "Maintenance Manager",
    level: 5,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Responsible for property maintenance and repairs"
  },
  securityManager: {
    label: "Security Manager",
    level: 5,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: false,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages security operations and equipment"
  },
  hrManager: {
    label: "HR Manager",
    level: 6,
    canApproveRequests: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: false,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Manages human resources and staffing"
  },
  financeManager: {
    label: "Finance Manager",
    level: 7,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: true,
    canManageInventory: false,
    canManageAssets: false,
    canManageSuppliers: true,
    description: "Oversees financial operations and accounting"
  },
  itManager: {
    label: "IT Manager",
    level: 6,
    canApproveRequests: true,
    canManageUsers: true,
    canViewReports: true,
    canManageSettings: true,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages IT infrastructure and technical assets"
  },
  salesAndMarketingManager: {
    label: "Sales & Marketing Manager",
    level: 6,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: false,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Oversees marketing activities and sales strategies"
  },
  spaManager: {
    label: "Spa & Wellness Manager",
    level: 5,
    canApproveRequests: true,
    canManageUsers: false,
    canViewReports: true,
    canManageSettings: false,
    canManageInventory: true,
    canManageAssets: true,
    canManageSuppliers: false,
    description: "Manages spa operations and wellness services"
  },
  staff: {
    label: "Staff",
    level: 1,
    canApproveRequests: false,
    canManageUsers: false,
    canViewReports: false,
    canManageSettings: false,
    canManageInventory: false,
    canManageAssets: false,
    canManageSuppliers: false,
    description: "Regular staff with basic system access"
  }
};

// Hotel departments
export const hotelDepartments = [
  "Front Office",
  "Housekeeping",
  "Food & Beverage",
  "Kitchen",
  "Restaurant",
  "Bar",
  "Banquet",
  "Room Service",
  "Maintenance",
  "Security",
  "Administration",
  "Human Resources",
  "Sales & Marketing",
  "Finance",
  "Accounting",
  "Purchasing",
  "Stores",
  "IT",
  "Engineering",
  "Spa & Wellness",
  "Fitness Center",
  "Concierge",
  "Guest Relations",
  "Laundry",
  "Recreation",
  "Transport",
  "Landscaping",
  "Executive Office"
];

// Support for multi-user environment
export const multiUserSettings = {
  // Data channels for real-time sync
  channels: {
    inventory: `${systemSettings.storageKeyPrefix}inventory-update`,
    assets: `${systemSettings.storageKeyPrefix}assets-update`,
    users: `${systemSettings.storageKeyPrefix}users-update`,
    requests: `${systemSettings.storageKeyPrefix}requests-update`,
    reports: `${systemSettings.storageKeyPrefix}reports-update`,
    suppliers: `${systemSettings.storageKeyPrefix}suppliers-update`,
  },
  
  // Backend API endpoints (for future implementation)
  apiEndpoints: {
    baseUrl: "https://api.example.com/v1",
    inventory: "/inventory",
    assets: "/assets",
    users: "/users",
    requests: "/requests",
    reports: "/reports",
    suppliers: "/suppliers",
    auth: "/auth",
  },
};

// Validation rules
export const validationRules = {
  minPasswordLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  requireUppercase: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
};

// Purchase Order Types
export const purchaseOrderTypes = [
  "Standard",
  "Emergency",
  "Contract",
  "Local Purchase Order",
  "Blanket",
  "Special"
];

// Purchase Order Status
export const purchaseOrderStatus = [
  "Draft",
  "Awaiting Approval",
  "Approved",
  "Sent to Vendor",
  "Partially Received",
  "Received",
  "Cancelled",
  "On Hold"
];

export default {
  companyInfo,
  systemSettings,
  userRoles,
  multiUserSettings,
  validationRules,
  hotelDepartments,
  purchaseOrderTypes,
  purchaseOrderStatus
};
