
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { InventorySummary } from '@/components/dashboard/InventorySummary';
import { AssetSummary } from '@/components/dashboard/AssetSummary';
import { LowStockAlerts } from '@/components/dashboard/LowStockAlert';
import { formatCurrency } from '@/utils/formatters';
import { Package, Briefcase, AlertTriangle, BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';
import { useAssets } from '@/hooks/useAssets';
import { useEffect, useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

// Default values for when data is still loading
const defaultInventory = { 
  totalItems: 0, 
  lowStockItems: 0, 
  totalValue: 0,
  categories: []
};

const defaultAssets = {
  totalAssets: 0,
  available: 0,
  checkedOut: 0,
  maintenance: 0,
  totalValue: 0,
  categories: []
};

const Dashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Use the hooks to get real-time data
  const { 
    summary: inventorySummary, 
    lowStockAlerts, 
    calculateSummary, 
    calculateLowStockAlerts,
    items
  } = useInventory();
  
  const { 
    summary: assetSummary, 
    calculateSummary: calculateAssetSummary,
    assets: assetItems 
  } = useAssets();
  
  // Provide default values when data is missing
  const inventory = inventorySummary || defaultInventory;
  const assets = assetSummary || defaultAssets;
  const alerts = lowStockAlerts || [];

  // Create refresh functions with visual feedback
  const refreshInventory = useCallback(() => {
    if (calculateSummary && items && calculateLowStockAlerts) {
      calculateSummary(items);
      calculateLowStockAlerts(items);
    }
  }, [calculateSummary, calculateLowStockAlerts, items]);

  const refreshAssets = useCallback(() => {
    if (calculateAssetSummary && assetItems) {
      calculateAssetSummary(assetItems);
    }
  }, [calculateAssetSummary, assetItems]);

  // Combined refresh function with visual feedback
  const refreshAllData = useCallback(() => {
    setRefreshing(true);
    
    // Refresh all data sources
    refreshInventory();
    refreshAssets();
    
    // Update last refreshed timestamp
    setLastUpdated(new Date());
    
    // Show toast notification
    toast({
      title: "Dashboard updated",
      description: "All data has been refreshed",
    });
    
    // Reset refreshing state after animation
    setTimeout(() => setRefreshing(false), 600);
  }, [refreshInventory, refreshAssets]);

  // Force refresh data when component mounts and when visibility changes
  useEffect(() => {
    // Refresh data when component mounts
    refreshAllData();
    
    // Also refresh data when user returns to this tab/window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAllData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up periodic refresh (every 30 seconds for real-time updates)
    const refreshInterval = setInterval(() => {
      refreshAllData();
    }, 30000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, [refreshAllData]);

  // Function to format the last updated time
  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString();
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Dashboard"
          description={`Overview of your inventory and assets • Last updated: ${formatLastUpdated()}`}
          actions={
            <div className="flex space-x-2">
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
