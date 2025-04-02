
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Printer, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ReceiptViewerProps {
  receipt: Receipt;
  onPrint: () => void;
  onDownload: () => void;
}

export function ReceiptViewer({ receipt, onPrint, onDownload }: ReceiptViewerProps) {
  // Generate a reference number based on date and receipt ID
  const referenceNumber = `LG-${new Date(receipt.issueDate).getFullYear()}-${receipt.id.slice(0, 8).toUpperCase()}`;
  const printRef = useRef<HTMLDivElement>(null);
  
  // Custom print handler
  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current;
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Pop-up blocked! Please allow pop-ups for this site.');
        return;
      }
      
      // Add print-specific styles
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${receipt.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt-container { max-width: 800px; margin: 0 auto; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .header { text-align: center; margin-bottom: 20px; }
              .footer { margin-top: 20px; text-align: center; font-size: 0.8em; }
              .details { margin: 20px 0; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              ${content.innerHTML}
            </div>
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      onPrint();
    }
  };
  
  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto p-2" ref={printRef}>
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold">Lukenya Getaway</h2>
        <p className="text-sm">Five Star Elegance</p>
        <div className="mt-4">
          <h3 className="font-semibold">Issue Receipt</h3>
          <p className="text-sm text-muted-foreground">Receipt #{receipt.id}</p>
          <p className="text-sm text-muted-foreground">Reference: {referenceNumber}</p>
          <p className="text-sm text-muted-foreground">Date: {formatDate(receipt.issueDate)}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Requested By</p>
            <p className="font-medium">{receipt.requestedBy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Approved By</p>
            <p className="font-medium">{receipt.approvedBy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Issued By</p>
            <p className="font-medium">{receipt.issuedBy}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Department</p>
          <p className="font-medium">{receipt.department || 'N/A'}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
        <div className="border rounded-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {receipt.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium">{item.name}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm capitalize">{item.type}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {item.quantity || 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {receipt.notes && (
        <div>
          <p className="text-sm font-medium text-muted-foreground">Notes</p>
          <p className="text-sm">{receipt.notes}</p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t">
        <div className="mb-2 sm:mb-0 w-full sm:w-auto">
          <p className="text-sm text-muted-foreground">Ref: {referenceNumber}</p>
          <p className="text-xs text-muted-foreground">This receipt serves as an official document for auditing purposes.</p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2 w-full sm:w-auto">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button onClick={onDownload} className="flex items-center gap-2 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
      
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>This is an automatically generated receipt.</p>
        <p>Lukenya Getaway - Official Document</p>
      </div>
    </div>
  );
}
