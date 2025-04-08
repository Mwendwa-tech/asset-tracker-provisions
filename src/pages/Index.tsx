
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { InventorySummary } from '@/components/dashboard/InventorySummary';
import { AssetSummary } from '@/components/dashboard/AssetSummary';
import { LowStockAlerts } from '@/components/dashboard/LowStockAlert';
import { formatCurrency } from '@/utils/formatters';
import { Package, Briefcase, AlertTriangle, BarChart3, RefreshCw, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';
import { useAssets } from '@/hooks/useAssets';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { systemSettings, companyInfo } from '@/config/systemConfig';
import { useAuth } from '@/context/AuthContext';

// Default values for when data is still loading
const defaultInventory = { 
  totalItems: 0, 
  lowStockItems: 0, 
  totalValue: 0,
  categories: []
};

const defaultAssetsSummary = {
  totalAssets: 0,
  available: 0,
  checkedOut: 0,
  maintenance: 0,
  totalValue: 0,
  categories: []
};

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const { isAdmin } = useAuth();

  // Use the hooks to get real-time data
  const { 
    summary: inventorySummary, 
    lowStockAlerts, 
    calculateSummary: calculateInventorySummary, 
    calculateLowStockAlerts,
    items
  } = useInventory();
  
  const { 
    summary: assetSummary, 
    calculateSummary: calculateAssetSummary,
    assets: assetItems 
  } = useAssets();
  
  // Create useMemo instances to prevent unnecessary re-renders
  const inventory = useMemo(() => inventorySummary || defaultInventory, [inventorySummary]);
  const assets = useMemo(() => assetSummary || defaultAssetsSummary, [assetSummary]);
  const alerts = useMemo(() => lowStockAlerts || [], [lowStockAlerts]);

  // Create refresh functions with visual feedback
  const refreshInventory = useCallback(() => {
    if (calculateInventorySummary && items && calculateLowStockAlerts) {
      calculateInventorySummary(items);
      calculateLowStockAlerts(items);
    }
  }, [calculateInventorySummary, calculateLowStockAlerts, items]);

  const refreshAssets = useCallback(() => {
    if (calculateAssetSummary && assetItems) {
      calculateAssetSummary(assetItems);
    }
  }, [calculateAssetSummary, assetItems]);

  // Combined refresh function with visual feedback (only for manual refresh)
  const refreshAllData = useCallback(() => {
    setRefreshing(true);
    
    // Refresh all data sources
    refreshInventory();
    refreshAssets();
    
    // Only show toast for manual refresh as requested
    if (systemSettings.showToastOnManualRefresh) {
      toast({
        title: "Dashboard updated",
        description: "All data has been refreshed",
      });
    }
    
    // Reset refreshing state after animation
    setTimeout(() => setRefreshing(false), 600);
  }, [refreshInventory, refreshAssets]);

  // Auto-refresh data without toast notifications
  const silentRefreshAllData = useCallback(() => {
    // Refresh all data sources
    refreshInventory();
    refreshAssets();
  }, [refreshInventory, refreshAssets]);

  // Simulate multi-user activity
  useEffect(() => {
    // Set initial active users (3-8 random users)
    setActiveUsers(Math.floor(Math.random() * 6) + 3);
    
    // Simulate users joining and leaving
    const userActivity = setInterval(() => {
      setActiveUsers(prev => {
        // Random change (-1, 0, or +1)
        const change = Math.floor(Math.random() * 3) - 1;
        // Ensure at least 1 user and max 12 users
        return Math.max(1, Math.min(12, prev + change));
      });
    }, 30000);
    
    return () => clearInterval(userActivity);
  }, []);

  // Setup localStorage sync for multi-user functionality
  useEffect(() => {
    // Listen for storage events from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key && event.key.startsWith('hostel-')) {
        // Refresh data when another user makes changes
        silentRefreshAllData();
        
        // Only show toast if setting is enabled
        if (systemSettings.showToastOnAutoRefresh) {
          toast({
            title: "Data updated",
            description: "Another user has made changes to the system",
          });
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [silentRefreshAllData]);

  // Force refresh data when component mounts and periodic refresh every 5 seconds
  useEffect(() => {
    // Refresh data when component mounts
    silentRefreshAllData();
    
    // Also refresh data when user returns to this tab/window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        silentRefreshAllData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up periodic refresh (every 5 seconds as requested)
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        silentRefreshAllData();
      }
    }, systemSettings.dataRefreshInterval); // 5 seconds
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, [silentRefreshAllData]);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title={`${companyInfo.name} Dashboard`}
          description={`Overview of your inventory and assets`}
          actions={
            <div className="flex space-x-2 items-center">
              {isAdmin() && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center mr-2">
                        <Globe className="h-4 w-4 mr-1 text-green-500" />
                        <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                          {activeUsers} active {activeUsers === 1 ? 'user' : 'users'}
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Users currently accessing the system</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <Button 
                variant="outline" 
                onClick={refreshAllData} 
                disabled={refreshing}
                className="transition-all duration-200"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button asChild>
                <Link to="/reports">Generate Report</Link>
              </Button>
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Inventory Items"
            value={inventory.totalItems}
            description="Across all categories"
            icon={<Package />}
            className="bg-blue-50 dark:bg-blue-950"
          />
          <StatCard
            title="Low Stock Items"
            value={alerts.length}
            description="Need attention"
            icon={<AlertTriangle />}
            className="bg-amber-50 dark:bg-amber-950"
          />
          <StatCard
            title="Total Assets"
            value={assets.totalAssets}
            description="Available and in use"
            icon={<Briefcase />}
            className="bg-green-50 dark:bg-green-950"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(inventory.totalValue + assets.totalValue)}
            description="Combined inventory & assets"
            icon={<BarChart3 />}
            className="bg-purple-50 dark:bg-purple-950"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InventorySummary data={inventory} />
          <AssetSummary data={assets} />
          <LowStockAlerts data={alerts} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
