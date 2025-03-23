
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, PieChart } from "lucide-react";
import { RecentReport } from "@/types/reports";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RecentReportsListProps {
  reports: RecentReport[];
  onReportClick: (reportType: string, reportTitle: string) => void;
}

export const RecentReportsList = ({ reports, onReportClick }: RecentReportsListProps) => {
  // Function to get appropriate icon based on report type
  const getReportIcon = (type: string) => {
    if (!type) return <FileText className="h-5 w-5 text-blue-500" />;
    
    switch (type.toLowerCase()) {
      case 'inventory_value':
      case 'inventory_status':
        return <BarChart3 className="h-5 w-5 text-blue-500" />;
      case 'category_distribution':
        return <PieChart className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleDownload = (reportType: string, reportTitle: string) => {
    onReportClick(reportType, reportTitle);
    toast(`Downloaded "${reportTitle}" report`);
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Reports</CardTitle>
        <CardDescription>
          Reports generated in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="py-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No recent reports found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    {report.icon || getReportIcon(report.type)}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium line-clamp-1", 
                      report.title.length > 30 ? "text-sm" : ""
                    )}>
                      {report.title}
                    </p>
                    <p className="text-sm text-muted-foreground">Generated on {report.date}</p>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 rounded-full p-0"
                        onClick={() => handleDownload(report.type, report.title)}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download {report.title}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Download report</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
