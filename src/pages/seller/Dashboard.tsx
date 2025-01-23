import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Badge not used
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Eye
} from 'lucide-react';

export default function SellerDashboard() {
  const { seller } = useAuthStore();
  const { getSellerAnalytics } = useOrderStore();
  const { getProductsBySeller } = useProductStore();
  
  const [analytics, setAnalytics] = useState<any>(null);
  
  useEffect(() => {
    if (seller) {
      setAnalytics(getSellerAnalytics(seller.id));
    }
  }, [seller]);

  const products = seller ? getProductsBySeller(seller.id) : [];
  
  const stats = [
    {
      title: 'Total Revenue',
      value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: analytics?.totalOrders || 0,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
    },
    {
      title: 'Products',
      value: products.length,
      change: products.length > 0 ? '+2' : '0',
      trend: 'up',
      icon: Package,
    },
    {
      title: 'Avg Order Value',
      value: `$${(analytics?.averageOrderValue || 0).toFixed(2)}`,
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
    },
  ];

  const recentOrders = analytics?.salesData?.slice(-5) || [];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            Welcome back, {seller?.storeName}!
          </h1>
          <p className="text-[#666666]">
            Here's what's happening with your store today.
          </p>
        </div>
        <Link to="/seller/products/add">
          <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#666666]">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#1a1a1a] mt-1">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-[#f27a2a]/10 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[#f27a2a]" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-[#666666]">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sales</CardTitle>
            <Link to="/seller/orders">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-lg">
                    <div>
                      <p className="font-medium text-[#1a1a1a]">{order.date}</p>
                      <p className="text-sm text-[#666666]">{order.orders} orders</p>
                    </div>
                    <p className="font-bold text-[#f27a2a]">${order.sales.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#666666]">No sales yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Products</CardTitle>
            <Link to="/seller/products">
              <Button variant="ghost" size="sm">Manage</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1a1a1a] truncate">{product.name}</p>
                      <div className="flex items-center gap-2 text-sm text-[#666666]">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {product.rating} ({product.reviewCount})
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#f27a2a]">${product.price.toFixed(2)}</p>
                      <p className="text-xs text-[#666666]">{product.soldCount} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#666666] mb-4">No products yet</p>
                <Link to="/seller/products/add">
                  <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                    Add Your First Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link to="/seller/products/add">
              <Button variant="outline" className="gap-2">
                <Package className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
            <Link to="/seller/orders">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                View Orders
              </Button>
            </Link>
            <Link to="/seller/analytics">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Button>
            </Link>
            <Link to={`/shop`}>
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                View Store
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
