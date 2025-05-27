/**
 * ORGANIZATION CONFIGURATION
 * =========================
 * 
 * This file contains ALL organization-specific information.
 * When selling this app to a different organization, simply update
 * the values in this file - no other files need to be modified.
 * 
 * INSTRUCTIONS FOR CUSTOMIZATION:
 * 1. Update company information below
 * 2. Customize roles and departments as needed
 * 3. Adjust system settings if required
 * 4. Replace logo file in public folder
 */

// ==============================================
// COMPANY/ORGANIZATION INFORMATION
// ==============================================
// This is the SINGLE SOURCE OF TRUTH for all company info
export const organizationInfo = {
  // Basic Information
  name: "Lukenya Getaway",
  slogan: "Nature's Paradise Awaits You",
  industry: "Hospitality", // e.g., "Hospitality", "Healthcare", "Manufacturing", etc.
  
  // Contact Information
  address: "Lukenya Hills",
  city: "Machakos",
  state: "Machakos County",
  zipCode: "90100",
  country: "Kenya",
  phone: "+254 722 000 000",
  email: "info@lukenyagetaway.com",
  website: "www.lukenyagetaway.com",
  
  // Business Information
  taxId: "P051234567L",
  yearEstablished: "2015",
  
  // Financial Settings
  currency: "KES",
  currencySymbol: "KSh",
  timezone: "UTC+3",
  
  // Branding
  logo: "/logo.png", // Replace this file in public folder
  primaryColor: "#2563eb", // Customize brand color
  
  // Copyright (can be left empty if not needed)
  copyrightNotice: ""
};

// ==============================================
// INDUSTRY-SPECIFIC CONFIGURATIONS
// ==============================================

// HOTEL/HOSPITALITY DEPARTMENTS
// Customize these departments based on your organization type
export const organizationDepartments = [
  "Executive Office",
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
  "Landscaping"
];

// ORGANIZATIONAL ROLES
// Customize these roles based on your organization structure
export const organizationRoles = {
  // Top Management
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
    description: "Manages all aspects of operations"
  },
  
  // Department Leadership
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
    description: "Manages a specific department"
  },
  
  // Specialized Roles (Hospitality-specific - customize for other industries)
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
    description: "Manages all food and beverage operations"
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
    description: "Handles purchasing and procurement processes"
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
    description: "Manages storage areas and inventory"
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

// ==============================================
// SYSTEM CUSTOMIZATION SETTINGS
// ==============================================
export const systemCustomization = {
  // Application Settings
  appName: organizationInfo.name, // Will appear in browser tab
  
  // Refresh rates (in milliseconds)
  dataRefreshInterval: 5000,
  dashboardRefreshInterval: 5000,
  notificationRefreshInterval: 30000,
  
  // Feature toggles
  enableNotifications: true,
  enableMultiUserSync: true,
  showToastOnAutoRefresh: false,
  showToastOnManualRefresh: true,
  
  // Business rules
  lowStockThreshold: 0.2, // 20% of min stock level
  expiringSoonDays: 7, // Items expiring within 7 days
  inventoryMinStockDefault: 10,
  assetDepreciationRate: 0.15, // 15% annual
  
  // Session settings
  sessionTimeout: 3600000, // 1 hour in milliseconds
  
  // Default pagination
  defaultPageSize: 10,
  
  // Date formats
  dateFormat: 'PP', // '04/01/2023'
  timeFormat: 'p', // '10:15 AM'
  dateTimeFormat: 'PPp', // '04/01/2023 10:15 AM'
};

// ==============================================
// BUSINESS PROCESS CONFIGURATIONS
// ==============================================

// Purchase Order Types (customize based on organization needs)
export const purchaseOrderTypes = [
  "Standard",
  "Emergency", 
  "Contract",
  "Local Purchase Order",
  "Blanket",
  "Special"
];

// Purchase Order Status (customize workflow as needed)
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

// ==============================================
// VALIDATION RULES
// ==============================================
export const validationRules = {
  minPasswordLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  requireUppercase: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
};

// ==============================================
// TECHNICAL CONFIGURATION
// ==============================================
export const technicalConfig = {
  // Storage keys for cross-tab communication
  storageKeyPrefix: 'app-',
  
  // Data channels for real-time sync
  channels: {
    inventory: 'app-inventory-update',
    assets: 'app-assets-update', 
    users: 'app-users-update',
    requests: 'app-requests-update',
    reports: 'app-reports-update',
    suppliers: 'app-suppliers-update',
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

// ==============================================
// LEGACY COMPATIBILITY
// ==============================================
// Keep these exports for backward compatibility
export const companyInfo = organizationInfo;
export const userRoles = organizationRoles;
export const hotelDepartments = organizationDepartments;
export const systemSettings = systemCustomization;
export const multiUserSettings = technicalConfig;

// Default export with all configurations
export default {
  organizationInfo,
  organizationDepartments,
  organizationRoles,
  systemCustomization,
  purchaseOrderTypes,
  purchaseOrderStatus,
  validationRules,
  technicalConfig,
  // Legacy compatibility
  companyInfo,
  userRoles,
  hotelDepartments,
  systemSettings,
  multiUserSettings,
};
