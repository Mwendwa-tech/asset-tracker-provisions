
import { 
  Package, 
  AlertTriangle,
  Briefcase,
  TrendingDown,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { ReportType, ReportContextType, RecentReport, ReportData } from '@/types/reports';
import { InventoryItem, Asset } from '@/types';

// Define report types with metadata
export const getReportTypes = (): ReportType[] => [
  {
    id: 'inventory-status',
    title: 'Inventory Status Report',
    description: 'Overview of current inventory levels',
    icon: <Package className="h-8 w-8 text-blue-500" />,
    actions: ['Generate', 'Schedule'],
  },
  {
    id: 'low-stock',
    title: 'Low Stock Report',
    description: 'Items below minimum stock levels',
    icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
    actions: ['Generate', 'Schedule'],
  },
  {
    id: 'asset-status',
    title: 'Asset Status Report',
    description: 'Current status of all assets',
    icon: <Briefcase className="h-8 w-8 text-green-500" />,
    actions: ['Generate', 'Schedule'],
  },
  {
    id: 'consumption-trends',
    title: 'Usage Report',
    description: 'How inventory is being used',
    icon: <TrendingDown className="h-8 w-8 text-purple-500" />,
    actions: ['Generate', 'Schedule'],
  },
  {
    id: 'asset-utilization',
    title: 'Asset Utilization',
    description: 'How frequently assets are used',
    icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
    actions: ['Generate', 'Schedule'],
  },
  {
    id: 'expiry-tracking',
    title: 'Expiring Items Report',
    description: 'Items approaching expiration',
    icon: <Calendar className="h-8 w-8 text-red-500" />,
    actions: ['Generate', 'Schedule'],
  },
];

// Recent reports data
export const getRecentReports = (): RecentReport[] => [
  {
    type: 'inventory-status',
    title: 'Inventory Status Report',
    date: 'Aug 10, 2023',
    icon: <Package className="h-5 w-5 text-blue-500" />
  },
  {
    type: 'low-stock',
    title: 'Low Stock Report',
    date: 'Aug 8, 2023',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
  },
  {
    type: 'asset-status',
    title: 'Asset Status Report',
    date: 'Aug 5, 2023',
    icon: <Briefcase className="h-5 w-5 text-green-500" />
  }
];

// Get report title with description for better context
export const getReportContext = (reportType: string): ReportContextType => {
  switch(reportType) {
    case 'inventory-status':
      return {
        title: "Inventory Status",
        description: "Current inventory quantities by item",
        valueLabel: "Quantity in stock"
      };
    case 'low-stock':
      return {
        title: "Low Stock Items",
        description: "Items that need to be restocked soon",
        valueLabel: "Current quantity"
      };
    case 'asset-status':
      return {
        title: "Asset Availability",
        description: "Status of company assets",
        valueLabel: "Available (1) / Unavailable (0)"
      };
    case 'consumption-trends':
      return {
        title: "Inventory Usage",
        description: "How quickly items are being used",
        valueLabel: "Units used recently"
      };
    case 'asset-utilization':
      return {
        title: "Asset Usage Rate",
        description: "Percentage of time assets are in use",
        valueLabel: "Usage percentage"
      };
    case 'expiry-tracking':
      return {
        title: "Expiring Items",
        description: "Items that will expire soon",
        valueLabel: "Days until expiry"
      };
    default:
      return {
        title: "Report",
        description: "Generated report data",
        valueLabel: "Value"
      };
  }
};

// Generate data for reports based on inventory and assets
export const getReportData = (reportType: string, items?: InventoryItem[], assets?: Asset[]): ReportData[] => {
  // Ensure we have data before trying to use it
  if (!items || !assets) {
    return [];
  }
  
  switch(reportType) {
    case 'inventory-status':
      return items.slice(0, 10).map(item => ({
        name: item.name,
        value: item.quantity,
        detail: `${item.category} (${item.unit})`
      }));
    case 'low-stock':
      return items
        .filter(item => item.quantity < (item.minStockLevel || 10))
        .slice(0, 10)
        .map(item => ({
          name: item.name,
          value: item.quantity,
          detail: `Min required: ${item.minStockLevel || 10} ${item.unit}`
        }));
    case 'asset-status':
      return assets.slice(0, 10).map(asset => ({
        name: asset.name,
        value: asset.status === 'available' ? 1 : 0,
        detail: asset.status === 'available' ? 'Available' : 'Unavailable'
      }));
    case 'consumption-trends':
      return items.slice(0, 10).map(item => ({
        name: item.name,
        value: Math.floor(Math.random() * 50) + 5,
        detail: `${item.unit} used this month`
      }));
    case 'asset-utilization':
      return assets.slice(0, 10).map(asset => ({
        name: asset.name,
        value: Math.floor(Math.random() * 80) + 20,
        detail: `${asset.category} - ${asset.location}`
      }));
    case 'expiry-tracking':
      return items
        .filter(item => item.expiryDate)
        .slice(0, 10)
        .map(item => {
          const daysUntil = item.expiryDate ? 
            Math.floor((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
            0;
          return {
            name: item.name,
            value: daysUntil,
            detail: daysUntil <= 0 ? 'EXPIRED' : `Expires in ${daysUntil} days`
          };
        });
    default:
      return [];
  }
};

// Get report colors based on type
export const getReportColor = (reportType: string): string => {
  switch(reportType) {
    case 'inventory-status': return "#3b82f6"; // blue
    case 'low-stock': return "#f59e0b"; // amber 
    case 'asset-status': return "#10b981"; // green
    case 'consumption-trends': return "#8b5cf6"; // purple
    case 'asset-utilization': return "#6366f1"; // indigo
    case 'expiry-tracking': return "#ef4444"; // red
    default: return "#3b82f6"; // blue
  }
};
