import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { companyInfo, userRoles, hotelDepartments } from '@/config/systemConfig';

const Documentation = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="System Documentation"
          description="User guide and reference materials for hotel inventory management system"
        />

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
            <TabsTrigger value="assets">Asset Management</TabsTrigger>
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="config">System Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>
                  Comprehensive hotel inventory and asset management system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">About the System</h3>
                <p>
                  This comprehensive hotel management system is designed to streamline inventory and asset management
                  across all departments of a hotel or resort. The system provides real-time tracking of inventory levels,
                  asset status, and procurement processes to ensure efficient operations.
                </p>
                
                <h3 className="text-lg font-semibold">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Real-time inventory tracking with low stock alerts</li>
                  <li>Asset management with check-in/check-out functionality</li>
                  <li>Procurement management with Local Purchase Orders</li>
                  <li>Request management across departments</li>
                  <li>Comprehensive reporting system</li>
                  <li>User management with role-based access control</li>
                  <li>Multi-user support with real-time data synchronization</li>
                </ul>
                
                <h3 className="text-lg font-semibold">System Architecture</h3>
                <p>
                  The system uses a modern web-based architecture with a responsive user interface.
                  Data is stored locally with synchronization across multiple devices for real-time 
                  updates. The system can be customized for any hotel or resort by simply updating 
                  the configuration settings.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Roles & Permissions</CardTitle>
                <CardDescription>
                  User roles and associated permissions in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    <p>
                      The system implements role-based access control to ensure that users can only access
                      the features and data relevant to their job responsibilities. The following roles are 
                      available in the system:
                    </p>
                    
                    {Object.entries(userRoles).map(([key, role]) => (
                      <div key={key} className="border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">{role.label}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {role.description || 'No description available'}
                        </p>
                        <h4 className="font-medium mt-2">Permissions:</h4>
                        <ul className="list-disc pl-5 mt-1">
                          {role.canManageUsers && <li>Manage users and permissions</li>}
                          {role.canApproveRequests && <li>Approve requests</li>}
                          {role.canViewReports && <li>View reports</li>}
                          {role.canManageSettings && <li>Manage system settings</li>}
                          {role.canManageInventory && <li>Manage inventory</li>}
                          {role.canManageAssets && <li>Manage assets</li>}
                          {role.canManageSuppliers && <li>Manage suppliers</li>}
                          {(role as any).canCreatePurchaseOrders && <li>Create purchase orders</li>}
                          {(role as any).canManageKitchenInventory && <li>Manage kitchen inventory</li>}
                        </ul>
                      </div>
                    ))}
                    
                    <h3 className="text-lg font-semibold">Departments</h3>
                    <p>The system supports the following departments:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {hotelDepartments.map(department => (
                        <div key={department} className="border p-2 rounded-md">
                          {department}
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>
                  How to manage hotel inventory efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Adding Inventory Items</h3>
                <p>
                  Navigate to the Inventory page and click the "Add Item" button. Fill in all required information including:
                </p>
                <ul className="list-disc pl-5">
                  <li>Item name and category</li>
                  <li>Quantity and unit of measurement</li>
                  <li>Minimum stock level for low stock alerts</li>
                  <li>Location within the hotel</li>
                  <li>Current value</li>
                  <li>Expiry date (if applicable)</li>
                </ul>
                
                <h3 className="text-lg font-semibold">Managing Stock Levels</h3>
                <p>
                  When stock levels need to be adjusted, select the item and click "Adjust Stock." You can:
                </p>
                <ul className="list-disc pl-5">
                  <li>Record receipt of new inventory</li>
                  <li>Record usage of existing inventory</li>
                  <li>Make manual adjustments with explanatory notes</li>
                  <li>Record expired inventory</li>
                </ul>
                
                <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
                <p>
                  The system automatically flags items that have fallen below their minimum stock level. 
                  These items appear in the "Low Stock" tab and are highlighted throughout the system.
                </p>
                
                <h3 className="text-lg font-semibold">Expiry Tracking</h3>
                <p>
                  For items with expiry dates, the system automatically tracks approaching expiration.
                  When new stock is added with a different expiry date, the system intelligently manages
                  the expiry tracking based on stock levels and usage patterns, ensuring that older stock
                  is used first.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  How to customize the system for different hotels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">Hotel Information</h3>
                <p>
                  To customize the system for different hotels, edit the companyInfo object in the 
                  <code className="bg-muted px-1 rounded">src/config/systemConfig.ts</code> file:
                </p>
                <pre className="bg-muted p-2 rounded overflow-x-auto">
{`export const companyInfo = {
  name: "Luxury Hotel & Resorts",
  address: "123 Beachfront Avenue",
  city: "Paradise Bay",
  state: "Tropical State",
  zipCode: "12345",
  country: "Island Nation",
  phone: "+1 (555) 123-4567",
  email: "info@luxuryhotel.example",
  website: "www.luxuryhotel.example",
  // ... other properties
};`}
                </pre>
                <p>
                  This information is used throughout the system, including on reports, receipts, and the dashboard.
                </p>
                
                <h3 className="text-lg font-semibold">System Settings</h3>
                <p>
                  The <code className="bg-muted px-1 rounded">systemSettings</code> object in the same file contains
                  various configuration options like refresh intervals, feature flags, and default values:
                </p>
                <pre className="bg-muted p-2 rounded overflow-x-auto">
{`export const systemSettings = {
  dataRefreshInterval: 5000, // 5 seconds
  // ... other settings
};`}
                </pre>
                
                <h3 className="text-lg font-semibold">Role Customization</h3>
                <p>
                  The <code className="bg-muted px-1 rounded">userRoles</code> object can be modified to add, remove, or adjust
                  roles and their permissions to match the hotel's organizational structure.
                </p>
                
                <h3 className="text-lg font-semibold">Department Customization</h3>
                <p>
                  The <code className="bg-muted px-1 rounded">hotelDepartments</code> array can be updated to reflect the
                  specific departments in the hotel.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Placeholder tabs - these would be filled out in a complete documentation */}
          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Management</CardTitle>
                <CardDescription>Documentation for asset management features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section contains documentation for managing hotel assets, including equipment,
                  furniture, electronics, and other fixed assets.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="procurement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Procurement</CardTitle>
                <CardDescription>Documentation for procurement features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section contains documentation for procurement processes, including creating
                  purchase orders, managing suppliers, and tracking deliveries.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Requests</CardTitle>
                <CardDescription>Documentation for request management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section contains documentation for managing requests across departments,
                  including approval workflows and fulfillment processes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Documentation for reporting features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This section contains documentation for generating and interpreting various
                  reports within the system.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Documentation;
