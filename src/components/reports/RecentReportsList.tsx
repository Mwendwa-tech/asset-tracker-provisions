
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentReport } from "@/types/reports";
import { Package, AlertTriangle, Briefcase, TrendingDown, TrendingUp, Calendar } from "lucide-react";

interface RecentReportsListProps {
  reports: RecentReport[];
  onReportClick: (reportType: string, title: string) => void;
}

// Helper to get the appropriate icon based on report type
const getReportIcon = (reportType: string) => {
  switch(reportType) {
    case 'inventory-status':
      return <Package className="h-5 w-5 text-blue-500" />;
    case 'low-stock':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'asset-status':
      return <Briefcase className="h-5 w-5 text-green-500" />;
    case 'consumption-trends':
      return <TrendingDown className="h-5 w-5 text-purple-500" />;
    case 'asset-utilization':
      return <TrendingUp className="h-5 w-5 text-indigo-500" />;
    case 'expiry-tracking':
      return <Calendar className="h-5 w-5 text-red-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

export const RecentReportsList = ({ reports, onReportClick }: RecentReportsListProps) => {
  if (!reports || reports.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {reports.map((report, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
              onClick={() => onReportClick(report.type, report.title)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getReportIcon(report.type)}
                </div>
                <div>
                  <p className="font-medium">{report.title}</p>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
