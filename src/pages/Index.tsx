
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

const Dashboard = () => {
  // Track loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Use the hooks instead of direct mock data
  const { summary: inventorySummary, lowStockAlerts } = useInventory();
  const { summary: assetSummary } = useAssets();

  // Set loading to false after data is loaded
  useEffect(() => {
    if (inventorySummary && assetSummary) {
      setIsLoading(false);
    }
  }, [inventorySummary, assetSummary]);

  // Show loading state if still loading
  if (isLoading) {
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
            value={inventorySummary.totalItems}
            description="Across all categories"
            icon={<Package />}
            className="bg-blue-50 dark:bg-blue-950"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStockAlerts.length}
            description="Need attention"
            icon={<AlertTriangle />}
            className="bg-amber-50 dark:bg-amber-950"
          />
          <StatCard
            title="Total Assets"
            value={assetSummary.totalAssets}
            description="Available and in use"
            icon={<Briefcase />}
            className="bg-green-50 dark:bg-green-950"
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(inventorySummary.totalValue + assetSummary.totalValue)}
            description="Combined inventory & assets"
            icon={<BarChart3 />}
            className="bg-purple-50 dark:bg-purple-950"
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InventorySummary data={inventorySummary} />
          <AssetSummary data={assetSummary} />
          <LowStockAlerts data={lowStockAlerts} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
