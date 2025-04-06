
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
import { useState, useEffect } from 'react';

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
  const [isReady, setIsReady] = useState(false);
  
  // Use the hooks to get data
  const { summary: inventorySummary, lowStockAlerts } = useInventory();
  const { summary: assetSummary } = useAssets();
  
  // Set loading state without setTimeout to avoid unnecessary delays
  useEffect(() => {
    // We can assume data is ready since the hooks load immediately now
    setIsReady(true);
  }, []);

  // Provide default values when data is missing
  const inventory = inventorySummary || defaultInventory;
  const assets = assetSummary || defaultAssets;
  const alerts = lowStockAlerts || [];

  // Show simplified loading state if still loading
  if (!isReady) {
    return (
      <MainLayout>
        <div className="flex h-full w-full items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

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
