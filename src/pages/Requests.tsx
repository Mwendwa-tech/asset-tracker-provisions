import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
  FileText,
  AlertCircle,
  Store,
  ArrowDown
} from 'lucide-react';
import { useRequests } from '@/hooks/useRequests';
import { RequestItem, Receipt } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestApprovalForm } from '@/components/forms/RequestApprovalForm';
import { RequestFulfillmentForm } from '@/components/forms/RequestFulfillmentForm';
import { ReceiptViewer } from '@/components/ui/ReceiptViewer';

const Requests = () => {
  const { 
    requests, 
    receipts,
    loading, 
    approveRequest,
    rejectRequest,
    fulfillRequest,
    generateReceipt
  } = useRequests();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'approve' | 'fulfill' | 'receipt'>('view');

  const handleRequestClick = (request: RequestItem) => {
    setSelectedRequest(request);
    setDialogMode('view');
    setDialogOpen(true);
  };

  const handleReceiptClick = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setDialogMode('receipt');
    setDialogOpen(true);
  };

  const handleApproveClick = (request: RequestItem) => {
    setSelectedRequest(request);
    setDialogMode('approve');
    setDialogOpen(true);
  };

  const handleFulfillClick = (request: RequestItem) => {
    setSelectedRequest(request);
    setDialogMode('fulfill');
    setDialogOpen(true);
  };

  const handleApproveRequest = (approverName: string) => {
    if (selectedRequest) {
      approveRequest(selectedRequest.id, approverName);
      setDialogOpen(false);
    }
  };

  const handleRejectRequest = (approverName: string, reason: string) => {
    if (selectedRequest) {
      rejectRequest(selectedRequest.id, approverName, reason);
      setDialogOpen(false);
    }
  };

  const handleFulfillRequest = (fulfillerName: string, notes?: string) => {
    if (selectedRequest) {
      fulfillRequest(selectedRequest.id, fulfillerName, notes);
      setDialogOpen(false);
    }
  };

  const handlePrintReceipt = () => {
    if (selectedReceipt) {
      const receiptUrl = generateReceipt(selectedReceipt.id);
      const printWindow = window.open(receiptUrl, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleDownloadReceipt = () => {
    if (selectedReceipt) {
      const receiptUrl = generateReceipt(selectedReceipt.id);
      
      const link = document.createElement('a');
      link.href = receiptUrl;
      link.download = `receipt-${selectedReceipt.id}.html`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'fulfilled':
        return <Badge className="bg-green-100 text-green-800">Fulfilled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const requestColumns = [
    {
      header: "Item",
      accessorKey: "itemName" as keyof RequestItem,
      cell: (item: RequestItem) => (
        <div>
          <div className="font-medium">{item.itemName}</div>
          <div className="text-xs text-muted-foreground capitalize">{item.itemType}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Quantity",
      accessorKey: "quantity" as keyof RequestItem,
      cell: (item: RequestItem) => (
        <div>{item.quantity || 'N/A'}</div>
      ),
      sortable: true,
    },
    {
      header: "Requested By",
      accessorKey: "requestedBy" as keyof RequestItem,
      sortable: true,
    },
    {
      header: "Date",
      accessorKey: "requestDate" as keyof RequestItem,
      cell: (item: RequestItem) => formatDate(item.requestDate),
      sortable: true,
    },
    {
      header: "Status",
      accessorKey: "status" as keyof RequestItem,
      cell: (item: RequestItem) => getStatusBadge(item.status),
      sortable: true,
    },
  ];

  const receiptColumns = [
    {
      header: "Items",
      accessorKey: "items" as keyof Receipt,
      cell: (receipt: Receipt) => (
        <div>
          {receipt.items.map((item, idx) => (
            <div key={idx} className="font-medium">
              {item.name} ({item.quantity || 1})
            </div>
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      header: "Requested By",
      accessorKey: "requestedBy" as keyof Receipt,
      sortable: true,
    },
    {
      header: "Issued By",
      accessorKey: "issuedBy" as keyof Receipt,
      sortable: true,
    },
    {
      header: "Date",
      accessorKey: "issueDate" as keyof Receipt,
      cell: (receipt: Receipt) => formatDate(receipt.issueDate),
      sortable: true,
    },
  ];

  const getActions = (request: RequestItem) => {
    const actions = [];
    
    if (request.status === 'pending') {
      actions.push({
        label: "Approve/Reject",
        onClick: () => handleApproveClick(request),
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }
    
    if (request.status === 'approved') {
      actions.push({
        label: "Fulfill",
        onClick: () => handleFulfillClick(request),
        icon: <Store className="h-4 w-4" />,
      });
    }
    
    return actions;
  };

  const receiptRowActions = [
    {
      label: "View Receipt",
      onClick: handleReceiptClick,
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const getDialogTitle = () => {
    switch (dialogMode) {
      case 'approve':
        return 'Approve or Reject Request';
      case 'fulfill':
        return 'Fulfill Request';
      case 'receipt':
        return 'Receipt Details';
      default:
        return 'Request Details';
    }
  };

  const getDialogDescription = () => {
    switch (dialogMode) {
      case 'approve':
        return 'Review and approve or reject this request';
      case 'fulfill':
        return 'Process and fulfill this approved request';
      case 'receipt':
        return selectedReceipt ? `Receipt #${selectedReceipt.id}` : '';
      default:
        return selectedRequest 
          ? `${selectedRequest.itemType.charAt(0).toUpperCase() + selectedRequest.itemType.slice(1)} request for ${selectedRequest.itemName}`
          : '';
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Request Management"
          description="Process and manage item and asset requests"
        />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <DataTable
              data={requests}
              columns={requestColumns}
              onRowClick={handleRequestClick}
              rowActions={getActions}
              searchable
              searchKeys={["itemName", "requestedBy"]}
            />
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <DataTable
              data={requests.filter(r => r.status === 'pending')}
              columns={requestColumns}
              onRowClick={handleRequestClick}
              rowActions={getActions}
              searchable
              searchKeys={["itemName", "requestedBy"]}
            />
          </TabsContent>
          
          <TabsContent value="approved" className="space-y-4">
            <DataTable
              data={requests.filter(r => r.status === 'approved')}
              columns={requestColumns}
              onRowClick={handleRequestClick}
              rowActions={getActions}
              searchable
              searchKeys={["itemName", "requestedBy"]}
            />
          </TabsContent>
          
          <TabsContent value="fulfilled" className="space-y-4">
            <DataTable
              data={requests.filter(r => r.status === 'fulfilled')}
              columns={requestColumns}
              onRowClick={handleRequestClick}
              searchable
              searchKeys={["itemName", "requestedBy"]}
            />
          </TabsContent>
          
          <TabsContent value="receipts" className="space-y-4">
            <DataTable
              data={receipts}
              columns={receiptColumns}
              onRowClick={handleReceiptClick}
              rowActions={receiptRowActions}
              searchable
              searchKeys={["requestedBy", "issuedBy"]}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode === 'view' && selectedRequest && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4 space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Item</p>
                    <p className="font-medium">{selectedRequest.itemName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedRequest.itemType}</p>
                  </div>
                </div>
                
                {selectedRequest.quantity && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                    <p className="font-medium">{selectedRequest.quantity}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Requested By</p>
                    <p className="font-medium">{selectedRequest.requestedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Request Date</p>
                    <p className="font-medium">{formatDate(selectedRequest.requestDate)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                
                {selectedRequest.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                      <p className="font-medium">{selectedRequest.approvedBy}</p>
                    </div>
                    {selectedRequest.approvalDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Approval Date</p>
                        <p className="font-medium">{formatDate(selectedRequest.approvalDate)}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedRequest.fulfilledBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Fulfilled By</p>
                      <p className="font-medium">{selectedRequest.fulfilledBy}</p>
                    </div>
                    {selectedRequest.fulfillmentDate && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Fulfillment Date</p>
                        <p className="font-medium">{formatDate(selectedRequest.fulfillmentDate)}</p>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reason</p>
                  <p>{selectedRequest.reason}</p>
                </div>
                
                {selectedRequest.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p>{selectedRequest.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                {selectedRequest.status === 'pending' && (
                  <Button 
                    onClick={() => handleApproveClick(selectedRequest)}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve/Reject
                  </Button>
                )}
                
                {selectedRequest.status === 'approved' && (
                  <Button 
                    onClick={() => handleFulfillClick(selectedRequest)}
                    className="flex items-center gap-2"
                  >
                    <Store className="h-4 w-4" />
                    Fulfill
                  </Button>
                )}

                {selectedRequest.status === 'fulfilled' && (
                  <Button 
                    onClick={() => {
                      const receipt = receipts.find(r => r.requestId === selectedRequest.id);
                      if (receipt) {
                        setSelectedReceipt(receipt);
                        setDialogMode('receipt');
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View Receipt
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {dialogMode === 'approve' && selectedRequest && (
            <RequestApprovalForm 
              request={selectedRequest}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onCancel={() => setDialogOpen(false)}
              loading={loading}
            />
          )}
          
          {dialogMode === 'fulfill' && selectedRequest && (
            <RequestFulfillmentForm 
              request={selectedRequest}
              onFulfill={handleFulfillRequest}
              onCancel={() => setDialogOpen(false)}
              loading={loading}
            />
          )}
          
          {dialogMode === 'receipt' && selectedReceipt && (
            <ReceiptViewer 
              receipt={selectedReceipt}
              onPrint={handlePrintReceipt}
              onDownload={handleDownloadReceipt}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Requests;
