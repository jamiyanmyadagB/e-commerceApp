import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, CheckCircle, XCircle, Store, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSellers() {
  const { sellers, pendingSellers, fetchAllSellers, approveSeller, rejectSeller } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    fetchAllSellers();
  }, []);

  // Using allSellers for search - will be implemented
  const allSellers = [...sellers, ...pendingSellers];
  void allSellers; // Mark as used

  const handleApprove = async () => {
    if (selectedSeller) {
      const success = await approveSeller(selectedSeller.id);
      if (success) {
        toast.success('Seller approved successfully');
        setShowApproveDialog(false);
        setSelectedSeller(null);
      }
    }
  };

  const handleReject = async () => {
    if (selectedSeller) {
      const success = await rejectSeller(selectedSeller.id);
      if (success) {
        toast.success('Seller application rejected');
        setShowRejectDialog(false);
        setSelectedSeller(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Sellers</h1>
          <p className="text-[#666666]">Manage seller applications and accounts</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sellers..."
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Pending Applications */}
      {pendingSellers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Pending Applications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {pendingSellers.map((seller) => (
              <Card key={seller.id} className="border-amber-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#f27a2a]/10 rounded-lg flex items-center justify-center">
                        <Store className="w-7 h-7 text-[#f27a2a]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a1a]">{seller.storeName}</h3>
                        <p className="text-sm text-[#666666]">{seller.storeDescription}</p>
                        <p className="text-xs text-[#999999] mt-1">
                          Applied: {new Date(seller.joinedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowRejectDialog(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="flex-1 bg-[#f27a2a] hover:bg-[#e06d1f] text-white"
                      onClick={() => {
                        setSelectedSeller(seller);
                        setShowApproveDialog(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approved Sellers */}
      <div>
        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Approved Sellers</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller) => (
            <Card key={seller.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={seller.storeLogo || `https://ui-avatars.com/api/?name=${seller.storeName}&background=f27a2a&color=fff`}
                    alt={seller.storeName}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-[#1a1a1a]">{seller.storeName}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {seller.isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-medium">{seller.rating}</span>
                    </div>
                    <p className="text-xs text-[#666666]">Rating</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{seller.totalSales}</p>
                    <p className="text-xs text-[#666666]">Sales</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{(seller.commissionRate * 100).toFixed(0)}%</p>
                    <p className="text-xs text-[#666666]">Commission</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Seller Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedSeller?.storeName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Seller Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedSeller?.storeName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} variant="destructive">
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
