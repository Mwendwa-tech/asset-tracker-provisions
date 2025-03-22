
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
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell 
} from '@/components/ui/table';

const Reports = () => {
  const { toast } = useToast();
  const { items } = useInventory();
  const { assets } = useAssets();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [currentReportType, setCurrentReportType] = useState('');
  
  const reportTypes = [
    {
      id: 'inventory-status',
      title: 'Inventory Status Report',
      description: 'Overview of current inventory levels',
      icon: <Package className="h-8 w-8 text-blue-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'low-stock',
      title: 'Low Stock Report',
      description: 'Items below minimum stock levels',
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'asset-status',
      title: 'Asset Status Report',
      description: 'Current status of all assets',
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'consumption-trends',
      title: 'Usage Report',
      description: 'How inventory is being used',
      icon: <TrendingDown className="h-8 w-8 text-purple-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'asset-utilization',
      title: 'Asset Usage',
      description: 'How frequently assets are used',
      icon: <TrendingUp className="h-8 w-8 text-indigo-500" />,
      actions: ['Generate', 'Schedule'],
    },
    {
      id: 'expiry-tracking',
      title: 'Expiry Report',
      description: 'Items approaching expiration',
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

  // Get report title with description for better context
  const getReportContext = (reportType: string) => {
    switch(reportType) {
      case 'inventory-status':
        return {
          title: "Inventory Status",
          description: "Current quantities of items in stock",
          valueLabel: "Quantity in stock"
        };
      case 'low-stock':
        return {
          title: "Low Stock Items",
          description: "Items below recommended stock levels",
          valueLabel: "Current quantity"
        };
      case 'asset-status':
        return {
          title: "Asset Availability",
          description: "Current status of assets",
          valueLabel: "Status (1=Available, 0=Unavailable)"
        };
      case 'consumption-trends':
        return {
          title: "Usage Trends",
          description: "Quantity of items used recently",
          valueLabel: "Units used"
        };
      case 'asset-utilization':
        return {
          title: "Asset Usage Rate",
          description: "How frequently assets are being used",
          valueLabel: "Usage percentage"
        };
      case 'expiry-tracking':
        return {
          title: "Expiring Items",
          description: "Items approaching expiration date",
          valueLabel: "Days until expiry"
        };
      default:
        return {
          title: "Report",
          description: "Generated report data",
          valueLabel: "Value"
        };
    }
  };

  // Generate data for reports based on inventory and assets
  const getReportData = (reportType: string) => {
    // Ensure we have data before trying to use it
    if (!items || !assets) {
      return [];
    }
    
    switch(reportType) {
      case 'inventory-status':
        return items.slice(0, 5).map(item => ({
          name: item.name,
          value: item.quantity,
          detail: `${item.category}`
        }));
      case 'low-stock':
        return items
          .filter(item => item.quantity < 10)
          .slice(0, 5)
          .map(item => ({
            name: item.name,
            value: item.quantity,
            detail: `Min: ${item.minStockLevel}`
          }));
      case 'asset-status':
        return assets.slice(0, 5).map(asset => ({
          name: asset.name,
          value: asset.status === 'available' ? 1 : 0,
          detail: asset.status
        }));
      case 'consumption-trends':
        return items.slice(0, 5).map(item => ({
          name: item.name,
          value: Math.floor(Math.random() * 50) + 10,
          detail: `${item.unit}`
        }));
      case 'asset-utilization':
        return assets.slice(0, 5).map(asset => ({
          name: asset.name,
          value: Math.floor(Math.random() * 80) + 20,
          detail: `${asset.category}`
        }));
      case 'expiry-tracking':
        return items
          .filter(item => item.expiryDate)
          .slice(0, 5)
          .map(item => ({
            name: item.name,
            value: item.expiryDate ? 
              Math.floor((new Date(item.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
              0,
            detail: item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'
          }));
      default:
        return [];
    }
  };

  // Get report colors based on type
  const getReportColor = (reportType: string) => {
    switch(reportType) {
      case 'inventory-status': return "#3b82f6"; // blue
      case 'low-stock': return "#f59e0b"; // amber 
      case 'asset-status': return "#10b981"; // green
      case 'consumption-trends': return "#8b5cf6"; // purple
      case 'asset-utilization': return "#6366f1"; // indigo
      case 'expiry-tracking': return "#ef4444"; // red
      default: return "#3b82f6"; // blue
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
              {getReportContext(currentReportType).title}
            </DialogTitle>
            <DialogDescription>
              {getReportContext(currentReportType).description} - Generated on {new Date().toLocaleDateString()}
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
                    <YAxis label={{ value: getReportContext(currentReportType).valueLabel, angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value}`, getReportContext(currentReportType).valueLabel]} />
                    <Bar dataKey="value" fill={getReportColor(currentReportType)} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="table">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>{getReportContext(currentReportType).valueLabel}</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getReportData(currentReportType).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.value}</TableCell>
                          <TableCell>{item.detail}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
