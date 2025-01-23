import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Store,
  ChevronRight,
  LogOut,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SellerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { seller, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Orders', path: '/seller/orders', icon: ShoppingBag },
    { name: 'Analytics', path: '/seller/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/seller/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/seller') {
      return location.pathname === '/seller';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Seller Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#f27a2a] rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[#1a1a1a] hidden sm:block" style={{ fontFamily: 'Playfair Display, serif' }}>
                  MarketPlace
                </span>
              </Link>
              <div className="h-6 w-px bg-[#e5e5e5] hidden sm:block" />
              <span className="text-sm text-[#666666] hidden sm:block">Seller Center</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {seller?.storeLogo && (
                  <img 
                    src={seller.storeLogo} 
                    alt={seller.storeName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-[#1a1a1a]">{seller?.storeName}</p>
                  <p className="text-xs text-[#666666]">{seller?.isVerified ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-[#f27a2a] text-white'
                          : 'text-[#444444] hover:bg-[#f9f9f9] hover:text-[#f27a2a]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                      {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Link to="/seller/products/add">
                  <Button className="w-full bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Link 
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#444444] hover:bg-[#f9f9f9] hover:text-[#f27a2a] transition-all"
                >
                  <Store className="w-5 h-5" />
                  <span className="font-medium">Back to Store</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
