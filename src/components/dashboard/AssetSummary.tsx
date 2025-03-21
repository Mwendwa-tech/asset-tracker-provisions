
import { DashboardCard } from './DashboardCard';
import { AssetSummary as AssetSummaryType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AssetSummaryProps {
  data: AssetSummaryType;
}

export function AssetSummary({ data }: AssetSummaryProps) {
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
      footer={
        <div className="flex justify-between">
          <span>Total Value:</span>
          <span className="font-medium">{formatCurrency(data.totalValue)}</span>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-sm font-medium">Total</p>
            <p className="text-2xl font-bold">{data.totalAssets}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Available</p>
            <p className="text-2xl font-bold text-green-500">{data.available}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Checked Out</p>
            <p className="text-2xl font-bold text-blue-500">{data.checkedOut}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status Distribution</h4>
          <div className="flex h-2 overflow-hidden rounded bg-gray-100">
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
          <h4 className="text-sm font-medium">Top Categories</h4>
          {sortedCategories.slice(0, 3).map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{category.name}</span>
                <span>{category.count} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
