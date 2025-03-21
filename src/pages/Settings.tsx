
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/theme-provider';
import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

const Settings = () => {
  const { setTheme } = useTheme();
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Settings"
          description="Configure your application preferences"
          actions={
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          }
        />

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Lukenya Getaway" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="Lukenya, Kenya" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">System Options</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when items fall below minimum stock levels
                      </p>
                    </div>
                    <Switch id="low-stock-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-reorder">Auto Reorder</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically create purchase orders for low stock items
                      </p>
                    </div>
                    <Switch id="auto-reorder" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive important notifications via email
                      </p>
                    </div>
                    <Switch id="email-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-alerts">SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive urgent notifications via SMS
                      </p>
                    </div>
                    <Switch id="sms-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="browser-notifications">Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Show desktop notifications while using the application
                      </p>
                    </div>
                    <Switch id="browser-notifications" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>
                  Manage your data backup and restoration options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Backup Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a backup of your current inventory and asset data
                  </p>
                  <Button variant="outline">Export Backup File</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Restore Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore your data from a previous backup
                  </p>
                  <div className="flex items-center gap-2">
                    <Input type="file" />
                    <Button variant="outline">Upload & Restore</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setTheme("light")}
                      >
                        Light
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setTheme("dark")}
                      >
                        Dark
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setTheme("system")}
                      >
                        System
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Date Format</Label>
                    <div className="flex gap-2">
                      <Button 
                        variant={dateFormat === "DD/MM/YYYY" ? "default" : "outline"} 
                        className="flex-1"
                        onClick={() => setDateFormat("DD/MM/YYYY")}
                      >
                        DD/MM/YYYY
                      </Button>
                      <Button 
                        variant={dateFormat === "MM/DD/YYYY" ? "default" : "outline"} 
                        className="flex-1"
                        onClick={() => setDateFormat("MM/DD/YYYY")}
                      >
                        MM/DD/YYYY
                      </Button>
                      <Button 
                        variant={dateFormat === "YYYY-MM-DD" ? "default" : "outline"} 
                        className="flex-1"
                        onClick={() => setDateFormat("YYYY-MM-DD")}
                      >
                        YYYY-MM-DD
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Date Format Preview</Label>
                    <DatePicker 
                      selectedDate={selectedDate}
                      onSelect={setSelectedDate}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedDate && new Intl.DateTimeFormat('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        ...(dateFormat === "DD/MM/YYYY" && { dateStyle: 'short' }),
                        ...(dateFormat === "YYYY-MM-DD" && { dateStyle: 'medium' })
                      }).format(selectedDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Apply Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
