
import { useState, useEffect } from 'react';
import { RequestItem, Receipt, Permission } from '@/types';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { useInventory } from './useInventory';
import { useAssets } from './useAssets';
import { useAuth } from '@/context/AuthContext';

// Mock data for requests with department added for hotel context
const mockRequests: RequestItem[] = [
  {
    id: 'req-1',
    itemId: 'inv-1',
    itemType: 'inventory',
    itemName: 'Cleaning Supplies',
    quantity: 5,
    requestedBy: 'John Doe',
    requestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'pending',
    reason: 'Weekly cleaning supplies needed',
    department: 'Housekeeping',
    priority: 'medium'
  },
  {
    id: 'req-2',
    itemId: 'asset-1',
    itemType: 'asset',
    itemName: 'Laptop',
    requestedBy: 'Jane Smith',
    requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'approved',
    approvedBy: 'Admin User',
    approvalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reason: 'New employee onboarding',
    department: 'Front Office',
    priority: 'high'
  },
  {
    id: 'req-3',
    itemId: 'inv-2',
    itemType: 'inventory',
    itemName: 'Office Supplies',
    quantity: 10,
    requestedBy: 'Bob Johnson',
    requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'fulfilled',
    approvedBy: 'Admin User',
    approvalDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    fulfilledBy: 'Store Keeper',
    fulfillmentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    reason: 'Monthly resupply',
    department: 'Executive',
    priority: 'low'
  }
];

// Mock receipts with department added
const mockReceipts: Receipt[] = [
  {
    id: 'receipt-1',
    requestId: 'req-3',
    items: [
      {
        name: 'Office Supplies',
        quantity: 10,
        type: 'inventory'
      }
    ],
    requestedBy: 'Bob Johnson',
    approvedBy: 'Admin User',
    issuedBy: 'Store Keeper',
    issueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    department: 'Executive'
  }
];

// Storage keys
const STORAGE_KEYS = {
  REQUESTS: 'hostel-requests',
  RECEIPTS: 'hostel-receipts'
};

export function useRequests() {
  // Initialize state with localStorage or mock data
  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return savedRequests ? JSON.parse(savedRequests) : mockRequests;
  });
  
  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    const savedReceipts = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    return savedReceipts ? JSON.parse(savedReceipts) : mockReceipts;
  });
  
  const [loading, setLoading] = useState(false);
  
  const { items: inventoryItems, addTransaction } = useInventory();
  const { assets, checkOutAsset } = useAssets();
  const { user, hasPermission } = useAuth();

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  }, [receipts]);

  // Create a new request
  const createRequest = (
    request: Omit<RequestItem, 'id' | 'requestDate' | 'status'>
  ) => {
    setLoading(true);
    
    try {
      // Check if user has permission to create requests
      if (user && !hasPermission(Permission.CreateRequest)) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to create requests.',
          variant: 'destructive'
        });
        setLoading(false);
        return null;
      }
      
      // Simulate API call
      setTimeout(() => {
        const newRequest: RequestItem = {
          ...request,
          id: generateId(),
          requestDate: new Date(),
          status: 'pending',
          // Add department from user if available
          department: user?.department || request.department,
          priority: request.priority || 'medium' // Default to medium priority if not provided
        };
        
        setRequests(current => [newRequest, ...current]);
        
        toast({
          title: 'Request created',
          description: 'Your request has been submitted for approval.',
        });
        
        setLoading(false);
        return newRequest;
      }, 500);
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: 'Error',
        description: 'Failed to create request. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return null;
    }
  };

  // Approve a request
  const approveRequest = (id: string, approverName: string) => {
    setLoading(true);
    
    try {
      // Check if user has permission to approve requests
      if (user && !hasPermission(Permission.ApproveRequestFinal)) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to approve requests.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        setRequests(current => 
          current.map(req => 
            req.id === id 
              ? { 
                  ...req, 
                  status: 'approved', 
                  approvedBy: approverName,
                  approvalDate: new Date()
                } 
              : req
          )
        );
        
        toast({
          title: 'Request approved',
          description: 'The request has been approved and is ready for fulfillment.',
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve request. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Reject a request
  const rejectRequest = (id: string, approverName: string, reason: string) => {
    setLoading(true);
    
    try {
      // Check if user has permission to approve/reject requests
      if (user && !hasPermission(Permission.ApproveRequestFinal)) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to reject requests.',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }
      
      // Simulate API call
      setTimeout(() => {
        setRequests(current => 
          current.map(req => 
            req.id === id 
              ? { 
                  ...req, 
                  status: 'rejected', 
                  approvedBy: approverName,
                  approvalDate: new Date(),
                  notes: reason
                } 
              : req
          )
        );
        
        toast({
          title: 'Request rejected',
          description: 'The request has been rejected.',
        });
        
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject request. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Fulfill a request
  const fulfillRequest = (id: string, fulfillerName: string, notes?: string) => {
    setLoading(true);
    
    try {
      // Check if user has permission to fulfill requests
      if (user && !hasPermission(Permission.FulfillRequest)) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to fulfill requests.',
          variant: 'destructive'
        });
        setLoading(false);
        return null;
      }
      
      // Simulate API call
      setTimeout(() => {
        const requestToFulfill = requests.find(req => req.id === id);
        
        if (!requestToFulfill) {
          throw new Error('Request not found');
        }
        
        if (requestToFulfill.status !== 'approved') {
          throw new Error('Request must be approved before fulfillment');
        }
        
        // Update the item/asset based on request type
        if (requestToFulfill.itemType === 'inventory') {
          const item = inventoryItems.find(i => i.id === requestToFulfill.itemId);
          
          if (item && requestToFulfill.quantity) {
            // Add transaction to inventory
            addTransaction({
              itemId: item.id,
              itemName: item.name,
              type: 'used',
              quantity: requestToFulfill.quantity,
              performedBy: fulfillerName,
              notes: `Issued for request ${requestToFulfill.id}`
            });
          }
        } else if (requestToFulfill.itemType === 'asset') {
          const asset = assets.find(a => a.id === requestToFulfill.itemId);
          
          if (asset) {
            // Checkout the asset
            checkOutAsset(
              asset.id, 
              requestToFulfill.requestedBy, 
              undefined, 
              `Issued for request ${requestToFulfill.id}`
            );
          }
        }
        
        // Update request status
        setRequests(current => 
          current.map(req => 
            req.id === id 
              ? { 
                  ...req, 
                  status: 'fulfilled', 
                  fulfilledBy: fulfillerName,
                  fulfillmentDate: new Date(),
                  notes: notes ? `${req.notes || ''} | Fulfillment note: ${notes}` : req.notes
                } 
              : req
          )
        );
        
        // Generate receipt
        const requestToReceipt = requests.find(req => req.id === id);
        
        if (!requestToReceipt) {
          throw new Error('Request not found');
        }
        
        const newReceipt: Receipt = {
          id: generateId(),
          requestId: id,
          items: [
            {
              name: requestToReceipt.itemName,
              quantity: requestToReceipt.quantity,
              type: requestToReceipt.itemType
            }
          ],
          requestedBy: requestToReceipt.requestedBy,
          approvedBy: requestToReceipt.approvedBy || 'Unknown',
          issuedBy: fulfillerName,
          issueDate: new Date(),
          notes: notes,
          department: requestToReceipt.department
        };
        
        setReceipts(current => [newReceipt, ...current]);
        
        toast({
          title: 'Request fulfilled',
          description: 'The request has been fulfilled and receipt generated.',
        });
        
        setLoading(false);
        return newReceipt;
      }, 500);
    } catch (error) {
      console.error('Error fulfilling request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fulfill request. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return null;
    }
  };

  // Generate PDF receipt
  const generateReceipt = (receiptId: string): string => {
    const receipt = receipts.find(r => r.id === receiptId);
    if (!receipt) return '';
    
    // In a real app, this would generate a PDF
    // For this mock, we'll create a data URL with a simple HTML structure
    const receiptHTML = `
      <html>
        <head>
          <title>Receipt #${receipt.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { text-align: center; margin-bottom: 20px; font-size: 24px; font-weight: bold; }
            .hotel-name { font-size: 28px; margin-bottom: 5px; }
            .details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .footer { margin-top: 50px; text-align: center; }
            .signatures { display: flex; justify-content: space-between; margin-top: 100px; }
            .signature { width: 200px; text-align: center; }
            .signature-line { border-top: 1px solid #000; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">GRAND LUXURY HOTEL</div>
            <div class="hotel-name">Five Star Elegance</div>
            <p>123 Luxury Avenue, Prestige City</p>
            <h1>Inventory Issue Receipt</h1>
            <p>Receipt #: ${receipt.id}</p>
            <p>Date: ${new Date(receipt.issueDate).toLocaleDateString()}</p>
          </div>
          
          <div class="details">
            <p><strong>Requested By:</strong> ${receipt.requestedBy}</p>
            <p><strong>Department:</strong> ${receipt.department || 'N/A'}</p>
            <p><strong>Approved By:</strong> ${receipt.approvedBy}</p>
            <p><strong>Issued By:</strong> ${receipt.issuedBy}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
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
          
          ${receipt.notes ? `<p><strong>Notes:</strong> ${receipt.notes}</p>` : ''}
          
          <div class="signatures">
            <div class="signature">
              <div class="signature-line"></div>
              <p>Requester Signature</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>Store Keeper Signature</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>Authorized Signature</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an official receipt of Grand Luxury Hotel.</p>
            <p>For any inquiries, please contact the Inventory Department at inventory@grandluxury.hotel</p>
          </div>
        </body>
      </html>
    `;
    
    // Convert HTML to data URL
    const dataURL = `data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`;
    return dataURL;
  };

  return {
    requests,
    receipts,
    loading,
    createRequest,
    approveRequest,
    rejectRequest,
    fulfillRequest,
    generateReceipt
  };
}
