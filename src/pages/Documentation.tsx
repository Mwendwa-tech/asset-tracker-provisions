
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { companyInfo, systemSettings, userRoles, hotelDepartments } from '@/config/systemConfig';
import { ScrollArea } from './ui/scroll-area';

export default function Documentation() {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="System Documentation"
          description="Complete documentation and user guide for the Hotel Management System"
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="user-guide">User Guide</TabsTrigger>
            <TabsTrigger value="system-config">Configuration</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  A comprehensive system for hotel inventory, asset, and procurement management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This hotel management system provides comprehensive tools for managing inventory, assets, and procurement processes. 
                  It's designed to streamline operations, reduce costs, and improve visibility across all departments of the hotel.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Real-time inventory tracking with low stock alerts</li>
                  <li>Asset management with maintenance schedules</li>
                  <li>Procurement system with purchase order management</li>
                  <li>Request and approval workflows</li>
                  <li>User management with role-based permissions</li>
                  <li>Comprehensive reporting capabilities</li>
                  <li>Cross-browser and multi-device synchronization</li>
                </ul>
                
                <h3 className="text-lg font-medium mt-4">Technical Details</h3>
                <p>
                  Built with modern web technologies including React, TypeScript, and Tailwind CSS.
                  The system uses a responsive design that works across desktop and mobile devices.
                </p>
                
                <h3 className="text-lg font-medium mt-4">Data Management</h3>
                <p>
                  The system uses browser local storage for data persistence in the demo, but can be
                  connected to a backend database for production use. Data is synchronized across multiple
                  browser tabs/windows to support multiple users working simultaneously.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="user-guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Guide</CardTitle>
                <CardDescription>
                  Instructions for using the hotel management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4 pr-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="inventory">
                        <AccordionTrigger>Inventory Management</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p>The inventory management module allows you to:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Add, edit, and delete inventory items</li>
                            <li>Track inventory levels and set minimum thresholds</li>
                            <li>Receive automatic low stock alerts</li>
                            <li>Record inventory transactions (receipts, usage, adjustments)</li>
                            <li>Track expiry dates for perishable items</li>
                          </ul>
                          
                          <p className="mt-2 font-medium">Adding Inventory Items</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Inventory Management</li>
                            <li>Click "Add Item"</li>
                            <li>Fill in the required information</li>
                            <li>Click "Save"</li>
                          </ol>
                          
                          <p className="mt-2 font-medium">Adjusting Stock Levels</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Find the item in the inventory list</li>
                            <li>Click on the item to view details</li>
                            <li>Click "Adjust Stock"</li>
                            <li>Enter the quantity change and reason</li>
                            <li>Click "Save"</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="assets">
                        <AccordionTrigger>Asset Management</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p>The asset management module allows you to:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Track all hotel assets (furniture, equipment, vehicles, etc.)</li>
                            <li>Manage asset locations and assignments</li>
                            <li>Schedule and track maintenance</li>
                            <li>Track depreciation and current values</li>
                            <li>Check out assets to departments or staff</li>
                          </ul>
                          
                          <p className="mt-2 font-medium">Adding Assets</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Asset Management</li>
                            <li>Click "Add Asset"</li>
                            <li>Fill in the asset details</li>
                            <li>Click "Save"</li>
                          </ol>
                          
                          <p className="mt-2 font-medium">Checking Out Assets</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Find the asset in the list</li>
                            <li>Click on the asset to view details</li>
                            <li>Click "Check Out"</li>
                            <li>Select the person/department and return date</li>
                            <li>Click "Confirm"</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="procurement">
                        <AccordionTrigger>Procurement</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p>The procurement module allows you to:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Create and manage purchase orders</li>
                            <li>Track orders from creation to fulfillment</li>
                            <li>Manage vendors and supplier information</li>
                            <li>Track deliveries and receiving</li>
                            <li>Create Local Purchase Orders (LPOs)</li>
                          </ul>
                          
                          <p className="mt-2 font-medium">Creating Purchase Orders</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Procurement Management</li>
                            <li>Click "New Purchase Order"</li>
                            <li>Select the vendor and add items</li>
                            <li>Save as draft or submit for approval</li>
                          </ol>
                          
                          <p className="mt-2 font-medium">Creating Local Purchase Orders</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Procurement Management</li>
                            <li>Select the LPO tab</li>
                            <li>Enter supplier details and add items</li>
                            <li>Save as draft or submit for approval</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="requests">
                        <AccordionTrigger>Requests & Approvals</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p>The requests module allows staff to:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Request inventory items from stores</li>
                            <li>Submit purchase requests</li>
                            <li>Track request status</li>
                            <li>Approve or reject pending requests (for managers)</li>
                          </ul>
                          
                          <p className="mt-2 font-medium">Submitting Requests</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Requests</li>
                            <li>Click "New Request"</li>
                            <li>Select request type and fill in details</li>
                            <li>Submit the request</li>
                          </ol>
                          
                          <p className="mt-2 font-medium">Approving Requests</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Requests</li>
                            <li>Filter for "Pending Approval"</li>
                            <li>Review the request details</li>
                            <li>Approve, reject, or request more information</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="reports">
                        <AccordionTrigger>Reports</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p>The reporting module provides:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Inventory usage and valuation reports</li>
                            <li>Asset status and depreciation reports</li>
                            <li>Procurement spending analysis</li>
                            <li>Department-wise consumption patterns</li>
                            <li>Custom report generation</li>
                          </ul>
                          
                          <p className="mt-2 font-medium">Generating Reports</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Navigate to Reports</li>
                            <li>Select the report type</li>
                            <li>Choose the date range and filters</li>
                            <li>Click "Generate Report"</li>
                            <li>View, print, or export the results</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system-config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  The current system configuration details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4 pr-4">
                    <h3 className="text-lg font-medium">Hotel Information</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Name:</div>
                      <div className="text-sm">{companyInfo.name}</div>
                      
                      <div className="text-sm font-medium">Address:</div>
                      <div className="text-sm">{companyInfo.address}, {companyInfo.city}, {companyInfo.state}</div>
                      
                      <div className="text-sm font-medium">Phone:</div>
                      <div className="text-sm">{companyInfo.phone}</div>
                      
                      <div className="text-sm font-medium">Email:</div>
                      <div className="text-sm">{companyInfo.email}</div>
                      
                      <div className="text-sm font-medium">Currency:</div>
                      <div className="text-sm">{companyInfo.currency} ({companyInfo.currencySymbol})</div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">Departments</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {hotelDepartments.map((dept, index) => (
                        <div key={index} className="text-sm">{dept}</div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-medium mt-4">User Roles & Permissions</h3>
                    <div className="space-y-2">
                      {Object.entries(userRoles).map(([roleId, role]) => (
                        <div key={roleId} className="border p-3 rounded-md">
                          <div className="font-medium">{role.label}</div>
                          <div className="text-sm text-muted-foreground">Access Level: {role.level}</div>
                          {'description' in role && role.description && (
                            <div className="text-sm mt-1">{role.description}</div>
                          )}
                          <div className="mt-2 text-xs grid grid-cols-2 gap-x-2 gap-y-1">
                            <div>Can Approve Requests: {role.canApproveRequests ? '✓' : '✗'}</div>
                            <div>Can Manage Users: {role.canManageUsers ? '✓' : '✗'}</div>
                            <div>Can View Reports: {role.canViewReports ? '✓' : '✗'}</div>
                            <div>Can Manage Settings: {role.canManageSettings ? '✓' : '✗'}</div>
                            <div>Can Manage Inventory: {role.canManageInventory ? '✓' : '✗'}</div>
                            <div>Can Manage Assets: {role.canManageAssets ? '✓' : '✗'}</div>
                            <div>Can Manage Suppliers: {role.canManageSuppliers ? '✓' : '✗'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Technical API documentation for system integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4 pr-4">
                    <p>
                      This system can be integrated with other hotel systems via APIs. The following 
                      endpoints and methods are available for developers:
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="inventory-api">
                        <AccordionTrigger>Inventory API</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="font-medium">GET /api/inventory</p>
                          <p className="text-sm">Retrieves all inventory items</p>
                          <p className="text-xs text-muted-foreground mt-1">Parameters: category, location, minStock</p>
                          
                          <p className="font-medium mt-2">GET /api/inventory/:id</p>
                          <p className="text-sm">Retrieves a specific inventory item</p>
                          
                          <p className="font-medium mt-2">POST /api/inventory</p>
                          <p className="text-sm">Creates a new inventory item</p>
                          <p className="text-xs text-muted-foreground mt-1">Required fields: name, category, unit, quantity</p>
                          
                          <p className="font-medium mt-2">PUT /api/inventory/:id</p>
                          <p className="text-sm">Updates an existing inventory item</p>
                          
                          <p className="font-medium mt-2">DELETE /api/inventory/:id</p>
                          <p className="text-sm">Deletes an inventory item</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="assets-api">
                        <AccordionTrigger>Assets API</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="font-medium">GET /api/assets</p>
                          <p className="text-sm">Retrieves all assets</p>
                          <p className="text-xs text-muted-foreground mt-1">Parameters: category, status, location</p>
                          
                          <p className="font-medium mt-2">GET /api/assets/:id</p>
                          <p className="text-sm">Retrieves a specific asset</p>
                          
                          <p className="font-medium mt-2">POST /api/assets</p>
                          <p className="text-sm">Creates a new asset</p>
                          <p className="text-xs text-muted-foreground mt-1">Required fields: name, category, status, purchaseDate, purchaseValue</p>
                          
                          <p className="font-medium mt-2">PUT /api/assets/:id</p>
                          <p className="text-sm">Updates an existing asset</p>
                          
                          <p className="font-medium mt-2">DELETE /api/assets/:id</p>
                          <p className="text-sm">Deletes an asset</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="procurement-api">
                        <AccordionTrigger>Procurement API</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="font-medium">GET /api/procurement/orders</p>
                          <p className="text-sm">Retrieves all purchase orders</p>
                          <p className="text-xs text-muted-foreground mt-1">Parameters: status, supplier, dateRange</p>
                          
                          <p className="font-medium mt-2">GET /api/procurement/orders/:id</p>
                          <p className="text-sm">Retrieves a specific purchase order</p>
                          
                          <p className="font-medium mt-2">POST /api/procurement/orders</p>
                          <p className="text-sm">Creates a new purchase order</p>
                          <p className="text-xs text-muted-foreground mt-1">Required fields: supplier, items, department</p>
                          
                          <p className="font-medium mt-2">PUT /api/procurement/orders/:id</p>
                          <p className="text-sm">Updates an existing purchase order</p>
                          
                          <p className="font-medium mt-2">GET /api/procurement/suppliers</p>
                          <p className="text-sm">Retrieves all suppliers</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="auth-api">
                        <AccordionTrigger>Authentication API</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="font-medium">POST /api/auth/login</p>
                          <p className="text-sm">Authenticates a user and returns a token</p>
                          <p className="text-xs text-muted-foreground mt-1">Required fields: email, password</p>
                          
                          <p className="font-medium mt-2">POST /api/auth/logout</p>
                          <p className="text-sm">Logs out the current user</p>
                          
                          <p className="font-medium mt-2">GET /api/auth/me</p>
                          <p className="text-sm">Returns the current user's information</p>
                          
                          <p className="font-medium mt-2">POST /api/auth/refresh</p>
                          <p className="text-sm">Refreshes an authentication token</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <h3 className="text-lg font-medium mt-4">Authentication</h3>
                    <p>
                      All API requests (except login) require a valid JWT token to be included in the 
                      Authorization header using the Bearer scheme.
                    </p>
                    <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs mt-2">
                      Authorization: Bearer {"<token>"}
                    </pre>
                    
                    <h3 className="text-lg font-medium mt-4">Error Responses</h3>
                    <p>
                      All endpoints return standard HTTP status codes, along with a JSON object containing
                      error details when appropriate.
                    </p>
                    <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs mt-2">
                      {`{
  "error": true,
  "message": "Description of the error",
  "code": "ERROR_CODE"
}`}
                    </pre>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
