import { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
// Button not used
import { Input } from '@/components/ui/input';
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
  Search
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

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders
    .filter(o => 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(o => statusFilter === 'all' || o.status === statusFilter);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const success = await updateOrderStatus(orderId, newStatus as any);
    if (success) {
      toast.success(`Order status updated to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Orders</h1>
          <p className="text-[#666666]">Manage all platform orders</p>
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders..."
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9f9f9]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Items</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Total</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-[#666666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <tr key={order.id} className="border-t">
                      <td className="p-4 font-medium text-[#1a1a1a]">{order.id}</td>
                      <td className="p-4 text-[#666666]">
                        {order.createdAt.toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className="text-[#666666]">{order.items.length} items</span>
                      </td>
                      <td className="p-4 font-medium text-[#f27a2a]">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <Badge className={`${statusColors[order.status]} capitalize`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {order.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
