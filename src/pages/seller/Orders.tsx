import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// Select components not used
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function SellerOrders() {
  const { seller } = useAuthStore();
  const { fetchOrdersBySeller, updateOrderStatus } = useOrderStore();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const orders = seller ? fetchOrdersBySeller(seller.id) : [];

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus as any);
    if (success) {
      toast.success(`Order status updated to ${newStatus}`);
    } else {
      toast.error('Failed to update order status');
    }
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const flow = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = flow.indexOf(currentStatus);
    if (currentIndex === -1) return [];
    return flow.slice(currentIndex + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Orders</h1>
        <p className="text-[#666666]">Manage and fulfill customer orders</p>
      </div>

      {/* Orders List */}
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = statusIcons[order.status];
            const isExpanded = expandedOrder === order.id;
            const sellerItems = order.items.filter(item => item.sellerId === seller?.id);
            const sellerTotal = sellerItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            
            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div 
                    className="bg-[#f9f9f9] px-6 py-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-[#666666] uppercase">Order ID</p>
                        <p className="font-medium text-[#1a1a1a]">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#666666] uppercase">Date</p>
                        <p className="font-medium text-[#1a1a1a]">
                          {order.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#666666] uppercase">Your Total</p>
                        <p className="font-medium text-[#f27a2a]">${sellerTotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${statusColors[order.status]} capitalize`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#666666]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#666666]" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {sellerItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-[#1a1a1a]">{item.name}</h4>
                              <p className="text-sm text-[#666666]">
                                Qty: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-medium text-[#1a1a1a]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Status Update */}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="border-t pt-4">
                          <p className="text-sm text-[#666666] mb-2">Update Status:</p>
                          <div className="flex gap-2">
                            {getAvailableStatuses(order.status).map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(order.id, status)}
                              >
                                Mark as {status}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.trackingNumber && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-[#999999]" />
            </div>
            <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">No orders yet</h3>
            <p className="text-[#666666]">Orders will appear here when customers purchase your products.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
