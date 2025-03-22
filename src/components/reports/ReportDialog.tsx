
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

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: string;
  reportData: ReportData[];
  reportContext: ReportContextType;
  onDownload: (reportType: string) => void;
  reportColor: string;
}

export const ReportDialog = ({
  open,
  onOpenChange,
  reportType,
  reportData,
  reportContext,
  onDownload,
  reportColor
}: ReportDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {reportContext.title}
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
                data={reportData}
                reportType={reportType}
                reportContext={reportContext}
                color={reportColor}
              />
            </TabsContent>
            
            <TabsContent value="table">
              <ReportTableView
                data={reportData}
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
            onClick={() => onDownload(reportType)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
