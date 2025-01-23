import { useEffect, useState } from 'react';
import { useAdminStore } from '@/store/adminStore';
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
  Line
} from 'recharts';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { fetchPlatformStats } = useAdminStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchPlatformStats().then(setStats);
  }, []);

  const platformStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+15%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Total Sellers',
      value: stats?.totalSellers || 0,
      change: '+8%',
      trend: 'up',
      icon: Store,
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      change: '+23%',
      trend: 'up',
      icon: Package,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: '+12%',
      trend: 'up',
      icon: ShoppingCart,
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Pending Sellers',
      value: stats?.pendingSellers || 0,
      change: 'Action needed',
      trend: 'neutral',
      icon: Store,
    },
  ];

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 35000 },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 500 },
    { month: 'Feb', users: 650 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1000 },
    { month: 'May', users: 1250 },
    { month: 'Jun', users: 1500 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>
        <p className="text-[#666666]">Platform overview and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformStats.map((stat, index) => (
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
                ) : stat.trend === 'down' ? (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                ) : null}
                <span className={`text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 
                  stat.trend === 'down' ? 'text-red-500' : 'text-amber-500'
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                  <YAxis 
                    stroke="#666666" 
                    fontSize={12}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill="#f27a2a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                  <YAxis stroke="#666666" fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: '8px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      {stats?.pendingSellers > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Store className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Pending Seller Applications</h3>
                  <p className="text-amber-700">
                    {stats.pendingSellers} seller{stats.pendingSellers > 1 ? 's' : ''} waiting for approval
                  </p>
                </div>
              </div>
              <a href="/admin/sellers">
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  Review Applications
                </button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
