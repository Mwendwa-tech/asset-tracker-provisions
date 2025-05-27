
/**
 * System Configuration
 * Central place for configurable system settings
 * 
 * NOTE: This file now imports from organizationConfig.ts
 * To customize for different organizations, edit organizationConfig.ts
 */

import {
  organizationInfo,
  organizationDepartments, 
  organizationRoles,
  systemCustomization,
  purchaseOrderTypes,
  purchaseOrderStatus,
  validationRules,
  technicalConfig
} from './organizationConfig';

// Re-export everything with legacy names for backward compatibility
export const companyInfo = organizationInfo;
export const systemSettings = systemCustomization;
export const userRoles = organizationRoles;
export const hotelDepartments = organizationDepartments;
export const multiUserSettings = technicalConfig;

export {
  purchaseOrderTypes,
  purchaseOrderStatus,
  validationRules
};

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
