
import { DashboardCard } from './DashboardCard';
import { AssetSummary as AssetSummaryType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Briefcase, ArrowUpCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AssetSummaryProps {
  data: AssetSummaryType;
}

export function AssetSummary({ data }: AssetSummaryProps) {
  const navigate = useNavigate();
  
  // Format status percentages
  const getStatusPercentage = (status: 'available' | 'checkedOut' | 'maintenance') => {
    const total = data.totalAssets;
    if (total === 0) return 0;
    
    const count = status === 'available' 
      ? data.available 
      : status === 'checkedOut' 
        ? data.checkedOut 
        : data.maintenance;
        
    return (count / total) * 100;
  };

  // Sort categories by count
  const sortedCategories = [...data.categories].sort((a, b) => b.count - a.count);

  return (
    <DashboardCard 
      title="Asset Summary" 
      icon={<Briefcase />}
      elevated
      footer={
        <div className="flex justify-between items-center">
          <span>Total Value:</span>
          <span className="font-medium">{formatCurrency(data.totalValue)}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{data.totalAssets}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Available</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.available}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Checked Out</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.checkedOut}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status Distribution</h4>
          <div className="flex h-2 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
            <div 
              className="bg-green-500" 
              style={{ width: `${getStatusPercentage('available')}%` }}
            />
            <div 
              className="bg-blue-500" 
              style={{ width: `${getStatusPercentage('checkedOut')}%` }}
            />
            <div 
              className="bg-amber-500" 
              style={{ width: `${getStatusPercentage('maintenance')}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <div className="flex items-center">
              <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1 h-2 w-2 rounded-full bg-blue-500" />
              <span>Checked Out</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1 h-2 w-2 rounded-full bg-amber-500" />
              <span>Maintenance</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex justify-between">
            <span>Top Categories</span>
            <span className="text-muted-foreground">{data.categories.length} total</span>
          </h4>
          {sortedCategories.slice(0, 3).map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{category.name}</span>
                <span className="text-muted-foreground">{category.count} items</span>
              </div>
              <Progress 
                value={(category.count / data.totalAssets) * 100} 
                className="h-1.5" 
              />
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => navigate('/assets')}
        >
          <ArrowUpCircle className="mr-2 h-4 w-4" />
          View Assets
        </Button>
      </div>
    </DashboardCard>
  );
}
