
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { companyInfo } from '@/config/systemConfig';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('user-guide');

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="System Documentation"
          description="Comprehensive guides and reference materials for system usage"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-guide">User Guide</TabsTrigger>
            <TabsTrigger value="admin-guide">Admin Guide</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Guide</CardTitle>
                <CardDescription>Step-by-step instructions for everyday users</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold">Introduction</h3>
                      <p className="mt-2 text-muted-foreground">
                        Welcome to the {companyInfo.name} Management System. This user guide will help you navigate and use the system efficiently.
                      </p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Getting Started</h3>
                      <p className="mt-2 text-muted-foreground">
                        To begin using the system, log in with your credentials. The dashboard provides an overview of key metrics and notifications.
                      </p>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Login</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Navigate to the login page</li>
                          <li>Enter your email and password</li>
                          <li>Click "Sign In" to access the system</li>
                        </ol>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Dashboard Navigation</h4>
                        <p className="text-muted-foreground">
                          The sidebar contains links to all major sections. The top navigation bar includes notifications and user settings.
                        </p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Inventory Management</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Viewing Inventory</h4>
                        <p className="text-muted-foreground">
                          Navigate to the Inventory section to view all items. Use tabs to see different views including low stock alerts.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Adding Items</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Click the "Add Item" button</li>
                          <li>Fill in all required details</li>
                          <li>Click "Save" to add the item to inventory</li>
                        </ol>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Adjusting Stock</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Find the item in the inventory list</li>
                          <li>Click on it to view details</li>
                          <li>Click "Adjust Stock" button</li>
                          <li>Enter the quantity adjustment and reason</li>
                          <li>Submit the form to record the change</li>
                        </ol>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Assets Management</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Checking Out Assets</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Navigate to the Assets page</li>
                          <li>Find the asset you wish to check out</li>
                          <li>Click the "Check Out" button</li>
                          <li>Fill in the required information including assignee</li>
                          <li>Submit the form to record the checkout</li>
                        </ol>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Checking In Assets</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Go to the "Checked Out" tab in the Assets page</li>
                          <li>Find the asset to be returned</li>
                          <li>Click "Check In" button</li>
                          <li>Record the condition of the returned asset</li>
                          <li>Submit to complete the check-in process</li>
                        </ol>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Procurement</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Creating Purchase Orders</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Go to the Procurement page</li>
                          <li>Click "New Purchase Order" button</li>
                          <li>Select the vendor and items to order</li>
                          <li>Specify quantities and other details</li>
                          <li>Submit for approval</li>
                        </ol>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Local Purchase Orders</h4>
                        <p className="text-muted-foreground">
                          LPOs are used for local vendors. The process is similar to regular purchase orders, but with simplified approval.
                        </p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Reports</h3>
                      <p className="mt-2 text-muted-foreground">
                        Access reports to view important metrics and analysis. Download or print reports as needed.
                      </p>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin-guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Administrator Guide</CardTitle>
                <CardDescription>Instructions for system administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold">User Management</h3>
                      <p className="mt-2 text-muted-foreground">
                        As an administrator, you can manage user accounts, roles, and permissions.
                      </p>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Adding New Users</h4>
                        <ol className="ml-5 list-decimal text-muted-foreground">
                          <li>Navigate to the Users page</li>
                          <li>Click "Add User" button</li>
                          <li>Fill in the user's details</li>
                          <li>Assign appropriate role and department</li>
                          <li>Save to create the account</li>
                        </ol>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Managing Roles</h4>
                        <p className="text-muted-foreground">
                          Different roles have different permissions. Assign roles according to job responsibilities.
                        </p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">System Configuration</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Changing Hotel Information</h4>
                        <p className="text-muted-foreground">
                          To update hotel information, modify the companyInfo object in the systemConfig.ts file.
                          This will update all references to the hotel name, address, and other details throughout the system.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Setting System Parameters</h4>
                        <p className="text-muted-foreground">
                          System parameters such as refresh rates, storage keys, and feature flags can be configured in the systemSettings object.
                        </p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Data Management</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Backup and Restore</h4>
                        <p className="text-muted-foreground">
                          Regularly backup system data to prevent loss. Restore from backups when needed.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Data Cleanup</h4>
                        <p className="text-muted-foreground">
                          Periodically archive old records to maintain system performance.
                        </p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Security</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Access Control</h4>
                        <p className="text-muted-foreground">
                          Monitor user activities and ensure proper access controls are maintained.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Session Management</h4>
                        <p className="text-muted-foreground">
                          Review active sessions and force logout if necessary.
                        </p>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reference" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reference Guide</CardTitle>
                <CardDescription>Technical reference and specifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold">System Architecture</h3>
                      <p className="mt-2 text-muted-foreground">
                        The system uses a modern web architecture with React frontend and secure data storage.
                      </p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Data Models</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Inventory</h4>
                        <p className="text-muted-foreground">
                          Inventory items include name, category, quantity, location, minimum stock levels, and valuation.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Assets</h4>
                        <p className="text-muted-foreground">
                          Assets include type, value, condition, location, and checkout history.
                        </p>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Users</h4>
                        <p className="text-muted-foreground">
                          User records include personal information, role, department, and access rights.
                        </p>
                      </div>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">API Reference</h3>
                      <p className="mt-2 text-muted-foreground">
                        Internal APIs used for data management and operations.
                      </p>
                    </section>
                    
                    <section>
                      <h3 className="text-lg font-semibold">Troubleshooting</h3>
                      
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Common Issues</h4>
                        <ul className="ml-5 list-disc text-muted-foreground">
                          <li>If data doesn't refresh, try manually refreshing the page</li>
                          <li>For synchronization issues, ensure all users are on the latest version</li>
                          <li>If items aren't displaying correctly, check filter settings</li>
                        </ul>
                      </div>
                    </section>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Documentation;
