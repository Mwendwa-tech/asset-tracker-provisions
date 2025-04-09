
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, FileText, ClipboardList, TruckIcon, Building } from 'lucide-react';
import { LocalPurchaseOrder } from '@/components/procurement/LocalPurchaseOrder';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { userRoles } from '@/config/systemConfig';
import { useAuth } from '@/context/AuthContext';

const Procurement = () => {
  const [activeTab, setActiveTab] = useState('lpo');
  const { user } = useAuth();
  
  // Fixed the role comparison logic to work with the existing User type
  const isProcurementOfficer = user?.role === 'generalManager' || 
                               user?.role === 'departmentHead' ||
                               user?.role === 'fbManager';  // Using fbManager which exists in the User type
  
  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Procurement Management"
          description="Manage purchase orders, suppliers, and procurement activities"
          actions={
            <Button disabled={!isProcurementOfficer}>
              <Plus className="mr-2 h-4 w-4" /> New Purchase Order
            </Button>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="lpo">
              <FileText className="h-4 w-4 mr-2" /> Local Purchase Orders
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ClipboardList className="h-4 w-4 mr-2" /> All Orders
            </TabsTrigger>
            <TabsTrigger value="vendors">
              <Building className="h-4 w-4 mr-2" /> Vendors
            </TabsTrigger>
            <TabsTrigger value="deliveries">
              <TruckIcon className="h-4 w-4 mr-2" /> Deliveries
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lpo" className="space-y-4">
            <LocalPurchaseOrder />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <DashboardCard title="Purchase Orders">
              <p className="text-muted-foreground">This section will list all purchase orders with filtering and search capabilities.</p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="vendors" className="space-y-4">
            <DashboardCard title="Vendors">
              <p className="text-muted-foreground">This section will allow management of vendor information and contacts.</p>
            </DashboardCard>
          </TabsContent>
          
          <TabsContent value="deliveries" className="space-y-4">
            <DashboardCard title="Deliveries">
              <p className="text-muted-foreground">This section will track incoming deliveries and their status.</p>
            </DashboardCard>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Procurement;
