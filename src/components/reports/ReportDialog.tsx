
import { Download } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ReportChartView } from "./ReportChartView";
import { ReportTableView } from "./ReportTableView";
import { ReportData, ReportContextType } from "@/types/reports";
import { toast } from "sonner";
import { getReportColor } from "./ReportUtils";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
  reportTitle: string;
  reportId: string;
  reportContext: ReportContextType;
  data: ReportData[];
}

export const ReportDialog = ({
  open,
  onOpenChange,
  reportType,
  reportTitle,
  reportId,
  reportContext,
  data
}: ReportDialogProps) => {
  // State for download status
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // Generate CSV data
      const csvContent = generateCSV(data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create a hidden link and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloaded ${reportTitle}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download report");
    } finally {
      setDownloading(false);
    }
  };

  // Helper function to generate CSV content
  const generateCSV = (data: ReportData[]): string => {
    // Create header row based on the data structure
    const headers = ["Name", "Value", "Details"];
    
    // Create CSV content
    const csvRows = [
      headers.join(','),
      ...data.map(item => {
        const sanitizedName = `"${item.name.replace(/"/g, '""')}"`;
        const sanitizedValue = typeof item.value === 'string' 
          ? `"${item.value.replace(/"/g, '""')}"` 
          : item.value;
        const sanitizedDetail = `"${item.detail.replace(/"/g, '""')}"`;
        return `${sanitizedName},${sanitizedValue},${sanitizedDetail}`;
      })
    ];
    
    return csvRows.join('\n');
  };

  // Get the color from the utility function
  const reportColor = getReportColor(reportType);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <ScrollArea className="max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              {reportTitle || reportContext.title}
            </DialogTitle>
            <DialogDescription>
              {reportContext.description} - Generated on {new Date().toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Tabs defaultValue="chart">
              <TabsList className="mb-4">
                <TabsTrigger value="chart">Chart View</TabsTrigger>
                <TabsTrigger value="table">Table View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="h-80">
                <ReportChartView 
                  data={data}
                  reportType={reportType}
                  reportContext={reportContext}
                  color={reportColor}
                />
              </TabsContent>
              
              <TabsContent value="table">
                <ReportTableView
                  data={data}
                  reportType={reportType}
                  reportContext={reportContext}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              onClick={handleDownload}
              disabled={downloading || data.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading ? 'Downloading...' : 'Download Report'}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
