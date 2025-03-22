
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface RecentReport {
  type: string;
  title: string;
  date: string;
  icon: React.ReactNode;
}

interface RecentReportsListProps {
  reports: RecentReport[];
  onDownload: (reportType: string) => void;
}

export const RecentReportsList = ({ reports, onDownload }: RecentReportsListProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Reports</CardTitle>
        <CardDescription>
          Reports generated in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report, index) => (
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
                onClick={() => onDownload(report.type)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
