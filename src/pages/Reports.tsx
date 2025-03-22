
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
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
import { ChartContainer } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInventory } from '@/hooks/useInventory';
import { useAssets } from '@/hooks/useAssets';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const { toast } = useToast();
  const { inventory } = useInventory();
  const { assets } = useAssets();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [currentReportType, setCurrentReportType] = useState('');
  
  const reportTypes = [
    {
      id: 'inventory-status',
      title: 'Inventory Status Report',
      description: 'Complete overview of current inventory levels, values, and statuses',
      icon: <Package className="h-8 w-8 text-blue-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'low-stock',
      title: 'Low Stock Report',
      description: 'List of all items that are below or approaching minimum stock levels',
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'asset-status',
      title: 'Asset Status Report',
      description: 'Status and location of all assets, including checked out items',
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'consumption-trends',
      title: 'Consumption Trends',
      description: 'Analysis of inventory usage patterns over time',
      icon: <TrendingDown className="h-8 w-8 text-purple-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'asset-utilization',
      title: 'Asset Utilization',
      description: 'Frequency and duration of asset checkouts',
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'expiry-tracking',
      title: 'Expiry Tracking',
      description: 'List of items approaching their expiration dates',
      icon: <Calendar className="h-8 w-8 text-red-500" />,
      actions: ['Generate', 'Schedule'],
    },
  ];

  const recentReports = [
    {
      type: 'inventory-status',
      title: 'Inventory Status Report',
      date: 'Aug 10, 2023',
      icon: <Package className="h-5 w-5 text-blue-500" />
    },
    {
      type: 'low-stock',
      title: 'Low Stock Report',
      date: 'Aug 8, 2023',
      icon: <AlertTriangle className="h-5 w-5 text-amber-500" />
    },
    {
      type: 'asset-status',
      title: 'Asset Status Report',
      date: 'Aug 5, 2023',
      icon: <Briefcase className="h-5 w-5 text-green-500" />
    }
  ];

  const handleGenerateReport = (reportId: string, reportTitle: string) => {
    setIsGenerating(true);
    setCurrentReportType(reportId);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowReportDialog(true);
      toast({
        title: "Report Generated",
        description: `${reportTitle} has been generated successfully`,
        variant: "default",
      });
    }, 1000);
  };

  const handleScheduleReport = (reportId: string) => {
    toast({
      title: "Report Scheduled",
      description: "The report will be generated automatically on a weekly basis",
      variant: "default",
    });
  };

  const handleDownloadReport = (reportType: string) => {
    toast({
      title: "Report Downloaded",
      description: "Your report has been downloaded successfully",
      variant: "default",
    });
  };

  // Generate mock data for reports based on inventory and assets
  const getReportData = (reportType: string) => {
    switch(reportType) {
      case 'inventory-status':
        return inventory.slice(0, 5).map(item => ({
          name: item.name,
          value: item.quantity,
          category: item.category
        }));
      case 'low-stock':
        return inventory
          .filter(item => item.quantity < 10)
          .slice(0, 5)
          .map(item => ({
            name: item.name,
            value: item.quantity,
            threshold: 10
          }));
      case 'asset-status':
        return assets.slice(0, 5).map(asset => ({
          name: asset.name,
          value: asset.status === 'Available' ? 1 : 0,
          status: asset.status
        }));
      case 'consumption-trends':
        return inventory.slice(0, 5).map(item => ({
          name: item.name,
          value: Math.floor(Math.random() * 50) + 10
        }));
      case 'asset-utilization':
        return assets.slice(0, 5).map(asset => ({
          name: asset.name,
          value: Math.floor(Math.random() * 80) + 20
        }));
      case 'expiry-tracking':
        return inventory.slice(0, 5).map(item => ({
          name: item.name,
          value: Math.floor(Math.random() * 30) + 1
        }));
      default:
        return [];
    }
  };

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleScheduleReport(report.id)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleGenerateReport(report.id, report.title)}
                  disabled={isGenerating}
                >
                  {isGenerating && report.id === currentReportType ? (
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
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
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      {report.icon}
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">Generated on {report.date}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.type)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {reportTypes.find(r => r.id === currentReportType)?.title || 'Report'}
            </DialogTitle>
            <DialogDescription>
              Generated on {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getReportData(currentReportType)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="table">
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Value</th>
                        <th className="p-2 text-left">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getReportData(currentReportType).map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.value}</td>
                          <td className="p-2">
                            {item.category || item.status || item.threshold || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowReportDialog(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => handleDownloadReport(currentReportType)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Reports;
