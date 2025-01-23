import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function SellerSettings() {
  const { seller, updateSellerProfile } = useAuthStore();
  
  const [storeData, setStoreData] = useState({
    storeName: seller?.storeName || '',
    storeDescription: seller?.storeDescription || '',
    storeLogo: seller?.storeLogo || '',
    storeBanner: seller?.storeBanner || '',
    commissionRate: seller?.commissionRate || 0.10,
  });

  const [payoutData, setPayoutData] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
  });

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile(storeData);
    toast.success('Store settings updated!');
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Payout settings saved!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Settings</h1>
        <p className="text-[#666666]">Manage your store settings and preferences</p>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="w-full">
          <TabsTrigger value="store" className="flex-1">Store</TabsTrigger>
          <TabsTrigger value="payout" className="flex-1">Payout</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStoreSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeData.storeName}
                    onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    value={storeData.storeDescription}
                    onChange={(e) => setStoreData({ ...storeData, storeDescription: e.target.value })}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="storeLogo">Store Logo URL</Label>
                  <Input
                    id="storeLogo"
                    value={storeData.storeLogo}
                    onChange={(e) => setStoreData({ ...storeData, storeLogo: e.target.value })}
                    placeholder="https://..."
                  />
                  {storeData.storeLogo && (
                    <img 
                      src={storeData.storeLogo} 
                      alt="Store Logo Preview" 
                      className="mt-2 w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="storeBanner">Store Banner URL</Label>
                  <Input
                    id="storeBanner"
                    value={storeData.storeBanner}
                    onChange={(e) => setStoreData({ ...storeData, storeBanner: e.target.value })}
                    placeholder="https://..."
                  />
                  {storeData.storeBanner && (
                    <img 
                      src={storeData.storeBanner} 
                      alt="Store Banner Preview" 
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <Button type="submit" className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayoutSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={payoutData.bankName}
                    onChange={(e) => setPayoutData({ ...payoutData, bankName: e.target.value })}
                    placeholder="e.g., Chase Bank"
                  />
                </div>

                <div>
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountName"
                    value={payoutData.accountName}
                    onChange={(e) => setPayoutData({ ...payoutData, accountName: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="password"
                    value={payoutData.accountNumber}
                    onChange={(e) => setPayoutData({ ...payoutData, accountNumber: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    value={payoutData.routingNumber}
                    onChange={(e) => setPayoutData({ ...payoutData, routingNumber: e.target.value })}
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700">
                    <strong>Note:</strong> Payouts are processed weekly. Minimum payout amount is $25.
                  </p>
                </div>

                <Button type="submit" className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                  Save Payout Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'New Order Notifications', desc: 'Get notified when you receive a new order' },
                  { label: 'Order Status Updates', desc: 'Get notified when order status changes' },
                  { label: 'Low Stock Alerts', desc: 'Get notified when product inventory is low' },
                  { label: 'Review Notifications', desc: 'Get notified when someone reviews your product' },
                  { label: 'Weekly Sales Report', desc: 'Receive weekly sales summary via email' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-4 bg-[#f9f9f9] rounded-lg">
                    <div>
                      <p className="font-medium text-[#1a1a1a]">{item.label}</p>
                      <p className="text-sm text-[#666666]">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 mt-1" />
                  </div>
                ))}
              </div>

              <Button 
                className="mt-6 bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                onClick={() => toast.success('Notification preferences saved!')}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
