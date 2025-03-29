
import { DashboardCard } from './DashboardCard';
import { InventorySummary as InventorySummaryType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Package, ArrowUpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface InventorySummaryProps {
  data: InventorySummaryType;
}

export function InventorySummary({ data }: InventorySummaryProps) {
  const navigate = useNavigate();
  
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
      elevated
      footer={
        <div className="flex justify-between items-center">
          <span>Total Value:</span>
          <span className="font-medium">{formatCurrency(data.totalValue)}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">{data.totalItems}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Low Stock Items</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{data.lowStockItems}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex justify-between">
            <span>Categories</span>
            <span className="text-muted-foreground">{data.categories.length} total</span>
          </h4>
          {sortedCategories.slice(0, 5).map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{category.name}</span>
                <span className="text-muted-foreground">{category.count} items</span>
              </div>
              <Progress 
                value={calculatePercentage(category.count)} 
                className="h-1.5" 
              />
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate('/inventory')}
        >
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          View Inventory
        </Button>
      </div>
    </DashboardCard>
  );
}
