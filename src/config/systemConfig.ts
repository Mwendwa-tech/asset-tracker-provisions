
/**
 * System Configuration
 * Central place for configurable system settings
 */

// Company/Hotel information
export const companyInfo = {
  name: "Luxury Hotel & Resorts",
  address: "123 Beachfront Avenue",
  city: "Paradise Bay",
  state: "Tropical State",
  zipCode: "12345",
  country: "Island Nation",
  phone: "+1 (555) 123-4567",
  email: "info@luxuryhotel.example",
  website: "www.luxuryhotel.example",
  taxId: "12-3456789",
  logo: "/logo.png", // Path to logo file
  currency: "USD",
  currencySymbol: "$",
  timezone: "UTC-5",
  yearEstablished: "2010",
  slogan: "Redefining Luxury, One Stay at a Time"
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
  
  // Copyright notice (empty as requested)
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
  }
};

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

export default {
  companyInfo,
  systemSettings,
  userRoles,
  multiUserSettings,
  validationRules,
};
