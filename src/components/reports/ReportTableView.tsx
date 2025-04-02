
import { 
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell 
} from "@/components/ui/table";
import { ReportData, ReportContextType } from "@/types/reports";

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

  return (
    <div className="border rounded-md overflow-hidden">
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
  );
};
