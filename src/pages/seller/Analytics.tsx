import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const COLORS = ['#f27a2a', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function SellerAnalytics() {
  const { seller } = useAuthStore();
  const { getSellerAnalytics } = useOrderStore();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    if (seller) {
      setAnalytics(getSellerAnalytics(seller.id));
    }
  }, [seller]);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-[#666666]">Loading analytics...</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders,
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
    },
    {
      title: 'Avg Order Value',
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      change: '+5.3%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: Users,
    },
  ];

  // Format sales data for chart
  const salesData = analytics.salesData?.map((d: any) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: d.sales,
    orders: d.orders,
  })) || [];

  // Mock category data
  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Fashion', value: 25 },
    { name: 'Home', value: 20 },
    { name: 'Sports', value: 15 },
    { name: 'Other', value: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Analytics</h1>
        <p className="text-[#666666]">Track your store performance and sales</p>
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

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666666"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666666"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#f27a2a" 
                  strokeWidth={2}
                  dot={{ fill: '#f27a2a', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#666666"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666666"
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((cat, index) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-[#666666]">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
