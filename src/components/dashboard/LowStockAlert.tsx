
import { DashboardCard } from './DashboardCard';
import { AlertTriangle } from 'lucide-react';
import { LowStockAlert as LowStockAlertType } from '@/types';
import { formatQuantity } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface LowStockAlertsProps {
  data: LowStockAlertType[];
}

export function LowStockAlerts({ data }: LowStockAlertsProps) {
  // Sort alerts by most critical (lowest stock relative to minimum)
  const sortedAlerts = [...data].sort((a, b) => {
    const aRatio = a.currentStock / a.minStockLevel;
    const bRatio = b.currentStock / b.minStockLevel;
    return aRatio - bRatio;
  });

  return (
    <DashboardCard 
      title="Low Stock Alerts" 
      icon={<AlertTriangle className="text-amber-500" />}
      footer={
        <div className="text-center">
          <Link to="/inventory">
            <Button variant="link" size="sm" className="h-auto p-0">
              View all inventory
            </Button>
          </Link>
        </div>
      }
    >
      {data.length === 0 ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          No low stock items
        </div>
      ) : (
        <div className="space-y-2">
          {sortedAlerts.slice(0, 5).map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div>
                <p className="text-sm font-medium">{alert.name}</p>
                <p className="text-xs text-muted-foreground">{alert.category}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  alert.currentStock <= alert.minStockLevel * 0.5 
                    ? 'text-red-600' 
                    : 'text-amber-600'
                }`}>
                  {formatQuantity(alert.currentStock, alert.unit)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Min: {formatQuantity(alert.minStockLevel, alert.unit)}
                </p>
              </div>
            </div>
          ))}

          {data.length > 5 && (
            <p className="text-center text-xs text-muted-foreground">
              +{data.length - 5} more items with low stock
            </p>
          )}
        </div>
      )}
    </DashboardCard>
  );
}
