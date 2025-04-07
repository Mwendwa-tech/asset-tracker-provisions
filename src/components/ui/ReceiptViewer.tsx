
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Receipt } from '@/types';
import { formatDate } from '@/utils/formatters';
import { Printer, FileText, Download, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ReceiptViewerProps {
  receipt: Receipt;
  onPrint: () => void;
  onDownload: () => void;
}

export function ReceiptViewer({ receipt, onPrint, onDownload }: ReceiptViewerProps) {
  // Generate a reference number based on date and receipt ID
  const referenceNumber = receipt.receiptNumber || `LG-${new Date(receipt.issueDate).getFullYear()}-${receipt.id.slice(0, 8).toUpperCase()}`;
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
      
      // Add print-specific styles with enhanced formatting
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt #${receipt.id}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;500;700&display=swap');
              body { 
                font-family: 'Montserrat', sans-serif; 
                padding: 20px; 
                color: #333;
                line-height: 1.6;
              }
              .receipt-container { 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 30px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
              }
              .receipt-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #f0f0f0;
              }
              .hotel-name {
                font-family: 'Playfair Display', serif;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                color: #1a365d;
              }
              .hotel-tagline {
                font-style: italic;
                color: #718096;
                margin: 5px 0 15px;
              }
              .receipt-title {
                font-size: 20px;
                font-weight: 700;
                margin: 15px 0 5px;
              }
              .receipt-number {
                font-family: 'Montserrat', sans-serif;
                font-weight: 500;
              }
              .reference-number {
                display: inline-block;
                padding: 6px 12px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 4px;
                font-weight: 500;
                margin: 10px 0;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin: 25px 0;
              }
              th, td { 
                border: 1px solid #e2e8f0; 
                padding: 12px; 
                text-align: left; 
              }
              th { 
                background-color: #f8fafc; 
                font-weight: 600;
                color: #4a5568;
              }
              .header-section {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
              }
              .participants {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 20px;
                margin: 25px 0;
              }
              .participant-box {
                padding: 15px;
                background: #f9fafb;
                border-radius: 6px;
              }
              .participant-title {
                font-size: 14px;
                font-weight: 500;
                color: #718096;
                margin-bottom: 5px;
              }
              .participant-name {
                font-weight: 600;
                font-size: 16px;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 14px;
                color: #718096;
                border-top: 1px solid #e2e8f0;
                padding-top: 20px;
              }
              .logo {
                font-size: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 10px;
              }
              .logo svg {
                margin-right: 10px;
              }
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 50px;
              }
              .signature {
                text-align: center;
                width: 30%;
              }
              .signature-line {
                border-top: 1px solid #718096;
                margin: 40px 0 10px;
              }
              .signature-title {
                font-size: 14px;
                color: #718096;
              }
              @media print {
                button { display: none; }
                body { margin: 0; padding: 0; }
                .receipt-container { box-shadow: none; border: none; }
              }
            </style>
          </head>
          <body>
            <div class="receipt-container">
              <div class="receipt-header">
                <div class="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a365d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path>
                  </svg>
                  LUKENYA GETAWAY
                </div>
                <p class="hotel-tagline">Five Star Elegance</p>
                <h1 class="receipt-title">INVENTORY ISSUE RECEIPT</h1>
                <p class="receipt-number">Receipt #: ${receipt.id}</p>
                <p>Date: ${formatDate(receipt.issueDate)}</p>
                <div class="reference-number">${referenceNumber}</div>
              </div>
              
              <div class="participants">
                <div class="participant-box">
                  <p class="participant-title">REQUESTED BY</p>
                  <p class="participant-name">${receipt.requestedBy}</p>
                </div>
                <div class="participant-box">
                  <p class="participant-title">APPROVED BY</p>
                  <p class="participant-name">${receipt.approvedBy}</p>
                </div>
                <div class="participant-box">
                  <p class="participant-title">ISSUED BY</p>
                  <p class="participant-name">${receipt.issuedBy}</p>
                </div>
              </div>
              
              <div>
                <p class="participant-title">DEPARTMENT</p>
                <p class="participant-name">${receipt.department || 'N/A'}</p>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>ITEM</th>
                    <th>TYPE</th>
                    <th>QUANTITY</th>
                  </tr>
                </thead>
                <tbody>
                  ${receipt.items.map(item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.type}</td>
                      <td>${item.quantity || 1}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              ${receipt.notes ? `<div>
                <p class="participant-title">NOTES</p>
                <p>${receipt.notes}</p>
              </div>` : ''}
              
              <div class="signatures">
                <div class="signature">
                  <div class="signature-line"></div>
                  <p class="signature-title">Requester Signature</p>
                </div>
                <div class="signature">
                  <div class="signature-line"></div>
                  <p class="signature-title">Store Keeper Signature</p>
                </div>
                <div class="signature">
                  <div class="signature-line"></div>
                  <p class="signature-title">Authorized Signature</p>
                </div>
              </div>
              
              <div class="footer">
                <p>This is an official receipt of Lukenya Getaway.</p>
                <p>For any inquiries, please contact the Inventory Department.</p>
                <p><strong>Reference: ${referenceNumber}</strong></p>
              </div>
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
  
  // Format the current date
  const formattedDate = formatDate(receipt.issueDate);
  
  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm" ref={printRef}>
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center text-xl font-bold text-blue-900 dark:text-blue-300 mb-1">
          <Globe className="mr-2 h-5 w-5" />
          LUKENYA GETAWAY
        </div>
        <p className="text-sm italic text-muted-foreground">Five Star Elegance</p>
        <div className="mt-6">
          <h3 className="font-bold text-lg uppercase tracking-wide">Inventory Issue Receipt</h3>
          <p className="text-sm text-muted-foreground mt-2">Receipt #{receipt.id}</p>
          <div className="inline-block px-3 py-1 mt-2 bg-gray-50 dark:bg-gray-800 rounded border text-sm font-medium">
            Ref: {referenceNumber}
          </div>
          <p className="text-sm text-muted-foreground mt-2">{formattedDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-md">
          <p className="text-xs font-medium text-blue-500 dark:text-blue-400 uppercase tracking-wide">Requested By</p>
          <p className="font-medium text-lg">{receipt.requestedBy}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-md">
          <p className="text-xs font-medium text-green-500 dark:text-green-400 uppercase tracking-wide">Approved By</p>
          <p className="font-medium text-lg">{receipt.approvedBy}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-md">
          <p className="text-xs font-medium text-purple-500 dark:text-purple-400 uppercase tracking-wide">Issued By</p>
          <p className="font-medium text-lg">{receipt.issuedBy}</p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md mb-6">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Department</p>
        <p className="font-medium text-lg">{receipt.department || 'N/A'}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">Items</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {receipt.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm capitalize">{item.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {item.quantity || 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {receipt.notes && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md mt-6">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Notes</p>
          <p className="text-sm mt-2">{receipt.notes}</p>
        </div>
      )}
      
      <Separator className="my-6" />
      
      <div className="flex flex-col sm:flex-row justify-between items-center pt-2">
        <div className="mb-4 sm:mb-0 w-full sm:w-auto">
          <div className="inline-flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
            <FileText className="h-3.5 w-3.5 mr-1" />
            {referenceNumber}
          </div>
          <p className="text-xs text-muted-foreground mt-2">This receipt serves as an official document for auditing purposes.</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
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
      
      <div className="text-center text-xs text-muted-foreground pt-4 border-t mt-6">
        <p className="mb-1">This is an automatically generated receipt.</p>
        <p className="font-medium">Lukenya Getaway - Official Document</p>
      </div>
    </div>
  );
}
