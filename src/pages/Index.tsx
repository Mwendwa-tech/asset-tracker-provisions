
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { InventorySummary } from '@/components/dashboard/InventorySummary';
import { AssetSummary } from '@/components/dashboard/AssetSummary';
import { LowStockAlerts } from '@/components/dashboard/LowStockAlert';
import { formatCurrency } from '@/utils/formatters';
import { Package, Briefcase, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';
import { useAssets } from '@/hooks/useAssets';
import { useEffect, useState, useCallback } from 'react';

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
    assets 
  } = useAssets();
  
  // Provide default values when data is missing
  const inventory = inventorySummary || defaultInventory;
  const assets = assetSummary || defaultAssets;
  const alerts = lowStockAlerts || [];

  // Create refresh functions
  const refreshInventory = useCallback(() => {
    if (calculateSummary && items && calculateLowStockAlerts) {
      calculateSummary(items);
      calculateLowStockAlerts(items);
    }
  }, [calculateSummary, calculateLowStockAlerts, items]);

  const refreshAssets = useCallback(() => {
    if (calculateAssetSummary && assets) {
      calculateAssetSummary(assets);
    }
  }, [calculateAssetSummary, assets]);

  // Force refresh data when component mounts and when visibility changes
  useEffect(() => {
    // Refresh data when component mounts
    refreshInventory();
    refreshAssets();
    
    // Also refresh data when user returns to this tab/window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshInventory();
        refreshAssets();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up periodic refresh (every 60 seconds)
    const refreshInterval = setInterval(() => {
      refreshInventory();
      refreshAssets();
    }, 60000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshInterval);
    };
  }, [refreshInventory, refreshAssets]);

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Dashboard"
          description="Overview of your inventory and assets"
          actions={
            <Button asChild>
              <Link to="/reports">Generate Report</Link>
            </Button>
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
