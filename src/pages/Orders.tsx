import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronRight
} from 'lucide-react';

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: XCircle,
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function Orders() {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const userOrders = orders
    .filter(o => o.userId === user?.id)
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="min-h-screen bg-[#f9f9f9] py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 
            className="text-3xl font-bold text-[#1a1a1a]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            My Orders
          </h1>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#999999]" />
              </div>
              <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">No orders found</h3>
              <p className="text-[#666666] mb-4">
                {statusFilter === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `No ${statusFilter} orders found.`}
              </p>
              <Link to="/shop">
                <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const StatusIcon = statusIcons[order.status];
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Order Header */}
                    <div className="bg-[#f9f9f9] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
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
                          <p className="text-xs text-[#666666] uppercase">Total</p>
                          <p className="font-medium text-[#f27a2a]">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <Badge className={`${statusColors[order.status]} capitalize`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
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

                      {/* Actions */}
                      <div className="mt-6 pt-4 border-t flex items-center justify-between">
                        <div>
                          {order.trackingNumber && (
                            <p className="text-sm text-[#666666]">
                              Tracking: <span className="font-medium">{order.trackingNumber}</span>
                            </p>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
