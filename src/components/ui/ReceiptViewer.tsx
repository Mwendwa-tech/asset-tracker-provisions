
import React from 'react';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Printer, FileText } from 'lucide-react';

interface ReceiptViewerProps {
  receipt: Receipt;
  onPrint: () => void;
  onDownload: () => void;
}

export function ReceiptViewer({ receipt, onPrint, onDownload }: ReceiptViewerProps) {
  return (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-xl font-bold">Issue Receipt</h2>
        <p className="text-sm text-muted-foreground">Receipt #{receipt.id}</p>
        <p className="text-sm text-muted-foreground">Date: {formatDate(receipt.issueDate)}</p>
      </div>
      
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-4">
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
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
        <div className="border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-gray-200">
              {receipt.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm capitalize">{item.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onPrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button onClick={onDownload} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Download
        </Button>
      </div>
      
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>This is an automatically generated receipt.</p>
      </div>
    </div>
  );
}
