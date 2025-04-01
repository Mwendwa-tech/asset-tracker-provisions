
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Phone, Mail, MapPin, Package, Settings } from 'lucide-react';
import { Supplier, SupplierProduct } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSuppliers } from '@/hooks/useSuppliers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/formatters";

const Suppliers = () => {
  const { 
    suppliers, 
    loading, 
    addSupplier, 
    updateSupplier, 
    deleteSupplier,
    addProduct,
    updateProduct,
    deleteProduct
  } = useSuppliers();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [dialogMode, setDialogMode] = useState<'supplier' | 'product'>('supplier');
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);
  const [activeTab, setActiveTab] = useState("suppliers");

  const supplierForm = useForm<Omit<Supplier, 'id' | 'products'>>({
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      categories: []
    }
  });

  const productForm = useForm<Omit<SupplierProduct, 'id'>>({
    defaultValues: {
      name: '',
      category: '',
      unitPrice: 0,
      unit: '',
      minOrderQuantity: 1,
      leadTime: 1,
      autoReorder: false,
      reorderThreshold: 5
    }
  });

  const supplierColumns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Supplier,
      cell: (item: Supplier) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-muted-foreground">{item.contactPerson}</div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Contact",
      accessorKey: "email" as keyof Supplier,
      cell: (item: Supplier) => (
        <div>
          <div className="flex items-center text-sm">
            <Mail className="h-3 w-3 mr-1" /> {item.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="h-3 w-3 mr-1" /> {item.phone}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: "Address",
      accessorKey: "address" as keyof Supplier,
      cell: (item: Supplier) => (
        <div className="flex items-center">
          <MapPin className="h-3 w-3 mr-1" /> {item.address}
        </div>
      ),
      sortable: true,
    },
    {
      header: "Products",
      accessorKey: "products" as keyof Supplier,
      cell: (item: Supplier) => (
        <div>
          <span className="font-medium">{item.products?.length || 0}</span>
          <span className="text-muted-foreground"> products</span>
        </div>
      ),
      sortable: false,
    },
    {
      header: "Categories",
      accessorKey: "categories" as keyof Supplier,
      cell: (item: Supplier) => (
        <div className="flex flex-wrap gap-1">
          {item.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      ),
      sortable: false,
    },
  ];

  const productColumns = [
    {
      header: "Product Name",
      accessorKey: "name" as keyof SupplierProduct,
      cell: (item: SupplierProduct) => (
        <div className="font-medium">{item.name}</div>
      ),
      sortable: true,
    },
    {
      header: "Category",
      accessorKey: "category" as keyof SupplierProduct,
      cell: (item: SupplierProduct) => (
        <Badge variant="outline">{item.category}</Badge>
      ),
      sortable: true,
    },
    {
      header: "Price",
      accessorKey: "unitPrice" as keyof SupplierProduct,
      cell: (item: SupplierProduct) => (
        <div>{formatCurrency(item.unitPrice)} per {item.unit}</div>
      ),
      sortable: true,
    },
    {
      header: "Auto-Reorder",
      accessorKey: "autoReorder" as keyof SupplierProduct,
      cell: (item: SupplierProduct) => (
        <div className="flex items-center">
          <div className={`h-2 w-2 rounded-full mr-2 ${item.autoReorder ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          {item.autoReorder ? 
            <span>Yes (Threshold: {item.reorderThreshold})</span> : 
            <span>No</span>
          }
        </div>
      ),
      sortable: true,
    },
    {
      header: "Lead Time",
      accessorKey: "leadTime" as keyof SupplierProduct,
      cell: (item: SupplierProduct) => (
        <div>{item.leadTime} days</div>
      ),
      sortable: true,
    },
  ];

  const rowActions = [
    {
      label: "Edit",
      onClick: (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        supplierForm.reset({
          name: supplier.name,
          contactPerson: supplier.contactPerson,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          categories: supplier.categories
        });
        setDialogMode('supplier');
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Manage Products",
      onClick: (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setActiveTab("products");
      },
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (supplier: Supplier) => {
        if (window.confirm(`Are you sure you want to delete ${supplier.name}?`)) {
          deleteSupplier(supplier.id);
        }
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  const productActions = (supplierId: string) => [
    {
      label: "Edit",
      onClick: (product: SupplierProduct) => {
        setSelectedSupplier(suppliers.find(s => s.id === supplierId) || null);
        setSelectedProduct(product);
        productForm.reset({
          name: product.name,
          category: product.category,
          unitPrice: product.unitPrice,
          unit: product.unit,
          minOrderQuantity: product.minOrderQuantity,
          leadTime: product.leadTime,
          autoReorder: product.autoReorder,
          reorderThreshold: product.reorderThreshold
        });
        setDialogMode('product');
        setDialogOpen(true);
      },
      icon: <Edit className="h-4 w-4" />,
    },
    {
      label: "Delete",
      onClick: (product: SupplierProduct) => {
        if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
          deleteProduct(supplierId, product.id);
        }
      },
      icon: <Trash className="h-4 w-4" />,
    },
  ];

  const handleRowClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setActiveTab("details");
  };

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    supplierForm.reset({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      categories: []
    });
    setDialogMode('supplier');
    setDialogOpen(true);
  };

  const handleAddProduct = (supplierId: string) => {
    setSelectedSupplier(suppliers.find(s => s.id === supplierId) || null);
    setSelectedProduct(null);
    productForm.reset({
      name: '',
      category: '',
      unitPrice: 0,
      unit: '',
      minOrderQuantity: 1,
      leadTime: 1,
      autoReorder: false,
      reorderThreshold: 5
    });
    setDialogMode('product');
    setDialogOpen(true);
  };

  const handleSupplierSubmit = supplierForm.handleSubmit((data) => {
    const formData = {
      ...data,
      categories: data.categories.filter(Boolean) // Remove empty categories
    };

    if (selectedSupplier) {
      updateSupplier(selectedSupplier.id, formData);
    } else {
      addSupplier(formData);
    }
    setDialogOpen(false);
  });

  const handleProductSubmit = productForm.handleSubmit((data) => {
    if (!selectedSupplier) return;

    if (selectedProduct) {
      updateProduct(selectedSupplier.id, selectedProduct.id, data);
    } else {
      addProduct(selectedSupplier.id, data);
    }
    setDialogOpen(false);
  });

  const handleCategoryChange = (value: string, index: number) => {
    const currentCategories = supplierForm.getValues().categories || [];
    const newCategories = [...currentCategories];
    newCategories[index] = value;
    supplierForm.setValue('categories', newCategories);
  };

  const addCategory = () => {
    const currentCategories = supplierForm.getValues().categories || [];
    supplierForm.setValue('categories', [...currentCategories, '']);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Suppliers"
          description="Manage your suppliers and their products"
          actions={
            activeTab === "suppliers" ? (
              <Button onClick={handleAddSupplier}>
                <Plus className="mr-2 h-4 w-4" /> Add Supplier
              </Button>
            ) : selectedSupplier && activeTab === "products" ? (
              <Button onClick={() => handleAddProduct(selectedSupplier.id)}>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            ) : null
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">All Suppliers</TabsTrigger>
            {selectedSupplier && (
              <>
                <TabsTrigger value="details">{selectedSupplier.name} Details</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="suppliers">
            <DataTable
              data={suppliers}
              columns={supplierColumns}
              onRowClick={handleRowClick}
              rowActions={rowActions}
              searchable
              searchKeys={["name", "contactPerson", "email", "address", "categories"]}
            />
          </TabsContent>
          
          {selectedSupplier && (
            <>
              <TabsContent value="details">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Supplier Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                          <dd className="text-lg font-semibold">{selectedSupplier.name}</dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Contact Person</dt>
                          <dd>{selectedSupplier.contactPerson}</dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                          <dd className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            {selectedSupplier.email}
                          </dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                          <dd className="flex items-center">
                            <Phone className="mr-2 h-4 w-4" />
                            {selectedSupplier.phone}
                          </dd>
                        </div>
                        
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                          <dd className="flex items-start">
                            <MapPin className="mr-2 h-4 w-4 mt-1" />
                            {selectedSupplier.address}
                          </dd>
                        </div>
                      </dl>
                      
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          className="mr-2"
                          onClick={() => {
                            supplierForm.reset({
                              name: selectedSupplier.name,
                              contactPerson: selectedSupplier.contactPerson,
                              email: selectedSupplier.email,
                              phone: selectedSupplier.phone,
                              address: selectedSupplier.address,
                              categories: selectedSupplier.categories
                            });
                            setDialogMode('supplier');
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </Button>
                        
                        <Button
                          onClick={() => {
                            setActiveTab("products");
                          }}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          View Products
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedSupplier.categories.length > 0 ? (
                          selectedSupplier.categories.map((category, index) => (
                            <Badge key={index} className="px-3 py-1 text-sm">
                              {category}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No categories defined</p>
                        )}
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Products Summary</h4>
                        <div className="flex items-center justify-between">
                          <span>Total Products</span>
                          <Badge variant="secondary" className="ml-auto">
                            {selectedSupplier.products?.length || 0}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="products">
                <DataTable
                  data={selectedSupplier.products || []}
                  columns={productColumns}
                  rowActions={productActions(selectedSupplier.id)}
                  searchable
                  searchKeys={["name", "category"]}
                />
              </TabsContent>
            </>
          )}
        </Tabs>

        {/* Supplier Form Dialog */}
        <Dialog open={dialogOpen && dialogMode === 'supplier'} onOpenChange={(open) => {
          if (!open) setDialogOpen(false);
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
              <DialogDescription>
                {selectedSupplier ? 'Update supplier information' : 'Enter new supplier details'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSupplierSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input 
                  id="name" 
                  {...supplierForm.register('name', { required: true })}
                  placeholder="Company name"
                />
                {supplierForm.formState.errors.name && (
                  <p className="text-sm text-red-600">Name is required</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input 
                  id="contactPerson" 
                  {...supplierForm.register('contactPerson')}
                  placeholder="Primary contact name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    {...supplierForm.register('email')}
                    placeholder="contact@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    {...supplierForm.register('phone')}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  {...supplierForm.register('address')}
                  placeholder="123 Main St, City, State"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Categories</Label>
                <div className="space-y-2">
                  {supplierForm.watch('categories', []).map((category, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value, index)}
                        placeholder="Category name"
                      />
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                    Add Category
                  </Button>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  )}
                  {selectedSupplier ? 'Save Changes' : 'Add Supplier'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Product Form Dialog */}
        <Dialog open={dialogOpen && dialogMode === 'product'} onOpenChange={(open) => {
          if (!open) setDialogOpen(false);
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
                {selectedSupplier && (
                  <span className="text-sm font-normal text-muted-foreground block mt-1">
                    Supplier: {selectedSupplier.name}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input 
                  id="productName" 
                  {...productForm.register('name', { required: true })}
                  placeholder="Product name"
                />
                {productForm.formState.errors.name && (
                  <p className="text-sm text-red-600">Product name is required</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productCategory">Category</Label>
                <Input 
                  id="productCategory" 
                  {...productForm.register('category', { required: true })}
                  placeholder="Product category"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input 
                    id="unitPrice" 
                    type="number"
                    step="0.01"
                    {...productForm.register('unitPrice', { 
                      required: true,
                      valueAsNumber: true
                    })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input 
                    id="unit" 
                    {...productForm.register('unit', { required: true })}
                    placeholder="kg, liter, piece, etc."
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoReorder">Auto-Reorder</Label>
                  <Switch 
                    id="autoReorder" 
                    checked={productForm.watch('autoReorder')}
                    onCheckedChange={(checked) => productForm.setValue('autoReorder', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically create reorder alerts when stock falls below threshold
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reorderThreshold">Reorder Threshold</Label>
                  <Input 
                    id="reorderThreshold" 
                    type="number"
                    {...productForm.register('reorderThreshold', { 
                      required: true,
                      valueAsNumber: true,
                      min: 1
                    })}
                    placeholder="5"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                  <Input 
                    id="minOrderQuantity" 
                    type="number"
                    {...productForm.register('minOrderQuantity', { 
                      required: true,
                      valueAsNumber: true,
                      min: 1
                    })}
                    placeholder="1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="leadTime">Lead Time (days)</Label>
                <Input 
                  id="leadTime" 
                  type="number"
                  {...productForm.register('leadTime', { 
                    required: true,
                    valueAsNumber: true,
                    min: 1
                  })}
                  placeholder="3"
                />
                <p className="text-xs text-muted-foreground">
                  Average time from order to delivery
                </p>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  )}
                  {selectedProduct ? 'Save Changes' : 'Add Product'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Suppliers;
