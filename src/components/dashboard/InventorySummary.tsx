
import { DashboardCard } from './DashboardCard';
import { InventorySummary as InventorySummaryType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InventorySummaryProps {
  data: InventorySummaryType;
}

export function InventorySummary({ data }: InventorySummaryProps) {
  // Calculate category distribution percentages
  const calculatePercentage = (count: number) => {
    return (count / data.totalItems) * 100;
  };

  // Sort categories by count
  const sortedCategories = [...data.categories].sort((a, b) => b.count - a.count);

  return (
    <DashboardCard 
      title="Inventory Summary" 
      icon={<Package />}
      footer={
        <div className="flex justify-between">
          <span>Total Value:</span>
          <span className="font-medium">{formatCurrency(data.totalValue)}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium">Total Items</p>
            <p className="text-2xl font-bold">{data.totalItems}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-500">{data.lowStockItems}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Categories</h4>
          {sortedCategories.slice(0, 5).map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{category.name}</span>
                <span>{category.count} items</span>
              </div>
              <Progress 
                value={calculatePercentage(category.count)} 
                className="h-1.5" 
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
