
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReportData, ReportContextType } from "@/types/reports";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ReportTableViewProps {
  data: ReportData[];
  reportType: string;
  reportContext: ReportContextType;
}

export const ReportTableView = ({
  data,
  reportType,
  reportContext
}: ReportTableViewProps) => {
  // Color function for table cells based on data
  const getCellColor = (reportType: string, value: number | string) => {
    if (reportType === 'low-stock') {
      return typeof value === 'number' && value <= 5 ? 'text-red-600 font-medium' : 'text-amber-600';
    }
    if (reportType === 'expiry-tracking') {
      if (typeof value !== 'number') return '';
      if (value <= 0) return 'text-red-600 font-medium';
      if (value <= 7) return 'text-amber-600 font-medium';
      if (value <= 14) return 'text-amber-500';
      return 'text-green-600';
    }
    return '';
  };

  // Function to download the table data as CSV
  const downloadCSV = () => {
    // Create header row
    const headers = ["Item Name", reportContext.valueLabel, "Details"];
    
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
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a hidden link and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportContext.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Report downloaded successfully");
  };

  return (
    <div className="border rounded-md">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-medium">{reportContext.title} Table</h3>
        <Button size="sm" variant="outline" onClick={downloadCSV}>
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>{reportContext.valueLabel}</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className={getCellColor(reportType, item.value)}>
                  {item.value}
                </TableCell>
                <TableCell>{item.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
