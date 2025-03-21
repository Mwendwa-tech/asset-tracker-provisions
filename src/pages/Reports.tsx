
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart,
  FileText, 
  Download,
  Calendar,
  Package,
  Briefcase,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    {
      title: 'Inventory Status Report',
      description: 'Complete overview of current inventory levels, values, and statuses',
      icon: <Package className="h-8 w-8 text-blue-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      title: 'Low Stock Report',
      description: 'List of all items that are below or approaching minimum stock levels',
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      title: 'Asset Status Report',
      description: 'Status and location of all assets, including checked out items',
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      title: 'Consumption Trends',
      description: 'Analysis of inventory usage patterns over time',
      icon: <TrendingDown className="h-8 w-8 text-purple-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      title: 'Asset Utilization',
      description: 'Frequency and duration of asset checkouts',
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      title: 'Expiry Tracking',
      description: 'List of items approaching their expiration dates',
      icon: <Calendar className="h-8 w-8 text-red-500" />,
      actions: ['Generate', 'Schedule'],
    },
  ];

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Reports"
          description="Generate and schedule inventory and asset reports"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reportTypes.map((report, index) => (
            <Card 
              key={index}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  {report.icon}
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="mt-4 text-xl">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-4">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Recent Reports</h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Reports</CardTitle>
              <CardDescription>
                Reports generated in the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Inventory Status Report</p>
                      <p className="text-sm text-muted-foreground">Generated on Aug 10, 2023</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Low Stock Report</p>
                      <p className="text-sm text-muted-foreground">Generated on Aug 8, 2023</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Asset Status Report</p>
                      <p className="text-sm text-muted-foreground">Generated on Aug 5, 2023</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
