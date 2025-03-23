
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
  const handleDownload = () => {
    // Simulate download functionality
    toast.success(`Downloaded ${reportTitle}`);
  };

  // Default to a blue color if none is specified
  const reportColor = "#3b82f6";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
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
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
