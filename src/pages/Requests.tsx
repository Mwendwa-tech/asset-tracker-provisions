
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle,
  FileText,
  AlertCircle,
  Store,
  ArrowDown,
  ShieldAlert,
  Check,
  Clock,
  UserCheck,
  ArchiveIcon,
  Filter
} from 'lucide-react';
import { useRequests } from '@/hooks/useRequests';
import { RequestItem, Receipt, Permission } from '@/types';
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
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";

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

  const { user, hasPermission } = useAuth();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'approve' | 'fulfill' | 'receipt'>('view');
  const [activeView, setActiveView] = useState<'all' | 'pending' | 'approved' | 'fulfilled' | 'receipts'>('all');

  const filteredRequests = requests.filter(request => {
    if (!user) return false;
    
    if (hasPermission(Permission.ApproveRequestFinal)) {
      return true;
    }
    
    if (user.role === 'storekeeper' && request.status === 'approved') {
      return true;
    }
    
    return request.requestedBy === user.name || 
           (request.department && request.department === user.department);
  });

  // Request stats
  const pendingCount = filteredRequests.filter(r => r.status === 'pending').length;
  const approvedCount = filteredRequests.filter(r => r.status === 'approved').length;
  const fulfilledCount = filteredRequests.filter(r => r.status === 'fulfilled').length;
  const rejectedCount = filteredRequests.filter(r => r.status === 'rejected').length;

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
    if (!hasPermission(Permission.ApproveRequestFinal)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to approve requests.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedRequest(request);
    setDialogMode('approve');
    setDialogOpen(true);
  };

  const handleFulfillClick = (request: RequestItem) => {
    if (!hasPermission(Permission.FulfillRequest)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to fulfill requests.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedRequest(request);
    setDialogMode('fulfill');
    setDialogOpen(true);
  };

  const handleApproveRequest = (approverName: string) => {
    if (!hasPermission(Permission.ApproveRequestFinal)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to approve requests.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedRequest) {
      approveRequest(selectedRequest.id, approverName);
      setDialogOpen(false);
    }
  };

  const handleRejectRequest = (approverName: string, reason: string) => {
    if (!hasPermission(Permission.ApproveRequestFinal)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to reject requests.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedRequest) {
      rejectRequest(selectedRequest.id, approverName, reason);
      setDialogOpen(false);
    }
  };

  const handleFulfillRequest = (fulfillerName: string, notes?: string) => {
    if (!hasPermission(Permission.FulfillRequest)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to fulfill requests.",
        variant: "destructive"
      });
      return;
    }
    
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

  const getStatusColor = (status: RequestItem['status']) => {
    switch (status) {
      case 'pending':
        return "text-amber-600";
      case 'approved':
        return "text-blue-600";
      case 'rejected':
        return "text-red-600";
      case 'fulfilled':
        return "text-green-600";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: RequestItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'approved':
        return <UserCheck className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'rejected':
        return <AlertCircle className={`h-5 w-5 ${getStatusColor(status)}`} />;
      case 'fulfilled':
        return <CheckCircle className={`h-5 w-5 ${getStatusColor(status)}`} />;
      default:
        return <div className="h-5 w-5" />;
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
      cell: (item: RequestItem) => (
        <div>
          <div>{item.requestedBy}</div>
          <div className="text-xs text-muted-foreground">{item.department || 'N/A'}</div>
        </div>
      ),
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
      cell: (item: RequestItem) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(item.status)}
          {getStatusBadge(item.status)}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Priority",
      accessorKey: "priority" as keyof RequestItem,
      cell: (item: RequestItem) => (
        <Badge className={
          item.priority === 'high' ? "bg-red-100 text-red-800" : 
          item.priority === 'medium' ? "bg-blue-100 text-blue-800" : 
          "bg-gray-100 text-gray-800"
        }>
          {item.priority || 'Medium'}
        </Badge>
      ),
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
      cell: (receipt: Receipt) => (
        <div>
          <div>{receipt.requestedBy}</div>
          <div className="text-xs text-muted-foreground">{receipt.department || 'N/A'}</div>
        </div>
      ),
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

  const pendingActions = [
    {
      label: "Approve/Reject",
      onClick: (request: RequestItem) => handleApproveClick(request),
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  const approvedActions = [
    {
      label: "Fulfill",
      onClick: (request: RequestItem) => handleFulfillClick(request),
      icon: <Store className="h-4 w-4" />,
    },
  ];

  const noActions: {
    label: string;
    onClick: (item: RequestItem) => void;
    icon?: React.ReactNode;
  }[] = [];

  const getActionsForRequest = (request: RequestItem) => {
    if (request.status === 'pending' && hasPermission(Permission.ApproveRequestFinal)) {
      return pendingActions;
    }
    
    if (request.status === 'approved' && hasPermission(Permission.FulfillRequest)) {
      return approvedActions;
    }
    
    return noActions;
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

  const canManageRequests = hasPermission(Permission.ApproveRequestFinal) || user?.role === 'departmentHead';

  if (!user || (!hasPermission(Permission.ViewRequest) && !hasPermission(Permission.ApproveRequestFinal) && !hasPermission(Permission.FulfillRequest))) {
    return (
      <MainLayout>
        <div className="animate-fade-in">
          <PageHeader
            title="Request Management"
            description="Process and manage item and asset requests"
          />
          
          <div className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have permission to view this page. Please contact your administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Request Management"
          description="Process and manage item and asset requests"
        />

        {/* Request Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">{pendingCount}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <h3 className="text-2xl font-bold">{approvedCount}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fulfilled</p>
                <h3 className="text-2xl font-bold">{fulfilledCount}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <h3 className="text-2xl font-bold">{rejectedCount}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs Interface */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Request Management</CardTitle>
              {hasPermission(Permission.ApproveRequestFinal) && (
                <Button variant="approval" size="sm" onClick={() => setActiveView('pending')}>
                  <UserCheck className="h-4 w-4 mr-1" />
                  Review Requests
                </Button>
              )}
              {hasPermission(Permission.FulfillRequest) && (
                <Button variant="success" size="sm" onClick={() => setActiveView('approved')} className="ml-2">
                  <Store className="h-4 w-4 mr-1" />
                  Fulfill Items
                </Button>
              )}
            </div>
            <CardDescription>View and manage inventory and asset requests</CardDescription>
            <Separator className="my-2" />
          </CardHeader>
          <CardContent className="p-3">
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="space-y-4">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="all">All Requests</TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-1">
                  Pending
                  {pendingCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs">
                      {pendingCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-1">
                  Approved
                  {approvedCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                      {approvedCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
                <TabsTrigger value="receipts">Receipts</TabsTrigger>
              </TabsList>
              
              {/* All Requests Tab */}
              <TabsContent value="all" className="space-y-4">
                <div className="rounded-md border p-4 bg-muted/50">
                  <h3 className="text-lg font-medium mb-1">All Requests</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete list of all requests across all statuses
                  </p>
                  <DataTable
                    data={filteredRequests}
                    columns={requestColumns}
                    onRowClick={handleRequestClick}
                    rowActions={(request) => getActionsForRequest(request)}
                    searchable
                    searchKeys={["itemName", "requestedBy", "department"]}
                  />
                </div>
              </TabsContent>
              
              {/* Pending Requests Tab */}
              <TabsContent value="pending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-600" />
                        Pending Requests
                      </CardTitle>
                      <Badge variant="outline" className="text-amber-600">
                        {pendingCount} pending
                      </Badge>
                    </div>
                    <CardDescription>
                      Requests awaiting your approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={filteredRequests.filter(r => r.status === 'pending')}
                      columns={requestColumns}
                      onRowClick={handleRequestClick}
                      rowActions={hasPermission(Permission.ApproveRequestFinal) ? pendingActions : []}
                      searchable
                      searchKeys={["itemName", "requestedBy", "department"]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Approved Requests Tab */}
              <TabsContent value="approved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        Approved Requests
                      </CardTitle>
                      <Badge variant="outline" className="text-blue-600">
                        {approvedCount} approved
                      </Badge>
                    </div>
                    <CardDescription>
                      Approved requests ready for fulfillment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={filteredRequests.filter(r => r.status === 'approved')}
                      columns={requestColumns}
                      onRowClick={handleRequestClick}
                      rowActions={hasPermission(Permission.FulfillRequest) ? approvedActions : []}
                      searchable
                      searchKeys={["itemName", "requestedBy", "department"]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Fulfilled Requests Tab */}
              <TabsContent value="fulfilled" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Fulfilled Requests
                      </CardTitle>
                      <Badge variant="outline" className="text-green-600">
                        {fulfilledCount} fulfilled
                      </Badge>
                    </div>
                    <CardDescription>
                      Completed and fulfilled requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={filteredRequests.filter(r => r.status === 'fulfilled')}
                      columns={requestColumns}
                      onRowClick={handleRequestClick}
                      searchable
                      searchKeys={["itemName", "requestedBy"]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Receipts Tab */}
              <TabsContent value="receipts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        Receipts
                      </CardTitle>
                      <Badge variant="outline" className="text-gray-600">
                        {receipts.length} receipts
                      </Badge>
                    </div>
                    <CardDescription>
                      Documentation of fulfilled requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      data={receipts}
                      columns={receiptColumns}
                      onRowClick={handleReceiptClick}
                      rowActions={receiptRowActions}
                      searchable
                      searchKeys={["requestedBy", "issuedBy"]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-1 flex items-center gap-2">
                      {getStatusIcon(selectedRequest.status)}
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Priority</p>
                    <div className="mt-1">
                      <Badge className={
                        selectedRequest.priority === 'high' ? "bg-red-100 text-red-800" : 
                        selectedRequest.priority === 'medium' ? "bg-blue-100 text-blue-800" : 
                        "bg-gray-100 text-gray-800"
                      }>
                        {selectedRequest.priority || 'Medium'}
                      </Badge>
                    </div>
                  </div>
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
                {selectedRequest.status === 'pending' && canManageRequests && (
                  <Button
                    variant="approval"
                    size="sm"
                    disabled={!hasPermission(Permission.ApproveRequestFinal) && user?.role !== 'departmentHead'}
                    onClick={() => handleApproveClick(selectedRequest)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}
                
                {selectedRequest.status === 'approved' && hasPermission(Permission.FulfillRequest) && (
                  <Button 
                    onClick={() => handleFulfillClick(selectedRequest)}
                    className="flex items-center gap-2"
                    variant="success"
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
