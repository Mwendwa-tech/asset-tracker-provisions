import { useState, useEffect, useCallback } from 'react';
import { RequestItem, Receipt, Permission, InventoryItem } from '@/types';
import { generateId } from '@/utils/formatters';
import { toast } from '@/components/ui/use-toast';
import { useInventory } from './useInventory';
import { useAssets } from './useAssets';
import { useAuth } from '@/context/AuthContext';
import { companyInfo } from '@/config/systemConfig';

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
    try {
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return savedRequests ? JSON.parse(savedRequests) : mockRequests;
    } catch (error) {
      console.error("Error loading requests from localStorage:", error);
      return mockRequests;
    }
  });
  
  const [receipts, setReceipts] = useState<Receipt[]>(() => {
    try {
      const savedReceipts = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
      return savedReceipts ? JSON.parse(savedReceipts) : mockReceipts;
    } catch (error) {
      console.error("Error loading receipts from localStorage:", error);
      return mockReceipts;
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  
  const { items: inventoryItems, addTransaction } = useInventory();
  const { assets, checkOutAsset } = useAssets();
  const { user, hasPermission } = useAuth();

  // Improved refresh function with better error handling
  const refreshData = useCallback(() => {
    try {
      const savedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const savedReceipts = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
      
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests);
        setRequests(parsedRequests);
      }
      
      if (savedReceipts) {
        const parsedReceipts = JSON.parse(savedReceipts);
        setReceipts(parsedReceipts);
      }
      
      setLastUpdate(Date.now());
      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing request data:", error);
      toast({
        title: 'Data Refresh Error',
        description: 'Failed to refresh data. Please try again.',
        variant: 'destructive'
      });
    }
  }, []);

  // Save to localStorage with proper error handling
  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}-timestamp`, Date.now().toString());
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      toast({
        title: 'Storage Error',
        description: 'Failed to save data. Changes may be lost on refresh.',
        variant: 'destructive'
      });
      return false;
    }
  }, []);

  // Save requests when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);
  }, [requests, saveToStorage]);

  // Save receipts when they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.RECEIPTS, receipts);
  }, [receipts, saveToStorage]);

  // Improved storage change listener
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('request') || event.key?.includes('receipt')) {
        const currentTime = Date.now();
        const lastUpdateTime = parseInt(localStorage.getItem('last-refresh') || '0');
        
        // Prevent rapid refreshes
        if (currentTime - lastUpdateTime > 1000) {
          localStorage.setItem('last-refresh', currentTime.toString());
          refreshData();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshData]);

  // Create a new request with validation
  const createRequest = useCallback((
    request: Omit<RequestItem, 'id' | 'requestDate' | 'status'>
  ) => {
    setLoading(true);
    
    try {
      // Validate input
      if (!request.itemName || !request.requestedBy) {
        throw new Error("Missing required fields");
      }

      if (request.itemType === 'inventory' && (!request.quantity || request.quantity <= 0)) {
        throw new Error("Invalid quantity for inventory item");
      }
      
      // Check permissions
      if (!hasPermission(Permission.CreateRequest)) {
        throw new Error("You don't have permission to create requests");
      }
      
      const newRequest: RequestItem = {
        ...request,
        id: generateId(),
        requestDate: new Date(),
        status: 'pending',
        department: user?.department || request.department,
        priority: request.priority || 'medium'
      };
      
      setRequests(current => {
        const updatedRequests = [newRequest, ...current];
        return updatedRequests;
      });
      
      console.log(`New request created: ${newRequest.id} for ${newRequest.itemName}`);
      
      toast({
        title: 'Request created',
        description: 'Your request has been submitted for approval.',
      });
      
      setLoading(false);
      return newRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create request. Please try again.',
        variant: 'destructive'
      });
      setLoading(false);
      return null;
    }
  }, [hasPermission, user?.department]);

  // Approve request with proper type handling
  const approveRequest = useCallback((id: string, approverName: string) => {
    setLoading(true);
    
    try {
      if (!hasPermission(Permission.ApproveRequestFinal) && !hasPermission(Permission.ApproveRequestDepartment)) {
        throw new Error("You don't have permission to approve requests");
      }
      
      const request = requests.find(req => req.id === id);
      if (!request) {
        throw new Error('Request not found');
      }
      
      setRequests(current => {
        return current.map(req => {
          if (req.id !== id) return req;
          
          // Department level approval
          if (req.status === 'pending' && hasPermission(Permission.ApproveRequestDepartment) && !hasPermission(Permission.ApproveRequestFinal)) {
            return { 
              ...req, 
              status: 'department-approved' as const, 
              departmentApprovedBy: approverName,
              departmentApprovalDate: new Date()
            };
          }
          // Final approval
          else if ((req.status === 'department-approved') || hasPermission(Permission.ApproveRequestFinal)) {
            return { 
              ...req, 
              status: 'approved' as const, 
              approvedBy: approverName,
              approvalDate: new Date()
            };
          }
          
          return req;
        });
      });
      
      toast({
        title: 'Request approved',
        description: 'The request has been approved.',
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to approve request.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  }, [requests, hasPermission]);

  // Reject request with proper validation
  const rejectRequest = useCallback((id: string, approverName: string, reason: string) => {
    setLoading(true);
    
    try {
      if (!hasPermission(Permission.ApproveRequestFinal) && !hasPermission(Permission.ApproveRequestDepartment)) {
        throw new Error("You don't have permission to reject requests");
      }

      if (!reason?.trim()) {
        throw new Error("Rejection reason is required");
      }
      
      setRequests(current => {
        return current.map(req => 
          req.id === id 
            ? { 
                ...req, 
                status: 'rejected' as const, 
                approvedBy: approverName,
                approvalDate: new Date(),
                notes: reason.trim()
              } 
            : req
        );
      });
      
      toast({
        title: 'Request rejected',
        description: 'The request has been rejected.',
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reject request.',
        variant: 'destructive'
      });
      setLoading(false);
    }
  }, [hasPermission]);

  // Enhanced fulfill request with better inventory management
  const fulfillRequest = useCallback((id: string, fulfillerName: string, notes?: string) => {
    setLoading(true);
    
    try {
      if (!hasPermission(Permission.FulfillRequest)) {
        throw new Error("You don't have permission to fulfill requests");
      }
      
      const requestToFulfill = requests.find(req => req.id === id);
      
      if (!requestToFulfill) {
        throw new Error('Request not found');
      }
      
      if (requestToFulfill.status !== 'approved') {
        throw new Error('Request must be approved before fulfillment');
      }

      // Check availability for inventory items
      if (requestToFulfill.itemType === 'inventory' && requestToFulfill.quantity) {
        const item = inventoryItems.find(i => i.id === requestToFulfill.itemId) as InventoryItem;
        if (item && item.quantity < requestToFulfill.quantity) {
          throw new Error(`Insufficient stock. Available: ${item.quantity}, Requested: ${requestToFulfill.quantity}`);
        }
      }
      
      // Update request status
      const updatedRequests = requests.map(req => 
        req.id === id 
          ? { 
              ...req, 
              status: 'fulfilled' as const, 
              fulfilledBy: fulfillerName,
              fulfillmentDate: new Date(),
              notes: notes ? `${req.notes || ''} | Fulfillment: ${notes}` : req.notes
            } 
          : req
      );
      
      // Generate receipt
      const yearPrefix = new Date().getFullYear().toString();
      const receiptId = generateId();
      
      const newReceipt: Receipt = {
        id: receiptId,
        requestId: id,
        receiptNumber: `${companyInfo.name.substring(0,2).toUpperCase()}-${yearPrefix}-${receiptId.slice(0, 6).toUpperCase()}`,
        items: [
          {
            name: requestToFulfill.itemName,
            quantity: requestToFulfill.quantity || 1,
            type: requestToFulfill.itemType
          }
        ],
        requestedBy: requestToFulfill.requestedBy,
        approvedBy: requestToFulfill.approvedBy || 'Unknown',
        issuedBy: fulfillerName,
        issueDate: new Date(),
        notes: notes,
        department: requestToFulfill.department
      };
      
      // Update inventory/asset
      if (requestToFulfill.itemType === 'inventory' && requestToFulfill.quantity) {
        const item = inventoryItems.find(i => i.id === requestToFulfill.itemId) as InventoryItem;
        if (item) {
          addTransaction({
            itemId: item.id,
            itemName: item.name,
            type: 'used',
            quantity: requestToFulfill.quantity,
            performedBy: fulfillerName,
            notes: `Request fulfillment: ${requestToFulfill.id}`
          });
        }
      } else if (requestToFulfill.itemType === 'asset') {
        const asset = assets.find(a => a.id === requestToFulfill.itemId);
        if (asset) {
          checkOutAsset(
            asset.id, 
            requestToFulfill.requestedBy, 
            undefined, 
            `Request fulfillment: ${requestToFulfill.id}`
          );
        }
      }
      
      // Update state
      setRequests(updatedRequests);
      setReceipts(current => [newReceipt, ...current]);
      
      toast({
        title: 'Request fulfilled',
        description: 'The request has been fulfilled and receipt generated.',
      });
      
      setLoading(false);
      return newReceipt;
    } catch (error) {
      console.error('Error fulfilling request:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fulfill request.',
        variant: 'destructive'
      });
      setLoading(false);
      return null;
    }
  }, [requests, hasPermission, inventoryItems, assets, addTransaction, checkOutAsset]);

  // Enhanced receipt generation
  const generateReceipt = useCallback((receiptId: string): string => {
    const receipt = receipts.find(r => r.id === receiptId);
    if (!receipt) {
      console.error('Receipt not found:', receiptId);
      return '';
    }
    
    const referenceNumber = receipt.receiptNumber || `${companyInfo.name.substring(0,2).toUpperCase()}-${new Date(receipt.issueDate).getFullYear()}-${receipt.id.slice(0, 8).toUpperCase()}`;
    
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
            .reference { font-weight: bold; margin: 20px 0; border: 1px solid #ddd; padding: 10px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">${companyInfo.name.toUpperCase()}</div>
            <div class="hotel-name">${companyInfo.slogan}</div>
            <p>${companyInfo.address}, ${companyInfo.city}</p>
            <h1>Inventory Issue Receipt</h1>
            <p>Receipt #: ${receipt.id}</p>
            <p>Date: ${new Date(receipt.issueDate).toLocaleDateString()}</p>
            <p class="reference">Reference Number: ${referenceNumber}</p>
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
            <p>This is an official receipt of ${companyInfo.name}.</p>
            <p>For any inquiries, please contact the Inventory Department at ${companyInfo.email}</p>
            <p><strong>Reference: ${referenceNumber}</strong></p>
          </div>
        </body>
      </html>
    `;
    
    return `data:text/html;charset=utf-8,${encodeURIComponent(receiptHTML)}`;
  }, [receipts]);

  // Manual refresh with debouncing
  const refreshRequests = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdate < 2000) {
      console.log("Refresh skipped - too frequent");
      return;
    }
    
    refreshData();
    toast({
      title: "Data Refreshed",
      description: "The requests data has been refreshed",
    });
  }, [refreshData, lastUpdate]);

  return {
    requests,
    receipts,
    loading,
    createRequest,
    approveRequest,
    rejectRequest,
    fulfillRequest,
    generateReceipt,
    refreshRequests
  };
}
