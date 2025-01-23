import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }
    });
    
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 
          className="text-3xl font-bold text-[#1a1a1a] mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          My Profile
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-[#f27a2a] text-white text-2xl">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#f27a2a] text-white rounded-full flex items-center justify-center hover:bg-[#e06d1f] transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-[#1a1a1a]">{user?.name}</h2>
                <p className="text-[#666666]">{user?.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#f27a2a]/10 text-[#f27a2a] rounded-full text-sm capitalize">
                  {user?.role}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-[#666666]">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="flex items-center gap-3 text-[#666666]">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  {user?.address && (
                    <div className="flex items-center gap-3 text-[#666666]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {user.address.city}, {user.address.state}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="profile">
              <TabsList className="w-full">
                <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled
                            className="bg-[#f9f9f9]"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-medium text-[#1a1a1a] mb-4">Address</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                              id="street"
                              value={formData.street}
                              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            />
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="state">State</Label>
                              <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode">ZIP Code</Label>
                              <Input
                                id="zipCode"
                                value={formData.zipCode}
                                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <Button 
                        type="button" 
                        className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                        onClick={() => toast.success('Password updated!')}
                      >
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
